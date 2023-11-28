import{__decorate as o}from"../../b803f408.js";import{s as i,r as s,$ as e}from"../../e4c0417e.js";import{n as l}from"../../06170432.js";import{defaultStyles as t,baseSectionStyles as c}from"../../styles.js";import{ConfigurablePanelSection as n}from"../../mixins/configurablePanelSection.js";import"../PanelSection/PanelSection.js";import"../Icon/Icon.js";import"../../mixins/configurable.js";import"../../12d8f3c3.js";import"../../utils.js";import"../../mixins/panelSection.js";import"../Tooltip/Tooltip.js";import"../Popover/Popover.js";import"../../icons/monochrome/help.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";const a={stringMap:{"social-media.header":"Social media","social-media.helpText":"Social media accounts connected to the producer of this content"}};let r=class extends(n(i,{dataSelector:o=>null==o?void 0:o.socialAccounts,isEmpty:o=>!(null==o?void 0:o.length),config:a})){static get styles(){return[t,c,s`
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
      `]}render(){var o;return this.renderSection(e`<cai-panel-section-dm-plugin
      header=${this._config.stringMap["social-media.header"]}
      helpText=${this._config.stringMap["social-media.helpText"]}
    >
      <ul class="section-social-media-list-dm-plugin">
        ${null===(o=this._data)||void 0===o?void 0:o.map((o=>e`
            <li class="section-social-media-list-item-dm-plugin">
              <cai-icon-dm-plugin
                source="${o["@id"]}"
              ></cai-icon-dm-plugin>
              <a
                class="section-social-media-list-item-link-dm-plugin"
                href=${o["@id"]}
                target="_blank"
              >
                @${o.name}
              </a>
            </li>
          `))}
      </ul>
    </cai-panel-section-dm-plugin>`)}};r=o([l("cai-social-media-dm-plugin")],r);
