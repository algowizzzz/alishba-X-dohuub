import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

// ========================================
// VENDOR SETTINGS
// ========================================

// Get vendor settings
router.get('/vendor', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        profile: true,
        vendor: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.vendor) {
      return res.status(403).json({ error: 'Not a vendor account' });
    }

    // Get notification preferences (could be stored in a separate table)
    // For now, return default values
    const notificationPreferences = {
      emailNotifications: true,
      pushNotifications: true,
      orderUpdates: true,
      bookingReminders: true,
      promotionalEmails: false,
      weeklyDigest: true,
    };

    // Get privacy settings
    const privacySettings = {
      showProfilePublicly: true,
      showContactInfo: false,
      allowReviews: true,
      showBusinessAddress: true,
    };

    res.json({
      success: true,
      data: {
        profile: {
          firstName: user.profile?.firstName || '',
          lastName: user.profile?.lastName || '',
          email: user.email,
          phone: user.phone,
          avatar: user.profile?.avatar,
        },
        business: {
          businessName: user.vendor.businessName,
          description: user.vendor.description,
          logo: user.vendor.logo,
          phone: user.vendor.contactPhone,
          website: user.vendor.website,
        },
        notifications: notificationPreferences,
        privacy: privacySettings,
        account: {
          emailVerified: user.isEmailVerified,
          phoneVerified: user.isPhoneVerified,
          twoFactorEnabled: false, // Placeholder
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get vendor settings error:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// Update vendor settings (general)
router.put('/vendor', authenticate, async (req: AuthRequest, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      avatar,
      businessName,
      description,
      logo,
      businessPhone,
      website,
    } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { vendor: true },
    });

    if (!user || !user.vendor) {
      return res.status(403).json({ error: 'Vendor account not found' });
    }

    // Update in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user profile
      if (firstName !== undefined || lastName !== undefined || avatar !== undefined) {
        await tx.userProfile.updateMany({
          where: { userId: user.id },
          data: {
            ...(firstName !== undefined && { firstName }),
            ...(lastName !== undefined && { lastName }),
            ...(avatar !== undefined && { avatar }),
          },
        });
      }

      // Update user phone
      if (phone !== undefined) {
        await tx.user.update({
          where: { id: user.id },
          data: { phone },
        });
      }

      // Update vendor info
      if (businessName !== undefined || description !== undefined || logo !== undefined || businessPhone !== undefined || website !== undefined) {
        await tx.vendor.update({
          where: { id: user.vendor!.id },
          data: {
            ...(businessName !== undefined && { businessName }),
            ...(description !== undefined && { description }),
            ...(logo !== undefined && { logo }),
            ...(businessPhone !== undefined && { phone: businessPhone }),
            ...(website !== undefined && { website }),
          },
        });
      }

      return tx.user.findUnique({
        where: { id: user.id },
        include: { profile: true, vendor: true },
      });
    });

    res.json({
      success: true,
      data: result,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Update vendor settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Update notification preferences
router.put('/vendor/notifications', authenticate, async (req: AuthRequest, res) => {
  try {
    const {
      emailNotifications,
      pushNotifications,
      orderUpdates,
      bookingReminders,
      promotionalEmails,
      weeklyDigest,
    } = req.body;

    // In production, store these in a UserPreferences table
    // For now, just acknowledge the update

    const preferences = {
      emailNotifications: emailNotifications ?? true,
      pushNotifications: pushNotifications ?? true,
      orderUpdates: orderUpdates ?? true,
      bookingReminders: bookingReminders ?? true,
      promotionalEmails: promotionalEmails ?? false,
      weeklyDigest: weeklyDigest ?? true,
    };

    res.json({
      success: true,
      data: preferences,
      message: 'Notification preferences updated',
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
});

// Update privacy settings
router.put('/vendor/privacy', authenticate, async (req: AuthRequest, res) => {
  try {
    const {
      showProfilePublicly,
      showContactInfo,
      allowReviews,
      showBusinessAddress,
    } = req.body;

    // In production, store these in a UserPreferences table
    // For now, just acknowledge the update

    const settings = {
      showProfilePublicly: showProfilePublicly ?? true,
      showContactInfo: showContactInfo ?? false,
      allowReviews: allowReviews ?? true,
      showBusinessAddress: showBusinessAddress ?? true,
    };

    res.json({
      success: true,
      data: settings,
      message: 'Privacy settings updated',
    });
  } catch (error) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({ error: 'Failed to update privacy settings' });
  }
});

// Change password
router.post('/vendor/password', authenticate, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If user has a password, verify it
    if (user.passwordHash) {
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Delete account request
router.post('/vendor/delete-account', authenticate, async (req: AuthRequest, res) => {
  try {
    const { reason, feedback } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { vendor: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In production, you might want to:
    // 1. Send confirmation email
    // 2. Start a grace period
    // 3. Queue for actual deletion

    // For now, soft delete by setting status
    if (user.vendor) {
      await prisma.vendor.update({
        where: { id: user.vendor.id },
        data: { status: 'SUSPENDED' },
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { status: 'SUSPENDED' },
    });

    res.json({
      success: true,
      message: 'Account deletion request submitted. Your account will be deleted within 30 days.',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to process deletion request' });
  }
});

// ========================================
// ADMIN PLATFORM SETTINGS
// ========================================

// Get platform settings
router.get('/admin', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    // In production, these would be stored in a PlatformSettings table
    const settings = {
      general: {
        platformName: 'DoHuub',
        supportEmail: 'support@dohuub.com',
        supportPhone: '+1 (555) 123-4567',
        timezone: 'America/New_York',
        currency: 'USD',
        language: 'en',
      },
      features: {
        allowVendorRegistration: true,
        allowCustomerRegistration: true,
        requireEmailVerification: true,
        requirePhoneVerification: false,
        enableReviews: true,
        enableChat: true,
        maintenanceMode: false,
      },
      payments: {
        stripeEnabled: true,
        paypalEnabled: false,
        platformFeePercent: 10,
        minimumPayout: 50,
        payoutSchedule: 'weekly',
      },
      notifications: {
        sendWelcomeEmail: true,
        sendOrderConfirmation: true,
        sendBookingReminders: true,
        reminderHoursBefore: 24,
      },
      limits: {
        maxImagesPerListing: 10,
        maxFileSizeMB: 5,
        maxListingsPerVendor: -1, // unlimited
        maxStoresPerVendor: -1, // unlimited
        trialPeriodDays: 14,
      },
    };

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Get platform settings error:', error);
    res.status(500).json({ error: 'Failed to get platform settings' });
  }
});

// Update platform settings
router.put('/admin', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { general, features, payments, notifications, limits } = req.body;

    // In production, validate and store these in a PlatformSettings table
    // For now, just acknowledge the update

    const updatedSettings = {
      general: {
        platformName: general?.platformName || 'DoHuub',
        supportEmail: general?.supportEmail || 'support@dohuub.com',
        supportPhone: general?.supportPhone || '+1 (555) 123-4567',
        timezone: general?.timezone || 'America/New_York',
        currency: general?.currency || 'USD',
        language: general?.language || 'en',
      },
      features: {
        allowVendorRegistration: features?.allowVendorRegistration ?? true,
        allowCustomerRegistration: features?.allowCustomerRegistration ?? true,
        requireEmailVerification: features?.requireEmailVerification ?? true,
        requirePhoneVerification: features?.requirePhoneVerification ?? false,
        enableReviews: features?.enableReviews ?? true,
        enableChat: features?.enableChat ?? true,
        maintenanceMode: features?.maintenanceMode ?? false,
      },
      payments: {
        stripeEnabled: payments?.stripeEnabled ?? true,
        paypalEnabled: payments?.paypalEnabled ?? false,
        platformFeePercent: payments?.platformFeePercent ?? 10,
        minimumPayout: payments?.minimumPayout ?? 50,
        payoutSchedule: payments?.payoutSchedule || 'weekly',
      },
      notifications: {
        sendWelcomeEmail: notifications?.sendWelcomeEmail ?? true,
        sendOrderConfirmation: notifications?.sendOrderConfirmation ?? true,
        sendBookingReminders: notifications?.sendBookingReminders ?? true,
        reminderHoursBefore: notifications?.reminderHoursBefore ?? 24,
      },
      limits: {
        maxImagesPerListing: limits?.maxImagesPerListing ?? 10,
        maxFileSizeMB: limits?.maxFileSizeMB ?? 5,
        maxListingsPerVendor: limits?.maxListingsPerVendor ?? -1,
        maxStoresPerVendor: limits?.maxStoresPerVendor ?? -1,
        trialPeriodDays: limits?.trialPeriodDays ?? 14,
      },
    };

    res.json({
      success: true,
      data: updatedSettings,
      message: 'Platform settings updated',
    });
  } catch (error) {
    console.error('Update platform settings error:', error);
    res.status(500).json({ error: 'Failed to update platform settings' });
  }
});

// Update email templates
router.post('/admin/email-templates', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { templateId, subject, body, variables } = req.body;

    if (!templateId || !subject || !body) {
      return res.status(400).json({ error: 'templateId, subject, and body are required' });
    }

    // Valid template IDs
    const validTemplates = [
      'welcome',
      'order-confirmation',
      'booking-confirmation',
      'booking-reminder',
      'password-reset',
      'account-verification',
      'payout-notification',
    ];

    if (!validTemplates.includes(templateId)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    // In production, store in EmailTemplate table
    // For now, acknowledge the update

    res.json({
      success: true,
      data: {
        templateId,
        subject,
        body,
        variables: variables || [],
        updatedAt: new Date().toISOString(),
      },
      message: 'Email template updated',
    });
  } catch (error) {
    console.error('Update email template error:', error);
    res.status(500).json({ error: 'Failed to update email template' });
  }
});

// Get email templates
router.get('/admin/email-templates', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    // Default email templates
    const templates = [
      {
        id: 'welcome',
        name: 'Welcome Email',
        subject: 'Welcome to DoHuub!',
        variables: ['{{firstName}}', '{{email}}'],
        description: 'Sent when a new user registers',
      },
      {
        id: 'order-confirmation',
        name: 'Order Confirmation',
        subject: 'Your Order #{{orderNumber}} is Confirmed',
        variables: ['{{firstName}}', '{{orderNumber}}', '{{total}}', '{{items}}'],
        description: 'Sent when an order is placed',
      },
      {
        id: 'booking-confirmation',
        name: 'Booking Confirmation',
        subject: 'Your Booking is Confirmed',
        variables: ['{{firstName}}', '{{bookingNumber}}', '{{date}}', '{{time}}', '{{service}}'],
        description: 'Sent when a booking is confirmed',
      },
      {
        id: 'booking-reminder',
        name: 'Booking Reminder',
        subject: 'Reminder: Your Booking is Tomorrow',
        variables: ['{{firstName}}', '{{bookingNumber}}', '{{date}}', '{{time}}', '{{service}}'],
        description: 'Sent 24 hours before a booking',
      },
      {
        id: 'password-reset',
        name: 'Password Reset',
        subject: 'Reset Your Password',
        variables: ['{{firstName}}', '{{resetLink}}'],
        description: 'Sent when password reset is requested',
      },
      {
        id: 'account-verification',
        name: 'Account Verification',
        subject: 'Verify Your Email Address',
        variables: ['{{firstName}}', '{{verificationCode}}'],
        description: 'Sent for email verification',
      },
      {
        id: 'payout-notification',
        name: 'Payout Notification',
        subject: 'Your Payout is on the Way',
        variables: ['{{vendorName}}', '{{amount}}', '{{payoutDate}}'],
        description: 'Sent when a payout is processed',
      },
    ];

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Get email templates error:', error);
    res.status(500).json({ error: 'Failed to get email templates' });
  }
});

// Get subscription plan settings
router.get('/admin/subscription-plans', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    // Return configurable subscription plans
    const plans = [
      {
        id: 'basic',
        name: 'Basic',
        price: 29.99,
        interval: 'month',
        features: [
          'Up to 10 listings',
          '1 store',
          'Basic analytics',
          'Email support',
        ],
        listingsLimit: 10,
        storesLimit: 1,
        isActive: true,
      },
      {
        id: 'professional',
        name: 'Professional',
        price: 79.99,
        interval: 'month',
        features: [
          'Up to 50 listings',
          '3 stores',
          'Advanced analytics',
          'Priority support',
          'Featured listings',
        ],
        listingsLimit: 50,
        storesLimit: 3,
        isActive: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 199.99,
        interval: 'month',
        features: [
          'Unlimited listings',
          'Unlimited stores',
          'Full analytics suite',
          '24/7 support',
          'Featured listings',
          'API access',
          'Custom branding',
        ],
        listingsLimit: -1,
        storesLimit: -1,
        isActive: true,
      },
    ];

    res.json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({ error: 'Failed to get subscription plans' });
  }
});

// Update subscription plan
router.put('/admin/subscription-plans/:planId', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { planId } = req.params;
    const { name, price, features, listingsLimit, storesLimit, isActive } = req.body;

    // In production, update in database
    // For now, acknowledge the update

    res.json({
      success: true,
      data: {
        id: planId,
        name: name || planId,
        price: price || 0,
        features: features || [],
        listingsLimit: listingsLimit ?? -1,
        storesLimit: storesLimit ?? -1,
        isActive: isActive ?? true,
        updatedAt: new Date().toISOString(),
      },
      message: 'Subscription plan updated',
    });
  } catch (error) {
    console.error('Update subscription plan error:', error);
    res.status(500).json({ error: 'Failed to update subscription plan' });
  }
});

export default router;
