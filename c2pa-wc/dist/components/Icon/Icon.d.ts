/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { LitElement, nothing, TemplateResult } from 'lit';
import '../../../assets/svg/color/logos/adobe-stock.svg';
import '../../../assets/svg/color/logos/adobe.svg';
import '../../../assets/svg/color/logos/behance.svg';
import '../../../assets/svg/color/logos/cai.svg';
import '../../../assets/svg/color/logos/facebook.svg';
import '../../../assets/svg/color/logos/instagram.svg';
import '../../../assets/svg/color/logos/lightroom.svg';
import '../../../assets/svg/color/logos/photoshop.svg';
import '../../../assets/svg/color/logos/truepic.svg';
import '../../../assets/svg/color/logos/twitter.svg';
declare global {
    interface HTMLElementTagNameMap {
        'cai-icon': Icon;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-icon': any;
        }
    }
}
export declare class Icon extends LitElement {
    source: string;
    static readonly matchers: {
        pattern: RegExp;
        icon: TemplateResult<1>;
    }[];
    protected icon: TemplateResult | undefined;
    updated(changedProperties: any): void;
    static get styles(): import("lit").CSSResult[];
    render(): TemplateResult<1> | typeof nothing;
}
