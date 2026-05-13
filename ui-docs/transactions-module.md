# Transactions Module - UI Component Guide

## Transaction Flow

### Creating a Transaction
1. Admin navigates to Transactions page
2. Selects tab (Income/Expense)
3. Clicks "Add Income" or "Add Expense" button
4. Fills transaction form with required fields
5. Optionally expands form to add more details
6. Optionally attaches file (invoice/receipt/proof)
7. Clicks "Create Transaction" button
8. System creates transaction and redirects to list

### Editing a Transaction
1. Admin clicks Edit icon on transaction row
2. Form opens with pre-filled data
3. Admin modifies fields as needed
4. Clicks "Update Transaction" button
5. System updates transaction and redirects to list

---

## API Endpoints

### Transaction Management
- `GET /internal/transactions` - Get all transactions (with filters)
- `GET /internal/transactions/view/:id` - Get transaction details
- `POST /internal/transactions/create` - Create new transaction
- `PUT /internal/transactions/edit/:id` - Update transaction
- `DELETE /internal/transactions/delete/:id` - Delete transaction
- `GET /internal/transactions/export` - Export transactions to Excel

### Analytics
- `GET /internal/transactions/category-wise-by-type` - Get category-wise breakdown
- `GET /internal/transactions/income-vs-expense` - Get income vs expense data

### Categories
- `GET /internal/transaction-categories` - Get transaction categories

---

## Transactions List Page (`/admin/transactions`)

### Page Header
- **Title**: "Transactions"
- **Subtitle**: "Manage income and expense transactions"
- **Button**: "Add Income" or "Add Expense" (green gradient, changes based on active tab)

### Tabs
- **Income Transactions** (with count badge)
- **Expense Transactions** (with count badge)
- **Deleted** (with count badge)

### Filters Section
- **Search Input**: Search transactions
- **Category Dropdown**: Filter by category
- **Date From**: Date picker
- **Date To**: Date picker
- **Payment Mode Dropdown**: Cash/UPI/Net Banking/Cheque/Bank Transfer/Card/Payment Gateway
- **Buttons**:
  - "Apply" (blue)
  - "Clear" (gray, shows when filters active)
  - "Export" (green, not shown on Deleted tab)

### Transactions Table

**Columns:**
- Transaction Date
- Category
- Amount
- Payment Mode
- Payer/Receiver Name
- Description
- Actions

**Action Buttons (per row):**
- View (eye icon)
- Edit (pencil icon, not shown on Deleted tab)
- Delete (trash icon, not shown on Deleted tab)
- Restore (arrow icon, only on Deleted tab)

### Pagination
- Previous button
- Page numbers (1, 2, 3...)
- Next button
- Results count display

### Modals
- **Delete Confirmation Modal**: Confirms transaction deletion
- **View Transaction Modal**: Shows transaction details (on Deleted tab)

---

## Add/Edit Transaction Form (`/admin/transactions/create` or `/admin/transactions/edit/:id`)

### Page Header
- **Title**: "Add Income Transaction" / "Edit Income Transaction" (or Expense)
- **Subtitle**: "Create a new income transaction record" (or Update)
- **Back Button**: Arrow icon to return to list
- **Toggle Button**: "Show More" / "Show Less" (expands/collapses optional fields)

### Section 1: Transaction Details (Always Visible)

**Required Fields:**
- Category (dropdown)
- Amount (₹) (number input)
- Transaction Date (date picker)
- Payment Mode (dropdown: Cash/UPI/Net Banking/Cheque/Bank Transfer/Card/Payment Gateway)
- Payer Name (for income) or Receiver Name (for expense) (text input)

**Optional Fields (shown when expanded):**
- Payment Reference Number (text input)
- Payment Reference Type (dropdown: Invoice/Receipt/Proof, required if reference number provided)

### Section 2: Person Details (Only shown when expanded)

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

## Field Behavior

### Show More/Show Less Toggle
- Default state: Collapsed (only required fields visible)
- Expanded state: All optional fields visible
- Toggle button in page header

### Conditional Fields
- **Payment Reference Type**: Only shown when Payment Reference Number has value
- **Attachment Type**: Only shown when file is attached

### Dynamic Labels
- **Income transactions**: "Payer Name", "Payer Details"
- **Expense transactions**: "Receiver Name", "Receiver Details"

### File Upload
- Supported formats: PDF, JPG, JPEG, PNG
- Shows selected filename with remove option
- Must select attachment type when file is attached

---

## Notes
- All required fields marked with red asterisk (*)
- Form uses multipart/form-data for file uploads
- Validation errors shown below respective fields
- Loading states shown during form submission
- Success/error messages shown via toast notifications
- Color coding: Green (income), Red (expense), Gray (deleted)
