// Stripe webhook handler.
//
// MUST be mounted with `express.raw({ type: 'application/json' })` BEFORE the
// global `express.json()` middleware — Stripe signature verification needs the
// exact raw bytes Stripe sent, not a re-serialized object. See
// apps/api/src/index.ts.
//
// We route each event's payload through the same settlement helpers the
// WiPay + PowerTranz webhooks use (lib/settlement.ts), so all three
// gateways converge on identical booking / order / subscription behavior.

import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { getStripe, stripeConfigured, verifyStripeWebhook } from '../lib/stripe';
import {
  settleBookingOrOrder,
  settleVendorSubscription,
} from '../lib/settlement';
import { parseReference } from './payments';
import { logger } from '../lib/logger';

const router = Router();

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

if (!webhookSecret) {
  logger.warn(
    '[stripe-webhook] STRIPE_WEBHOOK_SECRET not set — webhook will reject events until it is configured'
  );
}

router.post('/', async (req: Request, res: Response) => {
  if (!stripeConfigured() || !webhookSecret) {
    return res
      .status(503)
      .json({ error: 'Stripe webhook is not configured on this server.' });
  }

  const sig = req.headers['stripe-signature'] as string | undefined;
  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;
  try {
    // req.body is a Buffer because the parent middleware is express.raw().
    event = verifyStripeWebhook(req.body as Buffer, sig, webhookSecret);
  } catch (err: any) {
    logger.error({ err: err.message }, '[stripe-webhook] signature verification failed');
    return res.status(400).json({ error: `Webhook signature error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSessionSettled(session, true);
        break;
      }

      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSessionSettled(session, false, event.type);
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        logger.warn(
          { paymentIntentId: pi.id, metadata: pi.metadata },
          '[stripe-webhook] payment_intent.payment_failed'
        );
        // No settlement here — checkout.session.expired covers the user-facing
        // outcome for hosted-checkout sessions.
        break;
      }

      default:
        // Ignore everything else.
        break;
    }

    res.json({ received: true });
  } catch (err: any) {
    // Log but still 200 — Stripe retries on 5xx which is rarely what we want
    // for our own DB hiccups (the event was valid, we've recorded the issue).
    logger.error({ err }, '[stripe-webhook] handler error');
    res.json({ received: true, warning: err.message });
  }
});

async function handleSessionSettled(
  session: Stripe.Checkout.Session,
  paid: boolean,
  failEvent?: string
) {
  const reference = (session.metadata?.reference ?? '').toString();
  if (!reference) {
    logger.warn({ sessionId: session.id }, '[stripe-webhook] session has no reference metadata');
    return;
  }

  const parsed = parseReference(reference);
  if (!parsed) {
    logger.warn(
      { sessionId: session.id, reference },
      '[stripe-webhook] unparseable reference'
    );
    return;
  }

  if (parsed.kind === 'subscription') {
    // Try to grab Stripe's hosted receipt URL for the download link on the
    // vendor billing history page. Non-fatal — if this fails we still settle.
    let invoiceUrl: string | undefined;
    if (paid && session.payment_intent) {
      try {
        const pi = await getStripe().paymentIntents.retrieve(
          session.payment_intent as string,
          { expand: ['latest_charge'] }
        );
        const charge = pi.latest_charge as Stripe.Charge | null;
        invoiceUrl = charge?.receipt_url ?? undefined;
      } catch (err) {
        logger.warn({ err, sessionId: session.id }, '[stripe-webhook] receipt lookup failed');
      }
    }

    await settleVendorSubscription({
      subscriptionId: parsed.id,
      provider: 'STRIPE',
      providerTransactionId: session.id,
      paid,
      failNote: !paid ? `Stripe ${failEvent || 'unpaid'}` : undefined,
      invoiceUrl,
    });
    return;
  }

  await settleBookingOrOrder({
    kind: parsed.kind,
    targetId: parsed.id,
    provider: 'STRIPE',
    providerTransactionId: session.id,
    paid,
    failNote: !paid ? `Stripe ${failEvent || 'unpaid'}` : undefined,
  });
}

export default router;
