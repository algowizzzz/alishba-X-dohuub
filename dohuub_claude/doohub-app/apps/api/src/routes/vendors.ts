import { Router } from 'express';
import { prisma } from '@doohub/database';
import { optionalAuth, authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

async function getListingCountsByVendorId(vendorIds: string[]) {
  if (vendorIds.length === 0) return new Map<string, number>();

  const [cleaning, handyman, beauty, rentals, caregiving, groceries] = await Promise.all([
    prisma.cleaningListing.groupBy({ by: ['vendorId'], where: { vendorId: { in: vendorIds } }, _count: { _all: true } }),
    prisma.handymanListing.groupBy({ by: ['vendorId'], where: { vendorId: { in: vendorIds } }, _count: { _all: true } }),
    prisma.beautyListing.groupBy({ by: ['vendorId'], where: { vendorId: { in: vendorIds } }, _count: { _all: true } }),
    prisma.rentalListing.groupBy({ by: ['vendorId'], where: { vendorId: { in: vendorIds } }, _count: { _all: true } }),
    prisma.caregivingListing.groupBy({ by: ['vendorId'], where: { vendorId: { in: vendorIds } }, _count: { _all: true } }),
    prisma.groceryListing.groupBy({ by: ['vendorId'], where: { vendorId: { in: vendorIds } }, _count: { _all: true } }),
  ]);

  const out = new Map<string, number>();
  const merge = (rows: Array<{ vendorId: string; _count: { _all: number } }>) => {
    for (const row of rows) {
      out.set(row.vendorId, (out.get(row.vendorId) || 0) + row._count._all);
    }
  };
  merge(cleaning as any);
  merge(handyman as any);
  merge(beauty as any);
  merge(rentals as any);
  merge(caregiving as any);
  merge(groceries as any);

  return out;
}

async function getRevenueByVendorId(vendorIds: string[]) {
  if (vendorIds.length === 0) return new Map<string, number>();

  const rows = await prisma.booking.groupBy({
    by: ['vendorId'],
    where: { vendorId: { in: vendorIds }, status: 'COMPLETED' as any },
    _sum: { total: true },
  });

  const out = new Map<string, number>();
  for (const row of rows as any) {
    out.set(row.vendorId, row._sum.total || 0);
  }
  return out;
}

// Create vendor profile (for new vendor registration)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user already has a vendor profile
    const existingVendor = await prisma.vendor.findFirst({
      where: { userId },
    });

    if (existingVendor) {
      return res.status(400).json({ error: 'Vendor profile already exists' });
    }

    const {
      businessName,
      description,
      contactEmail,
      contactPhone,
      categories,
      serviceAreas,
      availability,
    } = req.body;

    if (!businessName) {
      return res.status(400).json({ error: 'Business name is required' });
    }

    if (!categories || categories.length === 0) {
      return res.status(400).json({ error: 'At least one category is required' });
    }

    // Create vendor profile
    const vendor = await prisma.vendor.create({
      data: {
        userId,
        businessName,
        description: description || '',
        contactEmail: contactEmail || '',
        contactPhone: contactPhone || '',
        subscriptionStatus: 'TRIAL',
        trialStartedAt: new Date(),
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
        categories: {
          create: categories.map((cat: string) => ({
            category: cat,
            isActive: true,
          })),
        },
        serviceAreas: serviceAreas && serviceAreas.length > 0 ? {
          create: serviceAreas.map((area: string) => ({
            name: area,
            isActive: true,
          })),
        } : undefined,
        availability: availability ? {
          create: Object.entries(availability).map(([day, data]: [string, any]) => {
            // Convert day name or index to integer (0-6)
            const dayMap: Record<string, number> = {
              'SUNDAY': 0, 'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3,
              'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6,
              '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6
            };
            return {
              dayOfWeek: dayMap[day.toUpperCase()] ?? (parseInt(day) || 0),
              isAvailable: data.enabled,
              startTime: data.start,
              endTime: data.end,
            };
          }),
        } : undefined,
      },
      include: {
        categories: true,
        serviceAreas: true,
        availability: true,
      },
    });

    // Update user role to VENDOR
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'VENDOR' },
    });

    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({ error: 'Failed to create vendor profile' });
  }
});

