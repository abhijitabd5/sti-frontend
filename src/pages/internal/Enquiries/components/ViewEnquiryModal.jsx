import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ViewEnquiryModal = ({ isOpen, onClose, enquiry }) => {
  if (!isOpen || !enquiry) return null;

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500/60 dark:bg-gray-900/70"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Center modal */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="relative z-[10000] inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-6">
                Enquiry Details
              </h3>

              <div className="space-y-6">
                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {enquiry.name}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(enquiry.status)}`}>
                      {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Phone and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {enquiry.phone}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {enquiry.email || '-'}
                    </p>
                  </div>
                </div>

                {/* Course Name and Source */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Course Name
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {enquiry.course_name || '-'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Source
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                      {enquiry.source}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mt-2">
                    <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {enquiry.message}
                    </p>
                  </div>
                </div>

                {/* Action Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Action Type
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                      {enquiry.action_type ? enquiry.action_type.replace(/_/g, ' ') : '-'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Action Taken
                    </label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${enquiry.is_action_taken ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {enquiry.is_action_taken ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {/* Remark */}
                {enquiry.remark && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reviewer Remarks
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mt-2">
                      <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                        {enquiry.remark}
                      </p>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Created At
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDate(enquiry.createdAt)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Updated At
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDate(enquiry.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEnquiryModal;
