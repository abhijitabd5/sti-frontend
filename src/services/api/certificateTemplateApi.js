import httpClient from '@/services/utils/httpClient';

class CertificateTemplateApi {
  // Get all certificate templates with filters
  async getTemplates(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        sortBy: params.sortBy || 'display_order',
        sortOrder: params.sortOrder || 'ASC',
        ...params
      });
      
      const response = await httpClient.get(`/internal/certificate-templates?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching certificate templates:', error);
      throw error;
    }
  }

  // Get template statistics
  async getTemplateStats() {
    try {
      const response = await httpClient.get('/internal/certificate-templates/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching template stats:', error);
      throw error;
    }
  }

  // Get single template by ID
  async getTemplateById(id) {
    try {
      const response = await httpClient.get(`/internal/certificate-templates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching template details:', error);
      throw error;
    }
  }

  // Create new template
  async createTemplate(templateData) {
    try {
      const formData = new FormData();
      
      Object.keys(templateData).forEach(key => {
        if (templateData[key] !== null && templateData[key] !== undefined) {
          if (typeof templateData[key] === 'boolean') {
            formData.append(key, templateData[key] ? 'true' : 'false');
          } else if (key === 'template_image' && templateData[key] instanceof File) {
            formData.append('template_image', templateData[key]);
          } else if (typeof templateData[key] === 'object' && !(templateData[key] instanceof File)) {
            formData.append(key, JSON.stringify(templateData[key]));
          } else if (!(templateData[key] instanceof File)) {
            formData.append(key, templateData[key]);
          }
        }
      });

      const response = await httpClient.post('/internal/certificate-templates/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  // Update existing template
  async updateTemplate(id, templateData) {
    try {
      const formData = new FormData();
      
      Object.keys(templateData).forEach(key => {
        if (templateData[key] !== null && templateData[key] !== undefined) {
          if (typeof templateData[key] === 'boolean') {
            formData.append(key, templateData[key] ? 'true' : 'false');
          } else if (key === 'template_image' && templateData[key] instanceof File) {
            formData.append('template_image', templateData[key]);
          } else if (typeof templateData[key] === 'object' && !(templateData[key] instanceof File)) {
            formData.append(key, JSON.stringify(templateData[key]));
          } else if (!(templateData[key] instanceof File)) {
            formData.append(key, templateData[key]);
          }
        }
      });

      const response = await httpClient.put(`/internal/certificate-templates/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  // Delete template
  async deleteTemplate(id) {
    try {
      const response = await httpClient.delete(`/internal/certificate-templates/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  // Toggle template status
  async toggleTemplateStatus(id) {
    try {
      const response = await httpClient.patch(`/internal/certificate-templates/toggle-status/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error toggling template status:', error);
      throw error;
    }
  }

  // Preview template
  async previewTemplate(id) {
    try {
      const response = await httpClient.get(`/internal/certificate-templates/${id}/preview`);
      return response.data;
    } catch (error) {
      console.error('Error fetching template preview:', error);
      throw error;
    }
  }
}

export default new CertificateTemplateApi();
