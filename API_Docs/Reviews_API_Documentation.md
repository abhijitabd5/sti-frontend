# Reviews API Documentation

## Internal Routes (Admin Panel)

All internal routes require authentication and role-based access control.
Allowed roles: `super_admin`, `admin`, `employee`, `marketing`, `seo`, `student`

---

### 1. Create Review

**Method:** `POST`  
**Endpoint:** `/api/internal/review/create`  
**Content-Type:** `multipart/form-data`  
**Authorization:** Bearer token required

**Request Payload:**

Form Data Fields:
- `name` (string, **mandatory**) - Reviewer name (min 2 characters)
- `review_text` (string, **mandatory**) - Review content (min 10 characters)
- `rating` (integer, **mandatory**) - Rating value (1-5)
- `city` (string, optional) - Reviewer's city
- `phone` (string, optional) - Contact phone number
- `student_id` (integer, optional) - Associated student ID
- `is_enrolled_student` (boolean, optional) - Whether reviewer is enrolled student
- `recruited_at` (string, optional) - Company/organization where recruited
- `qr_code_url` (string, optional) - QR code URL for verification
- `file` (file, optional) - Profile photo upload

**Success Response (201):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "review_text": "Excellent training program! The instructors were very knowledgeable and helpful.",
    "rating": 5,
    "city": "Mumbai",
    "phone": "9876543210",
    "student_id": null,
    "is_enrolled_student": false,
    "is_approved": false,
    "display_order": 0,
    "profile_photo": "uploads/profiles/27102025231002-abhjeetjpeg-vaf.jpeg",
    "recruited_at": "JK Construction",
    "qr_code_url": "https://api.qrserver.com/v1/create-qr-code/?data=Name%3A%20John%20Doe%2C%20phone%3A%209876543210&size=200x200",
    "created_by": 1,
    "createdAt": "2025-10-27T13:37:01.875Z",
    "updatedAt": "2025-10-27T13:37:01.875Z"
  },
  "timestamp": "2025-10-27T13:37:01.875Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": "Name is required and must be at least 2 characters",
    "review_text": "Review text is required and must be at least 10 characters",
    "rating": "Rating is required and must be between 1 and 5"
  },
  "timestamp": "2025-10-27T13:37:01.875Z"
}
```

---

### 2. Get All Reviews

**Method:** `GET`  
**Endpoint:** `/api/internal/reviews`  
**Authorization:** Bearer token required

**Query Parameters:**
- `page` (integer, optional, default: 1) - Page number
- `limit` (integer, optional, default: 10, max: 100) - Items per page
- `search` (string, optional) - Search by name or review text
- `is_approved` (boolean, optional) - Filter by approval status
- `is_enrolled_student` (boolean, optional) - Filter by enrollment status
- `rating` (integer, optional) - Filter by rating (1-5)
- `student_id` (integer, optional) - Filter by student ID
- `sortBy` (string, optional, default: "display_order") - Sort field
- `sortOrder` (string, optional, default: "ASC") - Sort order (ASC/DESC)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": [
    {
      "id": 3,
      "student_id": 1,
      "name": "John Doe",
      "city": "Mumbai",
      "phone": "9876543210",
      "review_text": "Excellent training program! The instructors were very knowledgeable and helpful.",
      "rating": 5,
      "is_approved": false,
      "is_enrolled_student": true,
      "display_order": 0,
      "profile_photo": "uploads/profiles/25102025002435-abhjeetjpeg-qdi.jpeg",
      "recruited_at": "JK Construction",
      "qr_code_url": "https://api.qrserver.com/v1/create-qr-code/?data=Name%3A%20John%20Doe%2C%20phone%3A%209876543210&size=200x200",
      "created_by": 1,
      "updated_by": null,
      "is_deleted": false,
      "deleted_by": null,
      "createdAt": "2025-10-27T13:00:22.000Z",
      "updatedAt": "2025-10-27T13:00:22.000Z",
      "deletedAt": null
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
  "timestamp": "2025-10-27T13:26:03.630Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "limit": "Limit must be between 1 and 100"
  },
  "timestamp": "2025-10-27T13:26:03.630Z"
}
```

---

### 3. Get Review By ID

**Method:** `GET`  
**Endpoint:** `/api/internal/review/view/:id`  
**Authorization:** Bearer token required

