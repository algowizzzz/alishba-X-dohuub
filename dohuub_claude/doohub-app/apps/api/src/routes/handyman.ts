import { Router } from 'express';
import { prisma } from '@doohub/database';
import { optionalAuth, authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all handyman listings
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { type, zipCode, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      status: 'ACTIVE',
      vendor: {
        isActive: true,
        subscriptionStatus: { in: ['TRIAL', 'ACTIVE'] },
      },
    };

    if (type) {
      where.handymanType = type;
    }

    if (zipCode) {
      where.vendor.serviceAreas = {
        some: { zipCodes: { has: zipCode as string }, isActive: true },
      };
    }

    const listings = await prisma.handymanListing.findMany({
      where,
      include: {
        vendor: {
          include: { categories: true, serviceAreas: true },
        },
      },
      orderBy: [
        { vendor: { isMichelle: 'desc' } },
        { vendor: { rating: 'desc' } },
        { vendor: { reviewCount: 'desc' } },
      ],
      skip,
      take: limitNum,
    });

    const total = await prisma.handymanListing.count({ where });

    res.json({
      success: true,
      data: listings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get handyman listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

// Create handyman listing (vendor only)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const { title, description, handymanType, basePrice, hourlyRate, services, images } = req.body;

    if (!title || !handymanType || !basePrice) {
      return res.status(400).json({ error: 'Title, type and price are required' });
    }

    const listing = await prisma.handymanListing.create({
      data: {
        vendorId: vendor.id,
        title,
        description: description || '',
        handymanType,
        basePrice: parseFloat(basePrice),
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : parseFloat(basePrice),
        services: services || [],
        images: images || [],
        status: 'ACTIVE',
      },
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error('Create handyman listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get handyman listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.handymanListing.findUnique({
      where: { id },
      include: {
        vendor: {
          include: {
            categories: true,
            serviceAreas: true,
            availability: true,
          },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Get handyman listing error:', error);
    res.status(500).json({ error: 'Failed to get listing' });
  }
});

// Update handyman listing (vendor only)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.handymanListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const { title, description, handymanType, basePrice, hourlyRate, services, images, status } = req.body;

    const listing = await prisma.handymanListing.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(handymanType && { handymanType }),
        ...(basePrice && { basePrice: parseFloat(basePrice) }),
        ...(hourlyRate && { hourlyRate: parseFloat(hourlyRate) }),
        ...(services && { services }),
        ...(images && { images }),
        ...(status && { status }),
      },
    });

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Update handyman listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete handyman listing (vendor only)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.handymanListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await prisma.handymanListing.delete({ where: { id } });

    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete handyman listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

export default router;
