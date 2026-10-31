import { defineConfig, devices } from '@playwright/test';

const PORT = 4300;
const isCI = !!process.env['CI'];

/**
 * E2E tests run against the prerendered build in dist/ (run `pnpm build` first), served
 * statically with the redirects and rewrites from vercel.json (scripts/serve-dist.mjs).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    // Dark is the default theme: every test runs in it.
    { name: 'chromium', use: { ...devices['Desktop Chrome'], colorScheme: 'dark' } },
    // Light theme (system setting): every accessibility scan runs again, contrast included.
    {
      name: 'chromium-light',
      use: { ...devices['Desktop Chrome'], colorScheme: 'light' },
      grep: /accessibility violations/,
    },
  ],
  webServer: {
    command: `node scripts/serve-dist.mjs ${PORT}`,
    url: `http://localhost:${PORT}/en/`,
    reuseExistingServer: !isCI,
  },
});
