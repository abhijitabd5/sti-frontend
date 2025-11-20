# Page Management API Documentation

## Base URL
`/api/internal/pages`

**Authentication Required**: Yes (JWT Bearer Token)  
**Roles Allowed**: super_admin, admin, seo

---

## 1. Get All Pages

**Endpoint**: `/api/internal/pages`  
**Method**: `GET`

### Request Query Parameters
```json
{
  "language": "en",           // Optional: Filter by language (en, hi, mar)
  "search": "home",           // Optional: Search in name, slug, page_title
  "limit": 10,                // Optional: Items per page (default: 10)
  "offset": 0,                // Optional: Pagination offset (default: 0)
  "orderBy": "createdAt",     // Optional: Sort field (default: createdAt)
  "orderDirection": "DESC"    // Optional: Sort direction (default: DESC)
}
```

### Response Payload
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Home Page",
      "slug": "home-page",
      "language": "en",
      "page_title": "Welcome to Earth Movers Academy",
      "meta_title": "Home - Earth Movers Training Academy",
      "meta_description": "Professional heavy machinery operator training",
      "meta_keywords": "training, heavy machinery, operators",
      "og_title": "Earth Movers Academy",
      "og_description": "Professional training for heavy machinery operators",
      "og_image": "http://localhost:5000/uploads/pages/og-images/home-og-1234567890.jpg",
      "twitter_title": "Earth Movers Academy",
      "twitter_description": "Professional training for heavy machinery operators",
      "canonical_url": "https://earthmovers.com/home",
      "is_active": true,
      "created_by": 1,
      "updated_by": [],
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
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
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## 2. Get Page by ID

**Endpoint**: `/api/internal/pages/:id`  
**Method**: `GET`

### Request Query Parameters
```json
{
  "includeContents": true  // Optional: Include page contents (default: true)
}
```

### Response Payload
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "name": "Home Page",
    "slug": "home-page",
    "language": "en",
    "page_title": "Welcome to Earth Movers Academy",
    "meta_title": "Home - Earth Movers Training Academy",
    "meta_description": "Professional heavy machinery operator training",
    "meta_keywords": "training, heavy machinery, operators",
    "og_title": "Earth Movers Academy",
    "og_description": "Professional training for heavy machinery operators",
    "og_image": "http://localhost:5000/uploads/pages/og-images/home-og-1234567890.jpg",
    "twitter_title": "Earth Movers Academy",
    "twitter_description": "Professional training for heavy machinery operators",
    "canonical_url": "https://earthmovers.com/home",
    "is_active": true,
    "created_by": 1,
    "updated_by": [],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z",
    "contents": [
      {
        "id": 1,
        "page_id": 1,
        "section_key": "hero",
        "section_name": "Hero Section",
        "language": "en",
        "content": "<h1>Welcome to Earth Movers Academy</h1>",
        "createdAt": "2025-01-15T10:30:00.000Z",
        "updatedAt": "2025-01-15T10:30:00.000Z"
      }
    ]
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## 3. Get Page by Slug

**Endpoint**: `/api/internal/pages/slug/:slug`  
**Method**: `GET`

### Request Query Parameters
```json
{
  "language": "en",           // Optional: Filter by language
  "includeContents": true     // Optional: Include page contents (default: true)
}
```

### Response Payload
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "name": "Home Page",
    "slug": "home-page",
    "language": "en",
    "page_title": "Welcome to Earth Movers Academy",
    "meta_title": "Home - Earth Movers Training Academy",
    "meta_description": "Professional heavy machinery operator training",
    "meta_keywords": "training, heavy machinery, operators",
    "og_title": "Earth Movers Academy",
    "og_description": "Professional training for heavy machinery operators",
    "og_image": "http://localhost:5000/uploads/pages/og-images/home-og-1234567890.jpg",
    "twitter_title": "Earth Movers Academy",
    "twitter_description": "Professional training for heavy machinery operators",
    "canonical_url": "https://earthmovers.com/home",
    "is_active": true,
    "created_by": 1,
    "updated_by": [],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z",
    "contents": []
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## 4. Create Page

**Endpoint**: `/api/internal/pages`  
**Method**: `POST`  
**Content-Type**: `multipart/form-data`

### Request Payload (FormData)
```javascript
// All fields are sent as FormData
const formData = new FormData();
formData.append("name", "About Us");                    // Required: Page name (min 2 chars)
formData.append("language", "en");                      // Required: Language (en, hi, mar)
formData.append("page_title", "About Earth Movers");    // Optional: Page title
formData.append("meta_title", "About Us");              // Optional: Meta title (max 60 chars)
formData.append("meta_description", "Learn about us");  // Optional: Meta description (max 160 chars)
formData.append("meta_keywords", "about, company");     // Optional: Meta keywords
formData.append("og_title", "About Earth Movers");      // Optional: OG title (max 60 chars)
formData.append("og_description", "Learn about us");    // Optional: OG description (max 160 chars)
// Only append og_image if a file is selected:
if (ogImageFile) {
  formData.append("og_image", ogImageFile);             // Optional: OG image file (JPEG, PNG, WebP, max 5MB)
}
formData.append("twitter_title", "About Earth Movers"); // Optional: Twitter title (max 60 chars)
formData.append("twitter_description", "Learn about");  // Optional: Twitter description (max 160 chars)
formData.append("canonical_url", "https://example.com");// Optional: Canonical URL (must be valid HTTP/HTTPS)
formData.append("is_active", "true");                   // Optional: Active status (send as string "true" or "false")
```

