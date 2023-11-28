/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { autoPlacement, flip, offset, Placement, shift, Strategy } from '@floating-ui/dom';
import { LitElement, PropertyValueMap } from 'lit';
import '../../../assets/svg/monochrome/help.svg';
declare global {
    interface HTMLElementTagNameMap {
        'cai-popover-dm-plugin': Popover;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-popover-dm-plugin': any;
        }
    }
}
export declare class Popover extends LitElement {
    private _updateCleanupFn;
    private _eventCleanupFns;
    private positionConfig;
    protected _isShown: boolean;
    animationDuration: number;
    placement: Placement;
    strategy: Strategy;
    arrow: boolean;
    flip: Parameters<typeof flip>[0];
    autoPlacement: Parameters<typeof autoPlacement>[0];
    offset: Parameters<typeof offset>[0];
    shift: Parameters<typeof shift>[0];
    inline: boolean;
    interactive: boolean;
    trigger: string;
    zIndex: number;
    arrowElement: HTMLElement | undefined;
    contentElement: HTMLElement | undefined;
    hostElement: HTMLElement | undefined;
    triggerElement: HTMLElement | undefined;
    protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    static get styles(): import("lit").CSSResult[];
    private _showTooltip;
    private _hideTooltip;
    private _cleanupTriggers;
    private _setTriggers;
    private _updatePosition;
    private computeArrowStyle;
    firstUpdated(): void;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
