import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait()
  ],
  root: 'app',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app/src'),
      '@config': path.resolve(__dirname, './config'),
      '@circuits': path.resolve(__dirname, './circuits'),
      '@artifacts': path.resolve(__dirname, './artifacts'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  define: {
    'process.env': process.env,
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: [
      '@midnight-ntwrk/midnight-js-http-client-proof-provider',
      '@midnight-ntwrk/midnight-js-fetch-zk-config-provider',
      '@midnight-ntwrk/midnight-js-types',
      '@midnight-ntwrk/midnight-js-network-id',
      '@midnight-ntwrk/midnight-js-utils',
      '@midnight-ntwrk/ledger',
      '@midnight-ntwrk/compact-runtime',
      '@midnight-ntwrk/zswap'
    ],
    include: ['@protobufjs/float']
  }
});
