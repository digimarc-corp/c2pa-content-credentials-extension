/* eslint-disable no-undef */
// eslint-disable-next-line
import * as c2paWC from './c2pa/packages/c2pa-wc/dist/index.js';
import {
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
  findLargestImage,
  getMatchingParent,
  handleSingleImage,
  removeC2PAIndicatorOnImgComponents,
} from './lib/imageUtils.js';
import debug from './lib/log.js';
import { displayError } from './lib/errorUtils.js';

// Variable to hold the right-clicked element
let clickedEl = null;
let singleImageVerification = true;

// Listen for right clicks and save the clicked element
document.addEventListener('contextmenu', (event) => {
  clickedEl = event.target;
}, true);

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === MSG_GET_HTML_COMPONENT) {
    const currentElement = getMatchingParent(clickedEl);

    const largestImage = findLargestImage(currentElement);

    if (largestImage) {
      debug(`Found the largest image: ${largestImage.src}`);
      handleSingleImage(largestImage, singleImageVerification);
    } else {
      debug('No images found within the current element.');
      if (singleImageVerification) {
        displayError('Unable to locate an image to verify.');
      }
    }
  }
  return true;
});

// Register to events coming from the background script
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === MSG_INJECT_C2PA_INDICATOR) {
    // Request from background to inject the C2PA indicator
    // Get all image elements on the page.
    addC2PAIndicatorOnImgComponents();
    chrome.runtime.sendMessage({ type: MSG_DISABLE_RIGHT_CLICK });
    singleImageVerification = false;
  } else if (message.type === MSG_REVERT_C2PA_INDICATOR) {
    // Request from background to revert the C2PA indicator
    removeC2PAIndicatorOnImgComponents();
    chrome.runtime.sendMessage({ type: MSG_ENABLE_RIGHT_CLICK });
    singleImageVerification = true;
  } else if (message.type === MSG_VERIFY_SINGLE_IMAGE) {
    handleSingleImage(clickedEl, singleImageVerification);
  }
  return true;
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
