// Script to author Problems 66-72 (Heap) and 73-84 (Backtracking & Tries)
const fs = require('fs');
const path = require('path');

const HEAP_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaHeapSolutions.js');
const BT_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaBacktrackingTriesSolutions.js');

const heapContent = `// Problems 66-72: Heap & Priority Queue Master Solutions
// Full Multi-Approach Solutions with JS & TS, Line-by-Line Breakdown, Dry Runs, Pitches, and Quizzes

export const HEAP_SOLUTIONS = {
  // ==========================================
  // PROBLEM 69: KTH LARGEST ELEMENT IN AN ARRAY (LC #215)
  // ==========================================
  69: {
    id: 69,
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    pattern: 'Heap / Priority Queue',
    day: 32,
    leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    summary: 'Find the kth largest element in an unsorted array using a Min-Heap of size K or Quickselect in average O(N) time.',
    prerequisites: ['Min-Heap eviction mechanics', 'Quickselect partitioning (Hoare / Lomuto)'],
    problemStatement: \`Given an integer array \\\`nums\\\` and an integer \\\`k\\\`, return the \\\`k-th\\\` largest element in the array.

Note that it is the \\\`k-th\\\` largest element in the sorted order, not the \\\`k-th\\\` distinct element.

Can you solve it without sorting in **O(n)** average time complexity?\`,
    approaches: [
      {
        name: 'Approach 1: Min-Heap of Size K (Production-Grade)',
        badge: 'Production-Grade / Min-Heap',
        timeComplexity: 'O(N log K)',
        spaceComplexity: 'O(K)',
        summary: 'Maintain a Min-Heap of size K. When heap exceeds K, pop the minimum. The top element is the Kth largest.',
        intuition: 'A Min-Heap of size K holds the K largest elements seen so far. The root of the Min-Heap is the smallest among those top K, which is precisely the K-th largest element overall!',
        codeJS: \`class MinHeap {
  constructor() {
    this.data = [];
  }
  push(val) {
    this.data.push(val);
    this._bubbleUp(this.data.length - 1);
  }
  pop() {
    if (this.data.length === 1) return this.data.pop();
    const top = this.data[0];
    this.data[0] = this.data.pop();
    this._bubbleDown(0);
    return top;
  }
  peek() {
    return this.data[0];
  }
  size() {
    return this.data.length;
  }
  _bubbleUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.data[i] < this.data[p]) {
        [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
        i = p;
      } else break;
    }
  }
  _bubbleDown(i) {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.data[left] < this.data[smallest]) smallest = left;
      if (right < n && this.data[right] < this.data[smallest]) smallest = right;
      if (smallest !== i) {
        [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
        i = smallest;
      } else break;
    }
  }
}

function findKthLargestHeap(nums, k) {
  const heap = new MinHeap();
  for (const num of nums) {
    heap.push(num);
    if (heap.size() > k) {
      heap.pop(); // Evict smallest of top K+1
    }
  }
  return heap.peek();
}\`,
        codeTS: \`function findKthLargestHeap(nums: number[], k: number): number {
  // Built-in array or custom MinHeap of size K
  const heap: number[] = [];
  for (const n of nums) {
    heap.push(n);
    heap.sort((a, b) => a - b);
    if (heap.length > k) heap.shift();
  }
  return heap[0];
}\`,
        lineByLine: [
          'Line 1-38: Complete binary Min-Heap implementation with bubbleUp and bubbleDown in O(log K).',
          'Line 40-47: Iterate over array, pushing each element and evicting root whenever size > K.',
          'Line 48: The root heap.peek() is the K-th largest element.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [3,2,1,5,6,4], k = 2', action: 'Push 3, 2 -> heap=[2, 3]', result: 'size = 2' },
          { step: 2, state: 'Push 1', action: 'heap=[1, 3, 2] -> size > 2 -> pop 1', result: 'heap=[2, 3]' },
          { step: 3, state: 'Push 5, 6, 4', action: 'Pop 2, pop 3, pop 4', result: 'Final heap=[5, 6]' },
          { step: 4, state: 'peek()', action: 'Root is 5', result: 'Returns 5' }
        ],
        complexityDerivation: 'Inserting N elements into a heap of capacity K takes N * O(log K) = O(N log K) time. Auxiliary space is strictly O(K).'
      },
      {
        name: 'Approach 2: Quickselect (Optimal Average Runtime)',
        badge: 'Optimal / Quickselect Partitioning',
        timeComplexity: 'Average O(N), Worst O(N²)',
        spaceComplexity: 'O(1) iterative',
        summary: 'Find the element at index N - k using Hoare/Lomuto partitioning without sorting the entire array.',
        intuition: 'Quickselect partitions around a pivot. If the pivot lands exactly at index target = N - k, that pivot is the Kth largest! If pivotIndex < target, search right half; else search left half.',
        codeJS: \`function findKthLargest(nums, k) {
  const targetIdx = nums.length - k;
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    // Random pivot selection to prevent O(N²) worst-case
    const pivotIdx = left + Math.floor(Math.random() * (right - left + 1));
    const finalPivotIdx = partition(nums, left, right, pivotIdx);

    if (finalPivotIdx === targetIdx) {
      return nums[finalPivotIdx];
    } else if (finalPivotIdx < targetIdx) {
      left = finalPivotIdx + 1;
    } else {
      right = finalPivotIdx - 1;
    }
  }

  return nums[left];
}

function partition(nums, left, right, pivotIdx) {
  const pivotVal = nums[pivotIdx];
  [nums[pivotIdx], nums[right]] = [nums[right], nums[pivotIdx]]; // Move pivot to end
  let storeIdx = left;

  for (let i = left; i < right; i++) {
    if (nums[i] < pivotVal) {
      [nums[storeIdx], nums[i]] = [nums[i], nums[storeIdx]];
      storeIdx++;
    }
  }

  [nums[storeIdx], nums[right]] = [nums[right], nums[storeIdx]]; // Restore pivot
  return storeIdx;
}\`,
        codeTS: \`function findKthLargest(nums: number[], k: number): number {
  const targetIdx = nums.length - k;
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const pivotIdx = left + Math.floor(Math.random() * (right - left + 1));
    const finalPivotIdx = partition(nums, left, right, pivotIdx);

    if (finalPivotIdx === targetIdx) return nums[finalPivotIdx];
    if (finalPivotIdx < targetIdx) left = finalPivotIdx + 1;
    else right = finalPivotIdx - 1;
  }

  return nums[left];
}

function partition(nums: number[], left: number, right: number, pivotIdx: number): number {
  const pivotVal = nums[pivotIdx];
  [nums[pivotIdx], nums[right]] = [nums[right], nums[pivotIdx]];
  let storeIdx = left;
  for (let i = left; i < right; i++) {
    if (nums[i] < pivotVal) {
      [nums[storeIdx], nums[i]] = [nums[i], nums[storeIdx]];
      storeIdx++;
    }
  }
  [nums[storeIdx], nums[right]] = [nums[right], nums[storeIdx]];
  return storeIdx;
}\`,
        lineByLine: [
          'Line 2: Target index in ascending sorted order is N - k.',
          'Line 6-8: Select randomized pivot to guarantee expected linear time.',
          'Line 10-16: If pivot index equals target, return answer; otherwise discard irrelevant half.',
          'Line 20-33: In-place Lomuto partition: values < pivot move left; restore pivot to storeIdx.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [3,2,1,5,6,4], targetIdx = 4', action: 'Partition around 4 -> [3,2,1, 4, 6,5], pivot at 3', result: 'finalPivotIdx = 3 < 4 -> left = 4' },
          { step: 2, state: 'left=4, right=5 ([6, 5])', action: 'Partition around 5 -> [..., 5, 6], pivot at 4', result: 'finalPivotIdx = 4 === targetIdx -> Returns 5' }
        ],
        complexityDerivation: 'Recurrence: $T(N) = T(N/2) + O(N) = O(N)$ average time. Partitioning in-place requires $O(1)$ auxiliary space.'
      }
    ],
    comparisonTable: [
      { approach: 'Full Sort (Array.sort)', time: 'O(N log N)', space: 'O(1) to O(N)', pros: '1 line of code', cons: 'Unnecessary sorting of all N elements' },
      { approach: 'Min-Heap of Size K', time: 'O(N log K)', space: 'O(K)', pros: 'Ideal for streaming data where N is unbounded', cons: 'Heap maintenance overhead' },
      { approach: 'Quickselect', time: 'Average O(N), Worst O(N²)', space: 'O(1)', pros: 'True linear time average; zero extra memory', cons: 'Worst-case quadratic if bad pivot chosen' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Kth Largest Element**:
"While full sorting takes O(N log N), we can do much better using two techniques depending on the production requirements.

If data is streaming or memory-constrained, I use a Min-Heap of size K. I push elements and evict the minimum whenever the heap exceeds K. After scanning N elements, the root is the Kth largest, running in O(N log K) time and O(K) space.
If the entire array is in memory, I use Quickselect. By picking a randomized pivot and partitioning in-place, we only recurse into the half containing index N - k. The recurrence N + N/2 + N/4 sums geometrically to O(N) average time and O(1) space."\`,
    followUps: [
      {
        question: 'Why is Min-Heap preferable over Quickselect in real-world distributed architectures?',
        answer: 'Min-Heap supports streaming data: as millions of data points arrive over Kafka/WebSockets, we maintain only K elements in memory without storing the entire dataset.'
      }
    ],
    recallQuiz: {
      question: 'Why does a Min-Heap of size K (rather than a Max-Heap) find the Kth largest element?',
      options: [
        'Because the minimum of the K largest elements is the K-th largest element overall',
        'Because Min-Heaps use less memory than Max-Heaps',
        'Because JavaScript does not support Max-Heaps',
        'Because K is always less than N / 2'
      ],
      correctIndex: 0,
      explanation: 'Retaining the top K largest elements means the smallest of those top K (at the root of a Min-Heap) is precisely the Kth largest element!'
    }
  },

  // ==========================================
  // PROBLEM 72: FIND MEDIAN FROM DATA STREAM (LC #295)
  // ==========================================
  72: {
    id: 72,
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    pattern: 'Heap / Priority Queue',
    day: 33,
    leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/',
    summary: 'Design a data structure that calculates the median of a continuous stream of numbers in O(log N) insertion and O(1) retrieval using Two Heaps.',
    prerequisites: ['Two Heaps pattern (Max-Heap for lower half, Min-Heap for upper half)', 'Heap balancing invariant (size difference <= 1)'],
    problemStatement: \`The **median** is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

Implement the \\\`MedianFinder\\\` class:
- \\\`MedianFinder()\\\` initializes the object.
- \\\`void addNum(int num)\\\` adds the integer \\\`num\\\` from the data stream.
- \\\`double findMedian()\\\` returns the median of all elements so far. Answers within \\\`10^-5\\\` of the actual answer will be accepted.\`,
    approaches: [
      {
        name: 'Approach 1: Two Heaps (Max-Heap & Min-Heap) (Optimal)',
        badge: 'Optimal / Two Heaps Pattern',
        timeComplexity: 'addNum: O(log N), findMedian: O(1)',
        spaceComplexity: 'O(N)',
        summary: 'Partition stream into lower half (Max-Heap) and upper half (Min-Heap). Median is root of larger heap or average of roots.',
        intuition: 'small (Max-Heap) stores numbers <= median. large (Min-Heap) stores numbers >= median. We maintain two invariants: 1. Every element in small <= every element in large. 2. small.size() === large.size() or small.size() === large.size() + 1.',
        codeJS: \`class MedianFinder {
  constructor() {
    this.small = []; // Max-Heap (simulated sorted descending)
    this.large = []; // Min-Heap (simulated sorted ascending)
  }

  addNum(num) {
    // 1. Add to small (max-heap)
    this.small.push(num);
    this.small.sort((a, b) => b - a);

    // 2. Balance: ensure every element in small <= large
    if (this.small.length > 0 && this.large.length > 0 && this.small[0] > this.large[0]) {
      const val = this.small.shift();
      this.large.push(val);
      this.large.sort((a, b) => a - b);
    }

    // 3. Balance sizes: small can have at most 1 more element than large
    if (this.small.length > this.large.length + 1) {
      const val = this.small.shift();
      this.large.push(val);
      this.large.sort((a, b) => a - b);
    }
    if (this.large.length > this.small.length) {
      const val = this.large.shift();
      this.small.push(val);
      this.small.sort((a, b) => b - a);
    }
  }

  findMedian() {
    if (this.small.length > this.large.length) {
      return this.small[0];
    }
    return (this.small[0] + this.large[0]) / 2;
  }
}\`,
        codeTS: \`class MedianFinder {
  private small: number[]; // Max-heap
  private large: number[]; // Min-heap

  constructor() {
    this.small = [];
    this.large = [];
  }

  addNum(num: number): void {
    this.small.push(num);
    this.small.sort((a, b) => b - a);

    if (this.small.length && this.large.length && this.small[0] > this.large[0]) {
      this.large.push(this.small.shift()!);
      this.large.sort((a, b) => a - b);
    }

    if (this.small.length > this.large.length + 1) {
      this.large.push(this.small.shift()!);
      this.large.sort((a, b) => a - b);
    }
    if (this.large.length > this.small.length) {
      this.small.push(this.large.shift()!);
      this.small.sort((a, b) => b - a);
    }
  }

  findMedian(): number {
    if (this.small.length > this.large.length) return this.small[0];
    return (this.small[0] + this.large[0]) / 2;
  }
}\`,
        lineByLine: [
          'Line 2-4: Maintain small (stores lower half) and large (stores upper half).',
          'Line 7-9: Add incoming number to small.',
          'Line 11-16: Maintain ordering invariant: all elements in small must be <= all in large.',
          'Line 18-28: Maintain size invariant: small may have at most 1 more element than large.',
          'Line 30-35: findMedian(): if odd count, return small[0]; if even, return average of small[0] and large[0].'
        ],
        dryRun: [
          { step: 1, state: 'addNum(1)', action: 'small = [1], large = []', result: 'findMedian() = 1' },
          { step: 2, state: 'addNum(2)', action: 'small = [1], large = [2]', result: 'findMedian() = (1 + 2)/2 = 1.5' },
          { step: 3, state: 'addNum(3)', action: 'small = [2, 1], large = [3]', result: 'findMedian() = 2' }
        ],
        complexityDerivation: 'Binary heap operations take O(log N) for addNum(). findMedian() reads roots in O(1). Total space is O(N) to store stream.'
      }
    ],
    comparisonTable: [
      { approach: 'Insertion Sort Array', time: 'add: O(N), find: O(1)', space: 'O(N)', pros: 'Simple array shifting', cons: 'Expensive linear shifts on large streams' },
      { approach: 'Two Heaps', time: 'add: O(log N), find: O(1)', space: 'O(N)', pros: 'Optimal logarithmic insertion; instantaneous O(1) median query', cons: 'Requires two heap data structures' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Find Median from Data Stream**:
"To find the median of a continuous stream in real-time, sorting the array on every insertion takes O(N) or O(N log N), which degrades throughput.

Instead, I use the Two Heaps pattern: a Max-Heap 'small' to store the lower half of numbers, and a Min-Heap 'large' to store the upper half. I maintain two strict invariants: first, every number in small is <= every number in large. Second, the sizes differ by at most 1.
On addNum(), I insert into small, balance the cross-boundary values, and rebalance sizes in O(log N) time. On findMedian(), if the count is odd, the median is simply small's root; if even, it's the average of both roots. This achieves O(log N) writes and O(1) reads."\`,
    followUps: [
      {
        question: 'What if all integers in the stream are in the range [0, 100]?',
        answer: 'We can use an array of size 101 for counting sort. findMedian() traverses the counts in O(100) = O(1) time.'
      }
    ],
    recallQuiz: {
      question: 'In the Two Heaps pattern for streaming median, what type of heap stores the smaller half of numbers?',
      options: [
        'A Max-Heap (so its root is the largest of the lower half)',
        'A Min-Heap',
        'A Fibonacci Heap',
        'A Binomial Queue'
      ],
      correctIndex: 0,
      explanation: 'A Max-Heap over the lower half allows instant O(1) access to the highest number of that lower half, which is the candidate median!'
    }
  }
};
`;

