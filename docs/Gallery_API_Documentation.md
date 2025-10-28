# Gallery API Docs

## A) Internal API's

### 1) Get Gallery Items

**Endpoints:**  
- For Image tab: `{{BASE_URL}}/api/internal/gallery?page_slug=gallery_image&media_type=image`  
- For Video tab: `{{BASE_URL}}/api/internal/gallery?page_slug=gallery_video&media_type=video`  
**Method:** GET

**Request Payload:**  
_No payload_

**Response Payload:**
```json
{
    "success": true,
    "message": "Gallery items retrieved successfully",
    "data": [
        {
            "id": 1,
            "media_type": "image",
            "caption": "A short description of the Image",
            "title": "Sample Image Title",
            "slug": "sample-image-title-afr-txi",
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
    "timestamp": "2025-10-25T07:31:04.691Z"
}
```

---

### 2) Create Gallery Item

**Endpoints:**  
- For Image tab: `{{BASE_URL}}/api/internal/gallery/create?media_type=image`  
- For Video tab: `{{BASE_URL}}/api/internal/gallery/create?media_type=video`  
**Method:** POST

**Request Payload (Multipart):**
| Key | Type | Description |
|-----|------|--------------|
| file | file | Media file |
| thumbnail | file | Thumbnail file |
| title | text | Title of the media |
| caption | text | Caption for media |
| media_type | text | image or video |
| page_slug | text | gallery_image or gallery_video |
| is_media_remote | text | true or false |
| is_thumbnail_remote | text | true or false |
| media_path | text | Required if media is remote |
| is_thumbnail_remote | text | Required if thumbnail is remote |

**Response Payload:**
```json
{
    "success": true,
    "message": "Gallery item created successfully",
    "data": {
        "id": 10,
        "media_type": "image"
    },
    "timestamp": "2025-10-25T06:42:10.343Z"
}
```

---

### 3) Change Status (active/inactive)

**Endpoint:** `{{BASE_URL}}/api/internal/gallery/status/:id`  
**Method:** PATCH

**Request Payload (JSON):**
```json
{ "is_active": false }
```

**Response Payload:**
```json
{
    "success": true,
    "message": "Gallery item status updated successfully",
    "data": { "id": 3 },
    "timestamp": "2025-10-25T07:17:19.282Z"
}
```

---

### 4) Reorder Gallery Items

**Endpoint:** `{{BASE_URL}}/api/internal/gallery/reorder`  
**Method:** PATCH

**Request Payload (JSON):**
```json
{
  "items": [
    { "id": 1, "display_order": 10 },
    { "id": 2, "display_order": 11 }
  ]
}
```

**Response Payload:**
```json
{
    "success": true,
    "message": "Gallery items reordered successfully",
    "data": { "count": 2 },
    "timestamp": "2025-10-25T06:55:54.804Z"
}
```

---

### 5) Delete Gallery Item

**Endpoint:** `{{BASE_URL}}/api/internal/gallery/delete/:id`  
**Method:** DELETE

_No payload, just parameter_

**Response Payload:**
```json
{
    "success": true,
    "message": "Gallery item deleted successfully",
    "data": { "id": "1" },
    "timestamp": "2025-10-25T07:45:11.611Z"
}
```

---

### 6) Update Gallery Item

**Endpoint:** `{{BASE_URL}}/api/internal/gallery/edit/:id`  
**Method:** PUT

**Request Payload (Form Data):**
| Key | Type | Description |
|-----|------|--------------|
| title | text | Title of the media |
| caption | text | Caption of the media |
- And other fields

**Response Payload:**
```json
{
    "success": true,
    "message": "Gallery item updated successfully",
    "data": { "id": 1 },
    "timestamp": "2025-10-25T08:16:13.813Z"
}
```

---

## B) Website/Public API's

### 1) Get All Gallery Items by its slug

**Endpoint:** `{{BASE_URL}}/api/public/gallery/item/:slug`  
**Method:** GET

_No payload, just slug parameter_

**Response Payload:**
```json
{
    "success": true,
    "message": "Gallery items retrieved successfully",
    "data": [
        {
            "id": 1,
            "media_type": "image",
            "caption": "A short description of the image",
            "title": "Sample Image Title",
            "slug": "sample-image-title-ulb-mrv",
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

---

### 2) Get All Gallery Items by page slug

**Endpoint:** `{{BASE_URL}}/api/public/gallery/page/:page_slug`  
**Method:** GET

_No payload, just page_slug parameter_

**Response Payload:**
```json
{
    "success": true,
    "message": "Gallery items retrieved successfully",
    "data": [
        {
            "id": 1,
            "media_type": "image",
            "media_url": "http://localhost:5000/uploads/gallery/images/25102025121210-abhjeetjpeg-bvn.jpeg"
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
