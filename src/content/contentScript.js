/* eslint-disable no-undef */
// Import libraries and other scripts and start the content script

// Import third-party and local dependencies
import '../c2pa-ui/index.js';

import {
  MSG_DISABLE_LOOK_FOR_WATERMARK,
  MSG_DISABLE_RIGHT_CLICK,
  MSG_ENABLE_LOOK_FOR_WATERMARK,
  MSG_ENABLE_RIGHT_CLICK,
  MSG_GET_HTML_COMPONENT,
  MSG_INJECT_C2PA_INDICATOR,
  MSG_PAGE_LOADED,
  MSG_REVERT_C2PA_INDICATOR,
  MSG_VERIFY_SINGLE_IMAGE,
  MSG_VERIFY_SINGLE_VIDEO,
  MSG_VERIFY_SINGLE_AUDIO,
} from '../config.js';
import {
  addC2PAIndicatorOnAllComponents,
  handleSingleAudio,
  handleSingleImage,
  handleSingleVideo,
  removeC2PAIndicatorOnAllComponents,
} from '../lib/imageUtils.js';
import { displayError } from '../lib/errorUtils.js';
import { findNearestMedia } from '../lib/videoUtils.js';
import Logger from '../lib/logger.js'; // Import the shared logger

Logger.info('Configured C2PA UI library', { library: 'c2pa-ui' });

// Variable to hold the right-clicked element
let clickedEl = null;
let singleImageVerification = true;
let lookForWatermark = false;

const MESSAGE_MEDIA_MAP = {
  [MSG_VERIFY_SINGLE_IMAGE]: 'img',
  [MSG_VERIFY_SINGLE_VIDEO]: 'video',
  [MSG_VERIFY_SINGLE_AUDIO]: 'audio',
};

function normalizeUrl(rawUrl) {
  if (!rawUrl) return '';
  try {
    return new URL(rawUrl, window.location.href).href;
  } catch (_) {
    return rawUrl;
  }
}

function getMediaCandidateUrls(mediaElement) {
  if (!mediaElement) return [];

  const sourceUrls = [];
  const sourceElements = mediaElement.querySelectorAll('source[src]');
  sourceElements.forEach((sourceElement) => {
    sourceUrls.push(sourceElement.getAttribute('src'));
    sourceUrls.push(sourceElement.src);
  });

  return [
    mediaElement.currentSrc,
    mediaElement.src,
    mediaElement.getAttribute('src'),
    ...sourceUrls,
  ].map(normalizeUrl).filter(Boolean);
}

function resolveSingleVerificationTarget(messageType, srcUrl) {
  const expectedTag = MESSAGE_MEDIA_MAP[messageType];

  if (expectedTag && srcUrl) {
    const normalizedSrcUrl = normalizeUrl(srcUrl);
    const mediaElements = Array.from(document.querySelectorAll(expectedTag));
    const matchBySource = mediaElements.find((mediaElement) => getMediaCandidateUrls(mediaElement)
      .includes(normalizedSrcUrl));
    if (matchBySource) {
      return matchBySource;
    }
  }

  if (clickedEl) {
    const closestMedia = expectedTag ? clickedEl.closest(expectedTag) : null;
    if (closestMedia) {
      return closestMedia;
    }
  }

  const nearestMedia = findNearestMedia(clickedEl);
  if (nearestMedia && nearestMedia.element && nearestMedia.type === expectedTag) {
    return nearestMedia.element;
  }

  return null;
}

// Listen for right clicks and save the clicked element
document.addEventListener('contextmenu', (event) => {
  clickedEl = event.target;
  Logger.debug('Right-clicked element saved', { clickedElement: clickedEl });
}, true);

