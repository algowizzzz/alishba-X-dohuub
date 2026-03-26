import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// ========================================
// MICHELLE PROFILES MANAGEMENT
// ========================================

// Get all Michelle profiles
router.get('/michelle-profiles', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, category, page = '1', limit = '20', search } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isMichelle: true };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { businessName: { contains: search as string, mode: 'insensitive' } },
        { user: { email: { contains: search as string, mode: 'insensitive' } } },
        { user: { profile: { firstName: { contains: search as string, mode: 'insensitive' } } } },
        { user: { profile: { lastName: { contains: search as string, mode: 'insensitive' } } } },
      ];
    }

    const profiles = await prisma.vendor.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
        stores: {
          include: {
            regions: { include: { region: true } },
            _count: {
              select: {
                foodListings: true,
                beautyProductListings: true,
                cleaningListings: true,
                handymanListings: true,
                beautyListings: true,
                groceryListings: true,
                rentalListings: true,
                rideAssistanceListings: true,
                companionshipListings: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookings: true,
            orders: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    const total = await prisma.vendor.count({ where });

    res.json({
      success: true,
      data: profiles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get Michelle profiles error:', error);
    res.status(500).json({ error: 'Failed to get Michelle profiles' });
  }
});

// Create Michelle profile
router.post('/michelle-profiles', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { email, firstName, lastName, businessName, description, logo, phone } = req.body;

    if (!email || !businessName) {
      return res.status(400).json({ error: 'email and businessName are required' });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Check if already a Michelle profile
      const existingVendor = await prisma.vendor.findFirst({
        where: { userId: user.id, isMichelle: true },
      });

      if (existingVendor) {
        return res.status(400).json({ error: 'Michelle profile already exists for this email' });
      }
    }

    // Create user and vendor in transaction
    const result = await prisma.$transaction(async (tx) => {
      if (!user) {
        user = await tx.user.create({
          data: {
            email,
            role: 'VENDOR',
            isEmailVerified: true,
            profile: {
              create: {
                firstName: firstName || '',
                lastName: lastName || '',
              },
            },
          },
        });
      }

      const vendor = await tx.vendor.create({
        data: {
          userId: user.id,
          businessName,
          description: description || null,
          logo: logo || null,
          contactPhone: phone || null,
          isMichelle: true,
          status: 'APPROVED',
        },
        include: {
          user: {
            select: { id: true, email: true, profile: true },
          },
        },
      });

      return vendor;
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Create Michelle profile error:', error);
    res.status(500).json({ error: 'Failed to create Michelle profile' });
  }
});

// Get Michelle profile by ID
router.get('/michelle-profiles/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const profile = await prisma.vendor.findFirst({
      where: { id, isMichelle: true },
      include: {
        user: {
          select: { id: true, email: true, phone: true, profile: true },
        },
        stores: {
          include: {
            regions: { include: { region: true } },
          },
        },
        serviceAreas: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, email: true, profile: true } } },
        },
        _count: {
          select: {
            bookings: true,
            orders: true,
            reviews: true,
            cleaningListings: true,
            handymanListings: true,
            beautyListings: true,
            groceryListings: true,
            rentalListings: true,
            foodListings: true,
            beautyProductListings: true,
            rideAssistanceListings: true,
            companionshipListings: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Michelle profile not found' });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Get Michelle profile error:', error);
    res.status(500).json({ error: 'Failed to get Michelle profile' });
  }
});

// Update Michelle profile
router.put('/michelle-profiles/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { businessName, description, logo, phone, status, firstName, lastName } = req.body;

    const existing = await prisma.vendor.findFirst({
      where: { id, isMichelle: true },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Michelle profile not found' });
    }

    const profile = await prisma.$transaction(async (tx) => {
      // Update vendor
      const vendor = await tx.vendor.update({
        where: { id },
        data: {
          ...(businessName && { businessName }),
          ...(description !== undefined && { description }),
          ...(logo !== undefined && { logo }),
          ...(phone !== undefined && { phone }),
          ...(status && { status }),
        },
        include: {
          user: { select: { id: true, email: true, profile: true } },
        },
      });

      // Update user profile if provided
      if (firstName !== undefined || lastName !== undefined) {
        await tx.userProfile.updateMany({
          where: { userId: vendor.userId },
          data: {
            ...(firstName !== undefined && { firstName }),
            ...(lastName !== undefined && { lastName }),
          },
        });
      }

      return vendor;
    });

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Update Michelle profile error:', error);
    res.status(500).json({ error: 'Failed to update Michelle profile' });
  }
});

