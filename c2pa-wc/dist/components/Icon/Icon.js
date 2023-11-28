import{__decorate as i,e as o}from"../../b803f408.js";import{$ as c,s as n,r as t,w as r}from"../../e4c0417e.js";import{n as a}from"../../06170432.js";import{t as s}from"../../12d8f3c3.js";import{defaultStyles as e}from"../../styles.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";var p;let m=p=class extends n{constructor(){super(...arguments),this.source=""}updated(i){var o;i.has("source")&&(this.icon=null===(o=p.matchers.find((({pattern:i})=>i.test(this.source))))||void 0===o?void 0:o.icon)}static get styles(){return[e,t`
        :host {
          max-height: var(--cai-icon-size, 16px);
        }
        #container-dm-plugin {
          display: inline-block;
          width: var(--cai-icon-size, 16px);
          height: var(--cai-icon-size, 16px);
          --cai-icon-width: var(--cai-icon-size, 16px);
          --cai-icon-height: var(--cai-icon-size, 16px);
          margin-right: var(--cai-icon-spacing, 8px);
        }
      `]}render(){return this.icon?c`<div id="container-dm-plugin">${this.icon}</div>`:r}};m.matchers=[{pattern:/photoshop/i,icon:c`<cai-icon-photoshop-dm-plugin></cai-icon-photoshop-dm-plugin>`},{pattern:/adobe\sstock/i,icon:c`<cai-icon-adobe-stock-dm-plugin></cai-icon-adobe-stock-dm-plugin>`},{pattern:/adobe/i,icon:c`<cai-icon-adobe-dm-plugin></cai-icon-adobe-dm-plugin>`},{pattern:/behance\.net/i,icon:c`<cai-icon-behance-dm-plugin></cai-icon-behance-dm-plugin>`},{pattern:/facebook\.com/i,icon:c`<cai-icon-facebook-dm-plugin></cai-icon-facebook-dm-plugin>`},{pattern:/instagram\.com/i,icon:c`<cai-icon-instagram-dm-plugin></cai-icon-instagram-dm-plugin>`},{pattern:/truepic/i,icon:c`<cai-icon-truepic-dm-plugin></cai-icon-truepic-dm-plugin>`},{pattern:/twitter\.com/i,icon:c`<cai-icon-twitter-dm-plugin></cai-icon-twitter-dm-plugin>`},{pattern:/lightroom/i,icon:c`<cai-icon-lightroom-dm-plugin></cai-icon-lightroom-dm-plugin>`}],i([o({type:String})],m.prototype,"source",void 0),i([s()],m.prototype,"icon",void 0),m=p=i([a("cai-icon")],m);
