import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Generate source maps for production builds.
    // 'hidden' emits .map files but does NOT append the sourceMappingURL comment
    // in the bundle, so end-users never download them — only DevTools / Lighthouse use them.
    sourcemap: 'hidden',
    chunkSizeWarningLimit: 300,

    // Enable CSS code splitting so each lazy route gets its own CSS chunk
    cssCodeSplit: true,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // ── Core React runtime (loaded on every page) ──
            if (id.includes('react-dom') || (id.includes('/react/') && !id.includes('react-pdf'))) {
              return 'vendor-react-core';
            }
            if (id.includes('react-router-dom') || id.includes('react-router')) {
              return 'vendor-react-router';
            }

            // ── MUI (used lightly, split from core) ──
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-mui';
            }

            // ── Animation libraries ──
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }

            // ── Ant Design (heavy, split into own chunk) ──
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'vendor-antd';
            }

            // ── PDF generation & parsing libs (only used on specific pages) ──
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('html2pdf') || id.includes('react-pdf') || id.includes('pdfjs')) {
              return 'vendor-pdf';
            }

            // ── Charts (only used on dashboard/checker pages) ──
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }

            // ── Monaco editor (heavy, only used in resume editor) ──
            if (id.includes('monaco-editor') || id.includes('@monaco-editor')) {
              return 'vendor-monaco';
            }

            // ── Monitoring & analytics (non-critical, can load late) ──
            if (id.includes('@sentry') || id.includes('posthog') || id.includes('@vercel/speed-insights')) {
              return 'vendor-monitoring';
            }

            // ── Lucide icons ──
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }

            // ── Everything else from node_modules ──
            return 'vendor-misc';
          }
        },
      },
    },
  },
})
