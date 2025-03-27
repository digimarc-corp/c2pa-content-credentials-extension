/* eslint-disable consistent-return */
/* eslint-disable no-undef */

import { createC2pa, createL2ManifestStore, generateVerifyUrl } from './c2pa/packages/c2pa/dist/c2pa.esm.js';
import { EVENT_TYPE_C2PA_MANIFEST, EVENT_TYPE_C2PA_MANIFEST_RESPONSE } from './config.js';
import { convertBlobToDataURL, convertDataURLtoBlob, isImageAccessible } from './lib/imageUtils.js';
import debug from './lib/log.js';
import { fetchManifestFromDecoupledAPI } from './lib/manifestUtils.js';

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
    debug('[offscreen] Image not available');
    return;
  }

  const { manifestStore } = await c2pa.read(image);
  manifestMap[imageId] = manifestStore;
  if (!manifestStore) return;

  const { manifestStore: l2ManifestStore } = await createL2ManifestStore(manifestStore);
  debug('[offscreen] L2ManifestStore:', l2ManifestStore);

  return {
    manifest: l2ManifestStore,
    validationStatus: manifestStore.validationStatus,
  };
};

async function sha256(blob) {
  // Use the Web Crypto API to calculate SHA-256
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string
  return hashHex;
}

function convertManifest(input) {
  const output = {
    manifests: {},
    activeManifest: null,
  };

  Object.entries(input.manifests).forEach(([key, manifest]) => {
    // Ensure assertions and its data are always properly initialized as arrays
    const assertions = Array.isArray(manifest.assertions) ? manifest.assertions : [];

    const newManifest = {
      thumbnail: {
        blob: new Blob([], { type: 'image/jpeg' }), // Empty blob
        contentType: 'image/jpeg',
        getUrl: () => URL.createObjectURL(new Blob([])), // Create an object URL from an empty blob
        hash: () => sha256(new Blob([])), // Calculate the SHA-256 hash of the empty blob
      },
      instanceId: manifest.instance_id,
      format: manifest.format,
      ingredients: [], // No ingredients taken into account
      claimGenerator: manifest.claim_generator,
      claimGeneratorHints: null,
      claimGeneratorInfos: [],
      assertions: {
        data: assertions,
        get(label) { // Use method shorthand syntax
          // Use filter to ensure an array is returned
          return this.data.filter((assertion) => assertion.label === label);
        },
      },
      parent: null,
      redactions: null,
      label: manifest.label,
      title: manifest.title,
      signatureInfo: {
        cert_serial_number: manifest.signature_info.cert_serial_number,
        time: manifest.signature_info.time,
        issuer: manifest.signature_info.issuer,
      },
      vendor: null,
    };

    output.manifests[key] = newManifest;
  });

  // Set the active manifest
  const activeManifestKey = input.active_manifest;
  if (activeManifestKey && output.manifests[activeManifestKey]) {
    output.activeManifest = output.manifests[activeManifestKey];
  }

  return output;
}

const getManifestFromWatermark = async (file) => {
  const manifestResult = await fetchManifestFromDecoupledAPI(file);

  if (!manifestResult.success) {
    return { success: false };
  }

  const manifestStore = convertManifest(manifestResult.manifestData);

  if (!manifestStore) {
    return { success: false };
  }

  // Convert the manifestStore to a web component friendly L2 format
  const { manifestStore: l2ManifestStore } = await createL2ManifestStore(
    manifestStore,
  );

  return {
    success: true,
    manifest: l2ManifestStore,
    hammingDistance: manifestResult.hammingDistance,
  };
};

function dataUrlToFile(dataUrl, filename) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = n - 1; i >= 0; i -= 1) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  const blob = new Blob([u8arr], { type: mime });
  const file = new File([blob], filename, { type: mime });

  return file;
}

const handleC2PAManifestMessage = async (event) => {
  try {
    let image = event.data.src;
    const imageDataURI = event.data.dataURI;
    const { imageId, lookForWm } = event.data;

    const file = dataUrlToFile(imageDataURI, 'filename');

    if (manifestMap[imageId]) {
      // todo: validationStatus in this case as well?
      return ({
        type: EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
        manifest: manifestMap[imageId],
        imageId,
      });
    }

    const isAccessible = await isImageAccessible(image);

    if (!isAccessible && imageDataURI) {
      image = await convertDataURLtoBlob(imageDataURI);
    }

    console.log('getting manifest');
    let localResult; let
      wmResult;

    if (lookForWm) {
      [localResult, wmResult] = await Promise.all([
        validateC2pa(image, imageId),
        getManifestFromWatermark(file),
      ]);
    } else {
      localResult = await validateC2pa(image, imageId);
    }

    const res = {
      type: EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
      manifest: localResult?.manifest,
      validationStatus: localResult?.validationStatus,
      imageId,
      viewMoreUrl: generateVerifyUrl(typeof image === 'string' ? image : image.src),
    };

    if (lookForWm && wmResult?.success) {
      res.retrievedManifest = wmResult.manifest;
      res.hammingDistance = wmResult.hammingDistance;
    }

    if (isAccessible) {
      // Generate the view more url only if the image is accessible as it goes to another website
      res.viewMoreUrl = generateVerifyUrl(typeof image === 'string' ? image : image.src);
    } else if (lookForWm && wmResult?.success) {
      res.viewMoreUrl = wmResult.url;
    }

    return res;
  } catch (error) {
    debug('[offscreen] Error processing message:');
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
