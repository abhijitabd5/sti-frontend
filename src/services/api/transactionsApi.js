import httpClient from '@/services/utils/httpClient';

class TransactionsApi {
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
}

export default new TransactionsApi();