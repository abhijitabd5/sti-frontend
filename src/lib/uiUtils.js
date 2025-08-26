// src/lib/uiUtility.js
/**
 * UI-specific utility functions
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge and combine CSS class names intelligently
 * Combines clsx for conditional classes and tailwind-merge for conflicting Tailwind classes
 * @param {...any} inputs - Class names, objects, or arrays to merge
 * @returns {string} Merged class names string
 */
export function mergeClasses(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for UI display
 * @param {string|number|Date} input - Date input to format
 * @returns {string} Formatted date string (e.g., "January 15, 2024")
 */
export function formatUIDate(input) {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Generate absolute URL by combining base URL with path
 * @param {string} path - Path to append to base URL
 * @returns {string} Complete absolute URL
 */
export function createAbsoluteUrl(path) {
  const baseUrl =  'http://localhost:5173';
  return `${baseUrl}${path}`;
}

/**
 * Conditional class name helper (alternative to mergeClasses for simple cases)
 * @param {string} baseClasses - Base CSS classes
 * @param {string} conditionalClasses - Classes to add conditionally  
 * @param {boolean} condition - Whether to include conditional classes
 * @returns {string} Combined class names
 */
export function conditionalClasses(baseClasses, conditionalClasses, condition) {
  return condition ? `${baseClasses} ${conditionalClasses}` : baseClasses;
}

/**
 * Get responsive class based on screen size
 * @param {object} classes - Object with breakpoint keys (sm, md, lg, xl)
 * @returns {string} Responsive class string
 */
export function responsiveClasses(classes) {
  const { base = '', sm = '', md = '', lg = '', xl = '' } = classes;
  return mergeClasses(
    base,
    sm && `sm:${sm}`,
    md && `md:${md}`, 
    lg && `lg:${lg}`,
    xl && `xl:${xl}`
  );
}