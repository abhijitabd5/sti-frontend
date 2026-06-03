import React, { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import { format, parse } from 'date-fns';

const PAYMENT_METHOD_LABELS = {
  cash: 'Cash',
  cheque: 'Cheque',
  upi: 'UPI',
  bank_transfer: 'Bank Transfer',
  card: 'Card',
  net_banking: 'Net Banking',
  payment_gateway: 'Payment Gateway'
};

const PAYMENT_TYPE_LABELS = {
  course_fee: 'Course Fee',
  accommodation_fee: 'Accommodation Fee',
  penalty: 'Penalty',
  miscellaneous: 'Miscellaneous'
};

function PaymentHistory({ 
  paymentData, 
  onAddPayment, 
  onEditPayment, 
  onDeletePayment,
  loading = false 
}) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment? This will update the enrollment totals.')) {
      setDeletingId(paymentId);
      try {
        await onDeletePayment(paymentId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (!paymentData) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CurrencyDollarIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Payment History</h3>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
        </div>
      </div>
    );
  }

  const { enrollment, payments = [], summary = {} } = paymentData;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CurrencyDollarIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Payment History</h3>
          </div>
          <button
            onClick={onAddPayment}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Payment
          </button>
        </div>
      </div>

      {/* Enrollment Summary */}
      {enrollment && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Fee</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ₹{parseFloat(enrollment.total_payable_fee).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Paid</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                ₹{parseFloat(enrollment.paid_amount).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Due Amount</p>
              <p className={`text-lg font-semibold ${
                parseFloat(enrollment.due_amount) > 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-600 dark:text-green-400'
              }`}>
                ₹{parseFloat(enrollment.due_amount).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Payment Count</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {summary.payment_count || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment List */}
      <div className="p-6">
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No payments yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding a payment record.
            </p>
            <div className="mt-6">
              <button
                onClick={onAddPayment}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add First Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                        {PAYMENT_TYPE_LABELS[payment.type] || payment.type}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(payment.payment_date), 'dd MMM yyyy')}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        ₹{parseFloat(payment.amount).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        via {PAYMENT_METHOD_LABELS[payment.payment_method] || payment.payment_method}
                      </span>
                    </div>

                    {payment.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {payment.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Previous Due: ₹{parseFloat(payment.previous_due_amount).toLocaleString()}</span>
                      <span>→</span>
                      <span>Remaining Due: ₹{parseFloat(payment.remaining_due_amount).toLocaleString()}</span>
                    </div>

                    <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      Recorded on {format(new Date(payment.created_at), 'dd MMM yyyy, hh:mm a')}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onEditPayment(payment)}
                      disabled={loading || deletingId === payment.id}
                      className="p-2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 disabled:opacity-50"
                      title="Edit payment"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id)}
                      disabled={loading || deletingId === payment.id}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                      title="Delete payment"
                    >
                      {deletingId === payment.id ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <TrashIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {summary.payment_count > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                First Payment: {summary.first_payment_date ? format(new Date(summary.first_payment_date), 'dd MMM yyyy') : 'N/A'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Last Payment: {summary.last_payment_date ? format(new Date(summary.last_payment_date), 'dd MMM yyyy') : 'N/A'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentHistory;
