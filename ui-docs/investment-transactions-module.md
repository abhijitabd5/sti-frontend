# Investment Transactions Module - UI Component Guide

## Investment Transaction Flow

### Creating an Investment Transaction
1. Admin navigates to Investment Transactions page
2. Clicks "Add Investment" button
3. Fills transaction form with required fields
4. Optionally expands form to add more details
5. Optionally attaches file (invoice/receipt/proof)
6. Clicks "Create Transaction" button
7. System creates investment transaction and redirects to list

### Editing an Investment Transaction
1. Admin clicks Edit icon on transaction row
2. Form opens with pre-filled data
3. Admin modifies fields as needed
4. Clicks "Update Transaction" button
5. System updates transaction and redirects to list

### Viewing an Investment Transaction
1. Admin clicks View icon on transaction row
2. View page displays all transaction details
3. Admin can Edit or Delete from view page

---

## API Endpoints

### Investment Transaction Management
- `GET /internal/transactions` - Get all investment transactions (with type=investment filter)
- `GET /internal/transactions/view/:id` - Get investment transaction details
- `POST /internal/transactions/create` - Create new investment transaction
- `PUT /internal/transactions/edit/:id` - Update investment transaction
- `DELETE /internal/transactions/delete/:id` - Delete investment transaction
- `GET /internal/transactions/export` - Export investment transactions to Excel

### Categories
- `GET /internal/transaction-categories` - Get investment categories (with type=investment filter)

---

## Investment Transactions List Page (`/admin/investments`)

### Page Header
- **Title**: "Investment Transactions"
- **Subtitle**: "Manage investment transactions"
- **Button**: "Add Investment" (blue-indigo-purple gradient)

### Filters Section
- **Search Input**: Search transactions
- **Category Dropdown**: Filter by investment category
- **Date From**: Date picker
- **Date To**: Date picker
- **Payment Mode Dropdown**: Cash/UPI/Net Banking/Cheque/Bank Transfer/Card/Payment Gateway
- **Buttons**:
  - "Apply" (blue)
  - "Clear" (gray, shows when filters active)
  - "Export" (green)

### Investment Transactions Table

**Columns:**
- Transaction Date
- Category
- Amount
- Payment Mode
- Receiver Name
- Description
- Actions

**Action Buttons (per row):**
- View (eye icon)
- Edit (pencil icon)
- Delete (trash icon)

### Pagination
- Previous button
- Page numbers (1, 2, 3...)
- Next button
- Results count display

### Modals
- **Delete Confirmation Modal**: Confirms investment transaction deletion

---

## Add/Edit Investment Transaction Form (`/admin/transactions/create?type=investment` or `/admin/transactions/edit/:id`)

### Page Header
- **Title**: "Add Investment Transaction" / "Edit Investment Transaction"
- **Subtitle**: "Create a new investment transaction record" (or Update)
- **Back Button**: Arrow icon to return to list
- **Toggle Button**: "Show More" / "Show Less" (expands/collapses optional fields)

### Section 1: Transaction Details (Always Visible)

**Required Fields:**
- Category (dropdown - investment categories)
- Amount (₹) (number input)
- Transaction Date (date picker)
- Payment Mode (dropdown: Cash/UPI/Net Banking/Cheque/Bank Transfer/Card/Payment Gateway)
- Receiver Name (text input)

**Optional Fields (shown when expanded):**
- Payment Reference Number (text input)
- Payment Reference Type (dropdown: Invoice/Receipt/Proof, required if reference number provided)

### Section 2: Receiver Details (Only shown when expanded)

**Fields:**
- Contact (text input)
- Bank Name (text input)
- Account Number (text input)
- UPI ID (text input)

### Section 3: Additional Information (Only shown when expanded)

**Fields:**
- Attachment (file input, accepts PDF/JPG/PNG)
  - Choose File button
  - Selected file name display with remove button
  - Attachment Type (dropdown: Invoice/Receipt/Proof, required if file attached)
- Description (textarea)
- Reference Note (textarea)

### Form Actions
- **Cancel** button (gray)
- **Create Transaction** / **Update Transaction** button (green gradient)

---

## View Investment Transaction Page (`/admin/transactions/:id`)

### Page Header
- **Title**: "Income/Expense/Investment Transaction Details"
- **Subtitle**: "Transaction ID: #[id]"
- **Back Button**: Arrow icon to return to list
- **Action Buttons**:
  - "Edit" (green gradient)
  - "Delete" (red)

### Main Content (Left Column - 2/3 width)

#### Transaction Information Card
**Fields Displayed:**
- Transaction Date (with calendar icon)
- Amount (with currency icon, color-coded: green for income, red for expense/investment)
- Category (with document icon)
- Payment Mode (with card icon, badge style)
- Payment Reference (if available)
- Created By (user name)

#### Person Details Card
**Fields Displayed:**
- Name (with user icon)
- Contact (with phone icon, if available)
- Bank Name (with building icon, if available)
- Account Number (if available)
- UPI ID (if available)

#### Notes Card (if available)
**Fields Displayed:**
- Description
- Reference Note

### Sidebar (Right Column - 1/3 width)

#### Summary Card
**Fields Displayed:**
- Type (Income/Expense/Investment, color-coded)
- Amount (color-coded)
- Date
- Payment Mode (badge style)

#### Attachment Card (if available)
**Fields Displayed:**
- File name with paperclip icon
- Download button

#### Timestamps Card
**Fields Displayed:**
- Created (date and time)
- Last Updated (date and time)

---

## Field Behavior

### Show More/Show Less Toggle
- Default state: Collapsed (only required fields visible)
- Expanded state: All optional fields visible
- Toggle button in page header

### Conditional Fields
- **Payment Reference Type**: Only shown when Payment Reference Number has value
- **Attachment Type**: Only shown when file is attached

### File Upload
- Supported formats: PDF, JPG, JPEG, PNG
- Shows selected filename with remove option
- Must select attachment type when file is attached

### View Page
- All fields displayed in read-only format
- Empty fields are hidden (not shown if no data)
- Color coding for transaction type and amount
- Icons for visual clarity

---

## Notes
- All required fields marked with red asterisk (*)
- Form uses multipart/form-data for file uploads
- Validation errors shown below respective fields
- Loading states shown during form submission
- Success/error messages shown via toast notifications
- Investment transactions use "Receiver" terminology (similar to expense)
- Color scheme: Blue-indigo-purple gradient for investment-specific actions
