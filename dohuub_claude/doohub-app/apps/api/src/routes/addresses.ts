import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all addresses
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({ success: true, data: addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Failed to get addresses' });
  }
});

// Create address
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { type, label, street, apartment, city, state, zipCode, country, isDefault } = req.body;

    // If this is the default address, unset others
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user!.id,
        type: type || 'HOME',
        label,
        street,
        apartment,
        city,
        state,
        zipCode,
        country: country || 'USA',
        isDefault: isDefault || false,
      },
    });

    res.status(201).json({ success: true, data: address });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ error: 'Failed to create address' });
  }
});

// Update address
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { type, label, street, apartment, city, state, zipCode, country, isDefault } = req.body;

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If this is the default address, unset others
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        type,
        label,
        street,
        apartment,
        city,
        state,
        zipCode,
        country,
        isDefault,
      },
    });

    res.json({ success: true, data: address });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// Delete address
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await prisma.address.delete({ where: { id } });

    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// Set default address
router.post('/:id/default', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Unset all defaults
    await prisma.address.updateMany({
      where: { userId: req.user!.id },
      data: { isDefault: false },
    });

    // Set this as default
    const address = await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    res.json({ success: true, data: address });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ error: 'Failed to set default address' });
  }
});

export default router;

