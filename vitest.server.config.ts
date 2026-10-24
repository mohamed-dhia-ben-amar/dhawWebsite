import { defineConfig } from 'vitest/config';

// Tests for the Vercel function code in server/ (plain Node, outside the Angular build).
export default defineConfig({
  test: {
    include: ['server/**/*.spec.ts'],
    environment: 'node',
  },
});
