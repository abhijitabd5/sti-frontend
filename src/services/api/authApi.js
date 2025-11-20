import httpClient from '../utils/httpClient';

// Role-based redirect URLs
const ROLE_REDIRECTS = {
  super_admin: '/admin/dashboard',
  admin: '/admin/dashboard',
  account: '/admin/dashboard',
  instructor: '/admin/dashboard',
  student: '/student/dashboard'
};

export const authApi = {
  // Login function
  login: async (credentials) => {
    try {
      const response = await httpClient.post('/auth/login', {
        login: credentials.login || credentials.identifier,
        password: credentials.password
      });
      
      if (response.data.success) {
        // Add redirect URL based on role
        const redirectUrl = ROLE_REDIRECTS[response.data.data.user.role] || '/admin/dashboard';
        return {
          ...response.data,
          data: {
            ...response.data.data,
            redirect_url: redirectUrl
          }
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout function
  logout: async () => {
    try {
      const response = await httpClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, we still want to clear local data
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  },

  // Forgot password
  forgotPassword: async (identifier) => {
    try {
      const response = await httpClient.post('/auth/forgot-password', { identifier });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (resetData) => {
    try {
      const response = await httpClient.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await httpClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await httpClient.post('/auth/refresh-token', {
        refresh_token: refreshToken
      });
      
      if (response.data.success) {
        // Update stored tokens
        const tokens = response.data.data.tokens;
        localStorage.setItem('token', tokens.access_token);
        localStorage.setItem('access_token', tokens.access_token);
        if (tokens.refresh_token) {
          localStorage.setItem('refresh_token', tokens.refresh_token);
        }
        return response.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, clear all auth data
      clearAuthData();
      throw error;
    }
  }
};

// Helper function to get user role redirect URL
export const getRoleRedirectUrl = (role) => {
  return ROLE_REDIRECTS[role] || '/dashboard';
};

// Helper function to check if user has permission
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes('all') || user.permissions.includes(permission);
};

// Helper function to save auth data to localStorage
export const saveAuthData = (tokens, user) => {
  // Handle both old format (single token) and new format (tokens object)
  if (typeof tokens === 'string') {
    // Old format - single token
    localStorage.setItem('token', tokens);
    localStorage.setItem('access_token', tokens);
  } else if (tokens && tokens.access_token) {
    // New format - tokens object
    localStorage.setItem('token', tokens.access_token); // Keep for backward compatibility
    localStorage.setItem('access_token', tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
  }
  localStorage.setItem('user', JSON.stringify(user));
};

// Helper function to clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('tokenExpiration');
};

// Helper function to get stored user
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Helper function to get access token
export const getAccessToken = () => {
  return localStorage.getItem('access_token') || localStorage.getItem('token');
};

// Helper function to get refresh token
export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export default authApi;
