import httpClient from '../utils/httpClient';

/**
 * Get user profile
 * @returns {Promise} Profile data
 */
export const getProfile = async () => {
  try {
    const response = await httpClient.get(`/auth/profile/view`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data including optional file
 * @param {string} profileData.first_name - First name
 * @param {string} profileData.last_name - Last name
 * @param {string} profileData.mobile - Mobile number
 * @param {string} profileData.email - Email address
 * @param {File} profileData.file - Profile image file (optional)
 * @returns {Promise} Updated profile data
 */
export const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();
    
    // Add only non-empty fields to FormData
    if (profileData.first_name) formData.append('first_name', profileData.first_name);
    if (profileData.last_name) formData.append('last_name', profileData.last_name);
    if (profileData.mobile) formData.append('mobile', profileData.mobile);
    if (profileData.email) formData.append('email', profileData.email);
    if (profileData.file) formData.append('file', profileData.file);
    
    const response = await httpClient.put(`/auth/profile/edit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
