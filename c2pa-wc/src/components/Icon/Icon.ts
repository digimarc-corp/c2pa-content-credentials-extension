/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { css, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { defaultStyles } from '../../styles';

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

@customElement('cai-icon')
export class Icon extends LitElement {
  @property({ type: String })
  source = '';

  static readonly matchers = [
    {
      pattern: /photoshop/i,
      icon: html`<cai-icon-photoshop-dm-plugin></cai-icon-photoshop-dm-plugin>`,
    },
    {
      pattern: /adobe\sstock/i,
      icon: html`<cai-icon-adobe-stock-dm-plugin></cai-icon-adobe-stock-dm-plugin>`,
    },
    {
      pattern: /adobe/i,
      icon: html`<cai-icon-adobe-dm-plugin></cai-icon-adobe-dm-plugin>`,
    },
    {
      pattern: /behance\.net/i,
      icon: html`<cai-icon-behance-dm-plugin></cai-icon-behance-dm-plugin>`,
    },
    {
      pattern: /facebook\.com/i,
      icon: html`<cai-icon-facebook-dm-plugin></cai-icon-facebook-dm-plugin>`,
    },
    {
      pattern: /instagram\.com/i,
      icon: html`<cai-icon-instagram-dm-plugin></cai-icon-instagram-dm-plugin>`,
    },
    {
      pattern: /truepic/i,
      icon: html`<cai-icon-truepic-dm-plugin></cai-icon-truepic-dm-plugin>`,
    },
    {
      pattern: /twitter\.com/i,
      icon: html`<cai-icon-twitter-dm-plugin></cai-icon-twitter-dm-plugin>`,
    },
    {
      pattern: /lightroom/i,
      icon: html`<cai-icon-lightroom-dm-plugin></cai-icon-lightroom-dm-plugin>`,
    },
  ];

  @state()
  protected icon: TemplateResult | undefined;

  updated(changedProperties: any) {
    if (changedProperties.has('source')) {
      this.icon = Icon.matchers.find(({ pattern }) =>
        pattern.test(this.source),
      )?.icon;
    }
  }

  static get styles() {
    return [
      defaultStyles,
      css`
        :host {
          max-height: var(--cai-icon-size, 16px);
        }
        #container-dm-plugin {
          display: inline-block;
          width: var(--cai-icon-size, 16px);
          height: var(--cai-icon-size, 16px);
          --cai-icon-width: var(--cai-icon-size, 16px);
          --cai-icon-height: var(--cai-icon-size, 16px);
          margin-right: var(--cai-icon-spacing, 8px);
        }
      `,
    ];
  }

  render() {
    return this.icon
      ? html`<div id="container-dm-plugin">${this.icon}</div>`
      : nothing;
  }
}
