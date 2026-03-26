import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

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
  clearCurrentBooking: () => void;
  clearError: () => void;
}

function getListingIdField(category: string): string | null {
  const map: Record<string, string> = {
    CLEANING: 'cleaningListingId',
    HANDYMAN: 'handymanListingId',
    BEAUTY: 'beautyListingId',
    RENTALS: 'rentalListingId',
    RIDE_ASSISTANCE: 'rideAssistanceListingId',
    COMPANIONSHIP: 'companionshipListingId',
  };
  return map[category] || null;
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

      // Get user's default address (or first address)
      let addressId = data.addressId;
      if (!addressId) {
        const { data: addresses } = await supabase
          .from('Address')
          .select('id')
          .eq('userId', userId)
          .order('isDefault', { ascending: false })
          .limit(1);
        addressId = addresses?.[0]?.id || null;
      }

      // Map category to the correct listing ID field
      const listingIdField = getListingIdField(data.category);
      const listingIdData = listingIdField && data.listingId
        ? { [listingIdField]: data.listingId }
        : {};

      const bookingData = {
        id: `booking-${Date.now()}`,
        userId,
        vendorId: data.vendorId,
        addressId: addressId || userId, // fallback to userId as placeholder if no address
        category: data.category,
        ...listingIdData,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        duration: data.duration || null,
        specialInstructions: data.specialInstructions || null,
        subtotal: data.subtotal,
        serviceFee: data.serviceFee,
        total: data.total,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { data: booking, error } = await supabase
        .from('Booking')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;

      // Create notification for the booking
      try {
        await supabase.from('Notification').insert({
          id: `notif-${Date.now()}`,
          userId,
          title: 'Booking Confirmed',
          body: `Your ${data.serviceName || data.category} booking for ${data.scheduledDate} at ${data.scheduledTime} has been confirmed.`,
          type: 'booking',
          data: { bookingId: booking.id },
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      } catch (notifError) {
        console.warn('Failed to create notification:', notifError);
      }

      set((state) => ({
        bookings: [booking as any, ...state.bookings],
        currentBooking: booking as any,
        isLoading: false,
      }));
      return booking as any;
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to create booking' });
      throw error;
    }
  },

  cancelBooking: async (id: string, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('Booking')
        .update({
          status: 'CANCELLED',
          cancelledAt: new Date().toISOString(),
          cancellationReason: reason || null,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

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
      set({ isLoading: false, error: error.message || 'Failed to cancel booking' });
      throw error;
    }
  },

  clearCurrentBooking: () => {
    set({ currentBooking: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
