import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentApi from '@/services/api/studentApi';

// Icons
import { 
  XMarkIcon,
  IdentificationIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

function AadhaarCheckModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [aadharNumber, setAadharNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateAadhar = (number) => {
    // Remove spaces and hyphens
    const cleanNumber = number.replace(/[\s-]/g, '');
    return /^\d{12}$/.test(cleanNumber);
  };

  const formatAadhar = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 12 digits
    const limited = digits.substring(0, 12);
    // Add spaces every 4 digits
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleInputChange = (e) => {
    const formatted = formatAadhar(e.target.value);
    setAadharNumber(formatted);
    setError('');
  };

  const handleCheck = async () => {
    if (!validateAadhar(aadharNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanAadhar = aadharNumber.replace(/\s/g, '');
      const response = await studentApi.checkAadhaar(cleanAadhar);

      if (response.success) {
        // Close modal first
        onClose();
        
        if (response.data.exists) {
          // Existing student - navigate to enrollment form with prefilled data
          navigate('/admin/students/enroll', {
            state: {
              isExisting: true,
              studentData: response.data.student,
              aadharNumber: cleanAadhar
            }
          });
        } else {
          // New student - navigate to enrollment form
          navigate('/admin/students/enroll', {
            state: {
              isExisting: false,
              aadharNumber: cleanAadhar
            }
          });
        }
      }
    } catch (error) {
      console.error('Error checking Aadhaar:', error);
      setError('Failed to check Aadhaar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAadharNumber('');
    setError('');
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={handleClose}
        ></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              onClick={handleClose}
              disabled={loading}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900 sm:mx-0 sm:h-10 sm:w-10">
              <IdentificationIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                Check Aadhaar Number
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter the student's Aadhaar number to check if they are already registered in the system.
                </p>
              </div>
              
              <div className="mt-6">
                <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Aadhaar Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="aadhar"
                    value={aadharNumber}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50"
                    placeholder="1234 5678 9012"
                    maxLength="14" // 12 digits + 2 spaces
                  />
                  <IdentificationIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
                
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <p>• If Aadhaar exists, you'll be taken to the enrollment form with pre-filled details</p>
                  <p>• If Aadhaar is new, you'll create a new student profile</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleCheck}
              disabled={loading || !aadharNumber.trim()}
              className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-base font-medium text-white hover:from-violet-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Checking...
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Check Aadhaar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AadhaarCheckModal;
