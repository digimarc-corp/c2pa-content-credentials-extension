/* eslint-disable consistent-return */
import { createC2pa, createL2ManifestStore, generateVerifyUrl } from './c2pa/packages/c2pa/dist/c2pa.esm.js';
import { EVENT_TYPE_C2PA_MANIFEST, EVENT_TYPE_C2PA_MANIFEST_RESPONSE, MSG_SANDBOX_LOADED } from './config.js';
import { convertBlobToDataURL, convertDataURLtoBlob, isImageAccessible } from './lib/imageUtils.js';
import debug from './lib/log.js';

let c2pa;
let c2paIsLoading = false;

/**
 * Validates a C2PA image and returns its manifest and validationStatus.
 *
 * @async
 * @param {Object} image - The image to validate.
 * @returns {Promise<Object|null>} An object containing the manifest and
 * validationStatus of the image, or null if an error occurs.
 * @throws Will throw an error if the image cannot be read.
 */
const validateC2pa = async (image) => {
  if (!c2paIsLoading) {
    c2paIsLoading = true;
    c2pa = await createC2pa({
      wasmSrc: './c2pa/packages/c2pa/dist/assets/wasm/toolkit_bg.wasm',
      workerSrc: './c2pa/packages/c2pa/dist/c2pa.worker.min.js',
    });
  }

  try {
    // TODO improve the error handling

    if (!image) {
      debug('[sandbox] Image not available');
      return;
    }

    const { manifestStore } = await c2pa.read(image);

    if (!manifestStore) {
      return;
    }

    // Convert the manifestStore to a web component friendly L2 format
    const { manifestStore: l2ManifestStore } = await createL2ManifestStore(
      manifestStore,
    );

    // Convert the thumbnails to dataURI to be able to send them to the content script
    const promises = manifestStore.activeManifest.ingredients.map(async (ingredient) => {
      const matchingIngredient = l2ManifestStore.ingredients
        .find((item) => item.documentId === ingredient.documentId);
      if (matchingIngredient) {
        matchingIngredient.thumbnail = await convertBlobToDataURL(ingredient.thumbnail.blob);
      }
    });

    await Promise.all(promises);

    return {
      manifest: l2ManifestStore,
      validationStatus: manifestStore.validationStatus,
    };
  } catch (err) {
    debug('[sandbox] Error reading image:');
    debug(err);
    return null;
  }
};

// register to window events to communicate with content script
window.addEventListener('message', async (event) => {
  console.log(event);
  if (event.data.type === EVENT_TYPE_C2PA_MANIFEST) { // request to load c2pa manifest
    let image = event.data.data.src;
    const imageDataURI = event.data.data.dataURI;
    const { imageId } = event.data.data;

    const isAccessible = await isImageAccessible(image);

    if (!isAccessible) {
      // debug('[sandbox] Image not accessible by sandbox, checking for Data URI');
      if (imageDataURI) { // if url not accessible try with dataURI
        // debug('[sandbox] Data URI found');
        image = await convertDataURLtoBlob(imageDataURI);
        // debug('[sandbox] Image converted to blob');
      }
    }

    const result = await validateC2pa(image);

    const eventResponse = {};
    eventResponse.type = EVENT_TYPE_C2PA_MANIFEST_RESPONSE;
    eventResponse.manifest = result?.manifest;
    eventResponse.validationStatus = result?.validationStatus;
    eventResponse.imageId = imageId;

    if (isAccessible) {
      // Generate the view more url only if the image is accessible as it goes to another website
      eventResponse.viewMoreUrl = generateVerifyUrl(typeof image === 'string' ? image : image.src);
    }
    // Send response to window
    event.source.postMessage(eventResponse, event.origin);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  // Notify that sandox is ready
  window.parent.postMessage({ type: MSG_SANDBOX_LOADED }, '*');

  // remove the event listener to get only one event
  window.removeEventListener('DOMContentLoaded', () => { });
}, false);
