# Backend API Requirements for Student Edit Form

## New Endpoint Required

### Get Enrollment Details by Enrollment ID

**Endpoint:** `GET /api/internal/student/enrollments/:enrollmentId`

**Description:** Retrieve detailed information about a specific enrollment including student info and enrollment details.

**URL Parameters:**
- `enrollmentId` (required) - The ID of the enrollment

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Enrollment details retrieved successfully",
  "data": {
    "student_info": {
      "id": 6,
      "student_code": "STI202500004",
      "name": "David Smith",
      "mobile": "9876543211",
      "email": "david@example.com",
      "father_name": "Father Name",
      "mother_name": "Mother Name",
      "date_of_birth": "1995-01-01",
      "gender": "Male",
      "address": "Complete Address",
      "state_slug": "maharashtra",
      "state_name": "Maharashtra",
      "city": "Nagpur",
      "pincode": "440001",
      "aadhar_number": "123456789014",
      "pan_number": null
    },
    "enrollment_info": {
      "id": 6,
      "course_id": 1,
      "course": "Excavator Training - Beginner",
      "status": "not_started",
      "enrollment_date": "2025-01-01",
      "completion_date": null,
      "total_fee": "14280.00",
      "paid_amount": "5000.00",
      "due_amount": "9280.00",
      "is_hostel_opted": false,
      "is_mess_opted": false,
      "extra_discount_amount": "0.00",
      "remark": ""
    }
  },
  "timestamp": "2025-09-26T07:32:51.832Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Enrollment not found",
  "timestamp": "2025-09-26T07:32:51.832Z"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Failed to retrieve enrollment details",
  "timestamp": "2025-09-26T07:32:51.832Z"
}
```

---

## Backend Implementation Guide

### Database Query

```sql
SELECT 
  -- Student Info
  s.id,
  s.student_code,
  s.name,
  s.mobile,
  s.email,
  s.father_name,
  s.mother_name,
  s.date_of_birth,
  s.gender,
  s.address,
  s.state_slug,
  s.state_name,
  s.city,
  s.pincode,
  s.aadhar_number,
  s.pan_number,
  
  -- Enrollment Info
  e.id as enrollment_id,
  e.course_id,
  c.title as course,
  e.status,
  e.enrollment_date,
  e.completion_date,
  e.total_fee,
  e.paid_amount,
  e.due_amount,
  e.is_hostel_opted,
  e.is_mess_opted,
  e.extra_discount_amount,
  e.remark
  
FROM enrollments e
INNER JOIN students s ON e.student_id = s.id
INNER JOIN courses c ON e.course_id = c.id
WHERE e.id = ?
```

### Controller Example (Node.js/Express)

```javascript
// Get enrollment details by enrollment ID
exports.getEnrollmentById = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    // Query database
    const query = `
      SELECT 
        s.id, s.student_code, s.name, s.mobile, s.email,
        s.father_name, s.mother_name, s.date_of_birth, s.gender,
        s.address, s.state_slug, s.state_name, s.city, s.pincode,
        s.aadhar_number, s.pan_number,
        e.id as enrollment_id, e.course_id, c.title as course,
        e.status, e.enrollment_date, e.completion_date,
        e.total_fee, e.paid_amount, e.due_amount,
        e.is_hostel_opted, e.is_mess_opted,
        e.extra_discount_amount, e.remark
      FROM enrollments e
      INNER JOIN students s ON e.student_id = s.id
      INNER JOIN courses c ON e.course_id = c.id
      WHERE e.id = ?
    `;

    const [rows] = await db.query(query, [enrollmentId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
        timestamp: new Date().toISOString()
      });
    }

    const row = rows[0];

    // Format response
    const response = {
      success: true,
      message: 'Enrollment details retrieved successfully',
      data: {
        student_info: {
          id: row.id,
          student_code: row.student_code,
          name: row.name,
          mobile: row.mobile,
          email: row.email,
          father_name: row.father_name,
          mother_name: row.mother_name,
          date_of_birth: row.date_of_birth,
          gender: row.gender,
          address: row.address,
          state_slug: row.state_slug,
          state_name: row.state_name,
          city: row.city,
          pincode: row.pincode,
          aadhar_number: row.aadhar_number,
          pan_number: row.pan_number
        },
        enrollment_info: {
          id: row.enrollment_id,
          course_id: row.course_id,
          course: row.course,
          status: row.status,
          enrollment_date: row.enrollment_date,
          completion_date: row.completion_date,
          total_fee: row.total_fee,
          paid_amount: row.paid_amount,
          due_amount: row.due_amount,
          is_hostel_opted: row.is_hostel_opted,
          is_mess_opted: row.is_mess_opted,
          extra_discount_amount: row.extra_discount_amount,
          remark: row.remark
        }
      },
      timestamp: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    console.error('Error fetching enrollment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve enrollment details',
      timestamp: new Date().toISOString()
    });
  }
};
```

### Route Registration

```javascript
// routes/student.routes.js
router.get('/enrollments/:enrollmentId', getEnrollmentById);
```

---

## Validation Requirements

### Backend Validation for Mobile Number

```javascript
const validateMobile = (mobile) => {
  // Must be exactly 10 digits
  if (!/^\d{10}$/.test(mobile)) {
    return { valid: false, error: 'Mobile number must be exactly 10 digits' };
  }
  
  // Must start with 6, 7, 8, or 9
  const firstDigit = mobile.charAt(0);
  if (!['6', '7', '8', '9'].includes(firstDigit)) {
    return { valid: false, error: 'Mobile number must start with 6, 7, 8, or 9' };
  }
  
  return { valid: true };
};
```

### Backend Validation for Date of Birth

```javascript
const validateDateOfBirth = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  
  // Calculate age
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  // Must be at least 15 years old
  if (age < 15) {
    return { valid: false, error: 'Student must be at least 15 years old' };
  }
  
  // Cannot be in the future
  if (dob > today) {
    return { valid: false, error: 'Date of birth cannot be in the future' };
  }
  
  return { valid: true };
};
```

---

## Testing the Endpoint

### Using cURL

```bash
# Get enrollment details
curl -X GET http://localhost:5000/api/internal/student/enrollments/6 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. **Method:** GET
2. **URL:** `http://localhost:5000/api/internal/student/enrollments/6`
3. **Headers:**
   - `Authorization: Bearer YOUR_TOKEN`
