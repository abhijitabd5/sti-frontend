import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import certificateTemplateApi from '@/services/api/certificateTemplateApi';
import Toast from '@/components/ui/Internal/Toast/Toast';
import useToast from '@/hooks/useToast';

// Icons
import { 
  ArrowLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

function EditCertificateTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template_type: 'course_completion',
    template_image: null,
    old_template_image: '',
    static_font_family: 'montserrat',
    dynamic_font_family: 'playfair_display',
    is_default: false,
    is_active: true
  });

  useEffect(() => {
    loadTemplate();
  }, [id]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const response = await certificateTemplateApi.getTemplateById(id);
      if (response.success) {
        const template = response.data;
        setFormData({
          name: template.name,
          description: template.description || '',
          template_type: template.template_type,
          template_image: null,
          old_template_image: template.template_image_path,
          static_font_family: template.static_font_family || 'montserrat',
          dynamic_font_family: template.dynamic_font_family || 'playfair_display',
          is_default: template.is_default,
          is_active: template.is_active
        });
        setImagePreview(template.template_image_path);
      } else {
        showError(response.message || 'Failed to load template');
      }
    } catch (error) {
      console.error('Error loading template:', error);
      showError('Failed to load template');
    } finally {
      setLoading(false);
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
    
    setSaving(true);
    
    try {
      const response = await certificateTemplateApi.updateTemplate(id, formData);
      if (response.success) {
        showSuccess('Certificate template updated successfully!');
        navigate('/admin/certificate/templates');
      } else {
        showError(response.message || 'Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      showError('Failed to update template. Please try again.');
    } finally {
      setSaving(false);
    }
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
          Edit Certificate Template
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Update template configuration
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
                  Upload New Image (Optional)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Leave empty to keep current image
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
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {formData.template_image ? 'New Preview:' : 'Current Image:'}
                  </p>
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
                <div className="grid grid-cols-1 gap-4">
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
                      <option value="montserrat">Montserrat</option>
                      <option value="great_vibes">Great Vibes</option>
                      <option value="courgette">Courgette</option>
                      <option value="playfair_display">Playfair Display</option>
                      <option value="cookie">Cookie</option>
                    </select>
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
                <div className="grid grid-cols-1 gap-4">
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
                      <option value="montserrat">Montserrat</option>
                      <option value="great_vibes">Great Vibes</option>
                      <option value="courgette">Courgette</option>
                      <option value="playfair_display">Playfair Display</option>
                      <option value="cookie">Cookie</option>
                    </select>
                  </div>
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
              disabled={saving}
              className="btn bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
            >
              {saving ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckIcon className="h-4 w-4" />
                  <span>Save Changes</span>
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

export default EditCertificateTemplate;
