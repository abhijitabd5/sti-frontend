import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../utils/apiEndpoints';

// Mock user data based on seeder file
const MOCK_USERS = [
  {
    id: 1,
    first_name: "Abhijit",
    last_name: "Abd",
    mobile: "9175113022",
    role: "super_admin",
    password: "12345678",
    is_active: true,
    email: "abhijit@earthmovers.edu", // Added for login
    full_name: "Abhijit Abd",
    permissions: ["all"], // Super admin has all permissions
    profile_image: "/api/placeholder/80/80"
  },
  {
    id: 2,
    first_name: "Account",
    last_name: "Dept",
    mobile: "9300333444",
    role: "account",
    password: "12345678",
    is_active: true,
    email: "account@earthmovers.edu",
    full_name: "Account Dept",
    permissions: ["finance", "reports", "students"],
    profile_image: "/api/placeholder/80/80"
  },
  {
    id: 3,
    first_name: "Saif",
    last_name: "Sheikh",
    mobile: "9834892082",
    role: "student",
    password: "12345678",
    is_active: true,
    email: "saif@earthmovers.edu",
    full_name: "Saif Sheikh",
    permissions: ["profile", "courses", "certificates"],
    profile_image: "/api/placeholder/80/80"
  }
];

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

  // Get current user profile
  getProfile: async () => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.get('/auth/profile');
      // return response.data;

      // Mock response for development
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const token = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');
          
          if (token && storedUser) {
            try {
              const user = JSON.parse(storedUser);
              resolve({
                success: true,
                data: { user }
              });
            } catch {
              reject({
                response: {
                  data: {
                    success: false,
                    message: 'Invalid user data'
                  }
                }
              });
            }
          } else {
            reject({
              response: {
                data: {
                  success: false,
                  message: 'No valid session found'
                }
              }
            });
          }
        }, 300);
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (identifier) => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { identifier });
      // return response.data;

      // Mock response for development
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = MOCK_USERS.find(u => 
            u.mobile === identifier || u.email === identifier
          );

          if (user) {
            resolve({
              success: true,
              message: 'Password reset instructions have been sent to your registered mobile/email.',
              data: {
                reset_token: `mock_reset_token_${Date.now()}`
              }
            });
          } else {
            reject({
              response: {
                data: {
                  success: false,
                  message: 'No account found with this mobile/email',
                  errors: {
                    identifier: ['Account not found']
                  }
                }
              }
            });
          }
        }, 800);
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (resetData) => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.post(API_ENDPOINTS.RESET_PASSWORD, resetData);
      // return response.data;

      // Mock response for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Password has been reset successfully. You can now login with your new password.'
          });
        }, 1000);
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // Verify token
  verifyToken: async (token) => {
    try {
      // In production, uncomment the line below:
      // const response = await httpClient.post('/auth/verify', { token });
      // return response.data;

      // Mock response for development
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (token && token.startsWith('mock_jwt_token_')) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              try {
                const user = JSON.parse(storedUser);
                resolve({
                  success: true,
                  data: { user, valid: true }
                });
              } catch {
                reject({
                  response: {
                    data: { success: false, message: 'Invalid token' }
                  }
                });
              }
            } else {
              reject({
                response: {
                  data: { success: false, message: 'Token expired' }
                }
              });
            }
          } else {
            reject({
              response: {
                data: { success: false, message: 'Invalid token' }
              }
            });
          }
        }, 200);
      });
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
