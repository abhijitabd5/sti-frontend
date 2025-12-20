import React, { useState, useEffect } from 'react';
import StudentDoughnutChart from '@/components/charts/StudentDoughnutChart';
import StudentBarChart from '@/components/charts/StudentBarChart';
import dashboardApi from '@/services/api/dashboardApi';

// Import utilities
import { getCSSVariable } from '@/utils/domUtils';

function DashboardStudentsPerCourse() {
  // =============================================================================
  // DATA SOURCE TOGGLE - Change this boolean to switch between Mock and Real API
  // =============================================================================
  const USE_MOCK_DATA = false; // Set to false to use real API
  // =============================================================================

  const [selectedFilter, setSelectedFilter] = useState('top10'); // 'top10', 'operator_training', or 'technician_training'
  const [chartType, setChartType] = useState('bar'); // 'doughnut' or 'bar'
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allCoursesData, setAllCoursesData] = useState([]);

  // Filter options
  const filterOptions = [
    { value: 'top10', label: 'Top 10 Courses' },
    { value: 'operator_training', label: 'Operator Training' },
    { value: 'technician_training', label: 'Technician Training' },
  ];

  // Colors for courses - each course gets a unique color
  const courseColors = [
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
  ];

  const courseHoverColors = [
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
  ];

  useEffect(() => {
    fetchStudentsPerCourseData();
  }, []);

  useEffect(() => {
    if (allCoursesData.length > 0) {
      updateChartData();
    }
  }, [selectedFilter, chartType, allCoursesData]);

  const fetchStudentsPerCourseData = async () => {
    setLoading(true);
    try {
      // Using the same students stats API that includes studentsByCourse data
      const response = await dashboardApi.getStudentsStats();

      if (response.success && response.data && response.data.studentsByCourse) {
        // Transform the API data to match expected format
        const transformedCourses = response.data.studentsByCourse.map(course => ({
          course_name: course.courseDisplayName || course.courseName,
          student_count: course.count,
          course_type: course.courseType
        }));
        
        // Sort by student count (descending) for better visualization
        transformedCourses.sort((a, b) => b.student_count - a.student_count);
        
        setAllCoursesData(transformedCourses);
      } else {
        setAllCoursesData([]);
      }
    } catch (error) {
      console.error('Error fetching students per course data:', error);
      setAllCoursesData([]);
    } finally {
      setLoading(false);
    }
  };

  const updateChartData = () => {
    if (allCoursesData.length === 0) {
      setChartData(null);
      return;
    }

    let filteredData = [];

    if (selectedFilter === 'top10') {
      // Show top 10 courses (data is already sorted by student count descending)
      filteredData = allCoursesData.slice(0, 10);
    } else {
      // Show courses from selected type, then take top 10 if more than 10
      const typeFilteredData = allCoursesData.filter(course => course.course_type === selectedFilter);
      filteredData = typeFilteredData.slice(0, 10);
    }

    if (filteredData.length === 0) {
      setChartData(null);
      return;
    }

    // Assign unique colors to each course
    const colors = filteredData.map((_, index) => 
      courseColors[index % courseColors.length]
    );
    const hoverColors = filteredData.map((_, index) => 
      courseHoverColors[index % courseHoverColors.length]
    );

    const newChartData = {
      labels: filteredData.map(course => course.course_name),
      datasets: [
        {
          label: 'Students',
          data: filteredData.map(course => course.student_count),
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

  const totalStudents = allCoursesData.reduce((sum, course) => sum + course.student_count, 0);
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
                  Students per Course
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

export default DashboardStudentsPerCourse;