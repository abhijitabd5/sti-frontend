import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import certificateApi from '@/services/api/certificateApi';
import Toast from '@/components/ui/Internal/Toast/Toast';
import useToast from '@/hooks/useToast';

// Icons
import { 
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  XCircleIcon,
  CheckCircleIcon,
  TruckIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

function ViewCertificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [editingAddress, setEditingAddress] = useState(false);

  useEffect(() => {
    loadCertificate();
  }, [id]);

  const loadCertificate = async () => {
    try {
      setLoading(true);
      const response = await certificateApi.getCertificateById(id);
      if (response.success) {
        setCertificate(response.data);
        setDeliveryAddress(response.data.delivery_address || '');
      } else {
        showError(response.message || 'Failed to load certificate');
      }
    } catch (error) {
      console.error('Error loading certificate:', error);
      showError('An error occurred while loading certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    setActionLoading(action);
    
    try {
      let response;
      switch (action) {
        case 'revoke':
          if (!window.confirm('Are you sure you want to revoke this certificate?')) return;
          response = await certificateApi.revokeCertificate(id);
          break;
        case 'restore':
          response = await certificateApi.restoreCertificate(id);
          break;
        case 'expire':
          if (!window.confirm('Are you sure you want to mark this certificate as expired?')) return;
          response = await certificateApi.markAsExpired(id);
          break;
        case 'deliver':
          response = await certificateApi.markHardCopyDelivered(id);
          break;
        case 'regenerate':
          if (!window.confirm('Regenerate certificate PDF?')) return;
          response = await certificateApi.regenerateCertificate(id);
          break;
        default:
          return;
      }

      if (response.success) {
        loadCertificate();
        showSuccess(response.message || 'Action completed successfully');
      } else {
        showError(response.message || 'Action failed');
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      showError(`Failed to ${action} certificate`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await certificateApi.downloadCertificate(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificate.certificate_number}.pdf`;
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

  const handleUpdateAddress = async () => {
    try {
      const response = await certificateApi.updateDeliveryAddress(id, deliveryAddress);
      if (response.success) {
        setEditingAddress(false);
        loadCertificate();
        showSuccess('Delivery address updated successfully');
      } else {
        showError(response.message || 'Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      showError('Failed to update delivery address');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'valid': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', icon: ShieldCheckIcon },
      'revoked': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', icon: ShieldExclamationIcon },
      'expired': { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', icon: ClockIcon }
    };
    return badges[status] || badges['valid'];
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

  if (!certificate) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Certificate not found</p>
          <button
            onClick={() => navigate('/admin/certificate/issued')}
            className="mt-4 btn bg-violet-500 text-white hover:bg-violet-600"
          >
            Back to Certificates
          </button>
        </div>
      </AdminLayout>
    );
  }

  const statusBadge = getStatusBadge(certificate.status);
  const StatusIcon = statusBadge.icon;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/certificate/issued')}
          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Certificates
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Certificate Details
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {certificate.certificate_number}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text} flex items-center space-x-1`}>
              <StatusIcon className="h-4 w-4" />
              <span>{certificate.status}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Certificate Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Certificate Preview
            </h2>
            
            {certificate.file_path ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <iframe
                  src={certificate.file_path}
                  className="w-full h-96"
                  title="Certificate Preview"
                />
              </div>
            ) : (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No certificate file available</p>
              </div>
            )}

            <div className="flex items-center space-x-2 mt-4">
              <button
                onClick={handleDownload}
                className="btn bg-blue-500 text-white hover:bg-blue-600"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              
              <button
                onClick={() => handleAction('regenerate')}
                disabled={actionLoading === 'regenerate'}
                className="btn bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Regenerate
              </button>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Student Information
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1">
                  {certificate.student?.name_on_id || certificate.student?.user?.name}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Student Code</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1">
                  {certificate.student?.student_code}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1">
                  {certificate.student?.user?.email}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mobile</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1">
                  {certificate.student?.user?.mobile}
                </p>
              </div>
            </div>
          </div>

          {/* Course Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Course Information
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Course Title</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1">
                  {certificate.course?.title}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1">
                  {certificate.course?.duration} days
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enrollment Status</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1">
                  {certificate.enrollment?.status}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Template</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1">
                  {certificate.template?.name || 'Default'}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Delivery Address
              </h2>
              {!editingAddress && (
                <button
                  onClick={() => setEditingAddress(true)}
                  className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                >
                  Edit
                </button>
              )}
            </div>
            
            {editingAddress ? (
              <div>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Enter delivery address..."
                />
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={handleUpdateAddress}
                    className="btn btn-sm bg-green-500 text-white hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingAddress(false);
                      setDeliveryAddress(certificate.delivery_address || '');
                    }}
                    className="btn btn-sm bg-gray-500 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-800 dark:text-gray-100">
                {certificate.delivery_address || 'No delivery address provided'}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Certificate Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Certificate Info
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Issue Date</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1">
                  {format(new Date(certificate.issue_date), 'MMMM dd, yyyy')}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Verification Code</p>
                <p className="text-sm font-mono font-medium text-gray-800 dark:text-gray-100 mt-1">
                  {certificate.verification_code}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Verification Count</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1">
                  {certificate.verification_count} times
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hard Copy Status</p>
                <div className="flex items-center space-x-2 mt-1">
                  {certificate.hard_copy_delivered ? (
                    <>
                      <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">Delivered</span>
                    </>
                  ) : (
                    <>
                      <ClockIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Pending</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
              <QrCodeIcon className="h-5 w-5 mr-2" />
              QR Code
            </h2>
            
            {certificate.qr_code_path ? (
              <div className="flex justify-center">
                <img
                  src={certificate.qr_code_path}
                  alt="Certificate QR Code"
                  className="w-48 h-48"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                No QR code available
              </p>
            )}
            
            {certificate.verification_url && (
              <div className="mt-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Verification URL:</p>
                <a
                  href={certificate.verification_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-violet-600 dark:text-violet-400 hover:underline break-all"
                >
                  {certificate.verification_url}
                </a>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Actions
            </h2>
            
            <div className="space-y-2">
              {certificate.status === 'valid' && (
                <button
                  onClick={() => handleAction('revoke')}
                  disabled={actionLoading === 'revoke'}
                  className="w-full btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Revoke Certificate
                </button>
              )}

              {certificate.status === 'revoked' && (
                <button
                  onClick={() => handleAction('restore')}
                  disabled={actionLoading === 'restore'}
                  className="w-full btn bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Restore Certificate
                </button>
              )}

              {certificate.status === 'valid' && (
                <button
                  onClick={() => handleAction('expire')}
                  disabled={actionLoading === 'expire'}
                  className="w-full btn bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50"
                >
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Mark as Expired
                </button>
              )}

              {!certificate.hard_copy_delivered && (
                <button
                  onClick={() => handleAction('deliver')}
                  disabled={actionLoading === 'deliver'}
                  className="w-full btn bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  <TruckIcon className="h-4 w-4 mr-2" />
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>
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

export default ViewCertificate;
