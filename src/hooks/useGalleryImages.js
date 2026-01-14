import { useState, useEffect } from 'react';
import galleryApi from '@/services/api/galleryApi';

/**
 * Custom hook to fetch gallery images by page slug
 * @param {string} pageSlug - The page slug to fetch images for (home, about-us, contact-us)
 * @param {object} options - Additional options
 * @returns {object} - { images, loading, error, getImageBySlug }
 */
export const useGalleryImages = (pageSlug, options = {}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (!pageSlug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await galleryApi.getPublicGalleryByPageSlug(pageSlug);
        
        if (response.success && response.data) {
          // Filter only active images and sort by display_order
          const activeImages = response.data
            .filter(item => item.is_active && item.media_type === 'image')
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
          
          setImages(activeImages);
        } else {
          setImages([]);
        }
      } catch (err) {
        console.error(`Error fetching gallery images for ${pageSlug}:`, err);
        setError(err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [pageSlug]);

  // Helper function to get image by slug
  const getImageBySlug = (slug) => {
    return images.find(image => image.slug === slug);
  };

  // Helper function to get image by page_slug (for backward compatibility)
  const getImageByPageSlug = (slug) => {
    return images.find(image => image.page_slug === slug);
  };

  // Helper function to get first image
  const getFirstImage = () => {
    return images.length > 0 ? images[0] : null;
  };

  // Helper function to get image by index
  const getImageByIndex = (index) => {
    return images[index] || null;
  };

  return {
    images,
    loading,
    error,
    getImageBySlug,
    getImageByPageSlug,
    getFirstImage,
    getImageByIndex,
    hasImages: images.length > 0
  };
};

export default useGalleryImages;