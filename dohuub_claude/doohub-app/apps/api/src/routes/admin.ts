import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { sendPushToUsers, PushPayload } from '../utils/push';

const router = Router();

// Map a booking-status transition to a customer-facing push payload.
function bookingStatusPushPayload(status: string, booking: any): PushPayload | null {
  const vendorName = booking?.vendor?.businessName || 'your vendor';
  const dateStr = booking?.scheduledDate
    ? new Date(booking.scheduledDate).toLocaleDateString()
    : 'your scheduled date';
  const data = { type: 'booking_update', bookingId: booking?.id, status };

  switch (status) {
    case 'ACCEPTED':
      return {
        title: 'Booking confirmed',
        body: `Your booking at ${vendorName} on ${dateStr} is confirmed.`,
        data,
      };
    case 'IN_PROGRESS':
      return { title: 'Vendor on the way', body: 'Your vendor is on the way.', data };
    case 'COMPLETED':
      return {
        title: 'Booking completed',
        body: 'Your booking is complete — leave a review!',
        data,
      };
    case 'CANCELLED':
      return { title: 'Booking cancelled', body: 'Your booking was cancelled.', data };
    default:
      return null;
  }
}

// Map an order-status transition to a customer-facing push payload.
function orderStatusPushPayload(status: string, order: any): PushPayload | null {
  const vendorName = order?.vendor?.businessName || 'your vendor';
  const data = { type: 'order_update', orderId: order?.id, status };

  switch (status) {
    case 'ACCEPTED':
      return { title: 'Order confirmed', body: `${vendorName} accepted your order.`, data };
    case 'PREPARING':
      return { title: 'Order in progress', body: `${vendorName} is preparing your order.`, data };
    case 'READY':
      return { title: 'Order ready', body: 'Your order is ready.', data };
    case 'OUT_FOR_DELIVERY':
      return { title: 'Out for delivery', body: 'Your order is on its way.', data };
    case 'COMPLETED':
      return { title: 'Order delivered', body: 'Your order has been delivered.', data };
    case 'CANCELLED':
      return { title: 'Order cancelled', body: 'Your order was cancelled.', data };
    default:
      return null;
  }
}

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
        categories: true,
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
            serviceAreas: true,
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
    const { email, firstName, lastName, businessName, description, logo, phone, category, regions } = req.body;

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

      if (category) {
        await tx.vendorCategory.create({
          data: { vendorId: vendor.id, category },
        });
      }

      if (Array.isArray(regions) && regions.length > 0) {
        for (const r of regions) {
          if (!r?.name) continue;
          // Try to derive city/state from "City, ST" format if present.
          const [city = r.name, state = ''] = String(r.name).split(',').map((s: string) => s.trim());
          await tx.vendorServiceArea.create({
            data: {
              vendorId: vendor.id,
              name: r.name,
              city: city || r.name,
              state: state || '',
              zipCodes: [],
              isActive: r.isActive !== false,
            },
          });
        }
      }

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
        categories: true,
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
    const { businessName, description, logo, phone, status, firstName, lastName, category, regions } = req.body;

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
          ...(phone !== undefined && { contactPhone: phone }),
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

      // Replace category if provided
      if (category) {
        await tx.vendorCategory.deleteMany({ where: { vendorId: vendor.id } });
        await tx.vendorCategory.create({ data: { vendorId: vendor.id, category } });
      }

      // Replace service areas (regions) if provided
      if (Array.isArray(regions)) {
        await tx.vendorServiceArea.deleteMany({ where: { vendorId: vendor.id } });
        for (const r of regions) {
          if (!r?.name) continue;
          const [city = r.name, state = ''] = String(r.name).split(',').map((s: string) => s.trim());
          await tx.vendorServiceArea.create({
            data: {
              vendorId: vendor.id,
              name: r.name,
              city: city || r.name,
              state: state || '',
              zipCodes: [],
              isActive: r.isActive !== false,
            },
          });
        }
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

    // Soft delete — suspend the vendor AND cascade to child listings so the
    // mobile customer app stops surfacing them. Without the listing pass,
    // a deleted Michelle vendor's items kept showing in customer browse.
    await prisma.$transaction([
      prisma.vendor.update({
        where: { id },
        data: { status: 'SUSPENDED', isActive: false },
      }),
      prisma.cleaningListing.updateMany({ where: { vendorId: id, status: 'ACTIVE' }, data: { status: 'PAUSED' } }),
      prisma.handymanListing.updateMany({ where: { vendorId: id, status: 'ACTIVE' }, data: { status: 'PAUSED' } }),
      prisma.beautyListing.updateMany({ where: { vendorId: id, status: 'ACTIVE' }, data: { status: 'PAUSED' } }),
      prisma.groceryListing.updateMany({ where: { vendorId: id, status: 'ACTIVE' }, data: { status: 'PAUSED' } }),
      prisma.rentalListing.updateMany({ where: { vendorId: id, status: 'ACTIVE' }, data: { status: 'PAUSED' } }),
      (prisma as any).foodListing.updateMany({ where: { vendorId: id, status: 'ACTIVE' }, data: { status: 'PAUSED' } }),
      (prisma as any).beautyProductListing.updateMany({ where: { vendorId: id, status: 'ACTIVE' }, data: { status: 'PAUSED' } }),
      (prisma as any).rideAssistanceListing.updateMany({ where: { vendorId: id, status: 'ACTIVE' }, data: { status: 'PAUSED' } }),
      (prisma as any).companionshipListing.updateMany({ where: { vendorId: id, status: 'ACTIVE' }, data: { status: 'PAUSED' } }),
    ]);

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
        categories: true,
        serviceAreas: true,
        subscription: true,
        stores: {
          include: { regions: { include: { region: true } } },
        },
        _count: {
          select: {
            bookings: true,
            orders: true,
            reviews: true,
            stores: true,
            serviceAreas: true,
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
        categories: true,
        serviceAreas: true,
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

    // Keep the legacy `isActive` boolean in sync. Mobile listing queries filter
    // by `isActive=true`, so suspending without flipping this would leave the
    // vendor visible in the customer app.
    const isActive = status === 'APPROVED';

    const vendor = await prisma.vendor.update({
      where: { id },
      data: { status, isActive },
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

// Update customer status. Writes BOTH `status` (the moderation enum) and
// `isActive` (the access-control flag). The auth middleware reads isActive,
// so without this dual-write a SUSPENDED customer would keep using the app.
router.patch('/customers/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['ACTIVE', 'SUSPENDED', 'BANNED'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const customer = await prisma.user.update({
      where: { id, role: 'CUSTOMER' },
      data: { status, isActive: status === 'ACTIVE' },
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

    // Resolve each report's listing → vendor so the moderation UI can show
    // the vendor name and call the suspend endpoint.
    const enriched = await Promise.all(
      reports.map(async (rep) => {
        const include = { vendor: { select: { id: true, businessName: true } } };
        const lt = String(rep.listingType || '').toLowerCase();
        try {
          let listing: any = null;
          if (lt === 'cleaning')      listing = await prisma.cleaningListing.findUnique({ where: { id: rep.listingId }, include });
          else if (lt === 'handyman') listing = await prisma.handymanListing.findUnique({ where: { id: rep.listingId }, include });
          else if (lt === 'beauty')   listing = await prisma.beautyListing.findUnique({ where: { id: rep.listingId }, include });
          else if (lt === 'grocery' || lt === 'groceries') listing = await prisma.groceryListing.findUnique({ where: { id: rep.listingId }, include });
          else if (lt === 'food')     listing = await prisma.foodListing.findUnique({ where: { id: rep.listingId }, include });
          else if (lt === 'rental' || lt === 'rentals') listing = await prisma.rentalListing.findUnique({ where: { id: rep.listingId }, include });
          else if (lt === 'beauty_product' || lt === 'beauty_products') listing = await prisma.beautyProductListing.findUnique({ where: { id: rep.listingId }, include });
          else if (lt === 'ride_assistance') listing = await prisma.rideAssistanceListing.findUnique({ where: { id: rep.listingId }, include });
          else if (lt === 'companionship')   listing = await prisma.companionshipListing.findUnique({ where: { id: rep.listingId }, include });
          return {
            ...rep,
            description: rep.comment, // UI reads `description`; schema column is `comment`
            targetTitle: listing?.title ?? null,
            vendorId: listing?.vendor?.id ?? null,
            vendorName: listing?.vendor?.businessName ?? null,
          };
        } catch {
          return { ...rep, description: rep.comment, targetTitle: null, vendorId: null, vendorName: null };
        }
      })
    );

    res.json({
      success: true,
      data: enriched,
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

// Restore a listing back to ACTIVE after a report is dismissed. The report
// pipeline auto-PAUSEs listings on report creation; without this admin had
// no way to bring a wrongly-reported listing back.
router.post('/reports/:id/restore-listing', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) return res.status(404).json({ error: 'Report not found' });

    const lt = String(report.listingType || '').toLowerCase();
    const map: Record<string, string> = {
      cleaning: 'cleaningListing', handyman: 'handymanListing', beauty: 'beautyListing',
      grocery: 'groceryListing', groceries: 'groceryListing',
      food: 'foodListing', rental: 'rentalListing', rentals: 'rentalListing',
      beauty_product: 'beautyProductListing', beauty_products: 'beautyProductListing',
      ride_assistance: 'rideAssistanceListing', companionship: 'companionshipListing',
    };
    const modelKey = map[lt];
    if (!modelKey) return res.status(400).json({ error: `Unknown listing type: ${report.listingType}` });

    await (prisma as any)[modelKey].update({
      where: { id: report.listingId },
      data: { status: 'ACTIVE' },
    });

    // Also mark the report as DISMISSED so it disappears from pending queue.
    await prisma.report.update({
      where: { id },
      data: { status: 'DISMISSED', reviewedAt: new Date(), reviewedBy: req.user!.id },
    });

    res.json({ success: true });
  } catch (e: any) {
    console.error('Restore listing error:', e);
    res.status(500).json({ error: e?.message || 'Failed to restore listing' });
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

    // Resolve target user IDs based on targetType.
    let resolvedUserIds: string[] = [];
    if (targetType === 'SPECIFIC' && Array.isArray(targetIds) && targetIds.length > 0) {
      resolvedUserIds = targetIds;
    } else if (targetType === 'CUSTOMERS') {
      const users = await prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        select: { id: true },
      });
      resolvedUserIds = users.map((u) => u.id);
    } else if (targetType === 'VENDORS') {
      const users = await prisma.user.findMany({
        where: { role: 'VENDOR' },
        select: { id: true },
      });
      resolvedUserIds = users.map((u) => u.id);
    } else {
      // ALL or unspecified — fan out to every user
      const users = await prisma.user.findMany({ select: { id: true } });
      resolvedUserIds = users.map((u) => u.id);
    }

    // Record an audit row (broadcast notification, no userId).
    const notification = await prisma.notification.create({
      data: {
        type: 'PUSH',
        title,
        body,
        data: data || {},
        targetType: targetType || 'ALL',
        targetIds: targetType === 'SPECIFIC' ? resolvedUserIds : [],
      },
    });

    // Fire-and-forget the actual push delivery so a slow Expo round-trip
    // doesn't make the admin UI hang.
    sendPushToUsers(resolvedUserIds, { title, body, data }).catch((e) => {
      console.error('[admin/push-notifications] sendPushToUsers failed:', e);
    });

    console.log('Push notification dispatched:', {
      id: notification.id,
      title,
      targetType: targetType || 'ALL',
      targetCount: resolvedUserIds.length,
      sentBy: req.user!.id,
    });

    res.json({
      success: true,
      data: notification,
      message: `Notification sent to ${resolvedUserIds.length} recipient(s)`,
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
        items: {
          include: {
            groceryListing: { select: { id: true, name: true, image: true } },
            foodListing: { select: { id: true, name: true, image: true } },
            beautyProductListing: { select: { id: true, name: true, image: true } },
          },
        },
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

    const validStatuses = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'];
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

    // Push customer about order status change.
    try {
      const payload = orderStatusPushPayload(status, order);
      if (payload && order.userId) {
        await sendPushToUsers([order.userId], payload);
      }
    } catch (e) {
      console.error('[admin/orders/status] push error:', e);
    }

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
        cleaningListing: { select: { id: true, title: true } },
        handymanListing: { select: { id: true, title: true } },
        beautyListing: { select: { id: true, title: true } },
        rentalListing: { select: { id: true, title: true } },
        rideAssistanceListing: { select: { id: true, title: true } },
        companionshipListing: { select: { id: true, title: true } },
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
        ...(status === 'ACCEPTED' && { acceptedAt: new Date() }),
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
        ...(status === 'CANCELLED' && { cancelledAt: new Date() }),
        // Same audit trail the vendor endpoint writes — the customer's
        // mobile tracking screen reads from BookingStatusHistory, so without
        // this the timeline only shows the initial PENDING entry.
        statusHistory: {
          create: { status, note: 'Updated by admin' },
        },
      },
      include: {
        user: { select: { id: true, email: true, profile: true } },
        vendor: { select: { id: true, businessName: true } },
      },
    });

    // Notify the customer about the status change. Wrap so push errors
    // can never 500 the status update itself.
    try {
      const payload = bookingStatusPushPayload(status, booking);
      if (payload && booking.userId) {
        await sendPushToUsers([booking.userId], payload);
      }
    } catch (e) {
      console.error('[admin/bookings/status] push error:', e);
    }

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
    const { name, city, state, province, country, countryCode, isActive, notes } = req.body;

    const region = await prisma.region.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(city && { city }),
        ...(state !== undefined && { state }),
        ...(province !== undefined && { province }),
        ...(notes !== undefined && { notes }),
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
    const b = req.body || {};

    let settings = await prisma.platformSettings.findFirst();

    const updatableFields = [
      'platformName', 'platformFeePercentage', 'deliveryFeeDefault', 'serviceFeePercentage',
      'minOrderAmount', 'maxDeliveryRadius', 'supportEmail', 'supportPhone', 'termsUrl',
      'privacyUrl', 'termsContent', 'privacyContent', 'stripePublishableKey', 'stripeSecretKey',
      'maintenanceMode', 'features',
      'mission', 'serviceOffers', 'benefitPoints', 'addressLine1', 'addressLine2',
      'website', 'phoneNumeric', 'socialInstagram', 'socialFacebook', 'socialTwitter', 'socialLinkedin',
      'trialDurationDays', 'trialGracePeriodDays', 'trialReminderDaysBefore',
      'trialRequirePaymentMethod', 'trialSendWelcomeEmail', 'trialAfterExpiry',
      'trialOnExpiryDeactivateListings', 'trialOnExpiryBlockNewListings',
      'trialOnExpirySendNotification', 'trialOnExpirySuspendAccount',
    ];

    const data: any = {};
    for (const f of updatableFields) {
      if (b[f] !== undefined) data[f] = b[f];
    }

    if (!settings) {
      settings = await prisma.platformSettings.create({ data });
    } else {
      settings = await prisma.platformSettings.update({ where: { id: settings.id }, data });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ========================================
// REWARDS / LOYALTY (admin)
// ========================================

// Aggregate rewards stats for the admin overview page.
router.get('/rewards/summary', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { timeRange = 'month' } = req.query;
    const now = new Date();
    const periodStart = new Date(now);
    const prevStart = new Date(now);
    if (timeRange === 'week') {
      periodStart.setDate(now.getDate() - 7);
      prevStart.setDate(now.getDate() - 14);
    } else if (timeRange === 'year') {
      periodStart.setFullYear(now.getFullYear() - 1);
      prevStart.setFullYear(now.getFullYear() - 2);
    } else {
      periodStart.setMonth(now.getMonth() - 1);
      prevStart.setMonth(now.getMonth() - 2);
    }

    const [
      walletAgg, txAgg, streakAgg, milestonesAchieved, referralsAgg, topEarnersRaw,
      thisPeriodEarn, prevPeriodEarn, thisPeriodRedeem, prevPeriodRedeem,
    ] =
      await Promise.all([
        prisma.rewardsWallet.aggregate({
          _sum: { totalPoints: true, pendingPoints: true, expiringPoints: true },
          _count: { _all: true },
        }),
        prisma.pointsTransaction.groupBy({
          by: ['type'],
          _sum: { amount: true },
          _count: { _all: true },
        }),
        prisma.userStreak.aggregate({
          _avg: { currentStreak: true, longestStreak: true },
          _max: { longestStreak: true },
          _count: { _all: true },
        }),
        prisma.categoryMilestone.count({ where: { achieved: true } }),
        prisma.referral.groupBy({
          by: ['status'],
          _count: { _all: true },
        }),
        prisma.rewardsWallet.findMany({
          orderBy: { totalPoints: 'desc' },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: { select: { firstName: true, lastName: true, avatar: true } },
              },
            },
          },
        }),
        prisma.pointsTransaction.aggregate({
          where: { amount: { gt: 0 }, createdAt: { gte: periodStart } },
          _sum: { amount: true },
        }),
        prisma.pointsTransaction.aggregate({
          where: { amount: { gt: 0 }, createdAt: { gte: prevStart, lt: periodStart } },
          _sum: { amount: true },
        }),
        prisma.pointsTransaction.aggregate({
          where: { amount: { lt: 0 }, createdAt: { gte: periodStart } },
          _sum: { amount: true },
        }),
        prisma.pointsTransaction.aggregate({
          where: { amount: { lt: 0 }, createdAt: { gte: prevStart, lt: periodStart } },
          _sum: { amount: true },
        }),
      ]);

    const earnRow = txAgg.find((r) => r.type === 'EARN' || r.type === 'earn');
    const redeemRow = txAgg.find((r) => r.type === 'REDEEM' || r.type === 'redeem');

    const pctChange = (curr: number, prev: number) =>
      prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

    const thisEarn = Number(thisPeriodEarn._sum.amount || 0);
    const prevEarn = Number(prevPeriodEarn._sum.amount || 0);
    const thisRedeem = Math.abs(Number(thisPeriodRedeem._sum.amount || 0));
    const prevRedeem = Math.abs(Number(prevPeriodRedeem._sum.amount || 0));

    res.json({
      success: true,
      data: {
        wallet: {
          activeWallets: walletAgg._count._all,
          totalPoints: walletAgg._sum.totalPoints ?? 0,
          pendingPoints: walletAgg._sum.pendingPoints ?? 0,
          expiringPoints: walletAgg._sum.expiringPoints ?? 0,
        },
        transactions: {
          totalEarned: earnRow?._sum.amount ?? 0,
          totalRedeemed: redeemRow?._sum.amount ?? 0,
          earnEvents: earnRow?._count._all ?? 0,
          redeemEvents: redeemRow?._count._all ?? 0,
          lifetimeEarned: thisEarn + prevEarn + Number(earnRow?._sum.amount || 0),
          lifetimeRedeemed: thisRedeem + prevRedeem + Math.abs(Number(redeemRow?._sum.amount || 0)),
        },
        period: {
          timeRange,
          earnedThisPeriod: thisEarn,
          earnedPrevPeriod: prevEarn,
          earnGrowthPct: pctChange(thisEarn, prevEarn),
          redeemedThisPeriod: thisRedeem,
          redeemedPrevPeriod: prevRedeem,
          redeemGrowthPct: pctChange(thisRedeem, prevRedeem),
        },
        streaks: {
          tracked: streakAgg._count._all,
          avgCurrent: Number(streakAgg._avg.currentStreak ?? 0),
          avgLongest: Number(streakAgg._avg.longestStreak ?? 0),
          maxLongest: streakAgg._max.longestStreak ?? 0,
        },
        milestones: {
          achieved: milestonesAchieved,
        },
        referrals: {
          byStatus: referralsAgg.map((r) => ({ status: r.status, count: r._count._all })),
        },
        topEarners: topEarnersRaw.map((w) => ({
          userId: w.userId,
          email: w.user.email,
          name: w.user.profile
            ? `${w.user.profile.firstName ?? ''} ${w.user.profile.lastName ?? ''}`.trim()
            : w.user.email,
          avatar: w.user.profile?.avatar ?? null,
          totalPoints: w.totalPoints,
        })),
      },
    });
  } catch (error: any) {
    console.error('Get rewards summary error:', error);
    res.status(500).json({ error: 'Failed to get rewards summary' });
  }
});

// Per-customer rewards detail for the admin "customer rewards" page.
router.get('/customers/:id/rewards', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const [user, wallet, streak, milestones, transactions, referralsMade] = await Promise.all([
      prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          phone: true,
          createdAt: true,
          profile: { select: { firstName: true, lastName: true, avatar: true } },
        },
      }),
      prisma.rewardsWallet.findUnique({ where: { userId: id } }),
      prisma.userStreak.findUnique({ where: { userId: id } }),
      prisma.categoryMilestone.findMany({ where: { userId: id }, orderBy: { category: 'asc' } }),
      prisma.pointsTransaction.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.referral.findMany({
        where: { referrerUserId: id },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (!user) return res.status(404).json({ error: 'Customer not found' });

    res.json({
      success: true,
      data: { user, wallet, streak, milestones, transactions, referrals: referralsMade },
    });
  } catch (error: any) {
    console.error('Get customer rewards error:', error);
    res.status(500).json({ error: 'Failed to get customer rewards' });
  }
});

