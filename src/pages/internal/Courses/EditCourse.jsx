import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import internalApi from '@/services/api/internalApi';

// Icons
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function EditCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    language: 'en',
    summary: '',
    description: '',
    duration: '',
    syllabus_text: '',
    syllabus_file_path: '',
    original_fee: '',
    is_discounted: false,
    discounted_fee: '',
    discount_percentage: '',
    show_offer_badge: false,
    offer_badge_text: '',
    thumbnail: '',
    display_order: ''
  });

  const [errors, setErrors] = useState({});

  // Load existing course data
  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setInitialLoading(true);
      const response = await internalApi.getCourseById(id);
      if (response.success) {
        const course = response.data;
        setFormData({
          title: course.title,
          language: course.language,
          summary: course.summary,
          description: course.description,
          duration: course.duration.toString(),
          syllabus_text: course.syllabus_text,
          syllabus_file_path: course.syllabus_file_path,
          original_fee: course.original_fee.toString(),
          is_discounted: course.is_discounted,
          discounted_fee: course.discounted_fee ? course.discounted_fee.toString() : '',
          discount_percentage: course.discount_percentage.toString(),
          show_offer_badge: course.show_offer_badge,
          offer_badge_text: course.offer_badge_text,
          thumbnail: course.thumbnail,
          display_order: course.display_order.toString()
        });
      } else {
        navigate('/admin/courses');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      navigate('/admin/courses');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-calculate discount percentage
    if (name === 'original_fee' || name === 'discounted_fee') {
      const originalFee = name === 'original_fee' ? parseFloat(value) || 0 : parseFloat(formData.original_fee) || 0;
      const discountedFee = name === 'discounted_fee' ? parseFloat(value) || 0 : parseFloat(formData.discounted_fee) || 0;
      
      if (originalFee > 0 && discountedFee > 0 && discountedFee < originalFee) {
        const percentage = Math.round(((originalFee - discountedFee) / originalFee) * 100);
        setFormData(prev => ({
          ...prev,
          [name]: newValue,
          discount_percentage: percentage.toString()
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
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

    if (!formData.original_fee || formData.original_fee <= 0) {
      newErrors.original_fee = 'Valid original fee is required';
    }

    if (formData.is_discounted) {
      if (!formData.discounted_fee || formData.discounted_fee <= 0) {
        newErrors.discounted_fee = 'Valid discounted fee is required when discount is enabled';
      } else if (parseFloat(formData.discounted_fee) >= parseFloat(formData.original_fee)) {
        newErrors.discounted_fee = 'Discounted fee must be less than original fee';
      }
    }

    if (!formData.display_order || formData.display_order <= 0) {
      newErrors.display_order = 'Valid display order is required';
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
      const response = await internalApi.updateCourse(id, {
        ...formData,
        duration: parseInt(formData.duration),
        original_fee: parseFloat(formData.original_fee),
        discounted_fee: formData.is_discounted ? parseFloat(formData.discounted_fee) : null,
        discount_percentage: formData.is_discounted ? parseInt(formData.discount_percentage) : 0,
        display_order: parseInt(formData.display_order)
      });

      if (response.success) {
        navigate('/admin/courses', {
          state: { message: 'Course updated successfully!' }
        });
      }
    } catch (error) {
      console.error('Error updating course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/courses');
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
              Edit Course
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update course information and content
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Same as CreateCourse */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Basic Information
                </h3>
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
                    placeholder="Enter course title"
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
                    className="form-input w-full"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="mar">Marathi</option>
                  </select>
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
                    placeholder="Brief summary of the course"
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
                    placeholder="Detailed description of the course"
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
                </div>
              </div>
            </div>

            {/* Syllabus */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    Syllabus
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
                    placeholder="Enter week-by-week syllabus details"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Syllabus PDF Path
                  </label>
                  <input
                    type="text"
                    name="syllabus_file_path"
                    value={formData.syllabus_file_path}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="/uploads/syllabus/course-syllabus.pdf"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Same sections as CreateCourse */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    Pricing
                  </h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Original Fee *
                  </label>
                  <input
                    type="number"
                    name="original_fee"
                    value={formData.original_fee}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`form-input w-full ${errors.original_fee ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                  />
                  {errors.original_fee && <p className="text-red-500 text-sm mt-1">{errors.original_fee}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_discounted"
                    name="is_discounted"
                    checked={formData.is_discounted}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  />
                  <label htmlFor="is_discounted" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Apply Discount
                  </label>
                </div>

                {formData.is_discounted && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Discounted Fee *
                      </label>
                      <input
                        type="number"
                        name="discounted_fee"
                        value={formData.discounted_fee}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`form-input w-full ${errors.discounted_fee ? 'border-red-500' : ''}`}
                        placeholder="0.00"
                      />
                      {errors.discounted_fee && <p className="text-red-500 text-sm mt-1">{errors.discounted_fee}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Discount Percentage
                      </label>
                      <input
                        type="number"
                        name="discount_percentage"
                        value={formData.discount_percentage}
                        readOnly
                        className="form-input w-full bg-gray-50 dark:bg-gray-700"
                        placeholder="0"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Offer Badge */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Offer Badge
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show_offer_badge"
                    name="show_offer_badge"
                    checked={formData.show_offer_badge}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  />
                  <label htmlFor="show_offer_badge" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Offer Badge
                  </label>
                </div>

                {formData.show_offer_badge && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      name="offer_badge_text"
                      value={formData.offer_badge_text}
                      onChange={handleInputChange}
                      className="form-input w-full"
                      placeholder="Limited Time Offer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Media & Display */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center space-x-2">
                  <PhotoIcon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    Media & Display
                  </h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thumbnail Image Path
                  </label>
                  <input
                    type="text"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="/api/placeholder/400/300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Order *
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    min="1"
                    className={`form-input w-full ${errors.display_order ? 'border-red-500' : ''}`}
                    placeholder="1"
                  />
                  {errors.display_order && <p className="text-red-500 text-sm mt-1">{errors.display_order}</p>}
                </div>
              </div>
            </div>
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
            className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <CheckIcon className="h-4 w-4 mr-2" />
            )}
            Update Course
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default EditCourse;
