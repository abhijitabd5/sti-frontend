import React, { useState, useEffect } from 'react';
import BarChart from '@/components/charts/BarChart';
import transactionApi from '@/services/api/transactionApi';

// Import utilities
import { getCSSVariable } from '@/utils/domUtils';


function DashboardIncomeVsExpenses() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dateError, setDateError] = useState('');

  // Validate date range (max 12 months)
  const validateDateRange = (from, to) => {
    if (!from || !to) {
      setDateError('');
      return true;
    }

    const [fromYear, fromMonth] = from.split('-').map(Number);
    const [toYear, toMonth] = to.split('-').map(Number);
    
    // Calculate difference in months
    const monthsDiff = (toYear - fromYear) * 12 + (toMonth - fromMonth);
    
    if (monthsDiff > 12) {
      setDateError('Date range cannot exceed 12 months');
      return false;
    }
    
    if (monthsDiff < 0) {
      setDateError('End month cannot be before start month');
      return false;
    }
    
    setDateError('');
    return true;
  };

  const handleDateFromChange = (value) => {
    setDateFrom(value);
    validateDateRange(value, dateTo);
  };

  const handleDateToChange = (value) => {
    setDateTo(value);
    validateDateRange(dateFrom, value);
  };

  useEffect(() => {
    // Only fetch if both dates are selected or both are empty
    if ((dateFrom && dateTo) || (!dateFrom && !dateTo)) {
      fetchIncomeExpenseData();
    }
  }, [selectedPeriod, dateFrom, dateTo]);

  const fetchIncomeExpenseData = async () => {
    // Don't fetch if there's a date validation error
    if (dateError) {
      return;
    }
    
    setLoading(true);
    try {
      const params = {
        period: selectedPeriod
      };
      
      // Add date range if dates are provided
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;

      const response = await transactionApi.getIncomeVsExpense(params);

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
        {/* Title, Period Dropdown, and Date Range - All in One Row */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Income Vs Expenses</h2>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Date Range Inputs - Month Only */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">From:</label>
              <input
                type="month"
                value={dateFrom}
                onChange={(e) => handleDateFromChange(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">To:</label>
              <input
                type="month"
                value={dateTo}
                onChange={(e) => handleDateToChange(e.target.value)}
                min={dateFrom || undefined}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => {
                setDateFrom('');
                setDateTo('');
                setDateError('');
              }}
              className="px-3 py-1 text-sm bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700 text-white rounded-lg transition-colors"
            >
              Clear
            </button>

            {/* Period Dropdown */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-1 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent min-w-[140px] w-auto appearance-none cursor-pointer"
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
        </div>

        {/* Error Message */}
        {dateError && (
          <div className="mt-3 text-sm text-red-600 dark:text-red-400">
            {dateError}
          </div>
        )}
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