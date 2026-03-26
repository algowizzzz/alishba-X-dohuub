import { Router } from 'express';
import { prisma } from '@doohub/database';
import { optionalAuth, authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all grocery listings
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { category, vendorId, zipCode, inStock, page = '1', limit = '20' } = req.query;

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

    if (category) {
      where.category = category;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (inStock === 'true') {
      where.inStock = true;
    }

    if (zipCode) {
      where.vendor.serviceAreas = {
        some: { zipCodes: { has: zipCode as string }, isActive: true },
      };
    }

    const listings = await prisma.groceryListing.findMany({
      where,
      include: {
        vendor: {
          include: { categories: true, serviceAreas: true },
        },
      },
      orderBy: [
        { vendor: { isMichelle: 'desc' } },
        { vendor: { rating: 'desc' } },
      ],
      skip,
      take: limitNum,
    });

    const total = await prisma.groceryListing.count({ where });

    // Get unique categories
    const categories = await prisma.groceryListing.findMany({
      where: { status: 'ACTIVE' },
      select: { category: true },
      distinct: ['category'],
    });

    res.json({
      success: true,
      data: listings,
      categories: categories.map(c => c.category),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get grocery listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

// Create grocery listing (vendor only)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const { name, description, category, price, unit, image, inStock, stockCount, status } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: 'name, category and price are required' });
    }

    const listing = await prisma.groceryListing.create({
      data: {
        vendorId: vendor.id,
        name,
        description: description || 'No description provided',
        category,
        price: parseFloat(price),
        unit: unit || 'each',
        image: image || null,
        inStock: inStock !== undefined ? !!inStock : true,
        stockCount: stockCount !== undefined ? parseInt(stockCount) : null,
        status: status || 'ACTIVE',
      },
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error('Create grocery listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get grocery vendors (MUST be before /:id)
router.get('/vendors/list', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { zipCode } = req.query;

    const where: any = {
      isActive: true,
      subscriptionStatus: { in: ['TRIAL', 'ACTIVE'] },
      categories: {
        some: { category: 'GROCERIES', isActive: true },
      },
    };

    if (zipCode) {
      where.serviceAreas = {
        some: { zipCodes: { has: zipCode as string }, isActive: true },
      };
    }

    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        categories: true,
        serviceAreas: true,
        groceryListings: {
          where: { status: 'ACTIVE' },
          take: 5,
        },
      },
      orderBy: [
        { isMichelle: 'desc' },
        { rating: 'desc' },
        { reviewCount: 'desc' },
      ],
    });

    res.json({ success: true, data: vendors });
  } catch (error) {
    console.error('Get grocery vendors error:', error);
    res.status(500).json({ error: 'Failed to get vendors' });
  }
});

// Get grocery listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.groceryListing.findUnique({
      where: { id },
      include: {
        vendor: {
          include: { categories: true, serviceAreas: true },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Get grocery listing error:', error);
    res.status(500).json({ error: 'Failed to get listing' });
  }
});

// Update grocery listing (vendor only)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.groceryListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const { name, description, category, price, unit, image, inStock, stockCount, status } = req.body;

    const listing = await prisma.groceryListing.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(unit !== undefined && { unit }),
        ...(image !== undefined && { image }),
        ...(inStock !== undefined && { inStock: !!inStock }),
        ...(stockCount !== undefined && { stockCount: stockCount === null ? null : parseInt(stockCount) }),
        ...(status && { status }),
      },
    });

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Update grocery listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete grocery listing (vendor only)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.groceryListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await prisma.groceryListing.delete({ where: { id } });

    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete grocery listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

export default router;

