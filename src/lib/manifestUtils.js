/* eslint-disable no-undef */
import {
  EVENT_TYPE_C2PA_MANIFEST,
  API_SBR_DIGIMARC,
  API_SBR_DIGIMARC_TOKEN,
} from '../config.js';
import { displayProcessStatus } from './statusIndicator.js';
import Logger from './logger.js';

export const compareManifests = (manifest1, manifest2) => {
  const ignoredKeys = new Set([
    'validationStatus',
    'validationState',
    'validation_state',
    'trustSource',
    'thumbnail',
    'watermarkProvider',
    'alert',
    'alerts',
    'ingredients',
    'error',
    'transformedDelivery',
    'viewMoreUrl',
  ]);

  const normalize = (value) => {
    if (Array.isArray(value)) {
      const normalizedArray = value.map((entry) => normalize(entry));
      // Sort arrays of plain strings so ordering differences do not trigger false mismatches.
      if (normalizedArray.every((entry) => typeof entry === 'string')) {
        return normalizedArray.slice().sort();
      }
      return normalizedArray;
    }

    if (value && typeof value === 'object') {
      const normalizedObject = {};
      Object.keys(value)
        .filter((key) => !ignoredKeys.has(key) && typeof value[key] !== 'undefined')
        .sort()
        .forEach((key) => {
          normalizedObject[key] = normalize(value[key]);
        });
      return normalizedObject;
    }

    return value;
  };

  const deepEqual = (left, right) => {
    if (left === right) {
      return true;
    }

    if (typeof left !== typeof right) {
      return false;
    }

    if (Array.isArray(left)) {
      if (!Array.isArray(right) || left.length !== right.length) {
        return false;
      }
      for (let i = 0; i < left.length; i += 1) {
        if (!deepEqual(left[i], right[i])) {
          return false;
        }
      }
      return true;
    }

    if (left && typeof left === 'object') {
      const leftKeys = Object.keys(left);
      const rightKeys = Object.keys(right || {});
      if (leftKeys.length !== rightKeys.length) {
        return false;
      }
      for (let i = 0; i < leftKeys.length; i += 1) {
        const key = leftKeys[i];
        if (!deepEqual(left[key], right[key])) {
          return false;
        }
      }
      return true;
    }

    return false;
  };

  const normalizedManifest1 = normalize(manifest1 || {});
  const normalizedManifest2 = normalize(manifest2 || {});
  const match = deepEqual(normalizedManifest1, normalizedManifest2);

  if (!match) {
    Logger.error('Manifest comparison failed', {
      normalizedManifest1,
      normalizedManifest2,
    });
  }

  return match;
};

const pHashIntact = (hammingDistance) => (hammingDistance > 99.9);

const SIGNPOST_WATERMARK_NAMES = {
  1: 'Digimarc',
};

const cloneManifestSource = (manifest) => {
  if (!manifest) {
    return null;
  }

  return JSON.parse(JSON.stringify(manifest));
};

