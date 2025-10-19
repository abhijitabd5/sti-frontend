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
      const response = await httpClient.post(`/internal/student/students/${studentId}/documents`, formData, {
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
  async getPaymentHistory(studentId, enrollmentId) {
    try {
      const response = await httpClient.get(`/internal/student/${studentId}/${enrollmentId}/payments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
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
}

export default new StudentApi();