// Manual point adjustment by admin (credit or debit a customer)
router.post('/customers/:id/rewards/adjust', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body || {};
    const n = Number(amount);
    if (!n || Number.isNaN(n)) return res.status(400).json({ error: 'amount must be a non-zero number' });

    const wallet = await prisma.rewardsWallet.upsert({
      where: { userId: id },
      update: { totalPoints: { increment: n } },
      create: { userId: id, totalPoints: Math.max(0, n) },
    });

    const tx = await prisma.pointsTransaction.create({
      data: {
        userId: id,
        type: n >= 0 ? 'ADMIN_CREDIT' : 'ADMIN_DEBIT',
        amount: n,
        description: reason || (n >= 0 ? 'Admin manual credit' : 'Admin manual debit'),
      },
    });

    res.json({ success: true, data: { wallet, transaction: tx } });
  } catch (e: any) {
    console.error('Admin rewards adjust error:', e);
    res.status(500).json({ error: 'Failed to adjust rewards' });
  }
});

// Recent points activity feed for admin RewardsOverview
router.get('/rewards/transactions', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const txs = await prisma.pointsTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
      },
    });
    res.json({ success: true, data: txs });
  } catch (e: any) {
    console.error('Admin rewards transactions error:', e);
    res.status(500).json({ error: 'Failed to load transactions' });
  }
});

