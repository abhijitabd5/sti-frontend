import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import certificateApi from '@/services/api/certificateApi';
import Toast from '@/components/ui/Internal/Toast/Toast';
import useToast from '@/hooks/useToast';
import RegenerateCertificateModal from '@/components/common/RegenerateCertificateModal';

// Icons
import { 
  EyeIcon, 
  ArrowDownTrayIcon,
  ArrowPathIcon,
  XCircleIcon,
  CheckCircleIcon,
  TruckIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ClockIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

function Certificates() {
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    hard_copy_delivered: '',
    student_id: '',
    course_id: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState(null);
  const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Load certificates and stats
  useEffect(() => {
    loadCertificates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.status, filters.hard_copy_delivered, filters.student_id, filters.course_id, filters.page, filters.limit]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await certificateApi.getCertificates(params);
      if (response.success) {
        setCertificates(response.data);
        setPagination(response.pagination);
      } else {
        showError(response.message || 'Failed to load certificates');
      }
    } catch (error) {
      console.error('Error loading certificates:', error);
      showError('An error occurred while loading certificates');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await certificateApi.getCertificateStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAction = async (action, certificateId) => {
    setActionLoading(prev => ({ ...prev, [certificateId]: action }));
    
    try {
      let response;
      switch (action) {
        case 'revoke':
          if (!window.confirm('Are you sure you want to revoke this certificate?')) return;
          response = await certificateApi.revokeCertificate(certificateId);
          break;
        case 'restore':
          response = await certificateApi.restoreCertificate(certificateId);
          break;
        case 'expire':
          if (!window.confirm('Are you sure you want to mark this certificate as expired?')) return;
          response = await certificateApi.markAsExpired(certificateId);
          break;
        case 'deliver':
          response = await certificateApi.markHardCopyDelivered(certificateId);
          break;
        case 'regenerate':
          // Open modal instead of direct regeneration
          const cert = certificates.find(c => c.id === certificateId);
          if (cert) {
            setSelectedCertificate(cert);
            setRegenerateModalOpen(true);
          }
          return;
        default:
          return;
      }

      if (response.success) {
        loadCertificates();
        loadStats();
        showSuccess(response.message || 'Action completed successfully');
      } else {
        showError(response.message || 'Action failed');
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      showError(`Failed to ${action} certificate`);
    } finally {
      setActionLoading(prev => ({ ...prev, [certificateId]: null }));
    }
  };

  const handleDownload = async (certificateId, certificateNumber) => {
    try {
      const blob = await certificateApi.downloadCertificate(certificateId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificateNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSuccess('Certificate downloaded successfully');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      showError('Failed to download certificate');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'valid': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'revoked': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'expired': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid':
        return <ShieldCheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'revoked':
        return <ShieldExclamationIcon className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'expired':
        return <ClockIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
      default:
        return null;
    }
  };

  if (loading && !certificates.length) {
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
            Issued Certificates
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all issued certificates
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                  {stats.total_certificates}
                </p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Valid</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {stats.valid_certificates}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Revoked</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {stats.revoked_certificates}
                </p>
              </div>
              <XCircleIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Expired</p>
                <p className="text-xl font-bold text-gray-600 dark:text-gray-400 mt-1">
                  {stats.expired_certificates}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Delivered</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {stats.hard_copy_delivered}
                </p>
              </div>
              <TruckIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                  {stats.hard_copy_pending}
                </p>
              </div>
              <TruckIcon className="h-8 w-8 text-orange-500" />
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
              placeholder="Certificate number, student code..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="valid">Valid</option>
              <option value="revoked">Revoked</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Delivery Status
            </label>
            <select
              value={filters.hard_copy_delivered}
              onChange={(e) => setFilters(prev => ({ ...prev, hard_copy_delivered: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="true">Delivered</option>
              <option value="false">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            All Certificates ({pagination?.total || 0})
          </h3>
        </div>

        {certificates.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No certificates found</p>
            <button
              onClick={() => navigate('/admin/certificate/issue')}
              className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Issue Your First Certificate
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Certificate #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Delivery
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
                  {certificates.map((cert) => (
                    <tr
                      key={cert.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(cert.status)}
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                            {cert.certificate_number}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Verified: {cert.verification_count} times
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {cert.student?.name_on_id || cert.student?.user?.name}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {cert.student?.student_code}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-800 dark:text-gray-100">
                          {cert.course?.title}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {cert.course?.duration} days
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                        {format(new Date(cert.issue_date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(cert.status)}`}>
                            {cert.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          {cert.hard_copy_delivered ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <ClockIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => navigate(`/admin/certificate/view/${cert.id}`)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDownload(cert.id, cert.certificate_number)}
                            className="p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            title="Download PDF"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleAction('regenerate', cert.id)}
                            disabled={actionLoading[cert.id] === 'regenerate'}
                            className="p-1.5 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors disabled:opacity-50"
                            title="Regenerate PDF"
                          >
                            <ArrowPathIcon className="h-4 w-4" />
                          </button>

                          {cert.status === 'valid' && (
                            <button
                              onClick={() => handleAction('revoke', cert.id)}
                              disabled={actionLoading[cert.id] === 'revoke'}
                              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                              title="Revoke Certificate"
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          )}

                          {cert.status === 'revoked' && (
                            <button
                              onClick={() => handleAction('restore', cert.id)}
                              disabled={actionLoading[cert.id] === 'restore'}
                              className="p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors disabled:opacity-50"
                              title="Restore Certificate"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                          )}

                          {!cert.hard_copy_delivered && (
                            <button
                              onClick={() => handleAction('deliver', cert.id)}
                              disabled={actionLoading[cert.id] === 'deliver'}
                              className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
                              title="Mark as Delivered"
                            >
                              <TruckIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Regenerate Certificate Modal */}
      <RegenerateCertificateModal
        isOpen={regenerateModalOpen}
        onClose={() => {
          setRegenerateModalOpen(false);
          setSelectedCertificate(null);
        }}
        certificate={selectedCertificate}
        onSuccess={(message) => {
          loadCertificates();
          loadStats();
          showSuccess(message);
        }}
        onError={showError}
      />

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

export default Certificates;
