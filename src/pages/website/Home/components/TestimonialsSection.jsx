import React, { useState, useEffect } from 'react';
import { reviewApi } from '@/services/api/reviewApi';
import defaultProfile from '@/assets/icons/user-profile.png';
import { INSTITUTION_INFO } from '@/config/constants';

const TestimonialsSection = ({ testimonials = [] }) => {
  const [fetchedReviews, setFetchedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch reviews from backend
  useEffect(() => {
    let active = true;
    const loadReviews = async () => {
      try {
        setLoading(true);
        const response = await reviewApi.getPublicReviews({ limit: 5 });
        if (!active) return;
        // Extract data from response { success, message, data }
        const reviewData = response?.data || response;
        setFetchedReviews(Array.isArray(reviewData) ? reviewData : []);
      } catch (error) {
        console.error('Failed to load reviews:', error);
        if (active) setFetchedReviews([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadReviews();
    return () => {
      active = false;
    };
  }, []);

  // Use fetched reviews (ignore testimonials prop)
  const reviews = fetchedReviews;

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentTestimonial, isAutoPlaying, reviews.length]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading || !reviews.length) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="ml-4 space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Hear from our successful graduates who've transformed their careers through our training programs
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mt-6"></div>
        </div>

        {/* Featured Testimonial (Large) */}
        {reviews.length > 0 && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="testimonial-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#testimonial-pattern)" />
                </svg>
              </div>
              
              <div className="relative z-10">
                {/* Quote Icon */}
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.574-.197-.479-1.501c-.1.047-.285.087-.443.157-.159.07-.318.148-.475.22-.314.156-.607.405-.901.604-.294.199-.583.497-.827.765-.255.27-.477.628-.649.991-.17.363-.298.797-.366 1.115-.069.318-.068.646-.048.96v1.85zm8 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.574-.197-.479-1.501c-.1.047-.285.087-.443.157-.159.07-.318.148-.475.22-.314.156-.607.405-.901.604-.294.199-.583.497-.827.765-.255.27-.477.628-.649.991-.17.363-.298.797-.366 1.115-.069.318-.068.646-.048.96v1.85z" />
                  </svg>
                </div>

                {/* Featured Quote */}
                <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                  "{reviews[currentTestimonial].review_text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={reviews[currentTestimonial].profile_photo || defaultProfile}
                    alt={reviews[currentTestimonial].name}
                    className="w-16 h-16 rounded-full border-4 border-white/30 object-cover"
                  />
                  <div className="text-left">
                    <div className="font-bold text-lg">
                      {reviews[currentTestimonial].name}
                    </div>
                    <div className="text-white/90">
                      {reviews[currentTestimonial].enrolled_course}
                    </div>
                    {reviews[currentTestimonial].recruited_at && (
                      <div className="text-sm text-white/80">
                        {reviews[currentTestimonial].recruited_at}
                      </div>
                    )}
                    <div className="text-sm text-white/80">
                      {reviews[currentTestimonial].city}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center mt-6 space-x-1">
                  {renderStars(reviews[currentTestimonial].rating)}
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            {reviews.length > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentTestimonial(index);
                      setIsAutoPlaying(false);
                      setTimeout(() => setIsAutoPlaying(true), 10000);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-orange-500 scale-125'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-orange-300'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Rating */}
              <div className="flex items-center mb-4 space-x-1">
                {renderStars(review.rating)}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-4">
                "{review.review_text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={review.profile_photo || defaultProfile}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {review.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {review.enrolled_course}
                  </div>
                  {review.recruited_at && (
                    <div className="text-sm text-orange-500">
                      {review.recruited_at}
                    </div>
                  )}
                </div>
              </div>

              {/* City */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {review.city}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-Action */}
        <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our Success Stories
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Start your journey today and become part of our community of successful heavy equipment operators
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105">
              Start Your Training
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button className="inline-flex items-center px-8 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300">
              Read More Reviews
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2">{INSTITUTION_INFO.placementRate}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Job Placement Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2">{INSTITUTION_INFO.studentsTrained}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Students Trained</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2">4.9/5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2">{INSTITUTION_INFO.experience}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
