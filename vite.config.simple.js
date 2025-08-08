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
    },
  };
});
