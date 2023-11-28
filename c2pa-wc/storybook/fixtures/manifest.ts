/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

// @ts-ignore
import thumbnailUrl from './manifest-thumbnail.jpg?url';
import { L2ManifestStore } from 'c2pa';

export default {
  ingredients: [
    {
      title: 'CA.jpg',
      format: 'image/jpeg',
      hasManifest: true,
      error: null,
      validationStatus: [],
      thumbnail: thumbnailUrl,
    },
    {
      title: 'CAI.jpg',
      format: 'image/jpeg',
      hasManifest: true,
      error: null,
      validationStatus: [],
      thumbnail: thumbnailUrl,
    },
  ],
  label: 'adobetest:urn:uuid:2a0d39ad-e882-443d-927d-624ba794c459',
  format: 'image/jpeg',
  title: 'CAICAI.jpg',
  signature: {
    issuer: 'Adobe, Inc.',
    isoDateString: '[REPLACE ME]',
  },
  claimGenerator: {
    value: 'C2PA Testing',
    product: 'C2PA Testing',
  },
  producer: {
    '@type': 'Person',
    name: 'Gavin Peacock',
    identifier:
      'did:adobe:f78db44b3d758bbf1ac2b1da23d6a9bc8d4554bbc7ca6f78f5536d6cf813d218e',
    credential: [
      {
        url: 'self#jumbf=/c2pa/adobetest:urn:uuid:2a0d39ad-e882-443d-927d-624ba794c459/c2pa.credentials/did:adobe:f78db44b3d758bbf1ac2b1da23d6a9bc8d4554bbc7ca6f78f5536d6cf813d218e',
        alg: 'sha256',
        hash: new Uint8Array(), // @TODO: probably should drop the credential, at least in serialized format
      },
    ],
  },
  socialAccounts: [
    {
      '@type': 'Person',
      '@id': 'https://www.twitter.com/gvnpeacock',
      name: 'gvnpeacock',
      identifier:
        'https://cai-identity.adobe.io/identities/did:adobe:f78db44b3d758bbf1ac2b1da23d6a9bc8d4554bbc7ca6f78f5536d6cf813d218e?service=VerifiableCredentials',
    },
  ],
  thumbnail: thumbnailUrl,
  editsAndActivity: [
    {
      id: 'COLOR_ADJUSTMENTS',
      icon: 'https://cai-assertions.adobe.com/icons/color-palette-dark.svg',
      label: 'Color adjustments',
      description: 'Changed tone, saturation, etc.',
    },
    {
      id: 'IMPORT',
      icon: 'https://cai-assertions.adobe.com/icons/import-dark.svg',
      label: 'Imported assets',
      description: 'Added images, videos, etc.',
    },
    {
      id: 'TRANSFORM',
      icon: 'https://cai-assertions.adobe.com/icons/group-dark.svg',
      label: 'Size and position adjustments',
      description: 'Changed size, orientation, direction, or position',
    },
  ],
  validationStatus: [],
  error: null,
  isBeta: false,
} as L2ManifestStore;
