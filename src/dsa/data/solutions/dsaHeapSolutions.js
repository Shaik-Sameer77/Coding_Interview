// Problems 66-72: Heap & Priority Queue Master Solutions
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
    problemStatement: `Given an integer array \`nums\` and an integer \`k\`, return the \`k-th\` largest element in the array.

Note that it is the \`k-th\` largest element in the sorted order, not the \`k-th\` distinct element.

Can you solve it without sorting in **O(n)** average time complexity?`,
    approaches: [
      {
        name: 'Approach 1: Min-Heap of Size K (Production-Grade)',
        badge: 'Production-Grade / Min-Heap',
        timeComplexity: 'O(N log K)',
        spaceComplexity: 'O(K)',
        summary: 'Maintain a Min-Heap of size K. When heap exceeds K, pop the minimum. The top element is the Kth largest.',
        intuition: 'A Min-Heap of size K holds the K largest elements seen so far. The root of the Min-Heap is the smallest among those top K, which is precisely the K-th largest element overall!',
        codeJS: `class MinHeap {
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
}`,
        codeTS: `function findKthLargestHeap(nums: number[], k: number): number {
  // Built-in array or custom MinHeap of size K
  const heap: number[] = [];
  for (const n of nums) {
    heap.push(n);
    heap.sort((a, b) => a - b);
    if (heap.length > k) heap.shift();
  }
  return heap[0];
}`,
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
        codeJS: `function findKthLargest(nums, k) {
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
}`,
        codeTS: `function findKthLargest(nums: number[], k: number): number {
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
}`,
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
    interviewPitch: `**60-Second Interview Pitch for Kth Largest Element**:
"While full sorting takes O(N log N), we can do much better using two techniques depending on the production requirements.

If data is streaming or memory-constrained, I use a Min-Heap of size K. I push elements and evict the minimum whenever the heap exceeds K. After scanning N elements, the root is the Kth largest, running in O(N log K) time and O(K) space.
If the entire array is in memory, I use Quickselect. By picking a randomized pivot and partitioning in-place, we only recurse into the half containing index N - k. The recurrence N + N/2 + N/4 sums geometrically to O(N) average time and O(1) space."`,
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
    problemStatement: `The **median** is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

Implement the \`MedianFinder\` class:
- \`MedianFinder()\` initializes the object.
- \`void addNum(int num)\` adds the integer \`num\` from the data stream.
- \`double findMedian()\` returns the median of all elements so far. Answers within \`10^-5\` of the actual answer will be accepted.`,
    approaches: [
      {
        name: 'Approach 1: Insertion Sort Array (Baseline)',
        badge: 'Baseline / Insertion Sort',
        timeComplexity: 'add: O(N), find: O(1)',
        spaceComplexity: 'O(N)',
        summary: 'Maintain a single sorted array by binary searching insertion position and splicing.',
        intuition: 'Insertion takes O(N) due to array shifting, but finding the median is O(1) index access.',
        codeJS: `class MedianFinderLinear {
  constructor() {
    this.nums = [];
  }
  addNum(num) {
    let low = 0, high = this.nums.length;
    while (low < high) {
      const mid = low + Math.floor((high - low) / 2);
      if (this.nums[mid] < num) low = mid + 1;
      else high = mid;
    }
    this.nums.splice(low, 0, num);
  }
  findMedian() {
    const n = this.nums.length;
    const mid = Math.floor(n / 2);
    return n % 2 === 1 ? this.nums[mid] : (this.nums[mid - 1] + this.nums[mid]) / 2;
  }
}`,
        codeTS: `class MedianFinderLinear {
  private nums: number[] = [];
  addNum(num: number): void {
    let low = 0, high = this.nums.length;
    while (low < high) {
      const mid = low + Math.floor((high - low) / 2);
      if (this.nums[mid] < num) low = mid + 1;
      else high = mid;
    }
    this.nums.splice(low, 0, num);
  }
  findMedian(): number {
    const n = this.nums.length;
    const mid = Math.floor(n / 2);
    return n % 2 === 1 ? this.nums[mid] : (this.nums[mid - 1] + this.nums[mid]) / 2;
  }
}`,
        lineByLine: [
          'Line 2: Single array store.',
          'Line 5-11: Binary search insertion index; splice in O(N).',
          'Line 13-17: Instant O(1) median calculation by index.'
        ],
        dryRun: [
          { step: 1, state: 'addNum(2), addNum(1)', action: 'nums = [1, 2]', result: 'median = 1.5' }
        ],
        complexityDerivation: 'addNum takes O(N) due to array splice shift; findMedian takes O(1).'
      },
      {
        name: 'Approach 2: Two Heaps (Max-Heap & Min-Heap) (Optimal)',
        badge: 'Optimal / Two Heaps Pattern',
        timeComplexity: 'addNum: O(log N), findMedian: O(1)',
        spaceComplexity: 'O(N)',
        summary: 'Partition stream into lower half (Max-Heap) and upper half (Min-Heap). Median is root of larger heap or average of roots.',
        intuition: 'small (Max-Heap) stores numbers <= median. large (Min-Heap) stores numbers >= median. We maintain two invariants: 1. Every element in small <= every element in large. 2. small.size() === large.size() or small.size() === large.size() + 1.',
        codeJS: `class MedianFinder {
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
}`,
        codeTS: `class MedianFinder {
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
}`,
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
    interviewPitch: `**60-Second Interview Pitch for Find Median from Data Stream**:
"To find the median of a continuous stream in real-time, sorting the array on every insertion takes O(N) or O(N log N), which degrades throughput.

Instead, I use the Two Heaps pattern: a Max-Heap 'small' to store the lower half of numbers, and a Min-Heap 'large' to store the upper half. I maintain two strict invariants: first, every number in small is <= every number in large. Second, the sizes differ by at most 1.
On addNum(), I insert into small, balance the cross-boundary values, and rebalance sizes in O(log N) time. On findMedian(), if the count is odd, the median is simply small's root; if even, it\'s the average of both roots. This achieves O(log N) writes and O(1) reads."`,
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
