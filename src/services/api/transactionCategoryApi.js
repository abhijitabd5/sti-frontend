import httpClient from '@/services/utils/httpClient';

class TransactionCategoryApi {
  async getTransactionCategories(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add search parameter
      if (params.search) {
        queryParams.append("search", params.search);
      }

      // Add pagination parameters
      queryParams.append("page", params.page || 1);
      queryParams.append("limit", params.limit || 10);

      const response = await httpClient.get(
        `/internal/transaction-categories?${queryParams}`
      );

      if (response.data.success) {
        // Filter by type on frontend if needed (since API doesn't seem to support type filtering)
        let data = response.data.data;
        if (params.type && params.type !== "all") {
          data = data.filter((category) => category.type === params.type);
        }

        return {
          success: true,
          data: data,
          pagination: response.data.pagination || {
            current_page: parseInt(params.page) || 1,
            per_page: parseInt(params.limit) || 10,
            total: data.length,
            last_page: Math.ceil(data.length / (parseInt(params.limit) || 10)),
          },
          message:
            response.data.message ||
            "Transaction categories retrieved successfully",
        };
      }

      return {
        success: false,
        data: [],
        message:
          response.data.message || "Failed to retrieve transaction categories",
      };
    } catch (error) {
      console.error("Error fetching transaction categories:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Error retrieving transaction categories",
      };
    }
  }

  async getTransactionCategoryById(id) {
    try {
      const response = await httpClient.get(
        `/internal/transaction-categories/${id}`
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message:
            response.data.message ||
            "Transaction category retrieved successfully",
        };
      }

      return {
        success: false,
        data: null,
        message: response.data.message || "Transaction category not found",
      };
    } catch (error) {
      console.error("Error fetching transaction category:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Error retrieving transaction category",
      };
    }
  }

  async createTransactionCategory(categoryData) {
    try {
      const payload = {
        name: categoryData.name,
        type: categoryData.type,
      };

      const response = await httpClient.post(
        "/internal/transaction-categories",
        payload
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message:
            response.data.message ||
            "Transaction category created successfully",
        };
      }

      return {
        success: false,
        data: null,
        message:
          response.data.message || "Failed to create transaction category",
      };
    } catch (error) {
      console.error("Error creating transaction category:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Error creating transaction category",
      };
    }
  }

  async updateTransactionCategory(id, categoryData) {
    try {
      const payload = {
        name: categoryData.name,
        type: categoryData.type,
      };

      const response = await httpClient.put(
        `/internal/transaction-categories/${id}`,
        payload
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message:
            response.data.message ||
            "Transaction category updated successfully",
        };
      }

      return {
        success: false,
        data: null,
        message:
          response.data.message || "Failed to update transaction category",
      };
    } catch (error) {
      console.error("Error updating transaction category:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Error updating transaction category",
      };
    }
  }

  async deleteTransactionCategory(id) {
    try {
      const response = await httpClient.delete(
        `/internal/transaction-categories/${id}`
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message:
            response.data.message ||
            "Transaction category deleted successfully",
        };
      }

      return {
        success: false,
        data: null,
        message:
          response.data.message || "Failed to delete transaction category",
      };
    } catch (error) {
      console.error("Error deleting transaction category:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Error deleting transaction category",
      };
    }
  }
}

export default new TransactionCategoryApi();
