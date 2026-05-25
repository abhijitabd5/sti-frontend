# Transactions API Documentation

## Overview
All transaction endpoints require authentication and are restricted to `super_admin` and `admin` roles.

Base Path: `/api/internal/transactions`

---

## 1. Get All Transactions

**Method:** GET  
**Endpoint:** `/api/internal/transactions`

**Query Parameters:**
- `search` (optional): Search term for filtering transactions
- `categoryId` (optional): Filter by transaction category ID
- `type` (optional): Filter by type - `income`, `expense`, or `investment`
- `paymentMode` (optional): Filter by payment mode - `cash`, `cheque`, `upi`, `bank_transfer`, `card`, `net_banking`, `payment_gateway`
- `dateFrom` (optional): Start date filter (YYYY-MM-DD format)
- `dateTo` (optional): End date filter (YYYY-MM-DD format)
- `amountMin` (optional): Minimum amount filter
- `amountMax` (optional): Maximum amount filter
- `includeDeleted` (optional): Include soft-deleted records - `true` or `false`
- `deletedOnly` (optional): Show only deleted records - `true` or `false`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field (default: `transaction_date`)
- `sortOrder` (optional): Sort order - `ASC` or `DESC` (default: `DESC`)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 8,
            "type": "income",
            "amount": "2000.00",
            "transaction_date": "2025-09-26",
            "payment_mode": "upi",
            "description": "Additional payment for Excavator Training - Beginner",
            "payment_ref_num": null,
            "payment_ref_type": "other",
            "payer_name": "Saiffuddin Sheikh",
            "payer_contact": "9834892082",
            "payer_bank_name": null,
            "payer_account_number": null,
            "payer_upi_id": null,
            "payee_name": null,
            "payee_contact": null,
            "payee_bank_name": null,
            "payee_account_number": null,
            "payee_upi_id": null,
            "attachment_path": null,
            "attachment_type": "other",
            "reference_note": null,
            "expense_for_user": null,
            "category_id": 1,
            "category": {
                "id": 1,
                "name": "Course Fee",
                "slug": "course-fee"
            },
            "creator": {
                "id": 1,
                "first_name": "Abhijit",
                "last_name": "Abd",
                "role": "super_admin"
            },
            "expenseForUser": null,
            "createdAt": "2025-09-26T07:39:04.000Z",
            "updatedAt": "2025-09-26T07:39:04.000Z",
            "deletedAt": null
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 7,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    },
    "timestamp": "2025-10-04T18:31:46.549Z"
}
```

**Error Response (500):**
```json
{
    "success": false,
    "message": "Error message",
    "timestamp": "2025-10-04T18:31:46.549Z"
}
```

---

## 2. Get Transaction by ID

**Method:** GET  
**Endpoint:** `/api/internal/transactions/view/:id`

**URL Parameters:**
- `id` (required): Transaction ID

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "id": 8,
        "type": "income",
        "amount": "2000.00",
        "transaction_date": "2025-09-26",
        "payment_mode": "upi",
        "description": "Additional payment for Excavator Training - Beginner",
        "payment_ref_num": null,
        "payment_ref_type": "other",
        "payer_name": "Saiffuddin Sheikh",
        "payer_contact": "9834892082",
        "payer_bank_name": null,
        "payer_account_number": null,
        "payer_upi_id": null,
        "payee_name": null,
        "payee_contact": null,
        "payee_bank_name": null,
        "payee_account_number": null,
        "payee_upi_id": null,
        "attachment_path": null,
        "attachment_type": "other",
        "reference_note": null,
        "created_by": 1,
        "expense_for_user": null,
        "category_id": 1,
        "category": {
            "id": 1,
            "name": "Course Fee",
            "slug": "course-fee"
        },
        "creator": {
            "id": 1,
            "first_name": "Abhijit",
            "last_name": "Abd",
            "role": "super_admin",
            "mobile": "9175113022"
        },
        "expenseForUser": null,
        "createdAt": "2025-09-26T07:39:04.000Z",
        "updatedAt": "2025-09-26T07:39:04.000Z"
    },
    "timestamp": "2025-10-04T18:50:51.723Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Not found",
    "timestamp": "2025-10-04T18:50:51.723Z"
}
```

