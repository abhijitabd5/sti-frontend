# Gallery API Documentation

## A) Internal/Admin API Endpoints

All internal endpoints require authentication and role-based access (super_admin, admin, seo).

---

### 1. Get All Gallery Items

**Endpoint:** `GET /api/internal/gallery`

**Method:** GET

**Authentication:** Required (Bearer Token)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Search by title or caption |
| media_type | string | No | Filter by media type: `image`, `video`, or `thumbnail` |
| page_id | integer | No | Filter by page ID |
| page_slug | string | No | Filter by page slug (e.g., `gallery_image`, `gallery_video`) |
| is_active | boolean | No | Filter by active status |
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 10, use -1 or 'all' for all items) |
| sort | string | No | Sort field (default: `display_order`) |
| order | string | No | Sort order: `ASC` or `DESC` (default: `ASC`) |

**Success Response (200):**
```json
{
    "success": true,
    "message": "Gallery items retrieved successfully",
    "data": [
        {
            "id": 1,
            "media_type": "photo",
            "caption": "A short description of the image",
            "title": "Sample Image Title",
            "slug": "sample-image-title-afr-txi",
            "page_slug": "gallery_image",
            "is_media_remote": false,
            "media_url": "http://localhost:5000/uploads/gallery/images/25102025002435-abhjeetjpeg-qdi.jpeg",
            "is_thumbnail_remote": false,
            "thumbnail_url": null,
            "display_order": 1,
            "is_active": true,
            "created_by": 1,
            "updated_by": [
                {
                    "id": 1,
                    "timestamp": "2025-10-25T07:16:21.660Z"
                }
            ],
            "is_deleted": false,
            "deleted_by": null,
            "createdAt": "2025-09-27T12:06:04.000Z",
            "updatedAt": "2025-10-03T15:07:53.000Z",
            "deletedAt": null
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    },
    "timestamp": "2025-10-25T07:31:04.691Z"
}
```

**Error Response (500):**
```json
{
    "success": false,
    "message": "Error message",
    "timestamp": "2025-10-25T07:31:04.691Z"
}
```

---

### 2. Create Gallery Item

**Endpoint:** `POST /api/internal/gallery/create`

**Method:** POST

**Authentication:** Required (Bearer Token)

**Content-Type:** multipart/form-data

**Request Payload:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | No | Title of the media item |
| caption | string | No | Caption/description for the media |
| description | string | No | Detailed description |
| media_type | string | No | Media type: `photo` or `video` (inferred from file if not provided) |
| page_slug | string | No | Associated page slug (e.g., `gallery_image`, `gallery_video`) |
| section_slug | string | No | Section identifier |
| link_text | string | No | Link text for the item |
| link_url | string | No | Link URL for the item |
| is_media_remote | boolean | No | Whether media is hosted remotely (default: false) |
| media_path | string | Conditional | Required if `is_media_remote` is true |
| is_thumbnail_remote | boolean | No | Whether thumbnail is hosted remotely (default: false) |
| thumbnail_path | string | No | Thumbnail URL if remote |
| metadata | string (JSON) | No | Additional metadata as JSON string |
| display_order | integer | No | Display order (default: 0) |
| is_active | boolean | No | Active status (default: true) |
| file | file | Conditional | Media file (required if not remote) |
| thumbnail | file | No | Thumbnail file |

**Success Response (201):**
```json
{
    "success": true,
    "message": "Gallery item created successfully",
    "data": {
        "id": 10,
        "media_type": "photo",
        "caption": "Sample caption",
        "title": "Sample Image Title",
        "slug": "sample-image-title-xyz-abc",
        "page_slug": "gallery_image",
        "is_media_remote": false,
        "media_url": "http://localhost:5000/uploads/gallery/images/file.jpeg",
        "is_thumbnail_remote": false,
        "thumbnail_url": null,
        "display_order": 0,
        "is_active": true,
        "created_by": 1,
        "updated_by": [],
        "is_deleted": false,
        "deleted_by": null,
        "createdAt": "2025-10-25T06:42:10.000Z",
        "updatedAt": "2025-10-25T06:42:10.000Z",
        "deletedAt": null
    },
    "timestamp": "2025-10-25T06:42:10.343Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Invalid media type",
    "timestamp": "2025-10-25T06:42:10.343Z"
}
```

