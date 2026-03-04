# Certificate Template API Changes - Request/Response Payload

## Summary of Changes

Changed from generic font styling to separate static and dynamic content styling.

### Old Fields (Removed):
- `font_family` (STRING)
- `font_sizes` (JSON)
- `text_colors` (JSON)

### New Fields (Added):
- `static_font_family` (STRING)
- `static_font_size` (INTEGER)
- `static_text_color` (STRING)
- `dynamic_font_family` (STRING)
- `dynamic_font_size` (INTEGER)
- `dynamic_text_color` (STRING)

---

## API Endpoints

### 1. GET /api/internal/certificate-templates

**Query Parameters:** (No changes)
- `page`, `limit`, `search`, `is_active`, `template_type`, `course_id`, `sortBy`, `sortOrder`

**Response Payload - OLD:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Course Completion",
      "slug": "course-completion",
      "template_type": "course_completion",
      "template_image_path": "http://localhost:5000/uploads/templates/cert-bg.jpg",
      "field_positions": { ... },
      "font_family": "Arial",
      "font_sizes": {
        "student_name": 24,
        "course_name": 20
      },
      "text_colors": {
        "student_name": "#000000",
        "course_name": "#1a5490"
      },
      ...
    }
  ],
  "pagination": { ... }
}
```

**Response Payload - NEW:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Course Completion",
      "slug": "course-completion",
      "template_type": "course_completion",
      "template_image_path": "http://localhost:5000/uploads/templates/cert-bg.jpg",
      "field_positions": { ... },
      "static_font_family": "Times New Roman",
      "static_font_size": 14,
      "static_text_color": "#333333",
      "dynamic_font_family": "Arial",
      "dynamic_font_size": 24,
      "dynamic_text_color": "#000000",
      ...
    }
  ],
  "pagination": { ... }
}
```

---

### 2. GET /api/internal/certificate-templates/:id

**Response Payload - OLD:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "name": "Course Completion",
    "font_family": "Arial",
    "font_sizes": { "student_name": 24 },
    "text_colors": { "student_name": "#000000" },
    ...
  }
}
```

**Response Payload - NEW:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "name": "Course Completion",
    "static_font_family": "Times New Roman",
    "static_font_size": 14,
    "static_text_color": "#333333",
    "dynamic_font_family": "Arial",
    "dynamic_font_size": 24,
    "dynamic_text_color": "#000000",
    ...
  }
}
```

---

### 3. POST /api/internal/certificate-templates

**Request Payload - OLD:**
```json
{
  "name": "Course Completion Certificate",
  "slug": "course-completion-2024",
  "template_type": "course_completion",
  "template_image": "<file>",
  "field_positions": {
    "studentName": { "x": 400, "y": 250 }
  },
  "font_family": "Arial",
  "font_sizes": {
    "student_name": 24,
    "course_name": 20
  },
  "text_colors": {
    "student_name": "#000000",
    "course_name": "#1a5490"
  },
  "is_default": false,
  "is_active": true
}
```

**Request Payload - NEW:**
```json
{
  "name": "Course Completion Certificate",
  "slug": "course-completion-2024",
  "template_type": "course_completion",
  "template_image": "<file>",
  "field_positions": {
    "studentName": { "x": 400, "y": 250 }
  },
  "static_font_family": "Times New Roman",
  "static_font_size": 14,
  "static_text_color": "#333333",
  "dynamic_font_family": "Arial",
  "dynamic_font_size": 24,
  "dynamic_text_color": "#000000",
  "is_default": false,
  "is_active": true
}
```

**Response:** Same structure as GET by ID

---

### 4. PUT /api/internal/certificate-templates/:id

**Request Payload:** Same as POST (all fields optional except those being updated)

**Request Payload - OLD:**
```json
{
  "name": "Updated Template",
  "font_family": "Georgia",
  "font_sizes": {
    "student_name": 28
  }
}
```

**Request Payload - NEW:**
```json
{
  "name": "Updated Template",
  "static_font_family": "Georgia",
  "static_font_size": 16,
  "dynamic_font_size": 28
}
```

---

## Frontend Changes Required

### 1. Form Fields Update

**OLD Form Fields:**
```html
<input name="font_family" />
<textarea name="font_sizes"></textarea>  <!-- JSON -->
<textarea name="text_colors"></textarea> <!-- JSON -->
```

**NEW Form Fields:**
```html
<!-- Static Content Styling -->
<input name="static_font_family" placeholder="Times New Roman" />
<input name="static_font_size" type="number" placeholder="14" />
<input name="static_text_color" type="color" value="#333333" />

<!-- Dynamic Content Styling -->
<input name="dynamic_font_family" placeholder="Arial" />
<input name="dynamic_font_size" type="number" placeholder="24" />
<input name="dynamic_text_color" type="color" value="#000000" />
```

### 2. JavaScript Object Mapping

**OLD:**
```javascript
const templateData = {
  name: formData.name,
  font_family: formData.font_family,
  font_sizes: JSON.parse(formData.font_sizes),
  text_colors: JSON.parse(formData.text_colors)
};
```

**NEW:**
```javascript
const templateData = {
  name: formData.name,
  static_font_family: formData.static_font_family,
  static_font_size: parseInt(formData.static_font_size),
  static_text_color: formData.static_text_color,
  dynamic_font_family: formData.dynamic_font_family,
  dynamic_font_size: parseInt(formData.dynamic_font_size),
  dynamic_text_color: formData.dynamic_text_color
};
```

