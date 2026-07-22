import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createWipayCheckout, wipayConfigured } from '../lib/wipay';
import {
  createPowertranzCheckout,
  powertranzConfigured,
} from '../lib/powertranz';
import {
  createStripeCheckoutSession,
  retrieveStripeSession,
  stripeConfigured,
} from '../lib/stripe';
import { settleBookingOrOrder } from '../lib/settlement';
import { logger } from '../lib/logger';

const router = Router();

type Provider = 'WIPAY' | 'POWERTRANZ' | 'STRIPE';

export function providerAvailable(provider: Provider): boolean {
  if (provider === 'WIPAY') return wipayConfigured();
  if (provider === 'POWERTRANZ') return powertranzConfigured();
  return stripeConfigured();
}

// ---------------------------------------------------------------------------
// Reference IDs sent to gateways are prefixed so the shared webhook knows
// which record to settle:
//   bk-<bookingId>        — customer booking payment
//   or-<orderId>          — customer marketplace order
//   sub-<subscriptionId>  — vendor subscription charge
// The webhook parses the prefix in payments-webhook.ts / payments-stripe-webhook.ts.
// ---------------------------------------------------------------------------
export function prefixedReference(
  kind: 'booking' | 'order' | 'subscription',
  id: string
): string {
  const prefix = kind === 'booking' ? 'bk' : kind === 'order' ? 'or' : 'sub';
  return `${prefix}-${id}`;
}

export function parseReference(
  ref: string
): { kind: 'booking' | 'order' | 'subscription'; id: string } | null {
  const [prefix, ...rest] = ref.split('-');
  const id = rest.join('-');
  if (!id) return null;
  if (prefix === 'bk') return { kind: 'booking', id };
  if (prefix === 'or') return { kind: 'order', id };
  if (prefix === 'sub') return { kind: 'subscription', id };
  return null;
}