// ========================================
// FAQ (admin CRUD; published FAQs are public-readable via /faqs)
// ========================================
router.get('/faqs', authenticate, requireAdmin, async (_req: AuthRequest, res) => {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
    res.json({ success: true, data: faqs });
  } catch (e: any) {
    console.error('List FAQs error:', e);
    res.status(500).json({ error: 'Failed to load FAQs' });
  }
});

router.post('/faqs', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { question, answer, category, order, isPublished } = req.body || {};
    if (!question || !answer) return res.status(400).json({ error: 'question and answer are required' });
    const faq = await prisma.fAQ.create({
      data: {
        question, answer,
        category: category || null,
        order: typeof order === 'number' ? order : 0,
        isPublished: isPublished !== false,
      },
    });
    res.json({ success: true, data: faq });
  } catch (e: any) {
    console.error('Create FAQ error:', e);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

router.put('/faqs/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, order, isPublished } = req.body || {};
    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        ...(question !== undefined && { question }),
        ...(answer !== undefined && { answer }),
        ...(category !== undefined && { category }),
        ...(order !== undefined && { order }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });
    res.json({ success: true, data: faq });
  } catch (e: any) {
    console.error('Update FAQ error:', e);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

router.delete('/faqs/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    await prisma.fAQ.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) {
    console.error('Delete FAQ error:', e);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

// ========================================
// MILESTONE CONFIG (per-category bonus points tied to order count)
// ========================================
router.get('/milestone-config', authenticate, requireAdmin, async (_req: AuthRequest, res) => {
  try {
    const rows = await prisma.milestoneConfig.findMany({ orderBy: [{ category: 'asc' }, { tier: 'asc' }] });
    res.json({ success: true, data: rows });
  } catch (e: any) {
    console.error('List milestone config error:', e);
    res.status(500).json({ error: 'Failed to load milestone config' });
  }
});

router.put('/milestone-config', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { entries } = req.body || {};
    if (!Array.isArray(entries)) return res.status(400).json({ error: 'entries[] required' });
    const updated = await prisma.$transaction(
      entries.map((e: any) =>
        prisma.milestoneConfig.upsert({
          where: { MilestoneConfig_category_tier_unique: { category: e.category, tier: Number(e.tier) } },
          update: { orderThreshold: Number(e.orderThreshold), bonusPoints: Number(e.bonusPoints) },
          create: {
            category: e.category,
            tier: Number(e.tier),
            orderThreshold: Number(e.orderThreshold),
            bonusPoints: Number(e.bonusPoints),
          },
        })
      )
    );
    res.json({ success: true, data: updated });
  } catch (e: any) {
    console.error('Update milestone config error:', e);
    res.status(500).json({ error: 'Failed to update milestone config' });
  }
});

