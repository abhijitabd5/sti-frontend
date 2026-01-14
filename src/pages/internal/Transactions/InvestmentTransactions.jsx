import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import TransactionTable from './components/TransactionTable';
import TransactionFilters from './components/TransactionFilters';
import Toast from '@/components/ui/Internal/Toast/Toast';
import useToast from '@/hooks/useToast';
import transactionApi from '@/services/api/transactionApi';
import TransactionCategoryApi from '@/services/api/transactionCategoryApi';

// Icons
import { 
  PlusIcon
} from '@heroicons/react/24/outline';

const InvestmentTransactions = () => {
  const navigate = useNavigate();
  
  // Toast notifications
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  // Hardcoded transaction type
  const transactionType = 'investment';
  
  // State management
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    date_from: '',
    date_to: '',
    payment_mode: ''
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });

  // Load data on component mount and when filters change
  useEffect(() => {
    loadTransactions();
  }, [filters, pagination.current_page]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      
      const params = {
        type: transactionType,
        ...filters,
        page: pagination.current_page,
        limit: pagination.per_page
      };

      const response = await transactionApi.getTransactions(params);
      if (response.success) {
        setTransactions(response.data);
        setPagination(response.pagination);
      } else {
        showError(response.message || 'Failed to load investment transactions');
      }
    } catch (error) {
      console.error('Error loading investment transactions:', error);
      showError('An error occurred while loading investment transactions');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      
      const response = await TransactionCategoryApi.getTransactionCategories({ 
        type: transactionType,
        limit: 100 // Get all categories
      });
      if (response.success) {
        setCategories(response.data);
      } else {
        showError(response.message || 'Failed to load investment categories');
      }
    } catch (error) {
      console.error('Error loading investment categories:', error);
      showError('An error occurred while loading investment categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  const handleAddTransaction = () => {
    navigate(`/admin/transactions/create?type=${transactionType}`);
  };

  const handleViewTransaction = (transactionId) => {
    navigate(`/admin/transactions/${transactionId}`);
  };

  const handleEditTransaction = (transactionId) => {
    navigate(`/admin/transactions/edit/${transactionId}`);
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      const response = await transactionApi.deleteTransaction(transactionId);
      if (response.success) {
        loadTransactions();
        showSuccess('Investment transaction deleted successfully');
      } else {
        showError(response.message || 'Failed to delete investment transaction');
      }
    } catch (error) {
      console.error('Error deleting investment transaction:', error);
      showError('An error occurred while deleting the investment transaction');
    }
  };

  const handleExport = async () => {
    try {
      const params = {
        type: transactionType,
        category_id: filters.category_id,
        date_from: filters.date_from,
        date_to: filters.date_to
      };
      
      // Call export API (file download is handled in the API)
      const response = await transactionApi.exportTransactions(params);
      
      if (response.success) {
        showSuccess('Investment transactions exported successfully');
      } else {
        showError(response.message || 'Failed to export investment transactions');
      }
    } catch (error) {
      console.error('Error exporting investment transactions:', error);
      showError('An error occurred while exporting investment transactions');
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Investment Transactions
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage investment transactions
          </p>
        </div>

        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <button
            onClick={handleAddTransaction}
            className="btn bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 shadow-lg"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Investment
          </button>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        categoriesLoading={categoriesLoading}
        transactionType={transactionType}
        onExport={handleExport}
        showPaymentMode={true}
      />

      {/* Table */}
      <TransactionTable
        transactions={transactions}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onView={handleViewTransaction}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        transactionType={transactionType}
        onAddTransaction={handleAddTransaction}
      />

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </AdminLayout>
  );
};

export default InvestmentTransactions;
