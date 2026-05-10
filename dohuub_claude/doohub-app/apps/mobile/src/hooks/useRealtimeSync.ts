// Subscribes to Supabase Realtime for the current user's data.
//
// We open up to three channels:
//   - bookings:user — Booking rows where userId = current user (customer view)
//   - bookings:vendor — Booking rows where vendorId = my vendor.id (vendor view)
//   - notifications — Notification rows targeted at this user
//
// On any change we either refresh booking data (cheap, debounced by Zustand)
// or push the notification into the in-app store. Channels are torn down when
// the userId flips (logout / switch account) or the component unmounts.
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { useNotificationsStore } from '../store/notificationsStore';
import api from '../services/api';

// Cache of vendorId per userId so we don't hit /vendors/me every reconnect.
const vendorIdCache = new Map<string, string>();

async function resolveVendorId(userId: string, role?: string): Promise<string | null> {
  if (role !== 'VENDOR') return null;
  if (vendorIdCache.has(userId)) return vendorIdCache.get(userId)!;
  try {
    const res: any = await api.get('/api/v1/vendors/me');
    const vendorId = res?.data?.id || res?.id || null;
    if (vendorId) vendorIdCache.set(userId, vendorId);
    return vendorId;
  } catch (e) {
    console.warn('[realtime] Failed to resolve vendorId:', e);
    return null;
  }
}

export function useRealtimeSync() {
  const userId = useAuthStore((s) => s.user?.id);
  const role = useAuthStore((s) => s.user?.role);
  const channelsRef = useRef<RealtimeChannel[]>([]);

  useEffect(() => {
    // Realtime via WebSocket works on RN web too, but we keep symmetry with
    // usePushToken: skip on web for simplicity.
    if (Platform.OS === 'web') return;
    if (!userId) return;

    let cancelled = false;
    const channels: RealtimeChannel[] = [];

    (async () => {
      // Channel 1: customer bookings
      const customerChannel = supabase
        .channel(`bookings-user-${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'Booking',
            filter: `userId=eq.${userId}`,
          },
          () => {
            useBookingStore.getState().fetchBookings();
          }
        )
        .subscribe();
      channels.push(customerChannel);

      // Channel 2: notifications for this user
      const notifChannel = supabase
        .channel(`notifications-${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'Notification',
            filter: `userId=eq.${userId}`,
          },
          (payload) => {
            const row = payload.new as any;
            if (!row) return;
            useNotificationsStore.getState().addNotification({
              id: row.id,
              userId: row.userId,
              title: row.title,
              body: row.body,
              type: row.type,
              data: row.data,
              isRead: !!row.isRead,
              createdAt: row.createdAt,
            });
          }
        )
        .subscribe();
      channels.push(notifChannel);

      // Channel 3 (vendors only): incoming bookings to my vendor row
      const vendorId = await resolveVendorId(userId, role);
      if (cancelled) return;
      if (vendorId) {
        const vendorChannel = supabase
          .channel(`bookings-vendor-${vendorId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'Booking',
              filter: `vendorId=eq.${vendorId}`,
            },
            () => {
              useBookingStore.getState().fetchBookings();
            }
          )
          .subscribe();
        channels.push(vendorChannel);
      }

      channelsRef.current = channels;
    })();

    return () => {
      cancelled = true;
      for (const ch of channels) {
        try {
          supabase.removeChannel(ch);
        } catch {
          // ignore
        }
      }
      channelsRef.current = [];
    };
  }, [userId, role]);
}
