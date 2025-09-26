import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import studentApi from '@/services/api/studentApi';
import AadhaarCheckModal from './components/AadhaarCheckModal';

// Icons
import { 
  EyeIcon, 
  PencilIcon, 
  PlusIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';

function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState({});
  const [pagination, setPagination] = useState({});
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // Load students
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async (params = {}) => {
    try {
      setLoading(true);
      const response = await studentApi.getStudents(params);
      
      if (response.success) {
        setStudents(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLogin = async (studentId, currentStatus) => {
    setStatusLoading(prev => ({ ...prev, [studentId]: true }));
    
    try {
      const response = await studentApi.toggleLogin(studentId, !currentStatus);
      
      if (response.success) {
        setStudents(prev => 
          prev.map(student => 
            student.student_id === studentId 
              ? { ...student, login_enabled: !currentStatus }
              : student
          )
        );
      }
    } catch (error) {
      console.error('Error toggling login:', error);
    } finally {
      setStatusLoading(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const handleViewStudent = (studentId) => {
    navigate(`/admin/students/${studentId}`);
  };

  const handleEditStudent = (enrollmentId) => {
    navigate(`/admin/students/edit/${enrollmentId}`);
  };

  const handleAttachDocuments = (studentId) => {
    navigate(`/admin/students/${studentId}/documents`);
  };

  const getFeeStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'due':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    }
  };

  const getCourseStatusColor = (status) => {
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

  if (loading) {
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
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Student Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage students, enrollments, and documents
          </p>
        </div>

        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <button
            onClick={() => setShowEnrollModal(true)}
            className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Enroll Student
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            All Students ({students.length})
          </h3>
        </div>

        {students.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No students found</p>
            <button
              onClick={() => setShowEnrollModal(true)}
              className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Enroll Your First Student
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Course(s)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fee Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Allow Login
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
                {students.map((student) => (
                  <tr
                    key={student.student_id}
                    className="border-b border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewStudent(student.student_id)}
                        className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-500 font-medium"
                      >
                        {student.student_code}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                            {student.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                      {student.mobile}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col space-y-1">
                        {student.courses?.map((course, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCourseStatusColor(course.status)}`}
                          >
                            {course.title} - {formatStatus(course.status)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col space-y-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getFeeStatusColor(student.fee_status)}`}
                        >
                          {student.fee_status}
                        </span>
                        {student.due_amount && parseFloat(student.due_amount) > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Due: ₹{parseFloat(student.due_amount).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleLogin(student.student_id, student.login_enabled)}
                        disabled={statusLoading[student.student_id]}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
                          student.login_enabled
                            ? 'bg-green-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                        } ${statusLoading[student.student_id] ? 'opacity-50' : ''}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            student.login_enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {/* View */}
                        <button
                          onClick={() => handleViewStudent(student.student_id)}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="View Student"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        {/* Edit */}
                        <button
                          onClick={() => handleEditStudent(student.enrollment_id)}
                          className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          title="Edit Student"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>

                        {/* Attach Documents */}
                        <button
                          onClick={() => handleAttachDocuments(student.student_id)}
                          className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          title="Attach Documents"
                        >
                          <DocumentTextIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Aadhaar Check Modal */}
      <AadhaarCheckModal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
      />
    </AdminLayout>
  );
}

export default StudentList;
