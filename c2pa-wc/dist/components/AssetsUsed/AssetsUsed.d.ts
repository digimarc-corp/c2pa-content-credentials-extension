/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { LitElement } from 'lit';
import '../Thumbnail';
import '../PanelSection';
declare global {
    interface HTMLElementTagNameMap {
        'cai-assets-used-dm-plugin': AssetsUsed;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-assets-used-dm-plugin': any;
        }
    }
}
export interface AssetsUsedConfig {
    stringMap: Record<string, string>;
}
declare const AssetsUsed_base: (new (...args: any[]) => import("../../mixins/configurable").ConfigurableInterface<Record<string, any>>) & (new (...args: any[]) => import("../../mixins/panelSection").PanelSectionInterface<unknown>) & typeof LitElement;
export declare class AssetsUsed extends AssetsUsed_base {
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<2 | 1>;
}
export {};
