import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { studentApi } from '@/services/api/studentApi';
import CertificateCard from './components/CertificateCard';
import CertificateViewer from './components/CertificateViewer';
import CertificateDownloader from './components/CertificateDownloader';
import LoadingSpinner from '@/components/ui/Internal/LoadingSpinner';
import EmptyState from '@/components/ui/Internal/EmptyState';

const StudentCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'view', 'download'

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getCertificates();
      setCertificates(response.data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setViewMode('view');
  };

  const handleDownloadCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setViewMode('download');
  };

  const handleBackToList = () => {
    setSelectedCertificate(null);
    setViewMode('list');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (viewMode === 'view' && selectedCertificate) {
    return (
      <CertificateViewer
        certificate={selectedCertificate}
        student={user}
        onBack={handleBackToList}
        onDownload={() => setViewMode('download')}
      />
    );
  }

  if (viewMode === 'download' && selectedCertificate) {
    return (
      <CertificateDownloader
        certificate={selectedCertificate}
        student={user}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Certificates
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and download your course completion certificates
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{certificates.length} Certificate{certificates.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <EmptyState
          icon="AcademicCapIcon"
          title="No Certificates Yet"
          description="Complete your enrolled courses to earn certificates"
          actionText="View Courses"
          actionLink="/student/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              onView={() => handleViewCertificate(certificate)}
              onDownload={() => handleDownloadCertificate(certificate)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;