// Delete Michelle profile
router.delete('/michelle-profiles/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.vendor.findFirst({
      where: { id, isMichelle: true },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Michelle profile not found' });
    }

    // Soft delete - set status to SUSPENDED
    await prisma.vendor.update({
      where: { id },
      data: { status: 'SUSPENDED' },
    });

    res.json({ success: true, message: 'Michelle profile deleted' });
  } catch (error) {
    console.error('Delete Michelle profile error:', error);
    res.status(500).json({ error: 'Failed to delete Michelle profile' });
  }
});

// Get Michelle profile listings
router.get('/michelle-profiles/:id/listings', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { type, status, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const profile = await prisma.vendor.findFirst({
      where: { id, isMichelle: true },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Michelle profile not found' });
    }

    // Collect all listings by type
    const listings: any[] = [];
    const where: any = { vendorId: id };

    if (status) {
      where.status = status;
    }

    // Get listings from each type
    const listingPromises = [
      prisma.cleaningListing.findMany({ where, include: { vendor: true } }).then(l => l.map(i => ({ ...i, type: 'CLEANING' }))),
      prisma.handymanListing.findMany({ where, include: { vendor: true } }).then(l => l.map(i => ({ ...i, type: 'HANDYMAN' }))),
      prisma.beautyListing.findMany({ where, include: { vendor: true } }).then(l => l.map(i => ({ ...i, type: 'BEAUTY' }))),
      prisma.groceryListing.findMany({ where, include: { vendor: true } }).then(l => l.map(i => ({ ...i, type: 'GROCERY' }))),
      prisma.rentalListing.findMany({ where, include: { vendor: true } }).then(l => l.map(i => ({ ...i, type: 'RENTAL' }))),
      prisma.foodListing.findMany({ where, include: { vendor: true } }).then(l => l.map(i => ({ ...i, type: 'FOOD' }))),
      prisma.beautyProductListing.findMany({ where, include: { vendor: true } }).then(l => l.map(i => ({ ...i, type: 'BEAUTY_PRODUCT' }))),
      prisma.rideAssistanceListing.findMany({ where, include: { vendor: true } }).then(l => l.map(i => ({ ...i, type: 'RIDE_ASSISTANCE' }))),
      prisma.companionshipListing.findMany({ where, include: { vendor: true } }).then(l => l.map(i => ({ ...i, type: 'COMPANIONSHIP' }))),
    ];

    const allListings = await Promise.all(listingPromises);
    let combinedListings = allListings.flat();

    // Filter by type if specified
    if (type) {
      combinedListings = combinedListings.filter(l => l.type === type);
    }

    // Sort by createdAt
    combinedListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate
    const total = combinedListings.length;
    const paginatedListings = combinedListings.slice((pageNum - 1) * limitNum, pageNum * limitNum);

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
    console.error('Get Michelle listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

// Get Michelle profile analytics
router.get('/michelle-profiles/:id/analytics', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { dateRange = '30days' } = req.query;

    const profile = await prisma.vendor.findFirst({
      where: { id, isMichelle: true },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Michelle profile not found' });
    }

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case '7days':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
    }

    // Get bookings in date range
    const bookings = await prisma.booking.findMany({
      where: {
        vendorId: id,
        createdAt: { gte: startDate },
      },
    });

    // Get orders in date range
    const orders = await prisma.order.findMany({
      where: {
        vendorId: id,
        createdAt: { gte: startDate },
      },
    });

    // Calculate metrics
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === 'COMPLETED').length;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

    // Get reviews
    const reviews = await prisma.review.findMany({
      where: {
        vendorId: id,
        createdAt: { gte: startDate },
      },
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Group bookings by category
    const bookingsByCategory: Record<string, number> = {};
    for (const booking of bookings) {
      const cat = booking.category || 'OTHER';
      bookingsByCategory[cat] = (bookingsByCategory[cat] || 0) + 1;
    }

    // Daily data for charts
    const dailyData: Record<string, { bookings: number; revenue: number }> = {};
    const daysDiff = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = { bookings: 0, revenue: 0 };
    }

    for (const booking of bookings) {
      const dateStr = booking.createdAt.toISOString().split('T')[0];
      if (dailyData[dateStr]) {
        dailyData[dateStr].bookings++;
      }
    }

    for (const order of orders) {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (dailyData[dateStr]) {
        dailyData[dateStr].revenue += Number(order.total);
      }
    }

    res.json({
      success: true,
      data: {
        profileId: id,
        dateRange,
        metrics: {
          bookings: {
            total: totalBookings,
            completed: completedBookings,
            conversionRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : 0,
          },
          orders: {
            total: totalOrders,
            delivered: deliveredOrders,
          },
          revenue: {
            total: totalRevenue,
            average: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
          },
          reviews: {
            count: reviews.length,
            averageRating: avgRating.toFixed(1),
          },
        },
        charts: {
          bookingsByCategory: Object.entries(bookingsByCategory).map(([category, count]) => ({
            category,
            count,
          })),
          dailyTrend: Object.entries(dailyData).map(([date, data]) => ({
            date,
            ...data,
          })),
        },
      },
    });
  } catch (error) {
    console.error('Get Michelle analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// ========================================
// VENDORS MANAGEMENT
// ========================================

// Get all vendors
router.get('/vendors', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, page = '1', limit = '20', search, isMichelle } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (isMichelle !== undefined) {
      where.isMichelle = isMichelle === 'true';
    }

    if (search) {
      where.OR = [
        { businessName: { contains: search as string, mode: 'insensitive' } },
        { user: { email: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, profile: true },
        },
        _count: {
          select: {
            bookings: true,
            orders: true,
            reviews: true,
            stores: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
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

// Get vendor by ID
router.get('/vendors/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, phone: true, profile: true, createdAt: true },
        },
        stores: {
          include: {
            regions: { include: { region: true } },
          },
        },
        subscription: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, email: true, profile: true } } },
        },
        _count: {
          select: {
            bookings: true,
            orders: true,
            reviews: true,
            cleaningListings: true,
            handymanListings: true,
            beautyListings: true,
            groceryListings: true,
            rentalListings: true,
            foodListings: true,
            beautyProductListings: true,
            rideAssistanceListings: true,
            companionshipListings: true,
          },
        },
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

// Update vendor status
router.patch('/vendors/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const vendor = await prisma.vendor.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, email: true, profile: true } },
      },
    });

    res.json({ success: true, data: vendor });
  } catch (error) {
    console.error('Update vendor status error:', error);
    res.status(500).json({ error: 'Failed to update vendor status' });
  }
});

// ========================================
// CUSTOMERS MANAGEMENT
// ========================================

// Get all customers
router.get('/customers', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, page = '1', limit = '20', search } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { role: 'CUSTOMER' };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { profile: { firstName: { contains: search as string, mode: 'insensitive' } } },
        { profile: { lastName: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const customers = await prisma.user.findMany({
      where,
      include: {
        profile: true,
        addresses: true,
        _count: {
          select: {
            bookings: true,
            orders: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    const total = await prisma.user.count({ where });

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to get customers' });
  }
});

// Get customer by ID
router.get('/customers/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.user.findUnique({
      where: { id, role: 'CUSTOMER' },
      include: {
        profile: true,
        addresses: true,
        bookings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { vendor: { select: { businessName: true } } },
        },
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { vendor: { select: { businessName: true } } },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            bookings: true,
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Failed to get customer' });
  }
});

// Update customer status
router.patch('/customers/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['ACTIVE', 'SUSPENDED', 'BANNED'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const customer = await prisma.user.update({
      where: { id, role: 'CUSTOMER' },
      data: { status },
      include: { profile: true },
    });

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('Update customer status error:', error);
    res.status(500).json({ error: 'Failed to update customer status' });
  }
});

