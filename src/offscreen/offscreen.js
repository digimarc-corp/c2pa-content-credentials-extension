/* eslint-disable consistent-return */
/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
import { createC2pa, isSupportedReaderFormat } from '@contentauth/c2pa-web/inline';

import {
  EVENT_TYPE_C2PA_MANIFEST,
  EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
  API_SBR_ADOBE,
  API_SBR_ADOBE_TOKEN,
  C2PA_VERSION,
  API_SBR_DIGIMARC_RESIZE_PARAM,
  API_SBR_ADOBE_RESIZE_PARAM,
  MSG_GET_VERIFY_TRUST_SETTING,
  MSG_VERIFY_TRUST_UPDATED,
  C2PA_TRUST_ANCHORS_LOCAL_PATH,
  C2PA_ALLOWED_LIST_LOCAL_PATH,
  C2PA_TRUST_CONFIG_LOCAL_PATH,
  C2PA_OFFICIAL_TRUST_ANCHORS_LOCAL_PATH,
  C2PA_OFFICIAL_TSA_TRUST_ANCHORS_LOCAL_PATH,
} from '../config.js';
import {
  convertDataURLtoBlob, isImageAccessible, resizeImageBlob,
} from '../lib/imageUtils.js';
import Logger from '../lib/logger.js';
import TimelineLogger from '../lib/timeline.js';
import { fetchManifestFromSBR } from '../lib/manifestUtils.js';

let c2pa;
let c2paIsLoading = false;
let c2paOfficial;
let c2paOfficialIsLoading = false;
let localTrustAnchorsPem = null;
let localAllowedListPem = null;
let localTrustConfig = null;
let localOfficialTrustAnchorsPem = null;
let verifyTrustSetting = true;
const manifestMap = {};

function getVerifyTrustSetting() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: MSG_GET_VERIFY_TRUST_SETTING }, (response) => {
      if (chrome.runtime.lastError) {
        Logger.warn('Failed to fetch verifyTrust setting, defaulting to true', {
          error: chrome.runtime.lastError.message,
        });
        resolve(true);
        return;
      }

      resolve(response?.verifyTrust ?? true);
    });
  });
}

async function loadLocalAssetText(path) {
  const assetUrl = chrome.runtime.getURL(path);
  const response = await fetch(assetUrl);
  if (!response.ok) {
    throw new Error(`Failed to load local trust asset ${path}: ${response.status}`);
  }
  return response.text();
}

function extractPemCertificates(pemText) {
  if (!pemText || typeof pemText !== 'string') {
    return '';
  }

  const matches = pemText.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g);
  return Array.isArray(matches) ? matches.join('\n') : '';
}

async function loadTrustSettingsFromLocalAssets() {
  if (localTrustAnchorsPem && localAllowedListPem && localTrustConfig && localOfficialTrustAnchorsPem) {
    return {
      trustAnchors: localTrustAnchorsPem,
      allowedList: localAllowedListPem,
      trustConfig: localTrustConfig,
      officialTrustAnchors: localOfficialTrustAnchorsPem,
    };
  }

  const officialTrustBase = extractPemCertificates(
    await loadLocalAssetText(C2PA_OFFICIAL_TRUST_ANCHORS_LOCAL_PATH),
  );
  const officialTrustTsa = extractPemCertificates(
    await loadLocalAssetText(C2PA_OFFICIAL_TSA_TRUST_ANCHORS_LOCAL_PATH),
  );
  localOfficialTrustAnchorsPem = [officialTrustBase, officialTrustTsa].filter(Boolean).join('\n');

  localTrustAnchorsPem = extractPemCertificates(await loadLocalAssetText(C2PA_TRUST_ANCHORS_LOCAL_PATH));
  localAllowedListPem = extractPemCertificates(await loadLocalAssetText(C2PA_ALLOWED_LIST_LOCAL_PATH));
  localTrustConfig = await loadLocalAssetText(C2PA_TRUST_CONFIG_LOCAL_PATH);

  const anchorCount = (localTrustAnchorsPem.match(/-----BEGIN CERTIFICATE-----/g) || []).length;
  const allowedCount = (localAllowedListPem.match(/-----BEGIN CERTIFICATE-----/g) || []).length;
  Logger.info('Loaded local trust settings', {
    trustAnchorsPath: C2PA_TRUST_ANCHORS_LOCAL_PATH,
    trustAnchorsCount: anchorCount,
    allowedListPath: C2PA_ALLOWED_LIST_LOCAL_PATH,
    allowedListCount: allowedCount,
    trustConfigPath: C2PA_TRUST_CONFIG_LOCAL_PATH,
  });

  return {
    trustAnchors: localTrustAnchorsPem,
    allowedList: localAllowedListPem,
    trustConfig: localTrustConfig,
    officialTrustAnchors: localOfficialTrustAnchorsPem,
  };
}

