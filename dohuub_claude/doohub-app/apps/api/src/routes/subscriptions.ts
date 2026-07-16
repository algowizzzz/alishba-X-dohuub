import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createWipayCheckout, wipayConfigured } from '../lib/wipay';
import {
  createPowertranzCheckout,
  powertranzConfigured,
} from '../lib/powertranz';
import {
  createCustomerPortalSession,
  createStripeCheckoutSession,
  stripeConfigured,
} from '../lib/stripe';
import { providerAvailable, prefixedReference } from './payments';
import { logger } from '../lib/logger';

const router = Router();

type Provider = 'WIPAY' | 'POWERTRANZ' | 'STRIPE';
type BillingPeriod = 'monthly' | 'yearly';

// Subscription plans. Prices are per-cycle in USD.
const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
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
    monthlyPrice: 79.99,
    yearlyPrice: 799.99,
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
    monthlyPrice: 199.99,
    yearlyPrice: 1999.99,
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
    isPopular: false,
  },
];

function findPlan(planId: string | null | undefined) {
  if (!planId) return SUBSCRIPTION_PLANS[0];
  return SUBSCRIPTION_PLANS.find((p) => p.id === planId) || SUBSCRIPTION_PLANS[0];
}

function planPrice(planId: string, billing: BillingPeriod): number {
  const p = findPlan(planId);
  return billing === 'yearly' ? p.yearlyPrice : p.monthlyPrice;
}

// Legacy shape the portal + mobile clients expect: a flat {price, interval}.
function planForClient(planId: string | null | undefined, billing: BillingPeriod = 'monthly') {
  const p = findPlan(planId);
  return {
    id: p.id,
    name: p.name,
    price: billing === 'yearly' ? p.yearlyPrice : p.monthlyPrice,
    interval: billing === 'yearly' ? 'year' : 'month',
    features: p.features,
    listingsLimit: p.listingsLimit,
    storesLimit: p.storesLimit,
    isPopular: p.isPopular,
  };
}

// ---------------------------------------------------------------------------
// GET /plans — public catalogue for the portal.
// ---------------------------------------------------------------------------
router.get('/plans', async (_req, res) => {
  res.json({
    success: true,
    data: SUBSCRIPTION_PLANS.map((p) => ({
      id: p.id,
      name: p.name,
      monthlyPrice: p.monthlyPrice,
      yearlyPrice: p.yearlyPrice,
      features: p.features,
      listingsLimit: p.listingsLimit,
      storesLimit: p.storesLimit,
      isPopular: p.isPopular,
    })),
  });
});

