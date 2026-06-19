import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { supabase as supabaseAdmin } from '../utils/supabase';

const router = Router();

// Get all users (admin only)
router.get('/', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { role, search, page = '1', limit = '50' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (role) {
      where.role = role;
    }
    
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { profile: { firstName: { contains: search as string, mode: 'insensitive' } } },
        { profile: { lastName: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        profile: true,
        _count: {
          select: {
            bookings: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    const total = await prisma.user.count({ where });

    res.json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Update user status (admin only) - block/unblock
router.put('/:id/status', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
      include: { profile: true },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Get current user profile (must be before /:id to avoid conflict)
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        profile: true,
        addresses: true,
        vendor: {
          include: {
            categories: true,
            serviceAreas: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user profile
router.put('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        phone,
        profile: {
          upsert: {
            create: { firstName, lastName, avatar },
            update: { firstName, lastName, avatar },
          },
        },
      },
      include: { profile: true },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user account.
//
// We anonymize PII immediately (Apple App Store + GDPR) and mark the account
// inactive. Bookings, orders, and reviews keep their userId so financial /
// review history stays intact, but the identifying data is gone. Cascades on
// the schema clean up profile/addresses/etc. The caller must confirm by
// sending { confirm: "DELETE" } in the body so accidental DELETEs from a
// stolen-session attacker have at least one extra hop.
//
// We also remove the Supabase auth row so the deleted account can never
// sign in again with the old credentials — without that the user is just
// anonymized inside our DB but auth still works.
router.delete('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const { confirm } = req.body as { confirm?: string };
    if (confirm !== 'DELETE') {
      return res.status(400).json({ error: 'Confirmation required: send { "confirm": "DELETE" }' });
    }

    const userId = req.user!.id;
    const anonEmail = `deleted-${userId}@deleted.local`;

    await prisma.$transaction([
      // Drop session/device data + payment instruments. These never have
      // outbound FK references.
      prisma.paymentMethod.deleteMany({ where: { userId } }),
      prisma.pushToken.deleteMany({ where: { userId } }),
      prisma.notification.deleteMany({ where: { userId } }),
      // Addresses can't be hard-deleted: any past Booking holds an FK to the
      // address (required, non-nullable). Anonymize PII in place instead so
      // historical bookings keep their relations intact.
      prisma.address.updateMany({
        where: { userId },
        data: {
          label: 'Deleted',
          street: '[deleted]',
          apartment: null,
          city: '[deleted]',
          state: '[deleted]',
          zipCode: '[deleted]',
          latitude: null,
          longitude: null,
          isDefault: false,
        },
      }),
      // Clear profile name + avatar but keep the row so FK references survive.
      prisma.userProfile.updateMany({
        where: { userId },
        data: { firstName: 'Deleted', lastName: 'User', avatar: null, dateOfBirth: null },
      }),
      // Anonymize the user row itself and mark inactive.
      prisma.user.update({
        where: { id: userId },
        data: {
          email: anonEmail,
          phone: null,
          firebaseUid: null,
          passwordHash: null,
          stripeCustomerId: null,
          isActive: false,
          status: 'SUSPENDED',
        },
      }),
    ]);

    // Sever the auth.users row so the old credentials can't sign in again.
    // Best-effort: if Supabase service-role isn't configured locally we still
    // want the public-DB anonymization to commit. The next sign-in attempt
    // would fail at the API-side status check, but better to also kill the
    // auth row.
    if (supabaseAdmin) {
      try {
        await supabaseAdmin.auth.admin.deleteUser(userId);
      } catch (e) {
        console.error('[delete /users/me] failed to remove auth.users row:', e);
      }
    }

    res.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Get user by ID (admin only) - must be after /me
router.get('/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        addresses: true,
        bookings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            vendor: { select: { businessName: true } },
          },
        },
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;

