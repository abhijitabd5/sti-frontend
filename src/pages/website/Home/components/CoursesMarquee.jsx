import React, { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { publicCourseApi } from "@/services/api/publicCourseApi";

const CoursesMarquee = ({ courses = [] }) => {
  const scrollRef = useRef(null);
  const { getCurrentLanguageObj } = useLanguage();
  const languageCode = useMemo(
    () => getCurrentLanguageObj()?.code || "en",
    [getCurrentLanguageObj]
  );
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch courses if none provided via props
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await publicCourseApi.getCourses({
          language: languageCode,
          sortBy: "display_order",
          sortOrder: "ASC",
        });
        console.log(data);
        if (!active) return;
        setFetchedCourses(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load public courses for marquee:", e);
        if (active) setFetchedCourses([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [languageCode]);

  // Use fetchedCourses directly (no fallback to prop courses)
  const list = fetchedCourses;

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || list.length === 0) return;

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
  }, [list.length]);

  // Pause animation on hover
  const handleMouseEnter = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.style.animationPlayState = "paused";
    }
  };

  const handleMouseLeave = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.style.animationPlayState = "running";
    }
  };

  const formatINR = (value) => {
    const num = Number(value);
    if (!isFinite(num)) return "";
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(num);
    } catch {
      return `${num}`;
    }
  };

  if (loading && !list.length) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <div className="text-center">
          <div className="animate-pulse flex space-x-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-300 dark:bg-gray-600 h-24 w-64 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!list.length) {
    return null;
  }

  // Duplicate courses for seamless loop
  const duplicatedCourses = [...list, ...list];

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Our Training Programs
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore our comprehensive heavy equipment training courses designed to
          prepare you for success
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
            {duplicatedCourses.map((course, index) => {
              const fee =
                course.effective_fee ||
                course.total_fee ||
                course.base_course_fee ||
                "0";
              const isDiscounted =
                course.is_discounted &&
                parseFloat(course.discount_percentage || "0") > 0;
              return (
                <div
                  key={`${course.id}-${index}`}
                  className="flex-shrink-0 w-80 group cursor-pointer"
                >
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="relative">
                      <img
                        src={course.thumbnail || course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {parseFloat(fee) === 0 ? "Free" : formatINR(fee)}
                      </div>

                      {/* Offer Badge */}
                      {course.show_offer_badge && course.offer_badge_text && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {course.offer_badge_text}
                        </div>
                      )}

                      {/* Duration */}
                      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                        {course.duration ? `${course.duration} days` : ""}
                      </div>

                    </div>

                    <div className="p-6">
                      {/* Header with title and discount chip (match list card) */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors flex-1">
                          {course.title}
                        </h3>
                        {isDiscounted && (
                          <div className="ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                            {course.discount_percentage}% OFF
                          </div>
                        )}
                      </div>

                      {/* Enrollment Count (keep) */}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                          />
                        </svg>
                        300 students enrolled
                      </div>

                      {/* Actions (same as list card) */}
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
              );
            })}
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
      </div>
    </section>
  );
};

export default CoursesMarquee;
