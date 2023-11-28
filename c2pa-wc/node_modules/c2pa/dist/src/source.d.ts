/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { Downloader } from './lib/downloader';
import { Thumbnail } from './thumbnail';
export declare type C2paSourceType = string | Blob | File | HTMLImageElement;
export interface SourceMetadata {
    /**
     * The filename of the original asset, if it exists/can be derived
     */
    filename?: string;
}
export interface Source {
    thumbnail: Thumbnail;
    metadata: SourceMetadata;
    type: string;
    blob: Blob | null;
    arrayBuffer: Blob['arrayBuffer'];
}
/**
 * Creates an object containing data for the image provided to the c2pa object.
 *
 * @param downloader Downloader instance used to inspect/download images from a URL
 * @param input Input provided to the c2pa object
 * @param metadata Any additional metadata for the referenced image
 */
export declare function createSource(downloader: Downloader, input: C2paSourceType, metadata?: SourceMetadata): Promise<Source>;
//# sourceMappingURL=source.d.ts.map