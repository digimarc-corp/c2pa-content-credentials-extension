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
} from './config.js';
import debug from './lib/log.js';

function disableMenuItem(id) {
  chrome.contextMenus.update(id, {
    enabled: false,
  }, () => {
    if (chrome.runtime.lastError) {
      debug(`Error: ${chrome.runtime.lastError.message}`);
    }
  });
}

function enableMenuItem(id) {
  chrome.contextMenus.update(id, {
    enabled: true,
  }, () => {
    if (chrome.runtime.lastError) {
      debug(`Error: ${chrome.runtime.lastError.message}`);
    }
  });
}

// Set badge based on whether the extension is enabled or disabled
chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.local.get({ activated: false }, (result) => {
    if (result.activated) {
      debug('[background] Extension is installed and enabled, displaying ON icon');
      chrome.action.setIcon({ path: 'assets/icons/icon-on.png' });
    } else {
      debug('[background] Extension is installed but not enabled, displaying OFF icon');
      chrome.action.setIcon({ path: 'assets/icons/icon-off.png' });
    }
  });
  chrome.contextMenus.create({
    id: 'verifyImage',
    title: 'Verify Content Credentials',
    contexts: ['all'],
  });
});

// Call the function to send message
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === 'verifyImage') {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (info?.mediaType === 'image') {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MSG_VERIFY_SINGLE_IMAGE, srcUrl: info.srcUrl });
      }
    } else if (info?.mediaType === 'video') {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MSG_VERIFY_SINGLE_VIDEO, srcUrl: info.srcUrl });
      }
    } else if (info?.mediaType === 'audio') {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MSG_VERIFY_SINGLE_AUDIO, srcUrl: info.srcUrl });
      }
    } else if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { type: MSG_GET_HTML_COMPONENT });
    }
  }
});

const triggerInjectC2PAIndicator = async () => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.storage.local.get({ activated: false, lookForWatermark: false }, async (result) => {
      const tabUrl = tabs[0]?.url;

      if (result.activated) {
        debug(`[background] Sending ${MSG_INJECT_C2PA_INDICATOR} to the active tab`);
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { type: MSG_INJECT_C2PA_INDICATOR });
        }
      }

      if (WHITELISTED_WM_AUTO_URLS.some((whitelistedUrl) => tabUrl.startsWith(whitelistedUrl))) {
        debug('[background] Whitelisted URL');
        if (tabs.length > 0) {
          if (!result.activated) {
            chrome.tabs.sendMessage(tabs[0].id, { type: MSG_INJECT_C2PA_INDICATOR });
          }
          chrome.tabs.sendMessage(tabs[0].id, { type: MSG_ENABLE_LOOK_FOR_WATERMARK });
        }
      } else if (result.lookForWatermark) {
        debug('[background] Watermark search is enabled');
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { type: MSG_ENABLE_LOOK_FOR_WATERMARK });
        }
      } else {
        debug('[background] Watermark search is disabled');
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { type: MSG_DISABLE_LOOK_FOR_WATERMARK });
        }
      }
    });
  } catch (error) {
    debug(`Error: ${error.message}`);
  }
};


// Register to messages coming from the main page
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  debug(`[background] Receiving ${message.type}`);

  if (message.type === MSG_PAGE_LOADED) {
    await triggerInjectC2PAIndicator();
    sendResponse({ success: true });
  } else if (message.type === MSG_DISABLE_RIGHT_CLICK) {
    disableMenuItem('verifyImage');
    sendResponse({ success: true });
  } else if (message.type === MSG_ENABLE_RIGHT_CLICK) {
    enableMenuItem('verifyImage');
    sendResponse({ success: true });
  }

  return true; // This tells Chrome you will send a response asynchronously
});

const init = async () => {
  if (await chrome.offscreen.hasDocument()) {
    return;
  }
  debug('Creating offscreen...');
  await chrome.offscreen
    .createDocument({
      url: 'offscreen.html',
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: 'Private DOM access to parse HTML',
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.error('Failed to create offscreen document', error);
    });
};

init();
