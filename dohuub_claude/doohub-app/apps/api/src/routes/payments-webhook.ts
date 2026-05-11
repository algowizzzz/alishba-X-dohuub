// Stripe webhook handler.
//
// IMPORTANT: this router MUST be mounted with `express.raw({ type: 'application/json' })`
// BEFORE the global `express.json()` middleware — Stripe signature verification
// needs the exact raw bytes Stripe sent us, not a re-serialized object.
// See apps/api/src/index.ts for the mount.
import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '@doohub/database';

const router = Router();

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
let stripe: Stripe | null = null;

if (stripeSecret) {
  stripe = new Stripe(stripeSecret);
} else {
  console.warn(
    '[stripe-webhook] STRIPE_SECRET_KEY not set — webhook will reject all events with 503.'
  );
}

if (!webhookSecret) {
  console.warn(
    '[stripe-webhook] STRIPE_WEBHOOK_SECRET not set — webhook will reject events as misconfigured.'
  );
}

router.post('/', async (req: Request, res: Response) => {
  if (!stripe || !webhookSecret) {
    return res
      .status(503)
      .json({ error: 'Stripe webhook is not configured on this server.' });
  }

  const sig = req.headers['stripe-signature'] as string | undefined;
  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  // req.body is a Buffer here because the parent middleware is express.raw().
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error('[stripe-webhook] signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook signature error: ${err.message}` });
  }

  // ---- Always 200 quickly; do work in try/catch so we don't accidentally
  // make Stripe retry on a transient DB hiccup we already handled.
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.warn(
          `[stripe-webhook] payment_intent.payment_failed for ${pi.id}; ` +
            `metadata=${JSON.stringify(pi.metadata)}`
        );
        // Leave booking in PENDING — user can retry from the app.
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.warn(
          `[stripe-webhook] checkout.session.expired for ${session.id}; ` +
            `metadata=${JSON.stringify(session.metadata)}`
        );
        break;
      }

      default:
        // Other events we just acknowledge.
        break;
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('[stripe-webhook] handler error:', err);
    // Still 200: the event was valid and we've logged the issue. Returning
    // a 5xx makes Stripe retry, which is rarely what we want for our own bugs.
    res.json({ received: true, warning: err.message });
  }
});

// ---------------------------------------------------------------------------
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const md = session.metadata || {};
  const bookingId = md.bookingId;
  const orderId = md.orderId;
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const amount = (session.amount_total ?? 0) / 100;
  const paidAt = new Date();

  if (bookingId) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) {
      console.warn(`[stripe-webhook] booking ${bookingId} not found`);
      return;
    }

    const platformFee = booking.serviceFee;
    const vendorPayout = booking.total - platformFee;

    await prisma.transaction.upsert({
      where: { bookingId },
      create: {
        bookingId,
        stripePaymentIntentId: paymentIntentId,
        amount: amount || booking.total,
        platformFee,
        vendorPayout,
        status: 'COMPLETED',
        paidAt,
      },
      update: {
        stripePaymentIntentId: paymentIntentId,
        amount: amount || booking.total,
        status: 'COMPLETED',
        paidAt,
      },
    });

    if (booking.status === 'PENDING') {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'ACCEPTED',
          statusHistory: {
            create: { status: 'ACCEPTED', note: 'Payment received via Stripe' },
          },
        },
      });
    }

    console.log(`[stripe-webhook] booking ${bookingId} marked as paid + accepted`);
  }

  if (orderId) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      console.warn(`[stripe-webhook] order ${orderId} not found`);
      return;
    }

    const platformFee = order.serviceFee;
    const vendorPayout = order.total - platformFee - order.deliveryFee;

    await prisma.transaction.upsert({
      where: { orderId },
      create: {
        orderId,
        stripePaymentIntentId: paymentIntentId,
        amount: amount || order.total,
        platformFee,
        vendorPayout,
        status: 'COMPLETED',
        paidAt,
      },
      update: {
        stripePaymentIntentId: paymentIntentId,
        amount: amount || order.total,
        status: 'COMPLETED',
        paidAt,
      },
    });

    if (order.status === 'PENDING') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'ACCEPTED' },
      });
    }

    console.log(`[stripe-webhook] order ${orderId} marked as paid + accepted`);
  }
}

export default router;
