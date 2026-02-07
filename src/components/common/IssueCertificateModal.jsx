import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import certificateTemplateApi from '@/services/api/certificateTemplateApi';
import certificateApi from '@/services/api/certificateApi';

// Icons
import { 
  XMarkIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

function IssueCertificateModal({ isOpen, onClose, enrollment, onSuccess, onError }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [formData, setFormData] = useState({
    template_id: '',
    issue_date: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await certificateTemplateApi.getTemplates({
        is_active: true,
        limit: 'all',
        sortBy: 'display_order',
        sortOrder: 'ASC'
      });
      
      if (response.success && response.data.length > 0) {
        setTemplates(response.data);
        // Set first template as default
        setFormData(prev => ({
          ...prev,
          template_id: response.data[0].id
        }));
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.template_id) {
      if (onError) onError('Please select a template');
      return;
    }

    setIssuing(true);
    
    try {
      const certificateData = {
        student_id: enrollment.student_id,
        course_id: enrollment.course_id,
        enrollment_id: enrollment.enrollment_id,
        template_id: parseInt(formData.template_id),
        issue_date: formData.issue_date
      };

      const response = await certificateApi.issueCertificate(certificateData);
      
      if (response.success) {
        onClose();
        if (onSuccess) onSuccess(`Certificate issued successfully! Certificate Number: ${response.data.certificate_number}`);
      } else {
        if (onError) onError(response.message || 'Failed to issue certificate');
      }
    } catch (error) {
      console.error('Error issuing certificate:', error);
      if (onError) onError('Failed to issue certificate. Please try again.');
    } finally {
      setIssuing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Issue Certificate
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Student Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Student Information
            </h4>
            <div className="space-y-1 text-sm">
              <p className="text-gray-800 dark:text-gray-100">
                <span className="font-medium">Name:</span> {enrollment.student_name}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Code:</span> {enrollment.student_code}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Course:</span> {enrollment.course_title}
              </p>
            </div>
          </div>

          {/* Form */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No active templates available. Please create a template first.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate Template <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.template_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, template_id: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} {template.is_default ? '(Default)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Select the template to use for this certificate
                </p>
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                  required
                  max={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Date when the certificate is issued
                </p>
              </div>

              {/* Template Preview */}
              {formData.template_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Template Preview
                  </label>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={templates.find(t => t.id === parseInt(formData.template_id))?.template_image_path}
                      alt="Template Preview"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {!loading && templates.length > 0 && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={issuing}
              className="btn bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={issuing}
              className="btn bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {issuing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Issuing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <DocumentCheckIcon className="h-4 w-4" />
                  <span>Issue Certificate</span>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueCertificateModal;
