/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { LitElement } from 'lit';
import '../Tooltip';
declare global {
    interface HTMLElementTagNameMap {
        'cai-panel-section-dm-plugin': PanelSection;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-panel-section-dm-plugin': any;
        }
    }
}
export declare class PanelSection extends LitElement {
    header: string;
    helpText: string | null;
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1>;
}
