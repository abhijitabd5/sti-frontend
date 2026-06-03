import React, { useState, useEffect } from 'react';
import BarChart from '@/components/charts/BarChart';
import transactionApi from '@/services/api/transactionApi';
import { MonthPicker } from '@/components/ui/Internal/MonthPicker';
import { format, parse } from 'date-fns';

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

    // Parse dates from dd-MM-yyyy format
    const fromDate = parse(from, 'dd-MM-yyyy', new Date());
    const toDate = parse(to, 'dd-MM-yyyy', new Date());
    
    // Calculate difference in months
    const monthsDiff = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + 
                       (toDate.getMonth() - fromDate.getMonth());
    
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
      const params = {};
      
      // If custom date range is provided, use that (takes priority over period)
      if (dateFrom && dateTo) {
        const fromDate = parse(dateFrom, 'dd-MM-yyyy', new Date());
        const toDate = parse(dateTo, 'dd-MM-yyyy', new Date());
        
        // For 'from': use the first day of the month (already is)
        // For 'to': use the last day of the month to include the entire month
        const toDateEndOfMonth = new Date(toDate.getFullYear(), toDate.getMonth() + 1, 0);
        
        // Send dates in YYYY-MM-DD format
        params.from = format(fromDate, 'yyyy-MM-dd');
        params.to = format(toDateEndOfMonth, 'yyyy-MM-dd');
      } else {
        // Otherwise, use the selected period (month or year)
        params.period = selectedPeriod;
      }

      const response = await transactionApi.getIncomeVsExpense(params);

      if (response.success && response.data && response.data.chart_data) {
        const data = response.data.chart_data;
        
        let newChartData;
        
        // Format period to MM-DD-YYYY format for Chart.js time scale
        // This ensures each month is displayed as the 1st day of that month
        const formatPeriodToDate = (period) => {
          // Parse "2026-01" format to "01-01-2026" (MM-DD-YYYY)
          if (period.includes('-')) {
            const [year, month] = period.split('-');
            // MM-DD-YYYY format: month-day-year
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
            {
              label: 'Investment',
              data: data.map(item => Number(item.investment) || 0),
              backgroundColor: getCSSVariable('--color-emerald-500'),
              hoverBackgroundColor: getCSSVariable('--color-emerald-600'),
              barPercentage: 0.7,
              categoryPercentage: 0.7,
              borderRadius: 4,
            },
          ],
        };
        
        console.log('=== Formatted Chart Data ===');
        console.log('Labels:', newChartData.labels);
        console.log('Income data:', newChartData.datasets[0].data);
        console.log('Expenses data:', newChartData.datasets[1].data);
        console.log('Investment data:', newChartData.datasets[2].data);
        
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
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Income vs Expenses vs Investment</h2>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Month Range - Two Separate Month Pickers */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">From:</label>
              <MonthPicker
                value={dateFrom}
                onChange={(value) => {
                  setDateFrom(value);
                  validateDateRange(value, dateTo);
                }}
                placeholder="Select month"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">To:</label>
              <MonthPicker
                value={dateTo}
                onChange={(value) => {
                  setDateTo(value);
                  validateDateRange(dateFrom, value);
                }}
                placeholder="Select month"
                disabled={!dateFrom}
                minDate={dateFrom}
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