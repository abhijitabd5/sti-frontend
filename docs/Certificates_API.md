# Certificates API Documentation

Base URL: `/api/internal/certificates` (Internal) and `/api/public/certificates` (Public)

**Authentication Required**: Yes for internal endpoints, No for public verification endpoints  
**Roles Allowed**: `super_admin`, `admin` (for internal endpoints)

---

## Internal Endpoints

### 1. Issue Certificate

**POST** `/api/internal/certificates/issue`

Issue a certificate to a student.

**Request Body:**
```json
{
  "student_id": 1,
  "course_id": 5,
  "enrollment_id": 10,
  "template_id": 2,
  "issue_date": "2025-01-15"
}
```

**Fields:**
- `student_id` (number, required): Student ID
- `course_id` (number, required): Course ID
- `enrollment_id` (number, required): Enrollment ID
- `template_id` (number, optional): Template ID (uses default if not provided)
- `issue_date` (string, optional): Issue date in YYYY-MM-DD format (uses current date if not provided)

**Response:**
```json
{
  "success": true,
  "message": "Certificate issued successfully",
  "data": {
    "id": 1,
    "certificate_number": "CERT-2501-STI202500001-5-AB3D",
    "student_id": 1,
    "student_code": "STI202500001",
    "course_id": 5,
    "enrollment_id": 10,
    "template_id": 2,
    "issue_date": "2025-01-15",
    "file_path": "uploads/certificates/certificate-CERT-2501-STI202500001-5-AB3D-1736942400000.pdf",
    "verification_code": "A7B9C2D4",
    "qr_code_path": "uploads/certificates/qr-codes/qr-CERT-2501-STI202500001-5-AB3D-1736942400000.png",
    "verification_url": "http://localhost:3000/verify-certificate/A7B9C2D4",
    "status": "valid",
    "hard_copy_delivered": false,
    "is_public_verifiable": true,
    "verification_count": 0,
    "created_by": 1,
    "createdAt": "2025-01-15T10:00:00.000Z"
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 2. Bulk Issue Certificates

**POST** `/api/internal/certificates/bulk-issue`

Issue multiple certificates at once.

**Request Body:**
```json
{
  "certificates": [
    {
      "student_id": 1,
      "course_id": 5,
      "enrollment_id": 10,
      "template_id": 2,
      "issue_date": "2025-01-15"
    },
    {
      "student_id": 2,
      "course_id": 5,
      "enrollment_id": 11,
      "issue_date": "2025-01-15"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Issued 2 certificates. 0 failed.",
  "data": {
    "success": [
      {
        "id": 1,
        "certificate_number": "CERT-2501-STI202500001-5-AB3D",
        "student_id": 1
      },
      {
        "id": 2,
        "certificate_number": "CERT-2501-STI202500002-5-XY7Z",
        "student_id": 2
      }
    ],
    "failed": []
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 3. Regenerate Certificate

**POST** `/api/internal/certificates/regenerate/:id`

Regenerate the PDF for an existing certificate.

**URL Parameters:**
- `id` (number, required): Certificate ID

**Response:**
```json
{
  "success": true,
  "message": "Certificate regenerated successfully",
  "data": {
    "file_path": "uploads/certificates/certificate-CERT-2501-STI202500001-5-AB3D-1736945000000.pdf"
  },
  "timestamp": "2025-01-15T11:00:00.000Z"
}
```

---

### 4. List All Certificates

**GET** `/api/internal/certificates`

Get all certificates with filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, use 'all' or -1 for all records)
- `search` (string, optional): Search by certificate number, student code, or verification code
- `status` (string, optional): Filter by status (valid, revoked, expired)
- `student_id` (number, optional): Filter by student ID
- `course_id` (number, optional): Filter by course ID
- `hard_copy_delivered` (boolean, optional): Filter by delivery status
- `sortBy` (string, optional): Sort field (default: issue_date)
- `sortOrder` (string, optional): Sort order ASC/DESC (default: DESC)

**Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "certificate_number": "CERT-2501-STI202500001-5-AB3D",
      "student_id": 1,
      "student_code": "STI202500001",
      "course_id": 5,
      "enrollment_id": 10,
      "template_id": 2,
      "issue_date": "2025-01-15",
      "file_path": "http://localhost:5000/uploads/certificates/certificate-CERT-2501-STI202500001-5-AB3D.pdf",
      "qr_code_path": "http://localhost:5000/uploads/certificates/qr-codes/qr-CERT-2501-STI202500001-5-AB3D.png",
      "verification_code": "A7B9C2D4",
      "verification_url": "http://localhost:3000/verify-certificate/A7B9C2D4",
      "status": "valid",
      "hard_copy_delivered": false,
      "delivery_address": null,
      "is_public_verifiable": true,
      "verification_count": 5,
      "last_verified_at": "2025-01-20T08:30:00.000Z",
      "student": {
        "id": 1,
        "student_code": "STI202500001",
        "name_on_id": "John Doe",
        "user": {
          "id": 10,
          "name": "John Doe",
          "email": "john@example.com",
          "mobile": "9876543210"
        }
      },
      "course": {
        "id": 5,
        "title": "Heavy Equipment Operator Training",
        "slug": "heavy-equipment-operator-training",
        "duration": 30
      },
      "template": {
        "id": 2,
        "name": "Premium Certificate",
        "slug": "premium-certificate-abc-xyz"
      },
      "created_by": 1,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 5. Get Certificate Statistics

**GET** `/api/internal/certificates/stats`

Get statistics about certificates.

**Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "total_certificates": 150,
    "valid_certificates": 140,
    "revoked_certificates": 5,
    "expired_certificates": 5,
    "hard_copy_delivered": 80,
    "hard_copy_pending": 70
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 6. Get Certificate by ID

**GET** `/api/internal/certificates/:id`

Get a specific certificate by ID.

**URL Parameters:**
- `id` (number, required): Certificate ID

**Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "certificate_number": "CERT-2501-STI202500001-5-AB3D",
    "student": {
      "id": 1,
      "student_code": "STI202500001",
      "name_on_id": "John Doe",
      "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "mobile": "9876543210"
      }
    },
    "course": {
      "id": 5,
      "title": "Heavy Equipment Operator Training",
      "duration": 30
    },
    "enrollment": {
      "id": 10,
      "status": "completed"
    },
    "template": {
      "id": 2,
      "name": "Premium Certificate"
    },
    "issue_date": "2025-01-15",
    "file_path": "http://localhost:5000/uploads/certificates/certificate-CERT-2501-STI202500001-5-AB3D.pdf",
    "status": "valid",
    "verification_code": "A7B9C2D4",
    "verification_count": 5
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 7. Get Student's Certificates

**GET** `/api/internal/certificates/student/:studentId`

Get all certificates for a specific student.

**URL Parameters:**
- `studentId` (number, required): Student ID

**Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "certificate_number": "CERT-2501-STI202500001-5-AB3D",
      "course": {
        "id": 5,
        "title": "Heavy Equipment Operator Training",
        "slug": "heavy-equipment-operator-training",
        "duration": 30
      },
      "template": {
        "id": 2,
        "name": "Premium Certificate"
      },
      "issue_date": "2025-01-15",
      "status": "valid"
    }
  ],
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 8. Revoke Certificate