// ========================================
// SUBSCRIPTION PLANS (admin CRUD; active plans readable to vendors via /subscription-plans)
// ========================================
router.get('/subscription-plans', authenticate, requireAdmin, async (_req: AuthRequest, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({ orderBy: { displayOrder: 'asc' } });
    res.json({ success: true, data: plans });
  } catch (e: any) {
    console.error('List plans error:', e);
    res.status(500).json({ error: 'Failed to load plans' });
  }
});

router.put('/subscription-plans/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, priceCents, billingPeriod, savingsLabel, features, stripePriceId, isActive, displayOrder } = req.body || {};
    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(priceCents !== undefined && { priceCents: Number(priceCents) }),
        ...(billingPeriod !== undefined && { billingPeriod }),
        ...(savingsLabel !== undefined && { savingsLabel }),
        ...(features !== undefined && { features }),
        ...(stripePriceId !== undefined && { stripePriceId }),
        ...(isActive !== undefined && { isActive }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
      },
    });
    res.json({ success: true, data: plan });
  } catch (e: any) {
    console.error('Update plan error:', e);
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// ========================================
// REGIONS — extend PUT to accept notes, add bulk activate/deactivate
// ========================================
router.patch('/regions/bulk', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { ids, isActive } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids[] required' });
    if (typeof isActive !== 'boolean') return res.status(400).json({ error: 'isActive boolean required' });
    const result = await prisma.region.updateMany({ where: { id: { in: ids } }, data: { isActive } });
    res.json({ success: true, data: { updated: result.count } });
  } catch (e: any) {
    console.error('Bulk region toggle error:', e);
    res.status(500).json({ error: 'Failed to bulk toggle regions' });
  }
});

