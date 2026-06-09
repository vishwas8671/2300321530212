const apiClient = require('../apiClient');
const MinHeap = require('../utils/MinHeap');
const { calculatePriorityScore } = require('../utils/priority');
const { log } = require('../../logging_middleware/logger');

// Production fallback mock data in case the external API is unreachable or tokens are unconfigured
const FALLBACK_NOTIFICATIONS = [
  { ID: 'be_1', Type: 'Event', Message: 'Tech Fest 2026 Registration Open', Timestamp: '2026-04-20 10:00:00' },
  { ID: 'be_2', Type: 'Result', Message: 'Mid-Sem Results Out (CS/IT Departments)', Timestamp: '2026-04-22 12:00:00' },
  { ID: 'be_3', Type: 'Placement', Message: 'Google SDE-1 Hiring applications live', Timestamp: '2026-04-21 09:00:00' },
  { ID: 'be_4', Type: 'Placement', Message: 'Microsoft PM Internship hiring starts', Timestamp: '2026-04-22 15:00:00' },
  { ID: 'be_5', Type: 'Event', Message: 'Cultural Night registrations closing tonight', Timestamp: '2026-04-22 18:00:00' },
  { ID: 'be_6', Type: 'Result', Message: 'Software Architecture Project Review Marks', Timestamp: '2026-04-21 14:00:00' },
  { ID: 'be_7', Type: 'Placement', Message: 'Amazon AWS Support Engineer drive', Timestamp: '2026-04-22 09:00:00' },
  { ID: 'be_8', Type: 'Result', Message: 'Theoretical Computer Science End-Sem Marks', Timestamp: '2026-04-23 09:00:00' },
  { ID: 'be_9', Type: 'Event', Message: 'Inter-College Sports Meet fixtures', Timestamp: '2026-04-19 08:00:00' },
  { ID: 'be_10', Type: 'Placement', Message: 'Netflix Software Engineer hiring open', Timestamp: '2026-04-18 10:00:00' },
  { ID: 'be_11', Type: 'Result', Message: 'Database Labs Practical Marks sheet', Timestamp: '2026-04-22 10:00:00' },
];

/**
 * Fetches notifications from the evaluation service and extracts the top K ranked by priority score.
 * 
 * @param {number} topK - Number of top priority notifications to return (defaults to 10)
 * @returns {Promise<Array>} List of prioritized notification objects
 */
async function getPriorityNotifications(topK = 10) {
  await log('backend', 'info', 'service', `Requesting top ${topK} priority notifications from API.`);

  let rawNotifications;

  try {
    const response = await apiClient.get('/evaluation-service/notifications');
    const data = response.data;
    rawNotifications = data.notifications || data;
    if (!Array.isArray(rawNotifications)) {
      throw new Error('API did not return a valid list array');
    }
    await log('backend', 'info', 'service', `Successfully fetched ${rawNotifications.length} notifications from API.`);
  } catch (error) {
    const warningMsg = `API Fetch failed (${error.message}). Gracefully falling back to local mock notifications data.`;
    await log('backend', 'warn', 'service', warningMsg);
    console.warn(`\n[API Warning] ${warningMsg}`);
    rawNotifications = FALLBACK_NOTIFICATIONS;
  }

  // Initialize MinHeap with a comparator based on the priorityScore.
  const heap = new MinHeap((a, b) => a.priorityScore - b.priorityScore);

  // Process notifications continuously in O(N log K) time and O(K) memory space
  for (const item of rawNotifications) {
    const score = calculatePriorityScore(item);
    const enrichedItem = {
      ...item,
      priorityScore: score
    };
    
    // Keep only top K elements using the bounded insert
    heap.insertBounded(enrichedItem, topK);
  }

  // Convert MinHeap to descending sorted array
  const topNotifications = heap.toSortedArray();

  await log('backend', 'info', 'service', `Prioritized top ${topNotifications.length} notifications.`);
  return topNotifications;
}

module.exports = {
  getPriorityNotifications
};
