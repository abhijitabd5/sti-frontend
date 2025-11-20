import httpClient from '../utils/httpClient';

const extractData = (response) => {
  // Defensive extraction of payload shape { success, message, data, timestamp }
  if (response && response.data && typeof response.data === 'object') {
    return response.data;
  }
  return response;
};

export const reviewApi = {
  // Get public reviews with optional limit
  async getPublicReviews({ limit = 5 } = {}) {
    const response = await httpClient.get('/public/reviews', {
      params: { limit },
    });
    return extractData(response);
  },

  // Create public review (from website)
  async createPublicReview(reviewData) {
    const response = await httpClient.post('/public/review/create', reviewData);
    return extractData(response);
  },

  // Internal API - Get all reviews with optional filter
  async getReviews({ is_approved } = {}) {
    const params = {};
    if (is_approved !== undefined) {
      params.is_approved = is_approved;
    }
    const response = await httpClient.get('/internal/reviews', { params });
    return extractData(response);
  },

  // Create new review
  async createReview(formData) {
    const response = await httpClient.post('/internal/review/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  },

  // Update review
  async updateReview(id, formData) {
    const response = await httpClient.put(`/internal/review/edit/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  },

  // Get review by ID
  async viewReview(id) {
    const response = await httpClient.get(`/internal/review/view/${id}`);
    return extractData(response);
  },

  // Toggle approval status
  async toggleApprovalStatus(id, is_approved) {
    const response = await httpClient.patch(`/internal/review/approval-status/${id}`, {
      is_approved,
    });
    return extractData(response);
  },

  // Reorder reviews
  async reorderReviews(reviews) {
    const response = await httpClient.post('/internal/review/reorder', {
      reviews,
    });
    return extractData(response);
  },

  // Delete review (soft delete)
  async deleteReview(id) {
    const response = await httpClient.delete(`/internal/review/delete/${id}`);
    return extractData(response);
  },

  // Get statistics
  async getStatistics() {
    const response = await httpClient.get('/internal/review/statistics');
    return extractData(response);
  },
};

export default reviewApi;
