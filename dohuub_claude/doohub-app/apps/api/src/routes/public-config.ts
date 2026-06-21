import { Router } from 'express';
import { prisma } from '@doohub/database';

const router = Router();

router.get('/faqs', async (_req, res) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isPublished: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, data: faqs });
  } catch (e: any) {
    console.error('Public FAQs error:', e);
    res.status(500).json({ error: 'Failed to load FAQs' });
  }
});

router.get('/subscription-plans', async (_req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ success: true, data: plans });
  } catch (e: any) {
    console.error('Public plans error:', e);
    res.status(500).json({ error: 'Failed to load plans' });
  }
});

router.get('/about', async (_req, res) => {
  try {
    const s = await prisma.platformSettings.findFirst();
    if (!s) return res.json({ success: true, data: null });
    res.json({
      success: true,
      data: {
        platformName: s.platformName,
        mission: s.mission,
        serviceOffers: s.serviceOffers,
        benefitPoints: s.benefitPoints,
        supportEmail: s.supportEmail,
        supportPhone: s.supportPhone,
        phoneNumeric: s.phoneNumeric,
        addressLine1: s.addressLine1,
        addressLine2: s.addressLine2,
        website: s.website,
        socialInstagram: s.socialInstagram,
        socialFacebook: s.socialFacebook,
        socialTwitter: s.socialTwitter,
        socialLinkedin: s.socialLinkedin,
      },
    });
  } catch (e: any) {
    console.error('Public about error:', e);
    res.status(500).json({ error: 'Failed to load about info' });
  }
});

export default router;