---

## 3. Create Transaction

**Method:** POST  
**Endpoint:** `/api/internal/transactions/create`  
**Content-Type:** multipart/form-data

**Request Payload (Form Data):**

**Mandatory Fields:**
- `type` (required): Transaction type - `income`, `expense`, or `investment`
- `category_id` (required): Transaction category ID (integer)
- `amount` (required): Transaction amount (decimal, must be > 0)
- `transaction_date` (required): Transaction date in YYYY-MM-DD format
- `payment_mode` (required): Payment mode - `cash`, `cheque`, `upi`, `bank_transfer`, `card`, `net_banking`, `payment_gateway`

**Optional Fields:**
- `description`: Transaction description (string)
- `payment_ref_num`: Payment reference number (string)
- `payment_ref_type`: Payment reference type - `receipt`, `transaction`, `cheque`, `invoice`, `other`
- `payer_name`: Payer name (string)
- `payer_contact`: Payer contact number (string)
- `payer_bank_name`: Payer bank name (string)
- `payer_account_number`: Payer account number (string)
- `payer_upi_id`: Payer UPI ID (string)
- `payee_name`: Payee name (string)
- `payee_contact`: Payee contact number (string)
- `payee_bank_name`: Payee bank name (string)
- `payee_account_number`: Payee account number (string)
- `payee_upi_id`: Payee UPI ID (string)
- `reference_note`: Additional reference notes (string)
- `expense_for_user`: User ID for expense tracking (integer)
- `attachment`: File attachment (file upload)
- `attachment_type`: Attachment type - `invoice`, `receipt`, `proof`, `other` (required if attachment is provided)

**Success Response (201):**
```json
{
    "success": true,
    "message": "Created successfully",
    "data": {
        "id": 13,
        "type": "income",
        "amount": "5000.00",
        "transaction_date": "2025-10-04",
        "payment_mode": "upi",
        "description": "Course fee payment",
        "category": {
            "id": 1,
            "name": "Course Fee",
            "slug": "course-fee"
        },
        "creator": {
            "id": 1,
            "first_name": "Abhijit",
            "last_name": "Abd",
            "role": "super_admin",
            "mobile": "9175113022"
        },
        "expenseForUser": null
    },
    "timestamp": "2025-10-04T20:11:18.750Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "type": "Valid transaction type (income/expense) is required",
        "category_id": "Valid transaction category is required",
        "amount": "Valid amount greater than 0 is required",
        "transaction_date": "Transaction date must be in YYYY-MM-DD format",
        "payment_mode": "Invalid payment mode"
    },
    "timestamp": "2025-10-04T20:11:18.750Z"
}
```

---

## 4. Update Transaction

**Method:** PUT  
**Endpoint:** `/api/internal/transactions/edit/:id`  
**Content-Type:** multipart/form-data

**URL Parameters:**
- `id` (required): Transaction ID

**Request Payload (Form Data):**
All fields are optional. Only include fields you want to update.

- `type`: Transaction type - `income`, `expense`, or `investment`
- `category_id`: Transaction category ID (integer)
- `amount`: Transaction amount (decimal, must be > 0)
- `transaction_date`: Transaction date in YYYY-MM-DD format
- `payment_mode`: Payment mode - `cash`, `cheque`, `upi`, `bank_transfer`, `card`, `net_banking`, `payment_gateway`
- `description`: Transaction description (string)
- `payment_ref_num`: Payment reference number (string)
- `payment_ref_type`: Payment reference type - `receipt`, `transaction`, `cheque`, `invoice`, `other`
- `payer_name`: Payer name (string)
- `payer_contact`: Payer contact number (string)
- `payer_bank_name`: Payer bank name (string)
- `payer_account_number`: Payer account number (string)
- `payer_upi_id`: Payer UPI ID (string)
- `payee_name`: Payee name (string)
- `payee_contact`: Payee contact number (string)
- `payee_bank_name`: Payee bank name (string)
- `payee_account_number`: Payee account number (string)
- `payee_upi_id`: Payee UPI ID (string)
- `reference_note`: Additional reference notes (string)
- `expense_for_user`: User ID for expense tracking (integer)
- `attachment`: New file attachment (file upload)
- `attachment_type`: Attachment type - `invoice`, `receipt`, `proof`, `other`
- `old_attachment`: Path to old attachment (will be deleted if new attachment is uploaded)

