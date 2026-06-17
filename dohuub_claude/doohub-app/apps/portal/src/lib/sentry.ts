import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry. Safe to call once at app start. If VITE_SENTRY_DSN is
 * not set we no-op so local dev and unconfigured environments stay quiet.
 */
export function initSentry() {
  const dsn = (import.meta as any).env?.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: (import.meta as any).env?.MODE || 'production',
    release: (import.meta as any).env?.VITE_RELEASE as string | undefined,
    // Browser performance + replay are off by default — flip on per env when
    // you actually want to pay for the volume.
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    integrations: [Sentry.browserTracingIntegration()],
  });
}

export { Sentry };
