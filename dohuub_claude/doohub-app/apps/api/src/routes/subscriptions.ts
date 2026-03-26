import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Subscription plans (could be moved to database)
const SUBSCRIPTION_PLANS = [
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
    isPopular: false,
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
    isPopular: true,
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
    listingsLimit: -1, // unlimited
    storesLimit: -1, // unlimited
    isPopular: false,
  },
];

// Helper to get plan from stripeSubscriptionId (stores planId for now)
const getPlanFromSubscription = (stripeSubscriptionId: string | null) => {
  if (!stripeSubscriptionId) return SUBSCRIPTION_PLANS[0]; // Default to basic
  // In production, stripeSubscriptionId would be actual Stripe ID
  // For now, we store planId in this field
  return SUBSCRIPTION_PLANS.find(p => p.id === stripeSubscriptionId) || SUBSCRIPTION_PLANS[0];
};

// Get available subscription plans
router.get('/plans', async (req, res) => {
  try {
    res.json({
      success: true,
      data: SUBSCRIPTION_PLANS,
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to get subscription plans' });
  }
});

// Get current vendor subscription
router.get('/current', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: {
        subscription: true,
      },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    if (!vendor.subscription) {
      return res.json({
        success: true,
        data: null,
        message: 'No active subscription',
      });
    }

    // Get plan details from stripeSubscriptionId (stores planId)
    const plan = getPlanFromSubscription(vendor.subscription.stripeSubscriptionId);

    res.json({
      success: true,
      data: {
        ...vendor.subscription,
        plan,
      },
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// Create subscription (initial signup)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ error: 'planId is required' });
    }

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: { subscription: true },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    if (vendor.subscription) {
      return res.status(400).json({ error: 'Subscription already exists. Use change-plan endpoint.' });
    }

    // Calculate dates
    const now = new Date();
    const currentPeriodEnd = new Date(now);
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    // Create subscription - store planId in stripeSubscriptionId for now
    // In production, this would be the actual Stripe subscription ID
    const subscription = await prisma.vendorSubscription.create({
      data: {
        vendorId: vendor.id,
        stripeSubscriptionId: planId, // Store planId here temporarily
        status: 'TRIAL',
        currentPeriodStart: now,
        currentPeriodEnd,
      },
    });

    // Also update vendor's trial dates
    await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        subscriptionStatus: 'TRIAL',
        trialStartedAt: now,
        trialEndsAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...subscription,
        plan,
      },
      message: 'Subscription created successfully. Trial period ends in 14 days.',
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Change subscription plan
router.put('/change-plan', authenticate, async (req: AuthRequest, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ error: 'planId is required' });
    }

    const newPlan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!newPlan) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: { subscription: true },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    if (!vendor.subscription) {
      return res.status(400).json({ error: 'No subscription found. Create one first.' });
    }

    const currentPlan = getPlanFromSubscription(vendor.subscription.stripeSubscriptionId);
    const isUpgrade = newPlan.price > (currentPlan?.price || 0);

    // Update subscription - store new planId in stripeSubscriptionId
    const subscription = await prisma.vendorSubscription.update({
      where: { id: vendor.subscription.id },
      data: {
        stripeSubscriptionId: planId,
      },
    });

    res.json({
      success: true,
      data: {
        ...subscription,
        plan: newPlan,
        previousPlan: currentPlan,
        isUpgrade,
      },
      message: isUpgrade
        ? 'Plan upgraded successfully. New features are now available.'
        : 'Plan changed successfully. Changes take effect at next billing cycle.',
    });
  } catch (error) {
    console.error('Change plan error:', error);
    res.status(500).json({ error: 'Failed to change plan' });
  }
});

// Update payment method
router.put('/payment-method', authenticate, async (req: AuthRequest, res) => {
  try {
    const { paymentMethodId, cardLast4, cardBrand, cardExpMonth, cardExpYear } = req.body;

    if (!paymentMethodId) {
      return res.status(400).json({ error: 'paymentMethodId is required' });
    }

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: { subscription: true },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    if (!vendor.subscription) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    // In production, update payment method in Stripe
    // For now, we just acknowledge the update
    res.json({
      success: true,
      data: {
        ...vendor.subscription,
        paymentMethod: {
          id: paymentMethodId,
          last4: cardLast4,
          brand: cardBrand,
          expMonth: cardExpMonth,
          expYear: cardExpYear,
        },
      },
      message: 'Payment method updated successfully',
    });
  } catch (error) {
    console.error('Update payment method error:', error);
    res.status(500).json({ error: 'Failed to update payment method' });
  }
});