// ========================================
// USERS COUNTS — for push audience picker
// ========================================
router.get('/users/counts', authenticate, requireAdmin, async (_req: AuthRequest, res) => {
  try {
    const [total, customers, vendors, admins, active] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'VENDOR' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { isActive: true } }),
    ]);
    res.json({ success: true, data: { total, customers, vendors, admins, active } });
  } catch (e: any) {
    console.error('User counts error:', e);
    res.status(500).json({ error: 'Failed to load user counts' });
  }
});

// ========================================
// STRIPE TEST CONNECTION — real call against the configured secret key
// ========================================
router.post('/payments/test-stripe-connection', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { secretKey: bodyKey } = req.body || {};
    const settings = await prisma.platformSettings.findFirst();
    const secret = bodyKey || settings?.stripeSecretKey;
    if (!secret) return res.status(400).json({ error: 'No Stripe secret key configured' });

    try {
      const Stripe = (await import('stripe')).default as any;
      const stripe = new Stripe(secret, { apiVersion: '2024-06-20' });
      const balance = await stripe.balance.retrieve();
      const mode = secret.startsWith('sk_live_') ? 'live' : 'test';
      res.json({ success: true, data: { mode, available: balance.available, pending: balance.pending } });
    } catch (sErr: any) {
      res.status(400).json({ error: sErr?.message || 'Stripe rejected the key' });
    }
  } catch (e: any) {
    console.error('Stripe test error:', e);
    res.status(500).json({ error: 'Failed to test Stripe connection' });
  }
});

