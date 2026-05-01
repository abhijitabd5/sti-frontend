# Certificate Verification Flow Diagram

## User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

    User on Website
         │
         ▼
    Click "Verify Certificate" in Navbar
         │
         ▼
    ┌─────────────────────────────────────┐
    │   Verify Certificate Modal Opens    │
    │                                     │
    │  Certificate Number: [_________]    │
    │                                     │
    │  ┌─ Security Verification ───────┐ │
    │  │ Mobile: [_________]           │ │
    │  │ DOB:    [_________]           │ │
    │  └───────────────────────────────┘ │
    │                                     │
    │  [Verify Certificate Button]        │
    └─────────────────────────────────────┘
         │
         ▼
    ┌─────────────────────────────────────┐
    │   Client-Side Validation            │
    │                                     │
    │  ✓ Certificate number not empty?   │
    │  ✓ At least one security field?    │
    │  ✓ Mobile is 10 digits?            │
    │  ✓ DOB is DD-MM-YYYY?              │
    └─────────────────────────────────────┘
         │
         ├─── Validation Failed ───┐
         │                         │
         │                         ▼
         │                    Show Error
         │                    Stay on Form
         │
         ▼
    Validation Passed
         │
         ▼
    ┌─────────────────────────────────────┐
    │   Send POST Request to Backend      │
    │                                     │
    │   POST /api/public/certificates/    │
    │        verify                       │
    │                                     │
    │   Body: {                           │
    │     certificateNumber,              │
    │     mobileNumber,                   │
    │     dateOfBirth                     │
    │   }                                 │
    └─────────────────────────────────────┘
         │
         ▼
    ┌─────────────────────────────────────┐
    │   Backend Processing                │
    │                                     │
    │  1. Validate request format         │
    │  2. Find certificate by number      │
    │  3. Verify mobile (if provided)     │
    │  4. Verify DOB (if provided)        │
    │  5. Increment verification count    │
    └─────────────────────────────────────┘
         │
         ├─────────────────────────────────┐
         │                                 │
         ▼                                 ▼
    SUCCESS (200)                     ERROR (400/404)
         │                                 │
         ▼                                 ▼
    ┌─────────────────────────┐      ┌──────────────────┐
    │ Display Certificate     │      │ Show Error       │
    │ Details:                │      │ Message:         │
    │                         │      │                  │
    │ ✓ Student Info          │      │ • Not found      │
    │ ✓ Course Info           │      │ • Mobile wrong   │
    │ ✓ Issue Date            │      │ • DOB wrong      │
    │ ✓ Status Badge          │      │ • Invalid format │
    │ ✓ Verification Count    │      └──────────────────┘
    │                         │               │
    │ [Download] [Close]      │               │
    └─────────────────────────┘               │
         │                                    │
         ▼                                    ▼
    User can download PDF              User can retry
         │                                    │
         ▼                                    │
    Click "Download Certificate"             │
         │                                    │
         ▼                                    │
    ┌─────────────────────────┐              │
    │ Send POST Request       │              │
    │ to /download endpoint   │              │
    └─────────────────────────┘              │
         │                                    │
         ▼                                    │
    PDF Downloaded                            │
         │                                    │
         └────────────────────────────────────┘
                        │
                        ▼
                  User Closes Modal
