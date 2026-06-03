# Enquiry API Documentation

This document provides comprehensive documentation for all enquiry-related API endpoints, including both internal (admin panel) and public (website) APIs.

---

## A) Internal APIs (Admin Panel)

**Base URL:** `{{baseUrl}}/api/internal/enquiry`  
**Authentication:** Required (JWT Bearer Token)  
**Roles:** `super_admin`, `admin`

---

### 1. Get All Enquiries

Retrieve a paginated list of all enquiries with optional filtering and sorting.

**Method:** `GET`  
**Endpoint:** `/api/internal/enquiry`

**Query Parameters:**
- `status` (optional): Filter by status - `unread`, `read`, `discard`
- `source` (optional): Filter by source - `website`, `referral`, `ad`, `fb`, `insta`, `yt`, `other`
- `search` (optional): Search term for name, email, or phone
- `is_action_taken` (optional): Filter by action taken - `true`, `false`
- `action_type` (optional): Filter by action type - `no_action`, `call`, `whatsapp`, `email`, `text_message`, `visit`, `discard`
- `enquiry_type` (optional): Filter by enquiry type - `general`, `course`, `offline`, `contact_us`, `other`
- `startDate` (optional): Filter from date (ISO format)
- `endDate` (optional): Filter to date (ISO format)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order - `ASC`, `DESC` (default: DESC)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 1,
            "name": "Jane Doe",
            "email": "jane@example.com",
            "phone": "+919876543210",
            "course_id": 1,
            "course_name": "JCB Training",
            "message": "Need details about course duration",
            "enquiry_type": "course",
            "source": "website",
            "status": "unread",
            "is_action_taken": false,
            "action_type": "no_action",
            "remark": null,
            "created_by": null,
            "updated_by": [],
            "is_deleted": false,
            "deleted_by": null,
            "createdAt": "2025-10-10T09:41:16.000Z",
            "updatedAt": "2025-10-10T09:41:16.000Z",
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
    "timestamp": "2025-12-07T10:13:40.364Z"
}
```

**Error Response (500):**
```json
{
    "success": false,
    "message": "Failed to retrieve data",
    "timestamp": "2025-12-07T10:13:40.364Z"
}
```

---

### 2. Get Enquiry by ID

Retrieve details of a specific enquiry.

**Method:** `GET`  
**Endpoint:** `/api/internal/enquiry/view/:id`

**URL Parameters:**
- `id` (required): Enquiry ID

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+919876543210",
        "course_id": 1,
        "course_name": "JCB Training",
        "message": "Need details about course duration",
        "enquiry_type": "course",
        "source": "website",
        "status": "read",
        "is_action_taken": true,
        "action_type": "call",
        "remark": "Called and provided information",
        "created_by": null,
        "updated_by": [{"id": "124", "timestamp": "2025-12-07T10:23:45Z"}],
        "is_deleted": false,
        "deleted_by": null,
        "createdAt": "2025-10-10T09:41:16.000Z",
        "updatedAt": "2025-12-07T10:23:45.000Z",
        "deletedAt": null
    },
    "timestamp": "2025-12-07T10:13:40.364Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Enquiry not found",
    "timestamp": "2025-12-07T10:13:40.364Z"
}
```

---

### 3. Create Enquiry (Internal)

Create a new enquiry from the admin panel.

**Method:** `POST`  
**Endpoint:** `/api/internal/enquiry/create`

**Request Payload:**
```json
{
    "name": "John Smith",
    "phone": "+919876543210",
    "email": "john@example.com",
    "course_id": 2,
    "course_name": "Excavator Training",
    "message": "Interested in next batch",
    "enquiry_type": "course",
    "source": "referral"
}
```

**Mandatory Fields:**
- `name` (string, min 2 chars)
- `phone` (string, 10-15 digits)
- `message` (string, min 5 chars)

**Optional Fields:**
- `email` (string, valid email format)
- `course_id` (integer)
- `course_name` (string)
- `enquiry_type` (enum: general, course, offline, contact_us, other)
- `source` (enum: website, referral, ad, fb, insta, yt, other)

**Success Response (201):**
```json
{
    "success": true,
    "message": "Enquiry created successfully",
    "data": {
        "id": 15,
        "name": "John Smith",
        "phone": "+919876543210",
        "email": "john@example.com",
        "course_id": 2,
        "message": "Interested in next batch",
        "status": "unread",
        "source": "referral"
    },
    "timestamp": "2025-12-07T10:15:20.123Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Duplicate enquiry - Phone +919876543210 has 2 existing enquiries",
    "timestamp": "2025-12-07T10:15:20.123Z"
}
```

