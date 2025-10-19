import httpClient from '@/services/utils/httpClient';

class CourseApi {
  // Get all courses with filters
  async getCourses(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        language: params.language || 'en',
        sortBy: params.sortBy || 'display_order',
        sortOrder: params.sortOrder || 'ASC',
        ...params
      });
      
      const response = await httpClient.get(`/internal/courses?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Get single course by ID
  async getCourseById(id) {
    try {
      const response = await httpClient.get(`/internal/courses/view/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course details:', error);
      throw error;
    }
  }

  // Create new course
  async createCourse(courseData) {
    try {
      const formData = new FormData();
      // formData.append('course_group_id',500);
      
      // Add all fields to form data
      Object.keys(courseData).forEach(key => {
        if (courseData[key] !== null && courseData[key] !== undefined) {
          // Handle boolean values as strings
          if (typeof courseData[key] === 'boolean') {
            formData.append(key, courseData[key] ? 'true' : 'false');
          }
          // Handle file uploads - syllabus file should be sent with 'syllabus' key
          else if (key === 'syllabus_file' && courseData[key] instanceof File) {
            formData.append('syllabus', courseData[key]);
          }
          // Handle thumbnail file
          else if (key === 'thumbnail' && courseData[key] instanceof File) {
            formData.append('thumbnail', courseData[key]);
          }
          // Handle regular fields
          else if (!(courseData[key] instanceof File)) {
            formData.append(key, courseData[key]);
          }
        }
      });

      const response = await httpClient.post('/internal/courses/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  // Update existing course
  async updateCourse(id, courseData) {
    try {
      const formData = new FormData();
      
      // Add all fields to form data
      Object.keys(courseData).forEach(key => {
        if (courseData[key] !== null && courseData[key] !== undefined) {
          // Handle boolean values as strings
          if (typeof courseData[key] === 'boolean') {
            formData.append(key, courseData[key] ? 'true' : 'false');
          }
          // Handle file uploads - syllabus file should be sent with 'syllabus' key
          else if (key === 'syllabus_file' && courseData[key] instanceof File) {
            formData.append('syllabus', courseData[key]);
          }
          // Handle thumbnail file
          else if (key === 'thumbnail' && courseData[key] instanceof File) {
            formData.append('thumbnail', courseData[key]);
          }
          // Handle regular fields
          else if (!(courseData[key] instanceof File)) {
            formData.append(key, courseData[key]);
          }
        }
      });

      const response = await httpClient.put(`/internal/courses/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  // Toggle course active/inactive status
  async toggleCourseStatus(id) {
    try {
      const response = await httpClient.patch(`/internal/courses/toggle-status/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error toggling course status:', error);
      throw error;
    }
  }

  // Reorder courses
  async reorderCourses(courses) {
    try {
      const response = await httpClient.put('/internal/courses/reorder', {
        courses: courses
      });
      return response.data;
    } catch (error) {
      console.error('Error reordering courses:', error);
      throw error;
    }
  }

  // Replace getHindiVersion with this
async getCourseVariantsByGroupId(courseGroupId) {
  try {
    const response = await httpClient.get(`/internal/courses/variants/${courseGroupId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course variants:', error);
    return { success: false, data: null };
  }
}

  // Delete course
  async deleteCourse(id) {
    try {
      const response = await httpClient.delete(`/internal/courses/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
}

export default new CourseApi();