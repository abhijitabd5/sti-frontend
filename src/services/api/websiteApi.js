import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../utils/apiEndpoints';
import MOCK_DATA from '@/mockData/mockData';


// API service functions
export const websiteApi = {
  // Get hero slides for the main banner
  getHeroSlides: async () => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.get(API_ENDPOINTS.HERO_SLIDES);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_DATA.heroSlides), 500);
      });
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      return MOCK_DATA.heroSlides; // Fallback to mock data
    }
  },

  // Get courses for courses section
  getCourses: async (limit = null) => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.get(`${API_ENDPOINTS.COURSES}${limit ? `?limit=${limit}` : ''}`);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => {
          const courses = limit ? MOCK_DATA.courses.slice(0, limit) : MOCK_DATA.courses;
          resolve(courses);
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      return MOCK_DATA.courses;
    }
  },

  // Get scrolling courses for marquee section
  getScrollingCourses: async () => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.get(`${API_ENDPOINTS.COURSES}?featured=true`);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_DATA.courses.map(course => ({
            id: course.id,
            title: course.title,
            image: course.image,
            duration: course.duration,
            enrollmentCount: course.enrollmentCount
          })));
        }, 200);
      });
    } catch (error) {
      console.error('Error fetching scrolling courses:', error);
      return MOCK_DATA.courses.slice(0, 8);
    }
  },

  // Get testimonials
  getTestimonials: async () => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.get(API_ENDPOINTS.TESTIMONIALS);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_DATA.testimonials), 400);
      });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return MOCK_DATA.testimonials;
    }
  },

  // Get about information
  getAboutInfo: async () => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.get(API_ENDPOINTS.ABOUT);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_DATA.aboutInfo), 250);
      });
    } catch (error) {
      console.error('Error fetching about info:', error);
      return MOCK_DATA.aboutInfo;
    }
  },

  // Submit contact form
  submitContactForm: async (formData) => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.post(API_ENDPOINTS.CONTACT, formData);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Thank you for your message! We will get back to you within 24 hours.',
            id: Date.now()
          });
        }, 1000);
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  // Submit enrollment form
  submitEnrollment: async (enrollmentData) => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.post(API_ENDPOINTS.ENROLLMENTS, enrollmentData);
      // return response.data;
      
      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Enrollment application submitted successfully! We will contact you soon.',
            applicationId: `APP-${Date.now()}`,
            nextSteps: [
              'Review application within 2 business days',
              'Schedule orientation call',
              'Send course materials and schedule'
            ]
          });
        }, 1200);
      });
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      throw error;
    }
  }
};

export default websiteApi;
