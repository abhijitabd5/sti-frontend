# Public Certificate Verification API

Base URL: `/api/public/certificates`

**Authentication Required**: No  
**Purpose**: Public certificate verification and download with security validation

---

## Endpoints

### 1. Verify Certificate

**POST** `/api/public/certificates/verify`

Verify a certificate using certificate number with additional security fields.

**Request Body:**
```json
{
  "certificateNumber": "STI-2024-0001",
  "mobileNumber": "9876543210",
  "dateOfBirth": "15-06-1995"
}
```

**Fields:**
- `certificateNumber` (string, required): Certificate number
- `mobileNumber` (string, optional): Student's mobile number (exactly 10 digits)
- `dateOfBirth` (string, optional): Student's date of birth in DD-MM-YYYY format

**Validation Rules:**
- At least ONE of `mobileNumber` or `dateOfBirth` must be provided
- `mobileNumber`: Must be exactly 10 digits (numeric only)
- `dateOfBirth`: Must be in DD-MM-YYYY format (e.g., 15-06-1995)

**Response (Success):**
```json
{
  "success": true,
  "message": "Certificate verified successfully",
  "data": {
    "id": 1,
    "certificate_number": "STI-2024-0001",
    "student_id": 123,
    "student_code": "STI202400123",
    "course_id": 5,
    "enrollment_id": 10,
    "issue_date": "2024-03-15",
    "issue_year": 2024,
    "file_path": "https://example.com/uploads/certificates/certificate-STI-2024-0001.pdf",
    "qr_code_path": "https://example.com/uploads/certificates/qr-codes/qr-STI-2024-0001.png",
    "verification_code": "A7B9C2D4",
    "status": "valid",
    "hard_copy_delivered": false,
    "is_public_verifiable": true,
    "verification_count": 5,
    "last_verified_at": "2024-03-20T10:30:00.000Z",
    "student": {
      "id": 123,
      "student_code": "STI202400123",
      "name_on_id": "John Doe",
      "date_of_birth": "1995-06-15",
      "gender": "male",
      "user": {
        "id": 456,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "mobile": "9876543210"
      }
    },
    "course": {
      "id": 5,
      "title": "Heavy Equipment Operator Training",
      "slug": "heavy-equipment-operator-training",
      "duration": "3 months"
    },
    "createdAt": "2024-03-15T10:00:00.000Z",
    "updatedAt": "2024-03-15T10:00:00.000Z"
  },
  "timestamp": "2024-03-20T10:30:00.000Z"
}
```

**Error Responses:**

**400 - Missing Certificate Number:**
```json
{
  "success": false,
  "message": "Certificate number is required",
  "timestamp": "2024-03-20T10:30:00.000Z"
}
```

**400 - Missing Security Fields:**
```json
{
  "success": false,
  "message": "At least one security field (mobile number or date of birth) is required for verification",
  "timestamp": "2024-03-20T10:30:00.000Z"
}
```

**400 - Invalid Mobile Format:**
```json
{
  "success": false,
  "message": "Mobile number must be exactly 10 digits",
  "timestamp": "2024-03-20T10:30:00.000Z"
}
```

**400 - Invalid Date Format:**
```json
{
  "success": false,
  "message": "Date of birth must be in DD-MM-YYYY format",
  "timestamp": "2024-03-20T10:30:00.000Z"
}
```

**400 - Invalid Date:**
```json
{
  "success": false,
  "message": "Invalid date of birth",
  "timestamp": "2024-03-20T10:30:00.000Z"
}
```

**404 - Certificate Not Found:**
```json
{
  "success": false,
  "message": "Certificate not found",
  "timestamp": "2024-03-20T10:30:00.000Z"
}
```

**404 - Mobile Mismatch:**
```json
{
  "success": false,
  "message": "Certificate verification failed - mobile number does not match",
  "timestamp": "2024-03-20T10:30:00.000Z"
}
```

**404 - Date of Birth Mismatch:**
```json
{
  "success": false,
  "message": "Certificate verification failed - date of birth does not match",
  "timestamp": "2024-03-20T10:30:00.000Z"
}
```

---

### 2. Download Certificate

**POST** `/api/public/certificates/download`

Download certificate PDF with security verification.

**Request Body:**
```json
{
  "certificateNumber": "STI-2024-0001",
  "mobileNumber": "9876543210",
  "dateOfBirth": "15-06-1995"
}
```