### 3. Display/Edit Component

**OLD:**
```javascript
// Display
<div>Font: {template.font_family}</div>
<div>Sizes: {JSON.stringify(template.font_sizes)}</div>

// Edit
<input 
  value={template.font_family} 
  onChange={(e) => setTemplate({...template, font_family: e.target.value})}
/>
```

**NEW:**
```javascript
// Display
<div>
  <h4>Static Content</h4>
  <p>Font: {template.static_font_family}</p>
  <p>Size: {template.static_font_size}px</p>
  <p>Color: {template.static_text_color}</p>
</div>
<div>
  <h4>Dynamic Content</h4>
  <p>Font: {template.dynamic_font_family}</p>
  <p>Size: {template.dynamic_font_size}px</p>
  <p>Color: {template.dynamic_text_color}</p>
</div>

// Edit
<input 
  value={template.static_font_family} 
  onChange={(e) => setTemplate({...template, static_font_family: e.target.value})}
/>
<input 
  type="number"
  value={template.static_font_size} 
  onChange={(e) => setTemplate({...template, static_font_size: parseInt(e.target.value)})}
/>
```

---

## Backend Changes Made

### Files Updated:

1. ✅ **Migration:** `src/migrations/20251105082000-create-certificate-template.js`
   - Updated to use new field structure

2. ✅ **Model:** `src/models/certificate-template.js`
   - Updated field definitions

3. ✅ **Controller:** `src/controllers/internal/CertificateTemplateController.js`
   - Updated JSON parsing (removed `font_sizes`, `text_colors`)
   - Added integer parsing for `static_font_size` and `dynamic_font_size`

4. ✅ **Service:** `src/services/CertificateTemplateService.js`
   - No changes needed (handles all fields generically)

5. ✅ **Repository:** `src/repositories/CertificateTemplateRepository.js`
   - No changes needed (handles all fields generically)

6. ✅ **Migration for Existing DBs:** `src/migrations/20260302000000-update-certificate-template-font-fields.js`
   - Created to update existing databases

---

## Testing Checklist

### Backend:
- [ ] Run migration on test database
- [ ] Create template with new fields
- [ ] Update template with new fields
- [ ] Verify old fields are removed from database
- [ ] Test GET endpoints return new field structure
- [ ] Test validation for integer fields

### Frontend:
- [ ] Update form to use new field names
- [ ] Update display components
- [ ] Update edit components
- [ ] Test create template flow
- [ ] Test update template flow
- [ ] Test field validation (integers, colors)
- [ ] Update any TypeScript interfaces/types

---

## Migration Steps

### For Development:
```bash
# Run migration
npm run migrate

# Or manually run SQL
mysql -u root -p your_database < migration.sql
```

### For Production:
1. Backup database
2. Run migration: `npm run migrate`
3. Verify data integrity
4. Deploy frontend changes
5. Test end-to-end

---

## Backward Compatibility

⚠️ **BREAKING CHANGE** - This is a breaking change for the API.

**Old API calls will fail** because:
- Old field names (`font_family`, `font_sizes`, `text_colors`) no longer exist
- Frontend must be updated simultaneously with backend

**Migration Strategy:**
1. Deploy backend with migration
2. Deploy frontend immediately after
3. No gradual rollout possible (breaking change)

---

## Default Values

If fields are not provided, use these defaults:

```javascript
{
  static_font_family: "Times New Roman",
  static_font_size: 14,
  static_text_color: "#333333",
  dynamic_font_family: "Arial",
  dynamic_font_size: 24,
  dynamic_text_color: "#000000"
}
```

---

## Example: Complete Request/Response

### Create Template Request:
```bash
POST /api/internal/certificate-templates
Content-Type: multipart/form-data

{
  "name": "Excellence Certificate",
  "template_type": "excellence",
  "template_image": <file>,
  "static_font_family": "Georgia",
  "static_font_size": 16,
  "static_text_color": "#2c3e50",
  "dynamic_font_family": "Helvetica",
  "dynamic_font_size": 26,
  "dynamic_text_color": "#1a1a1a",
  "field_positions": {
    "studentName": { "x": 400, "y": 250, "align": "center" },
    "courseName": { "x": 400, "y": 320, "align": "center" }
  },
  "is_default": false,
  "is_active": true
}
```

### Response:
```json
{
  "success": true,
  "message": "Certificate template created successfully",
  "data": {
    "id": 5,
    "name": "Excellence Certificate",
    "slug": "excellence-certificate",
    "template_type": "excellence",
    "template_image_path": "http://localhost:5000/uploads/templates/cert-5.jpg",
    "field_positions": {
      "studentName": { "x": 400, "y": 250, "align": "center" },
      "courseName": { "x": 400, "y": 320, "align": "center" }
    },
    "static_font_family": "Georgia",
    "static_font_size": 16,
    "static_text_color": "#2c3e50",
    "dynamic_font_family": "Helvetica",
    "dynamic_font_size": 26,
    "dynamic_text_color": "#1a1a1a",
    "course_id": null,
    "is_default": false,
    "is_active": true,
    "display_order": 0,
    "created_by": 1,
    "createdAt": "2026-03-02T10:30:00.000Z",
    "updatedAt": "2026-03-02T10:30:00.000Z"
  },
  "timestamp": "2026-03-02T10:30:00.000Z"
}
```
