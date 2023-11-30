import { EVENT_TYPE_C2PA_MANIFEST } from '../config.js';

/**
 * Send a message to the sandbox to get the C2PA manifest for the image.
 * @param {HTMLImageElement} imageElement - The image element to get the C2PA manifest for.
 */
export const getC2PAManifest = (imageElement) => {
  // Get the sandbox iframe by id
  const c2paSandbox = document.getElementById('c2pa-sandbox');

  const event = {};
  event.type = EVENT_TYPE_C2PA_MANIFEST;
  event.data = {
    src: imageElement.src,
    dataURI: imageElement.dataURI,
    imageId: imageElement.id,
  };

  const window = c2paSandbox.contentWindow;

  // Send the event object to the sandbox. This communication needs to be done via postMessage.
  // The "*" parameter indicates that the message should be sent to any domain.
  window.postMessage(event, '*');
};