---

### 4. Update Enquiry Status

Update the status of an enquiry.

**Method:** `PATCH`  
**Endpoint:** `/api/internal/enquiry/update-status/:id`

**URL Parameters:**
- `id` (required): Enquiry ID

**Request Payload:**
```json
{
    "status": "read"
}
```

**Mandatory Fields:**
- `status` (enum: unread, read, discard)

**Success Response (200):**
```json
{
    "success": true,
    "message": "Enquiry status updated to read successfully",
    "data": {
        "id": 3,
        "name": "Jane Doe",
        "status": "read"
    },
    "timestamp": "2025-12-07T10:09:10.750Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Invalid status. Allowed values: unread, read, discard",
    "timestamp": "2025-12-07T10:09:10.750Z"
}
```

---

### 5. Update Enquiry Action

Mark an action as taken on an enquiry.

**Method:** `PATCH`  
**Endpoint:** `/api/internal/enquiry/update-action/:id`

**URL Parameters:**
- `id` (required): Enquiry ID

**Request Payload:**
```json
{
    "action_type": "call",
    "remark": "Called customer and provided course details"
}
```

**Mandatory Fields:**
- `action_type` (enum: no_action, call, whatsapp, email, text_message, visit, discard)

**Optional Fields:**
- `remark` (string)

**Success Response (200):**
```json
{
    "success": true,
    "message": "Action marked as taken on enquiry",
    "data": {
        "id": 2,
        "name": "Jane Doe",
        "is_action_taken": true,
        "action_type": "call",
        "remark": "Called customer and provided course details",
        "status": "read"
    },
    "timestamp": "2025-12-07T10:03:51.723Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Enquiry not found",
    "timestamp": "2025-12-07T10:03:51.723Z"
}
```

---

### 6. Bulk Update Status

Update status for multiple enquiries at once.

**Method:** `PATCH`  
**Endpoint:** `/api/internal/enquiry/bulk-status`

**Request Payload:**
```json
{
    "ids": [1, 2, 3, 5],
    "status": "read"
}
```

**Mandatory Fields:**
- `ids` (array of integers, non-empty)
- `status` (enum: unread, read, discard)

**Success Response (200):**
```json
{
    "success": true,
    "message": "4 enquiries updated successfully",
    "data": {
        "updatedCount": 4
    },
    "timestamp": "2025-12-07T10:20:15.456Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "IDs array is required and cannot be empty",
    "timestamp": "2025-12-07T10:20:15.456Z"
}
```

---

### 7. Delete Enquiry

Soft delete an enquiry (marks as deleted, doesn't remove from database).

**Method:** `DELETE`  
**Endpoint:** `/api/internal/enquiry/delete/:id`

**URL Parameters:**
- `id` (required): Enquiry ID

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Enquiry deleted successfully",
    "data": null,
    "timestamp": "2025-12-07T10:11:54.378Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Enquiry not found",
    "timestamp": "2025-12-07T10:11:54.378Z"
}
```

---

### 8. Search Enquiries

Search enquiries by name, email, or phone number.

**Method:** `GET`  
**Endpoint:** `/api/internal/enquiry/search`

**Query Parameters:**
- `query` (required): Search term (min 2 characters)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Found 3 enquiries matching \"Jane\"",
    "data": [
        {
            "id": 1,
            "name": "Jane Doe",
            "email": "jane@example.com",
            "phone": "+919876543210",
            "course_id": 1,
            "message": "Need details",
            "status": "unread",
            "is_action_taken": false,
            "action_type": "no_action",
            "remark": null,
            "createdAt": "2025-10-10T09:41:16.000Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 3,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    },
    "timestamp": "2025-12-07T10:45:36.261Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Search term must be at least 2 characters long",
    "timestamp": "2025-12-07T10:45:36.261Z"
}
```

---

### 9. Filter Enquiries by Status

Get enquiries filtered by a specific status.

**Method:** `GET`  
**Endpoint:** `/api/internal/enquiry/status/:status`

