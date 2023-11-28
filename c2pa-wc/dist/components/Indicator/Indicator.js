import{__decorate as i,e as r}from"../../b803f408.js";import{s as t,r as c,$ as n}from"../../e4c0417e.js";import{n as o}from"../../06170432.js";import"../../icons/color/info.js";import{defaultStyles as a}from"../../styles.js";let s=class extends t{constructor(){super(...arguments),this.variant="info-light"}static get styles(){return[a,c`
        :host {
          display: inline-block;
          width: var(--cai-indicator-size, 24px);
          height: var(--cai-indicator-size, 24px);
        }
        .icon {
          --cai-icon-width: var(--cai-indicator-size, 24px);
          --cai-icon-height: var(--cai-indicator-size, 24px);
        }
      `]}render(){switch(this.variant){case"warning":return n`<cai-icon-missing-dm-plugin class="icon" />`;case"error":return n`<cai-icon-alert-dm-plugin class="icon" />`}return n`<cai-icon-info-dm-plugin class="icon" />`}};i([r({type:String})],s.prototype,"variant",void 0),s=i([o("cai-indicator-dm-plugin")],s);
