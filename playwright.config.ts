import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// .env.test 파일 로드
dotenv.config({ path: '.env.test' });

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: './playwright-output/playwright-report' }]],
  outputDir: './playwright-output/playwright-results',
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'error',
      testDir: './e2e/error',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
      },
    },
    {
      name: 'performance',
      testDir: './e2e/cpc',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
      },
      dependencies: ['setup'],
    },
    {
      name: 'workspace',
      testDir: './e2e/workspace',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'https://hiringcenter.local.jobkorea.co.kr:4200/cpc/performance-review',
    reuseExistingServer: true,
    ignoreHTTPSErrors: true,
  },
  use: {
    trace: 'on-first-retry',
    baseURL: 'https://hiringcenter.local.jobkorea.co.kr:4200/cpc/performance-review',
  },
});
