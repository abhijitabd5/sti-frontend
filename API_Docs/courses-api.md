# Courses API Documentation

## 1. Get All Courses

**Method:** GET

**Endpoint:** `/api/internal/courses`

**Authentication:** Required (Bearer Token)

**Authorization:** Roles: `super_admin`, `admin`, `seo`

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Number of records per page (use 'all' or -1 for all records)
- `search` (optional) - Search term for filtering courses
- `is_active` (optional) - Filter by active status (true/false)
- `language` (optional) - Filter by language (en, hi, mar)
- `sortBy` (optional, default: display_order) - Field to sort by
- `sortOrder` (optional, default: ASC) - Sort order (ASC/DESC)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 10,
            "course_group_id": 202,
            "title": "JCB Excavator Training",
            "slug": "jcb-excavator-training",
            "language": "en",
            "summary": "Learn excavator operations",
            "description": "Comprehensive training for...",
            "duration": 30,
            "syllabus_text": null,
            "syllabus_file_path": "http://localhost:5000/uploads/courses/syllabus/syllabus-03102025201405-ZJO.pdf",
            "base_course_fee": "50000.00",
            "is_discounted": true,
            "discount_percentage": "10.00",
            "discount_amount": "5000.00",
            "discounted_course_fee": "45000.00",
            "hostel_available": true,
            "hostel_fee": "10000.00",
            "mess_available": true,
            "mess_fee": "8000.00",
            "total_fee": "63000.00",
            "show_offer_badge": true,
            "offer_badge_text": "Limited Offer",
            "thumbnail": "http://localhost:5000/uploads/courses/thumbnails/course-03102025201405-KPK.png",
            "is_active": true,
            "display_order": 1,
            "enrolled_students_count": 0,
            "created_by": 1,
            "updated_by": [],
            "is_deleted": false,
            "deleted_by": null,
            "createdAt": "2025-10-03T14:44:05.000Z",
            "updatedAt": "2025-10-03T14:44:05.000Z",
            "deletedAt": null
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 4,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    },
    "timestamp": "2025-10-03T14:49:23.811Z"
}
```

**Error Response (500):**
```json
{
    "success": false,
    "message": "Database error occurred",
    "timestamp": "2025-10-03T14:49:23.811Z"
}
```

## 2. Get Course by ID

**Method:** GET

**Endpoint:** `/api/internal/courses/view/:id`

**Authentication:** Required (Bearer Token)

**Authorization:** Roles: `super_admin`, `admin`, `seo`

**URL Parameters:**
- `id` (required) - Course ID

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "id": 1,
        "course_group_id": 101,
        "title": "Advanced JCB Excavator Training",
        "slug": "advanced-jcb-excavator-training",
        "language": "en",
        "summary": "Learn the basics of excavator operations.",
        "description": "Comprehensive beginner course covering safety, controls, and practical use of excavators.",
        "duration": 30,
        "syllabus_text": "Safety protocols, basic operations, maintenance",
        "syllabus_file_path": "http://localhost:5000/uploads/courses/syllabus/syllabus-03102025201405-ZJO.pdf",
        "base_course_fee": "20000.00",
        "is_discounted": true,
        "discount_percentage": "25.00",
        "discount_amount": "5000.00",
        "discounted_course_fee": "15000.00",
        "hostel_available": true,
        "hostel_fee": "0.00",
        "mess_available": true,
        "mess_fee": "0.00",
        "total_fee": "15000.00",
        "show_offer_badge": true,
        "offer_badge_text": "Limited Offer",
        "thumbnail": "http://localhost:5000/uploads/courses/thumbnails/course-03102025201405-KPK.jpg",
        "is_active": false,
        "display_order": 1,
        "enrolled_students_count": 0,
        "created_by": null,
        "updated_by": [
            {
                "id": 1,
                "timestamp": "2025-09-07T19:54:20.423Z"
            }
        ],
        "is_deleted": false,
        "deleted_by": null,
        "createdAt": "2025-09-06T20:16:18.000Z",
        "updatedAt": "2025-10-03T17:19:00.000Z",
        "deletedAt": null
    },
    "timestamp": "2025-10-03T17:23:25.321Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Course not found",
    "timestamp": "2025-10-03T17:23:25.321Z"
}
```



## 3. Create Course

**Method:** POST

**Endpoint:** `/api/internal/courses/create`

**Authentication:** Required (Bearer Token)

**Authorization:** Roles: `super_admin`, `admin`, `seo`

**Content-Type:** multipart/form-data

**Request Payload (Form Data):**