function normalizeReaderFormat(format) {
  if (!format || typeof format !== 'string') {
    return null;
  }

  const normalized = format.trim().toLowerCase().split(';')[0];
  if (normalized === 'image/jpg') {
    return 'image/jpeg';
  }
  return normalized;
}

function formatFromUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase();
  const extension = cleanUrl.split('.').pop();
  const extensionToFormat = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    avif: 'image/avif',
    heic: 'image/heic',
    heif: 'image/heif',
    dng: 'image/dng',
    nef: 'image/x-nikon-nef',
    arw: 'image/x-sony-arw',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/avi',
    wav: 'audio/wav',
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    pdf: 'application/pdf',
    xml: 'application/xml',
    svg: 'image/svg+xml',
    c2pa: 'application/c2pa',
  };

  return extensionToFormat[extension] || null;
}

function resolveReaderFormat(candidates) {
  for (let i = 0; i < candidates.length; i += 1) {
    const normalized = normalizeReaderFormat(candidates[i]);
    if (normalized && isSupportedReaderFormat(normalized)) {
      return normalized;
    }
  }
  return null;
}

async function toBlobInput(asset) {
  if (asset instanceof Blob) {
    return { blob: asset, sourceUrl: null };
  }

  if (typeof asset === 'string') {
    const fetched = await fetch(asset, {
      credentials: 'include',
      headers: {
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });
    return { blob: await fetched.blob(), sourceUrl: asset };
  }

  if (asset?.src && typeof asset.src === 'string') {
    const fetched = await fetch(asset.src, {
      credentials: 'include',
      headers: {
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });
    return { blob: await fetched.blob(), sourceUrl: asset.src };
  }

  return { blob: null, sourceUrl: null };
}

async function readManifestStoreFromBlob(blob, formatCandidates, logContext, c2paInstance = c2pa) {
  const format = resolveReaderFormat(formatCandidates);
  if (!format) {
    Logger.warn('Could not resolve supported reader format', { formatCandidates, logContext });
    return null;
  }

  Logger.debug('Reading manifest with resolved format', { format, logContext });
  const reader = await c2paInstance.reader.fromBlob(format, blob);
  if (!reader) {
    return null;
  }

  const manifestStore = await reader.manifestStore();
  await reader.free();
  return manifestStore;
}

function extractSuccessStatuses(manifestStore) {
  if (Array.isArray(manifestStore?.validation_results?.activeManifest?.success)) {
    return manifestStore.validation_results.activeManifest.success;
  }

  if (Array.isArray(manifestStore?.validation_status)) {
    return manifestStore.validation_status.filter((s) => s.success === true);
  }

  return [];
}

function hasStatusCode(statuses, code) {
  return Array.isArray(statuses) && statuses.some((entry) => entry?.code === code);
}

function isManifestTrusted(manifestStore) {
  if (!manifestStore) {
    return false;
  }

  const state = String(manifestStore.validation_state || '').toLowerCase();
  if (state === 'trusted') {
    return true;
  }

  const successStatuses = extractSuccessStatuses(manifestStore);
  return hasStatusCode(successStatuses, 'signingCredential.trusted');
}

function mapErrorStatus(validationStatus) {
  if (!Array.isArray(validationStatus) || validationStatus.length === 0) {
    return null;
  }

  // Preserve legacy behavior for watermark-only verification.
  const onlyDataHashMismatch = validationStatus.length === 1
    && validationStatus[0]?.code === 'assertion.dataHash.mismatch';
  if (onlyDataHashMismatch) {
    return 'otgp';
  }

  return 'error';
}

function parseGenerator(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  const withoutParens = value.replace(/\([^)]*\)/g, '');

  // Old-style generator string where product and version are separated by spaces.
  if (/\s+\d+\.\d(\.\d)*\s+/.test(withoutParens)) {
    return value.split('(')[0]?.trim() || value;
  }

  // User-Agent-like string: Adobe_Photoshop/23.3.1
  const firstItem = withoutParens.split(/\s+/)?.[0] || '';
  const [product, version] = firstItem.split('/');
  if (!version && !firstItem.includes('/')) {
    return withoutParens.trim() || value;
  }
  const formattedProduct = (product || '').replace(/_/g, ' ');
  if (version) {
    return `${formattedProduct} ${version}`;
  }

  return formattedProduct;
}

function extractClaimGenerator(activeManifest) {
  const rawClaimGenerator = activeManifest?.claim_generator || '';
  const claimGeneratorInfo = Array.isArray(activeManifest?.claim_generator_info)
    ? activeManifest.claim_generator_info
    : [];
  const firstGeneratorInfo = claimGeneratorInfo[0] || null;

  const infoName = firstGeneratorInfo?.name || '';
  const infoVersion = firstGeneratorInfo?.version || '';
  const infoProduct = [infoName, infoVersion].filter(Boolean).join(' ').trim();

  const value = rawClaimGenerator || infoProduct;
  const product = parseGenerator(rawClaimGenerator || infoProduct) || value;

  return {
    value,
    product,
  };
}

function extractProducerAndSocialAccounts(assertions) {
  const result = {
    producer: null,
    socialAccounts: null,
  };

  const creativeWorkAssertion = assertions.find(
    (assertion) => assertion?.label === 'stds.schema-org.CreativeWork'
      || assertion?.label?.includes('schema-org'),
  );
  const author = creativeWorkAssertion?.data?.author;

  if (!author) {
    return result;
  }

  const normalizedAuthors = Array.isArray(author) ? author : [author];

  const producerAuthor = normalizedAuthors.find(
    (item) => item && typeof item === 'object' && !Object.prototype.hasOwnProperty.call(item, '@id'),
  ) || normalizedAuthors[0];

  if (producerAuthor && typeof producerAuthor === 'object') {
    result.producer = {
      '@type': producerAuthor['@type'] || 'Person',
      name: producerAuthor.name || '',
      identifier: producerAuthor.identifier || '',
    };
  }

  const socialAccounts = normalizedAuthors
    .filter((item) => item && typeof item === 'object' && Object.prototype.hasOwnProperty.call(item, '@id'))
    .map((authorItem) => ({
      '@type': authorItem['@type'] || 'Person',
      '@id': authorItem['@id'],
      name: authorItem.name || '',
      identifier: authorItem.identifier || '',
    }))
    .filter((account) => account.name || account.identifier || account['@id']);

  if (socialAccounts.length > 0) {
    result.socialAccounts = socialAccounts;
  }

  return result;
}

function extractGenerativeInfo(assertions) {
  const generativeAssertions = assertions.filter(
    (assertion) => assertion?.label === 'c2pa.actions'
      || assertion?.label === 'c2pa.actions.v2'
      || assertion?.label === 'com.adobe.generative-ai',
  );
  if (generativeAssertions.length === 0) {
    return null;
  }

  const result = [];
  generativeAssertions.forEach((assertion) => {
    if (assertion?.label === 'com.adobe.generative-ai') {
      const description = assertion?.data?.description || '';
      const version = assertion?.data?.version || '';
      const softwareAgent = [description, version].map((value) => value?.trim() || '').join(' ').trim();
      result.push({
        assertion,
        type: 'legacy',
        softwareAgent,
      });
      return;
    }

    const actions = Array.isArray(assertion?.data?.actions) ? assertion.data.actions : [];
    actions.forEach((action) => {
      if (action?.digitalSourceType || action?.softwareAgent) {
        result.push({
          assertion,
          type: action.digitalSourceType
            ? String(action.digitalSourceType).split('/').pop()
            : null,
          softwareAgent: action.softwareAgent || null,
        });
      }
    });
  });

  return result.length > 0 ? result : null;
}

function extractWeb3(assertions) {
  const web3Assertion = assertions.find((assertion) => assertion?.label === 'adobe.crypto.addresses');
  return web3Assertion?.data || null;
}

function extractWatermarkInfo(assertions) {
  const softBindingAssertion = assertions.find((assertion) => assertion?.label === 'c2pa.soft-binding');
  const algorithm = softBindingAssertion?.data?.alg || null;

  const actionAssertions = assertions.filter(
    (assertion) => assertion?.label === 'c2pa.actions'
      || assertion?.label === 'c2pa.actions.v2',
  );

  const watermarkedAction = actionAssertions
    .flatMap((assertion) => (Array.isArray(assertion?.data?.actions) ? assertion.data.actions : []))
    .find((action) => action?.action === 'c2pa.watermarked.bound' || action?.action === 'c2pa.watermarked');

  if (!watermarkedAction) {
    return null;
  }

  return {
    label: 'Watermarked',
    algorithm,
    description: watermarkedAction.description
      || "Applied an invisible watermark to improve this Content Credential's durability",
  };
}

function extractContributors(assertions) {
  const cawgAssertion = assertions.find((assertion) => assertion?.label === 'cawg.metadata');
  const contributors = cawgAssertion?.data?.['dc:contributor'];
  if (!Array.isArray(contributors) || contributors.length === 0) {
    return null;
  }
  return contributors;
}

function extractVerifiedIdentities(assertions) {
  const identityAssertion = assertions.find((assertion) => assertion?.label === 'cawg.identity');
  const verifiedIdentities = identityAssertion?.data?.verifiedIdentities;
  if (!Array.isArray(verifiedIdentities) || verifiedIdentities.length === 0) {
    return null;
  }
  return verifiedIdentities
    .filter((identity) => identity?.type === 'cawg.social_media')
    .map((identity) => ({
      username: identity.username || null,
      uri: identity.uri || null,
      verifiedAt: identity.verifiedAt || null,
      provider: identity.provider || null,
    }))
    .filter((identity) => identity.username || identity.uri);
}

function isAiGeneratedMedia(assertions) {
  const aiDigitalSourceTypes = new Set([
    'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
    'https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
  ]);

  const actionAssertions = assertions.filter(
    (assertion) => assertion?.label === 'c2pa.actions'
      || assertion?.label === 'c2pa.actions.v2',
  );

  return actionAssertions
    .flatMap((assertion) => (Array.isArray(assertion?.data?.actions) ? assertion.data.actions : []))
    .some(
      (action) => action?.action === 'c2pa.created'
        && aiDigitalSourceTypes.has(action?.digitalSourceType),
    );
}

function hasBetaAssertion(assertions) {
  return assertions.some((assertion) => assertion?.label === 'adobe.beta' && assertion?.data?.version);
}

/**
 * Convert c2pa-web ManifestStore (snake_case) to the extension L2ManifestStore
 * consumed by the c2pa-ui components.
 */
async function createL2ManifestStore(manifestStore, metadata = {}) {
  if (!manifestStore || !manifestStore.manifests) {
    return { manifestStore: null };
  }

  const activeLabel = manifestStore.active_manifest;
  const activeManifest = (activeLabel && manifestStore.manifests[activeLabel])
    || Object.values(manifestStore.manifests)[0];

  if (!activeManifest) {
    return { manifestStore: null };
  }

  // New SDK includes passing checks in validation_status (success: true).
  // Only treat entries where success !== true as failures.
  // Prefer the structured validation_results.activeManifest.failure if available.
  let validationStatus = [];
  if (manifestStore.validation_results?.activeManifest?.failure) {
    validationStatus = manifestStore.validation_results.activeManifest.failure;
  } else if (Array.isArray(manifestStore.validation_status)) {
    validationStatus = manifestStore.validation_status.filter((s) => s.success !== true);
  }

  // Temporarily disable transformed-delivery detection until the product logic is revisited.
  const transformedDelivery = false;

  Logger.debug('Filtered failure validation statuses', { validationStatus });

  const assertions = Array.isArray(activeManifest.assertions)
    ? activeManifest.assertions
    : [];

  const { producer, socialAccounts } = extractProducerAndSocialAccounts(assertions);
  const claimGenerator = extractClaimGenerator(activeManifest);
  const watermarkInfo = extractWatermarkInfo(assertions);
  const contributors = extractContributors(assertions);
  const aiGenerated = isAiGeneratedMedia(assertions);
  const verifiedIdentities = extractVerifiedIdentities(assertions);

  const l2ManifestStore = {
    format: activeManifest.format || '',
    title: activeManifest.title || '',
    signature: activeManifest.signature_info
      ? {
        issuer: activeManifest.signature_info?.issuer || null,
        isoDateString: activeManifest.signature_info?.time || null,
      }
      : null,
    claimGenerator,
    producer,
    socialAccounts,
    thumbnail: null,
    generativeInfo: extractGenerativeInfo(assertions),
    web3: extractWeb3(assertions),
    isBeta: hasBetaAssertion(assertions),
    validationState: manifestStore?.validation_state || null,
    trustSource: metadata?.trustSource || null,
    error: mapErrorStatus(validationStatus),
    validationStatus,
    transformedDelivery,
    watermarkLabel: watermarkInfo?.label || null,
    watermarkProvider: watermarkInfo?.algorithm || null,
    watermarkDescription: watermarkInfo?.description || null,
    contributors,
    aiGenerated,
    verifiedIdentities,
  };

  Logger.debug('L2 parity snapshot', {
    activeManifestLabel: activeLabel || activeManifest.label || null,
    outputKeys: Object.keys(l2ManifestStore).sort(),
    summary: {
      title: l2ManifestStore.title,
      format: l2ManifestStore.format,
      hasSignature: Boolean(l2ManifestStore.signature),
      hasProducer: Boolean(l2ManifestStore.producer?.name),
      socialAccountsCount: Array.isArray(l2ManifestStore.socialAccounts)
        ? l2ManifestStore.socialAccounts.length
        : 0,
      generativeInfoCount: Array.isArray(l2ManifestStore.generativeInfo)
        ? l2ManifestStore.generativeInfo.length
        : 0,
      hasWeb3: Boolean(l2ManifestStore.web3),
      isBeta: Boolean(l2ManifestStore.isBeta),
      validationStatusCount: Array.isArray(l2ManifestStore.validationStatus)
        ? l2ManifestStore.validationStatus.length
        : 0,
      error: l2ManifestStore.error,
    },
  });

  Logger.debug('L2 manifest store created for c2pa-ui compatibility', { l2ManifestStore });
  return { manifestStore: l2ManifestStore };
}

/**
 * Generate a verify URL for the manifest
 * In the old SDK this was available, but @contentauth/c2pa-web doesn't provide it
 * For now, construct a reasonable default URL
 */
function generateVerifyUrl(manifestUrl) {
  if (!manifestUrl) {
    Logger.warn('No manifest URL provided to generateVerifyUrl, returning null');
    return null;
  }
  try {
    const verifyUrl = new URL('https://verify.contentauthenticity.org/inspect');
    verifyUrl.searchParams.set('source', manifestUrl);
    Logger.debug('Generated verify URL', { original: manifestUrl, verify: verifyUrl.toString() });
    return verifyUrl.toString();
  } catch (e) {
    Logger.warn('Failed to construct verify URL', { manifestUrl, error: e });
    return null;
  }
}

async function initializeC2pa() {
  if (!c2paIsLoading) {
    Logger.info(`Initializing C2PA Web SDK...${C2PA_VERSION}`);
    const { trustAnchors, allowedList, trustConfig } = await loadTrustSettingsFromLocalAssets();
    verifyTrustSetting = await getVerifyTrustSetting();
    // Using inline WASM export, no manual wasmSrc configuration needed.
    // Trust verification can be toggled from popup settings.
    // Load local bundles that combine C2PA trust list, ITL and Digimarc anchors.
    c2pa = await createC2pa({
      settings: {
        trust: {
          trustAnchors,
          userAnchors: trustAnchors,
          allowedList,
          trustConfig,
        },
        verify: {
          verifyTrust: verifyTrustSetting,
        },
      },
    });
    c2paIsLoading = true;
    Logger.info(`C2PA Web SDK ${C2PA_VERSION} initialized successfully`, {
      verifyTrust: verifyTrustSetting,
    });
  }
}

async function initializeOfficialC2pa() {
  if (!c2paOfficialIsLoading) {
    const { officialTrustAnchors } = await loadTrustSettingsFromLocalAssets();
    verifyTrustSetting = await getVerifyTrustSetting();
    c2paOfficial = await createC2pa({
      settings: {
        trust: {
          trustAnchors: officialTrustAnchors,
          userAnchors: officialTrustAnchors,
        },
        verify: {
          verifyTrust: verifyTrustSetting,
        },
      },
    });
    c2paOfficialIsLoading = true;
  }
}

const validateC2pa = async (image, imageId) => {
  await initializeC2pa();

  if (!image) {
    Logger.warn('Image not available for validation', { imageId });
    return;
  }

  Logger.debug('Reading manifest for the image', { imageId });

  const { blob: imageBlob, sourceUrl } = await toBlobInput(image);
  if (!imageBlob) {
    Logger.warn('Image could not be normalized to blob for validation', { imageId });
    return;
  }

  const manifestStore = await readManifestStoreFromBlob(
    imageBlob,
    [imageBlob.type, formatFromUrl(sourceUrl), 'image/jpeg'],
    { imageId, sourceUrl },
  );

  if (!manifestStore) {
    Logger.warn('No C2PA metadata found in image', { imageId });
    return;
  }

  Logger.info('ManifestStore read from Image successfully', { manifestStore });

  if (!manifestStore) {
    Logger.warn('No manifest store found for the image', { imageId });
    return;
  }

  let trustSource = null;
  if (verifyTrustSetting && isManifestTrusted(manifestStore)) {
    await initializeOfficialC2pa();
    const officialManifestStore = await readManifestStoreFromBlob(
      imageBlob,
      [imageBlob.type, formatFromUrl(sourceUrl), 'image/jpeg'],
      { imageId, sourceUrl, trustSet: 'official' },
      c2paOfficial,
    );
    trustSource = isManifestTrusted(officialManifestStore) ? 'official' : 'interim';
  }

  const { manifestStore: l2ManifestStore } = await createL2ManifestStore(manifestStore, {
    trustSource,
  });
  if (!l2ManifestStore) {
    Logger.warn('Failed to convert ManifestStore to L2 format', { imageId });
    return;
  }

  manifestMap[imageId] = l2ManifestStore;
  Logger.info('ManifestStore converted to L2 format successfully', { imageId });

  return {
    manifest: l2ManifestStore,
    rawManifestStore: manifestStore,
    validationStatus: l2ManifestStore.validationStatus,
  };
};

async function sha256(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  Logger.debug('SHA-256 hash calculated', { hash: hashHex });
  return hashHex;
}

function convertManifest(input) {
  Logger.debug('Converting manifest to internal format', { input });
  const output = {
    manifests: {},
    activeManifest: null,
    validation_state: input?.validation_state || null,
  };

  Object.entries(input.manifests).forEach(([key, manifest]) => {
    const assertions = Array.isArray(manifest.assertions) ? manifest.assertions : [];

    const newManifest = {
      thumbnail: {
        blob: new Blob([], { type: 'image/jpeg' }),
        contentType: 'image/jpeg',
        getUrl: () => URL.createObjectURL(new Blob([])),
        hash: () => sha256(new Blob([])),
      },
      instanceId: manifest.instance_id,
      format: manifest.format,
      ingredients: [],
      claimGenerator: manifest.claim_generator,
      claimGeneratorHints: null,
      claimGeneratorInfo: [],
      assertions: {
        data: assertions,
        get(label) {
          return this.data.filter((assertion) => assertion.label === label);
        },
      },
      parent: null,
      redactions: null,
      label: manifest.label,
      title: manifest.title,
      signatureInfo: {
        cert_serial_number: manifest.signature_info?.cert_serial_number || null,
        time: manifest.signature_info?.time || null,
        issuer: manifest.signature_info?.issuer || null,
      },
      vendor: null,
    };

    output.manifests[key] = newManifest;
  });

  const activeManifestKey = input.active_manifest;
  if (activeManifestKey && output.manifests[activeManifestKey]) {
    output.activeManifest = output.manifests[activeManifestKey];
  }

  Logger.info('Manifest conversion completed', { output });
  return output;
}

const CONTENT_TYPE = {
  JSON: 'application/json',
  JUMBF: 'application/x-c2pa-manifest-store',
};

async function resolveTrustSourceFromBlob(manifestBlob, context = {}) {
  if (!manifestBlob) {
    return null;
  }

  const manifestStore = await readManifestStoreFromBlob(
    manifestBlob,
    [manifestBlob.type, 'application/x-c2pa-manifest-store', 'application/c2pa', 'image/jpeg'],
    context,
  );

  if (!manifestStore || !isManifestTrusted(manifestStore)) {
    return null;
  }

  if (!verifyTrustSetting) {
    return 'interim';
  }

  await initializeOfficialC2pa();
  const officialManifestStore = await readManifestStoreFromBlob(
    manifestBlob,
    [manifestBlob.type, 'application/x-c2pa-manifest-store', 'application/c2pa', 'image/jpeg'],
    { ...context, trustSet: 'official' },
    c2paOfficial,
  );

  return isManifestTrusted(officialManifestStore) ? 'official' : 'interim';
}

const getManifestFromWatermark = async (file, contentType) => {
  const manifestResult = await fetchManifestFromSBR(file, contentType);
  TimelineLogger.addToTimeline('c2pa', 'Fetched manifest from SBR Digimarc');

  if (!manifestResult.success) {
    Logger.warn('Failed to fetch manifest from watermark');
    return { success: false };
  }

  let manifestStore = null;
  let trustSource = null;
  if (contentType === CONTENT_TYPE.JSON) {
    const responseJSON = await manifestResult.manifestData.json();
    manifestStore = convertManifest(responseJSON);
    Logger.info('Manifest store converted from JSON response', { manifestStore });
  } else if (contentType === CONTENT_TYPE.JUMBF) {
    const responseBlob = await manifestResult.manifestData.blob();
    manifestStore = await readManifestStoreFromBlob(
      responseBlob,
      [responseBlob.type, file?.type, 'application/x-c2pa-manifest-store', 'application/c2pa'],
      { source: 'digimarc-watermark' },
    );
    if (!manifestStore) {
      Logger.warn('No C2PA metadata found in JUMBF blob');
      return { success: false };
    }
    trustSource = await resolveTrustSourceFromBlob(responseBlob, { source: 'digimarc-watermark' });
    Logger.info('Manifest store converted from Blob response', { manifestStore });
  }

  TimelineLogger.addToTimeline('c2pa', 'Read manifestStore from JUMBF Blob');

  if (!manifestStore) {
    Logger.warn('Failed to convert manifest from watermark');
    return { success: false };
  }

  const { manifestStore: l2ManifestStore } = await createL2ManifestStore(manifestStore, {
    trustSource,
  });
  TimelineLogger.addToTimeline('c2pa', 'Create c2pa-ui compatible l2ManifestStore');

  // Known limitation: hammingDistance currently mirrors SBR similarityScore.
  return {
    success: true,
    manifest: l2ManifestStore,
    rawManifestStore: manifestStore,
    hammingDistance: manifestResult.similarityScore,
    manifestUrl: manifestResult.manifestUrl,
  };
};

const dataUrlToFile = async (dataUrl, filename) => {
  Logger.debug('Converting data URL to file', { filename });
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = n - 1; i >= 0; i -= 1) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  const blob = new Blob([u8arr], { type: mime });
  let fileBlob = blob;

  if (mime.startsWith('image/')) {
    const resizedImageBlob = await resizeImageBlob(blob, API_SBR_DIGIMARC_RESIZE_PARAM);
    Logger.info('Resized image blob (718)', { from: blob.size, to: resizedImageBlob.size });
    fileBlob = resizedImageBlob;
  } else {
    Logger.info('Skipping image resize for non-image media', { mime, size: blob.size });
  }

  const file = new File([fileBlob], filename, { type: mime });

  Logger.info('Data URL converted to file successfully', { filename });
  return file;
};

