import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from '@/components/common/Layouts/WebsiteLayout';
import ApplyNow from '@/components/common/ApplyNow/ApplyNow';

const Images = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'all', name: 'All Images', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'equipment', name: 'Equipment', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'facility', name: 'Facility', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'training', name: 'Training', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' },
    { id: 'graduation', name: 'Graduation', icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222' }
  ];

  const galleryImages = [
    // Equipment Images
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Heavy excavator in training yard',
      category: 'equipment',
      title: 'Excavator Training',
      description: 'Our modern excavator fleet ready for hands-on training sessions.'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Construction crane operations',
      category: 'equipment',
      title: 'Crane Operations',
      description: 'State-of-the-art cranes used in our comprehensive training programs.'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Bulldozer training equipment',
      category: 'equipment',
      title: 'Bulldozer Training',
      description: 'Heavy-duty bulldozers for advanced equipment operation training.'
    },
    // Facility Images
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Modern classroom facility',
      category: 'facility',
      title: 'Modern Classrooms',
      description: 'State-of-the-art classrooms equipped with multimedia technology.'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Training facility exterior',
      category: 'facility',
      title: 'Training Facility',
      description: '50-acre training facility with comprehensive learning environments.'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1590845947670-c009801ffa74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Workshop and maintenance area',
      category: 'facility',
      title: 'Workshop Area',
      description: 'Fully equipped workshop for equipment maintenance training.'
    },
    // Training Images
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Student operating excavator',
      category: 'training',
      title: 'Hands-On Training',
      description: 'Students getting real-world experience with professional equipment.'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Instructor teaching safety protocols',
      category: 'training',
      title: 'Safety Training',
      description: 'Comprehensive safety training with experienced instructors.'
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1559087867-ce4c91325525?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Group training session',
      category: 'training',
      title: 'Group Sessions',
      description: 'Interactive group training sessions for collaborative learning.'
    },
    // Graduation Images
    {
      id: 10,
      src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Graduation ceremony',
      category: 'graduation',
      title: 'Graduation Day',
      description: 'Celebrating successful completion of training programs.'
    },
    {
      id: 11,
      src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Certificate presentation',
      category: 'graduation',
      title: 'Certificate Presentation',
      description: 'Proud graduates receiving their industry certifications.'
    },
    {
      id: 12,
      src: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Graduate success stories',
      category: 'graduation',
      title: 'Success Stories',
      description: 'Our graduates celebrating their career achievements.'
    },
    // Additional Images
    {
      id: 13,
      src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Construction site simulator',
      category: 'training',
      title: 'Simulation Training',
      description: 'Advanced simulation technology for realistic training scenarios.'
    },
    {
      id: 14,
      src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Modern training equipment',
      category: 'equipment',
      title: 'Latest Technology',
      description: 'Cutting-edge equipment featuring the latest industry technology.'
    },
    {
      id: 15,
      src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Evening training sessions',
      category: 'training',
      title: 'Flexible Schedules',
      description: 'Training sessions available during various times to fit your schedule.'
    }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedCategory);

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateImage('next');
      if (e.key === 'ArrowLeft') navigateImage('prev');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, filteredImages]);

  if (loading) {
    return (
      <WebsiteLayout className="pt-16 lg:pt-20">
        <ApplyNow />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Gallery
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we load our photo gallery...
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
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Training facility"
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
                <li className="text-white font-medium">Images</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Photo Gallery
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
              Take a visual tour of our state-of-the-art training facility, modern equipment fleet, and successful training programs.
            </p>

            <div className="flex justify-center space-x-4">
              <Link
                to="/gallery/videos"
                className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-4-4v8m-4-4h8m-4-4v8" />
                </svg>
                Watch Videos
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
                  {category.id === 'all' ? galleryImages.length : galleryImages.filter(img => img.category === category.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No images found</h3>
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
                  Showing {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="group cursor-pointer bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    onClick={() => openLightbox(image)}
                  >
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Image Number Badge */}
                      <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm font-medium">
                        {index + 1} / {filteredImages.length}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
                        {image.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {image.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-7xl max-h-screen w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Buttons */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 z-50 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 z-50 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Content */}
            <div className="flex flex-col items-center max-w-full max-h-full">
              <div className="relative max-w-full max-h-[80vh] mb-4">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              </div>
              
              {/* Image Info */}
              <div className="text-center text-white bg-black bg-opacity-50 rounded-lg px-6 py-4 max-w-2xl">
                <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-gray-300">{selectedImage.description}</p>
                <div className="mt-4 text-sm text-gray-400">
                  Image {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} of {filteredImages.length}
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
            Ready to Be Part of Our Success Story?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join our training programs and become part of our gallery of successful graduates.
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
              to="/gallery/videos"
              className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-orange-500 font-semibold text-lg rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-4-4v8m-4-4h8m-4-4v8" />
              </svg>
              Watch Videos
            </Link>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default Images;
