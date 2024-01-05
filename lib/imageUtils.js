/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
import {
  HANDLE_IMG_THRESHOLD,
  MAXIMAL_ID_LENGTH,
  MINIMAL_IMAGE_SIZE_IN_PIXELS,
  MIN_DISTANCE_FROM_LEFT_BORDER_IN_PIXELS,
  REFRESH_ICON_INTERVAL,
} from '../config.js';
import debug from './log.js';
import { getC2PAManifest } from './manifestUtils.js';

// Initialize an empty array to store the IDs of handled images
let handledImages = [];
let intersectionObserver;
let visibleImages = [];

/**
 * Generate a random string of 10 characters.
 * This is useful for the ID generation.
 * Only using the src isn't reliable since you might have multiple times the same image on a page.
 * @param {HTMLImageElement} imageElement - The image element to generate the base ID for.
 * @returns {string} The generated base ID.
 */
function generateBaseId(imageElement) {
  const randomString = Math.random().toString(36).substring(2, 12);
  const src = imageElement.src.length < MAXIMAL_ID_LENGTH ? imageElement.src
    : imageElement.src.substring(imageElement.src.length - (MAXIMAL_ID_LENGTH - 1));
  return `c2pa-${src}-${randomString}`;
}

/**
 * Create the C2PA indicator web component.
 * @param {string} baseId - The base ID to use for the C2PA components.
 * @returns {HTMLElement} The created C2PA popover element.
 */
export function createC2PAComponents(baseId) {
  const caiPopover = document.createElement('cai-popover-dm-plugin');
  caiPopover.id = `popover-${baseId}`;
  caiPopover.interactive = true;
  caiPopover.style.position = 'absolute';
  caiPopover.style.top = '10px';
  caiPopover.style.right = '10px';

  const caiIndicator = document.createElement('cai-indicator-dm-plugin');
  caiIndicator.id = `indicator-${baseId}`;
  caiIndicator.slot = 'trigger';

  const caiManifestSummary = document.createElement('cai-manifest-summary-dm-plugin');
  caiManifestSummary.id = `manifest-${baseId}`;
  caiManifestSummary.slot = 'content';

  caiPopover.appendChild(caiIndicator);
  caiPopover.appendChild(caiManifestSummary);

  return caiPopover;
}

/**
 * Removes all 'cai-popover', 'cai-indicator', and 'cai-manifest-summary' elements from the document
 * body that are not associated with any handled images.
 *
 * Each element's id is checked against a list of ids derived from handled images. If the
 * element's id is not found in this list, the element is removed from the document body.
 *
 */
export function removeCaiComponents() {
  const popoverElements = document.body.querySelectorAll('cai-popover');
  const indicatorElements = document.body.querySelectorAll('cai-indicator');
  const manifestSummaryElements = document.body.querySelectorAll('cai-manifest-summary');

  popoverElements.forEach((element) => {
    if (!handledImages.map((id) => `popover-${id}`).includes(element.id)) {
      element.remove();
    }
  });

  indicatorElements.forEach((element) => {
    if (!handledImages.map((id) => `indicator-${id}`).includes(element.id)) {
      element.remove();
    }
  });

  manifestSummaryElements.forEach((element) => {
    if (!handledImages.map((id) => `manifest-${id}`).includes(element.id)) {
      element.remove();
    }
  });
}

