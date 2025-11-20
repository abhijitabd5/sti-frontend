# Transaction Export API

## Endpoint
```
GET /api/internal/transactions/export
```

## Authentication
Requires authentication token (internal routes)

## Query Parameters

10 transaction_type

Type: string

Required: Yes

Default: income

Description: Type of transactions to export. Can be income or expense.

2) categoryId

Type: integer

Required: No

Description: Filter transactions by category ID.

3) dateFrom

Type: string

Required: No

Default: —

Description: Start date filter in YYYY-MM-DD format.

4) dateTo

Type: string

Required: No

Default: —

Description: End date filter in YYYY-MM-DD format.


## Excel Export Columns

The exported Excel file contains the following columns:

1. **Date** - Transaction date
2. **Category** - Transaction category name
3. **Payer Name/Receiver Name** - Depends on transaction type:
   - For `income`: Shows Payer Name
   - For `expense`: Shows Receiver Name
4. **Contact** - Contact information:
   - For `income`: Shows Payer Contact
   - For `expense`: Shows Receiver Contact
5. **Amount** - Transaction amount (formatted to 2 decimal places)
6. **Payment Mode** - Payment method used
7. **Payment Ref** - Payment reference number
8. **Reference Note** - Additional notes/remarks

## Example Requests

### Export Income Transactions
```
GET /api/internal/transactions/export?transaction_type=income
```

### Export Expense Transactions with Date Range
```
GET /api/internal/transactions/export?transaction_type=expense&dateFrom=2025-01-01&dateTo=2025-01-31
```

### Export with Multiple Filters
```
GET /api/internal/transactions/export?transaction_type=income&categoryId=5&dateFrom=2025-01-01
```

## Response

The API returns an Excel file (.xlsx) with:
- Proper formatting and borders
- Header row with blue background and white text
- Aligned columns for better readability
- Filename format: `{type}-transactions-{timestamp}.xlsx`