**Mandatory Fields:**
- `title` (string) - Course title
- `summary` (string) - Short course summary
- `description` (string) - Detailed course description
- `duration` (number) - Course duration in days
- `base_course_fee` (number) - Base course fee amount
- `thumbnail` (file) - Course thumbnail image

**Optional Fields:**
- `language` (string, default: "en") - Course language (en, hi, mar)
- `syllabus_text` (string) - Text description of syllabus
- `syllabus` (file) - Syllabus PDF file
- `is_featured` (boolean, default: false) - Featured course flag
- `is_active` (boolean, default: true) - Active status
- `show_on_homepage` (boolean, default: false) - Display on homepage
- `is_discounted` (boolean, default: false) - Discount flag
- `discount_amount` (number) - Discount amount
- `discount_percentage` (number) - Discount percentage
- `show_offer_badge` (boolean, default: false) - Show offer badge
- `offer_badge_text` (string) - Offer badge text
- `hostel_available` (boolean, default: false) - Hostel availability
- `hostel_fee` (number) - Hostel fee amount
- `mess_available` (boolean, default: false) - Mess availability
- `mess_fee` (number) - Mess fee amount
- `display_order` (number, default: 0) - Display order
- `course_type` (string) - Course type
- `base_course_group_id` (number) - Base course group ID (for language variants)

**Success Response (201):**
```json
{
    "success": true,
    "message": "Course created successfully",
    "data": {
        "id": 11,
        "course_group_id": 203,
        "title": "Advanced Excavator Training",
        "slug": "advanced-excavator-training",
        "language": "en",
        "summary": "Master advanced excavator techniques",
        "description": "Comprehensive advanced training...",
        "duration": 45,
        "base_course_fee": "60000.00",
        "is_discounted": true,
        "discount_amount": "10000.00",
        "discount_percentage": "16.67",
        "discounted_course_fee": "50000.00",
        "total_fee": "50000.00",
        "thumbnail": "uploads/courses/thumbnails/course-12072025-ABC.png",
        "syllabus_file_path": "uploads/courses/syllabus/syllabus-12072025-XYZ.pdf",
        "is_active": true,
        "display_order": 0,
        "enrolled_students_count": 0,
        "created_by": 1,
        "createdAt": "2025-12-07T10:00:00.000Z",
        "updatedAt": "2025-12-07T10:00:00.000Z"
    },
    "timestamp": "2025-10-03T14:44:05.621Z"
}
```

**Error Response (400 - Validation Error):**
```json
{
    "success": false,
    "message": "Validation error",
    "errors": {
        "title": "title is required",
        "base_course_fee": "base course fee is required"
    },
    "timestamp": "2025-10-03T14:44:05.621Z"
}
```

## 4. Update Course

**Method:** PUT

**Endpoint:** `/api/internal/courses/update/:id`

**Authentication:** Required (Bearer Token)

**Authorization:** Roles: `super_admin`, `admin`, `seo`

**Content-Type:** multipart/form-data

**URL Parameters:**
- `id` (required) - Course ID

**Request Payload (Form Data):**

All fields are optional. Only include fields you want to update.

**Available Fields:**
- `title` (string) - Course title
- `summary` (string) - Short course summary
- `description` (string) - Detailed course description
- `duration` (number) - Course duration in days
- `base_course_fee` (number) - Base course fee amount
- `thumbnail` (file) - Course thumbnail image
- `language` (string) - Course language (en, hi, mar)
- `syllabus_text` (string) - Text description of syllabus
- `syllabus` (file) - Syllabus PDF file
- `is_featured` (boolean) - Featured course flag
- `is_active` (boolean) - Active status
- `show_on_homepage` (boolean) - Display on homepage
- `is_discounted` (boolean) - Discount flag
- `discount_amount` (number) - Discount amount
- `discount_percentage` (number) - Discount percentage
- `show_offer_badge` (boolean) - Show offer badge
- `offer_badge_text` (string) - Offer badge text
- `hostel_available` (boolean) - Hostel availability
- `hostel_fee` (number) - Hostel fee amount
- `mess_available` (boolean) - Mess availability
- `mess_fee` (number) - Mess fee amount
- `display_order` (number) - Display order
- `course_type` (string) - Course type
- `old_thumbnail` (string) - Path to old thumbnail (for deletion)
- `old_syllabus` (string) - Path to old syllabus (for deletion)