function toDataURL(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

/**
 * Converts the source of an image to a data URL and returns a Promise that resolves with the data
 * URL.
 *
 * @param {HTMLImageElement} image - The image element to convert.
 * @returns {Promise<string>} A Promise that resolves with the data URL of the image.
 */
function setImageDataURI(image) {
  const promise = new Promise((resolve) => {
    toDataURL(image.src, (dataUrl) => {
      resolve(dataUrl);
    });
  });

  return promise;
}

/**
 * Creates a new div element to act as a container for icons.
 * The container is positioned fixed and stretched across the entire window.
 * The container is inserted as the first child of the body.
 * @returns {HTMLDivElement} The created icon container.
 */
function createIconContainer() {
  const iconContainer = document.createElement('div');
  iconContainer.id = 'icon-container';

  // Set the position to fixed and stretch the container across the entire window
  iconContainer.style.position = 'fixed';
  iconContainer.style.top = '0';
  iconContainer.style.bottom = '0';
  iconContainer.style.left = '0';
  iconContainer.style.right = '0';
  iconContainer.style.zIndex = '2147483647'; // max z-index value

  // MODIFIED: Set pointer-events to none to allow clicks to pass through the layer
  iconContainer.style.pointerEvents = 'none';

  // Insert the iconContainer as the first child of the body
  document.body.insertBefore(iconContainer, document.body.firstChild);

  return iconContainer;
}

/**
 * Determines the appropriate side for popover placement relative to the given element.
 *
 * This function calculates the position of an element on the screen and decides
 * whether a popover should appear on the right or left side of the element.
 * It ensures that the popover does not appear too close to the left border of the window.
 *
 * @param {HTMLElement} element - The HTML element for which the popover placement is determined.
 * @returns {string} Returns 'right' if the element is too close to the left border of the window,
 *                   otherwise returns 'left' as the default placement side.
 */
function determinePopoverPlacementSide(element) {
  const rect = element.getBoundingClientRect();

  // Check if the top left corner of the element is too close to the left border of the window
  if (rect.right < MIN_DISTANCE_FROM_LEFT_BORDER_IN_PIXELS) {
    return 'right';
  }
  return 'left'; // Default placement
}

/**
 * Adds an icon for the given image.
 *
 * @param {HTMLImageElement} image - The image to add the icon for.
 * @param {string} baseId - The base ID to use for the icon's ID.
 */
export const addIconForImage = (image, baseId) => {
  try {
    const iconContainer = document.getElementById('icon-container');
    // Create the icon and set its position to absolute
    const iconElement = document.createElement('div');
    iconElement.id = `icon-${baseId}`;
    iconElement.style.position = 'absolute';
    const rect = image.getBoundingClientRect();
    iconElement.style.top = `${rect.top}px`;
    iconElement.style.right = `${window.innerWidth - rect.right}px`;

    iconElement.style.pointerEvents = 'auto';

    const caiPopover = createC2PAComponents(baseId);
    caiPopover.placement = determinePopoverPlacementSide(image);
    iconElement.appendChild(caiPopover);

    iconElement.addEventListener('mouseenter', () => {
      caiPopover.placement = determinePopoverPlacementSide(image);
    });

    // Add the icon to the icon container
    iconContainer.appendChild(iconElement);
  } catch (e) { /* empty */ }
};

/**
 * Prepares and handles an image.
 *
 * Checks if an icon container exists and creates one if not. Generates a base ID for the image
 * and adds an icon for it.
 * Assigns the base ID to the image and adds it to the handledImages array. Sets the crossorigin
 * attribute of the image to 'anonymous'.
 * If the image is not yet loaded, sets an onload event handler to set the image's data URI and
 * get its C2PA manifest when it loads.
 * If the image is already loaded, sets the image's data URI and gets its C2PA manifest immediately.
 *
 * @param {HTMLImageElement} image - The image to prepare and handle.
 */
function prepareAndHandleImage(imageElement) {
  let iconContainer = document.getElementById('icon-container');
  if (!iconContainer) {
    iconContainer = createIconContainer();
  }
  const baseId = generateBaseId(imageElement);

  // Add an id to the image
  imageElement.id = baseId;
  handledImages.push(baseId);

  // Convert to dataURI in case the src is not accessible
  // imageElement.setAttribute('crossorigin', 'anonymous');

  if (!imageElement.complete) {
    imageElement.onload = () => { // we make sure image is loaded to get access to it
      setImageDataURI(imageElement).then((imageDataURI) => {
        imageElement.dataURI = imageDataURI;
        getC2PAManifest(imageElement);
      });
    };
    return;
  }

  setImageDataURI(imageElement).then((imageDataURI) => {
    imageElement.dataURI = imageDataURI;
    getC2PAManifest(imageElement);
  });
}

function showElementAndDescendants(element) {
  const caiIndicator = document.getElementById(
    `indicator-${element.id}`,
  );
  if (caiIndicator?.classList.contains('manifest-loaded')) {
    caiIndicator.style.visibility = 'visible';
  }
}

function hideElementAndDescendants(element) {
  const caiIndicator = document.getElementById(
    `indicator-${element.id}`,
  );
  caiIndicator.style.visibility = 'hidden';
}

const adjustIconPosition = (image) => {
  const icon = document.getElementById(`icon-${image.id}`);

  if (icon) {
    const rect = image.getBoundingClientRect();
    icon.style.top = `${rect.top}px`;
    icon.style.right = `${window.innerWidth - rect.right}px`;
  }
};

const makeIconInvisible = (image) => {
  visibleImages = visibleImages.filter((img) => img !== image);
  const icon = document.getElementById(`icon-${image.id}`);
  if (icon) {
    hideElementAndDescendants(image);
  }
};

// Function to place icon correctly on top of each visible image
function updateIcons() {
  visibleImages.forEach((image) => {
    adjustIconPosition(image);
  });
}

setInterval(updateIcons, REFRESH_ICON_INTERVAL);

window.addEventListener('scroll', () => {
  const images = document.getElementsByTagName('img');
  for (let i = 0; i < images.length; i += 1) {
    const image = images[i];
    if (image.complete) {
      adjustIconPosition(image);
    } else {
      image.addEventListener('load', () => adjustIconPosition(image, i));
    }
  }
});

window.addEventListener('resize', () => {
  visibleImages.forEach(adjustIconPosition);
});

/**
 * Filter images based on size.
 * @param {HTMLImageElement[]} imageElements - The array of image elements to filter.
 * @returns {HTMLImageElement[]} The filtered array of image elements.
 */
function filterImages(imageElements) {
  return imageElements.filter((imageElement) => {
    // Check if the area of the image is not less than 15000 pixels
    const area = imageElement.clientWidth * imageElement.clientHeight;
    const isLargeEnough = area >= MINIMAL_IMAGE_SIZE_IN_PIXELS;
    return isLargeEnough;
  });
}

/**
 * Handle a single image.
 * @param {string} imageSrc - The source of the image to handle.
 *
 */
export function handleSingleImage(imageSrc) {
  const imageElement = Array.from(document.querySelectorAll('img')).filter((img) => img.src === imageSrc)[0];

  if (imageElement) {
    prepareAndHandleImage(imageElement);
  }
}

/**
 * Handle images that are loaded later.
 * This function will find all image elements on the page and call `prepareAndHandleImage`
 * for each one.
 * It also sets up a MutationObserver to handle images that are added to the DOM
 * after the initial page load.
 */
function handleImages() {
  const imageElements = Array.from(document.querySelectorAll('img')).filter((img) => !handledImages.includes(img.id));

  // filter images based on size
  const filteredImageElements = filterImages(imageElements);

  intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      chrome.storage.local.get({ activated: false }, (result) => {
        removeCaiComponents();
        // If the image is intersecting the viewport and the plugin status is still ON
        if (entry.isIntersecting && result.activated) {
          // If the image is not in the handled list
          if (!handledImages.includes(entry.target.id)) {
            // If the image is already loaded, call the function directly
            if (entry.target.complete) {
              prepareAndHandleImage(entry.target);
            } else {
              // Otherwise, add the onload event listener
              entry.target.onload = () => {
                prepareAndHandleImage(entry.target);
              };
            }
          }
        }

        if (entry.isIntersecting) {
          // The image is visible, add it to the list if it's not already there
          if (!visibleImages.includes(entry.target)) {
            visibleImages.push(entry.target);
            showElementAndDescendants(entry.target);
          }
        } else if (visibleImages.includes(entry.target)) {
          // The image is not visible, remove it from the list
          makeIconInvisible(entry.target);
        }
      });
    });
  }, {
    rootMargin: '0px',
    threshold: HANDLE_IMG_THRESHOLD, // as soon as 20% of the image is visible, we trigger the flow
  });

  // Observe each image element
  filteredImageElements.forEach((imageElement) => {
    intersectionObserver.observe(imageElement);
  });
}

