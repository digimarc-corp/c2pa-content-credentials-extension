/* eslint-disable no-undef */
// Import libraries and other scripts and start the content script
(async () => {
  const src = chrome.runtime.getURL('content.js');
  const contentScript = await import(src);
  contentScript.main(/* chrome: no need to pass it */);
})();
