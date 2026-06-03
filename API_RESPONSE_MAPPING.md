# API Response Mapping for Student Edit Form

## Actual Backend Response Structure

The backend returns enrollment data in this structure:

```json
{
  "success": true,
  "message": "Enrollment retrieved successfully",
  "data": {
    "id": 157,
    "student_id": 157,
    "course_id": 6,
    "status": "not_started",
    "enrollment_date": "2026-03-14",
    "total_payable_fee": "24000.00",
    "paid_amount": "0.00",
    "due_amount": "24000.00",
    "is_hostel_opted": false,
    "is_mess_opted": false,
    "extra_discount_amount": "0.00",
    "remark": null,
    "student": {
      "id": 157,
      "student_code": "STI202600063",
      "name_on_id": "Test Name",
      "father_name": "Test",
      "mother_name": null,
      "date_of_birth": "2000-01-13",
      "gender": "Male",
      "address": "Pune",
      "state_slug": "maharashtra",
      "state": "Maharashtra",
      "city": "Pune",
      "pincode": "444111",
      "aadhar_number": "987654323456",
      "user": {
        "mobile": "9878677667",
        "email": null
      }
    },
    "course": {
      "id": 6,
      "title": "Haulpak Operator Training"
    }
  }
}
```

## Field Mapping

### Student Information
| Form Field | API Path | Notes |
|------------|----------|-------|
| `aadhar_number` | `data.student.aadhar_number` | |
| `student_code` | `data.student.student_code` | |
| `name_on_id` | `data.student.name_on_id` | |
| `father_name` | `data.student.father_name` | |
| `mother_name` | `data.student.mother_name` | |
| `date_of_birth` | `data.student.date_of_birth` | Format: YYYY-MM-DD |
| `gender` | `data.student.gender` | |
| `address` | `data.student.address` | |
| `state` | `data.student.state_slug` | Use slug, not full name |
| `city` | `data.student.city` | |
| `pincode` | `data.student.pincode` | |
| `mobile` | `data.student.user.mobile` | From nested user object |
| `email` | `data.student.user.email` | From nested user object |

### Enrollment Information
| Form Field | API Path | Notes |
|------------|----------|-------|
| `course_id` | `data.course_id` | |
| `enrollment_date` | `data.enrollment_date` | Format: YYYY-MM-DD |
| `status` | `data.status` | not_started/ongoing/completed/aborted |
| `is_hostel_opted` | `data.is_hostel_opted` | Boolean |
| `is_mess_opted` | `data.is_mess_opted` | Boolean |
| `extra_discount_amount` | `data.extra_discount_amount` | |
| `remark` | `data.remark` | |

### Payment Summary (Display Only)
| Display Field | API Path | Notes |
|---------------|----------|-------|
| Total Fee | `data.total_payable_fee` | |
| Already Paid | `data.paid_amount` | |
| Due Amount | `data.due_amount` | |

## Code Implementation

### Loading Data

```javascript
const loadEnrollmentData = async (enrollmentId) => {
  const response = await studentApi.getEnrollmentById(enrollmentId);
  
  if (response.success && response.data) {
    const enrollmentData = response.data;
    const studentInfo = enrollmentData.student;
    const userInfo = studentInfo?.user;
    
    setFormData({
      // Student Info
      aadhar_number: studentInfo?.aadhar_number || '',
      student_code: studentInfo?.student_code || '',
      name_on_id: studentInfo?.name_on_id || '',
      father_name: studentInfo?.father_name || '',
      mother_name: studentInfo?.mother_name || '',
      date_of_birth: studentInfo?.date_of_birth || '',
      gender: studentInfo?.gender || 'Male',
      address: studentInfo?.address || '',
      state: studentInfo?.state_slug || '',
      city: studentInfo?.city || '',
      pincode: studentInfo?.pincode || '',
      mobile: userInfo?.mobile || '',
      email: userInfo?.email || '',
      
      // Enrollment Info
      course_id: enrollmentData?.course_id || '',
      enrollment_date: enrollmentData?.enrollment_date || '',
      status: enrollmentData?.status || 'not_started',
      is_hostel_opted: enrollmentData?.is_hostel_opted || false,
      is_mess_opted: enrollmentData?.is_mess_opted || false,
      extra_discount_amount: enrollmentData?.extra_discount_amount || 0,
      remark: enrollmentData?.remark || ''
    });
  }
};
```

## Important Notes

1. **Mobile and Email**: These are nested in `student.user` object, not directly in `student`
2. **State**: Use `state_slug` (e.g., "maharashtra") not `state` (e.g., "Maharashtra")
3. **Date Format**: Backend returns dates in `YYYY-MM-DD` format
4. **Fee Fields**: Use `total_payable_fee` not `total_fee`
5. **Null Values**: Many fields can be `null`, always use fallback values

## Testing

### Test Data Loading
1. Navigate to `/admin/students/edit/157`
2. Form should populate with:
   - Student Code: STI202600063
   - Name: Test Name
   - Mobile: 9878677667
   - Course: Haulpak Operator Training
   - Total Fee: ₹24,000.00

### Verify Fields
- All student info fields should be readonly
- Course dropdown should be disabled
- Status can be changed
- Payment section shows correct amounts

## Common Issues

### Issue: Mobile/Email not loading
**Cause**: Trying to access `student.mobile` instead of `student.user.mobile`
**Fix**: Use `studentInfo?.user?.mobile`

### Issue: State not matching
**Cause**: Using `state` instead of `state_slug`
**Fix**: Use `studentInfo?.state_slug`

### Issue: Fee showing wrong amount
**Cause**: Using `total_fee` instead of `total_payable_fee`
**Fix**: Use `enrollmentData?.total_payable_fee`

## Browser Console Warning

You may see this warning:
```
Uncaught (in promise) Error: A listener indicated an asynchronous response 
by returning true, but the message channel closed before a response was received
```

**This is NOT from our code** - it's from a browser extension (like TestCraft content script). It doesn't affect functionality and can be safely ignored.