// ========================================
// ALL LISTINGS MANAGEMENT
// ========================================

// Get all listings (across all types)
router.get('/listings', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { type, status, vendorId, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    // Get listings from each type
    const listingPromises = [
      prisma.cleaningListing.findMany({ where, include: { vendor: { select: { businessName: true } } } }).then(l => l.map(i => ({ ...i, type: 'CLEANING' }))),
      prisma.handymanListing.findMany({ where, include: { vendor: { select: { businessName: true } } } }).then(l => l.map(i => ({ ...i, type: 'HANDYMAN' }))),
      prisma.beautyListing.findMany({ where, include: { vendor: { select: { businessName: true } } } }).then(l => l.map(i => ({ ...i, type: 'BEAUTY' }))),
      prisma.groceryListing.findMany({ where, include: { vendor: { select: { businessName: true } } } }).then(l => l.map(i => ({ ...i, type: 'GROCERY' }))),
      prisma.rentalListing.findMany({ where, include: { vendor: { select: { businessName: true } } } }).then(l => l.map(i => ({ ...i, type: 'RENTAL' }))),
      prisma.foodListing.findMany({ where, include: { vendor: { select: { businessName: true } } } }).then(l => l.map(i => ({ ...i, type: 'FOOD' }))),
      prisma.beautyProductListing.findMany({ where, include: { vendor: { select: { businessName: true } } } }).then(l => l.map(i => ({ ...i, type: 'BEAUTY_PRODUCT' }))),
      prisma.rideAssistanceListing.findMany({ where, include: { vendor: { select: { businessName: true } } } }).then(l => l.map(i => ({ ...i, type: 'RIDE_ASSISTANCE' }))),
      prisma.companionshipListing.findMany({ where, include: { vendor: { select: { businessName: true } } } }).then(l => l.map(i => ({ ...i, type: 'COMPANIONSHIP' }))),
    ];

    const allListings = await Promise.all(listingPromises);
    let combinedListings = allListings.flat();

    // Filter by type if specified
    if (type) {
      combinedListings = combinedListings.filter(l => l.type === type);
    }

    // Sort by createdAt
    combinedListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate
    const total = combinedListings.length;
    const paginatedListings = combinedListings.slice((pageNum - 1) * limitNum, pageNum * limitNum);

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

// Update listing status (generic)
router.patch('/listings/:type/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;

    if (!status || !['ACTIVE', 'PAUSED', 'SUSPENDED', 'DRAFT', 'TRIAL_PERIOD'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    let listing;

    switch (type.toUpperCase()) {
      case 'CLEANING':
        listing = await prisma.cleaningListing.update({ where: { id }, data: { status } });
        break;
      case 'HANDYMAN':
        listing = await prisma.handymanListing.update({ where: { id }, data: { status } });
        break;
      case 'BEAUTY':
        listing = await prisma.beautyListing.update({ where: { id }, data: { status } });
        break;
      case 'GROCERY':
        listing = await prisma.groceryListing.update({ where: { id }, data: { status } });
        break;
      case 'RENTAL':
        listing = await prisma.rentalListing.update({ where: { id }, data: { status } });
        break;
      case 'FOOD':
        listing = await prisma.foodListing.update({ where: { id }, data: { status } });
        break;
      case 'BEAUTY_PRODUCT':
        listing = await prisma.beautyProductListing.update({ where: { id }, data: { status } });
        break;
      case 'RIDE_ASSISTANCE':
        listing = await prisma.rideAssistanceListing.update({ where: { id }, data: { status } });
        break;
      case 'COMPANIONSHIP':
        listing = await prisma.companionshipListing.update({ where: { id }, data: { status } });
        break;
      default:
        return res.status(400).json({ error: 'Invalid listing type' });
    }

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Update listing status error:', error);
    res.status(500).json({ error: 'Failed to update listing status' });
  }
});

// ========================================
// REVIEWS MANAGEMENT
// ========================================

// Get all reviews
router.get('/reviews', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { vendorId, rating, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (rating) {
      where.rating = parseInt(rating as string);
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, profile: true } },
        vendor: { select: { businessName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    const total = await prisma.review.count({ where });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

// Delete review (moderation)
router.delete('/reviews/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await prisma.review.delete({ where: { id } });

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// ========================================
// REPORTS (MODERATION)
// ========================================

// Get reported content
router.get('/reports', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { type, status, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, profile: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    const total = await prisma.report.count({ where });

    res.json({
      success: true,
      data: reports,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to get reports' });
  }
});

// Update report status
router.patch('/reports/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, resolution } = req.body;

    if (!status || !['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const report = await prisma.report.update({
      where: { id },
      data: {
        status,
        resolution: resolution || null,
        reviewedAt: new Date(),
        reviewedBy: req.user!.id,
      },
    });

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({ error: 'Failed to update report status' });
  }
});

// ========================================
// PUSH NOTIFICATIONS
// ========================================

// Send push notification
router.post('/push-notifications', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { title, body, targetType, targetIds, data } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'title and body are required' });
    }

    // In production, integrate with Firebase Cloud Messaging, OneSignal, etc.
    // For now, we'll store the notification and return success

    const notification = await prisma.notification.create({
      data: {
        type: 'PUSH',
        title,
        body,
        data: data || {},
        // In production, store targeting info
      },
    });

    // Log notification for audit
    console.log('Push notification sent:', {
      id: notification.id,
      title,
      targetType,
      targetCount: targetIds?.length || 'all',
      sentBy: req.user!.id,
    });

    res.json({
      success: true,
      data: notification,
      message: `Notification sent to ${targetIds?.length || 'all'} recipients`,
    });
  } catch (error) {
    console.error('Send push notification error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// ========================================
// PLATFORM REPORTS (ENHANCED)
// ========================================

// Get platform reports with date ranges and export
router.get('/reports/platform', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { dateRange = '30days' } = req.query;

    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;

    switch (dateRange) {
      case '7days':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - 7);
        break;
      case '30days':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - 30);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - 30);
    }

    // Current period metrics
    const [
      currentRevenue,
      currentBookings,
      currentNewUsers,
      currentActiveVendors,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { status: 'COMPLETED', createdAt: { gte: startDate } },
        _sum: { total: true },
      }),
      prisma.booking.count({ where: { createdAt: { gte: startDate } } }),
      prisma.user.count({ where: { createdAt: { gte: startDate } } }),
      prisma.vendor.count({ where: { status: 'APPROVED', createdAt: { gte: startDate } } }),
    ]);

    // Previous period metrics for comparison
    const [
      previousRevenue,
      previousBookings,
      previousNewUsers,
      previousActiveVendors,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { status: 'COMPLETED', createdAt: { gte: previousStartDate, lt: startDate } },
        _sum: { total: true },
      }),
      prisma.booking.count({ where: { createdAt: { gte: previousStartDate, lt: startDate } } }),
      prisma.user.count({ where: { createdAt: { gte: previousStartDate, lt: startDate } } }),
      prisma.vendor.count({ where: { status: 'APPROVED', createdAt: { gte: previousStartDate, lt: startDate } } }),
    ]);

    // Calculate changes - always returns a number
    const calculateChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return parseFloat(((current - previous) / previous * 100).toFixed(1));
    };

    const currentRevenueVal = Number(currentRevenue._sum.total || 0);
    const previousRevenueVal = Number(previousRevenue._sum.total || 0);

    // Top performers
    const topVendorsByRevenue = await prisma.order.groupBy({
      by: ['vendorId'],
      where: { status: 'COMPLETED', createdAt: { gte: startDate } },
      _sum: { total: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 1,
    });

    let topVendor = null;
    if (topVendorsByRevenue.length > 0) {
      const vendor = await prisma.vendor.findUnique({
        where: { id: topVendorsByRevenue[0].vendorId },
        select: { businessName: true },
      });
      topVendor = {
        name: vendor?.businessName || 'Unknown',
        metric: 'Revenue',
        value: `$${Number(topVendorsByRevenue[0]._sum.total || 0).toLocaleString()}`,
      };
    }

    // Monthly revenue chart data
    const monthlyRevenue: Array<{ month: string; revenue: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const revenue = await prisma.order.aggregate({
        where: { status: 'COMPLETED', createdAt: { gte: monthStart, lte: monthEnd } },
        _sum: { total: true },
      });

      monthlyRevenue.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        revenue: Number(revenue._sum.total || 0),
      });
    }

    res.json({
      success: true,
      data: {
        dateRange,
        kpis: {
          revenue: {
            value: currentRevenueVal,
            change: calculateChange(currentRevenueVal, previousRevenueVal),
            trend: currentRevenueVal >= previousRevenueVal ? 'up' : 'down',
          },
          bookings: {
            value: currentBookings,
            change: calculateChange(currentBookings, previousBookings),
            trend: currentBookings >= previousBookings ? 'up' : 'down',
          },
          newUsers: {
            value: currentNewUsers,
            change: calculateChange(currentNewUsers, previousNewUsers),
            trend: currentNewUsers >= previousNewUsers ? 'up' : 'down',
          },
          activeVendors: {
            value: currentActiveVendors,
            change: calculateChange(currentActiveVendors, previousActiveVendors),
            trend: currentActiveVendors >= previousActiveVendors ? 'up' : 'down',
          },
        },
        topPerformers: {
          topVendor,
        },
        charts: {
          revenueByMonth: monthlyRevenue,
        },
      },
    });
  } catch (error) {
    console.error('Get platform reports error:', error);
    res.status(500).json({ error: 'Failed to get platform reports' });
  }
});

