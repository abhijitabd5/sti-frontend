import React from 'react';
import { MagnifyingGlassIcon, CalendarIcon } from '@heroicons/react/24/outline';

const TransactionFilters = ({ 
  filters, 
  onFilterChange, 
  categories, 
  categoriesLoading, 
  transactionType 
}) => {
  
  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      category_id: '',
      date_from: '',
      date_to: ''
    });
  };

  const hasActiveFilters = filters.search || filters.category_id || filters.date_from || filters.date_to;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 mb-6">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${transactionType} transactions...`}
                value={filters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={filters.category_id}
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

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => handleInputChange('date_from', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  placeholder="From"
                />
              </div>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleInputChange('date_to', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                placeholder="To"
              />
            </div>
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
