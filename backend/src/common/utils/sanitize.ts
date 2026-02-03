/**
 * Input sanitization utilities
 * Protects against XSS and injection attacks
 */

/**
 * Trim whitespace from string
 */
export const trim = (value: string): string => {
  return typeof value === 'string' ? value.trim() : value;
};

/**
 * Escape HTML special characters to prevent XSS
 * Converts: & < > " ' to their HTML entities
 */
export const escapeHtml = (value: string): string => {
  if (typeof value !== 'string') return value;
  
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Combined sanitization: trim + escape HTML
 */
export const sanitizeInput = (value: string): string => {
  if (typeof value !== 'string') return value;
  return escapeHtml(trim(value));
};

/**
 * Sanitize for safe storage (trim only)
 * Use when HTML escaping will be done on output
 */
export const sanitizeForStorage = (value: string): string => {
  return trim(value);
};
