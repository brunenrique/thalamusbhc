import * as Sentry from '@sentry/nextjs';

const dsn = process.env.SENTRY_DSN ?? '';

Sentry.init({
  dsn,
  tracesSampleRate: 1.0,
});

process.on('unhandledRejection', (reason) => {
  Sentry.captureException(reason instanceof Error ? reason : new Error(String(reason)));
});

process.on('uncaughtException', (err) => {
  Sentry.captureException(err);
});

if (typeof fetch !== 'undefined') {
  const originalFetch = fetch.bind(globalThis);
  globalThis.fetch = (async (...args: Parameters<typeof fetch>) => {
    const response = await originalFetch(...args);
    if (!response.ok) {
      Sentry.captureMessage(`API failure: ${response.status} ${response.url}`, 'error');
    }
    return response;
  }) as typeof fetch;
}
