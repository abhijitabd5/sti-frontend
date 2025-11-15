import { staticSeoData, staticSeoDataHindi } from '@/data/staticSeoData';
import httpClient from '@/services/utils/httpClient';

class SeoApi {
  constructor() {
    // Feature flag to switch between static and dynamic data
    this.useStaticData = true; // Set to false when backend is ready
    
    // Cache for SEO data
    this.cache = new Map();
    this.CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
    this.MAX_CACHE_SIZE = 50; // Maximum cache entries
    
    // Critical pages to preload
    this.preloadedPages = new Set(['home', 'courses']);
    
    console.log('SeoApi initialized with static data mode:', this.useStaticData);
  }

  /**
   * Get SEO data for a specific page
   * @param {string} slug - Page slug (e.g., 'courses', 'about-us')
   * @param {string} language - Language code (e.g., 'en', 'hi')
   * @returns {Promise<Object>} SEO data response
   */
  async getPageSeo(slug, language = 'en') {
    const cacheKey = `${slug}-${language}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`SEO cache hit for: ${cacheKey}`);
      return cached.data;
    }

    console.log(`SEO cache miss, fetching: ${cacheKey}`);

    // Fetch data based on current mode
    let data;
    if (this.useStaticData) {
      data = await this.getStaticPageSeo(slug, language);
    } else {
      data = await this.getDynamicPageSeo(slug, language);
    }

    // Cache the result
    this.setCacheData(cacheKey, data);

    return data;
  }

  /**
   * Get all pages SEO data
   * @param {string} language - Language code
   * @returns {Promise<Object>} All SEO data response
   */
  async getAllPagesSeo(language = 'en') {
    if (this.useStaticData) {
      return this.getStaticAllPagesSeo(language);
    } else {
      return this.getDynamicAllPagesSeo(language);
    }
  }

  /**
   * Preload critical pages for better performance
   * @param {string} language - Language code
   */
  async preloadCriticalPages(language = 'en') {
    console.log(`Preloading critical SEO pages for language: ${language}`);
    
    const promises = Array.from(this.preloadedPages).map(slug => 
      this.getPageSeo(slug, language).catch(error => {
        console.warn(`Failed to preload SEO for ${slug}:`, error);
        return null;
      })
    );
    
    try {
      const results = await Promise.all(promises);
      const successful = results.filter(result => result !== null).length;
      console.log(`SEO preload completed: ${successful}/${this.preloadedPages.size} pages loaded`);
    } catch (error) {
      console.warn('SEO preload failed:', error);
    }
  }

  // Static data methods
  async getStaticPageSeo(slug, language) {
    // Simulate network delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const dataSource = language === 'hi' ? staticSeoDataHindi : staticSeoData;
    const page = dataSource.data.find(item => item.slug === slug);
    
    if (page) {
      return {
        success: true,
        data: page,
        message: "SEO data retrieved successfully",
        source: 'static'
      };
    } else {
      return {
        success: false,
        data: null,
        message: `Page '${slug}' not found`,
        source: 'static'
      };
    }
  }

  async getStaticAllPagesSeo(language) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const dataSource = language === 'hi' ? staticSeoDataHindi : staticSeoData;
    return {
      ...dataSource,
      source: 'static'
    };
  }

  // Dynamic data methods (for future backend integration)
  async getDynamicPageSeo(slug, language) {
    try {
      const response = await httpClient.get(`/seo/pages/${slug}?language=${language}`);
      return {
        ...response.data,
        source: 'dynamic'
      };
    } catch (error) {
      console.error('Error fetching dynamic SEO data:', error);
      
      // Fallback to static data on error
      console.log('Falling back to static SEO data');
      return this.getStaticPageSeo(slug, language);
    }
  }

  async getDynamicAllPagesSeo(language) {
    try {
      const response = await httpClient.get(`/seo/pages?language=${language}`);
      return {
        ...response.data,
        source: 'dynamic'
      };
    } catch (error) {
      console.error('Error fetching dynamic SEO data:', error);
      
      // Fallback to static data on error
      return this.getStaticAllPagesSeo(language);
    }
  }

  // Cache management methods
  setCacheData(key, data) {
    // Manage cache size
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      console.log(`SEO cache size limit reached, removed: ${oldestKey}`);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    console.log(`SEO data cached: ${key} (cache size: ${this.cache.size})`);
  }

  /**
   * Clear cache for specific page or all pages
   * @param {string} slug - Page slug (optional, clears all if not provided)
   * @param {string} language - Language code (optional)
   */
  clearCache(slug = null, language = null) {
    if (slug && language) {
      const cacheKey = `${slug}-${language}`;
      this.cache.delete(cacheKey);
      console.log(`SEO cache cleared for: ${cacheKey}`);
    } else {
      this.cache.clear();
      console.log('All SEO cache cleared');
    }
  }

  /**
   * Switch between static and dynamic data sources
   * @param {boolean} useStatic - Whether to use static data
   */
  setDataSource(useStatic) {
    this.useStaticData = useStatic;
    this.clearCache(); // Clear cache when switching modes
    console.log(`SEO data source switched to: ${useStatic ? 'static' : 'dynamic'}`);
  }

  /**
   * Get cache statistics for debugging
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    const entries = Array.from(this.cache.entries());
    const now = Date.now();
    
    return {
      totalEntries: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      cacheDuration: this.CACHE_DURATION,
      entries: entries.map(([key, value]) => ({
        key,
        age: now - value.timestamp,
        expired: (now - value.timestamp) > this.CACHE_DURATION
      }))
    };
  }
}

export default new SeoApi();