import React, { useState, useEffect } from 'react';
import StudentDoughnutChart from '@/components/charts/StudentDoughnutChart';
import StudentBarChart from '@/components/charts/StudentBarChart';
import dashboardApi from '@/services/api/dashboardApi';

// Import utilities
import { getCSSVariable } from '@/utils/domUtils';

function DashboardStudentsPerState() {
  // =============================================================================
  // DATA SOURCE TOGGLE - Change this boolean to switch between Mock and Real API
  // =============================================================================
  const USE_MOCK_DATA = false; // Set to false to use real API
  // =============================================================================

  const [selectedFilter, setSelectedFilter] = useState('top10'); // 'top10' or region name
  const [chartType, setChartType] = useState('bar'); // 'doughnut' or 'bar'
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allStatesData, setAllStatesData] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filter options - updated to match your API region names
  const filterOptions = [
    { value: 'top10', label: 'Top 10 States' },
    { value: 'Northern India', label: 'Northern India' },
    { value: 'Southern India', label: 'Southern India' },
    { value: 'Western India', label: 'Western India' },
    { value: 'Eastern India', label: 'Eastern India' },
    { value: 'Northeastern India', label: 'Northeastern India' },
    { value: 'Central India', label: 'Central India' },
  ];

  // Colors for states - each state gets a unique color
  const stateColors = [
    getCSSVariable('--color-violet-500'),
    getCSSVariable('--color-sky-500'),
    getCSSVariable('--color-green-500'),
    getCSSVariable('--color-orange-500'),
    getCSSVariable('--color-red-500'),
    getCSSVariable('--color-indigo-500'),
    getCSSVariable('--color-pink-500'),
    getCSSVariable('--color-yellow-500'),
    getCSSVariable('--color-teal-500'),
    getCSSVariable('--color-purple-500'),
    getCSSVariable('--color-emerald-500'),
    getCSSVariable('--color-blue-500'),
    getCSSVariable('--color-cyan-500'),
    getCSSVariable('--color-lime-500'),
    getCSSVariable('--color-amber-500'),
    getCSSVariable('--color-rose-500'),
    getCSSVariable('--color-fuchsia-500'),
    getCSSVariable('--color-slate-500'),
    getCSSVariable('--color-gray-500'),
    getCSSVariable('--color-zinc-500'),
    getCSSVariable('--color-neutral-500'),
    getCSSVariable('--color-stone-500'),
    getCSSVariable('--color-red-400'),
    getCSSVariable('--color-orange-400'),
    getCSSVariable('--color-amber-400'),
    getCSSVariable('--color-yellow-400'),
    getCSSVariable('--color-lime-400'),
    getCSSVariable('--color-green-400'),
    getCSSVariable('--color-emerald-400'),
    getCSSVariable('--color-teal-400'),
    getCSSVariable('--color-cyan-400'),
    getCSSVariable('--color-sky-400'),
    getCSSVariable('--color-blue-400'),
    getCSSVariable('--color-indigo-400'),
    getCSSVariable('--color-violet-400'),
    getCSSVariable('--color-purple-400'),
  ];

  const stateHoverColors = [
    getCSSVariable('--color-violet-600'),
    getCSSVariable('--color-sky-600'),
    getCSSVariable('--color-green-600'),
    getCSSVariable('--color-orange-600'),
    getCSSVariable('--color-red-600'),
    getCSSVariable('--color-indigo-600'),
    getCSSVariable('--color-pink-600'),
    getCSSVariable('--color-yellow-600'),
    getCSSVariable('--color-teal-600'),
    getCSSVariable('--color-purple-600'),
    getCSSVariable('--color-emerald-600'),
    getCSSVariable('--color-blue-600'),
    getCSSVariable('--color-cyan-600'),
    getCSSVariable('--color-lime-600'),
    getCSSVariable('--color-amber-600'),
    getCSSVariable('--color-rose-600'),
    getCSSVariable('--color-fuchsia-600'),
    getCSSVariable('--color-slate-600'),
    getCSSVariable('--color-gray-600'),
    getCSSVariable('--color-zinc-600'),
    getCSSVariable('--color-neutral-600'),
    getCSSVariable('--color-stone-600'),
    getCSSVariable('--color-red-500'),
    getCSSVariable('--color-orange-500'),
    getCSSVariable('--color-amber-500'),
    getCSSVariable('--color-yellow-500'),
    getCSSVariable('--color-lime-500'),
    getCSSVariable('--color-green-500'),
    getCSSVariable('--color-emerald-500'),
    getCSSVariable('--color-teal-500'),
    getCSSVariable('--color-cyan-500'),
    getCSSVariable('--color-sky-500'),
    getCSSVariable('--color-blue-500'),
    getCSSVariable('--color-indigo-500'),
    getCSSVariable('--color-violet-500'),
    getCSSVariable('--color-purple-500'),
  ];

  useEffect(() => {
    // Only fetch if both dates are selected or both are empty
    if ((dateFrom && dateTo) || (!dateFrom && !dateTo)) {
      fetchStudentsPerStateData();
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    if (allStatesData.length > 0) {
      updateChartData();
    }
  }, [selectedFilter, chartType, allStatesData]);

  const fetchStudentsPerStateData = async () => {
    setLoading(true);
    try {
      let response;

      if (USE_MOCK_DATA) {
        // Using Mock Data
        const { getMockStudentsPerStateData } = await import('@/data/mockStudentsPerStateData');
        response = await getMockStudentsPerStateData();
      } else {
        // Using Real API - reuse the students stats API with date range
        const params = {};
        if (dateFrom) params.dateFrom = dateFrom;
        if (dateTo) params.dateTo = dateTo;
        
        response = await dashboardApi.getStudentsStats(params);
      }

      if (response.success && response.data) {
        // Transform the studentsByState data to match expected format
        if (USE_MOCK_DATA && response.data.states) {
          setAllStatesData(response.data.states);
        } else if (response.data.studentsByState) {
          // Transform your API format to expected format
          const transformedStates = response.data.studentsByState.map(state => ({
            state_name: state.stateName,
            student_count: state.count,
            region_name: state.regionName
          }));
          
          // Sort by student count (descending) for better visualization
          transformedStates.sort((a, b) => b.student_count - a.student_count);
          
          setAllStatesData(transformedStates);
        } else {
          setAllStatesData([]);
        }
      } else {
        setAllStatesData([]);
      }
    } catch (error) {
      console.error('Error fetching students per state data:', error);
      setAllStatesData([]);
    } finally {
      setLoading(false);
    }
  };

  const updateChartData = () => {
    if (allStatesData.length === 0) {
      setChartData(null);
      return;
    }

    let filteredData = [];

    if (selectedFilter === 'top10') {
      // Show top 10 states
      filteredData = allStatesData.slice(0, 10);
    } else {
      // Show states from selected region using region_name
      filteredData = allStatesData.filter(state => state.region_name === selectedFilter);
    }

    if (filteredData.length === 0) {
      setChartData(null);
      return;
    }

    // Assign unique colors to each state
    const colors = filteredData.map((_, index) => 
      stateColors[index % stateColors.length]
    );
    const hoverColors = filteredData.map((_, index) => 
      stateHoverColors[index % stateHoverColors.length]
    );

    const newChartData = {
      labels: filteredData.map(state => state.state_name),
      datasets: [
        {
          label: 'Students',
          data: filteredData.map(state => state.student_count),
          backgroundColor: colors,
          hoverBackgroundColor: hoverColors,
          borderWidth: 0,
          ...(chartType === 'bar' && {
            barPercentage: 0.7,
            categoryPercentage: 0.8,
            borderRadius: 4,
          }),
        },
      ],
    };
    
    setChartData(newChartData);
  };

  const chartOptions = {
    ...(chartType === 'doughnut' && {
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 12,
            font: {
              size: 11
            },
            color: getCSSVariable('--color-gray-300'), // Light color for dark mode
            generateLabels: function(chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i];
                  return {
                    text: `${label} (${value})`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    strokeStyle: data.datasets[0].backgroundColor[i],
                    lineWidth: 0,
                    pointStyle: 'circle',
                    hidden: false,
                    index: i,
                    fontColor: getCSSVariable('--color-gray-300') // Ensure text color for dark mode
                  };
                });
              }
              return [];
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} students (${percentage}%)`;
            }
          }
        }
      },
      maintainAspectRatio: false,
      responsive: true
    }),
    ...(chartType === 'bar' && {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.parsed.y} students`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: getCSSVariable('--color-gray-400'),
            maxRotation: 45,
            font: {
              size: 10
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: getCSSVariable('--color-gray-200'),
            lineWidth: 0.5,
            drawBorder: true,
            borderColor: getCSSVariable('--color-gray-300'),
            borderWidth: 1
          },
          ticks: {
            color: getCSSVariable('--color-gray-400')
          }
        }
      },
      maintainAspectRatio: false,
      responsive: true
    })
  };

  const totalStudents = allStatesData.reduce((sum, state) => sum + state.student_count, 0);
  const filteredStudents = chartData ? chartData.datasets[0].data.reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex flex-col gap-4">
          {/* Title and Controls */}
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                  Students per State
                </h2>
                {/* Data Source Indicator */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  USE_MOCK_DATA 
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                }`}>
                  {USE_MOCK_DATA ? '🧪 Mock Data' : '🌐 Live Data'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Showing {filteredStudents} of {totalStudents} total students
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Chart Type Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setChartType('doughnut')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    chartType === 'doughnut'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  Pie
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    chartType === 'bar'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  Bar
                </button>
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none cursor-pointer min-w-[140px]"
                >
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">From:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">To:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                min={dateFrom || undefined}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => {
                setDateFrom('');
                setDateTo('');
              }}
              className="px-3 py-1 text-sm bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700 text-white rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </header>
      
      {/* Chart Content */}
      <div className="flex-grow p-3">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
            <span className="ml-2 text-gray-500 dark:text-gray-400">Loading...</span>
          </div>
        ) : chartData ? (
          <div className="h-80">
            {chartType === 'doughnut' ? (
              <StudentDoughnutChart 
                data={chartData} 
                options={chartOptions}
              />
            ) : (
              <StudentBarChart 
                data={chartData} 
                options={chartOptions}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No data available for selected filter
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardStudentsPerState;