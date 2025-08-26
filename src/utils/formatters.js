// src/utils/formatters.js
/**
 * Currency and number formatting utilities
 */

/**
 * Format currency value in Indian Rupees with compact notation
 * @param {number} value - The value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrencyINR = (value) => 
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumSignificantDigits: 3,
    notation: 'compact',
  }).format(value);

/**
 * Format numbers with compact notation (K, M, B)
 * @param {number} value - The value to format
 * @returns {string} Formatted number string
 */
export const formatCompactNumber = (value) => 
  new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 3,
    notation: 'compact',
  }).format(value);

/**
 * Format currency without compact notation for exact amounts
 * @param {number} value - The value to format
 * @param {string} currency - Currency code (default: 'INR')
 * @returns {string} Formatted currency string
 */
export const formatCurrencyExact = (value, currency = 'INR') => 
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

/**
 * Format percentage values
 * @param {number} value - The percentage value (0-100)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => 
  `${value.toFixed(decimals)}%`;