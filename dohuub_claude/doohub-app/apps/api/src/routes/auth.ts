import { Router } from 'express';
import { prisma } from '@doohub/database';
import { generateTokens } from '../utils/jwt';
import { createOtp, verifyOtp, sendOtpEmail } from '../utils/otp';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Register with email - creates user and returns token directly (OTP disabled)
router.post('/register', async (req, res) => {
  try {
    const { email, profile } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists. Please login instead.' });
    }

    // Create user directly (no OTP)
    const user = await prisma.user.create({
      data: {
        email,
        isEmailVerified: true,
        profile: profile ? {
          create: {
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
          },
        } : {
          create: {
            firstName: '',
            lastName: '',
          },
        },
      },
      include: { profile: true },
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
          isEmailVerified: user.isEmailVerified,
        },
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

// Login with email - returns token directly (OTP disabled)
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true, vendor: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    // Generate tokens directly (no OTP)
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
          isEmailVerified: user.isEmailVerified,
          vendorId: user.vendor?.id,
        },
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Verify OTP - completes registration or login
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, isRegistration, profile } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // DEV MODE: Skip OTP verification with code "000000"
    const isDev = process.env.NODE_ENV !== 'production';
    const isDevBypass = isDev && otp === '000000';
    
    // Verify OTP (skip in dev mode with bypass code)
    const isValid = isDevBypass || await verifyOtp(email, otp);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    // If registration, create new user
    if (isRegistration && !user) {
      user = await prisma.user.create({
        data: {
          email,
          isEmailVerified: true,
          profile: profile ? {
            create: {
              firstName: profile.firstName || '',
              lastName: profile.lastName || '',
            },
          } : undefined,
        },
        include: { profile: true },
      });
    } else if (!user) {
      return res.status(404).json({ error: 'User not found' });
    } else {
      // Update email verification status
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
        include: { profile: true },
      });
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
          isEmailVerified: user.isEmailVerified,
        },
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const otp = await createOtp(email);
    await sendOtpEmail(email, otp);

    res.json({
      success: true,
      message: 'OTP resent to your email',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
});

