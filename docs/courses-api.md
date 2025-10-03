### Get All Course API
- Method: GET
- Endpoint: {{base_url}}/api/internal/courses?language=en&sortBy=display_order&sortOrder=ASC
- Request Payload : No Paload
- Response Payload :
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

### View Course (Single) API
- Method: GET
- Endpoint: {{base_url}}/api/internal/courses/view/:id
- Request Payload : No Payload, Just Parameter
- Response Payload :
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



### Create Course API
- Method: POST (Multipart Form Data)
- Endpoint: {{base_url}}/api/internal/courses/create
- Request Payload : form data
title, summary, description, duration, base_course_fee, is_featured, is_active, is_discounted, discount_amount, discount_percentage, show_offer_badge, offer_badge_text, hostel_available, hostel_fee, mess_available, mess_fee, display_order, course_group_id, syllabus_text, syllabus

Out of which title, summary, description, duration, base_course_fee, thumbnail are mandatory fields

- Response Payload :
{
    "success": true,
    "message": "Course created successfully",
    "data": {
        "language": "en",
        ...Other data
    },
    "timestamp": "2025-10-03T14:44:05.621Z"
}

### Update course API
- Method: PUT (Form Data)
- Endpoint: {{base_url}}/api/internal/courses/update/:id
- Request Payload : Same As Create Course API
- Response Payload :
{
    "success": true,
    "message": "Course updated successfully",
    "data": {
        ...Other Data
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
    },
    "timestamp": "2025-10-03T17:19:00.931Z"
}

### Toggle Status (Active/Inactive) API
- Method: PATCH
- Endpoint: {{base_url}}/api/internal/courses/toggle-status/:id
- Request Payload : No Payload, Just ID parameter
- Response Payload :
{
    "success": true,
    "message": "Course deactivated successfully",
    "data": {
        "id": "1",
        "is_active": false
    },
    "timestamp": "2025-10-03T17:13:41.890Z"
}


### REORDER Course List API
- Method: PUT
- Endpoint: {{base_url}}/api/internal/courses/reorder
- Request Payload :
{
  "courses": [
    {
      "id": 1,
      "display_order": 1
    },
    {
      "id": 2,
      "display_order": 2
    }
  ]
}
- Response Payload :

{
    "success": true,
    "message": "Course order updated successfully",
    "data": null,
    "timestamp": "2025-10-03T15:33:45.256Z"
}


###  API
- Method: DELETE
- Endpoint: {{base_url}}/api/internal/courses/delete/:id
- Request Payload : No Payload, Just ID Parameter
- Response Payload :
{
    "success": true,
    "message": "Course deleted successfully",
    "data": null,
    "timestamp": "2025-10-03T17:22:01.554Z"
}