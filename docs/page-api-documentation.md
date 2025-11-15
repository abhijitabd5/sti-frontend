# Page Management API Documentation

## Overview

The Page Management API provides endpoints for creating, reading, updating, and deleting pages with comprehensive SEO and social media optimization features. All endpoints require authentication and appropriate role permissions.

**Base URL**: `/api/internal/pages`
**Authentication**: Required (JWT Bearer token)
**Roles**: `super_admin`, `admin`, `seo`

---

## Endpoints

### 1. Get All Pages

**Endpoint**: `GET /api/internal/pages`
**Method**: `GET`

**Query Parameters**:
```javascript
{
  language?: "en" | "hi" | "mar",     // Filter by language
  search?: string,                    // Search in name, slug, page_title
  limit?: number,                     // Default: 10, Max: 100
  offset?: number,                    // Default: 0
  orderBy?: string,                   // Default: "createdAt"
  orderDirection?: "ASC" | "DESC"     // Default: "DESC"
}
```

**Request Payload**: None

**Response Payload**:
```javascript
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Training Courses",
      "slug": "training-courses",
      "language": "en",
      "page_title": "Training Courses",
      "meta_title": "Heavy Equipment Training Courses | Earth Movers Academy",
      "meta_description": "Browse comprehensive heavy equipment training courses...",
      "meta_keywords": "heavy equipment courses, training programs...",
      "og_title": "Heavy Equipment Training Courses | Professional Certification",
      "og_description": "Professional certification courses for heavy equipment operators...",
      "og_image": "https://yourdomain.com/uploads/pages/og-images/courses-og-1234567890.jpg",
      "twitter_title": "Heavy Equipment Training Courses",
      "twitter_description": "Professional certification courses for heavy equipment operators",
      "canonical_url": "https://earthmovers.com/courses",
      "created_by": 1,
      "updated_by": [],
      "is_deleted": false,
      "deleted_by": null,
      "createdAt": "2025-11-14T10:30:00.000Z",
      "updatedAt": "2025-11-14T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

---

### 2. Get Page by ID

**Endpoint**: `GET /api/internal/pages/:id`
**Method**: `GET`

**Path Parameters**:
- `id` (required): Page ID

**Query Parameters**:
```javascript
{
  includeContents?: boolean  // Default: true, include page contents
}
```

**Request Payload**: None

**Response Payload**:
```javascript
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "name": "Training Courses",
    "slug": "training-courses",
    "language": "en",
    "page_title": "Training Courses",
    "meta_title": "Heavy Equipment Training Courses | Earth Movers Academy",
    "meta_description": "Browse comprehensive heavy equipment training courses...",
    "meta_keywords": "heavy equipment courses, training programs...",
    "og_title": "Heavy Equipment Training Courses | Professional Certification",
    "og_description": "Professional certification courses for heavy equipment operators...",
    "og_image": "https://yourdomain.com/uploads/pages/og-images/courses-og-1234567890.jpg",
    "twitter_title": "Heavy Equipment Training Courses",
    "twitter_description": "Professional certification courses for heavy equipment operators",
    "canonical_url": "https://earthmovers.com/courses",
    "created_by": 1,
    "updated_by": [],
    "is_deleted": false,
    "deleted_by": null,
    "createdAt": "2025-11-14T10:30:00.000Z",
    "updatedAt": "2025-11-14T10:30:00.000Z",
    "contents": [
      {
        "id": 1,
        "section_key": "hero",
        "section_name": "Hero Section",
        "content": "Welcome to our training courses...",
        "language": "en"
      }
    ]
  },
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

---

### 3. Get Page by Slug

**Endpoint**: `GET /api/internal/pages/slug/:slug`
**Method**: `GET`

**Path Parameters**:
- `slug` (required): Page slug

**Query Parameters**:
```javascript
{
  language?: "en" | "hi" | "mar",    // Filter by language
  includeContents?: boolean          // Default: true
}
```

**Request Payload**: None

**Response Payload**: Same as Get Page by ID

---

### 4. Create Page

**Endpoint**: `POST /api/internal/pages`
**Method**: `POST`
**Content-Type**: `multipart/form-data`

**Request Payload** (Form Data):
```javascript
{
  // Required fields
  name: string,                      // Page name (slug auto-generated from this)
  language: "en" | "hi" | "mar",     // Page language
  
  // Optional SEO fields
  page_title?: string,               // Page title
  meta_title?: string,               // Meta title (max 60 chars)
  meta_description?: string,         // Meta description (max 160 chars)
  meta_keywords?: string,            // Meta keywords
  
  // Optional Open Graph fields
  og_title?: string,                 // OG title (max 60 chars)
  og_description?: string,           // OG description (max 160 chars)
  og_image?: File,                   // OG image file (jpg, png, webp, max 5MB)
  
  // Optional Twitter fields
  twitter_title?: string,            // Twitter title (max 60 chars)
  twitter_description?: string,      // Twitter description (max 160 chars)
  
  // Optional URL field
  canonical_url?: string,            // Canonical URL (must be valid HTTP/HTTPS)
  
  // Optional status
  is_active?: boolean                // Default: true
}
```

