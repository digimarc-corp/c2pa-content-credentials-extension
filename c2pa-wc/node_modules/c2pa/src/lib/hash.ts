/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

/**
 * Calculates the SHA of a buffer or blob using WebCrypto
 */
export async function sha(data: ArrayBuffer | Blob, algorithm = 'SHA-1') {
  const buffer = data instanceof ArrayBuffer ? data : await data.arrayBuffer();
  // deepcode ignore InsecureHash: used for comparison, not security
  const hashBuf = await crypto.subtle.digest(algorithm, buffer);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map((b) => b.toString(16).padStart(2, '0')).join('');
}
