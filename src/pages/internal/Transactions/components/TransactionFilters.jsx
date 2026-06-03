import React, { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { DatePicker } from '@/components/ui/Internal/DatePicker';

const TransactionFilters = ({ 
  filters, 
  onFilterChange, 
  categories, 
  categoriesLoading, 
  transactionType,
  onExport,
  showPaymentMode = false
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  
  // Payment mode options
  const paymentModes = [
    { value: 'cash', label: 'Cash' },
    { value: 'upi', label: 'UPI' },
    { value: 'net_banking', label: 'Net Banking' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'card', label: 'Card' },
    { value: 'payment_gateway', label: 'Payment Gateway' }
  ];
  
  const handleInputChange = (field, value) => {
    setLocalFilters({
      ...localFilters,
      [field]: value
    });
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category_id: '',
      date_from: '',
      date_to: '',
      payment_mode: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = localFilters.search || localFilters.category_id || localFilters.date_from || localFilters.date_to || localFilters.payment_mode;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 mb-6">
      <div className="p-4">
        {/* First Row: Category and Payment Mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={localFilters.category_id}
              onChange={(e) => handleInputChange('category_id', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              disabled={categoriesLoading}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Mode Filter */}
          {showPaymentMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Mode
              </label>
              <select
                value={localFilters.payment_mode}
                onChange={(e) => handleInputChange('payment_mode', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              >
                <option value="">All Payment Modes</option>
                {paymentModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Second Row: Date Range */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">From:</label>
            <DatePicker
              value={localFilters.date_from}
              onChange={(date) => setLocalFilters({ ...localFilters, date_from: date })}
              placeholder="Select date"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">To:</label>
            <DatePicker
              value={localFilters.date_to}
              onChange={(date) => setLocalFilters({ ...localFilters, date_to: date })}
              placeholder="Select date"
              disabled={!localFilters.date_from}
              minDate={localFilters.date_from}
            />
          </div>
        </div>

        {/* Third Row: Search and Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${transactionType} transactions...`}
                value={localFilters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-2">
            <button
              onClick={applyFilters}
              className="btn bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Apply
            </button>
            {onExport && (
              <button
                onClick={onExport}
                className="btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export
              </button>
            )}
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/60">
            <button
              onClick={clearFilters}
              className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;
