import React, { useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
// import seoApi from '@/services/api/seoApi'; // Commented out - using static data only

// SEO Testing Component - For development only
// UPDATED: API functionality disabled, now uses static data only
function SEOTester() {
  const [selectedPage, setSelectedPage] = useState('courses');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { seoData, loading, error, refreshSeo } = useSEO(selectedPage, selectedLanguage);

  const pages = [
    { slug: 'home', name: 'Home Page' },
    { slug: 'courses', name: 'Courses Page' },
    { slug: 'about-us', name: 'About Us Page' },
    { slug: 'contact-us', name: 'Contact Us Page' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' }
  ];

  const handleClearCache = () => {
    // seoApi.clearCache(); // Commented out - using static data
    refreshSeo();
  };

  const handleToggleDataSource = () => {
    // seoApi.setDataSource(!seoApi.useStaticData); // Commented out - always static
    refreshSeo();
  };

  // const cacheStats = seoApi.getCacheStats(); // Commented out - using static data
  const cacheStats = { totalEntries: 0, maxSize: 0, cacheDuration: 0 }; // Mock stats for static data

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
          SEO System Tester
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleClearCache}
            className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
          >
            Clear Cache
          </button>
          <button
            onClick={handleToggleDataSource}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded cursor-not-allowed"
            disabled
          >
            Static Data Only
          </button>
        </div>
      </div>

      {/* Page and Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Page
          </label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="form-input w-full"
          >
            {pages.map(page => (
              <option key={page.slug} value={page.slug}>
                {page.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="form-input w-full"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading SEO data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3 mb-4">
          <p className="text-red-800 dark:text-red-200 text-sm">
            Error: {error.message}
          </p>
        </div>
      )}

      {/* SEO Data Display */}
      {seoData && (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
              Current SEO Data
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Page Title:</strong> {seoData.page_title}</p>
                <p><strong>Meta Title:</strong> {seoData.meta_title}</p>
                <p><strong>Slug:</strong> {seoData.slug}</p>
                <p><strong>Language:</strong> {seoData.language}</p>
              </div>
              <div>
                <p><strong>Meta Description:</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {seoData.meta_description}
                </p>
                <p className="mt-2"><strong>Keywords:</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {seoData.meta_keywords}
                </p>
              </div>
            </div>
          </div>

          {/* Open Graph Data */}
          {(seoData.og_title || seoData.og_description) && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-3">
                Open Graph Data
              </h4>
              <div className="text-sm space-y-1">
                <p><strong>OG Title:</strong> {seoData.og_title}</p>
                <p><strong>OG Description:</strong> {seoData.og_description}</p>
                <p><strong>OG Image:</strong> {seoData.og_image}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cache Statistics */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
          Cache Statistics
        </h4>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p>Entries: {cacheStats.totalEntries} / {cacheStats.maxSize}</p>
          <p>Data Source: Static (API requests disabled)</p>
          <p>Cache Duration: {Math.round(cacheStats.cacheDuration / 1000 / 60)} minutes</p>
        </div>
      </div>

      {/* Document Head Preview */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
          Current Document Head
        </h4>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p><strong>Document Title:</strong> {document.title}</p>
          <p><strong>Meta Description:</strong> {document.querySelector('meta[name="description"]')?.content || 'Not set'}</p>
          <p><strong>Meta Keywords:</strong> {document.querySelector('meta[name="keywords"]')?.content || 'Not set'}</p>
        </div>
      </div>
    </div>
  );
}

export default SEOTester;