# Student Edit Form - Final Behavior

## Editable Fields in Edit Mode

### ✅ **All Fields Are Editable EXCEPT Aadhaar**

| Field | Editable | Notes |
|-------|----------|-------|
| **Aadhaar Number** | ❌ No | Always readonly (unique identifier) |
| **Student Code** | ❌ No | Auto-generated, always readonly |
| **Name** | ✅ Yes | Can be corrected |
| **Mobile** | ✅ Yes | Can be updated |
| **Email** | ✅ Yes | Can be updated |
| **Father Name** | ✅ Yes | Can be corrected |
| **Mother Name** | ✅ Yes | Can be corrected |
| **Date of Birth** | ✅ Yes | Can be corrected |
| **Gender** | ✅ Yes | Can be changed |
| **Address** | ✅ Yes | Can be updated |
| **State** | ✅ Yes | Can be changed |
| **City** | ✅ Yes | Can be updated |
| **Pincode** | ✅ Yes | Can be updated |
| **Course** | ✅ Yes | Can be changed (recalculates fees) |
| **Enrollment Date** | ✅ Yes | Can be changed |
| **Status** | ✅ Yes | Can be updated |
| **Hostel Opted** | ✅ Yes | Can be toggled |
| **Mess Opted** | ✅ Yes | Can be toggled |
| **Extra Discount** | ✅ Yes | Can be adjusted |
| **Paid Amount** | ✅ Yes | Can add additional payment |
| **Payment Method** | ✅ Yes | Can be selected |
| **Remarks** | ✅ Yes | Can be updated |

## Course Selection Behavior

### When Course is Changed:
1. **Fee Calculation Updates Automatically**
   - Base course fee updates
   - Discount percentage updates
   - Discounted course fee updates
   - Hostel/Mess availability updates
   - Total payable fee recalculates

2. **Warning Shown**
   - Yellow warning text: "⚠️ Changing course will recalculate fees"
   - Alerts user that fees will change

3. **Accommodation Options Reset**
   - If new course doesn't have hostel → Hostel option unchecked
   - If new course doesn't have mess → Mess option unchecked

## Fee Calculation Section

### Always Visible When Course Selected
- Shows in both create and edit modes
- Updates in real-time when:
  - Course is changed
  - Hostel option is toggled
  - Mess option is toggled
  - Extra discount is modified
  - Paid amount is entered

### Fee Breakdown Shown:
1. Base Course Fee (readonly)
2. Discount Percentage (readonly)
3. Discounted Course Fee (readonly)
4. Hostel Fee (if opted)
5. Mess Fee (if opted)
6. Extra Discount Amount (editable)
7. Total Payable Fee (calculated)
8. Paid Amount (editable)
9. Due Amount (calculated)
10. Payment Method (selectable)

## Form Sections

### Student Information Section
- All fields editable except Aadhaar and Student Code
- Mobile validation applies (10 digits, starts with 6/7/8/9)
- Date of birth validation applies (min 15 years old)

### Course Selection Section
- Course dropdown is editable
- Shows warning when changed
- Enrollment date is editable
- Status is editable

### Fee Calculation Section
- Visible in both create and edit modes
- Updates automatically based on selections
- Shows real-time calculations

### Documents Section
- Hidden in edit mode
- Documents managed separately via Documents page

### Remarks Section
- Always editable
- Can add/update notes

## Validation Rules

### Mobile Number
- Must be exactly 10 digits
- Only numbers allowed
- Must start with 6, 7, 8, or 9
- Real-time validation with error messages

### Date of Birth
- Student must be at least 15 years old
- Cannot be in the future
- Cannot be more than 100 years ago

### Enrollment Date
- Must be valid date
- Can be in the past or future

### Payment Amount
- Must be >= 0
- No maximum limit in edit mode

## Submit Behavior

### In Edit Mode:
1. Validates all editable fields
2. Sends update request with ALL changed data
3. Backend recalculates fees if course changed
4. Backend updates due amount if payment added
5. Redirects to student detail page on success

### Update Payload Includes:
```javascript
{
  // Student info (if changed)
  name_on_id,
  mobile,
  email,
  father_name,
  mother_name,
  date_of_birth,
  gender,
  address,
  state_slug,
  city,
  pincode,
  
  // Enrollment info
  course_id,
  enrollment_date,
  status,
  is_hostel_opted,
  is_mess_opted,
  extra_discount_amount,
  
  // Payment (if added)
  paid_amount,
  payment_method,
  
  // Remarks
  remark
}
```

## User Experience

### Visual Indicators:
- **Readonly fields**: Gray background (only Aadhaar and Student Code)
- **Editable fields**: White background, normal cursor
- **Required fields**: Red asterisk (*)
- **Validation errors**: Red border + error message
- **Warnings**: Yellow text with ⚠️ icon

### Feedback:
- Real-time validation on mobile and DOB
- Instant fee recalculation on changes
- Warning when changing course
- Success message after update
- Error alerts if update fails

## Testing Checklist

- [ ] Can edit student name
- [ ] Can edit mobile number (with validation)
- [ ] Can edit email
- [ ] Can edit father/mother name
- [ ] Can change date of birth
- [ ] Can change gender
- [ ] Can update address
- [ ] Can change state
- [ ] Can update city/pincode
- [ ] Can change course (fees recalculate)
- [ ] Can change enrollment date
- [ ] Can update status
- [ ] Can toggle hostel/mess options
- [ ] Can adjust extra discount
- [ ] Can add payment amount
- [ ] Can select payment method
- [ ] Can update remarks
- [ ] Cannot edit Aadhaar number
- [ ] Cannot edit Student Code
- [ ] Form submits successfully
- [ ] Redirects to student detail after update

## Notes

1. **Aadhaar is Immutable**: This is by design as it's the unique identifier
2. **Student Code is Immutable**: Auto-generated, should never change
3. **Course Can Change**: Allows correcting enrollment mistakes
4. **Fees Recalculate**: Backend handles fee recalculation when course changes
5. **All Other Fields Editable**: Allows correcting data entry mistakes
