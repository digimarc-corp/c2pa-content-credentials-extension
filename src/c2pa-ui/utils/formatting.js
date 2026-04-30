/**
 * Utility functions for formatting manifest data
 */

/**
 * Format a date object or timestamp to a readable string
 * @param {Date|string|number} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  if (!date) return 'Unknown';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj)) {
    return 'Unknown';
  }
  
  // Format separately to avoid comma-inserted line break: "Apr 24, 2026 4:37 PM"
  const dateStr = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const timeStr = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  
  return `${dateStr} ${timeStr}`;
}

/**
 * Format validation status for display
 * @param {string} status - The validation status
 * @returns {string} Formatted status string
 */
export function formatValidationStatus(status) {
  if (!status) return 'Unknown';
  
  const statusMap = {
    trusted: 'Trusted',
    validated: 'Valid',
    invalid: 'Invalid',
    recovered: 'Recovered',
    unknown: 'Unknown',
  };
  
  return statusMap[status?.toLowerCase()] || status;
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default 50)
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Extract producer/creator name from manifest
 * @param {object} manifest - The manifest object
 * @returns {string} Producer name
 */
export function getProducerName(manifest) {
  if (!manifest) return 'Unknown';
  
  // Try various paths where producer info might be
  // Priority: explicit author > producer name > certificate issuer (signer) > fallback
  return manifest.producer?.name 
    || manifest.creator?.name 
    || manifest.producer 
    || manifest.creator 
    || manifest.signature?.issuer  // Certificate issuer as fallback signer
    || 'Unknown';
}

/**
 * Check if manifest has valid credentials
 * @param {object} manifest - The manifest object
 * @returns {boolean} True if manifest has credentials
 */
export function hasValidCredentials(manifest) {
  return manifest && (manifest.claim_generator || manifest.producer || manifest.creator);
}

/**
 * Get status badge class name
 * @param {string} status - The validation status
 * @returns {string} CSS class name for status
 */
export function getStatusClass(status) {
  const statusLower = status?.toLowerCase();
  
  const classMap = {
    validated: 'status-validated',
    invalid: 'status-invalid',
    recovered: 'status-recovered',
  };
  
  return classMap[statusLower] || 'status-unknown';
}

/**
 * Safely stringify an object for display
 * @param {object} obj - Object to stringify
 * @param {number} indent - Indentation level
 * @returns {string} JSON string
 */
export function safeStringify(obj, indent = 2) {
  try {
    return JSON.stringify(obj, null, indent);
  } catch (error) {
    return 'Unable to display data';
  }
}
