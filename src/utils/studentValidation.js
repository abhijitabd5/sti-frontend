/**
 * Student Form Validation Utilities
 */

/**
 * Validate mobile number
 * - Must be exactly 10 digits
 * - Only numbers allowed
 * - Must start with 6, 7, 8, or 9
 * 
 * @param {string} mobile - Mobile number to validate
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateMobile = (mobile) => {
  if (!mobile || mobile.trim() === '') {
    return { valid: false, error: 'Mobile number is required' };
  }

  // Remove any whitespace
  const cleanMobile = mobile.trim();

  // Check if only numbers
  if (!/^\d+$/.test(cleanMobile)) {
    return { valid: false, error: 'Mobile number must contain only digits' };
  }

  // Check length
  if (cleanMobile.length !== 10) {
    return { valid: false, error: 'Mobile number must be exactly 10 digits' };
  }

  // Check first digit (must be 6, 7, 8, or 9)
  const firstDigit = cleanMobile.charAt(0);
  if (!['6', '7', '8', '9'].includes(firstDigit)) {
    return { valid: false, error: 'Mobile number must start with 6, 7, 8, or 9' };
  }

  return { valid: true, error: '' };
};

/**
 * Validate date of birth
 * - Must be at least 15 years old
 * 
 * @param {string} dateOfBirth - Date string in format 'yyyy-MM-dd'
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth || dateOfBirth.trim() === '') {
    return { valid: false, error: 'Date of birth is required' };
  }

  try {
    const dob = new Date(dateOfBirth);
    
    // Check if valid date
    if (isNaN(dob.getTime())) {
      return { valid: false, error: 'Invalid date format' };
    }

    // Calculate age
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    // Check minimum age
    if (age < 15) {
      return { valid: false, error: 'Student must be at least 15 years old' };
    }

    // Check if date is in the future
    if (dob > today) {
      return { valid: false, error: 'Date of birth cannot be in the future' };
    }

    // Check if date is too far in the past (more than 100 years)
    if (age > 100) {
      return { valid: false, error: 'Please enter a valid date of birth' };
    }

    return { valid: true, error: '' };
  } catch (error) {
    return { valid: false, error: 'Invalid date format' };
  }
};

/**
 * Get minimum date of birth (15 years ago from today)
 * @returns {Date}
 */
export const getMinDateOfBirth = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 100); // Max 100 years old
  return date;
};

/**
 * Get maximum date of birth (15 years ago from today)
 * @returns {Date}
 */
export const getMaxDateOfBirth = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 15); // Min 15 years old
  return date;
};

/**
 * Format mobile number for display (adds spaces for readability)
 * @param {string} mobile - 10 digit mobile number
 * @returns {string} Formatted mobile (e.g., "9876 543 210")
 */
export const formatMobileDisplay = (mobile) => {
  if (!mobile || mobile.length !== 10) return mobile;
  return `${mobile.slice(0, 4)} ${mobile.slice(4, 7)} ${mobile.slice(7)}`;
};

/**
 * Sanitize mobile input (remove non-numeric characters)
 * @param {string} input - Raw input
 * @returns {string} Sanitized mobile number
 */
export const sanitizeMobileInput = (input) => {
  if (!input) return '';
  return input.replace(/\D/g, '').slice(0, 10); // Remove non-digits and limit to 10
};
