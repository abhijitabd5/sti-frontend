import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi, getStoredUser, clearAuthData } from '../services/api/authApi';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      try {
        const token = localStorage.getItem('token');
        const user = getStoredUser();
        
        if (token && user) {
          // Verify token is still valid
          try {
            const response = await authApi.verifyToken(token);
            if (response.success) {
              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { user: response.data.user, token }
              });
            } else {
              // Token is invalid, clear auth data
              clearAuthData();
              dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
          } catch (error) {
            // Token verification failed
            clearAuthData();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      const response = await authApi.login(credentials);
      
      if (response.success) {
        // Save auth data to localStorage - handle both old and new token formats
        const tokens = response.data.tokens || response.data.token;
        const accessToken = typeof tokens === 'string' ? tokens : tokens.access_token;
        
        localStorage.setItem('token', accessToken); // Keep for backward compatibility
        if (typeof tokens === 'object' && tokens.access_token) {
          localStorage.setItem('access_token', tokens.access_token);
          if (tokens.refresh_token) {
            localStorage.setItem('refresh_token', tokens.refresh_token);
          }
        }
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.data.user,
            token: accessToken
          }
        });
        
        return response;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: errorMessage
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth data regardless of API call result
      clearAuthData();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update user profile
  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: updatedUser });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!state.user || !state.user.permissions) return false;
    return state.user.permissions.includes('all') || state.user.permissions.includes(permission);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!state.user) return false;
    return state.user.role === role;
  };

  // Get user's full name
  const getUserFullName = () => {
    if (!state.user) return '';
    return state.user.full_name || `${state.user.first_name} ${state.user.last_name}`;
  };

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    logout,
    updateUser,
    clearError,
    
    // Helpers
    hasPermission,
    hasRole,
    getUserFullName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
