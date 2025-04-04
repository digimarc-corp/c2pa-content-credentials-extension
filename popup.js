import {
  MSG_DISABLE_LOOK_FOR_WATERMARK,
  MSG_ENABLE_LOOK_FOR_WATERMARK,
  MSG_INJECT_C2PA_INDICATOR,
  MSG_REVERT_C2PA_INDICATOR,
} from './config.js';

/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', async () => {
  const automaticToggle = document.getElementById('toggle');
  const watermarkToggle = document.getElementById('toggle-wm');
  const tab = {};

  // Set the version number from the manifest
  document.getElementById('version-number').textContent = chrome.runtime.getManifest().version;

  // Get active tab in the current window
  await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // tabs is an array of tab objects that match the query
    if (tabs.length > 0) {
      // Access the tab ID
      tab.id = tabs[0].id;
    }
  });

  // Load the toggle switch state from storage
  chrome.storage.local.get({ activated: false, lookForWatermark: false }, (result) => {
    automaticToggle.checked = result.activated;
    watermarkToggle.checked = result.lookForWatermark;
  });

  // Listen for changes in the local storage
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.activated && changes.lookForWatermark) {
      automaticToggle.checked = changes.activated.newValue;
      watermarkToggle.checked = changes.lookForWatermark.newValue;
    }
  });

  const disableAutomaticToggle = () => {
    automaticToggle.checked = false;
    chrome.storage.local.set({ activated: false });
    // Set the OFF icon
    chrome.action.setIcon({ path: 'assets/icons/icon-off.png' });
    chrome.tabs.sendMessage(tab.id, { type: MSG_REVERT_C2PA_INDICATOR });
  };

  const enableAutomaticToggle = () => {
    // Set the ON icon
    chrome.action.setIcon({ path: 'assets/icons/icon-on.png' });
    disableWatermarkToggle();
    chrome.tabs.sendMessage(tab.id, { type: MSG_INJECT_C2PA_INDICATOR });
  };

  const disableWatermarkToggle = () => {
    watermarkToggle.checked = false;
    chrome.storage.local.set({ lookForWatermark: false });
    chrome.tabs.sendMessage(tab.id, { type: MSG_DISABLE_LOOK_FOR_WATERMARK });
  };

  const enableWatermarkToggle = () => {
    disableAutomaticToggle();
    chrome.tabs.sendMessage(tab.id, { type: MSG_ENABLE_LOOK_FOR_WATERMARK });
  };

  automaticToggle.addEventListener('change', async () => {
    // Save the toggle switch state to storage
    chrome.storage.local.set({ activated: automaticToggle.checked });

    if (automaticToggle.checked) {
      enableAutomaticToggle();
    } else {
      disableAutomaticToggle();
    }
  });

  watermarkToggle.addEventListener('change', async () => {
    chrome.storage.local.set({ lookForWatermark: watermarkToggle.checked });

    if (watermarkToggle.checked) {
      enableWatermarkToggle();
    } else {
      disableWatermarkToggle();
    }
  });
});

document.getElementById('settings-button').addEventListener('click', () => {
  document.getElementById('settings-menu').classList.toggle('hidden');
});
