# Student API Documentation

## 1. Check Aadhar Exists

**Method:** `POST`  
**Endpoint:** `/api/internal/student/check-aadhar`  
**Description:** Check if a student with the given Aadhar number already exists in the system.

**Request Payload:**
```json
{
  "aadhar_number": "123456789012"  // MANDATORY - 12 digit Aadhar number
}
```

**Success Response:**
```json
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
```

**Error Response:**
```json
{
  "success": false,
  "message": "Aadhar number is required",
  "timestamp": "2025-09-26T07:36:01.359Z"
}
```

---

## 2. Create Student Enrollment

**Method:** `POST`  
**Endpoint:** `/api/internal/student/enroll`  
**Description:** Create a new student enrollment with course registration and optional payment.

**Request Payload:**
```json
{
  "aadhar_number": "123456789014",        // MANDATORY - 12 digit Aadhar number
  "name_on_id": "David Smith",            // MANDATORY - Full name as on ID
  "father_name": "Father Name",           // Optional
  "mother_name": "Mother Name",           // Optional
  "date_of_birth": "1995-01-01",          // Optional - Defaults to 21 years back from today
  "gender": "Male",                       // MANDATORY - Male/Female/Other
  "address": "Complete Address",          // MANDATORY
  "state_slug": "maharashtra",            // MANDATORY - State slug from states table
  "city": "Nagpur",                       // MANDATORY
  "pincode": "440001",                    // MANDATORY
  "mobile": "9876543211",                 // MANDATORY - 10 digit mobile number
  "email": "david@example.com",           // Optional
  "course_id": 1,                         // MANDATORY - Course ID
  "enrollment_date": "2025-01-01",        // Optional - Defaults to today
  "status": "not_started",                // Optional - not_started/ongoing/completed/aborted/expelled
  "extra_discount_amount": 1000,          // Optional - Additional discount amount
  "is_hostel_opted": true,                // Optional - Default false
  "is_mess_opted": true,                  // Optional - Default false
  "igst_applicable": false,               // Optional - Default false
  "paid_amount": 5000,                    // Optional - Initial payment amount
  "payment_method": "cash",               // Optional - cash/cheque/upi/bank_transfer/card/net_banking/payment_gateway
  "remark": "First enrollment"            // Optional
}
```

**Success Response:**
```json
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
```

**Error Response:**
```json
{
  "success": false,
  "message": "Course not found",
  "timestamp": "2025-09-26T07:38:19.939Z"
}
```

---

## 3. Get Students List

**Method:** `GET`  
**Endpoint:** `/api/internal/student/students`  
**Description:** Get paginated list of students with optional filters.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name or mobile
- `status` - Filter by enrollment status (not_started/ongoing/completed/aborted/expelled)
- `course` - Filter by course ID
- `start_date` - Filter students created from this date (YYYY-MM-DD)
- `end_date` - Filter students created until this date (YYYY-MM-DD)

**Success Response:**
```json
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
        }
      ],
      "fee_status": "Due",
      "due_amount": "16500.00",
      "login_enabled": true,
      "enrollment_id": 1,
      "created_at": "2025-09-23T15:00:12.103Z",
      "updated_at": "2025-09-23T15:00:12.103Z"
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
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid start_date format. Please use YYYY-MM-DD format.",
  "timestamp": "2025-09-23T15:00:12.103Z"
}
```

---

## 4. Get Student Details

**Method:** `GET`  
**Endpoint:** `/api/internal/student/students/:studentId`  
**Description:** Get detailed information about a specific student including enrollments and documents.

**Success Response:**
```json
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
      "state_slug": "maharashtra",
      "state_name": "Maharashtra",
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
      }
    ]
  },
  "timestamp": "2025-09-26T07:32:51.832Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Student not found",
  "timestamp": "2025-09-26T07:32:51.832Z"
}
```

---

## 5. Update Student Enrollment

**Method:** `PUT`  
**Endpoint:** `/api/internal/student/enrollments/:enrollmentId`  
**Description:** Update an existing student enrollment. Can include additional payment.

**Request Payload:**
```json
{
  "status": "ongoing",                    // Optional - not_started/ongoing/completed/aborted/expelled
  "enrollment_date": "2025-01-01",        // Optional - Defaults to today if not provided
  "completion_date": "2025-06-01",        // Optional
  "paid_amount": 5000,                    // Optional - Additional payment amount
  "payment_method": "upi",                // Optional - Required if paid_amount is provided
  "remark": "Updated enrollment"          // Optional
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Enrollment updated successfully",
  "data": null,
  "timestamp": "2025-09-26T07:39:04.207Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Enrollment not found",
  "timestamp": "2025-09-26T07:39:04.207Z"
}
```

---

## 6. Toggle Student Login

**Method:** `PATCH`  
**Endpoint:** `/api/internal/student/students/:studentId/toggle-login`  
**Description:** Enable or disable student login access.

**Request Payload:**
```json
{
  "login_enabled": false  // MANDATORY - true/false
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Student login disabled successfully",
  "data": null,
  "timestamp": "2025-09-26T07:39:46.476Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Student not found",
  "timestamp": "2025-09-26T07:39:46.476Z"
}
```

---

## 7. Upload Student Documents

**Method:** `POST`  
**Endpoint:** `/api/internal/student/:studentId/documents`  
**Description:** Upload one or multiple documents for a student. Supports multiple file upload approaches.

**Request Payload (Form Data):**

**Approach 1: Single slug for all files**
```
documents: [File1, File2, File3]  // MANDATORY - Field name must be "documents"
slug: "aadhaar"                   // MANDATORY - Document type slug
```

