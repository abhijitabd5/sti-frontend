# Certificate Verification - Test Plan

## Pre-Testing Setup

### Environment Verification
- [ ] Backend API is running and accessible
- [ ] Frontend dev server is running (`npm run dev`)
- [ ] Database has test certificate data
- [ ] Test student records have mobile and DOB fields populated

### Test Data Required
```javascript
// Valid Test Certificate
{
  certificateNumber: "STI-2024-0001",
  studentMobile: "9876543210",
  studentDOB: "15-06-1995"
}

// Invalid Test Data
{
  wrongMobile: "1234567890",
  wrongDOB: "01-01-2000",
  invalidCertNumber: "INVALID-CERT-123"
}
```

---

## Test Cases

### 1. UI/UX Tests

#### 1.1 Modal Display
- [ ] Click "Verify Certificate" in navbar
- [ ] Modal opens with proper styling
- [ ] Modal is centered on screen
- [ ] Close button (X) is visible
- [ ] Dark mode styling works correctly

#### 1.2 Form Fields
- [ ] Certificate number field is visible and labeled
- [ ] Required asterisk (*) is shown for certificate number
- [ ] Mobile number field is visible in security section
- [ ] Date of birth field is visible in security section
- [ ] Helper text is shown under each field
- [ ] Security section has orange/yellow background
- [ ] All fields are properly aligned

#### 1.3 Input Behavior
- [ ] Certificate number accepts any text
- [ ] Mobile number only accepts digits
- [ ] Mobile number auto-formats (removes non-digits)
- [ ] Mobile number limits to 10 characters
- [ ] Date picker opens when clicking DOB field
- [ ] Date picker shows calendar interface
- [ ] Date picker max date is 18 years ago
- [ ] Cannot select future dates in DOB
- [ ] Cannot select dates less than 18 years ago

#### 1.4 Button States
- [ ] Verify button is enabled when form is empty
- [ ] Verify button shows loading state when submitting
- [ ] Verify button is disabled during loading
- [ ] Loading spinner appears during verification
- [ ] Button text changes to "Verifying..." during load

---

### 2. Validation Tests

#### 2.1 Required Field Validation
- [ ] Submit with empty certificate number → Error shown
- [ ] Submit with only certificate number → Error shown
- [ ] Submit with certificate + mobile → Success
- [ ] Submit with certificate + DOB → Success
- [ ] Submit with all three fields → Success

#### 2.2 Mobile Number Validation
- [ ] Enter 9 digits → Error: "must be exactly 10 digits"
- [ ] Enter 11 digits → Auto-truncated to 10 digits
- [ ] Enter letters → Automatically removed
- [ ] Enter special characters → Automatically removed
- [ ] Enter "0987654321" → Accepted
- [ ] Enter "9876543210" → Accepted

#### 2.3 Date Format Validation
- [ ] Select date from picker → Formatted correctly
- [ ] Date is converted to DD-MM-YYYY for backend
- [ ] Date 17 years ago → Cannot be selected
- [ ] Date 18 years ago → Can be selected
- [ ] Date 50 years ago → Can be selected

#### 2.4 Error Message Display
- [ ] Error appears in red box above form
- [ ] Error icon is shown
- [ ] Error text is readable
- [ ] Error clears when resubmitting
- [ ] Multiple errors show most recent only

---

### 3. API Integration Tests

#### 3.1 Successful Verification
**Test:** Valid certificate + valid mobile
```javascript
Input:
- Certificate: "STI-2024-0001"
- Mobile: "9876543210"
- DOB: (empty)

Expected:
- ✅ Success banner shown
- ✅ Certificate details displayed
- ✅ Student info shown with photo
- ✅ Course details visible
- ✅ Issue date formatted correctly
- ✅ Status badge shows "Valid"
```

**Test:** Valid certificate + valid DOB
```javascript
Input:
- Certificate: "STI-2024-0001"
- Mobile: (empty)
- DOB: "15-06-1995"

Expected:
- ✅ Success banner shown
- ✅ All certificate details displayed
```

**Test:** Valid certificate + both fields
```javascript
Input:
- Certificate: "STI-2024-0001"
- Mobile: "9876543210"
- DOB: "15-06-1995"

Expected:
- ✅ Success banner shown
- ✅ All certificate details displayed
```

#### 3.2 Failed Verification
**Test:** Invalid certificate number
```javascript
Input:
- Certificate: "INVALID-CERT-123"
- Mobile: "9876543210"

Expected:
- ❌ Error: "Certificate not found"
- ❌ No certificate details shown
```

**Test:** Valid certificate + wrong mobile
```javascript
Input:
- Certificate: "STI-2024-0001"
- Mobile: "1234567890"

Expected:
- ❌ Error: "Certificate verification failed - mobile number does not match"
- ❌ No certificate details shown
```

**Test:** Valid certificate + wrong DOB
```javascript
Input:
- Certificate: "STI-2024-0001"
- DOB: "01-01-2000"

Expected:
- ❌ Error: "Certificate verification failed - date of birth does not match"
- ❌ No certificate details shown
```

