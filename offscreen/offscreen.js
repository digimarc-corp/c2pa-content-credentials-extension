/* eslint-disable consistent-return */
/* eslint-disable no-undef */

import { createC2pa, createL2ManifestStore, generateVerifyUrl } from '../c2pa/packages/c2pa/dist/c2pa.esm.js';
import { EVENT_TYPE_C2PA_MANIFEST, EVENT_TYPE_C2PA_MANIFEST_RESPONSE } from '../config.js';
import { convertBlobToDataURL, convertDataURLtoBlob, isImageAccessible, getBase64FromBlob } from '../lib/imageUtils.js';
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
  Logger.debug('Converting manifest to internal format', {input});
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

  Logger.info('Manifest conversion completed',{ output });
  return output;
}

const getManifestFromWatermark = async (file) => {
  const manifestResult = await fetchManifestFromDecoupledAPI(file);

  if (!manifestResult.success) {
    Logger.warn('Failed to fetch manifest from watermark');
    return { success: false };
  }

  //const responseBlob = await manifestResult.manifestData.blob();
  //Logger.info(responseBlob);
  //const { manifestStore } = await c2pa.read(responseBlob);
  //Logger.info('Manifest store created successfully', { manifestStore });

  const manifestStore = convertManifest(manifestResult.manifestData);
  //const manifestStore = manifestResult.manifestData;

  if (!manifestStore) {
    Logger.warn('Failed to convert manifest from watermark');
    return { success: false };
  }

  const { manifestStore: l2ManifestStore } = await createL2ManifestStore(manifestStore);
  //Logger.info('Successfully fetched and converted manifest from watermark');

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

async function detectTrustmark(imageAsBase64) {
  const trustmarkDetectionResults = await runwmark(imageAsBase64);
  Logger.info('Decoded Watermark Results', trustmarkDetectionResults);

  // if (trustmarkDetectionResults.watermark_present) {
  //   Logger.info((`Trustmark present ${JSON.stringify(trustmarkDetectionResults, null, 4)}`));

  //   //Detect watermark via SBR too from image (two-phase check)
  //   const sbrHeaders = new Headers();
  //   sbrHeaders.append("content-type", "image/jpeg");
  //   sbrHeaders.append("x-api-key", "cai-digimarc");

  //   const SBR_ADOBE_API = 'https://cai-msb.adobe.io/sbapi/matches/byContent';
  //   const fingerPrintAlg = 'com.adobe.icn.dense';
  //   const hintAlg = trustmarkDetectionResults.c2padata['c2pa.soft-binding'].alg;
  //   const hintValue = btoa(trustmarkDetectionResults.c2padata['c2pa.soft-binding'].blocks[0].value);

  //   const requestUrl = `${SBR_ADOBE_API}?alg=${fingerPrintAlg}&hintAlg=${hintAlg}&hintValue=${hintValue}`;
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: sbrHeaders,
  //     body: imageAsBlob,
  //     redirect: 'follow',
  //   };

  //   const matchByContentResponse = await fetch(requestUrl, requestOptions);
  //   if (!matchByContentResponse.ok) {
  //     throw new Error(`Server error: ${response.status}`);
  //   }

  //   console.log('matchByContentResponse', matchByContentResponse);
  //   const matchByContentResponseJSON = await matchByContentResponse.json();
  //   console.log('matchByContentResponseJSON', matchByContentResponseJSON);

  //   if (matchByContentResponseJSON.matches.length != 0) {
  //     const manifestId = matchByContentResponseJSON.matches[0].manifestId.replace(/:/g, '-');
  //     console.log('manifestId', manifestId);

  //     //fetch manifest from SBR
  //     const event = {};
  //     event.type = EVENT_TYPES.FETCH_C2PA_MANIFEST;
  //     event.data = {
  //       imageId: imageId,
  //       manifestId: manifestId
  //     };

  //     const {
  //       manifest, viewMoreUrl, retrievedManifest, hammingDistance,
  //     } = await chrome.runtime.sendMessage(event);

  //     console.log('manifest', manifest);
  //   }

  // }
  // else {
  //   console.log("Trustmark not present");
  // }

  return trustmarkDetectionResults;
}

const handleC2PAManifestMessage = async (event) => {
  try {
    const response = {
      type: EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
      imageId: event.data.imageId,
      manifest: null,
      validationStatus: null,
      retrievedManifest: null,
      hammingDistance: null,
      viewMoreUrl: null,
    };

    Logger.info('Processing C2PA manifest message', { imageId: event.data.imageId });
    let image = event.data.src;
    const imageDataURI = event.data.dataURI;
    const { imageId, lookForWm } = event.data;

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

    // Check if the image is accessible, convert from data URL if necessary
    Logger.info('Checking image accessibility', { imageId });
    const isAccessible = await isImageAccessible(image);
    if (!isAccessible && imageDataURI) {
      image = await convertDataURLtoBlob(imageDataURI);
    }
    response.viewMoreUrl = generateVerifyUrl(typeof image === 'string' ? image : image.src);

    Logger.debug('Checking C2PA manifest from embedded metadata', { imageId });
    let embeddedC2PAValidation = await validateC2pa(image, imageId);
    if (!embeddedC2PAValidation?.manifest) {
      Logger.info('C2PA Manifest not found read from metadata completed', { embeddedC2PAValidation });
    }
    else {
      response.manifest = embeddedC2PAValidation.manifest;
      response.validationStatus = embeddedC2PAValidation.validationStatus;
      Logger.info('C2PA Manifest found from embedded metadata', { embeddedC2PAValidation });
    }

    if (event.data.lookForWm) {
      Logger.info('Watermark detection enabled: Looking up C2PA manifest using watermark', { imageId });
      if (event.data.watermarkType === 'trustmark') {
        Logger.info('Processing trustmark watermark', { imageId: event.data.imageId });

        const imageFetched = await fetch(event.data.src);
        const imageAsBlob = await imageFetched.blob();

        // Detect watermark via SBR too from image (two-phase check)
        const sbrHeaders = new Headers();
        sbrHeaders.append("content-type", "image/jpeg");
        sbrHeaders.append("x-api-key", "cai-digimarc");

        const SBR_ADOBE_API = 'https://cai-msb.adobe.io/sbapi/matches/byContent';
        const fingerPrintAlg = 'com.adobe.icn.dense';
        const hintAlg = event.data.softBinding.alg;
        const hintValue = btoa(event.data.softBinding.blocks[0].value);

        const requestUrl = `${SBR_ADOBE_API}?alg=${fingerPrintAlg}&hintAlg=${hintAlg}&hintValue=${hintValue}`;
        const requestOptions = {
          method: 'POST',
          headers: sbrHeaders,
          body: imageAsBlob,
          redirect: 'follow',
        };
        const matchByContentResponse = await fetch(requestUrl, requestOptions);

        if (!matchByContentResponse.ok) {
          Logger.error('Server error during SBR matchByContent', { status: matchByContentResponse });
          throw new Error(`Server error: ${matchByContentResponse.status}`);
        }

        const matchByContentResponseJSON = await matchByContentResponse.json();
        Logger.info('Trustmark SBR matchByContent response', { matchByContentResponseJSON });

        //Fetch manifest from SBR
        const manifestMatch = matchByContentResponseJSON.matches[0];
        if (manifestMatch) {

          //TODO temporary fix for Adobe SBR manifests Ids
          const manifestId = manifestMatch.manifestId.replace(/:/g, '-');
          Logger.info('Manifest match returned by SBR', { manifestId });

          //TODO temporary default until endpoint is returned by Adobe SBR
          const endpoint = manifestMatch.endpoint ? manifestMatch.endpoint : 'https://cai-manifests.adobe.com/manifests';
          
          //No Accept header will return binary JUMBF data
          const manifestsResponse = await fetch(`${endpoint}/${encodeURIComponent(manifestId)}`, {
            method: 'GET',
            redirect: "follow"
          });

          if (!manifestsResponse.ok) {
            Logger.error('Server error during SBR manifest fetch', { status: manifestsResponse });
            throw new Error(`Server error: ${manifestsResponse.status}`);
          }

          Logger.info('SBR manifest response', { manifestsResponse });
          const responseBlob = await manifestsResponse.blob();
          Logger.info('Manifest blob fetched successfully', { responseBlob });
          const { manifestStore } = await c2pa.read(responseBlob);
          Logger.info('SBR returned manifest store', { manifestStore });

          const { manifestStore: l2ManifestStore } = await createL2ManifestStore(manifestStore);

          response.retrievedManifest = l2ManifestStore;
          //TODO update when Adobe SBR supports this
          response.similarityScore = manifestMatch.similarityScore;
        }
      }
      else if (event.data.watermarkType === 'digimarc') {
        Logger.info('Processing digimarc watermark', { imageId: event.data.imageId });
        const file = dataUrlToFile(imageDataURI, 'filename');
        let wmResult = await getManifestFromWatermark(file);
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