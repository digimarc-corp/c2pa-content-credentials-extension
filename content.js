/* eslint-disable no-undef */
// eslint-disable-next-line
import * as c2paWC from './c2pa/packages/c2pa-wc/dist/index.js';
import {
  EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
  MSG_DISABLE_RIGHT_CLICK,
  MSG_ENABLE_RIGHT_CLICK,
  MSG_GET_HTML_COMPONENT,
  MSG_INJECT_C2PA_INDICATOR,
  MSG_PAGE_LOADED,
  MSG_REVERT_C2PA_INDICATOR,
  MSG_VERIFY_SINGLE_IMAGE,
} from './config.js';
import {
  addC2PAIndicatorOnImgComponents,
  addIconForImage,
  findLargestImage,
  getMatchingParent,
  handleSingleImage,
  removeC2PAIndicatorOnImgComponents,
} from './lib/imageUtils.js';
import debug from './lib/log.js';
import { displayError } from './lib/errorUtils.js';

// Variable to hold the right-clicked element
let clickedEl = null;
let singleImageVerification = false;

// Register to window events
window.addEventListener('message', (event) => {
  if (event.data.type === EVENT_TYPE_C2PA_MANIFEST_RESPONSE) {
    // Validation indicator L1 rules
    if (event.data.manifest) {
      // add the components linked to this image
      const image = document.getElementById(event.data.imageId);
      addIconForImage(image, event.data.imageId);

      // Configure the manifest summary
      const manifestSummary = document.getElementById(
        `manifest-${event.data.imageId}`,
      );
      manifestSummary.manifestStore = event.data.manifest;
      manifestSummary.viewMoreUrl = event.data.viewMoreUrl;

      const caiIndicator = document.getElementById(
        `indicator-${event.data.imageId}`,
      );

      if (!event.data.manifest.error) {
        // ok
        caiIndicator.variant = 'info-light';
      } else if (event.data.manifest.error) {
        // invalid
        caiIndicator.variant = 'error';
      }

      // Get the image source to configure the Thumbnail,
      // as this cannot be done in the sandbox
      manifestSummary.manifestStore.thumbnail = image.src;
      caiIndicator.classList.add('manifest-loaded');
      image.classList.add('manifest-loaded');
    } else if (singleImageVerification) {
      displayError('No Content Credentials found for this image.');
    }
    singleImageVerification = false;
  }
});

// Listen for right clicks and save the clicked element
document.addEventListener('contextmenu', (event) => {
  clickedEl = event.target;
}, true);

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === MSG_GET_HTML_COMPONENT) {
    singleImageVerification = true;
    const currentElement = getMatchingParent(clickedEl);

    const largestImage = findLargestImage(currentElement);

    if (largestImage) {
      debug(`Found the largest image: ${largestImage.src}`);
      handleSingleImage(largestImage);
    } else {
      debug('No images found within the current element.');
      if (singleImageVerification) {
        displayError('Unable to locate an image to verify.');
      }
    }
    singleImageVerification = false;
  }
});

// Register to events coming from the background script
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === MSG_INJECT_C2PA_INDICATOR) {
    // Request from background to inject the C2PA indicator
    // Get all image elements on the page.
    addC2PAIndicatorOnImgComponents();
    chrome.runtime.sendMessage({ type:  MSG_DISABLE_RIGHT_CLICK});
  } else if (message.type === MSG_REVERT_C2PA_INDICATOR) {
    // Request from background to revert the C2PA indicator
    removeC2PAIndicatorOnImgComponents();
    chrome.runtime.sendMessage({ type:  MSG_ENABLE_RIGHT_CLICK});
  } else if (message.type === MSG_VERIFY_SINGLE_IMAGE) {
    handleSingleImage(clickedEl);
    singleImageVerification = true;
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
