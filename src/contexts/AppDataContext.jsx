import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import publicCourseApi from '@/services/api/publicCourseApi';

const AppDataContext = createContext();

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
};

export const AppDataProvider = ({ children }) => {
  const [courses, setCourses] = useState({
    data: [],
    loading: true,
    error: null,
  });

  // Add more data states here as needed
  // const [gallery, setGallery] = useState({ data: [], loading: true, error: null });
  // const [reviews, setReviews] = useState({ data: [], loading: true, error: null });

  // Fetch courses using public API
  const fetchCourses = useCallback(async () => {
    try {
      setCourses(prev => ({ ...prev, loading: true }));
      const response = await publicCourseApi.getCourses({ language: 'en' });
      // Public API returns data directly or wrapped in success/data structure
      const coursesData = response?.data || response || [];
      setCourses({ data: coursesData, loading: false, error: null });
    } catch (err) {
      console.error('Error fetching courses:', err);
      setCourses({ data: [], loading: false, error: err.message });
    }
  }, []);

  // Add more fetch functions here as needed
  // const fetchGallery = useCallback(async () => { ... }, []);
  // const fetchReviews = useCallback(async () => { ... }, []);

  // Initial data fetch
  useEffect(() => {
    fetchCourses();
    // fetchGallery();
    // fetchReviews();
  }, [fetchCourses]);

  const value = {
    courses,
    refreshCourses: fetchCourses,
    // Add more data and refresh functions here
    // gallery,
    // refreshGallery: fetchGallery,
    // reviews,
    // refreshReviews: fetchReviews,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};
