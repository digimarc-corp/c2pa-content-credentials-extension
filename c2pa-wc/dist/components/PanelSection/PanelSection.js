import{__decorate as o,e as t}from"../../b803f408.js";import{s as i,r as s,$ as e,w as r}from"../../e4c0417e.js";import{n as l}from"../../06170432.js";import{defaultStyles as c,baseSectionStyles as n}from"../../styles.js";import"../Tooltip/Tooltip.js";import"../../12d8f3c3.js";import"../Popover/Popover.js";import"../../icons/monochrome/help.js";import"../Icon/Icon.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";let p=class extends i{constructor(){super(...arguments),this.header="",this.helpText=null}static get styles(){return[c,n,s`
        div.layout {
          display: grid;
          grid-template-columns: auto;
          grid-template-rows: auto;
          gap: var(--cai-panel-section-internal-spacing, 0.5rem);
        }
        div.heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        div.heading-text {
          color: var(
            --cai-panel-section-heading-color,
            var(--cai-primary-color)
          );
          font-weight: var(--cai-panel-section-heading-font-weight, bold);
        }
      `]}render(){return e`
      <div class="layout">
        <div class="heading">
          <div class="heading-text">${this.header}</div>
          <slot name="help">
            ${this.helpText?e`<cai-tooltip-dm-plugin autoPlacement=${!1}>
                  <div slot="content">${this.helpText}</div>
                </cai-tooltip-dm-plugin>`:r}
          </slot>
        </div>
        <slot></slot>
      </div>
    `}};o([t({type:String})],p.prototype,"header",void 0),o([t({type:String})],p.prototype,"helpText",void 0),p=o([l("cai-panel-section-dm-plugin")],p);