4. **Expected Status:** 200 OK
5. **Expected Response:** JSON with student_info and enrollment_info

### Test Cases

1. **Valid Enrollment ID**
   - Request: `GET /enrollments/6`
   - Expected: 200 OK with data

2. **Invalid Enrollment ID**
   - Request: `GET /enrollments/99999`
   - Expected: 404 Not Found

3. **Non-numeric Enrollment ID**
   - Request: `GET /enrollments/abc`
   - Expected: 400 Bad Request or 404 Not Found

---

## Security Considerations

1. **Authentication Required**
   - Endpoint should require valid JWT token
   - Only authenticated admin users should access

2. **Authorization**
   - Verify user has permission to view enrollment details
   - Check user role (admin/staff)

3. **Input Validation**
   - Validate enrollmentId is a positive integer
   - Sanitize input to prevent SQL injection

4. **Rate Limiting**
   - Implement rate limiting to prevent abuse
   - Limit requests per IP/user

---

## Performance Optimization

1. **Database Indexing**
   ```sql
   CREATE INDEX idx_enrollments_id ON enrollments(id);
   CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
   CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
   ```

2. **Query Optimization**
   - Use INNER JOIN instead of multiple queries
   - Select only required columns
   - Add appropriate WHERE clauses

3. **Caching (Optional)**
   - Cache enrollment data for frequently accessed records
   - Invalidate cache on updates
   - Use Redis or similar caching solution

---

## Error Handling

### Common Errors

1. **Enrollment Not Found (404)**
   - Enrollment ID doesn't exist
   - Enrollment was deleted

2. **Database Connection Error (500)**
   - Database is down
   - Connection timeout

3. **Invalid Request (400)**
   - Missing enrollmentId parameter
   - Invalid enrollmentId format

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (only in development)",
  "timestamp": "2025-09-26T07:32:51.832Z"
}
```

---

## Deployment Checklist

- [ ] Endpoint implemented and tested locally
- [ ] Database indexes created
- [ ] Authentication middleware added
- [ ] Authorization checks implemented
- [ ] Input validation added
- [ ] Error handling implemented
- [ ] Logging added for debugging
- [ ] API documentation updated
- [ ] Postman collection updated
- [ ] Integration tests written
- [ ] Deployed to staging environment
- [ ] Tested in staging
- [ ] Deployed to production

---

## Support

For backend implementation questions:
1. Check existing `getStudentById` endpoint for reference
2. Review database schema for table relationships
3. Test with Postman before frontend integration
4. Check server logs for debugging
