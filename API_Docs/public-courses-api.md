# Public Courses API Documentation

## 1. Get All Public Courses

**Method**: `GET`

**Endpoint**: `/api/public/courses`

**Query Parameters**:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 100, max: 50)
- `search` (optional): Search term to filter courses by title
- `language` (optional): Filter by language - `en`, `hi`, `mar` (default: `en`)
- `sortBy` (optional): Field to sort by (default: `display_order`)
- `sortOrder` (optional): Sort order - `ASC` or `DESC` (default: `ASC`)

**Request Payload**: Not Required

**Success Response** (200):
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 1,
            "course_group_id": 101,
            "title": "Excavator Training - Expert",
            "slug": "excavator-training-expert",
            "language": "en",
            "summary": "Expert-level excavator training course.",
            "description": "Focus on complex operations, troubleshooting, and site management.",
            "duration": 60,
            "syllabus_text": "Complex operations, troubleshooting, advanced safety",
            "syllabus_file_path": "http://localhost:3000/uploads/courses/syllabus/syllabus-04102025002326-IRU.pdf",
            "base_course_fee": "40000.00",
            "is_discounted": true,
            "discount_percentage": "20.00",
            "discount_amount": "8000.00",
            "discounted_course_fee": "32000.00",
            "hostel_available": true,
            "hostel_fee": "0.00",
            "mess_available": true,
            "mess_fee": "0.00",
            "total_fee": "32000.00",
            "show_offer_badge": true,
            "offer_badge_text": "Pro Level",
            "thumbnail": "http://localhost:3000/uploads/courses/thumbnails/course-04102025002326-IRU.png",
            "is_active": true,
            "display_order": 1,
            "effective_fee": "32000.00",
            "enrolled_students_count": 15,
            "created_by": null,
            "updated_by": null,
            "is_deleted": false,
            "deleted_by": null,
            "createdAt": "2025-09-06T20:16:18.000Z",
            "updatedAt": "2025-10-03T18:33:28.000Z",
            "deletedAt": null
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 100,
        "total": 1,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    },
    "timestamp": "2025-10-09T18:53:38.373Z"
}
```

**Error Response** (500):
```json
{
    "success": false,
    "message": "Database error occurred",
    "timestamp": "2025-10-09T18:53:38.373Z"
}
```

---

## 2. Get Course by ID

**Method**: `GET`

**Endpoint**: `/api/public/courses/view/:id`

**URL Parameters**:
- `id` (mandatory): Course ID

**Request Payload**: Not Required

**Success Response** (200):
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "id": 1,
        "course_group_id": 101,
        "title": "Excavator Training - Expert",
        "slug": "excavator-training-expert",
        "language": "en",
        "summary": "Expert-level excavator training course.",
        "description": "Focus on complex operations, troubleshooting, and site management.",
        "duration": 60,
        "syllabus_text": "Complex operations, troubleshooting, advanced safety",
        "syllabus_file_path": "http://localhost:3000/uploads/courses/syllabus/syllabus-04102025002326-IRU.pdf",
        "base_course_fee": "40000.00",
        "is_discounted": true,
        "discount_percentage": "20.00",
        "discount_amount": "8000.00",
        "discounted_course_fee": "32000.00",
        "hostel_available": true,
        "hostel_fee": "0.00",
        "mess_available": true,
        "mess_fee": "0.00",
        "total_fee": "32000.00",
        "show_offer_badge": true,
        "offer_badge_text": "Pro Level",
        "thumbnail": "http://localhost:3000/uploads/courses/thumbnails/course-04102025002326-IRU.png",
        "is_active": true,
        "display_order": 1,
        "enrolled_students_count": 15,
        "created_by": null,
        "updated_by": null,
        "is_deleted": false,
        "deleted_by": null,
        "createdAt": "2025-09-06T20:16:18.000Z",
        "updatedAt": "2025-10-03T18:33:28.000Z",
        "deletedAt": null
    },
    "timestamp": "2025-10-09T18:53:38.373Z"
}
```

**Error Response** (404):
```json
{
    "success": false,
    "message": "Course not found",
    "timestamp": "2025-10-09T18:53:38.373Z"
}
```

---

## 3. Get Course by Slug

**Method**: `GET`

**Endpoint**: `/api/public/courses/:slug`

