import { clone } from 'radash';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function sortRecrodsByDate(records, sortByKey) {
  const copiedRecords = clone(records);
  copiedRecords.sort((a, b) => (dayjs(b[sortByKey]).isAfter(dayjs(a[sortByKey])) ? 1 : -1));
  return copiedRecords;
}

export function groupRecordsByDate(records, dateKey) {
  const dateMap = new Map();

  records.forEach((record) => {
    const uniqueDate = dayjs(record[dateKey]).format('YYYY-MM-DD');
    if (dateMap.has(uniqueDate)) {
      dateMap.get(uniqueDate).push(record);
    } else {
      dateMap.set(uniqueDate, [record]);
    }
  });

  return dateMap;
}

export function getCurrentDate() {
  return dayjs();
}

export function convertToDayJsObject(dateObj) {
  // Check if dateObj is a dayjs object, if not, convert it to dayjs
  return !dayjs.isDayjs(dateObj) ? dayjs(dateObj) : dateObj;
}

/**
 * Formats a dayjs date object into a specified format, optionally in UTC.
 *
 * @param {dayjs|Date|string} dateObj - A date in various formats (dayjs, Date, string).
 * @param {string} format - A string specifying the format to output.
 * @param {boolean} [useUTC=false] - Whether to format the date in UTC.
 * @return {string} The formatted date string.
 */
export function formatDayjs(dateObj, format, useUTC = false) {
  let dayjsDate = convertToDayJsObject(dateObj);
  if (useUTC) {
    dayjsDate = dayjsDate.utc();
  }
  return dayjsDate.format(format);
}

/**
 * Checks if two dates are the same.
 *
 * @param {dayjs|Date|string} date1 - The first date in various formats (dayjs, Date, string).
 * @param {dayjs|Date|string} date2 - The second date in various formats (dayjs, Date, string).
 * @param {string} [unit] - The unit of comparison (e.g., 'year', 'month', 'day', etc.).
 *                           If not provided, defaults to comparing exact timestamps.
 * @return {boolean} True if the dates are the same according to the specified unit, false otherwise.
 */
export function areDatesSame(date1, date2, unit) {
  // Convert to dayjs objects if not already
  const dayjsDate1 = convertToDayJsObject(date1);
  const dayjsDate2 = convertToDayJsObject(date2);

  // Compare the two dates
  return dayjsDate1.isSame(dayjsDate2, unit);
}

/**
 * Returns the first day of the previous or next month based on the given date and direction.
 *
 * @param {dayjs|Date|string} dateObj - A date in various formats (dayjs, Date, string).
 * @param {'prev'|'next'} direction - The direction to move ('prev' for previous month, 'next' for next month).
 * @return {dayjs} A dayjs object representing the first day of the previous or next month.
 */
export function getFirstDayOfAdjacentMonth(dateObj, direction) {
  let dayjsDate = convertToDayJsObject(dateObj);

  if (direction === 'prev') {
    // Move to the first day of the previous month
    dayjsDate = dayjsDate.subtract(1, 'month').date(1);
  } else if (direction === 'next') {
    // Move to the first day of the next month
    dayjsDate = dayjsDate.add(1, 'month').date(1);
  } else {
    throw new Error("Direction must be 'prev' or 'next'.");
  }

  return dayjsDate;
}

/**
 * Gets a timestamp for a specified time in the past.
 *
 * @param {number} amount The amount of time to go back.
 * @param {string} unit The unit of time (e.g., 'minute', 'hour').
 * @returns {string} The timestamp for the specified time in the past.
 */
export const getPastTimestamp = (amount, unit) => {
  // Validate input
  if (typeof amount !== 'number' || amount < 0) {
    throw new Error('Amount must be a non-negative number.');
  }

  if (
    typeof unit !== 'string' ||
    !['second', 'minute', 'hour', 'day', 'week', 'month', 'year'].includes(unit)
  ) {
    throw new Error('Invalid or unsupported time unit.');
  }

  // Subtract the specified amount of time and return the timestamp
  return getCurrentDate().subtract(amount, unit).valueOf();
};

/**
 * Normalizes a timestamp to seconds if it appears to be in milliseconds.
 * Modern JavaScript timestamps are in milliseconds, but some APIs expect seconds.
 *
 * @param {number} timestamp - The timestamp to normalize
 * @returns {number} - The timestamp in seconds
 */
export const normalizeTimestamp = (timestamp) => {
  // Check if input is a number
  if (typeof timestamp !== 'number') {
    throw new Error('Timestamp must be a number');
  }

  // Count digits using Math.log10
  // Unix timestamps in milliseconds have 13 digits until year ~2286
  // Unix timestamps in seconds have 10 digits until year ~2286
  const digitCount = Math.floor(Math.log10(timestamp)) + 1;

  // If timestamp has 13 or more digits, it's likely in milliseconds
  if (digitCount >= 13) {
    return Math.floor(timestamp / 1000);
  }

  // Already in seconds
  return timestamp;
};

export const isDateStringValid = (dateString) => {
  return dayjs(dateString).isValid();
};

export const formatDate = (date, formatKey = 'DD/MM/YYYY h:mmA') => {
  // DD/MM/YYYY HH:mm
  // DD/MM/YYYY
  // MM/DD/YYYY
  // YYYY/MM/DD
  // YYYY/MM/DD
  // YYYY/DD/MM
  if (!isDateStringValid) {
    return 'Invalid Date';
  }
  return dayjs(date).format(dateFormats[formatKey]);
};
