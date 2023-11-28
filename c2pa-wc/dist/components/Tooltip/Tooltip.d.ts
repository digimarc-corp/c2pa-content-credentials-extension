/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { autoPlacement } from '@floating-ui/dom';
import { LitElement } from 'lit';
import '../../../assets/svg/monochrome/help.svg';
import '../Icon';
import '../Popover';
declare global {
    interface HTMLElementTagNameMap {
        'cai-tooltip-dm-plugin': Tooltip;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-tooltip-dm-plugin': any;
        }
    }
}
export declare class Tooltip extends LitElement {
    protected _isShown: boolean;
    animationDuration: number;
    autoPlacement: Parameters<typeof autoPlacement>[0];
    arrow: boolean;
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1>;
}
