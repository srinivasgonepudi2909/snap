// src/utils/dateUtils.js - IST Date Formatting Utilities

/**
 * Convert any date to IST (India Standard Time) and format it
 * @param {string|Date} dateInput - Date string or Date object
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string in IST
 */
export const formatDateIST = (dateInput, options = {}) => {
  if (!dateInput) return 'Unknown date';
  
  try {
    const date = new Date(dateInput);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const defaultOptions = {
      month: 'short',
      day: 'numeric', 
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    return date.toLocaleDateString('en-US', formatOptions);
  } catch (error) {
    console.error('Error formatting date to IST:', error);
    return 'Invalid date';
  }
};

/**
 * Get current date/time in IST
 * @param {Object} options - Formatting options
 * @returns {string} Current date/time in IST
 */
export const getCurrentDateIST = (options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  };
  
  const formatOptions = { ...defaultOptions, ...options };
  
  return new Date().toLocaleString('en-US', formatOptions);
};

/**
 * Get time in IST format
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Time in IST (HH:MM AM/PM)
 */
export const formatTimeIST = (dateInput) => {
  if (!dateInput) return 'Unknown time';
  
  try {
    const date = new Date(dateInput);
    
    if (isNaN(date.getTime())) {
      return 'Invalid time';
    }
    
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  } catch (error) {
    console.error('Error formatting time to IST:', error);
    return 'Invalid time';
  }
};

/**
 * Get detailed date and time in IST
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Full date and time in IST
 */
export const formatDateTimeIST = (dateInput) => {
  if (!dateInput) return 'Unknown date/time';
  
  try {
    const date = new Date(dateInput);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date/time';
    }
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata',
      timeZoneName: 'short'
    });
  } catch (error) {
    console.error('Error formatting date/time to IST:', error);
    return 'Invalid date/time';
  }
};

/**
 * Get relative time in IST (e.g., "2 hours ago", "yesterday")
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Relative time string
 */
export const getRelativeTimeIST = (dateInput) => {
  if (!dateInput) return 'Unknown time';
  
  try {
    const date = new Date(dateInput);
    const now = new Date();
    
    // Convert both dates to IST milliseconds for accurate comparison
    const dateIST = new Date(date.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const nowIST = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    
    const diffMs = nowIST - dateIST;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSeconds < 60) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      // For older dates, show the actual date in IST
      return formatDateIST(dateInput);
    }
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return formatDateIST(dateInput);
  }
};

/**
 * Check if a date is today in IST timezone
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {boolean} True if the date is today in IST
 */
export const isToday = (dateInput) => {
  if (!dateInput) return false;
  
  try {
    const date = new Date(dateInput);
    const today = new Date();
    
    const dateIST = new Date(date.toLocaleDateString("en-US", {timeZone: "Asia/Kolkata"}));
    const todayIST = new Date(today.toLocaleDateString("en-US", {timeZone: "Asia/Kolkata"}));
    
    return dateIST.toDateString() === todayIST.toDateString();
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
};

/**
 * Format date for display in different contexts
 * @param {string|Date} dateInput - Date string or Date object
 * @param {string} context - 'short', 'medium', 'long', 'relative'
 * @returns {string} Formatted date based on context
 */
export const formatDateByContext = (dateInput, context = 'short') => {
  if (!dateInput) return 'Unknown date';
  
  switch (context) {
    case 'relative':
      return getRelativeTimeIST(dateInput);
      
    case 'short':
      return formatDateIST(dateInput, {
        month: 'short',
        day: 'numeric'
      });
      
    case 'medium':
      return formatDateIST(dateInput, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
    case 'long':
      return formatDateTimeIST(dateInput);
      
    case 'time-only':
      return formatTimeIST(dateInput);
      
    default:
      return formatDateIST(dateInput);
  }
};