**URL Parameters:**
- `id` (integer, **mandatory**) - Review ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review retrieved successfully",
  "data": {
    "id": 3,
    "student_id": 1,
    "name": "John Doe",
    "city": "Mumbai",
    "phone": "9876543210",
    "review_text": "Excellent training program! The instructors were very knowledgeable and helpful.",
    "rating": 5,
    "is_approved": false,
    "is_enrolled_student": true,
    "display_order": 0,
    "profile_photo": "uploads/profiles/25102025002435-abhjeetjpeg-qdi.jpeg",
    "recruited_at": "JK Construction",
    "qr_code_url": "https://api.qrserver.com/v1/create-qr-code/?data=Name%3A%20John%20Doe%2C%20phone%3A%209876543210&size=200x200",
    "created_by": 1,
    "updated_by": null,
    "is_deleted": false,
    "deleted_by": null,
    "createdAt": "2025-10-27T13:00:22.000Z",
    "updatedAt": "2025-10-27T13:00:22.000Z",
    "deletedAt": null
  },
  "timestamp": "2025-10-27T13:26:03.630Z"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Review not found",
  "timestamp": "2025-10-27T13:26:03.630Z"
}
```

---

### 4. Update Review

**Method:** `PUT`  
**Endpoint:** `/api/internal/review/edit/:id`  
**Content-Type:** `multipart/form-data`  
**Authorization:** Bearer token required

**URL Parameters:**
- `id` (integer, **mandatory**) - Review ID

**Request Payload:**

Form Data Fields (all optional, at least one required):
- `name` (string, optional) - Reviewer name (min 2 characters)
- `review_text` (string, optional) - Review content (min 10 characters)
- `rating` (integer, optional) - Rating value (1-5)
- `city` (string, optional) - Reviewer's city
- `phone` (string, optional) - Contact phone number
- `display_order` (integer, optional) - Display order (>= 0)
- `is_enrolled_student` (boolean, optional) - Whether reviewer is enrolled student
- `recruited_at` (string, optional) - Company/organization where recruited
- `file` (file, optional) - Profile photo upload

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "id": 2,
    "student_id": 1,
    "name": "John Doe",
    "city": "Mumbai",
    "phone": "9876543210",
    "review_text": "Updated review text",
    "rating": 5,
    "display_order": 1,
    "created_by": 1,
    "updated_by": [
      {
        "id": 1,
        "timestamp": "2025-10-27T13:30:11.421Z"
      }
    ],
    "updatedAt": "2025-10-27T13:33:48.598Z"
  },
  "timestamp": "2025-10-27T13:33:48.598Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Display order can only be set for approved reviews",
  "timestamp": "2025-10-27T13:33:48.598Z"
}
```

---

### 5. Change Approval Status

**Method:** `PATCH`  
**Endpoint:** `/api/internal/review/approval-status/:id`  
**Content-Type:** `application/json`  
**Authorization:** Bearer token required

**URL Parameters:**
- `id` (integer, **mandatory**) - Review ID

**Request Payload:**
```json
{
  "is_approved": true
}
```

Fields:
- `is_approved` (boolean, **mandatory**) - Approval status

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review approved successfully",
  "data": {
    "id": 2,
    "student_id": 1,
    "name": "John Doe",
    "city": "Mumbai",
    "phone": "9876543210",
    "is_approved": true,
    "display_order": 0,
    "updatedAt": "2025-10-27T13:40:05.199Z"
  },
  "timestamp": "2025-10-27T13:40:05.199Z"
}
```

**Note:** When `is_approved: false`, the `display_order` is automatically reset to 0.

**Error Response (404):**
```json
{
  "success": false,
  "message": "Review not found",
  "timestamp": "2025-10-27T13:40:05.199Z"
}
```

---

### 6. Reorder Reviews

**Method:** `POST`  
**Endpoint:** `/api/internal/review/reorder`  
**Content-Type:** `application/json`  
**Authorization:** Bearer token required

**Request Payload:**
```json
{
  "reviews": [
    { "id": 1, "display_order": 1 },
    { "id": 2, "display_order": 2 },
    { "id": 3, "display_order": 3 }
  ]
}
```

Fields:
- `reviews` (array, **mandatory**) - Array of review objects
  - `id` (integer, **mandatory**) - Review ID
  - `display_order` (integer, **mandatory**) - New display order (>= 0)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Reviews reordered successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "display_order": 1,
      "updatedAt": "2025-10-27T13:48:41.927Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "display_order": 2,
      "updatedAt": "2025-10-27T13:48:41.927Z"
    }
  ],
  "timestamp": "2025-10-27T13:48:41.927Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "reviews": "Reviews array is required and must not be empty"
  },
  "timestamp": "2025-10-27T13:48:41.927Z"
}
```

---

