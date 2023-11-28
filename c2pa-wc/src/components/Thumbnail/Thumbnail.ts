/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { nothing } from 'lit-html';
import { defaultStyles } from '../../styles';
import { classPartMap } from '../../utils';

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

export type Badge = 'none' | 'info' | 'missing' | 'alert';

@customElement('cai-thumbnail-dm-plugin')
export class Thumbnail extends LitElement {
  static readonly badgeMap: Record<Badge, TemplateResult | typeof nothing> = {
    none: nothing,
    info: html`<cai-icon-info-dm-plugin
      class="badge-icon-dm-plugin"
    ></cai-icon-info-dm-plugin>`,
    missing: html`<cai-icon-missing-dm-plugin
      class="badge-icon-dm-plugin"
    ></cai-icon-missing-dm-plugin>`,
    alert: html`<cai-icon-alert-dm-plugin
      class="badge-icon-dm-plugin"
    ></cai-icon-alert-dm-plugin>`,
  };

  /**
   * Image source - if set to undefined/null it will show a broken image icon
   */
  @property({ type: String })
  src = undefined;

  /**
   * A badge to show, if desired
   */
  @property({ type: String })
  badge: Badge = 'none';

  /**
   * True if the thumbnail is selected
   */
  @property({ type: Boolean })
  selected = false;

  /**
   * Help text to be displayed when a user hovers over the badge
   */
  @property({
    type: String,
    attribute: 'badge-help-text',
  })
  badgeHelpText = undefined;

  static get styles() {
    return [
      defaultStyles,
      css`
        :host {
          display: inline-block;
          width: var(--cai-thumbnail-size, 72px);
          height: var(--cai-thumbnail-size, 72px);
        }
        .container-dm-plugin {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          border-radius: var(--cai-thumbnail-border-radius, 3px);
          transition: box-shadow 200ms ease-in-out;
          box-shadow: 0 0 0 0 transparent;
        }
        .selected-dm-plugin {
          box-shadow: var(--cai-thumbnail-selected-shadow-offset-x, 0)
            var(--cai-thumbnail-selected-shadow-offset-y, 0)
            var(--cai-thumbnail-selected-shadow-blur, 0)
            var(--cai-thumbnail-selected-shadow-spread, 3px)
            var(--cai-thumbnail-selected-shadow-color, #1473e6);
        }
        cai-tooltip-dm-plugin.badge-tooltip-dm-plugin,
        .badge-no-tooltip-dm-plugin {
          position: absolute;
          top: var(--cai-thumbnail-badge-icon-top, 1px);
          right: var(--cai-thumbnail-badge-icon-right, 1px);
          left: var(--cai-thumbnail-badge-icon-left, auto);
          bottom: var(--cai-thumbnail-badge-icon-bottom, auto);
          width: var(--cai-thumbnail-badge-icon-width, 20px);
          height: var(--cai-thumbnail-badge-icon-height, 20px);
        }
        cai-tooltip-dm-plugin.badge-tooltip-dm-plugin {
          pointer-events: auto;
        }
        .badge-icon-dm-plugin {
          --cai-icon-width: var(--cai-thumbnail-badge-icon-width, 20px);
          --cai-icon-height: var(--cai-thumbnail-badge-icon-height, 20px);
        }
        .included-badge-dm-plugin {
          display: flex;
        }
        .no-image-dm-plugin {
          --cai-icon-width: var(
            --cai-thumbnail-no-image-icon-width,
            var(--cai-icon-width, 20px)
          );
          --cai-icon-width: var(
            --cai-thumbnail-no-image-icon-height,
            var(--cai-icon-height, 20px)
          );
          --cai-icon-fill: var(
            --cai-thumbnail-no-image-icon-fill,
            var(--cai-icon-width, #8e8e8e)
          );
        }
      `,
    ];
  }

  render() {
    const containerClasses = classPartMap({
      'container-dm-plugin': true,
      selected: this.selected,
    });

    return html`<style>
        .container-dm-plugin {
          background: url(${this.src}) var(--cai-thumbnail-bgcolor, #eaeaea);
        }
      </style>
      <div class=${containerClasses}>
        <slot name="badge">
          ${this.badge !== 'none' && this.badgeHelpText
            ? html`<cai-tooltip-dm-plugin class="badge-tooltip-dm-plugin">
                <div slot="content">${this.badgeHelpText}</div>
                <div class="included-badge-dm-plugin" slot="trigger">
                  ${Thumbnail.badgeMap[this.badge]}
                </div>
              </cai-tooltip-dm-plugin>`
            : html`<div class="badge-no-tooltip-dm-plugin">
                ${Thumbnail.badgeMap[this.badge]}
              </div>`}
        </slot>
        ${!this.src
          ? html`<div class="no-image-dm-plugin">
              <cai-icon-broken-image-dm-plugin></cai-icon-broken-image-dm-plugin>
            </div>`
          : nothing}
      </div>`;
  }
}
