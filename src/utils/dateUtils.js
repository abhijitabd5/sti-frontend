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
 * Get timestamp in DD_MM_YYYY_HH_MM_SS format using Indian timezone
 * @param {Date} date - Optional date object, defaults to current Indian time
 * @returns {string} Timestamp string (e.g., "19_11_2025_14_30_45")
 */
export const getTimestamp = (date = null) => {
  const indianTime = date ? new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })) : getIndianTime();
  
  const day = String(indianTime.getDate()).padStart(2, '0');
  const month = String(indianTime.getMonth() + 1).padStart(2, '0');
  const year = indianTime.getFullYear();
  const hours = String(indianTime.getHours()).padStart(2, '0');
  const minutes = String(indianTime.getMinutes()).padStart(2, '0');
  const seconds = String(indianTime.getSeconds()).padStart(2, '0');
  
  return `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;
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

/**
 * Format date from YYYY-MM-DD to DD-MM-YYYY for display
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string in DD-MM-YYYY format
 */
export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  
  // Handle YYYY-MM format (month input)
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    const [year, month] = dateString.split('-');
    return `${month}-${year}`;
  }
  
  // Handle YYYY-MM-DD format (date input)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }
  
  return dateString;
};

/**
 * Format date from DD-MM-YYYY to YYYY-MM-DD for backend
 * @param {string} dateString - Date string in DD-MM-YYYY format
 * @returns {string} Formatted date string in YYYY-MM-DD format
 */
export const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return '';
  
  // Handle MM-YYYY format (month display)
  if (/^\d{2}-\d{4}$/.test(dateString)) {
    const [month, year] = dateString.split('-');
    return `${year}-${month}`;
  }
  
  // Handle DD-MM-YYYY format (date display)
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  }
  
  return dateString;
};