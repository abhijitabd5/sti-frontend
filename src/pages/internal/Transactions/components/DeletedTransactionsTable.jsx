import React, { useState } from 'react';
import { 
  EyeIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const DeletedTransactionsTable = ({
  transactions,
  loading,
  pagination,
  onPageChange,
  onView,
  onRestore
}) => {
  const [viewModalState, setViewModalState] = useState({
    isOpen: false,
    transaction: null
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
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

  // Get payment mode color
  const getPaymentModeColor = (mode) => {
    const normalizedMode = mode?.toLowerCase();
    const colors = {
      'cash': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'upi': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'net_banking': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'cheque': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'bank_transfer': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'card': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
      'payment_gateway': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
    };
    return colors[normalizedMode] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };
  
  // Format payment mode display
  const formatPaymentMode = (mode) => {
    const modeMap = {
      'cash': 'Cash',
      'upi': 'UPI',
      'net_banking': 'Net Banking',
      'cheque': 'Cheque',
      'bank_transfer': 'Bank Transfer',
      'card': 'Card',
      'payment_gateway': 'Payment Gateway'
    };
    return modeMap[mode?.toLowerCase()] || mode;
  };

  const getPersonName = (transaction) => {
    return transaction.type === 'income' ? transaction.payer_name : transaction.payee_name;
  };

  const getPersonContact = (transaction) => {
    return transaction.type === 'income' ? transaction.payer_contact : transaction.payee_contact;
  };

  const handleViewClick = async (transaction) => {
    const transactionData = await onView(transaction.id);
    if (transactionData) {
      setViewModalState({ isOpen: true, transaction: transactionData });
    }
  };

  const closeViewModal = () => {
    setViewModalState({ isOpen: false, transaction: null });
  };

  const handleRestore = (transactionId) => {
    // Placeholder for restore functionality
    alert('Restore functionality will be implemented soon');
    // onRestore(transactionId);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            Deleted Transactions ({pagination.total})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No deleted transactions found
            </p>
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
                      Payer Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Deleted By
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
                        {transaction.category?.name || 'Unknown Category'}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        <span className={transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentModeColor(transaction.payment_mode)}`}>
                          {formatPaymentMode(transaction.payment_mode)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                        {getPersonName(transaction)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {getPersonContact(transaction)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {transaction.deleted_by ? `${transaction.deleted_by.first_name} ${transaction.deleted_by.last_name}` : 'System'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {/* View */}
                          <button
                            onClick={() => handleViewClick(transaction)}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="View Transaction"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          
                          {/* Restore */}
                          <button
                            onClick={() => handleRestore(transaction.id)}
                            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            title="Restore Transaction"
                          >
                            <ArrowPathIcon className="h-4 w-4" />
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

      {/* View Transaction Modal */}
      {viewModalState.isOpen && viewModalState.transaction && (
        <ViewTransactionModal
          transaction={viewModalState.transaction}
          onClose={closeViewModal}
        />
      )}
    </>
  );
};

// View Transaction Modal Component
const ViewTransactionModal = ({ transaction, onClose }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentModeColor = (mode) => {
    const normalizedMode = mode?.toLowerCase();
    const colors = {
      'cash': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'upi': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'net_banking': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'cheque': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'bank_transfer': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'card': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
      'payment_gateway': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
    };
    return colors[normalizedMode] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const formatPaymentMode = (mode) => {
    const modeMap = {
      'cash': 'Cash',
      'upi': 'UPI',
      'net_banking': 'Net Banking',
      'cheque': 'Cheque',
      'bank_transfer': 'Bank Transfer',
      'card': 'Card',
      'payment_gateway': 'Payment Gateway'
    };
    return modeMap[mode?.toLowerCase()] || mode;
  };

  const getPersonName = (transaction) => {
    return transaction.type === 'income' ? transaction.payer_name : transaction.payee_name;
  };

  const getPersonContact = (transaction) => {
    return transaction.type === 'income' ? transaction.payer_contact : transaction.payee_contact;
  };

  const getPersonLabel = (transaction) => {
    return transaction.type === 'income' ? 'Payer' : 'Receiver';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700/60">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
              Transaction Details (Deleted)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Transaction ID: #{transaction.id}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Transaction Information</h4>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Transaction Date</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {formatDate(transaction.transaction_date)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                  <p className={`text-lg font-semibold ${
                    transaction.type === 'income' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {transaction.category?.name || 'Unknown Category'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Payment Mode</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentModeColor(transaction.payment_mode)}`}>
                    {formatPaymentMode(transaction.payment_mode)}
                  </span>
                </div>

                {transaction.payment_ref_num && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payment Reference</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {transaction.payment_ref_num}
                    </p>
                  </div>
                )}
              </div>

              {/* Person Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{getPersonLabel(transaction)} Details</h4>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {getPersonName(transaction)}
                  </p>
                </div>

                {getPersonContact(transaction) && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {getPersonContact(transaction)}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created By</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {transaction.creator ? `${transaction.creator.first_name} ${transaction.creator.last_name}` : 'System'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Deleted By</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {transaction.deleted_by ? `${transaction.deleted_by.first_name} ${transaction.deleted_by.last_name}` : 'System'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Deleted At</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {transaction.deletedAt ? formatDateTime(transaction.deletedAt) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {transaction.description && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {transaction.description}
                </p>
              </div>
            )}

            {/* Reference Note */}
            {transaction.reference_note && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Reference Note</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {transaction.reference_note}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700/60 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletedTransactionsTable;