#### 3.3 Network Error Handling
- [ ] Disconnect network → Error: "Network error" or similar
- [ ] Backend returns 500 → Error message shown
- [ ] Backend timeout → Error message shown
- [ ] Invalid JSON response → Error handled gracefully

---

### 4. Certificate Details Display Tests

#### 4.1 Student Information
- [ ] Student name displayed correctly
- [ ] Student code shown
- [ ] Profile picture shown (if available)
- [ ] Fallback avatar shown (if no picture)
- [ ] Email address displayed
- [ ] Mobile number displayed
- [ ] All fields properly formatted

#### 4.2 Certificate Information
- [ ] Certificate number displayed
- [ ] Issue date formatted correctly (e.g., "March 15, 2024")
- [ ] Course title shown
- [ ] Course duration shown (if available)
- [ ] Status badge shows correct color
- [ ] Status badge shows "Valid" or "Invalid"

#### 4.3 Verification Stats
- [ ] Verification count shown (if > 0)
- [ ] Last verified date shown (if available)
- [ ] Last verified date formatted correctly

#### 4.4 Visual Elements
- [ ] Success banner has green background
- [ ] Success icon (checkmark) is visible
- [ ] Student card has gradient background
- [ ] Certificate details in grid layout
- [ ] All cards have proper spacing
- [ ] Dark mode colors are correct

---

### 5. Responsive Design Tests

#### 5.1 Desktop (1920x1080)
- [ ] Modal is centered
- [ ] Modal width is appropriate (max-w-2xl)
- [ ] Two-column grid for security fields
- [ ] All text is readable
- [ ] No horizontal scrolling

#### 5.2 Tablet (768x1024)
- [ ] Modal fits screen
- [ ] Security fields stack or stay side-by-side
- [ ] Touch targets are adequate (44x44px minimum)
- [ ] No content cutoff

#### 5.3 Mobile (375x667)
- [ ] Modal takes full width with padding
- [ ] Security fields stack vertically
- [ ] Certificate details stack vertically
- [ ] All buttons are touch-friendly
- [ ] Native date picker appears
- [ ] Numeric keyboard for mobile field
- [ ] No horizontal scrolling
- [ ] Text is readable without zooming

---

### 6. Accessibility Tests

#### 6.1 Keyboard Navigation
- [ ] Tab through all form fields in order
- [ ] Enter key submits form
- [ ] Escape key closes modal
- [ ] Focus visible on all interactive elements
- [ ] Focus trapped within modal when open

#### 6.2 Screen Reader
- [ ] Modal title announced when opened
- [ ] All labels read correctly
- [ ] Required fields announced as required
- [ ] Error messages announced
- [ ] Success message announced
- [ ] Helper text read with fields
- [ ] Close button has proper label

#### 6.3 ARIA Attributes
- [ ] Modal has role="dialog"
- [ ] Modal has aria-labelledby
- [ ] Required fields have aria-required="true"
- [ ] Error messages have aria-live="polite"
- [ ] Form has proper structure

#### 6.4 Color Contrast
- [ ] Text meets WCAG AA standards (4.5:1)
- [ ] Error text is readable
- [ ] Success text is readable
- [ ] Dark mode meets contrast standards
- [ ] Focus indicators are visible

---

### 7. Browser Compatibility Tests

#### 7.1 Chrome/Edge (Chromium)
- [ ] All features work
- [ ] Date picker displays correctly
- [ ] Styling is correct
- [ ] No console errors

#### 7.2 Firefox
- [ ] All features work
- [ ] Date picker displays correctly
- [ ] Styling is correct
- [ ] No console errors

#### 7.3 Safari (macOS)
- [ ] All features work
- [ ] Date picker displays correctly
- [ ] Styling is correct
- [ ] No console errors

#### 7.4 Safari (iOS)
- [ ] Native date picker works
- [ ] Numeric keyboard for mobile
- [ ] Touch interactions work
- [ ] No layout issues

#### 7.5 Chrome (Android)
- [ ] Native date picker works
- [ ] Numeric keyboard for mobile
- [ ] Touch interactions work
- [ ] No layout issues

---

### 8. Performance Tests

#### 8.1 Load Time
- [ ] Modal opens instantly (<100ms)
- [ ] No lag when typing
- [ ] Date picker opens quickly
- [ ] Form submission is responsive

#### 8.2 API Response Time
- [ ] Verification completes in <500ms (typical)
- [ ] Loading state shows for slow connections
- [ ] Timeout handled gracefully (if >30s)

#### 8.3 Memory Usage
- [ ] No memory leaks when opening/closing modal
- [ ] Images load efficiently
- [ ] No excessive re-renders

---

### 9. Edge Cases

#### 9.1 Empty/Null Values
- [ ] Empty string for mobile → Treated as not provided
- [ ] Null for DOB → Treated as not provided
- [ ] Whitespace in certificate number → Trimmed
- [ ] Whitespace in mobile → Trimmed

