/* eslint-disable no-undef */

// We can't use this const because inject.js is not a module
// import { MSG_SANDBOX_LOADED } from "./config.js";

// Append the sandbox iframe element to the body of the document if it doesn't exist.
if (!document.getElementById('c2pa-sandbox')) {
  const iframe = document.createElement('iframe');

  iframe.id = 'c2pa-sandbox';
  iframe.src = chrome.runtime.getURL(`sandbox.html?id=${iframe.id}`);
  iframe.style.display = 'none';
  iframe.border = 0;

  document.body.appendChild(iframe);
  iframe.addEventListener('load', () => {
    // Wait for iframe to be loaded before sending the event
    chrome.runtime.sendMessage({ type: 'sandbox-loaded', sandboxLoaded: true });
  });
} else {
  // Iframe is already there, trigger loaded event
  chrome.runtime.sendMessage({ type: 'sandbox-loaded', sandboxLoaded: true });
}
