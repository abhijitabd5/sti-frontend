import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import certificateTemplateApi from '@/services/api/certificateTemplateApi';

// Icons
import { 
  ArrowLeftIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

function PreviewCertificateTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplate();
  }, [id]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const response = await certificateTemplateApi.previewTemplate(id);
      if (response.success) {
        setTemplate(response.data);
      }
    } catch (error) {
      console.error('Error loading template:', error);
    } finally {
      setLoading(false);
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

  if (!template) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Template not found</p>
          <button
            onClick={() => navigate('/admin/certificate/templates')}
            className="mt-4 btn bg-violet-500 text-white hover:bg-violet-600"
          >
            Back to Templates
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/certificate/templates')}
          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Templates
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Template Preview
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {template.name}
            </p>
          </div>

          <button
            onClick={() => navigate(`/admin/certificate/templates/edit/${id}`)}
            className="btn bg-violet-500 text-white hover:bg-violet-600"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Template
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Template Image
        </h2>
        
        {template.template_image_path ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
            <img
              src={template.template_image_path}
              alt={template.name}
              className="w-full h-auto"
            />
          </div>
        ) : (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No template image available</p>
          </div>
        )}

        {/* Field Positions Info */}
        {template.field_positions && Object.keys(template.field_positions).length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Field Positions
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <pre className="text-xs text-gray-800 dark:text-gray-100 overflow-x-auto">
                {JSON.stringify(template.field_positions, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Sample Data Preview */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Sample Certificate Preview
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            This shows how the certificate will look with sample data overlaid on the template.
          </p>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <div className="relative">
              <img
                src={template.template_image_path}
                alt="Sample Certificate"
                className="w-full h-auto"
              />
              
              {/* Sample overlay text (visual representation) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800 mb-2">John Doe</p>
                  <p className="text-lg text-gray-700">Heavy Equipment Operator Training</p>
                  <p className="text-sm text-gray-600 mt-4">Certificate Number: CERT-2502-STI202500001-5-AB3D</p>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Note: Actual certificate generation will use configured field positions and fonts
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default PreviewCertificateTemplate;
