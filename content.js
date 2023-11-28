/* eslint-disable no-undef */
// eslint-disable-next-line
import * as c2paWC from './c2pa-wc/dist/index.js';
import {
  EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
  MSG_INJECT_C2PA_INDICATOR, MSG_PAGE_LOADED,
  MSG_REVERT_C2PA_INDICATOR,
} from './config.js';
import { addC2PAIndicatorOnImgComponents, removeC2PAIndicatorOnImgComponents } from './lib/imageUtils.js';
import debug from './lib/log.js';

// Register to window events
window.addEventListener('message', (event) => {
  if (event.data.type === EVENT_TYPE_C2PA_MANIFEST_RESPONSE) {
    // Configure the manifest summary
    // TODO add validation logic here to change icon, etc?
    const manifestSummary = document.getElementById(
      `manifest-${event.data.imageId}`,
    );
    manifestSummary.manifestStore = event.data.manifest;
    manifestSummary.viewMoreUrl = event.data.viewMoreUrl;

    const caiIndicator = document.getElementById(
      `indicator-${event.data.imageId}`,
    );

    // Validation indicator L1 rules
    if (event.data.manifest) {
      if (!event.data.manifest.error) {
        // ok
        caiIndicator.variant = 'info-light';
      } else if (event.data.manifest.error) {
        // invalid
        caiIndicator.variant = 'error';
      }
      // } else if (event.data.manifest.error === 'otgp') {
      //   // incomplete
      //   caiIndicator.variant = 'warning';
      // }

      // Get the image source to configure the Thumbnail,
      // as this cannot be done in the sandbox
      const image = document.getElementById(event.data.imageId);
      manifestSummary.manifestStore.thumbnail = image.src;
      caiIndicator.style.visibility = 'visible';
    }
  }
});

// Register to events coming from the background script
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === MSG_INJECT_C2PA_INDICATOR) {
    // Request from background to inject the C2PA indicator
    // TODO this only works for img elements, not picture elements

    // Get all image elements on the page.
    addC2PAIndicatorOnImgComponents();
  } else if (message.type === MSG_REVERT_C2PA_INDICATOR) {
    // Request from background to revert the C2PA indicator
    removeC2PAIndicatorOnImgComponents();
  }

  return true; // Indicates async sendResponse behavior
});

export async function main() {
  if (document.readyState === 'complete') {
    debug('[content] Page loaded');
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: MSG_PAGE_LOADED });
    }, 1000);
  } else {
    window.addEventListener('load', () => {
      debug('[content] Page loaded');
      chrome.runtime.sendMessage({ type: MSG_PAGE_LOADED });
    });
  }
}