const displayManifest = (
  _manifest,
  retrievedManifest,
  rawManifestStore,
  rawRetrievedManifestStore,
  availableWatermarks,
  hammingDistance,
  c2paId,
  viewMoreUrl,
  addIconForImage,
) => {
  let manifest = _manifest;
  if (manifest || retrievedManifest) {
    const embeddedManifest = _manifest ? cloneManifestSource(_manifest) : null;
    const recoveredManifest = retrievedManifest ? cloneManifestSource(retrievedManifest) : null;
    const embeddedRawSource = cloneManifestSource(rawManifestStore || _manifest);
    const recoveredRawSource = cloneManifestSource(
      rawRetrievedManifestStore || rawManifestStore || retrievedManifest,
    );

    let rawManifestSource = embeddedRawSource || recoveredRawSource;

    const alertEntries = [];
    const addAlert = (message, type) => {
      alertEntries.push({ message, type });
    };

    if (recoveredManifest) {
      manifest = recoveredManifest;
      if (_manifest) {
        addAlert('Content Credentials were cross-checked using the watermark in the image', 'info');
      }

      // Keep the 'otgp' error on recovered manifests so UI can show 'recovered' status
      // (don't clear it here - let the UI layer handle display logic)
    }

    if (_manifest && retrievedManifest) {
      // We have both embedded and retrieved manifests.
      // If they match semantically, prioritize embedded for overlay rendering.
      Logger.info('Manifest and retrieved manifest comparison', { _manifest, retrievedManifest });
      const comparison = compareManifests(_manifest, retrievedManifest);

      if (comparison) {
        manifest = _manifest;
      } else {
        // Temporarily ignore transformed-delivery handling until the product logic is revisited.
        const isTransformedDelivery = false;
        if (isTransformedDelivery) {
          addAlert(
            'Embedded and recovered manifests differ after transformed delivery; '
              + 'showing recovered content credentials from watermark reference.',
            'info',
          );
        } else {
          addAlert(
            "The embedded content credentials didn't match the reference in the watermark, "
              + 'the original content credentials were recovered.',
            'error',
          );
          if (embeddedManifest) {
            embeddedManifest.error = true;
          }
        }
      }
    }

    // Keep the raw JSON manifest source aligned with whichever manifest is displayed.
    rawManifestSource = manifest === _manifest ? embeddedRawSource : recoveredRawSource;

    if (!_manifest) {
      addAlert('Content Credentials were recovered using the watermark in the image', 'info');
    }

    if (manifest.aiGenerated) {
      addAlert('This media was generated using AI', 'info');
    }

    if (manifest.transformedDelivery) {
      addAlert(
        'The Content Credentials signature is trusted, but this delivered media appears transformed '
          + '(bytes differ from the signed original).',
        'info',
      );
    }

    if (Array.isArray(availableWatermarks) && availableWatermarks.length > 0) {
      const watermarkNames = availableWatermarks
        .filter((watermarkId) => watermarkId !== 0)
        .map(
          (watermarkId) => SIGNPOST_WATERMARK_NAMES[watermarkId] || `Watermark ${watermarkId}`,
        );

      if (watermarkNames.length > 0) {
        addAlert(
          `This image contains a signpost watermark for ${watermarkNames.join(', ')}.`,
          'info',
        );
      }
    }

    if (embeddedManifest) {
      embeddedManifest.alerts = cloneManifestSource(alertEntries);
      embeddedManifest.alert = alertEntries.length > 0 ? alertEntries[alertEntries.length - 1] : null;
    }

    // pHash similarity is only meaningful for the recovered manifest (watermark-based comparison)
    if (hammingDistance && !pHashIntact(hammingDistance)) {
      addAlert('Similarity checks suggests this media has been modified.', 'warning');
    }

    if (recoveredManifest) {
      recoveredManifest.alerts = cloneManifestSource(alertEntries);
      recoveredManifest.alert = alertEntries.length > 0 ? alertEntries[alertEntries.length - 1] : null;
    }

    manifest = embeddedManifest || recoveredManifest;
    rawManifestSource = embeddedRawSource || recoveredRawSource;

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

    Logger.debug('Overlay manifest snapshot', {
      c2paId,
      hasManifest: Boolean(manifest),
      keys: manifest ? Object.keys(manifest).sort() : [],
      summary: manifest
        ? {
          title: manifest.title,
          format: manifest.format,
          hasSignature: Boolean(manifest.signature),
          hasProducer: Boolean(manifest.producer?.name),
          socialAccountsCount: Array.isArray(manifest.socialAccounts)
            ? manifest.socialAccounts.length
            : 0,
          generativeInfoCount: Array.isArray(manifest.generativeInfo)
            ? manifest.generativeInfo.length
            : 0,
          hasWeb3: Boolean(manifest.web3),
          isBeta: Boolean(manifest.isBeta),
          validationStatusCount: Array.isArray(manifest.validationStatus)
            ? manifest.validationStatus.length
            : 0,
          error: manifest.error,
        }
        : null,
    });

    manifestSummary.embeddedManifestStore = embeddedManifest;
    manifestSummary.recoveredManifestStore = recoveredManifest;
    manifestSummary.embeddedJsonManifestStore = embeddedRawSource;
    manifestSummary.recoveredJsonManifestStore = recoveredRawSource;
    manifestSummary.manifestStore = manifest;
    manifestSummary.jsonManifestStore = rawManifestSource;
    manifestSummary.viewMoreUrl = viewMoreUrl;
    chrome.storage.local.get({ enableJsonManifestView: false }, (result) => {
      manifestSummary.jsonManifestViewEnabled = Boolean(result.enableJsonManifestView);
    });

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
  // Convert blob to base64
  const imageAsBase64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(imageAsBlob);
  });

  // Detect signpost watermark (trustmark)
  const trustmarkInfo = await runwmark(imageAsBase64);
  Logger.info('Decoded Watermark Results', { trustmarkInfo });
  return trustmarkInfo;
};

