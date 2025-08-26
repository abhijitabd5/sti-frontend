// src/components/charts/chartConfig.js
/**
 * Chart.js global configuration and registration
 */
import { Chart, Tooltip } from 'chart.js';

// Register Chart.js components
Chart.register(Tooltip);

/**
 * Initialize Chart.js with global defaults
 */
export const initializeChartDefaults = () => {
  // Font settings
  Chart.defaults.font.family = '"Inter", sans-serif';
  Chart.defaults.font.weight = 500;

  // Tooltip settings
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.displayColors = false;
  Chart.defaults.plugins.tooltip.mode = 'nearest';
  Chart.defaults.plugins.tooltip.intersect = false;
  Chart.defaults.plugins.tooltip.position = 'nearest';
  Chart.defaults.plugins.tooltip.caretSize = 0;
  Chart.defaults.plugins.tooltip.caretPadding = 20;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.padding = 8;
};

// Auto-initialize defaults when module is imported
initializeChartDefaults();

/**
 * Common chart options that can be extended
 */
export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: false,
      },
    },
    y: {
      display: true,
      beginAtZero: true,
    },
  },
};