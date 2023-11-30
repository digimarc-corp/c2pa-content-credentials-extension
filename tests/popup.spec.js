import { test, expect } from './fixtures.js';

test('popup page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);

  expect(await page.title()).toBe('C2PA Content Credentials Extension');
});