// ========================================
// CUSTOM REPORT BUILDER — aggregate selected dimensions
// ========================================
router.post('/reports/custom', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { dateRange, metrics } = req.body || {};
    const now = new Date();
    let startDate = new Date(now);
    switch (dateRange) {
      case '7days': startDate.setDate(now.getDate() - 7); break;
      case '30days': startDate.setDate(now.getDate() - 30); break;
      case '90days': startDate.setDate(now.getDate() - 90); break;
      case 'year': startDate.setFullYear(now.getFullYear() - 1); break;
      default: startDate.setDate(now.getDate() - 30);
    }

    const want = (k: string) => Array.isArray(metrics) ? metrics.includes(k) : true;
    const out: any = { dateRange, startDate, endDate: now };

    if (want('revenue')) {
      const orderRevenue = await prisma.order.aggregate({
        where: { status: 'COMPLETED', createdAt: { gte: startDate } },
        _sum: { total: true }, _count: { _all: true },
      });
      out.revenue = orderRevenue._sum.total || 0;
      out.orderCount = orderRevenue._count._all;
    }
    if (want('bookings')) {
      out.bookings = await prisma.booking.count({ where: { createdAt: { gte: startDate } } });
    }
    if (want('users')) {
      out.newUsers = await prisma.user.count({ where: { createdAt: { gte: startDate } } });
      out.totalUsers = await prisma.user.count();
    }
    if (want('vendors')) {
      out.newVendors = await prisma.vendor.count({ where: { createdAt: { gte: startDate } } });
      out.totalVendors = await prisma.vendor.count({ where: { status: 'APPROVED' } });
    }
    if (want('reviews')) {
      const reviewAgg = await prisma.review.aggregate({
        where: { createdAt: { gte: startDate } },
        _avg: { rating: true }, _count: { _all: true },
      });
      out.avgRating = reviewAgg._avg.rating || 0;
      out.reviewCount = reviewAgg._count._all;
    }

    res.json({ success: true, data: out });
  } catch (e: any) {
    console.error('Custom report error:', e);
    res.status(500).json({ error: 'Failed to build report' });
  }
});

