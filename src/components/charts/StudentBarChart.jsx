import React, { useRef, useEffect } from 'react';
import { useThemeProvider } from '@/contexts/ThemeContext';
import { getThemeColors } from '@/components/charts/config/chartTheme';
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

function StudentBarChart({ data, options = {} }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;

    const {
      textColor,
      gridColor,
      tooltipBodyColor,
      tooltipBackgroundColor,
      tooltipBorderColor,
    } = getThemeColors(currentTheme);

    const defaultOptions = {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
          backgroundColor: darkMode ? tooltipBackgroundColor.dark : tooltipBackgroundColor.light,
          borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          callbacks: {
            label: function(context) {
              return `${context.parsed.y || context.parsed.x} students`;
            }
          }
        },
      },
      scales: {
        x: {
          grid: {
            color: darkMode ? '#374151' : '#e5e7eb',
            display: options.indexAxis !== 'y'
          },
          ticks: {
            color: darkMode ? '#d1d5db' : '#6b7280',
            font: {
              size: 11
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: darkMode ? '#374151' : '#e5e7eb',
            display: options.indexAxis === 'y'
          },
          ticks: {
            color: darkMode ? '#d1d5db' : '#6b7280',
            font: {
              size: 11
            },
            callback: function(value) {
              return value + ' students';
            }
          }
        }
      },
      maintainAspectRatio: false,
      responsive: true,
    };

    // For horizontal bars, swap the scales
    if (options.indexAxis === 'y') {
      defaultOptions.scales.x.beginAtZero = true;
      defaultOptions.scales.x.ticks.callback = function(value) {
        return value + ' students';
      };
      delete defaultOptions.scales.y.beginAtZero;
      delete defaultOptions.scales.y.ticks.callback;
    }

    // Merge default options with passed options
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      plugins: {
        ...defaultOptions.plugins,
        ...options.plugins,
      },
      scales: {
        ...defaultOptions.scales,
        ...options.scales,
      }
    };

    const newChart = new Chart(ctx, {
      type: 'bar',
      data,
      options: mergedOptions,
    });

    chartRef.current = newChart;

    return () => {
      newChart.destroy();
    };
  }, [data, options, currentTheme]);

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default StudentBarChart;