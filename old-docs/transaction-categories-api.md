### API
- Method :
- Endpoint :
- Request Payload :
- Response Payload :

### get All Transaction Categories API
- Method : GET
- Endpoint : {{base_url}}/api/internal/transaction-categories?search=&page=1&limit=10
- Request Payload : No Request Payload, Only Params
- Response Payload :
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 1,
            "name": "Course Fee",
            "slug": "course_fee",
            "type": "income",
            "is_active": true,
            "display_order": 0,
            "created_by": 1,
            "deleted_by": null,
            "createdAt": "2025-09-07T19:00:20.000Z",
            "updatedAt": "2025-09-07T19:00:20.000Z",
        }
    ],
    "timestamp": "2025-10-04T17:26:15.076Z"
}

### Create Transaction Category API
- Method : POST
- Endpoint : {{base_url}}/api/internal/transaction-categories
- Request Payload :
{
  "name": "Fuel Expense",
  "type": "expense"
}
- Response Payload :
{
    "success": true,
    "message": "Created successfully",
    "data": {
        "is_active": true,
        "is_deleted": false,
        "id": 3,
        "name": "Fuel Expense",
        "type": "expense",
        "slug": "fuel-expense",
        "updatedAt": "2025-10-04T17:31:31.537Z",
        "createdAt": "2025-10-04T17:31:31.537Z",
        "created_by": 1
    },
    "timestamp": "2025-10-04T17:31:31.552Z"
}

### Update Transaction Category API
- Method : PUT
- Endpoint : {{base_url}}/api/internal/transaction-categories/:id
- Request Payload :
{
  "name": "Updated Category",
  "type": "income"
}
- Response Payload :

{
    "success": true,
    "message": "Updated successfully",
    "data": {
        "id": 1,
        "name": "Updated Category",
        "slug": "updated-category",
        "type": "income",
        "is_active": true,
        "created_by": 1,
        "is_deleted": false,
        "createdAt": "2025-09-07T19:00:20.000Z",
        "updatedAt": "2025-10-04T17:35:48.000Z",

    },
    "timestamp": "2025-10-04T17:35:49.063Z"
}

### Delete Transaction Category API
- Method : DELETE
- Endpoint : {{base_url}}/api/internal/transaction-categories/:id
- Request Payload : No request payload, just params
- Response Payload :
{
    "success": true,
    "message": "Deleted successfully",
    "data": {
        "id": 3,
        "name": "Tire Expense",
        "slug": "tire-expense",
        "type": "expense",
    },
    "timestamp": "2025-10-04T17:39:18.927Z"
}