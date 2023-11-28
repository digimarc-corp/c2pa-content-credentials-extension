/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { L2ManifestStore } from 'c2pa';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import defaultStringMap from './EditsAndActivity.str.json';
import { baseSectionStyles, defaultStyles } from '../../styles';
import { ConfigurablePanelSection } from '../../mixins/configurablePanelSection';

import '../PanelSection';

declare global {
  interface HTMLElementTagNameMap {
    'cai-edits-and-activity-dm-plugin': EditsAndActivity;
  }

  namespace JSX {
    interface IntrinsicElements {
      'cai-edits-and-activity-dm-plugin': any;
    }
  }
}

export interface EditsAndActivityConfig {
  stringMap: Record<string, string>;
  showDescriptions: boolean;
}

const defaultConfig: EditsAndActivityConfig = {
  stringMap: defaultStringMap,
  showDescriptions: false,
};

@customElement('cai-edits-and-activity-dm-plugin')
export class EditsAndActivity extends ConfigurablePanelSection(LitElement, {
  dataSelector: (manifestStore) => manifestStore.editsAndActivity,
  isEmpty: (data) => !data?.length,
  config: defaultConfig,
}) {
  static get styles() {
    return [
      defaultStyles,
      baseSectionStyles,
      css`
        .section-edits-and-activity-content-dm-plugin {
          display: flex;
          flex-direction: column;
        }

        .section-edits-and-activity-list-dm-plugin {
          display: flex;
          flex-direction: column;
          gap: var(--cai-edits-and-activity-item-spacing, 6px);
          list-style: none;
          padding: 0;
          margin: 0;
          overflow: hidden;
        }

        .section-edits-and-activity-list-item-term-dm-plugin {
          display: flex;
          align-items: center;
        }

        .section-edits-and-activity-list-item-icon-dm-plugin {
          margin-right: 8px;
          width: 16px;
        }

        .section-edits-and-activity-list-item-label-dm-plugin {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .section-edits-and-activity-list-item-description-dm-plugin {
          color: var(--cai-secondary-color);
          margin-left: 0px;
        }

        .section-edits-and-activity-list-item-description-dm-plugin.has-icon {
          margin-left: 24px;
        }
      `,
    ];
  }

  render() {
    return this.renderSection(html`
      <cai-panel-section-dm-plugin
        header=${this._config.stringMap['edits-and-activity.header']}
        helpText=${this._config.stringMap['edits-and-activity.helpText']}
      >
        <dl class="section-edits-and-activity-list-dm-plugin">
          ${this._data?.map(
            ({ icon, label, description }) => html`
              <div class="section-edits-and-activity-list-item-dm-plugin">
                <dt class="section-edits-and-activity-list-item-term-dm-plugin">
                  ${icon
                    ? html`<img
                        class="section-edits-and-activity-list-item-icon-dm-plugin"
                        src=${icon}
                        alt=${label}
                      />`
                    : null}
                  <span
                    class="section-edits-and-activity-list-item-label-dm-plugin"
                  >
                    ${label}
                  </span>
                </dt>
                ${this._config.showDescriptions
                  ? html`
                      <dd
                        class=${classMap({
                          'section-edits-and-activity-list-item-description-dm-plugin':
                            true,
                          'has-icon': !!icon,
                        })}
                      >
                        ${description}
                      </dd>
                    `
                  : null}
              </div>
            `,
          )}
        </dl>
      </cai-panel-section-dm-plugin>
    `);
  }
}
