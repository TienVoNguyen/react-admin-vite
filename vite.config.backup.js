import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';

  return {
    // Enable cache directory for faster subsequent builds
    cacheDir: 'node_modules/.vite',

    plugins: [
      react({
        include: "**/*.{jsx,tsx,js,ts}",
        // Enable React Fast Refresh optimizations
        fastRefresh: true,
        // Optimize JSX runtime
        jsxRuntime: 'automatic',
      }),
      // Bundle analyzer - only in analyze mode
      process.env.ANALYZE && visualizer({
        filename: 'build/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      })
    ].filter(Boolean),
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
      drop: isProduction ? ['console', 'debugger'] : [],
      // Enable JSX optimization
      jsxDev: isDevelopment,
      // Target modern browsers for better optimization
      target: 'esnext',
      // Enable tree shaking
      treeShaking: true,
      // Minify whitespace and identifiers more aggressively  
      minifyWhitespace: true,
      minifyIdentifiers: true,
      minifySyntax: true,
    },
    optimizeDeps: {
      // Pre-bundle commonly used dependencies for faster dev startup
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@mui/material',
        '@mui/icons-material',
        '@mui/material/styles',
        '@mui/material/colors',
        'buffer',
        'process',
        'lodash',
        'moment',
        'classnames',
        'redux',
        'react-redux',
        'recharts',
        'axios',
        'react-router-dom',
      ],
      // Exclude large dependencies that change frequently
      exclude: [
        '@fullcalendar/core',
        'apexcharts',
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
        // Target modern browsers
        target: 'esnext',
      },
      // Force optimization of specific deps that cause issues
      force: true,
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
        util: 'util',
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
      // Enable CSS code splitting and optimization
      devSourcemap: isDevelopment,
    },
    server: {
      port: 3000,
      open: true,
      // Enable HMR optimizations
      hmr: {
        overlay: false, // Disable error overlay for better performance
      },
      // Enable gzip compression for dev server
      middlewareMode: false,
      // Optimize file watching
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/build/**', '**/docs/**']
      }
    },
    build: {
      outDir: 'build',
      sourcemap: isDevelopment,
      // Optimize build performance
      target: ['esnext', 'chrome90', 'firefox88', 'safari14'],
      minify: 'esbuild', // Faster than terser
      cssMinify: 'esbuild',
      reportCompressedSize: false, // Disable gzip size reporting for faster builds
      chunkSizeWarningLimit: 800, // Lower warning limit to catch issues earlier
      // Optimize asset inlining
      assetsInlineLimit: 8192, // Inline assets smaller than 8kb
      // Enable workers
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
          // Advanced manual chunking strategy for optimal loading
          manualChunks: (id) => {
            // Node modules chunking - more granular splitting
            if (id.includes('node_modules')) {
              // React ecosystem - keep small and separate
              if (id.includes('react/') && !id.includes('react-dom') && !id.includes('react-router')) {
                return 'react';
              }
              if (id.includes('react-dom/')) {
                return 'react-dom';
              }
              if (id.includes('react-router')) {
                return 'react-router';
              }

              // Material-UI - more granular splitting
              if (id.includes('@mui/material/') && !id.includes('@mui/icons-material')) {
                // Split Material-UI by component groups
                if (id.includes('Button') || id.includes('IconButton') || id.includes('Fab')) {
                  return 'mui-buttons';
                }
                if (id.includes('TextField') || id.includes('Input') || id.includes('FormControl') || id.includes('Select')) {
                  return 'mui-inputs';
                }
                if (id.includes('Table') || id.includes('Grid') || id.includes('DataGrid')) {
                  return 'mui-data';
                }
                if (id.includes('Dialog') || id.includes('Modal') || id.includes('Popover') || id.includes('Menu')) {
                  return 'mui-overlays';
                }
                if (id.includes('AppBar') || id.includes('Toolbar') || id.includes('Drawer') || id.includes('Navigation')) {
                  return 'mui-navigation';
                }
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

              // Charts - separate by library and size
              if (id.includes('recharts')) {
                return 'charts-recharts';
              }
              if (id.includes('apexcharts') && !id.includes('react-apexcharts')) {
                return 'charts-apexcharts';
              }
              if (id.includes('react-apexcharts')) {
                return 'charts-react-apex';
              }

              // Calendar - split by modules
              if (id.includes('@fullcalendar/core')) {
                return 'calendar-core';
              }
              if (id.includes('@fullcalendar/')) {
                return 'calendar-plugins';
              }

              // Large utility libraries - split more granularly
              if (id.includes('lodash/')) {
                return 'lodash';
              }
              if (id.includes('moment/')) {
                return 'moment';
              }
              if (id.includes('date-fns')) {
                return 'date-utils';
              }

              // State management
              if (id.includes('redux') && !id.includes('react-redux')) {
                return 'redux-core';
              }
              if (id.includes('react-redux')) {
                return 'redux-react';
              }
              if (id.includes('connected-react-router') || id.includes('history')) {
                return 'redux-router';
              }

              // Maps - split by library
              if (id.includes('react-google-maps')) {
                return 'maps-google';
              }
              if (id.includes('react-simple-maps')) {
                return 'maps-simple';
              }

              // Node polyfills - split by category
              if (id.includes('crypto-browserify') || id.includes('stream-browserify')) {
                return 'polyfills-crypto-stream';
              }
              if (id.includes('buffer') || id.includes('process')) {
                return 'polyfills-core';
              }
              if (id.includes('os-browserify') || id.includes('url') || id.includes('vm-browserify')) {
                return 'polyfills-node';
              }
              if (id.includes('stream-http') || id.includes('https-browserify') || id.includes('assert')) {
                return 'polyfills-http';
              }
              if (id.includes('util')) {
                return 'polyfills-util';
              }

              // Form libraries
              if (id.includes('formik')) {
                return 'forms-formik';
              }
              if (id.includes('yup')) {
                return 'forms-validation';
              }

              // HTTP and data fetching
              if (id.includes('axios')) {
                return 'http-axios';
              }
              if (id.includes('jsonwebtoken') || id.includes('jwt-decode')) {
                return 'auth-jwt';
              }

              // Drag and drop
              if (id.includes('sortablejs') || id.includes('react-sortablejs')) {
                return 'sortable';
              }

              // Syntax highlighting
              if (id.includes('react-syntax-highlighter')) {
                return 'syntax-highlighter';
              }

              // Small utilities - group together
              if (id.includes('classnames') || id.includes('tinycolor2') || id.includes('uuid') || id.includes('query-string')) {
                return 'utils-small';
              }

              // Swipeable components
              if (id.includes('react-swipeable')) {
                return 'swipeable';
              }

              // Font and icon libraries
              if (id.includes('font-awesome') || id.includes('line-awesome') || id.includes('@mdi/')) {
                return 'icon-fonts';
              }

              // Data table libraries
              if (id.includes('mui-datatables')) {
                return 'data-tables';
              }

              // Remaining vendor code - split into smaller chunks
              const packageName = id.split('/node_modules/')[1]?.split('/')[0];
              if (packageName) {
                // Group small packages together
                const smallPackages = ['prop-types', 'core-js', 'readable-stream', 'jsdom', 'typescript'];
                if (smallPackages.includes(packageName)) {
                  return 'vendor-small';
                }

                // Babel and build tools
                if (packageName.includes('babel') || packageName.includes('eslint')) {
                  return 'vendor-build-tools';
                }

                // Large packages get their own chunks
                return `vendor-${packageName.replace('@', '').replace('/', '-')}`;
              }

              // Fallback for any remaining vendor code
              return 'vendor-misc';
            }

            // Application code chunking
            if (id.includes('/src/')) {
              // Large page components - split more granularly
              if (id.includes('/src/pages/dashboard')) return 'page-dashboard';
              if (id.includes('/src/pages/ecommerce')) return 'page-ecommerce';
              if (id.includes('/src/pages/profile')) return 'page-profile';
              if (id.includes('/src/pages/charts')) return 'page-charts';
              if (id.includes('/src/pages/maps')) return 'page-maps';
              if (id.includes('/src/pages/icons')) return 'page-icons';
              if (id.includes('/src/pages/forms')) return 'page-forms';
              if (id.includes('/src/pages/tables')) return 'page-tables';
              if (id.includes('/src/pages/calendar')) return 'page-calendar';
              if (id.includes('/src/pages/CRUD')) return 'page-crud';
              if (id.includes('/src/pages/user')) return 'page-user';

              // Component groups
              if (id.includes('/src/components/Layout') || id.includes('/src/components/Header') ||
                id.includes('/src/components/Sidebar')) return 'app-layout';
              if (id.includes('/src/components/Widget') || id.includes('/src/components/Wrappers')) return 'app-widgets';
              if (id.includes('/src/components/FormItems') || id.includes('/src/components/Dialog')) return 'app-forms';
              if (id.includes('/src/components/Table') || id.includes('/src/components/Search')) return 'app-data';

              // Context and state
              if (id.includes('/src/context') || id.includes('/src/reducers')) return 'app-state';
              if (id.includes('/src/actions')) return 'app-actions';
              if (id.includes('/src/themes')) return 'app-themes';
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
