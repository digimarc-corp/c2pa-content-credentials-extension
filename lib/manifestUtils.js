/* eslint-disable no-undef */
import { 
  EVENT_TYPE_C2PA_MANIFEST,
  API_SBR_DIGIMARC,
  API_SBR_DIGIMARC_TOKEN
 } from '../config.js';
import { displayError } from './errorUtils.js';

export const compareManifests = (manifest1, manifest2) => {
  const keys = Object.keys(manifest1).filter((key) => key !== 'validationStatus' && key !== 'thumbnail' && key !== 'watermarkProvider' && key !== 'alert' && key !== 'ingredients');
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (typeof manifest1[key] === 'object' && manifest1[key] !== null && manifest2[key]) {
      if (!compareManifests(manifest1[key], manifest2[key])) {
        return false;
      }
    } else if (manifest1[key] !== manifest2[key]) {
      return false;
    }
  }
  return true;
};

const pHashIntact = (hammingDistance) => (hammingDistance < 13);

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
      manifest.alert = { message: 'The content credentials were cross-checked using the watermark in the image', type: 'info' };
    }

    if (!_manifest) {
      manifest.alert = { message: 'The content credentials were retrieved using the watermark in the image', type: 'info' };
    }

    if (hammingDistance && !pHashIntact(hammingDistance)) {
      manifest.alert = { message: 'The content was visually modified', type: 'warning' };
    }

    if (_manifest && retrievedManifest) {
      // we have both a manifest and a retrieved manifest
      const comparison = compareManifests(_manifest, retrievedManifest);

      if (!comparison) {
        manifest.alert = { message: "The embedded content credentials didn't match the reference in the watermark, the original content credentials were retrieved.", type: 'error' };
        manifest.error = true;
      }
    }

    // add the components linked to this image
    let element = document.querySelector(`img[c2paId="${c2paId}"]`);
    if (!element) {
      if(document.querySelector(`audio[c2paId="${c2paId}"]`)) {
        element = document.querySelector(`audio[c2paId="${c2paId}"]`);
      }
      if(document.querySelector(`video[c2paId="${c2paId}"]`)) {
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
};

/**
 * Send a message to the sandbox to get the C2PA manifest for the image.
 * @param {HTMLImageElement} imageElement - The image element to get the C2PA manifest for.
 */
export const getC2PAManifest = async (imageElement, addIconForImage, singleImageVerification, lookForWatermark) => {
  const event = {};
  event.type = EVENT_TYPE_C2PA_MANIFEST;
  const imgId = imageElement.getAttribute('c2paId');

  event.data = {
    src: imageElement.src,
    dataURI: imageElement.dataURI,
    imageId: imgId,
    lookForWm: lookForWatermark,
  };

  try {
    const {
      manifest, viewMoreUrl, retrievedManifest, hammingDistance,
    } = await chrome.runtime.sendMessage(event);

    if (!manifest && !retrievedManifest) {
      if (singleImageVerification) {
        displayError('No Content Credentials found for this media.');
      }
    }
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
      displayError('No Content Credentials found for this media.');
    }
  }
};

export const fetchManifestFromDecoupledAPI = async (file) => {
  console.log('Fetching from Soft Binding Resolution API...');
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

  const res = await fetch(`${API_SBR_DIGIMARC}/matches/byContent?alg=com.digimarc.validate.1`, requestOptions);

  if (res.status !== 200) return { success: false };

  const resJson = await res.json();
  const manifestID = resJson?.matches?.[0]?.manifestId;

  if (!manifestID) return { success: false };

  const manifestRes = await fetch(`${API_SBR_DIGIMARC}/manifests/${encodeURIComponent(manifestID)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_SBR_DIGIMARC_TOKEN}`,
      'Accept': 'application/json'
    },
  });

  if (manifestRes.status !== 200) return { success: false };

  const arrayBuffer = await manifestRes.arrayBuffer(); // Get ArrayBuffer from response

  // Convert ArrayBuffer to Uint8Array
  const uint8Array = new Uint8Array(arrayBuffer);

  // Convert Uint8Array to string
  const string = new TextDecoder().decode(uint8Array);

  // Parse string as JSON
  const json = JSON.parse(string);

  return {
    success: true, manifestData: json,
  };
};