const handleC2PAManifestMessage = async (event) => {
  TimelineLogger.startTimeline('c2pa');
  try {
    Logger.info('Processing C2PA manifest message', { imageId: event.data.imageId });

    const response = {
      type: EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
      imageId: event.data.imageId,
      manifest: null,
      validationStatus: null,
      retrievedManifest: null,
      availableWatermarks: event.data.availableWatermarks || null,
      hammingDistance: null,
      viewMoreUrl: null,
    };

    let image = event.data.src;
    const { imageId } = event.data;

    // Check if manifest is already in memory cache
    Logger.info('Looking up C2PA manifest in memory cache', { imageId });
    if (manifestMap[imageId]) {
      Logger.info('C2PA Manifest found in memory cache', { imageId });
      return {
        type: EVENT_TYPE_C2PA_MANIFEST_RESPONSE,
        manifest: manifestMap[imageId],
        imageId,
      };
    }

    Logger.info('C2PA manifest not found in memory cache, starting retrieval process');

    TimelineLogger.addToTimeline('c2pa', 'Look-up in memory cache');

    // Prefer original network bytes from src to keep parity with "Save image as".
    // Only fall back to dataURI for non-http(s) sources where network fetch is not applicable.
    Logger.info('Checking image accessibility', { imageId });
    const isAccessible = await isImageAccessible(event.data.src);
    const isHttpSource = typeof event.data.src === 'string' && /^https?:\/\//i.test(event.data.src);
    if (!isAccessible && event.data.dataURI && !isHttpSource) {
      Logger.info('Using dataURI fallback for non-http source', { imageId, src: event.data.src });
      image = await convertDataURLtoBlob(event.data.dataURI);
    } else if (!isAccessible && event.data.dataURI && isHttpSource) {
      Logger.info('Keeping http(s) src for validation despite accessibility probe failure', {
        imageId,
        src: event.data.src,
      });
    }
    TimelineLogger.addToTimeline('c2pa', 'Check image accessibility');

    // update ViewMore URL for the validation ui component, using the original image URL
    response.viewMoreUrl = generateVerifyUrl(event.data.src);
    Logger.info('ViewMore URL generated', { viewMoreUrl: response.viewMoreUrl });

    // Check if the image has embedded a C2PA manifest
    Logger.debug('Checking C2PA manifest from embedded metadata', { imageId });
    const embeddedC2PAValidation = await validateC2pa(image, imageId);
    if (!embeddedC2PAValidation?.manifest) {
      Logger.info('C2PA Manifest not found. Read from metadata completed', { embeddedC2PAValidation });
    } else {
      response.manifest = embeddedC2PAValidation.manifest;
      response.rawManifestStore = embeddedC2PAValidation.rawManifestStore;
      response.validationStatus = embeddedC2PAValidation.validationStatus;
      Logger.info('C2PA Manifest found from embedded metadata', { embeddedC2PAValidation });
    }
    TimelineLogger.addToTimeline('c2pa', 'Check embedded manifest');

    // Check if watermark detection is enabled
    if (event.data.lookForWm) {
      Logger.info('Watermark detection enabled: Looking up C2PA manifest using watermark', { imageId });
      if (event.data.watermarkType === 'trustmark') {
        Logger.info('Processing trustmark watermark', { imageId: event.data.imageId });

        const imageFetched = await fetch(event.data.src);
        const imageAsBlob = await imageFetched.blob();

        const resizedImageBlob = await resizeImageBlob(imageAsBlob, API_SBR_ADOBE_RESIZE_PARAM);
        Logger.info('Resized image blob', { from: imageAsBlob.size, to: resizedImageBlob.size });

        TimelineLogger.addToTimeline('c2pa', 'Fetched local image for Trustmark');

        // Detect watermark via SBR (two-phase check based on fingerprint)
        const sbrHeaders = new Headers();
        sbrHeaders.append('content-type', 'image/jpeg');
        sbrHeaders.append('x-api-key', API_SBR_ADOBE_TOKEN);

        const fingerPrintAlg = 'com.adobe.icn.dense';
        const hintAlg = event.data.softBinding.alg;
        const hintValue = btoa(event.data.softBinding.blocks[0].value);

        const requestUrl = `${API_SBR_ADOBE}?alg=${fingerPrintAlg}&hintAlg=${hintAlg}&hintValue=${hintValue}`;
        const requestOptions = {
          method: 'POST',
          headers: sbrHeaders,
          body: resizedImageBlob,
          redirect: 'follow',
        };
        const matchByContentResponse = await fetch(requestUrl, requestOptions);

        TimelineLogger.addToTimeline('c2pa', 'Fetched /matchByContent Trustmark');

        if (!matchByContentResponse.ok) {
          Logger.error('Server error during SBR matchByContent', { status: matchByContentResponse });
          throw new Error(`Server error: ${matchByContentResponse.status}`);
        }

        const matchByContentResponseJSON = await matchByContentResponse.json();
        Logger.info('Trustmark SBR matchByContent response', { matchByContentResponseJSON });

        // Fetch manifest from SBR
        const manifestMatch = matchByContentResponseJSON.matches[0];
        if (manifestMatch) {
          // Known limitation: temporary Adobe SBR manifest ID normalization.
          const manifestId = manifestMatch.manifestId.replace(/:/g, '-');
          Logger.info('Manifest match returned by SBR', { manifestId });

          // Manifest retrieval endpoint
          const manifestEndpoint = `${manifestMatch.endpoint}manifests/${manifestId}`;

          // No Accept header will return binary JUMBF data
          const manifestsResponse = await fetch(`${manifestEndpoint}`, {
            method: 'GET',
            redirect: 'follow',
          });

          TimelineLogger.addToTimeline('c2pa', 'Fetched /manifests Trustmark');

          if (!manifestsResponse.ok) {
            Logger.error('Server error during SBR manifest fetch', { status: manifestsResponse });
            throw new Error(`Server error: ${manifestsResponse.status}`);
          }

          // Update ViewMore URL for the validation UI component, preferring recovered manifest URL
          response.viewMoreUrl = generateVerifyUrl(manifestEndpoint) || generateVerifyUrl(event.data.src);
          Logger.info('Update ViewMore URL generated', { viewMoreUrl: response.viewMoreUrl });

          Logger.info('SBR manifest response', { manifestsResponse });
          const responseBlob = await manifestsResponse.blob();
          Logger.info('Manifest blob fetched successfully', { responseBlob });
          const manifestStore = await readManifestStoreFromBlob(
            responseBlob,
            [responseBlob.type, 'application/x-c2pa-manifest-store', 'application/c2pa', 'image/jpeg'],
            { source: 'trustmark-sbr' },
          );
          if (!manifestStore) {
            Logger.warn('No C2PA metadata found in SBR manifest blob');
            throw new Error('Failed to read manifest from SBR');
          }
          Logger.info('SBR returned manifest store', { manifestStore });

          const manifestStoreConversion = manifestStore;
          const trustSource = await resolveTrustSourceFromBlob(responseBlob, { source: 'trustmark-sbr' });
          const { manifestStore: l2ManifestStore } = await createL2ManifestStore(
            manifestStoreConversion,
            { trustSource },
          );

          response.retrievedManifest = l2ManifestStore;
          response.rawRetrievedManifestStore = manifestStore;
          response.watermarkType = 'trustmark';
          // Known limitation: similarity score mapping is a temporary Adobe SBR fallback.
          response.similarityScore = manifestMatch.similarityScore;

          TimelineLogger.addToTimeline('c2pa', 'Created retrieved manifest Trustmark');
        }
      } else if (event.data.watermarkType === 'digimarc') {
        Logger.info('Processing digimarc watermark', { imageId: event.data.imageId });

        const file = await dataUrlToFile(event.data.dataURI, 'filename');
        TimelineLogger.addToTimeline('c2pa', 'Prepared file to read watermark Digimarc');

        const contentType = CONTENT_TYPE.JUMBF;
        const wmResult = await getManifestFromWatermark(file, contentType);
        TimelineLogger.addToTimeline('c2pa', 'Manifest obtained from SBR Digimarc');

        if (wmResult.success) {
          Logger.info('Watermark found in image', { imageId });
          response.retrievedManifest = wmResult.manifest;
          response.rawRetrievedManifestStore = wmResult.rawManifestStore;
          response.watermarkType = 'digimarc';
          response.hammingDistance = wmResult.hammingDistance;

          // Update ViewMore URL for the validation UI component, preferring recovered manifest URL
          response.viewMoreUrl = generateVerifyUrl(wmResult.manifestUrl) || generateVerifyUrl(event.data.src);
          Logger.info('Update ViewMore URL generated', { viewMoreUrl: response.viewMoreUrl });
        }
      } else {
        Logger.warn('Unknown watermark type', { imageId });
        response.error = 'Unknown watermark type';
      }
    }

    Logger.info('C2PA Manifest retrieval processed successfully', { response });
    return response;
  } catch (error) {
    Logger.error('Error processing manifest message', { error });
    return { error: error.message };
  } finally {
    TimelineLogger.closeTimeline('c2pa');
  }
};

