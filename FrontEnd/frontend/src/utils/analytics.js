import posthog from 'posthog-js';

/**
 * Initialize all analytics platforms (GA4, PostHog, Microsoft Clarity)
 */
export const initAnalytics = () => {
  // 1. Initialize PostHog (Session Recording, Heatmaps, Feature Flags)
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

  if (posthogKey) {
    try {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: 'identified_only',
        loaded: (ph) => {
          if (import.meta.env.DEV) {
            ph.debug(false); // Set to true to see PostHog logs in console locally
          }
        },
        capture_pageview: true,
        session_recording: {
          maskAllInputFields: false, // Set to true if you want to mask inputs for security
        }
      });
      console.log('PostHog initialized successfully.');
    } catch (e) {
      console.error('Failed to initialize PostHog:', e);
    }
  } else {
    console.warn('PostHog key is missing. Skipping initialization.');
  }

  // 2. Initialize Microsoft Clarity
  const clarityId = import.meta.env.VITE_CLARITY_ID;
  if (clarityId) {
    try {
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", clarityId);
      console.log('Microsoft Clarity script injected.');
    } catch (e) {
      console.error('Failed to initialize Clarity:', e);
    }
  } else {
    console.warn('Microsoft Clarity ID is missing. Skipping initialization.');
  }

  // 3. Initialize GA4 (via Global Tag insertion)
  const gaId = import.meta.env.VITE_GA4_ID;
  if (gaId) {
    try {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', gaId, {
        send_page_view: true
      });
      console.log('Google Analytics 4 initialized successfully.');
    } catch (e) {
      console.error('Failed to initialize GA4:', e);
    }
  } else {
    console.warn('GA4 Measurement ID is missing. Skipping initialization.');
  }
};

/**
 * Track custom events to PostHog and GA4
 * @param {string} eventName Name of the event (e.g., 'resume_downloaded', 'pricing_clicked')
 * @param {Object} properties Custom parameters / metadata associated with the event
 */
export const trackEvent = (eventName, properties = {}) => {
  try {
    // PostHog event tracking
    if (posthog.__loaded) {
      posthog.capture(eventName, properties);
    }

    // GA4 custom event tracking
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }

    if (import.meta.env.DEV) {
      console.log(`[Analytics Track] ${eventName}:`, properties);
    }
  } catch (e) {
    console.warn('Analytics event tracking error:', e);
  }
};

/**
 * Identify authenticated user across trackers
 * @param {string} userId Unique user identifier (e.g., user email or DB ID)
 * @param {Object} userProperties Profile metadata (e.g., plan, createdDate)
 */
export const identifyUser = (userId, userProperties = {}) => {
  try {
    if (posthog.__loaded) {
      posthog.identify(userId, userProperties);
    }
    
    if (window.gtag) {
      window.gtag('set', 'user_properties', {
        user_id: userId,
        ...userProperties
      });
    }
  } catch (e) {
    console.warn('Analytics user identification error:', e);
  }
};

/**
 * Reset user identity on logout
 */
export const resetUserIdentity = () => {
  try {
    if (posthog.__loaded) {
      posthog.reset();
    }
  } catch (e) {
    console.warn('Analytics identity reset error:', e);
  }
};
