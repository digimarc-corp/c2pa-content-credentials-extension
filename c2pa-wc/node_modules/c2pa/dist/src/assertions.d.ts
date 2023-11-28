/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { Assertion, ManifestAssertion } from '@contentauth/toolkit';
export interface ExtendedAssertions {
}
declare type MappedExtendedAssertions = {
    [Label in keyof ExtendedAssertions]: Assertion<Label, ExtendedAssertions[Label]>;
};
declare type AllAssertions = MappedExtendedAssertions[keyof MappedExtendedAssertions] | ManifestAssertion;
export interface AssertionAccessor {
    /**
     * Raw assertion data as returned by the WASM binary
     */
    data: Assertion[];
    /**
     * Convenience method that returns an array of all assertions matching a given label, sorted by their index value
     * @param label - The assertion label to filter by, without an index (e.g. c2pa.actions, *not* c2pa.actions__1)
     */
    get: <T extends AllAssertions['label']>(label: T) => (Extract<AllAssertions, {
        label: T;
    }> | undefined)[];
}
/**
 * Creates a facade object with convenience methods over assertion data returned from the toolkit.
 *
 * @param assertionData Raw assertion data returned by the toolkit
 */
export declare function createAssertionAccessor(assertionData: Assertion[]): AssertionAccessor;
export {};
//# sourceMappingURL=assertions.d.ts.map