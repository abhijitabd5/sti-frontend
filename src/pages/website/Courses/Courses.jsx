import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from '@/components/common/Layouts/WebsiteLayout';
import ApplyNow from '@/components/common/ApplyNow/ApplyNow';
import { publicCourseApi } from '@/services/api/publicCourseApi';
import { useLanguage } from '@/contexts/LanguageContext';
import EnrollModal from '@/components/common/Modal/EnrollModal';

const Courses = () => {
  const { getCurrentLanguageObj } = useLanguage();
  const languageCode = useMemo(() => getCurrentLanguageObj()?.code || 'en', [getCurrentLanguageObj]);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    let active = true;
    const loadCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await publicCourseApi.getCourses({ language: languageCode, sortBy: 'display_order', sortOrder: 'ASC' });
        if (!active) return;
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (error) {
        console.error('Error loading courses:', error);
        if (active) setCourses([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCourses();
    return () => { active = false; };
  }, [languageCode]);

  const handleEnrollClick = (courseId) => {
    setSelectedCourseId(courseId);
    setEnrollModalOpen(true);
  };

  const formatINR = (price) => {
    const num = Number(price);
    if (!isFinite(num)) return '';
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
    } catch {
      return `${num}`;
    }
  };

  const categories = [
    { id: 'all', name: 'All Courses', courseType: null },
    { id: 'operator_training', name: 'Operator Training Courses', courseType: 'operator_training' },
    { id: 'technician_training', name: 'Technician Training Courses', courseType: 'technician_training' }
  ];

  const filteredCourses = courses.filter(course => {
    if (selectedCategory === 'all') {
      return true;
    }
    return course.course_type === selectedCategory;
  });

  if (loading) {
    return (
      <WebsiteLayout className="pt-16 lg:pt-20">
        <ApplyNow />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Courses
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch our training programs...
            </p>
          </div>
        </div>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout className="pt-16 lg:pt-20">
      {/* Apply Now Section */}
      <ApplyNow />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Training Programs
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Comprehensive heavy equipment training courses designed to prepare you for success in the construction and mining industries. All programs include hands-on training, safety certification, and job placement assistance.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Industry Certified
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Job Placement Assistance
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Flexible Scheduling
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredCourses.length} of {courses.length} courses
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const features = (course.syllabus_text || '')
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);
              const fee = course.effective_fee || course.total_fee || course.base_course_fee || '0';
              const isDiscounted = course.is_discounted && parseFloat(course.discount_percentage || '0') > 0;
              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden group h-full flex flex-col"
                >
                  {/* Course Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {parseFloat(fee) === 0 ? 'Free' : formatINR(fee)}
                    </div>

                    {/* Offer Badge */}
                    {course.show_offer_badge && course.offer_badge_text && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {course.offer_badge_text}
                      </div>
                    )}

                    {/* Duration */}
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {course.duration ? `${course.duration} days` : ''}
                    </div>
                  </div>

                {/* Course Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors flex-1 line-clamp-2 min-h-[3.5rem]">
                        {course.title}
                      </h3>
                      {isDiscounted && (
                        <div className="ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                          {course.discount_percentage}% OFF
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Discount Info */}
                    {isDiscounted && (
                      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-sm text-green-700 dark:text-green-300">
                          <div className="flex items-center justify-between">
                            <span>Original: <span className="line-through">{formatINR(course.base_course_fee || '0')}</span></span>
                            <span className="font-semibold">Save {formatINR(course.discount_amount || '0')}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          What you'll learn:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {features.slice(0, 3).map((feature, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                          {features.length > 3 && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                              +{features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Enrollment Count */}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      </svg>
                      {Math.floor(Math.random() * 500) + 100} students enrolled
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                      <Link
                        to={`/courses/${course.id}`}
                        className="flex-1 text-center bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold py-2.5 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleEnrollClick(course.id)}
                        className="flex-1 text-center bg-transparent border-2 border-orange-500 text-orange-500 dark:text-orange-400 font-semibold py-2.5 px-4 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters to see more courses.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Training Journey?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of successful graduates who've transformed their careers through our industry-leading training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/apply"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Apply Now
              <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-orange-500 font-semibold text-lg rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
            >
              Schedule a Tour
            </Link>
          </div>
        </div>
      </section>

      {/* Enrollment Modal */}
      <EnrollModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        selectedCourseId={selectedCourseId}
      />
    </WebsiteLayout>
  );
};

export default Courses;
