const SENTRY_DSN = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SENTRY_DSN;

export function initSentry() {
  if (SENTRY_DSN) {
    console.log('[Sentry] DSN configured, would initialize here');
  } else {
    console.debug('[Sentry] No DSN configured — skipping initialization');
  }
}
