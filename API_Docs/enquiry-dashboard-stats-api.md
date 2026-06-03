# Enquiry Dashboard Stats API Documentation

## Overview
This API endpoint provides comprehensive dashboard statistics for enquiries, including total enquiry count and categorized counts by enquiry type. The data can be filtered by enquiry creation date range.

## Endpoint Details

### Get Enquiry Dashboard Stats
**GET** `/api/internal/dashboard/enquiries/stats`

**Authentication Required:** Yes (JWT Token)
**Roles Required:** `super_admin`, `admin`

#### Query Parameters
| Parameter | Type | Required | Description | Format |
|-----------|------|----------|-------------|---------|
| `dateFrom` | string | No | Start date for filtering enquiries | YYYY-MM-DD |
| `dateTo` | string | No | End date for filtering enquiries | YYYY-MM-DD |

#### Request Example
```http
GET /api/internal/dashboard/enquiries/stats?dateFrom=2024-01-01&dateTo=2024-12-31
Authorization: Bearer <jwt_token>
```

#### Response Format

**Success Response (200)**
```json
{
  "success": true,
  "message": "Enquiry dashboard stats retrieved successfully",
  "data": {
    "totalEnquiries": 250,
    "courseEnquiries": 120,
    "offlineEnquiries": 45,
    "contactUsEnquiries": 85,
    "dateFilter": "01-01-2024_31-12-2024"
  },
  "timestamp": "2024-12-11T10:30:00.000Z"
}
```

**Error Response (400)**
```json
{
  "success": false,
  "message": "Invalid dateFrom format. Please use YYYY-MM-DD format.",
  "timestamp": "2024-12-11T10:30:00.000Z"
}
```

**Error Response (401)**
```json
{
  "success": false,
  "message": "Unauthorized",
  "timestamp": "2024-12-11T10:30:00.000Z"
}
```

**Error Response (403)**
```json
{
  "success": false,
  "message": "Forbidden",
  "timestamp": "2024-12-11T10:30:00.000Z"
}
```

## Data Structure Details

### totalEnquiries
- **Type:** Integer
- **Description:** Total count of enquiries within the specified date range
- **Note:** Excludes soft-deleted enquiries

### courseEnquiries
- **Type:** Integer
- **Description:** Count of enquiries with `enquiry_type = 'course'`
- **Purpose:** Enquiries specifically about course information and enrollment

### offlineEnquiries
- **Type:** Integer
- **Description:** Count of enquiries with `enquiry_type = 'offline'`
- **Purpose:** Enquiries received through offline channels

### contactUsEnquiries
- **Type:** Integer
- **Description:** Count of enquiries with `enquiry_type = 'contact_us'`
- **Purpose:** General contact form submissions and inquiries

### dateFilter
- **Type:** String
- **Description:** Indicates the date range used for filtering the data
- **Format Options:**
  - `"all_time"` - No date filters applied, showing all-time data
  - `"dd-mm-yyyy_dd-mm-yyyy"` - Date range filter (e.g., "01-01-2024_31-12-2024")
  - `"dd-mm-yyyy_present"` - From specific date to present (when only dateFrom provided)
  - `"beginning_dd-mm-yyyy"` - From beginning to specific date (when only dateTo provided)

## Enquiry Type Categories

Based on the `enquiry_type` enum field in the enquiries table:

| Type | Description | Use Case |
|------|-------------|----------|
| `course` | Course-specific enquiries | Students asking about specific courses, fees, duration, etc. |
| `offline` | Offline enquiries | Enquiries received through phone, walk-ins, or other offline channels |
| `contact_us` | General contact enquiries | General questions, feedback, or contact form submissions |
| `general` | General enquiries | Miscellaneous enquiries not fitting other categories |
| `other` | Other types | Any other type of enquiry |

**Note:** The API currently returns stats for the three main categories: `course`, `offline`, and `contact_us`. Other types (`general`, `other`) are included in the total count but not separately categorized.

## Filtering Logic

### Date Range Filtering
- **Filter Field:** `enquiries.createdAt` (enquiry creation date)
- **Behavior:** 
  - If only `dateFrom` provided: Filters from that date onwards
  - If only `dateTo` provided: Filters up to that date
  - If both provided: Filters within the date range
  - If neither provided: Returns all-time statistics

### Data Inclusion Rules
- **Enquiries:** Only includes enquiries with `is_deleted = false`
- **Paranoid Mode:** Uses Sequelize paranoid mode to exclude soft-deleted records

## Use Cases

1. **Admin Dashboard:** Display key metrics for enquiry management
2. **Lead Analysis:** Understand the distribution of enquiry types
3. **Marketing Insights:** Track which channels generate the most enquiries
4. **Time-based Analysis:** Monitor enquiry trends over specific periods
5. **Performance Tracking:** Measure enquiry volume and categorization

## Implementation Notes

- Uses efficient database queries to count enquiries by type
- Implements proper soft delete handling
- Validates date formats and ranges before processing
- Returns consistent response format following project standards
- Includes date filter information for frontend context

## Related Endpoints

- `GET /api/internal/enquiry/stats` - Detailed enquiry statistics
- `GET /api/internal/enquiry/dashboard` - Existing dashboard data
- `GET /api/internal/enquiry` - List all enquiries
- `GET /api/internal/enquiry/export` - Export enquiries data