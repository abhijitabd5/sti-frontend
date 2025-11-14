import httpClient from '@/services/utils/httpClient';

class PromotionAnalyticsApi {
  // Get dashboard stats
  async getDashboardStats() {
    try {
      const response = await httpClient.get('/internal/promotion/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Get partner analytics
  async getPartnerAnalytics(partnerId, params = {}) {
    try {
      const query = new URLSearchParams({
        from: params.from || '',
        to: params.to || '',
      });
      const response = await httpClient.get(`/internal/promotion/analytics/partner/${partnerId}?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching partner analytics:', error);
      throw error;
    }
  }

  // Get post analytics
  async getPostAnalytics(postId, params = {}) {
    try {
      const query = new URLSearchParams({
        from: params.from || '',
        to: params.to || '',
      });
      const response = await httpClient.get(`/internal/promotion/analytics/post/${postId}?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post analytics:', error);
      throw error;
    }
  }

  // Get source analytics
  async getSourceAnalytics(params = {}) {
    try {
      const query = new URLSearchParams({
        from: params.from || '',
        to: params.to || '',
      });
      const response = await httpClient.get(`/internal/promotion/analytics/source?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching source analytics:', error);
      throw error;
    }
  }

  // Get clicks by date range
  async getClicksByDateRange(params = {}) {
    try {
      const query = new URLSearchParams({
        from: params.from || '',
        to: params.to || '',
      });
      const response = await httpClient.get(`/internal/promotion/analytics/clicks?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching clicks:', error);
      throw error;
    }
  }

  // Get conversion rate
  async getConversionRate(params = {}) {
    try {
      const query = new URLSearchParams({
        from: params.from || '',
        to: params.to || '',
      });
      const response = await httpClient.get(`/internal/promotion/analytics/conversion-rate?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversion rate:', error);
      throw error;
    }
  }

  // Get top performing partners
  async getTopPartners(params = {}) {
    try {
      const query = new URLSearchParams({
        limit: params.limit || 10,
      });
      const response = await httpClient.get(`/internal/promotion/analytics/top/partners?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top partners:', error);
      throw error;
    }
  }

  // Get top performing posts
  async getTopPosts(params = {}) {
    try {
      const query = new URLSearchParams({
        limit: params.limit || 10,
      });
      const response = await httpClient.get(`/internal/promotion/analytics/top/posts?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top posts:', error);
      throw error;
    }
  }

  // Export analytics report
  async exportReport(params = {}) {
    try {
      const query = new URLSearchParams({
        format: params.format || 'csv',
        from: params.from || '',
        to: params.to || '',
      });
      const response = await httpClient.get(`/internal/promotion/analytics/export?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }
}

export default new PromotionAnalyticsApi();
