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

## 4a. Get Enrollment Details

**Method:** `GET`  
**Endpoint:** `/api/internal/student/enrollments/:enrollmentId`  
**Description:** Get detailed information about a specific enrollment including payment history.

**Success Response:**
```json
{
  "success": true,
  "message": "Enrollment retrieved successfully",
  "data": {
    "id": 6,
    "student_id": 6,
    "course_id": 1,
    "status": "ongoing",
    "enrollment_date": "2025-01-01",
    "completion_date": null,
    "base_course_fee": "20000.00",
    "course_discount_amount": "2000.00",
    "course_discount_percentage": "10.00",
    "discounted_course_fee": "18000.00",
    "is_hostel_opted": false,
    "hostel_fee": "0.00",
    "is_mess_opted": false,
    "mess_fee": "0.00",
    "pre_tax_total_fee": "18000.00",
    "extra_discount_amount": "0.00",
    "taxable_amount": "18000.00",
    "total_tax_amount": "0.00",
    "total_payable_fee": "18000.00",
    "paid_amount": "10000.00",
    "due_amount": "8000.00",
    "remark": null,
    "student": {
      "id": 6,
      "student_code": "STI202500004",
      "name_on_id": "David Smith",
      "user": {
        "mobile": "9876543211",
        "email": "david@example.com"
      }
    },
    "course": {
      "id": 1,
      "title": "Excavator Training - Beginner",
      "slug": "excavator-training-beginner"
    },
    "payment_history": {
      "payments": [
        {
          "id": 15,
          "type": "course_fee",
          "amount": 5000.00,
          "payment_date": "2025-01-15",
          "payment_method": "upi",
          "previous_due_amount": 13000.00,
          "remaining_due_amount": 8000.00,
          "created_at": "2025-01-15T10:30:00.000Z"
        },
        {
          "id": 14,
          "type": "course_fee",
          "amount": 5000.00,
          "payment_date": "2025-01-01",
          "payment_method": "cash",
          "previous_due_amount": 18000.00,
          "remaining_due_amount": 13000.00,
          "created_at": "2025-01-01T09:00:00.000Z"
        }
      ],
      "summary": {
        "payment_count": 2,
        "total_paid": 10000.00,
        "first_payment_date": "2025-01-01",
        "last_payment_date": "2025-01-15"
      }
    },
    "createdAt": "2025-01-01T08:00:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  },
  "timestamp": "2025-09-26T08:30:00.123Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Enrollment not found",
  "timestamp": "2025-09-26T08:30:00.123Z"
}
```

**Note:** This endpoint now includes complete payment history with:
- Individual payment records sorted by date (newest first)
- Payment summary statistics
- Due amount progression tracking

---

## 5. Update Student Enrollment

**Method:** `PUT`  
**Endpoint:** `/api/internal/student/enrollments/:enrollmentId`  
**Description:** Update an existing student enrollment. Can update student profile, user details, and include additional payment.

**Request Payload:**
```json
{
  // Enrollment fields
  "status": "ongoing",                    // Optional - not_started/ongoing/completed/aborted/expelled
  "enrollment_date": "2025-01-01",        // Optional - Defaults to today if not provided
  "completion_date": "2025-06-01",        // Optional
  "remark": "Updated enrollment",         // Optional
  
  // Payment fields
  "paid_amount": 5000,                    // Optional - Additional payment amount (ADDITIVE)
  "payment_method": "upi",                // Optional - Required if paid_amount is provided
  
  // User fields (updates users table)
  "first_name": "John",                   // Optional - User's first name
  "last_name": "Doe",                     // Optional - User's last name
  "mobile": "9876543210",                 // Optional - 10 digit mobile (must be unique)
  "email": "john.doe@example.com",        // Optional - Email address
  
  // Student profile fields (updates students table)
  "name_on_id": "John Michael Doe",       // Optional - Full name as on ID
  "father_name": "Father Name",           // Optional
  "mother_name": "Mother Name",           // Optional
  "date_of_birth": "1995-01-01",          // Optional - YYYY-MM-DD format
  "gender": "Male",                       // Optional - Male/Female/Other
  "address": "Complete Address",          // Optional
  "state_slug": "maharashtra",            // Optional - State slug from states table
  "state_name": "Maharashtra",            // Optional - State name
  "city": "Nagpur",                       // Optional
  "pincode": "440001",                    // Optional
  "aadhar_number": "123456789012",        // Optional - 12 digit Aadhar
  "pan_number": "ABCDE1234F"              // Optional - PAN number
}
```

