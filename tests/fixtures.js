import { test as base, chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

export const test = base.extend({
  context: async ({}, use) => {
    // eslint-disable-next-line no-underscore-dangle
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const extensionPath = path.resolve(__dirname, '../');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent('serviceworker');
    }
    const extensionId = serviceWorker.url().split('/')[2];
    await use(extensionId);
  },
});

export const { expect } = base;
