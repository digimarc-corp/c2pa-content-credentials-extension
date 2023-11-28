import{__decorate as o}from"../../b803f408.js";import{s as i,r as t,$ as e}from"../../e4c0417e.js";import{n as s}from"../../06170432.js";import{defaultStyles as r,baseSectionStyles as c}from"../../styles.js";import{ConfigurablePanelSection as n}from"../../mixins/configurablePanelSection.js";import"../PanelSection/PanelSection.js";import"../Icon/Icon.js";import"../../mixins/configurable.js";import"../../12d8f3c3.js";import"../../utils.js";import"../../mixins/panelSection.js";import"../Tooltip/Tooltip.js";import"../Popover/Popover.js";import"../../icons/monochrome/help.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";const l={stringMap:{"produced-with.header":"Produced with","produced-with.helpText":"Software used to make this content","produced-with.beta":"Content Credentials (Beta)"}};let p=class extends(n(i,{dataSelector:o=>o.claimGenerator,config:l})){static get styles(){return[r,c,t`
        .section-produced-with-content-dm-plugin {
          display: flex;
          align-items: center;
        }

        .section-produced-with-beta-dm-plugin {
          margin-left: 24px;
          color: var(--cai-secondary-color);
        }
      `]}render(){var o,i,t;return this.renderSection(e` <cai-panel-section-dm-plugin
      header=${this._config.stringMap["produced-with.header"]}
      helpText=${this._config.stringMap["produced-with.helpText"]}
    >
      <div>
        <div class="section-produced-with-content-dm-plugin">
          <cai-icon source="${null===(o=this._data)||void 0===o?void 0:o.product}"></cai-icon>
          <span> ${null===(i=this._data)||void 0===i?void 0:i.product} </span>
        </div>
        ${(null===(t=this.manifestStore)||void 0===t?void 0:t.isBeta)?e`<div class="section-produced-with-beta-dm-plugin">
              ${this._config.stringMap["produced-with.beta"]}
            </div>`:null}
      </div>
    </cai-panel-section-dm-plugin>`)}};p=o([s("cai-produced-with-dm-plugin")],p);
