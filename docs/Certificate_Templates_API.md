# Certificate Templates API Documentation

Base URL: `/api/internal/certificate-templates`

**Authentication Required**: Yes (JWT Bearer Token)  
**Roles Allowed**: `super_admin`, `admin`

---

## Endpoints

### 1. List All Templates

**GET** `/api/internal/certificate-templates`

Get all certificate templates with filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, use 'all' or -1 for all records)
- `search` (string, optional): Search by name, slug, or description
- `is_active` (boolean, optional): Filter by active status
- `template_type` (string, optional): Filter by type (course, completion, participation, achievement)
- `course_id` (number, optional): Filter by course ID
- `sortBy` (string, optional): Sort field (default: display_order)
- `sortOrder` (string, optional): Sort order ASC/DESC (default: ASC)

**Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Standard Course Certificate",
      "slug": "standard-course-certificate-abc-xyz",
      "description": "Default template for course completion",
      "template_type": "completion",
      "template_image_path": "http://localhost:5000/uploads/certificates/templates/template-image.png",
      "field_positions": {
        "studentName": { "x": 400, "y": 250, "fontSize": 20, "align": "center" },
        "courseTitle": { "x": 400, "y": 320, "fontSize": 18, "align": "center" }
      },
      "font_family": "Helvetica",
      "font_sizes": { "title": 24, "name": 20, "body": 14 },
      "text_colors": { "title": "#000000", "name": "#1a1a1a" },
      "course_id": null,
      "is_default": true,
      "is_active": true,
      "display_order": 0,
      "course": null,
      "created_by": 1,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
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
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 2. Get Template Statistics

**GET** `/api/internal/certificate-templates/stats`

Get statistics about certificate templates.

**Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "total_templates": 5,
    "active_templates": 4,
    "inactive_templates": 1,
    "default_template": {
      "id": 1,
      "name": "Standard Course Certificate"
    },
    "templates_by_type": [
      { "template_type": "completion", "count": 3 },
      { "template_type": "participation", "count": 2 }
    ]
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 3. Get Template by ID

**GET** `/api/internal/certificate-templates/:id`

Get a specific certificate template by ID.

**URL Parameters:**
- `id` (number, required): Template ID

**Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "name": "Standard Course Certificate",
    "slug": "standard-course-certificate-abc-xyz",
    "description": "Default template for course completion",
    "template_type": "completion",
    "template_image_path": "http://localhost:5000/uploads/certificates/templates/template-image.png",
    "field_positions": {
      "studentName": { "x": 400, "y": 250, "fontSize": 20, "align": "center" },
      "courseTitle": { "x": 400, "y": 320, "fontSize": 18, "align": "center" }
    },
    "font_family": "Helvetica",
    "font_sizes": { "title": 24, "name": 20, "body": 14 },
    "text_colors": { "title": "#000000", "name": "#1a1a1a" },
    "course_id": null,
    "is_default": true,
    "is_active": true,
    "display_order": 0,
    "course": null,
    "created_by": 1,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

### 4. Create Template

**POST** `/api/internal/certificate-templates/create`

Create a new certificate template.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `name` (string, required): Template name
- `description` (string, optional): Template description
- `template_type` (string, required): Type (course, completion, participation, achievement)
- `template_image` (file, required): Template image file (PNG, JPG, WEBP)
- `field_positions` (JSON string, optional): Field positions for PDF overlay
- `font_family` (string, optional): Font family name
- `font_sizes` (JSON string, optional): Font sizes configuration
- `text_colors` (JSON string, optional): Text colors configuration
- `course_id` (number, optional): Associated course ID
- `is_default` (boolean, optional): Set as default template
- `is_active` (boolean, optional): Active status (default: true)
- `display_order` (number, optional): Display order (default: 0)

**Example Request:**
```javascript
const formData = new FormData();
formData.append('name', 'Premium Certificate');
formData.append('template_type', 'completion');
formData.append('template_image', fileInput.files[0]);
formData.append('field_positions', JSON.stringify({
  studentName: { x: 400, y: 250, fontSize: 20, align: "center" },
  courseTitle: { x: 400, y: 320, fontSize: 18, align: "center" }
}));
formData.append('is_default', 'false');
formData.append('is_active', 'true');
```