/**
 * Send a message to the sandbox to get the C2PA manifest for the image.
 * @param {HTMLImageElement} imageElement - The image element to get the C2PA manifest for.
 */
export const getC2PAManifest = async (
  imageElement,
  addIconForImage,
  singleImageVerification,
  lookForWatermark,
) => {
  // Start the process
  const markAsComplete = displayProcessStatus(
    'Please wait while checking Content Credentials...',
  );

  const event = {};
  event.type = EVENT_TYPE_C2PA_MANIFEST;
  const imgId = imageElement.getAttribute('c2paId');
  const sourceUrl = imageElement.currentSrc || imageElement.src;
  event.data = {
    src: sourceUrl,
    dataURI: imageElement.dataURI,
    imageId: imgId,
    lookForWm: lookForWatermark,
  };

  const elementTag = imageElement?.tagName?.toLowerCase();
  const isImageMedia = elementTag === 'img';

  if (lookForWatermark && isImageMedia) {
    try {
      // Check for signpost
      const trustmarkInfo = await decodeTrustmark(sourceUrl);
      if (trustmarkInfo.watermark_present) {
        if (trustmarkInfo.schema === 'BCH_SUPER') {
          // Signpost
          Logger.info('Signpost watermark detected', { trustmarkInfo });
          const payloadBlocks = trustmarkInfo.watermark.match(/.{1,10}/g); // Regular expression to split into chunks of 10
          const availableWatermarks = payloadBlocks.map((block) => parseInt(block, 2));
          Logger.info('Watermarks available', { availableWatermarks });
          event.data.availableWatermarks = availableWatermarks;

          availableWatermarks.forEach((watermark) => {
            if (watermark === 1) {
              event.data.watermarkType = 'digimarc';
            }
          });
        } else {
          // Trustmark watermark but no signpost
          event.data.watermarkType = 'trustmark';
          event.data.softBinding = trustmarkInfo.c2padata['c2pa.soft-binding'];
        }
      } else {
        // Set digimarc type as the watermark to try to detect
        event.data.watermarkType = 'digimarc';
      }
    } catch (error) {
      Logger.warn('Watermark detection skipped due to decode failure', {
        src: sourceUrl,
        tag: elementTag,
        error: error.message,
      });
      // Fall back to Digimarc recovery if Trustmark decode fails.
      event.data.watermarkType = 'digimarc';
    }
  } else if (lookForWatermark) {
    Logger.info('Skipping watermark detection for non-image media', {
      tag: elementTag,
      src: sourceUrl,
    });
    // Non-image media should still try Digimarc-based manifest recovery.
    event.data.watermarkType = 'digimarc';
  }

  try {
    const {
      manifest,
      rawManifestStore,
      viewMoreUrl,
      retrievedManifest,
      rawRetrievedManifestStore,
      availableWatermarks,
      hammingDistance,
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
      rawManifestStore,
      rawRetrievedManifestStore,
      availableWatermarks,
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
      // markAsComplete(false, 'Error retrieving Content Credentials');
      Logger.error(error);
    }
  }
};

export const fetchManifestFromSBR = async (file, contentType = null) => {
  Logger.info('C2PA Manifest retrieval from SBR started');

  // TODO change to binary call
  const data = new FormData();
  data.append('file', file);
  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_SBR_DIGIMARC_TOKEN}`,
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

  const manifestHeaders = {
    Authorization: `Bearer ${API_SBR_DIGIMARC_TOKEN}`,
  };
  if (contentType) {
    manifestHeaders.Accept = contentType;
  }
  const manifestsResponse = await fetch(manifestUrl, {
    method: 'GET',
    headers: manifestHeaders,
  });
  Logger.info('Manifest retrieval response', { manifestsResponse });
  if (manifestsResponse.status !== 200) return { success: false };

  const response = {
    success: true,
    manifestData: manifestsResponse,
    similarityScore: matchesByContentResponseJSON?.matches?.[0]?.similarityScore,
    manifestUrl: `${manifestUrl}?access_token=${API_SBR_DIGIMARC_TOKEN}`,
  };
  return response;
};
