import { Router } from 'express';
import { prisma } from '@doohub/database';
import { optionalAuth, authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all beauty product listings
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { category, vendorId, storeId, brand, inStock, page = '1', limit = '20' } = req.query;

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

    if (storeId) {
      where.storeId = storeId;
    }

    if (brand) {
      where.brand = { contains: brand as string, mode: 'insensitive' };
    }

    if (inStock === 'true') {
      where.inStock = true;
    }

    const listings = await prisma.beautyProductListing.findMany({
      where,
      include: {
        vendor: {
          include: { categories: true, serviceAreas: true },
        },
        store: true,
      },
      orderBy: [
        { vendor: { isMichelle: 'desc' } },
        { vendor: { rating: 'desc' } },
      ],
      skip,
      take: limitNum,
    });

    const total = await prisma.beautyProductListing.count({ where });

    // Get unique categories
    const categories = await prisma.beautyProductListing.findMany({
      where: { status: 'ACTIVE' },
      select: { category: true },
      distinct: ['category'],
    });

    // Get unique brands
    const brands = await prisma.beautyProductListing.findMany({
      where: { status: 'ACTIVE', brand: { not: null } },
      select: { brand: true },
      distinct: ['brand'],
    });

    res.json({
      success: true,
      data: listings,
      categories: categories.map(c => c.category),
      brands: brands.map(b => b.brand).filter(Boolean),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get beauty product listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

// Create beauty product listing (vendor only)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const {
      storeId,
      name,
      description,
      category,
      brand,
      price,
      quantityAmount,
      quantityUnit,
      image,
      inStock,
      stockCount,
      status,
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: 'name, category and price are required' });
    }

    // Validate storeId belongs to vendor if provided
    if (storeId) {
      const store = await prisma.vendorStore.findFirst({
        where: { id: storeId, vendorId: vendor.id },
      });
      if (!store) {
        return res.status(400).json({ error: 'Invalid store ID' });
      }
    }

    const listing = await prisma.beautyProductListing.create({
      data: {
        vendorId: vendor.id,
        storeId: storeId || null,
        name,
        description: description || 'No description provided',
        category,
        brand: brand || null,
        price: parseFloat(price),
        quantityAmount: quantityAmount ? parseFloat(quantityAmount) : null,
        quantityUnit: quantityUnit || null,
        image: image || null,
        inStock: inStock !== undefined ? !!inStock : true,
        stockCount: stockCount !== undefined ? parseInt(stockCount) : null,
        status: status || 'ACTIVE',
      },
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error('Create beauty product listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get beauty product vendors (MUST be before /:id)
router.get('/vendors/list', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { zipCode } = req.query;

    const where: any = {
      isActive: true,
      subscriptionStatus: { in: ['TRIAL', 'ACTIVE'] },
      categories: {
        some: { category: 'BEAUTY_PRODUCTS', isActive: true },
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
        beautyProductListings: {
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
    console.error('Get beauty product vendors error:', error);
    res.status(500).json({ error: 'Failed to get vendors' });
  }
});

// Get beauty product listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.beautyProductListing.findUnique({
      where: { id },
      include: {
        vendor: {
          include: { categories: true, serviceAreas: true },
        },
        store: true,
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Get beauty product listing error:', error);
    res.status(500).json({ error: 'Failed to get listing' });
  }
});

// Update beauty product listing (vendor only)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.beautyProductListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const {
      storeId,
      name,
      description,
      category,
      brand,
      price,
      quantityAmount,
      quantityUnit,
      image,
      inStock,
      stockCount,
      status,
    } = req.body;

    // Validate storeId if provided
    if (storeId) {
      const store = await prisma.vendorStore.findFirst({
        where: { id: storeId, vendorId: vendor.id },
      });
      if (!store) {
        return res.status(400).json({ error: 'Invalid store ID' });
      }
    }

    const listing = await prisma.beautyProductListing.update({
      where: { id },
      data: {
        ...(storeId !== undefined && { storeId }),
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(brand !== undefined && { brand }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(quantityAmount !== undefined && { quantityAmount: quantityAmount ? parseFloat(quantityAmount) : null }),
        ...(quantityUnit !== undefined && { quantityUnit }),
        ...(image !== undefined && { image }),
        ...(inStock !== undefined && { inStock: !!inStock }),
        ...(stockCount !== undefined && { stockCount: stockCount === null ? null : parseInt(stockCount) }),
        ...(status && { status }),
      },
    });

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Update beauty product listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete beauty product listing (vendor only)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.beautyProductListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await prisma.beautyProductListing.delete({ where: { id } });

    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete beauty product listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

export default router;
