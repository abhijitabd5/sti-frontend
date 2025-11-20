import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import pageApi from '@/services/api/pageApi';

// Icons
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  LanguageIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

function Pages() {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState(null);

  const languages = [
    { code: 'all', name: 'All Languages' },
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'mar', name: 'Marathi' }
  ];

  // Load pages
  useEffect(() => {
    loadPages();
  }, [currentPage, selectedLanguage, searchTerm]);

  // Load statistics
  useEffect(() => {
    loadStatistics();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 10,
        offset: (currentPage - 1) * 10,
        search: searchTerm || undefined,
        language: selectedLanguage !== 'all' ? selectedLanguage : undefined
      };

      const response = await pageApi.getPages(params);
      if (response.success) {
        setPages(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await pageApi.getPageStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleLanguageFilter = (language) => {
    setSelectedLanguage(language);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleView = (pageId) => {
    navigate(`/admin/pages/view/${pageId}`);
  };

  const handleEdit = (pageId) => {
    navigate(`/admin/pages/edit/${pageId}`);
  };



  const getLanguageInfo = (language) => {
    const languageMap = {
      'en': { name: 'English', flag: '', color: 'blue' },
      'hi': { name: 'Hindi', flag: '🇮🇳', color: 'green' },
      'mar': { name: 'Marathi', flag: '🇮🇳', color: 'orange' }
    };
    return languageMap[language] || { name: 'Unknown', flag: '🌐', color: 'gray' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && pages.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Page Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage SEO pages and their metadata
          </p>
        </div>

        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <button
            onClick={() => navigate('/admin/pages/create')}
            className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Page
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GlobeAltIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pages</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {statistics.totalPages}
                </p>
              </div>
            </div>
          </div>

          {statistics.pagesByLanguage.map((langStat) => {
            const langInfo = getLanguageInfo(langStat.language);
            return (
              <div key={langStat.language} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/60 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{langInfo.flag}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{langInfo.name}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {langStat.count}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={handleSearch}
                className="form-input pl-10 w-full"
              />
            </div>

            {/* Language Filter */}
            <div className="flex space-x-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageFilter(lang.code)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedLanguage === lang.code
                      ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            Pages ({pages.length})
          </h3>
        </div>

        {pages.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || selectedLanguage !== 'all' ? 'No pages found matching your criteria' : 'No pages found'}
            </p>
            <button
              onClick={() => navigate('/admin/pages/create')}
              className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Page
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    SEO Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
                {pages.map((page) => {
                  const langInfo = getLanguageInfo(page.language);
                  return (
                    <tr key={page.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          {page.og_image && (
                            <img
                              src={page.og_image}
                              alt={page.name}
                              className="h-10 w-10 rounded object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {page.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              /{page.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${langInfo.color}-100 text-${langInfo.color}-800 dark:bg-${langInfo.color}-900 dark:text-${langInfo.color}-200`}>
                          {langInfo.flag && <span className="mr-1">{langInfo.flag}</span>}
                          {langInfo.name}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {page.meta_title || page.page_title || 'No title'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {page.meta_description || 'No description'}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(page.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(page.id)}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="View Page"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleEdit(page.id)}
                            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            title="Edit Page"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700/60">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Pages;