**URL Parameters**:
- `slug` (mandatory): Course slug (e.g., `excavator-training-expert`)

**Request Payload**: Not Required

**Success Response** (200):
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "id": 1,
        "course_group_id": 101,
        "title": "Excavator Training - Expert",
        "slug": "excavator-training-expert",
        "language": "en",
        "summary": "Expert-level excavator training course.",
        "description": "Focus on complex operations, troubleshooting, and site management.",
        "duration": 60,
        "syllabus_text": "Complex operations, troubleshooting, advanced safety",
        "syllabus_file_path": "http://localhost:3000/uploads/courses/syllabus/syllabus-04102025002326-IRU.pdf",
        "base_course_fee": "40000.00",
        "is_discounted": true,
        "discount_percentage": "20.00",
        "discount_amount": "8000.00",
        "discounted_course_fee": "32000.00",
        "hostel_available": true,
        "hostel_fee": "0.00",
        "mess_available": true,
        "mess_fee": "0.00",
        "total_fee": "32000.00",
        "show_offer_badge": true,
        "offer_badge_text": "Pro Level",
        "thumbnail": "http://localhost:3000/uploads/courses/thumbnails/course-04102025002326-IRU.png",
        "is_active": true,
        "display_order": 1,
        "effective_fee": "32000.00",
        "enrolled_students_count": 15,
        "created_by": null,
        "updated_by": null,
        "is_deleted": false,
        "deleted_by": null,
        "createdAt": "2025-09-06T20:16:18.000Z",
        "updatedAt": "2025-10-03T18:33:28.000Z",
        "deletedAt": null
    },
    "timestamp": "2025-10-09T18:53:38.373Z"
}
```

**Error Response** (404):
```json
{
    "success": false,
    "message": "Course not found",
    "timestamp": "2025-10-09T18:53:38.373Z"
}
```

---

## 4. Get Featured Courses

**Method**: `GET`

**Endpoint**: `/api/public/courses/featured`

**Query Parameters**:
- `language` (optional): Filter by language - `en`, `hi`, `mar` (default: `en`)
- `limit` (optional): Number of featured courses to return (default: 6, max: 20)

**Request Payload**: Not Required

**Success Response** (200):
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 1,
            "course_group_id": 101,
            "title": "Excavator Training - Expert",
            "slug": "excavator-training-expert",
            "language": "en",
            "summary": "Expert-level excavator training course.",
            "description": "Focus on complex operations, troubleshooting, and site management.",
            "duration": 60,
            "base_course_fee": "40000.00",
            "is_discounted": true,
            "discount_percentage": "20.00",
            "discount_amount": "8000.00",
            "discounted_course_fee": "32000.00",
            "total_fee": "32000.00",
            "show_offer_badge": true,
            "offer_badge_text": "Pro Level",
            "thumbnail": "http://localhost:3000/uploads/courses/thumbnails/course-04102025002326-IRU.png",
            "effective_fee": "32000.00",
            "enrolled_students_count": 15
        }
    ],
    "timestamp": "2025-10-09T18:53:38.373Z"
}
```

**Error Response** (500):
```json
{
    "success": false,
    "message": "Database error occurred",
    "timestamp": "2025-10-09T18:53:38.373Z"
}
```

---

## 5. Get Course Statistics

**Method**: `GET`

**Endpoint**: `/api/public/courses/stats`

**Query Parameters**:
- `language` (optional): Filter by language - `en`, `hi`, `mar` (default: `en`)

**Request Payload**: Not Required

**Success Response** (200):
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "totalCourses": 15,
        "activeCourses": 12,
        "totalEnrollments": 450,
        "averageFee": "35000.00"
    },
    "timestamp": "2025-10-09T18:53:38.373Z"
}
```

**Error Response** (500):
```json
{
    "success": false,
    "message": "Database error occurred",
    "timestamp": "2025-10-09T18:53:38.373Z"
}
```

---

## Notes

- All endpoints are public and do not require authentication
- Only active courses (`is_active: true`) are returned in public endpoints
- File paths (thumbnail, syllabus) are returned as absolute URLs with the base URL configured in environment variables
- The `effective_fee` field equals `total_fee` and represents the final amount payable
- Pagination is available for the "Get All Public Courses" endpoint
- Language filtering supports English (`en`), Hindi (`hi`), and Marathi (`mar`)