```

---

## Technical Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     TECHNICAL ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────┘

Frontend (React)                    Backend (Node.js/Express)
─────────────────                   ──────────────────────────

WebsiteHeader.jsx
      │
      │ onClick
      ▼
VerifyCertificateModal.jsx
      │
      │ State Management:
      │ • certificateNumber
      │ • mobileNumber
      │ • dateOfBirth
      │ • loading
      │ • downloading
      │ • error
      │ • certificateData
      │
      │ handleVerify()
      ▼
publicCertificateApi.js
      │
      │ verifyCertificate(payload)
      │ • Validate format
      │ • Build request
      ▼
httpClient (Axios)
      │
      │ POST /api/public/certificates/verify
      │ Headers: Content-Type: application/json
      │ Body: { certificateNumber, mobileNumber, dateOfBirth }
      │
      └──────────────────────────────────────────────────┐
                                                         │
                                                         ▼
                                          CertificateVerificationController
                                                         │
                                                         │ validateRequest()
                                                         ▼
                                          ┌──────────────────────────┐
                                          │ Validation Rules:        │
                                          │ • Cert number required   │
                                          │ • At least one security  │
                                          │ • Mobile: 10 digits      │
                                          │ • DOB: DD-MM-YYYY        │
                                          └──────────────────────────┘
                                                         │
                                                         ▼
                                          CertificateService.verifyCertificate()
                                                         │
                                                         ▼
                                          ┌──────────────────────────┐
                                          │ Database Queries:        │
                                          │ 1. Find certificate      │
                                          │ 2. Include student       │
                                          │ 3. Include user          │
                                          │ 4. Include course        │
                                          └──────────────────────────┘
                                                         │
                                                         ▼
                                          ┌──────────────────────────┐
                                          │ Verification Logic:      │
                                          │ • Compare mobile (last   │
                                          │   10 digits)             │
                                          │ • Compare DOB (exact     │
                                          │   match)                 │
                                          │ • Increment count        │
                                          │ • Update last_verified   │
                                          └──────────────────────────┘
                                                         │
                                                         ▼
                                          ┌──────────────────────────┐
                                          │ Response:                │
                                          │ {                        │
                                          │   success: true,         │
                                          │   message: "...",        │
                                          │   data: { ... },         │
                                          │   timestamp: "..."       │
                                          │ }                        │
                                          └──────────────────────────┘
                                                         │
      ┌──────────────────────────────────────────────────┘
      │
      ▼
httpClient receives response
      │
      ▼
publicCertificateApi.js
      │
      │ extractData(response)
      │ Returns: response.data.data
      ▼
VerifyCertificateModal.jsx
      │
      │ setCertificateData(data)
      │ setLoading(false)
      ▼
Display Certificate Details
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                               │
└─────────────────────────────────────────────────────────────────┘

INPUT (User)
────────────
Certificate Number: "STI-2024-0001"
Mobile Number:      "9876543210"
Date of Birth:      (2024-06-15 from date picker)

      │
      ▼

TRANSFORMATION (Frontend)
─────────────────────────
Date Format Conversion:
  2024-06-15  →  15-06-2024
  (YYYY-MM-DD)   (DD-MM-YYYY)

Mobile Validation:
  "9876543210"  →  ✓ Valid (10 digits)

      │
      ▼

REQUEST PAYLOAD
───────────────
{
  "certificateNumber": "STI-2024-0001",
  "mobileNumber": "9876543210",
  "dateOfBirth": "15-06-1995"
}

      │
      ▼

BACKEND PROCESSING
──────────────────
1. Parse JSON body
2. Validate format
3. Query database
4. Compare values
5. Update counters

      │
      ▼

RESPONSE DATA
─────────────
{
  "success": true,
  "message": "Certificate verified successfully",
  "data": {
    "id": 1,
    "certificate_number": "STI-2024-0001",
    "student": {
      "name_on_id": "John Doe",
      "user": {
        "email": "john@example.com",
        "mobile": "9876543210"
      }
    },
    "course": {
      "title": "Heavy Equipment Operator Training"
    },
    "issue_date": "2024-03-15",
    "status": "valid",
    "verification_count": 5
  }
}

      │
      ▼

DISPLAY (Frontend)
──────────────────
✓ Success Banner
✓ Student Photo/Avatar
✓ Student Name: John Doe
✓ Email: john@example.com
✓ Mobile: 9876543210
✓ Certificate: STI-2024-0001
✓ Issue Date: March 15, 2024
✓ Course: Heavy Equipment Operator Training
✓ Status: Valid
✓ Verified: 5 times

[Download Certificate] [Close]
```

---

## Error Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        ERROR HANDLING                           │
└─────────────────────────────────────────────────────────────────┘

User Input Error
────────────────
Empty certificate number
      │
      ▼
Client Validation
      │
      ▼
Show Error: "Please enter a certificate number"
Stay on form


Missing Security Fields
───────────────────────
No mobile AND no DOB
      │
      ▼
Client Validation
      │
      ▼
Show Error: "Please provide either mobile number or date of birth"
Stay on form


Invalid Mobile Format
─────────────────────
Mobile: "123" (only 3 digits)
      │
      ▼
Client Validation
      │
      ▼
Show Error: "Mobile number must be exactly 10 digits"
Stay on form


