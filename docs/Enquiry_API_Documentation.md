# Enquiry API Documentation

**Important Note:** Send `course_id` in Apply Now forms. These "Apply Now" forms should have a Courses dropdown so the user can select a course.

---

## A) Internal APIs

### 0) Get All Courses

**Endpoint:** `{{base_url}}/api/public/courses?language=en&sortBy=display_order&sortOrder=ASC`  
**Method:** `GET`

**Request Payload:**  
_No Request Payload_

**Response Payload:**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 1,
            "course_group_id": 101,
            "title": "Excavator Training - Expert"
        },
        {
            "id": 2,
            "course_group_id": 102,
            "title": "JCB Excavator Training"
        },
        {
            "id": 3,
            "course_group_id": 103,
            "title": "Excavator Training - Intermediate"
        }
    ],
    "timestamp": "2025-10-27T10:51:59.332Z"
}
```

---

### 1) Get All Enquiries

**Endpoint:** `{{baseUrl}}/api/internal/enquiry`  
**Method:** `GET`

**Request Payload:**  
_No Payload_

**Response Payload:**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 1,
            "name": "Jane Doe",
            "email": null,
            "phone": "+919876543210",
            "course_id": 1,
            "message": "Need details",
            "source": "website",
            "status": "unread",
            "is_action_taken": false,
            "action_type": null,
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
        "total": 4,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    },
    "timestamp": "2025-10-27T06:13:40.364Z"
}
```

---

### 2) Update Status of Enquiry

**Endpoint:** `{{baseUrl}}/api/internal/enquiry/update-status/:id`  
**Method:** `PATCH`

**Request Payload:**
```json
{
    "status": "read"
}
```

**Response Payload:**
```json
{
    "success": true,
    "message": "Enquiry status updated to read successfully",
    "data": {
        "id": 3,
        "name": "Jane Doe"
    },
    "timestamp": "2025-10-27T10:09:10.750Z"
}
```

---

### 3) Take Action on Enquiry

**Endpoint:** `{{baseUrl}}/api/internal/enquiry/update-action/:id`  
**Method:** `PATCH`

**Request Payload:**
```json
{
  "action_type": "call",
  "remark": "Followed up"
}
```

**Response Payload:**
```json
{
    "success": true,
    "message": "Action marked as taken on enquiry",
    "data": {
        "id": 2,
        "name": "Jane Doe"
    },
    "timestamp": "2025-10-27T10:03:51.723Z"
}
```

---

### 4) Delete Enquiry

**Endpoint:** `{{baseUrl}}/api/internal/enquiry/delete/:id`  
**Method:** `DELETE`

**Request Payload:**  
_No Payload_

**Response Payload:**
```json
{
    "success": true,
    "message": "Enquiry deleted successfully",
    "data": null,
    "timestamp": "2025-10-27T10:11:54.378Z"
}
```

---

## Filter Section

### 5) Search Enquiry

**Endpoint:** `{{baseUrl}}/api/internal/enquiry/search?query=Jane`  
**Method:** `GET`

**Request Payload:**  
_No Payload, just query parameter_

**Response Payload:**
```json
{
    "success": true,
    "message": "Found 1 enquiries matching "Jane"",
    "data": [
        {
            "id": 1,
            "name": "Jane Doe",
            "email": null,
            "phone": "+9876543210",
            "course_id": null,
            "message": "Need details",
            "status": "unread",
            "is_action_taken": false,
            "action_type": "no_action",
            "remark": null,
            "created_by": null,
            "updated_by": [],
            "is_deleted": false,
            "deleted_by": null,
            "createdAt": "2025-10-10T09:41:16.000Z",
            "updatedAt": "2025-10-27T07:04:02.000Z",
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
    "timestamp": "2025-10-27T10:45:36.261Z"
}
```

---

### 6) Filter Enquiry by Status

**Endpoint:** `{{baseUrl}}/api/internal/enquiry/status/:status`  
**Method:** `GET`

**Request Payload:**  
_No payload, just status parameter_

**Response Payload:**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 1,
            "name": "Jane Doe",
            "email": null,
            "phone": "+9876543210",
            "course_id": null,
            "message": "Need details",
            "status": "unread",
            "is_action_taken": false,
            "action_type": "no_action",
            "remark": null,
            "created_by": null,
            "updated_by": [],
            "is_deleted": false,
            "deleted_by": null,
            "createdAt": "2025-10-10T09:41:16.000Z",
            "updatedAt": "2025-10-27T07:04:02.000Z",
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
    "timestamp": "2025-10-27T10:40:16.024Z"
}
```

---

### 7) Filter Enquiry by Source

**Endpoint:** `{{baseUrl}}/api/internal/enquiry/source/:source`  
**Method:** `GET`

**Request Payload:**  
_No payload, just source parameter_

**Response Payload:**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 3,
            "name": "Jane Doe",
            "email": "abc@yopmail.com",
            "phone": "+9876543299",
            "course_id": 1,
            "message": "Need details",
            "status": "read",
            "is_action_taken": false,
            "action_type": "no_action",
            "remark": null,
            "created_by": null,
            "updated_by": [],
            "is_deleted": false,
            "deleted_by": null,
            "createdAt": "2025-10-24T10:11:27.000Z",
            "updatedAt": "2025-10-27T10:09:10.000Z",
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
    "timestamp": "2025-10-27T10:38:04.061Z"
}
```

---

## B) Website/Public APIs

### 1) Create Enquiry

**Endpoint:** `{{baseUrl}}/api/public/enquiry`  
**Method:** `POST`

**Request Payload:**
```json
{
  "name": "Jane Doe",
  "phone": "+9876543299",
  "email": "abc@yopmail.com",
  "course_id": 1,
  "course_name": "JCB Training",
  "message": "Need details"
}
```

**Response Payload:**
```json
{
    "success": true,
    "message": "Your enquiry has been submitted successfully. We will contact you soon!",
    "data": {
        "id": 2,
        "name": "Jane Doe",
        "phone": "+9876543299",
        "message": "Need details",
        "status": "unread"
    },
    "timestamp": "2025-10-24T10:02:21.702Z"
}
```
