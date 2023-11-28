/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { C2paActionsAssertion } from '@contentauth/toolkit';
import { Manifest } from '../manifest';
interface AdobeDictionaryAssertionData {
    url: string;
}
declare module '../assertions' {
    interface ExtendedAssertions {
        'adobe.dictionary': AdobeDictionaryAssertionData;
        'com.adobe.dictionary': AdobeDictionaryAssertionData;
    }
}
export interface TranslatedDictionaryCategory {
    id: string;
    icon: string | null;
    label: string;
    description: string;
}
export declare type IconVariant = 'light' | 'dark';
export interface AdobeDictionary {
    categories: {
        [categoryId: string]: AdobeDictionaryCategory;
    };
    actions: {
        [actionId: string]: AdobeDictionaryAction;
    };
}
export interface AdobeDictionaryCategory {
    icon: string;
    labels: {
        [locale: string]: string;
    };
    descriptions: {
        [locale: string]: string;
    };
}
export interface AdobeDictionaryAction {
    labels: {
        [isoLangCode: string]: string;
    };
    category: string;
}
export interface EditCategory {
    id: string;
    icon: string;
    label: string;
    description: string;
}
/**
 * Gets a list of categorized actions, derived from the provided manifest's `c2pa.action` assertion
 * and a dictionary assertion, if available. If a dictionary is incuded, this function will initiate
 * an HTTP request to fetch the dictionary data.
 *
 * @param manifest - Manifest to derive data from
 * @param locale - BCP-47 locale code (e.g. `en-US`, `fr-FR`) to request localized strings, if available
 * @param iconVariant - Requests icon variant (e.g. `light`, `dark`), if available
 * @returns List of translated action categories
 */
export declare function selectEditsAndActivity(manifest: Manifest, locale?: string, iconVariant?: IconVariant): Promise<TranslatedDictionaryCategory[] | null>;
/**
 * Gets a list of action categories, derived from the provided manifest's `c2pa.action` assertion.
 * This will also handle translations by providing a locale. This works for standard C2PA action assertion
 * data only.
 *
 * @param actionsAssertion - Action assertion data
 * @param locale - BCP-47 locale code (e.g. `en-US`, `fr-FR`) to request localized strings, if available
 * @returns List of translated action categories
 */
export declare function getC2paCategorizedActions(actionsAssertion: C2paActionsAssertion, locale?: string): TranslatedDictionaryCategory[];
export {};
//# sourceMappingURL=selectEditsAndActivity.d.ts.map