### 7. Delete Review

**Method:** `DELETE`  
**Endpoint:** `/api/internal/review/delete/:id`  
**Authorization:** Bearer token required

**URL Parameters:**
- `id` (integer, **mandatory**) - Review ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": null,
  "timestamp": "2025-10-27T13:51:46.740Z"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Review not found",
  "timestamp": "2025-10-27T13:51:46.740Z"
}
```

---

### 8. Get Review Statistics

**Method:** `GET`  
**Endpoint:** `/api/internal/review/statistics`  
**Authorization:** Bearer token required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total": 150,
    "approved": 120,
    "pending": 30,
    "enrolledStudents": 100,
    "averageRating": "4.65"
  },
  "timestamp": "2025-10-27T14:00:00.000Z"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Internal server error",
  "timestamp": "2025-10-27T14:00:00.000Z"
}
```

---

## Public Routes (Website)

### 9. Create Review (Public)

**Method:** `POST`  
**Endpoint:** `/api/public/review/create`  
**Content-Type:** `multipart/form-data`  
**Authorization:** Not required

**Request Payload:**

Form Data Fields:
- `name` (string, **mandatory**) - Reviewer name (min 2 characters)
- `review_text` (string, **mandatory**) - Review content (min 10 characters)
- `rating` (integer, **mandatory**) - Rating value (1-5)
- `city` (string, optional) - Reviewer's city
- `phone` (string, optional) - Contact phone number
- `student_id` (integer, optional) - Associated student ID
- `is_enrolled_student` (boolean, optional) - Whether reviewer is enrolled student
- `recruited_at` (string, optional) - Company/organization where recruited
- `qr_code_url` (string, optional) - QR code URL for verification
- `file` (file, optional) - Profile photo upload

**Success Response (201):**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "id": 5,
    "message": "Thank you for your review! It will be published after approval."
  },
  "timestamp": "2025-10-27T14:05:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": "Name is required and must be at least 2 characters",
    "review_text": "Review text is required and must be at least 10 characters",
    "rating": "Rating is required and must be between 1 and 5"
  },
  "timestamp": "2025-10-27T14:05:00.000Z"
}
```

---

### 10. Get Approved Reviews (Public)

**Method:** `GET`  
**Endpoint:** `/api/public/reviews`  
**Authorization:** Not required

**Query Parameters:**
- `limit` (integer, optional, default: 10, max: 100) - Number of reviews to return

**Success Response (200):**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "city": "Mumbai",
      "phone": "9876543210",
      "profile_photo": "uploads/profiles/25102025002435-abhjeetjpeg-qdi.jpeg",
      "recruited_at": "JK Construction",
      "review_text": "Excellent training!",
      "rating": 5,
      "display_order": 1,
      "createdAt": "2025-10-27T13:00:22.000Z"
    }
  ],
  "timestamp": "2025-10-27T14:10:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "limit": "Limit must be a number between 1 and 100"
  },
  "timestamp": "2025-10-27T14:10:00.000Z"
}
```

---

### 11. Get Review Statistics (Public)

**Method:** `GET`  
**Endpoint:** `/api/public/review/statistics`  
**Authorization:** Not required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalReviews": 120,
    "averageRating": "4.65"
  },
  "timestamp": "2025-10-27T14:15:00.000Z"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Internal server error",
  "timestamp": "2025-10-27T14:15:00.000Z"
}
```

---

## Database Schema

```sql
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NULL,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(100) NULL,
  phone VARCHAR(15) NULL,
  profile_photo VARCHAR(255) NULL,
  recruited_at VARCHAR(255) NULL,
  review_text TEXT NOT NULL,
  rating INT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  is_enrolled_student BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  qr_code_url VARCHAR(500) NOT NULL,
  created_by INT NOT NULL,
  updated_by JSON,
  is_deleted BOOLEAN DEFAULT false,
  deleted_by INT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  deletedAt DATETIME NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);
```

---

## Notes

- All internal routes require authentication with Bearer token
- Internal routes are restricted to roles: `super_admin`, `admin`, `employee`, `marketing`, `seo`, `student`
- Public routes do not require authentication
- Reviews created via public endpoint are set to `is_approved: false` by default and require admin approval
- When a review is disapproved (`is_approved: false`), the `display_order` is automatically reset to 0
- Display order can only be set for approved reviews
- The system automatically generates a QR code URL if not provided
- Profile photos are uploaded via multipart/form-data with field name `file`
- All timestamps are in ISO 8601 format
- Soft delete is implemented - deleted reviews are not permanently removed from database
