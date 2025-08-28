// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Website/Public endpoints
  HERO_SLIDES: '/website/hero-slides',
  COURSES: '/website/courses',
  TESTIMONIALS: '/website/testimonials',
  CONTACT: '/website/contact',
  ABOUT: '/website/about',
  GALLERY: '/website/gallery',
  ENROLLMENTS: '/website/enrollments',
  
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Student endpoints
  STUDENT_PROFILE: '/student/profile',
  STUDENT_COURSES: '/student/courses',
  STUDENT_CERTIFICATES: '/student/certificates',
  STUDENT_PAYMENTS: '/student/payments',
  
  // Admin endpoints
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_ENQUIRIES: '/admin/enquiries',
  ADMIN_GALLERY: '/admin/gallery',
  ADMIN_CMS: '/admin/cms'
};

// Base URLs for different environments
export const BASE_URLS = {
  development: 'http://localhost:3000/api',
  staging: 'https://api-staging.earthmovers.com',
  production: 'https://api.earthmovers.com'
};

export default API_ENDPOINTS;
