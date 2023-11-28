/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import type { ActionV1, Assertion, ManifestAssertion } from '@contentauth/toolkit';
import type { Manifest } from '../manifest';
export declare type LegacyAssertion = Assertion<'com.adobe.generative-ai', {
    description: string;
    version: string;
    prompt?: string;
}>;
export declare type GenAiAssertion = ManifestAssertion | LegacyAssertion;
export interface GenerativeInfo {
    assertion: GenAiAssertion;
    action?: ActionV1;
    type: 'legacy' | 'trainedAlgorithmicMedia' | 'compositeWithTrainedAlgorithmicMedia';
    softwareAgent: string;
}
/**
 * Gets any generative AI information from the manifest.
 *
 * @param manifest - Manifest to derive data from
 */
export declare function selectGenerativeInfo(manifest: Manifest): GenerativeInfo[] | null;
//# sourceMappingURL=selectGenerativeInfo.d.ts.map