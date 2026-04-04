# Earth Movers Training Academy - Flutter Developer Guide

## Project Overview

Training management platform for heavy equipment operator certification.

**Portals**: Public Website, Student Portal, Admin Portal  
**Tech**: React 19, Vite 7, Tailwind CSS 4, Axios  
**Roles**: super_admin/admin/account/instructor → admin dashboard | student → student dashboard

---

## Authentication

### Login Flow
1. User enters mobile/email + password
2. POST `/auth/login` → returns `{ tokens: { access_token, refresh_token }, user, redirect_url }`
3. Store: access_token, refresh_token, user JSON, tokenExpiration (7 days)
4. Navigate to role-based dashboard

### Session Check
On app launch: validate token exists, user exists, tokenExpiration valid, user has first_name/last_name. If invalid, clear all.

### Critical Rule
Always update BOTH storage AND state after auth. Direct API calls without state update cause stale UI.

---

## Admin Portal Pages

### 1. Dashboard (`/admin/dashboard`)

**Layout**: 6 stat cards + 4 charts

**Components**:
- Stats Cards: Total Certificates, Valid, Revoked, Expired, Delivered, Pending
- Income vs Expenses Bar Chart (monthly comparison)
- Students per State Chart (geographical distribution)
- Students per Course Chart (enrollment by course)
- Social Traffic Chart (referral sources)
- Income/Expenses by Category (pie charts)

---

### 2. Courses (`/admin/courses`)

**Table Columns**:
- Display Order (number)
- Title (with language flag)
- Students Enrolled (count)
- Status (toggle switch: active/inactive)
- Actions (View, Edit, Drag Handle, Add Language)

**Features**:
- Drag & drop rows to reorder (changes display_order)
- "Save Order" button appears when order changed
- Toggle switch for active/inactive (green/gray)
- "Create Course" button (top right)

**Create/Edit Flow**:
1. Form fields: title, slug, description, short_description, duration, duration_type, price, discount_price, language
2. File uploads: thumbnail (image), syllabus (PDF)
3. Submit → multipart/form-data POST/PUT
4. Redirect to list with success message

**Add Language Variant**:
- Uses course_group_id to link variants
- Same form as create but linked to existing course group

**API**: GET `/internal/courses`, POST `/internal/courses/create`, PUT `/internal/courses/update/:id`, PATCH `/internal/courses/toggle-status/:id`, PUT `/internal/courses/reorder`

---

### 3. Students (`/admin/students`)

**Filters** (top bar):
- Search (name, mobile, student ID)
- Created From (date)
- Created To (date)
- Apply/Clear buttons
- Export button (downloads Excel with applied filters)

**Table Columns**:
- Created At (date)
- Student ID (clickable, opens detail)
- Name (with avatar icon)
- Mobile
- Fee Status (badge: paid/due/overdue with color coding)
- Allow Login (toggle switch)
- Actions (View, Edit, Attach Documents, Delete)

**Pagination**:
- Records per page dropdown (10/25/50)
- Previous/Next buttons
- Page numbers (max 5 visible)
- Shows "X to Y of Z results"

**Enroll Student Flow**:
1. Click "Enroll Student" → Opens Aadhaar Check Modal
2. Enter Aadhaar number → checks if exists
3. If new → redirect to enrollment form
4. Form: personal details, course selection, payment info
5. Submit → creates student + enrollment record
6. Redirect to list with success message

**Toggle Login**:
- Switch enables/disables student portal access
- Updates `login_enabled` field
- Shows loading state on switch during API call

**API**: GET `/internal/students`, POST `/internal/students/create`, PUT `/internal/students/update/:id`, DELETE `/internal/students/delete/:id`, GET `/internal/students/export`

---

### 4. Transactions (`/admin/transactions`)

**Three Tabs**: Income, Expense, Investment (separate pages with same layout)

**Filters**:
- Search (reference number, description)
- Category dropdown (loaded from categories API)
- Date From/To
- Payment Mode (cash/bank/upi/card/cheque)
- Apply/Clear/Export buttons

**Table Columns**:
- Date
- Category
- Description
- Amount (₹ formatted)
- Payment Mode
- Reference Number
- Actions (View, Edit, Delete)

**Create Transaction Flow**:
1. Click "Add Income/Expense/Investment"
2. Form: type (auto-filled), category, amount, payment_mode, reference_number, description, transaction_date, student_id (optional), course_id (optional)
3. Submit → POST `/internal/transactions/create`
4. Redirect with success message

