#### Response (201 Created)
```json
{
  "success": true,
  "message": "Gallery item created successfully",
  "data": {
    "id": 1,
    "title": "Training Ground View",
    "caption": "Students practicing excavator operations",
    "slug": "training-ground-view",
    "media_type": "photo",
    "page_slug": "about-us",
    "is_media_remote": false,
    "is_thumbnail_remote": false,
    "media_path": "gallery/images/1692345678-abc123.jpg",
    "media_url": "https://storage.example.com/gallery/images/1692345678-abc123.jpg",
    "thumbnail_path": null,
    "thumbnail_url": null,
    "display_order": 0,
    "is_active": true,
    "created_by": 1,
    "createdAt": "2025-08-18T10:30:00.000Z",
    "updatedAt": "2025-08-18T10:30:00.000Z"
  },
  "timestamp": "2025-08-18T10:30:00.123Z"
}
```

### Example Video Response with Thumbnail:
```json
{
  "success": true,
  "message": "Gallery item created successfully",
  "data": {
    "id": 2,
    "title": "Excavator Training Video",
    "caption": "Complete training session footage",
    "slug": "excavator-training-video",
    "media_type": "video",
    "page_slug": "courses",
    "is_media_remote": false,
    "is_thumbnail_remote": false,
    "media_path": "gallery/videos/1692345999-def456.mp4",
    "media_url": "https://storage.example.com/gallery/videos/1692345999-def456.mp4",
    "thumbnail_path": "gallery/images/1692345999-thumb123.jpg",
    "thumbnail_url": "https://storage.example.com/gallery/images/1692345999-thumb123.jpg",
    "display_order": 1,
    "is_active": true,
    "created_by": 1,
    "createdAt": "2025-08-18T10:35:00.000Z",
    "updatedAt": "2025-08-18T10:35:00.000Z"
  },
  "timestamp": "2025-08-18T10:35:00.123Z"
}
```
    # Gallery Management API Documentation

## Overview
The Gallery Management API provides comprehensive functionality for managing photo and video galleries across different pages of the Earth Movers Training Academy website. It supports both internal management operations for staff and public access for website visitors.

## Base URLs
- **Internal Management:** `/api/internal/gallery`
- **Public Website:** `/api/public/gallery`

## Authentication
- **Internal APIs:** Require JWT authentication with roles: `super_admin`, `admin`, or `seo`
- **Public APIs:** No authentication required

---

## Internal Management APIs

### 1. Create Gallery Item
**POST** `/api/internal/gallery`

Creates a new gallery item with image/video upload or remote URL.

#### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

#### Request Body (Form Data)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | File | Conditional | Image/video file (required if not using remote URL) |
| thumbnail | File | Conditional | Thumbnail image for videos (required for videos if not using remote thumbnail) |
| title | String | Yes | Gallery item title |
| caption | String | No | Item caption/description |
| media_type | String | Yes | Either "photo" or "video" |
| page_slug | String | Yes | Page identifier where item appears |
| display_order | Integer | No | Sort order (default: 0) |
| is_media_remote | Boolean | No | Use remote media URL (default: false) |
| is_thumbnail_remote | Boolean | No | Use remote thumbnail URL for videos (default: false) |
| media_path | String | Conditional | Remote media URL (if is_media_remote = true) |
| thumbnail_path | String | Conditional | Remote thumbnail URL for videos (if is_thumbnail_remote = true) |

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Gallery item created successfully",
  "data": {
    "id": 1,
    "title": "Training Ground View",
    "caption": "Students practicing excavator operations",
    "slug": "training-ground-view",
    "media_type": "photo",
    "page_slug": "about-us",
    "is_media_remote": false,
    "media_path": "gallery/images/1692345678-abc123.jpg",
    "media_url": "https://storage.example.com/gallery/images/1692345678-abc123.jpg",
    "display_order": 0,
    "is_active": true,
    "created_by": 1,
    "createdAt": "2025-08-18T10:30:00.000Z",
    "updatedAt": "2025-08-18T10:30:00.000Z"
  },
  "timestamp": "2025-08-18T10:30:00.123Z"
}
```

---

### 2. Update Gallery Item
**PUT** `/api/internal/gallery/:id`

Updates an existing gallery item. Can update metadata and/or replace the file.

#### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Gallery item ID |

#### Request Body (Form Data)
Same fields as create, all optional except those required for validation.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Gallery item updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Training Ground View",
    "caption": "Students practicing advanced excavator operations",
    "slug": "updated-training-ground-view",
    "media_type": "photo",
    "page_slug": "about-us",
    "is_media_remote": false,
    "media_path": "gallery/images/1692345999-xyz789.jpg",
    "media_url": "https://storage.example.com/gallery/images/1692345999-xyz789.jpg",
    "display_order": 5,
    "is_active": true,
    "updated_by": [
      { "id": "1", "timestamp": "2025-08-18T10:45:00Z" }
    ],
    "updatedAt": "2025-08-18T10:45:00.000Z"
  },
  "timestamp": "2025-08-18T10:45:00.123Z"
}
```