// Export platform report
router.get('/reports/platform/export', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { format = 'csv', dateRange = '30days' } = req.query;

    // For now, return a simple CSV format
    // In production, use proper CSV/PDF generation libraries

    const now = new Date();
    let startDate = new Date(now);
    startDate.setDate(now.getDate() - 30);

    const [orders, bookings, users, vendors] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startDate } } }),
      prisma.booking.count({ where: { createdAt: { gte: startDate } } }),
      prisma.user.count({ where: { createdAt: { gte: startDate } } }),
      prisma.vendor.count({ where: { createdAt: { gte: startDate } } }),
    ]);

    const revenue = await prisma.order.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: startDate } },
      _sum: { total: true },
    });

    if (format === 'csv') {
      const csv = [
        'Metric,Value',
        `Date Range,${dateRange}`,
        `Total Orders,${orders}`,
        `Total Bookings,${bookings}`,
        `New Users,${users}`,
        `New Vendors,${vendors}`,
        `Total Revenue,$${Number(revenue._sum.total || 0).toFixed(2)}`,
        `Report Generated,${new Date().toISOString()}`,
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=platform-report-${dateRange}.csv`);
      res.send(csv);
    } else {
      res.status(400).json({ error: 'Only CSV format is currently supported' });
    }
  } catch (error) {
    console.error('Export platform report error:', error);
    res.status(500).json({ error: 'Failed to export report' });
  }
});

// ========================================
// ORDERS MANAGEMENT
// ========================================

// Get all orders
router.get('/orders', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, vendorId, userId, page = '1', limit = '20', search } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.OR = [
        { id: { contains: search as string, mode: 'insensitive' } },
        { user: { email: { contains: search as string, mode: 'insensitive' } } },
        { vendor: { businessName: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, profile: true } },
        vendor: { select: { id: true, businessName: true } },
        address: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    const total = await prisma.order.count({ where });

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get order by ID
router.get('/orders/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, phone: true, profile: true } },
        vendor: { select: { id: true, businessName: true, contactPhone: true } },
        address: true,
        items: {
          include: {
            groceryListing: true,
            foodListing: true,
            beautyProductListing: true,
          },
        },
        transaction: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Update order status
router.patch('/orders/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(status === 'COMPLETED' && { deliveredAt: new Date() }),
        ...(status === 'CANCELLED' && { cancelledAt: new Date() }),
      },
      include: {
        user: { select: { id: true, email: true, profile: true } },
        vendor: { select: { id: true, businessName: true } },
      },
    });

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// ========================================
// BOOKINGS MANAGEMENT
// ========================================

// Get all bookings
router.get('/bookings', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, vendorId, userId, category, page = '1', limit = '20', search } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { id: { contains: search as string, mode: 'insensitive' } },
        { user: { email: { contains: search as string, mode: 'insensitive' } } },
        { vendor: { businessName: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, profile: true } },
        vendor: { select: { id: true, businessName: true } },
        address: true,
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

// Get booking by ID
router.get('/bookings/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, phone: true, profile: true } },
        vendor: { select: { id: true, businessName: true, contactPhone: true } },
        address: true,
        cleaningListing: true,
        handymanListing: true,
        beautyListing: true,
        rentalListing: true,
        caregivingListing: true,
        rideAssistanceListing: true,
        companionshipListing: true,
        transaction: true,
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

// Update booking status
router.patch('/bookings/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'ACCEPTED', 'DECLINED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
        ...(status === 'CANCELLED' && { cancelledAt: new Date() }),
      },
      include: {
        user: { select: { id: true, email: true, profile: true } },
        vendor: { select: { id: true, businessName: true } },
      },
    });

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// ========================================
// REGIONS MANAGEMENT
// ========================================

// Get all regions
router.get('/regions', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { country, isActive, page = '1', limit = '50' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (country) {
      where.country = country;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const regions = await prisma.region.findMany({
      where,
      include: {
        _count: {
          select: {
            storeRegions: true,
          },
        },
      },
      orderBy: [{ country: 'asc' }, { name: 'asc' }],
      skip,
      take: limitNum,
    });

    const total = await prisma.region.count({ where });

    res.json({
      success: true,
      data: regions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get regions error:', error);
    res.status(500).json({ error: 'Failed to get regions' });
  }
});

// Create region
router.post('/regions', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, city, state, province, country, countryCode, isActive = true } = req.body;

    if (!name || !city || !country) {
      return res.status(400).json({ error: 'name, city, and country are required' });
    }

    const region = await prisma.region.create({
      data: {
        name,
        city,
        state: state || null,
        province: province || null,
        country,
        countryCode: countryCode || (country === 'Canada' ? 'CA' : 'US'),
        isActive,
      },
    });

    res.status(201).json({ success: true, data: region });
  } catch (error) {
    console.error('Create region error:', error);
    res.status(500).json({ error: 'Failed to create region' });
  }
});

// Update region
router.put('/regions/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, city, state, province, country, countryCode, isActive } = req.body;

    const region = await prisma.region.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(city && { city }),
        ...(state !== undefined && { state }),
        ...(province !== undefined && { province }),
        ...(country && { country }),
        ...(countryCode && { countryCode }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({ success: true, data: region });
  } catch (error) {
    console.error('Update region error:', error);
    res.status(500).json({ error: 'Failed to update region' });
  }
});

// Delete region
router.delete('/regions/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if region is in use
    const inUse = await prisma.vendorStoreRegion.count({ where: { regionId: id } });
    if (inUse > 0) {
      return res.status(400).json({ error: 'Cannot delete region that is in use by stores' });
    }

    await prisma.region.delete({ where: { id } });

    res.json({ success: true, message: 'Region deleted' });
  } catch (error) {
    console.error('Delete region error:', error);
    res.status(500).json({ error: 'Failed to delete region' });
  }
});

// ========================================
// PLATFORM SETTINGS
// ========================================

// Get platform settings
router.get('/settings', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    let settings = await prisma.platformSettings.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: {
          platformName: 'DoHuub',
          platformFeePercentage: 10,
          deliveryFeeDefault: 5.99,
          serviceFeePercentage: 5,
          minOrderAmount: 10,
          maxDeliveryRadius: 25,
          supportEmail: 'support@doohub.com',
          supportPhone: '+1-800-DOOHUB',
          termsUrl: 'https://doohub.com/terms',
          privacyUrl: 'https://doohub.com/privacy',
          maintenanceMode: false,
          features: {
            bookings: true,
            orders: true,
            subscriptions: true,
            reviews: true,
            chat: true,
            notifications: true,
          },
        },
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// Update platform settings
router.put('/settings', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      platformName,
      platformFeePercentage,
      deliveryFeeDefault,
      serviceFeePercentage,
      minOrderAmount,
      maxDeliveryRadius,
      supportEmail,
      supportPhone,
      termsUrl,
      privacyUrl,
      maintenanceMode,
      features,
    } = req.body;

    let settings = await prisma.platformSettings.findFirst();

    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: {
          platformName: platformName || 'DoHuub',
          platformFeePercentage: platformFeePercentage ?? 10,
          deliveryFeeDefault: deliveryFeeDefault ?? 5.99,
          serviceFeePercentage: serviceFeePercentage ?? 5,
          minOrderAmount: minOrderAmount ?? 10,
          maxDeliveryRadius: maxDeliveryRadius ?? 25,
          supportEmail: supportEmail || 'support@doohub.com',
          supportPhone: supportPhone || '+1-800-DOOHUB',
          termsUrl: termsUrl || 'https://doohub.com/terms',
          privacyUrl: privacyUrl || 'https://doohub.com/privacy',
          maintenanceMode: maintenanceMode ?? false,
          features: features || {},
        },
      });
    } else {
      settings = await prisma.platformSettings.update({
        where: { id: settings.id },
        data: {
          ...(platformName !== undefined && { platformName }),
          ...(platformFeePercentage !== undefined && { platformFeePercentage }),
          ...(deliveryFeeDefault !== undefined && { deliveryFeeDefault }),
          ...(serviceFeePercentage !== undefined && { serviceFeePercentage }),
          ...(minOrderAmount !== undefined && { minOrderAmount }),
          ...(maxDeliveryRadius !== undefined && { maxDeliveryRadius }),
          ...(supportEmail !== undefined && { supportEmail }),
          ...(supportPhone !== undefined && { supportPhone }),
          ...(termsUrl !== undefined && { termsUrl }),
          ...(privacyUrl !== undefined && { privacyUrl }),
          ...(maintenanceMode !== undefined && { maintenanceMode }),
          ...(features !== undefined && { features }),
        },
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
