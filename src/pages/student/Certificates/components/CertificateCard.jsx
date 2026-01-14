import React from 'react';
import { format } from 'date-fns';

const CertificateCard = ({ certificate, onView, onDownload }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'issued':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600 dark:text-green-400';
    if (grade >= 80) return 'text-blue-600 dark:text-blue-400';
    if (grade >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      {/* Certificate Preview */}
      <div className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4">
        {/* Decorative elements */}
        <div className="absolute top-2 left-2 w-8 h-8 border-2 border-amber-400 rounded-full opacity-20"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-2 border-orange-400 rounded-full opacity-20"></div>
        
        {/* Mini certificate preview */}
        <div className="h-full border-2 border-amber-600/30 rounded-lg flex flex-col items-center justify-center text-center p-3">
          <div className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
            EARTH MOVERS TRAINING ACADEMY
          </div>
          <div className="text-lg font-serif italic text-gray-700 dark:text-gray-300 mb-2">
            Certificate
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            of Completion
          </div>
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate w-full">
            {certificate.courseName}
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(certificate.status)}`}>
            {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Certificate Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
              {certificate.courseName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Certificate No: {certificate.certificateNumber}
            </p>
          </div>
        </div>

        {/* Course Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Duration:</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {certificate.courseDuration}
            </span>
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Grade:</span>
            <span className={`font-bold ${getGradeColor(certificate.grade)}`}>
              {certificate.gradeText} ({certificate.grade}%)
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Issued:</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {certificate.issuedDate ? format(new Date(certificate.issuedDate), 'MMM dd, yyyy') : 'Pending'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={onView}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>View</span>
          </button>
          
          {certificate.status === 'issued' && (
            <button
              onClick={onDownload}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;