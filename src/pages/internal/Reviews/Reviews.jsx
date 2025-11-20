import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import reviewApi from '@/services/api/reviewApi';
import ReviewFormModal from './ReviewFormModal';
import ViewReviewModal from './ViewReviewModal';

import {
  EyeIcon,
  PencilIcon,
  Bars3Icon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const DraggableRow = ({ review, index, moveReview, onToggleApproval, onView, onEdit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'reviewRow',
    item: { index, id: review.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'reviewRow',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveReview(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <tr
      ref={(node) => drag(drop(node))}
      className={`border-b border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100 font-medium">
        {review.display_order}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          {review.profile_photo ? (
            <img
              src={review.profile_photo}
              alt={review.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">
              {review.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {review.name}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
        {review.mobile || 'N/A'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-4 w-4 ${
                star <= review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onToggleApproval(review.id, !review.is_approved)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
            review.is_approved ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              review.is_approved ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          {/* View */}
          <button
            onClick={() => onView(review.id)}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="View Review"
          >
            <EyeIcon className="h-4 w-4" />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(review)}
            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            title="Edit Review"
          >
            <PencilIcon className="h-4 w-4" />
          </button>

          {/* Drag Handle */}
          <button
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-move"
            title="Change Review Order"
          >
            <Bars3Icon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveOrderLoading, setSaveOrderLoading] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, approved, pending
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [viewReviewData, setViewReviewData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [filterStatus]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus === 'approved') {
        params.is_approved = true;
      } else if (filterStatus === 'pending') {
        params.is_approved = false;
      }
      
      const response = await reviewApi.getReviews(params);
      if (response.success) {
        setReviews(response.data || []);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (reviewId, newStatus) => {
    try {
      const response = await reviewApi.toggleApprovalStatus(reviewId, newStatus);
      if (response.success) {
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId ? { ...review, is_approved: newStatus } : review
          )
        );
      }
    } catch (error) {
      console.error('Error toggling approval status:', error);
    }
  };

  const moveReview = (dragIndex, hoverIndex) => {
    const draggedReview = reviews[dragIndex];
    const updatedReviews = [...reviews];

    updatedReviews.splice(dragIndex, 1);
    updatedReviews.splice(hoverIndex, 0, draggedReview);

    const reorderedReviews = updatedReviews.map((review, index) => ({
      ...review,
      display_order: index + 1,
    }));

    setReviews(reorderedReviews);
    setHasOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    try {
      setSaveOrderLoading(true);
      const reviewOrders = reviews.map((review, index) => ({
        id: review.id,
        display_order: index + 1,
      }));

      const response = await reviewApi.reorderReviews(reviewOrders);
      if (response.success) {
        setHasOrderChanged(false);
      }
    } catch (error) {
      loadReviews();
      setHasOrderChanged(false);
    } finally {
      setSaveOrderLoading(false);
    }
  };

  const handleView = async (reviewId) => {
    try {
      const response = await reviewApi.viewReview(reviewId);
      if (response.success) {
        setViewReviewData(response.data);
        setIsViewModalOpen(true);
      }
    } catch (error) {
      console.error('Error viewing review:', error);
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setIsFormModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedReview(null);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      let response;
      
      if (selectedReview) {
        response = await reviewApi.updateReview(selectedReview.id, formData);
      } else {
        response = await reviewApi.createReview(formData);
      }

      if (response.success) {
        setIsFormModalOpen(false);
        setSelectedReview(null);
        loadReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedReview(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewReviewData(null);
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
            Review Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage student reviews and testimonials
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input text-sm"
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Approval</option>
          </select>

          {/* Save Order Button (visible only when approved filter is active) */}
          {filterStatus === 'approved' && hasOrderChanged && (
            <button
              onClick={handleSaveOrder}
              disabled={saveOrderLoading}
              className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg disabled:opacity-50"
            >
              {saveOrderLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Save Order
                </>
              )}
            </button>
          )}

          {/* Create Review Button */}
          <button
            onClick={handleCreateNew}
            className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Review
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            {filterStatus === 'approved' && 'Approved Reviews'}
            {filterStatus === 'pending' && 'Pending Reviews'}
            {filterStatus === 'all' && `All Reviews (${reviews.length})`}
          </h3>
        </div>

        {reviews.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filterStatus === 'approved' && 'No approved reviews found'}
              {filterStatus === 'pending' && 'No pending reviews found'}
              {filterStatus === 'all' && 'No reviews found'}
            </p>
            <button
              onClick={handleCreateNew}
              className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Review
            </button>
          </div>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Display Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Approve
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
                  {reviews.map((review, index) => (
                    <DraggableRow
                      key={review.id}
                      review={review}
                      index={index}
                      moveReview={moveReview}
                      onToggleApproval={handleToggleApproval}
                      onView={handleView}
                      onEdit={handleEdit}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </DndProvider>
        )}
      </div>

      {/* Modals */}
      <ReviewFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        review={selectedReview}
        isLoading={formLoading}
      />

      <ViewReviewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        review={viewReviewData}
      />
    </AdminLayout>
  );
}

export default Reviews;
