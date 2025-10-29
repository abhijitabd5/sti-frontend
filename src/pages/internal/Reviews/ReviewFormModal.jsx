import React, { useState, useEffect } from "react";
import { XMarkIcon, PhotoIcon, StarIcon } from "@heroicons/react/24/outline";

function ReviewFormModal({
  isOpen,
  onClose,
  onSubmit,
  review = null,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    mobile: "",
    enrolled_course: "",
    review_text: "",
    rating: 5,
    recruited_at: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (review) {
      setFormData({
        name: review.name || "",
        city: review.city || "",
        mobile: review.mobile || "",
        enrolled_course: review.enrolled_course || "",
        review_text: review.review_text || "",
        rating: review.rating || 5,
        recruited_at: review.recruited_at || "",
      });
      if (review.profile_photo) {
        setPhotoPreview(review.profile_photo);
      }
    } else {
      resetForm();
    }
  }, [review, isOpen]);

  const resetForm = () => {
    setFormData({
      name: "",
      city: "",
      mobile: "",
      enrolled_course: "",
      review_text: "",
      rating: 5,
      recruited_at: "",
    });
    setProfilePhoto(null);
    setPhotoPreview(null);
    setErrors({});
  };

  // Close on ESC key
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!isOpen || keyCode !== 27) return;
      onClose();
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, file: "Please select an image file" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          file: "File size should not exceed 5MB",
        }));
        return;
      }
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.review_text.trim())
      newErrors.review_text = "Review text is required";
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 1 and 5";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = new FormData();
    submitData.append("name", formData.name.trim());
    submitData.append("city", formData.city.trim());
    submitData.append("mobile", formData.mobile.trim());
    submitData.append("enrolled_course", formData.enrolled_course.trim());
    submitData.append("review_text", formData.review_text.trim());
    submitData.append("rating", formData.rating);
    submitData.append("recruited_at", formData.recruited_at.trim());

    if (profilePhoto) {
      submitData.append("file", profilePhoto);
    }

    await onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500/60 dark:bg-gray-900/70"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Center modal alignment helper */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="relative z-[10000] inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {review ? "Edit Review" : "Create Review"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4">
              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-4">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <PhotoIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <label className="cursor-pointer btn bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700/60 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/80">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    Choose File
                  </label>
                </div>
                {errors.file && (
                  <p className="text-sm text-red-500 mt-1">{errors.file}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input w-full"
                  placeholder="Enter name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* City & Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-input w-full"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2"
                  >
                    Mobile
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="form-input w-full"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              {/* Enrolled Course & Recruited At */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="enrolled_course"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2"
                  >
                    Enrolled Course
                  </label>
                  <input
                    type="text"
                    id="enrolled_course"
                    name="enrolled_course"
                    value={formData.enrolled_course}
                    onChange={handleChange}
                    className="form-input w-full"
                    placeholder="Enter course name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="recruited_at"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2"
                  >
                    Recruited At
                  </label>
                  <input
                    type="text"
                    id="recruited_at"
                    name="recruited_at"
                    value={formData.recruited_at}
                    onChange={handleChange}
                    className="form-input w-full"
                    placeholder="Enter company/recruiter name"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2"
                >
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, rating: star }))
                      }
                      className="focus:outline-none transition-colors"
                    >
                      <StarIcon
                        className={`h-8 w-8 ${
                          star <= formData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {formData.rating} / 5
                  </span>
                </div>
                {errors.rating && (
                  <p className="text-sm text-red-500 mt-1">{errors.rating}</p>
                )}
              </div>

              {/* Review Text */}
              <div>
                <label
                  htmlFor="review_text"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2"
                >
                  Review Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="review_text"
                  name="review_text"
                  value={formData.review_text}
                  onChange={handleChange}
                  rows="4"
                  className="form-input w-full"
                  placeholder="Enter review text"
                />
                {errors.review_text && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.review_text}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700/60 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700/60 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/80"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {review ? "Updating..." : "Creating..."}
                  </div>
                ) : review ? (
                  "Update Review"
                ) : (
                  "Create Review"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReviewFormModal;
