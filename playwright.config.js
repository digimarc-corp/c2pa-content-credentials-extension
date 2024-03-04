// playwright.config.js
import { devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * You can define URLS and other constants here.
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config = {
  testDir: './tests', // Path to the tests directory
  /* Maximum time one test can run for. */
  timeout: 300 * 1000,
  expect: {
    /* Default timeout for expect statements. */
    timeout: 5000,
  },
  /* Configure projects for major browsers. */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Test against mobile versions if needed
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],
  /* Directory to output test results. */
  outputDir: './test-results/',
  /* Retry failed tests on CI. */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
};

export default config;
