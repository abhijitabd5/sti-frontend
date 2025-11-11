import httpClient from '@/services/utils/httpClient';

class GalleryApi {
  // Get gallery items by media type and page slug
  async getGalleryItems(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page_slug: params.page_slug || 'image_gallery',
        media_type: params.media_type || 'image',
        ...params
      });

      const response = await httpClient.get(`/internal/gallery?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      throw error;
    }
  }

  // Create a new gallery item
  async createGalleryItem(formData) {
    try {
      // Extract media_type from formData
      const mediaType = formData.get('media_type');

      const response = await httpClient.post(
        `/internal/gallery/create?media_type=${mediaType}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      throw error;
    }
  }

  // Update existing gallery item
  async updateGalleryItem(id, formData) {
    try {
      const response = await httpClient.put(
        `/internal/gallery/edit/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating gallery item:', error);
      throw error;
    }
  }

  // Update gallery item status (active/inactive)
  async updateGalleryItemStatus(id, isActive) {
    try {
      const response = await httpClient.patch(
        `/internal/gallery/status/${id}`,
        { is_active: isActive }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating gallery item status:', error);
      throw error;
    }
  }

  // Reorder gallery items
  async reorderGalleryItems(items) {
    try {
      const response = await httpClient.patch(
        '/internal/gallery/reorder',
        { items: items }
      );
      return response.data;
    } catch (error) {
      console.error('Error reordering gallery items:', error);
      throw error;
    }
  }

  // Delete gallery item
  async deleteGalleryItem(id) {
    try {
      const response = await httpClient.delete(`/internal/gallery/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      throw error;
    }
  }

  //Get All Pages
  async getAllPages() {
    try {
      const response = await httpClient.get(`/internal/pages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  }

  // Get public gallery items by slug
  async getPublicGalleryItemBySlug(slug) {
    try {
      const response = await httpClient.get(`/public/gallery/item/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public gallery item:', error);
      throw error;
    }
  }

  // Get public gallery items by page slug
  async getPublicGalleryByPageSlug(pageSlug) {
    try {
      const response = await httpClient.get(`/public/gallery/page/${pageSlug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public gallery by page slug:', error);
      throw error;
    }
  }
}

export default new GalleryApi();