---

### 3. Bulk Upload Gallery Items

**Endpoint:** `POST /api/internal/gallery/create/bulk`

**Method:** POST

**Authentication:** Required (Bearer Token)

**Content-Type:** multipart/form-data

**Request Payload:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| media_type | string | Yes* | Media type: `photo` or `video` |
| page_slug | string | No | Associated page slug |
| captions | string (JSON) | No | JSON array of captions for each file |
| is_active | boolean | No | Active status for all items (default: true) |
| files | file[] | Yes* | Array of media files |

**Success Response (201):**
```json
{
    "success": true,
    "message": "Gallery items created successfully",
    "data": {
        "count": 5,
        "items": [
            {
                "id": 11,
                "media_type": "photo",
                "slug": "gallery-image-xyz"
            }
        ]
    },
    "timestamp": "2025-10-25T06:42:10.343Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "No files provided",
    "timestamp": "2025-10-25T06:42:10.343Z"
}
```

---

### 4. Update Gallery Item

**Endpoint:** `PUT /api/internal/gallery/edit/:id`

**Method:** PUT

**Authentication:** Required (Bearer Token)

**Content-Type:** multipart/form-data

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes* | Gallery item ID |

**Request Payload:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | No | Updated title |
| caption | string | No | Updated caption |
| description | string | No | Updated description |
| media_type | string | No | Media type: `photo` or `video` |
| page_slug | string | No | Associated page slug |
| section_slug | string | No | Section identifier |
| link_text | string | No | Link text for the item |
| link_url | string | No | Link URL for the item |
| is_media_remote | boolean | No | Whether media is hosted remotely |
| media_path | string | No | Remote media URL |
| is_thumbnail_remote | boolean | No | Whether thumbnail is hosted remotely |
| thumbnail_path | string | No | Remote thumbnail URL |
| metadata | string (JSON) | No | Additional metadata as JSON string |
| display_order | integer | No | Display order |
| is_active | boolean | No | Active status |
| file | file | No | New media file |
| thumbnail | file | No | New thumbnail file |

**Success Response (200):**
```json
{
    "success": true,
    "message": "Gallery item updated successfully",
    "data": {
        "id": 1,
        "media_type": "photo",
        "caption": "Updated caption",
        "title": "Updated Title",
        "slug": "updated-title-xyz",
        "page_slug": "gallery_image",
        "is_media_remote": false,
        "media_url": "http://localhost:5000/uploads/gallery/images/file.jpeg",
        "is_thumbnail_remote": false,
        "thumbnail_url": null,
        "display_order": 1,
        "is_active": true,
        "created_by": 1,
        "updated_by": [
            {
                "id": 1,
                "timestamp": "2025-10-25T08:16:13.813Z"
            }
        ],
        "is_deleted": false,
        "deleted_by": null,
        "createdAt": "2025-09-27T12:06:04.000Z",
        "updatedAt": "2025-10-25T08:16:13.000Z",
        "deletedAt": null
    },
    "timestamp": "2025-10-25T08:16:13.813Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Gallery item not found",
    "timestamp": "2025-10-25T08:16:13.813Z"
}
```

---

### 5. Get Gallery Item by ID

**Endpoint:** `GET /api/internal/gallery/view/:id`

**Method:** GET

**Authentication:** Required (Bearer Token)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes* | Gallery item ID |

