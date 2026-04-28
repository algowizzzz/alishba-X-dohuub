import { create } from 'zustand';
import api from '../services/api';

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
  checkout: (addressId: string, specialNotes?: string) => Promise<any>;
  clearError: () => void;
}

type CartResponse = { success: boolean; data?: any; error?: string };

function applyCart(setState: (partial: Partial<CartState>) => void, cart: any) {
  if (!cart) {
    setState({ items: [], vendorId: null, vendor: null, subtotal: 0, isLoading: false });
    return;
  }
  setState({
    items: (cart.items || []).map((item: any) => ({
      id: item.id,
      listingId: item.listingId,
      listing: item.listing || null,
      quantity: item.quantity,
    })),
    vendorId: cart.vendorId ?? null,
    vendor: cart.vendor ?? null,
    subtotal: cart.subtotal ?? 0,
    isLoading: false,
  });
}

function extractMessage(error: any, fallback: string) {
  return error?.response?.data?.error || error?.message || fallback;
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
      const response = await api.get<CartResponse>('/api/v1/cart');
      if (!response.success) throw new Error(response.error || 'Fetch cart failed');
      applyCart(set, response.data);
    } catch (error: any) {
      set({
        items: [],
        vendorId: null,
        vendor: null,
        subtotal: 0,
        isLoading: false,
        error: extractMessage(error, 'Failed to load cart'),
      });
    }
  },

  addItem: async (listingId: string, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<CartResponse>('/api/v1/cart/items', { listingId, quantity });
      if (!response.success) throw new Error(response.error || 'Add item failed');
      applyCart(set, response.data);
    } catch (error: any) {
      const msg = extractMessage(error, 'Failed to add item');
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await get().removeItem(itemId);
      return;
    }
    set({ isLoading: true, error: null });
    try {
      await api.put<CartResponse>(`/api/v1/cart/items/${itemId}`, { quantity });
      await get().fetchCart();
    } catch (error: any) {
      const msg = extractMessage(error, 'Failed to update quantity');
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  removeItem: async (itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete<CartResponse>(`/api/v1/cart/items/${itemId}`);
      await get().fetchCart();
    } catch (error: any) {
      const msg = extractMessage(error, 'Failed to remove item');
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.delete<CartResponse>('/api/v1/cart');
    } catch {
      // still reset local state even if server call fails
    } finally {
      set({ items: [], vendorId: null, vendor: null, subtotal: 0, isLoading: false });
    }
  },

  checkout: async (addressId: string, specialNotes?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<CartResponse>('/api/v1/orders', { addressId, specialNotes });
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to place order');
      }
      set({ items: [], vendorId: null, vendor: null, subtotal: 0, isLoading: false });
      return response.data;
    } catch (error: any) {
      const msg = extractMessage(error, 'Failed to place order');
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
