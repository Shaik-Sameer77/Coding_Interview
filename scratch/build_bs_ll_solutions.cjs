// Script to author Problems 32-38 (Binary Search) and 39-50 (Linked List)
const fs = require('fs');
const path = require('path');

const BS_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaBinarySearchSolutions.js');
const LL_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaLinkedListSolutions.js');

const bsContent = `// Problems 32-38: Binary Search Master Solutions
// Full Multi-Approach Solutions with JS & TS, Line-by-Line Breakdown, Dry Runs, Pitches, and Quizzes

export const BINARY_SEARCH_SOLUTIONS = {
  // ==========================================
  // PROBLEM 32: FIND FIRST AND LAST POSITION (LC #34)
  // ==========================================
  32: {
    id: 32,
    title: 'Find First and Last Position in Sorted Array',
    difficulty: 'Medium',
    pattern: 'Binary Search',
    day: 18,
    leetcodeUrl: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
    summary: 'Find the starting and ending position of a given target value in a sorted array in O(log N) time.',
    prerequisites: ['Binary Search boundary narrowing', 'Lower bound vs Upper bound binary search'],
    problemStatement: \`Given an array of integers \\\`nums\\\` sorted in non-decreasing order, find the starting and ending position of a given \\\`target\\\` value.

If \\\`target\\\` is not found in the array, return \\\`[-1, -1]\\\`.

You must write an algorithm with **O(log n)** runtime complexity.

### Examples:
- **Example 1**: \\\`nums = [5,7,7,8,8,10], target = 8\\\` $\\\\to$ \\\`[3, 4]\\\`
- **Example 2**: \\\`nums = [5,7,7,8,8,10], target = 6\\\` $\\\\to$ \\\`[-1, -1]\\\`
- **Example 3**: \\\`nums = [], target = 0\\\` $\\\\to$ \\\`[-1, -1]\\\`\`,
    approaches: [
      {
        name: 'Approach 1: Linear Scan (Baseline)',
        badge: 'Baseline / Linear Scan',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Scan from left to find the first occurrence, and from right to find the last occurrence.',
        intuition: 'Simple two-pass linear search from both ends. Fails the strict O(log N) interview requirement for large N.',
        codeJS: \`function searchRangeLinear(nums, target) {
  let first = -1;
  let last = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      if (first === -1) first = i;
      last = i;
    }
  }
  return [first, last];
}\`,
        codeTS: \`function searchRangeLinear(nums: number[], target: number): number[] {
  let first = -1;
  let last = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      if (first === -1) first = i;
      last = i;
    }
  }
  return [first, last];
}\`,
        lineByLine: [
          'Line 2-3: Initialize first and last indices to -1.',
          'Line 4-8: Traverse array; assign first upon initial match, update last on each match.',
          'Line 10: Return [first, last].'
        ],
        dryRun: [
          { step: 1, state: 'nums = [5,7,7,8,8,10], target = 8', action: 'Scan until index 3', result: 'first = 3, last = 3' },
          { step: 2, state: 'Index 4 is 8', action: 'Match found', result: 'first = 3, last = 4' },
          { step: 3, state: 'Index 5 is 10', action: 'Scan concludes', result: 'Returns [3, 4]' }
        ],
        complexityDerivation: 'Single pass over array of size N takes O(N) time. Uses O(1) auxiliary space.'
      },
      {
        name: 'Approach 2: Dual Binary Search (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        summary: 'Run two separate binary searches: one biased left to find the first index, and one biased right to find the last index.',
        intuition: 'When nums[mid] === target, we do not stop! To find the leftmost index, we record mid and continue searching left (high = mid - 1). To find the rightmost index, we record mid and continue searching right (low = mid + 1).',
        codeJS: \`function searchRange(nums, target) {
  function findBound(isFirst) {
    let low = 0;
    let high = nums.length - 1;
    let bound = -1;

    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);
      if (nums[mid] === target) {
        bound = mid;
        if (isFirst) {
          high = mid - 1; // Continue searching left
        } else {
          low = mid + 1;  // Continue searching right
        }
      } else if (nums[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return bound;
  }

  return [findBound(true), findBound(false)];
}\`,
        codeTS: \`function searchRange(nums: number[], target: number): number[] {
  function findBound(isFirst: boolean): number {
    let low = 0;
    let high = nums.length - 1;
    let bound = -1;

    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);
      if (nums[mid] === target) {
        bound = mid;
        if (isFirst) high = mid - 1;
        else low = mid + 1;
      } else if (nums[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return bound;
  }

  return [findBound(true), findBound(false)];
}\`,
        lineByLine: [
          'Line 2-6: Helper function findBound parameterized by boolean flag isFirst.',
          'Line 8-9: Standard binary search loop and safe midpoint calculation.',
          'Line 10-16: When target matches, save mid and tighten boundary left or right.',
          'Line 17-21: Standard half-space discards.',
          'Line 26: Return array of [first, last].'
        ],
        dryRun: [
          { step: 1, state: 'isFirst=true, low=0, high=5', action: 'mid=2 (7) < 8 -> low=3', result: 'low=3, high=5' },
          { step: 2, state: 'low=3, high=5', action: 'mid=4 (8) === target -> bound=4, high=3', result: 'Searching left' },
          { step: 3, state: 'low=3, high=3', action: 'mid=3 (8) === target -> bound=3, high=2', result: 'Terminates, first = 3' }
        ],
        complexityDerivation: 'Two independent binary searches over array of size N take 2 * O(log N) = O(log N) time. Constant O(1) auxiliary space.'
      }
    ],
    comparisonTable: [
      { approach: 'Linear Scan', time: 'O(N)', space: 'O(1)', pros: 'Trivial implementation', cons: 'Violates O(log N) constraint' },
      { approach: 'Dual Binary Search', time: 'O(log N)', space: 'O(1)', pros: 'Guaranteed logarithmic runtime; reusable boundary logic', cons: 'Requires two search passes' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Find First and Last Position**:
"To solve this problem in O(log N) time, I use two tailored binary searches. In standard binary search, we return immediately upon finding nums[mid] === target. Here, to find the starting index, when a match occurs, I record mid as a candidate and force the search to continue into the left half by setting high = mid - 1. Symmetrically, for the ending index, I record mid and set low = mid + 1. Each search halves the search space, giving optimal O(log N) time and O(1) auxiliary memory."\`,
    followUps: [
      {
        question: 'Can we implement this using a single binary search function?',
        answer: 'Yes! We can implement lower_bound(target) and lower_bound(target + 1) - 1 to find the left and right borders with a single reusable function.'
      }
    ],
    recallQuiz: {
      question: 'When searching for the first occurrence of target, what must we do when nums[mid] === target?',
      options: [
        'Record mid as candidate and set high = mid - 1',
        'Return mid immediately',
        'Set low = mid + 1',
        'Break the while loop'
      ],
      correctIndex: 0,
      explanation: 'Continuing into the left half (high = mid - 1) ensures we locate the earliest occurrence of the duplicate target.'
    }
  },

  // ==========================================
  // PROBLEM 33: SEARCH A 2D MATRIX (LC #74)
  // ==========================================
  33: {
    id: 33,
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    pattern: 'Binary Search',
    day: 19,
    leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/',
    summary: 'Search for a target value in an m x n matrix where rows are sorted and the first integer of each row is greater than the last of the previous row.',
    prerequisites: ['2D matrix flattening mathematics', 'Row and Column coordinate mapping (r = Math.floor(mid / cols), c = mid % cols)'],
    problemStatement: \`You are given an \\\`m x n\\\` integer matrix \\\`matrix\\\` with the following two properties:
1. Each row is sorted in non-decreasing order.
2. The first integer of each row is greater than the last integer of the previous row.

Given an integer \\\`target\\\`, return \\\`true\\\` if \\\`target\\\` is in \\\`matrix\\\` or \\\`false\\\` otherwise.

You must write a solution in **O(log(m * n))** time complexity.\`,
    approaches: [
      {
        name: 'Approach 1: Virtual 1D Flattening (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(log(M × N))',
        spaceComplexity: 'O(1)',
        summary: 'Treat the m x n matrix as a single continuous 1D sorted array of length m * n without allocating memory.',
        intuition: 'Index index in a flattened array maps directly to row = Math.floor(idx / cols) and col = idx % cols. We run standard binary search between low = 0 and high = m * n - 1.',
        codeJS: \`function searchMatrix(matrix, target) {
  if (!matrix.length || !matrix[0].length) return false;
  const rows = matrix.length;
  const cols = matrix[0].length;

  let low = 0;
  let high = rows * cols - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const r = Math.floor(mid / cols);
    const c = mid % cols;
    const val = matrix[r][c];

    if (val === target) {
      return true;
    } else if (val < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return false;
}\`,
        codeTS: \`function searchMatrix(matrix: number[][], target: number): boolean {
  if (!matrix.length || !matrix[0].length) return false;
  const rows = matrix.length;
  const cols = matrix[0].length;

  let low = 0;
  let high = rows * cols - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const r = Math.floor(mid / cols);
    const c = mid % cols;
    const val = matrix[r][c];

    if (val === target) return true;
    if (val < target) low = mid + 1;
    else high = mid - 1;
  }

  return false;
}\`,
        lineByLine: [
          'Line 2-4: Get dimensions M and N.',
          'Line 6-7: Initialize 1D search bounds [0, M*N - 1].',
          'Line 9: Standard binary search loop.',
          'Line 11-13: Virtual coordinate mapping: r = Math.floor(mid / cols), c = mid % cols.',
          'Line 15-20: Compare matrix[r][c] with target and discard half.'
        ],
        dryRun: [
          { step: 1, state: 'matrix 3x4 (total 12 items), target 3', action: 'low=0, high=11 -> mid=5 -> r=1, c=1 (val 11)', result: '11 > 3 -> high = 4' },
          { step: 2, state: 'low=0, high=4', action: 'mid=2 -> r=0, c=2 (val 5)', result: '5 > 3 -> high = 1' },
          { step: 3, state: 'low=0, high=1', action: 'mid=0 -> r=0, c=0 (val 1)', result: '1 < 3 -> low = 1' },
          { step: 4, state: 'low=1, high=1', action: 'mid=1 -> r=0, c=1 (val 3)', result: 'Match found! Returns true' }
        ],
        complexityDerivation: 'Binary search over M * N elements takes O(log(M * N)) time. Auxiliary memory is O(1) since matrix coordinates are calculated on the fly.'
      }
    ],
    comparisonTable: [
      { approach: 'Row-by-Row Binary Search', time: 'O(M log N)', space: 'O(1)', pros: 'Simple iteration', cons: 'Slower than global binary search' },
      { approach: 'Virtual 1D Binary Search', time: 'O(log(M × N))', space: 'O(1)', pros: 'Optimal logarithmic runtime; zero copying', cons: 'Requires modular arithmetic coordinate conversion' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Search a 2D Matrix**:
"Because the matrix is row-sorted and each row's first element exceeds the previous row's last element, the entire 2D matrix is effectively a single monotonically sorted 1D array.

Rather than copying elements or searching row by row, I perform a virtual binary search on the range 0 to m*n - 1. For any 1D index mid, the 2D coordinates are given by row = Math.floor(mid / cols) and col = mid % cols. This directly queries the matrix in O(1) and converges in optimal O(log(m * n)) time with O(1) space."\`,
    followUps: [
      {
        question: 'What if rows are sorted and columns are sorted, but rows do not sequentially exceed each other (LeetCode #240)?',
        answer: 'In that case (Search 2D Matrix II), virtual 1D flattening fails. Instead, we start at the top-right corner and move left or down in O(M + N) time.'
      }
    ],
    recallQuiz: {
      question: 'How do you convert a 1D index "mid" into 2D matrix coordinates (r, c) with "cols" columns?',
      options: [
        'r = Math.floor(mid / cols), c = mid % cols',
        'r = mid % cols, c = Math.floor(mid / cols)',
        'r = mid / 2, c = mid / 2',
        'r = mid * cols, c = mid + cols'
      ],
      correctIndex: 0,
      explanation: 'Dividing by the column width yields the row index; the remainder yields the column index.'
    }
  },

  // ==========================================
  // PROBLEM 34: KOKO EATING BANANAS (LC #875)
  // ==========================================
  34: {
    id: 34,
    title: 'Koko Eating Bananas',
    difficulty: 'Medium',
    pattern: 'Binary Search',
    day: 19,
    leetcodeUrl: 'https://leetcode.com/problems/koko-eating-bananas/',
    summary: 'Find the minimum integer eating speed k such that Koko can eat all bananas within h hours using Binary Search on Answer.',
    prerequisites: ['Binary Search on the Answer domain', 'Monotonic feasibility predicate f(speed) <= h'],
    problemStatement: \`Koko loves to eat bananas. There are \\\`n\\\` piles of bananas, the \\\`i-th\\\` pile has \\\`piles[i]\\\` bananas. The guards have gone and will come back in \\\`h\\\` hours.

Koko can decide her bananas-per-hour eating speed of \\\`k\\\`. Each hour, she chooses some pile of bananas and eats \\\`k\\\` bananas from that pile. If the pile has less than \\\`k\\\` bananas, she eats all of them instead and will not eat any more bananas during this hour.

Return the **minimum integer** \\\`k\\\` such that she can eat all the bananas within \\\`h\\\` hours.\`,
    approaches: [
      {
        name: 'Approach 1: Binary Search on Speed (Optimal)',
        badge: 'Optimal / Binary Search on Answer',
        timeComplexity: 'O(N log(max(piles)))',
        spaceComplexity: 'O(1)',
        summary: 'Search speed range [1, max(piles)]. Feasibility check computes ceil(pile / speed).',
        intuition: 'If Koko can finish at speed S, she can finish at any speed > S (monotonic property). Thus, binary search finds the minimum feasible speed.',
        codeJS: \`function minEatingSpeed(piles, h) {
  let low = 1;
  let high = Math.max(...piles);
  let result = high;

  function canFinish(speed) {
    let hours = 0;
    for (const p of piles) {
      hours += Math.ceil(p / speed);
    }
    return hours <= h;
  }

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (canFinish(mid)) {
      result = mid;       // Feasible, try to find smaller speed
      high = mid - 1;
    } else {
      low = mid + 1;      // Too slow, increase speed
    }
  }

  return result;
}\`,
        codeTS: \`function minEatingSpeed(piles: number[], h: number): number {
  let low = 1;
  let high = Math.max(...piles);
  let result = high;

  function canFinish(speed: number): boolean {
    let hours = 0;
    for (const p of piles) {
      hours += Math.ceil(p / speed);
    }
    return hours <= h;
  }

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (canFinish(mid)) {
      result = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return result;
}\`,
        lineByLine: [
          'Line 2-4: Establish speed search bounds: minimum speed 1, maximum speed max(piles).',
          'Line 6-11: Feasibility helper: sum ceiling divisions Math.ceil(p / speed).',
          'Line 13-21: Binary search on speed: if feasible, record and test smaller; otherwise increase.',
          'Line 24: Return minimum valid eating speed.'
        ],
        dryRun: [
          { step: 1, state: 'piles = [3,6,7,11], h = 8', action: 'low=1, high=11 -> mid=6', result: 'hours = 1+1+2+2=6 <= 8 (Feasible). high=5, res=6' },
          { step: 2, state: 'low=1, high=5', action: 'mid=3 -> hours = 1+2+3+4=10 > 8 (Slow)', result: 'low=4' },
          { step: 3, state: 'low=4, high=5', action: 'mid=4 -> hours = 1+2+2+3=8 <= 8 (Feasible)', result: 'high=3, res=4' },
          { step: 4, state: 'low=4, high=3', action: 'Loop concludes', result: 'Returns 4' }
        ],
        complexityDerivation: 'The search space is M = max(piles). Each binary search step takes O(N) to check all piles. Total time: O(N log(max(piles))) with O(1) auxiliary space.'
      }
    ],
    comparisonTable: [
      { approach: 'Linear Speed Scan', time: 'O(N × max(piles))', space: 'O(1)', pros: 'Intuitive', cons: 'Time Limit Exceeded on large piles' },
      { approach: 'Binary Search on Speed', time: 'O(N log(max(piles)))', space: 'O(1)', pros: 'Logarithmic speed convergence; standard BS-on-Answer', cons: 'Requires monotonic predicate proof' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Koko Eating Bananas**:
"This problem is a classic 'Binary Search on Answer' problem. The eating speed k is bounded between 1 and max(piles). Crucially, the feasibility function is monotonic: if Koko can finish within h hours at speed k, she can also finish at any speed greater than k.

We binary search the speed k. For each candidate speed mid, we calculate the total hours required: sum of ceil(pile / mid) across all piles in O(N) time. If total hours <= h, mid is feasible, so we record it and search the left half for a smaller speed. Otherwise, we search the right half. This runs in O(N log(max(piles))) time and O(1) space."\`,
    followUps: [
      {
        question: 'How do you avoid floating point inaccuracy with Math.ceil in strict languages?',
        answer: 'Use integer arithmetic: Math.floor((pile + speed - 1) / speed).'
      }
    ],
    recallQuiz: {
      question: 'Why can we apply Binary Search to find Koko\'s minimum eating speed?',
      options: [
        'Because feasibility is monotonic: higher speeds never take more hours',
        'Because the input piles are already sorted',
        'Because Koko always eats from the largest pile first',
        'Because h is always a power of 2'
      ],
      correctIndex: 0,
      explanation: 'Monotonicity is the prerequisite for binary search: if speed S works, all speeds > S also work!'
    }
  },

  // ==========================================
  // PROBLEM 35: FIND MINIMUM IN ROTATED SORTED ARRAY (LC #153)
  // ==========================================
  35: {
    id: 35,
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    pattern: 'Binary Search',
    day: 20,
    leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
    summary: 'Find the minimum element in an array of unique elements that has been rotated between 1 and n times in O(log N) time.',
    prerequisites: ['Rotated sorted array properties', 'Comparing nums[mid] with nums[high]'],
    problemStatement: \`Suppose an array of length \\\`n\\\` sorted in ascending order is **rotated** between 1 and \\\`n\\\` times.

Given the sorted rotated array \\\`nums\\\` of **unique** elements, return the **minimum element** of this array.

You must write an algorithm that runs in **O(log n)** time.\`,
    approaches: [
      {
        name: 'Approach 1: Binary Search Inflection Point (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        summary: 'Compare mid with high. If nums[mid] > nums[high], min is strictly in right half. Otherwise, min is at mid or in left half.',
        intuition: 'If nums[mid] > nums[high], the inflection (drop-off) point must lie to the right of mid, so low = mid + 1. If nums[mid] <= nums[high], the right half is sorted, so the minimum is at mid or to its left, so high = mid.',
        codeJS: \`function findMin(nums) {
  let low = 0;
  let high = nums.length - 1;

  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] > nums[high]) {
      low = mid + 1; // Inflection point is in right half
    } else {
      high = mid;    // Min could be mid or in left half
    }
  }

  return nums[low];
}\`,
        codeTS: \`function findMin(nums: number[]): number {
  let low = 0;
  let high = nums.length - 1;

  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] > nums[high]) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return nums[low];
}\`,
        lineByLine: [
          'Line 2-3: Initialize low and high boundaries.',
          'Line 5: Loop while low < high (converges to exact minimum index).',
          'Line 6: Safe midpoint calculation.',
          'Line 7-9: If nums[mid] > nums[high], right half contains inflection -> low = mid + 1.',
          'Line 10-12: Otherwise mid could be min -> high = mid.',
          'Line 15: Return nums[low].'
        ],
        dryRun: [
          { step: 1, state: 'nums = [3,4,5,1,2], low=0, high=4', action: 'mid=2 (5) > nums[high] (2) -> low = 3', result: 'low=3, high=4' },
          { step: 2, state: 'low=3, high=4', action: 'mid=3 (1) <= nums[high] (2) -> high = 3', result: 'low=3, high=3' },
          { step: 3, state: 'low === high === 3', action: 'Loop terminates', result: 'Returns nums[3] = 1' }
        ],
        complexityDerivation: 'Halves search space each iteration $\\\\to O(log N)$ time and $O(1)$ space.'
      }
    ],
    comparisonTable: [
      { approach: 'Linear Scan', time: 'O(N)', space: 'O(1)', pros: 'Simple', cons: 'Violates O(log N) requirement' },
      { approach: 'Binary Search Inflection', time: 'O(log N)', space: 'O(1)', pros: 'Optimal logarithmic time; zero auxiliary space', cons: 'Requires careful low < high boundary check' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Find Minimum in Rotated Sorted Array**:
"In a rotated sorted array, the array is divided into two sorted subarrays. The minimum element is the only element smaller than its predecessor.

We can find it in O(log N) time by comparing nums[mid] with nums[high]. If nums[mid] > nums[high], the rotation inflection point must lie strictly in the right half, so low = mid + 1. Otherwise, the right half is sorted, meaning the minimum must be mid or to the left of mid, so high = mid. When low equals high, we have converged on the minimum element in O(log N) time and O(1) space."\`,
    followUps: [
      {
        question: 'What if the array contains duplicate elements (LeetCode #154)?',
        answer: 'When nums[mid] === nums[high], we cannot determine which half to discard, so we decrement high by 1 (high--), leading to worst-case O(N) time.'
      }
    ],
    recallQuiz: {
      question: 'Why do we set high = mid instead of high = mid - 1 when nums[mid] <= nums[high]?',
      options: [
        'Because nums[mid] itself might be the minimum element',
        'To prevent infinite loops',
        'Because arrays in JavaScript are zero-indexed',
        'Because mid is always odd'
      ],
      correctIndex: 0,
      explanation: 'If mid is the minimum element, setting high = mid - 1 would discard the answer!'
    }
  },

  // ==========================================
  // PROBLEM 36: SEARCH IN ROTATED SORTED ARRAY (LC #33)
  // ==========================================
  36: {
    id: 36,
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    pattern: 'Binary Search',
    day: 20,
    leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    summary: 'Search for a target value in an array rotated at some pivot in O(log N) time.',
    prerequisites: ['One half of a rotated sorted array is ALWAYS sorted', 'Testing target in sorted half range'],
    problemStatement: \`There is an integer array \\\`nums\\\` sorted in ascending order (with **distinct** values). Prior to being passed to your function, \\\`nums\\\` is possibly rotated at an unknown pivot.

Given the array \\\`nums\\\` after the possible rotation and an integer \\\`target\\\`, return the index of \\\`target\\\` if it is in \\\`nums\\\`, or \\\`-1\\\` if it is not in \\\`nums\\\`.

You must achieve a runtime complexity of **O(log n)**.\`,
    approaches: [
      {
        name: 'Approach 1: Modified Binary Search (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        summary: 'Identify which half (left or right) is sorted, check if target falls in that half, and halve the space.',
        intuition: 'At any mid, either nums[low..mid] is sorted or nums[mid..high] is sorted. If the left half is sorted, we check if target is between nums[low] and nums[mid]. If yes, search left; else search right.',
        codeJS: \`function searchRotated(nums, target) {
  let low = 0;
  let high = nums.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;

    // Check if left half is sorted
    if (nums[low] <= nums[mid]) {
      if (nums[low] <= target && target < nums[mid]) {
        high = mid - 1; // Target is in sorted left half
      } else {
        low = mid + 1;  // Target is in right half
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[high]) {
        low = mid + 1;  // Target is in sorted right half
      } else {
        high = mid - 1; // Target is in left half
      }
    }
  }

  return -1;
}\`,
        codeTS: \`function searchRotated(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;

    if (nums[low] <= nums[mid]) {
      if (nums[low] <= target && target < nums[mid]) high = mid - 1;
      else low = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[high]) low = mid + 1;
      else high = mid - 1;
    }
  }

  return -1;
}\`,
        lineByLine: [
          'Line 2-3: Set search bounds [0, n-1].',
          'Line 6: If nums[mid] matches target, return index immediately.',
          'Line 8: Check if left half is sorted (nums[low] <= nums[mid]).',
          'Line 9-13: If target is in sorted left range, search left; otherwise search right.',
          'Line 15-20: Symmetrically handle sorted right half.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [4,5,6,7,0,1,2], target = 0', action: 'low=0, high=6 -> mid=3 (7). Left half [4..7] sorted. 0 is NOT in [4, 7]', result: 'low = 4' },
          { step: 2, state: 'low=4, high=6', action: 'mid=5 (1). Right half [1..2] sorted. 0 is NOT in [1, 2]', result: 'high = 4' },
          { step: 3, state: 'low=4, high=4', action: 'mid=4 (0) === target', result: 'Returns index 4' }
        ],
        complexityDerivation: 'Halves the search space on each iteration, achieving optimal O(log N) time with O(1) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Linear Search', time: 'O(N)', space: 'O(1)', pros: 'Trivial', cons: 'Too slow for large N' },
      { approach: 'Modified Binary Search', time: 'O(log N)', space: 'O(1)', pros: 'Guaranteed logarithmic runtime; handles arbitrary rotation pivots', cons: 'Requires careful boundary checks' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Search in Rotated Sorted Array**:
"The key insight is that when you divide a rotated sorted array in half at mid, at least one of the two halves is guaranteed to be normally sorted!

We determine which half is sorted by comparing nums[low] with nums[mid]. If nums[low] <= nums[mid], the left half is sorted. We then simply check if target lies between nums[low] and nums[mid]. If it does, we search the left half; otherwise we search the right half. Symmetrically, if the right half is sorted, we test if target lies in that range. This guarantees O(log N) time and O(1) auxiliary space."\`,
    followUps: [
      {
        question: 'What if duplicates exist in the array (LeetCode #81)?',
        answer: 'When nums[low] === nums[mid] === nums[high], we cannot deduce which side is sorted. We must increment low++ and decrement high--, degrading worst-case runtime to O(N).'
      }
    ],
    recallQuiz: {
      question: 'In a rotated sorted array with distinct values, what property is always true for any midpoint mid?',
      options: [
        'At least one half (left or right) is guaranteed to be sorted',
        'Both halves are always sorted',
        'The minimum element is always at index 0',
        'The array can be searched in O(1) time'
      ],
      correctIndex: 0,
      explanation: 'A single rotation pivot divides the array into at most two sorted segments; dividing at any mid leaves at least one half fully sorted!'
    }
  },

  // ==========================================
  // PROBLEM 37: TIME BASED KEY-VALUE STORE (LC #981)
  // ==========================================
  37: {
    id: 37,
    title: 'Time Based Key-Value Store',
    difficulty: 'Medium',
    pattern: 'Binary Search',
    day: 22,
    leetcodeUrl: 'https://leetcode.com/problems/time-based-key-value-store/',
    summary: 'Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key\'s value at a certain timestamp.',
    prerequisites: ['Hash Map of sorted arrays', 'Binary Search for floor timestamp (largest timestamp <= target)'],
    problemStatement: \`Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key's value at a certain timestamp.

Implement the \\\`TimeMap\\\` class:
- \\\`TimeMap()\\\` Initializes the object.
- \\\`void set(String key, String value, int timestamp)\\\` Stores the key \\\`key\\\` with the value \\\`value\\\` at the given time \\\`timestamp\\\`. Timestamps are strictly increasing.
- \\\`String get(String key, int timestamp)\\\` Returns a value such that \\\`set\\\` was called previously, with \\\`timestamp_prev <= timestamp\\\`. If multiple such values exist, return the one with largest \\\`timestamp_prev\\\`. If no values exist, return \\\`""\\\`.\`,
    approaches: [
      {
        name: 'Approach 1: HashMap + Binary Search (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'set: O(1), get: O(log N)',
        spaceComplexity: 'O(Total Entries)',
        summary: 'Map key to an array of { timestamp, value }. Since set() has strictly increasing timestamps, binary search finds the floor timestamp in O(log N).',
        intuition: 'Binary search for the greatest timestamp <= query timestamp. If arr[mid].timestamp <= timestamp, record mid value and search right (low = mid + 1).',
        codeJS: \`class TimeMap {
  constructor() {
    this.store = new Map(); // key -> Array<{ timestamp, value }>
  }

  set(key, value, timestamp) {
    if (!this.store.has(key)) {
      this.store.set(key, []);
    }
    this.store.get(key).push({ timestamp, value });
  }

  get(key, timestamp) {
    if (!this.store.has(key)) return "";
    const list = this.store.get(key);

    let low = 0;
    let high = list.length - 1;
    let res = "";

    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);
      if (list[mid].timestamp <= timestamp) {
        res = list[mid].value; // Valid candidate, try finding closer timestamp
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return res;
  }
}\`,
        codeTS: \`class TimeMap {
  private store: Map<string, Array<{ timestamp: number; value: string }>>;

  constructor() {
    this.store = new Map();
  }

  set(key: string, value: string, timestamp: number): void {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key)!.push({ timestamp, value });
  }

  get(key: string, timestamp: number): string {
    if (!this.store.has(key)) return "";
    const list = this.store.get(key)!;

    let low = 0;
    let high = list.length - 1;
    let res = "";

    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);
      if (list[mid].timestamp <= timestamp) {
        res = list[mid].value;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return res;
  }
}\`,
        lineByLine: [
          'Line 2-4: Initialize internal Map storing arrays of { timestamp, value }.',
          'Line 6-11: set() pushes to end of array in O(1) since timestamps are strictly ascending.',
          'Line 13-15: get() returns empty string if key not found.',
          'Line 17-29: Binary search locates the largest timestamp <= requested timestamp in O(log N).'
        ],
        dryRun: [
          { step: 1, state: 'set("foo", "bar", 1)', action: 'list = [{1, "bar"}]', result: 'Stored in O(1)' },
          { step: 2, state: 'get("foo", 1)', action: 'mid=0 (ts=1 <= 1) -> res = "bar"', result: 'Returns "bar"' },
          { step: 3, state: 'get("foo", 3)', action: 'mid=0 (ts=1 <= 3) -> res = "bar"', result: 'Returns "bar"' }
        ],
        complexityDerivation: 'set() is O(1) amortized append. get() performs binary search over N timestamps for that key in O(log N) time. Auxiliary space is O(K * N) storing all values.'
      }
    ],
    comparisonTable: [
      { approach: 'Linear Array Scan', time: 'set: O(1), get: O(N)', space: 'O(N)', pros: 'Simple', cons: 'Slow get queries under heavy read loads' },
      { approach: 'HashMap + Binary Search', time: 'set: O(1), get: O(log N)', space: 'O(N)', pros: 'Production-grade efficiency; logarithmic read latency', cons: 'Requires array binary search logic' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Time Based Key-Value Store**:
"To design TimeMap, I store entries in a Hash Map where each key maps to an array of objects containing timestamp and value. Because timestamps are added in strictly increasing order, each key's array is naturally sorted by timestamp.

For set(), appending to the array takes O(1) time. For get(), I need the largest timestamp <= query timestamp. I execute a binary search on the key's array. Whenever list[mid].timestamp <= query, I record mid's value and search right (low = mid + 1) to find an even closer timestamp. This delivers O(1) write latency and O(log N) read latency."\`,
    followUps: [
      {
        question: 'What if timestamps in set() were NOT guaranteed to be strictly increasing?',
        answer: 'We would either insert using binary search (bisect) in O(N) shift time or maintain a balanced BST / TreeMap per key to maintain O(log N) writes.'
      }
    ],
    recallQuiz: {
      question: 'Why are we able to binary search on the timestamp list without sorting it first?',
      options: [
        'Because set() calls arrive with strictly increasing timestamps',
        'Because JavaScript Maps sort their values automatically',
        'Because timestamps are converted to binary strings',
        'Because get() sorts the array on every call'
      ],
      correctIndex: 0,
      explanation: 'The problem contract guarantees timestamps are monotonically increasing on set(), making the array inherently sorted!'
    }
  },

  // ==========================================
  // PROBLEM 38: MEDIAN OF TWO SORTED ARRAYS (LC #4)
  // ==========================================
  38: {
    id: 38,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    pattern: 'Binary Search',
    day: 22,
    leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    summary: 'Find the median of two sorted arrays of sizes m and n in optimal O(log(min(m, n))) time.',
    prerequisites: ['Binary Search on partition size', 'Partitioning two arrays such that leftHalf <= rightHalf'],
    problemStatement: \`Given two sorted arrays \\\`nums1\\\` and \\\`nums2\\\` of size \\\`m\\\` and \\\`n\\\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be **O(log (m+n))**.\`,
    approaches: [
      {
        name: 'Approach 1: Two Pointers Merge (Baseline)',
        badge: 'Baseline / Linear Merge',
        timeComplexity: 'O(M + N)',
        spaceComplexity: 'O(1)',
        summary: 'Iterate with two pointers until reaching the (m+n)/2-th element.',
        intuition: 'Merge step from Merge Sort without storing the full array, stopping when the median index is reached.',
        codeJS: \`function findMedianSortedArraysLinear(nums1, nums2) {
  const total = nums1.length + nums2.length;
  const midIdx = Math.floor(total / 2);
  let p1 = 0, p2 = 0;
  let curr = 0, prev = 0;

  for (let i = 0; i <= midIdx; i++) {
    prev = curr;
    if (p1 < nums1.length && (p2 >= nums2.length || nums1[p1] <= nums2[p2])) {
      curr = nums1[p1++];
    } else {
      curr = nums2[p2++];
    }
  }

  return total % 2 === 1 ? curr : (prev + curr) / 2;
}\`,
        codeTS: \`function findMedianSortedArraysLinear(nums1: number[], nums2: number[]): number {
  const total = nums1.length + nums2.length;
  const midIdx = Math.floor(total / 2);
  let p1 = 0, p2 = 0;
  let curr = 0, prev = 0;

  for (let i = 0; i <= midIdx; i++) {
    prev = curr;
    if (p1 < nums1.length && (p2 >= nums2.length || nums1[p1] <= nums2[p2])) {
      curr = nums1[p1++];
    } else {
      curr = nums2[p2++];
    }
  }

  return total % 2 === 1 ? curr : (prev + curr) / 2;
}\`,
        lineByLine: [
          'Line 2-5: Track pointers p1, p2 and running values curr, prev.',
          'Line 7-13: Advance through smaller elements until reaching median position.',
          'Line 15: Return curr if total is odd, or average of prev and curr if even.'
        ],
        dryRun: [
          { step: 1, state: 'nums1=[1,3], nums2=[2]', action: 'total=3, midIdx=1. Iteration 0: curr=1. Iteration 1: curr=2', result: 'Returns 2' }
        ],
        complexityDerivation: 'Walks (M + N) / 2 elements $\\\\to O(M + N)$ time and $O(1)$ space.'
      },
      {
        name: 'Approach 2: Binary Search on Smaller Array Partition (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(log(min(M, N)))',
        spaceComplexity: 'O(1)',
        summary: 'Partition the smaller array A and compute matching partition in B such that all elements on the left are <= all elements on the right.',
        intuition: 'Partition A into leftA | rightA and B into leftB | rightB such that total left elements = (m+n+1)/2. Valid partition holds when max(leftA) <= min(rightB) and max(leftB) <= min(rightA).',
        codeJS: \`function findMedianSortedArrays(nums1, nums2) {
  // Ensure nums1 is the smaller array to guarantee O(log(min(m, n)))
  if (nums1.length > nums2.length) {
    return findMedianSortedArrays(nums2, nums1);
  }

  const m = nums1.length;
  const n = nums2.length;
  let low = 0;
  let high = m;

  while (low <= high) {
    const partition1 = low + Math.floor((high - low) / 2);
    const partition2 = Math.floor((m + n + 1) / 2) - partition1;

    const maxLeft1 = partition1 === 0 ? -Infinity : nums1[partition1 - 1];
    const minRight1 = partition1 === m ? Infinity : nums1[partition1];

    const maxLeft2 = partition2 === 0 ? -Infinity : nums2[partition2 - 1];
    const minRight2 = partition2 === n ? Infinity : nums2[partition2];

    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      // Correct partition found
      if ((m + n) % 2 === 1) {
        return Math.max(maxLeft1, maxLeft2);
      } else {
        return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
      }
    } else if (maxLeft1 > minRight2) {
      high = partition1 - 1; // Too far right in nums1
    } else {
      low = partition1 + 1;  // Too far left in nums1
    }
  }

  throw new Error("Input arrays are not sorted");
}\`,
        codeTS: \`function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);

  const m = nums1.length;
  const n = nums2.length;
  let low = 0;
  let high = m;

  while (low <= high) {
    const partition1 = low + Math.floor((high - low) / 2);
    const partition2 = Math.floor((m + n + 1) / 2) - partition1;

    const maxLeft1 = partition1 === 0 ? -Infinity : nums1[partition1 - 1];
    const minRight1 = partition1 === m ? Infinity : nums1[partition1];

    const maxLeft2 = partition2 === 0 ? -Infinity : nums2[partition2 - 1];
    const minRight2 = partition2 === n ? Infinity : nums2[partition2];

    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      if ((m + n) % 2 === 1) return Math.max(maxLeft1, maxLeft2);
      return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
    } else if (maxLeft1 > minRight2) {
      high = partition1 - 1;
    } else {
      low = partition1 + 1;
    }
  }

  throw new Error("Input arrays are not sorted");
}\`,
        lineByLine: [
          'Line 2-4: If nums1 is larger, swap arguments so binary search runs on the smaller array.',
          'Line 7-9: Initialize binary search range [0, m] on partition cut points.',
          'Line 12-13: Compute partition1 in nums1 and matching partition2 in nums2.',
          'Line 15-18: Boundary values using -Infinity and Infinity for empty sides.',
          'Line 20-27: If cross-condition holds (maxLeft1 <= minRight2 && maxLeft2 <= minRight1), median is found.',
          'Line 28-32: Adjust binary search boundaries.'
        ],
        dryRun: [
          { step: 1, state: 'nums1=[1,3], nums2=[2]', action: 'nums2 is smaller -> swap nums1 and nums2. m=1, n=2', result: 'Search range [0, 1]' },
          { step: 2, state: 'partition1 = 1, partition2 = 1', action: 'maxLeft1=2, minRight1=inf; maxLeft2=1, minRight2=3', result: 'Valid! (2 <= 3 && 1 <= inf)' },
          { step: 3, state: 'total 3 is odd', action: 'max(2, 1) = 2', result: 'Returns 2' }
        ],
        complexityDerivation: 'Binary search is executed on the smaller array of size min(M, N), yielding optimal O(log(min(M, N))) time and O(1) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Two Pointer Merge', time: 'O(M + N)', space: 'O(1)', pros: 'Simple logic', cons: 'Linear runtime, not logarithmic' },
      { approach: 'Binary Search Partition', time: 'O(log(min(M, N)))', space: 'O(1)', pros: 'Optimal logarithmic complexity; zero allocations', cons: 'Intricate boundary edge cases' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Median of Two Sorted Arrays**:
"The median divides a combined dataset into equal left and right halves where all left elements are <= all right elements. Rather than merging in O(m+n), we binary search for the correct partition cut on the smaller array.

If we take partition1 elements from nums1, we must take (m+n+1)/2 - partition1 elements from nums2. The partition is correct if and only if maxLeft1 <= minRight2 and maxLeft2 <= minRight1. If maxLeft1 > minRight2, we have taken too many elements from nums1, so we move high left. Because we binary search only on the smaller array, runtime is optimal O(log(min(m, n))) with O(1) auxiliary space."\`,
    followUps: [
      {
        question: 'Why do we binary search on the smaller array rather than the larger one?',
        answer: 'Two reasons: First, it guarantees O(log(min(m, n))) time. Second, it guarantees partition2 = (m+n+1)/2 - partition1 is always non-negative and within valid bounds.'
      }
    ],
    recallQuiz: {
      question: 'What is the runtime complexity of the optimal partition binary search algorithm for Median of Two Sorted Arrays?',
      options: ['O(log(min(M, N)))', 'O(M + N)', 'O(log(M) × log(N))', 'O(1)'],
      correctIndex: 0,
      explanation: 'By binary searching the partition on the smaller array of size min(M, N), we achieve O(log(min(M, N))) time!'
    }
  }
};
`;

