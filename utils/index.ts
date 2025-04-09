
import { format } from 'date-fns';

/**
 * Formats a date in UTC using the specified format and locale
 * @param {Date} date - The date to format
 * @param {string} formatStr - The format string (e.g., 'PP', 'yyyy-MM-dd')
 * @param {Object} options - Options object that can include locale
 * @returns {string} The formatted date string in UTC
 */
export function formatUTC(date: Date, formatStr: string, options = {}) {
  // Convert the input date to UTC
  const utcDate = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  ));
  
  // Format the UTC date with the provided format string and options
  return format(utcDate, formatStr, options);
}

/**
 * Calculates the difference in days between two dates
 * @param {Date|string|number} startDate - The start date
 * @param {Date|string|number} endDate - The end date
 * @param {boolean} [absolute=false] - Whether to return the absolute value (positive number)
 * @returns {number} The difference in days (can be negative if endDate is before startDate and absolute is false)
 */
export function getDaysDifference(startDate: Date | string | number, endDate: Date | string | number, absolute = false) {
  // Convert inputs to Date objects if they aren't already
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);
  
  // Reset the time part to midnight to ensure we only count full days
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  
  // Calculate the difference in milliseconds and convert to days
  // 1000 ms * 60 s * 60 min * 24 h = 86400000 ms in a day
  const differenceInMs = endUtc - startUtc;
  const differenceInDays = differenceInMs / 86400000;
  
  // Return absolute value if requested, otherwise return the actual difference
  return absolute ? Math.abs(differenceInDays) : differenceInDays;
}

// Example usage:
// const days = getDaysDifference('2023-01-01', '2023-01-15'); // Returns 14
// const days = getDaysDifference(new Date(2023, 0, 15), new Date(2023, 0, 1)); // Returns -14
// const days = getDaysDifference(new Date(2023, 0, 15), new Date(2023, 0, 1), true); // Returns 14

export default getDaysDifference;