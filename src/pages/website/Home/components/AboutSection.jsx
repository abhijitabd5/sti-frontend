import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import galleryApi from "@/services/api/galleryApi";
import placeholderImage from "@/assets/images/placeholder-image.jpg";
import placeholderVideo from "@/assets/videos/placeholder-video.mp4";
import { INSTITUTION_INFO, ABOUT_INFO } from '@/config/constants';

const AboutSection = () => {
  const [galleryImage, setGalleryImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [galleryVideo, setGalleryVideo] = useState(null);

  useEffect(() => {
    const loadGalleryMedia = async () => {
      try {
        const response = await galleryApi.getPublicGalleryByPageSlug("home");
        if (response.data && response.data.length > 0) {
          // Get the first image from the gallery
          setGalleryImage(response.data[0].media_url);
          setImageError(false);
          
          // Get video by specific slug
          const videoItem = response.data.find(item => item.section_slug === 'home-training-video');
          if (videoItem) {
            setGalleryVideo(videoItem.media_url);
          }
        } else {
          // No gallery items found, use placeholder
          setImageError(true);
        }
      } catch (error) {
        console.error("Error loading gallery media:", error);
        setImageError(true);
      }
    };

    loadGalleryMedia();
  }, []);


  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {ABOUT_INFO.title}
          </h2>
          <p className="text-xl text-orange-500 dark:text-orange-400 font-semibold mb-6">
            {ABOUT_INFO.subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Content */}
          <div className="space-y-6">
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {ABOUT_INFO.description}
            </p>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border-l-4 border-orange-500">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Our Mission
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {ABOUT_INFO.mission}
              </p>
            </div>

            {/* Features List */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                Why Choose Us?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ABOUT_INFO.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
              >
                Learn More About Us
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Image/Visual Content */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg shadow-xl">
              <img
                src={imageError ? placeholderImage : (galleryImage || placeholderImage)}
                alt={`${INSTITUTION_INFO.name} Facility`}
                className="w-full h-96 object-cover"
                onError={() => {
                  setImageError(true);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              {/* Overlay Content */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h4 className="text-xl font-bold mb-2">
                  State-of-the-Art Facility
                </h4>
                <p className="text-sm opacity-90">
                  Professional training environment with modern equipment
                </p>
              </div>
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {INSTITUTION_INFO.placementRate}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Job Placement Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Our Track Record
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {ABOUT_INFO.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Section (Optional) */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            See Our Training in Action
          </h3>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl aspect-video">
              {galleryVideo ? (
                <video
                  src={galleryVideo}
                  controls
                  className="w-full h-full object-cover"
                  onError={() => {
                    // Fallback to placeholder video on error
                    document.querySelector('video').src = placeholderVideo;
                  }}
                />
              ) : (
                <video
                  src={placeholderVideo}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
              {!galleryVideo && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <button className="group flex items-center justify-center w-20 h-20 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300">
                    <svg
                      className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              {galleryVideo
                ? 'Watch our comprehensive training in action'
                : 'Watch our virtual tour and see why we\'re the leading heavy equipment training academy'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
