/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import defaultStringMap from '../SocialMedia/SocialMedia.str.json';
import { baseSectionStyles, defaultStyles } from '../../styles';
import { ConfigurablePanelSection } from '../../mixins/configurablePanelSection';

import '../PanelSection';
import '../Icon';

declare global {
  interface HTMLElementTagNameMap {
    'cai-social-media-dm-plugin': SocialMedia;
  }

  namespace JSX {
    interface IntrinsicElements {
      'cai-social-media-dm-plugin': any;
    }
  }
}

export interface SocialMediaConfig {
  stringMap: Record<string, string>;
}

const defaultConfig: SocialMediaConfig = {
  stringMap: defaultStringMap,
};

@customElement('cai-social-media-dm-plugin')
export class SocialMedia extends ConfigurablePanelSection(LitElement, {
  dataSelector: (manifestStore) => manifestStore?.socialAccounts,
  isEmpty: (data) => !data?.length,
  config: defaultConfig,
}) {
  static get styles() {
    return [
      defaultStyles,
      baseSectionStyles,
      css`
        .section-social-media-list-dm-plugin {
          display: flex;
          flex-direction: column;
          gap: 6px;
          list-style: none;
          padding: 0;
          margin: 0;
          overflow: hidden;
        }

        .section-social-media-list-item-dm-plugin {
          display: flex;
          align-items: center;
        }

        .section-social-media-list-item-link-dm-plugin {
          color: var(--cai-social-media-item-color, var(--cai-primary-color));
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `,
    ];
  }

  render() {
    return this.renderSection(html`<cai-panel-section-dm-plugin
      header=${this._config.stringMap['social-media.header']}
      helpText=${this._config.stringMap['social-media.helpText']}
    >
      <ul class="section-social-media-list-dm-plugin">
        ${this._data?.map(
          (socialAccount) => html`
            <li class="section-social-media-list-item-dm-plugin">
              <cai-icon-dm-plugin
                source="${socialAccount['@id']}"
              ></cai-icon-dm-plugin>
              <a
                class="section-social-media-list-item-link-dm-plugin"
                href=${socialAccount['@id']}
                target="_blank"
              >
                @${socialAccount.name}
              </a>
            </li>
          `,
        )}
      </ul>
    </cai-panel-section-dm-plugin>`);
  }
}
