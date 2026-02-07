import httpClient from '@/services/utils/httpClient';

class CertificateApi {
  // Get all certificates with filters
  async getCertificates(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        sortBy: params.sortBy || 'issue_date',
        sortOrder: params.sortOrder || 'DESC',
        ...params
      });
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') queryParams.delete(key);
      });

      const response = await httpClient.get(`/internal/certificates?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching certificates:', error);
      throw error;
    }
  }

  // Get certificate statistics
  async getCertificateStats() {
    try {
      const response = await httpClient.get('/internal/certificates/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching certificate stats:', error);
      throw error;
    }
  }

  // Get single certificate by ID
  async getCertificateById(id) {
    try {
      const response = await httpClient.get(`/internal/certificates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching certificate details:', error);
      throw error;
    }
  }

  // Get student's certificates
  async getStudentCertificates(studentId) {
    try {
      const response = await httpClient.get(`/internal/certificates/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student certificates:', error);
      throw error;
    }
  }

  // Issue certificate
  async issueCertificate(certificateData) {
    try {
      const response = await httpClient.post('/internal/certificates/issue', certificateData);
      return response.data;
    } catch (error) {
      console.error('Error issuing certificate:', error);
      throw error;
    }
  }

  // Bulk issue certificates
  async bulkIssueCertificates(certificates) {
    try {
      const response = await httpClient.post('/internal/certificates/bulk-issue', {
        certificates
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk issuing certificates:', error);
      throw error;
    }
  }

  // Regenerate certificate
  async regenerateCertificate(id) {
    try {
      const response = await httpClient.post(`/internal/certificates/regenerate/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error regenerating certificate:', error);
      throw error;
    }
  }

  // Revoke certificate
  async revokeCertificate(id) {
    try {
      const response = await httpClient.patch(`/internal/certificates/revoke/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error revoking certificate:', error);
      throw error;
    }
  }

  // Restore certificate
  async restoreCertificate(id) {
    try {
      const response = await httpClient.patch(`/internal/certificates/restore/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error restoring certificate:', error);
      throw error;
    }
  }

  // Mark as expired
  async markAsExpired(id) {
    try {
      const response = await httpClient.patch(`/internal/certificates/mark-expired/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error marking certificate as expired:', error);
      throw error;
    }
  }

  // Mark hard copy delivered
  async markHardCopyDelivered(id) {
    try {
      const response = await httpClient.patch(`/internal/certificates/hard-copy-delivered/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error marking hard copy as delivered:', error);
      throw error;
    }
  }

  // Update delivery address
  async updateDeliveryAddress(id, deliveryAddress) {
    try {
      const response = await httpClient.put(`/internal/certificates/delivery-address/${id}`, {
        delivery_address: deliveryAddress
      });
      return response.data;
    } catch (error) {
      console.error('Error updating delivery address:', error);
      throw error;
    }
  }

  // Delete certificate
  async deleteCertificate(id) {
    try {
      const response = await httpClient.delete(`/internal/certificates/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting certificate:', error);
      throw error;
    }
  }

  // Download certificate
  async downloadCertificate(id) {
    try {
      const response = await httpClient.get(`/internal/certificates/download/${id}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading certificate:', error);
      throw error;
    }
  }

  // Get QR code
  async getQRCode(id) {
    try {
      const response = await httpClient.get(`/internal/certificates/qr-code/${id}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching QR code:', error);
      throw error;
    }
  }

  // Get enrollments for certificate issuance
  async getEnrollmentsForIssuance(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...params
      });
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') queryParams.delete(key);
      });

      const response = await httpClient.get(`/internal/certificates/enrollments?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }
  }
}

export default new CertificateApi();
