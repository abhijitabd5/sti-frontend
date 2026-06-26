# Transaction Date Format Fix

## Problem

When creating or editing transactions (income/expense/investment), the frontend was sending dates in `DD-MM-YYYY` format, but the backend expects dates in `YYYY-MM-DD` format, resulting in validation errors:

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "transaction_date": "Transaction date must be in YYYY-MM-DD format"
  }
}
```

## Root Cause

1. **DatePicker Component** (`src/components/ui/Internal/DatePicker.jsx`):
   - Stores and returns dates in `dd-MM-yyyy` format (e.g., "26-06-2026")
   - Displays dates as "26 June 2026" for user-friendly viewing

2. **Backend API** (`/api/internal/transactions/create` and `/edit/:id`):
   - Requires dates in `YYYY-MM-DD` format (e.g., "2026-06-26")
   - Returns dates in `YYYY-MM-DD` format

3. **Transaction Form** didn't convert between these formats when:
   - Loading data from backend (YYYY-MM-DD → DD-MM-YYYY)
   - Submitting data to backend (DD-MM-YYYY → YYYY-MM-DD)

## Solution

### Date Utility Functions

Added helper functions in `src/utils/dateUtils.js`:

```javascript
/**
 * Convert DD-MM-YYYY to YYYY-MM-DD for backend
 */
export const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return '';
  
  // Handle DD-MM-YYYY format (date display)
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  }
  
  return dateString;
};

/**
 * Convert YYYY-MM-DD to DD-MM-YYYY for display
 */
export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  
  // Handle YYYY-MM-DD format (backend format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }
  
  return dateString;
};
```

### Transaction Form Updates

Modified `src/pages/internal/Transactions/AddEditTransaction.jsx`:

#### 1. Import Utility Functions

```javascript
import { formatDateToYYYYMMDD, formatDateToDDMMYYYY } from "@/utils/dateUtils";
```

#### 2. Load Transaction (Backend → Frontend)

When loading a transaction for editing, convert date from backend format to display format:

```javascript
const loadTransaction = async () => {
  const transaction = response.data;
  
  // Convert transaction_date from YYYY-MM-DD to DD-MM-YYYY for DatePicker
  const backendDate = transaction.transaction_date?.split("T")[0] || transaction.transaction_date;
  const displayDate = formatDateToDDMMYYYY(backendDate);
  
  setFormData({
    // ... other fields
    transaction_date: displayDate,
    // ... other fields
  });
};
```

#### 3. Submit Transaction (Frontend → Backend)

When submitting transaction data, convert date from display format to backend format:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const finalFormData = {
    ...formData,
    type: transactionType,
    // Convert transaction_date from DD-MM-YYYY to YYYY-MM-DD format for backend
    transaction_date: formatDateToYYYYMMDD(formData.transaction_date),
  };

  if (isEdit) {
    response = await transactionApi.updateTransaction(id, finalFormData);
  } else {
    response = await transactionApi.createTransaction(finalFormData);
  }
};
```

## Date Format Flow

### Creating a New Transaction

1. User selects date: **26 June 2026** (displayed as "26 June 2026")
2. DatePicker stores: **26-06-2026** (DD-MM-YYYY format)
3. Form stores: **26-06-2026** (DD-MM-YYYY format)
4. Before submit: **2026-06-26** (converted to YYYY-MM-DD)
5. Backend receives: **2026-06-26** ✅

### Editing an Existing Transaction

1. Backend returns: **2026-06-26** (YYYY-MM-DD format)
2. Form loads: **26-06-2026** (converted to DD-MM-YYYY)
3. DatePicker displays: **26 June 2026** (user-friendly format)
4. User modifies or submits
5. Before submit: **2026-06-26** (converted back to YYYY-MM-DD)
6. Backend receives: **2026-06-26** ✅

## Files Modified

1. **src/pages/internal/Transactions/AddEditTransaction.jsx**
   - Added imports for date utility functions
   - Updated `loadTransaction()` to convert dates when loading
   - Updated `handleSubmit()` to convert dates when submitting

2. **src/utils/dateUtils.js** (No changes needed)
   - Already had the required utility functions

## Testing Checklist

- [x] Create new income transaction with today's date
- [x] Create new expense transaction with past date
- [x] Create new investment transaction with future date
- [x] Edit existing transaction and keep the same date
- [x] Edit existing transaction and change the date
- [x] Verify date displays as "26 June 2026" format
- [x] Verify date is sent as "2026-06-26" to backend
- [x] Verify no validation errors from backend

## Date Format Standards

### Display Format (Frontend)
- **DatePicker internal:** `DD-MM-YYYY` (e.g., "26-06-2026")
- **DatePicker display:** `D MMMM YYYY` (e.g., "26 June 2026")

### API Format (Backend)
- **transaction_date:** `YYYY-MM-DD` (e.g., "2026-06-26")
- **dateFrom filter:** `YYYY-MM-DD` (e.g., "2026-06-01")
- **dateTo filter:** `YYYY-MM-DD` (e.g., "2026-06-30")

### Conversion Rules
- **Frontend → Backend:** Always use `formatDateToYYYYMMDD()`
- **Backend → Frontend:** Always use `formatDateToDDMMYYYY()`
- **User Display:** DatePicker handles formatting automatically

## Impact

This fix resolves the validation error and ensures:
- ✅ Transactions can be created successfully
- ✅ Transactions can be edited successfully
- ✅ Dates are displayed in user-friendly format
- ✅ Dates are sent in backend-expected format
- ✅ No changes needed to DatePicker component
- ✅ No changes needed to backend API
