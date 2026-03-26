import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Note: In production, you would use Stripe SDK
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Create payment intent for booking
router.post('/create-intent', authenticate, async (req: AuthRequest, res) => {
  try {
    const { bookingId, orderId } = req.body;

    let amount: number;
    let metadata: any;

    if (bookingId) {
      const booking = await prisma.booking.findFirst({
        where: { id: bookingId, userId: req.user!.id },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      amount = Math.round(booking.total * 100); // Convert to cents
      metadata = { bookingId, userId: req.user!.id };
    } else if (orderId) {
      const order = await prisma.order.findFirst({
        where: { id: orderId, userId: req.user!.id },
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      amount = Math.round(order.total * 100);
      metadata = { orderId, userId: req.user!.id };
    } else {
      return res.status(400).json({ error: 'bookingId or orderId required' });
    }

    // In production, create Stripe PaymentIntent:
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount,
    //   currency: 'usd',
    //   metadata,
    // });

    // For development, mock the response
    const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      success: true,
      data: {
        clientSecret: mockClientSecret,
        amount: amount / 100,
        currency: 'USD',
      },
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment (webhook simulation for development)
router.post('/confirm', authenticate, async (req: AuthRequest, res) => {
  try {
    const { bookingId, orderId, paymentIntentId } = req.body;

    if (bookingId) {
      // Update booking status
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'ACCEPTED',
          statusHistory: {
            create: { status: 'ACCEPTED', note: 'Payment confirmed' },
          },
        },
      });

      // Create transaction record
      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (booking) {
        const platformFee = booking.serviceFee;
        const vendorPayout = booking.total - platformFee;

        await prisma.transaction.create({
          data: {
            bookingId,
            stripePaymentIntentId: paymentIntentId,
            amount: booking.total,
            platformFee,
            vendorPayout,
            status: 'COMPLETED',
            paidAt: new Date(),
          },
        });
      }
    }

    if (orderId) {
      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'ACCEPTED' },
      });

      // Create transaction record
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (order) {
        const platformFee = order.serviceFee;
        const vendorPayout = order.total - platformFee - order.deliveryFee;

        await prisma.transaction.create({
          data: {
            orderId,
            stripePaymentIntentId: paymentIntentId,
            amount: order.total,
            platformFee,
            vendorPayout,
            status: 'COMPLETED',
            paidAt: new Date(),
          },
        });
      }
    }

    res.json({ success: true, message: 'Payment confirmed' });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Get saved payment methods
router.get('/methods', authenticate, async (req: AuthRequest, res) => {
  try {
    const methods = await prisma.paymentMethod.findMany({
      where: { userId: req.user!.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({ success: true, data: methods });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Failed to get payment methods' });
  }
});

// Add payment method (mock for development)
router.post('/methods', authenticate, async (req: AuthRequest, res) => {
  try {
    const { last4, brand, expiryMonth, expiryYear, isDefault } = req.body;

    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    const method = await prisma.paymentMethod.create({
      data: {
        userId: req.user!.id,
        stripePaymentMethodId: `pm_mock_${Date.now()}`,
        type: 'card',
        last4,
        brand,
        expiryMonth,
        expiryYear,
        isDefault: isDefault || false,
      },
    });

    res.status(201).json({ success: true, data: method });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({ error: 'Failed to add payment method' });
  }
});

// Delete payment method
router.delete('/methods/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await prisma.paymentMethod.deleteMany({
      where: { id, userId: req.user!.id },
    });

    res.json({ success: true, message: 'Payment method deleted' });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({ error: 'Failed to delete payment method' });
  }
});

export default router;

