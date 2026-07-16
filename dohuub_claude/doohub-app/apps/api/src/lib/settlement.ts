// Shared payment settlement.
//
// All three payment webhooks (WiPay, PowerTranz, Stripe) route their success
// / failure signal through here. This is the ONLY place we flip a Transaction
// to COMPLETED, activate a booking, or mark a vendor subscription ACTIVE +
// write BillingHistory. Keeping it centralised means we can't accidentally
// diverge behavior between gateways.
//
// The reference (`bk-<id>` / `or-<id>` / `sub-<id>`) determines which record
// gets settled. See parseReference in ../routes/payments.ts.

import { prisma } from '@doohub/database';
import { logger } from './logger';

export type SettlementProvider = 'WIPAY' | 'POWERTRANZ' | 'STRIPE';

export async function settleBookingOrOrder(params: {
  kind: 'booking' | 'order';
  targetId: string;
  provider: SettlementProvider;
  providerTransactionId?: string;
  paid: boolean;
  failNote?: string;
}) {
  const { kind, targetId, provider, providerTransactionId, paid, failNote } = params;

  // Look up the pre-created pending Transaction row. Match by
  // providerTransactionId first (unique + specific), then by the booking /
  // order id as a fallback for callbacks that arrive before we've stamped the
  // tx id.
  let tx = providerTransactionId
    ? await prisma.transaction.findFirst({ where: { providerTransactionId } })
    : null;

  if (!tx) {
    tx = await prisma.transaction.findFirst({
      where: kind === 'booking' ? { bookingId: targetId } : { orderId: targetId },
    });
  }

  if (!tx) {
    logger.warn(
      { targetId, kind, provider, providerTransactionId },
      '[settle] transaction row not found — cannot settle'
    );
    return;
  }

  const paidAt = paid ? new Date() : null;

  await prisma.transaction.update({
    where: { id: tx.id },
    data: {
      provider,
      providerTransactionId: providerTransactionId ?? tx.providerTransactionId,
      status: paid ? 'COMPLETED' : 'FAILED',
      paidAt,
    },
  });

  if (paid && tx.bookingId) {
    const booking = await prisma.booking.findUnique({ where: { id: tx.bookingId } });
    if (booking?.status === 'PENDING') {
      await prisma.booking.update({
        where: { id: tx.bookingId },
        data: {
          status: 'ACCEPTED',
          statusHistory: {
            create: { status: 'ACCEPTED', note: `Payment received via ${provider}` },
          },
        },
      });
    }
    logger.info({ bookingId: tx.bookingId, provider }, '[settle] booking paid');
  }

  if (paid && tx.orderId) {
    const order = await prisma.order.findUnique({ where: { id: tx.orderId } });
    if (order?.status === 'PENDING') {
      await prisma.order.update({
        where: { id: tx.orderId },
        data: { status: 'ACCEPTED' },
      });
    }
    logger.info({ orderId: tx.orderId, provider }, '[settle] order paid');
  }

  if (!paid) {
    logger.warn(
      { targetId, kind, provider, failNote },
      '[settle] transaction failed / declined'
    );
  }
}

export async function settleVendorSubscription(params: {
  subscriptionId: string;
  provider: SettlementProvider;
  providerTransactionId?: string;
  paid: boolean;
  failNote?: string;
  invoiceUrl?: string; // Stripe hosted receipt URL, if available
}) {
  const { subscriptionId, provider, providerTransactionId, paid, failNote, invoiceUrl } = params;

  const subscription = await prisma.vendorSubscription.findUnique({
    where: { id: subscriptionId },
  });
  if (!subscription) {
    logger.warn(
      { subscriptionId, provider },
      '[settle-sub] subscription not found — cannot settle'
    );
    return;
  }

  if (!paid) {
    // Don't downgrade an already-ACTIVE subscription on a failed callback for a
    // later attempt — only pause if the sub was still TRIAL / already paused.
    if (subscription.status === 'TRIAL' || subscription.status === 'PAUSED') {
      await prisma.vendorSubscription.update({
        where: { id: subscription.id },
        data: {
          status: 'PAUSED',
          provider,
          gatewayReference: providerTransactionId ?? subscription.gatewayReference,
        },
      });
    }
    logger.warn(
      { subscriptionId, provider, failNote },
      '[settle-sub] subscription payment failed'
    );
    return;
  }

  // Paid — activate + roll the period forward.
  const now = new Date();
  const billing = subscription.billingPeriod || 'monthly';
  const periodEnd = new Date(now);
  if (billing === 'yearly') {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  await prisma.vendorSubscription.update({
    where: { id: subscription.id },
    data: {
      status: 'ACTIVE',
      provider,
      gatewayReference: providerTransactionId ?? subscription.gatewayReference,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelledAt: null,
    },
  });

  await prisma.vendor.update({
    where: { id: subscription.vendorId },
    data: { subscriptionStatus: 'ACTIVE' },
  });

  // BillingHistory row. Amount is pulled from the plan catalogue since the
  // gateway callback doesn't include it in a portable form. If the gateway
  // charged a different amount for any reason, we'd catch it during monthly
  // reconciliation.
  const planPrices: Record<string, { monthly: number; yearly: number }> = {
    basic: { monthly: 29.99, yearly: 299.99 },
    professional: { monthly: 79.99, yearly: 799.99 },
    enterprise: { monthly: 199.99, yearly: 1999.99 },
  };
  const amount = subscription.planId
    ? (planPrices[subscription.planId]?.[billing as 'monthly' | 'yearly'] ?? 0)
    : 0;

  await prisma.billingHistory.create({
    data: {
      vendorId: subscription.vendorId,
      amount,
      currency: 'USD',
      description: `Subscription ${subscription.planId} (${billing}) — ${provider}`,
      invoiceUrl: invoiceUrl ?? null,
      paidAt: now,
    },
  });

  logger.info(
    { subscriptionId, vendorId: subscription.vendorId, provider, amount },
    '[settle-sub] subscription paid + activated'
  );
}
