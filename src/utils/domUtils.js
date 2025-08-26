// src/utils/domUtils.js
/**
 * DOM manipulation and CSS utilities
 */

/**
 * Get CSS custom property value from document root
 * @param {string} variable - CSS variable name (with or without --)
 * @returns {string} CSS variable value (trimmed)
 */
export const getCSSVariable = (variable) => {
  // Ensure variable starts with --
  const cssVar = variable.startsWith('--') ? variable : `--${variable}`;
  
  return getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();
};

/**
 * Set CSS custom property on document root
 * @param {string} variable - CSS variable name (with or without --)
 * @param {string} value - CSS value to set
 */
export const setCSSVariable = (variable, value) => {
  // Ensure variable starts with --
  const cssVar = variable.startsWith('--') ? variable : `--${variable}`;
  
  document.documentElement.style.setProperty(cssVar, value);
};

/**
 * Get element's computed style property
 * @param {HTMLElement} element - Target element
 * @param {string} property - CSS property name
 * @returns {string} Computed style value
 */
export const getComputedStyleProperty = (element, property) => {
  return window.getComputedStyle(element).getPropertyValue(property).trim();
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
export const isElementInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Smooth scroll to element
 * @param {HTMLElement} element - Element to scroll to
 * @param {object} options - Scroll options
 */
export const smoothScrollToElement = (element, options = {}) => {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    ...options
  });
};