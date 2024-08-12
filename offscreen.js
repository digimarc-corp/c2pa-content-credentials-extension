/* eslint-disable consistent-return */
/* eslint-disable no-undef */

import { createC2pa, createL2ManifestStore, generateVerifyUrl } from './c2pa/packages/c2pa/dist/c2pa.esm.js';
import { EVENT_TYPE_C2PA_MANIFEST, EVENT_TYPE_C2PA_MANIFEST_RESPONSE } from './config.js';
import { convertDataURLtoBlob, isImageAccessible } from './lib/imageUtils.js';
import debug from './lib/log.js';

let c2pa;
let c2paIsLoading = false;
const manifestMap = {};

async function initializeC2pa() {
  if (!c2paIsLoading) {
    c2pa = await createC2pa({
      wasmSrc: './c2pa/packages/c2pa/dist/assets/wasm/toolkit_bg.wasm',
      workerSrc: './c2pa/packages/c2pa/dist/c2pa.worker.min.js',
    });
    c2paIsLoading = true;
  }
}

const validateC2pa = async (image, imageId) => {
  await initializeC2pa();

  if (!image) {
    debug('[sandbox] Image not available');
    throw new Error('Image not available');
  }

  const { manifestStore } = await c2pa.read(image);
  manifestMap[imageId] = manifestStore;
  if (!manifestStore) throw new Error('No manifest available');

  const { manifestStore: l2ManifestStore } = await createL2ManifestStore(manifestStore);

  return {
    manifest: l2ManifestStore,
    validationStatus: manifestStore.validationStatus,
  };
};

const handleC2PAManifestMessage = async (event) => {
  try {
    let image = event.data.src;
    const imageDataURI = event.data.dataURI;
    const { imageId } = event.data;

    if (manifestMap[imageId]) {
      // todo: validationStatus in this case as well?
      return ({
        type: EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
        manifest: manifestMap[imageId],
        imageId,
      });
    }

    if (!(await isImageAccessible(image)) && imageDataURI) {
      image = await convertDataURLtoBlob(imageDataURI);
    }

    const result = await validateC2pa(image, imageId);

    return ({
      type: EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
      manifest: result.manifest,
      validationStatus: result.validationStatus,
      imageId,
      viewMoreUrl: generateVerifyUrl(typeof image === 'string' ? image : image.src),
    });
  } catch (error) {
    debug('[sandbox] Error processing message:');
    debug(error);
    return ({ error: error.message });
  }
};

// eslint-disable-next-line
chrome.runtime.onMessage.addListener((event, sender, sendResponse) => {
  if (event.type === EVENT_TYPE_C2PA_MANIFEST) {
    handleC2PAManifestMessage(event).then((result) => { sendResponse(result); });
  }
  return true;
});

initializeC2pa();
