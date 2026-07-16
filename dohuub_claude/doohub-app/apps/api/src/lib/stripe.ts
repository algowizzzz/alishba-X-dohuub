// Stripe client + helpers.
//
// Stripe is one of three payment providers we support. It's used for US
// customers and US vendors. Caribbean users go through WiPay or PowerTranz.
// Routing is decided by UserProfile.country and Vendor.country.
//
// For US customer + US vendor bookings we use Stripe Connect (Express) so the
// vendor payout is automatic — money splits between the platform fee (kept on
// our balance) and the vendor's connected account. See createCheckoutSession.
//
// For US customer + Caribbean vendor bookings, we still charge via Stripe but
// keep the money on our balance; payout to the vendor is manual.

import Stripe from 'stripe';
import { prisma } from '@doohub/database';
import { logger } from './logger';

const secretKey = process.env.STRIPE_SECRET_KEY || '';

let client: Stripe | null = null;
if (secretKey) {
  client = new Stripe(secretKey);
  logger.info('[stripe] initialized');
} else {
  logger.warn(
    '[stripe] STRIPE_SECRET_KEY not set — Stripe routes will return 503 until it is configured.'
  );
}

export function stripeConfigured(): boolean {
  return client !== null;
}

export function getStripe(): Stripe {
  if (!client) throw new Error('Stripe not configured');
  return client;
}

/**
 * Find or create a Stripe Customer for a given user, caching the id on
 * User.stripeCustomerId so we don't churn Customer objects on every payment.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  fallbackEmail: string
): Promise<string> {
  const stripe = getStripe();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, stripeCustomerId: true },
  });
  if (user?.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: user?.email || fallbackEmail,
    metadata: { userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export interface StripeCheckoutParams {
  reference: string;               // prefixed reference (bk-, or-, sub-)
  totalUsd: number;
  productName: string;
  customerUserId: string;
  customerEmail: string;
  connectedAccountId?: string;     // Vendor's Stripe Connect account for split payment
  applicationFeeUsd?: number;      // Platform fee kept by DoHuub when using Connect
}

/**
 * Create a Stripe Checkout Session for a booking / order / subscription.
 * If connectedAccountId is passed, we use transfer_data.destination so
 * Stripe automatically routes the vendor payout to their Express account
 * and keeps the applicationFee on our platform balance.
 */
export async function createStripeCheckoutSession(
  params: StripeCheckoutParams
): Promise<{ url: string; sessionId: string }> {
  const stripe = getStripe();

  const customerId = await getOrCreateStripeCustomer(
    params.customerUserId,
    params.customerEmail
  );

  const returnUrl = process.env.STRIPE_RETURN_URL || 'dohuub://checkout/return';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customerId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: params.productName },
          unit_amount: Math.round(params.totalUsd * 100),
        },
        quantity: 1,
      },
    ],
    // The reference is our own bk-/or-/sub- prefixed id. The webhook uses it
    // to look up which record to settle.
    metadata: { reference: params.reference },
    payment_intent_data:
      params.connectedAccountId && params.applicationFeeUsd !== undefined
        ? {
            application_fee_amount: Math.round(params.applicationFeeUsd * 100),
            transfer_data: { destination: params.connectedAccountId },
            metadata: { reference: params.reference },
          }
        : { metadata: { reference: params.reference } },
    success_url: `${returnUrl}?session={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnUrl}?cancelled=1`,
  });

  if (!session.url) {
    throw new Error('Stripe did not return a checkout URL');
  }

  return { url: session.url, sessionId: session.id };
}

/**
 * Retrieve a Checkout Session — used by the polling GET /payments/session/:id
 * when the mobile app hands back a Stripe session id.
 */
export async function retrieveStripeSession(sessionId: string) {
  const stripe = getStripe();
  return stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Verify a Stripe webhook signature and return the parsed event. Throws if the
 * signature is invalid — caller returns 400 in that case.
 */
export function verifyStripeWebhook(
  rawBody: Buffer,
  signatureHeader: string,
  webhookSecret: string
): Stripe.Event {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(rawBody, signatureHeader, webhookSecret);
}

// ---------------------------------------------------------------------------
// Stripe Connect (Express) — for US vendor automated payouts.
// ---------------------------------------------------------------------------

/**
 * Create a Stripe Connect Express account for a vendor if they don't have one
 * yet, and return an Account Link URL they can open to complete onboarding.
 * Onboarding is Stripe's hosted flow — collects tax id, bank account, ID
 * verification. We never see their card / bank details.
 */
export async function createConnectOnboardingLink(vendorId: string): Promise<{
  accountId: string;
  onboardingUrl: string;
}> {
  const stripe = getStripe();

  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: { user: { select: { email: true } } },
  });
  if (!vendor) throw new Error('Vendor not found');

  let accountId = vendor.stripeAccountId;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      country: vendor.country || 'US',
      email: vendor.user.email,
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
      business_type: 'individual',
      metadata: { vendorId: vendor.id },
    });
    accountId = account.id;
    await prisma.vendor.update({
      where: { id: vendorId },
      data: { stripeAccountId: accountId },
    });
  }

  const portalBase = process.env.PORTAL_PUBLIC_URL || 'http://localhost:3000';
  const link = await stripe.accountLinks.create({
    account: accountId,
    type: 'account_onboarding',
    refresh_url: `${portalBase}/vendor/stripe-connect?refresh=1`,
    return_url: `${portalBase}/vendor/stripe-connect?done=1`,
  });

  return { accountId, onboardingUrl: link.url };
}

/**
 * Create a Stripe Billing / Customer Portal session for the current user so
 * they can manage saved payment methods and view invoices on Stripe's hosted
 * page. Used by the vendor "Update Payment Method" flow.
 *
 * Requires the Customer Portal to be enabled + configured in the Stripe
 * dashboard (Settings → Billing → Customer portal). Free to enable.
 */
export async function createCustomerPortalSession(params: {
  userId: string;
  fallbackEmail: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  const stripe = getStripe();
  const customerId = await getOrCreateStripeCustomer(params.userId, params.fallbackEmail);
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: params.returnUrl,
  });
  return { url: session.url };
}

/**
 * Read the current onboarding + capability status of a vendor's Connect
 * account and mirror it onto Vendor.stripeOnboardingComplete for cheap checks.
 */
export async function refreshConnectAccountStatus(vendorId: string): Promise<{
  accountId: string | null;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  onboardingComplete: boolean;
} | null> {
  const stripe = getStripe();

  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) return null;
  if (!vendor.stripeAccountId) {
    return {
      accountId: null,
      chargesEnabled: false,
      payoutsEnabled: false,
      detailsSubmitted: false,
      onboardingComplete: false,
    };
  }

  const account = await stripe.accounts.retrieve(vendor.stripeAccountId);
  const onboardingComplete = Boolean(
    account.charges_enabled && account.payouts_enabled && account.details_submitted
  );

  if (vendor.stripeOnboardingComplete !== onboardingComplete) {
    await prisma.vendor.update({
      where: { id: vendorId },
      data: { stripeOnboardingComplete: onboardingComplete },
    });
  }

  return {
    accountId: vendor.stripeAccountId,
    chargesEnabled: Boolean(account.charges_enabled),
    payoutsEnabled: Boolean(account.payouts_enabled),
    detailsSubmitted: Boolean(account.details_submitted),
    onboardingComplete,
  };
}
