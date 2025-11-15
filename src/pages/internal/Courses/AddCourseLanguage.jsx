import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "@/components/common/Layouts/AdminLayout";
import courseApi from "@/services/api/courseApi";

// Icons
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

function AddCourseLanguage() {
  const navigate = useNavigate();
  const { id: courseGroupId } = useParams();
  const [loading, setLoading] = useState(false);
  const [baseCourse, setBaseCourse] = useState(null);
  const [hindiVersion, setHindiVersion] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description: "",
    features: "",
    syllabus_text: "",
    syllabus_file: null,
    offer_badge_text: "",
  });

  const [errors, setErrors] = useState({});

  // Load base course data and check for existing Hindi version
  useEffect(() => {
    loadBaseCourse();
  }, [courseGroupId]);

const loadBaseCourse = async () => {
  try {
    setInitialLoading(true);
    console.log("Course Group Id is ", courseGroupId);

    const response = await courseApi.getCourseVariantsByGroupId(courseGroupId);
    if (response.success) {
      const englishCourse = response.data.en;
      setBaseCourse(englishCourse);
        const hindiCourse = response.data.hi;
        
        if (hindiCourse) {
          // Hindi version exists, prefill form
          setHindiVersion(hindiCourse);
          setIsEditMode(true);
          setFormData({
            title: hindiCourse.title || "",
            summary: hindiCourse.summary || "",
            description: hindiCourse.description || "",
            features: hindiCourse.features || "",
            syllabus_text: hindiCourse.syllabus_text || "",
            syllabus_file: null,
            offer_badge_text: hindiCourse.offer_badge_text || "",
          });
        }
      // }
    } else {
      navigate("/admin/courses");
    }
  } catch (error) {
    console.error("Error loading base course:", error);
    navigate("/admin/courses");
  } finally {
    setInitialLoading(false);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle file inputs
    if (name === "syllabus_file") {
      const file = e.target.files[0] || null;
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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
      const courseData = {
        ...formData,
        language: "hi",
        duration: baseCourse.duration,
        course_group_id: baseCourse.course_group_id,
        base_course_fee: baseCourse.base_course_fee,
        is_discounted: baseCourse.is_discounted,
        discount_percentage: baseCourse.discount_percentage || 0,
        discount_amount: baseCourse.discount_amount || 0,
        hostel_available: baseCourse.hostel_available,
        hostel_fee: baseCourse.hostel_fee || 0,
        mess_available: baseCourse.mess_available,
        mess_fee: baseCourse.mess_fee || 0,
        show_offer_badge: baseCourse.show_offer_badge,
        offer_badge_text: formData.offer_badge_text || baseCourse.offer_badge_text,
        is_featured: baseCourse.is_featured,
        is_active: true,
        display_order: baseCourse.display_order,
        thumbnail: baseCourse.thumbnail,
      };

      let response;
      if (isEditMode) {
        // Update existing Hindi version
        response = await courseApi.updateCourse(hindiVersion.id, courseData);
      } else {
        // Create new Hindi version using the variant endpoint
        response = await courseApi.createCourseVariant(courseGroupId, courseData);
      }

      if (response.success) {
        navigate("/admin/courses", {
          state: {
            message: isEditMode
              ? "Hindi version updated successfully!"
              : "Hindi version added successfully!",
          },
        });
      } else {
        console.error('API returned success: false', response);
        alert('Failed to save Hindi version: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error("Error saving Hindi version:", error);
      console.error("Error response:", error.response?.data);
      alert('Error saving Hindi version: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/courses");
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
            <p className="text-gray-500 dark:text-gray-400">
              Base course not found
            </p>
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
              {isEditMode ? "Edit Hindi Version" : "Add Hindi Version"}
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isEditMode ? "Update" : "Add"} Hindi translation for "
            {baseCourse.title}"
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <div
        className={`border rounded-lg p-4 mb-6 ${
          isEditMode
            ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
            : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
        }`}
      >
        <div className="flex items-center space-x-2 mb-2">
          <InformationCircleIcon
            className={`h-5 w-5 ${
              isEditMode ? "text-yellow-500" : "text-blue-500"
            }`}
          />
          <h3
            className={`text-sm font-medium ${
              isEditMode
                ? "text-yellow-800 dark:text-yellow-200"
                : "text-blue-800 dark:text-blue-200"
            }`}
          >
            {isEditMode
              ? "Editing Existing Hindi Version"
              : "Important Information"}
          </h3>
        </div>
        <p
          className={`text-sm ${
            isEditMode
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-blue-600 dark:text-blue-400"
          }`}
        >
          {isEditMode
            ? "You are editing an existing Hindi version. Update the fields as needed."
            : "Pricing, discount settings, hostel & mess fees, thumbnail, and display order will be automatically copied from the English version."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Course Information (Hindi)
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Title (Hindi) *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`form-input w-full ${
                      errors.title ? "border-red-500" : ""
                    }`}
                    placeholder="कोर्स का शीर्षक हिंदी में दर्ज करें"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Summary (Hindi) *
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    rows={3}
                    className={`form-input w-full ${
                      errors.summary ? "border-red-500" : ""
                    }`}
                    placeholder="कोर्स का संक्षिप्त सारांश हिंदी में लिखें"
                  />
                  {errors.summary && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.summary}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Description (Hindi) *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={`form-input w-full ${
                      errors.description ? "border-red-500" : ""
                    }`}
                    placeholder="कोर्स का विस्तृत विवरण हिंदी में लिखें"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Features (Hindi) *
                  </label>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    rows={3}
                    className={`form-input w-full ${
                      errors.features ? "border-red-500" : ""
                    }`}
                    placeholder="कोर्स की विशेषताएं हिंदी में दर्ज करें (कॉमा से अलग करें, नई लाइन नहीं)"
                  />
                  {errors.features && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.features}
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
                    Syllabus (Optional)
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Syllabus Text (Hindi)
                  </label>
                  <textarea
                    name="syllabus_text"
                    value={formData.syllabus_text}
                    onChange={handleInputChange}
                    rows={6}
                    className="form-input w-full"
                    placeholder="सप्ताह-दर-सप्ताह पाठ्यक्रम विवरण हिंदी में दर्ज करें"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Syllabus PDF File (Hindi)
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
                        <XMarkIcon className="h-5 w-5" />
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

            {/* Offer Badge and Media - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Offer Badge */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    Offer Badge (Hindi)
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show_offer_badge"
                      checked={baseCourse?.show_offer_badge || false}
                      disabled
                      className="rounded border-gray-300 text-violet-600 focus:ring-violet-500 opacity-50"
                    />
                    <label
                      htmlFor="show_offer_badge"
                      className="text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Show Offer Badge (inherited from English)
                    </label>
                  </div>

                  {baseCourse?.show_offer_badge && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Badge Text (Hindi)
                      </label>
                      <input
                        type="text"
                        name="offer_badge_text"
                        value={formData.offer_badge_text}
                        onChange={handleInputChange}
                        className="form-input w-full"
                        placeholder="सीमित समय का ऑफर"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        English version: "{baseCourse.offer_badge_text}"
                      </p>
                    </div>
                  )}

                  {!baseCourse?.show_offer_badge && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Offer badge is not enabled for this course in the English version.
                    </p>
                  )}
                </div>
              </div>

              {/* Media */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                  <div className="flex items-center space-x-2">
                    <PhotoIcon className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      Media (Inherited)
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Thumbnail Image
                    </label>
                    {baseCourse?.thumbnail ? (
                      <div className="space-y-2">
                        <div className="relative inline-block">
                          <img
                            src={baseCourse.thumbnail}
                            alt="Course thumbnail"
                            className="h-32 w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Same thumbnail will be used for Hindi version
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 w-full bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                          <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            No thumbnail set
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Settings */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Course Settings
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Inherited from English version
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={`${baseCourse.duration} weeks`}
                    readOnly
                    className="form-input w-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="text"
                    value={`#${baseCourse.display_order}`}
                    readOnly
                    className="form-input w-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Group ID
                  </label>
                  <input
                    type="text"
                    value={baseCourse.course_group_id}
                    readOnly
                    className="form-input w-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckIcon className={`h-4 w-4 ${baseCourse.is_featured ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-gray-600 dark:text-gray-400">Featured</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckIcon className={`h-4 w-4 ${baseCourse.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-gray-600 dark:text-gray-400">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    Pricing
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Inherited from English version
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Base Course Fee
                  </label>
                  <input
                    type="text"
                    value={`₹${parseFloat(baseCourse.base_course_fee).toLocaleString("en-IN")}`}
                    readOnly
                    className="form-input w-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  />
                </div>

                {baseCourse.is_discounted && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Discount Percentage
                      </label>
                      <input
                        type="text"
                        value={`${baseCourse.discount_percentage}%`}
                        readOnly
                        className="form-input w-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Discount Amount
                      </label>
                      <input
                        type="text"
                        value={`₹${parseFloat(baseCourse.discount_amount || 0).toLocaleString("en-IN")}`}
                        readOnly
                        className="form-input w-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Final Price
                      </label>
                      <input
                        type="text"
                        value={`₹${parseFloat(baseCourse.discounted_course_fee || baseCourse.base_course_fee).toLocaleString("en-IN")}`}
                        readOnly
                        className="form-input w-full bg-gray-50 dark:bg-gray-700 text-green-600 dark:text-green-400 font-medium"
                      />
                    </div>
                  </>
                )}

                {/* Accommodation Options */}
                {(baseCourse.hostel_available || baseCourse.mess_available) && (
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Accommodation Options
                    </h4>

                    {baseCourse.hostel_available && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Hostel Fee
                        </label>
                        <input
                          type="text"
                          value={`₹${parseFloat(baseCourse.hostel_fee || 0).toLocaleString("en-IN")}`}
                          readOnly
                          className="form-input w-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        />
                      </div>
                    )}

                    {baseCourse.mess_available && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mess Fee
                        </label>
                        <input
                          type="text"
                          value={`₹${parseFloat(baseCourse.mess_fee || 0).toLocaleString("en-IN")}`}
                          readOnly
                          className="form-input w-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        />
                      </div>
                    )}
                  </div>
                )}
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
            className="btn bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <CheckIcon className="h-4 w-4 mr-2" />
            )}
            {isEditMode ? 'Update Hindi Version' : 'Add Hindi Version'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default AddCourseLanguage;
