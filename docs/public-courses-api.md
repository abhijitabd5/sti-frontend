### Get All Courses by Language (LanguageContext)

Method : GET
Enpoint : {{base_url}}/api/public/courses?language=en&sortBy=display_order&sortOrder=ASC
Requets Payload : Not Required
Response Payload

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
            "created_by": null,
            "updated_by": null,
            "is_deleted": false,
            "deleted_by": null,
            "createdAt": "2025-09-06T20:16:18.000Z",
            "updatedAt": "2025-10-03T18:33:28.000Z",
            "deletedAt": null,
            "effective_fee": "32000.00"
        }
    ],
    "timestamp": "2025-10-09T18:53:38.373Z"
}

### Get Course By ID
Method : GET
Enpoint : {{base_url}}/api/public/courses/:slug
Requets Payload : Not Required
Response Payload : Same as above