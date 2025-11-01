import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import enquiryApi from '@/services/api/enquiryApi';

const EnrollModal = ({ isOpen, onClose, onSuccess, selectedCourseId = null }) => {
  const [formData, setFormData] = useState({
    course_id: selectedCourseId ? String(selectedCourseId) : '',
    course_name: '',
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCourses();
    }
  }, [isOpen]);

  // Auto-select course when selectedCourseId changes and courses are loaded
  useEffect(() => {
    if (selectedCourseId && courses.length > 0) {
      const selectedCourse = courses.find(course => course.id === parseInt(selectedCourseId));
      if (selectedCourse) {
        setFormData(prev => ({
          ...prev,
          course_id: String(selectedCourseId),
          course_name: selectedCourse.title
        }));
      }
    }
  }, [selectedCourseId, courses]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await enquiryApi.getCourses();
      if (response.success && response.data) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const selectedCourse = courses.find(course => course.id === parseInt(courseId));
    
    setFormData(prev => ({
      ...prev,
      course_id: courseId,
      course_name: selectedCourse ? selectedCourse.title : ''
    }));
    
    if (errors.course_id) {
      setErrors(prev => ({
        ...prev,
        course_id: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.course_id) {
      newErrors.course_id = 'Please select a course';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$|^\+\d{1,3}\d{6,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await enquiryApi.createEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        course_id: parseInt(formData.course_id),
        course_name: formData.course_name,
        message: formData.message
      });

      if (response.success) {
        // Reset form
        setFormData({
          course_id: '',
          course_name: '',
          name: '',
          phone: '',
          email: '',
          message: ''
        });
        setErrors({});
        
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to submit enquiry. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500/60 dark:bg-gray-900/70"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Center modal */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="relative z-[10000] inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              onClick={onClose}
              disabled={submitting}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
                Enroll Now
              </h3>

              {/* Error Alert */}
              {errors.submit && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">{errors.submit}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Course Selection */}
                <div>
                  <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="course_id"
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleCourseChange}
                    disabled={loading}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 ${
                      errors.course_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">
                      {loading ? 'Loading courses...' : 'Choose a course'}
                    </option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  {errors.course_id && (
                    <p className="mt-1 text-sm text-red-500">{errors.course_id}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={submitting}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    disabled={submitting}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Email (Optional) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    disabled={submitting}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter any additional details"
                    rows="3"
                    disabled={submitting}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="submit"
                    disabled={submitting || loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-base font-medium text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollModal;