// ---------------------------------------------------------------------------
// GET /current — current vendor subscription.
// ---------------------------------------------------------------------------
router.get('/current', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: { subscription: true },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    if (!vendor.subscription) {
      return res.json({ success: true, data: null, message: 'No active subscription' });
    }

    const billing = (vendor.subscription.billingPeriod as BillingPeriod) || 'monthly';
    const plan = planForClient(vendor.subscription.planId, billing);

    res.json({
      success: true,
      data: {
        ...vendor.subscription,
        plan,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'get subscription failed');
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// ---------------------------------------------------------------------------
// POST / — initial signup. Creates a TRIAL subscription record for the plan
// but does NOT charge — trial is free for 14 days. Real activation happens
// via /checkout-session once the trial is over (or if the vendor pays early).
// ---------------------------------------------------------------------------
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { planId, billingPeriod } = req.body as {
      planId: string;
      billingPeriod?: BillingPeriod;
    };

    if (!planId) return res.status(400).json({ error: 'planId is required' });
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) return res.status(400).json({ error: 'Invalid plan' });

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: { subscription: true },
    });
    if (!vendor) return res.status(403).json({ error: 'Vendor profile not found' });

    if (vendor.subscription) {
      return res
        .status(400)
        .json({ error: 'Subscription already exists. Use /change-plan.' });
    }

    const now = new Date();
    const currentPeriodEnd = new Date(now);
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    const subscription = await prisma.vendorSubscription.create({
      data: {
        vendorId: vendor.id,
        planId,
        billingPeriod: billingPeriod || 'monthly',
        status: 'TRIAL',
        currentPeriodStart: now,
        currentPeriodEnd,
      },
    });

    await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        subscriptionStatus: 'TRIAL',
        trialStartedAt: now,
        trialEndsAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(201).json({
      success: true,
      data: { ...subscription, plan: planForClient(planId, billingPeriod || 'monthly') },
      message: 'Subscription created. Trial period ends in 14 days.',
    });
  } catch (error) {
    logger.error({ err: error }, 'create subscription failed');
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// ---------------------------------------------------------------------------
// PUT /change-plan — stage a plan change. Does NOT activate on its own; the
// vendor must then hit /checkout-session to pay. If the vendor is still in
// TRIAL, the plan choice is recorded and takes effect after payment.
// ---------------------------------------------------------------------------
router.put('/change-plan', authenticate, async (req: AuthRequest, res) => {
  try {
    const { planId, billingPeriod } = req.body as {
      planId: string;
      billingPeriod?: BillingPeriod;
    };

    if (!planId) return res.status(400).json({ error: 'planId is required' });
    const newPlan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!newPlan) return res.status(400).json({ error: 'Invalid plan' });

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: { subscription: true },
    });
    if (!vendor) return res.status(403).json({ error: 'Vendor profile not found' });

    let subscription = vendor.subscription;
    if (!subscription) {
      subscription = await prisma.vendorSubscription.create({
        data: {
          vendorId: vendor.id,
          planId,
          billingPeriod: billingPeriod || 'monthly',
          status: 'TRIAL',
        },
      });
    } else {
      const prevBilling = (subscription.billingPeriod as BillingPeriod) || 'monthly';
      subscription = await prisma.vendorSubscription.update({
        where: { id: subscription.id },
        data: {
          planId,
          billingPeriod: billingPeriod || prevBilling,
        },
      });
    }

    const currentPlan = planForClient(vendor.subscription?.planId, billingPeriod || 'monthly');
    const isUpgrade = planPrice(planId, billingPeriod || 'monthly') > currentPlan.price;

    res.json({
      success: true,
      data: {
        ...subscription,
        plan: planForClient(planId, billingPeriod || 'monthly'),
        previousPlan: currentPlan,
        isUpgrade,
      },
      message:
        'Plan selection saved. Complete payment via the checkout link to activate.',
    });
  } catch (error) {
    logger.error({ err: error }, 'change plan failed');
    res.status(500).json({ error: 'Failed to change plan' });
  }
});

