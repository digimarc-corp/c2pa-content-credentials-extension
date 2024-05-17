/* eslint-disable no-undef */

import { EVENT_TYPE_C2PA_MANIFEST } from '../config.js';
import { displayError } from './errorUtils.js';

const displayManifest = (manifest, c2paId, viewMoreUrl, addIconForImage) => {
  if (manifest) {
    // add the components linked to this image
    // const image = document.getElementById(imageId);
    let element = document.querySelector(`img[c2paId="${c2paId}"]`);
    if (!element) {
      element = document.querySelector(`video[c2paId="${c2paId}"]`);
    }
    addIconForImage(element, c2paId);

    // Configure the manifest summary
    const manifestSummary = document.getElementById(
      `manifest-${c2paId}`,
    );
    manifestSummary.manifestStore = manifest;
    manifestSummary.viewMoreUrl = viewMoreUrl;

    const caiIndicator = document.getElementById(
      `indicator-${c2paId}`,
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
    manifestSummary.manifestStore.thumbnail = element.src;
    caiIndicator.classList.add('manifest-loaded');
    element.classList.add('manifest-loaded');
  }
};

/**
 * Send a message to the sandbox to get the C2PA manifest for the image.
 * @param {HTMLImageElement} imageElement - The image element to get the C2PA manifest for.
 */
export const getC2PAManifest = async (imageElement, addIconForImage, singleImageVerification) => {
  const event = {};
  event.type = EVENT_TYPE_C2PA_MANIFEST;
  const imgId = imageElement.getAttribute('c2paId');
  event.data = {
    src: imageElement.src,
    dataURI: imageElement.dataURI,
    imageId: imgId,
  };

  try {
    const { manifest, viewMoreUrl } = await chrome.runtime.sendMessage(event);
    if (manifest === undefined) {
      if (singleImageVerification) {
        displayError('No Content Credentials found for this media.');
      }
    }
    displayManifest(manifest, imgId, viewMoreUrl, addIconForImage);
  } catch (error) {
    if (singleImageVerification) {
      displayError('No Content Credentials found for this media.');
    }
  }
};
