import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// import seoApi from '@/services/api/seoApi'; // Commented out - using static data directly
import { staticSeoData } from '@/data/staticSeoData';
import { INSTITUTION_INFO } from '@/config/constants';

/**
 * Custom hook for managing SEO data
 * UPDATED: Now uses static SEO data directly instead of making API requests
 * All API calls have been commented out for better performance
 * 
 * @param {string} customSlug - Custom slug override (optional)
 * @param {string} language - Language code (default: 'en')
 * @param {Object} fallbackSeo - Fallback SEO data (optional)
 * @returns {Object} SEO data, loading state, and error
 */
export const useSEO = (customSlug = null, language = 'en', fallbackSeo = null) => {
  const location = useLocation();
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSeoData = async () => {
      setLoading(true);
      setError(null);
      
      // Determine slug from route or custom slug
      const slug = customSlug || getSlugFromPath(location.pathname);
      
      // Skip SEO for admin pages or unrecognized routes
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        // Use static SEO data directly instead of API call
        const page = staticSeoData.data.find(item => item.slug === slug);
        
        if (page) {
          setSeoData(page);
          applySeoToDocument(page);
        } else {
          
          // Apply fallback SEO if provided
          if (fallbackSeo) {
            setSeoData(fallbackSeo);
            applySeoToDocument(fallbackSeo);
          } else {
            applyDefaultSeo(slug);
          }
        }
      } catch (err) {
        console.error('Error loading static SEO data:', err);
        setError(err);
        
        // Apply fallback or default SEO on error
        if (fallbackSeo) {
          setSeoData(fallbackSeo);
          applySeoToDocument(fallbackSeo);
        } else {
          applyDefaultSeo(slug);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSeoData();
  }, [location.pathname, customSlug, language]);

  return { 
    seoData, 
    loading, 
    error,
    // Utility functions
    refreshSeo: () => {
      // seoApi.clearCache(customSlug || getSlugFromPath(location.pathname), language); // Commented out - using static data
      // Trigger reload by changing a dependency
      setLoading(true);
    }
  };
};

/**
 * Convert URL path to slug
 * @param {string} pathname - URL pathname
 * @returns {string} Page slug
 */
const getSlugFromPath = (pathname) => {
  // Skip SEO for admin pages
  if (pathname.startsWith('/admin/') || pathname.startsWith('/internal/')) {
    return null;
  }

  const pathMap = {
    '/': 'home',
    '/courses': 'courses',
    '/about': 'about-us',
    '/contact': 'contact-us',
    '/gallery/images': 'gallery-images',
    '/gallery/videos': 'gallery-videos',
    '/privacy-policy': 'privacy-policy',
    '/terms-conditions': 'terms-conditions',
    '/faq': 'faq'
  };
  
  // Check exact matches first
  if (pathMap[pathname]) {
    return pathMap[pathname];
  }
  
  // Handle dynamic routes for public pages
  if (pathname.startsWith('/courses/') && pathname !== '/courses') {
    // Individual course page - could be dynamic SEO later
    return 'course-detail';
  }
  
  // Skip SEO for unrecognized routes
  return null;
};

/**
 * Apply SEO data to document head
 * @param {Object} seoData - SEO data object
 */
const applySeoToDocument = (seoData) => {
  // Update document title
  document.title = seoData.meta_title || seoData.page_title || INSTITUTION_INFO.name;
  
  // Update meta description
  if (seoData.meta_description) {
    updateMetaTag('description', seoData.meta_description);
  }
  
  // Update meta keywords
  if (seoData.meta_keywords) {
    updateMetaTag('keywords', seoData.meta_keywords);
  }
  
  // Update Open Graph tags
  if (seoData.og_title || seoData.meta_title) {
    updateMetaTag('og:title', seoData.og_title || seoData.meta_title);
  }
  
  if (seoData.og_description || seoData.meta_description) {
    updateMetaTag('og:description', seoData.og_description || seoData.meta_description);
  }
  
  if (seoData.og_image) {
    updateMetaTag('og:image', seoData.og_image);
  }
  
  // Update Twitter Card tags
  if (seoData.twitter_title || seoData.meta_title) {
    updateMetaTag('twitter:title', seoData.twitter_title || seoData.meta_title);
  }
  
  if (seoData.twitter_description || seoData.meta_description) {
    updateMetaTag('twitter:description', seoData.twitter_description || seoData.meta_description);
  }
  
  updateMetaTag('twitter:card', 'summary_large_image');
  
  // Update canonical URL
  if (seoData.canonical_url) {
    updateLinkTag('canonical', seoData.canonical_url);
  }
  
  // Update language meta tag
  if (seoData.language) {
    updateMetaTag('language', seoData.language);
    document.documentElement.lang = seoData.language;
  }
};

/**
 * Apply default SEO when no specific data is found
 * @param {string} slug - Page slug
 */
const applyDefaultSeo = (slug) => {
  const defaultSeo = {
    meta_title: `${INSTITUTION_INFO.name} | Heavy Equipment Training`,
    meta_description: 'Professional heavy equipment training academy offering certified courses for excavator, bulldozer, and crane operators.',
    meta_keywords: 'heavy equipment training, excavator certification, bulldozer training, crane operator course'
  };

  applySeoToDocument(defaultSeo);
};

/**
 * Update or create meta tag
 * @param {string} name - Meta tag name or property
 * @param {string} content - Meta tag content
 */
const updateMetaTag = (name, content) => {
  if (!content) return;
  
  const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
  const attribute = isProperty ? 'property' : 'name';
  const selector = `meta[${attribute}="${name}"]`;
  
  let element = document.querySelector(selector);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

/**
 * Update or create link tag
 * @param {string} rel - Link relation
 * @param {string} href - Link href
 */
const updateLinkTag = (rel, href) => {
  if (!href) return;
  
  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
};

/**
 * Hook for preloading SEO data (useful for navigation prefetching)
 * @param {string} slug - Page slug to preload
 * @param {string} language - Language code
 */
export const usePreloadSEO = (slug, language = 'en') => {
  useEffect(() => {
    if (slug) {
      // Preload SEO data in background - using static data, no need for actual preloading
      // seoApi.getPageSeo(slug, language).catch(error => {
      //   console.warn(`Failed to preload SEO for ${slug}:`, error);
      // });
    }
  }, [slug, language]);
};