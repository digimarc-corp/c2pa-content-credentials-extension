/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { ResourceReference, ResourceStore } from '@contentauth/toolkit';
export interface BlobUrlData {
    url: string;
}
export declare type DisposableBlobUrl = BlobUrlData & {
    dispose: () => void;
};
export interface Thumbnail {
    blob?: Blob;
    contentType: string | undefined;
    hash?: () => Promise<string>;
    getUrl: () => DisposableBlobUrl;
}
/**
 * Creates a facade object with convenience methods over thumbnail data returned from the toolkit.
 *
 * @param resourceStore The resource store attached to the ResourceParent
 * @param resourceReference The reference to the resource that provides the thumbnail data
 */
export declare function createThumbnail(resourceStore: ResourceStore, resourceReference: ResourceReference): Thumbnail | null;
export declare function createThumbnailFromBlob(blob: Blob, contentType: string): Thumbnail;
export declare function createThumbnailFromUrl(url: string): Thumbnail;
//# sourceMappingURL=thumbnail.d.ts.map