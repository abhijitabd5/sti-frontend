# Enquiry Export API Documentation

## Export Enquiries to Excel

### Endpoint
**Method:** GET  
**Endpoint:** `/api/internal/enquiry/export`  
**Authentication:** Required (JWT Bearer Token)  
**Authorization:** Roles: `super_admin`, `admin`

### Description
Exports filtered enquiry data to an Excel (XLSX) file with two sheets: a summary sheet with statistics and a detailed data sheet with all enquiry records. The file is generated on-demand and downloaded immediately.

### Query Parameters (All Optional)

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `status` | string | Filter by enquiry status | `unread`, `read`, `discard` |
| `source` | string | Filter by enquiry source | `website`, `referral`, `ad`, `fb`, `insta`, `yt`, `other` |
| `search` | string | Search term for name, email, phone, or message | `john` |
| `is_action_taken` | string | Filter by action taken status | `true`, `false` |
| `action_type` | string | Filter by action type | `no_action`, `call`, `whatsapp`, `email`, `text_message`, `visit`, `discard` |
| `startDate` | string | Start date for date range filter (ISO format) | `2025-01-01` |
| `endDate` | string | End date for date range filter (ISO format) | `2025-01-31` |

### Request Example

```http
GET /api/internal/enquiry/export?status=unread&source=website&startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer <jwt_token>
```

### Success Response

**Status Code:** 200 OK  
**Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`  
**Content-Disposition:** `attachment; filename="enquiries-export-{timestamp}.xlsx"`

**Response:** Binary XLSX file download

**Excel File Structure:**

**Sheet 1: Summary**
- Export metadata (generated date, filters applied)
- Overall statistics (total enquiries, status breakdown, action taken count)
- Source breakdown with counts

**Sheet 2: Enquiries (Detailed Data)**

Columns:
- ID
- Name
- Email
- Phone
- Course
- Message
- Source
- Status
- Action Taken (Yes/No)
- Action Type
- Remark
- Created At

**File Naming Convention:** `enquiries-export-{timestamp}.xlsx`  
Example: `enquiries-export-1736950800000.xlsx`

### Error Response

**Status Code:** 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to export enquiries",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Features

- Exports ALL filtered data (no pagination limits)
- Two-sheet workbook: Summary statistics + Detailed data
- Professional formatting with borders and styling
- Auto-fit columns for readability
- Immediate synchronous download
- Files stored temporarily in `uploads/exports/` directory

### Implementation Notes

- **Controller:** `src/controllers/internal/EnquiryController.js` - `exportEnquiries()`
- **Service:** `src/services/EnquiryService.js` - `exportEnquiries()`
- **Repository:** `src/repositories/EnquiryRepository.js` - `findAllForExport()`
- **Route:** `src/routes/internalRoutes.js` - Protected by `authenticate` and `checkRoles("super_admin", "admin")`
- **Dependency:** `exceljs` library for Excel file generation

### Usage Examples

```bash
# Export all enquiries
curl -X GET "http://localhost:5000/api/internal/enquiry/export" \
  -H "Authorization: Bearer <jwt_token>" \
  --output enquiries.xlsx

# Export with status filter
curl -X GET "http://localhost:5000/api/internal/enquiry/export?status=unread" \
  -H "Authorization: Bearer <jwt_token>" \
  --output unread-enquiries.xlsx

# Export with multiple filters
curl -X GET "http://localhost:5000/api/internal/enquiry/export?status=read&source=website&is_action_taken=true&startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer <jwt_token>" \
  --output filtered-enquiries.xlsx
```