**Response Payload**:
```javascript
{
  "success": true,
  "message": "Page created successfully",
  "data": {
    "id": 1,
    "name": "Training Courses",
    "slug": "training-courses",        // Auto-generated from name
    "language": "en",
    "page_title": "Training Courses",
    "meta_title": "Heavy Equipment Training Courses | Earth Movers Academy",
    "meta_description": "Browse comprehensive heavy equipment training courses...",
    "meta_keywords": "heavy equipment courses, training programs...",
    "og_title": "Heavy Equipment Training Courses | Professional Certification",
    "og_description": "Professional certification courses for heavy equipment operators...",
    "og_image": "https://yourdomain.com/uploads/pages/og-images/courses-og-1234567890.jpg",
    "twitter_title": "Heavy Equipment Training Courses",
    "twitter_description": "Professional certification courses for heavy equipment operators",
    "canonical_url": "https://earthmovers.com/courses",
    "created_by": 1,
    "updated_by": [],
    "is_deleted": false,
    "deleted_by": null,
    "createdAt": "2025-11-14T10:30:00.000Z",
    "updatedAt": "2025-11-14T10:30:00.000Z"
  },
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

**Error Response** (Duplicate Name):
```javascript
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "name": "A page with this name already exists for the selected language"
  },
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

---

### 5. Update Page

**Endpoint**: `PUT /api/internal/pages/:id`
**Method**: `PUT`
**Content-Type**: `multipart/form-data`

**Path Parameters**:
- `id` (required): Page ID

**Request Payload** (Form Data):
```javascript
{
  // Optional fields (all fields from create except name and language)
  name?: string,                     // Page name (slug will NOT be updated)
  page_title?: string,               // Page title
  meta_title?: string,               // Meta title (max 60 chars)
  meta_description?: string,         // Meta description (max 160 chars)
  meta_keywords?: string,            // Meta keywords
  
  // Open Graph fields
  og_title?: string,                 // OG title (max 60 chars)
  og_description?: string,           // OG description (max 160 chars)
  og_image?: File,                   // New OG image file (replaces existing)
  old_og_image?: string,             // Path to old OG image (for cleanup)
  
  // Twitter fields
  twitter_title?: string,            // Twitter title (max 60 chars)
  twitter_description?: string,      // Twitter description (max 160 chars)
  
  // URL field
  canonical_url?: string,            // Canonical URL (must be valid HTTP/HTTPS)
  
  // Status
  is_active?: boolean,               // Page status
  
  // Note: slug and language cannot be updated
}
```

**Response Payload**: Same as Create Page response

---

### 6. Delete Page

**Endpoint**: `DELETE /api/internal/pages/:id`
**Method**: `DELETE`

**Path Parameters**:
- `id` (required): Page ID

**Request Payload**: None

**Response Payload**:
```javascript
{
  "success": true,
  "message": "Page deleted successfully",
  "data": {
    "id": 1
  },
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

---

### 7. Get Pages by Language

**Endpoint**: `GET /api/internal/pages/language/:language`
**Method**: `GET`

**Path Parameters**:
- `language` (required): Language code ("en", "hi", "mar")

**Request Payload**: None

**Response Payload**:
```javascript
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Training Courses",
      "slug": "training-courses",
      "page_title": "Training Courses",
      "og_image": "https://yourdomain.com/uploads/pages/og-images/courses-og-1234567890.jpg"
    }
  ],
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

---

### 8. Get Page Statistics

**Endpoint**: `GET /api/internal/pages/statistics`
**Method**: `GET`

**Request Payload**: None

**Response Payload**:
```javascript
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "totalPages": 25,
    "pagesByLanguage": [
      {
        "language": "en",
        "count": 15
      },
      {
        "language": "hi",
        "count": 7
      },
      {
        "language": "mar",
        "count": 3
      }
    ]
  },
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

---

### 9. Duplicate Page

**Endpoint**: `POST /api/internal/pages/:id/duplicate`
**Method**: `POST`

**Path Parameters**:
- `id` (required): Original page ID

**Request Payload**:
```javascript
{
  name?: string,                     // New page name (default: "Original Name (Copy)")
  language?: "en" | "hi" | "mar"     // New language (default: same as original)
}
```

**Response Payload**: Same as Create Page response

---

## Error Responses

### Validation Error
```javascript
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": "Page name is required",
    "language": "Language is required",
    "meta_title": "Meta title should not exceed 60 characters",
    "canonical_url": "Canonical URL must be a valid HTTP/HTTPS URL"
  },
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

### Not Found Error
```javascript
{
  "success": false,
  "message": "Page not found",
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

### File Upload Error
```javascript
{
  "success": false,
  "message": "Upload error: File too large",
  "code": "LIMIT_FILE_SIZE",
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

### Authentication Error
```javascript
{
  "success": false,
  "message": "Unauthorized",
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

### Permission Error
```javascript
{
  "success": false,
  "message": "Forbidden",
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

---

## Important Notes

### Slug Generation
- Slugs are automatically generated from the page name using `customSlugify()`
- Slugs are **immutable** - they cannot be updated after creation
- Slugs must be unique per language
- If a page name conflicts, creation will fail with validation error

### File Upload Constraints
- **OG Images**: JPG, PNG, WEBP formats only
- **Max File Size**: 5MB per OG image
- **Storage Location**: `uploads/pages/og-images/`
- **URL Format**: Full URLs returned with `UPLOAD_BASE_URL` prefix

### SEO Field Limits
- **Meta Title**: 60 characters maximum
- **Meta Description**: 160 characters maximum
- **OG Title**: 60 characters maximum
- **OG Description**: 160 characters maximum
- **Twitter Title**: 60 characters maximum
- **Twitter Description**: 160 characters maximum

### Language Support
- **Supported Languages**: English (en), Hindi (hi), Marathi (mar)
- **Unique Constraint**: Page names must be unique per language
- **Content Relationship**: Pages can have associated content in multiple languages

### Authentication & Authorization
- **Required Roles**: `super_admin`, `admin`, `seo`
- **JWT Token**: Must be provided in Authorization header
- **User Context**: All operations track created_by and updated_by fields