**API**: GET `/internal/transactions?type=income`, POST `/internal/transactions/create`, PUT `/internal/transactions/update/:id`, DELETE `/internal/transactions/delete/:id`

---

### 5. Certificates (`/admin/certificates`)

**Stats Cards** (top row):
- Total, Valid, Revoked, Expired, Delivered, Pending (with icons and counts)

**Filters**:
- Search (certificate number, student code)
- Status dropdown (all/valid/revoked/expired)
- Delivery Status (all/delivered/pending)

**Table Columns**:
- Certificate # (with status icon, verification count below)
- Student (name + student code)
- Course (title + duration)
- Issue Date
- Status (badge: valid/revoked/expired)
- Delivery (checkmark or clock icon)
- Actions (Download PDF, Regenerate, Revoke/Restore, Mark Delivered)

**Issue Certificate Flow**:
1. Navigate to `/admin/certificate/issue`
2. Select student, course, template
3. System generates: certificate_number, QR code, PDF
4. Certificate saved with status "valid"
5. Student can download from portal

**Regenerate Flow**:
1. Click regenerate → opens modal
2. Confirm → regenerates PDF with same data
3. Updates PDF URL, keeps certificate number

**Revoke/Restore**:
- Revoke: changes status to "revoked", shows confirmation
- Restore: changes status back to "valid"

**Mark Delivered**:
- Updates `hard_copy_delivered` to true
- Shows truck icon instead of clock

**API**: GET `/internal/certificates`, POST `/internal/certificates/issue`, POST `/internal/certificates/regenerate/:id`, PATCH `/internal/certificates/revoke/:id`, PATCH `/internal/certificates/restore/:id`, PATCH `/internal/certificates/mark-delivered/:id`, GET `/internal/certificates/download/:id`

---

### 6. Certificate Templates (`/admin/certificate-templates`)

**Table**: Template name, Language, Preview thumbnail, Active status, Actions (Edit, Delete)

**Create/Edit**:
- Upload background image
- Define text fields: position (x, y), font size, color
- Fields: student name, course name, certificate number, issue date, QR code position
- Preview before save

**API**: GET `/internal/certificate-templates`, POST `/internal/certificate-templates/create`, PUT `/internal/certificate-templates/update/:id`

---

### 7. Gallery (`/admin/gallery`)

**Grid View**: Thumbnails with title overlay

**Features**:
- Upload images/videos (drag & drop or file picker)
- Edit: title, description, category
- Toggle active/inactive
- Drag to reorder
- Delete with confirmation

**API**: GET `/internal/gallery`, POST `/internal/gallery/upload`, PUT `/internal/gallery/update/:id`, DELETE `/internal/gallery/delete/:id`, PUT `/internal/gallery/reorder`

---

### 8. Reviews (`/admin/reviews`)

**Table Columns**:
- Student Name
- Course
- Rating (stars)
- Review Text (truncated)
- Status (pending/approved/rejected)
- Featured (checkbox)
- Actions (Approve, Reject, Edit, Delete)

**Approve Flow**: Changes status to "approved", shows on public website

**API**: GET `/internal/reviews`, PATCH `/internal/reviews/approve/:id`, PATCH `/internal/reviews/reject/:id`, PUT `/internal/reviews/update/:id`

---

### 9. Enquiries (`/admin/enquiries`)

**Table Columns**:
- Date
- Name
- Mobile
- Email
- Course Interested
- Status (pending/contacted/enrolled/not_interested)
- Actions (View, Update Status, Add Notes, Delete)

**Update Status Flow**:
1. Click status → dropdown appears
2. Select new status
3. Add notes (optional)
4. Save → updates enquiry

**API**: GET `/internal/enquiries`, PUT `/internal/enquiries/update/:id`, DELETE `/internal/enquiries/delete/:id`

---

### 10. Promotion (`/admin/promotion`)

**Sub-pages**: Partners, Posts, Links, Analytics

**Partners**: Logo, name, URL, active status  
**Posts**: Title, content (rich text), image, publish date  
**Links**: Title, URL, icon, display order  
**Analytics**: Click counts, engagement metrics (charts)

**API**: GET/POST/PUT/DELETE for each sub-module under `/internal/promotion/*`

---

### 11. Transaction Categories (`/admin/transaction-categories`)

