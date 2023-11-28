/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../../assets/svg/color/info.svg';
import { defaultStyles } from '../../styles';

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

type Variant = 'info-light' | 'info-dark' | 'warning' | 'error';

@customElement('cai-indicator-dm-plugin')
export class Indicator extends LitElement {
  /**
   * Image source - if set to undefined/null it will show a broken image icon
   */
  @property({ type: String })
  variant: Variant = 'info-light';

  static get styles() {
    return [
      defaultStyles,
      css`
        :host {
          display: inline-block;
          width: var(--cai-indicator-size, 24px);
          height: var(--cai-indicator-size, 24px);
        }
        .icon {
          --cai-icon-width: var(--cai-indicator-size, 24px);
          --cai-icon-height: var(--cai-indicator-size, 24px);
        }
      `,
    ];
  }

  render() {
    switch (this.variant) {
      case 'warning':
        return html`<cai-icon-missing-dm-plugin class="icon" />`;
      case 'error':
        return html`<cai-icon-alert-dm-plugin class="icon" />`;
    }
    return html`<cai-icon-info-dm-plugin class="icon" />`;
  }
}
