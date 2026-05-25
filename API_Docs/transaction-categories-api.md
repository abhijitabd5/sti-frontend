# Transaction Categories API Documentation

## Overview
Transaction categories are used to organize income and expense transactions. Categories have a type (income/expense), display order, and can be activated/deactivated.

**Authentication Required**: All endpoints require JWT authentication and admin/super_admin role.

**Base URL**: `{{base_url}}/api/internal/transaction-categories`

---

## 1. Get All Transaction Categories

**Method**: `GET`

**Endpoint**: `/api/internal/transaction-categories`

**Query Parameters**:
- `search` (optional): Search by category name
- `type` (optional): Filter by type (`income` or `expense`)
- `is_active` (optional): Filter by active status (`true` or `false`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field (default: `display_order`)
- `sortOrder` (optional): Sort direction (`ASC` or `DESC`, default: `ASC`)

**Request Payload**: None

**Success Response** (200):
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 1,
            "name": "Course Fee",
            "slug": "course-fee",
            "type": "income",
            "is_active": true,
            "display_order": 1,
            "created_by": 1,
            "updated_by": [],
            "is_deleted": false,
            "deleted_by": null,
            "createdAt": "2025-09-07T19:00:20.000Z",
            "updatedAt": "2025-09-07T19:00:20.000Z",
            "deletedAt": null
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 1,
        "totalItems": 1,
        "itemsPerPage": 10
    },
    "timestamp": "2025-10-04T17:26:15.076Z"
}
```

**Error Response** (500):
```json
{
    "success": false,
    "message": "Failed to fetch transaction categories: [error details]",
    "timestamp": "2025-10-04T17:26:15.076Z"
}
```

---

## 2. Get Category by ID

**Method**: `GET`

**Endpoint**: `/api/internal/transaction-categories/view/:id`

**URL Parameters**:
- `id` (required): Category ID

**Request Payload**: None

**Success Response** (200):
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "id": 1,
        "name": "Course Fee",
        "slug": "course-fee",
        "type": "income",
        "is_active": true,
        "display_order": 1,
        "created_by": 1,
        "updated_by": [],
        "is_deleted": false,
        "deleted_by": null,
        "createdAt": "2025-09-07T19:00:20.000Z",
        "updatedAt": "2025-09-07T19:00:20.000Z",
        "deletedAt": null
    },
    "timestamp": "2025-10-04T17:26:15.076Z"
}
```

**Error Response** (404):
```json
{
    "success": false,
    "message": "Not found",
    "timestamp": "2025-10-04T17:26:15.076Z"
}
```

---

## 3. Get Category by Slug

**Method**: `GET`

**Endpoint**: `/api/internal/transaction-categories/view/slug/:slug`

**URL Parameters**:
- `slug` (required): Category slug

**Request Payload**: None

**Success Response** (200):
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "id": 1,
        "name": "Course Fee",
        "slug": "course-fee",
        "type": "income",
        "is_active": true,
        "display_order": 1,
        "created_by": 1,
        "updated_by": [],
        "is_deleted": false,
        "deleted_by": null,
        "createdAt": "2025-09-07T19:00:20.000Z",
        "updatedAt": "2025-09-07T19:00:20.000Z",
        "deletedAt": null
    },
    "timestamp": "2025-10-04T17:26:15.076Z"
}
```

**Error Response** (404):
```json
{
    "success": false,
    "message": "Not found",
    "timestamp": "2025-10-04T17:26:15.076Z"
}
```

---

## 4. Get Category Statistics

**Method**: `GET`

**Endpoint**: `/api/internal/transaction-categories/stats`

**Request Payload**: None

**Success Response** (200):
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "totalCategories": 10,
        "activeCategories": 8,
        "inactiveCategories": 2,
        "incomeCategories": 5,
        "expenseCategories": 5
    },
    "timestamp": "2025-10-04T17:26:15.076Z"
}
```

**Error Response** (500):
```json
{
    "success": false,
    "message": "Failed to fetch transaction category statistics: [error details]",
    "timestamp": "2025-10-04T17:26:15.076Z"
}
```

---

## 5. Check Category Usage

**Method**: `GET`

**Endpoint**: `/api/internal/transaction-categories/usage/:id`

**URL Parameters**:
- `id` (required): Category ID

**Request Payload**: None