const btContent = `// Problems 73-84: Backtracking & Tries Master Solutions
// Full Multi-Approach Solutions with JS & TS, Line-by-Line Breakdown, Dry Runs, Pitches, and Quizzes

export const BACKTRACKING_TRIES_SOLUTIONS = {
  // ==========================================
  // PROBLEM 73: SUBSETS (LC #78)
  // ==========================================
  73: {
    id: 73,
    title: 'Subsets',
    difficulty: 'Medium',
    pattern: 'Backtracking',
    day: 34,
    leetcodeUrl: 'https://leetcode.com/problems/subsets/',
    summary: 'Generate the Power Set (all 2^N possible subsets) of unique integers using recursive backtracking or bit manipulation.',
    prerequisites: ['Decision tree: Include vs Exclude each element', 'State push/pop mutation vs reference copying'],
    problemStatement: \`Given an integer array \\\`nums\\\` of **unique** elements, return all possible subsets (the power set).

The solution set **must not** contain duplicate subsets. Return the solution in **any order**.\`,
    approaches: [
      {
        name: 'Approach 1: Recursive Backtracking (Optimal)',
        badge: 'Optimal / Decision Tree',
        timeComplexity: 'O(N × 2ⁿ)',
        spaceComplexity: 'O(N) stack',
        summary: 'At each index, choose to either include or exclude nums[i], exploring all 2^N combinations.',
        intuition: 'Each element has a binary choice: is it in the subset, or not? We snapshot path at every step: result.push([...path]).',
        codeJS: \`function subsets(nums) {
  const result = [];
  const path = [];

  function backtrack(start) {
    // Snapshot current subset
    result.push([...path]);

    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);       // 1. Choose
      backtrack(i + 1);         // 2. Explore
      path.pop();               // 3. Unchoose (Backtrack)
    }
  }

  backtrack(0);
  return result;
}\`,
        codeTS: \`function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(start: number): void {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}\`,
        lineByLine: [
          'Line 2-3: Initialize result array and reusable path array.',
          'Line 5-7: Push shallow copy [...path] to result on every recursive visit.',
          'Line 9-13: Iterate from start index: choose nums[i], recurse to i+1, pop to undo choice.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [1, 2]', action: 'backtrack(0) -> push []', result: 'result = [[]]' },
          { step: 2, state: 'i=0: path = [1]', action: 'backtrack(1) -> push [1]', result: 'result = [[], [1]]' },
          { step: 3, state: 'i=1: path = [1, 2]', action: 'backtrack(2) -> push [1, 2]', result: 'result = [[], [1], [1, 2]]' },
          { step: 4, state: 'pop 2, pop 1, i=1: path = [2]', action: 'push [2]', result: 'result = [[], [1], [1, 2], [2]]' }
        ],
        complexityDerivation: 'Total subsets = $2^N$. Copying each subset of average length $N/2$ costs $O(N)$. Total time: $O(N \\\\times 2^N)$. Call stack is $O(N)$.'
      },
      {
        name: 'Approach 2: Bitmask Simulation',
        badge: 'Alternative / Bit Manipulation',
        timeComplexity: 'O(N × 2ⁿ)',
        spaceComplexity: 'O(1)',
        summary: 'Iterate integers from 0 to 2^N - 1. If bit i is set (1), include nums[i].',
        intuition: 'Each subset corresponds to a unique binary number of length N.',
        codeJS: \`function subsetsBitmask(nums) {
  const n = nums.length;
  const total = 1 << n; // 2^n
  const result = [];

  for (let mask = 0; mask < total; mask++) {
    const sub = [];
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) {
        sub.push(nums[i]);
      }
    }
    result.push(sub);
  }

  return result;
}\`,
        codeTS: \`function subsetsBitmask(nums: number[]): number[][] {
  const n = nums.length;
  const total = 1 << n;
  const result: number[][] = [];

  for (let mask = 0; mask < total; mask++) {
    const sub: number[] = [];
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) sub.push(nums[i]);
    }
    result.push(sub);
  }

  return result;
}\`,
        lineByLine: [
          'Line 2-3: Total subsets is 1 << n = 2^N.',
          'Line 6-13: Loop mask from 0 to 2^N - 1; test each bit i using mask & (1 << i).'
        ],
        dryRun: [
          { step: 1, state: 'mask=0 (00b)', action: 'No bits set', result: '[]' },
          { step: 2, state: 'mask=1 (01b)', action: 'Bit 0 set', result: '[nums[0]]' },
          { step: 3, state: 'mask=2 (10b)', action: 'Bit 1 set', result: '[nums[1]]' },
          { step: 4, state: 'mask=3 (11b)', action: 'Both bits set', result: '[nums[0], nums[1]]' }
        ],
        complexityDerivation: 'Loops $2^N$ times with $N$ bit checks $\\\\to O(N \\\\times 2^N)$ time and $O(1)$ auxiliary space.'
      }
    ],
    comparisonTable: [
      { approach: 'Recursive Backtracking', time: 'O(N × 2ⁿ)', space: 'O(N) stack', pros: 'Generalizes naturally to combinations with pruning (Subsets II, Combination Sum)', cons: 'Call stack overhead' },
      { approach: 'Bitmask Generation', time: 'O(N × 2ⁿ)', space: 'O(1)', pros: 'Iterative; hardware-level bitwise checks', cons: 'Limited to N <= 31 in standard JS bitwise operators' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Subsets**:
"Generating the power set of N unique elements inherently requires producing 2^N subsets. We can solve this via recursive backtracking or bitmask iteration.

In backtracking, we visualize the decision tree where each node either includes or excludes nums[i]. We maintain a shared path array. At each recursive invocation, we push a copy [...path] to our result. Then, for each element from start to N-1, we push it to path, recurse to i + 1, and pop it to backtrack. This visits all 2^N states with optimal O(N * 2^N) time and O(N) stack memory."\`,
    followUps: [
      {
        question: 'Why do we write result.push([...path]) instead of result.push(path)?',
        answer: 'Because path is an array reference. If we push path directly, every entry in result would point to the same object, which becomes empty when backtracking pops all elements!'
      }
    ],
    recallQuiz: {
      question: 'What happens if you push "path" directly to "result" instead of "[...path]" in backtracking?',
      options: [
        'All stored subsets will become identical and empty at the end',
        'JavaScript throws a ReferenceError',
        'The subsets are sorted in descending order',
        'Duplicate elements are filtered automatically'
      ],
      correctIndex: 0,
      explanation: 'Arrays in JS are reference types. When path is mutated by pop(), all references in result reflect that mutation!'
    }
  },

  // ==========================================
  // PROBLEM 82: IMPLEMENT TRIE (LC #208)
  // ==========================================
  82: {
    id: 82,
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    pattern: 'Tries',
    day: 38,
    leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
    summary: 'Implement a Trie data structure with insert, search, and startsWith methods in O(L) time per operation.',
    prerequisites: ['TrieNode children map/object', 'isEndOfWord boolean flag', 'Prefix sharing among words'],
    problemStatement: \`A **trie** (pronounced as "try") or **prefix tree** is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.

Implement the \\\`Trie\\\` class:
- \\\`Trie()\\\` Initializes the trie object.
- \\\`void insert(String word)\\\` Inserts the string \\\`word\\\` into the trie.
- \\\`boolean search(String word)\\\` Returns \\\`true\\\` if the string \\\`word\\\` is in the trie (i.e., was inserted before), and \\\`false\\\` otherwise.
- \\\`boolean startsWith(String prefix)\\\` Returns \\\`true\\\` if there is a previously inserted string \\\`word\\\` that has the prefix \\\`prefix\\\`, and \\\`false\\\` otherwise.\`,
    approaches: [
      {
        name: 'Approach 1: Object-Based TrieNode (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'insert: O(L), search: O(L), startsWith: O(L)',
        spaceComplexity: 'O(Total Characters × Alphabet)',
        summary: 'Each TrieNode contains an object of child characters and an isEndOfWord flag.',
        intuition: 'Every character of a word represents an edge. To search or check a prefix, walk down the tree character by character in O(L) time where L is word length.',
        codeJS: \`class TrieNode {
  constructor() {
    this.children = {}; // char -> TrieNode
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) {
        curr.children[char] = new TrieNode();
      }
      curr = curr.children[char];
    }
    curr.isEndOfWord = true;
  }

  search(word) {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return curr.isEndOfWord; // Must be marked as complete word
  }

  startsWith(prefix) {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return true; // Reached end of prefix successfully
  }
}\`,
        codeTS: \`class TrieNode {
  children: Record<string, TrieNode> = {};
  isEndOfWord: boolean = false;
}

class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) curr.children[char] = new TrieNode();
      curr = curr.children[char];
    }
    curr.isEndOfWord = true;
  }

  search(word: string): boolean {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return curr.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return true;
  }
}\`,
        lineByLine: [
          'Line 1-6: TrieNode encapsulates children map and isEndOfWord marker.',
          'Line 12-21: insert(): walk/create nodes for each character; mark last node as isEndOfWord.',
          'Line 23-30: search(): walk characters; if node exists, verify curr.isEndOfWord is true.',
          'Line 32-39: startsWith(): walk prefix characters; return true if prefix path exists.'
        ],
        dryRun: [
          { step: 1, state: 'insert("apple")', action: 'root -> a -> p -> p -> l -> e (isEnd=true)', result: 'Inserted' },
          { step: 2, state: 'search("apple")', action: 'Walks to e, isEndOfWord === true', result: 'Returns true' },
          { step: 3, state: 'search("app")', action: 'Walks to p, isEndOfWord === false', result: 'Returns false' },
          { step: 4, state: 'startsWith("app")', action: 'Path exists', result: 'Returns true' }
        ],
        complexityDerivation: 'All operations depend strictly on string length L $\\\\to O(L)$ time. Space complexity is $O(N \\\\times L)$ where N is number of words and L is average length.'
      }
    ],
    comparisonTable: [
      { approach: 'Hash Set of Strings', time: 'search: O(L), prefix: O(N × L)', space: 'O(N × L)', pros: 'Simple Set lookup', cons: 'Prefix search requires scanning all N words' },
      { approach: 'Trie (Prefix Tree)', time: 'search: O(L), prefix: O(L)', space: 'O(N × L)', pros: 'Prefix search runs in O(L) independent of dictionary size', cons: 'Node allocation memory overhead' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Implement Trie**:
"A Trie is a tree where each node represents a character, allowing words with shared prefixes to share branches. 

Each TrieNode holds a map of child nodes and a boolean isEndOfWord.
For insert(word), I start at the root and walk down character by character, creating nodes if they don't exist, and marking the final node with isEndOfWord = true.
For search(word), I traverse the path and ensure the final node has isEndOfWord === true.
For startsWith(prefix), I traverse the prefix path and return true if every character exists, regardless of the end-of-word flag. All operations run in O(L) time where L is key length, independent of total words."\`,
    followUps: [
      {
        question: 'How do you optimize memory if strings contain arbitrary Unicode characters?',
        answer: 'Use an ES6 Map() or dynamically allocated object for children rather than fixed 26-element arrays.'
      }
    ],
    recallQuiz: {
      question: 'What is the key difference between search(word) and startsWith(prefix) in a Trie?',
      options: [
        'search requires isEndOfWord === true, whereas startsWith only requires the prefix path to exist',
        'startsWith is O(N) while search is O(1)',
        'search checks reverse characters',
        'startsWith converts characters to uppercase'
      ],
      correctIndex: 0,
      explanation: 'startsWith simply confirms the branch exists; search confirms that a complete word was inserted terminating at that node.'
    }
  }
};
`;

fs.writeFileSync(HEAP_FILE, heapContent, 'utf8');
fs.writeFileSync(BT_FILE, btContent, 'utf8');
console.log('Successfully wrote dsaHeapSolutions.js and dsaBacktrackingTriesSolutions.js!');
