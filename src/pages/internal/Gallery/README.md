# Gallery Management System

This module provides comprehensive gallery management functionality for the STI Training Institute frontend application.

## Features

### Main Gallery Page (`/admin/gallery`)
- **Tabbed Interface**: Separate tabs for Images and Videos
- **Drag & Drop Ordering**: Reorder items using drag and drop functionality
- **Save Order Button**: Persist the new order to the backend
- **CRUD Operations**: Create, Read, Update, Delete gallery items
- **Status Toggle**: Enable/disable gallery items
- **Media Preview**: View thumbnails and media previews

### Other Gallery Page (`/admin/gallery/other`)
- **Page Selection**: Select specific pages from dropdown
- **Tabbed Interface**: Images and Videos tabs (same as main gallery)
- **CRUD Operations**: Full CRUD functionality without drag & drop
- **Page-specific Content**: Manage content for different website pages

### Gallery Item Modal
- **Multi-mode Modal**: Create, Edit, and View modes
- **Media Upload**: Support for both file upload and remote URLs
- **Conditional Fields**: Dynamic form fields based on media type
- **Media Preview**: Live preview of uploaded/selected media
- **Video Thumbnails**: Dedicated thumbnail management for videos

## File Structure

```
src/pages/internal/Gallery/
├── Gallery.jsx                 # Main gallery page with drag & drop
├── OtherGallery.jsx            # Page-specific gallery management
├── components/
│   └── GalleryItemModal.jsx    # Modal for CRUD operations
└── README.md                   # This documentation
```

## API Integration

The system uses the `galleryApi` service located at `src/services/api/galleryApi.js`:

- `getGalleryItems()` - Fetch gallery items with filtering
- `createGalleryItem()` - Create new gallery items
- `updateGalleryItem()` - Update existing items
- `deleteGalleryItem()` - Delete gallery items
- `updateGalleryItemStatus()` - Toggle active/inactive status
- `reorderGalleryItems()` - Save drag & drop order
- `getPages()` - Fetch available pages for dropdown

## Key Implementation Details

### Drag & Drop
- Uses `react-dnd` and `react-dnd-html5-backend` libraries
- Optimistic updates with server sync
- Fallback to reload on error

### Media Handling
- Support for both local file uploads and remote URLs
- Automatic preview generation
- Video thumbnail management
- File type validation

### Form Management
- Uses FormData for file uploads
- Conditional field rendering based on media type
- Real-time preview updates

### Styling
- Consistent with existing theme patterns from `Courses.jsx`
- Dark mode support
- Responsive design
- Loading states and animations

## Usage

1. Navigate to `/admin/gallery` for main gallery management
2. Navigate to `/admin/gallery/other` for page-specific content
3. Use the tabs to switch between Images and Videos
4. Click "Create Item" to add new media
5. Use drag & drop to reorder items (main gallery only)
6. Click "Save Order" to persist changes
7. Use action buttons for View, Edit, and Delete operations

## Notes

- Image gallery items use `page_slug: "image_gallery"`
- Video gallery items use `page_slug: "video_gallery"`
- Other gallery items use the selected page's slug
- Media type is automatically set based on the active tab
- Display order is managed automatically but can be customized via drag & drop