// ========================================
// SCHEDULED PUSH (admin CRUD + the cron picks them up server-side)
// ========================================
router.get('/scheduled-pushes', authenticate, requireAdmin, async (_req: AuthRequest, res) => {
  try {
    const rows = await prisma.scheduledPushNotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { createdBy: { select: { id: true, email: true } } },
    });
    res.json({ success: true, data: rows });
  } catch (e: any) {
    console.error('List scheduled pushes error:', e);
    res.status(500).json({ error: 'Failed to load scheduled pushes' });
  }
});

router.post('/scheduled-pushes', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { title, body, link, targetType, targetIds, scheduledFor } = req.body || {};
    if (!title || !body) return res.status(400).json({ error: 'title and body are required' });
    const allowed = ['ALL', 'CUSTOMERS', 'VENDORS', 'SPECIFIC'];
    if (targetType && !allowed.includes(targetType)) return res.status(400).json({ error: 'Invalid targetType' });
    const row = await prisma.scheduledPushNotification.create({
      data: {
        title, body,
        link: link || null,
        targetType: targetType || 'ALL',
        targetIds: Array.isArray(targetIds) ? targetIds : [],
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        status: 'SCHEDULED',
        createdById: req.user!.id,
      },
    });
    res.json({ success: true, data: row });
  } catch (e: any) {
    console.error('Create scheduled push error:', e);
    res.status(500).json({ error: 'Failed to schedule push' });
  }
});

router.delete('/scheduled-pushes/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const row = await prisma.scheduledPushNotification.findUnique({ where: { id: req.params.id } });
    if (!row) return res.status(404).json({ error: 'Not found' });
    if (row.status === 'SENT') return res.status(400).json({ error: 'Cannot cancel a sent push' });
    await prisma.scheduledPushNotification.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });
    res.json({ success: true });
  } catch (e: any) {
    console.error('Cancel scheduled push error:', e);
    res.status(500).json({ error: 'Failed to cancel push' });
  }
});

export default router;
