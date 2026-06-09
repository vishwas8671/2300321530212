import { Notification } from '../types/notification';

export const WEIGHTS: Record<string, number> = {
  placement: 3,
  result: 2,
  event: 1
};

/**
 * Parses timestamp string "YYYY-MM-DD HH:mm:ss" or ISO string to epoch milliseconds.
 */
export function parseTimestampToMs(timestampStr: string): number {
  if (!timestampStr) return 0;
  try {
    const normalizedStr = timestampStr.trim().replace(' ', 'T');
    const timeMs = Date.parse(normalizedStr);
    return isNaN(timeMs) ? Date.now() : timeMs;
  } catch {
    return Date.now();
  }
}

/**
 * Calculates the priority score for a notification using the formula:
 * priorityScore = (weight * 1,000,000,000) + timestampInMilliseconds
 */
export function calculatePriorityScore(notification: Notification): number {
  if (!notification) return 0;
  const type = (notification.Type || '').toLowerCase();
  const weight = WEIGHTS[type] || 0;
  const timestampMs = parseTimestampToMs(notification.Timestamp);
  return (weight * 1000000000) + timestampMs;
}

/**
 * Min-Heap implementation in TypeScript.
 */
export class MinHeap<T> {
  private heap: T[] = [];
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }

  size(): number {
    return this.heap.length;
  }

  peek(): T | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  push(value: T): void {
    this.heap.push(value);
    this._bubbleUp(this.heap.length - 1);
  }

  pop(): T | null {
    if (this.size() === 0) return null;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0 && end !== undefined) {
      this.heap[0] = end;
      this._bubbleDown(0);
    }
    return min;
  }

  insertBounded(value: T, capacity: number): boolean {
    if (this.size() < capacity) {
      this.push(value);
      return true;
    }
    const root = this.peek();
    if (root !== null && this.comparator(value, root) > 0) {
      this.pop();
      this.push(value);
      return true;
    }
    return false;
  }

  toSortedArray(): T[] {
    const result: T[] = [];
    // Temporarily empty the heap to get items in sorted order
    const originalHeap = [...this.heap];
    while (this.size() > 0) {
      const item = this.pop();
      if (item !== null) {
        result.push(item);
      }
    }
    this.heap = originalHeap; // restore
    return result.reverse(); // Descending order (highest first)
  }

  private _bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parentIndex]) >= 0) {
        break;
      }
      this._swap(index, parentIndex);
      index = parentIndex;
    }
  }

  private _bubbleDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let smallestIndex = index;

      if (leftChildIndex < length && this.comparator(this.heap[leftChildIndex], this.heap[smallestIndex]) < 0) {
        smallestIndex = leftChildIndex;
      }

      if (rightChildIndex < length && this.comparator(this.heap[rightChildIndex], this.heap[smallestIndex]) < 0) {
        smallestIndex = rightChildIndex;
      }

      if (smallestIndex === index) {
        break;
      }

      this._swap(index, smallestIndex);
      index = smallestIndex;
    }
  }

  private _swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}