// Register to messages coming from the background script
chrome.runtime.onMessage.addListener((message) => {
  Logger.debug('Received message', { type: message.type });

  try {
    if (message.type === MSG_GET_HTML_COMPONENT) {
      Logger.info(`Processing ${MSG_GET_HTML_COMPONENT} message`);
      const nearestMedia = findNearestMedia(clickedEl);

      if (!nearestMedia) {
        Logger.warn('No media found near the right-clicked element.');
        displayError('Unable to locate a media to verify.');
      }

      Logger.debug('Nearest media found', { type: nearestMedia.type, element: nearestMedia.element });

      if (nearestMedia.type === 'audio') {
        Logger.info('Verifying single audio file');
        handleSingleAudio(nearestMedia.element, singleImageVerification, lookForWatermark);
      } else if (nearestMedia.type === 'video') {
        Logger.info('Verifying single video file');
        handleSingleVideo(nearestMedia.element, singleImageVerification, lookForWatermark);
      } else if (nearestMedia.type === 'img') {
        Logger.info('Verifying single image file');
        handleSingleImage(nearestMedia.element, singleImageVerification, lookForWatermark);
      } else {
        Logger.error('No recognizable media type found within the current element.');
        if (singleImageVerification) {
          displayError('Unable to locate a media to verify.');
        }
      }
    } else if (message.type === MSG_INJECT_C2PA_INDICATOR) {
      Logger.info('Injecting C2PA indicator on all components');
      addC2PAIndicatorOnAllComponents();
      singleImageVerification = false;
      chrome.runtime.sendMessage({ type: MSG_DISABLE_RIGHT_CLICK });
    } else if (message.type === MSG_REVERT_C2PA_INDICATOR) {
      Logger.info('Reverting C2PA indicators on all components');
      removeC2PAIndicatorOnAllComponents();
      singleImageVerification = true;
      chrome.runtime.sendMessage({ type: MSG_ENABLE_RIGHT_CLICK });
    } else if (message.type === MSG_VERIFY_SINGLE_IMAGE) {
      const imageElement = resolveSingleVerificationTarget(message.type, message.srcUrl);
      Logger.info('Verifying single image', {
        clickedElement: clickedEl,
        resolvedElement: imageElement,
        srcUrl: message.srcUrl,
      });
      handleSingleImage(imageElement, singleImageVerification, lookForWatermark);
    } else if (message.type === MSG_VERIFY_SINGLE_VIDEO) {
      const videoElement = resolveSingleVerificationTarget(message.type, message.srcUrl);
      Logger.info('Verifying single video', {
        clickedElement: clickedEl,
        resolvedElement: videoElement,
        srcUrl: message.srcUrl,
      });
      handleSingleVideo(videoElement, singleImageVerification, lookForWatermark);
    } else if (message.type === MSG_VERIFY_SINGLE_AUDIO) {
      const audioElement = resolveSingleVerificationTarget(message.type, message.srcUrl);
      Logger.info('Verifying single audio', {
        clickedElement: clickedEl,
        resolvedElement: audioElement,
        srcUrl: message.srcUrl,
      });
      handleSingleAudio(audioElement, singleImageVerification, lookForWatermark);
    } else if (message.type === MSG_DISABLE_LOOK_FOR_WATERMARK) {
      Logger.info('Disabling watermark detection');
      lookForWatermark = false;
    } else if (message.type === MSG_ENABLE_LOOK_FOR_WATERMARK) {
      Logger.info('Enabling watermark detection');
      lookForWatermark = true;
    } else {
      Logger.warn('Unknown message type received', { type: message.type });
    }
  } catch (error) {
    Logger.error('Error processing message', { error: error.message });
  }
});

// Main function for the content script
(async () => {
  if (document.readyState === 'complete') {
    Logger.info('Page loaded (readyState is complete)');
    setTimeout(() => {
      Logger.debug(`Sending Message ${MSG_PAGE_LOADED}`);
      chrome.runtime.sendMessage({ type: MSG_PAGE_LOADED });
    }, 1000);
  } else {
    window.addEventListener('load', () => {
      Logger.info(`Page loaded (via load event) sending message ${MSG_PAGE_LOADED}`);
      chrome.runtime.sendMessage({ type: MSG_PAGE_LOADED });
    });
  }
})();
