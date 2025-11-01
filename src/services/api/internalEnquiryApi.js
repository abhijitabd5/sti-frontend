import httpClient from '@/services/utils/httpClient';

class InternalEnquiryApi {
  // Get all enquiries with pagination
  async getEnquiries(page = 1, limit = 10) {
    try {
      const response = await httpClient.get(`/internal/enquiry`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      throw error;
    }
  }

  // Filter enquiries by status
  async getEnquiriesByStatus(status, page = 1, limit = 10) {
    try {
      const response = await httpClient.get(`/internal/enquiry/status/${status}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching enquiries by status:', error);
      throw error;
    }
  }

  // Filter enquiries by source
  async getEnquiriesBySource(source, page = 1, limit = 10) {
    try {
      const response = await httpClient.get(`/internal/enquiry/source/${source}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching enquiries by source:', error);
      throw error;
    }
  }

  // Search enquiries
  async searchEnquiries(query, page = 1, limit = 10) {
    try {
      const response = await httpClient.get(`/internal/enquiry/search`, {
        params: { query, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching enquiries:', error);
      throw error;
    }
  }

  // Update enquiry status
  async updateStatus(id, status) {
    try {
      const response = await httpClient.patch(`/internal/enquiry/update-status/${id}`, {
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      throw error;
    }
  }

  // Take action on enquiry
  async takeAction(id, actionType, remark) {
    try {
      const response = await httpClient.patch(`/internal/enquiry/update-action/${id}`, {
        action_type: actionType,
        remark: remark || null
      });
      return response.data;
    } catch (error) {
      console.error('Error taking action on enquiry:', error);
      throw error;
    }
  }

  // Delete enquiry
  async deleteEnquiry(id) {
    try {
      const response = await httpClient.delete(`/internal/enquiry/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      throw error;
    }
  }
}

export default new InternalEnquiryApi();
