import React, { useRef, useEffect } from 'react';
import { useThemeProvider } from '@/contexts/ThemeContext';

import { getThemeColors } from '@/components/charts/config/chartTheme';
import {
  Chart,
  DoughnutController,
  ArcElement,
  TimeScale,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';

// Register chart.js components once
Chart.register(DoughnutController, ArcElement, TimeScale, Tooltip);

function DoughnutChart({ data, width, height }) {
  const canvasRef = useRef(null);
  const legendRef = useRef(null);
  const chartRef = useRef(null);

  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';

  // Create chart on mount
  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;

    const {
      tooltipTitleColor,
      tooltipBodyColor,
      tooltipBackgroundColor,
      tooltipBorderColor,
    } = getThemeColors(currentTheme);

    const newChart = new Chart(ctx, {
      type: 'doughnut',
      data,
      options: {
        cutout: '80%',
        layout: { padding: 24 },
        plugins: {
          legend: { display: false },
          tooltip: {
            titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBackgroundColor.dark : tooltipBackgroundColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        animation: { duration: 500 },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
      plugins: [
        {
          id: 'htmlLegend',
          afterUpdate(c) {
            const ul = legendRef.current;
            if (!ul) return;

            // Clear old items
            while (ul.firstChild) ul.firstChild.remove();

            // Built-in labels generator
            const items = c.options.plugins.legend.labels.generateLabels(c);
            items.forEach((item) => {
              const li = document.createElement('li');
              li.style.margin = '4px';

              // Button wrapper
              const button = document.createElement('button');
              button.classList.add(
                'btn-xs',
                'bg-white',
                'dark:bg-gray-700',
                'text-gray-500',
                'dark:text-gray-400',
                'shadow-xs',
                'shadow-black/[0.08]',
                'rounded-full'
              );
              button.style.opacity = item.hidden ? '.3' : '';
              button.onclick = () => {
                c.toggleDataVisibility(item.index);
                c.update();
              };

              // Color box
              const box = document.createElement('span');
              box.style.display = 'block';
              box.style.width = '8px';
              box.style.height = '8px';
              box.style.backgroundColor = item.fillStyle;
              box.style.borderRadius = '4px';
              box.style.marginRight = '4px';
              box.style.pointerEvents = 'none';

              // Label
              const label = document.createElement('span');
              label.style.display = 'flex';
              label.style.alignItems = 'center';
              const labelText = document.createTextNode(item.text);
              label.appendChild(labelText);

              li.appendChild(button);
              button.appendChild(box);
              button.appendChild(label);
              ul.appendChild(li);
            });
          },
        },
      ],
    });

    chartRef.current = newChart;

    return () => {
      newChart.destroy();
    };
  }, [data, currentTheme]); // recreate if data or theme changes

  // Update chart tooltip styles on theme change
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !chart.ctx) return;

    const {
      tooltipTitleColor,
      tooltipBodyColor,
      tooltipBackgroundColor,
      tooltipBorderColor,
    } = getThemeColors(currentTheme);

    if (darkMode) {
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBackgroundColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBackgroundColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }

    chart.update('none');
  }, [currentTheme]);

  return (
    <div className="grow flex flex-col justify-center">
      <div>
        <canvas ref={canvasRef} width={width} height={height}></canvas>
      </div>
      <div className="px-5 pt-2 pb-6">
        <ul ref={legendRef} className="flex flex-wrap justify-center -m-1"></ul>
      </div>
    </div>
  );
}

export default DoughnutChart;