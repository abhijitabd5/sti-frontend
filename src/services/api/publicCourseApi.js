import httpClient from '../utils/httpClient';

// Public Courses API service
// Docs: docs/public-courses-api.md
// Endpoints:
// - GET /public/courses?language=en&sortBy=display_order&sortOrder=ASC
// - GET /public/courses/view/:id

const extractData = (response) => {
  // Defensive extraction of payload shape { success, message, data, timestamp }
  if (response && response.data && typeof response.data === 'object') {
    return response.data.data ?? response.data;
  }
  return response;
};

export const publicCourseApi = {
  // Get all public courses for a language, sorted
  async getCourses({ language = 'en', sortBy = 'display_order', sortOrder = 'ASC' } = {}) {
    const response = await httpClient.get('/public/courses', {
      params: { language, sortBy, sortOrder },
    });
    return extractData(response);
  },

  // Get single course by ID
  async getCourseById(id) {
    if (!id) throw new Error('Course ID is required');
    const response = await httpClient.get(`/public/courses/view/${id}`);
    return extractData(response);
  },
};

export default publicCourseApi;