import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Perform logout when component mounts
    logout();
  }, [logout]);

  // Redirect to home page after logout
  return <Navigate to="/" replace />;
};

export default Logout;
