import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CoursesMarquee = ({ courses = [] }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || courses.length === 0) return;

    let animationId;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Adjust speed as needed

    const animate = () => {
      if (scrollContainer) {
        scrollPosition += scrollSpeed;
        
        // Reset when we've scrolled past half the content (for seamless loop)
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        
        scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [courses.length]);

  // Pause animation on hover
  const handleMouseEnter = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.style.animationPlayState = 'paused';
    }
  };

  const handleMouseLeave = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.style.animationPlayState = 'running';
    }
  };

  if (!courses.length) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <div className="text-center">
          <div className="animate-pulse flex space-x-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-300 dark:bg-gray-600 h-24 w-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Duplicate courses for seamless loop
  const duplicatedCourses = [...courses, ...courses];

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Our Training Programs
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore our comprehensive heavy equipment training courses designed to prepare you for success
        </p>
      </div>
      
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800 z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-800 z-10 pointer-events-none"></div>
        
        <div className="overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex space-x-6 transition-transform"
            style={{ width: `${duplicatedCourses.length * 320}px` }}
          >
            {duplicatedCourses.map((course, index) => (
              <div
                key={`${course.id}-${index}`}
                className="flex-shrink-0 w-80 group cursor-pointer"
              >
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {course.duration}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-xl mb-1 line-clamp-2">
                        {course.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        </svg>
                        <span>{course.enrollmentCount} enrolled</span>
                      </div>
                      
                      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                        Available
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        to={`/courses/${course.id}`}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 text-center"
                      >
                        View Course
                      </Link>
                      <Link
                        to="/enroll"
                        className="flex-1 bg-transparent border-2 border-orange-500 text-orange-500 font-semibold py-3 px-4 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 text-center"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* View All Courses Button */}
      <div className="text-center mt-8">
        <Link
          to="/courses"
          className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300"
        >
          View All Courses
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default CoursesMarquee;
