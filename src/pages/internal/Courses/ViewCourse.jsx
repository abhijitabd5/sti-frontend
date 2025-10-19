import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import courseApi from '@/services/api/courseApi';

// Icons
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  PencilIcon,
  ClockIcon,
  LanguageIcon,
  TagIcon,
  GlobeAltIcon,
  CalendarIcon,
  CheckBadgeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function ViewCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load course data
  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getCourseById(id);
      if (response.success) {
        setCourse(response.data);
      } else {
        navigate('/admin/courses');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/courses');
  };

  const handleEdit = () => {
    navigate(`/admin/courses/edit/${course.id}`);
  };

  const getLanguageInfo = (language) => {
    const languages = {
      'en': { name: 'English', flag: '🇺🇸' },
      'hi': { name: 'Hindi', flag: '🇮🇳' },
      'mar': { name: 'Marathi', flag: '🇮🇳' }
    };
    return languages[language] || { name: 'Unknown', flag: '🌐' };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!course) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XMarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Course not found</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const languageInfo = getLanguageInfo(course.language);

  return (
    <AdminLayout>
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={handleBack}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Course Details
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View complete course information and content
          </p>
        </div>

        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <button
            onClick={handleEdit}
            className="btn bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 shadow-lg"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{languageInfo.flag}</span>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {course.title}
                    </h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.is_active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {course.is_active ? (
                        <CheckBadgeIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <XMarkIcon className="h-3 w-3 mr-1" />
                      )}
                      {course.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {course.summary}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-2">
                    <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{course.duration} Weeks</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-2">
                    <LanguageIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{languageInfo.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Language</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-2">
                    <TagIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">#{course.display_order}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Display Order</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg mx-auto mb-2">
                    <GlobeAltIcon className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{course.slug}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Slug</p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Description */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                Course Description
              </h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </div>
          </div>

          {/* Syllabus */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Syllabus
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              {course.syllabus_text ? (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Syllabus Content
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                      {course.syllabus_text}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">No syllabus content available</p>
              )}

              {course.syllabus_file_path && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Syllabus PDF
                  </h4>
                  <div className="flex items-center space-x-2 text-sm">
                    <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                    <a 
                      href={course.syllabus_file_path} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Syllabus PDF
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Information */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Pricing
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Base Course Fee
                  </label>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {formatCurrency(parseFloat(course.base_course_fee))}
                  </p>
                </div>

                {course.is_discounted && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Discounted Fee
                      </label>
                      <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(parseFloat(course.discounted_course_fee || course.base_course_fee))}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Discount
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          {course.discount_percentage}% OFF
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Save {formatCurrency(parseFloat(course.discount_amount || 0))}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Additional Fees */}
                {(course.hostel_available || course.mess_available) && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Additional Services
                    </h4>
                    {course.hostel_available && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Hostel Fee</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {formatCurrency(parseFloat(course.hostel_fee || 0))}
                        </span>
                      </div>
                    )}
                    {course.mess_available && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Mess Fee</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {formatCurrency(parseFloat(course.mess_fee || 0))}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Total Fee */}
                {course.total_fee && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Fee</span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(parseFloat(course.total_fee))}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Offer Badge */}
          {course.show_offer_badge && course.offer_badge_text && (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Offer Badge
                </h3>
              </div>
              
              <div className="p-6">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg p-4 text-center">
                  <p className="font-semibold">{course.offer_badge_text}</p>
                </div>
              </div>
            </div>
          )}

          {/* Media & Display */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <div className="flex items-center space-x-2">
                <PhotoIcon className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Media
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              {course.thumbnail ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Thumbnail
                    </label>
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/400/300';
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {course.thumbnail}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No thumbnail image available</p>
              )}
            </div>
          </div>

          {/* Course Metadata */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Course Metadata
                </h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course ID
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">#{course.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created Date
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(course.createdAt)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Updated
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(course.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ViewCourse;
