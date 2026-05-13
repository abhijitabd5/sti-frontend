# Enquiries Module - UI Component Guide

## Enquiry Flow

### Managing Enquiries
1. Admin navigates to Enquiries page (All/Online/Offline)
2. Views list of enquiries with status badges
3. Can filter by status (All/Unread/Read/Discard)
4. Can perform quick actions:
   - Mark as Read (for unread enquiries)
   - Discard (for non-discarded enquiries)
   - View details
   - Take Action (add action type and remark)
   - Delete enquiry

### Creating Offline Enquiry
1. Admin navigates to Offline Enquiries page
2. Clicks "Add New Enquiry" button
3. Fills form with customer details
4. Selects course (optional)
5. Adds message (optional)
6. Clicks "Create" button
7. System creates enquiry and refreshes list

---

## API Endpoints

### Enquiry Management
- `GET /internal/enquiry` - Get all enquiries (with filters)
- `GET /internal/enquiry/status/:status` - Get enquiries by status
- `GET /internal/enquiry/source/:source` - Get enquiries by source
- `GET /internal/enquiry/search` - Search enquiries
- `PATCH /internal/enquiry/update-status/:id` - Update enquiry status
- `PATCH /internal/enquiry/update-action/:id` - Take action on enquiry
- `DELETE /internal/enquiry/delete/:id` - Delete enquiry
- `POST /internal/enquiry/create` - Create offline enquiry

---

## All Enquiries Page (`/admin/enquiries`)

### Page Header
- **Title**: "Enquiry Management"
- **Subtitle**: "View and manage all customer enquiries"

### Filters Section
- **Status Filter Dropdown**: All Enquiries/Unread/Read/Discard
- **Records Per Page Dropdown**: 10/20/30

### Enquiries Table

**Columns:**
- Name
- Mobile
- Course Name
- Status (badge)
- Actions

**Action Buttons (per row):**
- Mark as Read (check icon, only for unread)
- Discard (X icon, only for non-discarded)
- View (eye icon)
- Take Action (plus icon)
- Delete (trash icon)

### Pagination
- Previous button
- Page numbers (1, 2, 3...)
- Next button
- Results count display

### Modals
- **View Enquiry Modal**: Shows full enquiry details
- **Take Action Modal**: Add action type and remark
- **Delete Confirmation Modal**: Confirms enquiry deletion

---

## Online Enquiries Page (`/admin/enquiries/online`)

### Page Header
- **Title**: "Online Enquiries"
- **Subtitle**: "View and manage enquiries from website visitors"

### Tabs
- **Course Enquiries** (from course pages)
- **Contact Us Enquiries** (from contact form)

### Filters Section
- **Status Filter Dropdown**: All Enquiries/Unread/Read/Discard
- **Records Per Page Dropdown**: 10/20/30

### Enquiries Table

**Columns (Course Enquiries):**
- Name
- Mobile
- Course Name
- Status (badge)
- Actions

**Columns (Contact Us Enquiries):**
- Name
- Mobile
- Message (truncated with tooltip)
- Status (badge)
- Actions

**Action Buttons (per row - 2 rows):**

Row 1:
- Mark Read (button, only for unread)
- View (button)
- Take Action (button)

Row 2:
- Discard (button, only for non-discarded)
- Delete (button)

### Pagination
- Previous button
- Next button
- Page indicator (Page X of Y)

### Modals
- **View Enquiry Modal**: Shows full enquiry details
- **Take Action Modal**: Add action type and remark
- **Delete Confirmation Modal**: Confirms enquiry deletion

---

## Offline Enquiries Page (`/admin/enquiries/offline`)

### Page Header
- **Title**: "Offline Enquiries"
- **Subtitle**: "Manage walk-in, phone call, and manually created enquiries"
- **Button**: "Add New Enquiry" (violet)

### Filters Section
- **Status Filter Dropdown**: All Enquiries/Unread/Read/Discard
- **Records Per Page Dropdown**: 10/20/30

### Enquiries Table

**Columns:**
- Name
- Mobile
- Course Name
- Status (badge)
- Actions

**Action Buttons (per row - 2 rows):**

Row 1:
- Mark Read (button, only for unread)
- View (button)
- Take Action (button)

Row 2:
- Discard (button, only for non-discarded)
- Delete (button)

### Pagination
- Previous button
- Page numbers (1, 2, 3...)
- Next button
- Results count display

### Modals
- **Create Offline Enquiry Modal**: Form to create new enquiry
- **View Enquiry Modal**: Shows full enquiry details
- **Take Action Modal**: Add action type and remark
- **Delete Confirmation Modal**: Confirms enquiry deletion

---

## Modals

### View Enquiry Modal

**Fields Displayed:**
- Name
- Mobile
- Email (if available)
- Course Name (if available)
- Message (if available)
- Enquiry Type (Online/Offline)
- Status
- Created Date
- Action Type (if taken)
- Action Remark (if available)

### Take Action Modal

**Fields:**
- Action Type (dropdown: Called/Emailed/Visited/Enrolled/Other)
- Remark (textarea)

**Buttons:**
- Cancel (gray)
- Submit (violet)

### Create Offline Enquiry Modal

**Fields:**
- Name (required)
- Mobile (required)
- Email (optional)
- Course (dropdown, optional)
- Message (textarea, optional)

**Buttons:**
- Cancel (gray)
- Create Enquiry (violet)

---

## Status Badge Colors

- **Unread**: Yellow background
- **Read**: Blue background
- **Discard**: Red background

---

## Action Button Styles

### All Enquiries Page (Icon-based)
- Small icon buttons with hover colors
- Tooltips on hover

### Online/Offline Enquiries Pages (Text-based)
- Colored text buttons with background
- Two rows of actions per enquiry
- Conditional visibility based on status

---

## Notes
- Enquiries are categorized by type: Course, Contact Us, Offline
- Status can be: Unread, Read, Discard
- Actions are tracked with type and remark
- Offline enquiries can be manually created by admin
- All enquiry types share the same status management
- Color coding: Yellow (unread), Blue (read), Red (discard)
- Button styles vary between pages (icons vs text buttons)
