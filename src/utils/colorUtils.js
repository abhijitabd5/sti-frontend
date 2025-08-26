// src/utils/colorUtils.js
/**
 * Color manipulation and conversion utilities
 */

/**
 * Convert hex color to RGBA format
 * @param {string} hexColor - Hex color code (with or without #)
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} RGBA color string
 */
const convertHexToRGBA = (hexColor, opacity) => {
  // Remove the '#' if it exists
  const hex = hexColor.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return RGBA string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Convert HSL color to HSLA format
 * @param {string} hslColor - HSL color string
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} HSLA color string
 */
const convertHSLToHSLA = (hslColor, opacity) => {
  // Convert HSL to HSLA
  return hslColor.replace('hsl(', 'hsla(').replace(')', `, ${opacity})`);
};

/**
 * Add alpha value to OKLCH color
 * @param {string} oklchColor - OKLCH color string
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} OKLCH color with alpha
 */
const addOKLCHAlpha = (oklchColor, opacity) => {
  // Add alpha value to OKLCH color
  return oklchColor.replace(/oklch\((.*?)\)/, (match, p1) => `oklch(${p1} / ${opacity})`);
};

/**
 * Adjust color opacity based on color format (hex, hsl, oklch)
 * @param {string} color - Color in any supported format
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} Color with adjusted opacity
 * @throws {Error} If color format is unsupported
 */
export const adjustColorOpacity = (color, opacity) => {
  if (color.startsWith('#')) {
    return convertHexToRGBA(color, opacity);
  } else if (color.startsWith('hsl')) {
    return convertHSLToHSLA(color, opacity);
  } else if (color.startsWith('oklch')) {
    return addOKLCHAlpha(color, opacity);
  } else {
    throw new Error(`Unsupported color format: ${color}`);
  }
};

/**
 * Convert OKLCH color to RGBA by using browser computation
 * @param {string} oklchColor - OKLCH color string
 * @returns {string} RGB/RGBA color string
 */
export const convertOKLCHToRGBA = (oklchColor) => {
  // Create a temporary div to use for color conversion
  const tempDiv = document.createElement('div');
  tempDiv.style.color = oklchColor;
  document.body.appendChild(tempDiv);
  
  try {
    // Get the computed style and convert to RGB
    const computedColor = window.getComputedStyle(tempDiv).color;
    return computedColor;
  } finally {
    // Always remove the temp div
    document.body.removeChild(tempDiv);
  }
};

/**
 * Validate if a string is a valid hex color
 * @param {string} color - Color string to validate
 * @returns {boolean} True if valid hex color
 */
export const isValidHexColor = (color) => {
  const hexPattern = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexPattern.test(color);
};