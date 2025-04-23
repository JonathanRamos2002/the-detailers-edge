import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      exclude: [
        'node_modules/',
        'src/setupTests.js',
        '**/*.d.ts',
        'dist/',
        '.dist/',
      ],
      include: [
        'src/**/*.{js,jsx}',
      ],
    }
  }
})