**Fields:**
- `certificateNumber` (string, required): Certificate number
- `mobileNumber` (string, optional): Student's mobile number (exactly 10 digits)
- `dateOfBirth` (string, optional): Student's date of birth in DD-MM-YYYY format

**Validation Rules:**
- Same as verify endpoint
- At least ONE of `mobileNumber` or `dateOfBirth` must be provided

**Response (Success):**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="certificate-STI-2024-0001.pdf"`
- Body: PDF file stream

**Error Responses:**
Same error responses as verify endpoint (400, 404)

**Additional Error:**

**404 - File Not Found:**
```json
{
  "success": false,
  "message": "Certificate file not found",
  "timestamp": "2024-03-20T10:30:00.000Z"
}
```

---

### 3. Verify by QR Code

**GET** `/api/public/certificates/qr/:verificationCode`

Verify certificate using QR code verification code.

**URL Parameters:**
- `verificationCode` (string, required): 8-character verification code

**Query Parameters:**
- `redirect` (boolean, optional): If "true", redirects to frontend verification page

**Response (JSON):**
```json
{
  "success": true,
  "message": "Certificate verified successfully",
  "data": {
    "id": 1,
    "certificate_number": "STI-2024-0001",
    "student": {
      "name_on_id": "John Doe"
    },
    "course": {
      "title": "Heavy Equipment Operator Training"
    },
    "issue_date": "2024-03-15",
    "status": "valid",
    "file_path": "https://example.com/uploads/certificates/certificate-STI-2024-0001.pdf"
  },
  "timestamp": "2024-03-20T10:30:00.000Z"
}
```

**Response (Redirect):**
Redirects to: `{FRONTEND_URL}/certificate-verified/{verificationCode}`

**Error Response:**

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Certificate not found",
  "timestamp": "2024-03-20T10:30:00.000Z"
}
```

---

## Usage Examples

### JavaScript/Fetch

**Verify Certificate:**
```javascript
async function verifyCertificate(certNumber, mobile, dob) {
  const response = await fetch('/api/public/certificates/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      certificateNumber: certNumber,
      mobileNumber: mobile,
      dateOfBirth: dob
    })
  });
  return await response.json();
}

// Usage
const result = await verifyCertificate('STI-2024-0001', '9876543210', null);
```

**Download Certificate:**
```javascript
async function downloadCertificate(certNumber, mobile, dob) {
  const response = await fetch('/api/public/certificates/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      certificateNumber: certNumber,
      mobileNumber: mobile,
      dateOfBirth: dob
    })
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `certificate-${certNumber}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Usage
await downloadCertificate('STI-2024-0001', '9876543210', '15-06-1995');
```

### cURL

**Verify Certificate:**
```bash
curl -X POST http://localhost:5000/api/public/certificates/verify \
  -H "Content-Type: application/json" \
  -d '{
    "certificateNumber": "STI-2024-0001",
    "mobileNumber": "9876543210"
  }'
```

**Download Certificate:**
```bash
curl -X POST http://localhost:5000/api/public/certificates/download \
  -H "Content-Type: application/json" \
  -d '{
    "certificateNumber": "STI-2024-0001",
    "mobileNumber": "9876543210",
    "dateOfBirth": "15-06-1995"
  }' \
  --output certificate.pdf
```

**Verify by QR Code:**
```bash
curl http://localhost:5000/api/public/certificates/qr/A7B9C2D4
```

---

## Notes

1. **Security Verification**: Both verify and download endpoints require at least one security field (mobile or DOB) to prevent unauthorized access

2. **Date Format**: Date of birth must be in Indian format (DD-MM-YYYY), not ISO format

3. **Mobile Number**: Accepts 10-digit mobile numbers. Backend compares last 10 digits to handle country codes

4. **Verification Count**: Each successful verification increments the `verification_count` field

5. **File Access**: 
   - Verify endpoint returns `file_path` with full URL for direct access
   - Download endpoint streams the file with proper download headers

6. **QR Code Verification**: Does not require additional security fields as the QR code itself is the security token

7. **Status Values**:
   - `valid`: Certificate is active
   - `revoked`: Certificate has been revoked
   - `expired`: Certificate has expired

8. **Use Cases**:
   - **Verify**: Check certificate validity, display information
   - **Download**: Save certificate PDF to device
   - **QR Code**: Quick verification via QR code scan

9. **Date Validation**: The system validates that dates are real (e.g., rejects 30-02-2000, 32-01-2024)

10. **Error Handling**: All endpoints return consistent error format with descriptive messages
