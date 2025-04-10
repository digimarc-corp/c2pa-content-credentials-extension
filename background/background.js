/* eslint-disable no-undef */

import {
  MSG_PAGE_LOADED,
  MSG_VERIFY_SINGLE_IMAGE,
  MSG_VERIFY_SINGLE_VIDEO,
  MSG_VERIFY_SINGLE_AUDIO,
  MSG_GET_HTML_COMPONENT,
  MSG_DISABLE_RIGHT_CLICK,
  MSG_ENABLE_RIGHT_CLICK,
  MSG_INJECT_C2PA_INDICATOR,
  MSG_DISABLE_LOOK_FOR_WATERMARK,
  MSG_ENABLE_LOOK_FOR_WATERMARK,
  WHITELISTED_WM_AUTO_URLS,
} from '../config.js';
import Logger from '../lib/logger.js'; // Import the custom Logger utility

Logger.setLevel(Logger.LOG_LEVELS.DEBUG); // Set the desired log level

function disableMenuItem(id) {
  chrome.contextMenus.update(id, { enabled: false }, () => {
    if (chrome.runtime.lastError) {
      Logger.error('Failed to disable menu item', {
        id,
        error: chrome.runtime.lastError.message,
      });
    } else {
      Logger.info('Menu item disabled', { id });
    }
  });
}

function enableMenuItem(id) {
  chrome.contextMenus.update(id, { enabled: true }, () => {
    if (chrome.runtime.lastError) {
      Logger.error('Failed to enable menu item', {
        id,
        error: chrome.runtime.lastError.message,
      });
    } else {
      Logger.info('Menu item enabled', { id });
    }
  });
}

// Set badge based on whether the extension is enabled or disabled
chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.local.get({ activated: false }, (result) => {
    if (result.activated) {
      Logger.info('Extension installed and activated. Setting ON icon.');
      const path = chrome.runtime.getURL('assets/icons/icon-on.png');
      chrome.action.setIcon({ path }, () => {
        if (chrome.runtime.lastError) {
          Logger.error('Failed to set ON icon', {
            error: chrome.runtime.lastError.message,
          });
        }
      });
    } else {
      Logger.info('Extension installed but not activated. Setting OFF icon.');
      const path = chrome.runtime.getURL('assets/icons/icon-off.png');
      chrome.action.setIcon({ path }, () => {
        if (chrome.runtime.lastError) {
          Logger.error('Failed to set OFF icon', {
            error: chrome.runtime.lastError.message,
          });
        }
      });
    }
  });

  chrome.contextMenus.create({
    id: 'verifyImage',
    title: 'Verify Content Credentials',
    contexts: ['all'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  if (info.menuItemId === 'verifyImage') {
    if (info?.mediaType === 'image' && tabs.length > 0) {
      Logger.info(`Sending message  ${MSG_VERIFY_SINGLE_IMAGE} to content script`, {
        srcUrl: info.srcUrl,
      });
      chrome.tabs.sendMessage(tabs[0].id, {
        type: MSG_VERIFY_SINGLE_IMAGE,
        srcUrl: info.srcUrl,
      });
    } else if (info?.mediaType === 'video' && tabs.length > 0) {
      Logger.info(`Sending message  ${MSG_VERIFY_SINGLE_VIDEO} to content script`, {
        srcUrl: info.srcUrl,
      });
      chrome.tabs.sendMessage(tabs[0].id, {
        type: MSG_VERIFY_SINGLE_VIDEO,
        srcUrl: info.srcUrl,
      });
    } else if (info?.mediaType === 'audio' && tabs.length > 0) {
      Logger.info(`Sending message  ${MSG_VERIFY_SINGLE_AUDIO} to content script`, {
        srcUrl: info.srcUrl,
      });
      chrome.tabs.sendMessage(tabs[0].id, {
        type: MSG_VERIFY_SINGLE_AUDIO,
        srcUrl: info.srcUrl,
      });
    } else if (tabs.length > 0) {
      Logger.info(`Sending message  ${MSG_GET_HTML_COMPONENT} to content script`);
      chrome.tabs.sendMessage(tabs[0].id, { type: MSG_GET_HTML_COMPONENT });      
    }
  }
});

const triggerInjectC2PAIndicator = async () => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.storage.local.get(
      { activated: false, lookForWatermark: false },
      async (result) => {
        const tabUrl = tabs[0]?.url;

        if (result.activated) {
          if (tabs.length > 0) {
            Logger.info(`Sending ${MSG_INJECT_C2PA_INDICATOR} to the active tab`);
            chrome.tabs.sendMessage(tabs[0].id, { type: MSG_INJECT_C2PA_INDICATOR });
          }
        }

        if (WHITELISTED_WM_AUTO_URLS.some((whitelistedUrl) => tabUrl.startsWith(whitelistedUrl))) {
          Logger.info('Tab URL is whitelisted for watermark detection');
          if (tabs.length > 0) {
            if (!result.activated) {
              Logger.info(`Sending ${MSG_INJECT_C2PA_INDICATOR} to the active tab`);
              chrome.tabs.sendMessage(tabs[0].id, { type: MSG_INJECT_C2PA_INDICATOR });
            }
            Logger.info(`Sending ${MSG_ENABLE_LOOK_FOR_WATERMARK} to the active tab`);            
            chrome.tabs.sendMessage(tabs[0].id, { type: MSG_ENABLE_LOOK_FOR_WATERMARK });
          }
        } 
        else if (result.lookForWatermark) {
          Logger.info('Watermark detection is enabled');
          if (tabs.length > 0) {
            Logger.info(`Sending ${MSG_ENABLE_LOOK_FOR_WATERMARK} to the active tab`);
            chrome.tabs.sendMessage(tabs[0].id, { type: MSG_ENABLE_LOOK_FOR_WATERMARK });
          }
        } 
        else {
          Logger.info('Watermark detection is disabled');
          if (tabs.length > 0) {
            Logger.info(`Sending ${MSG_DISABLE_LOOK_FOR_WATERMARK} to the active tab`);
            chrome.tabs.sendMessage(tabs[0].id, { type: MSG_DISABLE_LOOK_FOR_WATERMARK });
          }
        }
      }
    );
  } catch (error) {
    Logger.error('Error while triggering C2PA indicator injection', { error: error.message });
  }
};

// Register to messages coming from the main page
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  Logger.info('Received message from content script', { type: message.type });

  if (message.type === MSG_PAGE_LOADED) {
    await triggerInjectC2PAIndicator();
  } else if (message.type === MSG_DISABLE_RIGHT_CLICK) {
    disableMenuItem('verifyImage');
  } else if (message.type === MSG_ENABLE_RIGHT_CLICK) {
    enableMenuItem('verifyImage');
  }
});

// Initialize the extension offscreen document
const init = async () => {
  if (await chrome.offscreen.hasDocument()) {
    Logger.info('Offscreen document already exists');
    return;
  }

  Logger.info('Creating offscreen document');
  await chrome.offscreen
    .createDocument({
      url: 'offscreen/offscreen.html',
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: 'Private DOM access to parse HTML',
    })
    .catch((error) => {
      Logger.error('Failed to create offscreen document', { error: error.message });
    });
};

init();