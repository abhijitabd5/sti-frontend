
### Student List API

**API** = `GET` {{base_url}}/api/internal/student/students

**Response Payload**

{
    "success": true,
    "message": "Students retrieved successfully",
    "data": [
        {
            "student_id": 1,
            "student_code": "STI202500001",
            "name": "Saiffuddin Sheikh",
            "mobile": "9834892082",
            "courses": [
                {
                    "title": "Excavator Training - Beginner",
                    "status": "not_started"
                },
                {
                    "title": "Excavator Training - Beginner",
                    "status": "not_started"
                }
            ],
            "fee_status": "Due",
            "due_amount": "16500.00",
            "login_enabled": true,
            "enrollment_id": 1
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 5,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    },
    "timestamp": "2025-09-23T15:00:12.103Z"
}

### Check Aadhar API

**API** = `POST` {{base_url}}/api/internal/student/check-aadhar

**Request Payload**

{
  "aadhar_number": "123456789012"
}

**Response Payload**

{
    "success": true,
    "message": "Aadhar check completed",
    "data": {
        "exists": true,
        "student": {
            "id": 5,
            "student_code": "STI202500003",
            "name": "John Doe",
            "mobile": "9876543210",
            "email": "john@example.com",
            "enrollments": []
        }
    },
    "timestamp": "2025-09-26T07:36:01.359Z"
}

### Create Student Enrollment API

***API** = `POST` {{base_url}}/api/internal/student/enroll

**Request Payload**

{
  "aadhar_number": "123456789014",
  "name_on_id": "David Smith",
  "father_name": "Father Name",
  "mother_name": "Mother Name",
  "date_of_birth": "1995-01-01",
  "gender": "Male",
  "address": "Complete Address",
  "state": "Maharashtra",
  "city": "Nagpur",
  "pincode": "440001",
  "mobile": "9876543211",
  "email": "david@example.com",
  "course_id": 1,
  "enrollment_date": "2025-01-01",
  "status": "not_started",
  "extra_discount_amount": 1000,
  "is_hostel_opted": true,
  "is_mess_opted": true,
  "igst_applicable": false,
  "paid_amount": 5000,
  "payment_method": "cash",
  "remark": "First enrollment"
}

**Response Payload**

{
    "success": true,
    "message": "Student enrolled successfully",
    "data": {
        "enrollment_id": 8,
        "student_id": 7,
        "student_code": "STI202500005",
        "total_fee": 14280,
        "paid_amount": 5000,
        "due_amount": 9280
    },
    "timestamp": "2025-09-26T07:38:19.939Z"
}

### Update Student Enrollment API

***API** = `PUT` {{base_url}}/api/internal/student/enrollments/:enrollmentId

**Request Payload**

- Same as Create Enrollment API Request Payload (Except Aadhar Card)

**Response Payload**

{
    "success": true,
    "message": "Enrollment updated successfully",
    "data": null,
    "timestamp": "2025-09-26T07:39:04.207Z"
}

### Student Login Enable/Disable API

***API** = `PATCH` {{base_url}}/api/internal/student/students/:studentId/toggle-login

**Request Payload**

{
  "login_enabled": false
}

**Response Payload**

{
    "success": true,
    "message": "Student login disabled successfully",
    "data": null,
    "timestamp": "2025-09-26T07:39:46.476Z"
}

### Upload Student Document API

***API** = `POST` {{base_url}}/api/internal/student/students/:studentId/documents

**Request Payload**

- Form Data

Key: slugs         | Value: ["aadhar, "pan" , "hsc", "ssc", "photo"] | Type: Text
Key: documents     | Value: [Files]                                   | Type: File

**Response Payload**

{
    "success": true,
    "message": "1 document(s) uploaded successfully",
    "data": {
        "savedDocuments": [
            {
                "is_verified": false,
                "uploaded_at": "2025-09-26T07:40:31.744Z",
                "updated_by": [],
                "is_deleted": false,
                "id": 5,
                "student_id": 1,
                "file_path": "uploads/students/1/1-men-multitasking-1758872431688.png",
                "file_name": "Men multitasking.png",
                "created_by": 1,
                "createdAt": "2025-09-26T07:40:31.744Z",
                "updatedAt": "2025-09-26T07:40:31.744Z"
            }
        ],
        "uploadCount": 1,
        "uploadPath": "uploads/students/1/"
    },
    "timestamp": "2025-09-26T07:40:31.832Z"
}

### Delete Student Document API

***API** = `DELETE` {{base_url}}/api/internal/student/documents/:documentId

**Request Payload**

- Not required

### Get Payment History API

***API** = `GET` {{base_url}}/api/internal/student/:studentId/:enrollmentId/payments

**Request Payload**

- Not required

**Response Payload**

{
    "success": true,
    "message": "Payment history retrieved successfully",
    "data": [
        {
            "id": 2,
            "student_id": 6,
            "course_id": 1,
            "enrollment_id": 6,
            "type": "course_fee",
            "amount": "5000.00",
            "payment_date": "2025-01-01",
            "payment_method": "cash",
            "previous_due_amount": "14280.00",
            "remaining_due_amount": "9280.00",
            "createdAt": "2025-09-07T17:36:43.000Z",
        }
    ],
    "timestamp": "2025-09-26T07:47:02.894Z"
}

### Student Details API

***API** = `GET` {{base_url}}/api/internal/student/students/:studentId

**Response Payload**

{
    "success": true,
    "message": "Student details retrieved successfully",
    "data": {
        "student_info": {
            "id": 6,
            "student_code": "STI202500004",
            "name": "David Smith",
            "mobile": "9876543211",
            "email": "david@example.com",
            "father_name": "Father Name",
            "mother_name": "Mother Name",
            "date_of_birth": "1995-01-01",
            "gender": "Male",
            "address": "Complete Address",
            "state": "Maharashtra",
            "city": "Nagpur",
            "pincode": "440001",
            "aadhar_number": "123456789014",
            "pan_number": null,
            "login_enabled": false
        },
        "enrollments": [
            {
                "id": 6,
                "course": "Excavator Training - Beginner",
                "status": "not_started",
                "enrollment_date": "2025-01-01",
                "completion_date": null,
                "total_fee": "14280.00",
                "paid_amount": "5000.00",
                "due_amount": "9280.00"
            },
            {
                "id": 7,
                "course": "Excavator Training - Beginner",
                "status": "not_started",
                "enrollment_date": "2025-01-01",
                "completion_date": null,
                "total_fee": "14280.00",
                "paid_amount": "5000.00",
                "due_amount": "9280.00"
            }
        ],
        "documents": [
            {
                "id": 2,
                "type": "aadhaar",
                "file_name": "aadhaar.pdf",
                "file_url": "http://localhost:5000/uploads/students/6/aadhaar.pdf",
                "is_verified": false,
                "uploaded_at": "2025-09-07T17:36:43.000Z"
            },
            {
                "id": 3,
                "type": "aadhaar",
                "file_name": "aadhaar.pdf",
                "file_url": "http://localhost:5000/uploads/students/6/aadhaar.pdf",
                "is_verified": false,
                "uploaded_at": "2025-09-07T17:36:54.000Z"
            }
        ]
    },
    "timestamp": "2025-09-26T07:32:51.832Z"
}