**Success Response (200):**
```json
{
    "success": true,
    "message": "Updated successfully",
    "data": {
        "id": 13,
        "type": "income",
        "amount": "5500.00",
        "transaction_date": "2025-10-04",
        "payment_mode": "bank_transfer"
    },
    "timestamp": "2025-10-04T20:22:33.743Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Not found",
    "timestamp": "2025-10-04T20:22:33.743Z"
}
```

---

## 5. Delete Transaction

**Method:** DELETE  
**Endpoint:** `/api/internal/transactions/delete/:id`

**URL Parameters:**
- `id` (required): Transaction ID

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Deleted successfully",
    "data": {
        "id": 13,
        "type": "income",
        "amount": "5000.00"
    },
    "timestamp": "2025-10-04T20:15:20.320Z"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Not found",
    "timestamp": "2025-10-04T20:15:20.320Z"
}
```

---

## 6. Get Dashboard Statistics

**Method:** GET  
**Endpoint:** `/api/internal/transactions/dashboard/stats`

**Query Parameters:**
- `dateFrom` (optional): Start date filter (YYYY-MM-DD format)
- `dateTo` (optional): End date filter (YYYY-MM-DD format)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "totalIncome": "150000.00",
        "totalExpense": "75000.00",
        "netBalance": "75000.00",
        "transactionCount": 45
    },
    "timestamp": "2025-10-04T20:30:00.000Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Error message",
    "timestamp": "2025-10-04T20:30:00.000Z"
}
```

---

## 7. Get Income vs Expense by Period

**Method:** GET  
**Endpoint:** `/api/internal/transactions/income-vs-expense`

**Query Parameters:**
- `period` (optional): Period type - `month` (last 6 months) or `year` (12 months of current year). Default: `month`
- `from` (optional): Override start date (YYYY-MM-DD format)
- `to` (optional): Override end date (YYYY-MM-DD format)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "period": "month",
        "date_range": {
            "from": "2025-05-01",
            "to": "2025-10-31"
        },
        "chart_data": [
            {
                "period": "2025-05",
                "label": "May 2025",
                "income": 25000.00,
                "expenses": 12000.00
            },
            {
                "period": "2025-06",
                "label": "Jun 2025",
                "income": 30000.00,
                "expenses": 15000.00
            }
        ]
    },
    "timestamp": "2025-10-04T20:35:00.000Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Period must be either 'month' or 'year'",
    "timestamp": "2025-10-04T20:35:00.000Z"
}
```

---

## 8. Get Category-wise Data by Type

**Method:** GET  
**Endpoint:** `/api/internal/transactions/category-wise-by-type`

**Query Parameters:**
- `type` (required): Transaction type - `income`, `expense`, or `investment`
- `start_date` (optional): Start date filter (YYYY-MM-DD format)
- `end_date` (optional): End date filter (YYYY-MM-DD format)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "categories": [
            {
                "name": "Course Fee",
                "amount": 125000.00
            },
            {
                "name": "Hostel Fee",
                "amount": 25000.00
            }
        ]
    },
    "timestamp": "2025-10-04T20:40:00.000Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Type is required and must be either 'income', 'expense', or 'investment'",
    "timestamp": "2025-10-04T20:40:00.000Z"
}
```

---

## 9. Get Transactions by Category

**Method:** GET  
**Endpoint:** `/api/internal/transactions/category/:categoryId`

**URL Parameters:**
- `categoryId` (required): Transaction category ID

