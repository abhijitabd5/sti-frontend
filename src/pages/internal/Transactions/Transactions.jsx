import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import TransactionTable from './components/TransactionTable';
import DeletedTransactionsTable from './components/DeletedTransactionsTable';
import TransactionFilters from './components/TransactionFilters';
import Toast from '@/components/ui/Internal/Toast/Toast';
import useToast from '@/hooks/useToast';
import transactionApi from '@/services/api/transactionApi';
import TransactionCategoryApi from '@/services/api/transactionCategoryApi';

// Icons
import { 
  PlusIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const Transactions = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Toast notifications
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'income');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  // Tab counts
  const [tabCounts, setTabCounts] = useState({
    income: 0,
    expense: 0,
    deleted: 0
  });
  
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
  }, [activeTab, filters, pagination.current_page]);

  useEffect(() => {
    loadCategories();
  }, [activeTab]);

  // Load counts for both tabs on mount
  useEffect(() => {
    loadTabCounts();
  }, []);

  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      
      // For deleted tab, use deletedOnly parameter
      if (activeTab === 'deleted') {
        const params = {
          ...filters,
          deletedOnly: true,
          page: pagination.current_page,
          limit: pagination.per_page
        };
        
        const response = await transactionApi.getTransactions(params);
        if (response.success) {
          setTransactions(response.data);
          setPagination(response.pagination);
          setTabCounts(prev => ({
            ...prev,
            deleted: response.pagination.total
          }));
        } else {
          showError(response.message || 'Failed to load deleted transactions');
        }
      } else {
        const params = {
          type: activeTab,
          ...filters,
          page: pagination.current_page,
          limit: pagination.per_page
        };

        const response = await transactionApi.getTransactions(params);
        if (response.success) {
          setTransactions(response.data);
          setPagination(response.pagination);
          // Update the count for the current tab
          setTabCounts(prev => ({
            ...prev,
            [activeTab]: response.pagination.total
          }));
        } else {
          showError(response.message || 'Failed to load transactions');
        }
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      showError('An error occurred while loading transactions');
    } finally {
      setLoading(false);
    }
  };

  const loadTabCounts = async () => {
    try {
      // Load income count
      const incomeResponse = await transactionApi.getTransactions({
        type: 'income',
        page: 1,
        limit: 1
      });
      
      // Load expense count
      const expenseResponse = await transactionApi.getTransactions({
        type: 'expense',
        page: 1,
        limit: 1
      });

      // Load deleted count
      const deletedResponse = await transactionApi.getTransactions({
        deletedOnly: true,
        page: 1,
        limit: 1
      });

      setTabCounts({
        income: incomeResponse.success ? incomeResponse.pagination.total : 0,
        expense: expenseResponse.success ? expenseResponse.pagination.total : 0,
        deleted: deletedResponse.success ? deletedResponse.pagination.total : 0
      });
    } catch (error) {
      console.error('Error loading tab counts:', error);
    }
  };

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      
      // For deleted tab, load all categories (both income and expense)
      if (activeTab === 'deleted') {
        const [incomeResponse, expenseResponse] = await Promise.all([
          TransactionCategoryApi.getTransactionCategories({ type: 'income', limit: 100 }),
          TransactionCategoryApi.getTransactionCategories({ type: 'expense', limit: 100 })
        ]);
        
        const allCategories = [
          ...(incomeResponse.success ? incomeResponse.data : []),
          ...(expenseResponse.success ? expenseResponse.data : [])
        ];
        setCategories(allCategories);
      } else {
        const response = await TransactionCategoryApi.getTransactionCategories({ 
          type: activeTab,
          limit: 100 // Get all categories
        });
        if (response.success) {
          setCategories(response.data);
        } else {
          showError(response.message || 'Failed to load categories');
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      showError('An error occurred while loading categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset filters and pagination when switching tabs
    setFilters({
      search: '',
      category_id: '',
      date_from: '',
      date_to: '',
      payment_mode: ''
    });
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  const handleAddTransaction = () => {
    navigate(`/admin/transactions/create?type=${activeTab}`);
  };

  const handleViewTransaction = async (transactionId) => {
    // For deleted tab, fetch and return transaction data for modal
    if (activeTab === 'deleted') {
      try {
        const response = await transactionApi.getTransactionById(transactionId);
        if (response.success) {
          return response.data;
        } else {
          showError(response.message || 'Failed to load transaction');
          return null;
        }
      } catch (error) {
        console.error('Error loading transaction:', error);
        showError('An error occurred while loading transaction');
        return null;
      }
    } else {
      // For regular tabs, navigate to view page
      navigate(`/admin/transactions/${transactionId}`);
    }
  };

  const handleEditTransaction = (transactionId) => {
    navigate(`/admin/transactions/edit/${transactionId}`);
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      const response = await transactionApi.deleteTransaction(transactionId);
      if (response.success) {
        loadTransactions();
        loadTabCounts(); // Refresh counts after deletion
        showSuccess('Transaction deleted successfully');
      } else {
        showError(response.message || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      showError('An error occurred while deleting the transaction');
    }
  };

  const handleRestoreTransaction = async (transactionId) => {
    // Placeholder for restore functionality
    showError('Restore functionality will be implemented soon');
    // TODO: Implement restore API call
    // try {
    //   const response = await transactionApi.restoreTransaction(transactionId);
    //   if (response.success) {
    //     loadTransactions();
    //     loadTabCounts();
    //     showSuccess('Transaction restored successfully');
    //   } else {
    //     showError(response.message || 'Failed to restore transaction');
    //   }
    // } catch (error) {
    //   console.error('Error restoring transaction:', error);
    //   showError('An error occurred while restoring the transaction');
    // }
  };

  const handleExport = async () => {
    try {
      const params = {
        type: activeTab,
        category_id: filters.category_id,
        date_from: filters.date_from,
        date_to: filters.date_to
      };
      
      // Call export API (file download is handled in the API)
      const response = await transactionApi.exportTransactions(params);
      
      if (response.success) {
        showSuccess('Transactions exported successfully');
      } else {
        showError(response.message || 'Failed to export transactions');
      }
    } catch (error) {
      console.error('Error exporting transactions:', error);
      showError('An error occurred while exporting transactions');
    }
  };

  const getTabDisplayName = (tab) => {
    if (tab === 'income') return 'Income';
    if (tab === 'expense') return 'Expense';
    if (tab === 'deleted') return 'Deleted';
    return tab;
  };

  const getTabIcon = (tab) => {
    if (tab === 'income') return CurrencyDollarIcon;
    if (tab === 'expense') return BanknotesIcon;
    if (tab === 'deleted') return TrashIcon;
    return CurrencyDollarIcon;
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Transactions
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage income and expense transactions
          </p>
        </div>

        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {activeTab !== 'deleted' && (
            <button
              onClick={handleAddTransaction}
              className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add {getTabDisplayName(activeTab)}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700/60">
          <nav className="-mb-px flex space-x-8">
            {['income', 'expense', 'deleted'].map((tab) => {
              const IconComponent = getTabIcon(tab);
              const isActive = activeTab === tab;
              
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {getTabDisplayName(tab)} {tab !== 'deleted' && 'Transactions'}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs font-medium ${
                    isActive
                      ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {tabCounts[tab]}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        categoriesLoading={categoriesLoading}
        transactionType={activeTab}
        onExport={activeTab !== 'deleted' ? handleExport : null}
        showPaymentMode={true}
      />

      {/* Table */}
      {activeTab === 'deleted' ? (
        <DeletedTransactionsTable
          transactions={transactions}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleViewTransaction}
          onRestore={handleRestoreTransaction}
        />
      ) : (
        <TransactionTable
          transactions={transactions}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleViewTransaction}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          transactionType={activeTab}
          onAddTransaction={handleAddTransaction}
        />
      )}

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

export default Transactions;
