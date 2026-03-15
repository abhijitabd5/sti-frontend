import axios from 'axios';

// Create axios instance with base configuration
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Check if token has expired (7 days)
 */
const isTokenExpired = () => {
  const expirationTime = localStorage.getItem('tokenExpiration');
  if (!expirationTime) return false;
  return new Date().getTime() > parseInt(expirationTime);
};

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Check if token has expired before making request
    if (isTokenExpired()) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiration');
      window.location.href = '/login';
      return Promise.reject(new Error('Token expired'));
    }

    // Add auth token if available
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ensure withCredentials is set for this request
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track refresh attempts to prevent loops
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle rate limiting
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please wait before retrying.');
      return Promise.reject(error);
    }
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent multiple simultaneous refresh attempts
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return httpClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {
            refresh_token: refreshToken
          });
          
          if (response.data.success) {
            const tokens = response.data.data.tokens;
            localStorage.setItem('token', tokens.access_token);
            localStorage.setItem('access_token', tokens.access_token);
            if (tokens.refresh_token) {
              localStorage.setItem('refresh_token', tokens.refresh_token);
            }
            
            // Process queued requests
            processQueue(null, tokens.access_token);
            isRefreshing = false;
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
            return httpClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          processQueue(refreshError, null);
          isRefreshing = false;
        }
      }
      
      // If refresh fails or no refresh token, clear auth data and redirect
      isRefreshing = false;
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiration');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;
