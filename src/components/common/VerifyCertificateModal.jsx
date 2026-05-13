import React, { useState } from 'react';
import { publicCertificateApi } from '@/services/api/publicCertificateApi';

const VerifyCertificateModal = ({ isOpen, onClose }) => {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [certificateData, setCertificateData] = useState(null);

  // Calculate max date (18 years ago from today)
  const getMaxDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  };

  // Convert YYYY-MM-DD to DD-MM-YYYY format for backend
  const formatDateForBackend = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!certificateNumber.trim()) {
      setError('Please enter a certificate number');
      return;
    }

    if (!mobileNumber.trim() && !dateOfBirth) {
      setError('Please provide either mobile number or date of birth');
      return;
    }

    // Validate mobile number format (10 digits)
    if (mobileNumber.trim() && !/^\d{10}$/.test(mobileNumber.trim())) {
      setError('Mobile number must be exactly 10 digits');
      return;
    }

    setLoading(true);
    setError(null);
    setCertificateData(null);

    try {
      const payload = {
        certificateNumber: certificateNumber.trim(),
        ...(mobileNumber.trim() && { mobileNumber: mobileNumber.trim() }),
        ...(dateOfBirth && { dateOfBirth: formatDateForBackend(dateOfBirth) }),
      };

      const data = await publicCertificateApi.verifyCertificate(payload);
      setCertificateData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Certificate not found or verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);

    try {
      const payload = {
        certificateNumber: certificateNumber.trim(),
        ...(mobileNumber.trim() && { mobileNumber: mobileNumber.trim() }),
        ...(dateOfBirth && { dateOfBirth: formatDateForBackend(dateOfBirth) }),
      };

      const blob = await publicCertificateApi.downloadCertificate(payload);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificateNumber.trim()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download certificate');
    } finally {
      setDownloading(false);
    }
  };

  const handleClose = () => {
    setCertificateNumber('');
    setMobileNumber('');
    setDateOfBirth('');
    setError(null);
    setCertificateData(null);
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Verify Certificate
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search Form */}
          <form onSubmit={handleVerify} className="mb-6 space-y-4">
            {/* Certificate Number - Required */}
            <div>
              <label htmlFor="certificateNumber" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Certificate Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="certificateNumber"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                placeholder="e.g., CERT-2501-STI202500001-5-AB3D"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                disabled={loading}
                required
              />
            </div>

            {/* Security Fields - At least one required */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
                Provide at least one of the following:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile Number */}
                <div>
                  <label htmlFor="mobileNumber" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => {
                      // Only allow digits and limit to 10 characters
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setMobileNumber(value);
                    }}
                    placeholder="e.g., 9876543210"
                    maxLength="10"
                    pattern="\d{10}"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    10 digits only
                  </p>
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    min="1900-01-01"
                    max={getMaxDate()}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be at least 18 years old
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verify Certificate
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Certificate Details */}
          {certificateData && (
            <div className="space-y-6">
              {/* Success Banner */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-green-900 dark:text-green-100">Certificate Verified</h3>
                  <p className="text-xs text-green-700 dark:text-green-300">This certificate is valid and authentic</p>
                </div>
              </div>

              {/* Student Details Card */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-orange-200 dark:border-gray-600">
                <div className="flex items-start gap-6">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    {certificateData.student?.profile_picture ? (
                      <img
                        src={certificateData.student.profile_picture}
                        alt={certificateData.student.name_on_id}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center border-4 border-white dark:border-gray-600 shadow-lg">
                        <span className="text-3xl font-bold text-white">
                          {certificateData.student?.name_on_id?.charAt(0) || 'S'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {certificateData.student?.name_on_id || certificateData.student?.user?.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Student Code: {certificateData.student?.student_code}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">{certificateData.student?.user?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-xs">{certificateData.student?.user?.mobile}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Certificate Number</p>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white break-all">
                    {certificateData.certificate_number}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Issue Date</p>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                    {formatDate(certificateData.issue_date)}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Course</p>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                    {certificateData.course?.title}
                  </p>
                  {certificateData.course?.duration && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Duration: {certificateData.course.duration} days
                    </p>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    certificateData.status === 'valid'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {certificateData.status === 'valid' ? 'Valid' : 'Invalid'}
                  </span>
                </div>
              </div>

              {/* Verification Stats */}
              {certificateData.verification_count > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      This certificate has been verified {certificateData.verification_count} time(s)
                    </span>
                    {certificateData.last_verified_at && (
                      <span className="text-gray-500 dark:text-gray-500">
                        Last verified: {formatDate(certificateData.last_verified_at)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          {certificateData && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Certificate
                </>
              )}
            </button>
          )}
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificateModal;
