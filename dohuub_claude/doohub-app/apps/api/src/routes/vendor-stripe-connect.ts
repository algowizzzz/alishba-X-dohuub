// Stripe Connect (Express) onboarding for US vendors.
//
// US vendors go through Stripe's hosted onboarding so their payouts can be
// automated — when a US customer books a US vendor via Stripe Checkout, we
// split the payment at charge time (application_fee_amount +
// transfer_data.destination = vendor's Connect account) and the vendor's cut
// lands in their bank account within Stripe's standard payout schedule.
//
// Caribbean vendors don't use this — their payouts stay manual.

import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import {
  createConnectOnboardingLink,
  refreshConnectAccountStatus,
  stripeConfigured,
} from '../lib/stripe';
import { logger } from '../lib/logger';

const router = Router();

function stripeRequired(res: any): boolean {
  if (!stripeConfigured()) {
    res.status(503).json({
      success: false,
      error: 'Stripe is not configured on this server.',
    });
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// POST /api/v1/vendor/stripe-connect/onboard
// Returns an Account Link URL — vendor opens it, completes Stripe's hosted
// onboarding, comes back. Idempotent: if the vendor already has a Connect
// account, we just mint a fresh link.
// ---------------------------------------------------------------------------
router.post('/onboard', authenticate, async (req: AuthRequest, res) => {
  if (stripeRequired(res)) return;

  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      select: { id: true, country: true },
    });
    if (!vendor) {
      return res.status(403).json({ success: false, error: 'Vendor profile not found' });
    }

    if (vendor.country !== 'US') {
      return res.status(400).json({
        success: false,
        error: 'Stripe Connect onboarding is only available for US vendors. Caribbean vendors are paid out manually.',
      });
    }

    const { accountId, onboardingUrl } = await createConnectOnboardingLink(vendor.id);
    res.json({ success: true, data: { accountId, url: onboardingUrl } });
  } catch (error: any) {
    logger.error({ err: error }, 'stripe connect onboard failed');
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create Stripe Connect onboarding link',
    });
  }
});

// ---------------------------------------------------------------------------
// GET /api/v1/vendor/stripe-connect/status
// Refreshes Vendor.stripeOnboardingComplete from Stripe and returns the flags
// the portal uses to render the "Connect complete / Continue setup" UI.
// ---------------------------------------------------------------------------
router.get('/status', authenticate, async (req: AuthRequest, res) => {
  if (stripeRequired(res)) return;

  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
      select: { id: true, country: true },
    });
    if (!vendor) {
      return res.status(403).json({ success: false, error: 'Vendor profile not found' });
    }

    const status = await refreshConnectAccountStatus(vendor.id);
    res.json({
      success: true,
      data: {
        country: vendor.country,
        eligible: vendor.country === 'US',
        ...(status || {
          accountId: null,
          chargesEnabled: false,
          payoutsEnabled: false,
          detailsSubmitted: false,
          onboardingComplete: false,
        }),
      },
    });
  } catch (error: any) {
    logger.error({ err: error }, 'stripe connect status failed');
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get Stripe Connect status',
    });
  }
});

export default router;
