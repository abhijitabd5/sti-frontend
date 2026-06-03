# Student Enrollment Update - Changes Summary

## Overview
Updated the `EnrollmentForm.jsx` to align with the backend API specification for updating student enrollments. The form now correctly restricts which fields can be edited and sends only the allowed fields to the API.

## Changes Made

### 1. **Restricted Non-Editable Fields in Edit Mode**

The following fields are now **disabled/read-only in edit mode**:
- ✅ `course_id` - Course cannot be changed
- ✅ `is_hostel_opted` - Accommodation options locked
- ✅ `is_mess_opted` - Accommodation options locked
- ✅ `extra_discount_amount` - Extra discount locked

### 2. **Added New Fields to Form**

Added missing fields from the API specification:

#### User Fields (updates `users` table):
- ✅ `first_name` - User's first name
- ✅ `last_name` - User's last name

#### Student Profile Fields (updates `students` table):
- ✅ `pan_number` - PAN card number (12 digits)

#### Enrollment Fields (updates `enrollments` table):
- ✅ `completion_date` - Date when course was completed
- ✅ `remark` - Notes/remarks about enrollment (already existed, now visible)

### 3. **Updated `handleUpdateEnrollment` Function**

Refactored to send **only API-allowed fields**:

```javascript
const updateData = {};

// Enrollment fields (optional)
- status
- enrollment_date
- completion_date
- remark

// Payment fields (optional - ADDITIVE)
- paid_amount (adds to existing amount)
- payment_method (required if paid_amount > 0)

// User fields (optional - updates users table)
- first_name
- last_name
- mobile
- email

// Student profile fields (optional - updates students table)
- name_on_id
- father_name
- mother_name
- date_of_birth
- gender
- address
- state_slug
- state_name
- city
- pincode
- aadhar_number
- pan_number
```

### 4. **Removed Non-Allowed Fields from Update**

The following fields are **NO LONGER sent** in edit mode:
- ❌ `course_id` - Cannot be changed
- ❌ `is_hostel_opted` - Cannot be changed
- ❌ `is_mess_opted` - Cannot be changed
- ❌ `extra_discount_amount` - Cannot be changed

### 5. **UI Improvements**

- Added visual indicators for disabled fields in edit mode
- Added helper text explaining why fields are disabled
- Added "expelled" status option (was missing from API spec)
- Improved field organization with first_name/last_name separate from name_on_id
- Made Aadhaar editable in edit mode (as per API spec)

## API Compliance

### ✅ All API-Allowed Fields Supported:

**Enrollment Fields:**
- status ✓
- enrollment_date ✓
- completion_date ✓
- remark ✓

**Payment Fields:**
- paid_amount ✓ (ADDITIVE)
- payment_method ✓

**User Fields:**
- first_name ✓
- last_name ✓
- mobile ✓
- email ✓

**Student Profile Fields:**
- name_on_id ✓
- father_name ✓
- mother_name ✓
- date_of_birth ✓
- gender ✓
- address ✓
- state_slug ✓
- state_name ✓
- city ✓
- pincode ✓
- aadhar_number ✓
- pan_number ✓

### ✅ Important API Behaviors Implemented:

1. **ADDITIVE Payment**: `paid_amount` adds to existing amount, doesn't replace it
2. **Optional Fields**: All fields are optional - only changed fields are sent
3. **Conditional Requirements**: `payment_method` required only if `paid_amount` > 0
4. **Date Format**: All dates sent in YYYY-MM-DD format
5. **Mobile Uniqueness**: Mobile validation ensures 10-digit format

## Testing Checklist

### Edit Mode Tests:
- [ ] Course dropdown is disabled
- [ ] Accommodation checkboxes are disabled
- [ ] Extra discount field is disabled
- [ ] All student info fields are editable
- [ ] Status can be changed
- [ ] Enrollment date can be changed
- [ ] Completion date can be set
- [ ] Remark can be added/edited
- [ ] Additional payment can be added
- [ ] First name and last name can be set
- [ ] PAN number can be added
- [ ] Aadhaar can be edited

### Create Mode Tests:
- [ ] All fields are editable
- [ ] Course selection works
- [ ] Accommodation options work
- [ ] Extra discount can be set
- [ ] Documents can be uploaded

### API Integration Tests:
- [ ] Update sends only changed fields
- [ ] paid_amount is additive
- [ ] payment_method sent when paid_amount > 0
- [ ] Date fields in correct format
- [ ] Mobile validation works
- [ ] Success message displays
- [ ] Redirects to student detail page

## Files Modified

1. `src/pages/internal/Students/EnrollmentForm.jsx`
   - Added new form fields
   - Updated state management
   - Refactored `handleUpdateEnrollment()`
   - Added field restrictions in edit mode
   - Improved UI/UX

## Notes

- **Backward Compatible**: Changes don't affect create enrollment flow
- **Validation**: Existing validation rules maintained
- **Mobile Uniqueness**: Backend enforces uniqueness, frontend validates format
- **Payment History**: Additional payments are tracked separately by backend
- **Fee Recalculation**: Disabled in edit mode to prevent fee structure changes

## Future Enhancements

Consider adding:
1. Validation for PAN number format (ABCDE1234F)
2. Confirmation dialog when changing critical fields
3. Display of payment history in edit mode
4. Auto-set completion_date when status changes to "completed"
5. Field-level change tracking/audit log
