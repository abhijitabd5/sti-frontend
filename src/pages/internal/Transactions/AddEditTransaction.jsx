import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import Toast from '@/components/ui/Internal/Toast/Toast';
import useToast from '@/hooks/useToast';
import internalApi from '@/services/api/internalApi';

// Icons
import { 
  ArrowLeftIcon,
  CalendarIcon,
  PaperClipIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AddEditTransaction = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = !!id;
  const transactionType = searchParams.get('type') || 'income';

  // Toast notifications
  const { toast, showSuccess, showError, hideToast } = useToast();

  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    transaction_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    payment_mode: '',
    payer_name: '',
    payer_contact: '',
    payer_bank_name: '',
    payer_account_number: '',
    payer_upi_id: '',
    receiver_name: '',
    receiver_contact: '',
    receiver_bank_name: '',
    receiver_account_number: '',
    receiver_upi_id: '',
    payment_ref_number: '',
    attachment_path: '',
    description: '',
    created_by: 'admin' // This would come from auth context in real app
  });
  const [errors, setErrors] = useState({});

  // Load data on component mount
  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadTransaction();
    }
  }, [id, isEdit]);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await internalApi.getTransactionCategories({ 
        type: transactionType,
        limit: 100 
      });
      if (response.success) {
        setCategories(response.data);
      } else {
        showError(response.message || 'Failed to load categories');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      showError('An error occurred while loading categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const loadTransaction = async () => {
    try {
      setLoading(true);
      const response = await internalApi.getTransactionById(id);
      if (response.success) {
        // Map API response to form data structure
        const transaction = response.data;
        setFormData({
          category_id: transaction.category_id,
          amount: transaction.amount,
          transaction_date: transaction.transaction_date?.split('T')[0] || transaction.transaction_date,
          payment_mode: transaction.payment_mode || '',
          payer_name: transaction.payer_name || '',
          payer_contact: transaction.payer_contact || '',
          payer_bank_name: transaction.payer_bank_name || '',
          payer_account_number: transaction.payer_account_number || '',
          payer_upi_id: transaction.payer_upi_id || '',
          receiver_name: transaction.receiver_name || '',
          receiver_contact: transaction.receiver_contact || '',
          receiver_bank_name: transaction.receiver_bank_name || '',
          receiver_account_number: transaction.receiver_account_number || '',
          receiver_upi_id: transaction.receiver_upi_id || '',
          payment_ref_number: transaction.payment_ref_number || '',
          attachment_path: transaction.attachment_path || '',
          description: transaction.description || '',
          created_by: transaction.created_by || 'admin'
        });
      } else {
        showError(response.message || 'Transaction not found');
        setTimeout(() => navigate('/admin/transactions'), 2000);
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
      showError('An error occurred while loading the transaction');
      setTimeout(() => navigate('/admin/transactions'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Category validation
    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    // Transaction date validation
    if (!formData.transaction_date) {
      newErrors.transaction_date = 'Transaction date is required';
    }

    // Payment mode validation
    if (!formData.payment_mode) {
      newErrors.payment_mode = 'Payment mode is required';
    }

    // Cheque number validation
    if (formData.payment_mode === 'Cheque' && !formData.payment_ref_number) {
      newErrors.payment_ref_number = 'Cheque number is required for cheque payments';
    }

    // Person name validation (based on transaction type)
    const nameField = transactionType === 'income' ? 'payer_name' : 'receiver_name';
    if (!formData[nameField]) {
      newErrors[nameField] = `${transactionType === 'income' ? 'Payer' : 'Receiver'} name is required`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      let response;
      if (isEdit) {
        response = await internalApi.updateTransaction(id, formData);
      } else {
        response = await internalApi.createTransaction(formData);
      }

      if (response.success) {
        showSuccess(isEdit ? 
          'Transaction updated successfully' : 
          'Transaction created successfully'
        );
        setTimeout(() => navigate('/admin/transactions?tab=' + transactionType), 1000);
      } else {
        showError(response.message || 'Failed to save transaction');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      showError('An error occurred while saving the transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/transactions?tab=' + transactionType);
  };

  const getDisplayName = () => {
    return transactionType === 'income' ? 'Income' : 'Expense';
  };

  const getPersonLabel = () => {
    return transactionType === 'income' ? 'Payer' : 'Receiver';
  };

  if (isEdit && loading) {
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={handleCancel}
            className="mr-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              {isEdit ? 'Edit' : 'Add'} {getDisplayName()} Transaction
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isEdit ? 'Update' : 'Create a new'} {transactionType} transaction record
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Transaction Details Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
              Transaction Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                    errors.category_id 
                      ? 'border-red-300 dark:border-red-500' 
                      : 'border-gray-200 dark:border-gray-700/60'
                  } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100`}
                  disabled={categoriesLoading}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.category_id}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                    errors.amount 
                      ? 'border-red-300 dark:border-red-500' 
                      : 'border-gray-200 dark:border-gray-700/60'
                  } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.amount}</p>
                )}
              </div>

              {/* Transaction Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Transaction Date *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.transaction_date}
                    onChange={(e) => handleInputChange('transaction_date', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                      errors.transaction_date 
                        ? 'border-red-300 dark:border-red-500' 
                        : 'border-gray-200 dark:border-gray-700/60'
                    } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100`}
                  />
                </div>
                {errors.transaction_date && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.transaction_date}</p>
                )}
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Mode *
                </label>
                <select
                  value={formData.payment_mode}
                  onChange={(e) => handleInputChange('payment_mode', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                    errors.payment_mode 
                      ? 'border-red-300 dark:border-red-500' 
                      : 'border-gray-200 dark:border-gray-700/60'
                  } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100`}
                >
                  <option value="">Select payment mode</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Online">Online</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
                {errors.payment_mode && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.payment_mode}</p>
                )}
              </div>

              {/* Payment Reference Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Reference Number {formData.payment_mode === 'Cheque' ? '*' : ''}
                </label>
                <input
                  type="text"
                  value={formData.payment_ref_number}
                  onChange={(e) => handleInputChange('payment_ref_number', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                    errors.payment_ref_number 
                      ? 'border-red-300 dark:border-red-500' 
                      : 'border-gray-200 dark:border-gray-700/60'
                  } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
                  placeholder="Enter reference number"
                />
                {errors.payment_ref_number && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.payment_ref_number}</p>
                )}
              </div>
            </div>
          </div>

          {/* Person Details Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
              {getPersonLabel()} Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Person Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {getPersonLabel()} Name *
                </label>
                <input
                  type="text"
                  value={transactionType === 'income' ? formData.payer_name : formData.receiver_name}
                  onChange={(e) => handleInputChange(
                    transactionType === 'income' ? 'payer_name' : 'receiver_name', 
                    e.target.value
                  )}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                    errors[transactionType === 'income' ? 'payer_name' : 'receiver_name'] 
                      ? 'border-red-300 dark:border-red-500' 
                      : 'border-gray-200 dark:border-gray-700/60'
                  } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
                  placeholder={`Enter ${getPersonLabel().toLowerCase()} name`}
                />
                {errors[transactionType === 'income' ? 'payer_name' : 'receiver_name'] && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors[transactionType === 'income' ? 'payer_name' : 'receiver_name']}
                  </p>
                )}
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  value={transactionType === 'income' ? formData.payer_contact : formData.receiver_contact}
                  onChange={(e) => handleInputChange(
                    transactionType === 'income' ? 'payer_contact' : 'receiver_contact', 
                    e.target.value
                  )}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Phone number or email"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={transactionType === 'income' ? formData.payer_bank_name : formData.receiver_bank_name}
                  onChange={(e) => handleInputChange(
                    transactionType === 'income' ? 'payer_bank_name' : 'receiver_bank_name', 
                    e.target.value
                  )}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Bank name"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={transactionType === 'income' ? formData.payer_account_number : formData.receiver_account_number}
                  onChange={(e) => handleInputChange(
                    transactionType === 'income' ? 'payer_account_number' : 'receiver_account_number', 
                    e.target.value
                  )}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Account number"
                />
              </div>

              {/* UPI ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={transactionType === 'income' ? formData.payer_upi_id : formData.receiver_upi_id}
                  onChange={(e) => handleInputChange(
                    transactionType === 'income' ? 'payer_upi_id' : 'receiver_upi_id', 
                    e.target.value
                  )}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="UPI ID"
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Attachment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Attachment
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      // In a real app, you'd upload the file and get the path
                      const file = e.target.files[0];
                      if (file) {
                        handleInputChange('attachment_path', `/uploads/transactions/${file.name}`);
                      }
                    }}
                    className="hidden"
                    id="attachment"
                  />
                  <label
                    htmlFor="attachment"
                    className="flex items-center px-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 transition-colors"
                  >
                    <PaperClipIcon className="h-4 w-4 mr-2" />
                    Choose File
                  </label>
                  {formData.attachment_path && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span className="truncate max-w-xs">{formData.attachment_path.split('/').pop()}</span>
                      <button
                        type="button"
                        onClick={() => handleInputChange('attachment_path', '')}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description / Note
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter any additional notes or description"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700/60">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEdit ? 'Update Transaction' : 'Create Transaction'
              )}
            </button>
          </div>
        </form>
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
};

export default AddEditTransaction;