**Query Parameters:**
- `dateFrom` (optional): Start date filter (YYYY-MM-DD format)
- `dateTo` (optional): End date filter (YYYY-MM-DD format)
- `limit` (optional): Number of records to return (default: 10)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "category": {
            "id": 1,
            "name": "Course Fee",
            "slug": "course-fee"
        },
        "transactions": [
            {
                "id": 8,
                "type": "income",
                "amount": "2000.00",
                "transaction_date": "2025-09-26"
            }
        ]
    },
    "timestamp": "2025-10-04T20:45:00.000Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Valid category ID is required",
    "timestamp": "2025-10-04T20:45:00.000Z"
}
```

---

## 10. Get Transactions by User

**Method:** GET  
**Endpoint:** `/api/internal/transactions/user/:userId`

**URL Parameters:**
- `userId` (required): User ID

**Query Parameters:**
- `dateFrom` (optional): Start date filter (YYYY-MM-DD format)
- `dateTo` (optional): End date filter (YYYY-MM-DD format)
- `limit` (optional): Number of records to return (default: 10)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 8,
            "type": "expense",
            "amount": "1500.00",
            "transaction_date": "2025-09-26",
            "expense_for_user": 5
        }
    ],
    "timestamp": "2025-10-04T20:50:00.000Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Valid user ID is required",
    "timestamp": "2025-10-04T20:50:00.000Z"
}
```

---

## 11. Get Category Transaction Total

**Method:** GET  
**Endpoint:** `/api/internal/transactions/category/total/:categoryId`

**URL Parameters:**
- `categoryId` (required): Transaction category ID

**Query Parameters:**
- `dateFrom` (optional): Start date filter (YYYY-MM-DD format)
- `dateTo` (optional): End date filter (YYYY-MM-DD format)

**Request Payload:** None

**Success Response (200):**
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "categoryId": 1,
        "categoryName": "Course Fee",
        "totalAmount": "125000.00",
        "filters": {
            "dateFrom": "2025-01-01",
            "dateTo": "2025-10-04"
        }
    },
    "timestamp": "2025-10-04T20:55:00.000Z"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Valid category ID is required",
    "timestamp": "2025-10-04T20:55:00.000Z"
}
```

---

## 12. Export Transactions

**Method:** GET  
**Endpoint:** `/api/internal/transactions/export`

**Query Parameters:**
- `transaction_type` (optional): Transaction type - `income`, `expense`, or `investment` (default: `income`)
- `categoryId` (optional): Filter by category ID
- `paymentMode` (optional): Filter by payment mode
- `dateFrom` (optional): Start date filter (YYYY-MM-DD format)
- `dateTo` (optional): End date filter (YYYY-MM-DD format)
- `amountMin` (optional): Minimum amount filter
- `amountMax` (optional): Maximum amount filter

**Request Payload:** None

**Success Response (200):**
Returns an Excel file (.xlsx) with the filtered transaction data.

**File Headers:**
- Date
- Category
- Payer Name (for income) / Receiver Name (for expense)
- Contact
- Amount
- Payment Mode
- Payment Ref
- Reference Note

**Error Response (500):**
```json
{
    "success": false,
    "message": "Failed to download file",
    "timestamp": "2025-10-04T21:00:00.000Z"
}
```

---

## Important Notes

1. **Authentication:** All endpoints require a valid JWT token in the Authorization header: `Bearer <token>`

2. **Authorization:** Only users with `super_admin` or `admin` roles can access these endpoints

3. **Date Format:** All dates must be in YYYY-MM-DD format

4. **Payment Modes:** Valid values are `cash`, `cheque`, `upi`, `bank_transfer`, `card`, `net_banking`, `payment_gateway`

5. **Transaction Types:** Valid values are `income`, `expense`, or `investment`
   - `income`: Money received (course fees, donations, etc.)
   - `expense`: Operational expenses (fuel, salaries, utilities, etc.)
   - `investment`: Capital expenditure (machinery, equipment, furniture, etc.)

6. **Payment Reference Types:** Valid values are `receipt`, `transaction`, `cheque`, `invoice`, `other`

7. **Attachment Types:** Valid values are `invoice`, `receipt`, `proof`, `other`

8. **File Uploads:** When uploading attachments, use multipart/form-data and include the `attachment_type` field

9. **Soft Deletes:** Deleted transactions are soft-deleted and can be retrieved using the `includeDeleted` or `deletedOnly` query parameters

10. **Audit Trail:** All transactions track `created_by` and `updated_by` fields automatically