**Success Response (200):**
```json
{
    "success": true,
    "message": "Gallery item retrieved successfully",
    "data": {
        "id": 1,
        "media_type": "photo",
        "caption": "Sample caption",
        "title": "Sample Title",
        "slug": "sample-title-xyz",
        "page_slug": "gallery_image",
        "is_media_remote": false,
        "media_url": "http://localhost:5000/uploads/gallery/images/file.jpeg",
        "is_thumbnail_remote": false,
        "thumbnail_url": null,
        "display_order": 1,
        "is_active": true,
        "created_by": 1,
        "updated_by": [],
        "is_deleted": false,
        "deleted_by": null,
        "createdAt": "2025-09-27T12:06:04.000Z",
        "updatedAt": "2025-10-03T15:07:53.000Z",
        "deletedAt": null
    },
    "timestamp": "2025-10-25T07:31:04.691Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Gallery item not found",
    "timestamp": "2025-10-25T07:31:04.691Z"
}
```

---

### 6. Get Gallery Statistics

**Endpoint:** `GET /api/internal/gallery/stats`

**Method:** GET

**Authentication:** Required (Bearer Token)

**Success Response (200):**
```json
{
    "success": true,
    "message": "Gallery statistics retrieved successfully",
    "data": {
        "total": 50,
        "active": 45,
        "inactive": 5,
        "deleted": 2,
        "photos": 30,
        "videos": 15
    },
    "timestamp": "2025-10-25T07:31:04.691Z"
}
```

**Error Response (500):**
```json
{
    "success": false,
    "message": "Error message",
    "timestamp": "2025-10-25T07:31:04.691Z"
}
```

---

### 7. Update Gallery Item Status

**Endpoint:** `PATCH /api/internal/gallery/status/:id`

**Method:** PATCH

**Authentication:** Required (Bearer Token)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes* | Gallery item ID |

**Request Payload (JSON):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| is_active | boolean | Yes* | Active status (true/false) |

```json
{
    "is_active": false
}
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "Gallery item status updated successfully",
    "data": {
        "id": 3,
        "media_type": "photo",
        "is_active": false
    },
    "timestamp": "2025-10-25T07:17:19.282Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "is_active field is required",
    "timestamp": "2025-10-25T07:17:19.282Z"
}
```

---

### 8. Reorder Gallery Items

**Endpoint:** `PATCH /api/internal/gallery/reorder`

**Method:** PATCH

**Authentication:** Required (Bearer Token)

**Request Payload (JSON):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| items | array | Yes* | Array of objects with id and display_order |

```json
{
    "items": [
        { "id": 1, "display_order": 10 },
        { "id": 2, "display_order": 11 },
        { "id": 3, "display_order": 12 }
    ]
}
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "Gallery items reordered successfully",
    "data": {
        "count": 3
    },
    "timestamp": "2025-10-25T06:55:54.804Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Items array is required",
    "timestamp": "2025-10-25T06:55:54.804Z"
}
```

---

### 9. Delete Gallery Item

**Endpoint:** `DELETE /api/internal/gallery/delete/:id`

**Method:** DELETE

**Authentication:** Required (Bearer Token)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes* | Gallery item ID |

**Success Response (200):**
```json
{
    "success": true,
    "message": "Gallery item deleted successfully",
    "data": {
        "id": "1"
    },
    "timestamp": "2025-10-25T07:45:11.611Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Gallery item not found",
    "timestamp": "2025-10-25T07:45:11.611Z"
}
```

---

## B) Public/Website API Endpoints

Public endpoints do not require authentication.

---

### 1. Get All Public Gallery Items

**Endpoint:** `GET /api/public/gallery`

**Method:** GET

**Authentication:** Not Required

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Search by title or caption |
| media_type | string | No | Filter by media type: `photo` or `video` |
| page_slug | string | No | Filter by page slug |
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 10) |
| sort | string | No | Sort field (default: `display_order`) |
| order | string | No | Sort order: `ASC` or `DESC` (default: `ASC`) |

