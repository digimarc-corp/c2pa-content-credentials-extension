import {
  MSG_DISABLE_LOOK_FOR_WATERMARK,
  MSG_ENABLE_LOOK_FOR_WATERMARK,
  MSG_INJECT_C2PA_INDICATOR,
  MSG_REVERT_C2PA_INDICATOR,
  MSG_VERIFY_TRUST_UPDATED,
} from '../config.js';

/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', async () => {
  const automaticToggle = document.getElementById('toggle');
  const watermarkToggle = document.getElementById('toggle-wm');
  const verifyTrustToggle = document.getElementById('toggle-verify-trust');
  const jsonManifestViewToggle = document.getElementById('toggle-json-manifest-view');
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
  chrome.storage.local.get({
    activated: false,
    lookForWatermark: false,
    verifyTrust: true,
    enableJsonManifestView: false,
  }, (result) => {
    automaticToggle.checked = result.activated;
    watermarkToggle.checked = result.lookForWatermark;
    // Toggle semantics: checked means signer trust verification is disabled.
    verifyTrustToggle.checked = !result.verifyTrust;
    jsonManifestViewToggle.checked = result.enableJsonManifestView;
  });

  // Listen for changes in the local storage
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      if (changes.activated) {
        automaticToggle.checked = changes.activated.newValue;
      }
      if (changes.lookForWatermark) {
        watermarkToggle.checked = changes.lookForWatermark.newValue;
      }
      if (changes.verifyTrust) {
        verifyTrustToggle.checked = !changes.verifyTrust.newValue;
      }
      if (changes.enableJsonManifestView) {
        jsonManifestViewToggle.checked = changes.enableJsonManifestView.newValue;
      }
    }
  });

  const disableWatermarkToggle = () => {
    watermarkToggle.checked = false;
    chrome.storage.local.set({ lookForWatermark: false });
    chrome.tabs.sendMessage(tab.id, { type: MSG_DISABLE_LOOK_FOR_WATERMARK });
  };

  const disableAutomaticToggle = () => {
    automaticToggle.checked = false;
    chrome.storage.local.set({ activated: false });

    // Set the OFF icon
    const path = chrome.runtime.getURL('assets/icons/icon-off.png');
    chrome.action.setIcon({ path });

    chrome.tabs.sendMessage(tab.id, { type: MSG_REVERT_C2PA_INDICATOR });
  };

  const enableWatermarkToggle = () => {
    disableAutomaticToggle();
    chrome.tabs.sendMessage(tab.id, { type: MSG_ENABLE_LOOK_FOR_WATERMARK });
  };

  const enableAutomaticToggle = () => {
    // Set the ON icon
    const path = chrome.runtime.getURL('assets/icons/icon-on.png');
    chrome.action.setIcon({ path });

    disableWatermarkToggle();
    chrome.tabs.sendMessage(tab.id, { type: MSG_INJECT_C2PA_INDICATOR });
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

  verifyTrustToggle.addEventListener('change', async () => {
    const verifyTrust = !verifyTrustToggle.checked;
    chrome.storage.local.set({ verifyTrust });
    chrome.runtime.sendMessage({
      type: MSG_VERIFY_TRUST_UPDATED,
      verifyTrust,
    });
  });

  jsonManifestViewToggle.addEventListener('change', async () => {
    chrome.storage.local.set({ enableJsonManifestView: jsonManifestViewToggle.checked });
  });
});

document.getElementById('settings-button').addEventListener('click', () => {
  document.getElementById('settings-menu').classList.toggle('hidden');
});
