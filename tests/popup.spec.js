import fetch from 'node-fetch';
import { test, expect } from './fixtures';

const WEBHOOK_URL = 'https://digimarc.webhook.office.com/webhookb2/1d9ec1fc-b449-41e3-a60a-7a5746cc8479@9efb6df4-980c-42b4-8a29-64eebd7148b2/IncomingWebhook/ad7147433ef34c1398ef52a3b8f89d3b/81fc3ee4-23ca-4277-ba2c-82e1644ff59c';

// eslint-disable-next-line no-control-regex
const stripAnsiCodes = (text) => text.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '');

const sendFailureToTeams = async (message) => {
  const payload = {
    '@type': 'MessageCard',
    '@context': 'https://schema.org/extensions',
    summary: 'Playwright Test Failure',
    themeColor: 'ff0000',
    text: stripAnsiCodes(message),
  };
  await fetch(WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const togglePopup = async (page, extensionId) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  const toggle = await page.$('#toggle');
  await toggle.click();
};

test('Extension is correctly loaded', async ({ page, extensionId }) => {
  try {
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    const element = await page.$('#toggle-container');
    // wait 10s
    await page.waitForTimeout(4000);
    expect(element).not.toBeNull();
  } catch (error) {
    sendFailureToTeams(`Extension is correctly loaded: ${error.message}`);
    throw error;
  }
});

test('C2PA icons are correctly added to the DOM', async ({ page, extensionId }) => {
  try {
    await togglePopup(page, extensionId);
    await page.goto('https://wm-c2pa-samples.netlify.app/');
    // give some time for the manifest to be processed
    await page.waitForTimeout(10000);

    // get the div called icon-container
    const iconContainer = await page.$('#icon-container');

    // get all its children
    const children = await iconContainer.$$('*');
    // compare the list of children id to the expected list
    const expectedChildrenIds = ['icon-c2pa-/wm-c2pa-samples.netlify.app/static/media/genai-picture-validate-protected', 'icon-c2pa-https://wm-c2pa-samples.netlify.app/static/media/genai-picture', 'icon-c2pa-https://wm-c2pa-samples.netlify.app/static/media/swap'];
    const childrenIds = (await Promise.all(children.map((child) => child.getAttribute('id')))).filter((id) => id?.startsWith('icon-c2pa')).sort();
    // remove the part after the last 2 '.' in the id for each element of the list
    childrenIds.forEach((id, index) => {
      childrenIds[index] = id.substring(0, id.lastIndexOf('.'));
      childrenIds[index] = childrenIds[index].substring(0, childrenIds[index].lastIndexOf('.'));
    });
    expect(childrenIds).toEqual(expectedChildrenIds);
  } catch (e) {
    sendFailureToTeams(`C2PA icons are correctly added to the DOM failed: ${e.message}`);
    throw e;
  }
});

test('Manifests are correctly displayed on contentcredentials.org', async ({ page, extensionId }) => {
  try {
    await togglePopup(page, extensionId);
    await page.goto('https://contentcredentials.org/');
    // give some time for the manifest to be processed
    await page.waitForTimeout(3000);
    // scroll until we fully see this text "Building trust in what you see online"
    await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h3'));
      const element = elements.find((e) => e.textContent.includes('Empowering creators to get credit for their work'));
      if (element) element.scrollIntoView();
    });
    await page.waitForTimeout(10000);

    // get the div called icon-container
    const iconContainer = await page.$('#icon-container');

    // get all its children
    const children = await iconContainer.$$('*');

    let iconElement;

    for (let i = 0; i < children.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const id = await children[i].getAttribute('id');
      if (id.startsWith('icon-c2pa') && id.includes('home2')) {
        iconElement = children[i];
        break;
      }
    }

    if (!iconElement) {
      throw new Error('No C2PA icons found');
    }

    // get the children that is a cai-manifest-summary-dm-plugin
    const caiManifestSummaryDmPlugin = await iconElement.$('#view-more-container-dm-plugin');
    // expect that caiManifestSummaryDmPlugin has a child that is a "a" element whose href startsWith https://verify.
    const a = await caiManifestSummaryDmPlugin.$('a');
    const href = await a.getAttribute('href');
    expect(href).toMatch(/^https:\/\/verify\..*/);

    const contentSummary = await iconElement.$('cai-content-summary-dm-plugin');
    // get all its children
    const contentChildren = await contentSummary.$$('span');
    const contentChildrenText = (await Promise.all(contentChildren
      .map((child) => child.textContent())));
    expect(contentChildrenText[0]).toContain('This content was generated with an AI tool.');

    const sectionAssetsUsed = await iconElement.$('.section-assets-used-dm-plugin');
    const sectionAssetsUsedChildren = await sectionAssetsUsed.$$('cai-thumbnail-dm-plugin');
    // expect that sectionAssetsUsed has 46 thumbnails
    expect(sectionAssetsUsedChildren.length).toBe(46);
  } catch (e) {
    sendFailureToTeams(`Manifests are correctly displayed on contentcredentials.org failed: ${e.message}`);
    throw e;
  }
});
