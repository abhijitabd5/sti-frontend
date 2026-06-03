import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, getDay, parse, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import { CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/outline';
import * as Popover from '@radix-ui/react-popover';
import { clsx } from 'clsx';

/**
 * Simple Date Picker Component
 * 
 * @param {string} value - Date string in format "dd-MM-yyyy" (e.g., "17-05-2026")
 * @param {Function} onChange - Callback that receives date string in format "dd-MM-yyyy"
 * @param {string} mode - 'date' or 'month' - determines if picking a specific date or just a month
 */
export const DatePicker = ({
  value,
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  disabled = false,
  className = '',
  error = '',
  label = '',
  mode = 'date', // 'date' or 'month'
}) => {
  // Parse value from dd-MM-yyyy string to Date object
  const parsedValue = value && value.trim() ? parse(value, 'dd-MM-yyyy', new Date()) : null;
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(parsedValue && !isNaN(parsedValue.getTime()) ? parsedValue : new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart);
  const emptyDays = firstDayOfWeek >= 0 ? Array(firstDayOfWeek).fill(null) : [];

  // For month mode
  const yearStart = startOfYear(currentMonth);
  const yearEnd = endOfYear(currentMonth);
  const monthsInYear = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  // Generate year range (1900 to current year + 10)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 11 }, (_, i) => 1900 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDateSelect = (date) => {
    // Format date as dd-MM-yyyy for backend
    const formattedDate = format(date, 'dd-MM-yyyy');
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleMonthSelect = (month) => {
    // For month mode, select the first day of the month
    const monthStartDate = startOfMonth(month);
    const formattedDate = format(monthStartDate, 'dd-MM-yyyy');
    onChange(formattedDate);
    setIsOpen(false);
  };

  const isDateDisabled = (date) => {
    if (minDate) {
      // Handle both Date objects and string dates
      const minDateObj = minDate instanceof Date ? minDate : (typeof minDate === 'string' ? parse(minDate, 'dd-MM-yyyy', new Date()) : null);
      if (minDateObj && !isNaN(minDateObj.getTime()) && date < minDateObj) return true;
    }
    if (maxDate) {
      // Handle both Date objects and string dates
      const maxDateObj = maxDate instanceof Date ? maxDate : (typeof maxDate === 'string' ? parse(maxDate, 'dd-MM-yyyy', new Date()) : null);
      if (maxDateObj && !isNaN(maxDateObj.getTime()) && date > maxDateObj) return true;
    }
    return false;
  };

  const displayValue = parsedValue && !isNaN(parsedValue.getTime())
    ? (mode === 'month' ? format(parsedValue, 'MMMM yyyy') : format(parsedValue, 'd MMMM yyyy'))
    : placeholder;

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    // Format date as dd-MM-yyyy for backend
    const formattedDate = format(today, 'dd-MM-yyyy');
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleYearChange = (year) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setShowYearPicker(false);
  };

  const handleMonthChange = (monthIndex) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    setCurrentMonth(newDate);
    setShowMonthPicker(false);
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
              <XMarkIcon 
                className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
              />
            )}
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            side="bottom"
            align="start"
            sideOffset={4}
            className="z-50 w-[280px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg"
          >
            {/* Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMonthPicker(!showMonthPicker);
                      setShowYearPicker(false);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    {format(currentMonth, 'MMMM')}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowYearPicker(!showYearPicker);
                      setShowMonthPicker(false);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    {format(currentMonth, 'yyyy')}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
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
                          year === currentMonth.getFullYear()
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

              {/* Month Picker */}
              {showMonthPicker && (
                <div className="mb-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800">
                  <div className="grid grid-cols-3 gap-1 p-2">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => handleMonthChange(index)}
                        className={clsx(
                          'px-2 py-1 text-xs rounded transition-colors',
                          index === currentMonth.getMonth()
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        )}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Weekday Headers */}
              {!showYearPicker && !showMonthPicker && (
                <div className="grid grid-cols-7 gap-1">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div
                      key={day}
                      className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calendar Grid */}
            {!showYearPicker && !showMonthPicker && (
              <div className="p-2">
                <div className="grid grid-cols-7 gap-1">
                  {emptyDays.map((_, index) => (
                    <div key={`empty-${index}`} />
                  ))}
                  
                  {daysInMonth.map((day) => {
                    const isSelected = parsedValue && !isNaN(parsedValue.getTime()) && isSameDay(day, parsedValue);
                    const isCurrentDay = isToday(day);
                    const disabled = isDateDisabled(day);

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => !disabled && handleDateSelect(day)}
                        disabled={disabled}
                        className={clsx(
                          'h-8 rounded text-sm transition-colors',
                          'focus:outline-none focus:ring-2 focus:ring-blue-500',
                          isSelected && 'bg-blue-600 text-white hover:bg-blue-700',
                          !isSelected && !disabled && 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                          isCurrentDay && !isSelected && 'font-bold text-blue-600 dark:text-blue-400',
                          disabled && 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        )}
                      >
                        {format(day, 'd')}
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
                onClick={handleToday}
                className="w-full px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
              >
                Today
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
