import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all stores for current vendor
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const { status, category, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { vendorId: vendor.id };

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    const stores = await prisma.vendorStore.findMany({
      where,
      include: {
        regions: {
          include: { region: true },
        },
        _count: {
          select: {
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

    const total = await prisma.vendorStore.count({ where });

    res.json({
      success: true,
      data: stores,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Failed to get stores' });
  }
});

// Create a new store
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const { name, category, description, logo, phone, email, regionIds, status } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'name and category are required' });
    }

    // Create store with regions in a transaction
    const store = await prisma.$transaction(async (tx) => {
      const newStore = await tx.vendorStore.create({
        data: {
          vendorId: vendor.id,
          name,
          category,
          description: description || null,
          logo: logo || null,
          phone: phone || null,
          email: email || null,
          status: status || 'ACTIVE',
        },
      });

      // Assign regions if provided
      if (regionIds && Array.isArray(regionIds) && regionIds.length > 0) {
        await tx.vendorStoreRegion.createMany({
          data: regionIds.map((regionId: string) => ({
            storeId: newStore.id,
            regionId,
            isActive: true,
          })),
        });
      }

      return tx.vendorStore.findUnique({
        where: { id: newStore.id },
        include: {
          regions: {
            include: { region: true },
          },
        },
      });
    });

    res.status(201).json({ success: true, data: store });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Failed to create store' });
  }
});

// Get store by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const store = await prisma.vendorStore.findFirst({
      where: { id, vendorId: vendor.id },
      include: {
        regions: {
          include: { region: true },
        },
        foodListings: { where: { status: 'ACTIVE' }, take: 10 },
        beautyProductListings: { where: { status: 'ACTIVE' }, take: 10 },
        rideAssistanceListings: { where: { status: 'ACTIVE' }, take: 10 },
        companionshipListings: { where: { status: 'ACTIVE' }, take: 10 },
        _count: {
          select: {
            foodListings: true,
            beautyProductListings: true,
            rideAssistanceListings: true,
            companionshipListings: true,
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({ success: true, data: store });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ error: 'Failed to get store' });
  }
});

// Update store
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.vendorStore.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const { name, category, description, logo, phone, email, regionIds, status } = req.body;

    // Update store with regions in a transaction
    const store = await prisma.$transaction(async (tx) => {
      const updatedStore = await tx.vendorStore.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(category && { category }),
          ...(description !== undefined && { description }),
          ...(logo !== undefined && { logo }),
          ...(phone !== undefined && { phone }),
          ...(email !== undefined && { email }),
          ...(status && { status }),
        },
      });

      // Update regions if provided
      if (regionIds !== undefined && Array.isArray(regionIds)) {
        // Delete existing regions
        await tx.vendorStoreRegion.deleteMany({
          where: { storeId: id },
        });

        // Create new regions
        if (regionIds.length > 0) {
          await tx.vendorStoreRegion.createMany({
            data: regionIds.map((regionId: string) => ({
              storeId: id,
              regionId,
              isActive: true,
            })),
          });
        }
      }

      return tx.vendorStore.findUnique({
        where: { id },
        include: {
          regions: {
            include: { region: true },
          },
        },
      });
    });

    res.json({ success: true, data: store });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ error: 'Failed to update store' });
  }
});

// Delete store
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const existing = await prisma.vendorStore.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Store not found' });
    }

    await prisma.vendorStore.delete({ where: { id } });

    res.json({ success: true, message: 'Store deleted' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ error: 'Failed to delete store' });
  }
});

// Add regions to store
router.post('/:id/regions', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { regionIds } = req.body;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const store = await prisma.vendorStore.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    if (!regionIds || !Array.isArray(regionIds) || regionIds.length === 0) {
      return res.status(400).json({ error: 'regionIds array is required' });
    }

    // Add regions (skip if already exists)
    await prisma.vendorStoreRegion.createMany({
      data: regionIds.map((regionId: string) => ({
        storeId: id,
        regionId,
        isActive: true,
      })),
      skipDuplicates: true,
    });

    const updatedStore = await prisma.vendorStore.findUnique({
      where: { id },
      include: {
        regions: {
          include: { region: true },
        },
      },
    });

    res.json({ success: true, data: updatedStore });
  } catch (error) {
    console.error('Add regions error:', error);
    res.status(500).json({ error: 'Failed to add regions' });
  }
});

// Remove region from store
router.delete('/:id/regions/:regionId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id, regionId } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const store = await prisma.vendorStore.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    await prisma.vendorStoreRegion.deleteMany({
      where: { storeId: id, regionId },
    });

    const updatedStore = await prisma.vendorStore.findUnique({
      where: { id },
      include: {
        regions: {
          include: { region: true },
        },
      },
    });

    res.json({ success: true, data: updatedStore });
  } catch (error) {
    console.error('Remove region error:', error);
    res.status(500).json({ error: 'Failed to remove region' });
  }
});

// Update store status (activate/deactivate)
router.patch('/:id/status', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user!.id },
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const store = await prisma.vendorStore.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    if (!status || !['ACTIVE', 'PAUSED', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required (ACTIVE, PAUSED, SUSPENDED)' });
    }

    const updatedStore = await prisma.vendorStore.update({
      where: { id },
      data: { status },
      include: {
        regions: {
          include: { region: true },
        },
      },
    });

    res.json({ success: true, data: updatedStore });
  } catch (error) {
    console.error('Update store status error:', error);
    res.status(500).json({ error: 'Failed to update store status' });
  }
});

export default router;
