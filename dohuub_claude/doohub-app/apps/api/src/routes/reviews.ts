import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Create review
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { bookingId, rating, comment, photos } = req.body;

    // Verify booking exists and belongs to user
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: req.user!.id,
        status: 'COMPLETED',
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or not completed' });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      return res.status(400).json({ error: 'Review already submitted' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: req.user!.id,
        vendorId: booking.vendorId,
        bookingId,
        rating,
        comment,
        photos: photos || [],
      },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    // Update vendor rating
    const allReviews = await prisma.review.findMany({
      where: { vendorId: booking.vendorId },
      select: { rating: true },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.vendor.update({
      where: { id: booking.vendorId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Get user's reviews
router.get('/my', authenticate, async (req: AuthRequest, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.user!.id },
      include: {
        vendor: true,
        booking: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

// Get vendor's reviews (reviews received by vendor)
router.get('/vendor', authenticate, async (req: AuthRequest, res) => {
  try {
    // Get vendor profile
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const reviews = await prisma.review.findMany({
      where: { vendorId: vendor.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
        booking: {
          select: {
            id: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Get vendor reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

// Vendor reply to review
router.put('/:id/reply', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    // Get vendor profile
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    // Verify review belongs to this vendor
    const review = await prisma.review.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { vendorResponse: response },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Reply to review error:', error);
    res.status(500).json({ error: 'Failed to reply to review' });
  }
});

export default router;

