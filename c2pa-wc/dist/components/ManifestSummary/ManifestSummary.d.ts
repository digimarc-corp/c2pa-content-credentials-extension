/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { LitElement } from 'lit';
import { L2ManifestStore } from 'c2pa';
import type { EditsAndActivityConfig } from '../EditsAndActivity';
import type { MinimumViableProvenanceConfig } from '../MinimumViableProvenance';
import '../ContentSummary';
import '../AssetsUsed';
import '../ProducedBy';
import '../ProducedWith';
import '../SocialMedia';
import '../EditsAndActivity';
import '../MinimumViableProvenance';
declare global {
    interface HTMLElementTagNameMap {
        'cai-manifest-summary-dm-plugin': ManifestSummary;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-manifest-summary-dm-plugin': any;
        }
    }
}
export interface ManifestSummaryConfig extends Pick<MinimumViableProvenanceConfig, 'dateFormatter'>, Pick<EditsAndActivityConfig, 'showDescriptions'> {
    stringMap: Record<string, string>;
    sections?: {
        assetsUsed?: boolean;
        editsAndActivity?: boolean;
        producedBy?: boolean;
        producedWith?: boolean;
        socialMedia?: boolean;
        contentSummary?: boolean;
    };
}
declare const ManifestSummary_base: (new (...args: any[]) => import("../../mixins/configurable").ConfigurableInterface<ManifestSummaryConfig>) & typeof LitElement;
export declare class ManifestSummary extends ManifestSummary_base {
    static readonly cssParts: {
        viewMore: string;
    };
    static get styles(): import("lit").CSSResult[];
    manifestStore: L2ManifestStore | undefined;
    viewMoreUrl: string;
    render(): import("lit-html").TemplateResult<1> | null;
}
export {};
