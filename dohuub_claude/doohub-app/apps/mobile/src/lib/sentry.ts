import * as Sentry from '@sentry/react-native';

/**
 * Initialize Sentry for the mobile app. Safe to call once at startup. If
 * EXPO_PUBLIC_SENTRY_DSN is not set we no-op so local Expo Go and
 * unconfigured environments stay quiet.
 */
export function initSentry() {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.EXPO_PUBLIC_ENV || (__DEV__ ? 'development' : 'production'),
    release: process.env.EXPO_PUBLIC_RELEASE,
    // Keep performance + replay off by default — turn on per env when needed.
    tracesSampleRate: 0,
    enableAutoSessionTracking: true,
    // Don't ship console.* output to Sentry as breadcrumbs in dev — too noisy.
    enableNativeFramesTracking: false,
  });
}

export { Sentry };
