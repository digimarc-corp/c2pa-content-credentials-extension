/**
 * C2paManifestSummary - Custom web component for displaying manifest details.
 */

import { manifestSummaryStyles } from '../styles/shared.js';

const TWITTER_ICON_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>`;

const INSTAGRAM_ICON_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;

const LINKEDIN_ICON_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;

const GITHUB_ICON_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;

const FACEBOOK_ICON_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
import { 
  formatDate, 
  formatValidationStatus, 
  truncateText, 
  getProducerName,
  safeStringify 
} from '../utils/formatting.js';

export class C2paManifestSummary extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._data = null;
    this._embeddedManifestData = null;
    this._recoveredManifestData = null;
    this._jsonManifestData = null;
    this._embeddedJsonManifestData = null;
    this._recoveredJsonManifestData = null;
    this._viewMoreUrl = null;
    this._manifestSource = 'embedded';
    this.showRawDetails = false;
    this.enableTechnicalDetails = false;
    this.enableJsonManifestView = false;
  }

  connectedCallback() {
    this.render();
    this.observeAttributeChanges();
  }

  render() {
    const isRecoveredOnlyEmbeddedView = this._manifestSource === 'embedded'
      && !this._embeddedManifestData
      && Boolean(this._recoveredManifestData);

    if (!this._data && !isRecoveredOnlyEmbeddedView) {
      this.renderLoading();
      return;
    }

    const template = document.createElement('template');
    template.innerHTML = this.getTemplate();

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.setupEventListeners();
  }

  renderLoading() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${manifestSummaryStyles}</style>
      <div class="manifest-summary">
        <div class="loading">Loading manifest...</div>
      </div>
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  getTemplate() {
    const manifest = this.getCurrentManifest();
    const fallbackTitle = this._embeddedManifestData?.title
      || this._recoveredManifestData?.title
      || this._data?.title
      || null;
    if (!manifest && this._manifestSource === 'embedded') {
      return `
        <style>${manifestSummaryStyles}</style>
        <div class="manifest-summary">
          <div class="summary-header">
            <div class="summary-header-title">
              <h3>Content Credentials</h3>
              ${fallbackTitle ? `<p class="summary-filename">${this.escapeHtml(fallbackTitle)}</p>` : ''}
            </div>
            ${this.renderManifestSourceToggle()}
          </div>
          <div class="row empty-state-row">
            <div class="row-value info-message">
              <div class="info-message-item">No content credentials embedded in this media</div>
            </div>
          </div>
        </div>
      `;
    }

    const status = this.getStatus();
    const statusClass = status;
    const isInterimTrust = manifest?.trustSource === 'interim';
    const isOfficialTrust = manifest?.trustSource === 'official';
    const statusDescription = this.getStatusDescription(status);
    const producer = getProducerName(manifest);
    const trustedTimestamp = manifest.signature?.isoDateString || null;
    const assertedTimestamp = manifest.claimGenerator?.time
      || manifest.claim_generator?.time
      || manifest.signature_time
      || null;
    const timestamp = trustedTimestamp || assertedTimestamp;
    const isTrusted = !!trustedTimestamp;
    const title = manifest.title || 'Content Credentials';
    const format = manifest.format || null;
    const generator = manifest.claimGenerator?.product
      || manifest.claimGenerator?.value
      || manifest.claim_generator?.product
      || manifest.claim_generator?.value
      || null;

    return `
      <style>${manifestSummaryStyles}</style>
      <div class="manifest-summary">
        <div class="summary-header">
          <div class="summary-header-title">
            <h3>Content Credentials</h3>
            ${title ? `<p class="summary-filename">${this.escapeHtml(title)}</p>` : ''}
          </div>
          ${this.renderManifestSourceToggle()}
        </div>

        ${format ? `
          <div class="row">
            <div class="row-label">Format</div>
            <div class="row-value">${this.escapeHtml(format)}</div>
          </div>
        ` : ''}

        <div class="row">
          <div class="row-label">Status</div>
          <div class="row-value status-row">
            <span class="status ${statusClass}">${formatValidationStatus(status)}</span>
          </div>
        </div>

        ${producer ? `
          <div class="row">
            <div class="row-label">Signed by</div>
            <div class="row-value status-row">
              <span>${this.escapeHtml(truncateText(producer))}</span>
              ${isInterimTrust ? '<span class="status-source-label interim">Interim</span>' : ''}
              ${isOfficialTrust ? '<span class="status-source-label official">Official</span>' : ''}
            </div>
          </div>
        ` : ''}

        ${timestamp ? `
          <div class="row">
            <div class="row-label">${isTrusted ? 'Trusted time' : 'Signing time'}</div>
            <div class="row-value">
              ${formatDate(timestamp)}
              ${isTrusted ? '' : '<div class="field-note">Time reported by the signer; not independently verified.</div>'}
            </div>
          </div>
        ` : `
          <div class="row">
            <div class="row-label">Signing time</div>
            <div class="row-value"><span class="field-note warning">No trusted timestamp</span></div>
          </div>
        `}

        ${generator ? `
          <div class="row">
            <div class="row-label">Produced with</div>
            <div class="row-value">${this.escapeHtml(truncateText(generator))}</div>
          </div>
        ` : ''}

        ${this.getDetailsSections()}
        ${this.getValidationSection()}
        ${this.getAlertSection()}
        ${this.getViewMoreSection()}

        ${this.enableTechnicalDetails ? `
          ${this.showRawDetails ? this.getRawDetailsSection() : ''}
          <div class="raw-details">
            <button class="raw-details-toggle" id="rawToggle">
              ${this.showRawDetails ? '▼ Hide' : '▶ Show'} Technical details
            </button>
          </div>
        ` : ''}

        ${this.enableJsonManifestView ? this.getManifestJsonSection() : ''}
      </div>
    `;
  }

  getValidationSection() {
    const manifest = this.getCurrentManifest();
    const status = this.getStatus();

    if (!Array.isArray(manifest?.validationStatus) || manifest.validationStatus.length === 0) {
      return '';
    }

    const isRecoveredSource = this._manifestSource === 'recovered';
    const hasOnlyHashMismatch = manifest.validationStatus.length === 1
      && manifest.validationStatus[0]?.code === 'assertion.dataHash.mismatch';

    const validationValueClass = status === 'invalid' ? 'row-value error-message' : 'row-value';
    const validationCodeMessages = {
      'assertion.dataHash.mismatch': 'This image no longer matches its embedded Content Credentials.',
    };

    const validationItems = manifest.validationStatus
      .map((item) => {
        const code = item.code || item.explanation || item.url || 'Validation issue reported';
        const friendly = !isRecoveredSource && validationCodeMessages[item.code];
        return friendly
          ? `<div>${this.escapeHtml(code)}<div class="field-note">${this.escapeHtml(friendly)}</div></div>`
          : `<div>${this.escapeHtml(code)}</div>`;
      })
      .join('');

    const softBindingNote = (isRecoveredSource && hasOnlyHashMismatch)
      ? `<div class="field-note">${this.escapeHtml('A hash validation error is expected for soft-binding recovered manifests')}</div>`
      : '';

    return `
      <div class="row">
        <div class="row-label">Validation</div>
        <div class="${validationValueClass}">${validationItems}${softBindingNote}</div>
      </div>
    `;
  }

  getDetailsSections() {
    const manifest = this.getCurrentManifest();
    let html = '';

    // Contributors from cawg.metadata dc:contributor
    if (Array.isArray(manifest.contributors) && manifest.contributors.length > 0) {
      const items = manifest.contributors
        .map((entry) => this.renderContributorItem(entry))
        .join('');
      html += `
        <div class="row">
          <div class="row-label">Contributor</div>
          <div class="row-value">${items}</div>
        </div>
      `;
    }

    // Verified identities from cawg.identity assertion
    if (Array.isArray(manifest.verifiedIdentities) && manifest.verifiedIdentities.length > 0) {
      const items = manifest.verifiedIdentities
        .map((identity) => this.renderVerifiedIdentityItem(identity))
        .join('');
      html += `
        <div class="row">
          <div class="row-label">Verified Identity</div>
          <div class="row-value">${items}</div>
        </div>
      `;
    }

    // Watermark info comes from active manifest assertions.
    if (manifest.watermarkDescription || manifest.watermarkProvider || manifest.watermark_provider) {
      const rowLabel = this.escapeHtml(manifest.watermarkLabel || 'Watermarked');
      const wmProvider = manifest.watermarkProvider || manifest.watermark_provider || '';
      const wmDescription = manifest.watermarkDescription
        || "Applied an invisible watermark to improve this Content Credential's durability";
      const providerHtml = wmProvider
        ? `${this.escapeHtml(truncateText(wmProvider))}`
        : '';
      const descriptionHtml = this.escapeHtml(wmDescription);

      html += `
        <div class="row">
          <div class="row-label">${rowLabel}</div>
          <div class="row-value">
            ${providerHtml || descriptionHtml}
            ${providerHtml ? `<div class="field-note">${descriptionHtml}</div>` : ''}
          </div>
        </div>
      `;
    }

    return html;
  }

  renderVerifiedIdentityItem(identity) {
    const username = identity.username || '';
    const uri = identity.uri || null;
    const providerId = identity.provider?.id || '';
    const providerName = identity.provider?.name || '';

    let icon = '';
    let hostname = '';
    try {
      hostname = new URL(providerId).hostname.replace(/^www\./, '');
    } catch (_) {
      hostname = providerName.toLowerCase();
    }

    if (hostname === 'linkedin.com') {
      icon = LINKEDIN_ICON_SVG;
    } else if (hostname === 'twitter.com' || hostname === 'x.com') {
      icon = TWITTER_ICON_SVG;
    } else if (hostname === 'instagram.com') {
      icon = INSTAGRAM_ICON_SVG;
    } else if (hostname === 'github.com') {
      icon = GITHUB_ICON_SVG;
    } else if (hostname === 'facebook.com') {
      icon = FACEBOOK_ICON_SVG;
    }

    const safeUsername = this.escapeHtml(username);
    const label = providerName ? `${safeUsername} (${this.escapeHtml(providerName)})` : safeUsername;

    if (uri) {
      const safeUri = this.escapeAttribute(uri);
      return `<div class="contributor-item"><a class="social-link" href="${safeUri}" target="_blank" rel="noopener noreferrer">${icon}<span>${label}</span></a></div>`;
    }
    return `<div class="contributor-item">${icon ? `<span class="social-link">${icon}<span>${label}</span></span>` : safeUsername}</div>`;
  }

  renderContributorItem(entry) {
    let url = null;
    try {
      url = new URL(entry);
    } catch (_) {
      // not a URL — render as plain text
    }

    if (!url) {
      return `<div class="contributor-item">${this.escapeHtml(entry)}</div>`;
    }

    const hostname = url.hostname.replace(/^www\./, '');
    const handle = url.pathname.replace(/^\//, '').split('/')[0] || hostname;
    const safeHref = this.escapeAttribute(url.toString());
    const safeLabel = this.escapeHtml(handle || hostname);

    let icon = '';
    if (hostname === 'twitter.com' || hostname === 'x.com') {
      icon = TWITTER_ICON_SVG;
    } else if (hostname === 'instagram.com') {
      icon = INSTAGRAM_ICON_SVG;
    }

    return `<div class="contributor-item">
      <a class="social-link" href="${safeHref}" target="_blank" rel="noopener noreferrer">${icon}<span>${safeLabel}</span></a>
    </div>`;
  }

  getAlertSection() {
    const manifest = this.getCurrentManifest();
    const alerts = Array.isArray(manifest?.alerts)
      ? manifest.alerts
      : (manifest?.alert?.message ? [manifest.alert] : []);

    if (alerts.length === 0) {
      return '';
    }

    const infoAlerts = alerts.filter((alert) => alert?.type === 'info' && alert?.message);
    const issueAlerts = alerts.filter((alert) => alert?.type !== 'info' && alert?.message);

    let html = '';

    if (issueAlerts.length > 0) {
      const issueMessages = issueAlerts
        .map((alert) => `<div class="error-message-item">${this.escapeHtml(alert.message)}</div>`)
        .join('');

      html += `
        <div class="row">
          <div class="row-label">Alert</div>
          <div class="row-value error-message">${issueMessages}</div>
        </div>
      `;
    }

    const infoMessages = infoAlerts
      .map((alert) => alert.message)
      .filter(Boolean);

    if (infoMessages.length > 0) {
      const infoMessageHtml = infoMessages
        .map((message) => `<div class="info-message-item">${this.escapeHtml(message)}</div>`)
        .join('');

      html += `
        <div class="row">
          <div class="row-label">Additional Info</div>
          <div class="row-value info-message">${infoMessageHtml}</div>
        </div>
      `;
    }

    return html;
  }

  getViewMoreSection() {
    const safeViewMoreUrl = this.getSafeViewMoreUrl();
    if (!safeViewMoreUrl) {
      return '';
    }

    return `
      <div class="row provenance-row">
        <div class="row-label">More</div>
        <div class="row-value">
          <a class="provenance-link" href="${this.escapeAttribute(safeViewMoreUrl)}" target="_blank" rel="noopener noreferrer">Inspect</a>
        </div>
      </div>
    `;

  }

  getSafeViewMoreUrl() {
    if (!this._viewMoreUrl) {
      return null;
    }

    try {
      const url = new URL(this._viewMoreUrl);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return url.toString();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  getRawDetailsSection() {
    const manifest = this.getCurrentManifest();
    const rawJson = safeStringify(manifest);

    return `
      <div class="raw-details-content" id="rawContent">
        <pre>${this.escapeHtml(rawJson)}</pre>
      </div>
    `;
  }

  getManifestJsonSection() {
    return `
      <div class="row manifest-json-row">
        <div class="row-label">Manifest (JSON)</div>
        <div class="row-value">
          <a class="json-link" href="#" id="jsonLink">Open JSON Manifest</a>
        </div>
      </div>
    `;
  }

  openManifestJsonTab() {
    const manifestSource = this.getCurrentJsonManifest();
    if (!manifestSource) {
      return;
    }

    const rawJson = safeStringify(manifestSource);
    const jsonBlob = new Blob([rawJson], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);

    window.open(jsonUrl, '_blank', 'noopener,noreferrer');

    window.setTimeout(() => {
      URL.revokeObjectURL(jsonUrl);
    }, 60000);
  }

  setupEventListeners() {
    const manifestSourceToggle = this.shadowRoot.querySelector('.manifest-source-toggle-btn');
    if (manifestSourceToggle) {
      manifestSourceToggle.addEventListener('click', () => {
        const nextSource = this._manifestSource === 'embedded' ? 'recovered' : 'embedded';
        this._manifestSource = nextSource;
        this._data = this.getCurrentManifest();
        this.render();
        this.dispatchEvent(new CustomEvent('manifest-source-change', {
          bubbles: true,
          composed: true,
          detail: { source: nextSource },
        }));
      });
    }

    const toggleBtn = this.shadowRoot.getElementById('rawToggle');
    if (toggleBtn && this.enableTechnicalDetails) {
      toggleBtn.addEventListener('click', () => {
        this.showRawDetails = !this.showRawDetails;
        this.render();
      });
    }

    const jsonLink = this.shadowRoot.getElementById('jsonLink');
    if (jsonLink && this.enableJsonManifestView) {
      jsonLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openManifestJsonTab();
      });
    }

    // Provenance link — use window.open for reliable new-tab navigation
    // from within shadow DOM in a Chrome extension content script.
    const provenanceLink = this.shadowRoot.querySelector('.provenance-link');
    if (provenanceLink) {
      provenanceLink.addEventListener('click', (e) => {
        e.preventDefault();
        const url = provenanceLink.getAttribute('href');
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      });
    }
  }

  observeAttributeChanges() {
    // Watch for data attribute changes
    const observer = new MutationObserver(() => {
      const dataAttr = this.getAttribute('data');
      if (dataAttr) {
        try {
          this._data = JSON.parse(dataAttr);
          this.render();
        } catch (e) {
          console.error('Failed to parse manifest data:', e);
        }
      }
    });

    observer.observe(this, { attributes: true });
  }

  getStatusDescription(status) {
    if (status === 'trusted') return 'Trust checks passed for this manifest and signer chain.';
    if (status === 'validated') return 'Signature checks passed for this manifest.';
    if (status === 'invalid') return 'Validation checks failed. Review validation details below.';
    return 'We could not determine a clear validation state.';
  }

  getStatus() {
    const manifest = this.getCurrentManifest();
    if (!manifest) return 'unknown';

    // Check for OTGP recovery FIRST (soft-binding with only dataHash mismatch)
    // Only applies when viewing the recovered source — embedded manifests with a hash mismatch are invalid, not recovered
    if (manifest.error === 'otgp' && this._manifestSource === 'recovered') return 'recovered';

    // Use spec-defined validationState if present
    const rawValidationState = manifest.validationState || manifest.validation_state;
    if (typeof rawValidationState === 'string' && rawValidationState.trim()) {
      const normalized = rawValidationState.trim().toLowerCase();
      if (normalized === 'trusted') return 'trusted';
      if (normalized === 'valid' || normalized === 'validated') return 'validated';
      if (normalized === 'invalid') return 'invalid';
    }

    // Other errors → 'invalid' state
    if (manifest.error) return 'invalid';

    // Empty validation status array means no issues found (valid)
    if (Array.isArray(manifest.validationStatus) && manifest.validationStatus.length === 0) return 'validated';

    // No explicit state and no errors, but no validation performed either
    return 'unknown';
  }

  getCurrentManifest() {
    if (this._manifestSource === 'recovered' && this._recoveredManifestData) {
      return this._recoveredManifestData;
    }
    if (this._manifestSource === 'embedded' && !this._embeddedManifestData) {
      return null;
    }
    if (this._embeddedManifestData) {
      return this._embeddedManifestData;
    }
    return this._recoveredManifestData || this._data;
  }

  getCurrentJsonManifest() {
    if (this._manifestSource === 'recovered' && this._recoveredJsonManifestData) {
      return this._recoveredJsonManifestData;
    }
    if (this._manifestSource === 'embedded' && !this._embeddedJsonManifestData) {
      return null;
    }
    if (this._embeddedJsonManifestData) {
      return this._embeddedJsonManifestData;
    }
    if (this._manifestSource === 'recovered' && this._recoveredManifestData) {
      return this._recoveredManifestData;
    }
    return this._embeddedManifestData || this._jsonManifestData || this._data;
  }

  hasBothManifestSources() {
    return Boolean(this._recoveredManifestData);
  }

  renderManifestSourceToggle() {
    if (!this.hasBothManifestSources()) {
      return '';
    }

    const isRecovered = this._manifestSource === 'recovered';
    const ariaLabel = isRecovered
      ? 'Manifest source: Recovered. Click to switch to Embedded.'
      : 'Manifest source: Embedded. Click to switch to Recovered.';

    return `
      <div class="manifest-source-toggle-wrap" title="Toggle which credentials to display">
        <button type="button" class="manifest-source-toggle-btn ${isRecovered ? 'recovered' : 'embedded'}" aria-label="${this.escapeAttribute(ariaLabel)}">
          <span class="manifest-source-option">Embedded</span>
          <span class="manifest-source-option">Recovered</span>
        </button>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
  }

  escapeAttribute(text) {
    return this.escapeHtml(text).replace(/"/g, '&quot;');
  }

  // Public API to set data programmatically
  setManifest(manifest) {
    this._data = manifest;
    if (!this._embeddedManifestData && !this._recoveredManifestData) {
      this._embeddedManifestData = manifest;
    }
    this.render();
  }

  set manifestStore(manifest) {
    this._data = manifest;
    if (!this._embeddedManifestData && !this._recoveredManifestData) {
      this._embeddedManifestData = manifest;
    }
    this.render();
  }

  get manifestStore() {
    return this._data;
  }

  set jsonManifestStore(manifest) {
    this._jsonManifestData = manifest;
    if (!this._embeddedJsonManifestData && !this._recoveredJsonManifestData) {
      this._embeddedJsonManifestData = manifest;
    }
  }

  get jsonManifestStore() {
    return this._jsonManifestData;
  }

  set embeddedManifestStore(manifest) {
    this._embeddedManifestData = manifest;
    if (this._manifestSource !== 'recovered') {
      this._data = this.getCurrentManifest();
      this.render();
    }
  }

  get embeddedManifestStore() {
    return this._embeddedManifestData;
  }

  set recoveredManifestStore(manifest) {
    this._recoveredManifestData = manifest;
    this._data = this.getCurrentManifest();
    this.render();
  }

  get recoveredManifestStore() {
    return this._recoveredManifestData;
  }

  set embeddedJsonManifestStore(manifest) {
    this._embeddedJsonManifestData = manifest;
  }

  get embeddedJsonManifestStore() {
    return this._embeddedJsonManifestData;
  }

  set recoveredJsonManifestStore(manifest) {
    this._recoveredJsonManifestData = manifest;
  }

  get recoveredJsonManifestStore() {
    return this._recoveredJsonManifestData;
  }

  set viewMoreUrl(url) {
    this._viewMoreUrl = url;
    if (this._data) {
      this.render();
    }
  }

  get viewMoreUrl() {
    return this._viewMoreUrl;
  }

  set debugDetailsEnabled(value) {
    this.enableTechnicalDetails = Boolean(value);
    if (!this.enableTechnicalDetails) {
      this.showRawDetails = false;
    }
    if (this._data) {
      this.render();
    }
  }

  get debugDetailsEnabled() {
    return this.enableTechnicalDetails;
  }

  set jsonManifestViewEnabled(value) {
    this.enableJsonManifestView = Boolean(value);
    if (this._data) {
      this.render();
    }
  }

  get jsonManifestViewEnabled() {
    return this.enableJsonManifestView;
  }

  // Make interactive attribute bindable
  set interactive(value) {
    this.setAttribute('interactive', value);
  }

  get interactive() {
    return this.hasAttribute('interactive');
  }
}

customElements.define('c2pa-manifest-summary', C2paManifestSummary);