**Success Response (200):**
```json
{
    "success": true,
    "message": "Gallery items retrieved successfully",
    "data": [
        {
            "id": 1,
            "media_type": "photo",
            "caption": "A short description of the image",
            "title": "Sample Image Title",
            "slug": "sample-image-title-ulb-mrv",
            "page_slug": "gallery_image",
            "is_media_remote": false,
            "media_url": "http://localhost:5000/uploads/gallery/images/25102025121210-abhjeetjpeg-bvn.jpeg",
            "is_thumbnail_remote": false,
            "thumbnail_url": null,
            "display_order": 1,
            "is_active": true,
            "created_by": 1,
            "updated_by": null,
            "is_deleted": false,
            "deleted_by": null,
            "createdAt": "2025-10-25T06:42:10.000Z",
            "updatedAt": "2025-10-25T06:42:10.000Z",
            "deletedAt": null
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    },
    "timestamp": "2025-10-25T19:21:37.552Z"
}
```

**Error Response (500):**
```json
{
    "success": false,
    "message": "Error message",
    "timestamp": "2025-10-25T19:21:37.552Z"
}
```

---

### 2. Get Gallery Item by Slug

**Endpoint:** `GET /api/public/gallery/:slug`

**Method:** GET

**Authentication:** Not Required

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slug | string | Yes* | Gallery item slug |

**Success Response (200):**
```json
{
    "success": true,
    "message": "Gallery item retrieved successfully",
    "data": {
        "id": 1,
        "media_type": "image",
        "caption": "A short description of the image",
        "title": "Sample Image Title",
        "slug": "sample-image-title-ulb-mrv",
        "page_id": null,
        "page_slug": "gallery_image",
        "is_media_remote": false,
        "media_url": "http://localhost:5000/uploads/gallery/images/25102025121210-abhjeetjpeg-bvn.jpeg",
        "is_thumbnail_remote": false,
        "thumbnail_url": null,
        "display_order": 1,
        "is_active": true,
        "created_by": 1,
        "updated_by": null,
        "is_deleted": false,
        "deleted_by": null,
        "createdAt": "2025-10-25T06:42:10.000Z",
        "updatedAt": "2025-10-25T06:42:10.000Z",
        "deletedAt": null
    },
    "timestamp": "2025-10-25T19:21:37.552Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Gallery item not found",
    "timestamp": "2025-10-25T19:21:37.552Z"
}
```

---

### 3. Get Gallery Items by Page Slug

**Endpoint:** `GET /api/public/gallery/page/:page_slug`

**Method:** GET

**Authentication:** Not Required

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page_slug | string | Yes* | Page slug (e.g., `gallery_image`, `gallery_video`) |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Search by title or caption |
| media_type | string | No | Filter by media type: `image`, `video`, `thumbnail` |
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 10) |
| sort | string | No | Sort field (default: `display_order`) |
| order | string | No | Sort order: `ASC` or `DESC` (default: `ASC`) |

**Success Response (200):**
```json
{
    "success": true,
    "message": "Gallery items retrieved successfully",
    "data": [
        {
            "id": 1,
            "media_type": "image",
            "caption": "A short description",
            "title": "Sample Image Title",
            "slug": "sample-image-title-ulb-mrv",
            "page_id": null,
            "page_slug": "gallery_image",
            "is_media_remote": false,
            "media_url": "http://localhost:5000/uploads/gallery/images/25102025121210-abhjeetjpeg-bvn.jpeg",
            "is_thumbnail_remote": false,
            "thumbnail_url": null,
            "display_order": 1,
            "is_active": true,
            "created_by": 1,
            "updated_by": null,
            "is_deleted": false,
            "deleted_by": null,
            "createdAt": "2025-10-25T06:42:10.000Z",
            "updatedAt": "2025-10-25T06:42:10.000Z",
            "deletedAt": null
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    },
    "timestamp": "2025-10-25T19:21:37.552Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Error message",
    "timestamp": "2025-10-25T19:21:37.552Z"
}
```

---

## Notes

- All internal endpoints require authentication with a valid Bearer token
- Internal endpoints require `super_admin`, `admin`, or `seo` role
- Fields marked with * are mandatory
- File uploads use multipart/form-data encoding
- Media files are stored locally unless `is_media_remote` is set to true
- Slugs are auto-generated from titles for regular gallery items
- The system supports soft deletes with audit trail tracking
- All timestamps are in ISO 8601 format
- Public endpoints only return active, non-deleted items
