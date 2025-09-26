// Mock gallery data for development
const MOCK_GALLERY_ITEMS = [
  {
    id: 1,
    title: "Training Ground Overview",
    caption: "Students practicing excavator operations on the main training ground",
    slug: "training-ground-overview",
    media_type: "photo",
    page_slug: "image_gallery", // for main gallery
    is_media_remote: false,
    is_thumbnail_remote: false,
    media_path: "gallery/images/training-ground-1.jpg",
    media_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600",
    thumbnail_path: null,
    thumbnail_url: null,
    display_order: 1,
    is_active: true,
    created_by: 1,
    createdAt: "2025-08-18T10:30:00.000Z",
    updatedAt: "2025-08-18T10:30:00.000Z"
  },
  {
    id: 2,
    title: "Heavy Equipment Training",
    caption: "Professional training with modern excavation equipment",
    slug: "heavy-equipment-training",
    media_type: "photo",
    page_slug: "image_gallery",
    is_media_remote: false,
    is_thumbnail_remote: false,
    media_path: "gallery/images/heavy-equipment-2.jpg",
    media_url: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&h=600",
    thumbnail_path: null,
    thumbnail_url: null,
    display_order: 2,
    is_active: true,
    created_by: 1,
    createdAt: "2025-08-18T10:35:00.000Z",
    updatedAt: "2025-08-18T10:35:00.000Z"
  },
  {
    id: 3,
    title: "Excavator Training Video",
    caption: "Complete training session footage showing proper excavator operation techniques",
    slug: "excavator-training-video",
    media_type: "video",
    page_slug: "video_gallery",
    is_media_remote: false,
    is_thumbnail_remote: false,
    media_path: "gallery/videos/excavator-training.mp4",
    media_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail_path: "gallery/images/excavator-training-thumb.jpg",
    thumbnail_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300",
    display_order: 1,
    is_active: true,
    created_by: 1,
    createdAt: "2025-08-18T10:40:00.000Z",
    updatedAt: "2025-08-18T10:40:00.000Z"
  },
  {
    id: 4,
    title: "Construction Site Training",
    caption: "Real-world construction site training experience",
    slug: "construction-site-training",
    media_type: "photo",
    page_slug: "about-us", // for other pages
    is_media_remote: false,
    is_thumbnail_remote: false,
    media_path: "gallery/images/construction-site.jpg",
    media_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600",
    thumbnail_path: null,
    thumbnail_url: null,
    display_order: 1,
    is_active: true,
    created_by: 1,
    createdAt: "2025-08-18T10:45:00.000Z",
    updatedAt: "2025-08-18T10:45:00.000Z"
  }
];

// Mock pages data
const MOCK_PAGES = [
  { id: 1, name: "About Us", slug: "about-us" },
  { id: 2, name: "Courses", slug: "courses" },
  { id: 3, name: "Facilities", slug: "facilities" },
  { id: 4, name: "Contact", slug: "contact" }
];

