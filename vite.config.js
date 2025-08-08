import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Enable cache directory for faster subsequent builds
  cacheDir: 'node_modules/.vite',

  plugins: [
    react({
      include: "**/*.{jsx,tsx,js,ts}",
      // Enable React Fast Refresh optimizations
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
    })
  ],
  base: './',
  define: {
    global: 'globalThis',
    'process.env': 'import.meta.env',
    'process.browser': 'true',
    'process.version': JSON.stringify('v18.0.0'),
    'process.platform': JSON.stringify('browser'),
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
    // Optimize for production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    // Enable JSX optimization
    jsxDev: process.env.NODE_ENV !== 'production',
  },
  optimizeDeps: {
    // Pre-bundle commonly used dependencies for faster dev startup
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      'buffer',
      'process',
      'lodash',
      'moment',
      'classnames',
      'redux',
      'react-redux',
      'recharts',
    ],
    // Exclude large dependencies that change frequently
    exclude: [
      '@fullcalendar/core',
    ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      define: {
        global: 'globalThis',
      },
      // Enable tree shaking for better optimization
      treeShaking: true,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Enable absolute imports from src
      src: resolve(__dirname, 'src'),
      components: resolve(__dirname, 'src/components'),
      pages: resolve(__dirname, 'src/pages'),
      actions: resolve(__dirname, 'src/actions'),
      context: resolve(__dirname, 'src/context'),
      reducers: resolve(__dirname, 'src/reducers'),
      // Node.js polyfills for browser
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify',
      url: 'url',
      vm: 'vm-browserify',
      process: 'process/browser',
      buffer: 'buffer',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api'],
      },
      sass: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api'],
      },
    },
    // Enable CSS code splitting
    devSourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
    // Enable HMR optimizations
    hmr: {
      overlay: false, // Disable error overlay for better performance
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    // Optimize build performance
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false, // Disable gzip size reporting for faster builds
    chunkSizeWarningLimit: 2000, // Increase warning limit since we've optimized significantly
    // Optimize asset inlining
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    rollupOptions: {
      // Handle problematic dependencies
      onwarn(warning, warn) {
        // Suppress eval warnings from vm-browserify and other known safe uses
        if (warning.code === 'EVAL' ||
          (warning.message && warning.message.includes('Use of eval')) ||
          (warning.id && warning.id.includes('vm-browserify'))) {
          return;
        }
        warn(warning);
      },
      output: {
        // Advanced manual chunking strategy
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes('node_modules')) {
            // Core React ecosystem - keep small
            if (id.includes('react/') && !id.includes('react-')) {
              return 'react-core';
            }
            if (id.includes('react-dom')) {
              return 'react-dom';
            }
            if (id.includes('react-router')) {
              return 'react-router';
            }
            
            // Material-UI - split into smaller chunks
            if (id.includes('@mui/material') || id.includes('@mui/system')) {
              return 'mui-core';
            }
            if (id.includes('@mui/icons-material')) {
              return 'mui-icons';
            }
            if (id.includes('@mui/styles') || id.includes('@mui/styled-engine')) {
              return 'mui-styles';
            }
            if (id.includes('@mui/x-data-grid')) {
              return 'mui-datagrid';
            }
            if (id.includes('@mui/x-date-pickers')) {
              return 'mui-datepickers';
            }
            if (id.includes('@emotion')) {
              return 'emotion';
            }

            // Chart libraries - split by type
            if (id.includes('recharts')) {
              return 'charts-recharts';
            }
            if (id.includes('apexcharts')) {
              return 'charts-apexcharts';
            }
            if (id.includes('react-apexcharts')) {
              return 'charts-react-apex';
            }

            // Calendar libraries
            if (id.includes('@fullcalendar')) {
              return 'calendar';
            }

            // Large utility libraries
            if (id.includes('lodash')) {
              return 'utils-lodash';
            }
            if (id.includes('moment')) {
              return 'utils-moment';
            }
            if (id.includes('date-fns')) {
              return 'utils-date';
            }

            // Redux and state management
            if (id.includes('redux') || id.includes('connected-react-router') || id.includes('history')) {
              return 'state-management';
            }

            // Browser polyfills - split into smaller chunks
            if (id.includes('buffer') || id.includes('process')) {
              return 'polyfills-core';
            }
            if (id.includes('crypto-browserify') || id.includes('stream-browserify') || id.includes('https-browserify')) {
              return 'polyfills-crypto-stream';
            }
            if (id.includes('os-browserify') || id.includes('url') || id.includes('vm-browserify') || id.includes('stream-http') || id.includes('assert')) {
              return 'polyfills-node';
            }

            // Form and validation libraries
            if (id.includes('formik') || id.includes('yup')) {
              return 'forms';
            }

            // Maps and geolocation
            if (id.includes('react-google-maps') || id.includes('react-simple-maps')) {
              return 'maps';
            }

            // Syntax highlighting
            if (id.includes('react-syntax-highlighter')) {
              return 'syntax-highlighter';
            }

            // Drag and drop
            if (id.includes('sortablejs') || id.includes('react-sortablejs')) {
              return 'sortable';
            }

            // Other utilities
            if (id.includes('classnames') || id.includes('tinycolor2') || id.includes('uuid') || id.includes('query-string')) {
              return 'utils-misc';
            }

            // HTTP and data fetching
            if (id.includes('axios') || id.includes('jsonwebtoken')) {
              return 'http-utils';
            }

            // All other node modules
            return 'vendor';
          }

          // Application code chunking
          if (id.includes('/src/')) {
            // Split pages into separate chunks
            if (id.includes('/src/pages/')) {
              const pageName = id.split('/src/pages/')[1].split('/')[0];
              return `pages-${pageName}`;
            }
            
            // Split components by type
            if (id.includes('/src/components/')) {
              const componentDir = id.split('/src/components/')[1].split('/')[0];
              return `components-${componentDir}`;
            }

            // Context and state
            if (id.includes('/src/context/') || id.includes('/src/reducers/')) {
              return 'app-state';
            }

            // Actions
            if (id.includes('/src/actions/')) {
              return 'app-actions';
            }

            // Themes
            if (id.includes('/src/themes/')) {
              return 'app-themes';
            }
          }
        },
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          return `assets/js/[name]-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
      // Optimize external dependencies
      external: (id) => {
        // Don't bundle very large libraries that can be loaded from CDN
        return false; // Keep everything bundled for now
      },
    },
  },
});
