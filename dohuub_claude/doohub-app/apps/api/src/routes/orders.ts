import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const DELIVERY_FEE = 5.99;
const SERVICE_FEE_PERCENTAGE = 0.05; // 5%

// Get user's orders
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId: req.user!.id };
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: {
        vendor: true,
        address: true,
        items: {
          include: { groceryListing: true, foodListing: true, beautyProductListing: true },
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
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, userId: req.user!.id },
      include: {
        vendor: true,
        address: true,
        items: {
          include: { groceryListing: true, foodListing: true, beautyProductListing: true },
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

// Create order from cart
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { addressId, specialNotes } = req.body;

    // Get user's cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!cart.vendorId) {
      return res.status(400).json({ error: 'No vendor selected' });
    }

    // Fetch grocery listings for cart items
    const cartItemsWithListings = await Promise.all(
      cart.items.map(async (item) => {
        const listing = await prisma.groceryListing.findUnique({
          where: { id: item.listingId },
        });
        return { ...item, listing };
      })
    );

    // Calculate totals
    const subtotal = cartItemsWithListings.reduce((sum: number, item) => {
      return sum + item.quantity * (item.listing?.price || 0);
    }, 0);

    const serviceFee = subtotal * SERVICE_FEE_PERCENTAGE;
    const total = subtotal + DELIVERY_FEE + serviceFee;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        vendorId: cart.vendorId,
        addressId,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        serviceFee,
        total,
        specialNotes,
        status: 'PENDING',
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes
        items: {
          create: cartItemsWithListings.map(item => ({
            listingId: item.listingId,
            quantity: item.quantity,
            price: item.listing?.price || 0,
            total: item.quantity * (item.listing?.price || 0),
          })),
        },
      },
      include: {
        vendor: true,
        address: true,
        items: {
          include: { groceryListing: true, foodListing: true, beautyProductListing: true },
        },
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.update({
      where: { id: cart.id },
      data: { vendorId: null },
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Cancel order
router.post('/:id/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!['PENDING', 'ACCEPTED'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

export default router;
