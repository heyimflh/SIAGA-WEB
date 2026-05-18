import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest config for the auth-pages feature (and the rest of the app).
// - jsdom: enables DOM APIs for component/integration tests with @testing-library/react
// - setupFiles: registers @testing-library/jest-dom matchers globally
// - globals: lets us call `describe`/`it`/`expect` without explicit imports
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: true,
  },
});
