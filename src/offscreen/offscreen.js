/* eslint-disable consistent-return */
/* eslint-disable no-undef */
import { createC2pa, createL2ManifestStore, generateVerifyUrl } from 'c2pa';

import {
  EVENT_TYPE_C2PA_MANIFEST,
  EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
  C2PA_VERSION
} from '../config.js';
import { convertBlobToDataURL, convertDataURLtoBlob, isImageAccessible, getBase64FromBlob } from '../lib/imageUtils.js';
import Logger from '../lib/logger.js';
import TimelineLogger from '../lib/timeline.js';
import { fetchManifestFromSBR } from '../lib/manifestUtils.js';

let c2pa;
let c2paIsLoading = false;
const manifestMap = {};

async function initializeC2pa() {
  if (!c2paIsLoading) {
    Logger.info(`Initializing C2PA...${C2PA_VERSION}`);   
    const versionConfig = 
    {
      wasmSrc: '../node_modules/c2pa/dist/assets/wasm/toolkit_bg.wasm?file',
      workerSrc: '../node_modules/c2pa/dist/c2pa.worker.min.js?file',
    }
    c2pa = await createC2pa(versionConfig);
    c2paIsLoading = true;
    Logger.info(`C2PA ${C2PA_VERSION} initialized successfully`);
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
  Logger.info('ManifestStore read from Image successfully', { manifestStore });

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
  Logger.debug('Converting manifest to internal format', { input });
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
      claimGeneratorInfo: [],
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
        cert_serial_number: manifest.signature_info?.cert_serial_number || null,
        time: manifest.signature_info?.time || null,
        issuer: manifest.signature_info?.issuer || null,
      },
      vendor: null,
    };

    output.manifests[key] = newManifest;
  });

  const activeManifestKey = input.active_manifest;
  if (activeManifestKey && output.manifests[activeManifestKey]) {
    output.activeManifest = output.manifests[activeManifestKey];
  }

  Logger.info('Manifest conversion completed', { output });
  return output;
}

const CONTENT_TYPE = {
  JSON: 'application/json',
  JUMBF: null,
};

