/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { ManifestStore as ToolkitManifestStore, ValidationStatus } from '@contentauth/toolkit';
import { Manifest } from './manifest';
export interface ManifestStore {
    /**
     * Map of all manifests included in the manifest store
     */
    manifests: ManifestMap;
    /**
     * The active manifest in the manifest store
     */
    activeManifest: Manifest;
    /**
     * List of validation errors
     */
    validationStatus: ValidationStatus[];
}
export interface ManifestMap {
    [key: string]: Manifest;
}
/**
 * Creates a facade object with convenience methods over manifest store data returned from the toolkit.
 *
 * @param config C2pa configuration object
 * @param manifestStoreData Manifest store data returned by the toolkit
 */
export declare function createManifestStore(manifestStoreData: ToolkitManifestStore): ManifestStore;
//# sourceMappingURL=manifestStore.d.ts.map