import { Router } from 'express';
import { prisma } from '@doohub/database';
import { optionalAuth, authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all caregiving listings
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
      where.caregivingType = type;
    }

    if (zipCode) {
      where.serviceArea = { has: zipCode as string };
    }

    const listings = await prisma.caregivingListing.findMany({
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

    const total = await prisma.caregivingListing.count({ where });

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
    console.error('Get caregiving listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

// Create caregiving listing (vendor only)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const { 
      title, description, caregivingType, basePrice, 
      services, qualifications, serviceArea, images 
    } = req.body;

    if (!title || !caregivingType || !basePrice) {
      return res.status(400).json({ error: 'Title, type and price are required' });
    }

    const listing = await prisma.caregivingListing.create({
      data: {
        vendorId: vendor.id,
        title,
        description: description || '',
        caregivingType,
        basePrice: parseFloat(basePrice),
        services: services || [],
        qualifications: qualifications || [],
        serviceArea: serviceArea || [],
        images: images || [],
        status: 'ACTIVE',
      },
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error('Create caregiving listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get caregiving listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.caregivingListing.findUnique({
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
    console.error('Get caregiving listing error:', error);
    res.status(500).json({ error: 'Failed to get listing' });
  }
});

// Update caregiving listing (vendor only)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.caregivingListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const { 
      title, description, caregivingType, basePrice, 
      services, qualifications, serviceArea, images, status 
    } = req.body;

    const listing = await prisma.caregivingListing.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(caregivingType && { caregivingType }),
        ...(basePrice && { basePrice: parseFloat(basePrice) }),
        ...(services && { services }),
        ...(qualifications && { qualifications }),
        ...(serviceArea && { serviceArea }),
        ...(images && { images }),
        ...(status && { status }),
      },
    });

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Update caregiving listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete caregiving listing (vendor only)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.caregivingListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await prisma.caregivingListing.delete({ where: { id } });

    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete caregiving listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

export default router;