**Important Notes:**
- Do NOT append `og_image` field if no file is selected (don't send null or empty string)
- Boolean values must be sent as strings: "true" or "false"
- Empty optional text fields can be sent as empty strings ""

### Response Payload
```json
{
  "success": true,
  "message": "Page created successfully",
  "data": {
    "id": 2,
    "name": "About Us",
    "slug": "about-us",
    "language": "en",
    "page_title": "About Earth Movers",
    "meta_title": "About Us",
    "meta_description": "Learn about us",
    "meta_keywords": "about, company",
    "og_title": "About Earth Movers",
    "og_description": "Learn about us",
    "og_image": "http://localhost:5000/uploads/pages/og-images/about-og-1234567890.jpg",
    "twitter_title": "About Earth Movers",
    "twitter_description": "Learn about",
    "canonical_url": "https://example.com",
    "is_active": true,
    "created_by": 1,
    "updated_by": [],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": "Page name is required",
    "language": "Language must be one of: en, hi, mar",
    "meta_title": "Meta title should not exceed 60 characters"
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## 5. Update Page

**Endpoint**: `/api/internal/pages/:id`  
**Method**: `PUT`  
**Content-Type**: `multipart/form-data`

### Request Payload (FormData)
```javascript
// All fields are sent as FormData
const formData = new FormData();
formData.append("name", "About Us Updated");            // Optional: Page name (min 2 chars)
formData.append("page_title", "About Earth Movers");    // Optional: Page title
formData.append("meta_title", "About Us");              // Optional: Meta title (max 60 chars)
formData.append("meta_description", "Learn about us");  // Optional: Meta description (max 160 chars)
formData.append("meta_keywords", "about, company");     // Optional: Meta keywords
formData.append("og_title", "About Earth Movers");      // Optional: OG title (max 60 chars)
formData.append("og_description", "Learn about us");    // Optional: OG description (max 160 chars)
// Only append og_image if a new file is selected:
if (newOgImageFile) {
  formData.append("og_image", newOgImageFile);          // Optional: New OG image file (JPEG, PNG, WebP, max 5MB)
  formData.append("old_og_image", "uploads/pages/og-images/old.jpg"); // Include old path for deletion
}
formData.append("twitter_title", "About Earth Movers"); // Optional: Twitter title (max 60 chars)
formData.append("twitter_description", "Learn about");  // Optional: Twitter description (max 160 chars)
formData.append("canonical_url", "https://example.com");// Optional: Canonical URL (must be valid HTTP/HTTPS)
formData.append("is_active", "false");                  // Optional: Active status (send as string "true" or "false")
```

**Important Notes**: 
- `slug` and `language` cannot be updated
- Do NOT append `og_image` field if no new file is selected
- If uploading a new `og_image`, include `old_og_image` path to delete the old file
- Boolean values must be sent as strings: "true" or "false"

### Response Payload
```json
{
  "success": true,
  "message": "Page updated successfully",
  "data": {
    "id": 2,
    "name": "About Us Updated",
    "slug": "about-us",
    "language": "en",
    "page_title": "About Earth Movers",
    "meta_title": "About Us",
    "meta_description": "Learn about us",
    "meta_keywords": "about, company",
    "og_title": "About Earth Movers",
    "og_description": "Learn about us",
    "og_image": "http://localhost:5000/uploads/pages/og-images/about-og-9876543210.jpg",
    "twitter_title": "About Earth Movers",
    "twitter_description": "Learn about",
    "canonical_url": "https://example.com",
    "is_active": false,
    "created_by": 1,
    "updated_by": [
      {
        "id": "1",
        "timestamp": "2025-01-15T11:00:00.000Z"
      }
    ],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T11:00:00.000Z"
  },
  "timestamp": "2025-01-15T11:00:00.000Z"
}
```

---

## 6. Delete Page

**Endpoint**: `/api/internal/pages/:id`  
**Method**: `DELETE`

### Request Payload
None

### Response Payload
```json
{
  "success": true,
  "message": "Page deleted successfully",
  "data": {
    "id": 2
  },
  "timestamp": "2025-01-15T11:30:00.000Z"
}
```

---

## 7. Get Pages by Language

**Endpoint**: `/api/internal/pages/language/:language`  
**Method**: `GET`

### Request Parameters
- `language` (path parameter): Language code (en, hi, mar)

### Response Payload
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Home Page",
      "slug": "home-page",
      "page_title": "Welcome to Earth Movers Academy"
    },
    {
      "id": 2,
      "name": "About Us",
      "slug": "about-us",
      "page_title": "About Earth Movers"
    }
  ],
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## 8. Get Page Statistics

**Endpoint**: `/api/internal/pages/statistics`  
**Method**: `GET`

### Request Payload
None

### Response Payload
```json
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
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid language. Must be one of: en, hi, mar",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Page not found",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to retrieve pages: Database connection error",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## Notes

1. **Slug Generation**: The `slug` is automatically generated from the `name` field using `customSlugify()` and cannot be manually set or updated.

2. **OG Image Upload**: 
   - Accepts JPEG, PNG, WebP formats
   - Maximum file size: 5MB
   - Stored in `uploads/pages/og-images/` directory
   - Returns full URL in response with base URL prefix

3. **Soft Delete**: The DELETE endpoint performs a soft delete (sets `deletedAt` timestamp) rather than permanently removing the record.

4. **Audit Trail**: All create/update/delete operations automatically track:
   - `created_by`: User ID who created the record
   - `updated_by`: JSON array of update history with user IDs and timestamps
   - `deleted_by`: User ID who deleted the record

5. **Language Support**: The system supports three languages:
   - `en` - English
   - `hi` - Hindi
   - `mar` - Marathi

6. **Unique Constraint**: A page with the same `slug` and `language` combination must be unique.
