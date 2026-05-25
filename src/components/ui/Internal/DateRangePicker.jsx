import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, isWithinInterval, startOfYear, endOfYear, eachMonthOfInterval, getDay, parse } from 'date-fns';
import { CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/outline';
import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';

/**
 * Simple Date Range Picker Component
 * 
 * @param {Object} value - { start: "dd-MM-yyyy", end: "dd-MM-yyyy" }
 * @param {Function} onChange - Callback that receives { start: "dd-MM-yyyy", end: "dd-MM-yyyy" }
 */
export const DateRangePicker = ({
  value = { start: '', end: '' },
  onChange,
  placeholder = 'Select date range',
  minDate,
  maxDate,
  disabled = false,
  className = '',
  error = '',
  mode = 'date',
  label = '',
}) => {
  // Parse values from dd-MM-yyyy strings to Date objects
  const parsedStart = value?.start && value.start.trim() ? parse(value.start, 'dd-MM-yyyy', new Date()) : null;
  const parsedEnd = value?.end && value.end.trim() ? parse(value.end, 'dd-MM-yyyy', new Date()) : null;
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(parsedStart && !isNaN(parsedStart.getTime()) ? parsedStart : new Date());
  const [rangeMode, setRangeMode] = useState(mode);
  const [hoverDate, setHoverDate] = useState(null);
  const [selectingStart, setSelectingStart] = useState(true);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart);
  const emptyDays = firstDayOfWeek >= 0 ? Array(firstDayOfWeek).fill(null) : [];

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
    const formattedDate = format(date, 'dd-MM-yyyy');
    
    if (selectingStart || !value?.start) {
      onChange({ start: formattedDate, end: '' });
      setSelectingStart(false);
    } else {
      const startDate = parse(value.start, 'dd-MM-yyyy', new Date());
      if (date < startDate) {
        onChange({ start: formattedDate, end: value.start });
      } else {
        onChange({ start: value.start, end: formattedDate });
      }
      setSelectingStart(true);
      setIsOpen(false);
    }
  };

  const handleMonthSelect = (month) => {
    const monthStartDate = startOfMonth(month);
    const monthEndDate = endOfMonth(month);
    const formattedStart = format(monthStartDate, 'dd-MM-yyyy');
    const formattedEnd = format(monthEndDate, 'dd-MM-yyyy');

    if (selectingStart || !value?.start) {
      onChange({ start: formattedStart, end: '' });
      setSelectingStart(false);
    } else {
      const startDate = parse(value.start, 'dd-MM-yyyy', new Date());
      if (month < startDate) {
        const existingEndFormatted = format(endOfMonth(startDate), 'dd-MM-yyyy');
        onChange({ start: formattedStart, end: existingEndFormatted });
      } else {
        onChange({ start: value.start, end: formattedEnd });
      }
      setSelectingStart(true);
      setIsOpen(false);
    }
  };

  const isDateDisabled = (date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateInRange = (date) => {
    if (!parsedStart || !parsedEnd || isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) return false;
    return isWithinInterval(date, { start: parsedStart, end: parsedEnd });
  };

  const isDateRangeStart = (date) => {
    return parsedStart && !isNaN(parsedStart.getTime()) && isSameDay(date, parsedStart);
  };

  const isDateRangeEnd = (date) => {
    return parsedEnd && !isNaN(parsedEnd.getTime()) && isSameDay(date, parsedEnd);
  };

  const isDateInHoverRange = (date) => {
    if (!parsedStart || !hoverDate || parsedEnd || isNaN(parsedStart.getTime())) return false;
    const start = parsedStart < hoverDate ? parsedStart : hoverDate;
    const end = parsedStart < hoverDate ? hoverDate : parsedStart;
    return isWithinInterval(date, { start, end });
  };

  const handleClear = () => {
    onChange({ start: '', end: '' });
    setSelectingStart(true);
  };

  const handleYearChange = (year) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setShowYearPicker(false);
  };

  const handleMonthChangeNav = (monthIndex) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    setCurrentMonth(newDate);
    setShowMonthPicker(false);
  };

  const formatDisplayValue = () => {
    if (!parsedStart || isNaN(parsedStart.getTime())) return placeholder;
    if (!parsedEnd || isNaN(parsedEnd.getTime())) {
      return rangeMode === 'month'
        ? format(parsedStart, 'MMMM yyyy')
        : format(parsedStart, 'd MMMM yyyy');
    }
    
    if (rangeMode === 'month') {
      return `${format(parsedStart, 'MMMM yyyy')} - ${format(parsedEnd, 'MMMM yyyy')}`;
    }
    return `${format(parsedStart, 'd MMMM yyyy')} - ${format(parsedEnd, 'd MMMM yyyy')}`;
  };

  const renderDatePicker = () => (
    <>
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
                  onClick={() => handleMonthChangeNav(index)}
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
              const isSelected = isDateRangeStart(day) || isDateRangeEnd(day);
              const isInRange = isDateInRange(day);
              const isInHoverRange = isDateInHoverRange(day);
              const isCurrentDay = isToday(day);
              const disabled = isDateDisabled(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => !disabled && handleDateSelect(day)}
                  onMouseEnter={() => setHoverDate(day)}
                  onMouseLeave={() => setHoverDate(null)}
                  disabled={disabled}
                  className={clsx(
                    'h-8 text-sm transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    isSelected && 'bg-blue-600 text-white rounded',
                    (isInRange || isInHoverRange) && !isSelected && 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100',
                    !isSelected && !isInRange && !isInHoverRange && !disabled && 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded',
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
    </>
  );

  const renderMonthPicker = () => (
    <>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 12))}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {format(currentMonth, 'yyyy')}
          </span>
          
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 12))}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Months Grid */}
      <div className="p-3">
        <div className="grid grid-cols-3 gap-2">
          {monthsInYear.map((month) => {
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);
            const isStart = parsedStart && !isNaN(parsedStart.getTime()) && isSameDay(monthStart, startOfMonth(parsedStart));
            const isEnd = parsedEnd && !isNaN(parsedEnd.getTime()) && isSameDay(monthEnd, endOfMonth(parsedEnd));
            const isSelected = isStart || isEnd;
            
            const isInRange = parsedStart && parsedEnd && !isNaN(parsedStart.getTime()) && !isNaN(parsedEnd.getTime()) && 
              isWithinInterval(month, { start: parsedStart, end: parsedEnd });

            return (
              <button
                key={month.toISOString()}
                type="button"
                onClick={() => handleMonthSelect(month)}
                className={clsx(
                  'px-3 py-2 rounded text-xs font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  isSelected && 'bg-blue-600 text-white hover:bg-blue-700',
                  isInRange && !isSelected && 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100',
                  !isSelected && !isInRange && 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                {format(month, 'MMM')}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

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
              !value?.start && 'text-gray-400 dark:text-gray-500'
            )}
          >
            <CalendarDaysIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            
            <span className="flex-1 text-gray-900 dark:text-gray-100">
              {formatDisplayValue()}
            </span>

            {(parsedStart || parsedEnd) && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
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
            <Tabs.Root value={rangeMode} onValueChange={setRangeMode}>
              {/* Tab Selector */}
              <Tabs.List className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-700">
                <Tabs.Trigger
                  value="date"
                  className={clsx(
                    'flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    rangeMode === 'date'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  Date Range
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="month"
                  className={clsx(
                    'flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    rangeMode === 'month'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  Month Range
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="date">
                {renderDatePicker()}
              </Tabs.Content>

              <Tabs.Content value="month">
                {renderMonthPicker()}
              </Tabs.Content>
            </Tabs.Root>

            {/* Footer */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                {(!parsedStart || isNaN(parsedStart.getTime())) && 'Select from date'}
                {parsedStart && !isNaN(parsedStart.getTime()) && (!parsedEnd || isNaN(parsedEnd.getTime())) && 'Select to date'}
                {parsedStart && !isNaN(parsedStart.getTime()) && parsedEnd && !isNaN(parsedEnd.getTime()) && 'Range selected'}
              </div>
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
