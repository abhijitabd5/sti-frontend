# Promotion Analytics API - Sample Responses

## 1. Dashboard Stats
**Endpoint**: `GET /api/internal/promotion/analytics/dashboard`

**Sample Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "totalClicks": 1250,
    "totalConversions": 85,
    "partners": 12,
    "posts": 45
  },
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

**Explanation**:
- `totalClicks`: Total number of clicks across all partners and posts
- `totalConversions`: Total number of conversions (enrollments)
- `partners`: Number of unique partners who have generated clicks
- `posts`: Number of unique posts that have generated clicks

---

## 2. Basic Partner Analytics
**Endpoint**: `GET /api/internal/promotion/analytics/partner/1`
**Query Parameters**: `from=2025-11-01&to=2025-11-15` (optional)

**Sample Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "clicks": [
      {
        "id": 1,
        "partner_id": 1,
        "post_id": 5,
        "source": "facebook",
        "referral_code": "JOHN2024",
        "post_code": "abc123",
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0...",
        "device_type": "mobile",
        "browser": "Chrome",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "is_unique": true,
        "is_converted": false,
        "is_enquiry_submitted": true,
        "clicked_at": "2025-11-15T08:30:00.000Z"
      },
      {
        "id": 2,
        "partner_id": 1,
        "post_id": 3,
        "source": "instagram",
        "referral_code": "JOHN2024",
        "post_code": "def456",
        "ip_address": "192.168.1.2",
        "user_agent": "Mozilla/5.0...",
        "device_type": "desktop",
        "browser": "Firefox",
        "city": "Delhi",
        "state": "Delhi",
        "country": "India",
        "is_unique": true,
        "is_converted": true,
        "is_enquiry_submitted": true,
        "clicked_at": "2025-11-14T14:20:00.000Z"
      }
    ],
    "conversions": 8
  },
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

**Explanation**:
- `clicks`: Array of all click records for this partner
- `conversions`: Number of clicks that resulted in conversions (enrollments)

---

## 3. Post Analytics
**Endpoint**: `GET /api/internal/promotion/analytics/post/5`
**Query Parameters**: `from=2025-11-01&to=2025-11-15` (optional)

**Sample Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "clicks": [
      {
        "id": 1,
        "partner_id": 1,
        "post_id": 5,
        "source": "facebook",
        "referral_code": "JOHN2024",
        "post_code": "abc123",
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0...",
        "device_type": "mobile",
        "browser": "Chrome",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "is_unique": true,
        "is_converted": false,
        "is_enquiry_submitted": true,
        "clicked_at": "2025-11-15T08:30:00.000Z"
      },
      {
        "id": 15,
        "partner_id": 3,
        "post_id": 5,
        "source": "facebook",
        "referral_code": "AMIT2024",
        "post_code": "abc123",
        "ip_address": "192.168.2.1",
        "user_agent": "Mozilla/5.0...",
        "device_type": "tablet",
        "browser": "Safari",
        "city": "Pune",
        "state": "Maharashtra",
        "country": "India",
        "is_unique": true,
        "is_converted": true,
        "is_enquiry_submitted": true,
        "clicked_at": "2025-11-14T16:45:00.000Z"
      }
    ],
    "conversions": 12
  },
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

**Explanation**:
- `clicks`: Array of all click records for this specific post
- `conversions`: Number of clicks on this post that resulted in conversions

---

## 4. Basic Source Analytics
**Endpoint**: `GET /api/internal/promotion/analytics/source`
**Query Parameters**: `from=2025-11-01&to=2025-11-15` (optional)

**Sample Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "source": "facebook",
      "clicks": 450,
      "conversions": 32
    },
    {
      "source": "instagram",
      "clicks": 320,
      "conversions": 28
    },
    {
      "source": "youtube",
      "clicks": 280,
      "conversions": 15
    },
    {
      "source": "whatsapp",
      "clicks": 150,
      "conversions": 8
    },
    {
      "source": "other",
      "clicks": 50,
      "conversions": 2
    }
  ],
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

**Explanation**:
- Array of objects showing clicks and conversions grouped by source
- Ordered by clicks (highest first)

---

## 5. Top Performing Partners
**Endpoint**: `GET /api/internal/promotion/analytics/top/partners`
**Query Parameters**: `limit=10` (optional, default: 10)

**Sample Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "partner_id": 1,
      "clicks": 180,
      "conversions": 15
    },
    {
      "partner_id": 3,
      "clicks": 165,
      "conversions": 12
    },
    {
      "partner_id": 7,
      "clicks": 142,
      "conversions": 18
    },
    {
      "partner_id": 2,
      "clicks": 128,
      "conversions": 9
    },
    {
      "partner_id": 5,
      "clicks": 95,
      "conversions": 7
    },
    {
      "partner_id": 8,
      "clicks": 87,
      "conversions": 6
    },
    {
      "partner_id": 4,
      "clicks": 76,
      "conversions": 4
    },
    {
      "partner_id": 6,
      "clicks": 65,
      "conversions": 5
    },
    {
      "partner_id": 9,
      "clicks": 52,
      "conversions": 3
    },
    {
      "partner_id": 10,
      "clicks": 38,
      "conversions": 2
    }
  ],
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

