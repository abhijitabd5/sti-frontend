import React, { useState, useEffect } from 'react';
import WebsiteLayout from '@/components/common/Layouts/WebsiteLayout';
import HeroSection from '@/pages/website/Home/components/HeroSection';
import CoursesMarquee from '@/pages/website/Home/components/CoursesMarquee';
import AboutSection from '@/pages/website/Home/components/AboutSection';
import CoursesSection from '@/pages/website/Home/components/CoursesSection';
import TestimonialsSection from '@/pages/website/Home/components/TestimonialsSection';
import ContactSection from '@/pages/website/Home/components/ContactSection';
import { websiteApi } from '@/services/api/websiteApi';
import galleryApi from '@/services/api/galleryApi';
import placeholderImage from "@/assets/images/placeholder-image.jpg";
import { useSEO } from '@/hooks/useSEO';
import { INSTITUTION_INFO } from '@/config/constants';

// Hero slide section slugs
const HERO_SLIDE_SLUGS = [
  'home-hero-slide-one',
  'home-hero-slide-two',
  'home-hero-slide-three'
];

// Default hero slide content for the training institute
const DEFAULT_HERO_SLIDE = {
  title: 'Heavy Equipment Training Excellence',
  subtitle: 'Master the Skills, Build Your Future',
  description: `Industry-certified training programs designed to make you an expert operator. Hands-on experience with modern equipment and expert instructors at ${INSTITUTION_INFO.name}.`,
  ctaText: 'Get Started',
  ctaLink: '/courses'
};

const Home = () => {
  // SEO Management
  const { seoData, loading: seoLoading } = useSEO('home', 'en');
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    heroSlides: [],
    scrollingCourses: [],
    courses: [],
    testimonials: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        
        // Load gallery items for hero carousel using specific section slugs
        let heroSlides = [{
          id: 0,
          image: placeholderImage,
          ...DEFAULT_HERO_SLIDE
        }];

        try {
          const galleryResponse = await galleryApi.getPublicGalleryByPageSlug('home');
          if (galleryResponse.data && galleryResponse.data.length > 0) {
            // Map gallery items by section slug in order
            heroSlides = HERO_SLIDE_SLUGS.map(slug => {
              const item = galleryResponse.data.find(data => data.section_slug === slug);
              if (item) {
                return {
                  id: item.id,
                  image: item.media_url,
                  title: item.title,
                  subtitle: item.caption,
                  description: item.description,
                  ctaText: item.link_text || DEFAULT_HERO_SLIDE.ctaText,
                  ctaLink: item.link_url || DEFAULT_HERO_SLIDE.ctaLink
                };
              }
              return null;
            }).filter(Boolean); // Remove null values

            // If no slides found with slugs, use default
            if (heroSlides.length === 0) {
              heroSlides = [{
                id: 0,
                image: placeholderImage,
                ...DEFAULT_HERO_SLIDE
              }];
            }
          }
        } catch (galleryError) {
          console.warn('Gallery API failed, using default slide:', galleryError);
          // heroSlides already set to default above
        }
        
        // Load other page data in parallel
        const [
          scrollingCourses,
          courses,
          testimonials
        ] = await Promise.all([
          websiteApi.getScrollingCourses(),
          websiteApi.getCourses(6), // Limit to 6 courses for the main section
          websiteApi.getTestimonials()
        ]);

        setData({
          heroSlides,
          scrollingCourses,
          courses,
          testimonials
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
              Loading {INSTITUTION_INFO.name} Website
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
      <AboutSection />
      
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
