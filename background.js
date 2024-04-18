/* eslint-disable no-undef */

import {
  MSG_INJECT_C2PA_INDICATOR,
  MSG_PAGE_LOADED,
  MSG_SANDBOX_LOADED,
  MSG_VERIFY_SINGLE_IMAGE,
  MSG_GET_HTML_COMPONENT,
  MSG_DISABLE_RIGHT_CLICK,
  MSG_ENABLE_RIGHT_CLICK,
  MSG_VERIFY_SINGLE_VIDEO,
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
      chrome.action.setIcon({ path: './images/icons/icon-on.png' });
    } else {
      debug('[background] Extension is installed but not enabled, displaying OFF icon');
      chrome.action.setIcon({ path: './images/icons/icon-off.png' });
    }
  });
  chrome.contextMenus.create({
    id: 'verifyImage',
    title: 'Verify Content Credentials',
    contexts: ['all'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === 'verifyImage') {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (info?.mediaType === 'image') {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MSG_VERIFY_SINGLE_IMAGE, srcUrl: info.srcUrl });
      }
    } else if (info?.mediaType === 'video'){
      console.log(info.srcUrl)
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MSG_VERIFY_SINGLE_VIDEO, srcUrl: info.srcUrl });
      }
    } 
    else if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { type: MSG_GET_HTML_COMPONENT });
    }
  }
});

// Register to messages coming from the main page
chrome.runtime.onMessage.addListener(async (message) => {
  debug(`[background] Receiving ${message.type}`);

  if (message.type === MSG_PAGE_LOADED) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        return;
      }
      const currentTabId = tabs[0].id;

      chrome.scripting.executeScript({
        target: { tabId: currentTabId },
        files: ['inject.js'],
      });
    });
  } else if (message.type === MSG_SANDBOX_LOADED) {
    // The sandbox iframe has been loaded and ready to receive messages
    chrome.storage.local.get({ activated: false }, async (result) => {
      if (result.activated) {
        debug(`[background] Sending ${MSG_INJECT_C2PA_INDICATOR} to the active tab`);
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { type: MSG_INJECT_C2PA_INDICATOR });
        }
      }
    });
  } else if (message.type === MSG_DISABLE_RIGHT_CLICK) {
    disableMenuItem('verifyImage');
  } else if (message.type === MSG_ENABLE_RIGHT_CLICK) {
    enableMenuItem('verifyImage');
  }

  return true;
});
