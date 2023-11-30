import { MSG_REVERT_C2PA_INDICATOR } from './config.js';

/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', async () => {
  const toggleSwitch = document.getElementById('toggle');
  const tab = {};

  // Get active tab in the current window
  await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // tabs is an array of tab objects that match the query
    if (tabs.length > 0) {
      // Access the tab ID
      tab.id = tabs[0].id;
    }
  });

  // Load the toggle switch state from storage
  chrome.storage.local.get({ activated: false }, (result) => {
    toggleSwitch.checked = result.activated;
  });

  // Listen for changes in the local storage
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.activated) {
      toggleSwitch.checked = changes.activated.newValue;
    }
  });

  toggleSwitch.addEventListener('change', async () => {
    // Save the toggle switch state to storage
    chrome.storage.local.set({ activated: toggleSwitch.checked });

    if (toggleSwitch.checked) {
      // Set the action badge to the next state
      await chrome.action.setBadgeText({ text: 'ON' });

      // Inject iframe in main page to handle C2PA library
      chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
        },
        files: ['inject.js'],
      });
    } else {
      // Set the action badge to OFF
      await chrome.action.setBadgeText({ text: 'OFF' });

      chrome.storage.local.set({ activated: false });

      chrome.tabs.sendMessage(tab.id, { type: MSG_REVERT_C2PA_INDICATOR });
    }
  });
});

document.getElementById('settings-button').addEventListener('click', () => {
  document.getElementById('settings-menu').classList.toggle('hidden');
});
