import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredUser } from '../services/api/authApi';

const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const location = useLocation();
  const user = getStoredUser();
  const token = localStorage.getItem('token');

  // Check if user is authenticated
  const isAuthenticated = token && user;

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If specific roles are required, check user role
  if (allowedRoles.length > 0 && user) {
    const hasAllowedRole = allowedRoles.includes(user.role);
    
    if (!hasAllowedRole) {
      // Redirect based on user's actual role
      const roleRedirects = {
        super_admin: '/admin/dashboard',
        admin: '/admin/dashboard',
        account: '/admin/dashboard',
        instructor: '/admin/dashboard',
        student: '/student/dashboard'
      };
      
      const redirectPath = roleRedirects[user.role] || '/';
      return <Navigate to={redirectPath} replace />;
    }
  }

  // If user is authenticated and has permission, render the component
  return children;
};

// Higher-order component for admin routes
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={['super_admin', 'admin', 'account', 'instructor']}
      requireAuth={true}
    >
      {children}
    </ProtectedRoute>
  );
};

// Higher-order component for student routes
export const StudentRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={['student']}
      requireAuth={true}
    >
      {children}
    </ProtectedRoute>
  );
};

// Higher-order component for super admin only routes
export const SuperAdminRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={['super_admin']}
      requireAuth={true}
    >
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
