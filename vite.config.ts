/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const srcDir = (dir: string) => fileURLToPath(new URL(`./src/${dir}`, import.meta.url));

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/call-of-cthulhu-character-creation/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@client': srcDir('client'),
      '@core': srcDir('core'),
      '@game-rules': srcDir('game-rules'),
    },
  },
  server: {
    port: 4200,
    open: !process.env.CI,
  },
  preview: {
    port: 4300,
    open: !process.env.CI,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/**'],
      exclude: ['src/main.tsx', 'src/**/*.test.*', 'src/test-setup.ts'],
    },
  },
}));
