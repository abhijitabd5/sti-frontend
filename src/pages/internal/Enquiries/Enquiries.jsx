import React, { useState, useEffect } from 'react';
import { PlusIcon, EyeIcon, TrashIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import internalEnquiryApi from '@/services/api/internalEnquiryApi';
import ViewEnquiryModal from './components/ViewEnquiryModal';
import TakeActionModal from './components/TakeActionModal';
import ConfirmDeleteModal from '@/components/common/Modal/ConfirmDeleteModal';

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadEnquiries();
  }, [page, limit, filterStatus]);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      let response;

      if (filterStatus === 'all') {
        response = await internalEnquiryApi.getEnquiries(page, limit);
      } else {
        response = await internalEnquiryApi.getEnquiriesByStatus(filterStatus, page, limit);
      }

      if (response.success && response.data) {
        setEnquiries(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error loading enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  const handleView = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setViewModalOpen(true);
  };

  const handleTakeAction = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setActionModalOpen(true);
  };

  const handleMarkRead = async (enquiry) => {
    try {
      setActionLoading(true);
      await internalEnquiryApi.updateStatus(enquiry.id, 'read');
      loadEnquiries();
    } catch (error) {
      console.error('Error marking enquiry as read:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDiscard = async (enquiry) => {
    try {
      setActionLoading(true);
      await internalEnquiryApi.updateStatus(enquiry.id, 'discard');
      loadEnquiries();
    } catch (error) {
      console.error('Error discarding enquiry:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await internalEnquiryApi.deleteEnquiry(selectedEnquiry.id);
      loadEnquiries();
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleActionSubmit = async (actionData) => {
    try {
      setActionLoading(true);
      await internalEnquiryApi.takeAction(
        selectedEnquiry.id,
        actionData.action_type,
        actionData.remark
      );
      setActionModalOpen(false);
      loadEnquiries();
    } catch (error) {
      console.error('Error taking action:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && enquiries.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      </AdminLayout>
    );
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'unread':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'read':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'discard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Enquiry Management
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          View and manage all customer enquiries
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700/60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="all">All Enquiries</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="discard">Discard</option>
            </select>
          </div>

          {/* Records Per Page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Records Per Page
            </label>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            Enquiries ({pagination.total || 0})
          </h3>
        </div>

        {enquiries.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No enquiries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100 font-medium">
                      {enquiry.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {enquiry.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {enquiry.course_name || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(enquiry.status)}`}>
                        {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-y-2 sm:space-y-0 sm:space-x-2">
                      {/* Status Actions Row 1 */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        {enquiry.status === 'unread' && (
                          <button
                            onClick={() => handleMarkRead(enquiry)}
                            disabled={actionLoading}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
                            title="Mark as Read"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                        {enquiry.status !== 'discard' && (
                          <button
                            onClick={() => handleDiscard(enquiry)}
                            disabled={actionLoading}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Discard"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Action Buttons Row 2 */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleView(enquiry)}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="View"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTakeAction(enquiry)}
                          className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          title="Take Action"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(enquiry)}
                          disabled={actionLoading}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={!pagination.hasPrev || loading}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={!pagination.hasNext || loading}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewEnquiryModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        enquiry={selectedEnquiry}
      />

      <TakeActionModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        enquiry={selectedEnquiry}
        onSubmit={handleActionSubmit}
        loading={actionLoading}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Enquiry"
        message={`Are you sure you want to delete the enquiry from ${selectedEnquiry?.name}? This action cannot be undone.`}
      />
    </AdminLayout>
  );
}

export default Enquiries;