// Event manager for messages from the content script
chrome.runtime.onMessage.addListener((event, sender, sendResponse) => {
  if (event?.type === MSG_VERIFY_TRUST_UPDATED) {
    verifyTrustSetting = Boolean(event.verifyTrust);
    c2pa = null;
    c2paIsLoading = false;
    c2paOfficial = null;
    c2paOfficialIsLoading = false;
    Logger.info('Verify trust setting changed; C2PA SDK will reinitialize on next request', {
      verifyTrust: verifyTrustSetting,
    });
    sendResponse({ ok: true });
    return true;
  }

  // Ignore unrelated extension/runtime messages that can appear on refresh/reload.
  if (!event || typeof event !== 'object' || event.type !== EVENT_TYPE_C2PA_MANIFEST) {
    Logger.debug('Ignoring non-C2PA offscreen message', {
      senderId: sender?.id,
      eventType: typeof event === 'object' ? event?.type : typeof event,
    });
    return false;
  }

  if (event.type === EVENT_TYPE_C2PA_MANIFEST) {
    Logger.info('Received C2PA manifest event', { type: event.type });

    handleC2PAManifestMessage(event)
      .then((result) => {
        sendResponse(result); // Send response on success
      })
      .catch((error) => {
        Logger.error('Error handling C2PA manifest message', { error });
        sendResponse({ error: error.message }); // Send response on error
      });
  }

  return true; // Indicate async response
});

initializeC2pa();
