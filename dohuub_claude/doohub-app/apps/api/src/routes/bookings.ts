import { Router } from 'express';
import { prisma, BookingStatus } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const SERVICE_FEE_PERCENTAGE = 0.08; // 8% service fee

// Get user's bookings
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId: req.user!.id };
    if (status) where.status = status;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        vendor: true,
        address: true,
        cleaningListing: true,
        handymanListing: true,
        beautyListing: true,
        rentalListing: true,
        caregivingListing: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    const total = await prisma.booking.count({ where });

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

// Get vendor's orders - MUST be before /:id to avoid route conflict
router.get('/vendor', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;

    // Get vendor profile for current user
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { vendorId: vendor.id };
    if (status && status !== 'ALL') where.status = status;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            profile: true,
          },
        },
        address: true,
        cleaningListing: true,
        handymanListing: true,
        beautyListing: true,
        rentalListing: true,
        caregivingListing: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    const total = await prisma.booking.count({ where });

    // Get counts by status
    const statusCounts = await prisma.booking.groupBy({
      by: ['status'],
      where: { vendorId: vendor.id },
      _count: { status: true },
    });

    res.json({
      success: true,
      data: bookings,
      counts: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get vendor bookings error:', error);
    res.status(500).json({ error: 'Failed to get vendor orders' });
  }
});

// Get booking by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findFirst({
      where: { id, userId: req.user!.id },
      include: {
        vendor: true,
        address: true,
        cleaningListing: true,
        handymanListing: true,
        beautyListing: true,
        rentalListing: true,
        caregivingListing: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
        transaction: true,
        review: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to get booking' });
  }
});

// Create booking
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const {
      vendorId,
      addressId,
      category,
      listingId,
      scheduledDate,
      scheduledTime,
      duration,
      specialInstructions,
      // Caregiving specific
      pickupLocation,
      dropoffLocation,
      stops,
      isRoundTrip,
    } = req.body;

    // Get the listing to calculate price
    let listing: any;
    let listingField: string;
    let subtotal = 0;

    switch (category) {
      case 'CLEANING':
        listing = await prisma.cleaningListing.findUnique({ where: { id: listingId } });
        listingField = 'cleaningListingId';
        subtotal = listing?.basePrice || 0;
        break;
      case 'HANDYMAN':
        listing = await prisma.handymanListing.findUnique({ where: { id: listingId } });
        listingField = 'handymanListingId';
        subtotal = (listing?.basePrice || 0) * (duration ? duration / 60 : 1);
        break;
      case 'BEAUTY':
        listing = await prisma.beautyListing.findUnique({ where: { id: listingId } });
        listingField = 'beautyListingId';
        subtotal = listing?.basePrice || 0;
        break;
      case 'RENTALS':
        listing = await prisma.rentalListing.findUnique({ where: { id: listingId } });
        listingField = 'rentalListingId';
        subtotal = (listing?.pricePerNight || 0) * (duration || 1);
        break;
      case 'CAREGIVING':
        listing = await prisma.caregivingListing.findUnique({ where: { id: listingId } });
        listingField = 'caregivingListingId';
        subtotal = listing?.basePrice || 0;
        if (isRoundTrip) subtotal *= 2;
        break;
      default:
        return res.status(400).json({ error: 'Invalid category' });
    }

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const serviceFee = subtotal * SERVICE_FEE_PERCENTAGE;
    const total = subtotal + serviceFee;

    const booking = await prisma.booking.create({
      data: {
        userId: req.user!.id,
        vendorId,
        addressId,
        category,
        [listingField]: listingId,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        duration,
        specialInstructions,
        pickupLocation,
        dropoffLocation,
        stops: stops || [],
        isRoundTrip: isRoundTrip || false,
        subtotal,
        serviceFee,
        total,
        status: 'PENDING',
        statusHistory: {
          create: { status: 'PENDING' },
        },
      },
      include: {
        vendor: true,
        address: true,
        cleaningListing: true,
        handymanListing: true,
        beautyListing: true,
        rentalListing: true,
        caregivingListing: true,
      },
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Cancel booking
router.post('/:id/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await prisma.booking.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (['COMPLETED', 'CANCELLED'].includes(booking.status)) {
      return res.status(400).json({ error: 'Booking cannot be cancelled' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: reason,
        statusHistory: {
          create: { status: 'CANCELLED', note: reason },
        },
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Update booking status (vendor action)
router.put('/:id/status', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    // Get vendor profile
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    // Verify booking belongs to this vendor
    const booking = await prisma.booking.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      PENDING: ['ACCEPTED', 'DECLINED'],
      ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      return res.status(400).json({ 
        error: `Cannot transition from ${booking.status} to ${status}` 
      });
    }

    const updateData: any = {
      status,
      statusHistory: {
        create: { status, note },
      },
    };

    if (status === 'ACCEPTED') {
      updateData.acceptedAt = new Date();
    } else if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    } else if (status === 'CANCELLED' || status === 'DECLINED') {
      updateData.cancelledAt = new Date();
      updateData.cancellationReason = note;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            profile: true,
          },
        },
        address: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

export default router;

