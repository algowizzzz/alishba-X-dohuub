import { Router } from 'express';
import { prisma } from '@doohub/database';
import { optionalAuth, authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all cleaning listings with Michelle's first
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
      where.cleaningType = type;
    }

    if (zipCode) {
      where.vendor.serviceAreas = {
        some: { zipCodes: { has: zipCode as string }, isActive: true },
      };
    }

    const listings = await prisma.cleaningListing.findMany({
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

    const total = await prisma.cleaningListing.count({ where });

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
    console.error('Get cleaning listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

// Create cleaning listing (vendor only)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const { title, description, cleaningType, basePrice, duration, includes, extras, images } = req.body;

    if (!title || !cleaningType || !basePrice) {
      return res.status(400).json({ error: 'Title, type and price are required' });
    }

    const listing = await prisma.cleaningListing.create({
      data: {
        vendorId: vendor.id,
        title,
        description: description || 'No description provided',
        cleaningType,
        basePrice: parseFloat(basePrice),
        duration: duration || 120,
        images: images || [],
        status: 'ACTIVE',
      },
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error('Create cleaning listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get cleaning listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.cleaningListing.findUnique({
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
    console.error('Get cleaning listing error:', error);
    res.status(500).json({ error: 'Failed to get listing' });
  }
});

// Update cleaning listing (vendor only)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    // Verify listing belongs to vendor
    const existing = await prisma.cleaningListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const { title, description, cleaningType, basePrice, duration, includes, extras, images, status } = req.body;

    const listing = await prisma.cleaningListing.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(cleaningType && { cleaningType }),
        ...(basePrice && { basePrice: parseFloat(basePrice) }),
        ...(duration && { duration }),
        ...(includes && { includes }),
        ...(extras && { extras }),
        ...(images && { images }),
        ...(status && { status }),
      },
    });

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Update cleaning listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete cleaning listing (vendor only)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    // Verify listing belongs to vendor
    const existing = await prisma.cleaningListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await prisma.cleaningListing.delete({ where: { id } });

    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete cleaning listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

export default router;

