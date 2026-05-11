import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// ---------------------------------------------------------------------------
// Stripe client (module-load).
// If the env var is missing we DON'T crash — we let the server boot and have
// each Stripe-backed route return 503. That keeps local dev working without
// keys, and lets the rest of the API keep serving.
// ---------------------------------------------------------------------------
const stripeSecret = process.env.STRIPE_SECRET_KEY;
let stripe: Stripe | null = null;

if (stripeSecret) {
  stripe = new Stripe(stripeSecret);
  console.log('[stripe] initialized');
} else {
  console.warn(
    '[stripe] STRIPE_SECRET_KEY is not set — payment routes will return 503. ' +
      'Set the env var in Railway / .env to enable real checkout.'
  );
}

function stripeRequired(res: any): boolean {
  if (!stripe) {
    res.status(503).json({
      success: false,
      error:
        'Stripe is not configured on this server. Ask the admin to set STRIPE_SECRET_KEY.',
    });
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Helper: look up or create a Stripe Customer for the current user and persist
// the id on User.stripeCustomerId so we don't churn customers on every payment.
// ---------------------------------------------------------------------------
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
): Promise<string> {
  if (!stripe) throw new Error('Stripe not configured');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, stripeCustomerId: true },
  });
  if (user?.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: user?.email || email,
    metadata: { userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

// ---------------------------------------------------------------------------
// POST /api/v1/payments/checkout-session
// Body: { bookingId?: string, orderId?: string }
// Creates a Stripe Checkout Session for the given booking or order.
// Returns { url, sessionId } so the mobile app can open it in a browser.
// ---------------------------------------------------------------------------
router.post('/checkout-session', authenticate, async (req: AuthRequest, res) => {
  if (stripeRequired(res)) return;

  try {
    const { bookingId, orderId } = req.body as {
      bookingId?: string;
      orderId?: string;
    };

    if (!bookingId && !orderId) {
      return res
        .status(400)
        .json({ success: false, error: 'bookingId or orderId required' });
    }

    let amount: number; // in cents
    let productName: string;
    const metadata: Record<string, string> = { userId: req.user!.id };

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
        return res
          .status(404)
          .json({ success: false, error: 'Booking not found' });
      }
      amount = Math.round(booking.total * 100);
      productName =
        booking.cleaningListing?.title ||
        booking.handymanListing?.title ||
        booking.beautyListing?.title ||
        booking.rentalListing?.title ||
        booking.rideAssistanceListing?.title ||
        booking.companionshipListing?.title ||
        `DoHuub booking ${booking.id.slice(0, 8)}`;
      metadata.bookingId = booking.id;
    } else {
      const order = await prisma.order.findFirst({
        where: { id: orderId!, userId: req.user!.id },
      });
      if (!order) {
        return res
          .status(404)
          .json({ success: false, error: 'Order not found' });
      }
      amount = Math.round(order.total * 100);
      productName = `DoHuub order ${order.id.slice(0, 8)}`;
      metadata.orderId = order.id;
    }

    const customerId = await getOrCreateStripeCustomer(
      req.user!.id,
      req.user!.email
    );

    const returnUrl =
      process.env.MOBILE_RETURN_URL || 'dohuub://checkout/return';

    const session = await stripe!.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: productName },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${returnUrl}?session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?cancelled=1`,
      metadata,
    });

    res.json({
      success: true,
      data: {
        url: session.url,
        sessionId: session.id,
      },
    });
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    res
      .status(500)
      .json({ success: false, error: error.message || 'Failed to create checkout session' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/v1/payments/session/:id
// Polled by the mobile app after returning from the Stripe-hosted checkout to
// learn whether payment succeeded. The webhook is the source of truth — this
// is a UX nicety so the user sees the right state without waiting on Stripe.
// ---------------------------------------------------------------------------
router.get('/session/:id', authenticate, async (req: AuthRequest, res) => {
  if (stripeRequired(res)) return;
  try {
    const session = await stripe!.checkout.sessions.retrieve(req.params.id);
    res.json({
      success: true,
      data: {
        paymentStatus: session.payment_status, // 'paid' | 'unpaid' | 'no_payment_required'
        status: session.status,                // 'open' | 'complete' | 'expired'
        amountTotal: session.amount_total ? session.amount_total / 100 : null,
        currency: session.currency,
      },
    });
  } catch (error: any) {
    console.error('Retrieve session error:', error);
    res
      .status(500)
      .json({ success: false, error: error.message || 'Failed to retrieve session' });
  }
});

// ---------------------------------------------------------------------------
// LEGACY ROUTES — kept so existing mobile builds in the field don't break.
// New flows should use /checkout-session above.
// ---------------------------------------------------------------------------

// Legacy: create payment intent (now redirects to checkout-session conceptually)
router.post('/create-intent', authenticate, async (req: AuthRequest, res) => {
  if (stripeRequired(res)) return;
  try {
    const { bookingId, orderId } = req.body;

    let amount: number;
    let metadata: any;

    if (bookingId) {
      const booking = await prisma.booking.findFirst({
        where: { id: bookingId, userId: req.user!.id },
      });
      if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
      }
      amount = Math.round(booking.total * 100);
      metadata = { bookingId, userId: req.user!.id };
    } else if (orderId) {
      const order = await prisma.order.findFirst({
        where: { id: orderId, userId: req.user!.id },
      });
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      amount = Math.round(order.total * 100);
      metadata = { orderId, userId: req.user!.id };
    } else {
      return res.status(400).json({ success: false, error: 'bookingId or orderId required' });
    }

    const customerId = await getOrCreateStripeCustomer(req.user!.id, req.user!.email);

    const paymentIntent = await stripe!.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customerId,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount / 100,
        currency: 'USD',
      },
    });
  } catch (error: any) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to create payment intent' });
  }
});

// Legacy: dev-only "confirm" used by the old mock flow. Kept so any in-flight
// builds keep working; new code paths rely on the Stripe webhook.
router.post('/confirm', authenticate, async (req: AuthRequest, res) => {
  try {
    const { bookingId, orderId, paymentIntentId } = req.body;

    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'ACCEPTED',
          statusHistory: {
            create: { status: 'ACCEPTED', note: 'Payment confirmed' },
          },
        },
      });

      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (booking) {
        const platformFee = booking.serviceFee;
        const vendorPayout = booking.total - platformFee;

        await prisma.transaction.upsert({
          where: { bookingId },
          create: {
            bookingId,
            stripePaymentIntentId: paymentIntentId,
            amount: booking.total,
            platformFee,
            vendorPayout,
            status: 'COMPLETED',
            paidAt: new Date(),
          },
          update: {
            stripePaymentIntentId: paymentIntentId,
            status: 'COMPLETED',
            paidAt: new Date(),
          },
        });
      }
    }

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'ACCEPTED' },
      });

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (order) {
        const platformFee = order.serviceFee;
        const vendorPayout = order.total - platformFee - order.deliveryFee;

        await prisma.transaction.upsert({
          where: { orderId },
          create: {
            orderId,
            stripePaymentIntentId: paymentIntentId,
            amount: order.total,
            platformFee,
            vendorPayout,
            status: 'COMPLETED',
            paidAt: new Date(),
          },
          update: {
            stripePaymentIntentId: paymentIntentId,
            status: 'COMPLETED',
            paidAt: new Date(),
          },
        });
      }
    }

    res.json({ success: true, message: 'Payment confirmed' });
  } catch (error: any) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ success: false, error: 'Failed to confirm payment' });
  }
});

// ---------------------------------------------------------------------------
// Stored payment methods (unrelated to checkout flow — keep as-is)
// ---------------------------------------------------------------------------
router.get('/methods', authenticate, async (req: AuthRequest, res) => {
  try {
    const methods = await prisma.paymentMethod.findMany({
      where: { userId: req.user!.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, data: methods });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ success: false, error: 'Failed to get payment methods' });
  }
});

router.post('/methods', authenticate, async (req: AuthRequest, res) => {
  try {
    const { last4, brand, expiryMonth, expiryYear, isDefault } = req.body;

    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    const method = await prisma.paymentMethod.create({
      data: {
        userId: req.user!.id,
        stripePaymentMethodId: `pm_mock_${Date.now()}`,
        type: 'card',
        last4,
        brand,
        expiryMonth,
        expiryYear,
        isDefault: isDefault || false,
      },
    });

    res.status(201).json({ success: true, data: method });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({ success: false, error: 'Failed to add payment method' });
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
    console.error('Delete payment method error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete payment method' });
  }
});

export default router;