// ---------------------------------------------------------------------------
// POST /api/v1/payments/checkout-session
// Body: { provider: 'WIPAY' | 'POWERTRANZ' | 'STRIPE', bookingId?, orderId? }
//
// Creates a hosted-checkout session with the chosen provider and returns the
// URL the mobile app should open in a browser.
//
// For Stripe with a US-based vendor whose Stripe Connect onboarding is
// complete, we split the payment: platform fee stays on our balance, the
// rest transfers to the vendor's Express account (automated payout).
// For Stripe with a Caribbean vendor, we take the full charge; payout is
// handled manually. WiPay/PowerTranz always settle manually.
// ---------------------------------------------------------------------------
router.post('/checkout-session', authenticate, async (req: AuthRequest, res) => {
  try {
    const { provider, bookingId, orderId } = req.body as {
      provider?: Provider;
      bookingId?: string;
      orderId?: string;
    };

    if (
      provider !== 'WIPAY' &&
      provider !== 'POWERTRANZ' &&
      provider !== 'STRIPE'
    ) {
      return res
        .status(400)
        .json({ success: false, error: "provider must be 'WIPAY', 'POWERTRANZ' or 'STRIPE'" });
    }

    if (!providerAvailable(provider)) {
      return res.status(503).json({
        success: false,
        error: `${provider} is not configured on this server. Ask the admin to set the ${provider} env vars.`,
      });
    }

    if (!bookingId && !orderId) {
      return res
        .status(400)
        .json({ success: false, error: 'bookingId or orderId required' });
    }

    let amountUsd: number;
    let productName: string;
    let referenceId: string;
    let vendorId: string;
    let platformFee: number;

    if (bookingId) {
      const booking = await prisma.booking.findFirst({
        where: { id: bookingId, userId: req.user!.id },
        include: {
          cleaningListing: { select: { title: true } },
          handymanListing: { select: { title: true } },
          beautyListing: { select: { title: true } },
          rentalListing: { select: { title: true } },
          rideAssistanceListing: { select: { title: true } },
          companionshipListing: { select: { title: true } },
        },
      });
      if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
      }
      amountUsd = booking.total;
      referenceId = booking.id;
      vendorId = booking.vendorId;
      platformFee = booking.serviceFee;
      productName =
        booking.cleaningListing?.title ||
        booking.handymanListing?.title ||
        booking.beautyListing?.title ||
        booking.rentalListing?.title ||
        booking.rideAssistanceListing?.title ||
        booking.companionshipListing?.title ||
        `DoHuub booking ${booking.id.slice(0, 8)}`;
    } else {
      const order = await prisma.order.findFirst({
        where: { id: orderId!, userId: req.user!.id },
      });
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      amountUsd = order.total;
      referenceId = order.id;
      vendorId = order.vendorId;
      platformFee = order.serviceFee;
      productName = `DoHuub order ${order.id.slice(0, 8)}`;
    }

    const vendorPayout = amountUsd - platformFee;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        email: true,
        phone: true,
        profile: { select: { firstName: true, lastName: true } },
      },
    });
    const customerName =
      `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim() ||
      'DoHuub customer';

    const apiBase = process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 3001}`;

    // Pre-create the pending Transaction row so the webhook can find it.
    // Idempotent — upsert on bookingId/orderId.
    if (bookingId) {
      await prisma.transaction.upsert({
        where: { bookingId },
        create: {
          bookingId,
          provider,
          amount: amountUsd,
          platformFee,
          vendorPayout,
          currency: 'USD',
          status: 'PENDING',
        },
        update: {
          provider,
          amount: amountUsd,
          status: 'PENDING',
        },
      });
    } else {
      await prisma.transaction.upsert({
        where: { orderId: orderId! },
        create: {
          orderId,
          provider,
          amount: amountUsd,
          platformFee,
          vendorPayout,
          currency: 'USD',
          status: 'PENDING',
        },
        update: {
          provider,
          amount: amountUsd,
          status: 'PENDING',
        },
      });
    }

    let redirectUrl: string;
    let providerTransactionId: string | undefined;
    const gatewayReference = prefixedReference(
      bookingId ? 'booking' : 'order',
      referenceId
    );

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

      if (bookingId) {
        await prisma.transaction.update({
          where: { bookingId },
          data: { providerTransactionId },
        });
      } else {
        await prisma.transaction.update({
          where: { orderId: orderId! },
          data: { providerTransactionId },
        });
      }
    } else {
      // STRIPE. Check whether the vendor is US + has completed Connect
      // onboarding — if so, split payment via transfer_data.destination so the
      // vendor's payout is automated. Otherwise take the full charge and settle
      // the vendor manually.
      const vendor = await prisma.vendor.findUnique({
        where: { id: vendorId },
        select: {
          country: true,
          stripeAccountId: true,
          stripeOnboardingComplete: true,
        },
      });

      const useConnect =
        vendor?.country === 'US' &&
        vendor.stripeAccountId &&
        vendor.stripeOnboardingComplete;

      const result = await createStripeCheckoutSession({
        reference: gatewayReference,
        totalUsd: amountUsd,
        productName,
        customerUserId: req.user!.id,
        customerEmail: user?.email || req.user!.email,
        connectedAccountId: useConnect ? vendor!.stripeAccountId! : undefined,
        applicationFeeUsd: useConnect ? platformFee : undefined,
      });
      redirectUrl = result.url;
      providerTransactionId = result.sessionId;

      if (bookingId) {
        await prisma.transaction.update({
          where: { bookingId },
          data: { providerTransactionId },
        });
      } else {
        await prisma.transaction.update({
          where: { orderId: orderId! },
          data: { providerTransactionId },
        });
      }
    }

    res.json({
      success: true,
      data: {
        url: redirectUrl,
        provider,
        sessionId: providerTransactionId || referenceId,
      },
    });
  } catch (error: any) {
    logger.error({ err: error }, 'create checkout session failed');
    res
      .status(500)
      .json({ success: false, error: error.message || 'Failed to create checkout session' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/v1/payments/session/:id
// Polled by the mobile app after returning from the hosted checkout. Reads
// our own Transaction row — kept updated by whichever gateway webhook fires.
// Falls back to a direct Stripe lookup when id looks like a Stripe session
// (cs_...) but the row hasn't been updated yet (webhook still in flight).
// ---------------------------------------------------------------------------
router.get('/session/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const tx = await prisma.transaction.findFirst({
      where: {
        OR: [{ bookingId: id }, { orderId: id }, { providerTransactionId: id }],
      },
    });

    if (!tx) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    let paymentStatus =
      tx.status === 'COMPLETED'
        ? 'paid'
        : tx.status === 'FAILED' || tx.status === 'REFUNDED'
          ? 'failed'
          : 'pending';

    // For Stripe, if we're still pending and the id looks like a Checkout
    // Session, do a live lookup so the UI shows the real state without
    // waiting on the webhook. If Stripe says paid, settle immediately so
    // booking flips to ACCEPTED even when the webhook is delayed/missing.
    if (
      paymentStatus === 'pending' &&
      tx.provider === 'STRIPE' &&
      tx.providerTransactionId?.startsWith('cs_') &&
      stripeConfigured()
    ) {
      try {
        const session = await retrieveStripeSession(tx.providerTransactionId);
        if (session.payment_status === 'paid') {
          paymentStatus = 'paid';
          const reference = (session.metadata?.reference ?? '').toString();
          const parsed = reference ? parseReference(reference) : null;
          if (parsed && (parsed.kind === 'booking' || parsed.kind === 'order')) {
            await settleBookingOrOrder({
              kind: parsed.kind,
              targetId: parsed.id,
              provider: 'STRIPE',
              providerTransactionId: session.id,
              paid: true,
            });
          }
        } else if (session.status === 'expired') {
          paymentStatus = 'failed';
        }
      } catch (err) {
        logger.warn({ err }, '[session] Stripe live lookup failed');
      }
    }

    res.json({
      success: true,
      data: {
        paymentStatus,
        status: tx.status,
        provider: tx.provider,
        amountTotal: tx.amount,
        currency: tx.currency,
      },
    });
  } catch (error: any) {
    logger.error({ err: error }, 'retrieve session failed');
    res
      .status(500)
      .json({ success: false, error: error.message || 'Failed to retrieve session' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/v1/payments/providers
// Returns the recommended provider for the current user + all available
// providers, so the mobile checkout screen can render a filtered picker
// (recommended on top, others collapsed).
// ---------------------------------------------------------------------------
router.get('/providers', authenticate, async (req: AuthRequest, res) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.user!.id },
      select: { country: true },
    });
    const country = (profile?.country || 'US').toUpperCase();

    // US customers → Stripe. Caribbean → WiPay preferred (broader coverage
    // than PowerTranz for SMBs). Users can still override in the picker.
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
      data: {
        country,
        recommended,
        available,
        anyEnabled: available.some((p) => p.enabled),
        demoAllowed:
          process.env.ALLOW_DEMO_PAYMENTS === 'true' ||
          !available.some((p) => p.enabled),
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'get providers failed');
    res.status(500).json({ success: false, error: 'Failed to get providers' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/v1/payments/demo-complete
// Marks a booking/order as paid without a gateway. Allowed only when
// ALLOW_DEMO_PAYMENTS=true OR no payment providers are configured.
// ---------------------------------------------------------------------------
router.post('/demo-complete', authenticate, async (req: AuthRequest, res) => {
  try {
    const { bookingId, orderId } = req.body as {
      bookingId?: string;
      orderId?: string;
    };

    const anyGateway =
      stripeConfigured() || wipayConfigured() || powertranzConfigured();
    const demoAllowed =
      process.env.ALLOW_DEMO_PAYMENTS === 'true' || !anyGateway;

    if (!demoAllowed) {
      return res.status(403).json({
        success: false,
        error:
          'Demo payments are disabled because a live gateway is configured. Use Stripe/WiPay checkout.',
      });
    }

    if (!bookingId && !orderId) {
      return res
        .status(400)
        .json({ success: false, error: 'bookingId or orderId required' });
    }

    if (bookingId) {
      const booking = await prisma.booking.findFirst({
        where: { id: bookingId, userId: req.user!.id },
      });
      if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
      }

      await prisma.transaction.upsert({
        where: { bookingId },
        create: {
          bookingId,
          provider: 'STRIPE',
          amount: booking.total,
          platformFee: booking.serviceFee,
          vendorPayout: booking.total - booking.serviceFee,
          currency: 'USD',
          status: 'PENDING',
          providerTransactionId: `demo_${bookingId}`,
        },
        update: {
          status: 'PENDING',
          providerTransactionId: `demo_${bookingId}`,
        },
      });

      await settleBookingOrOrder({
        kind: 'booking',
        targetId: bookingId,
        provider: 'STRIPE',
        providerTransactionId: `demo_${bookingId}`,
        paid: true,
      });
    } else {
      const order = await prisma.order.findFirst({
        where: { id: orderId!, userId: req.user!.id },
      });
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      await prisma.transaction.upsert({
        where: { orderId: orderId! },
        create: {
          orderId,
          provider: 'STRIPE',
          amount: order.total,
          platformFee: order.serviceFee,
          vendorPayout: order.total - order.serviceFee,
          currency: 'USD',
          status: 'PENDING',
          providerTransactionId: `demo_${orderId}`,
        },
        update: {
          status: 'PENDING',
          providerTransactionId: `demo_${orderId}`,
        },
      });

      await settleBookingOrOrder({
        kind: 'order',
        targetId: orderId!,
        provider: 'STRIPE',
        providerTransactionId: `demo_${orderId}`,
        paid: true,
      });
    }

    res.json({ success: true, data: { demo: true, paid: true } });
  } catch (error: any) {
    logger.error({ err: error }, 'demo-complete failed');
    res
      .status(500)
      .json({ success: false, error: error.message || 'Demo complete failed' });
  }
});

// ---------------------------------------------------------------------------
// Stored payment methods.
//
// Stripe stores real tokens; WiPay + PowerTranz collect card details on the
// hosted page each time. For the profile screen we keep the table as a
// display-only card list.
// ---------------------------------------------------------------------------
router.get('/methods', authenticate, async (req: AuthRequest, res) => {
  try {
    const methods = await prisma.paymentMethod.findMany({
      where: { userId: req.user!.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, data: methods });
  } catch (error) {
    logger.error({ err: error }, 'get payment methods failed');
    res.status(500).json({ success: false, error: 'Failed to get payment methods' });
  }
});

router.post('/methods', authenticate, async (req: AuthRequest, res) => {
  try {
    const { last4, brand, expiryMonth, expiryYear, isDefault } = req.body;

    if (!last4 || String(last4).length < 4) {
      return res.status(400).json({ success: false, error: 'Card last4 is required' });
    }

    const normalizedBrand = String(brand || 'card').toLowerCase();

    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    const method = await prisma.paymentMethod.create({
      data: {
        userId: req.user!.id,
        stripePaymentMethodId: `pm_local_${Date.now()}`,
        type: normalizedBrand,
        last4: String(last4).slice(-4),
        brand: normalizedBrand,
        expiryMonth: expiryMonth != null ? Number(expiryMonth) : null,
        expiryYear: expiryYear != null ? Number(expiryYear) : null,
        isDefault: !!isDefault,
      },
    });

    res.status(201).json({ success: true, data: method });
  } catch (error) {
    logger.error({ err: error }, 'add payment method failed');
    res.status(500).json({ success: false, error: 'Failed to add payment method' });
  }
});

router.patch('/methods/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { last4, brand, expiryMonth, expiryYear, isDefault } = req.body;

    const existing = await prisma.paymentMethod.findFirst({
      where: { id, userId: req.user!.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Payment method not found' });
    }

    if (isDefault === true) {
      await prisma.paymentMethod.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    const data: {
      last4?: string;
      brand?: string;
      type?: string;
      expiryMonth?: number | null;
      expiryYear?: number | null;
      isDefault?: boolean;
    } = {};

    if (last4 != null) {
      const digits = String(last4).replace(/\D/g, '');
      if (digits.length < 4) {
        return res.status(400).json({ success: false, error: 'Card last4 is required' });
      }
      data.last4 = digits.slice(-4);
    }

    if (brand != null) {
      const normalizedBrand = String(brand).toLowerCase();
      data.brand = normalizedBrand;
      data.type = normalizedBrand;
    }

    if (expiryMonth !== undefined) {
      data.expiryMonth = expiryMonth != null ? Number(expiryMonth) : null;
    }

    if (expiryYear !== undefined) {
      data.expiryYear = expiryYear != null ? Number(expiryYear) : null;
    }

    if (typeof isDefault === 'boolean') {
      data.isDefault = isDefault;
    }

    const method = await prisma.paymentMethod.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: method });
  } catch (error) {
    logger.error({ err: error }, 'update payment method failed');
    res.status(500).json({ success: false, error: 'Failed to update payment method' });
  }
});

router.delete('/methods/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await prisma.paymentMethod.deleteMany({
      where: { id, userId: req.user!.id },
    });
    res.json({ success: true, message: 'Payment method deleted' });
  } catch (error) {
    logger.error({ err: error }, 'delete payment method failed');
    res.status(500).json({ success: false, error: 'Failed to delete payment method' });
  }
});

export default router;
