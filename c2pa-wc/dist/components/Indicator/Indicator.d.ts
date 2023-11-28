/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { LitElement } from 'lit';
import '../../../assets/svg/color/info.svg';
declare global {
    interface HTMLElementTagNameMap {
        'cai-indicator-dm-plugin': Indicator;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-indicator-dm-plugin': any;
        }
    }
}
declare type Variant = 'info-light' | 'info-dark' | 'warning' | 'error';
export declare class Indicator extends LitElement {
    /**
     * Image source - if set to undefined/null it will show a broken image icon
     */
    variant: Variant;
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1>;
}
export {};
