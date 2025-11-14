# Promotion Module API Documentation

## Internal Routes (Admin Panel)

All internal routes require authentication and are prefixed with `/api/internal`.

---

## Partners Management

### Get All Partners
**Endpoint:** `GET /api/internal/promotion/partners`  
**Method:** GET  
**Request Payload:** No payload required, Query parameters are as follow: `page`, `limit`, `search`, `status`, `is_active`  
**Response Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Partner Name",
      "mobile": "1234567890",
      "email": "partner@example.com",
      "referral_code": "ABC123XYZ",
      "commission_rate": 10.50,
      "monthly_fee": 5000.00,
      "fee_per_post": 500.00,
      "status": "active",
      "is_active": true,
      "created_by": 1,
      "updated_by": [],
      "is_deleted": false,
      "deleted_by": null,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "deletedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Get Partner By ID
**Endpoint:** `GET /api/internal/promotion/partners/:id`  
**Method:** GET  
**Request Payload:** None  
**Response Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "name": "Partner Name",
    "mobile": "1234567890",
    "email": "partner@example.com",
    "referral_code": "ABC123XYZ",
    "commission_rate": 10.50,
    "monthly_fee": 5000.00,
    "fee_per_post": 500.00,
    "status": "active",
    "is_active": true,
    "created_by": 1,
    "updated_by": [],
    "is_deleted": false,
    "deleted_by": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "deletedAt": null
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Create Partner
**Endpoint:** `POST /api/internal/promotion/partners`  
**Method:** POST  
**Request Payload:**
```json
{
  "name": "Partner Name",
  "mobile": "1234567890",
  "email": "partner@example.com",
  "commission_rate": 10.50,
  "monthly_fee": 5000.00,
  "fee_per_post": 500.00,
  "status": "active",
  "is_active": true
}
```
**Response Payload:**
```json
{
  "success": true,
  "message": "Created successfully",
  "data": {
    "id": 1,
    "name": "Partner Name",
    "mobile": "1234567890",
    "email": "partner@example.com",
    "referral_code": "ABC123XYZ",
    "commission_rate": 10.50,
    "monthly_fee": 5000.00,
    "fee_per_post": 500.00,
    "status": "active",
    "is_active": true,
    "created_by": 1,
    "updated_by": [],
    "is_deleted": false,
    "deleted_by": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "deletedAt": null
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Update Partner
**Endpoint:** `PUT /api/internal/promotion/partners/:id`  
**Method:** PUT  
**Request Payload:**
```json
{
  "name": "Updated Partner Name",
  "mobile": "9876543210",
  "email": "updated@example.com",
  "commission_rate": 15.00,
  "monthly_fee": 6000.00,
  "fee_per_post": 600.00,
  "status": "inactive",
  "is_active": false
}
```
**Response Payload:**
```json
{
  "success": true,
  "message": "Updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Partner Name",
    "mobile": "9876543210",
    "email": "updated@example.com",
    "referral_code": "ABC123XYZ",
    "commission_rate": 15.00,
    "monthly_fee": 6000.00,
    "fee_per_post": 600.00,
    "status": "inactive",
    "is_active": false,
    "created_by": 1,
    "updated_by": [{"id": "1", "timestamp": "2025-01-02T00:00:00.000Z"}],
    "is_deleted": false,
    "deleted_by": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-02T00:00:00.000Z",
    "deletedAt": null
  },
  "timestamp": "2025-01-02T00:00:00.000Z"
}
```

---

### Delete Partner
**Endpoint:** `DELETE /api/internal/promotion/partners/:id`  
**Method:** DELETE  
**Request Payload:** None  
**Response Payload:**
```json
{
  "success": true,
  "message": "Deleted successfully",
  "data": null,
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Toggle Partner Status
**Endpoint:** `PATCH /api/internal/promotion/partners/:id/toggle-status`  
**Method:** PATCH  
**Request Payload:** None  
**Response Payload:**
```json
{
  "success": true,
  "message": "Updated successfully",
  "data": {
    "id": 1,
    "name": "Partner Name",
    "mobile": "1234567890",
    "email": "partner@example.com",
    "referral_code": "ABC123XYZ",
    "commission_rate": 10.50,
    "monthly_fee": 5000.00,
    "fee_per_post": 500.00,
    "status": "active",
    "is_active": false,
    "created_by": 1,
    "updated_by": [{"id": "1", "timestamp": "2025-01-02T00:00:00.000Z"}],
    "is_deleted": false,
    "deleted_by": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-02T00:00:00.000Z",
    "deletedAt": null
  },
  "timestamp": "2025-01-02T00:00:00.000Z"
}
```

---

## Posts Management

### Get All Posts
**Endpoint:** `GET /api/internal/promotion/posts`  
**Method:** GET  
**Request Payload:** No payload required, Query parameters are as follow: `page`, `limit`, `search`, `partner_id`, `post_platform`, `is_active`  
**Response Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "partner_id": 1,
      "partner_name": "Partner Name",
      "post_code": "POST123ABC",
      "title": "Post Title",
      "description": "Post description",
      "post_platform": "facebook",
      "post_url": "https://facebook.com/post/123",
      "target_url": "https://academy.com/courses",
      "is_active": true,
      "created_by": 1,
      "updated_by": [],
      "is_deleted": false,
      "deleted_by": null,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "deletedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Get Post By ID
**Endpoint:** `GET /api/internal/promotion/posts/:id`  
**Method:** GET  
**Request Payload:** None  
**Response Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "partner_id": 1,
    "partner_name": "Partner Name",
    "post_code": "POST123ABC",
    "title": "Post Title",
    "description": "Post description",
    "post_platform": "facebook",
    "post_url": "https://facebook.com/post/123",
    "target_url": "https://academy.com/courses",
    "is_active": true,
    "created_by": 1,
    "updated_by": [],
    "is_deleted": false,
    "deleted_by": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "deletedAt": null
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Get Posts By Partner
**Endpoint:** `GET /api/internal/promotion/partners/:partnerId/posts`  
**Method:** GET  
**Request Payload:** No payload required, Query parameters are as follow: `page`, `limit`  
**Response Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "partner_id": 1,
      "partner_name": "Partner Name",
      "post_code": "POST123ABC",
      "title": "Post Title",
      "description": "Post description",
      "post_platform": "facebook",
      "post_url": "https://facebook.com/post/123",
      "target_url": "https://academy.com/courses",
      "is_active": true,
      "created_by": 1,
      "updated_by": [],
      "is_deleted": false,
      "deleted_by": null,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "deletedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Create Post
**Endpoint:** `POST /api/internal/promotion/posts`  
**Method:** POST  
**Request Payload:**
```json
{
  "partner_id": 1,
  "partner_name": "Partner Name",
  "title": "Post Title",
  "description": "Post description",
  "post_platform": "facebook",
  "post_url": "https://facebook.com/post/123",
  "target_url": "https://academy.com/courses",
  "is_active": true
}
```
**Response Payload:**
```json
{
  "success": true,
  "message": "Created successfully",
  "data": {
    "id": 1,
    "partner_id": 1,
    "partner_name": "Partner Name",
    "post_code": "POST123ABC",
    "title": "Post Title",
    "description": "Post description",
    "post_platform": "facebook",
    "post_url": "https://facebook.com/post/123",
    "target_url": "https://academy.com/courses",
    "is_active": true,
    "created_by": 1,
    "updated_by": [],
    "is_deleted": false,
    "deleted_by": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "deletedAt": null
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Update Post
**Endpoint:** `PUT /api/internal/promotion/posts/:id`  
**Method:** PUT  
**Request Payload:**
```json
{
  "partner_id": 1,
  "partner_name": "Updated Partner Name",
  "title": "Updated Post Title",
  "description": "Updated description",
  "post_platform": "instagram",
  "post_url": "https://instagram.com/post/456",
  "target_url": "https://academy.com/new-courses",
  "is_active": false
}
```
**Response Payload:**
```json
{
  "success": true,
  "message": "Updated successfully",
  "data": {
    "id": 1,
    "partner_id": 1,
    "partner_name": "Updated Partner Name",
    "post_code": "POST123ABC",
    "title": "Updated Post Title",
    "description": "Updated description",
    "post_platform": "instagram",
    "post_url": "https://instagram.com/post/456",
    "target_url": "https://academy.com/new-courses",
    "is_active": false,
    "created_by": 1,
    "updated_by": [{"id": "1", "timestamp": "2025-01-02T00:00:00.000Z"}],
    "is_deleted": false,
    "deleted_by": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-02T00:00:00.000Z",
    "deletedAt": null
  },
  "timestamp": "2025-01-02T00:00:00.000Z"
}
```

---

### Delete Post
**Endpoint:** `DELETE /api/internal/promotion/posts/:id`  
**Method:** DELETE  
**Request Payload:** None  
**Response Payload:**
```json
{
  "success": true,
  "message": "Deleted successfully",
  "data": null,
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Toggle Post Status
**Endpoint:** `PATCH /api/internal/promotion/posts/:id/toggle-status`  
**Method:** PATCH  
**Request Payload:** None  
**Response Payload:**
```json
{
  "success": true,
  "message": "Updated successfully",
  "data": {
    "id": 1,
    "partner_id": 1,
    "partner_name": "Partner Name",
    "post_code": "POST123ABC",
    "title": "Post Title",
    "description": "Post description",
    "post_platform": "facebook",
    "post_url": "https://facebook.com/post/123",
    "target_url": "https://academy.com/courses",
    "is_active": false,
    "created_by": 1,
    "updated_by": [{"id": "1", "timestamp": "2025-01-02T00:00:00.000Z"}],
    "is_deleted": false,
    "deleted_by": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-02T00:00:00.000Z",
    "deletedAt": null
  },
  "timestamp": "2025-01-02T00:00:00.000Z"
}
```

---

## Analytics

### Get Dashboard Stats
**Endpoint:** `GET /api/internal/promotion/analytics/dashboard`  
**Method:** GET  
**Request Payload:** None  
**Response Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "totalClicks": 1500,
    "uniqueClicks": 1200,
    "totalConversions": 150,
    "conversionRate": 10.0,
    "totalEnquiries": 200,
    "activePartners": 25,
    "activePosts": 80
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Get Partner Analytics
**Endpoint:** `GET /api/internal/promotion/analytics/partner/:partnerId`  
**Method:** GET  
**Request Payload:** No payload required, Query parameters are as follow: `from`, `to`  
**Response Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "partner_id": 1,
    "partner_name": "Partner Name",
    "totalClicks": 500,
    "uniqueClicks": 400,
    "conversions": 50,
    "conversionRate": 10.0,
    "enquiries": 75,
    "clicksByDate": [
      {"date": "2025-01-01", "clicks": 20, "unique": 18},
      {"date": "2025-01-02", "clicks": 25, "unique": 22}
    ]
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Get Post Analytics
**Endpoint:** `GET /api/internal/promotion/analytics/post/:postId`  
**Method:** GET  
**Request Payload:** No payload required, Query parameters are as follow: `from`, `to`  
**Response Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "post_id": 1,
    "post_title": "Post Title",
    "totalClicks": 200,
    "uniqueClicks": 180,
    "conversions": 20,
    "conversionRate": 10.0,
    "enquiries": 30,
    "clicksByDate": [
      {"date": "2025-01-01", "clicks": 10, "unique": 9},
      {"date": "2025-01-02", "clicks": 15, "unique": 14}
    ]
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Get Source Analytics
**Endpoint:** `GET /api/internal/promotion/analytics/source`  
**Method:** GET  
**Request Payload:** No payload required, Query parameters are as follow: `from`, `to`  
**Response Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "source": "facebook",
      "totalClicks": 600,
      "uniqueClicks": 500,
      "conversions": 60,
      "conversionRate": 10.0
    },
    {
      "source": "instagram",
      "totalClicks": 400,
      "uniqueClicks": 350,
      "conversions": 40,
      "conversionRate": 10.0
    }
  ],
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Get Clicks By Date Range
**Endpoint:** `GET /api/internal/promotion/analytics/clicks`  
**Method:** GET  
**Request Payload:** No payload required, Query parameters are as follow: `from`, `to`  
**Response Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "partner_id": 1,
      "post_id": 1,
      "source": "facebook",
      "referral_code": "ABC123XYZ",
      "post_code": "POST123ABC",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "device_type": "mobile",
      "browser": "Chrome",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "is_unique": true,
      "is_converted": false,
      "is_enquiry_submitted": false,
      "clicked_at": "2025-01-01T10:30:00.000Z",
      "converted_at": null
    }
  ],
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Get Conversion Rate
**Endpoint:** `GET /api/internal/promotion/analytics/conversion-rate`  
**Method:** GET  
**Request Payload:** No payload required, Query parameters are as follow: `from`, `to`  
**Response Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "totalClicks": 1500,
    "uniqueClicks": 1200,
    "conversions": 150,
    "conversionRate": 10.0,
    "enquiries": 200,
    "enquiryRate": 13.33
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Get Top Performing Partners
**Endpoint:** `GET /api/internal/promotion/analytics/top/partners`  
**Method:** GET  
**Request Payload:** No payload required, Query parameters are as follow: `limit`  
**Response Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "partner_id": 1,
      "partner_name": "Partner Name",
      "totalClicks": 500,
      "uniqueClicks": 400,
      "conversions": 50,
      "conversionRate": 10.0
    },
    {
      "partner_id": 2,
      "partner_name": "Another Partner",
      "totalClicks": 450,
      "uniqueClicks": 380,
      "conversions": 45,
      "conversionRate": 10.0
    }
  ],
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Get Top Performing Posts
**Endpoint:** `GET /api/internal/promotion/analytics/top/posts`  
**Method:** GET  
**Request Payload:** No payload required, Query parameters are as follow: `limit`  
**Response Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "post_id": 1,
      "post_title": "Post Title",
      "partner_name": "Partner Name",
      "totalClicks": 200,
      "uniqueClicks": 180,
      "conversions": 20,
      "conversionRate": 10.0
    },
    {
      "post_id": 2,
      "post_title": "Another Post",
      "partner_name": "Partner Name",
      "totalClicks": 180,
      "uniqueClicks": 160,
      "conversions": 18,
      "conversionRate": 10.0
    }
  ],
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Export Analytics Report
**Endpoint:** `GET /api/internal/promotion/analytics/export`  
**Method:** GET  
**Request Payload:** No payload required, Query parameters are as follow: `format`, `from`, `to`  
**Response Payload:**
```json
{
  "success": true,
  "message": "Report generated",
  "data": {
    "filePath": "uploads/reports/promotion-analytics-1234567890.csv"
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## Public Routes (Website)

All public routes are prefixed with `/api/public`.

### Track Click
**Endpoint:** `GET /api/public/ref`  
**Method:** GET  
**Request Payload:** No payload required, Query parameters are as follow: `code`, `post`, `source`  
**Response Payload:** Redirects to target URL (302 redirect)

---

### Get Public Post Details
**Endpoint:** `GET /api/public/promotion/post/:id`  
**Method:** GET  
**Request Payload:** None  
**Response Payload:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "partner_id": 1,
    "partner_name": "Partner Name",
    "post_code": "POST123ABC",
    "title": "Post Title",
    "description": "Post description",
    "post_platform": "facebook",
    "post_url": "https://facebook.com/post/123",
    "target_url": "https://academy.com/courses",
    "is_active": true
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Validate Referral Code
**Endpoint:** `GET /api/public/promotion/validate/:code`  
**Method:** GET  
**Request Payload:** None  
**Response Payload:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "partner": {
      "id": 1,
      "name": "Partner Name",
      "referral_code": "ABC123XYZ"
    }
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```
