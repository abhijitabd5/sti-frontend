import React, { useState, useEffect } from 'react';
import WebsiteLayout from '@/components/common/Layouts/WebsiteLayout';
import HeroSection from '@/pages/website/Home/components/HeroSection';
import CoursesMarquee from '@/pages/website/Home/components/CoursesMarquee';
import AboutSection from '@/pages/website/Home/components/AboutSection';
import CoursesSection from '@/pages/website/Home/components/CoursesSection';
import TestimonialsSection from '@/pages/website/Home/components/TestimonialsSection';
import ContactSection from '@/pages/website/Home/components/ContactSection';
import { websiteApi } from '@/services/api/websiteApi';

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
      <CoursesMarquee/>
      
      {/* About Section */}
      <AboutSection aboutInfo={data.aboutInfo} />
      
      {/* Main Courses Section */}
      <CoursesSection courses={data.courses} />
      
      {/* Testimonials Section */}
      <TestimonialsSection testimonials={data.testimonials} />
      
      {/* Contact Section */}
      <ContactSection />
      
    </WebsiteLayout>
  );
};

export default Home;