**Explanation**:
- Array of partners ordered by total clicks (highest first)
- Shows `partner_id`, total `clicks`, and total `conversions` for each partner
- Limited to top 10 by default (configurable with `limit` parameter)

---

## 6. Top Performing Posts
**Endpoint**: `GET /api/internal/promotion/analytics/top/posts`
**Query Parameters**: `limit=10` (optional, default: 10)

**Sample Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "post_id": 5,
      "clicks": 95,
      "conversions": 12
    },
    {
      "post_id": 12,
      "clicks": 87,
      "conversions": 8
    },
    {
      "post_id": 3,
      "clicks": 76,
      "conversions": 15
    },
    {
      "post_id": 18,
      "clicks": 68,
      "conversions": 6
    },
    {
      "post_id": 7,
      "clicks": 54,
      "conversions": 9
    },
    {
      "post_id": 22,
      "clicks": 48,
      "conversions": 4
    },
    {
      "post_id": 15,
      "clicks": 42,
      "conversions": 7
    },
    {
      "post_id": 9,
      "clicks": 38,
      "conversions": 3
    },
    {
      "post_id": 25,
      "clicks": 35,
      "conversions": 5
    },
    {
      "post_id": 11,
      "clicks": 29,
      "conversions": 2
    }
  ],
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

**Explanation**:
- Array of posts ordered by total clicks (highest first)
- Shows `post_id`, total `clicks`, and total `conversions` for each post
- Limited to top 10 by default (configurable with `limit` parameter)
- Only includes posts that have generated clicks (excludes posts with 0 clicks)

---

## Additional Endpoints (Enhanced)

### 7. Partner Detailed Analytics (New)
**Endpoint**: `GET /api/internal/promotion/analytics/partner/1/detailed?period=month`

**Sample Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "partner_id": 1,
    "period": "month",
    "date_range": {
      "from": "2025-11-01T00:00:00.000Z",
      "to": "2025-11-15T10:45:00.000Z"
    },
    "total_clicks": 180,
    "total_conversions": 15,
    "conversion_rate": 8.33,
    "clicks_per_source": [
      {
        "source": "facebook",
        "clicks": 95,
        "conversions": 8
      },
      {
        "source": "instagram",
        "clicks": 52,
        "conversions": 4
      },
      {
        "source": "youtube",
        "clicks": 33,
        "conversions": 3
      }
    ],
    "clicks_per_post": [
      {
        "post_id": 5,
        "clicks": 68,
        "conversions": 7
      },
      {
        "post_id": 12,
        "clicks": 45,
        "conversions": 4
      },
      {
        "post_id": 18,
        "clicks": 38,
        "conversions": 2
      },
      {
        "post_id": 22,
        "clicks": 29,
        "conversions": 2
      }
    ]
  },
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

### 8. Source Analytics with Period (New)
**Endpoint**: `GET /api/internal/promotion/analytics/source/detailed?period=week`

**Sample Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "period": "week",
    "date_range": {
      "from": "2025-11-10T00:00:00.000Z",
      "to": "2025-11-15T10:45:00.000Z"
    },
    "sources": [
      {
        "source": "facebook",
        "clicks": 285,
        "conversions": 22,
        "unique_clicks": 198
      },
      {
        "source": "instagram",
        "clicks": 165,
        "conversions": 18,
        "unique_clicks": 142
      },
      {
        "source": "youtube",
        "clicks": 128,
        "conversions": 9,
        "unique_clicks": 95
      },
      {
        "source": "whatsapp",
        "clicks": 87,
        "conversions": 6,
        "unique_clicks": 76
      },
      {
        "source": "other",
        "clicks": 35,
        "conversions": 2,
        "unique_clicks": 28
      }
    ]
  },
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

---

## Query Parameters Summary

### Date Filtering (for most endpoints):
- `from`: Start date (YYYY-MM-DD format)
- `to`: End date (YYYY-MM-DD format)

### Period Filtering (for enhanced endpoints):
- `period`: `today`, `week`, `month`, `year`, `daterange`, `all`
- `from` & `to`: Required when `period=daterange`

### Limit Parameters:
- `limit`: Number of results to return (for top partners/posts)

### Example URLs:
```
GET /promotion/analytics/dashboard
GET /promotion/analytics/partner/1?from=2025-11-01&to=2025-11-15
GET /promotion/analytics/source?from=2025-11-01
GET /promotion/analytics/top/partners?limit=5
GET /promotion/analytics/partner/1/detailed?period=month
GET /promotion/analytics/source/detailed?period=today
```