/**
 * A standard, reusable Min-Heap implementation.
 */
class MinHeap {
  /**
   * Creates a Min-Heap instance.
   * 
   * @param {function} comparator - Custom comparator function. Defaults to comparing numbers.
   *                                Should return < 0 if a is "smaller" than b (has lower priority).
   */
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  /**
   * Returns the current size of the heap.
   * @returns {number}
   */
  size() {
    return this.heap.length;
  }

  /**
   * Returns the minimum element (root) without removing it.
   * @returns {*}
   */
  peek() {
    if (this.size() === 0) return null;
    return this.heap[0];
  }

  /**
   * Inserts an element into the heap.
   * @param {*} value 
   */
  push(value) {
    this.heap.push(value);
    this._bubbleUp(this.heap.length - 1);
  }

  /**
   * Removes and returns the minimum element (root) from the heap.
   * @returns {*}
   */
  pop() {
    if (this.size() === 0) return null;
    const min = this.heap[0];
    const end = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this._bubbleDown(0);
    }
    return min;
  }

  /**
   * Bounded insertion helper: maintains the top elements.
   * If heap size is under capacity, pushes the value.
   * If heap size is at capacity, compares the value to the root. If value is "larger" than root,
   * pops the root and inserts the value.
   * 
   * @param {*} value - The element to insert
   * @param {number} capacity - The maximum size of the heap
   * @returns {boolean} True if the element was added or kept in the heap, false otherwise.
   */
  insertBounded(value, capacity) {
    if (this.size() < capacity) {
      this.push(value);
      return true;
    }
    
    // Compare with the minimum (root)
    // comparator(value, root) > 0 means value is "larger" (higher priority score) than the minimum.
    if (this.comparator(value, this.peek()) > 0) {
      this.pop();
      this.push(value);
      return true;
    }
    
    return false;
  }

  /**
   * Converts the heap into a sorted array (descending order).
   * Note: This empties the heap.
   * @returns {Array} Sorted array
   */
  toSortedArray() {
    const result = [];
    while (this.size() > 0) {
      result.push(this.pop());
    }
    // Since it's a Min-Heap, pop() returns elements from smallest to largest.
    // To get descending order (highest score first), reverse the result.
    return result.reverse();
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parentIndex]) >= 0) {
        break;
      }
      this._swap(index, parentIndex);
      index = parentIndex;
    }
  }

  _bubbleDown(index) {
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

  _swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}

module.exports = MinHeap;
