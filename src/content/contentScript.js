/* eslint-disable no-undef */
// Import libraries and other scripts and start the content script

// Import third-party and local dependencies
import '../../c2pa/packages/c2pa-wc/dist/index.js';
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

window.__C2PA_UI_LIBRARY__ = 'legacy';

chrome.storage.local.get({ useNewUI: false }, ({ useNewUI }) => {
  window.__C2PA_UI_LIBRARY__ = useNewUI ? 'new' : 'legacy';
  Logger.info('Configured C2PA UI library', { library: window.__C2PA_UI_LIBRARY__ });
});

// Variable to hold the right-clicked element
let clickedEl = null;
let singleImageVerification = true;
let lookForWatermark = false;

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
      Logger.info('Verifying single image', { clickedElement: clickedEl });
      handleSingleImage(clickedEl, singleImageVerification, lookForWatermark);
    } else if (message.type === MSG_VERIFY_SINGLE_VIDEO) {
      Logger.info('Verifying single video', { clickedElement: clickedEl });
      handleSingleVideo(clickedEl, singleImageVerification, lookForWatermark);
    } else if (message.type === MSG_VERIFY_SINGLE_AUDIO) {
      Logger.info('Verifying single audio', { clickedElement: clickedEl });
      handleSingleAudio(clickedEl, singleImageVerification, lookForWatermark);
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
