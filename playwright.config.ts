import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright тохиргооны файл — Lab01
 * Дадлагын сайт: https://www.saucedemo.com
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  reporter: 'html',

  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',   // trace нэвтрэлт (--trace on ашиглахад override болно)
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
