# C2PA Content Credentials Browser Extension

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Available-green?logo=googlechrome)](https://chromewebstore.google.com/detail/mjkaocdlpjmphfkjndocehcdhbigaafp?hl=en)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Beta-orange)]
[![C2PA Standard](https://img.shields.io/badge/C2PA-Compliant-brightgreen)](https://c2pa.org/)

Verify the authenticity and provenance of digital media directly in your browser. This Chrome extension validates and displays C2PA Content Credentials for images, videos, and audio files—helping you distinguish authentic content from AI-generated or manipulated media.

## Features

- ✅ **Automatic & Manual Modes** - Scan all media automatically or verify on-demand via right-click
- ✅ **Watermark Detection** - Recover C2PA credentials from Digimarc and Adobe Trustmark watermarks
- ✅ **Broad Media Support** - JPEG, PNG images, MP4 videos, MP3 and WAV audio files
- ✅ **Provenance Display** - View detailed content history, signing information, and trust status
- ✅ **C2PA Compliant** - Built on the official [C2PA-JS Library](https://opensource.contentauthenticity.org/)

---

## Table of Contents

- [Quick Start](#getting-started)
- [Usage](#usage)  
- [Prerequisites](#prerequisites)
- [Development](#building-the-extension-from-the-source)
- [Contributing](#contributions)
- [Known Limitations](#known-limitations)
- [About](#about-digimarc)

---

This repository provides an implementation of a C2PA manifest validator running directly in Chrome as a browser extension. Its purpose is to validate and display Content Credentials for JPEG and PNG images, MP4 videos, and MP3 and WAV audio files that embed a C2PA compliant manifest. Thanks to the validation being done independently of the site a user is surfing on, it should enable users to make better decisions about which media should and shouldn’t be trusted.

This project is built on top of the open source C2PA-JS Library built by the [Content Authenticity Initiative team](https://opensource.contentauthenticity.org/) and we would like to thank them here for their pioneering work. The [full list of libraries](THIRD_PARTY_LICENSES.md) used in this project can be found here.

*Warning:* This is still a beta release and an onging work subject to material changes as the specifications evolve and project matures. A number of issues are known and we welcome feedback by submitting [issues](https://github.com/digimarc-corp/c2pa-content-credentials-extension/issues).

![Animation of extension](docs/c2pa-extension-digimarc.gif)

---

## Prerequisites

- **Chrome 90** or later
- **Node.js** >= 20.9.0 (for development)
- **npm** >= 10.2.2 (for development)

---

## Getting Started

### Chrome Web Store

The extension is available on the [Chrome Web Store](https://chromewebstore.google.com/detail/mjkaocdlpjmphfkjndocehcdhbigaafp?hl=en) and can be installed from there.

### Local installation

1. Download the zip archive of the [latest release](https://github.com/digimarc-corp/c2pa-content-credentials-extension/releases)
2. Unzip the archive
3. Open Chrome and go to `chrome://extensions`.
4. Enable Developer Mode (top right corner).
5. Click on `Load unpacked`.
6. Select the unzipped folder.
7. Try it out! (see Usage below)

## Usage

Once the extension is installed, you have 2 primary ways of verifying and displaying Content Credentials:

#### Manual mode (Default)

In this mode you need to actively seek verification. Right click on an image and select `Verify Content Credentials`. If a C2PA manifest is available the pin icon will appear. Hovering the mouse on the pin will display the content credentials information and its validation status.

#### Automatic mode

In this experimental mode all images are automatically scanned for C2PA manifest in the background. To activate this mode click on the plugin icon on the top right, it will display a popup window.

In the popup menu of the extension, switch the toggle `Scan all media automatically` to `ON`.

When the extension is enabled, you will now see the C2PA pin on top of every image that contains a C2PA manifest in the website loaded in the active tab. Hover the mouse on the pin and the extension will reveal the image provenance information.

#### Watermark Detection

When enabled via the `Enable Watermark detection` toggle in the popup, the extension will attempt to recover C2PA manifests from the watermarks embedded in media, allowing it to display credentials even when they are not embedded directly in the media file.

### Embedded vs Recovered Manifests

The extension can display two types of C2PA manifests:

- **Embedded manifests** - C2PA data stored directly within the media file itself
- **Recovered manifests** - C2PA data recovered by reading a watermark on the image itself and resolving via the corresponding SBR API (Soft Binding Resolution API). The extension currently supports the following watermarking algorithms and signpost:
  - com.digimarc.validate.1 (Digimarc Watermark)
  - com.adobe.trustmark.P and com.adobe.trustmark.Q (Adobe Trustmark)
  - Signpost Trustmark - [Learn more](https://opensource.contentauthenticity.org/docs/trustmark/c2pa/#signpost-watermark)

Both types are displayed in the manifest summary, allowing you to understand the provenance of the content regardless of how the credentials were preserved. You can use any of these trustmark technologies to embed credentials that the extension will recover and display.

#### Testing it

Test the extension on the 2 images below. One of the photo was taken last year and one was modified by AI. Can you guess which one is real? The extension will help you!

![Test image 1](docs/genai-picture-validate-protected.png)

![Test image 2](docs/photo-rddm-validate-protected.jpg)

## Building the extension from the source

You can also check out the code and install the extension locally

1. Clone this repository.
2. Run `npm install`.
3. Copy `src/config-template.js` to `src/config.js` and fill in your local configuration values.
4. Build the extension using one of:
   - `npm run build` - Production build (optimized, minified)
   - `npm run build:dev` - Development build (faster, with source maps)
   - `npm run watch` - Watch mode (automatic rebuilds during development, run in a separate terminal)
5. Open Chrome and go to `chrome://extensions`.
6. Enable Developer Mode (top right corner).
7. Click on `Load unpacked`.
8. Select the `dist` folder.
9. Run `npm run test` to ensure all tests pass before creating a Pull Request.
10. Try it out! (see Usage)

## Known limitations

### Restricted to JPEG and PNG images, MP4 videos and MP3 and WAV audio files

The current version of the extension supports:

- JPG / JPEG and PNG images
- MPEG (MP4) videos
- MP3 and WAV audio files

We are working on adding support for more image, video and audio types.

### Need to override existing C2PA components

To maintain a consistent UI experience, the extension actively removes pre-existing CAI icons from pages before injecting the extension-owned c2pa-ui components.

Here is a list of the components we currently remove when the extension is enabled:

- `c2pa-popover` | `c2pa-indicator` | `c2pa-manifest-summary`

### Image types and method support

Because the extension validates media directly in the browser, access depends on how images are served. For public http(s) URLs, the extension fetches the original source directly — this is preferred as it preserves full file fidelity. For non-public or locally-served sources, it falls back to a `dataURI` representation, which may not work in all cases depending on the type, origin, or CORS policy of the media.

## Contributions

We encourage anyone in the community to contribute to the project, this can be done in different ways:

### Code contributions

Fork the repository and create a new branch for your feature.

We currently use the following versions of Node and NPM:
`npm: >= 10.2.2`
`node: >= 20.9.0`

Follow the instructions in the **"Building the extension from the source"** section above to get your local version ready.

Run `npm run test` to ensure that all tests are passing.

Implement your feature, as necessary, add tests if needed and send a Pull Request

(We recommend that you run the linter first: `npm run lint`)

### Issues

Alternatively, you can create an issue with a bug report or a new feature request in the Github project.

## Versioning

When contributing, make sure to update the version of the library in the `package.json` file.

## Testing

```sh
npm run test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## About Digimarc

This project has been built by the team at Digimarc Labs. [Digimarc](https://www.digimarc.com/products/digital-content-authentication) is a digital watermarking leader committed to building an digital ecosystem of trust protecting content creators and consumers.

## Attributions

This project is built on top of many great open source projects starting with C2PA-JS Library built by the [Content Authenticity Initiative team](https://opensource.contentauthenticity.org/). We would like to thank them here for their pioneering work.
The [full list of libraries and their respective licenses](https://github.com/digimarc-corp/c2pa-content-credentials-extension/blob/main/THIRD_PARTY_LICENSES.md) used in this project can be found here.
