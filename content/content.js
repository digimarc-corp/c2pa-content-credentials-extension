/* eslint-disable no-undef */
// eslint-disable-next-line
import * as c2paWC from '../c2pa/packages/c2pa-wc/dist/index.js';
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

// Set the log level (adjust based on environment)

import Logger from '../lib/logger.js'; // Import the shared logger
Logger.setLevel(Logger.LOG_LEVELS.DEBUG);

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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  Logger.debug('Received message', { type: message.type });

  try {
    if (message.type === MSG_GET_HTML_COMPONENT) {
      Logger.info(`Processing ${MSG_GET_HTML_COMPONENT} message`);
      const nearestMedia = findNearestMedia(clickedEl);

      if (!nearestMedia) {
        Logger.warn('No media found near the right-clicked element.');
        displayError('Unable to locate a media to verify.');
        //sendResponse({ success: false, error: 'No media found' });
        // return true; // Keep the message channel open
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
        //sendResponse({ success: false, error: 'No recognizable media type found' });
        //return true; // Keep the message channel open
      }

      //sendResponse({ success: true, message: 'Media verification completed' });
    } 
    else if (message.type === MSG_INJECT_C2PA_INDICATOR) {
      Logger.info('Injecting C2PA indicator on all components');
      addC2PAIndicatorOnAllComponents();
      singleImageVerification = false;
      chrome.runtime.sendMessage({ type: MSG_DISABLE_RIGHT_CLICK });
      //sendResponse({ success: true, message: 'C2PA indicator injected' });
    } 
    else if (message.type === MSG_REVERT_C2PA_INDICATOR) {
      Logger.info('Reverting C2PA indicators on all components');
      removeC2PAIndicatorOnAllComponents();
      singleImageVerification = true;
      chrome.runtime.sendMessage({ type: MSG_ENABLE_RIGHT_CLICK });
      //sendResponse({ success: true, message: 'C2PA indicator reverted' });
    } 
    else if (message.type === MSG_VERIFY_SINGLE_IMAGE) {
      Logger.info('Verifying single image', { clickedElement: clickedEl });
      handleSingleImage(clickedEl, singleImageVerification, lookForWatermark);
      //sendResponse({ success: true, message: 'Single image verified' });
    } 
    else if (message.type === MSG_VERIFY_SINGLE_VIDEO) {
      Logger.info('Verifying single video', { clickedElement: clickedEl });
      handleSingleVideo(clickedEl, singleImageVerification, lookForWatermark);
      //sendResponse({ success: true, message: 'Single video verified' });
    } 
    else if (message.type === MSG_VERIFY_SINGLE_AUDIO) {
      Logger.info('Verifying single audio', { clickedElement: clickedEl });
      handleSingleAudio(clickedEl, singleImageVerification, lookForWatermark);
      //sendResponse({ success: true, message: 'Single audio verified' });
    } 
    else if (message.type === MSG_DISABLE_LOOK_FOR_WATERMARK) {
      Logger.info('Disabling watermark detection');
      lookForWatermark = false;
      //sendResponse({ success: true, message: 'Watermark detection disabled' });
    } 
    else if (message.type === MSG_ENABLE_LOOK_FOR_WATERMARK) {
      Logger.info('Enabling watermark detection');
      lookForWatermark = true;
      //sendResponse({ success: true, message: 'Watermark detection enabled' });
    } else {
      Logger.warn('Unknown message type received', { type: message.type });
      //sendResponse({ success: false, error: 'Unknown message type' });
    }
  } catch (error) {
    Logger.error('Error processing message', { error: error.message });
    //sendResponse({ success: false, error: error.message });
  }

  //return true; // Indicate that the response will be sent asynchronously
});

export async function main() {
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
}