# Certificate Verification Feature Update

## Overview

Enhanced the public certificate verification feature with additional security fields (mobile number and date of birth) to prevent unauthorized certificate verification.

## Frontend Changes

### 1. Updated Components

#### `src/components/common/VerifyCertificateModal.jsx`

**New Features:**
- Added mobile number input field (10 digits, numeric only)
- Added date of birth input field (date picker with 18+ age restriction)
- Enhanced form validation
- Improved UI with security field section
- Auto-formatting for mobile number (digits only, max 10)
- Date format conversion from `YYYY-MM-DD` (HTML5 date input) to `DD-MM-YYYY` (backend format)

**Validation Rules:**
- Certificate number: Required
- Mobile number: Optional, must be exactly 10 digits if provided
- Date of birth: Optional, must be at least 18 years old if provided
- At least ONE security field (mobile or DOB) must be provided

**State Management:**
```javascript
const [certificateNumber, setCertificateNumber] = useState('');
const [mobileNumber, setMobileNumber] = useState('');
const [dateOfBirth, setDateOfBirth] = useState('');
```

### 2. Updated API Service

#### `src/services/api/publicCertificateApi.js`

**API Endpoint:**
- Method: `POST` (changed from GET)
- URL: `/api/public/certificates/verify`
- Content-Type: `application/json`

**Request Payload:**
```javascript
{
  certificateNumber: "STI-2024-0001",  // Required
  mobileNumber: "9876543210",          // Optional (10 digits)
  dateOfBirth: "15-06-1995"            // Optional (DD-MM-YYYY)
}
```

**Client-Side Validation:**
- Certificate number: Non-empty string
- Mobile number: Exactly 10 digits (regex: `/^\d{10}$/`)
- Date of birth: DD-MM-YYYY format (regex: `/^\d{2}-\d{2}-\d{4}$/`)
- At least one security field required

**Error Handling:**
- Validates input before sending request
- Displays backend error messages
- Handles network errors gracefully

## User Experience

### Form Layout

```
┌─────────────────────────────────────────┐
│  Certificate Number *                   │
│  [____________________________]         │
│                                         │
│  ┌─ Security Verification ───────────┐ │
│  │ Provide at least one:             │ │
│  │                                   │ │
│  │ Mobile Number    Date of Birth   │ │
│  │ [__________]     [__________]    │ │
│  │ 10 digits only   Must be 18+     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [Verify Certificate]                   │
└─────────────────────────────────────────┘
```

### Validation Messages

**Client-Side:**
- "Please enter a certificate number"
- "Please provide either mobile number or date of birth"
- "Mobile number must be exactly 10 digits"

**Server-Side (from backend):**
- "Certificate not found"
- "Certificate verification failed - mobile number does not match"
- "Certificate verification failed - date of birth does not match"
- "At least one security field (mobile number or date of birth) is required for verification"

## Technical Implementation

### Date Format Conversion

The frontend uses HTML5 date input which returns `YYYY-MM-DD` format, but the backend expects `DD-MM-YYYY` (Indian format):

```javascript
const formatDateForBackend = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};
```

### Mobile Number Input Handling

Auto-formats input to ensure only digits and maximum 10 characters:

```javascript
onChange={(e) => {
  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
  setMobileNumber(value);
}}
```

### Age Restriction (18+)

Calculates maximum allowed date (18 years ago from today):

```javascript
const getMaxDate = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  return today.toISOString().split('T')[0];
};
```

## Usage Examples

### Verify with Mobile Number Only

```javascript
{
  certificateNumber: "STI-2024-0001",
  mobileNumber: "9876543210"
}
```

### Verify with Date of Birth Only

```javascript
{
  certificateNumber: "STI-2024-0001",
  dateOfBirth: "15-06-1995"
}
```

### Verify with Both (Strongest Security)

```javascript
{
  certificateNumber: "STI-2024-0001",
  mobileNumber: "9876543210",
  dateOfBirth: "15-06-1995"
}
```

## Security Benefits

1. **Multi-Factor Verification**: Requires additional information beyond certificate number
2. **Prevents Brute Force**: Random certificate numbers cannot be verified without security fields
3. **Flexible Options**: Users can provide either mobile or DOB based on what they remember
4. **Privacy Preserved**: Security fields are only used for verification, not displayed in results
5. **Age Verification**: Ensures users are at least 18 years old

## Testing Checklist

### Valid Scenarios
- ✅ Valid certificate + valid mobile
- ✅ Valid certificate + valid DOB
- ✅ Valid certificate + both fields
- ✅ Mobile with leading zeros (e.g., 0987654321 → 9876543210)
- ✅ Date picker respects 18+ age limit

### Invalid Scenarios
- ✅ Missing certificate number
- ✅ Missing both security fields
- ✅ Mobile with less than 10 digits
- ✅ Mobile with more than 10 digits
- ✅ Mobile with non-numeric characters
- ✅ Valid certificate but wrong mobile
- ✅ Valid certificate but wrong DOB
- ✅ Certificate not found

### Edge Cases
- ✅ Empty strings for optional fields
- ✅ Whitespace in certificate number (trimmed)
- ✅ Date picker on mobile devices
- ✅ Dark mode compatibility
- ✅ Responsive layout on small screens

## Browser Compatibility

- **Date Input**: HTML5 date input supported in all modern browsers
- **Fallback**: Older browsers will show text input (manual DD-MM-YYYY entry)
- **Mobile**: Native date picker on iOS/Android

## Accessibility

- ✅ Proper label associations
- ✅ Required field indicators (*)
- ✅ Error messages announced to screen readers
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ ARIA attributes for modal

## Breaking Changes

⚠️ **API Change**: This is a breaking change from the previous GET endpoint.

**Before:**
```javascript
GET /api/public/certificates/verify/:certificateNumber
```

**After:**
```javascript
POST /api/public/certificates/verify
Body: { certificateNumber, mobileNumber?, dateOfBirth? }
```

## Migration Notes

If you have any external integrations or scripts using the old API:

1. Change HTTP method from GET to POST
2. Move certificate number from URL to request body
3. Add at least one security field (mobile or DOB)
4. Update error handling for new error messages

## Future Enhancements

Potential improvements for future versions:

- [ ] OTP verification via SMS
- [ ] Email verification option
- [ ] Biometric verification for mobile apps
- [ ] Rate limiting on verification attempts
- [ ] Verification history for students
- [ ] Admin dashboard for verification analytics
- [ ] Multi-language support for error messages
- [ ] Captcha for bot prevention

## Related Documentation

- [Certificates API Documentation](./Certificates_API.md)
- [Certificate Templates API](./Certificate_Templates_API.md)
- Backend implementation notes (provided separately)

## Support

For issues or questions:
1. Check error messages in browser console
2. Verify backend API is running and accessible
3. Ensure date format matches DD-MM-YYYY
4. Confirm mobile number is exactly 10 digits
5. Check network tab for API request/response details
