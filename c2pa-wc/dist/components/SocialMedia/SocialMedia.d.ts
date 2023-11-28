/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { LitElement } from 'lit';
import '../PanelSection';
import '../Icon';
declare global {
    interface HTMLElementTagNameMap {
        'cai-social-media-dm-plugin': SocialMedia;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-social-media-dm-plugin': any;
        }
    }
}
export interface SocialMediaConfig {
    stringMap: Record<string, string>;
}
declare const SocialMedia_base: (new (...args: any[]) => import("../../mixins/configurable").ConfigurableInterface<Record<string, any>>) & (new (...args: any[]) => import("../../mixins/panelSection").PanelSectionInterface<unknown>) & typeof LitElement;
export declare class SocialMedia extends SocialMedia_base {
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<2 | 1>;
}
export {};
