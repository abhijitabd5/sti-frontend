# Students Module - UI Component Guide

## Enrollment Flow

### Step 1: Aadhaar Check Modal
1. Admin clicks "Enroll Student" button
2. Modal opens with Aadhaar input field
3. Admin enters 12-digit Aadhaar number
4. Admin clicks "Check Aadhaar" button
5. System checks if Aadhaar exists:
   - **If exists**: Navigate to enrollment form with pre-filled student data
   - **If new**: Navigate to enrollment form with empty fields

### Step 2: Enrollment Form
1. Student information section (pre-filled if existing, empty if new)
2. Select course and enrollment details
3. Fee calculation (auto-calculated based on course)
4. Upload documents (optional)
5. Add remarks (optional)
6. Click "Enroll Student" button
7. **Backend Process:**
   - First, create enrollment → receive `student_id` in response
   - Then, upload attached documents using the `student_id`
8. Progress modal shows enrollment status
9. Redirect to student list with success message

---

## API Endpoints

### Student Management
- `GET /internal/student/students` - Get all students (with filters)
- `GET /internal/student/students/:id` - Get student details
- `POST /internal/student/check-aadhar` - Check if Aadhaar exists
- `POST /internal/student/enroll` - Create new enrollment
- `PUT /internal/student/enrollments/:id` - Update enrollment
- `PATCH /internal/student/students/:id/toggle-login` - Toggle student login
- `DELETE /internal/student/students/:id` - Delete student
- `GET /internal/student/export` - Export students to Excel

### Documents
- `POST /internal/student/:studentId/documents` - Upload documents
- `DELETE /internal/student/documents/:id` - Delete document
- `PATCH /internal/student/documents/verify/:id` - Verify document

### Other
- `GET /internal/courses` - Get courses for dropdown
- `GET /internal/student/:studentId/:enrollmentId/payments` - Get payment history

---

## Student List Page (`/admin/students`)

### Page Header
- **Title**: "Student Management"
- **Subtitle**: "Manage students, enrollments, and documents"
- **Button**: "Enroll Student" (green gradient)

### Filters Section
- **Search Input**: Search by name, mobile, student ID
- **Date From**: Date picker (Created From)
- **Date To**: Date picker (To)
- **Buttons**: 
  - "Apply" (blue)
  - "Clear" (gray, shows when filters active)
  - "Export" (green)

### Records Per Page Dropdown
- Options: 10, 25, 50

### Students Table
**Columns:**
- Created At
- Student ID
- Name
- Mobile
- Fee Status
- Allow Login (toggle switch)
- Actions

**Action Buttons (per row):**
- View (eye icon)
- Edit (pencil icon)
- Attach Documents (document icon)
- Delete (trash icon)

### Pagination
- Previous button
- Page numbers (1, 2, 3...)
- Next button
- Results count display

### Modals

**Aadhaar Check Modal:**
- **Title**: "Check Aadhaar Number"
- **Input**: Aadhaar Number (12 digits, auto-formatted with spaces)
- **Info Box**: Explains what happens for existing vs new Aadhaar
- **Buttons**: 
  - "Check Aadhaar" (violet gradient)
  - "Cancel" (gray)

**Delete Confirmation Modal:**
- Confirms student deletion with student name and ID

---

## Student Enrollment Form (`/admin/students/enroll`)

### Page Header
- **Title**: "Enroll New Student" or "Enroll Existing Student"
- **Subtitle**: "Fill in the student information and course details for enrollment"

### Section 1: Student Information

**Fields:**
- Aadhaar Number (readonly)
- Student ID (readonly, if existing student)
- Name (required)
- Mobile (required)
- Father Name (required)
- Mother Name
- Date of Birth (required, date picker)
- Gender (required, dropdown: Male/Female/Other)
- Email
- Address (required, textarea)
- State (required, dropdown)
- City (required)
- Pincode (required)

### Section 2: Course Selection

**Fields:**
- Course (required, dropdown with price)
- Enrollment Date (required, date picker)
- Status (required, dropdown: Not Started/Ongoing/Completed/Aborted)

**Course Details Preview Box** (shows when course selected):
- Base Fee
- Discount percentage
- Hostel availability and fee
- Mess availability and fee

### Section 3: Fee Calculation

**Read-only Fields:**
- Base Course Fee
- Discount Percentage
- Discounted Course Fee

**Accommodation Options (checkboxes):**
- Hostel Opted (with fee amount)
- Mess Opted (with fee amount)

**Editable Field:**
- Extra Discount Amount (number input)

**Payment Summary:**
- Total Payable Fee (display)
- Paid Amount (number input)
- Due Amount (display)
- Payment Method (dropdown: Cash/Card/UPI/Bank Transfer)

### Section 4: Documents Upload

**Document Rows** (dynamic, can add multiple):
- Document Type (dropdown: Aadhaar Card/PAN Card/Passport Photo/SSC Certificate/HSC Certificate)
- Document File (file input, accepts JPG/PNG/PDF)
- Add More button (enabled when type and file selected)

### Section 5: Remarks
- Remarks/Notes (textarea)

### Form Actions
- **Cancel** button (gray)
- **Enroll Student** button (green gradient)

### Modals
- **Progress Modal**: Shows during enrollment process

---

## Notes
- All required fields marked with red asterisk (*)
- Readonly fields have gray background
- Disabled elements have reduced opacity
- Toggle switches for boolean values
- Color coding: Green (success/paid), Yellow (due), Red (overdue/delete)
