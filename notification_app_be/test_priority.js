const assert = require('assert');
const MinHeap = require('./utils/MinHeap');
const { calculatePriorityScore } = require('./utils/priority');

// Mock Data
const mockNotifications = [
  { ID: '1', Type: 'Event', Message: 'Tech Fest 2026', Timestamp: '2026-04-20 10:00:00' },
  { ID: '2', Type: 'Result', Message: 'Mid-Sem Results Out', Timestamp: '2026-04-22 12:00:00' },
  { ID: '3', Type: 'Placement', Message: 'Google Hiring SWE', Timestamp: '2026-04-21 09:00:00' },
  { ID: '4', Type: 'Placement', Message: 'Microsoft Hiring PM', Timestamp: '2026-04-22 15:00:00' },
  { ID: '5', Type: 'Event', Message: 'Cultural Night', Timestamp: '2026-04-22 18:00:00' },
  { ID: '6', Type: 'Result', Message: 'Project Review Marks', Timestamp: '2026-04-21 14:00:00' },
  { ID: '7', Type: 'Placement', Message: 'Amazon Hiring SDE', Timestamp: '2026-04-22 09:00:00' },
  { ID: '8', Type: 'Result', Message: 'End-Sem Results', Timestamp: '2026-04-23 09:00:00' },
  { ID: '9', Type: 'Event', Message: 'Sports Meet', Timestamp: '2026-04-19 08:00:00' },
  { ID: '10', Type: 'Placement', Message: 'Netflix Hiring', Timestamp: '2026-04-18 10:00:00' },
  { ID: '11', Type: 'Result', Message: 'Lab Exam Marks', Timestamp: '2026-04-22 10:00:00' },
];

function runPriorityTest() {
  console.log('Starting Priority Sorting & Heap Tests...\n');

  // Verify weights and scores
  const p1 = calculatePriorityScore({ Type: 'Placement', Timestamp: '2026-04-22 12:00:00' });
  const p2 = calculatePriorityScore({ Type: 'Result', Timestamp: '2026-04-22 12:00:00' });
  const p3 = calculatePriorityScore({ Type: 'Event', Timestamp: '2026-04-22 12:00:00' });

  assert(p1 > p2, 'Placement should have higher score than Result for the same timestamp');
  assert(p2 > p3, 'Result should have higher score than Event for the same timestamp');
  console.log('✔ Weight check passed: Placement > Result > Event');

  // Verify recency
  const earlyPlacement = calculatePriorityScore({ Type: 'Placement', Timestamp: '2026-04-22 10:00:00' });
  const latePlacement = calculatePriorityScore({ Type: 'Placement', Timestamp: '2026-04-22 12:00:00' });
  assert(latePlacement > earlyPlacement, 'Later timestamp should have higher score than earlier timestamp for same type');
  console.log('✔ Recency check passed: Later timestamp wins for same type');

  // Use MinHeap to retrieve Top 5 notifications
  const topK = 5;
  const heap = new MinHeap((a, b) => a.priorityScore - b.priorityScore);

  for (const item of mockNotifications) {
    const score = calculatePriorityScore(item);
    const enriched = { ...item, priorityScore: score };
    heap.insertBounded(enriched, topK);
  }

  const sortedResult = heap.toSortedArray();
  assert.strictEqual(sortedResult.length, topK, `Heap should contain exactly ${topK} items`);

  console.log(`\nTop ${topK} notifications extracted via MinHeap:`);
  sortedResult.forEach((item, index) => {
    console.log(`${index + 1}. [Score: ${item.priorityScore}] ${item.Type} - ${item.Message} (${item.Timestamp})`);
  });

  // Verify that the highest ranked item is the latest Placement: Microsoft Hiring PM (2026-04-22 15:00:00)
  assert.strictEqual(sortedResult[0].Message, 'Microsoft Hiring PM');
  // Second should be Amazon Hiring SDE (2026-04-22 09:00:00)
  assert.strictEqual(sortedResult[1].Message, 'Amazon Hiring SDE');
  // Third should be Google Hiring SWE (2026-04-21 09:00:00)
  assert.strictEqual(sortedResult[2].Message, 'Google Hiring SWE');
  // Fourth should be Netflix Hiring (2026-04-18 10:00:00)
  assert.strictEqual(sortedResult[3].Message, 'Netflix Hiring');
  // Fifth should be End-Sem Results (2026-04-23 09:00:00) - weight 2 (Result) starts at 2,000,000,000, which is smaller than Placement (3,000,000,000)
  assert.strictEqual(sortedResult[4].Message, 'End-Sem Results');

  console.log('\n✔ Sorted results validated correctly! Heap ordering is correct.');
}

runPriorityTest();
