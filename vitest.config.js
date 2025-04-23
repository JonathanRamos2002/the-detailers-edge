import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/pages/**/*.test.jsx'],
    exclude: ['server/**/*'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
  },
}); 