import httpClient from '@/services/utils/httpClient';

class DashboardApi {
  // Dashboard Stats - Students and Enquiries
  async getDashboardStats() {
    try {
      const response = await httpClient.get('/internal/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

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

  // Income vs Expenses Chart Data
  async getIncomeExpensesChart(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.period) query.append('period', params.period);
      if (params.from) query.append('from', params.from);
      if (params.to) query.append('to', params.to);

      const response = await httpClient.get(`/internal/dashboard/income-expenses/chart?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching income expenses chart:', error);
      throw error;
    }
  }

  // Top Expenses/Income Doughnut Chart Data
  async getTopCategoriesChart(type = 'expense', params = {}) {
    try {
      const query = new URLSearchParams();
      query.append('type', type);
      if (params.period) query.append('period', params.period);
      if (params.limit) query.append('limit', params.limit);

      const response = await httpClient.get(`/internal/transaction-categories/with-amounts?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top categories chart:', error);
      throw error;
    }
  }

  // Legacy method for backward compatibility
  async getTopExpensesChart(params = {}) {
    return this.getTopCategoriesChart('expense', params);
  }

  // Recent Activity Feed
  async getRecentActivity(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.limit) query.append('limit', params.limit);
      if (params.type) query.append('type', params.type);

      const response = await httpClient.get(`/internal/dashboard/recent-activity?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  // Dashboard Overview (All stats in one call)
  async getDashboardOverview(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.customFrom && params.customTo) {
        query.append('customFrom', params.customFrom);
        query.append('customTo', params.customTo);
      }

      const response = await httpClient.get(`/internal/dashboard/overview?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  }

  // Students per State Analytics
  async getStudentsPerState() {
    try {
      const response = await httpClient.get('/internal/student/analytics/enrollments-by-state');
      return response.data;
    } catch (error) {
      console.error('Error fetching students per state data:', error);
      throw error;
    }
  }


}

export default new DashboardApi();