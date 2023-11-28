/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { L2ManifestStore } from 'c2pa';
import { isValid, parseISO } from 'date-fns';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import defaultStringMap from './MinimumViableProvenance.str.json';
import { defaultDateFormatter } from '../../utils';
import { Configurable } from '../../mixins/configurable';
import { baseSectionStyles, defaultStyles } from '../../styles';
import { getBadgeFromManifestStore } from '../../badge';
import { classMap } from 'lit-html/directives/class-map.js';

import '../PanelSection';

declare global {
  interface HTMLElementTagNameMap {
    'cai-minimum-viable-provenance-dm-plugin': MinimumViableProvenance;
  }

  namespace JSX {
    interface IntrinsicElements {
      'cai-minimum-viable-provenance-dm-plugin': any;
    }
  }
}

export interface MinimumViableProvenanceConfig {
  stringMap: Record<string, string>;
  dateFormatter: (date: Date) => string;
}

const defaultConfig: MinimumViableProvenanceConfig = {
  stringMap: defaultStringMap,
  dateFormatter: defaultDateFormatter,
};

@customElement('cai-minimum-viable-provenance-dm-plugin')
export class MinimumViableProvenance extends Configurable(
  LitElement,
  defaultConfig,
) {
  @property({
    type: Object,
  })
  manifestStore: L2ManifestStore | undefined;

  static get styles() {
    return [
      defaultStyles,
      baseSectionStyles,
      css`
      .minimum-viable-provenance-content-dm-plugin {
        --cai-thumbnail-size: 48px;
        display: grid;
        grid-template-columns: 48px auto;
        grid-gap: 2px 10px;
        text-align: left;
      }
      .minimum-viable-provenance-thumbnail-dm-plugin {
        grid-column: 1;
        grid-row: 1 / 3;
      }
      .minimum-viable-provenance-signer-dm-plugin {
        grid-column: 2;
        grid-row: 1;
        align-self: flex-end;
        display: grid;
        grid-template-columns: min-content max-content;
        align-items: center;
      }
      .minimum-viable-provenance-signer-dm-plugin.no-date {
        grid-row: span 2;
        height: 100%;
      }
      .minimum-viable-provenance-date-dm-plugin {
        grid-column: 2;
        grid-row: 2;
        color: var(--cai-secondary-color, #6e6e6e);
      `,
    ];
  }

  render() {
    const hasError = this.manifestStore?.error === 'error';

    const mvpClasses = {
      'minimum-viable-provenance-signer-dm-plugin': true,
      'no-date': hasError,
    };

    const signatureDate = this.manifestStore?.signature?.isoDateString
      ? parseISO(this.manifestStore?.signature.isoDateString)
      : undefined;

    return html` <cai-panel-section-dm-plugin
      header=${this._config.stringMap['minimum-viable-provenance.header']}
      helpText=${this._config.stringMap['minimum-viable-provenance.helpText']}
    >
      <div class="minimum-viable-provenance-content-dm-plugin">
        <cai-thumbnail-dm-plugin
          class="minimum-viable-provenance-thumbnail-dm-plugin"
          src=${this.manifestStore?.thumbnail}
        ></cai-thumbnail-dm-plugin>
        <div class=${classMap(mvpClasses)}>
          <cai-icon-dm-plugin
            slot="icon"
            source=${this.manifestStore?.signature?.issuer}
          ></cai-icon-dm-plugin>
          <span> ${this.manifestStore?.signature?.issuer} </span>
        </div>
        ${!hasError
          ? html`
              <div class="minimum-viable-provenance-date-dm-plugin">
                ${isValid(signatureDate)
                  ? html`${this._config?.dateFormatter(signatureDate!)}`
                  : html`${this._config?.stringMap[
                      'minimum-viable-provenance.invalidDate'
                    ]}`}
              </div>
            `
          : nothing}
      </div>
    </cai-panel-section-dm-plugin>`;
  }
}
