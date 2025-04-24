export const MINIMAL_IMAGE_SIZE_IN_PIXELS = 15000;

export const MAXIMAL_ID_LENGTH = 100;

export const HANDLE_IMG_THRESHOLD = 0.2;

export const REFRESH_ICON_INTERVAL = 20;

export const MIN_DISTANCE_FROM_LEFT_BORDER_IN_PIXELS = 365;

export const POPUP_FADE_ANIMATION_DURATION_IN_MS = 1000;
export const POPUP_DISPLAY_DURATION_IN_MS = 4000;

// not used in inject.js because the script is injected in another way and this is not a module
export const MSG_SANDBOX_LOADED = 'sandbox-loaded';

export const MSG_PAGE_LOADED = 'page-loaded';
export const MSG_INJECT_C2PA_INDICATOR = 'inject-c2pa-indicator';
export const MSG_REVERT_C2PA_INDICATOR = 'revert-c2pa-indicator';
export const MSG_VERIFY_SINGLE_IMAGE = 'verify-single-image';
export const MSG_VERIFY_SINGLE_VIDEO = 'verify-single-video';
export const MSG_VERIFY_SINGLE_AUDIO = 'verify-single-audio';
export const MSG_GET_HTML_COMPONENT = 'get-html-component';
export const MSG_DISABLE_RIGHT_CLICK = 'disable-right-click';
export const MSG_ENABLE_RIGHT_CLICK = 'enable-right-click';
export const MSG_DISABLE_LOOK_FOR_WATERMARK = 'disable-look-for-watermark';
export const MSG_ENABLE_LOOK_FOR_WATERMARK = 'enable-look-for-watermark';

export const EVENT_TYPE_C2PA_MANIFEST = 'c2pa-manifest';
export const EVENT_TYPE_C2PA_MANIFEST_RESPONSE = 'c2pa-manifest-response';

export const WHITELISTED_WM_AUTO_URLS = [
  'non-existing-url',
];

export const C2PA_VERSION = '0.30.4';

//export const API_SBR_DIGIMARC = 'https://c2pa-decoupled-api-zyciyb2wfa-ue.a.run.app';
export const API_SBR_DIGIMARC = 'https://sbr.c2pa.labs.dmrc.app';
export const API_SBR_DIGIMARC_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJEaWdpbWFyYy1DMlBBLUNocm9tZS1FeHRlbnNpb24iLCJqdGkiOiJjYjJlZTRiYS0wMDBlLTQ2MmQtYThiNS1mOTU0YTJlMzM3M2IiLCJpYXQiOjE3NDQyODY5MTgsImlzcyI6IkRpZ2ltYXJjIn0.d2hRntIxUFz-9w6wzpfCDBLgG2DNBppIFtWZUzba7iZmM8Jv1q-PS-iQfbFZ_oRan4Q8LLDHSPvw86Sb8-YdfUIvsRENLDTgbav6lYsRBKskUGtQNseYufOmfaPu3hrrQXQEleNvFWggy-6_S67jp87Y39VZvdx5_SM8h2jyQb4zdn6Fw1VhUVtY1jxI7yGaJInOAaFE-aNlnmRs8Gr2tp9r726wTbZdyj57XU5gfOcJSbX-a3bhK0asoyl9PzsMHC6LQo-pIO3I3Imgo-ietscmG6TGrCf1Tvvj3CDtkdm_KyywdlShh7SygOxMmDBUxYgLUWcsJniJ7avG0cCFqm-pZFeBNBna26qNACSVMh4WEwC4XYqPs3mefloEOLon3CfISi3kdT3djF8F3F-FTJRbdSc3hYCLlj3OwFfpTWZtEJ0WIzLVa0hmqSbNBVKgkCeEMqlLX4biH4CQNVWKSR0VvyUr2RL-2NvMLblGYQbeoZLcr5N6vGH8H0nLDtBF6N1pCQE6chh4-gsb9um7PLSik44oEoVLFt2eyoFxG9-Qh4u-t4sApjqq94kgI25uaqlnj9MVVvaS99Mv8oWKyrP2I3F-yjBIwhTeE8z73kqJIbD205VrNqUD4rbTUmoPh9nBj11-DR6LN8X2vE5fPGcYW5b5lqiutvaij5vvhsE';

export const API_SBR_ADOBE = 'https://cai-msb.adobe.io/sbapi/matches/byContent';
export const API_SBR_ADOBE_TOKEN = 'cai-digimarc';
export const API_SBR_ADOBE_MANIFEST = 'https://cai-manifests.adobe.com/manifests';
