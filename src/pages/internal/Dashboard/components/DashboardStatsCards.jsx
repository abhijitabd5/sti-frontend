import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EditMenu from '@/components/ui/Internal/Dropdown/DropdownEditMenu';
import dashboardApi from '@/services/api/dashboardApi';

function DashboardStatsCards() {
  const [studentsData, setStudentsData] = useState({
    title: "Total Students",
    value: "0",
    percentage: "0%",
    links: {
      link1Text: "Active Students",
      link2Text: "Graduated Students",
    },
  });

  const [enquiriesData, setEnquiriesData] = useState({
    title: "Total Enquiries",
    value: "0",
    percentage: "0%",
    breakdown: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    
    // Fetch students data
    try {
      const studentsResponse = await dashboardApi.getStudentsStats();
      console.log('Students Response:', studentsResponse);
      
      if (studentsResponse?.success) {
        console.log('Processing students data:', studentsResponse.data.totalStudents);
        setStudentsData(prev => ({
          ...prev,
          value: studentsResponse.data.totalStudents.toString(),
          percentage: studentsResponse.data.growth || "0%"
        }));
      }
    } catch (studentsError) {
      console.error('Error fetching students stats:', studentsError);
      setStudentsData(prev => ({ ...prev, value: "0", percentage: "0%" }));
    }

    // Fetch enquiries data
    try {
      const enquiriesResponse = await dashboardApi.getEnquiriesStats();
      console.log('Enquiries Response:', enquiriesResponse);
      
      if (enquiriesResponse?.success) {
        // Transform the API response to match frontend expectations
        const breakdown = [
          { label: "Course Enquiries", value: enquiriesResponse.data.courseEnquiries || 0 },
          { label: "Contact Us", value: enquiriesResponse.data.contactUsEnquiries || 0 },
          { label: "Offline Enquiries", value: enquiriesResponse.data.offlineEnquiries || 0 }
        ];

        setEnquiriesData(prev => ({
          ...prev,
          value: enquiriesResponse.data.totalEnquiries.toString(),
          percentage: enquiriesResponse.data.growth || "0%",
          breakdown: breakdown
        }));
      }
    } catch (enquiriesError) {
      console.error('Error fetching enquiries stats:', enquiriesError);
      setEnquiriesData(prev => ({
        ...prev,
        value: "0",
        percentage: "0%",
        breakdown: []
      }));
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full h-full gap-3">
      {/* Total Students Card */}
      <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <div className="px-5 pt-5 pb-4">
          <header className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {studentsData.title}
            </h2>
            {/* <EditMenu align="right" className="relative inline-flex">
              <li>
                <Link 
                  className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" 
                  to="#0"
                >
                  {studentsData.links.link1Text}
                </Link>
              </li>
              <li>
                <Link 
                  className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" 
                  to="#0"
                >
                  {studentsData.links.link2Text}
                </Link>
              </li>
            </EditMenu> */}
          </header>

          {loading ? (
            <div className="flex items-center">
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-20 rounded mr-2"></div>
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-6 w-12 rounded-full"></div>
            </div>
          ) : error ? (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm">Data unavailable</span>
            </div>
          ) : (
            <div className="flex items-start">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
                {studentsData.value}
              </div>
              {studentsData.percentage !== "0%" && (
                <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">
                  {studentsData.percentage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Total Enquiries Card */}
      <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <div className="px-5 pt-5 pb-4">
          <header className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {enquiriesData.title}
            </h2>
            {/* <EditMenu align="right" className="relative inline-flex">
              <li>
                <Link 
                  className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" 
                  to="#0"
                >
                  View All
                </Link>
              </li>
              <li>
                <Link 
                  className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" 
                  to="#0"
                >
                  Export
                </Link>
              </li>
            </EditMenu> */}
          </header>

          {loading ? (
            <div className="flex items-center mb-3">
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-20 rounded mr-2"></div>
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-6 w-12 rounded-full"></div>
            </div>
          ) : error ? (
            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm">Data unavailable</span>
            </div>
          ) : (
            <div className="flex items-start mb-3">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
                {enquiriesData.value}
              </div>
              {enquiriesData.percentage !== "0%" && (
                <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">
                  {enquiriesData.percentage}
                </div>
              )}
            </div>
          )}

          {/* Enquiry Breakdown */}
          <div className="space-y-2">
            {loading ? (
              // Loading skeleton for breakdown
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-600 w-2 h-2 rounded-full mr-2"></div>
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-4 w-24 rounded"></div>
                  </div>
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-4 w-8 rounded"></div>
                </div>
              ))
            ) : error ? (
              <div className="text-center py-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Breakdown data unavailable
                </span>
              </div>
            ) : enquiriesData.breakdown.length > 0 ? (
              enquiriesData.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 
                      'bg-orange-500'
                    }`}></div>
                    <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {item.value}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  No breakdown data available
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStatsCards;