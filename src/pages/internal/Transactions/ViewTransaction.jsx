import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import transactionApi from '@/services/api/transactionApi';

// Icons
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PaperClipIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  PhoneIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const ViewTransaction = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State management
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load transaction on component mount
  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    try {
      setLoading(true);
      const response = await transactionApi.getTransactionById(id);
      if (response.success) {
        setTransaction(response.data);
      } else {
        // Transaction not found, redirect to transactions page
        navigate('/admin/transactions');
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
      navigate('/admin/transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/transactions/edit/${id}?type=${transaction.type}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const response = await transactionApi.deleteTransaction(id);
        if (response.success) {
          navigate('/admin/transactions?tab=' + transaction.type);
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleBack = () => {
    navigate('/admin/transactions?tab=' + (transaction?.type || 'income'));
  };

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
      month: 'long',
      day: 'numeric'
    });
  };

  // Format datetime
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getPersonName = (transaction) => {
    return transaction.type === 'income' ? transaction.payer_name : transaction.payee_name;
  };

  const getPersonContact = (transaction) => {
    return transaction.type === 'income' ? transaction.payer_contact : transaction.payee_contact;
  };

  const getBankName = (transaction) => {
    return transaction.type === 'income' ? transaction.payer_bank_name : transaction.payee_bank_name;
  };

  const getAccountNumber = (transaction) => {
    return transaction.type === 'income' ? transaction.payer_account_number : transaction.payee_account_number;
  };

  const getUpiId = (transaction) => {
    return transaction.type === 'income' ? transaction.payer_upi_id : transaction.payee_upi_id;
  };

  const getPersonLabel = (transaction) => {
    return transaction.type === 'income' ? 'Payer' : 'Receiver';
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

  if (!transaction) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Transaction not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                {transaction.type === 'income' ? 'Income' : 'Expense'} Transaction Details
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Transaction ID: #{transaction.id}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn bg-red-600 text-white hover:bg-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Information */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
              Transaction Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Date</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                    <p className={`text-lg font-semibold ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {transaction.category?.name || 'Unknown Category'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Mode</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentModeColor(transaction.payment_mode)}`}>
                      {transaction.payment_mode}
                    </span>
                  </div>
                </div>

                {transaction.payment_ref_num && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Reference</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {transaction.payment_ref_num}
                      {transaction.payment_ref_type && (
                        <span className="ml-2 text-xs text-gray-500">({transaction.payment_ref_type})</span>
                      )}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created By</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {transaction.creator ? `${transaction.creator.first_name} ${transaction.creator.last_name}` : 'System'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Person Details */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
              {getPersonLabel(transaction)} Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {getPersonName(transaction)}
                    </p>
                  </div>
                </div>

                {getPersonContact(transaction) && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {getPersonContact(transaction)}
                      </p>
                    </div>
                  </div>
                )}

                {getBankName(transaction) && (
                  <div className="flex items-center">
                    <BuildingLibraryIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Bank Name</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {getBankName(transaction)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {getAccountNumber(transaction) && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Account Number</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {getAccountNumber(transaction)}
                    </p>
                  </div>
                )}

                {getUpiId(transaction) && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">UPI ID</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {getUpiId(transaction)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description and Reference Note */}
          {(transaction.description || transaction.reference_note) && (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
                Notes
              </h3>
              
              {transaction.description && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {transaction.description}
                  </p>
                </div>
              )}
              
              {transaction.reference_note && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reference Note</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {transaction.reference_note}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
              Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Type</span>
                <span className={`text-sm font-medium ${
                  transaction.type === 'income' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? 'Income' : 'Expense'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                <span className={`text-sm font-semibold ${
                  transaction.type === 'income' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Date</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {formatDate(transaction.transaction_date)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Payment Mode</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentModeColor(transaction.payment_mode)}`}>
                  {transaction.payment_mode}
                </span>
              </div>
            </div>
          </div>

          {/* Attachment */}
          {transaction.attachment_path && (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
                Attachment
              </h3>
              
              <div className="flex items-center space-x-3">
                <PaperClipIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {transaction.attachment_path.split('/').pop()}
                  </p>
                  <button className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
              Timestamps
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {formatDateTime(transaction.createdAt)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {formatDateTime(transaction.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewTransaction;