// Get current vendor (for logged-in vendor user)
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vendor = await prisma.vendor.findFirst({
      where: { userId },
      include: {
        categories: true,
        serviceAreas: true,
        availability: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    res.json({ success: true, data: vendor });
  } catch (error) {
    console.error('Get my vendor error:', error);
    res.status(500).json({ error: 'Failed to get vendor profile' });
  }
});

// Admin vendor list w/ derived fields (no mock data needed)
router.get('/admin/summary', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        user: { select: { email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const vendorIds = vendors.map((v: { id: string }) => v.id);
    const [listingCounts, revenues] = await Promise.all([
      getListingCountsByVendorId(vendorIds),
      getRevenueByVendorId(vendorIds),
    ]);

    res.json({
      success: true,
      data: vendors.map((v: any) => ({
        id: v.id,
        businessName: v.businessName,
        email: v.user.email,
        phone: v.user.phone || v.contactPhone || null,
        status: v.isActive ? 'ACTIVE' : 'SUSPENDED',
        isActive: v.isActive,
        subscriptionStatus: v.subscriptionStatus,
        rating: v.rating,
        reviewCount: v.reviewCount,
        listingCount: listingCounts.get(v.id) || 0,
        totalRevenue: revenues.get(v.id) || 0,
        joinedAt: v.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get vendor admin summary error:', error);
    res.status(500).json({ error: 'Failed to get vendor summary' });
  }
});

// Admin vendor detail w/ listing breakdown + counts
router.get('/:id/admin', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        categories: true,
        serviceAreas: true,
        availability: true,
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            profile: true,
          },
        },
      },
    });

    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    const [cleaning, handyman, beauty, groceries, rentals, caregiving, bookingCount, reviewCount] = await Promise.all([
      prisma.cleaningListing.count({ where: { vendorId: id } }),
      prisma.handymanListing.count({ where: { vendorId: id } }),
      prisma.beautyListing.count({ where: { vendorId: id } }),
      prisma.groceryListing.count({ where: { vendorId: id } }),
      prisma.rentalListing.count({ where: { vendorId: id } }),
      prisma.caregivingListing.count({ where: { vendorId: id } }),
      prisma.booking.count({ where: { vendorId: id } }),
      prisma.review.count({ where: { vendorId: id } }),
    ]);

    res.json({
      success: true,
      data: {
        ...vendor,
        listings: { cleaning, handyman, beauty, groceries, rentals, caregiving },
        _count: { bookings: bookingCount, reviews: reviewCount },
      },
    });
  } catch (error) {
    console.error('Get vendor admin detail error:', error);
    res.status(500).json({ error: 'Failed to get vendor' });
  }
});

