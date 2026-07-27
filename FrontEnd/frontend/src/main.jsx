import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import './safelist.js'
import App from './App.jsx'
import { initAnalytics } from './utils/analytics'
import { initSentry } from './utils/sentry'

// Initialize Product Validation & Analytics baseline trackers
initAnalytics();
initSentry();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
