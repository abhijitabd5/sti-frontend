import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import courseApi from '@/services/api/courseApi';

// Icons
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon,
  LanguageIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

function AddCourseLanguage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [baseCourse, setBaseCourse] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    language: 'hi', // Default to Hindi for new language variant
    summary: '',
    description: '',
    duration: '',
    syllabus_text: '',
    syllabus_file: null,
    course_group_id: ''
  });

  const [errors, setErrors] = useState({});

  // Load base course data
  useEffect(() => {
    loadBaseCourse();
  }, [courseId]);

  const loadBaseCourse = async () => {
    try {
      setInitialLoading(true);
      const response = await courseApi.getCourseById(courseId);
      if (response.success) {
        const course = response.data;
        setBaseCourse(course);
        // Pre-fill some fields with base course data for reference
        setFormData(prev => ({
          ...prev,
          duration: course.duration.toString(),
          course_group_id: course.course_group_id.toString()
        }));
      } else {
        navigate('/admin/courses');
      }
    } catch (error) {
      console.error('Error loading base course:', error);
      navigate('/admin/courses');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle file inputs
    if (name === "syllabus_file") {
      const file = e.target.files[0] || null;
      setFormData(prev => ({
        ...prev,
        [name]: file,
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }

    if (!formData.language) {
      newErrors.language = 'Language is required';
    }

    if (!formData.summary.trim()) {
      newErrors.summary = 'Course summary is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required';
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Valid duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare course data for language variant creation
      const courseData = {
        ...formData,
        duration: parseInt(formData.duration),
        course_group_id: parseInt(formData.course_group_id),
        // Copy required fields from base course
        base_course_fee: parseFloat(baseCourse.base_course_fee),
        is_discounted: baseCourse.is_discounted,
        discount_percentage: parseFloat(baseCourse.discount_percentage || 0),
        discount_amount: parseFloat(baseCourse.discount_amount || 0),
        hostel_available: baseCourse.hostel_available,
        hostel_fee: parseFloat(baseCourse.hostel_fee || 0),
        mess_available: baseCourse.mess_available,
        mess_fee: parseFloat(baseCourse.mess_fee || 0),
        show_offer_badge: baseCourse.show_offer_badge,
        offer_badge_text: baseCourse.offer_badge_text,
        is_featured: baseCourse.is_featured,
        is_active: true,
        display_order: baseCourse.display_order
      };
      
      const response = await courseApi.createCourse(courseData);

      if (response.success) {
        navigate('/admin/courses', {
          state: { message: `Course language variant (${getLanguageName(formData.language)}) added successfully!` }
        });
      }
    } catch (error) {
      console.error('Error adding course language variant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/courses');
  };

  const getLanguageName = (code) => {
    const languages = {
      'en': 'English',
      'hi': 'Hindi',
      'mar': 'Marathi'
    };
    return languages[code] || code;
  };

  const getLanguageFlag = (code) => {
    const flags = {
      'en': '🇺🇸',
      'hi': '🇮🇳',
      'mar': '🇮🇳'
    };
    return flags[code] || '🌐';
  };

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!baseCourse) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XMarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Base course not found</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={handleCancel}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Add Course Language Variant
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add a new language version for "{baseCourse.title}"
          </p>
        </div>
      </div>

      {/* Base Course Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <InformationCircleIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Base Course Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-700 dark:text-blue-300">Title:</span>
            <p className="text-blue-600 dark:text-blue-400">{baseCourse.title}</p>
          </div>
          <div>
            <span className="font-medium text-blue-700 dark:text-blue-300">Current Language:</span>
            <p className="text-blue-600 dark:text-blue-400">
              {getLanguageFlag(baseCourse.language)} {getLanguageName(baseCourse.language)}
            </p>
          </div>
          <div>
            <span className="font-medium text-blue-700 dark:text-blue-300">Duration:</span>
            <p className="text-blue-600 dark:text-blue-400">{baseCourse.duration} weeks</p>
          </div>
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
          Note: Pricing, discount settings, thumbnail, and display order will be copied from the base course.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center space-x-2">
                  <LanguageIcon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    Language Variant Information
                  </h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`form-input w-full ${errors.title ? 'border-red-500' : ''}`}
                    placeholder="Enter course title in the selected language"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language *
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className={`form-input w-full ${errors.language ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Language</option>
                    <option value="en" disabled={baseCourse.language === 'en'}>
                      🇺🇸 English {baseCourse.language === 'en' ? '(Base Course)' : ''}
                    </option>
                    <option value="hi" disabled={baseCourse.language === 'hi'}>
                      🇮🇳 Hindi {baseCourse.language === 'hi' ? '(Base Course)' : ''}
                    </option>
                    <option value="mar" disabled={baseCourse.language === 'mar'}>
                      🇮🇳 Marathi {baseCourse.language === 'mar' ? '(Base Course)' : ''}
                    </option>
                  </select>
                  {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Summary *
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    rows={3}
                    className={`form-input w-full ${errors.summary ? 'border-red-500' : ''}`}
                    placeholder="Brief summary of the course in the selected language"
                  />
                  {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={`form-input w-full ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Detailed description of the course in the selected language"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (weeks) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    className={`form-input w-full ${errors.duration ? 'border-red-500' : ''}`}
                    placeholder="Course duration in weeks"
                  />
                  {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Pre-filled with base course duration ({baseCourse.duration} weeks)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Group ID
                  </label>
                  <input
                    type="text"
                    name="course_group_id"
                    value={formData.course_group_id}
                    readOnly
                    className="form-input w-full bg-gray-50 dark:bg-gray-700"
                    placeholder="Course Group ID"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Inherited from base course (read-only)
                  </p>
                </div>
              </div>
            </div>

            {/* Syllabus */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    Syllabus (Optional)
                  </h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Syllabus Text
                  </label>
                  <textarea
                    name="syllabus_text"
                    value={formData.syllabus_text}
                    onChange={handleInputChange}
                    rows={6}
                    className="form-input w-full"
                    placeholder="Enter week-by-week syllabus details in the selected language"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Translate the syllabus content to the selected language
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Syllabus PDF File
                  </label>
                  <input
                    type="file"
                    name="syllabus_file"
                    onChange={handleInputChange}
                    className="form-input w-full"
                    accept="application/pdf"
                  />
                  {formData.syllabus_file && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Selected: {formData.syllabus_file.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Upload syllabus PDF file in the selected language
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* What will be inherited */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Inherited from Base Course
                </h3>
              </div>
              
              <div className="p-6 space-y-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Pricing:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    ₹{parseFloat(baseCourse.base_course_fee).toLocaleString('en-IN')}
                    {baseCourse.is_discounted && (
                      <span className="text-green-600 dark:text-green-400 ml-2">
                        (₹{parseFloat(baseCourse.discounted_course_fee || baseCourse.base_course_fee).toLocaleString('en-IN')} - {baseCourse.discount_percentage}% OFF)
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Display Order:</span>
                  <p className="text-gray-600 dark:text-gray-400">#{baseCourse.display_order}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Thumbnail:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {baseCourse.thumbnail ? 'Same as base course' : 'None'}
                  </p>
                </div>

                {baseCourse.show_offer_badge && (
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Offer Badge:</span>
                    <p className="text-gray-600 dark:text-gray-400">{baseCourse.offer_badge_text}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            {formData.language && (
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    Preview
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">{getLanguageFlag(formData.language)}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {getLanguageName(formData.language)} Version
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This language variant will be created with all the content you provide above
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700/60">
          <button
            type="button"
            onClick={handleCancel}
            className="btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="btn bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <CheckIcon className="h-4 w-4 mr-2" />
            )}
            Add Language Variant
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default AddCourseLanguage;
