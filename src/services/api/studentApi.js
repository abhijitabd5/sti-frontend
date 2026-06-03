import httpClient from '@/services/utils/httpClient';

class StudentApi {
  // Get all students
  async getStudents(params = {}) {
    try {
      const response = await httpClient.get('/internal/student/students', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  // Get student details by ID
  async getStudentById(studentId) {
    try {
      const response = await httpClient.get(`/internal/student/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student details:', error);
      throw error;
    }
  }

  // Get enrollment details by enrollment ID
  async getEnrollmentById(enrollmentId) {
    try {
      const response = await httpClient.get(`/internal/student/enrollments/${enrollmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollment details:', error);
      throw error;
    }
  }

  // Check Aadhaar number
  async checkAadhaar(aadharNumber) {
    try {
      const response = await httpClient.post('/internal/student/check-aadhar', {
        aadhar_number: aadharNumber
      });
      return response.data;
    } catch (error) {
      console.error('Error checking Aadhaar:', error);
      throw error;
    }
  }

  // Create student enrollment
  async createEnrollment(enrollmentData) {
    try {
      const response = await httpClient.post('/internal/student/enroll', enrollmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
  }

  // Update student enrollment
  async updateEnrollment(enrollmentId, enrollmentData) {
    try {
      const response = await httpClient.put(`/internal/student/enrollments/${enrollmentId}`, enrollmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating enrollment:', error);
      throw error;
    }
  }

  // Toggle student login
  async toggleLogin(studentId, loginEnabled) {
    try {
      const response = await httpClient.patch(`/internal/student/students/${studentId}/toggle-login`, {
        login_enabled: loginEnabled
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling student login:', error);
      throw error;
    }
  }

  // Upload student documents
  async uploadDocuments(studentId, formData) {
    try {
      const response = await httpClient.post(`/internal/student/${studentId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading documents:', error);
      throw error;
    }
  }

  // Delete student document
  async deleteDocument(documentId) {
    try {
      const response = await httpClient.delete(`/internal/student/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Get payment history
  async getPaymentHistory(enrollmentId) {
    try {
      const response = await httpClient.get(`/internal/student/enrollments/${enrollmentId}/payments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  // Create enrollment payment
  async createPayment(enrollmentId, paymentData) {
    try {
      const response = await httpClient.post(`/internal/enrollments/${enrollmentId}/payments`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  // Get enrollment payments
  async getEnrollmentPayments(enrollmentId) {
    try {
      const response = await httpClient.get(`/internal/enrollments/${enrollmentId}/payments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollment payments:', error);
      throw error;
    }
  }

  // Get payment by ID
  async getPaymentById(paymentId) {
    try {
      const response = await httpClient.get(`/internal/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  // Update payment
  async updatePayment(paymentId, paymentData) {
    try {
      const response = await httpClient.put(`/internal/payments/${paymentId}`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  // Delete payment
  async deletePayment(paymentId) {
    try {
      const response = await httpClient.delete(`/internal/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  }

  // Get courses for enrollment dropdown
  async getCourses() {
    try {
      const response = await httpClient.get('/internal/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Export students data
  async exportStudents(params = {}) {
    try {
      const response = await httpClient.get('/internal/student/export', { 
        params,
        responseType: 'blob' // Important for file downloads
      });
      return response;
    } catch (error) {
      console.error('Error exporting students:', error);
      throw error;
    }
  }

  // Verify student document
  async verifyDocument(documentId, isVerified) {
    try {
      const response = await httpClient.patch(`/internal/student/documents/verify/${documentId}`, {
        is_verified: isVerified
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying document:', error);
      throw error;
    }
  }
}

export default new StudentApi();
