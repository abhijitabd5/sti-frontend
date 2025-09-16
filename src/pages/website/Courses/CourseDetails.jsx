import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import WebsiteLayout from '@/components/common/Layouts/WebsiteLayout';
import ApplyNow from '@/components/common/ApplyNow/ApplyNow';
import { websiteApi } from '@/services/api/websiteApi';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true);
        const [courseData, allCourses] = await Promise.all([
          websiteApi.getCourseById(id),
          websiteApi.getCourses()
        ]);
        
        setCourse(courseData);
        
        // Get related courses (same category, different course)
        const related = allCourses
          .filter(c => c.id !== courseData.id && 
                      c.title.toLowerCase().includes(courseData.title.toLowerCase().split(' ')[0]))
          .slice(0, 3);
        setRelatedCourses(related);
      } catch (error) {
        console.error('Error loading course:', error);
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCourseData();
    }
  }, [id, navigate]);

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'curriculum', name: 'Curriculum', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'requirements', name: 'Requirements', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'reviews', name: 'Reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' }
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

  return (
    <WebsiteLayout className="pt-16 lg:pt-20">
      <ApplyNow />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0">
          <img
            src={course.image}
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
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
                <span className="text-yellow-400 font-bold text-lg">
                  {formatPrice(course.price)}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {course.title}
              </h1>
              
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.duration}
                </div>
                <div className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                  {course.enrollmentCount} enrolled
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
                  Enroll Now - {formatPrice(course.price)}
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
                  {course.features.slice(0, 6).map((feature, index) => (
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
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {course.fullDescription || course.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What You'll Learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-3xl font-bold text-orange-500 mb-2">{course.duration}</div>
                      <div className="text-gray-600 dark:text-gray-400">Course Duration</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-3xl font-bold text-orange-500 mb-2">{course.level}</div>
                      <div className="text-gray-600 dark:text-gray-400">Skill Level</div>
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
                    {course.curriculum?.map((module, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          Module {index + 1}: {module.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{module.description}</p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {module.duration}
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">Curriculum details will be provided upon enrollment.</p>
                      </div>
                    )}
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
                        {course.requirements?.prerequisites?.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 mr-3 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{req}</span>
                          </li>
                        )) || (
                          <li className="flex items-start">
                            <svg className="w-5 h-5 mr-3 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Must be at least 18 years old</span>
                          </li>
                        )}
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
                    {course.reviews?.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">{review.date}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{review.author}</h4>
                        <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                      </div>
                    )) || (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this course!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 sticky top-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-orange-500 mb-2">
                    {formatPrice(course.price)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">One-time payment</p>
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
                    Duration: {course.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Level: {course.level}
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
              {relatedCourses.map((relatedCourse) => (
                <Link
                  key={relatedCourse.id}
                  to={`/courses/${relatedCourse.id}`}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={relatedCourse.image}
                      alt={relatedCourse.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {formatPrice(relatedCourse.price)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
                      {relatedCourse.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {relatedCourse.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {relatedCourse.duration}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Enroll?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Complete your enrollment for {course.title}
              </p>
              <div className="flex flex-col gap-4">
                <Link
                  to="/apply"
                  className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
                  onClick={() => setShowEnrollmentModal(false)}
                >
                  Start Application
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
                  onClick={() => setShowEnrollmentModal(false)}
                >
                  Contact Us First
                </Link>
                <button
                  onClick={() => setShowEnrollmentModal(false)}
                  className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </WebsiteLayout>
  );
};

export default CourseDetails;
