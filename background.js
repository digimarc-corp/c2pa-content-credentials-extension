/* eslint-disable no-undef */

import {
  MSG_INJECT_C2PA_INDICATOR,
  MSG_PAGE_LOADED,
  MSG_SANDBOX_LOADED,
  MSG_VERIFY_SINGLE_IMAGE,
  MSG_GET_HTML_COMPONENT,
} from './config.js';
import debug from './lib/log.js';

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === 'verifyImage') {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (info?.mediaType === 'image') {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MSG_VERIFY_SINGLE_IMAGE, srcUrl: info.srcUrl });
      }
    } else if (tabs.length > 0) {
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
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { type: MSG_INJECT_C2PA_INDICATOR });
    }
  }

  return true;
});
