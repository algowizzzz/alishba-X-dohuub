// Registers an Expo push token with our API for the currently signed-in user.
//
// Behaviour:
//   - On web we no-op (Expo notifications don't deliver to RN web targets here).
//   - We ask for permission if it's still UNDETERMINED. If denied we just bail.
//   - We resolve a `projectId` from app.json's extra.eas.projectId (or env fallback).
//     Without one, getExpoPushTokenAsync inside Expo Go will throw — we log + bail.
//   - When userId changes (logout -> login), we re-register so the token is
//     attached to the new user.
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

// Display incoming notifications while the app is foregrounded.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function resolveProjectId(): string | undefined {
  const fromConstants =
    (Constants.expoConfig as any)?.extra?.eas?.projectId ||
    (Constants.easConfig as any)?.projectId;
  const fromEnv = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
  return fromConstants || fromEnv;
}

export function usePushToken() {
  const userId = useAuthStore((s) => s.user?.id);
  const lastRegisteredFor = useRef<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!userId) return;
    if (lastRegisteredFor.current === userId) return;

    let cancelled = false;

    (async () => {
      try {
        const settings = await Notifications.getPermissionsAsync();
        let status = settings.status;
        if (status !== 'granted') {
          const req = await Notifications.requestPermissionsAsync();
          status = req.status;
        }
        if (status !== 'granted') {
          console.log('[push-token] Permission not granted, skipping registration.');
          return;
        }

        const projectId = resolveProjectId();
        if (!projectId) {
          console.warn(
            '[push-token] No EAS projectId configured. ' +
              'Set extra.eas.projectId in app.json (run `eas init`) or ' +
              'EXPO_PUBLIC_EAS_PROJECT_ID for real push delivery.'
          );
          return;
        }

        const tokenResult = await Notifications.getExpoPushTokenAsync({ projectId });
        const token = tokenResult.data;
        if (!token || cancelled) return;

        await api.post('/api/v1/notifications/register-token', {
          token,
          platform: Platform.OS,
        });
        lastRegisteredFor.current = userId;
        console.log('[push-token] Registered token for user', userId);
      } catch (e) {
        console.warn('[push-token] Failed to register push token:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);
}
