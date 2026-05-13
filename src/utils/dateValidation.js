/**
 * Date validation utilities to prevent malformed dates
 */

/**
 * Validate if a date string has a valid format (YYYY-MM-DD)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if format is valid
 */
export const isValidDateFormat = (dateString) => {
  if (!dateString) return false;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  return datePattern.test(dateString);
};

/**
 * Validate if a year is within acceptable range
 * @param {number} year - Year to validate
 * @param {number} minYear - Minimum acceptable year (default: 1900)
 * @param {number} maxYear - Maximum acceptable year (default: current year + 1)
 * @returns {boolean} True if year is valid
 */
export const isValidYear = (year, minYear = 1900, maxYear = new Date().getFullYear() + 1) => {
  return year >= minYear && year <= maxYear;
};

/**
 * Extract year from date string (YYYY-MM-DD format)
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {number|null} Year as number, or null if invalid
 */
export const extractYear = (dateString) => {
  if (!isValidDateFormat(dateString)) return null;
  const year = parseInt(dateString.split('-')[0]);
  return isNaN(year) ? null : year;
};

/**
 * Validate date of birth
 * @param {string} dateString - Date string to validate
 * @returns {object} { valid: boolean, error: string|null }
 */
export const validateDateOfBirth = (dateString) => {
  if (!dateString) {
    return { valid: false, error: 'Date of birth is required' };
  }

  if (!isValidDateFormat(dateString)) {
    return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
  }

  const year = extractYear(dateString);
  if (!year) {
    return { valid: false, error: 'Invalid year in date' };
  }

  if (!isValidYear(year, 1900, new Date().getFullYear())) {
    return { valid: false, error: `Year must be between 1900 and ${new Date().getFullYear()}` };
  }

  // Check if date is not in the future
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (inputDate > today) {
    return { valid: false, error: 'Date of birth cannot be in the future' };
  }

  return { valid: true, error: null };
};

/**
 * Validate enrollment date
 * @param {string} dateString - Date string to validate
 * @returns {object} { valid: boolean, error: string|null }
 */
export const validateEnrollmentDate = (dateString) => {
  if (!dateString) {
    return { valid: false, error: 'Enrollment date is required' };
  }

  if (!isValidDateFormat(dateString)) {
    return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
  }

  const year = extractYear(dateString);
  if (!year) {
    return { valid: false, error: 'Invalid year in date' };
  }

  const currentYear = new Date().getFullYear();
  if (!isValidYear(year, 2000, currentYear + 1)) {
    return { valid: false, error: `Year must be between 2000 and ${currentYear + 1}` };
  }

  return { valid: true, error: null };
};

/**
 * Validate certificate issue date
 * @param {string} dateString - Date string to validate
 * @returns {object} { valid: boolean, error: string|null }
 */
export const validateIssueDate = (dateString) => {
  if (!dateString) {
    return { valid: false, error: 'Issue date is required' };
  }

  if (!isValidDateFormat(dateString)) {
    return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
  }

  const year = extractYear(dateString);
  if (!year) {
    return { valid: false, error: 'Invalid year in date' };
  }

  const currentYear = new Date().getFullYear();
  if (!isValidYear(year, 2000, currentYear)) {
    return { valid: false, error: `Year must be between 2000 and ${currentYear}` };
  }

  // Check if date is not in the future
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (inputDate > today) {
    return { valid: false, error: 'Issue date cannot be in the future' };
  }

  return { valid: true, error: null };
};

/**
 * Sanitize date string to prevent malformed dates
 * Ensures year is exactly 4 digits
 * @param {string} dateString - Date string to sanitize
 * @returns {string|null} Sanitized date string or null if invalid
 */
export const sanitizeDateString = (dateString) => {
  if (!dateString) return null;
  
  // Check basic format
  if (!isValidDateFormat(dateString)) return null;
  
  const parts = dateString.split('-');
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  
  // Ensure year is exactly 4 digits
  if (year.length !== 4) return null;
  
  // Ensure month and day are 2 digits
  if (month.length !== 2 || day.length !== 2) return null;
  
  return dateString;
};

/**
 * Get min date for date of birth input (100 years ago)
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const getMinDateOfBirth = () => {
  return '1900-01-01';
};

/**
 * Get max date for date of birth input (today)
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const getMaxDateOfBirth = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get min date for enrollment date (year 2000)
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const getMinEnrollmentDate = () => {
  return '2000-01-01';
};

/**
 * Get max date for enrollment date (1 year from now)
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const getMaxEnrollmentDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};

/**
 * Get min date for certificate issue date (year 2000)
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const getMinIssueDate = () => {
  return '2000-01-01';
};

/**
 * Get max date for certificate issue date (today)
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const getMaxIssueDate = () => {
  return new Date().toISOString().split('T')[0];
};