**Success Response** (200):
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "categoryId": 1,
        "categoryName": "Course Fee",
        "hasLinkedTransactions": true,
        "canDelete": false,
        "transactionCount": 15
    },
    "timestamp": "2025-10-04T17:26:15.076Z"
}
```

**Error Response** (404):
```json
{
    "success": false,
    "message": "Not found",
    "timestamp": "2025-10-04T17:26:15.076Z"
}
```

---

## 6. Create Transaction Category

**Method**: `POST`

**Endpoint**: `/api/internal/transaction-categories/create`

**Request Payload**:
```json
{
  "name": "Fuel Expense",
  "type": "expense",
  "display_order": 5
}
```

**Mandatory Fields**:
- `name` (string, min 2 characters): Category name
- `type` (string): Category type - must be `income` or `expense`

**Optional Fields**:
- `display_order` (number): Display order (auto-generated if not provided)

**Success Response** (201):
```json
{
    "success": true,
    "message": "Created successfully",
    "data": {
        "id": 3,
        "name": "Fuel Expense",
        "slug": "fuel-expense",
        "type": "expense",
        "is_active": true,
        "display_order": 5,
        "created_by": 1,
        "updated_by": [],
        "is_deleted": false,
        "deleted_by": null,
        "createdAt": "2025-10-04T17:31:31.537Z",
        "updatedAt": "2025-10-04T17:31:31.537Z",
        "deletedAt": null
    },
    "timestamp": "2025-10-04T17:31:31.552Z"
}
```

**Error Response** (400):
```json
{
    "success": false,
    "message": "Category name already exists",
    "timestamp": "2025-10-04T17:31:31.552Z"
}
```

---

## 7. Update Transaction Category

**Method**: `PUT`

**Endpoint**: `/api/internal/transaction-categories/edit/:id`

**URL Parameters**:
- `id` (required): Category ID

**Request Payload**:
```json
{
  "name": "Updated Category Name",
  "type": "income",
  "display_order": 3
}
```

**Optional Fields** (at least one required):
- `name` (string, min 2 characters): Category name
- `type` (string): Category type - must be `income` or `expense`
- `display_order` (number): Display order

**Success Response** (200):
```json
{
    "success": true,
    "message": "Updated successfully",
    "data": {
        "id": 1,
        "name": "Updated Category Name",
        "slug": "updated-category-name",
        "type": "income",
        "is_active": true,
        "display_order": 3,
        "created_by": 1,
        "updated_by": [
            {
                "id": "1",
                "timestamp": "2025-10-04T17:35:48.000Z"
            }
        ],
        "is_deleted": false,
        "deleted_by": null,
        "createdAt": "2025-09-07T19:00:20.000Z",
        "updatedAt": "2025-10-04T17:35:48.000Z",
        "deletedAt": null
    },
    "timestamp": "2025-10-04T17:35:49.063Z"
}
```

**Error Response** (404):
```json
{
    "success": false,
    "message": "Not found",
    "timestamp": "2025-10-04T17:35:49.063Z"
}
```

---

## 8. Reorder Categories

**Method**: `PUT`

**Endpoint**: `/api/internal/transaction-categories/reorder`

**Request Payload**:
```json
{
  "orders": [
    {
      "id": 1,
      "display_order": 1
    },
    {
      "id": 2,
      "display_order": 2
    },
    {
      "id": 3,
      "display_order": 3
    }
  ]
}
```

**Mandatory Fields**:
- `orders` (array): Array of category order objects
  - `id` (number): Category ID
  - `display_order` (number): New display order

**Success Response** (200):
```json
{
    "success": true,
    "message": "Transaction categories reordered successfully",
    "data": null,
    "timestamp": "2025-10-04T17:40:15.076Z"
}
```

**Error Response** (400):
```json
{
    "success": false,
    "message": "Transaction category with ID 5 not found",
    "timestamp": "2025-10-04T17:40:15.076Z"
}
```

---

## 9. Delete Transaction Category

**Method**: `DELETE`

**Endpoint**: `/api/internal/transaction-categories/delete/:id`

**URL Parameters**:
- `id` (required): Category ID

**Request Payload**: None

**Success Response** (200):
```json
{
    "success": true,
    "message": "Deleted successfully",
    "data": {
        "id": 3,
        "name": "Tire Expense",
        "slug": "tire-expense",
        "type": "expense",
        "is_active": true,
        "display_order": 5,
        "created_by": 1,
        "updated_by": [],
        "is_deleted": false,
        "deleted_by": null,
        "createdAt": "2025-10-04T17:31:31.537Z",
        "updatedAt": "2025-10-04T17:31:31.537Z",
        "deletedAt": null
    },
    "timestamp": "2025-10-04T17:39:18.927Z"
}
```

**Error Response** (400):
```json
{
    "success": false,
    "message": "Cannot delete category with linked transactions",
    "timestamp": "2025-10-04T17:39:18.927Z"
}
```

---

## Notes

1. **Slug Generation**: Slugs are automatically generated from the category name and guaranteed to be unique
2. **Display Order**: If not provided during creation, the system automatically assigns the next available order
3. **Deletion Protection**: Categories with linked transactions cannot be deleted
4. **Audit Trail**: All operations track `created_by` and `updated_by` with user IDs and timestamps
5. **Soft Deletes**: Categories use soft delete (paranoid mode) with `deletedAt` timestamp