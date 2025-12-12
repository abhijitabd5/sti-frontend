import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import galleryApi from '@/services/api/galleryApi';
import OtherGalleryItemModal from './components/OtherGalleryItemModal';
import ConfirmDeleteModal from '@/components/common/Modal/ConfirmDeleteModal';

// Icons
import { 
  EyeIcon, 
  PencilIcon, 
  PlusIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  VideoCameraIcon,
  TrashIcon,
  ChevronDownIcon,
  ClipboardIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

function OtherGallery() {
  const [activeTab, setActiveTab] = useState('images');
  const [selectedPage, setSelectedPage] = useState('');
  const [pages, setPages] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [modal, setModal] = useState({ isOpen: false, mode: '', item: null });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Load pages
  useEffect(() => {
    loadPages();
  }, []);

  // Load gallery items when tab or page changes
  useEffect(() => {
    if (selectedPage) {
      setPagination(prev => ({ ...prev, page: 1 }));
      loadGalleryItems(1);
    }
  }, [activeTab, selectedPage]);

  const loadPages = async () => {
    try {
      const response = await galleryApi.getAllPages();
      if (response.success) {
        // Filter out gallery_image and gallery_video pages
        const filteredPages = (response.data || []).filter(
          page => page.slug !== 'gallery_images' && page.slug !== 'gallery_videos'
        );
        setPages(filteredPages);
        if (filteredPages.length > 0) {
          setSelectedPage(filteredPages[0].slug);
        }
      }
    } catch (error) {
      console.error('Error loading pages:', error);
    }
  };

  const loadGalleryItems = async (page = pagination.page) => {
    try {
      setLoading(true);
      const mediaType = activeTab === 'images' ? 'image' : 'video';
      
      const response = await galleryApi.getGalleryItems({
        media_type: mediaType,
        page_slug: selectedPage,
        limit: 'all'
      });
      
      if (response.success) {
        setItems(response.data || []);
        if (response.pagination) {
          setPagination({
            page: response.pagination.page || page,
            limit: response.pagination.limit || 10,
            total: response.pagination.total || 0,
            totalPages: response.pagination.totalPages || 0,
          });
        }
      }
    } catch (error) {
      console.error('Error loading gallery items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (itemId) => {
    setStatusLoading(prev => ({ ...prev, [itemId]: true }));
    
    try {
      const item = items.find(item => item.id === itemId);
      const response = await galleryApi.updateGalleryItemStatus(itemId, !item.is_active);
      
      if (response.success) {
        setItems(prev => 
          prev.map(item => 
            item.id === itemId 
              ? { ...item, is_active: response.data.is_active }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    } finally {
      setStatusLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleCreate = () => {
    setModal({ 
      isOpen: true, 
      mode: 'create', 
      item: null 
    });
  };

  const handleEdit = (item) => {
    setModal({ 
      isOpen: true, 
      mode: 'edit', 
      item 
    });
  };

  const handleView = (item) => {
    setModal({ 
      isOpen: true, 
      mode: 'view', 
      item 
    });
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      const response = await galleryApi.deleteGalleryItem(deleteTarget.id);
      if (response.success) {
        setDeleteTarget(null);
        loadGalleryItems(pagination.page);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleModalClose = () => {
    setModal({ isOpen: false, mode: '', item: null });
  };

  const handleModalSuccess = () => {
    loadGalleryItems(pagination.page);
    handleModalClose();
  };

  const currentMediaType = activeTab === 'images' ? 'image' : 'video';
  const selectedPageName = pages.find(page => page.slug === selectedPage)?.name || selectedPage;

  return (
    <AdminLayout>
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Other Gallery Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage page-specific gallery images and videos
          </p>
        </div>

        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <button
            onClick={handleCreate}
            disabled={!selectedPage}
            className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg disabled:opacity-50"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Item
          </button>
        </div>
      </div>

      {/* Page Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Page
        </label>
        <div className="relative">
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="appearance-none block w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
          >
            <option value="">Choose a page...</option>
            {pages.map((page) => (
              <option key={page.slug} value={page.slug}>
                {page.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {selectedPage && (
        <>
          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('images')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'images'
                      ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <PhotoIcon className="h-5 w-5 inline-block mr-2" />
                  Images
                </button>
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'videos'
                      ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <VideoCameraIcon className="h-5 w-5 inline-block mr-2" />
                  Videos
                </button>
              </nav>
            </div>
          </div>

          {/* Gallery Items Table */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                {selectedPageName} - {activeTab === 'images' ? 'Images' : 'Videos'} ({items.length})
              </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No {activeTab === 'images' ? 'images' : 'videos'} found for {selectedPageName}
                </p>
                <button
                  onClick={handleCreate}
                  className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Your First {activeTab === 'images' ? 'Image' : 'Video'}
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Media
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{item.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex-shrink-0">
                            {item.media_type === 'image' ? (
                              <img 
                                src={item.media_url} 
                                alt={item.title}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="relative">
                                <img 
                                  src={item.thumbnail_url || item.media_url} 
                                  alt={item.title}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                                  <VideoCameraIcon className="h-5 w-5 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                            {item.title}
                          </p>
                          {item.caption && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {item.caption}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-800 dark:text-gray-100">
                              {item.slug || '-'}
                            </span>
                            {item.slug && (
                              <button
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(item.slug);
                                    setCopiedSlug(item.id);
                                    setTimeout(() => setCopiedSlug(null), 2000);
                                  } catch (err) {
                                    console.error('Failed to copy:', err);
                                  }
                                }}
                                className="p-1 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                title={copiedSlug === item.id ? "Copied!" : "Copy slug"}
                              >
                                {copiedSlug === item.id ? (
                                  <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <ClipboardIcon className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleStatus(item.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
                              item.is_active
                                ? 'bg-green-600'
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                item.is_active ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {/* View */}
                            <button
                              onClick={() => handleView(item)}
                              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              title="View Item"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            
                            {/* Edit */}
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                              title="Edit Item"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              title="Delete Item"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && items.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {items.length > 0 ? ((pagination.page - 1) * pagination.limit + 1) : 0} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} items
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadGalleryItems(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    Page {pagination.page} of {Math.max(1, pagination.totalPages)}
                  </span>
                  <button
                    onClick={() => loadGalleryItems(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal */}
      <OtherGalleryItemModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        item={modal.item}
        mediaType={currentMediaType}
        pageSlug={selectedPage}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Gallery Item"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </AdminLayout>
  );
}

export default OtherGallery;
