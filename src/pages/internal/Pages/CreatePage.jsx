import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import pageApi from '@/services/api/pageApi';

// Icons
import {
  ArrowLeftIcon,
  PhotoIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

function CreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    language: 'en',
    page_title: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: null,
    twitter_title: '',
    twitter_description: '',
    canonical_url: '',
    is_active: true
  });

  const [errors, setErrors] = useState({});
  const [ogImagePreview, setOgImagePreview] = useState(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'mar', name: 'Marathi' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          og_image: 'Please select a valid image file (JPG, PNG, WEBP)'
        }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          og_image: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        og_image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setOgImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.og_image) {
        setErrors(prev => ({
          ...prev,
          og_image: ''
        }));
      }
    }
  };

  const handleClearImage = () => {
    setFormData(prev => ({
      ...prev,
      og_image: null
    }));
    setOgImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Page name is required';
    }

    if (!formData.language) {
      newErrors.language = 'Language is required';
    }

    if (formData.meta_title && formData.meta_title.length > 60) {
      newErrors.meta_title = 'Meta title should not exceed 60 characters';
    }

    if (formData.meta_description && formData.meta_description.length > 160) {
      newErrors.meta_description = 'Meta description should not exceed 160 characters';
    }

    if (formData.og_title && formData.og_title.length > 60) {
      newErrors.og_title = 'OG title should not exceed 60 characters';
    }

    if (formData.og_description && formData.og_description.length > 160) {
      newErrors.og_description = 'OG description should not exceed 160 characters';
    }

    if (formData.twitter_title && formData.twitter_title.length > 60) {
      newErrors.twitter_title = 'Twitter title should not exceed 60 characters';
    }

    if (formData.twitter_description && formData.twitter_description.length > 160) {
      newErrors.twitter_description = 'Twitter description should not exceed 160 characters';
    }

    if (formData.canonical_url && formData.canonical_url.trim()) {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(formData.canonical_url)) {
        newErrors.canonical_url = 'Canonical URL must be a valid HTTP/HTTPS URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await pageApi.createPage(formData);

      if (response.success) {
        navigate('/admin/pages', {
          state: { message: 'Page created successfully!' }
        });
      }
    } catch (error) {
      console.error('Error creating page:', error);
      
      // Handle validation errors from API
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Failed to create page. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/pages');
  };

  return (
    <AdminLayout>
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={handleCancel}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Create New Page
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create a new SEO-optimized page with metadata
          </p>
        </div>
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Basic Information
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Page Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`form-input w-full ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter page name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Slug will be auto-generated from this name
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Language *
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className={`form-input w-full ${errors.language ? 'border-red-500' : ''}`}
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    {errors.language && (
                      <p className="text-red-500 text-sm mt-1">{errors.language}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    name="page_title"
                    value={formData.page_title}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="Enter page title"
                  />
                </div>
              </div>
            </div>

            {/* SEO Meta Tags */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  SEO Meta Tags
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Title
                    <span className="text-xs text-gray-500 ml-2">
                      ({formData.meta_title.length}/60 characters)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    className={`form-input w-full ${errors.meta_title ? 'border-red-500' : ''}`}
                    placeholder="Enter meta title for search engines"
                    maxLength={60}
                  />
                  {errors.meta_title && (
                    <p className="text-red-500 text-sm mt-1">{errors.meta_title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Description
                    <span className="text-xs text-gray-500 ml-2">
                      ({formData.meta_description.length}/160 characters)
                    </span>
                  </label>
                  <textarea
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`form-input w-full ${errors.meta_description ? 'border-red-500' : ''}`}
                    placeholder="Enter meta description for search engines"
                    maxLength={160}
                  />
                  {errors.meta_description && (
                    <p className="text-red-500 text-sm mt-1">{errors.meta_description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    name="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="Enter keywords separated by commas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Canonical URL
                  </label>
                  <input
                    type="url"
                    name="canonical_url"
                    value={formData.canonical_url}
                    onChange={handleInputChange}
                    className={`form-input w-full ${errors.canonical_url ? 'border-red-500' : ''}`}
                    placeholder="https://example.com/page-url"
                  />
                  {errors.canonical_url && (
                    <p className="text-red-500 text-sm mt-1">{errors.canonical_url}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Open Graph Tags */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Open Graph (Social Media)
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    OG Title
                    <span className="text-xs text-gray-500 ml-2">
                      ({formData.og_title.length}/60 characters)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="og_title"
                    value={formData.og_title}
                    onChange={handleInputChange}
                    className={`form-input w-full ${errors.og_title ? 'border-red-500' : ''}`}
                    placeholder="Enter title for social media sharing"
                    maxLength={60}
                  />
                  {errors.og_title && (
                    <p className="text-red-500 text-sm mt-1">{errors.og_title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    OG Description
                    <span className="text-xs text-gray-500 ml-2">
                      ({formData.og_description.length}/160 characters)
                    </span>
                  </label>
                  <textarea
                    name="og_description"
                    value={formData.og_description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`form-input w-full ${errors.og_description ? 'border-red-500' : ''}`}
                    placeholder="Enter description for social media sharing"
                    maxLength={160}
                  />
                  {errors.og_description && (
                    <p className="text-red-500 text-sm mt-1">{errors.og_description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Twitter Tags */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Twitter Cards
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter Title
                    <span className="text-xs text-gray-500 ml-2">
                      ({formData.twitter_title.length}/60 characters)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="twitter_title"
                    value={formData.twitter_title}
                    onChange={handleInputChange}
                    className={`form-input w-full ${errors.twitter_title ? 'border-red-500' : ''}`}
                    placeholder="Enter title for Twitter sharing"
                    maxLength={60}
                  />
                  {errors.twitter_title && (
                    <p className="text-red-500 text-sm mt-1">{errors.twitter_title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter Description
                    <span className="text-xs text-gray-500 ml-2">
                      ({formData.twitter_description.length}/160 characters)
                    </span>
                  </label>
                  <textarea
                    name="twitter_description"
                    value={formData.twitter_description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`form-input w-full ${errors.twitter_description ? 'border-red-500' : ''}`}
                    placeholder="Enter description for Twitter sharing"
                    maxLength={160}
                  />
                  {errors.twitter_description && (
                    <p className="text-red-500 text-sm mt-1">{errors.twitter_description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* OG Image */}
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
                {ogImagePreview ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={ogImagePreview}
                        alt="OG Image Preview"
                        className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>File:</strong> {formData.og_image?.name}</p>
                      <p><strong>Size:</strong> {(formData.og_image?.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      name="og_image"
                      onChange={handleFileChange}
                      className="form-input w-full"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      JPG, PNG, WEBP formats. Max 5MB.
                    </p>
                  </div>
                )}
                {errors.og_image && (
                  <p className="text-red-500 text-sm mt-2">{errors.og_image}</p>
                )}
              </div>
            </div>

            {/* Page Status */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Page Status
                </h3>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Active Page
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Active pages are available for SEO system usage
                </p>
              </div>
            </div>

            {/* Preview Card */}
            {(formData.og_title || formData.meta_title || formData.name) && (
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
                    {ogImagePreview && (
                      <img
                        src={ogImagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-3">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                        {formData.og_title || formData.meta_title || formData.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {formData.og_description || formData.meta_description || 'No description provided'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {formData.canonical_url || 'example.com'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700/60">
          <button
            type="button"
            onClick={handleCancel}
            className="btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <CheckIcon className="h-4 w-4 mr-2" />
            )}
            Create Page
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default CreatePage;