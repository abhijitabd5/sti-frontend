import httpClient from '@/services/utils/httpClient';

class TransactionCategoriesApi {
  // Get transaction categories by type
  async getTransactionCategories(type = 'expense') {
    try {
      const query = new URLSearchParams();
      query.append('type', type);

      const response = await httpClient.get(`/internal/transaction-categories?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction categories:', error);
      throw error;
    }
  }

  // Get expense categories (shorthand)
  async getExpenseCategories() {
    return this.getTransactionCategories('expense');
  }

  // Get income categories (shorthand)
  async getIncomeCategories() {
    return this.getTransactionCategories('income');
  }

  // Get categories with transaction amounts for dashboard charts
  async getCategoriesWithAmounts(type = 'expense', params = {}) {
    try {
      const query = new URLSearchParams();
      query.append('type', type);
      
      // Add optional parameters
      if (params.period) query.append('period', params.period);
      if (params.from) query.append('from', params.from);
      if (params.to) query.append('to', params.to);
      if (params.limit) query.append('limit', params.limit);

      const response = await httpClient.get(`/internal/transaction-categories/with-amounts?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories with amounts:', error);
      throw error;
    }
  }

  // Create new transaction category
  async createTransactionCategory(data) {
    try {
      const response = await httpClient.post('/internal/transaction-categories', data);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction category:', error);
      throw error;
    }
  }

  // Update transaction category
  async updateTransactionCategory(id, data) {
    try {
      const response = await httpClient.put(`/internal/transaction-categories/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating transaction category:', error);
      throw error;
    }
  }

  // Delete transaction category
  async deleteTransactionCategory(id) {
    try {
      const response = await httpClient.delete(`/internal/transaction-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting transaction category:', error);
      throw error;
    }
  }
}

export default new TransactionCategoriesApi();