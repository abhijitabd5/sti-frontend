# ⚠️ IMPORTANT: Backend API Implementation Required

## Current Status

The student edit form is **fully implemented on the frontend** but requires a backend API endpoint to function.

## What's Missing

### Required Endpoint: Get Enrollment by ID

**Endpoint:** `GET /api/internal/student/enrollments/:enrollmentId`

**Status:** ❌ NOT IMPLEMENTED

**Impact:** Edit student form will show an error when trying to load existing enrollment data.

---

## Quick Implementation Guide

### 1. Create the Route

```javascript
// routes/student.routes.js
router.get('/enrollments/:enrollmentId', getEnrollmentById);
```

### 2. Create the Controller

```javascript
// controllers/student.controller.js
exports.getEnrollmentById = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

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

    res.json({
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
    });

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

### 3. Test the Endpoint

```bash
# Test with cURL
curl -X GET http://localhost:5000/api/internal/student/enrollments/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Message

When users try to edit a student without this endpoint, they'll see:

> "Failed to load enrollment data. The backend API endpoint may not be implemented yet. Please check BACKEND_API_REQUIREMENTS.md for implementation details."

---

## Complete Documentation

See **`BACKEND_API_REQUIREMENTS.md`** for:
- Complete implementation details
- Database queries
- Security considerations
- Testing guide
- Error handling

---

## Priority

🔴 **HIGH PRIORITY** - Edit functionality is blocked without this endpoint.

---

## Checklist

- [ ] Create route in `routes/student.routes.js`
- [ ] Create controller in `controllers/student.controller.js`
- [ ] Test endpoint with Postman/cURL
- [ ] Verify response format matches expected structure
- [ ] Test edit form in frontend
- [ ] Deploy to staging
- [ ] Test in staging environment
- [ ] Deploy to production

---

## Questions?

Refer to:
1. `BACKEND_API_REQUIREMENTS.md` - Complete implementation guide
2. `STUDENT_EDIT_FORM_UPDATE.md` - Frontend implementation details
3. Existing `getStudentById` endpoint - Similar implementation pattern
