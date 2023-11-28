/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ConfigurablePanelSection } from '../../mixins/configurablePanelSection';
import { baseSectionStyles, defaultStyles } from '../../styles';
import defaultStringMap from './ContentSummary.str.json';

import '../../../assets/svg/monochrome/generic-info.svg';
import '../Icon';
import '../PanelSection';

declare global {
  interface HTMLElementTagNameMap {
    'cai-content-summary-dm-plugin': ContentSummary;
  }

  namespace JSX {
    interface IntrinsicElements {
      'cai-content-summary-dm-plugin': any;
    }
  }
}

export interface ContentSummaryConfig {
  stringMap: Record<string, string>;
}

const defaultConfig: ContentSummaryConfig = {
  stringMap: defaultStringMap,
};

@customElement('cai-content-summary-dm-plugin')
export class ContentSummary extends ConfigurablePanelSection(LitElement, {
  dataSelector: (manifestStore) => manifestStore?.generativeInfo && manifestStore?.generativeInfo?.length !== 0,
  config: defaultConfig,
}) {
  static get styles() {
    return [
      defaultStyles,
      baseSectionStyles,
      css`
        .section-process-content-dm-plugin {
          display: flex;
          align-items: center;
        }
        .section-icon-content-dm-plugin {
          display: flex;
          align-items: flex-start;
          gap: var(--cai-icon-spacing, 8px);
        }
      `,
    ];
  }

  render() {
    return this.renderSection(html`<cai-panel-section-dm-plugin
      header=${this._config.stringMap['content-summary.header']}
      helpText=${this._config.stringMap['content-summary.helpText']}
    >
      <div class="section-icon-content-dm-plugin">
        <cai-icon-generic-info-dm-plugin></cai-icon-generic-info-dm-plugin>
        <span>
          ${this._config.stringMap['content-summary.content.aiGenerated']}
        </span>
      </div>
    </cai-panel-section-dm-plugin>`);
  }
}
