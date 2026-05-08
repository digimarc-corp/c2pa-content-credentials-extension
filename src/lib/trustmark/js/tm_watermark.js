/*!
 * TrustMark JS Watermarking Decoder Module
 * Copyright 2024 Adobe. All rights reserved.
 * Licensed under the MIT License.
 * 
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying it.
 * 
 * NOTE: This content script version is now a thin wrapper that delegates
 * to an offscreen document for actual inference. This avoids CSP restrictions
 * on sites like GitHub that block content script wasm loading.
 */

/**
 * Runs Trustmark watermark detection via offscreen document
 * @param {string} base64Image - Base64 encoded image or image URL
 * @returns {Promise<object>} Decoded watermark data or error
 */
async function runwmark(base64Image) {
  try {
    // Send message to background, which routes to offscreen
    return await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: 'trustmark:runTrustmark',
          imageUrl: base64Image,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Trustmark message failed:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else if (response?.error) {
            console.error('Trustmark processing error:', response.error);
            resolve({ watermark_present: false, watermark: null, schema: null });
          } else {
            resolve(response || { watermark_present: false });
          }
        }
      );
    });
  } catch (error) {
    console.error('Error calling Trustmark:', error);
    return { watermark_present: false, watermark: null, schema: null };
  }
}

