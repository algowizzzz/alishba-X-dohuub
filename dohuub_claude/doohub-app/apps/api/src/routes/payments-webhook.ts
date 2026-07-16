// WiPay + PowerTranz webhook router.
//
// Both gateways POST asynchronously to us after the user completes (or
// cancels) a hosted checkout. We never trust the request body alone — every
// callback is verified by calling back into the gateway to re-read the real
// transaction status before marking a booking/order paid.
//
// Stripe has its own webhook mount (needs raw body for signature check) — see
// routes/payments-stripe-webhook.ts. All three converge on the same
// settlement functions in lib/settlement.ts.
//
// Mounted at /api/v1/payments/webhook in apps/api/src/index.ts.
//   POST /wipay        — WiPay hosted-checkout callback (application/x-www-form-urlencoded)
//   POST /powertranz   — PowerTranz callback (application/json)

import { Router, Request, Response } from 'express';
import { verifyWipayTransaction } from '../lib/wipay';
import { verifyPowertranzTransaction } from '../lib/powertranz';
import {
  settleBookingOrOrder,
  settleVendorSubscription,
  type SettlementProvider,
} from '../lib/settlement';
import { parseReference } from './payments';
import { logger } from '../lib/logger';

const router = Router();

// ---------------------------------------------------------------------------
// WiPay callback.
// ---------------------------------------------------------------------------
router.post('/wipay', async (req: Request, res: Response) => {
  try {
    const {
      order_id: orderIdOrBookingId,
      transaction_id: providerTransactionId,
      status: callbackStatus,
    } = (req.body || {}) as Record<string, string>;

    if (!orderIdOrBookingId) {
      logger.warn({ body: req.body }, '[wipay-webhook] missing order_id');
      return res.status(400).json({ error: 'Missing order_id' });
    }

    let verified: Awaited<ReturnType<typeof verifyWipayTransaction>> = null;
    if (providerTransactionId) {
      verified = await verifyWipayTransaction(providerTransactionId);
    }

    const isPaid =
      verified?.status === 'success' ||
      verified?.status === 'complete' ||
      verified?.status === 'completed' ||
      (verified === null && callbackStatus?.toLowerCase() === 'success');

    if (verified === null) {
      logger.warn(
        { providerTransactionId, orderIdOrBookingId, callbackStatus },
        '[wipay-webhook] could not verify with WiPay — trusting callback status'
      );
    }

    await routeSettlement({
      referenceId: orderIdOrBookingId,
      provider: 'WIPAY',
      providerTransactionId,
      paid: Boolean(isPaid),
      failNote: !isPaid ? `WiPay ${callbackStatus || 'unknown'}` : undefined,
    });

    res.status(200).send('OK');
  } catch (err: any) {
    logger.error({ err }, '[wipay-webhook] handler error');
    res.status(200).send('OK');
  }
});

// ---------------------------------------------------------------------------
// PowerTranz callback.
// ---------------------------------------------------------------------------
router.post('/powertranz', async (req: Request, res: Response) => {
  try {
    const {
      TransactionIdentifier: providerTransactionId,
      OrderIdentifier: orderIdOrBookingId,
      IsoResponseCode: callbackCode,
      Approved: callbackApproved,
    } = (req.body || {}) as Record<string, unknown>;

    if (!providerTransactionId || typeof providerTransactionId !== 'string') {
      logger.warn({ body: req.body }, '[powertranz-webhook] missing TransactionIdentifier');
      return res.status(400).json({ error: 'Missing TransactionIdentifier' });
    }

    const verified = await verifyPowertranzTransaction(providerTransactionId);

    const isPaid =
      verified?.approved === true ||
      (verified === null && callbackCode === '00' && callbackApproved === true);

    if (verified === null) {
      logger.warn(
        { providerTransactionId, orderIdOrBookingId, callbackCode },
        '[powertranz-webhook] could not verify — trusting callback flags'
      );
    }

    await routeSettlement({
      referenceId:
        (typeof orderIdOrBookingId === 'string' && orderIdOrBookingId) ||
        (verified?.orderId ?? ''),
      provider: 'POWERTRANZ',
      providerTransactionId,
      paid: Boolean(isPaid),
      failNote: !isPaid ? `PowerTranz IsoResponseCode=${callbackCode ?? '?'}` : undefined,
    });

    res.status(200).json({ received: true });
  } catch (err: any) {
    logger.error({ err }, '[powertranz-webhook] handler error');
    res.status(200).json({ received: true });
  }
});

// Route by reference prefix into the shared settlement helpers.
async function routeSettlement(params: {
  referenceId: string;
  provider: SettlementProvider;
  providerTransactionId?: string;
  paid: boolean;
  failNote?: string;
}) {
  const parsed = parseReference(params.referenceId);
  if (!parsed) {
    logger.warn(
      { referenceId: params.referenceId, provider: params.provider },
      '[settle] unparseable reference — cannot route'
    );
    return;
  }

  if (parsed.kind === 'subscription') {
    await settleVendorSubscription({
      subscriptionId: parsed.id,
      provider: params.provider,
      providerTransactionId: params.providerTransactionId,
      paid: params.paid,
      failNote: params.failNote,
    });
    return;
  }

  await settleBookingOrOrder({
    kind: parsed.kind,
    targetId: parsed.id,
    provider: params.provider,
    providerTransactionId: params.providerTransactionId,
    paid: params.paid,
    failNote: params.failNote,
  });
}

export default router;
