import React, { useRef, useEffect, useState } from "react";
import { useThemeProvider } from "@/contexts/ThemeContext";
import { getThemeColors } from "@/components/charts/config/chartTheme";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-moment";

// Import utilities
import { formatCurrencyINR } from "@/utils/formatters";

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  TimeScale,
  Tooltip,
  Legend
);

function FlexibleBarChart({ data, width, height, useTimeScale = false }) {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const legend = useRef(null);
  const { currentTheme } = useThemeProvider();

  console.log('FlexibleBarChart rendered with:', { data, useTimeScale });

  // Resolve theme colors once per render
  const {
    textColor,
    gridColor,
    tooltipBodyColor,
    tooltipBackgroundColor,
    tooltipBorderColor,
  } = getThemeColors(currentTheme);

  useEffect(() => {
    const ctx = canvas.current;
    if (!ctx) return;

    const xScaleConfig = useTimeScale ? {
      type: "time",
      time: {
        parser: "MM-DD-YYYY",
        unit: "month",
        displayFormats: { month: "MMM YY" },
      },
      border: { display: false },
      grid: { display: false },
      ticks: { color: textColor },
    } : {
      type: "category",
      border: { display: false },
      grid: { display: false },
      ticks: { color: textColor },
    };

    const newChart = new Chart(ctx, {
      type: "bar",
      data,
      options: {
        layout: {
          padding: { top: 12, bottom: 16, left: 20, right: 20 },
        },
        scales: {
          y: {
            border: { display: false },
            ticks: {
              maxTicksLimit: 5,
              callback: (value) => formatCurrencyINR(value),
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
          x: xScaleConfig,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: () => false, // Disable tooltip title
              label: (context) => formatCurrencyINR(context.parsed.y),
            },
            bodyColor: tooltipBodyColor,
            backgroundColor: tooltipBackgroundColor,
            borderColor: tooltipBorderColor,
          },
        },
        interaction: { intersect: false, mode: "nearest" },
        animation: { duration: 500 },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
      plugins: [
        {
          id: "htmlLegend",
          afterUpdate(c) {
            const ul = legend.current;
            if (!ul) return;

            // Clear old legend
            while (ul.firstChild) {
              ul.firstChild.remove();
            }

            // Generate legend items
            const items = c.options.plugins.legend.labels.generateLabels(c);
            items.forEach((item) => {
              const li = document.createElement("li");

              // Button element
              const button = document.createElement("button");
              button.style.display = "inline-flex";
              button.style.alignItems = "center";
              button.style.opacity = item.hidden ? ".3" : "";
              button.onclick = () => {
                c.setDatasetVisibility(
                  item.datasetIndex,
                  !c.isDatasetVisible(item.datasetIndex)
                );
                c.update();
              };

              // Color box
              const box = document.createElement("span");
              box.style.display = "block";
              box.style.width = "12px";
              box.style.height = "12px";
              box.style.borderRadius = "calc(infinity * 1px)";
              box.style.marginRight = "8px";
              box.style.borderWidth = "3px";
              box.style.borderColor = item.fillStyle;
              box.style.pointerEvents = "none";

              // Label container
              const labelContainer = document.createElement("span");
              labelContainer.style.display = "flex";
              labelContainer.style.alignItems = "center";

              const value = document.createElement("span");
              value.classList.add("text-gray-800", "dark:text-gray-100");
              value.style.fontSize = "30px";
              value.style.lineHeight = "calc(2.25 / 1.875)";
              value.style.fontWeight = "700";
              value.style.marginRight = "8px";
              value.style.pointerEvents = "none";

              const label = document.createElement("span");
              label.classList.add("text-gray-500", "dark:text-gray-400");
              label.style.fontSize = "14px";
              label.style.lineHeight = "calc(1.25 / 0.875)";

              // Values
              const theValue = c.data.datasets[item.datasetIndex].data.reduce(
                (a, b) => a + b,
                0
              );
              const valueText = document.createTextNode(
                formatCurrencyINR(theValue)
              );
              const labelText = document.createTextNode(item.text);

              value.appendChild(valueText);
              label.appendChild(labelText);

              li.appendChild(button);
              button.appendChild(box);
              button.appendChild(labelContainer);
              labelContainer.appendChild(value);
              labelContainer.appendChild(label);

              ul.appendChild(li);
            });
          },
        },
      ],
    });

    setChart(newChart);
    return () => newChart.destroy();
  }, [
    data,
    useTimeScale,
    textColor,
    gridColor,
    tooltipBodyColor,
    tooltipBackgroundColor,
    tooltipBorderColor,
  ]);

  // Update chart theme on theme switch
  useEffect(() => {
    if (!chart || !chart.ctx) return;

    const {
      textColor,
      gridColor,
      tooltipBodyColor,
      tooltipBackgroundColor,
      tooltipBorderColor,
    } = getThemeColors(currentTheme);

    chart.options.scales.x.ticks.color = textColor;
    chart.options.scales.y.ticks.color = textColor;
    chart.options.scales.y.grid.color = gridColor;
    chart.options.plugins.tooltip.bodyColor = tooltipBodyColor;
    chart.options.plugins.tooltip.backgroundColor = tooltipBackgroundColor;
    chart.options.plugins.tooltip.borderColor = tooltipBorderColor;

    chart.update("none");
  }, [currentTheme, chart]);

  return (
    <React.Fragment>
      <div className="px-5 py-3">
        <ul ref={legend} className="flex flex-wrap gap-x-4"></ul>
      </div>
      <div className="grow">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
    </React.Fragment>
  );
}

export default FlexibleBarChart;