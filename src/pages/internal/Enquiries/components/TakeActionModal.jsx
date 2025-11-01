import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const TakeActionModal = ({ isOpen, onClose, enquiry, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    action_type: '',
    remark: ''
  });

  const [errors, setErrors] = useState({});

  const actionTypes = [
    { value: 'no_action', label: 'No Action' },
    { value: 'call', label: 'Call' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'email', label: 'Email' },
    { value: 'text_message', label: 'Text Message' },
    { value: 'visit', label: 'Visit' },
    { value: 'discard', label: 'Discard' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.action_type) {
      newErrors.action_type = 'Please select an action type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      action_type: formData.action_type,
      remark: formData.remark || null
    });

    // Reset form
    setFormData({
      action_type: '',
      remark: ''
    });
    setErrors({});
  };

  if (!isOpen || !enquiry) return null;

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
              disabled={loading}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
                Take Action on Enquiry
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span className="font-medium">Enquiry from:</span> {enquiry.name}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Action Type Dropdown */}
                <div>
                  <label htmlFor="action_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Action Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="action_type"
                    name="action_type"
                    value={formData.action_type}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 ${
                      errors.action_type ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select an action type</option>
                    {actionTypes.map(action => (
                      <option key={action.value} value={action.value}>
                        {action.label}
                      </option>
                    ))}
                  </select>
                  {errors.action_type && (
                    <p className="mt-1 text-sm text-red-500">{errors.action_type}</p>
                  )}
                </div>

                {/* Remark Field */}
                <div>
                  <label htmlFor="remark" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Remarks <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <textarea
                    id="remark"
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    disabled={loading}
                    rows="4"
                    placeholder="Add any remarks about this enquiry..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-base font-medium text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit Action'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeActionModal;
