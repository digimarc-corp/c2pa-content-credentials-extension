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
        'cai-produced-with-dm-plugin': ProducedWith;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-produced-with-dm-plugin': any;
        }
    }
}
export interface ProducedWithConfig {
    stringMap: Record<string, string>;
}
declare const ProducedWith_base: (new (...args: any[]) => import("../../mixins/configurable").ConfigurableInterface<Record<string, any>>) & (new (...args: any[]) => import("../../mixins/panelSection").PanelSectionInterface<import("c2pa").L2ClaimGenerator>) & typeof LitElement;
export declare class ProducedWith extends ProducedWith_base {
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<2 | 1>;
}
export {};
