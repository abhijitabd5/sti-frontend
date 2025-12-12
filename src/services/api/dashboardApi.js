import httpClient from '@/services/utils/httpClient';

class DashboardApi {
  // Students Statistics
  async getStudentsStats() {
    try {
      const response = await httpClient.get('/internal/dashboard/students/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching students stats:', error);
      throw error;
    }
  }

  // Enquiries Statistics with Breakdown
  async getEnquiriesStats() {
    try {
      const response = await httpClient.get('/internal/dashboard/enquiries/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching enquiries stats:', error);
      throw error;
    }
  }

  // Promotion Source Analytics for Dashboard Social Traffic Component
  async getSourceAnalytics(params = {}) {
    try {
      const query = new URLSearchParams();
      
      // Add custom date range for the "Custom" column
      if (params.customFrom && params.customTo) {
        query.append('customFrom', params.customFrom);
        query.append('customTo', params.customTo);
      }

      const response = await httpClient.get(`/internal/promotion/analytics/sources/periods?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching source analytics:', error);
      throw error;
    }
  }

  // Students per State Analytics - REMOVED: Now using getStudentsStats() which includes studentsByState data
  // async getStudentsPerState() {
  //   try {
  //     const response = await httpClient.get('/internal/student/analytics/enrollments-by-state');
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching students per state data:', error);
  //     throw error;
  //   }
  // }
}

export default new DashboardApi();