import httpClient from '@/services/utils/httpClient';

class PageApi {
  // Get all pages with filters and pagination
  async getPages(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        language: params.language || 'en',
        limit: params.limit || 10,
        offset: params.offset || 0,
        orderBy: params.orderBy || 'createdAt',
        orderDirection: params.orderDirection || 'DESC',
        ...params
      });
      
      const response = await httpClient.get(`/internal/pages?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  }

  // Get single page by ID
  async getPageById(id, includeContents = true) {
    try {
      const queryParams = new URLSearchParams({
        includeContents: includeContents.toString()
      });
      
      const response = await httpClient.get(`/internal/pages/${id}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching page details:', error);
      throw error;
    }
  }

  // Get page by slug
  async getPageBySlug(slug, language = 'en', includeContents = true) {
    try {
      const queryParams = new URLSearchParams({
        language,
        includeContents: includeContents.toString()
      });
      
      const response = await httpClient.get(`/internal/pages/slug/${slug}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching page by slug:', error);
      throw error;
    }
  }

  // Create new page
  async createPage(pageData) {
    try {
      const formData = new FormData();
      
      // Add all fields to form data
      Object.keys(pageData).forEach(key => {
        if (pageData[key] !== null && pageData[key] !== undefined) {
          // Handle boolean values as strings
          if (typeof pageData[key] === 'boolean') {
            formData.append(key, pageData[key] ? 'true' : 'false');
          }
          // Handle file uploads
          else if (key === 'og_image' && pageData[key] instanceof File) {
            formData.append('og_image', pageData[key]);
          }
          // Handle regular fields
          else if (!(pageData[key] instanceof File)) {
            formData.append(key, pageData[key]);
          }
        }
      });

      const response = await httpClient.post('/internal/pages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  }

  // Update existing page
  async updatePage(id, pageData) {
    try {
      const formData = new FormData();
      
      // Add all fields to form data
      Object.keys(pageData).forEach(key => {
        if (pageData[key] !== null && pageData[key] !== undefined) {
          // Handle boolean values as strings
          if (typeof pageData[key] === 'boolean') {
            formData.append(key, pageData[key] ? 'true' : 'false');
          }
          // Handle file uploads
          else if (key === 'og_image' && pageData[key] instanceof File) {
            formData.append('og_image', pageData[key]);
          }
          // Handle regular fields
          else if (!(pageData[key] instanceof File)) {
            formData.append(key, pageData[key]);
          }
        }
      });

      const response = await httpClient.put(`/internal/pages/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  }

  // Delete page
  async deletePage(id) {
    try {
      const response = await httpClient.delete(`/internal/pages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  }

  // Get pages by language
  async getPagesByLanguage(language) {
    try {
      const response = await httpClient.get(`/internal/pages/language/${language}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pages by language:', error);
      throw error;
    }
  }

  // Get page statistics
  async getPageStatistics() {
    try {
      const response = await httpClient.get('/internal/pages/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching page statistics:', error);
      throw error;
    }
  }

  // Duplicate page
  async duplicatePage(id, duplicateData = {}) {
    try {
      const response = await httpClient.post(`/internal/pages/${id}/duplicate`, duplicateData);
      return response.data;
    } catch (error) {
      console.error('Error duplicating page:', error);
      throw error;
    }
  }
}

export default new PageApi();