// ---------------------------------------------------------------------------
// POST /checkout-session — create a hosted-checkout session with WiPay or
// PowerTranz for the vendor's currently-selected plan. Returns the URL the
// browser should be redirected to. On successful payment the shared webhook
// flips the subscription to ACTIVE and records a BillingHistory row.
// ---------------------------------------------------------------------------
router.post('/checkout-session', authenticate, async (req: AuthRequest, res) => {
  try {
    const { provider, planId, billingPeriod, returnUrl } = req.body as {
      provider?: Provider;
      planId?: string;
      billingPeriod?: BillingPeriod;
      returnUrl?: string;
    };

    if (
      provider !== 'WIPAY' &&
      provider !== 'POWERTRANZ' &&
      provider !== 'STRIPE'
    ) {
      return res.status(400).json({
        success: false,
        error: "provider must be 'WIPAY', 'POWERTRANZ' or 'STRIPE'",
      });
    }

    if (!providerAvailable(provider)) {
      return res.status(503).json({
        success: false,
        error: `${provider} is not configured on this server.`,
      });
    }

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: { subscription: true },
    });
    if (!vendor) {
      return res.status(403).json({ success: false, error: 'Vendor profile not found' });
    }

    const chosenPlanId = planId || vendor.subscription?.planId || 'basic';
    const chosenBilling =
      billingPeriod ||
      ((vendor.subscription?.billingPeriod as BillingPeriod) ?? 'monthly');
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === chosenPlanId);
    if (!plan) return res.status(400).json({ success: false, error: 'Invalid plan' });

    const amountUsd = planPrice(chosenPlanId, chosenBilling);

    // Ensure a subscription row exists so the webhook can find it. We stamp
    // the planId + provider + billing period up-front — status flips to
    // ACTIVE only when the webhook confirms payment.
    let subscription = vendor.subscription;
    if (!subscription) {
      subscription = await prisma.vendorSubscription.create({
        data: {
          vendorId: vendor.id,
          planId: chosenPlanId,
          billingPeriod: chosenBilling,
          provider,
          status: 'TRIAL',
        },
      });
    } else {
      subscription = await prisma.vendorSubscription.update({
        where: { id: subscription.id },
        data: {
          planId: chosenPlanId,
          billingPeriod: chosenBilling,
          provider,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { email: true, phone: true, profile: { select: { firstName: true, lastName: true } } },
    });
    const customerName =
      `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim() ||
      vendor.businessName ||
      'DoHuub vendor';

    const apiBase =
      process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 3001}`;

    const gatewayReference = prefixedReference('subscription', subscription.id);
    const productName = `DoHuub ${plan.name} plan (${chosenBilling})`;

    let redirectUrl: string;
    let providerTransactionId: string | undefined;

    if (provider === 'WIPAY') {
      const result = await createWipayCheckout({
        orderId: gatewayReference,
        totalUsd: amountUsd,
        customerName,
        customerEmail: user?.email || req.user!.email,
        customerPhone: user?.phone || undefined,
        responseUrl: `${apiBase}/api/v1/payments/webhook/wipay`,
        productName,
      });
      redirectUrl = result.url;
    } else if (provider === 'POWERTRANZ') {
      const result = await createPowertranzCheckout({
        orderId: gatewayReference,
        totalUsd: amountUsd,
        customerName,
        customerEmail: user?.email || req.user!.email,
        responseUrl: `${apiBase}/api/v1/payments/webhook/powertranz`,
        productName,
      });
      redirectUrl = result.redirectUrl;
      providerTransactionId = result.transactionIdentifier;
      await prisma.vendorSubscription.update({
        where: { id: subscription.id },
        data: { gatewayReference: providerTransactionId },
      });
    } else {
      // STRIPE. Subscription payments do NOT use Connect / split payments —
      // this is the vendor paying DoHuub for the plan, so the money stays on
      // our platform balance regardless of the vendor's country.
      const result = await createStripeCheckoutSession({
        reference: gatewayReference,
        totalUsd: amountUsd,
        productName,
        customerUserId: req.user!.id,
        customerEmail: user?.email || req.user!.email,
      });
      redirectUrl = result.url;
      providerTransactionId = result.sessionId;
      await prisma.vendorSubscription.update({
        where: { id: subscription.id },
        data: { gatewayReference: providerTransactionId },
      });
    }

    res.json({
      success: true,
      data: {
        url: redirectUrl,
        provider,
        subscriptionId: subscription.id,
        planId: chosenPlanId,
        billingPeriod: chosenBilling,
        amountUsd,
        // The portal can pass returnUrl (e.g. /vendor/subscription-management)
        // so it knows where to send the vendor after coming back. The gateway
        // callback still hits our API webhook — this is just for UX.
        portalReturnUrl: returnUrl || null,
      },
    });
  } catch (error: any) {
    logger.error({ err: error }, 'subscription checkout session failed');
    res
      .status(500)
      .json({ success: false, error: error.message || 'Failed to start checkout' });
  }
});

// ---------------------------------------------------------------------------
// GET /providers — which providers to show in the picker for this vendor.
// US vendors → Stripe recommended. Caribbean → WiPay recommended.
// ---------------------------------------------------------------------------
router.get('/providers', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      select: { country: true },
    });
    const country = (vendor?.country || 'US').toUpperCase();

    const CARIBBEAN = new Set(['JM', 'TT', 'BB', 'GY', 'LC', 'AG', 'DM', 'VC', 'KN']);
    const recommended: Provider = country === 'US'
      ? 'STRIPE'
      : CARIBBEAN.has(country)
        ? 'WIPAY'
        : 'STRIPE';

    const available: { id: Provider; enabled: boolean }[] = [
      { id: 'STRIPE', enabled: stripeConfigured() },
      { id: 'WIPAY', enabled: wipayConfigured() },
      { id: 'POWERTRANZ', enabled: powertranzConfigured() },
    ];

    res.json({
      success: true,
      data: { country, recommended, available },
    });
  } catch (error) {
    logger.error({ err: error }, 'subscriptions get providers failed');
    res.status(500).json({ success: false, error: 'Failed to get providers' });
  }
});

// ---------------------------------------------------------------------------
// POST /customer-portal — returns a Stripe Billing Portal URL for the current
// vendor. Used by the vendor "Update Payment Method" screen to let them
// manage saved cards, view invoices, and (optionally) cancel through Stripe.
// ---------------------------------------------------------------------------
router.post('/customer-portal', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!stripeConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'Stripe is not configured on this server.',
      });
    }

    const { returnUrl } = req.body as { returnUrl?: string };
    const portalReturn =
      returnUrl ||
      `${process.env.PORTAL_PUBLIC_URL || 'http://localhost:5173'}/vendor/subscription-management`;

    const { url } = await createCustomerPortalSession({
      userId: req.user!.id,
      fallbackEmail: req.user!.email,
      returnUrl: portalReturn,
    });

    res.json({ success: true, data: { url } });
  } catch (error: any) {
    logger.error({ err: error }, 'customer portal session failed');
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to open customer portal',
    });
  }
});

