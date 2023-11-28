import{__decorate as e,e as t}from"../../b803f408.js";import{r as i,$ as n,w as r,s as o}from"../../e4c0417e.js";import{n as a}from"../../06170432.js";import{defaultDateFormatter as l}from"../../utils.js";import{Configurable as s}from"../../mixins/configurable.js";import{defaultStyles as m,baseSectionStyles as u}from"../../styles.js";import{o as c}from"../Popover/Popover.js";import"../PanelSection/PanelSection.js";import"../../12d8f3c3.js";import"../../icons/monochrome/help.js";import"../Tooltip/Tooltip.js";import"../Icon/Icon.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";function d(e){if(null===e||!0===e||!1===e)return NaN;var t=Number(e);return isNaN(t)?t:t<0?Math.ceil(t):Math.floor(t)}function p(e,t){if(t.length<e)throw new TypeError(e+" argument"+(e>1?"s":"")+" required, but only "+t.length+" present")}function g(e){p(1,arguments);var t=Object.prototype.toString.call(e);return e instanceof Date||"object"==typeof e&&"[object Date]"===t?new Date(e.getTime()):"number"==typeof e||"[object Number]"===t?new Date(e):("string"!=typeof e&&"[object String]"!==t||"undefined"==typeof console||(console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"),console.warn((new Error).stack)),new Date(NaN))}function v(e){return p(1,arguments),e instanceof Date||"object"==typeof e&&"[object Date]"===Object.prototype.toString.call(e)}var f={dateTimeDelimiter:/[T ]/,timeZoneDelimiter:/[Z ]/i,timezone:/([Z+-].*)$/},h=/^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/,b=/^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/,N=/^([+-])(\d{2})(?::?(\d{2}))?$/;function D(e){var t,i={},n=e.split(f.dateTimeDelimiter);if(n.length>2)return i;if(/:/.test(n[0])?t=n[0]:(i.date=n[0],t=n[1],f.timeZoneDelimiter.test(i.date)&&(i.date=e.split(f.timeZoneDelimiter)[0],t=e.substr(i.date.length,e.length))),t){var r=f.timezone.exec(t);r?(i.time=t.replace(r[1],""),i.timezone=r[1]):i.time=t}return i}function j(e,t){var i=new RegExp("^(?:(\\d{4}|[+-]\\d{"+(4+t)+"})|(\\d{2}|[+-]\\d{"+(2+t)+"})$)"),n=e.match(i);if(!n)return{year:NaN,restDateString:""};var r=n[1]?parseInt(n[1]):null,o=n[2]?parseInt(n[2]):null;return{year:null===o?r:100*o,restDateString:e.slice((n[1]||n[2]).length)}}function w(e,t){if(null===t)return new Date(NaN);var i=e.match(h);if(!i)return new Date(NaN);var n=!!i[4],r=y(i[1]),o=y(i[2])-1,a=y(i[3]),l=y(i[4]),s=y(i[5])-1;if(n)return function(e,t,i){return t>=1&&t<=53&&i>=0&&i<=6}(0,l,s)?function(e,t,i){var n=new Date(0);n.setUTCFullYear(e,0,4);var r=n.getUTCDay()||7,o=7*(t-1)+i+1-r;return n.setUTCDate(n.getUTCDate()+o),n}(t,l,s):new Date(NaN);var m=new Date(0);return function(e,t,i){return t>=0&&t<=11&&i>=1&&i<=($[t]||(C(e)?29:28))}(t,o,a)&&function(e,t){return t>=1&&t<=(C(e)?366:365)}(t,r)?(m.setUTCFullYear(t,o,Math.max(r,a)),m):new Date(NaN)}function y(e){return e?parseInt(e):1}function T(e){var t=e.match(b);if(!t)return NaN;var i=S(t[1]),n=S(t[2]),r=S(t[3]);return function(e,t,i){if(24===e)return 0===t&&0===i;return i>=0&&i<60&&t>=0&&t<60&&e>=0&&e<25}(i,n,r)?36e5*i+6e4*n+1e3*r:NaN}function S(e){return e&&parseFloat(e.replace(",","."))||0}function x(e){if("Z"===e)return 0;var t=e.match(N);if(!t)return 0;var i="+"===t[1]?-1:1,n=parseInt(t[2]),r=t[3]&&parseInt(t[3])||0;return function(e,t){return t>=0&&t<=59}(0,r)?i*(36e5*n+6e4*r):NaN}var $=[31,null,31,30,31,30,31,31,30,31,30,31];function C(e){return e%400==0||e%4==0&&e%100!=0}const U={stringMap:{"minimum-viable-provenance.header":"Content Credentials","minimum-viable-provenance.helpText":"Attribution and history data attached to this content","minimum-viable-provenance.invalidDate":"Invalid date"},dateFormatter:l};let M=class extends(s(o,U)){static get styles(){return[m,u,i`
      .minimum-viable-provenance-content-dm-plugin {
        --cai-thumbnail-size: 48px;
        display: grid;
        grid-template-columns: 48px auto;
        grid-gap: 2px 10px;
        text-align: left;
      }
      .minimum-viable-provenance-thumbnail-dm-plugin {
        grid-column: 1;
        grid-row: 1 / 3;
      }
      .minimum-viable-provenance-signer-dm-plugin {
        grid-column: 2;
        grid-row: 1;
        align-self: flex-end;
        display: grid;
        grid-template-columns: min-content max-content;
        align-items: center;
      }
      .minimum-viable-provenance-signer-dm-plugin.no-date {
        grid-row: span 2;
        height: 100%;
      }
      .minimum-viable-provenance-date-dm-plugin {
        grid-column: 2;
        grid-row: 2;
        color: var(--cai-secondary-color, #6e6e6e);
      `]}render(){var e,t,i,o,a,l,s,m,u,f,h;const b="error"===(null===(e=this.manifestStore)||void 0===e?void 0:e.error),N={"minimum-viable-provenance-signer-dm-plugin":!0,"no-date":b},y=(null===(i=null===(t=this.manifestStore)||void 0===t?void 0:t.signature)||void 0===i?void 0:i.isoDateString)?function(e,t){p(1,arguments);var i=t||{},n=null==i.additionalDigits?2:d(i.additionalDigits);if(2!==n&&1!==n&&0!==n)throw new RangeError("additionalDigits must be 0, 1 or 2");if("string"!=typeof e&&"[object String]"!==Object.prototype.toString.call(e))return new Date(NaN);var r,o=D(e);if(o.date){var a=j(o.date,n);r=w(a.restDateString,a.year)}if(!r||isNaN(r.getTime()))return new Date(NaN);var l,s=r.getTime(),m=0;if(o.time&&(m=T(o.time),isNaN(m)))return new Date(NaN);if(!o.timezone){var u=new Date(s+m),c=new Date(0);return c.setFullYear(u.getUTCFullYear(),u.getUTCMonth(),u.getUTCDate()),c.setHours(u.getUTCHours(),u.getUTCMinutes(),u.getUTCSeconds(),u.getUTCMilliseconds()),c}return l=x(o.timezone),isNaN(l)?new Date(NaN):new Date(s+m+l)}(null===(o=this.manifestStore)||void 0===o?void 0:o.signature.isoDateString):void 0;return n` <cai-panel-section-dm-plugin
      header=${this._config.stringMap["minimum-viable-provenance.header"]}
      helpText=${this._config.stringMap["minimum-viable-provenance.helpText"]}
    >
      <div class="minimum-viable-provenance-content-dm-plugin">
        <cai-thumbnail-dm-plugin
          class="minimum-viable-provenance-thumbnail-dm-plugin"
          src=${null===(a=this.manifestStore)||void 0===a?void 0:a.thumbnail}
        ></cai-thumbnail-dm-plugin>
        <div class=${c(N)}>
          <cai-icon-dm-plugin
            slot="icon"
            source=${null===(s=null===(l=this.manifestStore)||void 0===l?void 0:l.signature)||void 0===s?void 0:s.issuer}
          ></cai-icon-dm-plugin>
          <span> ${null===(u=null===(m=this.manifestStore)||void 0===m?void 0:m.signature)||void 0===u?void 0:u.issuer} </span>
        </div>
        ${b?r:n`
              <div class="minimum-viable-provenance-date-dm-plugin">
                ${function(e){if(p(1,arguments),!v(e)&&"number"!=typeof e)return!1;var t=g(e);return!isNaN(Number(t))}(y)?n`${null===(f=this._config)||void 0===f?void 0:f.dateFormatter(y)}`:n`${null===(h=this._config)||void 0===h?void 0:h.stringMap["minimum-viable-provenance.invalidDate"]}`}
              </div>
            `}
      </div>
    </cai-panel-section-dm-plugin>`}};e([t({type:Object})],M.prototype,"manifestStore",void 0),M=e([a("cai-minimum-viable-provenance-dm-plugin")],M);
