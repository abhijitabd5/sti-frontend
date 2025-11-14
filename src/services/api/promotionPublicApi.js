import httpClient from '@/services/utils/httpClient';

class PromotionPublicApi {
  // Track click (redirects to target URL)
  // Note: This is typically called via direct URL navigation, not via API
  trackClick(code, postId, source) {
    const query = new URLSearchParams({
      code: code || '',
      post: postId || '',
      source: source || '',
    });
    // Return the URL for navigation
    return `/api/public/ref?${query.toString()}`;
  }

  // Get public post details
  async getPublicPost(postId) {
    try {
      const response = await httpClient.get(`/public/promotion/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public post:', error);
      throw error;
    }
  }

  // Validate referral code
  async validateReferralCode(code) {
    try {
      const response = await httpClient.get(`/public/promotion/validate/${code}`);
      return response.data;
    } catch (error) {
      console.error('Error validating referral code:', error);
      throw error;
    }
  }
}

export default new PromotionPublicApi();
