import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,tsx,js,ts}",
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
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      define: {
        global: 'globalThis',
      },
    },
    include: [
      'buffer',
      'process',
    ],
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
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@mui/styles'],
          charts: ['recharts', 'react-apexcharts', 'apexcharts'],
        },
      },
    },
  },
});