#### 9.2 Special Characters
- [ ] Certificate number with spaces → Accepted
- [ ] Certificate number with dashes → Accepted
- [ ] Mobile with spaces → Removed
- [ ] Mobile with dashes → Removed
- [ ] Mobile with +91 → Removed

#### 9.3 Boundary Values
- [ ] Mobile exactly 10 digits → Accepted
- [ ] Mobile 9 digits → Rejected
- [ ] Mobile 11 digits → Truncated
- [ ] DOB exactly 18 years ago → Accepted
- [ ] DOB 17 years 364 days ago → Rejected

#### 9.4 Multiple Submissions
- [ ] Submit, get error, fix, resubmit → Works
- [ ] Submit, get success, submit again → Works
- [ ] Rapid clicking submit button → Only one request sent

---

### 10. Security Tests

#### 10.1 Input Sanitization
- [ ] SQL injection attempts → Handled by backend
- [ ] XSS attempts in certificate number → Escaped
- [ ] Script tags in input → Not executed

#### 10.2 Data Privacy
- [ ] Mobile number not visible in URL
- [ ] DOB not visible in URL
- [ ] No sensitive data in console logs
- [ ] No sensitive data in network tab (check payload)

#### 10.3 Rate Limiting (if implemented)
- [ ] Multiple rapid requests → Rate limited
- [ ] Error message shown for rate limit
- [ ] Can retry after cooldown period

---

### 11. Error Recovery Tests

#### 11.1 Network Issues
- [ ] Submit while offline → Error shown
- [ ] Reconnect and retry → Works
- [ ] Slow connection → Loading state shown

#### 11.2 Backend Issues
- [ ] Backend returns 500 → Error shown
- [ ] Backend returns invalid JSON → Error handled
- [ ] Backend timeout → Error shown

#### 11.3 User Corrections
- [ ] Enter wrong mobile → Error → Correct → Success
- [ ] Enter wrong DOB → Error → Correct → Success
- [ ] Clear fields and start over → Works

---

### 12. Integration Tests

#### 12.1 Modal Lifecycle
- [ ] Open modal → Form is empty
- [ ] Fill form → Close modal → Reopen → Form is empty
- [ ] Submit form → Success → Close → Reopen → Form is empty

#### 12.2 State Management
- [ ] Error state clears on new submission
- [ ] Success state clears on new submission
- [ ] Loading state clears after response
- [ ] Form resets on close

#### 12.3 Navigation
- [ ] Verify from navbar → Works
- [ ] Verify from footer (if applicable) → Works
- [ ] Direct link to verify (if applicable) → Works

---

## Test Results Template

```markdown
## Test Execution Results

**Date:** [Date]
**Tester:** [Name]
**Environment:** [Dev/Staging/Production]
**Browser:** [Browser + Version]
**Device:** [Desktop/Mobile/Tablet]

### Summary
- Total Tests: [X]
- Passed: [X]
- Failed: [X]
- Blocked: [X]

### Failed Tests
1. [Test Case ID] - [Description]
   - Expected: [Expected result]
   - Actual: [Actual result]
   - Screenshot: [Link]

### Blockers
1. [Description of blocker]

### Notes
[Any additional observations]
```

---

## Automated Testing (Optional)

### Unit Tests
```javascript
// Example test cases for validation functions
describe('Certificate Verification', () => {
  test('validates mobile number format', () => {
    expect(validateMobile('9876543210')).toBe(true);
    expect(validateMobile('123456789')).toBe(false);
    expect(validateMobile('12345678901')).toBe(false);
  });

  test('formats date for backend', () => {
    expect(formatDateForBackend('1995-06-15')).toBe('15-06-1995');
  });

  test('calculates max date (18 years ago)', () => {
    const maxDate = getMaxDate();
    const date = new Date(maxDate);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    expect(age).toBe(18);
  });
});
```

### Integration Tests
```javascript
// Example API integration test
describe('Certificate Verification API', () => {
  test('verifies certificate with valid mobile', async () => {
    const payload = {
      certificateNumber: 'STI-2024-0001',
      mobileNumber: '9876543210'
    };
    const result = await publicCertificateApi.verifyCertificate(payload);
    expect(result.certificate_number).toBe('STI-2024-0001');
  });

  test('rejects invalid mobile format', async () => {
    const payload = {
      certificateNumber: 'STI-2024-0001',
      mobileNumber: '123'
    };
    await expect(
      publicCertificateApi.verifyCertificate(payload)
    ).rejects.toThrow('Mobile number must be exactly 10 digits');
  });
});
```

---

## Sign-Off

### Development Team
- [ ] All code changes reviewed
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Documentation updated

### QA Team
- [ ] All test cases executed
- [ ] No critical bugs found
- [ ] Performance acceptable
- [ ] Accessibility verified

### Product Owner
- [ ] Feature meets requirements
- [ ] UX is acceptable
- [ ] Ready for production

**Approved By:** _______________  
**Date:** _______________
