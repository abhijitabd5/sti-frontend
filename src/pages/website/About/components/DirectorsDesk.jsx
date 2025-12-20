import React from 'react';

const DirectorsDesk = ({ galleryData = [] }) => {
  // Get images from gallery data by slug
  const getImageBySlug = (slug) => {
    const item = galleryData.find(item => item.slug === slug);
    return item ? item.media_url : null;
  };

  // Main director photo
  const directorImage = getImageBySlug('about-us-director-main-image-lz1-0m3') || 
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  
  // Side photos
  const sideImages = [
    getImageBySlug('about-us-director-small-image--b52-vad') || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    getImageBySlug('about-us-director-small-image--39g-aw5') || 'https://images.unsplash.com/photo-1590845947670-c009801ffa74?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    getImageBySlug('about-us-director-small-image--k4m-20g') || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            From the Director's Desk
          </h2>
          {/* Curved decorative lines */}
          <div className="flex justify-center items-center gap-2">
            <svg className="w-24 h-3" viewBox="0 0 100 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6 Q 25 0, 50 6 T 100 6" stroke="currentColor" strokeWidth="2" className="text-orange-500" fill="none"/>
            </svg>
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <svg className="w-24 h-3" viewBox="0 0 100 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6 Q 25 12, 50 6 T 100 6" stroke="currentColor" strokeWidth="2" className="text-orange-500" fill="none"/>
            </svg>
          </div>
        </div>

        {/* Photos Section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 justify-center">
          {/* Main Director Photo - Fixed dimensions */}
          <div className="relative rounded-lg overflow-hidden shadow-2xl w-full lg:w-[700px] h-[600px] flex-shrink-0">
            <img
              src={directorImage}
              alt="Director"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
              <h3 className="text-2xl font-bold text-white mb-1">
                Rajesh Kumar
              </h3>
              <p className="text-orange-400 font-semibold text-lg">
                Founder & Director
              </p>
            </div>
          </div>

          {/* Side Photos Column - Fixed dimensions matching main photo height */}
          <div className="flex lg:flex-col flex-row gap-4 w-full lg:w-[240px] h-[600px] flex-shrink-0">
            {sideImages.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg shadow-lg w-full lg:w-[240px] h-[188px] flex-shrink-0 transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={image}
                  alt={`Training ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-4 border-orange-500 pl-6 mb-6">
                "Building careers, transforming lives, and shaping the future of the construction industry - one skilled operator at a time."
              </p>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Welcome to Earth Movers Training Academy. With over three decades of experience in the construction and heavy equipment industry, I founded this institution with a singular vision: to create a world-class training center that not only teaches technical skills but also instills the values of safety, professionalism, and excellence.
              </p>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Our journey began in 2018 with a small training yard and a handful of dedicated students. Today, we stand proud as one of the leading heavy equipment training institutes, having trained over 2,500 students who are now successfully employed across the country.
              </p>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                What sets us apart is our commitment to practical, hands-on training using the latest equipment and industry-standard practices. We don't just teach people how to operate machines; we prepare them for real-world challenges, emphasizing safety protocols, maintenance knowledge, and professional conduct.
              </p>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                I invite you to join our family of successful graduates and take the first step toward a rewarding career in the construction industry. Together, we'll build not just skills, but a foundation for your future success.
              </p>
            </div>

            {/* Signature */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'cursive' }}>
                    Rajesh Kumar
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Founder & Director
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorsDesk;
