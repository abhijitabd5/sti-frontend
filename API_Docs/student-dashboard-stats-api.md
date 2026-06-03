# Student Dashboard Stats API Documentation

## Overview
This API endpoint provides comprehensive dashboard statistics for students, including total student count, students grouped by course, and students grouped by state. The data can be filtered by enrollment date range.

## Endpoint Details

### Get Student Dashboard Stats
**GET** `/api/internal/dashboard/students/stats`

**Authentication Required:** Yes (JWT Token)
**Roles Required:** `super_admin`, `admin`

#### Query Parameters
| Parameter | Type | Required | Description | Format |
|-----------|------|----------|-------------|---------|
| `dateFrom` | string | No | Start date for filtering enrollments | YYYY-MM-DD |
| `dateTo` | string | No | End date for filtering enrollments | YYYY-MM-DD |

#### Request Example
```http
GET /api/internal/dashboard/students/stats?dateFrom=2024-01-01&dateTo=2024-12-31
Authorization: Bearer <jwt_token>
```

#### Response Format

**Success Response (200)**
```json
{
  "success": true,
  "message": "Student dashboard stats retrieved successfully",
  "data": {
    "totalStudents": 150,
    "studentsByCourse": [
      {
        "courseId": 1,
        "courseSlug": "heavy-equipment-operation",
        "courseName": "Heavy Equipment Operation",
        "courseDisplayName": "Heavy Equipment",
        "courseType": "technical",
        "count": 45
      },
      {
        "courseId": 2,
        "courseSlug": "crane-operation",
        "courseName": "Crane Operation",
        "courseDisplayName": "Crane Ops",
        "courseType": "specialized",
        "count": 30
      },
      {
        "courseId": 3,
        "courseSlug": "excavator-training",
        "courseName": "Excavator Training",
        "courseDisplayName": "Excavator",
        "courseType": "technical",
        "count": 0
      }
    ],
    "studentsByState": [
      {
        "stateId": 1,
        "stateSlug": "maharashtra",
        "stateName": "Maharashtra",
        "regionSlug": "western",
        "regionName": "Western India",
        "count": 80
      },
      {
        "stateId": 2,
        "stateSlug": "gujarat",
        "stateName": "Gujarat",
        "regionSlug": "western",
        "regionName": "Western India",
        "count": 25
      },
      {
        "stateId": 3,
        "stateSlug": "rajasthan",
        "stateName": "Rajasthan",
        "regionSlug": "northern",
        "regionName": "Northern India",
        "count": 0
      }
    ],
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

### totalStudents
- **Type:** Integer
- **Description:** Total count of unique students who have enrollments within the specified date range
- **Note:** Uses DISTINCT count to avoid duplicates from multiple enrollments

### studentsByCourse
- **Type:** Array of Objects
- **Description:** List of all courses with student enrollment counts
- **Key Features:**
  - Includes only English language courses (`language = 'en'`)
  - Includes courses with 0 enrollments (using LEFT JOIN)
  - Ordered by student count (descending), then by course display_order and name
  - Counts distinct students per course

#### Course Object Properties
| Property | Type | Description |
|----------|------|-------------|
| `courseId` | integer | Unique course identifier |
| `courseSlug` | string | SEO-friendly course identifier |
| `courseName` | string | Full display name of the course |
| `courseDisplayName` | string | Short name for UI display (charts/graphs) |
| `courseType` | string | Type/category of the course |
| `count` | integer | Number of students enrolled in this course |

### studentsByState
- **Type:** Array of Objects
- **Description:** List of all active states with student enrollment counts
- **Key Features:**
  - Includes states with 0 students (using LEFT JOIN)
  - Ordered by student count (descending), then by state display_order and name
  - Counts distinct students per state

#### State Object Properties
| Property | Type | Description |
|----------|------|-------------|
| `stateId` | integer | Unique state identifier |
| `stateSlug` | string | State slug identifier |
| `stateName` | string | Display name of the state |
| `regionSlug` | string | Region slug identifier |
| `regionName` | string | Display name of the region |
| `count` | integer | Number of students from this state |

### dateFilter
- **Type:** String
- **Description:** Indicates the date range used for filtering the data
- **Format Options:**
  - `"all_time"` - No date filters applied, showing all-time data
  - `"dd-mm-yyyy_dd-mm-yyyy"` - Date range filter (e.g., "01-01-2024_31-12-2024")
  - `"dd-mm-yyyy_present"` - From specific date to present (when only dateFrom provided)
  - `"beginning_dd-mm-yyyy"` - From beginning to specific date (when only dateTo provided)

## Filtering Logic

### Date Range Filtering
- **Filter Field:** `student_enrollments.createdAt` (enrollment creation date)
- **Behavior:** 
  - If only `dateFrom` provided: Filters from that date onwards
  - If only `dateTo` provided: Filters up to that date
  - If both provided: Filters within the date range
  - If neither provided: Returns all-time statistics

### Data Inclusion Rules
- **Students:** Only includes students with `is_deleted = false`
- **Enrollments:** Only includes enrollments with `is_deleted = false`
- **Courses:** Only includes courses with `is_deleted = false` and `language = 'en'` (English only)
- **States:** Only includes states with `is_active = true`

## Use Cases

1. **Admin Dashboard:** Display key metrics for student management
2. **Course Performance:** Analyze which courses have the most enrollments
3. **Geographic Analysis:** Understand student distribution across states
4. **Time-based Analysis:** Track enrollment trends over specific periods
5. **Zero Value Reporting:** Identify courses or states with no enrollments

## Implementation Notes

- Uses complex SQL queries with LEFT JOINs to ensure zero values are included
- Implements proper soft delete handling across all related tables
- Counts distinct students to prevent duplicates from multiple enrollments
- Validates date formats and ranges before processing
- Returns consistent response format following project standards
- **Sorting Logic**: 
  - **Courses**: Sorted by student count (highest first), then by display_order, then by name
  - **States**: Sorted by student count (highest first), then by display_order, then by name
- **Migration Note**: This endpoint replaces `/api/internal/student/analytics/enrollments-by-state` with enhanced functionality