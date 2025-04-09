
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