Backend Validation Error
────────────────────────
Request sent with invalid data
      │
      ▼
Backend validates
      │
      ▼
Returns 400 Bad Request
      │
      ▼
Frontend catches error
      │
      ▼
Show Error: Backend error message
Stay on form


Certificate Not Found
─────────────────────
Valid format but cert doesn't exist
      │
      ▼
Backend queries database
      │
      ▼
No results found
      │
      ▼
Returns 404 Not Found
      │
      ▼
Frontend catches error
      │
      ▼
Show Error: "Certificate not found"
Stay on form


Mobile Mismatch
───────────────
Cert exists but mobile doesn't match
      │
      ▼
Backend compares mobile
      │
      ▼
Mismatch detected
      │
      ▼
Returns 404 with specific message
      │
      ▼
Frontend catches error
      │
      ▼
Show Error: "Certificate verification failed - mobile number does not match"
User can try with DOB instead


Network Error
─────────────
No internet connection
      │
      ▼
Request fails
      │
      ▼
Axios catches network error
      │
      ▼
Frontend catches error
      │
      ▼
Show Error: "Network error" or generic message
User can retry
```

---

## State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT STATE                              │
└─────────────────────────────────────────────────────────────────┘

Initial State
─────────────
certificateNumber: ""
mobileNumber: ""
dateOfBirth: ""
loading: false
downloading: false
error: null
certificateData: null

      │
      ▼

User Enters Data
────────────────
certificateNumber: "STI-2024-0001"
mobileNumber: "9876543210"
dateOfBirth: "15-06-1995"
loading: false
downloading: false
error: null
certificateData: null

      │
      ▼

User Clicks Verify
──────────────────
certificateNumber: "STI-2024-0001"
mobileNumber: "9876543210"
dateOfBirth: "15-06-1995"
loading: true          ← Changed
downloading: false
error: null            ← Cleared
certificateData: null  ← Cleared

      │
      ▼

Success Response
────────────────
certificateNumber: "STI-2024-0001"
mobileNumber: "9876543210"
dateOfBirth: "15-06-1995"
loading: false         ← Changed
downloading: false
error: null
certificateData: {...} ← Populated

      │
      ▼

User Clicks Download
────────────────────
certificateNumber: "STI-2024-0001"
mobileNumber: "9876543210"
dateOfBirth: "15-06-1995"
loading: false
downloading: true      ← Changed
error: null
certificateData: {...}

      │
      ▼

Download Complete
─────────────────
certificateNumber: "STI-2024-0001"
mobileNumber: "9876543210"
dateOfBirth: "15-06-1995"
loading: false
downloading: false     ← Changed
error: null
certificateData: {...}

      │
      ▼

User Closes Modal
─────────────────
certificateNumber: ""  ← Reset
mobileNumber: ""       ← Reset
dateOfBirth: ""        ← Reset
loading: false
downloading: false
error: null            ← Reset
certificateData: null  ← Reset
```

---

## Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                              │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Client-Side Validation
────────────────────────────────
✓ Certificate number not empty
✓ At least one security field provided
✓ Mobile is exactly 10 digits (if provided)
✓ DOB is DD-MM-YYYY format (if provided)
✓ DOB is at least 18 years ago (if provided)

      │
      ▼

Layer 2: Request Format
───────────────────────
✓ POST method (not GET)
✓ JSON content type
✓ Proper payload structure
✓ No sensitive data in URL

      │
      ▼

Layer 3: Backend Validation
────────────────────────────
✓ Request body exists
✓ Certificate number present
✓ At least one security field
✓ Mobile format (10 digits)
✓ DOB format (DD-MM-YYYY)
✓ Valid date (not 30-02-2000)

      │
      ▼

Layer 4: Database Verification
───────────────────────────────
✓ Certificate exists in database
✓ Certificate is not revoked
✓ Student record exists
✓ User record exists

      │
      ▼

Layer 5: Data Matching
──────────────────────
✓ Mobile matches (last 10 digits)
✓ DOB matches (exact date)
✓ At least one match required

      │
      ▼

Layer 6: Response
─────────────────
✓ Increment verification count
✓ Update last verified timestamp
✓ Return sanitized data
✓ No sensitive data exposed

      │
      ▼

VERIFIED ✓
```

---

**End of Flow Diagrams**