**URL Parameters:**
- `status` (required): Status value - `unread`, `read`, `discard`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 1,
            "name": "Jane Doe",
            "email": "jane@example.com",
            "phone": "+919876543210",
            "status": "unread",
            "is_action_taken": false,
            "createdAt": "2025-10-10T09:41:16.000Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 12,
        "totalPages": 2,
        "hasNext": true,
        "hasPrev": false
    },
    "timestamp": "2025-12-07T10:40:16.024Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Invalid status",
    "timestamp": "2025-12-07T10:40:16.024Z"
}
```

---

### 10. Filter Enquiries by Source

Get enquiries filtered by a specific source.

**Method:** `GET`  
**Endpoint:** `/api/internal/enquiry/source/:source`

**URL Parameters:**
- `source` (required): Source value - `website`, `referral`, `ad`, `fb`, `insta`, `yt`, `other`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 3,
            "name": "Jane Doe",
            "email": "abc@yopmail.com",
            "phone": "+919876543299",
            "course_id": 1,
            "message": "Need details",
            "source": "website",
            "status": "read",
            "createdAt": "2025-10-24T10:11:27.000Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 45,
        "totalPages": 5,
        "hasNext": true,
        "hasPrev": false
    },
    "timestamp": "2025-12-07T10:38:04.061Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Invalid source",
    "timestamp": "2025-12-07T10:38:04.061Z"
}
```

---

### 11. Get Enquiry Statistics

Get statistical data about enquiries for different time periods.

**Method:** `GET`  
**Endpoint:** `/api/internal/enquiry/stats`

**Query Parameters:**
- `startDate` (optional): Custom start date (ISO format)
- `endDate` (optional): Custom end date (ISO format)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "today": {
            "dateRange": {
                "startDate": "2025-12-07T00:00:00.000Z",
                "endDate": "2025-12-07T15:30:00.000Z"
            },
            "total": 5,
            "byStatus": {
                "unread": 3,
                "read": 2,
                "action_taken": 0,
                "discard": 0
            },
            "bySource": [
                {"source": "website", "count": 4},
                {"source": "referral", "count": 1}
            ],
            "byActionType": [
                {"action_type": "no_action", "count": 5}
            ],
            "conversionRate": 0,
            "responseRate": 40
        },
        "thisWeek": {
            "total": 28,
            "byStatus": {"unread": 10, "read": 15, "action_taken": 3, "discard": 0},
            "conversionRate": 10.71,
            "responseRate": 64.29
        },
        "thisMonth": {
            "total": 120,
            "conversionRate": 15.83,
            "responseRate": 72.5
        },
        "thisYear": {
            "total": 450,
            "conversionRate": 18.22,
            "responseRate": 75.11
        },
        "customRange": {}
    },
    "timestamp": "2025-12-07T15:30:00.000Z"
}
```

**Error Response (500):**
```json
{
    "success": false,
    "message": "Failed to retrieve data",
    "timestamp": "2025-12-07T15:30:00.000Z"
}
```

---

### 12. Get Dashboard Data

Get comprehensive dashboard data including statistics for multiple time periods.

**Method:** `GET`  
**Endpoint:** `/api/internal/enquiry/dashboard`

**Query Parameters:**
- `startDate` (optional): Custom start date (ISO format)
- `endDate` (optional): Custom end date (ISO format)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Dashboard data retrieved successfully",
    "data": {
        "statistics": {
            "today": {
                "total": 5,
                "byStatus": {"unread": 3, "read": 2, "action_taken": 0, "discard": 0},
                "conversionRate": 0,
                "responseRate": 40
            },
            "thisWeek": {"total": 28},
            "thisMonth": {"total": 120},
            "thisYear": {"total": 450}
        }
    },
    "timestamp": "2025-12-07T15:30:00.000Z"
}
```

**Error Response (500):**
```json
{
    "success": false,
    "message": "Failed to retrieve dashboard data",
    "timestamp": "2025-12-07T15:30:00.000Z"
}
```

---

### 13. Export Enquiries

Export enquiries to Excel file with filtering options.

**Method:** `GET`  
**Endpoint:** `/api/internal/enquiry/export`

**Query Parameters:**
- `status` (optional): Filter by status
- `source` (optional): Filter by source
- `search` (optional): Search term
- `is_action_taken` (optional): Filter by action taken
- `action_type` (optional): Filter by action type
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Request Payload:** None

**Success Response (200):**
- Returns Excel file download with two sheets:
  - **Summary**: Export metadata and statistics
  - **Enquiries**: Detailed enquiry data

**Error Response (500):**
```json
{
    "success": false,
    "message": "Failed to export enquiries",
    "timestamp": "2025-12-07T15:30:00.000Z"
}
```

---

## B) Public/Website APIs

**Base URL:** `{{baseUrl}}/api/public/enquiry`  
**Authentication:** Not Required

---

### 1. Submit Enquiry (Public)

Submit a new enquiry from the website.

**Method:** `POST`  
**Endpoint:** `/api/public/enquiry`

**Request Payload:**
```json
{
    "name": "Jane Doe",
    "phone": "+919876543299",
    "email": "jane@example.com",
    "course_id": 1,
    "course_name": "JCB Training",
    "message": "I want to know about course duration and fees"
}
```

