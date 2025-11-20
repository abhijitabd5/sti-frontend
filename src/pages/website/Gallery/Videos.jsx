import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from '@/components/common/Layouts/WebsiteLayout';
import ApplyNow from '@/components/common/ApplyNow/ApplyNow';
import galleryApi from '@/services/api/galleryApi';
import { useSEO } from '@/hooks/useSEO';

const Videos = () => {
  // SEO Management
  const { seoData, loading: seoLoading } = useSEO('gallery-videos', 'en');
  
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [galleryVideos, setGalleryVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGalleryVideos();
  }, []);

  const loadGalleryVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await galleryApi.getPublicGalleryByPageSlug('gallery_videos');
      
      if (response.success && response.data) {
        setGalleryVideos(response.data);
      }
    } catch (err) {
      console.error('Error loading gallery videos:', err);
      setError('Failed to load gallery videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const filteredVideos = galleryVideos;

  const openVideoModal = (video) => {
    setSelectedVideo(video);
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedVideo && e.key === 'Escape') {
        closeVideoModal();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedVideo]);

  if (loading) {
    return (
      <WebsiteLayout className="pt-16 lg:pt-20">
        <ApplyNow />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Videos
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we load our video gallery...
            </p>
          </div>
        </div>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout className="pt-16 lg:pt-20">
      <ApplyNow />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Training videos"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <nav className="flex justify-center mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <span className="text-gray-300">Gallery</span>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-white font-medium">Videos</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Video Gallery
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
              Watch our training sessions, equipment demonstrations, success stories, and facility tours to get a comprehensive view of what we offer.
            </p>

            <div className="flex justify-center space-x-4">
              <Link
                to="/gallery/images"
                className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Photos
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Videos Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0021 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No videos found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try selecting a different category.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Gallery
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="group cursor-pointer bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col"
                    onClick={() => openVideoModal(video)}
                  >
                    <div className="relative overflow-hidden aspect-video bg-gray-200 dark:bg-gray-700">
                      <img
                        src={video.thumbnail_url || video.media_url}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/640x360?text=Video+Thumbnail';
                        }}
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-orange-500/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                          </svg>
                        </div>
                      </div>

                      {/* Display Order Badge */}
                      <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold uppercase">
                        Order: {video.display_order}
                      </div>
                    </div>
                    
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="group/title relative mb-2">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors truncate">
                          {video.title}
                        </h3>
                        <div className="absolute left-0 top-full z-50 hidden group-hover/title:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-normal max-w-xs break-words mt-1">
                          {video.title}
                        </div>
                      </div>
                      <div className="group/caption relative flex-grow">
                        <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
                          {video.caption || 'No description'}
                        </p>
                        {video.caption && video.caption.length > 100 && (
                          <div className="absolute left-0 top-full z-50 hidden group-hover/caption:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-normal max-w-xs break-words mt-1">
                            {video.caption}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative max-w-6xl max-h-screen w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-50 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Content */}
            <div className="flex flex-col items-center max-w-full max-h-full">
              <div className="relative w-full max-w-4xl aspect-video mb-6 bg-black rounded-lg overflow-hidden">
                <video
                  controls
                  autoPlay
                  className="w-full h-full"
                  poster={selectedVideo.thumbnail_url}
                >
                  <source src={selectedVideo.media_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              {/* Video Info */}
              <div className="text-center text-white bg-black/50 rounded-lg px-8 py-6 max-w-4xl">
                <h3 className="text-2xl font-bold mb-3">{selectedVideo.title}</h3>
                <p className="text-gray-300">{selectedVideo.caption || 'No description available'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Experience It Yourself
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Ready to move from watching to doing? Join our hands-on training programs and start building your future career.
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
              to="/gallery/images"
              className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-orange-500 font-semibold text-lg rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Photos
            </Link>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default Videos;
