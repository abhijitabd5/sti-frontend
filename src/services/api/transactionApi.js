import httpClient from '@/services/utils/httpClient';

class TransactionApi {
  // Get all transactions
  async getTransactions(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add search parameter
      if (params.search) {
        queryParams.append('search', params.search);
      }
      
      // Add type filter
      if (params.type) {
        queryParams.append('type', params.type);
      }
      
      // Add category filter
      if (params.category_id) {
        queryParams.append('category_id', params.category_id);
      }
      
      // Add date range filters
      if (params.date_from) {
        queryParams.append('date_from', params.date_from);
      }
      if (params.date_to) {
        queryParams.append('date_to', params.date_to);
      }
      
      // Add pagination parameters
      queryParams.append('page', params.page || 1);
      queryParams.append('limit', params.limit || 10);
      
      const response = await httpClient.get(`/internal/transactions?${queryParams}`);
      
      if (response.data.success) {
        // Map pagination to match frontend expectations
        const pagination = response.data.pagination;
        return {
          success: true,
          data: response.data.data,
          pagination: {
            current_page: pagination.page,
            per_page: pagination.limit,
            total: pagination.total,
            last_page: pagination.totalPages,
            from: ((pagination.page - 1) * pagination.limit) + 1,
            to: Math.min(pagination.page * pagination.limit, pagination.total)
          },
          message: response.data.message || "Transactions retrieved successfully"
        };
      }
      
      return {
        success: false,
        data: [],
        message: response.data.message || "Failed to retrieve transactions"
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Error retrieving transactions"
      };
    }
  }
  
  // Get single transaction by ID
  async getTransactionById(id) {
    try {
      const response = await httpClient.get(`/internal/transactions/view/${id}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || "Transaction retrieved successfully"
        };
      }
      
      return {
        success: false,
        data: null,
        message: response.data.message || "Transaction not found"
      };
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Error retrieving transaction"
      };
    }
  }
  
  // Create new transaction
  async createTransaction(transactionData) {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      
      // Add all transaction fields to FormData
      Object.keys(transactionData).forEach(key => {
        if (transactionData[key] !== null && transactionData[key] !== undefined && transactionData[key] !== '') {
          if (key === 'attachment' && transactionData[key] instanceof File) {
            formData.append('attachment', transactionData[key]);
          } else {
            formData.append(key, transactionData[key]);
          }
        }
      });
      
      // Debug logging
      console.log('Creating transaction with data:', transactionData);
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value instanceof File ? `File: ${value.name}` : value);
      }
      
      const response = await httpClient.post('/internal/transactions/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || "Transaction created successfully"
        };
      }
      
      return {
        success: false,
        data: null,
        message: response.data.message || "Failed to create transaction"
      };
    } catch (error) {
      console.error('Error creating transaction:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
      let errorMessage = "Error creating transaction";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors.join(', ');
        } else if (typeof validationErrors === 'object') {
          errorMessage = Object.values(validationErrors).flat().join(', ');
        }
      }
      
      return {
        success: false,
        data: null,
        message: errorMessage
      };
    }
  }
  
  // Update existing transaction
  async updateTransaction(id, transactionData) {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      
      // Add all transaction fields to FormData
      Object.keys(transactionData).forEach(key => {
        if (transactionData[key] !== null && transactionData[key] !== undefined && transactionData[key] !== '') {
          if (key === 'attachment' && transactionData[key] instanceof File) {
            formData.append('attachment', transactionData[key]);
          } else {
            formData.append(key, transactionData[key]);
          }
        }
      });
      
      const response = await httpClient.put(`/internal/transactions/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || "Transaction updated successfully"
        };
      }
      
      return {
        success: false,
        data: null,
        message: response.data.message || "Failed to update transaction"
      };
    } catch (error) {
      console.error('Error updating transaction:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Error updating transaction"
      };
    }
  }
  
  // Delete transaction
  async deleteTransaction(id) {
    try {
      const response = await httpClient.delete(`/internal/transactions/delete/${id}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || "Transaction deleted successfully"
        };
      }
      
      return {
        success: false,
        data: null,
        message: response.data.message || "Failed to delete transaction"
      };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Error deleting transaction"
      };
    }
  }
}

export default new TransactionApi();