import httpClient from '@/services/utils/httpClient';

class PromotionPartnerApi {
  // List partners with filters and pagination
  async listPartners(params = {}) {
    try {
      const query = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
        status: params.status || '',
        date_from: params.date_from || '',
        date_to: params.date_to || '',
      });
      const response = await httpClient.get(`/internal/promotion/partners?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error listing partners:', error);
      throw error;
    }
  }

  // Get single partner
  async getPartner(id) {
    try {
      const response = await httpClient.get(`/internal/promotion/partners/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching partner:', error);
      throw error;
    }
  }

  // Create partner
  async createPartner(data) {
    try {
      const response = await httpClient.post(`/internal/promotion/partners`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating partner:', error);
      throw error;
    }
  }

  // Update partner
  async updatePartner(id, data) {
    try {
      const response = await httpClient.put(`/internal/promotion/partners/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating partner:', error);
      throw error;
    }
  }

  // Delete partner
  async deletePartner(id) {
    try {
      const response = await httpClient.delete(`/internal/promotion/partners/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting partner:', error);
      throw error;
    }
  }

  // Toggle status
  async togglePartnerStatus(id) {
    try {
      const response = await httpClient.patch(`/internal/promotion/partners/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling partner status:', error);
      throw error;
    }
  }
}

export default new PromotionPartnerApi();
