# Regenerate Certificate Modal - Field Population Fix

## Problem

When clicking the "Regenerate" button on the Certificates list page, the RegenerateCertificateModal opens but the form fields are not populated with the existing certificate data.

## Root Cause

The `RegenerateCertificateModal` component expects a `certificate` object with a `certificate_data_snapshot` field that contains all the form data used when the certificate was originally issued:

```javascript
const populateFormFromCertificate = () => {
  if (!certificate?.certificate_data_snapshot) return;
  
  const snapshot = certificate.certificate_data_snapshot;
  // Uses snapshot.student_name, snapshot.guardian_name, etc.
}
```

However, the **Certificates list page** (`Certificates.jsx`) was passing the certificate object directly from the table data, which comes from the `GET /api/internal/certificates` endpoint. This endpoint returns a **simplified list** of certificates without the `certificate_data_snapshot` field.

## Solution

### Fixed in `src/pages/internal/Certificates/Certificates.jsx`

Changed the regenerate action to fetch the **full certificate details** before opening the modal:

**Before:**
```javascript
case 'regenerate':
  // Open modal instead of direct regeneration
  const cert = certificates.find(c => c.id === certificateId);
  if (cert) {
    setSelectedCertificate(cert);
    setRegenerateModalOpen(true);
  }
  return;
```

**After:**
```javascript
case 'regenerate':
  // Fetch full certificate details before opening modal
  try {
    const certResponse = await certificateApi.getCertificateById(certificateId);
    if (certResponse.success) {
      setSelectedCertificate(certResponse.data);
      setRegenerateModalOpen(true);
    } else {
      showError('Failed to load certificate details');
    }
  } catch (error) {
    console.error('Error loading certificate details:', error);
    showError('Failed to load certificate details');
  }
  return;
```

### Added Debug Logging in `src/components/common/RegenerateCertificateModal.jsx`

Added a console warning to help identify if the snapshot is missing:

```javascript
const populateFormFromCertificate = () => {
  if (!certificate?.certificate_data_snapshot) {
    console.warn('Certificate data snapshot not found:', certificate);
    return;
  }
  // ...
}
```

## API Endpoints Involved

1. **GET `/api/internal/certificates`** (List endpoint)
   - Returns simplified certificate data
   - Does NOT include `certificate_data_snapshot`
   - Used for table display

2. **GET `/api/internal/certificates/:id`** (Detail endpoint)
   - Returns complete certificate data
   - SHOULD include `certificate_data_snapshot`
   - Used for viewing and regenerating

## Expected Behavior After Fix

1. User clicks "Regenerate" button on any certificate in the list
2. System fetches full certificate details using `getCertificateById()`
3. Modal opens with all form fields pre-populated:
   - Student name, gender
   - Guardian name, gender, relationship
   - Grade/result
   - Examination date
   - Course start/completion dates
   - Course duration
   - Template selection
   - Issue date
4. User can modify any fields and regenerate the certificate

## Note on ViewCertificate.jsx

The `ViewCertificate.jsx` page already loads full certificate details using `getCertificateById()` in its `useEffect`, so it should work correctly without changes.

## Backend Verification Needed

If the form fields are still not populating after this fix, verify that the backend API endpoint `GET /api/internal/certificates/:id` actually returns the `certificate_data_snapshot` field in its response. This field should contain:

```json
{
  "certificate_data_snapshot": {
    "student_name": "John Doe",
    "student_gender": "male",
    "guardian_name": "Jane Doe",
    "guardian_gender": "female",
    "guardian_relationship": "son",
    "grade": "A+",
    "examination_month_year": "February 2026",
    "commencement_month_year": "January 2026",
    "completion_month_year": "March 2026",
    "course_duration": "6 Months"
  }
}
```

## Testing Checklist

- [ ] Open Certificates list page (`/admin/certificate/issued`)
- [ ] Click "Regenerate" button on any certificate
- [ ] Verify modal opens with all fields populated
- [ ] Check browser console for any warnings about missing snapshot
- [ ] Modify some fields and submit
- [ ] Verify certificate regenerates successfully
