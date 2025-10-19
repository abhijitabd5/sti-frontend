import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/common/Layouts/AdminLayout";
import studentApi from "@/services/api/studentApi";

// Icons
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

function StudentDocuments() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [documentRows, setDocumentRows] = useState([
    { id: 1, type: "", file: null },
  ]);

  // Available document types
  const documentTypes = [
    { key: "aadhaar", label: "Aadhaar Card" },
    { key: "pan", label: "PAN Card" },
    { key: "photo", label: "Passport Photo" },
    { key: "ssc", label: "SSC Certificate" },
    { key: "hsc", label: "HSC Certificate" },
  ];

  useEffect(() => {
    loadStudentDetails();
  }, [studentId]);

  const loadStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getStudentById(studentId);

      if (response.success) {
        setStudent(response.data);
      }
    } catch (error) {
      console.error("Error loading student details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Document row handlers

  const handleDocumentFileChange = (rowId, file) => {
    setDocumentRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, file: file } : row))
    );
  };

  const handleDocumentTypeChange = (rowId, selectedType) => {
    setDocumentRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, type: selectedType, file: null } : row
      )
    );
  };

  const addDocumentRow = () => {
    const newId = Math.max(...documentRows.map((row) => row.id)) + 1;
    setDocumentRows((prev) => [...prev, { id: newId, type: "", file: null }]);
  };

  // Get available document types for a specific row (excluding already selected)
  const getAvailableDocumentTypes = (currentRowId) => {
    const selectedTypes = documentRows
      .filter((row) => row.id !== currentRowId && row.type)
      .map((row) => row.type);

    return documentTypes.filter((type) => !selectedTypes.includes(type.key));
  };

  // Check if "Add More" button should be enabled for a row
  const canAddMore = (rowId) => {
    const currentRow = documentRows.find((row) => row.id === rowId);
    return currentRow && currentRow.file && currentRow.type;
  };

  // Check if all document types are selected
  const allTypesSelected = () => {
    const selectedTypes = documentRows
      .filter((row) => row.type)
      .map((row) => row.type);
    return selectedTypes.length >= documentTypes.length;
  };

  const handleUploadDocuments = async () => {
    const documentsToUpload = documentRows.filter(row => row.file && row.type);
    if (documentsToUpload.length === 0) {
      alert('Please select at least one document to upload.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();

      // Add document types (slugs)
      const slugs = documentsToUpload.map((row) => row.type);
      formData.append("slugs", JSON.stringify(slugs));

      // Add files
      documentsToUpload.forEach((row) => {
        formData.append("documents", row.file);
      });

      const response = await studentApi.uploadDocuments(studentId, formData);
      
      if (response.success) {
        // Reset document rows to initial state
        setDocumentRows([{ id: 1, type: "", file: null }]);
        // Reload student details to show new documents
        await loadStudentDetails();
        alert(`${response.data.uploadCount} document(s) uploaded successfully!`);
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      alert('Error uploading documents. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        const response = await studentApi.deleteDocument(documentId);
        if (response.success) {
          // Reload student details to refresh documents
          loadStudentDetails();
        }
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Student not found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            The requested student could not be found.
          </p>
          <button
            onClick={() => navigate("/admin/students")}
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate("/admin/students")}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Student Documents
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {student.student_info.name} ({student.student_info.student_code}
                )
              </p>
            </div>
          </div>
        </div>

        {/* Upload Documents */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
            <div className="flex items-center space-x-3">
              <CloudArrowUpIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                Upload New Documents
              </h3>
            </div>
          </div>
          {/* Documents Upload */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload student documents (Optional). Select document type,
                  choose file, then use "Add More" to add additional documents.
                </p>

                {documentRows.map((row, index) => {
                  const availableTypes = getAvailableDocumentTypes(row.id);
                  const isLastRow = index === documentRows.length - 1;

                  return (
                    <div
                      key={row.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      {/* Document Type Dropdown */}
                      <div className="md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Document Type
                        </label>
                        <select
                          value={row.type}
                          onChange={(e) =>
                            handleDocumentTypeChange(row.id, e.target.value)
                          }
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                        >
                          <option value="">Select Document Type</option>
                          {availableTypes.map((type) => (
                            <option key={type.key} value={type.key}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Choose File Button */}
                      <div className="md:col-span-5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Document File
                        </label>
                        <input
                          type="file"
                          onChange={(e) =>
                            handleDocumentFileChange(
                              row.id,
                              e.target.files[0] || null
                            )
                          }
                          accept=".jpg,.jpeg,.png,.pdf"
                          disabled={!row.type}
                          className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-900 dark:file:text-violet-300 ${
                            !row.type ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        />
                        {row.file && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Selected: {row.file.name}
                          </p>
                        )}
                      </div>

                      {/* Add More Button */}
                      <div className="md:col-span-3">
                        {isLastRow && (
                          <button
                            type="button"
                            onClick={addDocumentRow}
                            disabled={!canAddMore(row.id) || allTypesSelected()}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add More
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p>• Supported formats: JPG, PNG, PDF</p>
                  <p>• "Choose File" button is disabled until document type is selected</p>
                  <p>• "Add More" button becomes active only when both document type and file are selected</p>
                  <p>• Each document type can only be selected once</p>
                </div>
                
                {/* Upload Button */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleUploadDocuments}
                    disabled={uploading || !documentRows.some(row => row.file && row.type)}
                    className="w-full md:w-auto px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {uploading ? 'Uploading...' : 'Upload Documents'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Documents */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                Existing Documents ({student.documents?.length || 0})
              </h3>
            </div>
          </div>

          <div className="p-6">
            {student.documents && student.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.documents.map((document) => (
                  <div
                    key={document.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            document.is_verified
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {document.type.toUpperCase()}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {document.file_name}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          document.is_verified
                            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                        }`}
                      >
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
                    </div>

                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                      Uploaded: {formatDate(document.uploaded_at)}
                    </div>

                    <div className="flex items-center space-x-2">
                      <a
                        href={document.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View</span>
                      </a>

                      <button
                        onClick={() => handleDeleteDocument(document.id)}
                        className="flex items-center space-x-1 text-xs text-red-600 dark:text-red-400 hover:text-red-500"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No documents uploaded yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Upload documents using the form above
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default StudentDocuments;
