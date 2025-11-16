import { useEffect } from 'react';
import { preloadAdminRoutes } from '@/utils/lazyPreloader';

/**
 * Hook to preload admin routes based on user authentication status
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @param {boolean} isAdmin - Whether user has admin role
 * @param {number} delay - Delay in ms before preloading (default: 2000)
 */
export const useLazyPreload = (isAuthenticated = false, isAdmin = false, delay = 2000) => {
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const timer = setTimeout(() => {
        preloadAdminRoutes().catch(console.error);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isAdmin, delay]);
};

export default useLazyPreload;