import React, { useState, useEffect } from "react";
import { XMarkIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

function AddReviewModal({ isOpen, onClose, onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    review_text: "",
    rating: 0,
  });
  const [errors, setErrors] = useState({});
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      review_text: "",
      rating: 0,
    });
    setErrors({});
    setHoveredRating(0);
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.review_text.trim())
      newErrors.review_text = "Review is required";
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please select a rating";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      name: formData.name.trim(),
      mobile: formData.mobile.trim(),
      review_text: formData.review_text.trim(),
      rating: formData.rating,
    };

    await onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm"
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
        <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-0">
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Share Your Experience
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Help others by sharing your training journey
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-5 max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* Name & Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                  >
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-2">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                  >
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                  {errors.mobile && (
                    <p className="text-sm text-red-500 mt-2">{errors.mobile}</p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  How would you rate us? <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, rating: star }))
                      }
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      {star <= (hoveredRating || formData.rating) ? (
                        <StarIconSolid className="h-10 w-10 text-yellow-400" />
                      ) : (
                        <StarIcon className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                      )}
                    </button>
                  ))}
                  {formData.rating > 0 && (
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-3">
                      {formData.rating === 5 && "Excellent!"}
                      {formData.rating === 4 && "Great!"}
                      {formData.rating === 3 && "Good"}
                      {formData.rating === 2 && "Fair"}
                      {formData.rating === 1 && "Poor"}
                    </span>
                  )}
                </div>
                {errors.rating && (
                  <p className="text-sm text-red-500 mt-2">{errors.rating}</p>
                )}
              </div>

              {/* Review Text */}
              <div>
                <label
                  htmlFor="review_text"
                  className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                >
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="review_text"
                  name="review_text"
                  value={formData.review_text}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  placeholder="Tell us about your experience with our training program..."
                />
                {errors.review_text && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.review_text}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddReviewModal;
