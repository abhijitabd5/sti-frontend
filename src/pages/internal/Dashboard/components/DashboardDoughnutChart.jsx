import React from 'react';
import DoughnutChart from '@/components/charts/DoughnutChart';

// Import utilities
import { getCSSVariable } from '@/utils/domUtils';

function DashboardDoughnutChart() {

  const chartData = {
    labels: ['United States', 'Italy', 'Other'],
    datasets: [
      {
        label: 'Top Countries',
        data: [
          35, 30, 35,
        ],
        backgroundColor: [
          getCSSVariable('--color-violet-500'),
          getCSSVariable('--color-sky-500'),
          getCSSVariable('--color-violet-800'),
        ],
        hoverBackgroundColor: [
          getCSSVariable('--color-violet-600'),
          getCSSVariable('--color-sky-600'),
          getCSSVariable('--color-violet-900'),
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Top Expenses</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <DoughnutChart data={chartData} width={389} height={260} />
    </div>
  );
}

export default DashboardDoughnutChart;
