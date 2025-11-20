import React, { useState, useEffect } from 'react';
import DoughnutChart from '@/components/charts/DoughnutChart';
import transactionsApi from '@/services/api/transactionsApi';

// Import utilities
import { getCSSVariable } from '@/utils/domUtils';

function DashboardExpensesByCategory() {
  const [selectedType, setSelectedType] = useState('expense');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Default colors for the chart (10 colors for up to 10 categories)
  const colors = [
    getCSSVariable('--color-violet-500'),
    getCSSVariable('--color-sky-500'),
    getCSSVariable('--color-green-500'),
    getCSSVariable('--color-orange-500'),
    getCSSVariable('--color-red-500'),
    getCSSVariable('--color-violet-800'),
    getCSSVariable('--color-sky-800'),
    getCSSVariable('--color-green-800'),
    getCSSVariable('--color-orange-800'),
    getCSSVariable('--color-red-800'),
  ];

  const hoverColors = [
    getCSSVariable('--color-violet-600'),
    getCSSVariable('--color-sky-600'),
    getCSSVariable('--color-green-600'),
    getCSSVariable('--color-orange-600'),
    getCSSVariable('--color-red-600'),
    getCSSVariable('--color-violet-900'),
    getCSSVariable('--color-sky-900'),
    getCSSVariable('--color-green-900'),
    getCSSVariable('--color-orange-900'),
    getCSSVariable('--color-red-900'),
  ];

  useEffect(() => {
    fetchCategoriesData();
  }, [selectedType, startDate, endDate]);

  const fetchCategoriesData = async () => {
    setLoading(true);
    try {
      const params = {};
      
      // Add date range if dates are provided
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await transactionsApi.getCategoryWiseByType(selectedType, params);

      if (response.success && response.data && response.data.categories) {
        const categories = response.data.categories;
        
        // Truncate long category names for better display
        const truncateLabel = (label, maxLength = 15) => {
          return label.length > maxLength ? label.substring(0, maxLength) + '...' : label;
        };

        const newChartData = {
          labels: categories.map(cat => truncateLabel(cat.name)),
          datasets: [
            {
              label: `${selectedType === 'expense' ? 'Expenses' : 'Income'} by Category`,
              data: categories.map(cat => cat.amount),
              backgroundColor: colors.slice(0, categories.length),
              hoverBackgroundColor: hoverColors.slice(0, categories.length),
              borderWidth: 0,
            },
          ],
        };
        
        setChartData(newChartData);
      } else {
        // No data available
        setChartData(null);
      }
    } catch (error) {
      console.error('Error fetching categories data:', error);
      // Show error state instead of mock data
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex flex-col gap-4">
          {/* Title and Type Dropdown */}
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">
              {selectedType === 'expense' ? 'Expenses' : 'Income'} by Category
            </h2>
            
            {/* Type Dropdown */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent min-w-[120px] w-auto appearance-none cursor-pointer"
              >
                <option value="expense">Expenses</option>
                <option value="income">Income</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Date Range:</span>
            
            {/* Start Date */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            
            {/* End Date */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            
            {/* Clear Dates Button */}
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Chart built with Chart.js 3 */}
      <div className="flex-grow flex items-center justify-center">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
            <span className="ml-2 text-gray-500 dark:text-gray-400">Loading...</span>
          </div>
        ) : chartData ? (
          <DoughnutChart 
            data={chartData} 
            width={600} 
            height={300}
            options={{
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                      size: 12
                    }
                  }
                }
              },
              maintainAspectRatio: false,
              responsive: true
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardExpensesByCategory;