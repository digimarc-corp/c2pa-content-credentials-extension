/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { LitElement, TemplateResult } from 'lit';
import { nothing } from 'lit-html';
import '../Tooltip';
import '../../../assets/svg/monochrome/broken-image.svg';
import '../../../assets/svg/color/info.svg';
import '../../../assets/svg/color/alert.svg';
import '../../../assets/svg/color/missing.svg';
declare global {
    interface HTMLElementTagNameMap {
        'cai-thumbnail-dm-plugin': Thumbnail;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-thumbnail-dm-plugin': any;
        }
    }
}
export declare type Badge = 'none' | 'info' | 'missing' | 'alert';
export declare class Thumbnail extends LitElement {
    static readonly badgeMap: Record<Badge, TemplateResult | typeof nothing>;
    /**
     * Image source - if set to undefined/null it will show a broken image icon
     */
    src: undefined;
    /**
     * A badge to show, if desired
     */
    badge: Badge;
    /**
     * True if the thumbnail is selected
     */
    selected: boolean;
    /**
     * Help text to be displayed when a user hovers over the badge
     */
    badgeHelpText: undefined;
    static get styles(): import("lit").CSSResult[];
    render(): TemplateResult<1>;
}
