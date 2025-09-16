import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from '@/components/common/Layouts/WebsiteLayout';
import ApplyNow from '@/components/common/ApplyNow/ApplyNow';
import { websiteApi } from '@/services/api/websiteApi';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await websiteApi.getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
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

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'excavator', name: 'Excavator Training' },
    { id: 'crane', name: 'Crane Operations' },
    { id: 'bulldozer', name: 'Bulldozer Training' },
    { id: 'loader', name: 'Loader Operations' },
    { id: 'package', name: 'Complete Package' }
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const filteredCourses = courses.filter(course => {
    const categoryMatch = selectedCategory === 'all' || 
      course.title.toLowerCase().includes(selectedCategory);
    const levelMatch = selectedLevel === 'all' || 
      course.level.toLowerCase() === selectedLevel;
    return categoryMatch && levelMatch;
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

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                {levels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
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
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden group"
              >
                {/* Course Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Level Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {formatPrice(course.price)}
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {course.duration}
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-500 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      What you'll learn:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {course.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {course.features.length > 3 && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                          +{course.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Enrollment Count */}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                    {course.enrollmentCount} students enrolled
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/courses/${course.id}`}
                      className="flex-1 text-center bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold py-2.5 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
                    >
                      View Details
                    </Link>
                    <Link
                      to="/apply"
                      className="flex-1 text-center bg-transparent border-2 border-orange-500 text-orange-500 dark:text-orange-400 font-semibold py-2.5 px-4 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
    </WebsiteLayout>
  );
};

export default Courses;