const getManifestFromWatermark = async (file, contentType) => {

  const manifestResult = await fetchManifestFromSBR(file, contentType);
  TimelineLogger.addToTimeline('c2pa', `Fetched manifest from SBR Digimarc`);

  if (!manifestResult.success) {
    Logger.warn('Failed to fetch manifest from watermark');
    return { success: false };
  }

  let manifestStore = null;
  if (contentType === CONTENT_TYPE.JSON) {
    const responseJSON = await manifestResult.manifestData.json();
    manifestStore = convertManifest(responseJSON);
    Logger.info('Manifest store converted from JSON response', { manifestStore });
  }
  else if (contentType === CONTENT_TYPE.JUMBF) {
    const responseBlob = await manifestResult.manifestData.blob();
    manifestStore = await c2pa.read(responseBlob);
    Logger.info('Manifest store converted from Blob response', { manifestStore });
    manifestStore = manifestStore.manifestStore;
  }

  TimelineLogger.addToTimeline('c2pa', `Read manifestStore from JUMBF Blob`);

  if (!manifestStore) {
    Logger.warn('Failed to convert manifest from watermark');
    return { success: false };
  }

  const { manifestStore: l2ManifestStore } = await createL2ManifestStore(manifestStore);
  TimelineLogger.addToTimeline('c2pa', `Create c2pa-wc compatible l2ManifestStore`);

  //TODO fix the hammingDistance calculation
  return {
    success: true,
    manifest: l2ManifestStore,
    hammingDistance: manifestResult.similarityScore
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
  TimelineLogger.startTimeline("c2pa");
  try {
    Logger.info('Processing C2PA manifest message', { imageId: event.data.imageId });

    const response = {
      type: EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
      imageId: event.data.imageId,
      manifest: null,
      validationStatus: null,
      retrievedManifest: null,
      hammingDistance: null,
      viewMoreUrl: null,
    };

    let image = event.data.src;
    const { imageId } = event.data;
    
    //Check if manifest is already in memory cache
    Logger.info('Looking up C2PA manifest in memory cache', { imageId });
    if (manifestMap[imageId]) {
      Logger.info('C2PA Manifest found in memory cache', { imageId });
      return {
        type: EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
        manifest: manifestMap[imageId],
        imageId,
      };
    }
    else {
      Logger.info('C2PA manifest not found in memory cache, starting retrieval process');      
    }
    TimelineLogger.addToTimeline('c2pa', 'Look-up in memory cache');

    //Check if image is a blob or a URL and convert to blob if necessary
    Logger.info('Checking image accessibility', { imageId });
    const isAccessible = await isImageAccessible(event.data.src);
    if (!isAccessible && event.data.dataURI) {
      image = await convertDataURLtoBlob(event.data.dataURI);
    }
    TimelineLogger.addToTimeline('c2pa', `Check image accesibility`);

    //update ViewMore URL for the validation ui component
    response.viewMoreUrl = generateVerifyUrl(typeof image === 'string' ? image : image.src);

    //Check if the image has embedded a C2PA manifest
    Logger.debug('Checking C2PA manifest from embedded metadata', { imageId });
    let embeddedC2PAValidation = await validateC2pa(image, imageId);
    if (!embeddedC2PAValidation?.manifest) {
      Logger.info('C2PA Manifest not found. Read from metadata completed', { embeddedC2PAValidation });
    }
    else {
      response.manifest = embeddedC2PAValidation.manifest;
      response.validationStatus = embeddedC2PAValidation.validationStatus;
      Logger.info('C2PA Manifest found from embedded metadata', { embeddedC2PAValidation });
    }
    TimelineLogger.addToTimeline('c2pa', `Check embedded manifest`);

    //Check if watermark detection is enabled
    if (event.data.lookForWm) {

      Logger.info('Watermark detection enabled: Looking up C2PA manifest using watermark', { imageId });
      
      if (event.data.watermarkType === 'digimarc') {
        Logger.info('Processing digimarc watermark', { imageId: event.data.imageId });

        const file = dataUrlToFile(event.data.dataURI, 'filename');
        TimelineLogger.addToTimeline('c2pa', `Prepared file to read watermark Digimarc`);

        const contentType = CONTENT_TYPE.JUMBF;
        let wmResult = await getManifestFromWatermark(file, contentType);
        TimelineLogger.addToTimeline('c2pa', `Manifest obtained from SBR Digimarc`);

        if (wmResult.success) {
          Logger.info('Watermark found in image', { imageId });
          response.retrievedManifest = wmResult.manifest;
          response.hammingDistance = wmResult.hammingDistance;
          //response.viewMoreUrl = wmResult.url;
        }
      }
      else {
        Logger.warn('Unknown watermark type', { imageId });
        response.error = 'Unknown watermark type';
      }
    }

    Logger.info('C2PA Manifest retrieval processed successfully', { response });
    return response;
  }
  catch (error) {
    Logger.error('Error processing manifest message', { error });
    return { error: error.message };
  } finally {
    TimelineLogger.closeTimeline("c2pa");
  }
};

//Event manager for messages from the content script
chrome.runtime.onMessage.addListener((event, sender, sendResponse) => {
  if (event.type === EVENT_TYPE_C2PA_MANIFEST) {
    Logger.info('Received C2PA manifest event', { type: event.type });

    handleC2PAManifestMessage(event)
      .then((result) => {
        sendResponse(result); // Send response on success
      })
      .catch((error) => {
        Logger.error('Error handling C2PA manifest message', { error: error });
        sendResponse({ error: error.message }); // Send response on error
      });
  } else {
    Logger.warn('Unhandled event type', { type: event.type });
    sendResponse({ error: 'Unhandled event type' }); // Fallback response
  }

  return true; // Indicate async response
});

initializeC2pa();