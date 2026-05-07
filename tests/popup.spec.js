import { test, expect } from './fixtures';

const popupUrl = (extensionId) => `chrome-extension://${extensionId}/popup/popup.html`;
const samplePageUrl = 'https://wm-c2pa-samples.netlify.app/';

const setAutomaticValidation = async (page, extensionId, enabled = true) => {
  await page.goto(popupUrl(extensionId));
  const toggle = page.locator('#toggle');
  await expect(toggle).toBeVisible();

  const isChecked = await toggle.isChecked();
  if (isChecked !== enabled) {
    await toggle.click();
  }
};

test('Extension is correctly loaded', async ({ page, extensionId }) => {
  await page.goto(popupUrl(extensionId));
  await expect(page.locator('.toggle-container').first()).toBeVisible();
  await expect(page.locator('#toggle')).toBeVisible();
});

test('C2PA icons are correctly added to the DOM', async ({ page, extensionId }) => {
  await setAutomaticValidation(page, extensionId, true);
  await page.goto(samplePageUrl);

  const icons = page.locator('#icon-container [id^="icon-c2pa"]');
  await expect.poll(async () => icons.count(), { timeout: 30000 }).toBeGreaterThan(0);
});

test('Manifest summary includes provenance link', async ({ page, extensionId }) => {
  await setAutomaticValidation(page, extensionId, true);
  await page.goto(samplePageUrl);

  await expect.poll(async () => page.evaluate(() => {
    const icons = Array.from(document.querySelectorAll('#icon-container [id^="icon-c2pa"]'));

    for (const icon of icons) {
      const style = window.getComputedStyle(icon);
      if (style.display === 'none' || style.visibility === 'hidden') {
        // Skip icons hidden by viewport/overflow logic.
        // eslint-disable-next-line no-continue
        continue;
      }

      const manifestSummary = icon.querySelector('c2pa-manifest-summary');
      const href = manifestSummary?.shadowRoot?.querySelector('.provenance-link')?.getAttribute('href');
      if (href) {
        return href;
      }
    }

    return null;
  }), { timeout: 30000 }).toMatch(/^https:\/\/verify\..*/);
});