/**
 * Adds C2PA indicators to image components on the webpage and sets up a MutationObserver
 * to handle newly added images dynamically.
 */
export function addC2PAIndicatorOnImgComponents() {
  handleImages();
  // Create a MutationObserver to watch for changes in the DOM
  const observer = new MutationObserver((mutationsList) => {
    // If the addedNodes property has one or more nodes
    mutationsList.filter((mutation) => mutation.type === 'childList' && mutation.addedNodes.length > 0)
      .forEach(() => handleImages());
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Revert the changes made to the images in the handledImages list.
 */
export function removeC2PAIndicatorOnImgComponents() {
  handledImages.forEach((id) => {
    // Find the original image
    const image = document.getElementById(id);

    if (image) {
      // Remove the special component
      const c2paComponent = document.getElementById(`popover-${id}`);
      if (c2paComponent && c2paComponent.parentNode) {
        c2paComponent.parentNode.remove();
      }
    }
  });

  // Stop observing the image to avoid adding the components again
  intersectionObserver?.disconnect();

  // Clear the handledImages list
  handledImages = [];
  visibleImages = [];
}

/**
 * Converts an image blob to a data URI
 * @param {*} blob
 * @returns
 */
export async function convertBlobToDataURL(blob) {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
  return promise;
}

/**
 * Converts a data URL to a Blob object.
 *
 * @param {string} dataURI - The data URL to convert.
 * @returns {Promise<Blob>} A Promise that resolves with the Blob object.
 */
export async function convertDataURLtoBlob(dataURI) {
  const res = await fetch(dataURI);
  return res.blob();
}

/**
 * Checks if an image url is accessible by using a HEAD request
 * @param {*} image
 * @returns
 */
export async function isImageAccessible(imageURL) {
  let isAccessible = false;
  if (imageURL.startsWith('http')) {
    try {
      const response = await fetch(imageURL, { method: 'HEAD' });
      if (response.status === 200) {
        // The URL is accessible.
        isAccessible = true;
      } else {
        // The URL is not accessible.
        isAccessible = false;
      }
    } catch (exception) {
      isAccessible = false;
    }
  }

  if (imageURL.startsWith('blob')) {
    debug(`[imageUtils] Image ${imageURL} is a blob, marking as not accessible`);
    isAccessible = false;
  }
  return isAccessible;
}

// Function to compare dimensions within a certain percentage difference
function isDimensionSimilar(dim1, dim2, percentage) {
  const diff = Math.abs(dim1 - dim2);
  const allowedDiff = (percentage / 100) * ((dim1 + dim2) / 2);
  return diff <= allowedDiff;
}

// Function to find the largest image within the given element
export function findLargestImage(element) {
  const images = element.getElementsByTagName('img'); // Get all image elements
  let largestImage = null;
  let maxArea = 0;

  for (let i = 0; i < images.length; i += 1) {
    const img = images[i];
    const rect = img.getBoundingClientRect();
    const area = rect.width * rect.height; // Calculate the area of the image

    // Update the largestImage if this image has a larger area
    if (area > maxArea) {
      largestImage = img;
      maxArea = area;
    }
  }

  return largestImage; // This will be null if no images are found
}

export function getMatchingParent(element) {
  let currentElement = element;

  while (currentElement.parentNode) {
    const parentElement = currentElement.parentNode;

    // Get dimensions of the current and parent elements
    const currentRect = currentElement.getBoundingClientRect();
    const parentRect = parentElement.getBoundingClientRect();

    if (isDimensionSimilar(currentRect.width, parentRect.width, 10)
        && isDimensionSimilar(currentRect.height, parentRect.height, 10)) {
      debug(`Found matching parent: ${parentElement}`);
      currentElement = parentElement;
    } else {
      debug('No matching parent found.');
      break;
    }

    // In case of reaching the top of the DOM without finding a match
    if (currentElement === document.body || currentElement === document.documentElement) {
      debug('Reached the top of the DOM. No matching parent found.');
      break;
    }
  }

  return currentElement;
}
