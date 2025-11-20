import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { SOURCES } from '@/config/constants';
import DatePickerWithRange from '@/components/ui/Internal/DatePicker/Datepicker';
import dashboardApi from '@/services/api/dashboardApi';

// Source icons mapping
const getSourceIcon = (source) => {
  const icons = {
    facebook: (
      <svg className="shrink-0 mr-2 sm:mr-3" width="36" height="36" viewBox="0 0 36 36">
        <circle fill="#1877F2" cx="18" cy="18" r="18" />
        <path
          d="M16.023 26 16 19h-3v-3h3v-2c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V16H23l-1 3h-2.72v7h-3.257Z"
          fill="#FFF"
          fillRule="nonzero"
        />
      </svg>
    ),
    instagram: (
      <svg className="shrink-0 mr-2 sm:mr-3" width="36" height="36" viewBox="0 0 36 36">
        <circle fill="#E4405F" cx="18" cy="18" r="18" />
        <path
          d="M18 11.5c2.1 0 2.4 0 3.2.1.8 0 1.2.2 1.5.3.4.1.6.3.9.6.3.3.5.5.6.9.1.3.2.7.3 1.5 0 .8.1 1.1.1 3.2s0 2.4-.1 3.2c0 .8-.2 1.2-.3 1.5-.1.4-.3.6-.6.9-.3.3-.5.5-.9.6-.3.1-.7.2-1.5.3-.8 0-1.1.1-3.2.1s-2.4 0-3.2-.1c-.8 0-1.2-.2-1.5-.3-.4-.1-.6-.3-.9-.6-.3-.3-.5-.5-.6-.9-.1-.3-.2-.7-.3-1.5 0-.8-.1-1.1-.1-3.2s0-2.4.1-3.2c0-.8.2-1.2.3-1.5.1-.4.3-.6.6-.9.3-.3.5-.5.9-.6.3-.1.7-.2 1.5-.3.8 0 1.1-.1 3.2-.1zm0-1.5c-2.1 0-2.4 0-3.3.1-.9 0-1.5.2-2 .4-.5.2-1 .5-1.4.9-.4.4-.7.9-.9 1.4-.2.5-.4 1.1-.4 2 0 .9-.1 1.2-.1 3.3s0 2.4.1 3.3c0 .9.2 1.5.4 2 .2.5.5 1 .9 1.4.4.4.9.7 1.4.9.5.2 1.1.4 2 .4.9 0 1.2.1 3.3.1s2.4 0 3.3-.1c.9 0 1.5-.2 2-.4.5-.2 1-.5 1.4-.9.4-.4.7-.9.9-1.4.2-.5.4-1.1.4-2 0-.9.1-1.2.1-3.3s0-2.4-.1-3.3c0-.9-.2-1.5-.4-2-.2-.5-.5-1-.9-1.4-.4-.4-.9-.7-1.4-.9-.5-.2-1.1-.4-2-.4-.9 0-1.2-.1-3.3-.1z"
          fill="#FFF"
        />
        <circle cx="18" cy="18" r="4.5" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <circle cx="22.5" cy="13.5" r="1.5" fill="#FFF" />
      </svg>
    ),
    youtube: (
      <svg className="shrink-0 mr-2 sm:mr-3" width="36" height="36" viewBox="0 0 36 36">
        <circle fill="#FF0000" cx="18" cy="18" r="18" />
        <path
          d="M25.8 14.4c-.1-.8-.5-1.4-1.2-1.5-1.1-.3-5.6-.3-5.6-.3s-4.5 0-5.6.3c-.7.1-1.1.7-1.2 1.5-.2 1.3-.2 4-.2 4s0 2.7.2 4c.1.8.5 1.4 1.2 1.5 1.1.3 5.6.3 5.6.3s4.5 0 5.6-.3c.7-.1 1.1-.7 1.2-1.5.2-1.3.2-4 .2-4s0-2.7-.2-4z"
          fill="#FFF"
        />
        <path d="M16.5 21.2V15.8l4.2 2.7-4.2 2.7z" fill="#FF0000" />
      </svg>
    ),
    whatsapp: (
      <svg className="shrink-0 mr-2 sm:mr-3" width="36" height="36" viewBox="0 0 36 36">
        <circle fill="#25D366" cx="18" cy="18" r="18" />
        <path
          d="M18 10c-4.4 0-8 3.6-8 8 0 1.4.4 2.8 1 4l-1 3.6 3.7-1c1.2.7 2.5 1 3.9 1 4.4 0 8-3.6 8-8s-3.6-8-7.6-8zm4.5 11.4c-.2.6-1.1 1.1-1.5 1.1-.4 0-.9-.1-1.5-.4-.6-.2-1.3-.6-1.8-1-.5-.4-.9-.9-1.2-1.4-.3-.5-.4-1-.4-1.5 0-.4.1-.7.3-.9.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .4.3l.6 1.4c.1.2.1.4 0 .6-.1.2-.2.3-.3.5l-.3.3c-.1.1-.2.2-.1.4.1.2.5.8.9 1.1.5.4 1 .6 1.2.7.2.1.3.1.4 0 .1-.1.5-.6.6-.8.1-.2.3-.2.5-.1l1.3.6c.2.1.3.2.4.3.1.1.1.3 0 .6z"
          fill="#FFF"
        />
      </svg>
    ),

    other: (
      <svg className="shrink-0 mr-2 sm:mr-3" width="36" height="36" viewBox="0 0 36 36">
        <circle fill="#8B5CF6" cx="18" cy="18" r="18" />
        <path
          d="M18 10c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-1 13h2v-2h-2v2zm0-4h2V11h-2v8z"
          fill="#FFF"
        />
      </svg>
    ),
  };
  return icons[source] || icons.other;
};

