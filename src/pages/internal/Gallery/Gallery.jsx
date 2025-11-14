import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import galleryApi from '@/services/api/galleryApi';
import GalleryItemModal from './components/GalleryItemModal';
import ConfirmDeleteModal from '@/components/common/Modal/ConfirmDeleteModal';

// Icons
import { 
  EyeIcon, 
  PencilIcon, 
  Bars3Icon, 
  PlusIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  VideoCameraIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const DraggableRow = ({ item, index, moveItem, onToggleStatus, onEdit, onView, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'galleryItem',
    item: { index, id: item.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'galleryItem',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <tr
      ref={(node) => drag(drop(node))}
      className={`border-b border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{item.id}</td>
      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100 font-medium">{item.display_order}</td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
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
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
              {item.title}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {item.caption}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.media_type === 'image' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
        }`}>
          {item.media_type === 'image' ? (
            <>
              <PhotoIcon className="h-3 w-3 mr-1" />
              Image
            </>
          ) : (
            <>
              <VideoCameraIcon className="h-3 w-3 mr-1" />
              Video
            </>
          )}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onToggleStatus(item.id)}
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
            onClick={() => onView(item)}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="View Item"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          
          {/* Edit */}
          <button
            onClick={() => onEdit(item)}
            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            title="Edit Item"
          >
            <PencilIcon className="h-4 w-4" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(item)}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete Item"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
          
          {/* Drag Handle */}
          <button
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-move"
            title="Change Order"
          >
            <Bars3Icon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

function Gallery() {
  const [activeTab, setActiveTab] = useState('images');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState({});
  const [modal, setModal] = useState({ isOpen: false, mode: '', item: null });
  const [saveOrderLoading, setSaveOrderLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Load gallery items
  useEffect(() => {
    loadGalleryItems();
  }, [activeTab]);

  const loadGalleryItems = async () => {
    try {
      setLoading(true);
      const mediaType = activeTab === 'images' ? 'image' : 'video';
      const pageSlug = activeTab === 'images' ? 'gallery_images' : 'gallery_videos';
      
      const response = await galleryApi.getGalleryItems({
        media_type: mediaType,
        page_slug: pageSlug
      });
      
      if (response.success) {
        setItems(response.data);
      }
    } catch (error) {
      console.error('Error loading gallery items:', error);
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

  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = items[dragIndex];
    const updatedItems = [...items];
    
    // Remove dragged item and insert at new position
    updatedItems.splice(dragIndex, 1);
    updatedItems.splice(hoverIndex, 0, draggedItem);
    
    // Update display order
    const itemsWithOrder = updatedItems.map((item, index) => ({
      ...item,
      display_order: index + 1
    }));
    
    setItems(itemsWithOrder);
  };

  const handleSaveOrder = async () => {
    setSaveOrderLoading(true);
    
    try {
      const itemOrders = items.map((item, index) => ({
        id: item.id,
        display_order: index + 1
      }));
      
      const response = await galleryApi.reorderGalleryItems(itemOrders);
      
      if (response.success) {
        // Success feedback could be added here
        console.log('Order saved successfully');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      // Revert on error
      loadGalleryItems();
    } finally {
      setSaveOrderLoading(false);
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
        loadGalleryItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleModalClose = () => {
    setModal({ isOpen: false, mode: '', item: null });
  };

  const handleModalSuccess = () => {
    loadGalleryItems();
    handleModalClose();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      </AdminLayout>
    );
  }

  const currentMediaType = activeTab === 'images' ? 'image' : 'video';
  const currentPageSlug = activeTab === 'images' ? 'gallery_images' : 'gallery_videos';

  return (
    <AdminLayout>
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Gallery Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your gallery images and videos with drag-and-drop ordering
          </p>
        </div>

        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <button
            onClick={handleSaveOrder}
            disabled={saveOrderLoading}
            className="btn bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 shadow-lg disabled:opacity-50"
          >
            {saveOrderLoading ? 'Saving...' : 'Save Order'}
          </button>
          <button
            onClick={handleCreate}
            className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Item
          </button>
        </div>
      </div>

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
            {activeTab === 'images' ? 'Images' : 'Videos'} ({items.length})
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No {activeTab === 'images' ? 'images' : 'videos'} found
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
          <DndProvider backend={HTML5Backend}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Media
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
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
                  {items.map((item, index) => (
                    <DraggableRow
                      key={item.id}
                      item={item}
                      index={index}
                      moveItem={moveItem}
                      onToggleStatus={handleToggleStatus}
                      onEdit={handleEdit}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </DndProvider>
        )}
      </div>

      {/* Modal */}
      <GalleryItemModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        item={modal.item}
        mediaType={currentMediaType}
        pageSlug={currentPageSlug}
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

export default Gallery;