---

### 3. Delete Gallery Item
**DELETE** `/api/internal/gallery/:id`

Soft deletes a gallery item (sets is_deleted = true).

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Gallery item ID |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Gallery item deleted successfully",
  "data": null,
  "timestamp": "2025-08-18T10:50:00.123Z"
}
```

---

### 4. Update Gallery Item Status
**PATCH** `/api/internal/gallery/:id/status`

Activates or deactivates a gallery item.

#### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Gallery item ID |

#### Request Body
```json
{
  "is_active": true
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Gallery item status updated successfully",
  "data": {
    "id": 1,
    "title": "Training Ground View",
    "is_active": true,
    "updated_by": [
      { "id": "1", "timestamp": "2025-08-18T11:00:00Z" }
    ],
    "updatedAt": "2025-08-18T11:00:00.000Z"
  },
  "timestamp": "2025-08-18T11:00:00.123Z"
}
```

---

### 5. Get All Gallery Items
**GET** `/api/internal/gallery`

Retrieves all gallery items with filtering, searching, and pagination.

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Query Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| page | Integer | Page number (default: 1) | `?page=2` |
| limit | Integer | Items per page (default: 20) | `?limit=10` |
| page_slug | String | Filter by page | `?page_slug=about-us` |
| media_type | String | Filter by type | `?media_type=photo` |
| status | String | Filter by status | `?status=active` |
| search | String | Search in title/caption | `?search=training` |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Training Ground View",
      "caption": "Students practicing excavator operations",
      "slug": "training-ground-view",
      "media_type": "photo",
      "page_slug": "about-us",
      "media_url": "https://storage.example.com/gallery/images/1692345678-abc123.jpg",
      "display_order": 0,
      "is_active": true,
      "createdAt": "2025-08-18T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2025-08-18T11:05:00.123Z"
}
```

---

### 6. Get Single Gallery Item
**GET** `/api/internal/gallery/:id`

Retrieves a specific gallery item by ID.

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Gallery item ID |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "title": "Training Ground View",
    "caption": "Students practicing excavator operations",
    "slug": "training-ground-view",
    "media_type": "photo",
    "page_slug": "about-us",
    "is_image_remote": false,
    "image_path": "gallery/images/1692345678-abc123.jpg",
    "image_url": "https://storage.example.com/gallery/images/1692345678-abc123.jpg",
    "display_order": 0,
    "is_active": true,
    "created_by": 1,
    "updated_by": [],
    "createdAt": "2025-08-18T10:30:00.000Z",
    "updatedAt": "2025-08-18T10:30:00.000Z"
  },
  "timestamp": "2025-08-18T11:10:00.123Z"
}
```

---

### 7. Bulk Upload Gallery Items
**POST** `/api/internal/gallery/bulk`

Uploads multiple images at once.

#### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

#### Request Body (Form Data)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| files | File[] | Yes | Array of image files (max 20) |
| title | String | No | Base title (will be numbered) |
| caption | String | No | Caption for all items |
| page_slug | String | Yes | Page identifier |
| display_order | Integer | No | Starting display order |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "15 items uploaded successfully, 2 failed",
  "data": {
    "successful": [
      {
        "id": 10,
        "title": "Gallery Item 1",
        "slug": "gallery-item-1",
        "image_url": "https://storage.example.com/gallery/images/1692345678-abc123.jpg"
      }
    ],
    "failed": [
      {
        "index": 5,
        "error": "Invalid file type"
      }
    ],
    "total_processed": 17,
    "successful_count": 15,
    "failed_count": 2
  },
  "timestamp": "2025-08-18T11:15:00.123Z"
}
```

