import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to get grocery listing details for cart items
async function getCartWithListings(cartId: string) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: true },
  });

  if (!cart) return null;

  // Fetch grocery listings for each cart item
  const itemsWithListings = await Promise.all(
    cart.items.map(async (item) => {
      const listing = await prisma.groceryListing.findUnique({
        where: { id: item.listingId },
        include: { vendor: true },
      });
      return { ...item, listing };
    })
  );

  return { ...cart, items: itemsWithListings };
}

// Get cart
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
    });

    // Create cart if not exists
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user!.id },
      });
    }

    const cartWithListings = await getCartWithListings(cart.id);

    // Calculate subtotal
    const subtotal = cartWithListings?.items.reduce((sum: number, item: any) => {
      return sum + item.quantity * (item.listing?.price || 0);
    }, 0) || 0;

    // Get vendor info if vendorId is set
    let vendor = null;
    if (cart.vendorId) {
      vendor = await prisma.vendor.findUnique({
        where: { id: cart.vendorId },
      });
    }

    res.json({
      success: true,
      data: {
        ...cartWithListings,
        vendor,
        subtotal,
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

// Add item to cart
router.post('/items', authenticate, async (req: AuthRequest, res) => {
  try {
    const { listingId, quantity = 1 } = req.body;

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user!.id },
      });
    }

    // Get the listing to check vendor
    const listing = await prisma.groceryListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check if cart has items from different vendor
    if (cart.vendorId && cart.vendorId !== listing.vendorId) {
      return res.status(400).json({
        error: 'Cart contains items from a different vendor',
        code: 'DIFFERENT_VENDOR',
        currentVendorId: cart.vendorId,
        newVendorId: listing.vendorId,
      });
    }

    // Update cart vendor if not set
    if (!cart.vendorId) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: { vendorId: listing.vendorId },
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_listingId: {
          cartId: cart.id,
          listingId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          listingId,
          quantity,
        },
      });
    }

    // Return updated cart
    const updatedCart = await getCartWithListings(cart.id);
    res.json({ success: true, data: updatedCart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// Update cart item quantity
router.put('/items/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = await prisma.cartItem.findFirst({
      where: { id, cartId: cart.id },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id } });
    } else {
      await prisma.cartItem.update({
        where: { id },
        data: { quantity },
      });
    }

    // Check if cart is empty and clear vendor
    const remainingItems = await prisma.cartItem.count({
      where: { cartId: cart.id },
    });

    if (remainingItems === 0) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: { vendorId: null },
      });
    }

    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/items/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    await prisma.cartItem.deleteMany({
      where: { id, cartId: cart.id },
    });

    // Check if cart is empty and clear vendor
    const remainingItems = await prisma.cartItem.count({
      where: { cartId: cart.id },
    });

    if (remainingItems === 0) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: { vendorId: null },
      });
    }

    res.json({ success: true, message: 'Item removed' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// Clear cart
router.delete('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      await prisma.cart.update({
        where: { id: cart.id },
        data: { vendorId: null },
      });
    }

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
