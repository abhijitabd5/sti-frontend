import React, { useState, useEffect } from 'react';
import WebsiteLayout from '../../components/common/Layouts/WebsiteLayout';
import HeroSection from './components/HeroSection';
import CoursesMarquee from './components/CoursesMarquee';
import AboutSection from './components/AboutSection';
import CoursesSection from './components/CoursesSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import { websiteApi } from '../../services/api/websiteApi';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    heroSlides: [],
    scrollingCourses: [],
    courses: [],
    testimonials: [],
    aboutInfo: null
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        
        // Load all data in parallel for better performance
        const [
          heroSlides,
          scrollingCourses,
          courses,
          testimonials,
          aboutInfo
        ] = await Promise.all([
          websiteApi.getHeroSlides(),
          websiteApi.getScrollingCourses(),
          websiteApi.getCourses(6), // Limit to 6 courses for the main section
          websiteApi.getTestimonials(),
          websiteApi.getAboutInfo()
        ]);

        setData({
          heroSlides,
          scrollingCourses,
          courses,
          testimonials,
          aboutInfo
        });
      } catch (err) {
        console.error('Error loading page data:', err);
        setError('Failed to load page data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <WebsiteLayout>
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Earth Movers Training Academy
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we prepare your experience...
            </p>
          </div>
        </div>
      </WebsiteLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <WebsiteLayout>
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
            >
              Try Again
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout className="pt-0">
      {/* Hero Section - Full height with image slider */}
      <HeroSection slides={data.heroSlides} />
      
      {/* Scrolling Courses Marquee */}
      <CoursesMarquee courses={data.scrollingCourses} />
      
      {/* About Section */}
      <AboutSection aboutInfo={data.aboutInfo} />
      
      {/* Main Courses Section */}
      <CoursesSection courses={data.courses} />
      
      {/* Testimonials Section */}
      <TestimonialsSection testimonials={data.testimonials} />
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Optional: Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 space-y-3">
        {/* Call Button */}
        <a
          href="tel:+15551234567"
          className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Call us"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
        
        {/* Message Button */}
        <a
          href="#contact"
          className="flex items-center justify-center w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Send message"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </a>
        
        {/* Scroll to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center justify-center w-14 h-14 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
      
      {/* Optional: Progress Indicator for Page Loading */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform origin-left scale-x-100 z-50"></div>
    </WebsiteLayout>
  );
};

export default Home;
