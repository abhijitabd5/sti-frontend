import React, { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import certificateTemplateApi from '@/services/api/certificateTemplateApi';
import certificateApi from '@/services/api/certificateApi';
import { DatePicker } from '@/components/ui/Internal/DatePicker';
import { MonthPicker } from '@/components/ui/Internal/MonthPicker';

// Icons
import { 
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

function RegenerateCertificateModal({ isOpen, onClose, certificate, onSuccess, onError }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [studentPhoto, setStudentPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    student_name: '',
    student_gender: 'male',
    guardian_relationship: 'son',
    guardian_name: '',
    guardian_gender: 'male',
    grade: '',
    examination_date: '', // dd-MM-yyyy format
    commencement_month_year: '', // dd-MM-yyyy format
    completion_month_year: '', // dd-MM-yyyy format
    course_duration_value: '',
    course_duration_type: 'Months',
    template_id: '',
    issue_date: format(new Date(), 'dd-MM-yyyy') // dd-MM-yyyy format
  });

  useEffect(() => {
    if (isOpen && certificate) {
      loadTemplates();
      populateFormFromCertificate();
    }
  }, [isOpen, certificate]);

  const populateFormFromCertificate = () => {
    if (!certificate?.certificate_data_snapshot) {
      console.warn('Certificate data snapshot not found:', certificate);
      return;
    }

    const snapshot = certificate.certificate_data_snapshot;
    
    // Parse course duration (e.g., "6 Months" -> value: "6", type: "Months")
    let durationValue = '';
    let durationType = 'Months';
    if (snapshot.course_duration) {
      const parts = snapshot.course_duration.split(' ');
      if (parts.length >= 2) {
        durationValue = parts[0];
        durationType = parts[1];
      }
    }

    // Parse examination date (e.g., "February 2026" -> "01-02-2026" dd-MM-yyyy)
    let examinationDate = '';
    if (snapshot.examination_month_year) {
      try {
        const parsed = parse(snapshot.examination_month_year, 'MMMM yyyy', new Date());
        examinationDate = format(parsed, 'dd-MM-yyyy');
      } catch (e) {
        console.error('Error parsing examination date:', e);
      }
    }

    // Parse commencement date (e.g., "February 2026" -> "01-02-2026" dd-MM-yyyy)
    let commencementDate = '';
    if (snapshot.commencement_month_year) {
      try {
        const parsed = parse(snapshot.commencement_month_year, 'MMMM yyyy', new Date());
        commencementDate = format(parsed, 'dd-MM-yyyy');
      } catch (e) {
        console.error('Error parsing commencement date:', e);
      }
    }

    // Parse completion date (e.g., "March 2026" -> "01-03-2026" dd-MM-yyyy)
    let completionDate = '';
    if (snapshot.completion_month_year) {
      try {
        const parsed = parse(snapshot.completion_month_year, 'MMMM yyyy', new Date());
        completionDate = format(parsed, 'dd-MM-yyyy');
      } catch (e) {
        console.error('Error parsing completion date:', e);
      }
    }

    // Parse issue_date (e.g., "15-01-2026" dd-MM-yyyy -> keep as is)
    let issueDate = format(new Date(), 'dd-MM-yyyy');
    if (certificate.issue_date) {
      try {
        // Try parsing as dd-MM-yyyy first
        const parsed = parse(certificate.issue_date, 'dd-MM-yyyy', new Date());
        if (!isNaN(parsed.getTime())) {
          issueDate = certificate.issue_date;
        } else {
          // Fallback: try ISO format
          issueDate = format(new Date(certificate.issue_date), 'dd-MM-yyyy');
        }
      } catch (e) {
        console.error('Error parsing issue date:', e);
      }
    }

    setFormData({
      student_name: snapshot.student_name || '',
      student_gender: snapshot.student_gender || 'male',
      guardian_relationship: snapshot.guardian_relationship || 'son',
      guardian_name: snapshot.guardian_name || '',
      guardian_gender: snapshot.guardian_gender || 'male',
      grade: snapshot.grade || '',
      examination_date: examinationDate,
      commencement_month_year: commencementDate,
      completion_month_year: completionDate,
      course_duration_value: durationValue,
      course_duration_type: durationType,
      template_id: certificate.template_id || '',
      issue_date: issueDate
    });
  };

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await certificateTemplateApi.getTemplates({
        is_active: true,
        limit: 'all',
        sortBy: 'display_order',
        sortOrder: 'ASC'
      });
      
      if (response.success && response.data.length > 0) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        if (onError) onError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        if (onError) onError('Image size should be less than 5MB');
        return;
      }
      
      setStudentPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setStudentPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Comprehensive validation
    if (!formData.student_name.trim()) {
      if (onError) onError('Student name is required');
      return;
    }

    if (!formData.student_gender) {
      if (onError) onError('Student gender is required');
      return;
    }

    if (!formData.guardian_name.trim()) {
      if (onError) onError('Guardian name is required');
      return;
    }

    if (!formData.guardian_gender) {
      if (onError) onError('Guardian gender is required');
      return;
    }

    if (!formData.guardian_relationship) {
      if (onError) onError('Guardian relationship is required');
      return;
    }

    if (!formData.grade) {
      if (onError) onError('Grade/Result is required');
      return;
    }

    if (!formData.examination_date) {
      if (onError) onError('Examination month & year is required');
      return;
    }

    if (!formData.commencement_month_year) {
      if (onError) onError('Course start month & year is required');
      return;
    }

    if (!formData.completion_month_year) {
      if (onError) onError('Course completion month & year is required');
      return;
    }

    if (!formData.course_duration_value || formData.course_duration_value <= 0) {
      if (onError) onError('Course duration value is required and must be greater than 0');
      return;
    }

    if (!formData.course_duration_type) {
      if (onError) onError('Course duration type is required');
      return;
    }

    if (!formData.template_id) {
      if (onError) onError('Please select a template');
      return;
    }

    if (!formData.issue_date) {
      if (onError) onError('Issue date is required');
      return;
    }

    setRegenerating(true);
    
    try {
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      
      // Convert date formats
      // Convert "01-05-2026" (dd-MM-yyyy) to "May 2026" (Month Year)
      const formatMonthYear = (dateInput) => {
        if (!dateInput) return '';
        const date = parse(dateInput, 'dd-MM-yyyy', new Date());
        return format(date, 'MMMM yyyy');
      };
      
      // issue_date is already in dd-MM-yyyy format, no conversion needed
      
      // Append all form fields
      formDataToSend.append('student_name', formData.student_name.trim());
      formDataToSend.append('student_gender', formData.student_gender);
      formDataToSend.append('guardian_relationship', formData.guardian_relationship);
      formDataToSend.append('guardian_name', formData.guardian_name.trim());
      formDataToSend.append('guardian_gender', formData.guardian_gender);
      formDataToSend.append('grade', formData.grade);
      formDataToSend.append('examination_date', formatMonthYear(formData.examination_date));
      formDataToSend.append('commencement_month_year', formatMonthYear(formData.commencement_month_year));
      formDataToSend.append('completion_month_year', formatMonthYear(formData.completion_month_year));
      formDataToSend.append('course_duration_value', parseInt(formData.course_duration_value));
      formDataToSend.append('course_duration_type', formData.course_duration_type.toLowerCase());
      formDataToSend.append('template_id', parseInt(formData.template_id));
      formDataToSend.append('issue_date', formData.issue_date); // Already in dd-MM-yyyy format
      
      // Append photo if selected
      if (studentPhoto) {
        formDataToSend.append('student_photo', studentPhoto);
      }

      const response = await certificateApi.regenerateCertificate(certificate.id, formDataToSend);
      
      if (response.success) {
        onClose();
        if (onSuccess) onSuccess('Certificate regenerated successfully!');
      } else {
        if (onError) onError(response.message || 'Failed to regenerate certificate');
      }
    } catch (error) {
      console.error('Error regenerating certificate:', error);
      if (onError) onError('Failed to regenerate certificate. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For duration value, only allow positive integers
    if (name === 'course_duration_value') {
      const integerValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: integerValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Regenerate Certificate
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Certificate #{certificate?.certificate_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Certificate Info */}
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-2">
              Current Certificate Information
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <p className="text-purple-700 dark:text-purple-400">
                <span className="font-medium">Student:</span> {certificate?.student?.name_on_id || certificate?.student?.user?.first_name}
              </p>
              <p className="text-purple-700 dark:text-purple-400">
                <span className="font-medium">Course:</span> {certificate?.course?.title}
              </p>
              <p className="text-purple-700 dark:text-purple-400">
                <span className="font-medium">Status:</span> {certificate?.status}
              </p>
              <p className="text-purple-700 dark:text-purple-400">
                <span className="font-medium">Template:</span> {certificate?.template?.name}
              </p>
            </div>
          </div>

          {/* Form */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No active templates available. Please create a template first.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Details Section */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Student Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="student_name"
                      value={formData.student_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Full name as it should appear on certificate"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Student Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="student_gender"
                      value={formData.student_gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Student Photo Upload */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student Photo (Optional)
                  </label>
                  <div className="flex items-start gap-4">
                    {photoPreview ? (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Student"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-violet-500 dark:hover:border-violet-400 transition-colors">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Upload student's identity photo for the certificate.
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Accepted formats: JPG, PNG, GIF (Max 5MB)
                      </p>
                      {certificate?.student_photo_path && !photoPreview && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Current photo will be used if not replaced
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardian Details Section */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Guardian Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Guardian Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="guardian_name"
                      value={formData.guardian_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Parent/Guardian full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Guardian Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="guardian_gender"
                      value={formData.guardian_gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Relationship <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="guardian_relationship"
                      value={formData.guardian_relationship}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="">Select Relationship</option>
                      <option value="son">Son</option>
                      <option value="daughter">Daughter</option>
                      <option value="ward">Ward</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Course & Examination Details Section */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Course & Examination Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Grade/Result <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="">Select Grade</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="B-">B-</option>
                      <option value="C+">C+</option>
                      <option value="C">C</option>
                      <option value="C-">C-</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                      <option value="Distinction">Distinction</option>
                      <option value="First Class">First Class</option>
                      <option value="Second Class">Second Class</option>
                      <option value="Pass">Pass</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <MonthPicker
                      label={<>Examination Month & Year <span className="text-red-500">*</span></>}
                      value={formData.examination_date}
                      onChange={(date) => handleInputChange({ target: { name: 'examination_date', value: date } })}
                      placeholder="Select month"
                    />
                  </div>

                  <div>
                    <MonthPicker
                      label={<>Course Start Month & Year <span className="text-red-500">*</span></>}
                      value={formData.commencement_month_year}
                      onChange={(date) => handleInputChange({ target: { name: 'commencement_month_year', value: date } })}
                      placeholder="Select month"
                    />
                  </div>

                  <div>
                    <MonthPicker
                      label={<>Course Completion Month & Year <span className="text-red-500">*</span></>}
                      value={formData.completion_month_year}
                      onChange={(date) => handleInputChange({ target: { name: 'completion_month_year', value: date } })}
                      placeholder="Select month"
                      disabled={!formData.commencement_month_year}
                      minDate={formData.commencement_month_year}
                    />
                  </div>
                </div>

                {/* Course Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name="course_duration_value"
                        value={formData.course_duration_value}
                        onChange={handleInputChange}
                        onWheel={(e) => e.target.blur()}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="e.g., 6"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="course_duration_type"
                            value="Days"
                            checked={formData.course_duration_type === 'Days'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Days</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="course_duration_type"
                            value="Months"
                            checked={formData.course_duration_type === 'Months'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Months</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="course_duration_type"
                            value="Years"
                            checked={formData.course_duration_type === 'Years'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Years</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Details Section */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Certificate Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Certificate Template <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="template_id"
                      value={formData.template_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="">Select Template</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name} {template.is_default ? '(Default)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <DatePicker
                      label={<>Issue Date <span className="text-red-500">*</span></>}
                      value={formData.issue_date}
                      onChange={(date) => handleInputChange({ target: { name: 'issue_date', value: date } })}
                      placeholder="Select date"
                    />
                  </div>
                </div>
              </div>

              {/* Template Preview */}
              {formData.template_id && (
                <div>
                  <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Template Preview
                  </h4>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={templates.find(t => t.id === parseInt(formData.template_id))?.template_image_path}
                      alt="Template Preview"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {!loading && templates.length > 0 && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={regenerating}
              className="btn bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={regenerating}
              className="btn bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {regenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Regenerating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>Regenerate Certificate</span>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegenerateCertificateModal;
