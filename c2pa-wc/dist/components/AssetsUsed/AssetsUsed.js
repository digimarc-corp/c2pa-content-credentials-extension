import{__decorate as o}from"../../b803f408.js";import{r as s,$ as i,s as t}from"../../e4c0417e.js";import{n as e}from"../../06170432.js";import{defaultStyles as r,baseSectionStyles as n}from"../../styles.js";import{getBadgeFromIngredient as l}from"../../badge.js";import{ConfigurablePanelSection as c}from"../../mixins/configurablePanelSection.js";import"../Thumbnail/Thumbnail.js";import"../PanelSection/PanelSection.js";import"../../mixins/configurable.js";import"../../12d8f3c3.js";import"../../utils.js";import"../../mixins/panelSection.js";import"../Tooltip/Tooltip.js";import"../Popover/Popover.js";import"../../icons/monochrome/help.js";import"../Icon/Icon.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";import"../../icons/monochrome/broken-image.js";import"../../icons/color/info.js";import"../../icons/color/alert.js";import"../../icons/color/missing.js";const a={stringMap:{"assets-used.header":"Assets used","assets-used.helpText":"Any assets used or added to this content"}};let m=class extends(c(t,{dataSelector:o=>o.ingredients,isEmpty:o=>!o.length,config:a})){static get styles(){return[r,n,s`
        .section-assets-used-dm-plugin {
          --cai-thumbnail-size: 48px;
          display: grid;
          color: blue;
          grid-template-columns: repeat(
            auto-fill,
            var(--cai-thumbnail-size, 48px)
          );
          grid-gap: 10px;
          text-align: left;
        }
      `]}render(){var o;return this.renderSection(i` <cai-panel-section-dm-plugin
      header=${this._config.stringMap["assets-used.header"]}
      helpText=${this._config.stringMap["assets-used.helpText"]}
    >
      <div class="section-assets-used-dm-plugin">
        ${null===(o=this._data)||void 0===o?void 0:o.map((o=>i`
            <cai-thumbnail-dm-plugin
              class="section-assets-used-thumbnail-dm-plugin"
              src=${o.thumbnail}
              badge=${l(o)}
            ></cai-thumbnail-dm-plugin>
          `))}
      </div>
    </cai-panel-section-dm-plugin>`)}};m=o([e("cai-assets-used-dm-plugin")],m);