// Vendor analytics for performance screen
router.get('/me/analytics', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({ where: { userId: req.user!.id } });
    if (!vendor) return res.status(403).json({ error: 'Vendor profile not found' });

    const bookings = await prisma.booking.findMany({
      where: { vendorId: vendor.id },
      include: {
        cleaningListing: { select: { title: true } },
        handymanListing: { select: { title: true } },
        beautyListing: { select: { title: true } },
        rentalListing: { select: { title: true } },
        caregivingListing: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 2000,
    });

    const completed = bookings.filter((b: any) => b.status === 'COMPLETED');
    const totalRevenue = completed.reduce((sum: number, b: any) => sum + (b.total || 0), 0);
    const totalBookings = bookings.length;

    const uniqueCustomers = new Set(bookings.map((b: any) => b.userId)).size;

    const reviews = await prisma.review.findMany({
      where: { vendorId: vendor.id },
      select: { rating: true },
    });
    const reviewCount = reviews.length;
    const averageRating = reviewCount ? reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviewCount : vendor.rating || 0;

    // Monthly series (last 6 months)
    const now = new Date();
    const months: Array<{ key: string; month: string; year: number; revenue: number; bookings: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: d.toLocaleString('en-US', { month: 'short' }),
        year: d.getFullYear(),
        revenue: 0,
        bookings: 0,
      });
    }
    const byKey = new Map(months.map((m) => [m.key, m]));
    for (const b of completed as any[]) {
      const d = new Date((b.completedAt || b.createdAt) as any);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const m = byKey.get(key);
      if (m) {
        m.revenue += b.total || 0;
        m.bookings += 1;
      }
    }

    // Top services (by revenue)
    const serviceAgg = new Map<string, { name: string; bookings: number; revenue: number }>();
    for (const b of completed as any[]) {
      const name =
        b.cleaningListing?.title ||
        b.handymanListing?.title ||
        b.beautyListing?.title ||
        b.rentalListing?.title ||
        b.caregivingListing?.title ||
        b.category;
      const key = name;
      const cur = serviceAgg.get(key) || { name, bookings: 0, revenue: 0 };
      cur.bookings += 1;
      cur.revenue += b.total || 0;
      serviceAgg.set(key, cur);
    }
    const topServices = Array.from(serviceAgg.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((s) => ({ ...s, rating: averageRating }));

    res.json({
      success: true,
      data: {
        metrics: {
          totalRevenue,
          totalBookings,
          uniqueCustomers,
          averageRating,
          reviewCount,
        },
        monthly: months,
        topServices,
      },
    });
  } catch (error) {
    console.error('Get vendor analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Vendor billing history (for subscription page)
router.get('/me/billing-history', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({ where: { userId: req.user!.id } });
    if (!vendor) return res.status(403).json({ error: 'Vendor profile not found' });

    const history = await prisma.billingHistory.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Get billing history error:', error);
    res.status(500).json({ error: 'Failed to get billing history' });
  }
});

// Get vendors by category with Michelle's listings first
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { category, zipCode, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isActive: true,
      subscriptionStatus: { in: ['TRIAL', 'ACTIVE'] },
    };

    if (category) {
      where.categories = {
        some: { category: category as string, isActive: true },
      };
    }

    if (zipCode) {
      where.serviceAreas = {
        some: { zipCodes: { has: zipCode as string }, isActive: true },
      };
    }

    // Get vendors with Michelle's listings first
    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        categories: true,
        serviceAreas: true,
        user: { select: { email: true } },
      },
      orderBy: [
        { isMichelle: 'desc' }, // Michelle's listings first
        { rating: 'desc' },
        { reviewCount: 'desc' },
        { updatedAt: 'desc' },
      ],
      skip,
      take: limitNum,
    });

    const total = await prisma.vendor.count({ where });

    res.json({
      success: true,
      data: vendors,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ error: 'Failed to get vendors' });
  }
});

