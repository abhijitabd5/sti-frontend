import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DatePicker } from '@/components/ui/Internal/DatePicker';
import { format, parse } from 'date-fns';

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Card' },
  { value: 'net_banking', label: 'Net Banking' },
  { value: 'payment_gateway', label: 'Payment Gateway' }
];

const PAYMENT_TYPES = [
  { value: 'course_fee', label: 'Course Fee' },
  { value: 'accommodation_fee', label: 'Accommodation Fee' },
  { value: 'penalty', label: 'Penalty' },
  { value: 'miscellaneous', label: 'Miscellaneous' }
];

function PaymentModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  payment = null, 
  enrollmentInfo = null,
  loading = false 
}) {
  const isEditMode = !!payment;
  
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: 'cash',
    payment_date: new Date().toISOString().split('T')[0],
    type: 'course_fee',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (payment) {
      setFormData({
        amount: payment.amount || '',
        payment_method: payment.payment_method || 'cash',
        payment_date: payment.payment_date || new Date().toISOString().split('T')[0],
        type: payment.type || 'course_fee',
        description: payment.description || ''
      });
    } else {
      setFormData({
        amount: '',
        payment_method: 'cash',
        payment_date: new Date().toISOString().split('T')[0],
        type: 'course_fee',
        description: ''
      });
    }
    setErrors({});
  }, [payment, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (enrollmentInfo && parseFloat(formData.amount) > parseFloat(enrollmentInfo.due_amount)) {
      newErrors.amount = `Amount cannot exceed due amount of ₹${parseFloat(enrollmentInfo.due_amount).toLocaleString()}`;
    }

    if (!formData.payment_method) {
      newErrors.payment_method = 'Payment method is required';
    }

    if (!formData.payment_date) {
      newErrors.payment_date = 'Payment date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

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
        <div className="relative z-[10000] inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {isEditMode ? 'Edit Payment' : 'Add Payment'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Enrollment Info */}
          {enrollmentInfo && (
            <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
              <div className="text-sm space-y-1">
                <p className="text-blue-900 dark:text-blue-100">
                  <span className="font-medium">Student:</span> {enrollmentInfo.student_name} ({enrollmentInfo.student_code})
                </p>
                <p className="text-blue-900 dark:text-blue-100">
                  <span className="font-medium">Course:</span> {enrollmentInfo.course_title}
                </p>
                <div className="flex space-x-4 text-blue-700 dark:text-blue-300">
                  <span>Total: ₹{parseFloat(enrollmentInfo.total_payable_fee).toLocaleString()}</span>
                  <span>Paid: ₹{parseFloat(enrollmentInfo.paid_amount).toLocaleString()}</span>
                  <span className="font-medium">Due: ₹{parseFloat(enrollmentInfo.due_amount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter payment amount"
                  className={`block w-full px-3 py-2 border ${
                    errors.amount 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.amount}
                  </p>
                )}
                {enrollmentInfo && !errors.amount && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Maximum: ₹{parseFloat(enrollmentInfo.due_amount).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.payment_method 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-gray-700`}
                >
                  {PAYMENT_METHODS.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
                {errors.payment_method && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.payment_method}
                  </p>
                )}
              </div>

              {/* Payment Date */}
              <div>
                <DatePicker
                  label={<>Payment Date <span className="text-red-500">*</span></>}
                  value={formData.payment_date ? format(parse(formData.payment_date, 'yyyy-MM-dd', new Date()), 'dd-MM-yyyy') : ''}
                  onChange={(date) => {
                    const convertedDate = date ? format(parse(date, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd') : '';
                    handleInputChange({ target: { name: 'payment_date', value: convertedDate } });
                  }}
                  error={errors.payment_date}
                />
              </div>

              {/* Payment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-gray-700"
                >
                  {PAYMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Add any notes about this payment"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  isEditMode ? 'Update Payment' : 'Add Payment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
