/* eslint-disable no-undef */

import { EVENT_TYPE_C2PA_MANIFEST } from '../config.js';

const displayManifest = (manifest, imageId, viewMoreUrl, addIconForImage) => {
  if (manifest) {
    // add the components linked to this image
    const image = document.getElementById(imageId);
    addIconForImage(image, imageId);

    // Configure the manifest summary
    const manifestSummary = document.getElementById(
      `manifest-${imageId}`,
    );
    manifestSummary.manifestStore = manifest;
    manifestSummary.viewMoreUrl = viewMoreUrl;

    const caiIndicator = document.getElementById(
      `indicator-${imageId}`,
    );

    if (!manifest.error) {
      // ok
      caiIndicator.variant = 'info-light';
    } else if (manifest.error) {
      // invalid
      caiIndicator.variant = 'error';
    }

    // Get the image source to configure the Thumbnail,
    // as this cannot be done in the sandbox
    manifestSummary.manifestStore.thumbnail = image.src;
    caiIndicator.classList.add('manifest-loaded');
    image.classList.add('manifest-loaded');
  }
};

/**
 * Send a message to the sandbox to get the C2PA manifest for the image.
 * @param {HTMLImageElement} imageElement - The image element to get the C2PA manifest for.
 */
export const getC2PAManifest = async (imageElement, addIconForImage) => {
  const event = {};
  event.type = EVENT_TYPE_C2PA_MANIFEST;
  event.data = {
    src: imageElement.src,
    dataURI: imageElement.dataURI,
    imageId: imageElement.id,
  };

  const { manifest, viewMoreUrl } = await chrome.runtime.sendMessage(event);
  displayManifest(manifest, imageElement.id, viewMoreUrl, addIconForImage);
};