const llContent = `// Problems 39-50: Linked List Master Solutions
// Full Multi-Approach Solutions with JS & TS, Line-by-Line Breakdown, Dry Runs, Pitches, and Quizzes

export const LINKED_LIST_SOLUTIONS = {
  // ==========================================
  // PROBLEM 39: REVERSE LINKED LIST (LC #206)
  // ==========================================
  39: {
    id: 39,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    pattern: 'Linked List',
    day: 23,
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    summary: 'Reverse a singly linked list in-place using iterative pointer manipulation or recursion.',
    prerequisites: ['Singly linked list node structure', 'Maintaining previous, current, and next references'],
    problemStatement: \`Given the \\\`head\\\` of a singly linked list, reverse the list, and return the reversed list.\`,
    approaches: [
      {
        name: 'Approach 1: Iterative In-Place Pointer Rewiring (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Iterate through the list, rewiring each node\'s next pointer to point to the previous node.',
        intuition: 'Maintain prev (null) and curr (head). Before changing curr.next, store nextNode = curr.next. Then set curr.next = prev, advance prev = curr, and curr = nextNode.',
        codeJS: \`function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    const nextNode = curr.next; // 1. Save next node
    curr.next = prev;          // 2. Reverse link
    prev = curr;              // 3. Move prev forward
    curr = nextNode;          // 4. Move curr forward
  }

  return prev; // New head
}\`,
        codeTS: \`function reverseList(head: any): any {
  let prev: any = null;
  let curr: any = head;

  while (curr !== null) {
    const nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }

  return prev;
}\`,
        lineByLine: [
          'Line 2-3: Initialize prev to null and curr to head.',
          'Line 5: Traverse until curr is null.',
          'Line 6: Save nextNode reference to avoid losing the rest of the list.',
          'Line 7: Invert pointer: curr.next = prev.',
          'Line 8-9: Advance pointers in-place.',
          'Line 12: Return prev, the new head.'
        ],
        dryRun: [
          { step: 1, state: '1 -> 2 -> 3', action: 'curr=1, prev=null -> 1.next = null, prev=1, curr=2', result: '1 -> null' },
          { step: 2, state: 'curr=2', action: '2.next = 1, prev=2, curr=3', result: '2 -> 1 -> null' },
          { step: 3, state: 'curr=3', action: '3.next = 2, prev=3, curr=null', result: '3 -> 2 -> 1 -> null' }
        ],
        complexityDerivation: 'Single pass visits each of the N nodes once $\\\\to O(N)$ time. Reuses node pointers with O(1) auxiliary memory.'
      },
      {
        name: 'Approach 2: Recursive Post-Order Reversal',
        badge: 'Recursive / Elegant',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N) call stack',
        summary: 'Recursively reach the last node, then reverse links on the way back up the call stack.',
        intuition: 'Base case: if head is null or head.next is null, return head. Otherwise, reverse the sublist: head.next.next = head, and head.next = null.',
        codeJS: \`function reverseListRecursive(head) {
  if (!head || !head.next) return head;

  const newHead = reverseListRecursive(head.next);
  head.next.next = head; // Point next node back to current
  head.next = null;      // Disconnect original forward link

  return newHead;
}\`,
        codeTS: \`function reverseListRecursive(head: any): any {
  if (!head || !head.next) return head;
  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}\`,
        lineByLine: [
          'Line 2: Base case: single node or empty list returns itself.',
          'Line 4: Recursively reverse the rest of the list.',
          'Line 5-6: Rewire: head.next\'s next points back to head, clear head.next to prevent cycles.',
          'Line 8: Return preserved newHead.'
        ],
        dryRun: [
          { step: 1, state: 'Call stack reaches node 3', action: 'Returns 3 as newHead', result: 'newHead = 3' },
          { step: 2, state: 'Unwinds to node 2', action: '2.next.next = 2 (3 -> 2), 2.next = null', result: '3 -> 2 -> null' }
        ],
        complexityDerivation: 'Visits each node once in O(N) time. The call stack holds N frames in O(N) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Iterative Pointers', time: 'O(N)', space: 'O(1)', pros: 'Safe for arbitrarily long lists; no stack overflow risk', cons: 'Requires 3-pointer tracking' },
      { approach: 'Recursive Post-Order', time: 'O(N)', space: 'O(N)', pros: 'Concise functional code', cons: 'Vulnerable to call stack exhaustion on large lists' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Reverse Linked List**:
"To reverse a singly linked list in-place in O(N) time and O(1) space, I use an iterative three-pointer technique. I initialize prev as null and curr as head. At each node, I first save curr.next to avoid reference loss. Then I redirect curr.next to prev, advance prev to curr, and advance curr to the saved next node. When curr becomes null, prev points to the new head. This achieves in-place reversal with zero heap or stack allocations."\`,
    followUps: [
      {
        question: 'How would you reverse only a subsegment between positions left and right (LeetCode #92)?',
        answer: 'Traverse to left - 1, reverse the sublist between left and right in-place using a similar loop, then reconnect the boundaries.'
      }
    ],
    recallQuiz: {
      question: 'Why must we save "curr.next" into a temporary variable before executing "curr.next = prev"?',
      options: [
        'Because overwriting curr.next destroys our pointer reference to the remainder of the list',
        'To allocate memory on the heap',
        'To prevent garbage collection of prev',
        'Because JavaScript requires four variable declarations'
      ],
      correctIndex: 0,
      explanation: 'Once curr.next is reassigned to prev, without nextNode, all downstream nodes become unreachable!'
    }
  },

  // ==========================================
  // PROBLEM 40: MERGE TWO SORTED LISTS (LC #21)
  // ==========================================
  40: {
    id: 40,
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    pattern: 'Linked List',
    day: 23,
    leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    summary: 'Merge two sorted linked lists into one sorted linked list by splicing nodes in-place.',
    prerequisites: ['Dummy Head pattern to simplify edge cases', 'Two-pointer list merging'],
    problemStatement: \`You are given the heads of two sorted linked lists \\\`list1\\\` and \\\`list2\\\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.\`,
    approaches: [
      {
        name: 'Approach 1: Iterative with Dummy Head (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(M + N)',
        spaceComplexity: 'O(1)',
        summary: 'Use a dummy head node. Compare list1.val and list2.val, attach the smaller node, and advance pointer.',
        intuition: 'A dummy head eliminates special conditional checks for initializing the head of the merged list. Once one list is exhausted, splice the remainder of the other list directly.',
        codeJS: \`function mergeTwoLists(list1, list2) {
  const dummy = { val: 0, next: null };
  let tail = dummy;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }

  // Attach remaining non-empty list
  tail.next = list1 !== null ? list1 : list2;

  return dummy.next;
}\`,
        codeTS: \`function mergeTwoLists(list1: any, list2: any): any {
  const dummy: any = { val: 0, next: null };
  let tail = dummy;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }

  tail.next = list1 !== null ? list1 : list2;
  return dummy.next;
}\`,
        lineByLine: [
          'Line 2-3: Create dummy node and point tail to it.',
          'Line 5-13: Compare head values, link tail.next to smaller, advance corresponding pointer.',
          'Line 16: Splice remaining nodes in O(1).',
          'Line 18: Return dummy.next as true head.'
        ],
        dryRun: [
          { step: 1, state: 'list1=[1,2,4], list2=[1,3,4]', action: '1 <= 1 -> tail.next = list1(1), list1 = [2,4]', result: 'dummy -> 1' },
          { step: 2, state: 'list1=[2,4], list2=[1,3,4]', action: '1 < 2 -> tail.next = list2(1), list2 = [3,4]', result: 'dummy -> 1 -> 1' }
        ],
        complexityDerivation: 'Traverses each node of both lists at most once $\\\\to O(M + N)$ time. Only rewires existing pointers $\\\\to O(1)$ space.'
      }
    ],
    comparisonTable: [
      { approach: 'Iterative Dummy Head', time: 'O(M + N)', space: 'O(1)', pros: 'Safe for large lists; zero heap copies', cons: 'Requires dummy node' },
      { approach: 'Recursive Splicing', time: 'O(M + N)', space: 'O(M + N) stack', pros: 'Extremely clean code', cons: 'Risk of call-stack overflow on deep lists' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Merge Two Sorted Lists**:
"To merge two sorted linked lists cleanly in O(M+N) time and O(1) space, I use the Dummy Head technique. The dummy node eliminates branch checks for initializing the head. I maintain a tail pointer and loop while both lists have nodes, splicing the smaller node onto tail.next and advancing. Once either list is exhausted, I attach the remaining non-empty list in O(1) time. Returning dummy.next gives the merged head."\`,
    followUps: [
      {
        question: 'How does this extend to K sorted linked lists (LeetCode #23)?',
        answer: 'We can either use Divide and Conquer pairwise merging in O(N log K) or a Min-Heap of size K in O(N log K) time.'
      }
    ],
    recallQuiz: {
      question: 'What is the primary architectural purpose of using a "dummy" head node?',
      options: [
        'It eliminates edge case branch checks for setting the initial head pointer',
        'It speeds up JavaScript V8 JIT compilation',
        'It sorts the nodes automatically in memory',
        'It makes the list doubly linked'
      ],
      correctIndex: 0,
      explanation: 'A dummy head eliminates null-checks when adding the first node, unifying insertion logic across all steps!'
    }
  },

  // ==========================================
  // PROBLEM 41: LINKED LIST CYCLE (LC #141)
  // ==========================================
  41: {
    id: 41,
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    pattern: 'Linked List',
    day: 23,
    leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
    summary: 'Determine if a linked list contains a cycle using Floyd\'s Tortoise and Hare algorithm in O(1) space.',
    prerequisites: ['Floyd\'s Cycle Finding Algorithm (Fast & Slow Pointers)', 'Hash Set reference tracking vs O(1) pointers'],
    problemStatement: \`Given \\\`head\\\`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \\\`next\\\` pointer.

Return \\\`true\\\` if there is a cycle in the linked list. Otherwise, return \\\`false\\\`.\`,
    approaches: [
      {
        name: 'Approach 1: Floyd\'s Tortoise and Hare (Optimal)',
        badge: 'Optimal / Fast & Slow Pointers',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Slow pointer moves 1 step; fast pointer moves 2 steps. If a cycle exists, they must collide.',
        intuition: 'Imagine two runners on a circular track: the faster runner will eventually lap the slower runner. With fast advancing 2 steps and slow advancing 1 step, the relative distance between them closes by 1 on every iteration inside a cycle.',
        codeJS: \`function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;         // 1 step
    fast = fast.next.next;    // 2 steps

    if (slow === fast) {
      return true; // Collision detected -> cycle exists
    }
  }

  return false; // Fast reached end of list
}\`,
        codeTS: \`function hasCycle(head: any): boolean {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
}\`,
        lineByLine: [
          'Line 2-3: Initialize slow and fast pointers at head.',
          'Line 5: Loop while fast and fast.next are non-null.',
          'Line 6-7: Advance slow by 1 step, fast by 2 steps.',
          'Line 9-11: If pointers reference the exact same node in memory, cycle detected.',
          'Line 14: If fast reaches null, list terminates with no cycle.'
        ],
        dryRun: [
          { step: 1, state: 'List 3 -> 2 -> 0 -> -4 (points back to 2)', action: 'slow=2, fast=0', result: 'No collision yet' },
          { step: 2, state: 'slow=0, fast=2', action: 'slow advances 1, fast advances 2', result: 'Pointers converging' },
          { step: 3, state: 'slow=-4, fast=-4', action: 'slow === fast', result: 'Collision! Returns true' }
        ],
        complexityDerivation: 'If no cycle, fast reaches end in N/2 steps. If cycle of length C, fast catches slow within C steps $\\\\to O(N)$ time. Uses two pointers $\\\\to O(1)$ space.'
      }
    ],
    comparisonTable: [
      { approach: 'Hash Set Visited Track', time: 'O(N)', space: 'O(N)', pros: 'Trivial mental model', cons: 'Allocates O(N) heap memory for node references' },
      { approach: 'Floyd\'s Fast & Slow Pointers', time: 'O(N)', space: 'O(1)', pros: 'Optimal asymptotic complexity; zero heap allocations', cons: 'Requires collision proof' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Linked List Cycle**:
"To detect a cycle in O(1) space, I use Floyd's Tortoise and Hare algorithm. I initialize two pointers, slow and fast, at the head. In each iteration, slow advances 1 step while fast advances 2 steps.

If the list has no cycle, fast will safely hit null in O(N/2) steps. If a cycle exists, both pointers will enter the loop. Because fast moves 1 step faster than slow, the gap between them shrinks by exactly 1 on every step, guaranteeing they will collide without skipping past each other. This confirms cycle presence in O(N) time and O(1) memory."\`,
    followUps: [
      {
        question: 'How do you find the EXACT start node of the cycle (LeetCode #142)?',
        answer: 'When slow and fast collide, reset slow to head. Advance both slow and fast by 1 step simultaneously. The node where they meet again is mathematically proven to be the cycle start!'
      }
    ],
    recallQuiz: {
      question: 'Why is fast guaranteed never to "hop over" slow inside a cycle when moving at 2 steps per turn?',
      options: [
        'Because the relative distance between them decreases by exactly 1 on each step',
        'Because slow stops moving inside cycles',
        'Because JavaScript pointers are synchronized by the engine',
        'Because cycle lengths are always even numbers'
      ],
      correctIndex: 0,
      explanation: 'With speed 2 vs speed 1, the relative distance changes by |2 - 1| = 1 every tick. A distance decreasing by 1 cannot jump over 0!'
    }
  },

  // ==========================================
  // PROBLEM 48: LRU CACHE (LC #146)
  // ==========================================
  48: {
    id: 48,
    title: 'LRU Cache',
    difficulty: 'Medium',
    pattern: 'Linked List',
    day: 27,
    leetcodeUrl: 'https://leetcode.com/problems/lru-cache/',
    summary: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put operations.',
    prerequisites: ['Doubly Linked List node wiring (prev & next)', 'Hash Map pointing to DLL nodes', 'O(1) deletion and insertion at head/tail'],
    problemStatement: \`Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \\\`LRUCache\\\` class:
- \\\`LRUCache(int capacity)\\\` Initialize the LRU cache with positive size \\\`capacity\\\`.
- \\\`int get(int key)\\\` Return the value of the \\\`key\\\` if the key exists, otherwise return \\\`-1\\\`.
- \\\`void put(int key, int value)\\\` Update the value of the \\\`key\\\` if the \\\`key\\\` exists. Otherwise, add the \\\`key-value\\\` pair to the cache. If the number of keys exceeds the \\\`capacity\\\` from this operation, **evict** the least recently used key.

The functions \\\`get\\\` and \\\`put\\\` must each run in **O(1)** average time complexity.\`,
    approaches: [
      {
        name: 'Approach 1: Hash Map + Doubly Linked List (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'get: O(1), put: O(1)',
        spaceComplexity: 'O(Capacity)',
        summary: 'Hash Map provides O(1) node lookup. Doubly Linked List with dummy head and tail maintains usage order in O(1).',
        intuition: 'Whenever a key is accessed or updated, remove its node from its current position and re-insert it right after dummy head (most recently used). When capacity is exceeded, evict tail.prev (least recently used).',
        codeJS: \`class DLLNode {
  constructor(key = 0, val = 0) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // key -> DLLNode

    // Dummy boundary nodes
    this.head = new DLLNode();
    this.tail = new DLLNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _addHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._addHead(node); // Mark as most recently used
    return node.val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.val = value;
      this._remove(node);
      this._addHead(node);
    } else {
      if (this.map.size >= this.capacity) {
        // Evict LRU node (tail.prev)
        const lru = this.tail.prev;
        this._remove(lru);
        this.map.delete(lru.key);
      }
      const newNode = new DLLNode(key, value);
      this.map.set(key, newNode);
      this._addHead(newNode);
    }
  }
}\`,
        codeTS: \`class DLLNode {
  key: number;
  val: number;
  prev: DLLNode | null = null;
  next: DLLNode | null = null;
  constructor(key: number = 0, val: number = 0) {
    this.key = key;
    this.val = val;
  }
}

class LRUCache {
  private capacity: number;
  private map: Map<number, DLLNode>;
  private head: DLLNode;
  private tail: DLLNode;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new DLLNode();
    this.tail = new DLLNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private _remove(node: DLLNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private _addHead(node: DLLNode): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key)!;
    this._remove(node);
    this._addHead(node);
    return node.val;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.val = value;
      this._remove(node);
      this._addHead(node);
    } else {
      if (this.map.size >= this.capacity) {
        const lru = this.tail.prev!;
        this._remove(lru);
        this.map.delete(lru.key);
      }
      const newNode = new DLLNode(key, value);
      this.map.set(key, newNode);
      this._addHead(newNode);
    }
  }
}\`,
        lineByLine: [
          'Line 1-8: Doubly linked list node definition storing key and value.',
          'Line 10-18: Initialize Map and dummy head & tail to avoid null-boundary checks.',
          'Line 20-23: _remove(node) unlinks node from list in O(1).',
          'Line 25-30: _addHead(node) inserts node directly after dummy head in O(1).',
          'Line 32-38: get(key): lookup in map, move to head, return value.',
          'Line 40-56: put(key, val): update or evict tail.prev (LRU), insert new node at head.'
        ],
        dryRun: [
          { step: 1, state: 'cap=2, put(1, 1), put(2, 2)', action: 'head <-> 2 <-> 1 <-> tail', result: 'map has {1, 2}' },
          { step: 2, state: 'get(1)', action: 'move 1 to head: head <-> 1 <-> 2 <-> tail', result: 'Returns 1' },
          { step: 3, state: 'put(3, 3) exceeds cap', action: 'evict 2 (tail.prev): head <-> 3 <-> 1 <-> tail', result: '2 deleted from map' }
        ],
        complexityDerivation: 'Hash map operations are O(1) average. Doubly linked list node splicing and unlinking involves 4 pointer reassignments $\\\\to O(1)$ strict time. Total space is bounded by O(Capacity).'
      }
    ],
    comparisonTable: [
      { approach: 'Array / Object Timestamp Tracking', time: 'get: O(1), put: O(N)', space: 'O(Capacity)', pros: 'Simpler setup', cons: 'Eviction requires linear scan to find minimum timestamp' },
      { approach: 'Hash Map + Doubly Linked List', time: 'get: O(1), put: O(1)', space: 'O(Capacity)', pros: 'Strict O(1) operations; enterprise LRU industry standard', cons: 'Requires bidirectional node pointer bookkeeping' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for LRU Cache**:
"To achieve O(1) for both get() and put(), I combine a Hash Map with a Doubly Linked List. The Hash Map gives O(1) access to list nodes by key, while the Doubly Linked List allows O(1) node removal and insertion.

I maintain dummy head and dummy tail boundary nodes. The most recently used node is always placed immediately after head, and the least recently used node is always at tail.prev. On get(), I locate the node via map, unlink it in O(1), and re-insert it at head. On put(), if capacity is reached, I evict tail.prev in O(1) from both the list and the map, then insert the new node at head. This guarantees strict O(1) time and O(capacity) space."\`,
    followUps: [
      {
        question: 'Why is a Doubly Linked List required instead of a Singly Linked List?',
        answer: 'To remove a node in O(1), we must re-link its predecessor (node.prev.next = node.next). A singly linked list would require an O(N) traversal to find node.prev.'
      },
      {
        question: 'Why do we store the key inside the DLLNode?',
        answer: 'When evicting the LRU node at tail.prev, we must delete its key from the Hash Map (map.delete(lru.key)). Storing key in the node enables this in O(1).'
      }
    ],
    recallQuiz: {
      question: 'Why does each DLLNode need to store its corresponding key as well as its value?',
      options: [
        'To delete the key from the Hash Map in O(1) when the node is evicted from tail.prev',
        'To sort the list alphabetically',
        'Because JavaScript objects require string keys',
        'To check for duplicate node references'
      ],
      correctIndex: 0,
      explanation: 'When evicting tail.prev, we only have the node reference. We need node.key to call map.delete(node.key) in O(1)!'
    }
  }
};
`;

fs.writeFileSync(BS_FILE, bsContent, 'utf8');
fs.writeFileSync(LL_FILE, llContent, 'utf8');
console.log('Successfully wrote dsaBinarySearchSolutions.js and dsaLinkedListSolutions.js!');
