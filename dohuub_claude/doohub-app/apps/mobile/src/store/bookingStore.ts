import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import api from '../services/api';

interface Booking {
  id: string;
  userId: string;
  vendorId: string;
  vendor: any;
  addressId: string;
  address: any;
  category: string;
  listing: any;
  scheduledDate: string;
  scheduledTime: string;
  duration?: number;
  specialInstructions?: string;
  subtotal: number;
  serviceFee: number;
  total: number;
  status: string;
  createdAt: string;
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;

  fetchBookings: (status?: string) => Promise<void>;
  fetchBooking: (id: string) => Promise<void>;
  createBooking: (data: any) => Promise<Booking>;
  cancelBooking: (id: string, reason?: string) => Promise<void>;
  completeBooking: (id: string) => Promise<{ pointsEarned: number }>;
  clearCurrentBooking: () => void;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,

  fetchBookings: async (status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Not authenticated');

      let query = supabase
        .from('Booking')
        .select('*, Vendor(id, businessName, logo, rating), Address(label, street, city)')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });

      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (error) throw error;

      set({ bookings: (data as any) || [], isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch bookings:', error);
      set({
        bookings: [],
        isLoading: false,
        error: error.message || 'Failed to load bookings'
      });
    }
  },

  fetchBooking: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('Booking')
        .select('*, Vendor(id, businessName, logo, rating, contactPhone), Address(label, street, city, state)')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ currentBooking: data as any, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch booking:', error);
      set({
        currentBooking: null,
        isLoading: false,
        error: error.message || 'Failed to load booking'
      });
    }
  },

  createBooking: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Not authenticated');

      // Resolve address: server requires it. Use provided, or user's default.
      let addressId = data.addressId;
      if (!addressId) {
        const { data: addresses } = await supabase
          .from('Address')
          .select('id')
          .eq('userId', userId)
          .order('isDefault', { ascending: false })
          .limit(1);
        addressId = addresses?.[0]?.id;
      }
      if (!addressId) throw new Error('No address on file. Add one in your profile.');

      // Server calculates fees + creates status history. We only send inputs.
      const response = await api.post<{ success: boolean; data: any; error?: string }>(
        '/bookings',
        {
          vendorId: data.vendorId,
          addressId,
          category: data.category,
          listingId: data.listingId,
          scheduledDate: data.scheduledDate,
          scheduledTime: data.scheduledTime,
          duration: data.duration,
          specialInstructions: data.specialInstructions,
          pickupLocation: data.pickupLocation,
          dropoffLocation: data.dropoffLocation,
          stops: data.stops,
          isRoundTrip: data.isRoundTrip,
        }
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create booking');
      }
      const booking = response.data;

      set((state) => ({
        bookings: [booking, ...state.bookings],
        currentBooking: booking,
        isLoading: false,
      }));
      return booking;
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to create booking';
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  cancelBooking: async (id: string, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<{ success: boolean; data: any; error?: string }>(
        `/bookings/${id}/cancel`,
        { reason }
      );
      if (!response.success) throw new Error(response.error || 'Cancel failed');

      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, status: 'CANCELLED' } : b
        ),
        currentBooking: state.currentBooking?.id === id
          ? { ...state.currentBooking, status: 'CANCELLED' }
          : state.currentBooking,
        isLoading: false,
      }));
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to cancel booking';
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  completeBooking: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<{ success: boolean; data: any; error?: string }>(
        `/bookings/${id}/complete`
      );
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Complete failed');
      }
      const pointsEarned = response.data.pointsEarned || 0;
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, status: 'COMPLETED', pointsEarned } : b
        ),
        currentBooking: state.currentBooking?.id === id
          ? { ...state.currentBooking, status: 'COMPLETED', pointsEarned }
          : state.currentBooking,
        isLoading: false,
      }));
      return { pointsEarned };
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to complete booking';
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  clearCurrentBooking: () => {
    set({ currentBooking: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
