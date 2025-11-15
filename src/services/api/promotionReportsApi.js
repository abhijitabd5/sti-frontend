import httpClient from '@/services/utils/httpClient';

class PromotionReportsApi {
  // Top 3 Sources Summary
  async getTopSources(params = {}) {
    try {
      const query = new URLSearchParams({
        limit: params.limit || 3,
        ...(params.from && { from: params.from }),
        ...(params.to && { to: params.to })
      });
      const response = await httpClient.get(`/internal/promotion/analytics/top/sources?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top sources:', error);
      throw error;
    }
  }

  // Top 3 Partners Summary (with names)
  async getTopPartners(params = {}) {
    try {
      const query = new URLSearchParams({
        limit: params.limit || 3,
        ...(params.from && { from: params.from }),
        ...(params.to && { to: params.to })
      });
      const response = await httpClient.get(`/internal/promotion/analytics/top/partners/detailed?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top partners:', error);
      throw error;
    }
  }

  // Top 3 Posts Summary (with titles)
  async getTopPosts(params = {}) {
    try {
      const query = new URLSearchParams({
        limit: params.limit || 3,
        ...(params.from && { from: params.from }),
        ...(params.to && { to: params.to })
      });
      const response = await httpClient.get(`/internal/promotion/analytics/top/posts/detailed?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top posts:', error);
      throw error;
    }
  }

  // Partners Report (Main Table)
  async getPartnersReport(params = {}) {
    try {
      const query = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.from && { from: params.from }),
        ...(params.to && { to: params.to }),
        ...(params.search && { search: params.search })
      });
      const response = await httpClient.get(`/internal/promotion/analytics/partners/report?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching partners report:', error);
      throw error;
    }
  }

  // Partner Posts Report (When Partner Selected)
  async getPartnerPostsReport(partnerId, params = {}) {
    try {
      const query = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.from && { from: params.from }),
        ...(params.to && { to: params.to }),
        ...(params.search && { search: params.search })
      });
      const response = await httpClient.get(`/internal/promotion/analytics/partner/${partnerId}/posts/report?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching partner posts report:', error);
      throw error;
    }
  }

  // Partners List for Dropdown
  async getPartnersList() {
    try {
      const response = await httpClient.get('/internal/promotion/analytics/partners/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching partners list:', error);
      throw error;
    }
  }

  // Export Partners Report
  async exportPartnersReport(params = {}) {
    try {
      const query = new URLSearchParams({
        ...(params.from && { from: params.from }),
        ...(params.to && { to: params.to }),
        ...(params.search && { search: params.search })
      });
      const response = await httpClient.get(`/internal/promotion/analytics/partners/report/export?${query.toString()}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error exporting partners report:', error);
      throw error;
    }
  }

  // Export Partner Posts Report
  async exportPartnerPostsReport(partnerId, params = {}) {
    try {
      const query = new URLSearchParams({
        ...(params.from && { from: params.from }),
        ...(params.to && { to: params.to }),
        ...(params.search && { search: params.search })
      });
      const response = await httpClient.get(`/internal/promotion/analytics/partner/${partnerId}/posts/report/export?${query.toString()}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error exporting partner posts report:', error);
      throw error;
    }
  }
}

export default new PromotionReportsApi();