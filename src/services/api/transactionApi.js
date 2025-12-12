import httpClient from '@/services/utils/httpClient';
import { getTimestamp } from '@/utils/dateUtils';

class TransactionApi {
  // ============================================
  // CRUD Operations for Transactions
  // ============================================

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
      
      // Add category filter (API expects categoryId in camelCase)
      if (params.category_id) {
        queryParams.append('categoryId', params.category_id);
      }
      
      // Add payment mode filter
      if (params.payment_mode) {
        queryParams.append('paymentMode', params.payment_mode);
      }
      
      // Add date range filters (API expects dateFrom/dateTo in camelCase)
      if (params.date_from) {
        queryParams.append('dateFrom', params.date_from);
      }
      if (params.date_to) {
        queryParams.append('dateTo', params.date_to);
      }
      
      // Add deletedOnly filter for deleted transactions
      if (params.deletedOnly) {
        queryParams.append('deletedOnly', 'true');
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

  // ============================================
  // Analytics & Dashboard Methods
  // ============================================

  // Get category-wise transactions by type with optional date range
  async getCategoryWiseByType(type = 'expense', params = {}) {
    try {
      const query = new URLSearchParams();
      query.append('type', type);
      
      // Add optional date range parameters
      if (params.start_date) query.append('start_date', params.start_date);
      if (params.end_date) query.append('end_date', params.end_date);

      const response = await httpClient.get(`/internal/transactions/category-wise-by-type?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category-wise transactions:', error);
      throw error;
    }
  }

  // Get expense categories (shorthand)
  async getExpensesByCategory(params = {}) {
    return this.getCategoryWiseByType('expense', params);
  }

  // Get income categories (shorthand)
  async getIncomeByCategory(params = {}) {
    return this.getCategoryWiseByType('income', params);
  }

  // Get income vs expense data for bar chart
  async getIncomeVsExpense(params = {}) {
    try {
      const query = new URLSearchParams();
      
      // Add optional parameters
      if (params.period) query.append('period', params.period);
      if (params.from) query.append('from', params.from);
      if (params.to) query.append('to', params.to);

      const response = await httpClient.get(`/internal/transactions/income-vs-expense?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching income vs expense data:', error);
      throw error;
    }
  }

  // ============================================
  // Export Methods
  // ============================================

  // ============================================
  // Analytics & Dashboard Methods
  // ============================================

  // Get category-wise transactions by type with optional date range
  async getCategoryWiseByType(type = 'expense', params = {}) {
    try {
      const query = new URLSearchParams();
      query.append('type', type);
      
      // Add optional date range parameters
      if (params.start_date) query.append('start_date', params.start_date);
      if (params.end_date) query.append('end_date', params.end_date);

      const response = await httpClient.get(`/internal/transactions/category-wise-by-type?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category-wise transactions:', error);
      throw error;
    }
  }

  // Get expense categories (shorthand)
  async getExpensesByCategory(params = {}) {
    return this.getCategoryWiseByType('expense', params);
  }

  // Get income categories (shorthand)
  async getIncomeByCategory(params = {}) {
    return this.getCategoryWiseByType('income', params);
  }

  // Get income vs expense data for bar chart
  async getIncomeVsExpense(params = {}) {
    try {
      const query = new URLSearchParams();
      
      // Add optional parameters
      if (params.period) query.append('period', params.period);
      if (params.from) query.append('from', params.from);
      if (params.to) query.append('to', params.to);

      const response = await httpClient.get(`/internal/transactions/income-vs-expense?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching income vs expense data:', error);
      throw error;
    }
  }

  // ============================================
  // Export Methods
  // ============================================

  // Export transactions to Excel
  async exportTransactions(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add transaction type (required)
      queryParams.append('transaction_type', params.type || 'income');
      
      // Add category filter
      if (params.category_id) {
        queryParams.append('categoryId', params.category_id);
      }
      
      // Add date range filters
      if (params.date_from) {
        queryParams.append('dateFrom', params.date_from);
      }
      if (params.date_to) {
        queryParams.append('dateTo', params.date_to);
      }
      
      const response = await httpClient.get(`/internal/transactions/export?${queryParams}`, {
        responseType: 'blob' // Important for file download
      });
      
      // Extract filename from Content-Disposition header
      let filename = '';
      const contentDisposition = response.headers['content-disposition'];
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // Fallback: Generate timestamped filename using Indian timezone
      if (!filename) {
        const timestamp = getTimestamp();
        filename = `${params.type || 'income'}_transactions_export_${timestamp}.xlsx`;
      }
      
      // Create blob and download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return {
        success: true,
        message: "Transactions exported successfully"
      };
    } catch (error) {
      console.error('Error exporting transactions:', error);
      return {
        success: false,
        message: error.response?.data?.message || "Error exporting transactions"
      };
    }
  }
}

export default new TransactionApi();