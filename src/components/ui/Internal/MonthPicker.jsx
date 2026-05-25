import { useState } from 'react';
import { format, startOfMonth, addMonths, subMonths, parse, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import { CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/outline';
import * as Popover from '@radix-ui/react-popover';
import { clsx } from 'clsx';

/**
 * Month Picker Component
 * 
 * @param {string} value - Date string in format "dd-MM-yyyy" (e.g., "01-05-2026" for May 2026)
 * @param {Function} onChange - Callback that receives date string in format "dd-MM-yyyy" (first day of selected month)
 */
export const MonthPicker = ({
  value,
  onChange,
  placeholder = 'Select month',
  minDate,
  maxDate,
  disabled = false,
  className = '',
  error = '',
  label = '',
}) => {
  // Parse value from dd-MM-yyyy string to Date object
  const parsedValue = value && value.trim() ? parse(value, 'dd-MM-yyyy', new Date()) : null;
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(parsedValue && !isNaN(parsedValue.getTime()) ? parsedValue : new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);

  const yearStart = startOfYear(currentYear);
  const yearEnd = endOfYear(currentYear);
  const monthsInYear = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  // Generate year range (1900 to current year + 10)
  const currentYearNum = new Date().getFullYear();
  const years = Array.from({ length: currentYearNum - 1900 + 11 }, (_, i) => 1900 + i);

  const handleMonthSelect = (month) => {
    // Select the first day of the month
    const monthStartDate = startOfMonth(month);
    const formattedDate = format(monthStartDate, 'dd-MM-yyyy');
    onChange(formattedDate);
    setIsOpen(false);
  };

  const isMonthDisabled = (month) => {
    if (minDate) {
      const minDateObj = parse(minDate, 'dd-MM-yyyy', new Date());
      if (!isNaN(minDateObj.getTime())) {
        // Compare year and month
        if (month.getFullYear() < minDateObj.getFullYear()) return true;
        if (month.getFullYear() === minDateObj.getFullYear() && 
            month.getMonth() <= minDateObj.getMonth()) return true;
      }
    }
    if (maxDate) {
      const maxDateObj = parse(maxDate, 'dd-MM-yyyy', new Date());
      if (!isNaN(maxDateObj.getTime())) {
        if (month.getFullYear() > maxDateObj.getFullYear()) return true;
        if (month.getFullYear() === maxDateObj.getFullYear() && 
            month.getMonth() > maxDateObj.getMonth()) return true;
      }
    }
    return false;
  };

  const displayValue = parsedValue && !isNaN(parsedValue.getTime()) 
    ? format(parsedValue, 'MMMM yyyy') 
    : placeholder;

  const handleYearChange = (year) => {
    const newDate = new Date(currentYear);
    newDate.setFullYear(year);
    setCurrentYear(newDate);
    setShowYearPicker(false);
  };

  const isSelectedMonth = (month) => {
    if (!parsedValue || isNaN(parsedValue.getTime())) return false;
    return month.getMonth() === parsedValue.getMonth() && 
           month.getFullYear() === parsedValue.getFullYear();
  };

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors',
              'text-left text-sm bg-white dark:bg-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              error
                ? 'border-red-400 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600',
              disabled
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer',
              !value && 'text-gray-400 dark:text-gray-500'
            )}
          >
            <CalendarDaysIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            
            <span className="flex-1 text-gray-900 dark:text-gray-100">
              {displayValue}
            </span>

            {parsedValue && !isNaN(parsedValue.getTime()) && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XMarkIcon className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            side="bottom"
            align="start"
            sideOffset={4}
            className="z-50 w-[300px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg"
          >
            {/* Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => setCurrentYear(subMonths(currentYear, 12))}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowYearPicker(!showYearPicker)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                >
                  {format(currentYear, 'yyyy')}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <button
                  type="button"
                  onClick={() => setCurrentYear(addMonths(currentYear, 12))}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Year Picker */}
              {showYearPicker && (
                <div className="mb-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800">
                  <div className="grid grid-cols-3 gap-1 p-2">
                    {years.reverse().map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearChange(year)}
                        className={clsx(
                          'px-2 py-1 text-xs rounded transition-colors',
                          year === currentYear.getFullYear()
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Months Grid */}
            {!showYearPicker && (
              <div className="p-3">
                <div className="grid grid-cols-3 gap-2">
                  {monthsInYear.map((month) => {
                    const isSelected = isSelectedMonth(month);
                    const disabled = isMonthDisabled(month);

                    return (
                      <button
                        key={month.toISOString()}
                        type="button"
                        onClick={() => !disabled && handleMonthSelect(month)}
                        disabled={disabled}
                        className={clsx(
                          'px-3 py-2 rounded text-xs font-medium transition-colors',
                          'focus:outline-none focus:ring-2 focus:ring-blue-500',
                          isSelected && 'bg-blue-600 text-white hover:bg-blue-700',
                          !isSelected && !disabled && 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                          disabled && 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        )}
                      >
                        {format(month, 'MMM')}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setCurrentYear(today);
                  const monthStartDate = startOfMonth(today);
                  const formattedDate = format(monthStartDate, 'dd-MM-yyyy');
                  onChange(formattedDate);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
              >
                This Month
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {error && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
