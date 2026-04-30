/**
 * C2PA UI Components Library
 * 
 * A lightweight replacement for c2pa-wc that provides custom web components
 * for displaying C2PA content credentials without external dependencies.
 * 
 * This library provides:
 * - c2pa-indicator: Badge component showing credential status
 * - c2pa-popover: Container for positioning indicator + manifest
 * - c2pa-manifest-summary: Detailed manifest information display
 */

// Export components
export { C2paIndicator } from './components/Indicator.js';
export { C2paPopover } from './components/Popover.js';
export { C2paManifestSummary } from './components/ManifestSummary.js';

// Export utilities
export {
  formatDate,
  formatValidationStatus,
  truncateText,
  getProducerName,
  hasValidCredentials,
  getStatusClass,
  safeStringify,
} from './utils/formatting.js';

// Register components on import
import './components/Indicator.js';
import './components/Popover.js';
import './components/ManifestSummary.js';

// Export styles
export { indicatorStyles, popoverStyles, manifestSummaryStyles } from './styles/shared.js';

/**
 * Helper function to create the full component structure
 * Matches the API of the original createC2PAComponents() function
 * 
 * @param {string} baseId - Base ID for the components
 * @returns {HTMLElement} The popover element with indicator and manifest
 */
export function createC2PAComponents(baseId) {
  const popover = document.createElement('c2pa-popover');
  popover.id = `popover-${baseId}`;
  popover.interactive = true;
  popover.style.position = 'absolute';
  popover.style.top = '10px';
  popover.style.right = '10px';

  const indicator = document.createElement('c2pa-indicator');
  indicator.id = `indicator-${baseId}`;
  indicator.slot = 'trigger';

  const manifestSummary = document.createElement('c2pa-manifest-summary');
  manifestSummary.id = `manifest-${baseId}`;
  manifestSummary.slot = 'content';

  popover.appendChild(indicator);
  popover.appendChild(manifestSummary);

  return popover;
}