**Mandatory Fields:**
- `name` (string, min 2 chars)
- `phone` (string, 10-15 digits)
- `message` (string, min 5 chars)

**Optional Fields:**
- `email` (string, valid email format)
- `course_id` (integer)
- `course_name` (string)

**Success Response (201):**
```json
{
    "success": true,
    "message": "Your enquiry has been submitted successfully. We will contact you soon!",
    "data": {
        "id": 25,
        "name": "Jane Doe",
        "phone": "+919876543299",
        "message": "I want to know about course duration and fees",
        "status": "unread"
    },
    "timestamp": "2025-12-07T10:02:21.702Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Duplicate enquiry - Phone +919876543299 has 1 existing enquiries",
    "timestamp": "2025-12-07T10:02:21.702Z"
}
```

---

### 2. Check Enquiry Status

Check the status of enquiries by phone number.

**Method:** `GET`  
**Endpoint:** `/api/public/enquiry/status/:phone`

**URL Parameters:**
- `phone` (required): Phone number

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Enquiry status retrieved successfully.",
    "data": [
        {
            "id": 25,
            "name": "Jane Doe",
            "phone": "+919876543299",
            "status": "read",
            "created_at": "2025-12-07T10:02:21.702Z",
            "is_action_taken": true,
            "action_type": "call"
        }
    ],
    "timestamp": "2025-12-07T15:45:00.000Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Phone number is required",
    "timestamp": "2025-12-07T15:45:00.000Z"
}
```

---

### 3. Get Public Statistics

Get public-facing statistics about enquiries (for marketing purposes).

**Method:** `GET`  
**Endpoint:** `/api/public/enquiry/stats`

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Statistics retrieved successfully.",
    "data": {
        "totalEnquiries": 450,
        "responseRate": 75.11,
        "mostPopularSources": [
            {"source": "website", "count": 300},
            {"source": "referral", "count": 100},
            {"source": "fb", "count": 50}
        ],
        "message": "Join thousands of satisfied customers!"
    },
    "timestamp": "2025-12-07T15:50:00.000Z"
}
```

**Error Response (500):**
```json
{
    "success": true,
    "message": "Statistics retrieved successfully.",
    "data": {
        "totalEnquiries": "500+",
        "responseRate": "95%",
        "mostPopularSources": [
            {"source": "website", "count": "300+"},
            {"source": "referral", "count": "150+"},
            {"source": "phone", "count": "50+"}
        ],
        "message": "Join thousands of satisfied customers!"
    },
    "timestamp": "2025-12-07T15:50:00.000Z"
}
```

---

## Enum Values Reference

### Status
- `unread` - Enquiry not yet viewed
- `read` - Enquiry has been viewed
- `discard` - Enquiry marked as discarded

### Source
- `website` - From website form
- `referral` - From referral
- `ad` - From advertisement
- `fb` - From Facebook
- `insta` - From Instagram
- `yt` - From YouTube
- `other` - Other sources

### Action Type
- `no_action` - No action taken
- `call` - Called the enquirer
- `whatsapp` - Contacted via WhatsApp
- `email` - Sent email
- `text_message` - Sent SMS
- `visit` - In-person visit
- `discard` - Discarded enquiry

### Enquiry Type
- `general` - General enquiry
- `course` - Course-specific enquiry
- `offline` - Offline enquiry
- `contact_us` - Contact us form
- `other` - Other types

---

## Notes

1. **Duplicate Prevention**: The system prevents duplicate enquiries from the same phone number. If a phone number already has existing enquiries, the creation will fail with an appropriate message.

2. **Automatic Defaults**: When creating enquiries from the public API, the system automatically sets:
   - `source` to "website"
   - `status` to "unread"
   - `enquiry_type` to "contact_us"

3. **Action Tracking**: When an action is taken (other than `no_action`), the system automatically:
   - Sets `is_action_taken` to `true`
   - Updates `status` to "read"
   - If action is "discard", sets `status` to "discard"

4. **Soft Deletes**: Deleted enquiries are not permanently removed from the database. They are marked with `is_deleted: true` and `deleted_by` contains the user ID who deleted them.

5. **Audit Trail**: All enquiries track:
   - `created_by` - User who created the record
   - `updated_by` - Array of user IDs and timestamps who updated the record
   - `deleted_by` - User who deleted the record

6. **Search Functionality**: The search endpoint searches across name, email, and phone number fields.

7. **Export Format**: The export generates an Excel file with two sheets - a summary sheet with statistics and a detailed data sheet with all enquiry information.
