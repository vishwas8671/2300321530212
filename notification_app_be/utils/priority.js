const { log } = require('../../logging_middleware/logger');

const WEIGHTS = {
  placement: 3,
  result: 2,
  event: 1
};

/**
 * Parses a custom date string "YYYY-MM-DD HH:mm:ss" or standard ISO string into epoch milliseconds.
 * 
 * @param {string} timestampStr - The raw timestamp string
 * @returns {number} Timestamp in milliseconds
 */
function parseTimestampToMs(timestampStr) {
  if (!timestampStr) return 0;
  
  try {
    // If the timestamp contains a space instead of 'T' (e.g., "2026-04-22 17:51:18"),
    // replace space with 'T' to make it a standard ISO 8601 string.
    const normalizedStr = timestampStr.trim().replace(' ', 'T');
    const timeMs = Date.parse(normalizedStr);
    
    if (isNaN(timeMs)) {
      throw new Error(`Invalid date parse result (NaN) for: ${timestampStr}`);
    }
    return timeMs;
  } catch (error) {
    // Return current time as a fallback
    console.warn(`[Priority Warning] Error parsing date "${timestampStr}", falling back to current time.`, error.message);
    return Date.now();
  }
}

/**
 * Calculates priority score for a notification using the formula:
 * priorityScore = (weight * 1000000000) + timestampInMilliseconds
 * 
 * @param {object} notification - Notification object containing Type and Timestamp
 * @returns {number} Computed priority score
 */
function calculatePriorityScore(notification) {
  if (!notification) return 0;

  const type = (notification.Type || notification.type || '').toLowerCase();
  const weight = WEIGHTS[type] || 0;
  
  const timestampStr = notification.Timestamp || notification.timestamp;
  const timestampInMs = parseTimestampToMs(timestampStr);

  return (weight * 1000000000) + timestampInMs;
}

module.exports = {
  WEIGHTS,
  parseTimestampToMs,
  calculatePriorityScore
};