// Simulated API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GalleryApi {
  // Get all gallery items with filtering
  async getGalleryItems(params = {}) {
    await delay(500);
    let items = [...MOCK_GALLERY_ITEMS];

    // Filter by page_slug
    if (params.page_slug) {
      items = items.filter(item => item.page_slug === params.page_slug);
    }

    // Filter by media_type
    if (params.media_type) {
      items = items.filter(item => item.media_type === params.media_type);
    }

    // Filter by status
    if (params.status === 'active') {
      items = items.filter(item => item.is_active);
    } else if (params.status === 'inactive') {
      items = items.filter(item => !item.is_active);
    }

    // Search in title/caption
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.caption.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by display_order
    items.sort((a, b) => a.display_order - b.display_order);

    // Apply pagination if needed
    if (params.page && params.limit) {
      const page = parseInt(params.page);
      const limit = parseInt(params.limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = items.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedItems,
        pagination: {
          page,
          limit,
          total: items.length,
          totalPages: Math.ceil(items.length / limit),
          hasNext: endIndex < items.length,
          hasPrev: page > 1
        },
        message: "Data retrieved successfully"
      };
    }

    return {
      success: true,
      data: items,
      message: "Data retrieved successfully"
    };
  }

  // Get single gallery item by ID
  async getGalleryItemById(id) {
    await delay(300);
    const item = MOCK_GALLERY_ITEMS.find(item => item.id === parseInt(id));
    
    if (item) {
      return {
        success: true,
        data: item,
        message: "Data retrieved successfully"
      };
    }

    return {
      success: false,
      data: null,
      message: "Gallery item not found"
    };
  }

  // Create new gallery item
  async createGalleryItem(formData) {
    await delay(1000);
    
    const newItem = {
      id: Math.max(...MOCK_GALLERY_ITEMS.map(item => item.id)) + 1,
      title: formData.get('title') || formData.title,
      caption: formData.get('caption') || formData.caption || '',
      slug: this.generateSlug(formData.get('title') || formData.title),
      media_type: formData.get('media_type') || formData.media_type,
      page_slug: formData.get('page_slug') || formData.page_slug,
      is_media_remote: formData.get('is_media_remote') === 'true' || formData.is_media_remote,
      is_thumbnail_remote: formData.get('is_thumbnail_remote') === 'true' || formData.is_thumbnail_remote,
      media_path: formData.get('media_path') || formData.media_path || `gallery/${formData.get('media_type') || formData.media_type}s/mock-${Date.now()}.jpg`,
      media_url: formData.get('media_path') || formData.media_path || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600",
      thumbnail_path: formData.get('thumbnail_path') || formData.thumbnail_path || null,
      thumbnail_url: formData.get('thumbnail_path') || formData.thumbnail_path || null,
      display_order: MOCK_GALLERY_ITEMS.length + 1,
      is_active: true,
      created_by: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    MOCK_GALLERY_ITEMS.push(newItem);

    return {
      success: true,
      data: newItem,
      message: "Gallery item created successfully"
    };
  }

  // Update existing gallery item
  async updateGalleryItem(id, formData) {
    await delay(800);
    const itemIndex = MOCK_GALLERY_ITEMS.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return {
        success: false,
        data: null,
        message: "Gallery item not found"
      };
    }

    const updatedItem = {
      ...MOCK_GALLERY_ITEMS[itemIndex],
      title: formData.get('title') || formData.title || MOCK_GALLERY_ITEMS[itemIndex].title,
      caption: formData.get('caption') || formData.caption || MOCK_GALLERY_ITEMS[itemIndex].caption,
      slug: this.generateSlug(formData.get('title') || formData.title || MOCK_GALLERY_ITEMS[itemIndex].title),
      media_type: formData.get('media_type') || formData.media_type || MOCK_GALLERY_ITEMS[itemIndex].media_type,
      page_slug: formData.get('page_slug') || formData.page_slug || MOCK_GALLERY_ITEMS[itemIndex].page_slug,
      is_media_remote: formData.get('is_media_remote') === 'true' || formData.is_media_remote || MOCK_GALLERY_ITEMS[itemIndex].is_media_remote,
      is_thumbnail_remote: formData.get('is_thumbnail_remote') === 'true' || formData.is_thumbnail_remote || MOCK_GALLERY_ITEMS[itemIndex].is_thumbnail_remote,
      media_path: formData.get('media_path') || formData.media_path || MOCK_GALLERY_ITEMS[itemIndex].media_path,
      media_url: formData.get('media_path') || formData.media_path || MOCK_GALLERY_ITEMS[itemIndex].media_url,
      thumbnail_path: formData.get('thumbnail_path') || formData.thumbnail_path || MOCK_GALLERY_ITEMS[itemIndex].thumbnail_path,
      thumbnail_url: formData.get('thumbnail_path') || formData.thumbnail_path || MOCK_GALLERY_ITEMS[itemIndex].thumbnail_url,
      updatedAt: new Date().toISOString()
    };

    MOCK_GALLERY_ITEMS[itemIndex] = updatedItem;

    return {
      success: true,
      data: updatedItem,
      message: "Gallery item updated successfully"
    };
  }

  // Delete gallery item
  async deleteGalleryItem(id) {
    await delay(500);
    const itemIndex = MOCK_GALLERY_ITEMS.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return {
        success: false,
        data: null,
        message: "Gallery item not found"
      };
    }

    MOCK_GALLERY_ITEMS.splice(itemIndex, 1);

    return {
      success: true,
      data: null,
      message: "Gallery item deleted successfully"
    };
  }

  // Update gallery item status
  async updateGalleryItemStatus(id, isActive) {
    await delay(400);
    const itemIndex = MOCK_GALLERY_ITEMS.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return {
        success: false,
        data: null,
        message: "Gallery item not found"
      };
    }

    MOCK_GALLERY_ITEMS[itemIndex] = {
      ...MOCK_GALLERY_ITEMS[itemIndex],
      is_active: isActive,
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: MOCK_GALLERY_ITEMS[itemIndex],
      message: "Gallery item status updated successfully"
    };
  }

  // Reorder gallery items (for drag & drop)
  async reorderGalleryItems(items) {
    await delay(600);
    
    // Update display_order for all items
    items.forEach(({ id, display_order }) => {
      const itemIndex = MOCK_GALLERY_ITEMS.findIndex(item => item.id === parseInt(id));
      if (itemIndex !== -1) {
        MOCK_GALLERY_ITEMS[itemIndex].display_order = display_order;
        MOCK_GALLERY_ITEMS[itemIndex].updatedAt = new Date().toISOString();
      }
    });

    return {
      success: true,
      data: null,
      message: "Gallery items reordered successfully"
    };
  }

  // Get pages for dropdown
  async getPages() {
    await delay(200);
    return {
      success: true,
      data: MOCK_PAGES,
      message: "Data retrieved successfully"
    };
  }

  // Helper method to generate slug from title
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
}

export default new GalleryApi();
