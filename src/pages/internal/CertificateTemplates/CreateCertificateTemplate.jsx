import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import certificateTemplateApi from '@/services/api/certificateTemplateApi';
import courseApi from '@/services/api/courseApi';
import Toast from '@/components/ui/Internal/Toast/Toast';
import useToast from '@/hooks/useToast';

// Icons
import { 
  ArrowLeftIcon,
  PhotoIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

function CreateCertificateTemplate() {
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template_type: 'course_completion',
    template_image: null,
    static_font_family: 'Times New Roman',
    static_font_size: 14,
    static_text_color: '#333333',
    dynamic_font_family: 'Arial',
    dynamic_font_size: 24,
    dynamic_text_color: '#000000',
    course_id: '',
    is_default: false,
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await courseApi.getCourses({ limit: 'all', language: 'en' });
      if (response.success) {
        setCourses(response.data);
      } else {
        showError(response.message || 'Failed to load courses');
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      showError('Failed to load courses');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, template_image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.template_image) {
      showError('Please upload a template image');
      return;
    }

    setLoading(true);
    
    try {
      const response = await certificateTemplateApi.createTemplate(formData);
      if (response.success) {
        showSuccess('Certificate template created successfully!');
        navigate('/admin/certificate/templates');
      } else {
        showError(response.message || 'Failed to create template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      showError('Failed to create template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/certificate/templates')}
          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Templates
        </button>
        
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Create Certificate Template
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Upload and configure a new certificate template
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="e.g., Premium Course Certificate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="template_type"
                  value={formData.template_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="course_completion">Course Completion</option>
                  <option value="participation">Participation</option>
                  <option value="achievement">Achievement</option>
                  <option value="excellence">Excellence</option>
                  <option value="training">Training</option>
                  <option value="workshop">Workshop</option>
                  <option value="internship">Internship</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Brief description of this template..."
                />
              </div>
            </div>
          </div>

          {/* Template Image */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Template Image
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Template Image <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Recommended: A4 landscape (842x595 pixels or higher), PNG/JPG format
                </p>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              {imagePreview && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Template Preview"
                    className="w-full max-h-96 object-contain bg-gray-50 dark:bg-gray-900 rounded"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Configuration */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Configuration
            </h2>
            
            <div className="space-y-6">
              {/* Static Content Styling */}
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Static Content Styling
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Styling for fixed text like labels and descriptions
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Font Family
                    </label>
                    <select
                      name="static_font_family"
                      value={formData.static_font_family}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Courier">Courier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Font Size (px)
                    </label>
                    <input
                      type="number"
                      name="static_font_size"
                      value={formData.static_font_size}
                      onChange={handleInputChange}
                      min="8"
                      max="72"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      name="static_text_color"
                      value={formData.static_text_color}
                      onChange={handleInputChange}
                      className="w-full h-10 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Content Styling */}
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Dynamic Content Styling
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Styling for variable data like student name, course name, dates
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Font Family
                    </label>
                    <select
                      name="dynamic_font_family"
                      value={formData.dynamic_font_family}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Courier">Courier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Font Size (px)
                    </label>
                    <input
                      type="number"
                      name="dynamic_font_size"
                      value={formData.dynamic_font_size}
                      onChange={handleInputChange}
                      min="8"
                      max="72"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      name="dynamic_text_color"
                      value={formData.dynamic_text_color}
                      onChange={handleInputChange}
                      className="w-full h-10 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Other Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Associated Course (Optional)
                  </label>
                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="">None (General Template)</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Options
            </h2>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Set as default template
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Active (available for use)
                </span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/admin/certificate/templates')}
              className="btn bg-gray-500 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckIcon className="h-4 w-4" />
                  <span>Create Template</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </AdminLayout>
  );
}

export default CreateCertificateTemplate;
