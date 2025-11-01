import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import WebsiteLayout from '@/components/common/Layouts/WebsiteLayout';
import ApplyNow from '@/components/common/ApplyNow/ApplyNow';
import { publicCourseApi } from '@/services/api/publicCourseApi';
import { useLanguage } from '@/contexts/LanguageContext';
import EnrollModal from '@/components/common/Modal/EnrollModal';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCurrentLanguageObj } = useLanguage();
  const languageCode = useMemo(() => getCurrentLanguageObj()?.code || 'en', [getCurrentLanguageObj]);

  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  useEffect(() => {
    let active = true;
    const loadCourseData = async () => {
      try {
        setLoading(true);
        const [courseData, allCourses] = await Promise.all([
          publicCourseApi.getCourseById(id),
          publicCourseApi.getCourses({ language: languageCode, sortBy: 'display_order', sortOrder: 'ASC' })
        ]);
        if (!active) return;
        setCourse(courseData);
        // Related: same group if available, otherwise first 3 others
        const related = (allCourses || [])
          .filter(c => c.id !== courseData.id && (c.course_group_id && courseData.course_group_id ? c.course_group_id === courseData.course_group_id : true))
          .slice(0, 3);
        setRelatedCourses(related);
      } catch (error) {
        console.error('Error loading course:', error);
        navigate('/courses');
      } finally {
        if (active) setLoading(false);
      }
    };

    if (id) {
      loadCourseData();
    }
    return () => { active = false; };
  }, [id, languageCode, navigate]);

  const formatINR = (price) => {
    const num = Number(price);
    if (!isFinite(num)) return '';
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
    } catch {
      return `${num}`;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'curriculum', name: 'Curriculum', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'requirements', name: 'Requirements', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'reviews', name: 'Reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674z' }
  ];

  if (loading) {
    return (
      <WebsiteLayout className="pt-16 lg:pt-20">
        <ApplyNow />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Course Details
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch the course information...
            </p>
          </div>
        </div>
      </WebsiteLayout>
    );
  }

  if (!course) {
    return (
      <WebsiteLayout className="pt-16 lg:pt-20">
        <ApplyNow />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Course Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
            >
              Back to Courses
            </Link>
          </div>
        </div>
      </WebsiteLayout>
    );
  }

  const features = (course.features || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const fee = course.effective_fee || course.total_fee || course.base_course_fee || '0';
  const isDiscounted = course.is_discounted && parseFloat(course.discount_percentage || '0') > 0;
  const enrollmentCount = Math.floor(Math.random() * 500) + 100; // Hardcoded for now

  return (
    <WebsiteLayout className="pt-16 lg:pt-20">
      <ApplyNow />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li>
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li className="text-gray-400">/</li>
                  <li>
                    <Link to="/courses" className="text-gray-300 hover:text-white transition-colors">
                      Courses
                    </Link>
                  </li>
                  <li className="text-gray-400">/</li>
                  <li className="text-white font-medium">{course.title}</li>
                </ol>
              </nav>

              <div className="flex items-center gap-3 mb-4">
                {course.show_offer_badge && course.offer_badge_text && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {course.offer_badge_text}
                  </span>
                )}
                <span className="text-yellow-400 font-bold text-lg">
                  {parseFloat(fee) === 0 ? 'Free of cost' : formatINR(fee)}
                </span>
                {isDiscounted && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Save {formatINR(course.discount_amount || '0')}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {course.title}
              </h1>
              
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                {course.summary}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.duration ? `${course.duration} days` : ''}
                </div>
                <div className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                  {enrollmentCount} enrolled
                </div>
                <div className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Certificate Included
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowEnrollmentModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Enroll Now - {parseFloat(fee) === 0 ? 'Free' : formatINR(fee)}
                </button>
                <Link
                  to="/contact"
                  className="px-8 py-4 border-2 border-white text-white font-semibold text-lg rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 text-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="lg:block hidden">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Course Highlights</h3>
                <div className="space-y-4">
                  {features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-200">
                      <svg className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'overview' && (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Course Overview</h2>
                  
                  <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                      {course.description}
                    </p>
                  </div>

                  {/* Syllabus Section */}
                  {course.syllabus_text && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Course Syllabus</h3>
                        {course.syllabus_file_path && (
                          <a
                            href={course.syllabus_file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Syllabus
                          </a>
                        )}
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{course.syllabus_text}</p>
                      </div>
                    </div>
                  )}

                  {/* TODO: What You'll Learn section - will be populated from backend field */}
                  {features.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What You'll Learn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hostel & Mess Information */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Accommodation & Facilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`p-4 rounded-lg border-2 ${
                        course.hostel_available 
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                          : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                      }`}>
                        <div className="flex items-center mb-2">
                          <svg className={`w-5 h-5 mr-2 ${
                            course.hostel_available ? 'text-green-500' : 'text-gray-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Hostel Accommodation</h4>
                        </div>
                        <p className={`text-sm mb-2 ${
                          course.hostel_available ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {course.hostel_available ? 'Available' : 'Not Available'}
                        </p>
                        {course.hostel_available && (
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {parseFloat(course.hostel_fee || '0') === 0 ? 'Free of cost' : formatINR(course.hostel_fee)}
                          </p>
                        )}
                      </div>
                      
                      <div className={`p-4 rounded-lg border-2 ${
                        course.mess_available 
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                          : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                      }`}>
                        <div className="flex items-center mb-2">
                          <svg className={`w-5 h-5 mr-2 ${
                            course.mess_available ? 'text-green-500' : 'text-gray-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Mess Facility</h4>
                        </div>
                        <p className={`text-sm mb-2 ${
                          course.mess_available ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {course.mess_available ? 'Available' : 'Not Available'}
                        </p>
                        {course.mess_available && (
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {parseFloat(course.mess_fee || '0') === 0 ? 'Free of cost' : formatINR(course.mess_fee)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-3xl font-bold text-orange-500 mb-2">{course.duration ? `${course.duration} days` : ''}</div>
                      <div className="text-gray-600 dark:text-gray-400">Course Duration</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-3xl font-bold text-orange-500 mb-2">{parseFloat(fee) === 0 ? 'Free' : formatINR(fee)}</div>
                      <div className="text-gray-600 dark:text-gray-400">Course Fee</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-3xl font-bold text-orange-500 mb-2">Yes</div>
                      <div className="text-gray-600 dark:text-gray-400">Certificate</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Course Curriculum</h2>
                  
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">Curriculum details will be provided upon enrollment.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'requirements' && (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Requirements</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Prerequisites</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 mr-3 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">Must be at least 18 years old</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What to Bring</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">Valid photo ID</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">Work boots and safety glasses</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">Weather-appropriate clothing</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Student Reviews</h2>
                  
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this course!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 sticky top-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-orange-500 mb-2">
                    {parseFloat(fee) === 0 ? 'Free' : formatINR(fee)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {parseFloat(fee) === 0 ? 'No payment required' : 'One-time payment'}
                  </p>
                  {isDiscounted && (
                    <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                      <div className="line-through text-gray-500">{formatINR(course.base_course_fee || '0')}</div>
                      <div className="font-semibold">Save {formatINR(course.discount_amount || '0')} ({course.discount_percentage}% OFF)</div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowEnrollmentModal(true)}
                  className="w-full mb-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
                >
                  Enroll Now
                </button>

                <Link
                  to="/contact"
                  className="w-full block text-center px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  Contact for Info
                </Link>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Duration: {course.duration ? `${course.duration} days` : ''}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Certificate Included
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    On-site Training
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses */}
      {relatedCourses.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Related Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedCourses.map((relatedCourse) => {
                const relatedFee = relatedCourse.effective_fee || relatedCourse.total_fee || relatedCourse.base_course_fee || '0';
                return (
                  <Link
                    key={relatedCourse.id}
                    to={`/courses/${relatedCourse.id}`}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedCourse.thumbnail}
                        alt={relatedCourse.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {parseFloat(relatedFee) === 0 ? 'Free' : formatINR(relatedFee)}
                      </div>
                      {/* Offer Badge for related courses */}
                      {relatedCourse.show_offer_badge && relatedCourse.offer_badge_text && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {relatedCourse.offer_badge_text}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
                        {relatedCourse.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                        {relatedCourse.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {relatedCourse.duration ? `${relatedCourse.duration} days` : ''}
                        </div>
                        {relatedCourse.is_discounted && (
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            {relatedCourse.discount_percentage}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Enrollment Modal */}
      <EnrollModal
        isOpen={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        selectedCourseId={course?.id}
      />
    </WebsiteLayout>
  );
};

export default CourseDetails;
