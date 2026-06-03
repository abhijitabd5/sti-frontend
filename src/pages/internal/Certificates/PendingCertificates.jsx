import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import IssueCertificateModal from '@/components/common/IssueCertificateModal';
import certificateApi from '@/services/api/certificateApi';
import Toast from '@/components/ui/Internal/Toast/Toast';
import useToast from '@/hooks/useToast';
import { DatePicker } from '@/components/ui/Internal/DatePicker';

// Icons
import { 
  DocumentCheckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

function PendingCertificates() {
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    enrollment_status: 'completed',
    course: '',
    start_date: '',
    end_date: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState(null);

  // Load enrollments when filters change
  useEffect(() => {
    loadEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.enrollment_status, filters.course, filters.start_date, filters.end_date, filters.page, filters.limit]);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        certificate_status: 'not_issued'
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await certificateApi.getEnrollmentsForIssuance(params);
      if (response.success) {
        setEnrollments(response.data);
        setPagination(response.pagination);
      } else {
        showError(response.message || 'Failed to load enrollments');
      }
    } catch (error) {
      console.error('Error loading enrollments:', error);
      showError('An error occurred while loading enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEnrollment(null);
  };

  const handleSuccess = (message) => {
    loadEnrollments();
    showSuccess(message);
  };

  const handleError = (message) => {
    showError(message);
  };

  const getEnrollmentStatusBadge = (status) => {
    const badges = {
      'not_started': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'ongoing': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'aborted': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'expelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  if (loading && !enrollments.length) {
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
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Pending Certificates
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Enrollments awaiting certificate issuance
        </p>
      </div>

      {/* Issue Certificate Modal */}
      {selectedEnrollment && (
        <IssueCertificateModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          enrollment={selectedEnrollment}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-4 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MagnifyingGlassIcon className="h-4 w-4 inline mr-1" />
              Search
            </label>
            <input
              type="text"
              placeholder="Student name, mobile, course..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enrollment Status
            </label>
            <select
              value={filters.enrollment_status}
              onChange={(e) => setFilters(prev => ({ ...prev, enrollment_status: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
            >
              <option value="">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="aborted">Aborted</option>
              <option value="expelled">Expelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">From:</label>
            <DatePicker
              value={filters.start_date}
              onChange={(date) => setFilters(prev => ({ ...prev, start_date: date, page: 1 }))}
              placeholder="Select date"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">To:</label>
            <DatePicker
              value={filters.end_date}
              onChange={(date) => setFilters(prev => ({ ...prev, end_date: date, page: 1 }))}
              placeholder="Select date"
              disabled={!filters.start_date}
              minDate={filters.start_date}
            />
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            Enrollments Without Certificates ({pagination?.total || 0})
          </h3>
        </div>

        {enrollments.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No enrollments found without certificates
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Enrollment
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
                  {enrollments.map((enrollment) => (
                    <tr
                      key={enrollment.enrollment_id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {enrollment.student_name}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {enrollment.student_code}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {enrollment.mobile}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-800 dark:text-gray-100">
                          {enrollment.course_title}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Enrolled: {format(new Date(enrollment.enrollment_date), 'MMM dd, yyyy')}
                        </div>
                        {enrollment.completion_date && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Completed: {format(new Date(enrollment.completion_date), 'MMM dd, yyyy')}
                          </div>
                        )}
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getEnrollmentStatusBadge(enrollment.enrollment_status)}`}>
                            {enrollment.enrollment_status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleOpenModal(enrollment)}
                            className="btn btn-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                          >
                            <div className="flex items-center space-x-1">
                              <DocumentCheckIcon className="h-4 w-4" />
                              <span>Issue Certificate</span>
                            </div>
                          </button>
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
                  <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
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

export default PendingCertificates;
