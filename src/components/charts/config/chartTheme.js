// src/components/charts/chartTheme.js
/**
 * Chart color themes and styling configurations
 */
import { adjustColorOpacity } from '@/utils/colorUtils';
import { getCSSVariable } from '@/utils/domUtils';

/**
 * Chart color scheme based on light/dark themes
 */
export const chartColors = {
  text: {
    light: getCSSVariable('--color-gray-400'),
    dark: getCSSVariable('--color-gray-500'),
  },
  grid: {
    light: getCSSVariable('--color-gray-100'),
    dark: adjustColorOpacity(getCSSVariable('--color-gray-700'), 0.6),
  },
  background: {
    light: getCSSVariable('--color-white'),
    dark: getCSSVariable('--color-gray-800'),
  },
  tooltip: {
    title: {
      light: getCSSVariable('--color-gray-800'),
      dark: getCSSVariable('--color-gray-100'),
    },
    body: {
      light: getCSSVariable('--color-gray-500'),
      dark: getCSSVariable('--color-gray-400'),
    },
    background: {
      light: getCSSVariable('--color-white'),
      dark: getCSSVariable('--color-gray-700'),
    },
    border: {
      light: getCSSVariable('--color-gray-200'),
      dark: getCSSVariable('--color-gray-600'),
    },
  },
};

/**
 * Predefined color palettes for different chart types
 */
export const chartPalettes = {
  primary: [
    getCSSVariable('--color-blue-500'),
    getCSSVariable('--color-blue-400'),
    getCSSVariable('--color-blue-600'),
  ],
  secondary: [
    getCSSVariable('--color-gray-500'),
    getCSSVariable('--color-gray-400'),
    getCSSVariable('--color-gray-600'),
  ],
  success: [
    getCSSVariable('--color-green-500'),
    getCSSVariable('--color-green-400'),
    getCSSVariable('--color-green-600'),
  ],
  warning: [
    getCSSVariable('--color-yellow-500'),
    getCSSVariable('--color-yellow-400'),
    getCSSVariable('--color-yellow-600'),
  ],
  danger: [
    getCSSVariable('--color-red-500'),
    getCSSVariable('--color-red-400'),
    getCSSVariable('--color-red-600'),
  ],
  multi: [
    getCSSVariable('--color-blue-500'),
    getCSSVariable('--color-green-500'),
    getCSSVariable('--color-yellow-500'),
    getCSSVariable('--color-red-500'),
    getCSSVariable('--color-purple-500'),
    getCSSVariable('--color-indigo-500'),
  ],
};

/**
 * Get theme-appropriate colors
 * @param {string} theme - Current theme ('light' or 'dark')
 * @returns {object} Theme-specific color values
 */
export const getThemeColors = (theme = 'light') => {
  return {
    textColor: chartColors.text[theme],
    gridColor: chartColors.grid[theme],
    backgroundColor: chartColors.background[theme],
    tooltipTitleColor: chartColors.tooltip.title[theme],
    tooltipBodyColor: chartColors.tooltip.body[theme],
    tooltipBackgroundColor: chartColors.tooltip.background[theme],
    tooltipBorderColor: chartColors.tooltip.border[theme],
  };
};

/**
 * Common gradient configurations for line charts
 */
export const gradientConfigs = {
  primary: [
    { stop: 0, color: adjustColorOpacity(getCSSVariable('--color-blue-500'), 0.8) },
    { stop: 1, color: adjustColorOpacity(getCSSVariable('--color-blue-500'), 0.1) },
  ],
  success: [
    { stop: 0, color: adjustColorOpacity(getCSSVariable('--color-green-500'), 0.8) },
    { stop: 1, color: adjustColorOpacity(getCSSVariable('--color-green-500'), 0.1) },
  ],
  warning: [
    { stop: 0, color: adjustColorOpacity(getCSSVariable('--color-yellow-500'), 0.8) },
    { stop: 1, color: adjustColorOpacity(getCSSVariable('--color-yellow-500'), 0.1) },
  ],
  danger: [
    { stop: 0, color: adjustColorOpacity(getCSSVariable('--color-red-500'), 0.8) },
    { stop: 1, color: adjustColorOpacity(getCSSVariable('--color-red-500'), 0.1) },
  ],
};