// Get vendor's own listings (all categories)
router.get('/listings', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    // Fetch all listing types for this vendor
    const [cleaning, handyman, beauty, rentals, caregiving, groceryStores] = await Promise.all([
      prisma.cleaningListing.findMany({ where: { vendorId: vendor.id } }),
      prisma.handymanListing.findMany({ where: { vendorId: vendor.id } }),
      prisma.beautyListing.findMany({ where: { vendorId: vendor.id } }),
      prisma.rentalListing.findMany({ where: { vendorId: vendor.id } }),
      prisma.caregivingListing.findMany({ where: { vendorId: vendor.id } }),
      prisma.groceryListing.findMany({ where: { vendorId: vendor.id } }),
    ]);

    // Normalize into a single array with category info
    const listings = [
      ...cleaning.map((l: any) => ({ ...l, category: 'CLEANING' })),
      ...handyman.map((l: any) => ({ ...l, category: 'HANDYMAN' })),
      ...beauty.map((l: any) => ({ ...l, category: 'BEAUTY' })),
      ...rentals.map((l: any) => ({ ...l, category: 'RENTALS' })),
      ...caregiving.map((l: any) => ({ ...l, category: 'CAREGIVING' })),
      ...groceryStores.map((l: any) => ({ ...l, category: 'GROCERIES' })),
    ];

    res.json({ success: true, data: listings });
  } catch (error) {
    console.error('Get vendor listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

// Get all listings across all vendors (admin only)
router.get('/all-listings', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { category, status, page = '1', limit = '50' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    // Fetch all listing types with vendor info
    const statusFilter = status ? { status: status as any } : {};
    const [cleaning, handyman, beauty, rentals, caregiving, groceryStores] = await Promise.all([
      prisma.cleaningListing.findMany({
        include: { vendor: { select: { id: true, businessName: true, isMichelle: true } } },
        where: statusFilter,
      }),
      prisma.handymanListing.findMany({
        include: { vendor: { select: { id: true, businessName: true, isMichelle: true } } },
        where: statusFilter,
      }),
      prisma.beautyListing.findMany({
        include: { vendor: { select: { id: true, businessName: true, isMichelle: true } } },
        where: statusFilter,
      }),
      prisma.rentalListing.findMany({
        include: { vendor: { select: { id: true, businessName: true, isMichelle: true } } },
        where: statusFilter,
      }),
      prisma.caregivingListing.findMany({
        include: { vendor: { select: { id: true, businessName: true, isMichelle: true } } },
        where: statusFilter,
      }),
      prisma.groceryListing.findMany({
        include: { vendor: { select: { id: true, businessName: true, isMichelle: true } } },
        where: statusFilter,
      }),
    ]);

    // Normalize into a single array with category info
    let listings = [
      ...cleaning.map(l => ({ ...l, category: 'CLEANING' })),
      ...handyman.map(l => ({ ...l, category: 'HANDYMAN' })),
      ...beauty.map(l => ({ ...l, category: 'BEAUTY' })),
      ...rentals.map(l => ({ ...l, category: 'RENTALS' })),
      ...caregiving.map(l => ({ ...l, category: 'CAREGIVING' })),
      ...groceryStores.map(l => ({ ...l, category: 'GROCERIES' })),
    ];

    // Filter by category if specified
    if (category) {
      listings = listings.filter(l => l.category === category);
    }

    // Sort: Michelle's listings first, then by createdAt
    listings.sort((a: any, b: any) => {
      if (a.vendor?.isMichelle && !b.vendor?.isMichelle) return -1;
      if (!a.vendor?.isMichelle && b.vendor?.isMichelle) return 1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    // Paginate
    const total = listings.length;
    const paginatedListings = listings.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      success: true,
      data: paginatedListings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get all listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

// Update vendor profile
router.put('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const { businessName, description, contactEmail, contactPhone, logo, coverImage } = req.body;

    const updated = await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        ...(businessName && { businessName }),
        ...(description !== undefined && { description }),
        ...(contactEmail !== undefined && { contactEmail }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(logo !== undefined && { logo }),
        ...(coverImage !== undefined && { coverImage }),
      },
      include: {
        categories: true,
        serviceAreas: true,
        availability: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({ error: 'Failed to update vendor profile' });
  }
});

// Get vendor by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        categories: true,
        serviceAreas: true,
        availability: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json({ success: true, data: vendor });
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ error: 'Failed to get vendor' });
  }
});

// Update vendor status (admin only) - block/unblock
router.put('/:id/status', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { isActive, subscriptionStatus } = req.body;

    const updateData: any = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (subscriptionStatus) updateData.subscriptionStatus = subscriptionStatus;

    const vendor = await prisma.vendor.update({
      where: { id },
      data: updateData,
      include: {
        categories: true,
        user: { select: { email: true } },
      },
    });

    res.json({ success: true, data: vendor });
  } catch (error) {
    console.error('Update vendor status error:', error);
    res.status(500).json({ error: 'Failed to update vendor status' });
  }
});

// Get vendor reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const reviews = await prisma.review.findMany({
      where: { vendorId: id },
      include: {
        user: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    const total = await prisma.review.count({ where: { vendorId: id } });

    // Get rating distribution
    const ratingStats = await prisma.review.groupBy({
      by: ['rating'],
      where: { vendorId: id },
      _count: { rating: true },
    });

    res.json({
      success: true,
      data: reviews,
      stats: {
        ratingDistribution: ratingStats,
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get vendor reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

export default router;

