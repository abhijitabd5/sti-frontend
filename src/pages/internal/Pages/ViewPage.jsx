import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import pageApi from '@/services/api/pageApi';

// Icons
import {
  ArrowLeftIcon,
  PencilIcon,
  EyeIcon,
  CalendarIcon,
  LanguageIcon,
  GlobeAltIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

function ViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load page data
  useEffect(() => {
    loadPage();
  }, [id]);

  const loadPage = async () => {
    try {
      setLoading(true);
      const response = await pageApi.getPageById(id, true);
      
      if (response.success) {
        setPage(response.data);
      } else {
        navigate('/admin/pages');
      }
    } catch (error) {
      console.error('Error loading page:', error);
      navigate('/admin/pages');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/pages');
  };

  const handleEdit = () => {
    navigate(`/admin/pages/edit/${page.id}`);
  };

  const handleDuplicate = async () => {
    try {
      const response = await pageApi.duplicatePage(page.id);
      if (response.success) {
        navigate('/admin/pages', {
          state: { message: 'Page duplicated successfully!' }
        });
      }
    } catch (error) {
      console.error('Error duplicating page:', error);
    }
  };

  const getLanguageInfo = (language) => {
    const languages = {
      'en': { name: 'English', flag: '🇺🇸', color: 'blue' },
      'hi': { name: 'Hindi', flag: '🇮🇳', color: 'green' },
      'mar': { name: 'Marathi', flag: '🇮🇳', color: 'orange' }
    };
    return languages[language] || { name: 'Unknown', flag: '🌐', color: 'gray' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!page) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XMarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Page not found</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const languageInfo = getLanguageInfo(page.language);

  return (
    <AdminLayout>
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={handleBack}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Page Details
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View complete page information and SEO metadata
          </p>
        </div>

        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <button
            onClick={handleDuplicate}
            className="btn bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg"
          >
            <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
            Duplicate
          </button>
          <button
            onClick={handleEdit}
            className="btn bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 shadow-lg"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Page
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Page Header */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{languageInfo.flag}</span>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {page.name}
                    </h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      page.is_active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {page.is_active ? (
                        <CheckIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <XMarkIcon className="h-3 w-3 mr-1" />
                      )}
                      {page.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    /{page.slug}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-2">
                    <LanguageIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{languageInfo.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Language</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-2">
                    <GlobeAltIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">#{page.id}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Page ID</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-2">
                    <CalendarIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {formatDate(page.createdAt).split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Information */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                SEO Information
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Page Title
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {page.page_title || 'Not set'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Title
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {page.meta_title || 'Not set'}
                </p>
                {page.meta_title && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {page.meta_title.length}/60 characters
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Description
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {page.meta_description || 'Not set'}
                </p>
                {page.meta_description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {page.meta_description.length}/160 characters
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Keywords
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {page.meta_keywords || 'Not set'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Canonical URL
                </label>
                {page.canonical_url ? (
                  <a
                    href={page.canonical_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {page.canonical_url}
                  </a>
                ) : (
                  <p className="text-gray-900 dark:text-gray-100">Not set</p>
                )}
              </div>
            </div>
          </div>

          {/* Open Graph Information */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                Open Graph (Social Media)
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  OG Title
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {page.og_title || 'Not set'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  OG Description
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {page.og_description || 'Not set'}
                </p>
              </div>
            </div>
          </div>

          {/* Twitter Information */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                Twitter Cards
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Twitter Title
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {page.twitter_title || 'Not set'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Twitter Description
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {page.twitter_description || 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* OG Image Preview */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <div className="flex items-center space-x-2">
                <PhotoIcon className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Open Graph Image
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              {page.og_image ? (
                <div className="space-y-4">
                  <img
                    src={page.og_image}
                    alt="Open Graph Image"
                    className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Image URL:</strong></p>
                    <a
                      href={page.og_image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                    >
                      {page.og_image}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No OG image uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Social Media Preview */}
          {(page.og_title || page.meta_title || page.name) && (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center space-x-2">
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    Social Media Preview
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  {page.og_image && (
                    <img
                      src={page.og_image}
                      alt="Preview"
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                      {page.og_title || page.meta_title || page.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {page.og_description || page.meta_description || 'No description provided'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {page.canonical_url || 'example.com'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Page Metadata */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Page Metadata
                </h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Page ID
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">#{page.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slug
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">/{page.slug}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created Date
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(page.createdAt)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Updated
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(page.updatedAt)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  page.is_active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {page.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ViewPage;