// Google Sign-In (simplified - would need Firebase Admin SDK in production)
router.post('/google-signin', async (req, res) => {
  try {
    const { email, displayName, photoURL, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      // Parse display name
      const nameParts = (displayName || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      user = await prisma.user.create({
        data: {
          email,
          firebaseUid: googleId,
          isEmailVerified: true,
          profile: {
            create: {
              firstName,
              lastName,
              avatar: photoURL,
            },
          },
        },
        include: { profile: true },
      });
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
          isEmailVerified: user.isEmailVerified,
        },
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error('Google sign-in error:', error);
    res.status(500).json({ error: 'Failed to sign in with Google' });
  }
});

// Logout
router.post('/logout', authenticate, async (req: AuthRequest, res) => {
  // In a full implementation, you would invalidate the token
  // by adding it to a blacklist or using refresh token rotation
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// DEV ONLY: Direct login without OTP (for testing)
// TODO: Re-enable production check before real launch
router.post('/dev-login', async (req, res) => {
  // Temporarily disabled for testing
  // if (process.env.NODE_ENV === 'production') {
  //   return res.status(403).json({ error: 'Not available in production' });
  // }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
          isEmailVerified: user.isEmailVerified,
        },
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error('Dev login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// ========================================
// VENDOR-SPECIFIC AUTH ROUTES
// ========================================

// Send OTP for vendor registration/login
router.post('/vendor/send-otp', async (req, res) => {
  try {
    const { email, phone, isRegistration = false } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone is required' });
    }

    const identifier = email || phone;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: email ? { email } : { phone },
      include: { vendor: true },
    });

    if (isRegistration && existingUser?.vendor) {
      return res.status(400).json({ error: 'Vendor account already exists. Please login instead.' });
    }

    if (!isRegistration && !existingUser) {
      return res.status(404).json({ error: 'Vendor account not found. Please register first.' });
    }

    // Generate and send OTP
    const otp = await createOtp(identifier);

    // In production, send via email or SMS
    if (email) {
      await sendOtpEmail(email, otp);
    }
    // TODO: Add SMS sending for phone

    res.json({
      success: true,
      message: `OTP sent to ${email ? 'email' : 'phone'}`,
      // DEV ONLY: Include OTP in response for testing
      ...(process.env.NODE_ENV !== 'production' && { devOtp: otp }),
    });
  } catch (error) {
    console.error('Vendor send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP for vendor registration/login
router.post('/vendor/verify-otp', async (req, res) => {
  try {
    const { email, phone, otp, isRegistration = false, businessName, profile } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone is required' });
    }

    if (!otp) {
      return res.status(400).json({ error: 'OTP is required' });
    }

    const identifier = email || phone;

    // DEV MODE: Skip OTP verification with code "000000"
    const isDev = process.env.NODE_ENV !== 'production';
    const isDevBypass = isDev && otp === '000000';

    // Verify OTP (skip in dev mode with bypass code)
    const isValid = isDevBypass || await verifyOtp(identifier, otp);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    let user = await prisma.user.findFirst({
      where: email ? { email } : { phone },
      include: { profile: true, vendor: true },
    });

    // If registration, create new user and vendor profile
    if (isRegistration) {
      if (user?.vendor) {
        return res.status(400).json({ error: 'Vendor account already exists' });
      }

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            email: email || undefined,
            phone: phone || undefined,
            role: 'VENDOR',
            isEmailVerified: !!email,
            isPhoneVerified: !!phone,
            profile: profile ? {
              create: {
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
              },
            } : {
              create: {
                firstName: '',
                lastName: '',
              },
            },
            vendor: {
              create: {
                businessName: businessName || 'My Business',
                status: 'PENDING',
              },
            },
          },
          include: { profile: true, vendor: true },
        });
      } else {
        // Upgrade existing user to vendor
        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: 'VENDOR',
            ...(email && { isEmailVerified: true }),
            ...(phone && { isPhoneVerified: true }),
          },
        });

        await prisma.vendor.create({
          data: {
            userId: user.id,
            businessName: businessName || 'My Business',
            status: 'PENDING',
          },
        });

        user = await prisma.user.findUnique({
          where: { id: user.id },
          include: { profile: true, vendor: true },
        });
      }
    } else {
      // Login flow
      if (!user) {
        return res.status(404).json({ error: 'Vendor account not found' });
      }

      if (!user.vendor) {
        return res.status(403).json({ error: 'Not a vendor account. Please use customer login.' });
      }

      // Update verification status
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(email && { isEmailVerified: true }),
          ...(phone && { isPhoneVerified: true }),
        },
      });
    }

    if (!user) {
      return res.status(500).json({ error: 'Failed to create or find user' });
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email || '',
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profile: user.profile,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          vendorId: user.vendor?.id,
          vendor: user.vendor,
        },
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error('Vendor verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Google Sign-In for vendors
router.post('/vendor/google', async (req, res) => {
  try {
    const { email, displayName, photoURL, googleId, isRegistration = false, businessName } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true, vendor: true },
    });

    if (isRegistration) {
      if (user?.vendor) {
        return res.status(400).json({ error: 'Vendor account already exists. Please login instead.' });
      }

      // Parse display name
      const nameParts = (displayName || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      if (!user) {
        // Create new user as vendor
        user = await prisma.user.create({
          data: {
            email,
            firebaseUid: googleId,
            role: 'VENDOR',
            isEmailVerified: true,
            profile: {
              create: {
                firstName,
                lastName,
                avatar: photoURL,
              },
            },
            vendor: {
              create: {
                businessName: businessName || `${firstName}'s Business`,
                status: 'PENDING',
              },
            },
          },
          include: { profile: true, vendor: true },
        });
      } else {
        // Upgrade existing user to vendor
        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: 'VENDOR',
            firebaseUid: googleId || user.firebaseUid,
          },
        });

        await prisma.vendor.create({
          data: {
            userId: user.id,
            businessName: businessName || `${user.profile?.firstName || 'My'}'s Business`,
            status: 'PENDING',
          },
        });

        user = await prisma.user.findUnique({
          where: { id: user.id },
          include: { profile: true, vendor: true },
        });
      }
    } else {
      // Login flow
      if (!user) {
        return res.status(404).json({ error: 'Vendor account not found. Please register first.' });
      }

      if (!user.vendor) {
        return res.status(403).json({ error: 'Not a vendor account. Please use customer login.' });
      }
    }

    if (!user) {
      return res.status(500).json({ error: 'Failed to process request' });
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email || '',
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
          isEmailVerified: user.isEmailVerified,
          vendorId: user.vendor?.id,
          vendor: user.vendor,
        },
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error('Vendor Google sign-in error:', error);
    res.status(500).json({ error: 'Failed to sign in with Google' });
  }
});

// Get current vendor profile
router.get('/vendor/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        profile: true,
        addresses: true,
        vendor: {
          include: {
            stores: {
              include: {
                regions: {
                  include: { region: true },
                },
              },
            },
            _count: {
              select: {
                cleaningListings: true,
                handymanListings: true,
                beautyListings: true,
                groceryListings: true,
                rentalListings: true,
                foodListings: true,
                beautyProductListings: true,
                rideAssistanceListings: true,
                companionshipListings: true,
                bookings: true,
                orders: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.vendor) {
      return res.status(403).json({ error: 'Not a vendor account' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile,
        addresses: user.addresses,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        vendor: user.vendor,
      },
    });
  } catch (error) {
    console.error('Get vendor me error:', error);
    res.status(500).json({ error: 'Failed to get vendor profile' });
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        profile: true,
        addresses: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile,
        addresses: user.addresses,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;

