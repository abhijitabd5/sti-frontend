# Promotion Reports - Backend API Requirements

## Overview
This document outlines the backend API requirements for the Promotion Reports page. The page will display analytics data in table format with filtering capabilities and export functionality.

## Page Structure Requirements

### Top Summary Cards (3 sections)
1. **Top 3 Sources** - Source name and total clicks
2. **Top 3 Partners** - Partner name and total clicks  
3. **Top 3 Posts** - Post title and total clicks

### Main Table (2 modes)
1. **Partners Overview** - When no partner is selected
2. **Partner Posts Detail** - When a specific partner is selected

---

## Required API Endpoints

### 1. Top Sources Summary
**Endpoint**: `GET /api/internal/promotion/analytics/top/sources`
**Query Parameters**: 
- `limit=3` (default: 3)
- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)

**Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "source": "facebook",
      "clicks": 450
    },
    {
      "source": "instagram", 
      "clicks": 320
    },
    {
      "source": "youtube",
      "clicks": 280
    }
  ],
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

### 2. Top Partners Summary (with names)
**Endpoint**: `GET /api/internal/promotion/analytics/top/partners/detailed`
**Query Parameters**:
- `limit=3` (default: 3)
- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)

**Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully", 
  "data": [
    {
      "partner_id": 1,
      "name": "John Doe",
      "clicks": 180
    },
    {
      "partner_id": 3,
      "name": "Jane Smith", 
      "clicks": 165
    },
    {
      "partner_id": 7,
      "name": "Mike Johnson",
      "clicks": 142
    }
  ],
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

### 3. Top Posts Summary (with titles)
**Endpoint**: `GET /api/internal/promotion/analytics/top/posts/detailed`
**Query Parameters**:
- `limit=3` (default: 3)
- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)

**Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "post_id": 5,
      "title": "Heavy Equipment Training Course",
      "clicks": 95
    },
    {
      "post_id": 12,
      "title": "Excavator Operator Certification",
      "clicks": 87
    },
    {
      "post_id": 3,
      "title": "Crane Operation Training",
      "clicks": 76
    }
  ],
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

### 4. Partners Report (Main Table - Default View)
**Endpoint**: `GET /api/internal/promotion/analytics/partners/report`
**Query Parameters**:
- `page=1` (optional): Page number for pagination
- `limit=10` (optional): Items per page
- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)
- `search` (optional): Search by partner name or mobile

**Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "partner_id": 1,
      "name": "John Doe",
      "mobile": "9876543210",
      "created_at": "2025-01-15T10:30:00.000Z",
      "total_posts": 12,
      "total_clicks": 180
    },
    {
      "partner_id": 3,
      "name": "Jane Smith",
      "mobile": "9876543211", 
      "created_at": "2025-01-20T14:45:00.000Z",
      "total_posts": 8,
      "total_clicks": 165
    },
    {
      "partner_id": 7,
      "name": "Mike Johnson",
      "mobile": "9876543212",
      "created_at": "2025-02-01T09:15:00.000Z", 
      "total_posts": 15,
      "total_clicks": 142
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

### 5. Partner Posts Report (When Partner Selected)
**Endpoint**: `GET /api/internal/promotion/analytics/partner/{partner_id}/posts/report`
**Query Parameters**:
- `page=1` (optional): Page number for pagination
- `limit=10` (optional): Items per page
- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)
- `search` (optional): Search by post title

**Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "post_id": 5,
      "title": "Heavy Equipment Training Course",
      "source": "facebook",
      "created_at": "2025-01-10T14:20:00.000Z",
      "total_clicks": 68
    },
    {
      "post_id": 12,
      "title": "Excavator Operator Certification", 
      "source": "instagram",
      "created_at": "2025-01-15T11:30:00.000Z",
      "total_clicks": 45
    },
    {
      "post_id": 18,
      "title": "Crane Operation Training",
      "source": "youtube", 
      "created_at": "2025-01-20T16:45:00.000Z",
      "total_clicks": 38
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "totalPages": 2
  },
  "partner_info": {
    "partner_id": 1,
    "name": "John Doe",
    "mobile": "9876543210"
  },
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

### 6. Partners List for Dropdown
**Endpoint**: `GET /api/internal/promotion/analytics/partners/list`
**Query Parameters**: None required

**Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "partner_id": 1,
      "name": "John Doe"
    },
    {
      "partner_id": 3,
      "name": "Jane Smith"
    },
    {
      "partner_id": 7,
      "name": "Mike Johnson"
    }
  ],
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

