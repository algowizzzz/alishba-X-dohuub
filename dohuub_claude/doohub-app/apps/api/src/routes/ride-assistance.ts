import { Router } from 'express';
import { prisma } from '@doohub/database';
import { optionalAuth, authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all ride assistance listings
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { vendorId, storeId, coverageArea, vehicleType, page = '1', limit = '20' } = req.query;

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

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (storeId) {
      where.storeId = storeId;
    }

    if (coverageArea) {
      where.coverageArea = { contains: coverageArea as string, mode: 'insensitive' };
    }

    if (vehicleType) {
      where.vehicleTypes = { has: vehicleType as string };
    }

    const listings = await prisma.rideAssistanceListing.findMany({
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

    const total = await prisma.rideAssistanceListing.count({ where });

    // Get unique coverage areas
    const coverageAreas = await prisma.rideAssistanceListing.findMany({
      where: { status: 'ACTIVE', coverageArea: { not: null } },
      select: { coverageArea: true },
      distinct: ['coverageArea'],
    });

    // Get unique vehicle types
    const allVehicleTypes = await prisma.rideAssistanceListing.findMany({
      where: { status: 'ACTIVE' },
      select: { vehicleTypes: true },
    });
    const uniqueVehicleTypes = [...new Set(allVehicleTypes.flatMap(l => l.vehicleTypes))];

    res.json({
      success: true,
      data: listings,
      coverageAreas: coverageAreas.map(c => c.coverageArea).filter(Boolean),
      vehicleTypes: uniqueVehicleTypes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get ride assistance listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

// Create ride assistance listing (vendor only)
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
      title,
      description,
      longDescription,
      hourlyRate,
      image,
      images,
      vehicleTypes,
      specialFeatures,
      coverageArea,
      totalSeats,
      status,
    } = req.body;

    if (!title || hourlyRate === undefined) {
      return res.status(400).json({ error: 'title and hourlyRate are required' });
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

    const listing = await prisma.rideAssistanceListing.create({
      data: {
        vendorId: vendor.id,
        storeId: storeId || null,
        title,
        description: description || 'No description provided',
        longDescription: longDescription || null,
        hourlyRate: parseFloat(hourlyRate),
        image: image || null,
        images: images || [],
        vehicleTypes: vehicleTypes || [],
        specialFeatures: specialFeatures || null,
        coverageArea: coverageArea || null,
        totalSeats: totalSeats ? parseInt(totalSeats) : null,
        status: status || 'ACTIVE',
      },
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error('Create ride assistance listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get ride assistance vendors (MUST be before /:id)
router.get('/vendors/list', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { zipCode } = req.query;

    const where: any = {
      isActive: true,
      subscriptionStatus: { in: ['TRIAL', 'ACTIVE'] },
      categories: {
        some: { category: 'RIDE_ASSISTANCE', isActive: true },
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
        rideAssistanceListings: {
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
    console.error('Get ride assistance vendors error:', error);
    res.status(500).json({ error: 'Failed to get vendors' });
  }
});

// Get ride assistance listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.rideAssistanceListing.findUnique({
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
    console.error('Get ride assistance listing error:', error);
    res.status(500).json({ error: 'Failed to get listing' });
  }
});

// Update ride assistance listing (vendor only)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.rideAssistanceListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const {
      storeId,
      title,
      description,
      longDescription,
      hourlyRate,
      image,
      images,
      vehicleTypes,
      specialFeatures,
      coverageArea,
      totalSeats,
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

    const listing = await prisma.rideAssistanceListing.update({
      where: { id },
      data: {
        ...(storeId !== undefined && { storeId }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(longDescription !== undefined && { longDescription }),
        ...(hourlyRate !== undefined && { hourlyRate: parseFloat(hourlyRate) }),
        ...(image !== undefined && { image }),
        ...(images !== undefined && { images }),
        ...(vehicleTypes !== undefined && { vehicleTypes }),
        ...(specialFeatures !== undefined && { specialFeatures }),
        ...(coverageArea !== undefined && { coverageArea }),
        ...(totalSeats !== undefined && { totalSeats: totalSeats ? parseInt(totalSeats) : null }),
        ...(status && { status }),
      },
    });

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Update ride assistance listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete ride assistance listing (vendor only)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.rideAssistanceListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await prisma.rideAssistanceListing.delete({ where: { id } });

    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete ride assistance listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

export default router;