**Approach 2: Multiple slugs as JSON array**
```
documents: [File1, File2, File3]  // MANDATORY
slugs: ["aadhaar", "pan", "hsc"]  // MANDATORY - JSON array or string
```

**Approach 3: Individual slug per file**
```
documents: [File1, File2, File3]  // MANDATORY
file-0-slug: "aadhaar"            // MANDATORY for each file
file-1-slug: "pan"
file-2-slug: "hsc"
```

**Valid Document Type Slugs:**
- aadhaar, pan, ssc, hsc, diploma, graduation, post_grad, school_leaving, birth_certificate, caste_certificate, income_certificate, disability_certificate, photo, signature

**Success Response:**
```json
{
  "success": true,
  "message": "3 document(s) uploaded successfully",
  "data": {
    "savedDocuments": [
      {
        "id": 5,
        "student_id": 1,
        "slug": "aadhaar",
        "file_path": "uploads/students/1/1-aadhaar-1758872431688.pdf",
        "file_name": "aadhaar.pdf",
        "is_verified": false,
        "uploaded_at": "2025-09-26T07:40:31.744Z",
        "created_by": 1,
        "createdAt": "2025-09-26T07:40:31.744Z",
        "updatedAt": "2025-09-26T07:40:31.744Z"
      }
    ],
    "uploadCount": 3,
    "uploadPath": "uploads/students/1/"
  },
  "timestamp": "2025-09-26T07:40:31.832Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "All files must have associated document type slugs",
  "timestamp": "2025-09-26T07:40:31.832Z"
}
```

---

## 8. Delete Student Document

**Method:** `DELETE`  
**Endpoint:** `/api/internal/student/documents/:documentId`  
**Description:** Delete a student document by ID.

**Success Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully",
  "data": null,
  "timestamp": "2025-09-26T07:41:15.123Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Document not found",
  "timestamp": "2025-09-26T07:41:15.123Z"
}
```

---

## 9. Verify/Unverify Student Document

**Method:** `PATCH`  
**Endpoint:** `/api/internal/student/documents/verify/:documentId`  
**Description:** Verify or unverify a student document.

**Request Payload:**
```json
{
  "is_verified": true  // MANDATORY - true to verify, false to unverify
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Document verified successfully",
  "data": {
    "document_id": 5,
    "student_code": "STI202500001",
    "student_name": "John Doe",
    "document_type": "aadhaar",
    "file_name": "aadhaar.pdf",
    "is_verified": true,
    "verified_at": "2025-09-26T07:42:00.000Z"
  },
  "timestamp": "2025-09-26T07:42:00.123Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Document not found",
  "timestamp": "2025-09-26T07:42:00.123Z"
}
```

---

## 10. Get Courses List

**Method:** `GET`  
**Endpoint:** `/api/internal/student/courses`  
**Description:** Get list of all active courses for enrollment.

**Success Response:**
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Excavator Training - Beginner",
      "base_course_fee": "20000.00",
      "discount_percentage": "10.00",
      "discounted_course_fee": "18000.00",
      "hostel_available": true,
      "hostel_fee": "5000.00",
      "mess_available": true,
      "mess_fee": "3000.00"
    }
  ],
  "timestamp": "2025-09-26T07:43:00.123Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to retrieve courses",
  "timestamp": "2025-09-26T07:43:00.123Z"
}
```

---

## 11. Get Payment History

**Method:** `GET`  
**Endpoint:** `/api/internal/student/:studentId/payments`  
**Description:** Get payment history for a student. Optionally filter by enrollment.

**Query Parameters:**
- `enrollmentId` - Optional - Filter payments for specific enrollment

**Success Response:**
```json
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
      "createdAt": "2025-09-07T17:36:43.000Z"
    }
  ],
  "timestamp": "2025-09-26T07:47:02.894Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Enrollment not found or does not belong to this student",
  "timestamp": "2025-09-26T07:47:02.894Z"
}
```

---

## 12. Export Student Records

**Method:** `GET`  
**Endpoint:** `/api/internal/student/export`  
**Description:** Export student records to Excel file with detailed enrollment and payment information.

**Query Parameters:**
- `search` - Optional - Search by name or mobile
- `start_date` - Optional - Filter students created from this date (YYYY-MM-DD)
- `end_date` - Optional - Filter students created until this date (YYYY-MM-DD)

**Success Response:**
- Returns Excel file download with filename: `student-records-detailed-{timestamp}.xlsx`

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to export student records",
  "timestamp": "2025-09-26T07:48:00.123Z"
}
```

---

## 13. Get Student Enrollments by State (Analytics)

**Method:** `GET`  
**Endpoint:** `/api/internal/student/analytics/enrollments-by-state`  
**Description:** Get student enrollment analytics grouped by state.

**Query Parameters:**
- `start_date` - Optional - Filter students created from this date (YYYY-MM-DD)
- `end_date` - Optional - Filter students created until this date (YYYY-MM-DD). Defaults to current date if start_date is provided.

**Success Response:**
```json
{
  "success": true,
  "message": "Student enrollment analytics by state retrieved successfully",
  "data": {
    "states": [
      {
        "state_name": "Maharashtra",
        "state_slug": "maharashtra",
        "student_count": 45,
        "region_slug": "western",
        "region_name": "Western Region"
      },
      {
        "state_name": "Karnataka",
        "state_slug": "karnataka",
        "student_count": 32,
        "region_slug": "southern",
        "region_name": "Southern Region"
      }
    ]
  },
  "timestamp": "2025-09-26T07:49:00.123Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid start_date format. Please use YYYY-MM-DD format.",
  "timestamp": "2025-09-26T07:49:00.123Z"
}