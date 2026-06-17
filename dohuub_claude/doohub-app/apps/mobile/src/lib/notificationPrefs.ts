import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationSettings {
  pushNotifications: boolean;
  bookingUpdates: boolean;
  promotions: boolean;
  aiAssistant: boolean;
  payments: boolean;
}

const KEY = 'doohub:notification-prefs';

export const DEFAULT_SETTINGS: NotificationSettings = {
  pushNotifications: true,
  bookingUpdates: true,
  promotions: false,
  aiAssistant: true,
  payments: true,
};

export async function loadNotificationPrefs(): Promise<NotificationSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveNotificationPrefs(prefs: NotificationSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // Best-effort persistence — silently ignore storage failures.
  }
}
