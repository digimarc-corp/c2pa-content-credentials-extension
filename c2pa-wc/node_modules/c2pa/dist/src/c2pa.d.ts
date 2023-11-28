/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { DownloaderOptions } from './lib/downloader';
import { WorkerPoolConfig } from './lib/pool/workerPool';
import { ManifestStore } from './manifestStore';
import { C2paSourceType, Source } from './source';
export interface C2paConfig {
    /**
     * The URL of the WebAssembly binary or a compiled WebAssembly module
     */
    wasmSrc: WebAssembly.Module | string;
    /**
     * The URL of the web worker JavaScript file
     */
    workerSrc: string;
    /**
     * Options for the web worker pool
     * @see {@link https://github.com/josdejong/workerpool#pool}
     */
    poolOptions?: Partial<WorkerPoolConfig>;
    /**
     * Options for the asset downloader
     */
    downloaderOptions?: Partial<DownloaderOptions>;
    /**
     * By default, the SDK will fetch cloud-stored (remote) manifests. Set this to false to disable this behavior.
     */
    fetchRemoteManifests?: boolean;
}
/**
 * Main interface for reading c2pa data contained within an asset.
 */
export interface C2pa {
    /**
     * Processes image data from a `Blob` as input
     * @param blob - The binary data of the image
     */
    read(blob: Blob): Promise<C2paReadResult>;
    /**
     * Processes image data from a `File` as input. Useful for file uploads/drag-and-drop.
     * @param file - The binary data of the image
     */
    read(file: File): Promise<C2paReadResult>;
    /**
     * Processes image data from a URL
     *
     * @remarks
     * Note: The file referenced by the URL must either be have the same
     * {@link https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy | origin}
     * as the site referencing this code, or it needs to have
     * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS | CORS} enabled on the resource.
     *
     * @param url - The URL of the image to process
     */
    read(url: string): Promise<C2paReadResult>;
    /**
     * Processes an image from an HTML image element (`<img />`).
     *
     * @remarks
     * This is useful if you want to process the image returned by a `document.querySelector` call
     *
     * @param element - DOM element of the image to process
     */
    read(element: HTMLImageElement): Promise<C2paReadResult>;
    /**
     * Process an image given a valid input. Supported types:
     * - Blob
     * - File
     * - Image URL
     * - HTML image element (`<img />`)
     *
     * @param input - Image to process
     */
    read(input: C2paSourceType): Promise<C2paReadResult>;
    /**
     * Convenience function to process multiple images at once
     *
     * @param inputs - Array of inputs to pass to `processImage`
     */
    readAll(inputs: C2paSourceType[]): Promise<C2paReadResult[]>;
    /**
     * Disposer function to clean up the underlying worker pool and any other disposable resources
     */
    dispose: () => void;
}
export interface C2paReadResult {
    /**
     * Manifest store containing all c2pa metadata associated with the image
     */
    manifestStore: ManifestStore | null;
    /**
     * Source asset provided to `c2pa.read()`
     */
    source: Source;
}
/**
 * Creates a c2pa object that can be used to read c2pa metadata from an image.
 *
 * @param config - Configuration options for the created c2pa object
 */
export declare function createC2pa(config: C2paConfig): Promise<C2pa>;
/**
 * Generates a URL that pre-loads the `assetUrl` into the Content Authenticity Verify site
 * for deeper inspection by users.
 *
 * @param assetUrl - The URL of the asset you want to view in Verify
 */
export declare function generateVerifyUrl(assetUrl: string): string;
//# sourceMappingURL=c2pa.d.ts.map