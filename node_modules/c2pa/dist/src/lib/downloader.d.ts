/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { SdkWorkerPool } from './poolWrapper';
export interface DownloaderOptions {
    /**
     * The number of bytes at the start of the image to check for C2PA metadata
     * before downloading the whole image (defaults to 64k)
     */
    inspectSize: number;
}
export interface IFetchOptions {
    /**
     * The range byte to start from (defaults to 0)
     */
    rangeStart: number;
    /**
     * The range byte to end at (defaults to end of content)
     */
    rangeEnd: number | undefined;
    /**
     * Options passed to the browser's `fetch` method
     */
    fetchConfig: RequestInit;
}
/**
 * Handles downloading of any assets
 *
 * @public
 */
export declare class Downloader {
    #private;
    constructor(pool: SdkWorkerPool, opts?: Partial<DownloaderOptions>);
    /**
     * Wrapper around `fetch` to download an asset
     *
     * @remarks
     * This has convenience logic for range requests
     *
     * @param url - The URL to fetch
     * @param fetchOptions - Options for this particular request
     */
    static download(url: string, fetchOptions?: Partial<IFetchOptions>): Promise<Response>;
    /**
     * This allows us to inspect the image to see if the header contains C2PA data
     *
     * @remarks
     * We will request a download to the server requesting the first `inspectSize` bytes. From there:
     * - if the server responds with a payload less than the content-length, we will inspect that chunk and
     *   download the rest if the content-type matches and that chunk contains metadata
     * - if it responds with a payload equal to or greater than the content-length, we will inspect that the
     *   content type matches, scan the chunk, and return the data
     * - we'll return `null` if the content-type is invalid or if CAI data does not exist
     *
     * @param url - The URL to fetch
     */
    inspect(url: string): Promise<Blob | null>;
    /**
     * Fetches a JSON payload and caches it, using the requested URL as the key
     *
     * @param url - The URL to fetch and cache
     */
    static cachedGetJson<T = any>(url: string): Promise<T>;
}
//# sourceMappingURL=downloader.d.ts.map