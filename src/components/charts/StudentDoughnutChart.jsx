import React, { useRef, useEffect } from 'react';
import { useThemeProvider } from '@/contexts/ThemeContext';
import { getThemeColors } from '@/components/charts/config/chartTheme';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

function StudentDoughnutChart({ data, options = {} }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;

    const {
      tooltipTitleColor,
      tooltipBodyColor,
      tooltipBackgroundColor,
      tooltipBorderColor,
    } = getThemeColors(currentTheme);

    const defaultOptions = {
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 12,
            font: {
              size: 11
            },
            color: darkMode ? '#d1d5db' : '#374151',
          }
        },
        tooltip: {
          titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
          bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
          backgroundColor: darkMode ? tooltipBackgroundColor.dark : tooltipBackgroundColor.light,
          borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              return `${label}: ${value} students`;
            }
          }
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    };

    // Merge default options with passed options
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      plugins: {
        ...defaultOptions.plugins,
        ...options.plugins,
      }
    };

    const newChart = new Chart(ctx, {
      type: 'doughnut',
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

export default StudentDoughnutChart;