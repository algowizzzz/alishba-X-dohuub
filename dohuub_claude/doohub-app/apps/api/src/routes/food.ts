import { Router } from 'express';
import { prisma } from '@doohub/database';
import { optionalAuth, authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all food listings (restaurant/prepared food)
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { category, vendorId, storeId, cuisine, page = '1', limit = '20' } = req.query;

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

    if (cuisine) {
      where.cuisines = { has: cuisine as string };
    }

    const listings = await prisma.foodListing.findMany({
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

    const total = await prisma.foodListing.count({ where });

    // Get unique categories
    const categories = await prisma.foodListing.findMany({
      where: { status: 'ACTIVE' },
      select: { category: true },
      distinct: ['category'],
    });

    // Get unique cuisines
    const allCuisines = await prisma.foodListing.findMany({
      where: { status: 'ACTIVE' },
      select: { cuisines: true },
    });
    const uniqueCuisines = [...new Set(allCuisines.flatMap(l => l.cuisines))];

    res.json({
      success: true,
      data: listings,
      categories: categories.map(c => c.category),
      cuisines: uniqueCuisines,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get food listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

// Create food listing (vendor only)
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
      cuisines,
      category,
      portionSize,
      quantityAmount,
      quantityUnit,
      price,
      image,
      restaurantName,
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

    const listing = await prisma.foodListing.create({
      data: {
        vendorId: vendor.id,
        storeId: storeId || null,
        name,
        description: description || 'No description provided',
        cuisines: cuisines || [],
        category,
        portionSize: portionSize || null,
        quantityAmount: quantityAmount ? parseFloat(quantityAmount) : null,
        quantityUnit: quantityUnit || null,
        price: parseFloat(price),
        image: image || null,
        restaurantName: restaurantName || null,
        status: status || 'ACTIVE',
      },
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error('Create food listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get food vendors (MUST be before /:id)
router.get('/vendors/list', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { zipCode } = req.query;

    const where: any = {
      isActive: true,
      subscriptionStatus: { in: ['TRIAL', 'ACTIVE'] },
      categories: {
        some: { category: 'FOOD', isActive: true },
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
        foodListings: {
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
    console.error('Get food vendors error:', error);
    res.status(500).json({ error: 'Failed to get vendors' });
  }
});

// Get food listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.foodListing.findUnique({
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
    console.error('Get food listing error:', error);
    res.status(500).json({ error: 'Failed to get listing' });
  }
});

// Update food listing (vendor only)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.foodListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const {
      storeId,
      name,
      description,
      cuisines,
      category,
      portionSize,
      quantityAmount,
      quantityUnit,
      price,
      image,
      restaurantName,
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

    const listing = await prisma.foodListing.update({
      where: { id },
      data: {
        ...(storeId !== undefined && { storeId }),
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(cuisines !== undefined && { cuisines }),
        ...(category && { category }),
        ...(portionSize !== undefined && { portionSize }),
        ...(quantityAmount !== undefined && { quantityAmount: quantityAmount ? parseFloat(quantityAmount) : null }),
        ...(quantityUnit !== undefined && { quantityUnit }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(image !== undefined && { image }),
        ...(restaurantName !== undefined && { restaurantName }),
        ...(status && { status }),
      },
    });

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Update food listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete food listing (vendor only)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.foodListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await prisma.foodListing.delete({ where: { id } });

    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete food listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

export default router;
