/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { autoPlacement } from '@floating-ui/dom';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../../../assets/svg/monochrome/help.svg';
import { defaultStyles } from '../../styles';

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

@customElement('cai-tooltip-dm-plugin')
export class Tooltip extends LitElement {
  @state()
  protected _isShown = false;

  @property({ type: Number })
  animationDuration = 200;

  @property({ type: Object })
  autoPlacement: Parameters<typeof autoPlacement>[0] = { padding: 10 };

  @property({ type: Boolean })
  arrow = true;

  static get styles() {
    return [
      defaultStyles,
      css`
        #trigger-dm-plugin {
          display: flex;
          --cai-icon-width: var(--cai-popover-icon-width, 16px);
          --cai-icon-height: var(--cai-popover-icon-height, 16px);
          --cai-icon-fill: var(--cai-popover-icon-fill, #a8a8a8);
          cursor: pointer;
        }
        .content-dm-plugin {
          min-width: 165px;
          max-width: 235px;
          font-size: 13px;
          padding: 10px;
          box-shadow: none;
          border-radius: var(--cai-border-radius);
          background-color: #fff;
          filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.4));
          z-index: 10;
          pointer-events: none;
        }
        .content-dm-plugin.shown {
          opacity: 1;
        }
        .content-dm-plugin.hidden {
          display: none;
        }
      `,
    ];
  }

  render() {
    const contentClassMap = {
      content: true,
      shown: this._isShown,
    };

    return html`
      <cai-popover-dm-plugin
        id="popover-dm-plugin"
        arrow=${this.arrow}
        .autoPlacement=${this.autoPlacement}
        ?interactive=${false}
      >
        <div id="trigger-dm-plugin" slot="trigger">
          <slot name="trigger">
            <cai-icon-help-dm-plugin></cai-icon-help-dm-plugin>
          </slot>
        </div>
        <div class=${classMap(contentClassMap)} slot="content">
          <slot name="content"></slot>
        </div>
      </cai-popover-dm-plugin>
    `;
  }
}
