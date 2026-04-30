/**
 * Shared styles for C2PA UI components
 */

export const indicatorStyles = `
  :host {
    display: inline-block;
    pointer-events: auto;
  }

  .indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    min-height: 36px;
    padding: 4px;
    cursor: pointer;
    border-radius: 4px;
    transition: transform 0.15s, opacity 0.15s;
    user-select: none;
  }

  .indicator svg {
    display: block;
    width: 30px;
    height: auto;
  }

  .indicator.invalid svg {
    width: 34px;
    height: auto;
  }

  .indicator:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }

  .indicator:active {
    transform: scale(0.95);
  }

  :host(:focus-visible) .indicator {
    outline: 3px solid #0e686c;
    outline-offset: 3px;
    border-radius: 4px;
  }
`;

export const popoverStyles = `
  :host {
    --popover-bg: #ffffff;
    --popover-border: #e0e0e0;
    --popover-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    --popover-z-index: 10000;
    pointer-events: auto;
  }

  .popover-container {
    position: fixed;
    z-index: var(--popover-z-index);
    background: var(--popover-bg);
    border: 1px solid var(--popover-border);
    border-radius: 8px;
    box-shadow: var(--popover-shadow);
    pointer-events: auto;
    max-width: 400px;
    min-width: 250px;
    animation: popoverSlideIn 0.2s ease-out;
  }

  @keyframes popoverSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .popover-trigger {
    display: inline-block;
  }

  .popover-content {
    padding: 12px;
    max-height: 500px;
    overflow-y: auto;
  }

  /* Subtle scroll styling */
  .popover-content::-webkit-scrollbar {
    width: 6px;
  }

  .popover-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .popover-content::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }

  .popover-content::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
`;

export const manifestSummaryStyles = `
  :host {
    --text-primary: #333;
    --text-secondary: #666;
    --text-light: #999;
    --border-color: #e0e0e0;
    --bg-section: #f9f9f9;
  }

  .manifest-summary {
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    color: var(--text-primary);
    font-size: 14px;
    line-height: 1.5;
    padding: 16px;
  }

  .summary-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
  }

  .summary-header-icon {
    font-size: 24px;
  }

  .summary-header-title {
    flex: 1;
    min-width: 0;
  }

  .manifest-source-toggle-wrap {
    flex-shrink: 0;
    margin-top: 1px;
  }

  .manifest-source-toggle-btn {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    min-width: 150px;
    height: 28px;
    font-size: 12px;
    line-height: 1;
    border: 1px solid var(--border-color);
    border-radius: 999px;
    background: #f1f1f1;
    color: var(--text-secondary);
    padding: 2px;
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease;
  }

  .manifest-source-toggle-btn::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: calc(50% - 2px);
    height: calc(100% - 4px);
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    transition: transform 0.16s ease;
  }

  .manifest-source-toggle-btn.recovered::before {
    transform: translateX(100%);
  }

  .manifest-source-toggle-btn:hover {
    border-color: #b8b8b8;
    background: #ececec;
  }

  .manifest-source-toggle-btn:focus-visible {
    outline: 2px solid #0e686c;
    outline-offset: 1px;
  }

  .manifest-source-option {
    position: relative;
    z-index: 1;
    font-weight: 600;
    color: #777;
    text-align: center;
    user-select: none;
  }

  .manifest-source-toggle-btn.embedded .manifest-source-option:first-child,
  .manifest-source-toggle-btn.recovered .manifest-source-option:last-child {
    color: #2b2b2b;
  }

  .summary-header-title h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .summary-header-title p {
    margin: 4px 0 0 0;
    font-size: 12px;
    color: var(--text-secondary);
  }

  .summary-filename {
    margin: 3px 0 0 0;
    font-size: 12px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .section {
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-light);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--border-color);
  }

  .section-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .row {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 8px;
    align-items: baseline;
    padding: 5px 0;
    border-bottom: 1px solid var(--border-color);
  }

  .row:last-child {
    border-bottom: none;
  }

  .empty-state-row .row-value {
    grid-column: 1 / -1;
  }

  .row-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    white-space: nowrap;
  }

  .row-value {
    font-size: 13px;
    color: var(--text-primary);
    word-break: break-word;
    text-align: left;
  }

  .row-value.status-row {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .field {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 12px;
    align-items: start;
  }

  .field-label {
    font-weight: 500;
    color: var(--text-secondary);
    font-size: 12px;
  }

  .field-value {
    color: var(--text-primary);
    word-break: break-word;
    font-size: 13px;
  }

  .field-note {
    font-size: 11px;
    color: var(--text-secondary);
    margin-top: 4px;
    line-height: 1.4;
  }

  .field-note.warning {
    color: #9a5e00;
    background: #fff8e1;
    border-left: 3px solid #f59e0b;
    padding: 4px 8px;
    border-radius: 2px;
  }

  .status {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    text-align: left;
    margin-left: -8px;
  }

  .status.validated {
    background: #e2e3e5;
    color: #383d41;
  }

  .status.trusted {
    background: #d4edda;
    color: #155724;
  }

  .status.invalid {
    background: #f8d7da;
    color: #721c24;
  }

  .status.unknown {
    background: #e2e3e5;
    color: #383d41;
  }

  .status-source-label {
    display: inline-block;
    padding: 3px 7px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }

  .status-source-label.interim {
    color: #92400e;
    background: #fef3c7;
    border: 1px solid #fcd34d;
  }

  .status-source-label.official {
    color: #383d41;
    background: #e2e3e5;
    border: 1px solid #c8cbcf;
  }

  .status.recovered {
    color: #383d41;
    background: #e2e3e5;
    border: 1px solid #c8cbcf;
  }

  .raw-details {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border-color);
  }

  .raw-details-toggle {
    background: none;
    border: none;
    color: #0066cc;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    padding: 0;
    text-decoration: none;
    transition: color 0.2s;
  }

  .raw-details-toggle:hover {
    color: #0052a3;
    text-decoration: underline;
  }

  .provenance-link {
    display: block;
    width: 100%;
    box-sizing: border-box;
    background: #0e686c;
    color: #ffffff;
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
    border-radius: 6px;
    padding: 8px 10px;
    text-align: center;
  }

  .provenance-link:hover {
    background: #0a4f52;
  }

  .raw-details-content {
    margin-top: 8px;
    padding: 8px;
    background: var(--bg-section);
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 11px;
    overflow-x: auto;
    color: var(--text-primary);
    line-height: 1.4;
  }

  .error-message {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: #721c24;
    font-size: 12px;
  }

  .error-message-item {
    padding: 8px;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
  }

  .info-message {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: #2f4858;
    font-size: 12px;
  }

  .info-message-item {
    padding: 8px;
    background: #eef3f4;
    border: 1px solid #d4dde0;
    border-radius: 4px;
  }

  .contributor-item {
    font-size: 13px;
    margin-bottom: 3px;
  }

  .contributor-item:last-child {
    margin-bottom: 0;
  }

  .social-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #0066cc;
    text-decoration: none;
    font-size: 13px;
  }

  .social-link:hover {
    text-decoration: underline;
  }

  .social-link svg {
    flex-shrink: 0;
  }

  .json-link {
    color: #0066cc;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    text-decoration: none;
  }

  .json-link:hover {
    text-decoration: underline;
  }

  .loading {
    padding: 12px 16px;
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.9rem;
    border-bottom: 1px solid var(--border-color);
    background: rgba(26, 192, 198, 0.04);
  }

  .loading::after {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: 8px;
    border: 2px solid var(--border-color);
    border-top-color: var(--text-secondary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