---

### 8. Reorder Gallery Items
**PATCH** `/api/internal/gallery/reorder`

Updates display order for multiple gallery items (drag & drop support).

#### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Request Body
```json
{
  "items": [
    { "id": 1, "display_order": 0 },
    { "id": 3, "display_order": 1 },
    { "id": 2, "display_order": 2 }
  ]
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Gallery items reordered successfully",
  "data": null,
  "timestamp": "2025-08-18T11:20:00.123Z"
}
```

---

### 9. Get Gallery Statistics
**GET** `/api/internal/gallery/stats`

Retrieves gallery statistics and analytics.

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "total": 45,
    "active": 38,
    "inactive": 7,
    "photos": 35,
    "videos": 10,
    "by_page": [
      { "page_slug": "about-us", "count": "12" },
      { "page_slug": "courses", "count": "18" },
      { "page_slug": "facilities", "count": "15" }
    ]
  },
  "timestamp": "2025-08-18T11:25:00.123Z"
}
```

---

## Public Website APIs

### 1. Get Gallery Item by Slug
**GET** `/api/public/gallery/:slug`

Retrieves a single active gallery item by its slug.

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| slug | String | Gallery item slug |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "title": "Training Ground View",
    "caption": "Students practicing excavator operations",
    "slug": "training-ground-view",
    "media_type": "photo",
    "page_slug": "about-us",
    "image_url": "https://storage.example.com/gallery/images/1692345678-abc123.jpg",
    "display_order": 0,
    "createdAt": "2025-08-18T10:30:00.000Z"
  },
  "timestamp": "2025-08-18T11:30:00.123Z"
}
```

#### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Gallery item not found or inactive",
  "timestamp": "2025-08-18T11:30:00.123Z"
}
```

---

### 2. Get Gallery Items by Page
**GET** `/api/public/gallery/page/:page_slug`

Retrieves all active gallery items for a specific page, ordered by display_order.

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page_slug | String | Page identifier |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Training Ground View",
      "caption": "Students practicing excavator operations",
      "slug": "training-ground-view",
      "media_type": "photo",
      "page_slug": "about-us",
      "image_url": "https://storage.example.com/gallery/images/1692345678-abc123.jpg",
      "display_order": 0,
      "createdAt": "2025-08-18T10:30:00.000Z"
    },
    {
      "id": 5,
      "title": "Facility Overview",
      "caption": "Modern training facility exterior",
      "slug": "facility-overview",
      "media_type": "video",
      "page_slug": "about-us",
      "media_url": "https://storage.example.com/gallery/videos/1692346000-def456.mp4",
      "thumbnail_url": "https://storage.example.com/gallery/images/1692346000-thumb456.jpg",
      "display_order": 1,
      "createdAt": "2025-08-18T10:35:00.000Z"
    }
  ],
  "timestamp": "2025-08-18T11:35:00.123Z"
}
```

---

## File Upload Specifications

### Supported File Types
- **Images:** JPEG, JPG, PNG, GIF, WebP
- **Videos:** MP4, AVI, MOV, WMV, WebM

### File Size Limits
- Maximum file size: 50MB per file
- Bulk upload: Maximum 20 files at once

### File Storage Structure
```
uploads/
├── gallery/
│   ├── images/
│   │   └── 1692345678-abc123.jpg
│   └── videos/
│       └── 1692346000-def456.mp4
```

### URL Generation
- **Local files:** `STORAGE_URL + file_path`
- **Remote files:** Direct URL (no concatenation)

---

## Error Responses

### Common Error Codes
- **400 Bad Request:** Invalid request data
- **401 Unauthorized:** Missing or invalid JWT token
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **413 Payload Too Large:** File size exceeds limit
- **422 Unprocessable Entity:** File type not supported
- **500 Internal Server Error:** Server error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": "Field-specific error message"
  },
  "timestamp": "2025-08-18T11:40:00.123Z"
}
```


