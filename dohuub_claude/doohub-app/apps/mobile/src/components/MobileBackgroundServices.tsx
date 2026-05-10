// Headless component that owns long-lived side effects:
//   - registers an Expo push token whenever a user is signed in
//   - opens Supabase Realtime channels for that user's bookings + notifications
//   - hooks foreground notification + tap handlers (toast / route)
//
// Must live inside a Stack/Router so the navigate() call works. We mount it
// once from app/_layout.tsx. It returns nothing.
import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { usePushToken } from '../hooks/usePushToken';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

export function MobileBackgroundServices() {
  usePushToken();
  useRealtimeSync();

  // Foreground + tap handlers. Don't run on web — expo-notifications doesn't
  // expose these listeners there.
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      // Lightweight alert — nicer toast UX can replace this later.
      Alert.alert(title || 'Notification', body || '');
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data: any = response.notification.request.content.data || {};
      try {
        if (data.bookingId) {
          router.push(`/bookings/${data.bookingId}` as any);
        } else if (data.orderId) {
          router.push(`/bookings/${data.orderId}` as any);
        } else {
          router.push('/notifications' as any);
        }
      } catch (e) {
        console.warn('[notifications] navigation failed:', e);
      }
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  return null;
}
