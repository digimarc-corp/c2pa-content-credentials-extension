import{__decorate as i,e as o}from"../../b803f408.js";import{w as t,$ as a,s as e,r as n}from"../../e4c0417e.js";import{n as c}from"../../06170432.js";import{defaultStyles as s}from"../../styles.js";import{classPartMap as l}from"../../utils.js";import"../Tooltip/Tooltip.js";import"../../icons/monochrome/broken-image.js";import"../../icons/color/info.js";import"../../icons/color/alert.js";import"../../icons/color/missing.js";import"../../12d8f3c3.js";import"../Popover/Popover.js";import"../../icons/monochrome/help.js";import"../Icon/Icon.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";var r;let d=r=class extends e{constructor(){super(...arguments),this.src=void 0,this.badge="none",this.selected=!1,this.badgeHelpText=void 0}static get styles(){return[s,n`
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
      `]}render(){const i=l({"container-dm-plugin":!0,selected:this.selected});return a`<style>
        .container-dm-plugin {
          background: url(${this.src}) var(--cai-thumbnail-bgcolor, #eaeaea);
        }
      </style>
      <div class=${i}>
        <slot name="badge">
          ${"none"!==this.badge&&this.badgeHelpText?a`<cai-tooltip-dm-plugin class="badge-tooltip-dm-plugin">
                <div slot="content">${this.badgeHelpText}</div>
                <div class="included-badge-dm-plugin" slot="trigger">
                  ${r.badgeMap[this.badge]}
                </div>
              </cai-tooltip-dm-plugin>`:a`<div class="badge-no-tooltip-dm-plugin">
                ${r.badgeMap[this.badge]}
              </div>`}
        </slot>
        ${this.src?t:a`<div class="no-image-dm-plugin">
              <cai-icon-broken-image-dm-plugin></cai-icon-broken-image-dm-plugin>
            </div>`}
      </div>`}};d.badgeMap={none:t,info:a`<cai-icon-info-dm-plugin
      class="badge-icon-dm-plugin"
    ></cai-icon-info-dm-plugin>`,missing:a`<cai-icon-missing-dm-plugin
      class="badge-icon-dm-plugin"
    ></cai-icon-missing-dm-plugin>`,alert:a`<cai-icon-alert-dm-plugin
      class="badge-icon-dm-plugin"
    ></cai-icon-alert-dm-plugin>`},i([o({type:String})],d.prototype,"src",void 0),i([o({type:String})],d.prototype,"badge",void 0),i([o({type:Boolean})],d.prototype,"selected",void 0),i([o({type:String,attribute:"badge-help-text"})],d.prototype,"badgeHelpText",void 0),d=r=i([c("cai-thumbnail-dm-plugin")],d);
