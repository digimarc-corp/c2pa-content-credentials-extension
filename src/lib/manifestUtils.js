/* eslint-disable no-undef */
import {
  EVENT_TYPE_C2PA_MANIFEST,
  API_SBR_DIGIMARC,
  API_SBR_DIGIMARC_TOKEN
} from '../config.js';
import { displayError } from './errorUtils.js';

import { getBase64FromBlob } from './imageUtils.js';
import { displayProcessStatus } from './statusIndicator.js';
import Logger from './logger.js';

export const compareManifests = (manifest1, manifest2) => {  
  const keys = Object.keys(manifest1).filter((key) => key !== 'validationStatus' && key !== 'thumbnail' && key !== 'watermarkProvider' && key !== 'alert' && key !== 'ingredients');
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (typeof manifest1[key] === 'object' && manifest1[key] !== null && manifest2[key]) {
      if (!compareManifests(manifest1[key], manifest2[key])) {
        Logger.error('Manifest comparison failed', { key });
        return false;
      }
    } else if (manifest1[key] !== manifest2[key]) {
      Logger.error('Manifest comparison failed', { key });
      return false;
    }
  }
  return true;
};

const pHashIntact = (hammingDistance) => (hammingDistance > 99.9);

const displayManifest = (
  _manifest,
  retrievedManifest,
  hammingDistance,
  c2paId,
  viewMoreUrl,
  addIconForImage,
) => {
  let manifest = _manifest;
  if (manifest || retrievedManifest) {

    if (retrievedManifest) {
      manifest = retrievedManifest;
      manifest.watermarkProvider = 'Digimarc';
      manifest.alert = { message: 'Content Credentials were cross-checked using the watermark in the image', type: 'info' };

      //Ignore assertion.dataHash.mismatch error if it's the only one in the retrieved manifest as it was validated without the image
      const otpgError = (manifest.error === 'otgp');
      const dataHashMismatch = (manifest.validationStatus.length === 1) &&
        (manifest.validationStatus.some(error => error.code === 'assertion.dataHash.mismatch'));

      if (otpgError && dataHashMismatch) {
        manifest.error = null;
        manifest.validationStatus = [];
      }
    }

    if (!_manifest) {
      manifest.alert = { message: 'Content Credentials were retrieved using the watermark in the image', type: 'info' };
    }

    if (hammingDistance && !pHashIntact(hammingDistance)) {
      manifest.alert = { message: 'The content was visually modified', type: 'warning' };
    }

    if (_manifest && retrievedManifest) {
      // we have both a manifest and a retrieved manifest
      Logger.warn('Manifest and retrieved manifest comparison', { _manifest, retrievedManifest });
      const comparison = compareManifests(_manifest, retrievedManifest);

      if (!comparison) {
        manifest.alert = { message: "The embedded content credentials didn't match the reference in the watermark, the original content credentials were retrieved.", type: 'error' };
        manifest.error = true;
      }
    }

    // add the components linked to this image
    let element = document.querySelector(`img[c2paId="${c2paId}"]`);
    if (!element) {
      if (document.querySelector(`audio[c2paId="${c2paId}"]`)) {
        element = document.querySelector(`audio[c2paId="${c2paId}"]`);
      }
      if (document.querySelector(`video[c2paId="${c2paId}"]`)) {
        element = document.querySelector(`video[c2paId="${c2paId}"]`);
      }
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

    manifestSummary.manifestStore.thumbnail = element.src;
    caiIndicator.classList.add('manifest-loaded');
    element.classList.add('manifest-loaded');
  }
  Logger.info('Manifest loaded', { manifest });
};


const decodeTrustmark = async (imageURL) => {
  const imageFetched = await fetch(imageURL);
  const imageAsBlob = await imageFetched.blob();
  const imageAsBase64 = await getBase64FromBlob(imageAsBlob);

  //Detect signpost watermark (trustmark)
  const trustmarkInfo = await runwmark(imageAsBase64);
  Logger.info('Decoded Watermark Results', { trustmarkInfo });
  return trustmarkInfo;
}

/**
 * Send a message to the sandbox to get the C2PA manifest for the image.
 * @param {HTMLImageElement} imageElement - The image element to get the C2PA manifest for.
 */
export const getC2PAManifest = async (imageElement, addIconForImage, singleImageVerification, lookForWatermark) => {

  // Start the process
  const markAsComplete = displayProcessStatus('Please wait while trying to obtain Content Credentials...');

  const event = {};
  event.type = EVENT_TYPE_C2PA_MANIFEST;
  const imgId = imageElement.getAttribute('c2paId');
  event.data = {
    src: imageElement.src,
    dataURI: imageElement.dataURI,
    imageId: imgId,
    lookForWm: lookForWatermark
  };

  if (lookForWatermark) {
    //Check for signpost
    const trustmarkInfo = await decodeTrustmark(imageElement.src);
    if (trustmarkInfo.watermark_present) {
      if (trustmarkInfo.schema === 'BCH_SUPER') {
        //Signpost
        Logger.info('Signpost watermark detected', { trustmarkInfo });
        const payloadBlocks = trustmarkInfo.watermark.match(/.{1,10}/g); // Regular expression to split into chunks of 10
        const availableWatermarks = payloadBlocks.map(block => parseInt(block, 2)); // Use parseInt with base 2 for binary
        Logger.info('Watermarks available', { availableWatermarks });

        for (const watermark of availableWatermarks) {
          if (watermark === 1) {
            event.data.watermarkType = 'digimarc';
            break;
          }
        }
      }
      else {
        //Trustmark watermark but no signpost
        event.data.watermarkType = 'trustmark';
        event.data.softBinding = trustmarkInfo.c2padata['c2pa.soft-binding']
      }
    }
    else {
      //Set digimarc type as the watermark to try to detect
      event.data.watermarkType = 'digimarc';
    }
  }

  try {
    const {
      manifest, viewMoreUrl, retrievedManifest, hammingDistance,
    } = await chrome.runtime.sendMessage(event);

    if (!manifest && !retrievedManifest) {
      if (singleImageVerification) {
        // Mark the process as complete
        markAsComplete(true, 'No Content Credentials found for this media.');
        return;
      }
    }

    // Mark the process as complete
    markAsComplete(false, 'Content Credentials found');

    displayManifest(
      manifest,
      retrievedManifest,
      hammingDistance,
      imgId,
      viewMoreUrl,
      addIconForImage,
    );
  } catch (error) {
    if (singleImageVerification) {
      // Mark the process as complete
      markAsComplete(true, 'No Content Credentials found for this media.');
    } else {
      // Mark the process as complete
      //markAsComplete(false, 'Error retrieving Content Credentials');
      Logger.error(error);
    }
  }
};

export const fetchManifestFromSBR = async (file, contentType = null) => {
  Logger.info('C2PA Manifest retrieval from SBR started');

  //TODO change to binary call
  const data = new FormData();
  data.append('file', file);
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_SBR_DIGIMARC_TOKEN}`
    },
    body: data,
    redirect: 'follow',
  };

  const matchesByContentResponse = await fetch(`${API_SBR_DIGIMARC}/matches/byContent?alg=com.digimarc.validate.1`, requestOptions);
  if (matchesByContentResponse.status !== 200) return { success: false };

  const matchesByContentResponseJSON = await matchesByContentResponse.json();
  Logger.info('Matches by Content SBR response', { matchesByContentResponseJSON });

  const manifestId = matchesByContentResponseJSON?.matches?.[0]?.manifestId;
  if (!manifestId) return { success: false };

  const manifestUrl = `${API_SBR_DIGIMARC}/manifests/${encodeURIComponent(manifestId)}`;

  const manifestsResponse = await fetch(manifestUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_SBR_DIGIMARC_TOKEN}`,
      'Accept': contentType
    },
  });
  Logger.info('Manifest retrieval response', { manifestsResponse });
  if (manifestsResponse.status !== 200) return { success: false };

  const response = {
    success: true,
    manifestData: manifestsResponse,
    similarityScore: matchesByContentResponseJSON?.matches?.[0]?.similarityScore,
    manifestUrl: `${manifestUrl}?access_token=${API_SBR_DIGIMARC_TOKEN}`,
  }
  return response;
};
