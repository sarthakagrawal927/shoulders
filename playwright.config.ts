import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/browser',
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    launchOptions: { channel: process.env.CI ? 'chromium' : 'chrome' },
  },
  webServer: {
    command: 'pnpm preview --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
  timeout: 30000,
});
