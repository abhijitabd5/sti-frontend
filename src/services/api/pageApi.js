import httpClient from '@/services/utils/httpClient';

class PageApi {
  // Get all pages with filters and pagination
  async getPages(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Only add language if specified
      if (params.language) {
        queryParams.append('language', params.language);
      }
      
      // Add other params with defaults
      queryParams.append('limit', params.limit || 10);
      queryParams.append('offset', params.offset || 0);
      queryParams.append('orderBy', params.orderBy || 'createdAt');
      queryParams.append('orderDirection', params.orderDirection || 'DESC');
      
      // Add search if provided
      if (params.search) {
        queryParams.append('search', params.search);
      }
      
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
      
      // Required fields
      const requiredFields = ['name', 'language'];
      
      // Add all fields to form data
      Object.keys(pageData).forEach(key => {
        // Skip og_image if it's null or not a File (per API documentation)
        if (key === 'og_image' && !(pageData[key] instanceof File)) {
          return;
        }
        
        // Skip empty optional fields (but keep required fields even if empty)
        if (!requiredFields.includes(key) && 
            (pageData[key] === null || 
             pageData[key] === undefined || 
             pageData[key] === '')) {
          return;
        }
        
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
        // Skip og_image if it's null or not a File (per API documentation)
        if (key === 'og_image' && !(pageData[key] instanceof File)) {
          return;
        }
        
        // For updates, we can send empty strings to clear fields
        // But skip null/undefined values
        if (pageData[key] === null || pageData[key] === undefined) {
          return;
        }
        
        // Handle boolean values as strings
        if (typeof pageData[key] === 'boolean') {
          formData.append(key, pageData[key] ? 'true' : 'false');
        }
        // Handle file uploads
        else if (key === 'og_image' && pageData[key] instanceof File) {
          formData.append('og_image', pageData[key]);
        }
        // Handle regular fields (including empty strings for clearing)
        else if (!(pageData[key] instanceof File)) {
          formData.append(key, pageData[key]);
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


}

export default new PageApi();