// Cancel subscription
router.post('/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    const { reason } = req.body;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: { subscription: true },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    if (!vendor.subscription) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    if (vendor.subscription.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Subscription already cancelled' });
    }

    // Update subscription status
    const subscription = await prisma.vendorSubscription.update({
      where: { id: vendor.subscription.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    // Update vendor subscription status
    await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        subscriptionStatus: 'CANCELLED',
      },
    });

    // Log cancellation reason (in production, store in a separate table)
    if (reason) {
      console.log(`Subscription cancelled for vendor ${vendor.id}. Reason: ${reason}`);
    }

    res.json({
      success: true,
      data: subscription,
      message: `Subscription cancelled. You'll have access until ${subscription.currentPeriodEnd?.toLocaleDateString()}.`,
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Reactivate cancelled subscription
router.post('/reactivate', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: { subscription: true },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    if (!vendor.subscription) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    if (vendor.subscription.status !== 'CANCELLED') {
      return res.status(400).json({ error: 'Subscription is not cancelled' });
    }

    // Check if still within grace period
    const now = new Date();
    if (vendor.subscription.currentPeriodEnd && vendor.subscription.currentPeriodEnd < now) {
      return res.status(400).json({
        error: 'Grace period expired. Please create a new subscription.',
      });
    }

    // Reactivate subscription
    const subscription = await prisma.vendorSubscription.update({
      where: { id: vendor.subscription.id },
      data: {
        status: 'ACTIVE',
        cancelledAt: null,
      },
    });

    // Update vendor subscription status
    await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        subscriptionStatus: 'ACTIVE',
      },
    });

    const plan = getPlanFromSubscription(subscription.stripeSubscriptionId);

    res.json({
      success: true,
      data: {
        ...subscription,
        plan,
      },
      message: 'Subscription reactivated successfully',
    });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    res.status(500).json({ error: 'Failed to reactivate subscription' });
  }
});

// Get subscription usage/limits
router.get('/usage', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: { subscription: true },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    // Count current usage
    const [storesCount, listingsCount] = await Promise.all([
      prisma.vendorStore.count({ where: { vendorId: vendor.id } }),
      Promise.all([
        prisma.cleaningListing.count({ where: { vendorId: vendor.id } }),
        prisma.handymanListing.count({ where: { vendorId: vendor.id } }),
        prisma.beautyListing.count({ where: { vendorId: vendor.id } }),
        prisma.groceryListing.count({ where: { vendorId: vendor.id } }),
        prisma.rentalListing.count({ where: { vendorId: vendor.id } }),
        prisma.foodListing.count({ where: { vendorId: vendor.id } }),
        prisma.beautyProductListing.count({ where: { vendorId: vendor.id } }),
        prisma.rideAssistanceListing.count({ where: { vendorId: vendor.id } }),
        prisma.companionshipListing.count({ where: { vendorId: vendor.id } }),
      ]).then(counts => counts.reduce((a, b) => a + b, 0)),
    ]);

    // Get plan limits
    const plan = vendor.subscription
      ? getPlanFromSubscription(vendor.subscription.stripeSubscriptionId)
      : SUBSCRIPTION_PLANS[0]; // Default to basic

    const storesLimit = plan?.storesLimit || 1;
    const listingsLimit = plan?.listingsLimit || 10;

    res.json({
      success: true,
      data: {
        stores: {
          used: storesCount,
          limit: storesLimit === -1 ? 'Unlimited' : storesLimit,
          remaining: storesLimit === -1 ? 'Unlimited' : Math.max(0, storesLimit - storesCount),
          percentUsed: storesLimit === -1 ? 0 : Math.round((storesCount / storesLimit) * 100),
        },
        listings: {
          used: listingsCount,
          limit: listingsLimit === -1 ? 'Unlimited' : listingsLimit,
          remaining: listingsLimit === -1 ? 'Unlimited' : Math.max(0, listingsLimit - listingsCount),
          percentUsed: listingsLimit === -1 ? 0 : Math.round((listingsCount / listingsLimit) * 100),
        },
        plan: plan?.name || 'Basic',
        canCreateStore: storesLimit === -1 || storesCount < storesLimit,
        canCreateListing: listingsLimit === -1 || listingsCount < listingsLimit,
      },
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({ error: 'Failed to get usage' });
  }
});

export default router;
