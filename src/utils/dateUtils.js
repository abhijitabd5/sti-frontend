/**
 * Date utility functions for formatting dates in Indian timezone
 */

/**
 * Get current date and time in Indian timezone (IST)
 * @returns {Date} Date object in IST
 */
export const getIndianTime = () => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

/**
 * Format date for filename in DD_MM_YYYY_HH:MM:SS format using Indian timezone
 * @param {Date} date - Optional date object, defaults to current Indian time
 * @returns {string} Formatted date string for filename
 */
export const formatDateForFilename = (date = null) => {
  const indianTime = date ? new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })) : getIndianTime();
  
  const day = String(indianTime.getDate()).padStart(2, '0');
  const month = String(indianTime.getMonth() + 1).padStart(2, '0');
  const year = indianTime.getFullYear();
  const hours = String(indianTime.getHours()).padStart(2, '0');
  const minutes = String(indianTime.getMinutes()).padStart(2, '0');
  const seconds = String(indianTime.getSeconds()).padStart(2, '0');
  
  return `${day}_${month}_${year}_${hours}:${minutes}:${seconds}`;
};

/**
 * Format date for display in DD/MM/YYYY HH:MM:SS format using Indian timezone
 * @param {Date} date - Optional date object, defaults to current Indian time
 * @returns {string} Formatted date string for display
 */
export const formatIndianDateTime = (date = null) => {
  const indianTime = date ? new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })) : getIndianTime();
  
  const day = String(indianTime.getDate()).padStart(2, '0');
  const month = String(indianTime.getMonth() + 1).padStart(2, '0');
  const year = indianTime.getFullYear();
  const hours = String(indianTime.getHours()).padStart(2, '0');
  const minutes = String(indianTime.getMinutes()).padStart(2, '0');
  const seconds = String(indianTime.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

/**
 * Format date for display in DD MMM YYYY format using Indian timezone
 * @param {Date} date - Optional date object, defaults to current Indian time
 * @returns {string} Formatted date string (e.g., "15 Nov 2025")
 */
export const formatIndianDate = (date = null) => {
  const indianTime = date ? new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })) : getIndianTime();
  
  return indianTime.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Get Indian timezone offset string
 * @returns {string} Timezone offset (e.g., "+05:30")
 */
export const getIndianTimezoneOffset = () => {
  const indianTime = getIndianTime();
  const offset = indianTime.getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset <= 0 ? '+' : '-';
  
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};