**Table**: Category name, Type (income/expense/investment), Active status, Actions

**Create**: Name, type, description → POST `/internal/transaction-categories/create`

---

### 12. CMS (`/admin/cms`)

**Pages**: About Us, Terms, Privacy Policy, Contact Info

**Edit Flow**: Rich text editor (TinyMCE) → Save → Updates page content

**API**: GET `/internal/cms/pages/:slug`, PUT `/internal/cms/pages/update/:slug`

---

### 13. Reports (`/admin/reports`)

**Report Types**:
- Student Enrollment (date range, course filter)
- Revenue (daily/monthly/yearly breakdown)
- Course Performance (enrollment trends)
- Payment Collection (pending/completed)

**Export**: Excel/PDF download with filters applied

**API**: GET `/internal/reports/students`, GET `/internal/reports/revenue`, GET `/internal/reports/export`

---

### 14. Settings (`/admin/settings`)

**Sections**: General, Email, SMS, Payment Gateway, Certificates

**Form**: Key-value pairs → Save → PUT `/internal/settings/update`

---

### 15. Profile (`/admin/profile`)

**Tabs**: Personal Info, Change Password

**Personal Info**: Name, email, mobile, profile picture upload  
**Change Password**: Current password, new password, confirm

**API**: GET `/internal/profile`, PUT `/internal/profile/update`, POST `/internal/profile/change-password`

---

## Student Portal Pages

### 1. Dashboard (`/student/dashboard`)
- Enrolled courses cards (progress bars)
- Payment status summary
- Certificate status
- Recent notifications

### 2. Profile (`/student/profile`)
- View/edit personal details
- Upload documents (Aadhar, photo, signature)
- Change password

### 3. My Courses (`/student/courses`)
- Course cards with progress
- Access materials button
- Attendance records

### 4. Payments (`/student/payments`)
- Table: Date, Amount, Status, Receipt download
- Pending payments highlighted

### 5. Certificates (`/student/certificates`)
- Certificate cards with download button
- QR code for verification
- Share options

**API**: GET `/student/dashboard`, GET `/student/profile`, PUT `/student/profile/update`, GET `/student/courses`, GET `/student/payments`, GET `/student/certificates`

---

## Public Website Pages

### 1. Home (`/`)
Hero section, featured courses grid, stats, testimonials carousel, CTA buttons

### 2. Courses (`/courses`)
Course cards grid, filters (price, duration), course detail page with enquiry form

### 3. Gallery (`/gallery`)
Image/video grid with lightbox, filter by category

### 4. Contact (`/contact`)
Form (name, email, mobile, message), location map, contact details

**API**: GET `/public/courses`, GET `/public/courses/:slug`, POST `/public/enquiries/submit`, GET `/public/gallery`, POST `/public/contact/submit`, GET `/public/reviews`

---

## Key Functional Flows

### Student Enrollment
1. Public user submits enquiry form
2. Admin sees enquiry in Enquiries page
3. Admin clicks "Enroll Student" → checks Aadhaar
4. Fills enrollment form (personal + course + payment)
5. Student receives login credentials
6. Student logs in, sees enrolled course

### Certificate Issuance
1. Admin navigates to Certificates → Issue Certificate
2. Selects student, course, template
3. System generates certificate number, QR code, PDF
4. Certificate appears in student portal
5. Student downloads PDF

### Payment Recording
1. Admin creates transaction (type: income)
2. Links to student and course
3. Student's fee status updates
4. Payment appears in student's payment history
5. Receipt available for download

---

## API Response Format

All responses:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasPrev": false,
    "hasNext": true
  }
}
```

Errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email is required"]
  }
}
```

---

## Flutter Implementation Notes

### State Management
Use Provider/Riverpod for: AuthState, CourseState, StudentState, TransactionState

### Pagination
Implement infinite scroll or load more button with page tracking

### File Uploads
Use multipart/form-data with dio package

### Filters
Store filter state locally, apply on API call, show active filter count

### Toggle Switches
Show loading indicator during API call, optimistic update with rollback on error

### Tables
Use DataTable or custom ListView with pagination controls

### Modals
Use showDialog for confirmations, showModalBottomSheet for forms

### Export
Download file, save to device, show success notification

### Dark Mode
Match Tailwind dark: variants, toggle via ThemeProvider

---

**Document Version**: 2.0  
**Last Updated**: March 2024
