import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import studentApi from '@/services/api/studentApi';
import ProgressModal from './components/ProgressModal';

// Icons
import { 
  IdentificationIcon,
  UserIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

function EnrollmentForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isExisting, studentData, aadharNumber } = location.state || {};

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [documentRows, setDocumentRows] = useState([{ id: 1, type: '', file: null }]);

  // Available document types
  const documentTypes = [
    { key: 'aadhaar', label: 'Aadhaar Card' },
    { key: 'pan', label: 'PAN Card' },
    { key: 'photo', label: 'Passport Photo' },
    { key: 'ssc', label: 'SSC Certificate' },
    { key: 'hsc', label: 'HSC Certificate' }
  ];

  // Form data state
  const [formData, setFormData] = useState({
    // Student Info (readonly if existing)
    aadhar_number: aadharNumber || '',
    student_code: studentData?.student_code || '',
    name_on_id: studentData?.name || '',
    father_name: studentData?.father_name || '',
    mother_name: studentData?.mother_name || '',
    date_of_birth: studentData?.date_of_birth || '',
    gender: studentData?.gender || 'Male',
    address: studentData?.address || '',
    state: studentData?.state || '',
    city: studentData?.city || '',
    pincode: studentData?.pincode || '',
    mobile: studentData?.mobile || '',
    email: studentData?.email || '',

    // Course Selection
    course_id: '',
    enrollment_date: new Date().toISOString().split('T')[0],
    status: 'not_started',

    // Accommodation
    is_hostel_opted: false,
    is_mess_opted: false,

    // Extra Discount
    extra_discount_amount: 0,

    // Tax Settings
    igst_applicable: false,

    // Payment
    paid_amount: 0,
    payment_method: 'cash',
    remark: ''
  });

  // Fee calculation state
  const [feeCalculation, setFeeCalculation] = useState({
    base_course_fee: 0,
    discount_percentage: 0,
    discounted_course_fee: 0,
    hostel_fee: 0,
    mess_fee: 0,
    pre_tax_total: 0,
    taxable_amount: 0,
    sgst_percentage: 9, // from env
    cgst_percentage: 9, // from env
    igst_percentage: 18, // from env
    sgst_amount: 0,
    cgst_amount: 0,
    igst_amount: 0,
    total_payable_fee: 0,
    due_amount: 0
  });

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Update fee calculations when relevant fields change
  useEffect(() => {
    calculateFees();
  }, [
    formData.course_id, 
    formData.is_hostel_opted, 
    formData.is_mess_opted, 
    formData.extra_discount_amount,
    formData.paid_amount,
    formData.igst_applicable,
    courses
  ]);

  // Reset accommodation options when course changes
  useEffect(() => {
    if (formData.course_id) {
      const selectedCourse = courses.find(course => course.id === parseInt(formData.course_id));
      if (selectedCourse) {
        // Reset accommodation options if not available for selected course
        setFormData(prev => ({
          ...prev,
          is_hostel_opted: selectedCourse.hostel_available ? prev.is_hostel_opted : false,
          is_mess_opted: selectedCourse.mess_available ? prev.is_mess_opted : false
        }));
      }
    }
  }, [formData.course_id, courses]);

  const loadCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await studentApi.getCourses();
      
      if (response.success) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setCoursesLoading(false);
    }
  };

  const calculateFees = () => {
    const selectedCourse = courses.find(course => course.id === parseInt(formData.course_id));
    if (!selectedCourse) {
      setFeeCalculation(prev => ({ 
        ...prev, 
        base_course_fee: 0,
        discount_percentage: 0,
        discounted_course_fee: 0,
        pre_tax_total: 0,
        taxable_amount: 0,
        sgst_amount: 0,
        cgst_amount: 0,
        igst_amount: 0,
        total_payable_fee: 0,
        due_amount: 0
      }));
      return;
    }

    // Base course fee and discount (using correct API response properties)
    const baseFee = parseFloat(selectedCourse.base_course_fee) || 0;
    const discountPercentage = parseFloat(selectedCourse.discount_percentage) || 0;
    const discountedFee = parseFloat(selectedCourse.discounted_course_fee) || 0;

    // Accommodation fees (use values from API response or defaults)
    const hostelFee = formData.is_hostel_opted ? (parseFloat(selectedCourse.hostel_fee) || 0) : 0;
    const messFee = formData.is_mess_opted ? (parseFloat(selectedCourse.mess_fee) || 0) : 0;

    // Pre-tax total
    const preTaxTotal = discountedFee + hostelFee + messFee - parseFloat(formData.extra_discount_amount || 0);
    
    // Tax calculation
    const taxableAmount = preTaxTotal;
    let sgstAmount = 0, cgstAmount = 0, igstAmount = 0;

    if (formData.igst_applicable) {
      igstAmount = taxableAmount * 18 / 100;
    } else {
      sgstAmount = taxableAmount * 9 / 100;
      cgstAmount = taxableAmount * 9 / 100;
    }

    // Total payable
    const totalPayableFee = preTaxTotal + sgstAmount + cgstAmount + igstAmount;
    const dueAmount = totalPayableFee - parseFloat(formData.paid_amount || 0);

    setFeeCalculation({
      base_course_fee: baseFee,
      discount_percentage: discountPercentage,
      discounted_course_fee: discountedFee,
      hostel_fee: hostelFee,
      mess_fee: messFee,
      pre_tax_total: preTaxTotal,
      taxable_amount: taxableAmount,
      sgst_percentage: 9,
      cgst_percentage: 9,
      igst_percentage: 18,
      sgst_amount: sgstAmount,
      cgst_amount: cgstAmount,
      igst_amount: igstAmount,
      total_payable_fee: totalPayableFee,
      due_amount: dueAmount
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Document row handlers
  const handleDocumentTypeChange = (rowId, selectedType) => {
    setDocumentRows(prev => 
      prev.map(row => 
        row.id === rowId ? { ...row, type: selectedType, file: null } : row
      )
    );
  };

  const handleDocumentFileChange = (rowId, file) => {
    setDocumentRows(prev => 
      prev.map(row => 
        row.id === rowId ? { ...row, file: file } : row
      )
    );
  };

  const addDocumentRow = () => {
    const newId = Math.max(...documentRows.map(row => row.id)) + 1;
    setDocumentRows(prev => [
      ...prev,
      { id: newId, type: '', file: null }
    ]);
  };

  // Get available document types for a specific row (excluding already selected)
  const getAvailableDocumentTypes = (currentRowId) => {
    const selectedTypes = documentRows
      .filter(row => row.id !== currentRowId && row.type)
      .map(row => row.type);
    
    return documentTypes.filter(type => !selectedTypes.includes(type.key));
  };

  // Check if "Add More" button should be enabled for a row
  const canAddMore = (rowId) => {
    const currentRow = documentRows.find(row => row.id === rowId);
    return currentRow && currentRow.file && currentRow.type;
  };

  // Check if all document types are selected
  const allTypesSelected = () => {
    const selectedTypes = documentRows.filter(row => row.type).map(row => row.type);
    return selectedTypes.length >= documentTypes.length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare enrollment data
      const enrollmentData = {
        ...formData,
        extra_discount_amount: parseFloat(formData.extra_discount_amount) || 0,
        paid_amount: parseFloat(formData.paid_amount) || 0,
        course_id: parseInt(formData.course_id)
      };

      // Create enrollment
      const response = await studentApi.createEnrollment(enrollmentData);

      if (response.success) {
        const { student_id } = response.data;

        // Show progress modal
        setShowProgressModal(true);

        // If documents are selected, upload them
        const documentsToUpload = documentRows.filter(row => row.file && row.type);
        let documentUploadSuccess = true;
        
        if (documentsToUpload.length > 0) {
          try {
            await uploadDocuments(student_id, documentsToUpload);
            console.log('Documents uploaded successfully');
          } catch (error) {
            console.error('Document upload failed:', error);
            documentUploadSuccess = false;
          }
        }

        // Navigate to student list after delay
        setTimeout(() => {
          setShowProgressModal(false);
          navigate('/admin/students', { 
            state: { 
              message: documentUploadSuccess 
                ? 'Student enrolled successfully!' 
                : 'Student enrolled successfully! Note: Some documents may not have been uploaded.',
              studentId: student_id
            }
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating enrollment:', error);
      setLoading(false);
    }
  };

  const uploadDocuments = async (studentId, documentsToUpload) => {
    if (documentsToUpload.length === 0) return;

    try {
      const formData = new FormData();
      
      // Add all files with field name 'documents' (as expected by multer)
      documentsToUpload.forEach((row) => {
        formData.append('documents', row.file);
      });
      
      // Add slugs array as JSON string (backend will parse it)
      const slugs = documentsToUpload.map(row => row.type);
      formData.append('slugs', JSON.stringify(slugs));

      console.log('Uploading documents for student:', studentId);
      console.log('Documents to upload:', documentsToUpload.map(row => ({ type: row.type, fileName: row.file.name })));
      console.log('Slugs array:', slugs);
      
      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      const response = await studentApi.uploadDocuments(studentId, formData);
      console.log('Document upload response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Document upload failed');
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      // Don't throw the error to prevent blocking the enrollment success flow
    }
  };

  if (coursesLoading) {
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            {isExisting ? 'Enroll Existing Student' : 'Enroll New Student'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Fill in the student information and course details for enrollment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Student Information */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Student Information</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    name="aadhar_number"
                    value={formData.aadhar_number}
                    readOnly
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {isExisting && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Student ID
                    </label>
                    <input
                      type="text"
                      name="student_code"
                      value={formData.student_code}
                      readOnly
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_on_id"
                    value={formData.name_on_id}
                    onChange={handleInputChange}
                    readOnly={isExisting}
                    required
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 ${
                      isExisting ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-700'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    readOnly={isExisting}
                    required
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 ${
                      isExisting ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-700'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Father Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mother Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mother_name"
                    value={formData.mother_name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Course Selection */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <div className="flex items-center space-x-3">
                <AcademicCapIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Course Selection</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title} - ₹{parseFloat(course.discounted_course_fee).toLocaleString()}
                      </option>
                    ))}
                  </select>
                  
                  {/* Course Details Preview */}
                  {formData.course_id && (() => {
                    const selectedCourse = courses.find(course => course.id === parseInt(formData.course_id));
                    if (selectedCourse) {
                      return (
                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                            <p><strong>Base Fee:</strong> ₹{parseFloat(selectedCourse.base_course_fee).toLocaleString()}</p>
                            <p><strong>Discount:</strong> {selectedCourse.discount_percentage}% (₹{(parseFloat(selectedCourse.base_course_fee) - parseFloat(selectedCourse.discounted_course_fee)).toLocaleString()} off)</p>
                            <div className="flex space-x-4">
                              <span>Hostel: {selectedCourse.hostel_available ? `₹${selectedCourse.hostel_fee}` : 'Not Available'}</span>
                              <span>Mess: {selectedCourse.mess_available ? `₹${selectedCourse.mess_fee}` : 'Not Available'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Enrollment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="enrollment_date"
                    value={formData.enrollment_date}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="aborted">Aborted</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Fee Information */}
          {formData.course_id && (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center space-x-3">
                  <CurrencyDollarIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Fee Calculation</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Course Fee */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Base Course Fee
                    </label>
                    <input
                      type="number"
                      value={feeCalculation.base_course_fee}
                      readOnly
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      value={feeCalculation.discount_percentage}
                      readOnly
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Discounted Course Fee
                    </label>
                    <input
                      type="number"
                      value={feeCalculation.discounted_course_fee}
                      readOnly
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Accommodation */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accommodation Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                      const selectedCourse = courses.find(course => course.id === parseInt(formData.course_id));
                      const hostelAvailable = selectedCourse?.hostel_available;
                      const messAvailable = selectedCourse?.mess_available;
                      const hostelFeeAmount = parseFloat(selectedCourse?.hostel_fee) || 0;
                      const messFeeAmount = parseFloat(selectedCourse?.mess_fee) || 0;

                      return (
                        <>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="is_hostel_opted"
                              checked={formData.is_hostel_opted}
                              onChange={handleInputChange}
                              disabled={!hostelAvailable}
                              className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                            />
                            <label className={`ml-2 block text-sm ${!hostelAvailable ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                              Hostel Opted {hostelAvailable ? `(+₹${hostelFeeAmount})` : '(Not Available)'}
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="is_mess_opted"
                              checked={formData.is_mess_opted}
                              onChange={handleInputChange}
                              disabled={!messAvailable}
                              className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                            />
                            <label className={`ml-2 block text-sm ${!messAvailable ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                              Mess Opted {messAvailable ? `(+₹${messFeeAmount})` : '(Not Available)'}
                            </label>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Extra Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Extra Discount Amount
                  </label>
                  <input
                    type="number"
                    name="extra_discount_amount"
                    value={formData.extra_discount_amount}
                    onChange={handleInputChange}
                    min="0"
                    className="block w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                {/* Tax Configuration */}
                <div>
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      name="igst_applicable"
                      checked={formData.igst_applicable}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                      IGST Applicable (Interstate Transaction)
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {!formData.igst_applicable ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            SGST (9%)
                          </label>
                          <input
                            type="number"
                            value={feeCalculation.sgst_amount.toFixed(2)}
                            readOnly
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            CGST (9%)
                          </label>
                          <input
                            type="number"
                            value={feeCalculation.cgst_amount.toFixed(2)}
                            readOnly
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          IGST (18%)
                        </label>
                        <input
                          type="number"
                          value={feeCalculation.igst_amount.toFixed(2)}
                          readOnly
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Total Payable Fee
                      </label>
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        ₹{feeCalculation.total_payable_fee.toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Paid Amount
                      </label>
                      <input
                        type="number"
                        name="paid_amount"
                        value={formData.paid_amount}
                        onChange={handleInputChange}
                        min="0"
                        max={feeCalculation.total_payable_fee}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Due Amount
                      </label>
                      <div className={`text-lg font-semibold ${feeCalculation.due_amount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        ₹{feeCalculation.due_amount.toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Payment Method
                      </label>
                      <select
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Upload */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Documents Upload</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload student documents (Optional). Select document type, choose file, then use "Add More" to add additional documents.
                </p>
                
                {documentRows.map((row, index) => {
                  const availableTypes = getAvailableDocumentTypes(row.id);
                  const isLastRow = index === documentRows.length - 1;
                  
                  return (
                    <div key={row.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      {/* Document Type Dropdown */}
                      <div className="md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Document Type
                        </label>
                        <select
                          value={row.type}
                          onChange={(e) => handleDocumentTypeChange(row.id, e.target.value)}
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
                          onChange={(e) => handleDocumentFileChange(row.id, e.target.files[0] || null)}
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
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Remarks / Notes
                </label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  rows="3"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Any additional notes or remarks..."
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/students')}
              disabled={loading}
              className="btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.course_id}
              className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg disabled:opacity-50"
            >
              {loading ? 'Enrolling...' : 'Enroll Student'}
            </button>
          </div>
        </form>

        {/* Progress Modal */}
        <ProgressModal 
          isOpen={showProgressModal}
          hasDocuments={documentRows.some(row => row.file && row.type)}
        />
      </div>
    </AdminLayout>
  );
}

export default EnrollmentForm;
