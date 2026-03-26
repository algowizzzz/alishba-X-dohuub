import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

type UiReportStatus = 'PENDING' | 'REVIEWED' | 'IN_REVIEW' | 'RESOLVED' | 'DISMISSED';

function dbStatusFromUiStatus(status: unknown): 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED' | undefined {
  if (!status || typeof status !== 'string') return undefined;
  const s = status.toUpperCase();
  if (s === 'PENDING') return 'PENDING';
  if (s === 'REVIEWED' || s === 'IN_REVIEW') return 'REVIEWED';
  if (s === 'RESOLVED') return 'RESOLVED';
  if (s === 'DISMISSED') return 'DISMISSED';
  return undefined;
}

function uiStatusFromDbStatus(status: string): UiReportStatus {
  switch (status) {
    case 'PENDING':
      return 'PENDING';
    case 'REVIEWED':
      return 'REVIEWED';
    case 'RESOLVED':
      return 'RESOLVED';
    case 'DISMISSED':
      return 'DISMISSED';
    default:
      return 'REVIEWED';
  }
}

function normalizeListingType(listingType: unknown): string {
  if (!listingType || typeof listingType !== 'string') return 'UNKNOWN';
  const t = listingType.trim().toUpperCase();
  if (t.includes('CLEAN')) return 'CLEANING';
  if (t.includes('HANDY')) return 'HANDYMAN';
  if (t.includes('BEAUT')) return 'BEAUTY';
  if (t.includes('GROC')) return 'GROCERIES';
  if (t.includes('RENT')) return 'RENTALS';
  if (t.includes('CARE')) return 'CAREGIVING';
  return t;
}

async function getListingForReport(listingTypeRaw: unknown, listingId: string) {
  const listingType = normalizeListingType(listingTypeRaw);

  switch (listingType) {
    case 'CLEANING': {
      const listing = await prisma.cleaningListing.findUnique({
        where: { id: listingId },
        include: { vendor: { select: { id: true, businessName: true } } },
      });
      if (!listing) return null;
      return { id: listing.id, title: listing.title, category: 'CLEANING', vendor: listing.vendor };
    }
    case 'HANDYMAN': {
      const listing = await prisma.handymanListing.findUnique({
        where: { id: listingId },
        include: { vendor: { select: { id: true, businessName: true } } },
      });
      if (!listing) return null;
      return { id: listing.id, title: listing.title, category: 'HANDYMAN', vendor: listing.vendor };
    }
    case 'BEAUTY': {
      const listing = await prisma.beautyListing.findUnique({
        where: { id: listingId },
        include: { vendor: { select: { id: true, businessName: true } } },
      });
      if (!listing) return null;
      return { id: listing.id, title: listing.title, category: 'BEAUTY', vendor: listing.vendor };
    }
    case 'GROCERIES': {
      const listing = await prisma.groceryListing.findUnique({
        where: { id: listingId },
        include: { vendor: { select: { id: true, businessName: true } } },
      });
      if (!listing) return null;
      return { id: listing.id, title: listing.name, category: 'GROCERIES', vendor: listing.vendor };
    }
    case 'RENTALS': {
      const listing = await prisma.rentalListing.findUnique({
        where: { id: listingId },
        include: { vendor: { select: { id: true, businessName: true } } },
      });
      if (!listing) return null;
      return { id: listing.id, title: listing.title, category: 'RENTALS', vendor: listing.vendor };
    }
    case 'CAREGIVING': {
      const listing = await prisma.caregivingListing.findUnique({
        where: { id: listingId },
        include: { vendor: { select: { id: true, businessName: true } } },
      });
      if (!listing) return null;
      return { id: listing.id, title: listing.title, category: 'CAREGIVING', vendor: listing.vendor };
    }
    default:
      return null;
  }
}

// Get all reports (admin only)
router.get('/', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { status, listingType, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    const dbStatus = dbStatusFromUiStatus(status);
    if (dbStatus) where.status = dbStatus;
    if (listingType) where.listingType = listingType;

    const reports = await prisma.report.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    const total = await prisma.report.count({ where });

    // Get counts by status
    const statusCounts = await prisma.report.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const shaped = await Promise.all(
      reports.map(async (r) => {
        const listing = await getListingForReport(r.listingType, r.listingId);
        return {
          id: r.id,
          reason: r.reason,
          description: r.comment ?? undefined,
          status: uiStatusFromDbStatus(r.status),
          createdAt: r.createdAt,
          resolvedAt: r.reviewedAt ?? undefined,
          resolution: r.resolution ?? undefined,
          reporter: r.user,
          listing,
        };
      })
    );

    res.json({
      success: true,
      data: shaped,
      counts: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
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

// Get report by ID (admin only)
router.get('/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
      },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const listing = await getListingForReport(report.listingType, report.listingId);

    res.json({
      success: true,
      data: {
        id: report.id,
        reason: report.reason,
        description: report.comment ?? undefined,
        status: uiStatusFromDbStatus(report.status),
        createdAt: report.createdAt,
        resolvedAt: report.reviewedAt ?? undefined,
        resolution: report.resolution ?? undefined,
        reporter: report.user,
        listing,
      },
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Failed to get report' });
  }
});

// Update report (resolve/dismiss) - admin only
router.put('/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, resolution } = req.body;

    const dbStatus = dbStatusFromUiStatus(status);
    if (!dbStatus) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const report = await prisma.report.update({
      where: { id },
      data: {
        status: dbStatus,
        resolution,
        reviewedAt: dbStatus === 'RESOLVED' || dbStatus === 'DISMISSED' ? new Date() : undefined,
        reviewedBy: req.user!.id,
      },
      include: {
        user: {
          select: { id: true, email: true, profile: true },
        },
      },
    });

    const listing = await getListingForReport(report.listingType, report.listingId);

    res.json({
      success: true,
      data: {
        id: report.id,
        reason: report.reason,
        description: report.comment ?? undefined,
        status: uiStatusFromDbStatus(report.status),
        createdAt: report.createdAt,
        resolvedAt: report.reviewedAt ?? undefined,
        resolution: report.resolution ?? undefined,
        reporter: report.user,
        listing,
      },
    });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// Create a report (any authenticated user)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { listingType, listingId, reason, comment } = req.body;

    if (!listingType || !listingId || !reason) {
      return res.status(400).json({ error: 'listingType, listingId and reason are required' });
    }

    const report = await prisma.report.create({
      data: {
        userId: req.user!.id,
        listingType,
        listingId,
        reason,
        comment,
        status: 'PENDING',
      },
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

export default router;
