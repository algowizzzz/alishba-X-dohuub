import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface CartItem {
  id: string;
  listingId: string;
  listing: any;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  vendorId: string | null;
  vendor: any | null;
  subtotal: number;
  isLoading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addItem: (listingId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  vendorId: null,
  vendor: null,
  subtotal: 0,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        set({ items: [], vendorId: null, vendor: null, subtotal: 0, isLoading: false });
        return;
      }

      const { data: cart, error } = await supabase
        .from('Cart')
        .select('id, vendorId, CartItem(id, listingId, quantity)')
        .eq('userId', userId)
        .maybeSingle();

      if (error) throw error;

      if (!cart || !cart.CartItem?.length) {
        set({ items: [], vendorId: null, vendor: null, subtotal: 0, isLoading: false });
        return;
      }

      set({
        items: (cart.CartItem as any[]).map((item: any) => ({
          id: item.id,
          listingId: item.listingId,
          listing: null,
          quantity: item.quantity,
        })),
        vendorId: cart.vendorId,
        subtotal: 0,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
      set({
        items: [],
        vendorId: null,
        vendor: null,
        subtotal: 0,
        isLoading: false,
        error: error.message || 'Failed to load cart',
      });
    }
  },

  addItem: async (listingId: string, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Not authenticated');

      // Get or create cart
      let { data: cart } = await supabase
        .from('Cart')
        .select('id')
        .eq('userId', userId)
        .maybeSingle();

      if (!cart) {
        const { data: newCart, error: cartError } = await supabase
          .from('Cart')
          .insert({ id: `cart-${Date.now()}`, userId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
          .select()
          .single();
        if (cartError) throw cartError;
        cart = newCart;
      }

      // Check if item exists
      const { data: existing } = await supabase
        .from('CartItem')
        .select('id, quantity')
        .eq('cartId', cart.id)
        .eq('listingId', listingId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('CartItem')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('CartItem')
          .insert({ id: `ci-${Date.now()}`, cartId: cart.id, listingId, quantity });
      }

      set({ isLoading: false });
      await get().fetchCart();
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to add item' });
      throw error;
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      if (quantity <= 0) {
        await get().removeItem(itemId);
        return;
      }

      const { error } = await supabase
        .from('CartItem')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to update quantity' });
      throw error;
    }
  },

  removeItem: async (itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('CartItem')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to remove item' });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (userId) {
        const { data: cart } = await supabase
          .from('Cart')
          .select('id')
          .eq('userId', userId)
          .maybeSingle();

        if (cart) {
          await supabase.from('CartItem').delete().eq('cartId', cart.id);
          await supabase.from('Cart').delete().eq('id', cart.id);
        }
      }

      set({
        items: [],
        vendorId: null,
        vendor: null,
        subtotal: 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        items: [],
        vendorId: null,
        vendor: null,
        subtotal: 0,
        isLoading: false,
        error: error.message || 'Failed to clear cart',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
