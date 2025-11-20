import React, { useState, useEffect } from 'react';
import transactionsApi from '@/services/api/transactionsApi';

function SimpleIncomeExpenseChart() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchIncomeExpenseData();
  }, [selectedPeriod, startDate, endDate]);

  const fetchIncomeExpenseData = async () => {
    setLoading(true);
    try {
      const params = {
        period: selectedPeriod
      };
      
      if (startDate) params.from = startDate;
      if (endDate) params.to = endDate;

      const response = await transactionsApi.getIncomeVsExpense(params);

      if (response.success && response.data && response.data.chart_data) {
        setChartData(response.data.chart_data);
      } else {
        setChartData([]);
      }
    } catch (error) {
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMaxValue = () => {
    if (chartData.length === 0) return 100;
    const maxIncome = Math.max(...chartData.map(item => item.income));
    const maxExpense = Math.max(...chartData.map(item => item.expenses));
    return Math.max(maxIncome, maxExpense) * 1.1; // Add 10% padding
  };

  const getBarHeight = (value, maxValue) => {
    return Math.max((value / maxValue) * 100, 1); // Minimum 1% height for visibility
  };

  const maxValue = getMaxValue();

  return (
    <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl mt-6">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        {/* Title and Period Dropdown */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Simple Income Vs Expenses Chart
          </h2>
          
          {/* Period Dropdown */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent min-w-[100px] w-auto appearance-none cursor-pointer"
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
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
        </div>
      </header>
      
      {/* Chart Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
            <span className="ml-2 text-gray-500 dark:text-gray-400">Loading...</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No data available
          </div>
        ) : (
          <div>
            {/* Legend */}
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-sky-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-violet-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
              </div>
            </div>

            {/* Chart */}
            <div className="relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-80 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2">
                <span>{formatCurrency(maxValue)}</span>
                <span>{formatCurrency(maxValue * 0.75)}</span>
                <span>{formatCurrency(maxValue * 0.5)}</span>
                <span>{formatCurrency(maxValue * 0.25)}</span>
                <span>₹0</span>
              </div>

              {/* Chart area */}
              <div className="ml-16 border-l border-b border-gray-200 dark:border-gray-600 h-80 relative">
                {/* Grid lines */}
                <div className="absolute inset-0">
                  {[0.25, 0.5, 0.75].map((ratio) => (
                    <div
                      key={ratio}
                      className="absolute w-full border-t border-gray-100 dark:border-gray-700"
                      style={{ bottom: `${ratio * 100}%` }}
                    ></div>
                  ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-around px-4">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      {/* Bars container */}
                      <div className="flex items-end gap-1 mb-2">
                        {/* Income bar */}
                        <div className="relative group">
                          <div
                            className="bg-sky-500 hover:bg-sky-600 transition-colors duration-200 rounded-t"
                            style={{
                              width: '20px',
                              height: `${getBarHeight(item.income, maxValue) * 3.2}px`
                            }}
                          ></div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Income: {formatCurrency(item.income)}
                          </div>
                        </div>

                        {/* Expenses bar */}
                        <div className="relative group">
                          <div
                            className="bg-violet-500 hover:bg-violet-600 transition-colors duration-200 rounded-t"
                            style={{
                              width: '20px',
                              height: `${getBarHeight(item.expenses, maxValue) * 3.2}px`
                            }}
                          ></div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Expenses: {formatCurrency(item.expenses)}
                          </div>
                        </div>
                      </div>

                      {/* X-axis label */}
                      <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-sky-500">
                    {formatCurrency(chartData.reduce((sum, item) => sum + item.income, 0))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Income</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-violet-500">
                    {formatCurrency(chartData.reduce((sum, item) => sum + item.expenses, 0))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleIncomeExpenseChart;