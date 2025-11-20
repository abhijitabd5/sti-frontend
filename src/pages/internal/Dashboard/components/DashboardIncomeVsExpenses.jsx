import React, { useState, useEffect } from 'react';
import BarChart from '@/components/charts/BarChart';
import transactionsApi from '@/services/api/transactionsApi';

// Import utilities
import { getCSSVariable } from '@/utils/domUtils';


function DashboardIncomeVsExpenses() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchIncomeExpenseData();
  }, [selectedPeriod]);

  const fetchIncomeExpenseData = async () => {
    setLoading(true);
    try {
      const params = {
        period: selectedPeriod
      };
      
      // Add date range if dates are provided
      // if (startDate) params.from = startDate;
      // if (endDate) params.to = endDate;

      const response = await transactionsApi.getIncomeVsExpense(params);

      if (response.success && response.data && response.data.chart_data) {
        const data = response.data.chart_data;
        
        let newChartData;
        
        // Format period to proper date format for Chart.js time scale
        const formatPeriodToDate = (period) => {
          // Handle both "2025-06" and "2025-01" formats
          if (period.includes('-')) {
            const [year, month] = period.split('-');
            return `${month.padStart(2, '0')}-01-${year}`;
          }
          // Fallback for other formats
          return `01-01-${period}`;
        };
        
        newChartData = {
          labels: data.map(item => formatPeriodToDate(item.period)),
          datasets: [
            {
              label: 'Income',
              data: data.map(item => Number(item.income) || 0),
              backgroundColor: getCSSVariable('--color-sky-500'),
              hoverBackgroundColor: getCSSVariable('--color-sky-600'),
              barPercentage: 0.7,
              categoryPercentage: 0.7,
              borderRadius: 4,
            },
            {
              label: 'Expenses',
              data: data.map(item => Number(item.expenses) || 0),
              backgroundColor: getCSSVariable('--color-violet-500'),
              hoverBackgroundColor: getCSSVariable('--color-violet-600'),
              barPercentage: 0.7,
              categoryPercentage: 0.7,
              borderRadius: 4,
            },
          ],
        };
        
        setChartData(newChartData);
      } else {
        // No data available
        setChartData(null);
      }
    } catch (error) {
      console.error('Error fetching income vs expense data:', error);
      // Show error state
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        {/* Title and Period Dropdown */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Income Vs Expenses</h2>
          
          {/* Period Dropdown */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent min-w-[100px] w-auto appearance-none cursor-pointer"
            >
              <option value="month">Last 6 Months</option>
              <option value="year">Current Year</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Date Range Inputs - Commented Out */}
        {/* <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Date Range:</span>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          
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
        </div> */}
      </header>
      
      {/* Chart Content */}
      <div className="p-3">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
            <span className="ml-2 text-gray-500 dark:text-gray-400">Loading...</span>
          </div>
        ) : chartData ? (
          <BarChart data={chartData} width={800} height={300} />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardIncomeVsExpenses;