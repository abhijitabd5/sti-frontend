# Student Edit Form Implementation

## Summary

Implemented full edit functionality for student enrollments with proper data loading and field restrictions.

## Features Added

### 1. Edit Mode Detection
- Automatically detects edit mode from URL path (`/admin/students/edit/:enrollmentId`)
- Extracts `enrollmentId` from URL parameters
- Shows appropriate UI and labels based on mode

### 2. Data Loading
- Loads enrollment data using `getEnrollmentById` API
- Populates all form fields with existing data
- Shows loading spinner while fetching data
- Handles errors gracefully with user feedback

### 3. Field Restrictions in Edit Mode
**Readonly Fields:**
- Student Code (always readonly)
- Aadhaar Number (always readonly)
- Name
- Mobile Number
- Father Name
- Mother Name
- Date of Birth
- Gender
- Email
- Address
- State
- City
- Pincode
- Course (disabled, cannot be changed)

**Editable Fields:**
- Enrollment Date
- Status (not_started/ongoing/completed/aborted)
- Additional Payment Amount
- Payment Method
- Remarks

### 4. UI Differences in Edit Mode

#### Form Title
- **Create Mode**: "Enroll New Student" or "Enroll Existing Student"
- **Edit Mode**: "Edit Student Enrollment"

#### Description
- **Create Mode**: "Fill in the student information and course details for enrollment"
- **Edit Mode**: "Update enrollment information and add additional payments"

#### Fee Section
- **Create Mode**: Shows full fee calculation with accommodation options
- **Edit Mode**: Shows simplified payment summary with:
  - Total Fee (readonly)
  - Already Paid (readonly)
  - Due Amount (readonly)
  - Additional Payment input
  - Payment Method dropdown

#### Documents Section
- **Create Mode**: Shows document upload interface
- **Edit Mode**: Hidden (documents managed separately via Documents page)

#### Submit Button
- **Create Mode**: "Enroll Student" / "Enrolling..."
- **Edit Mode**: "Update Enrollment" / "Updating..."

### 5. API Integration

#### New API Method Added
```javascript
// Get enrollment details by enrollment ID
async getEnrollmentById(enrollmentId) {
  const response = await httpClient.get(`/internal/student/enrollments/${enrollmentId}`);
  return response.data;
}
```

#### Update Enrollment
```javascript
// Update existing enrollment
async updateEnrollment(enrollmentId, enrollmentData) {
  const response = await httpClient.put(`/internal/student/enrollments/${enrollmentId}`, enrollmentData);
  return response.data;
}
```

### 6. Form Submission Logic

#### Create Mode
1. Validates all fields
2. Creates new enrollment
3. Uploads documents (if any)
4. Redirects to student list with success message

#### Edit Mode
1. Validates editable fields only
2. Prepares update payload with only changed fields:
   - `status`
   - `enrollment_date`
   - `remark`
   - `paid_amount` (if > 0)
   - `payment_method` (if payment added)
3. Updates enrollment via API
4. Redirects to student detail page with success message

## Files Modified

### `src/services/api/studentApi.js`
**Added:**
- `getEnrollmentById(enrollmentId)` - Fetch enrollment details

### `src/pages/internal/Students/EnrollmentForm.jsx`
**Added:**
- Edit mode detection logic
- `loadEnrollmentData()` function
- `handleUpdateEnrollment()` function
- Conditional rendering for edit mode
- Payment summary section for edit mode
- Field readonly states based on mode

**Modified:**
- `handleSubmit()` - Routes to create or update based on mode
- Form title and description - Dynamic based on mode
- All student info fields - Readonly in edit mode
- Course dropdown - Disabled in edit mode
- Fee section - Hidden in edit mode
- Documents section - Hidden in edit mode
- Submit button text - Dynamic based on mode

## API Endpoints Used

### Get Enrollment Details
**Endpoint:** `GET /api/internal/student/enrollments/:enrollmentId`

**Expected Response:**
```json
{
  "success": true,
  "message": "Enrollment details retrieved successfully",
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
      "aadhar_number": "123456789014"
    },
    "enrollment_info": {
      "id": 6,
      "course_id": 1,
      "course": "Excavator Training - Beginner",
      "status": "not_started",
      "enrollment_date": "2025-01-01",
      "total_fee": "14280.00",
      "paid_amount": "5000.00",
      "due_amount": "9280.00",
      "is_hostel_opted": false,
      "is_mess_opted": false,
      "extra_discount_amount": "0.00",
      "remark": ""
    }
  }
}
```

### Update Enrollment
**Endpoint:** `PUT /api/internal/student/enrollments/:enrollmentId`

**Request Payload:**
```json
{
  "status": "ongoing",
  "enrollment_date": "2025-01-01",
  "paid_amount": 5000,
  "payment_method": "upi",
  "remark": "Updated enrollment"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Enrollment updated successfully"
}
```

## User Flow

### Editing an Enrollment

1. **Navigate to Edit**
   - From Student List: Click edit icon → `/admin/students/edit/:enrollmentId`
   - From Student Detail: Click edit button → `/admin/students/edit/:enrollmentId`

2. **Form Loads**
   - Shows loading spinner
   - Fetches enrollment data from API
   - Populates all fields with existing data
   - Applies readonly states to student info fields

3. **User Makes Changes**
   - Can update: Status, Enrollment Date, Remarks
   - Can add: Additional Payment Amount, Payment Method
   - Cannot change: Student info, Course, Original fees

4. **Submit Changes**
   - Validates editable fields
   - Sends update request to API
   - Shows success message
   - Redirects to student detail page

## Validation in Edit Mode

### Fields Validated
- Enrollment Date (must be valid date)
- Additional Payment Amount (must be >= 0)
- Payment Method (required if payment amount > 0)

### Fields NOT Validated
- Student information (readonly, cannot be changed)
- Course selection (disabled, cannot be changed)
- Fee calculation (not editable in edit mode)

## Error Handling

### Loading Errors
- If enrollment data fails to load
- Shows error alert
- Redirects back to student list

### Update Errors
- If update fails
- Shows error alert
- Keeps user on form to retry
- Does not lose entered data

## Testing Checklist

- [ ] Edit button in student list navigates to edit form
- [ ] Edit button in student detail navigates to edit form
- [ ] Form loads with existing data
- [ ] Student info fields are readonly
- [ ] Course dropdown is disabled
- [ ] Status can be changed
- [ ] Enrollment date can be changed
- [ ] Additional payment can be added
- [ ] Payment method can be selected
- [ ] Remarks can be updated
- [ ] Fee summary shows correct values
- [ ] Documents section is hidden
- [ ] Submit button shows "Update Enrollment"
- [ ] Form submits successfully
- [ ] Redirects to student detail page
- [ ] Success message is displayed
- [ ] Updated data is reflected in student detail

## Notes

- Edit mode only allows updating enrollment-specific fields
- Student information cannot be changed after enrollment (by design)
- Course cannot be changed after enrollment (by design)
- Documents are managed separately via the Documents page
- Additional payments are added to existing paid amount
- Due amount is recalculated on the backend after payment
