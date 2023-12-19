/* eslint-disable no-undef */

import { MSG_COMPUTE_DATA_URL, MSG_DO_NOT_COMPUTE_DATA_URL, MSG_INJECT_C2PA_INDICATOR, MSG_PAGE_LOADED, MSG_SANDBOX_LOADED } from './config.js';
import debug from './lib/log.js';

// Set badge based on whether the extension is enabled or disabled
chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.local.get({ activated: false }, (result) => {
    if (result.activated) {
      debug('[background] Extension is installed and enabled, setting badge to ON');
      chrome.action.setBadgeText({ text: 'ON' });
    } else {
      debug('[background] Extension is installed but not enabled, setting badge to OFF');
      chrome.action.setBadgeText({ text: 'OFF' });
    }
  });
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

      // we only inject if the extension is activated
      chrome.storage.local.get({ activated: false }, (result) => {
        if (result.activated) {
          chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            files: ['inject.js'],
          });
        }
      });
    });
  } else if (message.type === MSG_SANDBOX_LOADED) {
    // The sandbox iframe has been loaded and ready to receive messages
    chrome.storage.local.get({ activated: false, computeDataURL: false }, async (result) => {
      if (result.activated) {
        debug(`[background] Sending ${MSG_INJECT_C2PA_INDICATOR} to the active tab`);
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { type: MSG_INJECT_C2PA_INDICATOR });
        }
        if (result.computeDataURL) {
          chrome.tabs.sendMessage(tabs[0].id, { type: MSG_COMPUTE_DATA_URL });
        } else {
          chrome.tabs.sendMessage(tabs[0].id, { type: MSG_DO_NOT_COMPUTE_DATA_URL });
        }
      }
    });
  }

  return true;
});
