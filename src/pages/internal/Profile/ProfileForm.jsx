import React, { useState } from 'react';

const ProfileForm = ({ profile, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: profile?.email || '',
    mobile: profile?.mobile || '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [currentImagePreview, setCurrentImagePreview] = useState(profile?.profile_image || null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        file: 'Only JPG, JPEG, and PNG files are allowed',
      }));
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        file: 'File size must not exceed 10MB',
      }));
      return;
    }

    setSelectedFile(file);
    setErrors((prev) => ({
      ...prev,
      file: '',
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.mobile?.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10,}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
    };

    if (selectedFile) {
      submitData.file = selectedFile;
    }

    await onSubmit(submitData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden">
        {/* Profile Photo Section */}
        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wider">
            Profile Photo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Image Preview */}
            <div className="text-center">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Current Photo
              </label>
              <div className="flex justify-center">
                {currentImagePreview ? (
                  <img
                    src={currentImagePreview}
                    alt="Current profile"
                    className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <span className="text-gray-400 dark:text-gray-500 text-sm">No photo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Image Preview */}
            <div className="text-center">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                New Photo Preview
              </label>
              <div className="flex justify-center">
                {selectedImagePreview ? (
                  <img
                    src={selectedImagePreview}
                    alt="Selected profile"
                    className="w-32 h-32 rounded-lg object-cover border-2 border-green-400"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <span className="text-gray-400 dark:text-gray-500 text-sm">No selection</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* File Input */}
          <div className="mt-6">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-violet-500 focus:border-violet-500"
            />
            {errors.file && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.file}</p>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Supported formats: JPG, JPEG, PNG (max 10MB)
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="px-6 py-6 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className="form-input"
                disabled={isLoading}
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className="form-input"
                disabled={isLoading}
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.last_name}</p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="form-input"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Mobile Field */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Mobile Number *
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter mobile number"
              className="form-input"
              disabled={isLoading}
            />
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.mobile}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700/60 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
