import React, { useState, useEffect } from "react";
import galleryApi from "@/services/api/galleryApi";

// Icons
import {
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
  CloudArrowUpIcon,
  LinkIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

function GalleryItemModal({
  isOpen,
  mode,
  item,
  mediaType,
  pageSlug,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    is_media_remote: false,
    is_thumbnail_remote: false,
    media_path: "",
    thumbnail_path: "",
    file: null,
    thumbnail_file: null,
  });
  const [loading, setLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && item) {
        setFormData({
          title: item.title || "",
          caption: item.caption || "",
          is_media_remote: item.is_media_remote || false,
          is_thumbnail_remote: item.is_thumbnail_remote || false,
          media_path: item.is_media_remote ? item.media_path : "",
          thumbnail_path:
            item.is_thumbnail_remote && item.thumbnail_path
              ? item.thumbnail_path
              : "",
          file: null,
          thumbnail_file: null,
        });
        setMediaPreview(item.media_url || "");
        setThumbnailPreview(item.thumbnail_url || "");
      } else {
        setFormData({
          title: "",
          caption: "",
          is_media_remote: false,
          is_thumbnail_remote: false,
          media_path: "",
          thumbnail_path: "",
          file: null,
          thumbnail_file: null,
        });
        setMediaPreview("");
        setThumbnailPreview("");
      }
    }
  }, [isOpen, mode, item]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (fieldName === "file") {
          setMediaPreview(e.target.result);
        } else if (fieldName === "thumbnail_file") {
          setThumbnailPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData object
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("caption", formData.caption);
      submitData.append("media_type", mediaType);
      submitData.append("page_slug", pageSlug);
      submitData.append("is_media_remote", formData.is_media_remote);
      submitData.append("is_thumbnail_remote", formData.is_thumbnail_remote);

      if (formData.is_media_remote) {
        submitData.append("media_path", formData.media_path);
      } else if (formData.file) {
        submitData.append("file", formData.file);
      }

      if (mediaType === "video") {
        if (formData.is_thumbnail_remote) {
          submitData.append("thumbnail_path", formData.thumbnail_path);
        } else if (formData.thumbnail_file) {
          submitData.append("thumbnail", formData.thumbnail_file);
        }
      }

      let response;
      if (mode === "create") {
        response = await galleryApi.createGalleryItem(submitData);
      } else if (mode === "edit") {
        response = await galleryApi.updateGalleryItem(item.id, submitData);
      }

      if (response.success) {
        onSuccess();
      } else {
        console.error("Error:", response.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";
  const isVideo = mediaType === "video";

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
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900 sm:mx-0 sm:h-10 sm:w-10">
                  {isVideo ? (
                    <VideoCameraIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  ) : (
                    <PhotoIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  )}
                </div>
                <h3 className="ml-4 text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  {isViewMode && "View "}
                  {isEditMode && "Edit "}
                  {isCreateMode && "Create "}
                  {isVideo ? "Video" : "Image"}
                </h3>
              </div>

              {isViewMode ? (
                // View Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {item?.title}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Caption
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {item?.caption || "No caption"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Media Preview
                    </label>
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                      {isVideo ? (
                        <video
                          src={item?.media_url}
                          controls
                          className="w-full max-h-64 rounded-lg"
                          poster={item?.thumbnail_url}
                        />
                      ) : (
                        <img
                          src={item?.media_url}
                          alt={item?.title}
                          className="w-full max-h-64 object-contain rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Create/Edit Mode
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                      placeholder="Enter media title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Caption
                    </label>
                    <textarea
                      name="caption"
                      value={formData.caption}
                      onChange={handleInputChange}
                      rows="3"
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                      placeholder="Enter media caption"
                    />
                  </div>

                  {/* Media Remote Checkbox */}
                  <div className="flex items-center">
                    <input
                      id="is_media_remote"
                      name="is_media_remote"
                      type="checkbox"
                      checked={formData.is_media_remote}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label
                      htmlFor="is_media_remote"
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-100"
                    >
                      Media Remote (Use URL instead of file upload)
                    </label>
                  </div>

                  {/* Media Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {isVideo ? "Video" : "Image"}{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    {formData.is_media_remote ? (
                      <div className="relative">
                        <input
                          type="url"
                          name="media_path"
                          value={formData.media_path}
                          onChange={(e) => {
                            handleInputChange(e);
                            setMediaPreview(e.target.value);
                          }}
                          required
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                          placeholder={`Enter ${
                            isVideo ? "video" : "image"
                          } URL`}
                        />
                        <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    ) : (
                      <div className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg p-6">
                        <div className="text-center">
                          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-2">
                            <input
                              type="file"
                              name="file"
                              onChange={(e) => handleFileChange(e, "file")}
                              accept={isVideo ? "video/*" : "image/*"}
                              required={isCreateMode}
                              className="sr-only"
                              id="media-upload"
                            />
                            <label
                              htmlFor="media-upload"
                              className="cursor-pointer rounded-md font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500"
                            >
                              Upload {isVideo ? "video" : "image"}
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {isVideo
                                ? "MP4, AVI, MOV up to 50MB"
                                : "PNG, JPG, GIF up to 50MB"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail for Videos */}
                  {isVideo && (
                    <>
                      <div className="flex items-center">
                        <input
                          id="is_thumbnail_remote"
                          name="is_thumbnail_remote"
                          type="checkbox"
                          checked={formData.is_thumbnail_remote}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label
                          htmlFor="is_thumbnail_remote"
                          className="ml-2 block text-sm text-gray-900 dark:text-gray-100"
                        >
                          Thumbnail Remote (Use URL instead of file upload)
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Thumbnail
                        </label>

                        {formData.is_thumbnail_remote ? (
                          <div className="relative">
                            <input
                              type="url"
                              name="thumbnail_path"
                              value={formData.thumbnail_path}
                              onChange={(e) => {
                                handleInputChange(e);
                                setThumbnailPreview(e.target.value);
                              }}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                              placeholder="Enter thumbnail URL"
                            />
                            <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        ) : (
                          <div className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg p-4">
                            <div className="text-center">
                              <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                              <div className="mt-1">
                                <input
                                  type="file"
                                  name="thumbnail_file"
                                  onChange={(e) =>
                                    handleFileChange(e, "thumbnail_file")
                                  }
                                  accept="image/*"
                                  className="sr-only"
                                  id="thumbnail-upload"
                                />
                                <label
                                  htmlFor="thumbnail-upload"
                                  className="cursor-pointer rounded-md font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500"
                                >
                                  Upload thumbnail
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  PNG, JPG, GIF
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Media Preview */}
                  {mediaPreview && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preview
                      </label>
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                        {isVideo ? (
                          <video
                            src={mediaPreview}
                            controls
                            className="w-full max-h-48 rounded-lg"
                            poster={thumbnailPreview}
                          />
                        ) : (
                          <img
                            src={mediaPreview}
                            alt="Preview"
                            className="w-full max-h-48 object-contain rounded-lg"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-base font-medium text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalleryItemModal;
