# Payment Management - Quick Guide

## Overview
Complete payment management system for student enrollments with create, edit, and delete capabilities.

## Features

### ✅ What's Implemented
- **Create Payment** - Add new payment records
- **Edit Payment** - Modify existing payments
- **Delete Payment** - Remove payment records (soft delete)
- **Payment History** - View all payments with details
- **Auto-Sync** - Enrollment totals update automatically
- **Payment Tracking** - Track due amount progression

### 📍 Where to Access
- **Student Detail Page** - Full payment management interface
- **Enrollment List** - (Coming soon) Quick payment modal

## How to Use

### 1. View Payment History

**Navigate to Student Detail:**
```
Admin → Students → Click student name/view icon
```

**What You'll See:**
- Enrollment summary (total fee, paid, due)
- Payment count
- List of all payments with:
  - Payment amount
  - Payment date
  - Payment method
  - Payment type
  - Due amount progression
  - Description (if any)

### 2. Add New Payment

**Steps:**
1. Click "Add Payment" button
2. Fill in payment details:
   - **Amount*** (required) - Payment amount
   - **Payment Method*** (required) - How payment was received
   - **Payment Date*** (required) - When payment was received
   - **Payment Type** (optional) - Category of payment
   - **Description** (optional) - Additional notes
3. Click "Add Payment"
4. Payment created and enrollment totals update

**Payment Methods:**
- Cash
- Cheque
- UPI
- Bank Transfer
- Card
- Net Banking
- Payment Gateway

**Payment Types:**
- Course Fee (default)
- Accommodation Fee
- Penalty
- Miscellaneous

### 3. Edit Payment

**Steps:**
1. Find payment in history
2. Click edit icon (pencil)
3. Modify payment details
4. Click "Update Payment"
5. Payment updated and enrollment totals recalculate

**What Can Be Edited:**
- Amount (triggers enrollment total recalculation)
- Payment date
- Payment method
- Payment type
- Description

### 4. Delete Payment

**Steps:**
1. Find payment in history
2. Click delete icon (trash)
3. Confirm deletion
4. Payment deleted and enrollment totals adjust

**Important:**
- Soft delete (payment record preserved in database)
- Enrollment totals automatically adjust
- Transaction record also soft-deleted
- Audit trail maintained

## Payment Data

### Enrollment Summary
```
Total Fee: ₹18,000
Paid: ₹10,000
Due: ₹8,000
Payment Count: 2
```

### Payment Record
```
Type: Course Fee
Amount: ₹5,000
Date: 15 Jan 2025
Method: UPI
Previous Due: ₹13,000 → Remaining Due: ₹8,000
Description: Partial payment
Recorded: 15 Jan 2025, 10:30 AM
```

### Payment Summary
```
First Payment: 01 Jan 2025
Last Payment: 15 Jan 2025
Total Paid: ₹10,000
```

## API Endpoints Used

### Get Enrollment Payments
```
GET /api/internal/enrollments/:enrollmentId/payments
```

### Create Payment
```
POST /api/internal/enrollments/:enrollmentId/payments
Body: {
  amount: 5000,
  payment_method: "upi",
  payment_date: "2025-01-15",
  type: "course_fee",
  description: "Partial payment"
}
```

### Update Payment
```
PUT /api/internal/payments/:paymentId
Body: {
  amount: 6000,
  payment_date: "2025-01-16",
  payment_method: "bank_transfer"
}
```

### Delete Payment
```
DELETE /api/internal/payments/:paymentId
```

## Important Notes

### ✅ Automatic Updates
- **Enrollment paid_amount** - Auto-updates when payment created/edited/deleted
- **Enrollment due_amount** - Auto-recalculates
- **Transaction records** - Stay in sync
- **All operations atomic** - All succeed or all fail

### ✅ Payment Tracking
- **Previous due** - Snapshot before payment
- **Remaining due** - Amount after payment
- **Payment progression** - Track how due amount changes
- **Audit trail** - Complete payment history

### ✅ Validation
- Amount must be > 0
- Payment method required
- Payment date required
- Date format: YYYY-MM-DD (handled by date picker)

### ⚠️ Important Behaviors
- **Additive Payments** - Each payment adds to total paid
- **Soft Delete** - Deleted payments preserved in database
- **Recalculation** - Editing amount triggers total recalculation
- **Confirmation** - Delete requires confirmation

## Common Scenarios

### Scenario 1: Student Makes Partial Payment
```
1. Student pays ₹5,000 of ₹18,000 total
2. Click "Add Payment"
3. Enter amount: 5000
4. Select method: Cash
5. Select date: Today
6. Submit
7. Result: Paid = ₹5,000, Due = ₹13,000
```

### Scenario 2: Correct Payment Amount
```
1. Payment entered as ₹5,000 but should be ₹6,000
2. Click edit icon on payment
3. Change amount to 6000
4. Submit
5. Result: Paid increases by ₹1,000, Due decreases by ₹1,000
```

### Scenario 3: Remove Incorrect Payment
```
1. Payment entered by mistake
2. Click delete icon
3. Confirm deletion
4. Result: Paid decreases, Due increases, payment soft-deleted
```

### Scenario 4: Track Payment History
```
1. View payment history
2. See all payments chronologically
3. Track due amount progression
4. View payment methods used
5. Check first and last payment dates
```

## Troubleshooting

### Payment Not Showing
- Refresh page
- Check if payment was created successfully
- Verify enrollment ID is correct

### Enrollment Totals Not Updating
- Check if payment save was successful
- Refresh page to reload data
- Verify API response

### Cannot Delete Payment
- Check if you have permission
- Verify payment exists
- Check for error messages

### Modal Not Opening
- Check browser console for errors
- Verify component is imported
- Check state management

## Best Practices

### ✅ Do's
- Always add description for clarity
- Use correct payment method
- Verify amount before submitting
- Check enrollment totals after payment
- Confirm before deleting

### ❌ Don'ts
- Don't enter negative amounts
- Don't skip payment method
- Don't delete without confirmation
- Don't edit amount without verification

## Future Features (Planned)

1. **Payment from List View**
   - Quick payment modal in enrollment list
   - No navigation required

2. **Payment Receipts**
   - Generate PDF receipts
   - Email to students
   - Print receipts

3. **Payment Analytics**
   - Payment trends
   - Collection reports
   - Method analysis

4. **Payment Reminders**
   - Automated reminders
   - SMS/Email notifications
   - Due date tracking

5. **Advanced Features**
   - Partial refunds
   - Payment plans
   - Late fees
   - Discount coupons

## Support

For issues or questions:
1. Check this guide
2. Review API documentation
3. Check browser console for errors
4. Contact development team

## Version History

- **v1.0** - Initial payment management implementation
  - Create, edit, delete payments
  - Payment history display
  - Auto-sync with enrollment totals
  - Payment tracking and progression
