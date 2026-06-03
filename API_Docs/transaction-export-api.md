# Transaction Export API Documentation

## Export Transactions to Excel

### Endpoint
**Method:** GET  
**URL:** `/api/internal/transactions/export`

### Authentication
Requires JWT authentication token. Only accessible to users with `super_admin` or `admin` roles.

### Request Headers
```
Authorization: Bearer <access_token>
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `transaction_type` | string | No | `income` | Type of transactions to export. Valid values: `income`, `expense`. Defaults to `income` if invalid or absent. |
| `categoryId` | integer | No | - | Filter transactions by category ID. |
| `paymentMode` | string | No | - | Filter by payment mode. Valid values: `cash`, `cheque`, `upi`, `bank_transfer`, `card`, `net_banking`, `payment_gateway`. |
| `dateFrom` | string | No | - | Start date filter in YYYY-MM-DD format. |
| `dateTo` | string | No | - | End date filter in YYYY-MM-DD format. |
| `amountMin` | number | No | - | Minimum transaction amount filter. |
| `amountMax` | number | No | - | Maximum transaction amount filter. |

### Success Response

**Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

**Response:** Excel file (.xlsx) download with the following characteristics:

#### Excel File Structure

**Worksheet Name:** `Income Transactions` or `Expense Transactions` (based on type)

**Columns:**
1. **Date** - Transaction date (YYYY-MM-DD format)
2. **Category** - Transaction category name
3. **Payer Name** (for income) / **Receiver Name** (for expense) - Name of payer or receiver
4. **Contact** - Contact information (payer contact for income, payee contact for expense)
5. **Amount** - Transaction amount (formatted to 2 decimal places)
6. **Payment Mode** - Payment method used
7. **Payment Ref** - Payment reference number
8. **Reference Note** - Additional notes/remarks

**Formatting:**
- Header row with bold text, blue background (#4472C4), white text
- All cells have borders
- Column widths optimized for readability
- Data alignment: dates and contacts centered, amounts right-aligned, text left-aligned

**Filename Format:** `{type}-transactions-{timestamp}.xlsx`  
Example: `income-transactions-2025-12-05T17-26-27.xlsx`

### Error Response

**Status Code:** 500

**Response Body:**
```json
{
  "success": false,
  "message": "Failed to export transactions",
  "timestamp": "2025-12-08T10:30:00.000Z"
}
```

### Example Requests

#### Export All Income Transactions
```bash
GET /api/internal/transactions/export
```

#### Export Income Transactions (Explicit)
```bash
GET /api/internal/transactions/export?transaction_type=income
```

#### Export Expense Transactions with Date Range
```bash
GET /api/internal/transactions/export?transaction_type=expense&dateFrom=2025-01-01&dateTo=2025-01-31
```

#### Export with Category Filter
```bash
GET /api/internal/transactions/export?transaction_type=income&categoryId=5
```

#### Export with Multiple Filters
```bash
GET /api/internal/transactions/export?transaction_type=expense&categoryId=3&paymentMode=upi&dateFrom=2025-01-01&dateTo=2025-12-31&amountMin=1000&amountMax=50000
```

#### Export with Amount Range
```bash
GET /api/internal/transactions/export?transaction_type=income&amountMin=5000&amountMax=100000
```

### Notes

- The export includes all transactions matching the filters (no pagination)
- If `transaction_type` is invalid or not provided, it defaults to `income`
- The file is saved in the `uploads/exports/` directory on the server
- Empty fields in the data are displayed as empty cells in the Excel file
- The timestamp in the filename uses ISO format with colons and dots replaced by hyphens
