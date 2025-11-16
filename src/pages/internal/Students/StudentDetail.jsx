import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import studentApi from '@/services/api/studentApi';
import { getStateDisplayName } from '@/config/constants';

// Icons
import { 
  UserIcon,
  IdentificationIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

function StudentDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    loadStudentDetails();
  }, [studentId]);

  const loadStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getStudentById(studentId);
      
      if (response.success) {
        setStudent(response.data);
        // Load payment history for the first enrollment if exists
        if (response.data.enrollments && response.data.enrollments.length > 0) {
          loadPaymentHistory(studentId, response.data.enrollments[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentHistory = async (studentId, enrollmentId) => {
    try {
      setPaymentLoading(true);
      const response = await studentApi.getPaymentHistory(studentId, enrollmentId);
      
      if (response.success) {
        setPaymentHistory(response.data);
      }
    } catch (error) {
      console.error('Error loading payment history:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await studentApi.deleteDocument(documentId);
        if (response.success) {
          // Reload student details to refresh documents
          loadStudentDetails();
        }
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'not_started':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
      case 'aborted':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    }
  };

  const formatStatus = (status) => {
    return status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
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

  if (!student) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Student not found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            The requested student could not be found.
          </p>
          <button
            onClick={() => navigate('/admin/students')}
            className="mt-4 btn bg-gradient-to-r from-violet-500 to-purple-600 text-white"
          >
            Back to Students
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/admin/students')}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                {student.student_info.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Student ID: {student.student_info.student_code}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Student Info */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Basic Information</h3>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/students/edit/${student.enrollments[0]?.id}`)}
                    className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    title="Edit Student"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mobile</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {student.student_info.mobile}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {student.student_info.email || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <IdentificationIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aadhaar Number</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {student.student_info.aadhar_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {student.student_info.address}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {student.student_info.city}, {getStateDisplayName(student.student_info.state)} - {student.student_info.pincode}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Father's Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {student.student_info.father_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mother's Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {student.student_info.mother_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(student.student_info.date_of_birth)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {student.student_info.gender}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Documents</h3>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/students/${studentId}/documents`)}
                    className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-500 font-medium"
                  >
                    Manage Documents
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {student.documents && student.documents.length > 0 ? (
                  <div className="space-y-3">
                    {student.documents.map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            document.is_verified 
                              ? 'bg-green-500' 
                              : 'bg-yellow-500'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {document.type.toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {document.file_name}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Uploaded: {formatDate(document.uploaded_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            document.is_verified 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                          }`}>
                            {document.is_verified ? (
                              <>
                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                Verified
                              </>
                            ) : (
                              <>
                                <ClockIcon className="h-3 w-3 mr-1" />
                                Pending
                              </>
                            )}
                          </span>
                          <a
                            href={document.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="View Document"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteDocument(document.id)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete Document"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No documents uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Enrollments and Payments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enrollment History */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center space-x-3">
                  <AcademicCapIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Enrollment History</h3>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Enrollment Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fee Paid
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fee Due
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
                    {student.enrollments.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {enrollment.course}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDate(enrollment.enrollment_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                            {formatStatus(enrollment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">
                          {formatCurrency(enrollment.paid_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={parseFloat(enrollment.due_amount) > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                            {formatCurrency(enrollment.due_amount)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center space-x-3">
                  <CurrencyDollarIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Payment History</h3>
                </div>
              </div>
              
              <div className="p-6">
                {paymentLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-500"></div>
                  </div>
                ) : paymentHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Method
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Remaining Due
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {formatDate(payment.payment_date)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 capitalize">
                              {payment.payment_method?.replace('_', ' ')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 capitalize">
                              {payment.type?.replace('_', ' ')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                              {formatCurrency(payment.remaining_due_amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No payment history available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default StudentDetail;
