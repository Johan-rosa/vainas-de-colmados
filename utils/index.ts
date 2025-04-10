
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

/**
 * Finds the most recent date with a specific day of the month
 * @param {Date} referenceDate - The reference date to compare against
 * @param {number} targetDay - The target day of the month (1-31)
 * @returns {Date|null} The most recent date with the specified day, or null if not found
 */
export const findMostRecentDateWithDay = (referenceDate: Date, targetDay: number): Date => {  
  // Initialize startDate as null
  let targetDate = null;
  
  const targetDateThisMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), targetDay);
  
  if (targetDateThisMonth > referenceDate) {
    targetDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, targetDay);
  } else {
    targetDate = targetDateThisMonth;
  }
  
  return targetDate;
};


export const dateAsKey = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}
