// src/components/charts/chartUtils.js
/**
 * Chart utility functions and helpers
 */

/**
 * Generate a gradient for chart areas (commonly used in line charts)
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {object} chartArea - Chart area dimensions
 * @param {Array} colorStops - Array of {stop, color} objects
 * @returns {CanvasGradient|string} Linear gradient or 'transparent' if invalid
 */
export const createChartAreaGradient = (ctx, chartArea, colorStops) => {
  if (!ctx || !chartArea || !colorStops || colorStops.length === 0) {
    return 'transparent';
  }

  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  
  colorStops.forEach(({ stop, color }) => {
    gradient.addColorStop(stop, color);
  });
  
  return gradient;
};

/**
 * Generate data points for demo charts
 * @param {number} count - Number of data points
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {Array} Array of random numbers
 */
export const generateRandomData = (count, min = 0, max = 100) => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

/**
 * Format chart labels for dates
 * @param {Array} dates - Array of date strings or Date objects
 * @param {string} format - Format type ('month', 'day', 'year')
 * @returns {Array} Formatted date labels
 */
export const formatDateLabels = (dates, format = 'month') => {
  return dates.map(date => {
    const d = new Date(date);
    switch (format) {
      case 'month':
        return d.toLocaleDateString('en-US', { month: 'short' });
      case 'day':
        return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
      case 'year':
        return d.getFullYear().toString();
      default:
        return d.toLocaleDateString();
    }
  });
};

/**
 * Calculate chart dimensions based on container
 * @param {HTMLElement} container - Chart container element
 * @param {number} aspectRatio - Desired aspect ratio (width/height)
 * @returns {object} Width and height dimensions
 */
export const calculateChartDimensions = (container, aspectRatio = 2) => {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  
  let width = containerWidth;
  let height = containerWidth / aspectRatio;
  
  // If calculated height exceeds container height, adjust
  if (height > containerHeight) {
    height = containerHeight;
    width = containerHeight * aspectRatio;
  }
  
  return { width, height };
};