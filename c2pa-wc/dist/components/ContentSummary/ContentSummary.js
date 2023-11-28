import{__decorate as o}from"../../b803f408.js";import{s as i,r as n,$ as t}from"../../e4c0417e.js";import{n as e}from"../../06170432.js";import{ConfigurablePanelSection as s}from"../../mixins/configurablePanelSection.js";import{defaultStyles as r,baseSectionStyles as c}from"../../styles.js";import"../../icons/monochrome/generic-info.js";import"../Icon/Icon.js";import"../PanelSection/PanelSection.js";import"../../mixins/configurable.js";import"../../12d8f3c3.js";import"../../utils.js";import"../../mixins/panelSection.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";import"../Tooltip/Tooltip.js";import"../Popover/Popover.js";import"../../icons/monochrome/help.js";const l={stringMap:{"content-summary.header":"Content summary","content-summary.content.aiGenerated":"This content was generated with an AI tool."}};let m=class extends(s(i,{dataSelector:o=>{var i;return(null==o?void 0:o.generativeInfo)&&0!==(null===(i=null==o?void 0:o.generativeInfo)||void 0===i?void 0:i.length)},config:l})){static get styles(){return[r,c,n`
        .section-process-content-dm-plugin {
          display: flex;
          align-items: center;
        }
        .section-icon-content-dm-plugin {
          display: flex;
          align-items: flex-start;
          gap: var(--cai-icon-spacing, 8px);
        }
      `]}render(){return this.renderSection(t`<cai-panel-section-dm-plugin
      header=${this._config.stringMap["content-summary.header"]}
      helpText=${this._config.stringMap["content-summary.helpText"]}
    >
      <div class="section-icon-content-dm-plugin">
        <cai-icon-generic-info-dm-plugin></cai-icon-generic-info-dm-plugin>
        <span>
          ${this._config.stringMap["content-summary.content.aiGenerated"]}
        </span>
      </div>
    </cai-panel-section-dm-plugin>`)}};m=o([e("cai-content-summary-dm-plugin")],m);
