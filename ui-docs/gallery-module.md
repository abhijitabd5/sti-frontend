# Gallery Module - UI Component Guide

## Gallery Management Flow

### Managing Gallery Items
1. Admin navigates to Gallery Management page
2. Selects tab (Images or Videos)
3. Views list of gallery items with drag-and-drop ordering
4. Can perform actions: View, Edit, Delete, Toggle Status
5. Can reorder items by dragging rows
6. Clicks "Save Order" to persist changes

### Creating a Gallery Item
1. Admin clicks "Create Item" button
2. Modal opens with form
3. Fills required fields (Title, Media)
4. Optionally toggles "Add More Info" for additional fields
5. Uploads file or provides URL (for remote media)
6. For videos, optionally uploads thumbnail
7. Clicks "Create" button
8. System creates item and refreshes list

### Editing a Gallery Item
1. Admin clicks Edit icon on item row
2. Modal opens with pre-filled form
3. Modifies fields as needed
4. Clicks "Update" button
5. System updates item and refreshes list

### Viewing a Gallery Item
1. Admin clicks View icon on item row
2. Modal opens showing all item details
3. Displays media preview
4. Shows additional info if available

---

## API Endpoints

### Gallery Management
- `GET /internal/gallery` - Get gallery items (with filters)
- `POST /internal/gallery/create` - Create new gallery item
- `PUT /internal/gallery/edit/:id` - Update gallery item
- `PATCH /internal/gallery/status/:id` - Toggle item status
- `PATCH /internal/gallery/reorder` - Reorder gallery items
- `DELETE /internal/gallery/delete/:id` - Delete gallery item

### Pages
- `GET /internal/pages` - Get all pages

### Public
- `GET /public/gallery/item/:slug` - Get public gallery item by slug
- `GET /public/gallery/page/:pageSlug` - Get public gallery by page slug

---

## Gallery Management Page (`/admin/gallery`)

### Page Header
- **Title**: "Gallery Management"
- **Subtitle**: "Manage your gallery images and videos with drag-and-drop ordering"
- **Buttons**:
  - "Save Order" (blue-indigo-purple gradient)
  - "Create Item" (green gradient)

### Tabs
- **Images** (with photo icon)
- **Videos** (with video camera icon)

### Gallery Items Table

**Columns:**
- Order (display order number)
- Media (thumbnail with title and caption)
- Type (badge: Image or Video with icon)
- Status (toggle switch)
- Actions

**Media Column Display:**
- Thumbnail image (12x12, rounded)
- For videos: Thumbnail with video camera icon overlay
- Title (truncated)
- Caption (truncated, gray text)

**Type Badge:**
- Image: Blue background with photo icon
- Video: Purple background with video camera icon

**Action Buttons (per row):**
- View (eye icon)
- Edit (pencil icon)
- Delete (trash icon)
- Drag Handle (bars icon, for reordering)

### Drag and Drop
- Rows are draggable
- Hover over row to see drag cursor
- Drag row to new position
- Display order updates automatically
- Click "Save Order" to persist changes

### Empty State
- Shows when no items found
- Displays warning icon
- Message: "No images/videos found"
- Button: "Create Your First Image/Video"

---

## Create/Edit Gallery Item Modal

### Modal Header
- Icon: Photo (for images) or Video Camera (for videos)
- Title: "Create Image/Video" or "Edit Image/Video"
- Close button (X icon)

### Form Fields

#### Always Visible Fields:

**Add More Info Toggle:**
- Toggle switch to show/hide optional fields
- Auto-enabled in edit mode if any optional field has data

**Title** (required)
- Text input
- Placeholder: "Enter media title"

#### Optional Fields (shown when toggle enabled):

**Caption**
- Textarea (3 rows)
- Placeholder: "Enter media caption"

**Description**
- Textarea (4 rows)
- Placeholder: "Enter detailed description"

**Link Text**
- Text input
- Placeholder: "e.g., Learn More, View Details"

**Link URL**
- URL input
- Placeholder: "https://example.com"

#### Media Upload Section:

**Media Remote Checkbox:**
- Label: "Media Remote (Use URL instead of file upload)"
- When checked: Shows URL input
- When unchecked: Shows file upload

**Media Input (File Upload):**
- Drag-and-drop area with cloud upload icon
- Label: "Upload image/video"
- Accepted formats:
  - Images: PNG, JPG, GIF up to 50MB
  - Videos: MP4, AVI, MOV up to 50MB
- Required for create mode

**Media Input (URL):**
- URL input with link icon
- Placeholder: "Enter image/video URL"
- Shows preview when URL entered

#### Video-Specific Fields:

**Thumbnail Remote Checkbox:**
- Label: "Thumbnail Remote (Use URL instead of file upload)"
- When checked: Shows URL input
- When unchecked: Shows file upload

**Thumbnail Input (File Upload):**
- Smaller drag-and-drop area with photo icon
- Label: "Upload thumbnail"
- Accepted formats: PNG, JPG, GIF
- Optional

**Thumbnail Input (URL):**
- URL input with link icon
- Placeholder: "Enter thumbnail URL"

### Preview Section
- Shows when media is selected/uploaded
- For images: Image preview (max height 48)
- For videos: Video player with controls and thumbnail poster

### Form Actions
- **Cancel** button (gray)
- **Create/Update** button (green gradient)
- Loading state: "Saving..."

---

## View Gallery Item Modal

### Modal Header
- Icon: Photo or Video Camera
- Title: "View Image/Video"
- Close button (X icon)

### Fields Displayed:

**Always Shown:**
- Title

**Conditionally Shown (if data exists):**
- Caption
- Description
- Link Text
- Link URL

**Media Preview:**
- For images: Full image display (max height 64)
- For videos: Video player with controls and thumbnail

---

## Features

### Drag and Drop Reordering
- Uses react-dnd library
- HTML5 backend
- Rows are draggable by entire row or drag handle
- Visual feedback: Opacity 50% while dragging
- Order updates in real-time
- Must click "Save Order" to persist

### Toggle Status
- Toggle switch for active/inactive
- Green: Active
- Gray: Inactive
- Changes immediately (no save button needed)

### Media Types
- **Images**: Uploaded files or remote URLs
- **Videos**: Uploaded files or remote URLs with optional thumbnails

### Remote Media
- Allows using external URLs instead of uploading files
- Useful for CDN-hosted media
- Separate toggle for media and thumbnail (videos only)

### File Upload
- Drag-and-drop interface
- File size limit: 50MB
- Supported formats clearly indicated
- Preview shown after selection

### Auto-Save Order
- Order changes are local until "Save Order" clicked
- Batch update sent to backend
- Success/error toast notification

---

## Notes
- Gallery items are organized by page slug (gallery_images, gallery_videos)
- Display order starts from 1
- Drag-and-drop only works within same tab (images or videos)
- Remote media URLs must be publicly accessible
- Thumbnails are optional for videos but recommended
- All fields except Title and Media are optional
- "Add More Info" toggle helps keep form clean for simple items
- View mode only shows fields with data
- Edit mode pre-fills all fields and auto-enables "Add More Info" if needed
- Delete requires confirmation
- Status toggle is immediate (no confirmation)
- Save Order button only appears when items exist
