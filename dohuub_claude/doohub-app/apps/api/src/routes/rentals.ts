import { Router } from 'express';
import { prisma } from '@doohub/database';
import { optionalAuth, authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all rental listings
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const {
      city,
      state,
      propertyType,
      minBedrooms,
      maxBedrooms,
      minPrice,
      maxPrice,
      amenities,
      page = '1',
      limit = '20',
    } = req.query;

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

    if (city) where.city = city;
    if (state) where.state = state;
    if (propertyType) where.propertyType = propertyType;
    if (minBedrooms) where.bedrooms = { gte: parseInt(minBedrooms as string) };
    if (maxBedrooms) where.bedrooms = { ...where.bedrooms, lte: parseInt(maxBedrooms as string) };
    if (minPrice) where.pricePerNight = { gte: parseFloat(minPrice as string) };
    if (maxPrice) where.pricePerNight = { ...where.pricePerNight, lte: parseFloat(maxPrice as string) };
    if (amenities) {
      const amenityList = (amenities as string).split(',');
      where.amenities = { hasEvery: amenityList };
    }

    const listings = await prisma.rentalListing.findMany({
      where,
      include: {
        vendor: {
          include: { categories: true },
        },
        availability: {
          where: {
            date: { gte: new Date() },
            isBooked: false,
          },
          take: 30,
        },
      },
      orderBy: [
        { vendor: { isMichelle: 'desc' } },
        { vendor: { rating: 'desc' } },
      ],
      skip,
      take: limitNum,
    });

    const total = await prisma.rentalListing.count({ where });

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
    console.error('Get rental listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

// Create rental listing (vendor only)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const { 
      title, description, propertyType, address, city, state, zipCode,
      bedrooms, bathrooms, maxGuests, pricePerNight, cleaningFee,
      amenities, rules, images 
    } = req.body;

    if (!title || !propertyType || !pricePerNight) {
      return res.status(400).json({ error: 'Title, type and price are required' });
    }

    const listing = await prisma.rentalListing.create({
      data: {
        vendorId: vendor.id,
        title,
        description: description || '',
        propertyType,
        address: address || '',
        city: city || '',
        state: state || '',
        zipCode: zipCode || '',
        bedrooms: bedrooms || 1,
        bathrooms: bathrooms || 1,
        maxGuests: maxGuests || 2,
        pricePerNight: parseFloat(pricePerNight),
        cleaningFee: cleaningFee ? parseFloat(cleaningFee) : 0,
        amenities: amenities || [],
        rules: rules || [],
        images: images || [],
        status: 'ACTIVE',
      },
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error('Create rental listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get rental listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.rentalListing.findUnique({
      where: { id },
      include: {
        vendor: {
          include: { categories: true, serviceAreas: true },
        },
        availability: {
          where: { date: { gte: new Date() } },
          orderBy: { date: 'asc' },
          take: 90,
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Get rental listing error:', error);
    res.status(500).json({ error: 'Failed to get listing' });
  }
});

// Update rental listing (vendor only)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.rentalListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const { 
      title, description, propertyType, address, city, state, zipCode,
      bedrooms, bathrooms, maxGuests, pricePerNight, cleaningFee,
      amenities, rules, images, status 
    } = req.body;

    const listing = await prisma.rentalListing.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(propertyType && { propertyType }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(zipCode !== undefined && { zipCode }),
        ...(bedrooms && { bedrooms }),
        ...(bathrooms && { bathrooms }),
        ...(maxGuests && { maxGuests }),
        ...(pricePerNight && { pricePerNight: parseFloat(pricePerNight) }),
        ...(cleaningFee !== undefined && { cleaningFee: parseFloat(cleaningFee) }),
        ...(amenities && { amenities }),
        ...(rules && { rules }),
        ...(images && { images }),
        ...(status && { status }),
      },
    });

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Update rental listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete rental listing (vendor only)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.rentalListing.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await prisma.rentalListing.delete({ where: { id } });

    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete rental listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

// Get availability for a rental
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const where: any = { listingId: id };

    if (startDate) {
      where.date = { gte: new Date(startDate as string) };
    }
    if (endDate) {
      where.date = { ...where.date, lte: new Date(endDate as string) };
    }

    const availability = await prisma.rentalAvailability.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    res.json({ success: true, data: availability });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Failed to get availability' });
  }
});

export default router;
