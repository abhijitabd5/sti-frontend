import React, { useEffect } from 'react';
import { XMarkIcon, StarIcon, UserCircleIcon } from '@heroicons/react/24/outline';

function ViewReviewModal({ isOpen, onClose, review }) {
  // Close on click outside handled by overlay onClick

  // Close on ESC key
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!isOpen || keyCode !== 27) return;
      onClose();
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [isOpen, onClose]);

  if (!isOpen || !review) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

        {/* Center modal alignment helper */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="relative z-[10000] inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Review Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-4 space-y-6">
            {/* Profile Photo and Basic Info */}
            <div className="flex items-center space-x-4">
              {review.profile_photo ? (
                <img
                  src={review.profile_photo}
                  alt={review.name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <UserCircleIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {review.name}
                </h3>
                <div className="flex items-center space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-5 w-5 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {review.rating} / 5
                  </span>
                </div>
              </div>
            </div>

            {/* Review Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                  City
                </label>
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  {review.city || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Mobile
                </label>
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  {review.mobile || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Enrolled Course
                </label>
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  {review.enrolled_course || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Recruited At
                </label>
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  {review.recruited_at || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    review.is_approved
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}
                >
                  {review.is_approved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Display Order
                </label>
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  {review.display_order}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Student Type
                </label>
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  {review.is_enrolled_student ? 'Enrolled Student' : 'External'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Created At
                </label>
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                Review Text
              </label>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700/60">
                <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                  {review.review_text}
                </p>
              </div>
            </div>

            {/* QR Code (if available) */}
            {review.qr_code_url && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                  QR Code
                </label>
                <img
                  src={review.qr_code_url}
                  alt="QR Code"
                  className="h-32 w-32 border border-gray-200 dark:border-gray-700/60 rounded"
                />
              </div>
            )}

            {/* Timestamps */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700/60">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div>
                  <span className="font-medium">Created:</span> {formatDate(review.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {formatDate(review.updatedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700/60 flex justify-end">
            <button
              onClick={onClose}
              className="btn bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700/60 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/80"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewReviewModal;