**Important Notes:**
- All fields are optional - send only the fields you want to update
- `paid_amount` is **ADDITIVE** - it adds to existing paid_amount, not replaces it
- `mobile` must be unique across all users
- Date fields must be in YYYY-MM-DD format
- Updates can span across enrollment, student, and user records in a single request

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
```

---

# Enrollment Payment Management APIs

These endpoints provide granular CRUD operations for managing payments specific to student enrollments.

---

## 14. Create Enrollment Payment

**Method:** `POST`  
**Endpoint:** `/api/internal/enrollments/:enrollmentId/payments`  
**Description:** Create a new payment record for a specific enrollment. Automatically updates enrollment paid_amount and due_amount, and creates corresponding transaction record.

**Request Payload:**
```json
{
  "amount": 5000,                         // MANDATORY - Payment amount (must be > 0)
  "payment_method": "upi",                // MANDATORY - cash, cheque, upi, bank_transfer, card, net_banking, payment_gateway
  "payment_date": "2025-01-15",           // Optional - Defaults to today (YYYY-MM-DD)
  "type": "course_fee",                   // Optional - course_fee, accommodation_fee, penalty, miscellaneous (default: course_fee)
  "description": "Partial payment"        // Optional - Payment description
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "payment_id": 15,
    "amount": 5000.00,
    "previous_due": 14280.00,
    "new_due": 9280.00,
    "total_paid": 10000.00
  },
  "timestamp": "2025-09-26T08:00:00.123Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Enrollment not found",
  "timestamp": "2025-09-26T08:00:00.123Z"
}
```

**Important Notes:**
- Creates records in both `student_payments` and `transactions` tables
- Automatically updates `student_enrollments.paid_amount` and `due_amount`
- Transaction is atomic - all updates succeed or all fail
- Snapshots previous and remaining due amounts for audit trail

---

## 15. Get Enrollment Payments

**Method:** `GET`  
**Endpoint:** `/api/internal/enrollments/:enrollmentId/payments`  
**Description:** Get all payment records for a specific enrollment with summary statistics.

**Success Response:**
```json
{
  "success": true,
  "message": "Enrollment payments retrieved successfully",
  "data": {
    "enrollment": {
      "id": 6,
      "student_code": "STI202500004",
      "student_name": "David Smith",
      "course_title": "Excavator Training - Beginner",
      "total_payable_fee": 14280.00,
      "paid_amount": 10000.00,
      "due_amount": 4280.00
    },
    "payments": [
      {
        "id": 15,
        "type": "course_fee",
        "amount": 5000.00,
        "payment_date": "2025-01-15",
        "payment_method": "upi",
        "previous_due_amount": 14280.00,
        "remaining_due_amount": 9280.00,
        "created_at": "2025-01-15T10:30:00.000Z"
      },
      {
        "id": 14,
        "type": "course_fee",
        "amount": 5000.00,
        "payment_date": "2025-01-01",
        "payment_method": "cash",
        "previous_due_amount": 14280.00,
        "remaining_due_amount": 9280.00,
        "created_at": "2025-01-01T09:00:00.000Z"
      }
    ],
    "summary": {
      "payment_count": 2,
      "total_paid": 10000.00,
      "first_payment_date": "2025-01-01",
      "last_payment_date": "2025-01-15"
    }
  },
  "timestamp": "2025-09-26T08:05:00.123Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Enrollment not found",
  "timestamp": "2025-09-26T08:05:00.123Z"
}
```

---

## 16. Get Payment by ID

**Method:** `GET`  
**Endpoint:** `/api/internal/payments/:paymentId`  
**Description:** Get detailed information about a specific payment record.

**Success Response:**
```json
{
  "success": true,
  "message": "Payment retrieved successfully",
  "data": {
    "id": 15,
    "student": {
      "id": 6,
      "student_code": "STI202500004",
      "name": "David Smith",
      "mobile": "9876543211",
      "email": "david@example.com"
    },
    "course": {
      "id": 1,
      "title": "Excavator Training - Beginner",
      "slug": "excavator-training-beginner"
    },
    "enrollment": {
      "id": 6,
      "status": "ongoing",
      "total_payable_fee": 14280.00,
      "paid_amount": 10000.00,
      "due_amount": 4280.00
    },
    "payment": {
      "type": "course_fee",
      "amount": 5000.00,
      "payment_date": "2025-01-15",
      "payment_method": "upi",
      "previous_due_amount": 14280.00,
      "remaining_due_amount": 9280.00
    },
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  },
  "timestamp": "2025-09-26T08:10:00.123Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Payment not found",
  "timestamp": "2025-09-26T08:10:00.123Z"
}
```

---

## 17. Update Payment

**Method:** `PUT`  
**Endpoint:** `/api/internal/payments/:paymentId`  
**Description:** Update an existing payment record. If amount is changed, automatically recalculates enrollment totals and updates corresponding transaction.

**Request Payload:**
```json
{
  "amount": 6000,                         // Optional - New payment amount
  "payment_date": "2025-01-16",           // Optional - Update payment date
  "payment_method": "bank_transfer",      // Optional - Update payment method
  "type": "course_fee",                   // Optional - Update payment type
  "description": "Updated payment"        // Optional - Update description
}
```

**Important Notes:**
- All fields are optional - send only what you want to update
- If `amount` is changed:
  - Recalculates enrollment `paid_amount` and `due_amount`
  - Updates corresponding transaction record
  - Updates `remaining_due_amount` in payment record
- Changes are atomic - all updates succeed or all fail

**Success Response:**
```json
{
  "success": true,
  "message": "Payment updated successfully",
  "data": null,
  "timestamp": "2025-09-26T08:15:00.123Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Payment not found",
  "timestamp": "2025-09-26T08:15:00.123Z"
}
```

---

## 18. Delete Payment

**Method:** `DELETE`  
**Endpoint:** `/api/internal/payments/:paymentId`  
**Description:** Soft delete a payment record. Automatically recalculates enrollment totals and soft deletes corresponding transaction.

**Success Response:**
```json
{
  "success": true,
  "message": "Payment deleted successfully",
  "data": {
    "deleted_amount": 5000.00,
    "new_paid_amount": 5000.00,
    "new_due_amount": 9280.00
  },
  "timestamp": "2025-09-26T08:20:00.123Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Payment not found",
  "timestamp": "2025-09-26T08:20:00.123Z"
}
```

**Important Notes:**
- Soft delete (record marked as deleted, not removed from database)
- Automatically:
  - Subtracts payment amount from enrollment `paid_amount`
  - Recalculates enrollment `due_amount`
  - Soft deletes corresponding transaction record
- Changes are atomic - all updates succeed or all fail
- Maintains audit trail with `deleted_by` and `deletedAt` fields

---

## Payment Management Summary

### Key Features:
- ✅ **Granular Control**: Create, read, update, delete individual payments
- ✅ **Automatic Sync**: Enrollment totals and transactions stay in sync
- ✅ **Audit Trail**: Tracks previous/remaining due amounts for each payment
- ✅ **Atomic Operations**: All related updates succeed or fail together
- ✅ **Soft Deletes**: Maintains complete payment history

### Tables Updated:
1. **student_payments** - Individual payment records
2. **transactions** - General ledger entries
3. **student_enrollments** - Updated paid_amount and due_amount

### Use Cases:
- Record partial payments over time
- Correct payment entry errors
- Track payment history with due amount progression
- Generate payment receipts
- Analyze payment patterns and cash flow