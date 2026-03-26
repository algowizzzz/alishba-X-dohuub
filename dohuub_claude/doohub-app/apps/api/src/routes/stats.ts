import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// ========================================
// VENDOR DASHBOARD STATS
// ========================================

// Get vendor dashboard statistics
router.get('/vendor/dashboard', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    // Get date ranges
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Count all stores
    const totalStores = await prisma.vendorStore.count({
      where: { vendorId: vendor.id },
    });

    const activeStores = await prisma.vendorStore.count({
      where: { vendorId: vendor.id, status: 'ACTIVE' },
    });

    // Count all listings across different types
    const [
      cleaningCount,
      handymanCount,
      beautyCount,
      groceryCount,
      rentalCount,
      foodCount,
      beautyProductCount,
      rideAssistanceCount,
      companionshipCount,
    ] = await Promise.all([
      prisma.cleaningListing.count({ where: { vendorId: vendor.id } }),
      prisma.handymanListing.count({ where: { vendorId: vendor.id } }),
      prisma.beautyListing.count({ where: { vendorId: vendor.id } }),
      prisma.groceryListing.count({ where: { vendorId: vendor.id } }),
      prisma.rentalListing.count({ where: { vendorId: vendor.id } }),
      prisma.foodListing.count({ where: { vendorId: vendor.id } }),
      prisma.beautyProductListing.count({ where: { vendorId: vendor.id } }),
      prisma.rideAssistanceListing.count({ where: { vendorId: vendor.id } }),
      prisma.companionshipListing.count({ where: { vendorId: vendor.id } }),
    ]);

    const totalListings = cleaningCount + handymanCount + beautyCount + groceryCount +
                          rentalCount + foodCount + beautyProductCount +
                          rideAssistanceCount + companionshipCount;

    // Count active listings
    const [
      activeCleaningCount,
      activeHandymanCount,
      activeBeautyCount,
      activeGroceryCount,
      activeRentalCount,
      activeFoodCount,
      activeBeautyProductCount,
      activeRideAssistanceCount,
      activeCompanionshipCount,
    ] = await Promise.all([
      prisma.cleaningListing.count({ where: { vendorId: vendor.id, status: 'ACTIVE' } }),
      prisma.handymanListing.count({ where: { vendorId: vendor.id, status: 'ACTIVE' } }),
      prisma.beautyListing.count({ where: { vendorId: vendor.id, status: 'ACTIVE' } }),
      prisma.groceryListing.count({ where: { vendorId: vendor.id, status: 'ACTIVE' } }),
      prisma.rentalListing.count({ where: { vendorId: vendor.id, status: 'ACTIVE' } }),
      prisma.foodListing.count({ where: { vendorId: vendor.id, status: 'ACTIVE' } }),
      prisma.beautyProductListing.count({ where: { vendorId: vendor.id, status: 'ACTIVE' } }),
      prisma.rideAssistanceListing.count({ where: { vendorId: vendor.id, status: 'ACTIVE' } }),
      prisma.companionshipListing.count({ where: { vendorId: vendor.id, status: 'ACTIVE' } }),
    ]);

    const activeListings = activeCleaningCount + activeHandymanCount + activeBeautyCount +
                           activeGroceryCount + activeRentalCount + activeFoodCount +
                           activeBeautyProductCount + activeRideAssistanceCount +
                           activeCompanionshipCount;

    // Get booking statistics
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      todayBookings,
      weekBookings,
      monthBookings,
    ] = await Promise.all([
      prisma.booking.count({ where: { vendorId: vendor.id } }),
      prisma.booking.count({ where: { vendorId: vendor.id, status: 'PENDING' } }),
      prisma.booking.count({ where: { vendorId: vendor.id, status: 'ACCEPTED' } }),
      prisma.booking.count({ where: { vendorId: vendor.id, status: 'COMPLETED' } }),
      prisma.booking.count({ where: { vendorId: vendor.id, status: 'CANCELLED' } }),
      prisma.booking.count({ where: { vendorId: vendor.id, createdAt: { gte: startOfToday } } }),
      prisma.booking.count({ where: { vendorId: vendor.id, createdAt: { gte: startOfWeek } } }),
      prisma.booking.count({ where: { vendorId: vendor.id, createdAt: { gte: startOfMonth } } }),
    ]);

    // Get order statistics
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      todayOrders,
      weekOrders,
      monthOrders,
    ] = await Promise.all([
      prisma.order.count({ where: { vendorId: vendor.id } }),
      prisma.order.count({ where: { vendorId: vendor.id, status: 'PENDING' } }),
      prisma.order.count({ where: { vendorId: vendor.id, status: 'IN_PROGRESS' } }),
      prisma.order.count({ where: { vendorId: vendor.id, status: 'COMPLETED' } }),
      prisma.order.count({ where: { vendorId: vendor.id, createdAt: { gte: startOfToday } } }),
      prisma.order.count({ where: { vendorId: vendor.id, createdAt: { gte: startOfWeek } } }),
      prisma.order.count({ where: { vendorId: vendor.id, createdAt: { gte: startOfMonth } } }),
    ]);

    // Get revenue statistics
    const [thisMonthRevenue, lastMonthRevenue] = await Promise.all([
      prisma.order.aggregate({
        where: {
          vendorId: vendor.id,
          status: 'COMPLETED',
          createdAt: { gte: startOfMonth },
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          vendorId: vendor.id,
          status: 'COMPLETED',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { total: true },
      }),
    ]);

    // Get reviews statistics
    const reviews = await prisma.review.aggregate({
      where: { vendorId: vendor.id },
      _avg: { rating: true },
      _count: true,
    });

    const recentReviews = await prisma.review.findMany({
      where: { vendorId: vendor.id },
      include: {
        user: { select: { id: true, email: true, profile: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      where: { vendorId: vendor.id },
      include: {
        user: { select: { id: true, email: true, profile: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: { vendorId: vendor.id },
      include: {
        user: { select: { id: true, email: true, profile: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    res.json({
      success: true,
      data: {
        stores: {
          total: totalStores,
          active: activeStores,
        },
        listings: {
          total: totalListings,
          active: activeListings,
          byCategory: {
            cleaning: cleaningCount,
            handyman: handymanCount,
            beauty: beautyCount,
            grocery: groceryCount,
            rental: rentalCount,
            food: foodCount,
            beautyProducts: beautyProductCount,
            rideAssistance: rideAssistanceCount,
            companionship: companionshipCount,
          },
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
          today: todayBookings,
          thisWeek: weekBookings,
          thisMonth: monthBookings,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          completed: completedOrders,
          today: todayOrders,
          thisWeek: weekOrders,
          thisMonth: monthOrders,
        },
        revenue: {
          thisMonth: thisMonthRevenue._sum.total || 0,
          lastMonth: lastMonthRevenue._sum.total || 0,
          growth: lastMonthRevenue._sum.total
            ? ((((thisMonthRevenue._sum.total || 0) - lastMonthRevenue._sum.total) / lastMonthRevenue._sum.total) * 100).toFixed(1)
            : null,
        },
        reviews: {
          averageRating: reviews._avg.rating || 0,
          totalCount: reviews._count,
          recent: recentReviews,
        },
        recentActivity: {
          bookings: recentBookings,
          orders: recentOrders,
        },
      },
    });
  } catch (error) {
    console.error('Get vendor dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard statistics' });
  }
});

// Get vendor earnings breakdown
router.get('/vendor/earnings', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const { period = 'month' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get earnings by category
    const orders = await prisma.order.findMany({
      where: {
        vendorId: vendor.id,
        status: 'COMPLETED',
        createdAt: { gte: startDate },
      },
      include: {
        items: true,
      },
    });

    // Calculate earnings breakdown
    const earningsByCategory: Record<string, number> = {};
    let totalEarnings = 0;

    for (const order of orders) {
      for (const item of order.items) {
        const category = item.listingType || 'other';
        const amount = Number(item.price) * item.quantity;
        earningsByCategory[category] = (earningsByCategory[category] || 0) + amount;
        totalEarnings += amount;
      }
    }

    // Get daily earnings for chart
    const dailyEarnings = await prisma.$queryRaw<Array<{ date: Date; total: number }>>`
      SELECT DATE(created_at) as date, SUM(total) as total
      FROM "Order"
      WHERE vendor_id = ${vendor.id}
        AND status = 'DELIVERED'
        AND created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    res.json({
      success: true,
      data: {
        period,
        totalEarnings,
        byCategory: earningsByCategory,
        dailyTrend: dailyEarnings,
        orderCount: orders.length,
      },
    });
  } catch (error) {
    console.error('Get vendor earnings error:', error);
    res.status(500).json({ error: 'Failed to get earnings data' });
  }
});

// ========================================
// ADMIN DASHBOARD STATS
// ========================================

// Get admin dashboard statistics
router.get('/admin/dashboard', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    // Get date ranges
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // User statistics
    const [
      totalUsers,
      activeUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

    // Vendor statistics
    const [
      totalVendors,
      pendingVendors,
      approvedVendors,
      suspendedVendors,
      newVendorsThisMonth,
    ] = await Promise.all([
      prisma.vendor.count(),
      prisma.vendor.count({ where: { status: 'PENDING' } }),
      prisma.vendor.count({ where: { status: 'APPROVED' } }),
      prisma.vendor.count({ where: { status: 'SUSPENDED' } }),
      prisma.vendor.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

    // Michelle profile statistics (vendors with isMichelle: true)
    const [
      totalMichelleProfiles,
      activeMichelleProfiles,
      pendingMichelleProfiles,
    ] = await Promise.all([
      prisma.vendor.count({ where: { isMichelle: true } }),
      prisma.vendor.count({ where: { isMichelle: true, status: 'APPROVED' } }),
      prisma.vendor.count({ where: { isMichelle: true, status: 'PENDING' } }),
    ]);

    // Store statistics
    const [
      totalStores,
      activeStores,
    ] = await Promise.all([
      prisma.vendorStore.count(),
      prisma.vendorStore.count({ where: { status: 'ACTIVE' } }),
    ]);

    // Listing statistics across all types
    const [
      totalCleaningListings,
      totalHandymanListings,
      totalBeautyListings,
      totalGroceryListings,
      totalRentalListings,
      totalFoodListings,
      totalBeautyProductListings,
      totalRideAssistanceListings,
      totalCompanionshipListings,
    ] = await Promise.all([
      prisma.cleaningListing.count(),
      prisma.handymanListing.count(),
      prisma.beautyListing.count(),
      prisma.groceryListing.count(),
      prisma.rentalListing.count(),
      prisma.foodListing.count(),
      prisma.beautyProductListing.count(),
      prisma.rideAssistanceListing.count(),
      prisma.companionshipListing.count(),
    ]);

    const totalListings = totalCleaningListings + totalHandymanListings + totalBeautyListings +
                          totalGroceryListings + totalRentalListings + totalFoodListings +
                          totalBeautyProductListings + totalRideAssistanceListings +
                          totalCompanionshipListings;

    // Booking statistics
    const [
      totalBookings,
      pendingBookings,
      completedBookings,
      bookingsToday,
      bookingsThisMonth,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.booking.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

    // Order statistics
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      ordersToday,
      ordersThisMonth,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

    // Revenue statistics
    const [thisMonthRevenue, lastMonthRevenue, totalRevenue] = await Promise.all([
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: startOfMonth },
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { total: true },
      }),
    ]);

    // Region statistics
    const [totalRegions, activeRegions] = await Promise.all([
      prisma.region.count(),
      prisma.region.count({ where: { isActive: true } }),
    ]);

    // Recent activity
    const [recentVendors, recentUsers, recentBookings, recentOrders] = await Promise.all([
      prisma.vendor.findMany({
        include: { user: { select: { id: true, email: true, profile: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.user.findMany({
        select: { id: true, email: true, profile: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.booking.findMany({
        include: {
          user: { select: { id: true, email: true, profile: true } },
          vendor: { include: { user: { select: { id: true, email: true, profile: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.order.findMany({
        include: {
          user: { select: { id: true, email: true, profile: true } },
          vendor: { include: { user: { select: { id: true, email: true, profile: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          newToday: newUsersToday,
          newThisWeek: newUsersThisWeek,
          newThisMonth: newUsersThisMonth,
        },
        vendors: {
          total: totalVendors,
          pending: pendingVendors,
          approved: approvedVendors,
          suspended: suspendedVendors,
          newThisMonth: newVendorsThisMonth,
        },
        michelleProfiles: {
          total: totalMichelleProfiles,
          active: activeMichelleProfiles,
          pending: pendingMichelleProfiles,
        },
        stores: {
          total: totalStores,
          active: activeStores,
        },
        listings: {
          total: totalListings,
          byCategory: {
            cleaning: totalCleaningListings,
            handyman: totalHandymanListings,
            beauty: totalBeautyListings,
            grocery: totalGroceryListings,
            rental: totalRentalListings,
            food: totalFoodListings,
            beautyProducts: totalBeautyProductListings,
            rideAssistance: totalRideAssistanceListings,
            companionship: totalCompanionshipListings,
          },
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          completed: completedBookings,
          today: bookingsToday,
          thisMonth: bookingsThisMonth,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          today: ordersToday,
          thisMonth: ordersThisMonth,
        },
        revenue: {
          total: totalRevenue._sum.total || 0,
          thisMonth: thisMonthRevenue._sum.total || 0,
          lastMonth: lastMonthRevenue._sum.total || 0,
          growth: lastMonthRevenue._sum.total
            ? ((((thisMonthRevenue._sum.total || 0) - lastMonthRevenue._sum.total) / lastMonthRevenue._sum.total) * 100).toFixed(1)
            : null,
        },
        regions: {
          total: totalRegions,
          active: activeRegions,
        },
        recentActivity: {
          vendors: recentVendors,
          users: recentUsers,
          bookings: recentBookings,
          orders: recentOrders,
        },
      },
    });
  } catch (error) {
    console.error('Get admin dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard statistics' });
  }
});

// Get admin revenue analytics
router.get('/admin/revenue', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { period = 'month', groupBy = 'day' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get revenue by category
    const orders = await prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startDate },
      },
      include: {
        items: true,
        vendor: { include: { user: { select: { id: true, email: true, profile: true } } } },
      },
    });

    // Calculate revenue breakdown by category
    const revenueByCategory: Record<string, number> = {};
    const revenueByVendor: Record<string, { name: string; amount: number }> = {};
    let totalRevenue = 0;

    for (const order of orders) {
      // By category
      for (const item of order.items) {
        const category = item.listingType || 'other';
        const amount = Number(item.price) * item.quantity;
        revenueByCategory[category] = (revenueByCategory[category] || 0) + amount;
        totalRevenue += amount;
      }

      // By vendor
      if (order.vendor) {
        const vendorName = order.vendor.businessName || `${order.vendor.user?.profile?.firstName || ''} ${order.vendor.user?.profile?.lastName || ''}`.trim() || 'Unknown';
        if (!revenueByVendor[order.vendorId]) {
          revenueByVendor[order.vendorId] = { name: vendorName, amount: 0 };
        }
        revenueByVendor[order.vendorId].amount += Number(order.total);
      }
    }

    // Top vendors by revenue
    const topVendors = Object.values(revenueByVendor)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        period,
        totalRevenue,
        byCategory: revenueByCategory,
        topVendors,
        orderCount: orders.length,
      },
    });
  } catch (error) {
    console.error('Get admin revenue analytics error:', error);
    res.status(500).json({ error: 'Failed to get revenue analytics' });
  }
});

// Get admin user analytics
router.get('/admin/users/analytics', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { period = 'month' } = req.query;

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }

    // User growth over time
    const newUsers = await prisma.user.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, role: true },
    });

    // Group by day
    const usersByDay: Record<string, { customers: number; vendors: number }> = {};
    for (const user of newUsers) {
      const day = user.createdAt.toISOString().split('T')[0];
      if (!usersByDay[day]) {
        usersByDay[day] = { customers: 0, vendors: 0 };
      }
      if (user.role === 'VENDOR') {
        usersByDay[day].vendors++;
      } else {
        usersByDay[day].customers++;
      }
    }

    // User retention (users who made a booking/order in the period)
    const activeUserIds = await prisma.booking.findMany({
      where: { createdAt: { gte: startDate } },
      select: { userId: true },
      distinct: ['userId'],
    });

    const totalUsersBeforePeriod = await prisma.user.count({
      where: { createdAt: { lt: startDate } },
    });

    const retentionRate = totalUsersBeforePeriod > 0
      ? ((activeUserIds.length / totalUsersBeforePeriod) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        period,
        newUsers: newUsers.length,
        growth: usersByDay,
        activeUsers: activeUserIds.length,
        retentionRate,
      },
    });
  } catch (error) {
    console.error('Get admin user analytics error:', error);
    res.status(500).json({ error: 'Failed to get user analytics' });
  }
});

export default router;
