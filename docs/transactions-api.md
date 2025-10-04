### Get All transactions API
- Method : GET
- Endpoint : {{base_url}}/api/internal/transactions?search=&page=1&limit=10
- Request Payload : No Payload, Just Params
- Response Payload :
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 8,
            "type": "income",
            "amount": "2000.00",
            "transaction_date": "2025-09-26",
            "payment_mode": "upi",
            "description": "Additional payment for Excavator Training - Beginner",
            "payment_ref_num": null,
            "payment_ref_type": "other",
            "payer_name": "Saiffuddin Sheikh",
            "payer_contact": "9834892082",
            "payer_bank_name": null,
            "payer_account_number": null,
            "payer_upi_id": null,
            "payee_name": null,
            "payee_contact": null,
            "payee_bank_name": null,
            "payee_account_number": null,
            "payee_upi_id": null,
            "attachment_path": null,
            "attachment_type": "other",
            "reference_note": null,
            "createdAt": "2025-09-26T07:39:04.000Z",
            "updatedAt": "2025-09-26T07:39:04.000Z",
            "deletedAt": null,
            "expense_for_user": null,
            "category_id": 1,
            "student_id": 1,
            "course_id": 1,
            "enrollment_id": 1,
            "category": {
                "id": 1,
                "name": "Course Fee",
                "slug": "course-fee"
            },
            "creator": {
                "id": 1,
                "first_name": "Abhijit",
                "last_name": "Abd",
                "role": "super_admin"
            },
            "expenseForUser": null
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 7,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    },
    "timestamp": "2025-10-04T18:31:46.549Z"
}

### Get Single Transaction by ID API
- Method : GET
- Endpoint : {{base_url}}/api/internal/transactions/view/:id
- Request Payload : No Payload, just ID as Params
- Response Payload :
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "id": 8,
        "type": "income",
        "amount": "2000.00",
        "transaction_date": "2025-09-26",
        "payment_mode": "upi",
        "description": "Additional payment for Excavator Training - Beginner",
        "payment_ref_num": null,
        "payment_ref_type": "other",
        "payer_name": "Saiffuddin Sheikh",
        "payer_contact": "9834892082",
        "payer_bank_name": null,
        "payer_account_number": null,
        "payer_upi_id": null,
        "payee_name": null,
        "payee_contact": null,
        "payee_bank_name": null,
        "payee_account_number": null,
        "payee_upi_id": null,
        "attachment_path": null,
        "attachment_type": "other",
        "reference_note": null,
        "created_by": 1,
        "createdAt": "2025-09-26T07:39:04.000Z",
        "updatedAt": "2025-09-26T07:39:04.000Z",
        "expense_for_user": null,
        "category_id": 1,
        "student_id": 1,
        "course_id": 1,
        "enrollment_id": 1,
        "category": {
            "id": 1,
            "name": "Updated Category",
            "slug": "updated-category"
        },
        "creator": {
            "id": 1,
            "first_name": "Abhijit",
            "last_name": "Abd",
            "role": "super_admin",
            "mobile": "9175113022"
        },
        "expenseForUser": null
    },
    "timestamp": "2025-10-04T18:50:51.723Z"
}


### Create Transaction API
- Method : POST (Multipart Form Data)
- Endpoint : {{base_url}}/api/internal/transactions/create
- Request Payload : Form Data fields are type, category_id, amount, transaction_date, payment_mode, 
description, payment_ref_num, payment_ref_type, payer_name, payer_contact, payer_bank_name, payer_account_number, payer_upi_id, payee_name, payee_contact, payee_bank_name, payee_account_number, payee_upi_id, reference_note, expense_for_user, attachment, attachment_type

- Response Payload :

{
    "success": true,
    "message": "Created successfully",
    "data": {
        "id": 13,
        "type": "income",
        "amount": "5000.00",
        ...Other Data,
        "category": {
            "id": 1,
            "name": "Course Fee",
            "slug": "course-fee"
        },
        "creator": {
            "id": 1,
            "first_name": "Abhijit",
            "last_name": "Abd",
            "role": "super_admin",
            "mobile": "9175113022"
        },
        "expenseForUser": null
    },
    "timestamp": "2025-10-04T20:11:18.750Z"
}



**IMP Note** :
- 0) Only type, category_id, amount, transaction_date, payment_mode fields are mandatory
- 1) payment_mode values should be one from cash, cheque, upi, bank_transfer, card, net_banking, payment_gateway.
- 2) transaction_date should be sent in YYYY-MM-DD format
- 3) If you are sending attachment then strictly send attachment_type (values should be invoice or receipt or proof)
- 4) if you are sending payment_ref_num then strictly send payment_ref_type (values should be invoice or receipt or proof), payment_ref_num stands for Payment Reference Number
- 5) type should be either income or expense
- 6) Category id should be derived from selected category at time of form fill up.


### Update Transaction API
- Method : PUT (Form Data)
- Endpoint : {{base_url}}/api/internal/transactions/edit/:id
- Request Payload : Same as create transaction API
- Response Payload : 
{
    "success": true,
    "message": "Updated successfully",
    "data": {
        ...Data
    },
    "timestamp": "2025-10-04T20:22:33.743Z"
}


### Delete Transaction API
- Method : DELETE
- Endpoint : {{base_url}}/api/internal/transactions/delete/:id
- Request Payload : NO payload, just ID parameter
- Response Payload : 
{
    "success": true,
    "message": "Deleted successfully",
    "data": {
        ...Data
    },
    "timestamp": "2025-10-04T20:15:20.320Z"
}
