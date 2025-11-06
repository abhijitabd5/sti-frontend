import httpClient from '@/services/utils/httpClient';

class PromotionPostApi {
  // List posts with filters and pagination
  async listPosts(params = {}) {
    try {
      const query = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
        partner_id: params.partner_id || '',
        post_platform: params.post_platform || '',
        is_active: params.is_active ?? '',
      });
      const response = await httpClient.get(`/internal/promotion/posts?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error listing posts:', error);
      throw error;
    }
  }

  // Get posts by partner
  async listPartnerPosts(partnerId, params = {}) {
    try {
      const query = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
      });
      const response = await httpClient.get(`/internal/promotion/partners/${partnerId}/posts?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error listing partner posts:', error);
      throw error;
    }
  }

  // Get single post
  async getPost(id) {
    try {
      const response = await httpClient.get(`/internal/promotion/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  // Create post
  async createPost(data) {
    try {
      const response = await httpClient.post(`/internal/promotion/posts`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Update post
  async updatePost(id, data) {
    try {
      const response = await httpClient.put(`/internal/promotion/posts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Delete post
  async deletePost(id) {
    try {
      const response = await httpClient.delete(`/internal/promotion/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Toggle status
  async togglePostStatus(id) {
    try {
      const response = await httpClient.patch(`/internal/promotion/posts/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling post status:', error);
      throw error;
    }
  }
}

export default new PromotionPostApi();
