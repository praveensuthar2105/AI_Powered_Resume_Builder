import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry SDK for capturing frontend errors and performance metrics
 */
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (dsn) {
    try {
      Sentry.init({
        dsn: dsn,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: false,  // Set to true to mask all text on page in screen recordings for privacy
            maskAllInputs: false // Set to true to mask input elements
          }),
        ],
        // Performance Monitoring
        tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2, // Capture 20% of transactions in prod
        // Session Replay
        replaysSessionSampleRate: 0.1, // Sample rate for session replays
        replaysOnErrorSampleRate: 1.0, // Always capture replay when error occurs
        
        environment: import.meta.env.MODE || 'production',
        
        beforeSend(event) {
          // Prevent local dev errors from spamming Sentry if needed
          if (import.meta.env.DEV) {
            console.log('[Sentry Captured Error]', event);
            return null; // Set to null to discard, or return event to send
          }
          return event;
        }
      });
      console.log('Sentry SDK initialized.');
    } catch (e) {
      console.error('Failed to initialize Sentry:', e);
    }
  } else {
    console.warn('Sentry DSN is missing. Error tracking will not be active.');
  }
};

/**
 * Capture custom handled errors manually
 * @param {Error} error The JS error object
 * @param {Object} context Additional context properties
 */
export const captureException = (error, context = {}) => {
  try {
    Sentry.captureException(error, { extra: context });
  } catch (e) {
    console.warn('Sentry capture exception failed:', e);
  }
};

/**
 * Log breadcrumbs (actions leading up to an error)
 * @param {string} message Description of action
 * @param {string} category Category classification
 */
export const logBreadcrumb = (message, category = 'action') => {
  try {
    Sentry.addBreadcrumb({
      message,
      category,
      level: 'info'
    });
  } catch (e) {
    // Fail silently
  }
};