---

## Data Requirements

### Partner Information Needed:
- `partner_id`: Unique identifier
- `name`: Partner's full name
- `mobile`: Partner's mobile number
- `created_at`: Partner registration date
- `total_posts`: Count of posts created by partner
- `total_clicks`: Sum of all clicks across partner's posts

### Post Information Needed:
- `post_id`: Unique identifier
- `title`: Post title/content preview
- `source`: Platform (facebook, instagram, youtube, etc.)
- `created_at`: Post creation date
- `total_clicks`: Sum of clicks for this specific post

### Click Aggregation Logic:
- **Total Clicks**: Count of all click records
- **Date Filtering**: Filter clicks by `clicked_at` timestamp
- **Unique Clicks**: Optional - count unique IP addresses or users

---

## Export Functionality Requirements

### CSV Export Endpoints:

#### Partners Report Export
**Endpoint**: `GET /api/internal/promotion/analytics/partners/report/export`
**Query Parameters**: Same as partners report endpoint
**Response**: CSV file download with headers:
```
Created At,Partner Name,Mobile,Total Posts,Total Clicks
```

#### Partner Posts Export  
**Endpoint**: `GET /api/internal/promotion/analytics/partner/{partner_id}/posts/report/export`
**Query Parameters**: Same as partner posts report endpoint
**Response**: CSV file download with headers:
```
Created At,Post Title,Source,Total Clicks
```

---

## Performance Considerations

### Database Optimization:
1. **Indexes Required**:
   - `promotion_clicks.partner_id`
   - `promotion_clicks.post_id` 
   - `promotion_clicks.clicked_at`
   - `promotion_partners.created_at`
   - `promotion_posts.created_at`

2. **Aggregation Queries**:
   - Use efficient GROUP BY queries for click counting
   - Consider caching for frequently accessed data
   - Implement pagination for large datasets

### Caching Strategy:
- Cache top performers data (5-10 minutes)
- Cache partner/post counts (15-30 minutes)
- Real-time data for detailed reports

---

## Error Handling

### Standard Error Responses:
```json
{
  "success": false,
  "message": "Error description",
  "error_code": "SPECIFIC_ERROR_CODE",
  "timestamp": "2025-11-15T10:45:00.000Z"
}
```

### Common Error Scenarios:
- Invalid partner_id (404)
- Invalid date range (400)
- No data found (200 with empty array)
- Database connection issues (500)

---

## Security & Access Control

### Authentication:
- All endpoints require admin authentication
- JWT token validation required

### Rate Limiting:
- Standard API rate limits apply
- Export endpoints may have stricter limits

### Data Privacy:
- Mobile numbers should be masked/formatted appropriately
- IP addresses in click data should be anonymized if stored

---

## Testing Requirements

### Test Data Needed:
1. **Partners**: At least 10 partners with varying click counts
2. **Posts**: At least 50 posts across different partners and sources
3. **Clicks**: At least 1000 click records with varied timestamps
4. **Date Ranges**: Test data spanning multiple months

### Test Scenarios:
1. Empty results (no data)
2. Large datasets (pagination)
3. Date filtering edge cases
4. Export functionality with various data sizes
5. Partner with no posts
6. Posts with no clicks

---

## Implementation Priority

### Phase 1 (High Priority):
1. Top 3 summaries endpoints (1, 2, 3)
2. Partners report endpoint (4)
3. Partners list for dropdown (6)

### Phase 2 (Medium Priority):
4. Partner posts report endpoint (5)
5. Basic CSV export functionality

### Phase 3 (Low Priority):
6. Advanced filtering and search
7. Performance optimizations
8. Enhanced caching

---

## Notes for Backend Developer

1. **Source Values**: Use the same source values as defined in `src/config/constants.js` (facebook, instagram, youtube, etc.)

2. **Date Formatting**: All dates should be in ISO 8601 format with timezone

3. **Pagination**: Follow the same pagination pattern used in other endpoints

4. **Mobile Formatting**: Consider formatting mobile numbers consistently (with/without country code)

5. **Click Counting**: Clarify if we need unique clicks vs total clicks (or both)

6. **Post Titles**: Ensure post titles are truncated appropriately for display (max 100 characters recommended)

This document provides all the requirements needed to implement the backend APIs for the Promotion Reports functionality.