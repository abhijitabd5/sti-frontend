import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from '@/components/common/Layouts/WebsiteLayout';
import ApplyNow from '@/components/common/ApplyNow/ApplyNow';

const Videos = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'all', name: 'All Videos', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'training', name: 'Training Sessions', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' },
    { id: 'equipment', name: 'Equipment Demos', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'testimonials', name: 'Success Stories', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'facility', name: 'Facility Tours', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' }
  ];

  const galleryVideos = [
    // Training Session Videos
    {
      id: 1,
      title: 'Excavator Operation Basics',
      description: 'Learn the fundamental techniques of excavator operation including safety protocols, basic controls, and operating procedures.',
      thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual video URLs
      duration: '12:45',
      category: 'training',
      views: '15.2k',
      uploadDate: 'March 15, 2024'
    },
    {
      id: 2,
      title: 'Advanced Crane Techniques',
      description: 'Master advanced crane operation techniques for complex construction projects and heavy lifting operations.',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '18:30',
      category: 'training',
      views: '8.7k',
      uploadDate: 'March 10, 2024'
    },
    {
      id: 3,
      title: 'Safety First: Construction Site Protocols',
      description: 'Comprehensive safety training covering OSHA standards, personal protective equipment, and emergency procedures.',
      thumbnail: 'https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '22:15',
      category: 'training',
      views: '12.3k',
      uploadDate: 'March 8, 2024'
    },

    // Equipment Demo Videos
    {
      id: 4,
      title: 'Latest Caterpillar Excavator Demo',
      description: 'Demonstration of our newest Caterpillar excavator showing advanced features, fuel efficiency, and performance capabilities.',
      thumbnail: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '15:22',
      category: 'equipment',
      views: '9.8k',
      uploadDate: 'March 12, 2024'
    },
    {
      id: 5,
      title: 'Bulldozer Power and Precision',
      description: 'See our heavy-duty bulldozers in action, showcasing their power, precision, and versatility in various applications.',
      thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '11:18',
      category: 'equipment',
      views: '6.4k',
      uploadDate: 'March 5, 2024'
    },
    {
      id: 6,
      title: 'Loader Operations Workshop',
      description: 'Complete workshop on loader operations including maintenance, safety checks, and efficient operating techniques.',
      thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '25:40',
      category: 'equipment',
      views: '7.2k',
      uploadDate: 'February 28, 2024'
    },

    // Success Stories / Testimonials
    {
      id: 7,
      title: 'From Student to Supervisor - Mike\'s Journey',
      description: 'Follow Mike\'s incredible journey from a training student to becoming a construction site supervisor in just 2 years.',
      thumbnail: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '8:45',
      category: 'testimonials',
      views: '18.5k',
      uploadDate: 'March 20, 2024'
    },
    {
      id: 8,
      title: 'Graduate Success Stories Compilation',
      description: 'Hear from multiple graduates about how our training programs transformed their careers and lives.',
      thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '14:30',
      category: 'testimonials',
      views: '22.1k',
      uploadDate: 'March 18, 2024'
    },
    {
      id: 9,
      title: 'Career Change at 45 - Sarah\'s Story',
      description: 'Sarah shares how she successfully changed careers at 45 and became a certified heavy equipment operator.',
      thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '10:12',
      category: 'testimonials',
      views: '13.7k',
      uploadDate: 'March 14, 2024'
    },

    // Facility Tour Videos
    {
      id: 10,
      title: '50-Acre Training Facility Tour',
      description: 'Take a comprehensive tour of our 50-acre training facility featuring classrooms, workshops, and training grounds.',
      thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '16:55',
      category: 'facility',
      views: '11.3k',
      uploadDate: 'March 22, 2024'
    },
    {
      id: 11,
      title: 'State-of-the-Art Classrooms',
      description: 'Explore our modern classrooms equipped with the latest educational technology and multimedia systems.',
      thumbnail: 'https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '7:20',
      category: 'facility',
      views: '5.9k',
      uploadDate: 'March 17, 2024'
    },
    {
      id: 12,
      title: 'Equipment Maintenance Workshop',
      description: 'Tour our fully equipped maintenance workshop where students learn equipment servicing and repair.',
      thumbnail: 'https://images.unsplash.com/photo-1590845947670-c009801ffa74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '9:38',
      category: 'facility',
      views: '4.8k',
      uploadDate: 'March 6, 2024'
    }
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? galleryVideos 
    : galleryVideos.filter(video => video.category === selectedCategory);

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

      {/* Navigation Tabs */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-16 lg:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                </svg>
                {category.name}
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                  {category.id === 'all' ? galleryVideos.length : galleryVideos.filter(video => video.category === category.id).length}
                </span>
              </button>
            ))}
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
                  {categories.find(cat => cat.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="group cursor-pointer bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    onClick={() => openVideoModal(video)}
                  >
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-orange-500 bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                          </svg>
                        </div>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-medium">
                        {video.duration}
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold uppercase">
                        {video.category}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                        {video.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {video.views} views
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {video.uploadDate}
                        </span>
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
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-6xl max-h-screen w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-50 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Content */}
            <div className="flex flex-col items-center max-w-full max-h-full">
              <div className="relative w-full max-w-4xl aspect-video mb-6">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="w-full h-full rounded-lg shadow-2xl"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
              
              {/* Video Info */}
              <div className="text-center text-white bg-black bg-opacity-50 rounded-lg px-8 py-6 max-w-4xl">
                <h3 className="text-2xl font-bold mb-3">{selectedVideo.title}</h3>
                <p className="text-gray-300 mb-4">{selectedVideo.description}</p>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {selectedVideo.duration}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {selectedVideo.views} views
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {selectedVideo.uploadDate}
                  </span>
                </div>
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