function DashboardSocialTraffic() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 10, 1), // November 1, 2025
    to: addDays(new Date(2025, 10, 1), 14), // November 15, 2025
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration - only sources provided by backend
  const mockData = [
    {
      source: 'facebook',
      today: { clicks: 45, conversions: 3 },
      week: { clicks: 285, conversions: 22 },
      month: { clicks: 1250, conversions: 85 },
      year: { clicks: 15000, conversions: 1200 },
      daterange: { clicks: 500, conversions: 40 }
    },
    {
      source: 'instagram',
      today: { clicks: 32, conversions: 2 },
      week: { clicks: 165, conversions: 18 },
      month: { clicks: 890, conversions: 65 },
      year: { clicks: 12000, conversions: 950 },
      daterange: { clicks: 380, conversions: 28 }
    },
    {
      source: 'youtube',
      today: { clicks: 28, conversions: 1 },
      week: { clicks: 128, conversions: 9 },
      month: { clicks: 650, conversions: 45 },
      year: { clicks: 8500, conversions: 680 },
      daterange: { clicks: 290, conversions: 22 }
    },
    {
      source: 'whatsapp',
      today: { clicks: 18, conversions: 2 },
      week: { clicks: 87, conversions: 6 },
      month: { clicks: 420, conversions: 28 },
      year: { clicks: 5200, conversions: 380 },
      daterange: { clicks: 180, conversions: 15 }
    },
    {
      source: 'other',
      today: { clicks: 12, conversions: 1 },
      week: { clicks: 65, conversions: 4 },
      month: { clicks: 280, conversions: 18 },
      year: { clicks: 3800, conversions: 250 },
      daterange: { clicks: 120, conversions: 8 }
    }
  ];

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch data for all periods with custom date range
      const params = {};
      
      // Add custom date range if both dates are selected
      if (dateRange.from && dateRange.to) {
        params.customFrom = format(dateRange.from, 'yyyy-MM-dd');
        params.customTo = format(dateRange.to, 'yyyy-MM-dd');
      }

      const response = await dashboardApi.getSourceAnalytics(params);
      
      // API returns data in the expected format
      if (response.success && response.data && response.data.sources) {
        setData(response.data.sources);
      } else {
        // Fallback to mock data if API response is unexpected
        setData(mockData);
      }
    } catch (error) {
      console.error('Error fetching source analytics:', error);
      // Fallback to mock data on error
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getSourceLabel = (source) => {
    const sourceConfig = SOURCES.find(s => s.value === source);
    return sourceConfig ? sourceConfig.label : source;
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const calculateConversionRate = (clicks, conversions) => {
    if (clicks === 0) return '0%';
    return ((conversions / clicks) * 100).toFixed(1) + '%';
  };

  const formatDataForPeriod = (sourceData, period) => {
    const data = sourceData[period] || { clicks: 0, conversions: 0 };
    return {
      clicks: formatNumber(data.clicks),
      conversions: data.conversions,
      rate: calculateConversionRate(data.clicks, data.conversions)
    };
  };

  return (
    <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Promotion Source Analytics</h2>
          
          {/* Date Range Picker for Custom Column */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Custom Range:</span>
            <DatePickerWithRange 
              className="min-w-[280px]"
              date={dateRange}
              setDate={setDateRange}
            />
          </div>
        </div>
      </header>
      
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Source</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Today</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Week</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Month</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Year</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Custom</div>
                </th>
              </tr>
            </thead>
            
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-500"></div>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((sourceData) => {
                  const todayData = formatDataForPeriod(sourceData, 'today');
                  const weekData = formatDataForPeriod(sourceData, 'week');
                  const monthData = formatDataForPeriod(sourceData, 'month');
                  const yearData = formatDataForPeriod(sourceData, 'year');
                  const customData = formatDataForPeriod(sourceData, 'daterange');
                  
                  return (
                    <tr key={sourceData.source}>
                      <td className="p-2">
                        <div className="flex items-center">
                          {getSourceIcon(sourceData.source)}
                          <div className="text-gray-800 dark:text-gray-100">
                            {getSourceLabel(sourceData.source)}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{todayData.clicks}</div>
                          <div className="text-xs text-green-500">{todayData.conversions} conv</div>
                          <div className="text-xs text-sky-500">{todayData.rate}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{weekData.clicks}</div>
                          <div className="text-xs text-green-500">{weekData.conversions} conv</div>
                          <div className="text-xs text-sky-500">{weekData.rate}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{monthData.clicks}</div>
                          <div className="text-xs text-green-500">{monthData.conversions} conv</div>
                          <div className="text-xs text-sky-500">{monthData.rate}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{yearData.clicks}</div>
                          <div className="text-xs text-green-500">{yearData.conversions} conv</div>
                          <div className="text-xs text-sky-500">{yearData.rate}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{customData.clicks}</div>
                          <div className="text-xs text-green-500">{customData.conversions} conv</div>
                          <div className="text-xs text-sky-500">{customData.rate}</div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default DashboardSocialTraffic;
