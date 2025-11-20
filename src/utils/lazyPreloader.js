/**
 * Utility to preload lazy-loaded chunks
 * This can be used to preload admin routes when user is likely to access them
 */

// Preload the admin routes chunk
export const preloadAdminRoutes = () => {
  // This will trigger the lazy import and cache the chunk
  return import('@/pages/internal/AdminRoutes');
};

// Preload admin routes when user hovers over admin links or after successful login
export const preloadOnHover = (element) => {
  if (!element) return;
  
  let preloadTriggered = false;
  
  const handleMouseEnter = () => {
    if (!preloadTriggered) {
      preloadTriggered = true;
      preloadAdminRoutes().catch(console.error);
    }
  };
  
  element.addEventListener('mouseenter', handleMouseEnter, { once: true });
  
  // Cleanup function
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
  };
};

// Preload admin routes after successful authentication
export const preloadAfterAuth = () => {
  // Small delay to not interfere with login process
  setTimeout(() => {
    preloadAdminRoutes().catch(console.error);
  }, 1000);
};