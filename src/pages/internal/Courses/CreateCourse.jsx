import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "@/components/common/Layouts/AdminLayout";
import courseApi from "@/services/api/courseApi";

// Icons
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  CheckIcon,
  XMarkIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    language: "en",
    summary: "",
    description: "",
    duration: "",
    syllabus_text: "",
    syllabus_file: null,
    base_course_fee: "",
    is_discounted: false,
    discount_amount: "",
    discount_percentage: "",
    show_offer_badge: false,
    offer_badge_text: "",
    hostel_available: false,
    hostel_fee: "",
    mess_available: false,
    mess_fee: "",
    is_featured: false,
    is_active: true,
    thumbnail: null,
    display_order: "",
    course_group_id: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Auto-calculate discount percentage and amount
    if (name === "base_course_fee" || name === "discount_percentage") {
      const baseFee =
        name === "base_course_fee"
          ? parseFloat(value) || 0
          : parseFloat(formData.base_course_fee) || 0;
      const discountPercentage =
        name === "discount_percentage"
          ? parseFloat(value) || 0
          : parseFloat(formData.discount_percentage) || 0;

      if (baseFee > 0 && discountPercentage > 0) {
        const discountAmount = (baseFee * discountPercentage) / 100;
        setFormData((prev) => ({
          ...prev,
          [name]: newValue,
          discount_amount: discountAmount.toFixed(2),
        }));
      }
    }

    // Handle file inputs
    if (name === "syllabus_file" || name === "thumbnail") {
      const file = e.target.files[0] || null;
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      return;
    }
  };

  const handleClearFile = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Course summary is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Course description is required";
    }

    if (!formData.features.trim()) {
      newErrors.features = "Course features is required";
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = "Valid duration is required";
    }

    if (!formData.base_course_fee || formData.base_course_fee <= 0) {
      newErrors.base_course_fee = "Valid base course fee is required";
    }

    if (formData.is_discounted) {
      if (!formData.discount_percentage || formData.discount_percentage <= 0) {
        newErrors.discount_percentage =
          "Valid discount percentage is required when discount is enabled";
      }
    }

    if (!formData.display_order || formData.display_order <= 0) {
      newErrors.display_order = "Valid display order is required";
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
      // Prepare form data for submission
      const courseData = {
        ...formData,
        duration: parseInt(formData.duration),
        base_course_fee: parseFloat(formData.base_course_fee),
        discount_amount: formData.is_discounted
          ? parseFloat(formData.discount_amount)
          : 0,
        discount_percentage: formData.is_discounted
          ? parseFloat(formData.discount_percentage)
          : 0,
        hostel_fee: formData.hostel_available
          ? parseFloat(formData.hostel_fee || 0)
          : 0,
        mess_fee: formData.mess_available
          ? parseFloat(formData.mess_fee || 0)
          : 0,
        display_order: parseInt(formData.display_order),
      };

      const response = await courseApi.createCourse(courseData);

      if (response.success) {
        navigate("/admin/courses", {
          state: { message: "Course created successfully!" },
        });
      }
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/courses");
  };

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
              Create New Course
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add a new training course to your curriculum
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
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
                    className={`form-input w-full ${
                      errors.title ? "border-red-500" : ""
                    }`}
                    placeholder="Enter course title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
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
                    className={`form-input w-full ${
                      errors.summary ? "border-red-500" : ""
                    }`}
                    placeholder="Brief summary of the course"
                  />
                  {errors.summary && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.summary}
                    </p>
                  )}
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
                    className={`form-input w-full ${
                      errors.description ? "border-red-500" : ""
                    }`}
                    placeholder="Detailed description of the course"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Features *
                  </label>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    rows={3}
                    className={`form-input w-full ${
                      errors.features ? "border-red-500" : ""
                    }`}
                    placeholder="Enter course features separated by commas (No new lines)"
                  />
                  {errors.features && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.features}
                    </p>
                  )}
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
                    className={`form-input w-full ${
                      errors.duration ? "border-red-500" : ""
                    }`}
                    placeholder="Course duration in weeks"
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.duration}
                    </p>
                  )}
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
                    Syllabus PDF
                  </label>
                  {formData.syllabus_file ? (
                    <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <DocumentTextIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-900 dark:text-green-300 truncate">
                          {formData.syllabus_file.name}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-400">
                          {(formData.syllabus_file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleClearFile('syllabus_file')}
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      name="syllabus_file"
                      onChange={handleInputChange}
                      className="form-input w-full"
                      accept="application/pdf"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
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
                    Base Course Fee *
                  </label>
                  <input
                    type="number"
                    name="base_course_fee"
                    value={formData.base_course_fee}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`form-input w-full ${
                      errors.base_course_fee ? "border-red-500" : ""
                    }`}
                    placeholder="0.00"
                  />
                  {errors.base_course_fee && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.base_course_fee}
                    </p>
                  )}
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
                  <label
                    htmlFor="is_discounted"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Apply Discount
                  </label>
                </div>

                {formData.is_discounted && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Discount Percentage *
                      </label>
                      <input
                        type="number"
                        name="discount_percentage"
                        value={formData.discount_percentage}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="0.01"
                        className={`form-input w-full ${
                          errors.discount_percentage ? "border-red-500" : ""
                        }`}
                        placeholder="0.00"
                      />
                      {errors.discount_percentage && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.discount_percentage}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Discount Amount
                      </label>
                      <input
                        type="number"
                        name="discount_amount"
                        value={formData.discount_amount}
                        readOnly
                        className="form-input w-full bg-gray-50 dark:bg-gray-700"
                        placeholder="0.00"
                      />
                    </div>
                  </>
                )}

                {/* Accommodation Options */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Accommodation Options
                  </h4>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hostel_available"
                      name="hostel_available"
                      checked={formData.hostel_available}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <label
                      htmlFor="hostel_available"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Hostel Available
                    </label>
                  </div>

                  {formData.hostel_available && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hostel Fee
                      </label>
                      <input
                        type="number"
                        name="hostel_fee"
                        value={formData.hostel_fee}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="form-input w-full"
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mess_available"
                      name="mess_available"
                      checked={formData.mess_available}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <label
                      htmlFor="mess_available"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Mess Available
                    </label>
                  </div>

                  {formData.mess_available && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mess Fee
                      </label>
                      <input
                        type="number"
                        name="mess_fee"
                        value={formData.mess_fee}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="form-input w-full"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
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
                  <label
                    htmlFor="show_offer_badge"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
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

            {/* Media */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center space-x-2">
                  <PhotoIcon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    Media
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thumbnail Image
                  </label>
                  {formData.thumbnail ? (
                    <div className="space-y-2">
                      <div className="relative inline-block">
                        <img
                          src={URL.createObjectURL(formData.thumbnail)}
                          alt="Thumbnail preview"
                          className="h-32 w-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <PhotoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-300 truncate">
                            {formData.thumbnail.name}
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-400">
                            {(formData.thumbnail.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleClearFile('thumbnail')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <input
                      type="file"
                      name="thumbnail"
                      onChange={handleInputChange}
                      className="form-input w-full"
                      accept="image/*"
                    />
                  )}
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Course Settings
                  </h4>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <label
                      htmlFor="is_featured"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Featured Course
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <label
                      htmlFor="is_active"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Active Course
                    </label>
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
                      className={`form-input w-full ${
                        errors.display_order ? "border-red-500" : ""
                      }`}
                      placeholder="1"
                    />
                    {errors.display_order && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.display_order}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Group ID *
                    </label>
                    <input
                      type="number"
                      name="course_group_id"
                      value={formData.course_group_id}
                      onChange={handleInputChange}
                      min="1"
                      className="form-input w-full"
                      placeholder="Enter course group ID"
                    />
                  </div>
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
            Create Course
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default CreateCourse;
