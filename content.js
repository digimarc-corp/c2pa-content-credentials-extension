/* eslint-disable no-undef */
// eslint-disable-next-line
import * as c2paWC from './c2pa/packages/c2pa-wc/dist/index.js';
import {
  EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
  MSG_GET_HTML_COMPONENT,
  MSG_INJECT_C2PA_INDICATOR, MSG_PAGE_LOADED,
  MSG_REVERT_C2PA_INDICATOR,
  MSG_VERIFY_SINGLE_IMAGE,
} from './config.js';
import {
  addC2PAIndicatorOnImgComponents,
  addIconForImage,
  handleSingleImage,
  removeC2PAIndicatorOnImgComponents,
} from './lib/imageUtils.js';
import debug from './lib/log.js';

// Variable to hold the right-clicked element
let clickedEl = null;

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
    }
  }
});

// Listen for right clicks and save the clicked element
document.addEventListener("contextmenu", function(event) {
    clickedEl = event.target;
}, true);

// Function to compare dimensions within a certain percentage difference
function isDimensionSimilar(dim1, dim2, percentage) {
  let diff = Math.abs(dim1 - dim2);
  let allowedDiff = (percentage / 100) * ((dim1 + dim2) / 2);
  return diff <= allowedDiff;
}

// Function to find the largest image within the given element
function findLargestImage(element) {
  let images = element.getElementsByTagName('img'); // Get all image elements
  let largestImage = null;
  let maxArea = 0;

  for (let img of images) {
      let rect = img.getBoundingClientRect();
      let area = rect.width * rect.height; // Calculate the area of the image

      // Update the largestImage if this image has a larger area
      if (area > maxArea) {
          largestImage = img;
          maxArea = area;
      }
  }

  return largestImage; // This will be null if no images are found
}

function getMatchingParent(element) {
  let currentElement = element;

  while(currentElement.parentNode) {
    let parentElement = currentElement.parentNode;

    // Get dimensions of the current and parent elements
    let currentRect = currentElement.getBoundingClientRect();
    let parentRect = parentElement.getBoundingClientRect();

    if (isDimensionSimilar(currentRect.width, parentRect.width, 10) && isDimensionSimilar(currentRect.height, parentRect.height, 10)) {
        debug(`Found matching parent: ${parentElement}`);
        currentElement = parentElement;
    } else {
        debug("No matching parent found.");
        break;
    }

    // In case of reaching the top of the DOM without finding a match
    if (currentElement === document.body || currentElement === document.documentElement) {
        debug("Reached the top of the DOM. No matching parent found.");
        break;
    }
  }

  return currentElement;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === MSG_GET_HTML_COMPONENT) {
      let currentElement = getMatchingParent(clickedEl);

      let largestImage = findLargestImage(currentElement);

        if (largestImage) {
            debug(`Found the largest image: ${largestImage.src}`);
            handleSingleImage(largestImage.src);
        } else {
            debug("No images found within the current element.");
        }
    }
});

// Register to events coming from the background script
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === MSG_INJECT_C2PA_INDICATOR) {
    // Request from background to inject the C2PA indicator
    // Get all image elements on the page.
    addC2PAIndicatorOnImgComponents();
  } else if (message.type === MSG_REVERT_C2PA_INDICATOR) {
    // Request from background to revert the C2PA indicator
    removeC2PAIndicatorOnImgComponents();
  } else if (message.type === MSG_VERIFY_SINGLE_IMAGE) {
    handleSingleImage(message.srcUrl);
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
