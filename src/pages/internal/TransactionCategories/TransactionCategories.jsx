import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import CategoryModal from './CategoryModal';
import Toast from '@/components/ui/Internal/Toast/Toast';
import useToast from '@/hooks/useToast';
import TransactionCategoryApi from '@/services/api/transactionCategoryApi';

// Icons
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const TransactionCategories = () => {
  // Toast notifications
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();
  
  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });

  // Modal states
  const [modalState, setModalState] = useState({
    isOpen: false,
    category: null,
    loading: false
  });

  // Delete confirmation state
  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    category: null,
    loading: false
  });

  // Load categories
  useEffect(() => {
    loadCategories();
  }, [searchTerm, typeFilter, pagination.current_page]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        type: typeFilter,
        page: pagination.current_page,
        limit: pagination.per_page
      };

      const response = await TransactionCategoryApi.getTransactionCategories(params);
      if (response.success) {
        setCategories(response.data);
        setPagination(response.pagination);
      } else {
        showError(response.message || 'Failed to load transaction categories');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      showError('An error occurred while loading transaction categories');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  // Handle filter
  const handleFilterChange = (value) => {
    setTypeFilter(value);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  // Modal handlers
  const openCreateModal = () => {
    console.log('Create Modal Function Triggered');
    setModalState({ isOpen: true, category: null, loading: false });
  };
  
  const openEditModal = (category) => {
    console.log('Edit Modal Function Triggered');
    setModalState({ isOpen: true, category, loading: false });
  };
  
  const closeModal = () => {
    console.log('Close Modal Function Triggered');
    setModalState({ isOpen: false, category: null, loading: false });
  };

  const handleSave = async (categoryData) => {
    try {
      setModalState(prev => ({ ...prev, loading: true }));

      let response;
      if (modalState.category) {
        // Update existing category
        response = await TransactionCategoryApi.updateTransactionCategory(modalState.category.id, categoryData);
      } else {
        // Create new category
        response = await TransactionCategoryApi.createTransactionCategory(categoryData);
      }

      if (response.success) {
        closeModal();
        loadCategories();
        showSuccess(modalState.category ? 
          'Transaction category updated successfully' : 
          'Transaction category created successfully'
        );
      } else {
        showError(response.message || 'Failed to save transaction category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      showError('An error occurred while saving the transaction category');
    } finally {
      setModalState(prev => ({ ...prev, loading: false }));
    }
  };

  // Delete handlers
  const openDeleteConfirmation = (category) => {
    setDeleteState({ isOpen: true, category, loading: false });
  };

  const closeDeleteConfirmation = () => {
    setDeleteState({ isOpen: false, category: null, loading: false });
  };

  const handleDelete = async () => {
    try {
      setDeleteState(prev => ({ ...prev, loading: true }));
      
      const response = await TransactionCategoryApi.deleteTransactionCategory(deleteState.category.id);
      if (response.success) {
        closeDeleteConfirmation();
        loadCategories();
        showSuccess('Transaction category deleted successfully');
      } else {
        showError(response.message || 'Failed to delete transaction category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showError('An error occurred while deleting the transaction category');
    } finally {
      setDeleteState(prev => ({ ...prev, loading: false }));
    }
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type) => {
    return type === 'income' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  const getTypeLabel = (type) => {
    return type === 'income' ? 'Income' : 'Expense';
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Transaction Categories
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage income and expense categories for transactions
          </p>
        </div>

        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <button
            onClick={openCreateModal}
            className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Category
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 mb-6">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or slug..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="sm:w-48">
              <select
                value={typeFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            Categories ({pagination.total})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || typeFilter !== 'all' ? 'No categories match your filters' : 'No categories found'}
            </p>
            <button
              onClick={openCreateModal}
              className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Category
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
                  {categories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                        {(pagination.current_page - 1) * pagination.per_page + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">
                        {category.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(category.type)}`}>
                          {getTypeLabel(category.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(category.createdAt || category.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(category)}
                            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            title="Edit Category"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => openDeleteConfirmation(category)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete Category"
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

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {pagination.from} to {pagination.to} of {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSave={handleSave}
        category={modalState.category}
        loading={modalState.loading}
      />

      {/* Delete Confirmation Modal */}
      {deleteState.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
              onClick={closeDeleteConfirmation}
            />

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 text-center mb-2">
                Delete Category
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                Are you sure you want to delete "{deleteState.category?.name}"? This action cannot be undone.
              </p>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={closeDeleteConfirmation}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  disabled={deleteState.loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={deleteState.loading}
                >
                  {deleteState.loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete Category'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </AdminLayout>
  );
};

export default TransactionCategories;