**Response:**
```json
{
  "success": true,
  "message": "Certificate template created successfully",
  "data": {
    "id": 2,
    "name": "Premium Certificate",
    "slug": "premium-certificate-abc-xyz",
    "template_type": "completion",
    "template_image_path": "uploads/certificates/templates/20250115120000-premium-certificate-abc.png",
    "is_default": false,
    "is_active": true
  },
  "timestamp": "2025-01-15T12:00:00.000Z"
}
```

---

### 5. Update Template

**PUT** `/api/internal/certificate-templates/edit/:id`

Update an existing certificate template.

**URL Parameters:**
- `id` (number, required): Template ID

**Content-Type:** `multipart/form-data`

**Form Fields:** (All optional, only send fields to update)
- `name` (string): Template name
- `description` (string): Template description
- `template_type` (string): Type
- `template_image` (file): New template image file
- `old_template_image` (string): Path to old image (for deletion)
- `field_positions` (JSON string): Field positions
- `font_family` (string): Font family
- `font_sizes` (JSON string): Font sizes
- `text_colors` (JSON string): Text colors
- `course_id` (number): Course ID
- `is_default` (boolean): Default status
- `is_active` (boolean): Active status
- `display_order` (number): Display order

**Response:**
```json
{
  "success": true,
  "message": "Certificate template updated successfully",
  "data": {
    "id": 2,
    "name": "Premium Certificate Updated",
    "slug": "premium-certificate-updated-abc-xyz",
    "is_active": true
  },
  "timestamp": "2025-01-15T12:30:00.000Z"
}
```

---

### 6. Delete Template

**DELETE** `/api/internal/certificate-templates/delete/:id`

Soft delete a certificate template.

**URL Parameters:**
- `id` (number, required): Template ID

**Response:**
```json
{
  "success": true,
  "message": "Certificate template deleted successfully",
  "data": null,
  "timestamp": "2025-01-15T13:00:00.000Z"
}
```

---

### 7. Toggle Template Status

**PATCH** `/api/internal/certificate-templates/toggle-status/:id`

Toggle the active status of a template.

**URL Parameters:**
- `id` (number, required): Template ID

**Response:**
```json
{
  "success": true,
  "message": "Template activated successfully",
  "data": {
    "id": 2,
    "is_active": true
  },
  "timestamp": "2025-01-15T13:30:00.000Z"
}
```

---

### 8. Preview Template

**GET** `/api/internal/certificate-templates/:id/preview`

Get template details for preview.

**URL Parameters:**
- `id` (number, required): Template ID

**Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "name": "Standard Course Certificate",
    "template_image_path": "http://localhost:5000/uploads/certificates/templates/template-image.png",
    "field_positions": {
      "studentName": { "x": 400, "y": 250, "fontSize": 20, "align": "center" }
    }
  },
  "timestamp": "2025-01-15T14:00:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "name": "name is required",
    "template_image": "Template image is required"
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Certificate template not found",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

## Notes

1. **Template Image**: Must be a high-quality image (PNG/JPG) in landscape orientation (A4 landscape recommended: 842x595 pixels or higher)

2. **Field Positions**: JSON object defining where dynamic content should be placed on the certificate:
   ```json
   {
     "studentName": { "x": 400, "y": 250, "fontSize": 20, "align": "center" },
     "courseTitle": { "x": 400, "y": 320, "fontSize": 18, "align": "center" },
     "certificateNumber": { "x": 70, "y": 500, "fontSize": 10, "align": "left" },
     "issueDate": { "x": 700, "y": 500, "fontSize": 10, "align": "right" }
   }
   ```

3. **Default Template**: Only one template can be set as default. Setting a new template as default will automatically unset the previous default.

4. **Soft Delete**: Deleted templates are not permanently removed and can be restored if needed.

5. **Course Association**: Templates can be associated with specific courses or left as general templates (course_id = null).
