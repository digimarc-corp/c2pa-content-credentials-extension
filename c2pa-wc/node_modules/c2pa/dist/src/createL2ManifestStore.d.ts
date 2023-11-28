/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { ManifestStore } from './manifestStore';
import { ValidationStatus } from '@contentauth/toolkit';
import { GenerativeInfo } from './selectors/selectGenerativeInfo';
declare module './assertions' {
    interface ExtendedAssertions {
        'adobe.beta': {
            version: string;
        };
    }
}
export declare type ErrorStatus = 'otgp' | 'error' | null;
/**
 * Manifest representation suitable for use with c2pa-wc.
 */
export interface L2ManifestStore {
    ingredients: L2Ingredient[];
    format: string;
    title: string;
    signature: L2Signature | null;
    claimGenerator: L2ClaimGenerator;
    producer: L2Producer | null;
    socialAccounts: L2SocialAccount[] | null;
    thumbnail: string | null;
    editsAndActivity: L2EditsAndActivity[] | null;
    generativeInfo: GenerativeInfo[] | null;
    isBeta: boolean;
    error: ErrorStatus;
    validationStatus: ValidationStatus[];
}
export interface L2Ingredient {
    title: string;
    format: string;
    thumbnail: string | null;
    hasManifest: boolean;
    error: ErrorStatus;
    validationStatus: ValidationStatus[];
}
export interface L2Signature {
    issuer: string | null;
    isoDateString: string | null;
}
export interface L2ClaimGenerator {
    value: string;
    product: string;
}
export interface L2Producer {
    '@type': string;
    name: string;
    identifier: string;
}
export interface L2SocialAccount {
    '@type': string;
    '@id': string | undefined;
    name: string;
    identifier: string;
}
export interface L2EditsAndActivity {
    id: string;
    icon: string | null;
    label: string;
    description: string;
}
export declare type DisposableL2ManifestStore = {
    manifestStore: L2ManifestStore;
    dispose: () => void;
};
/**
 * Creates a manifest store representation suitable for use with c2pa-wc.
 *
 * @param manifestStore - c2pa manifest store object
 */
export declare function createL2ManifestStore(manifestStore: ManifestStore): Promise<DisposableL2ManifestStore>;
//# sourceMappingURL=createL2ManifestStore.d.ts.map