// ---------------------------------------------------------------------------
// POST /cancel
// ---------------------------------------------------------------------------
router.post('/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    const { reason } = req.body;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: { subscription: true },
    });
    if (!vendor) return res.status(403).json({ error: 'Vendor profile not found' });

    if (!vendor.subscription) {
      vendor.subscription = await prisma.vendorSubscription.create({
        data: {
          vendorId: vendor.id,
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason: reason || null,
        },
      });
    }

    if (vendor.subscription.status === 'CANCELLED') {
      return res.json({
        success: true,
        data: vendor.subscription,
        message: 'Subscription already cancelled',
      });
    }

    const subscription = await prisma.vendorSubscription.update({
      where: { id: vendor.subscription.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: reason || null,
      },
    });

    await prisma.vendor.update({
      where: { id: vendor.id },
      data: { subscriptionStatus: 'CANCELLED' },
    });

    res.json({
      success: true,
      data: subscription,
      message: `Subscription cancelled. You'll have access until ${subscription.currentPeriodEnd?.toLocaleDateString()}.`,
    });
  } catch (error) {
    logger.error({ err: error }, 'cancel subscription failed');
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// ---------------------------------------------------------------------------
// POST /reactivate — only works within the grace period after cancellation.
// The vendor still needs to complete a fresh checkout-session to be charged
// for the next cycle.
// ---------------------------------------------------------------------------
router.post('/reactivate', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: { subscription: true },
    });
    if (!vendor) return res.status(403).json({ error: 'Vendor profile not found' });
    if (!vendor.subscription) return res.status(400).json({ error: 'No subscription found' });

    if (vendor.subscription.status !== 'CANCELLED') {
      return res.status(400).json({ error: 'Subscription is not cancelled' });
    }

    const now = new Date();
    if (vendor.subscription.currentPeriodEnd && vendor.subscription.currentPeriodEnd < now) {
      return res.status(400).json({
        error: 'Grace period expired. Please create a new subscription.',
      });
    }

    const subscription = await prisma.vendorSubscription.update({
      where: { id: vendor.subscription.id },
      data: { status: 'ACTIVE', cancelledAt: null },
    });

    await prisma.vendor.update({
      where: { id: vendor.id },
      data: { subscriptionStatus: 'ACTIVE' },
    });

    const billing = (subscription.billingPeriod as BillingPeriod) || 'monthly';

    res.json({
      success: true,
      data: { ...subscription, plan: planForClient(subscription.planId, billing) },
      message: 'Subscription reactivated successfully',
    });
  } catch (error) {
    logger.error({ err: error }, 'reactivate subscription failed');
    res.status(500).json({ error: 'Failed to reactivate subscription' });
  }
});

// ---------------------------------------------------------------------------
// GET /usage — plan limits vs current usage.
// ---------------------------------------------------------------------------
router.get('/usage', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      include: { subscription: true },
    });
    if (!vendor) return res.status(403).json({ error: 'Vendor profile not found' });

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
      ]).then((counts) => counts.reduce((a, b) => a + b, 0)),
    ]);

    const plan = findPlan(vendor.subscription?.planId);

    const storesLimit = plan?.storesLimit ?? 1;
    const listingsLimit = plan?.listingsLimit ?? 10;

    res.json({
      success: true,
      data: {
        stores: {
          used: storesCount,
          limit: storesLimit === -1 ? 'Unlimited' : storesLimit,
          remaining:
            storesLimit === -1 ? 'Unlimited' : Math.max(0, storesLimit - storesCount),
          percentUsed:
            storesLimit === -1 ? 0 : Math.round((storesCount / storesLimit) * 100),
        },
        listings: {
          used: listingsCount,
          limit: listingsLimit === -1 ? 'Unlimited' : listingsLimit,
          remaining:
            listingsLimit === -1
              ? 'Unlimited'
              : Math.max(0, listingsLimit - listingsCount),
          percentUsed:
            listingsLimit === -1
              ? 0
              : Math.round((listingsCount / listingsLimit) * 100),
        },
        plan: plan?.name || 'Basic',
        canCreateStore: storesLimit === -1 || storesCount < storesLimit,
        canCreateListing: listingsLimit === -1 || listingsCount < listingsLimit,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'get usage failed');
    res.status(500).json({ error: 'Failed to get usage' });
  }
});

export default router;
