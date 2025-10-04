import React, { useState } from 'react';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';

const TransactionTable = ({
  transactions,
  loading,
  pagination,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  transactionType,
  onAddTransaction
}) => {
  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    transaction: null,
    loading: false
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Truncate text with read more
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return (
      <span title={text}>
        {text.substring(0, maxLength)}
        <span className="text-violet-600 dark:text-violet-400 cursor-help">... read more</span>
      </span>
    );
  };

  // Get payment mode color
  const getPaymentModeColor = (mode) => {
    const colors = {
      'Cash': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'UPI': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Online': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Cheque': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'Bank': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return colors[mode] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  // Delete handlers
  const openDeleteConfirmation = (transaction) => {
    setDeleteState({ isOpen: true, transaction, loading: false });
  };

  const closeDeleteConfirmation = () => {
    setDeleteState({ isOpen: false, transaction: null, loading: false });
  };

  const handleDelete = async () => {
    try {
      setDeleteState(prev => ({ ...prev, loading: true }));
      await onDelete(deleteState.transaction.id);
      closeDeleteConfirmation();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    } finally {
      setDeleteState(prev => ({ ...prev, loading: false }));
    }
  };

  const getPersonName = (transaction) => {
    return transaction.type === 'income' ? transaction.payer_name : transaction.receiver_name;
  };

  const getPersonContact = (transaction) => {
    return transaction.type === 'income' ? transaction.payer_contact : transaction.receiver_contact;
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            {transactionType === 'income' ? 'Income' : 'Expense'} Transactions ({pagination.total})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No {transactionType} transactions found
            </p>
            <button
              onClick={onAddTransaction}
              className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Your First {transactionType === 'income' ? 'Income' : 'Expense'}
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Payment Mode
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {transactionType === 'income' ? 'Payer' : 'Receiver'} Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Payment Ref
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reference Note
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                        {formatDate(transaction.transaction_date)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">
                        {transaction.category_name}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        <span className={transactionType === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentModeColor(transaction.payment_mode)}`}>
                          {transaction.payment_mode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                        {getPersonName(transaction)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {getPersonContact(transaction)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {transaction.payment_ref_number}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                        <div className="flex items-center">
                          {truncateText(transaction.description, 40)}
                          {transaction.attachment_path && (
                            <PaperClipIcon className="h-4 w-4 ml-2 text-gray-400" title="Has attachment" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {transaction.created_by || 'System'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {/* View */}
                          <button
                            onClick={() => onView(transaction.id)}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="View Transaction"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          
                          {/* Edit */}
                          <button
                            onClick={() => onEdit(transaction.id)}
                            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            title="Edit Transaction"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          
                          {/* Delete */}
                          <button
                            onClick={() => openDeleteConfirmation(transaction)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete Transaction"
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
                    onClick={() => onPageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                  
                  <button
                    onClick={() => onPageChange(pagination.current_page + 1)}
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
                Delete {transactionType === 'income' ? 'Income' : 'Expense'} Transaction
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                Are you sure you want to delete this {transactionType} transaction of {formatCurrency(deleteState.transaction?.amount)}? This action cannot be undone.
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
                    'Delete Transaction'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionTable;
