import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import certificateTemplateApi from '@/services/api/certificateTemplateApi';
import Toast from '@/components/ui/Internal/Toast/Toast';
import useToast from '@/hooks/useToast';

// Icons
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

function CertificateTemplates() {
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    template_type: '',
    is_active: ''
  });

  // Load templates and stats
  useEffect(() => {
    loadTemplates();
    loadStats();
  }, [filters]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 'all',
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await certificateTemplateApi.getTemplates(params);
      if (response.success) {
        setTemplates(response.data);
      } else {
        showError(response.message || 'Failed to load templates');
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      showError('An error occurred while loading templates');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await certificateTemplateApi.getTemplateStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleToggleStatus = async (templateId) => {
    setStatusLoading(prev => ({ ...prev, [templateId]: true }));
    
    try {
      const response = await certificateTemplateApi.toggleTemplateStatus(templateId);
      if (response.success) {
        setTemplates(prev => 
          prev.map(template => 
            template.id === templateId 
              ? { ...template, is_active: response.data.is_active }
              : template
          )
        );
        loadStats();
        showSuccess(`Template ${response.data.is_active ? 'activated' : 'deactivated'} successfully`);
      } else {
        showError(response.message || 'Failed to toggle template status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showError('Failed to update template status');
    } finally {
      setStatusLoading(prev => ({ ...prev, [templateId]: false }));
    }
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    setDeleteLoading(prev => ({ ...prev, [templateId]: true }));
    
    try {
      const response = await certificateTemplateApi.deleteTemplate(templateId);
      if (response.success) {
        setTemplates(prev => prev.filter(template => template.id !== templateId));
        loadStats();
        showSuccess('Template deleted successfully');
      } else {
        showError(response.message || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      showError('Failed to delete template');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [templateId]: false }));
    }
  };

  const getTemplateTypeBadge = (type) => {
    const badges = {
      'course_completion': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'participation': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'achievement': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'excellence': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'training': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'workshop': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'internship': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'other': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return badges[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Certificate Templates
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage certificate templates for courses and achievements
          </p>
        </div>

        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <button
            onClick={() => navigate('/admin/certificate/templates/create')}
            className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Template
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Templates</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                  {stats.total_templates}
                </p>
              </div>
              <DocumentTextIcon className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {stats.active_templates}
                </p>
              </div>
              <CheckCircleIcon className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Inactive</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">
                  {stats.inactive_templates}
                </p>
              </div>
              <XCircleIcon className="h-10 w-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Default</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1 truncate">
                  {stats.default_template?.name || 'None'}
                </p>
              </div>
              <CheckCircleIcon className="h-10 w-10 text-violet-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Template Type
            </label>
            <select
              value={filters.template_type}
              onChange={(e) => setFilters(prev => ({ ...prev, template_type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">All Types</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.is_active}
              onChange={(e) => setFilters(prev => ({ ...prev, is_active: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            All Templates ({templates.length})
          </h3>
        </div>

        {templates.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No templates found</p>
            <button
              onClick={() => navigate('/admin/certificate/templates/create')}
              className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Template Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-gray-600">
                  {template.template_image_path ? (
                    <img
                      src={template.template_image_path}
                      alt={template.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <DocumentTextIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Default Badge */}
                  {template.is_default && (
                    <div className="absolute top-2 right-2 bg-violet-500 text-white text-xs px-2 py-1 rounded-full">
                      Default
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                      {template.name}
                    </h4>
                  </div>

                  {template.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTemplateTypeBadge(template.template_type)}`}>
                      {template.template_type}
                    </span>

                    <button
                      onClick={() => handleToggleStatus(template.id)}
                      disabled={statusLoading[template.id]}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
                        template.is_active
                          ? 'bg-green-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                          template.is_active ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/certificate/templates/preview/${template.id}`)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Preview Template"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => navigate(`/admin/certificate/templates/edit/${template.id}`)}
                        className="p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        title="Edit Template"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(template.id)}
                        disabled={deleteLoading[template.id]}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete Template"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {template.course && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Course: {template.course.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default CertificateTemplates;
