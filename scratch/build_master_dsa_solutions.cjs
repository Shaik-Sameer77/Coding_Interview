// Master DSA Solutions Expansion Script
const fs = require('fs');
const path = require('path');

const ADVANCED_SOLUTIONS_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaAdvancedPatternSolutions.js');

const advancedSolutionsContent = `// Advanced Canonical Solutions for Trees, Graphs, DP, Heap, Backtracking, Tries, Intervals, Greedy, Math, Bits
// Fully typed JS & TS, line-by-line breakdowns, multiple approaches, dry runs, pitches, and quizzes

export const ADVANCED_PATTERN_SOLUTIONS = {
  // ==========================================
  // PROBLEM 9: SUBARRAY SUM EQUALS K (LeetCode #560)
  // ==========================================
  9: {
    id: 9,
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    pattern: 'Hashing',
    day: 4,
    leetcodeUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    summary: 'Find the total number of continuous subarrays whose sum equals k using running prefix sums and a hash map.',
    prerequisites: ['Prefix Sum concept (sum(i..j) = prefix[j] - prefix[i-1])', 'Hash Map frequency counting', 'Handling negative numbers where two pointers fail'],
    problemStatement: \`Given an array of integers \\\`nums\\\` and an integer \\\`k\\\`, return the total number of continuous subarrays whose sum equals to \\\`k\\\`.

### Why Two Pointers / Sliding Window Fails:
If \\\`nums\\\` contains negative numbers, expanding or shrinking the window does not monotonically increase or decrease the sum. Thus, **Prefix Sum + Hash Map** is the only optimal $O(N)$ approach.

### Examples:
- **Example 1**: \\\`nums = [1,1,1], k = 2\\\` $\\\\to$ \\\`2\\\` (Subarrays: [1,1] at index 0-1 and index 1-2)
- **Example 2**: \\\`nums = [1,2,3], k = 3\\\` $\\\\to$ \\\`2\\\` (Subarrays: [1,2] and [3])\`,
    approaches: [
      {
        name: 'Approach 1: Nested Loops (Baseline)',
        badge: 'Baseline / Brute Force',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        summary: 'Compute the running sum of every continuous subarray starting at index i and ending at index j.',
        intuition: 'Fix starting pointer i from 0 to N-1. Maintain a running sum as j extends from i to N-1. Whenever sum === k, increment count.',
        codeJS: \`function subarraySumBrute(nums, k) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let currentSum = 0;
    for (let j = i; j < nums.length; j++) {
      currentSum += nums[j];
      if (currentSum === k) count++;
    }
  }
  return count;
}\`,
        codeTS: \`function subarraySumBrute(nums: number[], k: number): number {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let currentSum = 0;
    for (let j = i; j < nums.length; j++) {
      currentSum += nums[j];
      if (currentSum === k) count++;
    }
  }
  return count;
}\`,
        lineByLine: [
          'Line 1-2: Initialize total matching subarray count to 0.',
          'Line 3: Outer loop selects start index i.',
          'Line 4-5: Inner loop adds nums[j] to running subarray sum without re-summing from scratch.',
          'Line 6: If running sum matches target k, increment count.',
          'Line 9: Return final count.'
        ],
        dryRun: [
          { step: 1, state: 'i=0, j=0', action: 'currentSum = 1', result: 'sum != 2' },
          { step: 2, state: 'i=0, j=1', action: 'currentSum = 1 + 1 = 2', result: 'Match! count = 1' },
          { step: 3, state: 'i=0, j=2', action: 'currentSum = 2 + 1 = 3', result: 'sum != 2' },
          { step: 4, state: 'i=1, j=1', action: 'currentSum = 1', result: 'sum != 2' },
          { step: 5, state: 'i=1, j=2', action: 'currentSum = 1 + 1 = 2', result: 'Match! count = 2' }
        ],
        complexityDerivation: 'Outer loop runs N times, inner loop runs on average N/2 times $\\\\to O(N^2)$ time. Allocates $O(1)$ extra space.'
      },
      {
        name: 'Approach 2: Prefix Sum + Hash Map (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Track running prefix sum and query hash map for prefixSum - k in O(1) time.',
        intuition: 'If prefixSum[j] - prefixSum[i] = k, then the subarray between i+1 and j sums to k! Therefore, at each index j, we ask: "How many times have we seen a prefix sum equal to (currentPrefixSum - k)?" We pre-populate map with {0: 1} to handle subarrays starting at index 0.',
        codeJS: \`function subarraySum(nums, k) {
  let count = 0;
  let prefixSum = 0;
  const prefixCount = new Map();
  prefixCount.set(0, 1);

  for (const num of nums) {
    prefixSum += num;
    const target = prefixSum - k;

    if (prefixCount.has(target)) {
      count += prefixCount.get(target);
    }

    prefixCount.set(prefixSum, (prefixCount.get(prefixSum) || 0) + 1);
  }

  return count;
}\`,
        codeTS: \`function subarraySum(nums: number[], k: number): number {
  let count: number = 0;
  let prefixSum: number = 0;
  const prefixCount = new Map<number, number>();
  prefixCount.set(0, 1);

  for (const num of nums) {
    prefixSum += num;
    const target = prefixSum - k;

    if (prefixCount.has(target)) {
      count += prefixCount.get(target)!;
    }

    prefixCount.set(prefixSum, (prefixCount.get(prefixSum) || 0) + 1);
  }

  return count;
}\`,
        lineByLine: [
          'Line 1-5: Initialize count, running prefixSum, and prefixCount Map with {0: 1} for whole-prefix matches.',
          'Line 7-8: Iterate through each number, updating running prefixSum.',
          'Line 9: Compute required previous prefix sum target = prefixSum - k.',
          'Line 11-13: If target exists in Map, add its frequency to count (all valid subarray starts).',
          'Line 15: Record/increment current prefixSum in Map.',
          'Line 18: Return total matching subarrays.'
        ],
        dryRun: [
          { step: 1, state: 'num = 1, prefixSum = 1', action: 'target = 1 - 2 = -1 (not found). Record 1: 1', result: 'count = 0, Map = {0:1, 1:1}' },
          { step: 2, state: 'num = 1, prefixSum = 2', action: 'target = 2 - 2 = 0 (found count 1). Record 2: 1', result: 'count = 1, Map = {0:1, 1:1, 2:1}' },
          { step: 3, state: 'num = 1, prefixSum = 3', action: 'target = 3 - 2 = 1 (found count 1). Record 3: 1', result: 'count = 2, Map = {0:1, 1:1, 2:1, 3:1}' }
        ],
        complexityDerivation: 'Single pass over array of size N with O(1) hash map operations gives O(N) time. Hash map holds at most N distinct prefix sums, requiring O(N) auxiliary space.'
      }
    ],
    comparisonTable: [
      { approach: 'Brute Force Nested Loops', time: 'O(N²)', space: 'O(1)', pros: 'Zero auxiliary memory', cons: 'Time Limit Exceeded on N >= 20,000' },
      { approach: 'Prefix Sum + Hash Map', time: 'O(N)', space: 'O(N)', pros: 'Single pass linear time; handles negative numbers seamlessly', cons: 'Requires O(N) heap allocations for hash table' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Subarray Sum Equals K**:
"To solve Subarray Sum Equals K, my first consideration is whether negative numbers exist. Since nums can have negative values, sliding window fails because the sum does not grow monotonically. 

Instead, I use the Prefix Sum identity: if prefixSum[j] - prefixSum[i] = k, the subarray between i+1 and j sums to k. I maintain a running prefix sum and a Hash Map storing the frequencies of past prefix sums, initialized with {0: 1}. At each element, I query the map for prefixSum - k in O(1) time and add its frequency to my answer. This achieves optimal O(N) time and O(N) space."\`,
    followUps: [
      {
        question: 'Why must we initialize the prefix map with {0: 1}?',
        answer: 'Because if the running prefix sum itself equals k, then prefixSum - k = 0. The empty prefix before index 0 has sum 0, so without {0: 1}, subarrays starting at index 0 would not be counted!'
      },
      {
        question: 'Can we optimize space to O(1) if all numbers are strictly positive?',
        answer: 'Yes! If all numbers are non-negative, the prefix sum is monotonically non-decreasing, so we can use a two-pointer sliding window in O(N) time and O(1) space.'
      }
    ],
    recallQuiz: {
      question: 'Why does two-pointer sliding window fail for Subarray Sum Equals K on arbitrary arrays?',
      options: [
        'Because negative numbers break monotonic window sum growth',
        'Because JavaScript arrays cannot hold negative numbers',
        'Because hash maps are always faster than pointers',
        'Because k can be a floating point number'
      ],
      correctIndex: 0,
      explanation: 'Two pointers relies on the invariant that advancing the right pointer strictly increases the sum and advancing the left pointer strictly decreases it. Negative numbers destroy this invariant!'
    }
  },

  // ==========================================
  // PROBLEM 15: TRAPPING RAIN WATER (LeetCode #42)
  // ==========================================
  15: {
    id: 15,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    pattern: 'Two Pointers',
    day: 8,
    leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    summary: 'Compute how much water can be trapped after raining above an elevation map using two pointers.',
    prerequisites: ['Two Pointers inward convergence', 'Understanding that water at index i = max(0, min(leftMax, rightMax) - height[i])'],
    problemStatement: \`Given \\\`n\\\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

### Intuition:
At any index \\\`i\\\`, the amount of trapped water is determined by the shorter of the tallest bar to its left and the tallest bar to its right:
$$\\\\text{water}[i] = \\\\max(0, \\\\min(\\\\text{leftMax}[i], \\\\text{rightMax}[i]) - \\\\text{height}[i])$$

Instead of precomputing arrays for leftMax and rightMax in $O(N)$ space, we can converge two pointers inward in $O(1)$ space!\`,
    approaches: [
      {
        name: 'Approach 1: Two Pointers Inward Convergence (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Converge left and right pointers inward, advancing whichever side has the smaller max.',
        intuition: 'If leftMax < rightMax, the trapped water at left is bottlenecked strictly by leftMax, regardless of how much taller bars further to the right are! Symmetrically, if rightMax <= leftMax, process right and advance right--.',
        codeJS: \`function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        totalWater += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }

  return totalWater;
}\`,
        codeTS: \`function trap(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        totalWater += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }

  return totalWater;
}\`,
        lineByLine: [
          'Line 1-6: Initialize two pointers at array boundaries and track running leftMax, rightMax, totalWater.',
          'Line 8: Loop while pointers have not converged.',
          'Line 9: If height[left] < height[right], water at left is bottlenecked by leftMax.',
          'Line 10-14: Update leftMax if new height is higher; otherwise add difference to totalWater, and increment left.',
          'Line 15-20: Symmetrically update rightMax or add water, and decrement right.',
          'Line 24: Return accumulated total water.'
        ],
        dryRun: [
          { step: 1, state: 'left=0 (0), right=11 (1)', action: 'height[left] < height[right] -> update leftMax = 0, left = 1', result: 'water = 0' },
          { step: 2, state: 'left=1 (1), right=11 (1)', action: 'height[left] >= height[right] -> update rightMax = 1, right = 10', result: 'water = 0' },
          { step: 3, state: 'left=1 (1), right=10 (2)', action: 'height[left] < height[right] -> leftMax = 1, left = 2', result: 'water = 0' },
          { step: 4, state: 'left=2 (0), right=10 (2)', action: 'leftMax (1) > height[2] (0) -> water += 1 - 0 = 1', result: 'water = 1' }
        ],
        complexityDerivation: 'Every iteration advances either left or right pointer by 1. Total iterations = N - 1 $\\\\to O(N)$ time. Uses 5 primitive numeric variables $\\\\to O(1)$ space.'
      }
    ],
    comparisonTable: [
      { approach: 'Precomputed Max Arrays', time: 'O(N)', space: 'O(N)', pros: 'Intuitive mental model; easy to write', cons: 'Allocates 2 extra arrays of size N' },
      { approach: 'Two Pointers Inward', time: 'O(N)', space: 'O(1)', pros: 'Optimal asymptotic complexity; zero heap allocations', cons: 'Requires careful invariant reasoning' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Trapping Rain Water**:
"Trapping Rain Water boils down to realizing that water trapped at index i equals min(leftMax, rightMax) - height[i]. While we could precompute leftMax and rightMax arrays in O(N) space, we can optimize to O(1) space using two pointers.

We initialize left at 0 and right at n-1. Whichever side has the smaller height is our bottleneck: if height[left] < height[right], we know with mathematical certainty that any rightMax is at least as tall as height[right], which is greater than leftMax. Therefore, leftMax is the true limiting barrier for the left pointer! We update leftMax or trap water, advance left, and repeat. This delivers optimal O(N) time and O(1) auxiliary space."\`,
    followUps: [
      {
        question: 'Can this problem also be solved with a Monotonic Stack?',
        answer: 'Yes! A monotonic decreasing stack can calculate water trapped horizontally (layer-by-layer) between left and right bounding walls in O(N) time and O(N) space.'
      }
    ],
    recallQuiz: {
      question: 'When height[left] < height[right], why are we certain that leftMax is the limiting bottleneck?',
      options: [
        'Because height[right] guarantees that a right wall at least as tall as leftMax already exists',
        'Because water can only flow from left to right',
        'Because leftMax is always greater than rightMax',
        'Because arrays in JavaScript are sorted by default'
      ],
      correctIndex: 0,
      explanation: 'Since height[right] > height[left], we know there is a barrier to the right that is at least height[right] tall, which is greater than leftMax. Thus, leftMax is strictly the smaller of the two boundaries!'
    }
  },

  // ==========================================
  // PROBLEM 27: DAILY TEMPERATURES (LeetCode #739)
  // ==========================================
  27: {
    id: 27,
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    pattern: 'Stack',
    day: 15,
    leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/',
    summary: 'Find how many days you would have to wait until a warmer temperature occurs using a monotonic decreasing stack.',
    prerequisites: ['Monotonic Stack mechanics', 'Storing indices instead of raw values', 'Next Greater Element archetype'],
    problemStatement: \`Given an array of integers \\\`temperatures\\\` representing the daily temperatures, return an array \\\`answer\\\` such that \\\`answer[i]\\\` is the number of days you have to wait after the \\\`i-th\\\` day to get a warmer temperature. If there is no future day for which this is possible, keep \\\`answer[i] == 0\\\`.\`,
    approaches: [
      {
        name: 'Approach 1: Monotonic Decreasing Stack (Optimal)',
        badge: 'Optimal / Monotonic Stack',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Maintain a stack of day indices in strictly decreasing temperature order. Pop when a warmer day is encountered.',
        intuition: 'Each element in the stack is waiting for a warmer day. As we scan left to right, whenever the current day is warmer than the temperature at the top of the stack, we pop its index and record the day difference.',
        codeJS: \`function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // Stores indices: [dayIdx]

  for (let currDay = 0; currDay < n; currDay++) {
    const currTemp = temperatures[currDay];

    while (stack.length > 0 && currTemp > temperatures[stack[stack.length - 1]]) {
      const prevDay = stack.pop();
      answer[prevDay] = currDay - prevDay;
    }

    stack.push(currDay);
  }

  return answer;
}\`,
        codeTS: \`function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const answer: number[] = new Array(n).fill(0);
  const stack: number[] = [];

  for (let currDay = 0; currDay < n; currDay++) {
    const currTemp = temperatures[currDay];

    while (stack.length > 0 && currTemp > temperatures[stack[stack.length - 1]]) {
      const prevDay = stack.pop()!;
      answer[prevDay] = currDay - prevDay;
    }

    stack.push(currDay);
  }

  return answer;
}\`,
        lineByLine: [
          'Line 1-3: Initialize answer array filled with 0s.',
          'Line 4: Monotonic stack stores indices whose warmer day has not yet been found.',
          'Line 6-7: Scan each day index and temperature.',
          'Line 9-12: If current day is warmer than top index, pop and calculate days difference.',
          'Line 14: Push current day onto stack.',
          'Line 17: Return answers.'
        ],
        dryRun: [
          { step: 1, state: 'currDay=0 (73)', action: 'stack empty -> push 0', result: 'stack = [0]' },
          { step: 2, state: 'currDay=1 (74)', action: '74 > 73 -> pop 0, answer[0] = 1 - 0 = 1; push 1', result: 'stack = [1], answer=[1,...]' },
          { step: 3, state: 'currDay=2 (75)', action: '75 > 74 -> pop 1, answer[1] = 2 - 1 = 1; push 2', result: 'stack = [2], answer=[1,1,...]' }
        ],
        complexityDerivation: 'Each index is pushed onto the stack exactly once and popped at most once. Hence, the while loop runs at most N times across the entire algorithm $\\\\to O(N)$ time. Auxiliary stack space is at most $O(N)$.'
      }
    ],
    comparisonTable: [
      { approach: 'Brute Force Scan', time: 'O(N²)', space: 'O(1)', pros: 'No stack allocation', cons: 'Quadratic latency on decreasing sequences' },
      { approach: 'Monotonic Decreasing Stack', time: 'O(N)', space: 'O(N)', pros: 'Amortized linear time O(N); standard Next Greater Element archetype', cons: 'Allocates auxiliary stack' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Daily Temperatures**:
"Daily Temperatures is a textbook Next Greater Element problem. I use a Monotonic Decreasing Stack that stores day indices. As I iterate from left to right, whenever the current temperature exceeds the temperature at the top of the stack, we have officially found the next warmer day for that index! We pop the index, record currDay - prevDay in our answer array, and repeat. Since every index is pushed and popped at most once, this runs in amortized O(N) time and O(N) space."\`,
    followUps: [
      {
        question: 'Could we traverse backwards from right to left?',
        answer: 'Yes! Traversing right to left also maintains a monotonic stack of future temperatures, allowing you to pop colder days and directly inspect the top for the next warmer day.'
      }
    ],
    recallQuiz: {
      question: 'What is the amortized time complexity of the inner while loop across all N iterations?',
      options: ['O(N)', 'O(N²)', 'O(N log N)', 'O(1)'],
      correctIndex: 0,
      explanation: 'Every element is pushed onto the stack once and popped at most once. Total operations cannot exceed 2N, giving amortized O(N) time!'
    }
  },

  // ==========================================
  // PROBLEM 72: NUMBER OF ISLANDS (LeetCode #200)
  // ==========================================
  72: {
    id: 72,
    title: 'Number of Islands',
    difficulty: 'Medium',
    pattern: 'Graphs',
    day: 40,
    leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/',
    summary: 'Count the number of disconnected landmasses in a 2D grid using Breadth-First Search (BFS) or Depth-First Search (DFS) flood-fill.',
    prerequisites: ['2D Matrix traversal', 'Graph Connected Components', 'In-place cell marking to avoid cycle loops'],
    problemStatement: \`Given an \\\`m x n\\\` 2D binary grid \\\`grid\\\` which represents a map of \\\`'1'\\\`s (land) and \\\`'0'\\\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\`,
    approaches: [
      {
        name: 'Approach 1: Depth-First Search (DFS Flood-Fill)',
        badge: 'Optimal / DFS Flood Fill',
        timeComplexity: 'O(M × N)',
        spaceComplexity: 'O(M × N)',
        summary: 'Traverse each cell. When land "1" is encountered, increment island count and recursively sink all connected land to "0".',
        intuition: 'Each island is an independent connected component. By mutating visited land cells to "0", we ensure each island is counted exactly once without allocating an extra visited 2D array.',
        codeJS: \`function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let islandCount = 0;

  function dfsSink(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') {
      return;
    }

    grid[r][c] = '0'; // Sink cell in-place

    dfsSink(r + 1, c);
    dfsSink(r - 1, c);
    dfsSink(r, c + 1);
    dfsSink(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        islandCount++;
        dfsSink(r, c);
      }
    }
  }

  return islandCount;
}\`,
        codeTS: \`function numIslands(grid: string[][]): number {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let islandCount = 0;

  function dfsSink(r: number, c: number): void {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') {
      return;
    }

    grid[r][c] = '0';

    dfsSink(r + 1, c);
    dfsSink(r - 1, c);
    dfsSink(r, c + 1);
    dfsSink(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        islandCount++;
        dfsSink(r, c);
      }
    }
  }

  return islandCount;
}\`,
        lineByLine: [
          'Line 1-5: Validate grid dimensions and track islandCount.',
          'Line 7-10: Base cases: out-of-bounds rows/cols or cell is water ("0").',
          'Line 12: In-place mutation "sinks" current land cell to "0" to prevent revisit loops.',
          'Line 14-17: Recursive DFS calls across 4 cardinal neighbors.',
          'Line 20-27: Nested loop iterates through all grid cells. New island found on unvisited "1".',
          'Line 29: Return total island count.'
        ],
        dryRun: [
          { step: 1, state: 'grid[0][0] = "1"', action: 'islandCount = 1, trigger dfsSink(0,0)', result: 'Sinks (0,0), (0,1), (1,0)...' },
          { step: 2, state: 'grid[0][1..4]', action: 'All sunk to "0" during previous DFS', result: 'Skipped' },
          { step: 3, state: 'All cells checked', action: 'Loop finishes', result: 'Returns 1' }
        ],
        complexityDerivation: 'Every cell is visited at most a constant number of times $\\\\to O(M \\\\times N)$ time. Recursive call stack in worst-case reaches $O(M \\\\times N)$ depth.'
      }
    ],
    comparisonTable: [
      { approach: 'DFS Flood Fill', time: 'O(M × N)', space: 'O(M × N) stack', pros: 'Concise recursive code; clean in-place mutation', cons: 'Risk of call-stack overflow on deep grids in JS' },
      { approach: 'BFS Queue Iterative', time: 'O(M × N)', space: 'O(min(M, N)) queue', pros: 'Zero recursion; memory bounded by diagonal diameter', cons: 'Requires queue data structure' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Number of Islands**:
"Number of Islands is the canonical connected components problem on an unweighted graph. I treat each land cell as a vertex and adjacent land cells as undirected edges.

I iterate through the 2D grid. Whenever I hit an unvisited '1', I increment my island counter and trigger a DFS flood-fill. The DFS recursively visits all horizontally and vertically adjacent land cells, sinking them to '0' in-place so they aren't recounted. This achieves optimal O(M * N) time since each cell is processed a constant number of times."\`,
    followUps: [
      {
        question: 'What if we are forbidden from mutating the input grid?',
        answer: 'We maintain an auxiliary Set or boolean 2D matrix visited[m][n] to record visited coordinates in O(M * N) extra space.'
      }
    ],
    recallQuiz: {
      question: 'Why do we sink grid[r][c] from "1" to "0" during the DFS traversal?',
      options: [
        'To prevent infinite recursion cycles and avoid recounting the same island',
        'Because water is faster to read in memory than land',
        'To format the grid for console logging',
        'Because LeetCode requires the grid to be returned empty'
      ],
      correctIndex: 0,
      explanation: 'Without marking visited cells (either by mutating to "0" or tracking in a Set), the recursion would oscillate between adjacent cells indefinitely in an infinite loop!'
    }
  },

  // ==========================================
  // PROBLEM 88: COIN CHANGE (LeetCode #322)
  // ==========================================
  88: {
    id: 88,
    title: 'Coin Change',
    difficulty: 'Medium',
    pattern: 'DP - 1D',
    day: 50,
    leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
    summary: 'Find the fewest number of coins needed to make up a given amount using bottom-up dynamic programming.',
    prerequisites: ['Overlapping subproblems', 'Optimal substructure: dp[a] = min(dp[a - c] + 1)', 'Why Greedy fails on arbitrary coin systems'],
    problemStatement: \`You are given an integer array \\\`coins\\\` representing coins of different denominations and an integer \\\`amount\\\` representing a total amount of money.

Return the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \\\`-1\\\`.\`,
    approaches: [
      {
        name: 'Approach 1: Bottom-Up Dynamic Programming (Optimal)',
        badge: 'Optimal / Tabulation DP',
        timeComplexity: 'O(amount × coins.length)',
        spaceComplexity: 'O(amount)',
        summary: 'Build a 1D DP table where dp[i] represents the minimum coins needed for amount i.',
        intuition: 'Base case: dp[0] = 0 (0 coins needed for amount 0). For each amount from 1 to total, try every coin c. If amount >= c, dp[amount] = min(dp[amount], dp[amount - c] + 1). Initialize table with Infinity.',
        codeJS: \`function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (a - coin >= 0) {
        dp[a] = Math.min(dp[a], dp[a - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}\`,
        codeTS: \`function coinChange(coins: number[], amount: number): number {
  const dp: number[] = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (a - coin >= 0) {
        dp[a] = Math.min(dp[a], dp[a - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}\`,
        lineByLine: [
          'Line 2-3: Create dp table of size amount + 1 initialized to Infinity. Set dp[0] = 0.',
          'Line 5: Outer loop calculates minimum coins for every sub-amount from 1 up to target amount.',
          'Line 6-7: Inner loop tries every available coin denomination that fits.',
          'Line 8: Recurrence relation: take minimum between current dp[a] and using 1 coin of denomination coin plus dp[a - coin].',
          'Line 13: If dp[amount] is still Infinity, amount is unreachable -> return -1; otherwise return dp[amount].'
        ],
        dryRun: [
          { step: 1, state: 'amount=0', action: 'dp[0] = 0', result: 'Base case' },
          { step: 2, state: 'amount=1 (coins [1,2,5])', action: 'coin 1 -> dp[1] = min(inf, dp[0] + 1) = 1', result: 'dp[1] = 1' },
          { step: 3, state: 'amount=2', action: 'coin 1 -> dp[2] = dp[1]+1=2; coin 2 -> dp[2] = dp[0]+1=1', result: 'dp[2] = 1' },
          { step: 4, state: 'amount=5', action: 'coin 5 -> dp[5] = dp[0]+1=1', result: 'dp[5] = 1' },
          { step: 5, state: 'amount=11', action: 'coin 5 -> dp[11] = dp[6]+1 = 2+1 = 3', result: 'dp[11] = 3' }
        ],
        complexityDerivation: 'Outer loop runs amount times, inner loop runs coins.length times $\\\\to O(\\\\text{amount} \\\\times C)$ operations where C is number of coin denominations. The 1D DP table allocates an array of size amount + 1 $\\\\to O(\\\\text{amount})$ auxiliary memory.'
      }
    ],
    comparisonTable: [
      { approach: 'Top-Down Memoization', time: 'O(amount × C)', space: 'O(amount) stack + cache', pros: 'Only computes reachable subproblems', cons: 'Recursion overhead' },
      { approach: 'Bottom-Up Tabulation', time: 'O(amount × C)', space: 'O(amount) array', pros: 'Zero recursion; optimal cache locality and execution speed', cons: 'Computes every intermediate integer amount' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Coin Change**:
"To solve Coin Change, we must avoid the Greedy trap: taking the largest coin first fails on non-standard denominations like [1, 3, 4] for amount 6. This problem exhibits optimal substructure, making it ideal for 1-D Dynamic Programming.

I define dp[i] as the minimum coins needed to make amount i. I initialize an array of size amount + 1 to Infinity, with the base case dp[0] = 0. Then, for each sub-amount from 1 to amount, I iterate through every coin. If the coin fits, dp[a] = min(dp[a], dp[a - coin] + 1). Finally, if dp[amount] remains Infinity, I return -1; otherwise I return dp[amount]. This achieves O(amount * C) time and O(amount) space."\`,
    followUps: [
      {
        question: 'Can we reconstruct the actual coins used, not just the count?',
        answer: 'Yes! Maintain a second array parent[i] storing which coin produced the minimum for dp[i]. Then backtrack from amount down to 0 to extract all selected coin values.'
      }
    ],
    recallQuiz: {
      question: 'What does dp[a - coin] + 1 represent in the recurrence relation?',
      options: [
        'Using one coin of this denomination plus the optimal solution for the remaining sub-amount',
        'Adding 1 dollar interest to the bank balance',
        'Checking if the coin is an odd or even integer',
        'Incrementing the array index by 1'
      ],
      correctIndex: 0,
      explanation: 'By picking this coin (which counts as 1 coin), we reduce our remaining target to a - coin, which has already been solved optimally in dp[a - coin]!'
    }
  }
};
`;

fs.writeFileSync(ADVANCED_SOLUTIONS_FILE, advancedSolutionsContent, 'utf8');
console.log('Successfully wrote dsaAdvancedPatternSolutions.js!');
