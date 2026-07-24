// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env (see .env.example)
dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: 5,

  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000,
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    // Real-time streaming to TestDino. Streams results live during the run and
    // uploads artifacts itself, so no post-run upload step is needed anywhere.
    // ciRunId groups all shards of one CI run into a single logical run; each CI
    // provider sets TESTDINO_CI_RUN_ID to its run/pipeline id (see ci/README.md).
    ['@testdino/playwright', {
      token: process.env.TESTDINO_TOKEN,
      ciRunId: process.env.TESTDINO_CI_RUN_ID,
    }],
  ],

  use: {
    baseURL: 'https://storedemo.testdino.com/products',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      grep: /@chromium/, // only run tests tagged @chromium
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      grep: /@firefox/, // only run tests tagged @firefox
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      grep: /@webkit/, // only run tests tagged @webkit
    },
    {
      name: 'ios',
      use: { ...devices['iPhone 12'] },
      grep: /@ios/, // only run tests tagged @ios
    },
    {
      name: 'api',
      use: { ...devices['Desktop Chrome'] },
      grep: /@api/, // only run tests tagged @api (no browser needed)
    },
  ],
});
