import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import './safelist.js'
import App from './App.jsx'

// Render the app first, then initialize non-critical trackers during idle time
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)

// Defer analytics & error tracking so they don't block first paint or TBT
const initTrackers = () => {
  import('./utils/analytics').then(({ initAnalytics }) => initAnalytics()).catch(() => {});
  import('./utils/sentry').then(({ initSentry }) => initSentry()).catch(() => {});
};

if (typeof requestIdleCallback !== 'undefined') {
  requestIdleCallback(initTrackers);
} else {
  setTimeout(initTrackers, 2000);
}

