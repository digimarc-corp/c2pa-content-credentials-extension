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
declare global {
    interface HTMLElementTagNameMap {
        'cai-edits-and-activity-dm-plugin': EditsAndActivity;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-edits-and-activity-dm-plugin': any;
        }
    }
}
export interface EditsAndActivityConfig {
    stringMap: Record<string, string>;
    showDescriptions: boolean;
}
declare const EditsAndActivity_base: (new (...args: any[]) => import("../../mixins/configurable").ConfigurableInterface<Record<string, any>>) & (new (...args: any[]) => import("../../mixins/panelSection").PanelSectionInterface<unknown>) & typeof LitElement;
export declare class EditsAndActivity extends EditsAndActivity_base {
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<2 | 1>;
}
export {};
