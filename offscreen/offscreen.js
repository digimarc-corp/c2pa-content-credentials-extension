/* eslint-disable consistent-return */
/* eslint-disable no-undef */

import { createC2pa, createL2ManifestStore, generateVerifyUrl } from '../c2pa/packages/c2pa/dist/c2pa.esm.js';
import { EVENT_TYPE_C2PA_MANIFEST, EVENT_TYPE_C2PA_MANIFEST_RESPONSE } from '../config.js';
import { convertBlobToDataURL, convertDataURLtoBlob, isImageAccessible } from '../lib/imageUtils.js';
import Logger from '../lib/logger.js';
import { fetchManifestFromDecoupledAPI } from '../lib/manifestUtils.js';

Logger.setLevel(Logger.LOG_LEVELS.DEBUG); // Set the desired log level

let c2pa;
let c2paIsLoading = false;
const manifestMap = {};

async function initializeC2pa() {
  if (!c2paIsLoading) {
    Logger.info('Initializing C2PA...');
    c2pa = await createC2pa({
      wasmSrc: '../c2pa/packages/c2pa/dist/assets/wasm/toolkit_bg.wasm',
      workerSrc: '../c2pa/packages/c2pa/dist/c2pa.worker.min.js',
    });
    c2paIsLoading = true;
    Logger.info('C2PA initialized successfully');
  }
}

const validateC2pa = async (image, imageId) => {
  await initializeC2pa();

  if (!image) {
    Logger.warn('Image not available for validation', { imageId });
    return;
  }

  Logger.debug('Reading manifest for the image', { imageId });

  const { manifestStore } = await c2pa.read(image);
  manifestMap[imageId] = manifestStore;

  if (!manifestStore) {
    Logger.warn('No manifest store found for the image', { imageId });
    return;
  }

  const { manifestStore: l2ManifestStore } = await createL2ManifestStore(manifestStore);
  Logger.info('L2ManifestStore created successfully', { imageId });

  return {
    manifest: l2ManifestStore,
    validationStatus: manifestStore.validationStatus,
  };
};

async function sha256(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  Logger.debug('SHA-256 hash calculated', { hash: hashHex });
  return hashHex;
}

function convertManifest(input) {
  Logger.debug('Converting manifest to internal format');
  const output = {
    manifests: {},
    activeManifest: null,
  };

  Object.entries(input.manifests).forEach(([key, manifest]) => {
    const assertions = Array.isArray(manifest.assertions) ? manifest.assertions : [];

    const newManifest = {
      thumbnail: {
        blob: new Blob([], { type: 'image/jpeg' }),
        contentType: 'image/jpeg',
        getUrl: () => URL.createObjectURL(new Blob([])),
        hash: () => sha256(new Blob([])),
      },
      instanceId: manifest.instance_id,
      format: manifest.format,
      ingredients: [],
      claimGenerator: manifest.claim_generator,
      claimGeneratorHints: null,
      claimGeneratorInfos: [],
      assertions: {
        data: assertions,
        get(label) {
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

  const activeManifestKey = input.active_manifest;
  if (activeManifestKey && output.manifests[activeManifestKey]) {
    output.activeManifest = output.manifests[activeManifestKey];
  }

  Logger.info('Manifest conversion completed');
  return output;
}

const getManifestFromWatermark = async (file) => {
  Logger.info('Fetching manifest from watermark');
  const manifestResult = await fetchManifestFromDecoupledAPI(file);

  if (!manifestResult.success) {
    Logger.warn('Failed to fetch manifest from watermark');
    return { success: false };
  }

  const manifestStore = convertManifest(manifestResult.manifestData);

  if (!manifestStore) {
    Logger.warn('Failed to convert manifest from watermark');
    return { success: false };
  }

  const { manifestStore: l2ManifestStore } = await createL2ManifestStore(manifestStore);
  Logger.info('Successfully fetched and converted manifest from watermark');
  return {
    success: true,
    manifest: l2ManifestStore,
    hammingDistance: manifestResult.hammingDistance,
  };
};

function dataUrlToFile(dataUrl, filename) {
  Logger.debug('Converting data URL to file', { filename });
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

  Logger.info('Data URL converted to file successfully', { filename });
  return file;
}

const handleC2PAManifestMessage = async (event) => {
  try {
    Logger.info('Processing C2PA manifest message', { imageId: event.data.imageId });
    
    let image = event.data.src;
    const imageDataURI = event.data.dataURI;
    const { imageId, lookForWm } = event.data;
    const file = dataUrlToFile(imageDataURI, 'filename');

    Logger.info('Looking up C2PA manifest in memory cache', { imageId });
    if (manifestMap[imageId]) {
      Logger.info('C2PA Manifest found in memory cache', { imageId });
      return {
        type: EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
        manifest: manifestMap[imageId],
        imageId,
      };
    }

    Logger.info('C2PA manifest not found, starting retrieval process');

    // Check if the image is accessible, convert from data URL if necessary
    const isAccessible = await isImageAccessible(image);
    if (!isAccessible && imageDataURI) {
      image = await convertDataURLtoBlob(imageDataURI);
    }   

    Logger.debug('Fetching manifest for image', { imageId });
    let localResult;
    let wmResult;

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
      res.viewMoreUrl = generateVerifyUrl(typeof image === 'string' ? image : image.src);
    } else if (lookForWm && wmResult?.success) {
      res.viewMoreUrl = wmResult.url;
    }

    Logger.info('Manifest message processed successfully', { imageId });
    return res;
  } catch (error) {
    Logger.error('Error processing manifest message', { error: error.message });
    return { error: error.message };
  }
};

chrome.runtime.onMessage.addListener((event, sender, sendResponse) => {
  if (event.type === EVENT_TYPE_C2PA_MANIFEST) {
    Logger.info('Received C2PA manifest event', { type: event.type });    

    handleC2PAManifestMessage(event)
      .then((result) => {
        sendResponse(result); // Send response on success
      })
      .catch((error) => {
        Logger.error('Error handling C2PA manifest message', { error: error.message });
        sendResponse({ error: error.message }); // Send response on error
      });
  } else {
    Logger.warn('Unhandled event type', { type: event.type });
    sendResponse({ error: 'Unhandled event type' }); // Fallback response
  }

  return true; // Indicate async response
});

initializeC2pa();