**Success Response (200):**
```json
{
    "success": true,
    "message": "Course updated successfully",
    "data": {
        "id": 1,
        "course_group_id": 101,
        "title": "Updated Course Title",
        "slug": "updated-course-title",
        "language": "en",
        "updated_by": [
            {
                "id": 1,
                "timestamp": "2025-09-07T19:54:20.423Z"
            },
            {
                "id": 1,
                "timestamp": "2025-10-03T17:19:00.769Z"
            }
        ],
        "updatedAt": "2025-10-03T17:19:00.000Z"
    },
    "timestamp": "2025-10-03T17:19:00.931Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Course not found",
    "timestamp": "2025-10-03T17:19:00.931Z"
}
```

**Error Response (400 - Validation Error):**
```json
{
    "success": false,
    "message": "Validation error",
    "errors": {
        "slug": "A course with similar title already exists"
    },
    "timestamp": "2025-10-03T17:19:00.931Z"
}
```

## 5. Get Course Variants by Group ID

**Method:** GET

**Endpoint:** `/api/internal/courses/variants/:course_group_id`

**Authentication:** Required (Bearer Token)

**Authorization:** Roles: `super_admin`, `admin`, `seo`

**URL Parameters:**
- `course_group_id` (required) - Course group ID

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "en": {
            "id": 1,
            "course_group_id": 101,
            "title": "JCB Excavator Training",
            "language": "en",
            "slug": "jcb-excavator-training"
        },
        "hi": {
            "id": 2,
            "course_group_id": 101,
            "title": "जेसीबी एक्सकेवेटर प्रशिक्षण",
            "language": "hi",
            "slug": "jcb-excavator-training-hi"
        }
    },
    "timestamp": "2025-10-03T17:13:41.890Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Course not found",
    "timestamp": "2025-10-03T17:13:41.890Z"
}
```

---

## 6. Create Course Language Variant

**Method:** POST

**Endpoint:** `/api/internal/courses/variants/create/:course_group_id`

**Authentication:** Required (Bearer Token)

**Authorization:** Roles: `super_admin`, `admin`, `seo`

**Content-Type:** multipart/form-data

**URL Parameters:**
- `course_group_id` (required) - Base course group ID

**Request Payload (Form Data):**

Same as Create Course API (Section 3), but the `course_group_id` from URL will be used automatically.

**Success Response (201):**
```json
{
    "success": true,
    "message": "Course created successfully",
    "data": {
        "id": 12,
        "course_group_id": 101,
        "title": "जेसीबी एक्सकेवेटर प्रशिक्षण",
        "language": "hi",
        "slug": "jcb-excavator-training-hi"
    },
    "timestamp": "2025-10-03T14:44:05.621Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Validation error",
    "errors": {
        "base_course_group_id": "Base course group not found"
    },
    "timestamp": "2025-10-03T14:44:05.621Z"
}
```

---

## 7. Reorder Courses

**Method:** PUT

**Endpoint:** `/api/internal/courses/reorder`

**Authentication:** Required (Bearer Token)

**Authorization:** Roles: `super_admin`, `admin`, `seo`

**Content-Type:** application/json

**Request Payload:**
```json
{
    "courses": [
        {
            "id": 1,
            "display_order": 1
        },
        {
            "id": 2,
            "display_order": 2
        },
        {
            "id": 3,
            "display_order": 3
        }
    ]
}
```

**Mandatory Fields:**
- `courses` (array) - Array of course objects with id and display_order

**Success Response (200):**
```json
{
    "success": true,
    "message": "Course order updated successfully",
    "data": null,
    "timestamp": "2025-10-03T15:33:45.256Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Validation error",
    "errors": {
        "courses": "Courses array is required"
    },
    "timestamp": "2025-10-03T15:33:45.256Z"
}
```

---

## 8. Toggle Course Status

**Method:** PATCH

**Endpoint:** `/api/internal/courses/toggle-status/:id`

**Authentication:** Required (Bearer Token)

**Authorization:** Roles: `super_admin`, `admin`, `seo`

**URL Parameters:**
- `id` (required) - Course ID

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Course deactivated successfully",
    "data": {
        "id": "1",
        "is_active": false
    },
    "timestamp": "2025-10-03T17:13:41.890Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Course not found",
    "timestamp": "2025-10-03T17:13:41.890Z"
}
```


---

## 9. Delete Course

**Method:** DELETE

**Endpoint:** `/api/internal/courses/delete/:id`

**Authentication:** Required (Bearer Token)

**Authorization:** Roles: `super_admin`, `admin`, `seo`

**URL Parameters:**
- `id` (required) - Course ID

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Course deleted successfully",
    "data": null,
    "timestamp": "2025-10-03T17:22:01.554Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Course not found",
    "timestamp": "2025-10-03T17:22:01.554Z"
}
```