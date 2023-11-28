import{__decorate as i}from"../../b803f408.js";import{s as t,r as o,$ as s}from"../../e4c0417e.js";import{n}from"../../06170432.js";import{o as e}from"../Popover/Popover.js";import{defaultStyles as c,baseSectionStyles as l}from"../../styles.js";import{ConfigurablePanelSection as a}from"../../mixins/configurablePanelSection.js";import"../PanelSection/PanelSection.js";import"../../12d8f3c3.js";import"../../icons/monochrome/help.js";import"../../mixins/configurable.js";import"../../utils.js";import"../../mixins/panelSection.js";import"../Tooltip/Tooltip.js";import"../Icon/Icon.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";const d={stringMap:{"edits-and-activity.header":"Edits and activity","edits-and-activity.helpText":"Changes and actions taken to produce this content"},showDescriptions:!1};let r=class extends(a(t,{dataSelector:i=>i.editsAndActivity,isEmpty:i=>!(null==i?void 0:i.length),config:d})){static get styles(){return[c,l,o`
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
      `]}render(){var i;return this.renderSection(s`
      <cai-panel-section-dm-plugin
        header=${this._config.stringMap["edits-and-activity.header"]}
        helpText=${this._config.stringMap["edits-and-activity.helpText"]}
      >
        <dl class="section-edits-and-activity-list-dm-plugin">
          ${null===(i=this._data)||void 0===i?void 0:i.map((({icon:i,label:t,description:o})=>s`
              <div class="section-edits-and-activity-list-item-dm-plugin">
                <dt class="section-edits-and-activity-list-item-term-dm-plugin">
                  ${i?s`<img
                        class="section-edits-and-activity-list-item-icon-dm-plugin"
                        src=${i}
                        alt=${t}
                      />`:null}
                  <span
                    class="section-edits-and-activity-list-item-label-dm-plugin"
                  >
                    ${t}
                  </span>
                </dt>
                ${this._config.showDescriptions?s`
                      <dd
                        class=${e({"section-edits-and-activity-list-item-description-dm-plugin":!0,"has-icon":!!i})}
                      >
                        ${o}
                      </dd>
                    `:null}
              </div>
            `))}
        </dl>
      </cai-panel-section-dm-plugin>
    `)}};r=i([n("cai-edits-and-activity-dm-plugin")],r);
