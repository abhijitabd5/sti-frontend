import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CategoryModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  category = null, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: ''
  });
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes or category changes
  useEffect(() => {
    if (isOpen) {
      if (category) {
        // Edit mode
        setFormData({
          name: category.name,
          type: category.type
        });
      } else {
        // Create mode
        setFormData({
          name: '',
          type: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, category]);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Type validation
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        type: formData.type
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500/60 dark:bg-gray-900/70"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative z-[10000] inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700/60">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
              {category ? 'Edit Category' : 'Create Category'}
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              disabled={loading}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label 
                htmlFor="categoryName" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Category Name *
              </label>
              <input
                id="categoryName"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                  errors.name 
                    ? 'border-red-300 dark:border-red-500' 
                    : 'border-gray-200 dark:border-gray-700/60'
                } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
                placeholder="Enter category name"
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Type Field */}
            <div>
              <label 
                htmlFor="categoryType" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Type *
              </label>
              <select
                id="categoryType"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                  errors.type 
                    ? 'border-red-300 dark:border-red-500' 
                    : 'border-gray-200 dark:border-gray-700/60'
                } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100`}
                disabled={loading}
              >
                <option value="">Select type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.type}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {category ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  category ? 'Update Category' : 'Create Category'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
