import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN ?? '';

Sentry.init({
  dsn,
  tracesSampleRate: 1.0,
});

if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    Sentry.captureException(e.error || e);
  });
  window.addEventListener('unhandledrejection', (e) => {
    Sentry.captureException((e as PromiseRejectionEvent).reason);
  });

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    if (!response.ok) {
      Sentry.captureMessage(`API failure: ${response.status} ${response.url}`, 'error');
    }
    return response;
  };
}
