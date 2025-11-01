import httpClient from '@/services/utils/httpClient';

class EnquiryApi {
  // Get all courses
  async getCourses(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        language: params.language || 'en',
        sortBy: params.sortBy || 'display_order',
        sortOrder: params.sortOrder || 'ASC',
        ...params
      });

      const response = await httpClient.get(`/public/courses?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Create enquiry
  async createEnquiry(enquiryData) {
    try {
      const response = await httpClient.post('/public/enquiry', {
        name: enquiryData.name,
        phone: enquiryData.phone,
        email: enquiryData.email,
        course_id: enquiryData.course_id,
        course_name: enquiryData.course_name,
        message: enquiryData.message || ''
      });
      return response.data;
    } catch (error) {
      console.error('Error creating enquiry:', error);
      throw error;
    }
  }
}

export default new EnquiryApi();
