import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import studentApi from '@/services/api/studentApi';
import { getTimestamp } from '@/utils/dateUtils';
import AadhaarCheckModal from './components/AadhaarCheckModal';

// Icons
import { 
  EyeIcon, 
  PencilIcon, 
  PlusIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState({});
  const [exportLoading, setExportLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
  });

  // Load students
  useEffect(() => {
    loadStudents();
  }, [currentPage, recordsPerPage]);

  const loadStudents = async (params = {}) => {
    try {
      setLoading(true);
      
      // Transform filter parameters to match API expectations
      const queryParams = {
        page: currentPage,
        limit: recordsPerPage,
      };

      // Add search parameter if provided
      if (params.search) {
        queryParams.search = params.search;
      }

      // Add date filters with correct parameter names
      if (params.dateFrom) {
        queryParams.start_date = params.dateFrom;
      }
      if (params.dateTo) {
        queryParams.end_date = params.dateTo;
      }

      // Add any other parameters
      Object.keys(params).forEach(key => {
        if (!['search', 'dateFrom', 'dateTo'].includes(key)) {
          queryParams[key] = params[key];
        }
      });

      const response = await studentApi.getStudents(queryParams);
      
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (records) => {
    setRecordsPerPage(records);
    setCurrentPage(1); // Reset to first page when changing records per page
  };

  const handleApplyFilters = () => {
    // Validate date range
    if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
      alert('Start date cannot be after end date');
      return;
    }

    setCurrentPage(1); // Reset to first page when applying filters
    loadStudents(filters);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', dateFrom: '', dateTo: '' });
    setCurrentPage(1);
    loadStudents();
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      
      // Prepare export parameters (only send non-empty filters)
      const exportParams = {};
      
      // Add search filter if not empty
      if (filters.search && filters.search.trim()) {
        exportParams.search = filters.search.trim();
      }
      
      // Add date filters if not empty
      if (filters.dateFrom) {
        exportParams.start_date = filters.dateFrom;
      }
      if (filters.dateTo) {
        exportParams.end_date = filters.dateTo;
      }
      
      // Show user what filters are being applied
      const filterCount = Object.keys(exportParams).length;
      if (filterCount === 0) {
      } else {
      }
      
      const response = await studentApi.exportStudents(exportParams);
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use default with timestamp
      // Try different case variations for content-disposition header
      const contentDisposition = response.headers['content-disposition'] || 
                                response.headers['Content-Disposition'] ||
                                response.headers['CONTENT-DISPOSITION'];
      let filename = 'Student_Records_Export.xlsx';
      
      
      if (contentDisposition) {
        // More robust regex to handle different filename formats
        const filenameMatch = contentDisposition.match(/filename\s*=\s*"?([^";\n]+)"?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].trim();
        }
      } else {
        
        // Fallback: Generate timestamped filename using Indian timezone
        const timestamp = getTimestamp();
        filename = `Student_Records_${timestamp}.xlsx`;
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      
      const filterSummary = Object.keys(exportParams).length === 0 
        ? 'all students' 
        : `filtered students (${Object.keys(exportParams).length} filter(s) applied)`;
      
    } catch (error) {
      console.error('Error exporting students:', error);
      alert('Failed to export students. Please try again.');
    } finally {
      setExportLoading(false);
    }
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 mb-6">
        <div className="px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-3 md:space-y-0">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                placeholder="Search by name, mobile, student ID..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100"
              />
            </div>

            {/* Date From */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Created From:</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100"
                title="Filter students created from this date"
              />
            </div>

            {/* Date To */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">To:</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100"
                title="Filter students created up to this date (optional - defaults to today)"
              />
            </div>

            {/* Apply Filter Button */}
            <button
              onClick={handleApplyFilters}
              className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 whitespace-nowrap"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Apply
            </button>

            {/* Clear Filters Button */}
            {(filters.search || filters.dateFrom || filters.dateTo) && (
              <button
                onClick={handleClearFilters}
                className="btn bg-gray-500 text-white hover:bg-gray-600 whitespace-nowrap"
              >
                Clear
              </button>
            )}

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={exportLoading}
              className="btn bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 whitespace-nowrap disabled:opacity-50"
            >
              {exportLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            All Students ({pagination.total || 0})
          </h3>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Records per page:</label>
            <select
              value={recordsPerPage}
              onChange={(e) => handleRecordsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
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
                    Created At
                  </th>
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
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                      {student.created_at || '-'}
                    </td>
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className={`flex items-center px-3 py-1 rounded border text-sm ${
                  pagination.hasPrev
                    ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded text-sm ${
                        pageNum === pagination.page
                          ? 'bg-violet-600 text-white'
                          : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className={`flex items-center px-3 py-1 rounded border text-sm ${
                  pagination.hasNext
                    ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
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