**PATCH** `/api/internal/certificates/revoke/:id`

Revoke a certificate.

**URL Parameters:**
- `id` (number, required): Certificate ID

**Response:**
```json
{
  "success": true,
  "message": "Certificate revoked successfully",
  "data": {
    "id": 1,
    "status": "revoked"
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 9. Restore Certificate

**PATCH** `/api/internal/certificates/restore/:id`

Restore a revoked certificate.

**URL Parameters:**
- `id` (number, required): Certificate ID

**Response:**
```json
{
  "success": true,
  "message": "Certificate restored successfully",
  "data": {
    "id": 1,
    "status": "valid"
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 10. Mark as Expired

**PATCH** `/api/internal/certificates/mark-expired/:id`

Mark a certificate as expired.

**URL Parameters:**
- `id` (number, required): Certificate ID

**Response:**
```json
{
  "success": true,
  "message": "Certificate marked as expired",
  "data": {
    "id": 1,
    "status": "expired"
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 11. Mark Hard Copy Delivered

**PATCH** `/api/internal/certificates/hard-copy-delivered/:id`

Mark certificate hard copy as delivered.

**URL Parameters:**
- `id` (number, required): Certificate ID

**Response:**
```json
{
  "success": true,
  "message": "Hard copy marked as delivered",
  "data": {
    "id": 1,
    "hard_copy_delivered": true
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 12. Update Delivery Address

**PUT** `/api/internal/certificates/delivery-address/:id`

Update the delivery address for a certificate.

**URL Parameters:**
- `id` (number, required): Certificate ID

**Request Body:**
```json
{
  "delivery_address": "123 Main Street, City, State - 123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Delivery address updated successfully",
  "data": {
    "id": 1,
    "delivery_address": "123 Main Street, City, State - 123456"
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 13. Delete Certificate

**DELETE** `/api/internal/certificates/delete/:id`

Soft delete a certificate.

**URL Parameters:**
- `id` (number, required): Certificate ID

**Response:**
```json
{
  "success": true,
  "message": "Certificate deleted successfully",
  "data": null,
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 14. Download Certificate

**GET** `/api/internal/certificates/download/:id`

Download certificate PDF file.

**URL Parameters:**
- `id` (number, required): Certificate ID

**Response:** PDF file download

---

### 15. Get QR Code

**GET** `/api/internal/certificates/qr-code/:id`

Get certificate QR code image.

**URL Parameters:**
- `id` (number, required): Certificate ID

**Response:** PNG image file

---

## Public Endpoints (No Authentication Required)

### 16. Verify Certificate by Certificate Number

**GET** `/api/public/certificates/verify/:certificateNumber`

Verify a certificate using its certificate number.

**URL Parameters:**
- `certificateNumber` (string, required): Certificate number (e.g., CERT-2501-STI202500001-5-AB3D)

**Response:**
```json
{
  "success": true,
  "message": "Certificate verified successfully",
  "data": {
    "id": 1,
    "certificate_number": "CERT-2501-STI202500001-5-AB3D",
    "student": {
      "id": 1,
      "student_code": "STI202500001",
      "name_on_id": "John Doe",
      "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "mobile": "9876543210"
      }
    },
    "course": {
      "id": 5,
      "title": "Heavy Equipment Operator Training",
      "duration": 30
    },
    "issue_date": "2025-01-15",
    "status": "valid",
    "verification_count": 6,
    "last_verified_at": "2025-01-20T10:00:00.000Z"
  },
  "timestamp": "2025-01-20T10:00:00.000Z"
}
```

---

### 17. Verify Certificate by QR Code

**GET** `/api/public/certificates/qr/:verificationCode`

Verify a certificate using QR code verification code. Can redirect to frontend or return JSON.

**URL Parameters:**
- `verificationCode` (string, required): Verification code (e.g., A7B9C2D4)

**Query Parameters:**
- `redirect` (boolean, optional): If true, redirects to frontend verification page

**Response (JSON):**
```json
{
  "success": true,
  "message": "Certificate verified successfully",
  "data": {
    "id": 1,
    "certificate_number": "CERT-2501-STI202500001-5-AB3D",
    "student": {
      "name_on_id": "John Doe"
    },
    "course": {
      "title": "Heavy Equipment Operator Training"
    },
    "issue_date": "2025-01-15",
    "status": "valid"
  },
  "timestamp": "2025-01-20T10:00:00.000Z"
}
```

**Response (Redirect):**
Redirects to: `{FRONTEND_URL}/certificate-verified/{verificationCode}`

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "student_id": "Student ID is required",
    "course_id": "Course ID is required"
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Certificate not found",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

### 401 Unauthorized (Internal endpoints only)
```json
{
  "success": false,
  "message": "Unauthorized",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

## Notes

1. **Certificate Number Format**: `CERT-{YY}{MM}-{STUDENT_CODE}-{COURSE_ID}-{RANDOM}`
   - Example: `CERT-2501-STI202500001-5-AB3D`

2. **Verification Code**: 8-character alphanumeric code for QR verification

3. **QR Code**: Automatically generated and points to verification URL

4. **PDF Generation**: Uses template if specified, otherwise uses default template or basic design

5. **Verification Count**: Increments each time certificate is verified via public endpoints

6. **Status Values**:
   - `valid`: Certificate is active and valid
   - `revoked`: Certificate has been revoked
   - `expired`: Certificate has expired

7. **Hard Copy Delivery**: Track physical certificate delivery status

8. **Public Verification**: No authentication required for verification endpoints

9. **Soft Delete**: Deleted certificates are not permanently removed

10. **Template Association**: Certificates remember which template was used for generation
