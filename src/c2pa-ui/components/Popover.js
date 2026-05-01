/**
 * C2paPopover - Custom web component for positioning indicator and manifest summary.
 */

import { popoverStyles } from '../styles/shared.js';

export class C2paPopover extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
    this.closeTimer = null;
    this.triggerEl = null;
    this.handleViewportChange = this.handleViewportChange.bind(this);
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleViewportChange);
    document.removeEventListener('scroll', this.handleViewportChange, true);
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${popoverStyles}</style>
      <div class="popover-trigger">
        <slot name="trigger"></slot>
      </div>
      <div class="popover-container" id="popoverContainer" style="display: none;">
        <slot name="content"></slot>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  setupEventListeners() {
    const container = this.shadowRoot.getElementById('popoverContainer');
    const trigger = this.querySelector('[slot="trigger"]');

    this.triggerEl = trigger;
    this.applyA11yAttributes();

    if (trigger) {
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle();
        }
      });
    }

    // Hover behavior for desktop usage.
    this.addEventListener('mouseenter', () => {
      this.cancelClose();
      this.open();
    });

    this.addEventListener('mouseleave', () => {
      this.scheduleClose();
    });

    this.addEventListener('focusin', () => {
      this.cancelClose();
      this.open();
    });

    this.addEventListener('focusout', () => {
      this.scheduleClose();
    });

    // Keep the popover open when switching credential source in the summary header.
    this.addEventListener('manifest-source-change', () => {
      this.cancelClose();
      this.open();
    });

    if (container) {
      container.addEventListener('mouseenter', () => {
        this.cancelClose();
      });

      container.addEventListener('mouseleave', () => {
        this.scheduleClose();
      });
    }

    // Keep click behavior for touch/compatibility.
    this.addEventListener('click', (e) => {
      const trigger = this.querySelector('[slot="trigger"]');
      if (trigger && (trigger === e.target || trigger.contains(e.target))) {
        e.stopPropagation();
        this.toggle();
      }
    });

    // Close popover when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target) && this.isOpen) {
        this.close();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault();
        this.close();
        if (this.triggerEl) {
          this.triggerEl.focus();
        }
      }
    });

    window.addEventListener('resize', this.handleViewportChange);
    document.addEventListener('scroll', this.handleViewportChange, true);
  }

  handleViewportChange() {
    if (this.isOpen) {
      this.positionPopover();
    }
  }

  applyA11yAttributes() {
    const container = this.shadowRoot.getElementById('popoverContainer');
    const trigger = this.triggerEl;

    if (container) {
      container.setAttribute('role', 'dialog');
      container.setAttribute('aria-label', 'Content Credentials summary');
      container.setAttribute('aria-hidden', this.isOpen ? 'false' : 'true');
    }

    if (trigger) {
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', this.isOpen ? 'true' : 'false');
      if (container?.id) {
        trigger.setAttribute('aria-controls', container.id);
      }
    }
  }

  syncA11yState() {
    const container = this.shadowRoot.getElementById('popoverContainer');
    if (container) {
      container.setAttribute('aria-hidden', this.isOpen ? 'false' : 'true');
    }

    if (this.triggerEl) {
      this.triggerEl.setAttribute('aria-expanded', this.isOpen ? 'true' : 'false');
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen) {
      this.positionPopover();
      return;
    }

    const container = this.shadowRoot.getElementById('popoverContainer');
    if (container) {
      this.cancelClose();
      container.style.display = 'block';
      this.isOpen = true;
      this.syncA11yState();
      this.dispatchEvent(new CustomEvent('popover-open', { bubbles: true }));
      this.positionPopover();
    }
  }

  close() {
    if (!this.isOpen) {
      return;
    }

    const container = this.shadowRoot.getElementById('popoverContainer');
    if (container) {
      container.style.display = 'none';
      this.isOpen = false;
      this.syncA11yState();
      this.dispatchEvent(new CustomEvent('popover-close', { bubbles: true }));
    }
  }

  scheduleClose() {
    this.cancelClose();
    this.closeTimer = window.setTimeout(() => {
      if (this.contains(document.activeElement)) {
        return;
      }
      this.close();
    }, 180);
  }

  cancelClose() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  positionPopover() {
    const container = this.shadowRoot.getElementById('popoverContainer');
    const trigger = this.querySelector('[slot="trigger"]');

    if (!container || !trigger) return;

    const triggerRect = trigger.getBoundingClientRect();
    const panelWidth = 360;
    const gap = 8;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const computedWidth = Math.min(panelWidth, Math.max(220, viewportWidth - (gap * 2)));

    container.style.width = `${computedWidth}px`;
    container.style.maxHeight = `${Math.max(140, viewportHeight - (gap * 2))}px`;

    // Measure real rendered size instead of using an estimated height.
    const panelRect = container.getBoundingClientRect();
    const panelHeight = panelRect.height;
    const panelActualWidth = panelRect.width;

    let top = triggerRect.bottom + gap;
    let left = triggerRect.left;

    const fitsBelow = top + panelHeight <= viewportHeight - gap;
    const fitsAbove = triggerRect.top - gap - panelHeight >= gap;

    if (!fitsBelow && fitsAbove) {
      top = triggerRect.top - panelHeight - gap;
    }

    if (!fitsBelow && !fitsAbove) {
      top = gap;
    }

    if (left + panelActualWidth > viewportWidth - gap) {
      left = viewportWidth - panelActualWidth - gap;
    }

    if (left < gap) {
      left = gap;
    }

    if (top < gap) {
      top = gap;
    }

    if (top + panelHeight > viewportHeight - gap) {
      top = viewportHeight - panelHeight - gap;
    }

    container.style.top = `${Math.round(top)}px`;
    container.style.left = `${Math.round(left)}px`;
  }

  set interactive(value) {
    this.setAttribute('interactive', value);
  }

  get interactive() {
    return this.hasAttribute('interactive');
  }
}

customElements.define('c2pa-popover', C2paPopover);
