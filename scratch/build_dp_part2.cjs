// DP Solutions Part 2: Problems 109 to 116
module.exports = {
  109: {
    id: 109,
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    pattern: 'DP - 1D',
    day: 65,
    leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/',
    summary: 'Find a contiguous non-empty subarray within an array that has the largest product.',
    prerequisites: ['Dual state tracking', 'Handling negative product flips'],
    problemStatement: `Given an integer array \`nums\`, find a contiguous non-empty subarray that has the largest product, and return the product.`,
    approaches: [
      {
        name: 'Approach 1: Brute Force All Subarrays (Baseline)',
        badge: 'Baseline / Brute-Force',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        summary: 'Examine product of every contiguous subarray using nested loops.',
        intuition: 'Start at each index i and calculate running product as j advances to the end.',
        codeJS: `function maxProductBrute(nums) {
  let maxProd = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let current = 1;
    for (let j = i; j < nums.length; j++) {
      current *= nums[j];
      maxProd = Math.max(maxProd, current);
    }
  }
  return maxProd;
}`,
        codeTS: `function maxProductBrute(nums: number[]): number {
  let maxProd = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let current = 1;
    for (let j = i; j < nums.length; j++) {
      current *= nums[j];
      maxProd = Math.max(maxProd, current);
    }
  }
  return maxProd;
}`,
        lineByLine: [
          'Line 2: Track global maximum product initialized to -Infinity.',
          'Line 3-8: Outer loop fixes start index; inner loop multiplies subsequent elements.',
          'Line 10: Return highest observed product.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [2, 3, -2, 4]', action: 'i=0: 2, 6, -12, -48', result: 'max = 6' },
          { step: 2, state: 'i=1', action: '3, -6, -24', result: 'max = 6' },
          { step: 3, state: 'i=3', action: '4', result: 'max = 6' }
        ],
        complexityDerivation: 'Nested iterations over N elements -> O(N^2) time and O(1) space.'
      },
      {
        name: 'Approach 2: Dual Min & Max State Tracking (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Maintain both current maximum and current minimum product at each step.',
        intuition: 'A negative number multiplied by the minimum negative product becomes a large positive product! Thus, we must track both min and max.',
        codeJS: `function maxProduct(nums) {
  let res = nums[0];
  let curMin = 1;
  let curMax = 1;

  for (const n of nums) {
    if (n === 0) {
      curMin = 1;
      curMax = 1;
      res = Math.max(res, 0);
      continue;
    }
    const tempMax = curMax * n;
    curMax = Math.max(n * curMax, n * curMin, n);
    curMin = Math.min(tempMax, n * curMin, n);
    res = Math.max(res, curMax);
  }

  return res;
}`,
        codeTS: `function maxProduct(nums: number[]): number {
  let res = nums[0];
  let curMin = 1;
  let curMax = 1;

  for (const n of nums) {
    if (n === 0) {
      curMin = 1;
      curMax = 1;
      res = Math.max(res, 0);
      continue;
    }
    const tempMax = curMax * n;
    curMax = Math.max(n * curMax, n * curMin, n);
    curMin = Math.min(tempMax, n * curMin, n);
    res = Math.max(res, curMax);
  }

  return res;
}`,
        lineByLine: [
          'Line 2-4: Initialize result to nums[0] and running min/max to 1.',
          'Line 7-11: Zero resets running products to 1 while recording 0 as candidate.',
          'Line 12: Cache tempMax because curMax is modified in the next line.',
          'Line 13-14: Compute new curMax and curMin taking max/min of {n*curMax, n*curMin, n}.',
          'Line 15: Update global maximum res.'
        ],
        dryRun: [
          { step: 1, state: 'nums=[-2, 3, -4]', action: 'n=-2: curMax=-2, curMin=-2', result: 'res = -2' },
          { step: 2, state: 'n=3', action: 'curMax=max(3, -6)=3, curMin=min(3, -6)=-6', result: 'res = 3' },
          { step: 3, state: 'n=-4', action: 'curMax=max(-4, -12, 24)=24, curMin=min(-4, -12, 24)=-12', result: 'res = 24' }
        ],
        complexityDerivation: 'Single pass visiting each element once -> O(N) time with O(1) auxiliary variables.'
      }
    ],
    comparisonTable: [
      { approach: 'Brute Force Nested', time: 'O(N²)', space: 'O(1)', pros: 'Trivial logic', cons: 'TLE on large arrays' },
      { approach: 'Dual Min/Max Tracking', time: 'O(N)', space: 'O(1)', pros: 'Linear single pass, handles negative flips elegantly', cons: 'Must handle 0 resets and variable caching' }
    ],
    interviewPitch: 'In Maximum Product Subarray, negative numbers can flip a minimum product into a maximum product when multiplied by another negative value. Therefore, at each step we track both the maximum product and the minimum product achievable up to that index. For each element, the new maximum and minimum are derived from {n, n * curMax, n * curMin}. This runs in O(N) time with strictly O(1) auxiliary space.',
    followUps: [{ question: 'What happens when elements are zeroes?', answer: 'Zero resets the current running contiguous products to 1, effectively partitioning the array into separate subarrays.' }],
    recallQuiz: {
      question: 'Why do we need to track both curMin and curMax?',
      options: ['Because multiplying a negative number by curMin (a negative value) can yield the new maximum product', 'Because JavaScript numbers can overflow', 'Because zeroes divide the array', 'Because the array is sorted'],
      correctIndex: 0,
      explanation: 'Two negative numbers multiplied together produce a positive number; hence the smallest negative product can turn into the greatest positive product.'
    }
  },

  110: {
    id: 110,
    title: 'Word Break',
    difficulty: 'Medium',
    pattern: 'DP - 1D',
    day: 65,
    leetcodeUrl: 'https://leetcode.com/problems/word-break/',
    summary: 'Determine if string s can be segmented into space-separated dictionary words.',
    prerequisites: ['1D DP boolean segmentation', 'Hash Set lookup'],
    problemStatement: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.`,
    approaches: [
      {
        name: 'Approach 1: Top-Down Recursion with Memoization (Improved)',
        badge: 'Improved / Memoized',
        timeComplexity: 'O(N² * M)',
        spaceComplexity: 'O(N)',
        summary: 'Recursive function canBreak(start) with a memoization table.',
        intuition: 'Check if any prefix s[start...end] is in wordDict and recursively solve canBreak(end).',
        codeJS: `function wordBreakMemo(s, wordDict) {
  const dict = new Set(wordDict);
  const memo = new Map();

  function dfs(start) {
    if (start === s.length) return true;
    if (memo.has(start)) return memo.get(start);

    for (let end = start + 1; end <= s.length; end++) {
      const word = s.substring(start, end);
      if (dict.has(word) && dfs(end)) {
        memo.set(start, true);
        return true;
      }
    }

    memo.set(start, false);
    return false;
  }

  return dfs(0);
}`,
        codeTS: `function wordBreakMemo(s: string, wordDict: string[]): boolean {
  const dict = new Set(wordDict);
  const memo = new Map<number, boolean>();

  function dfs(start: number): boolean {
    if (start === s.length) return true;
    if (memo.has(start)) return memo.get(start)!;

    for (let end = start + 1; end <= s.length; end++) {
      const word = s.substring(start, end);
      if (dict.has(word) && dfs(end)) {
        memo.set(start, true);
        return true;
      }
    }

    memo.set(start, false);
    return false;
  }

  return dfs(0);
}`,
        lineByLine: [
          'Line 2: Store wordDict in Set for O(1) average lookup.',
          'Line 5-6: Base case: reached end of string -> valid segmentation.',
          'Line 8-14: Test every substring prefix. If in dict and rest of string can break, cache true.',
          'Line 16-17: If no branch succeeds, cache false and return.'
        ],
        dryRun: [
          { step: 1, state: 's = "leetcode", dict=["leet", "code"]', action: 'dfs(0): finds "leet"', result: 'branches to dfs(4)' },
          { step: 2, state: 'dfs(4)', action: 'finds "code" -> dfs(8)', result: 'dfs(8) === true' },
          { step: 3, state: 'Resolve', action: 'memo[0] = true', result: 'Returns true' }
        ],
        complexityDerivation: 'N starting states, each scanning up to N substrings -> O(N^2 * M) time where M is substring hashing length.'
      },
      {
        name: 'Approach 2: Bottom-Up DP Boolean Array (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N² * M)',
        spaceComplexity: 'O(N)',
        summary: 'dp[i] is true if s[0...i-1] can be segmented into dictionary words.',
        intuition: 'If dp[j] is true and s[j...i] is in wordDict, then dp[i] is true.',
        codeJS: `function wordBreak(s, wordDict) {
  const dict = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true; // empty string is always valid

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && dict.has(s.substring(j, i))) {
        dp[i] = true;
        break; // found valid split, no need to check further j
      }
    }
  }

  return dp[s.length];
}`,
        codeTS: `function wordBreak(s: string, wordDict: string[]): boolean {
  const dict = new Set(wordDict);
  const dp: boolean[] = new Array(s.length + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && dict.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[s.length];
}`,
        lineByLine: [
          'Line 2: Fast Set lookup for dictionary words.',
          'Line 3-4: dp[0] = true represents empty prefix base case.',
          'Line 6-12: Outer loop sets prefix length i; inner loop checks split point j.',
          'Line 14: Return dp[s.length].'
        ],
        dryRun: [
          { step: 1, state: 's = "applepenapple", dict=["apple", "pen"]', action: 'dp[0]=true, i=5: s[0..5]="apple" in dict', result: 'dp[5]=true' },
          { step: 2, state: 'i=8', action: 'dp[5]=true && s[5..8]="pen" in dict', result: 'dp[8]=true' },
          { step: 3, state: 'i=13', action: 'dp[8]=true && s[8..13]="apple" in dict', result: 'dp[13]=true -> returns true' }
        ],
        complexityDerivation: 'Outer loop runs N times, inner loop runs up to N times with substring hashing -> O(N^2 * M) time and O(N) array storage.'
      }
    ],
    comparisonTable: [
      { approach: 'Top-Down Memoized', time: 'O(N² * M)', space: 'O(N)', pros: 'Prunes early when path succeeds', cons: 'Recursion stack overhead' },
      { approach: 'Bottom-Up DP Array', time: 'O(N² * M)', space: 'O(N)', pros: 'Iterative, cache friendly, simple state array', cons: 'Checks substrings up to length N' }
    ],
    interviewPitch: 'Word Break is solved using 1D Dynamic Programming. We define dp[i] as true if the prefix s[0...i-1] can be segmented into words from wordDict. The base case is dp[0] = true for an empty string. For each index i from 1 to s.length, we check all split points j < i. If dp[j] is true and the substring s[j...i] exists in our dictionary Set, we mark dp[i] = true and break early. The answer is dp[s.length], running in O(N^2 * M) time and O(N) space.',
    followUps: [{ question: 'What if word length in dictionary is at most L?', answer: 'We only need to check j down to max(0, i - L), reducing inner loop iterations from N to L, yielding O(N * L) runtime.' }],
    recallQuiz: {
      question: 'What is the role of dp[0] = true in Word Break?',
      options: ['It serves as the base case allowing the first dictionary word matching s[0...i] to transition to true', 'It signifies that the dictionary is empty', 'It guarantees 1-based indexing', 'It holds the maximum word length'],
      correctIndex: 0,
      explanation: 'Without dp[0] = true, the first valid word starting at index 0 would never find a preceding valid split.'
    }
  },

  111: {
    id: 111,
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    pattern: 'DP - 1D',
    day: 66,
    leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    summary: 'Find the length of the longest strictly increasing subsequence in an array.',
    prerequisites: ['1D DP recurrence', 'Binary search patience sorting'],
    problemStatement: `Given an integer array \`nums\`, return the length of the longest strictly increasing subsequence.`,
    approaches: [
      {
        name: 'Approach 1: Dynamic Programming Array (Improved)',
        badge: 'Improved / DP Table',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(N)',
        summary: 'dp[i] = 1 + max(dp[j]) for all j < i where nums[j] < nums[i].',
        intuition: 'At each index i, look back at all smaller previous elements j and extend the longest subsequence ending at j.',
        codeJS: `function lengthOfLISDP(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);
  let maxLen = 1;

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], 1 + dp[j]);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
  }

  return maxLen;
}`,
        codeTS: `function lengthOfLISDP(nums: number[]): number {
  if (nums.length === 0) return 0;
  const dp: number[] = new Array(nums.length).fill(1);
  let maxLen = 1;

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], 1 + dp[j]);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
  }

  return maxLen;
}`,
        lineByLine: [
          'Line 2-3: Initialize dp array with 1 (each individual number is an LIS of length 1).',
          'Line 6-12: For each element i, inspect all prior elements j < i and update dp[i].',
          'Line 14: Return global maximum length.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]', action: 'i=3 (val 5): j=2 (val 2 < 5)', result: 'dp[3] = 1 + dp[2] = 2' },
          { step: 2, state: 'i=5 (val 7)', action: 'nums[3]=5 < 7', result: 'dp[5] = 1 + 2 = 3' },
          { step: 3, state: 'i=6 (val 101)', action: 'nums[5]=7 < 101', result: 'dp[6] = 1 + 3 = 4' }
        ],
        complexityDerivation: 'Nested loops execute N*(N-1)/2 comparisons -> O(N^2) time and O(N) space.'
      },
      {
        name: 'Approach 2: Patience Sorting with Binary Search (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        summary: 'Maintain tails array where tails[i] stores smallest tail of all increasing subsequences of length i+1.',
        intuition: 'By keeping the smallest possible tail for each subsequence length, we maximize chances of extending it. Binary search finds placement in O(log N).',
        codeJS: `function lengthOfLIS(nums) {
  const tails = [];

  for (const x of nums) {
    let l = 0, r = tails.length;
    while (l < r) {
      const mid = (l + r) >> 1;
      if (tails[mid] < x) {
        l = mid + 1;
      } else {
        r = mid;
      }
    }
    tails[l] = x;
  }

  return tails.length;
}`,
        codeTS: `function lengthOfLIS(nums: number[]): number {
  const tails: number[] = [];

  for (const x of nums) {
    let l = 0, r = tails.length;
    while (l < r) {
      const mid = (l + r) >> 1;
      if (tails[mid] < x) {
        l = mid + 1;
      } else {
        r = mid;
      }
    }
    tails[l] = x;
  }

  return tails.length;
}`,
        lineByLine: [
          'Line 2: tails array stores minimum ending values for each subsequence length.',
          'Line 4-13: Binary search (bisect_left) finds first element in tails >= x.',
          'Line 14: If x is larger than all elements, it appends; otherwise it replaces the existing tail to form a tighter bound.',
          'Line 17: Length of tails equals length of LIS.'
        ],
        dryRun: [
          { step: 1, state: 'x=10', action: 'tails = [10]', result: 'len 1' },
          { step: 2, state: 'x=9', action: 'replaces 10: tails = [9]', result: 'tighter tail' },
          { step: 3, state: 'x=2', action: 'replaces 9: tails = [2]', result: 'tighter tail' },
          { step: 4, state: 'x=5', action: 'appends: tails = [2, 5]', result: 'len 2' },
          { step: 5, state: 'x=7', action: 'appends: tails = [2, 5, 7]', result: 'len 3' }
        ],
        complexityDerivation: 'N elements, each located via binary search in O(log N) -> O(N log N) time and O(N) space.'
      }
    ],
    comparisonTable: [
      { approach: 'O(N²) DP Table', time: 'O(N²)', space: 'O(N)', pros: 'Intuitive recurrence', cons: 'Quadratic time fails on N=100,000' },
      { approach: 'Patience Sort Binary Search', time: 'O(N log N)', space: 'O(N)', pros: 'Optimal logarithmic speed per element', cons: 'Tails array does not hold the actual sequence items in order' }
    ],
    interviewPitch: 'While standard DP solves LIS in O(N^2) by comparing each element with all previous elements, we optimize to O(N log N) using Patience Sorting. We maintain an array tails where tails[i] stores the smallest ending element of any increasing subsequence of length i+1. For each number, we binary search for its position in tails: if it is larger than all tails, we append it; otherwise, we replace the first element >= x with x to keep our tails as small as possible. The length of tails is our LIS.',
    followUps: [{ question: 'Does the tails array represent the actual LIS sequence?', answer: 'No, tails preserves lengths and optimal boundaries, not the original subsequence ordering. To reconstruct the sequence, store predecessor pointers.' }],
    recallQuiz: {
      question: 'Why do we replace tails[i] with x when x <= tails[i]?',
      options: ['Because a smaller tail element makes it easier for future elements to extend the subsequence', 'Because tails must remain unsorted', 'Because it decreases memory consumption', 'Because JavaScript forbids duplicates'],
      correctIndex: 0,
      explanation: 'A smaller tail value has a strictly greater chance of being extended by subsequent numbers than a larger tail value.'
    }
  },

  112: {
    id: 112,
    title: 'Partition Equal Subset Sum',
    difficulty: 'Medium',
    pattern: 'DP - 1D',
    day: 66,
    leetcodeUrl: 'https://leetcode.com/problems/partition-equal-subset-sum/',
    summary: 'Determine if an array can be partitioned into two subsets with equal sum.',
    prerequisites: ['0/1 Knapsack DP', 'Reverse array iteration for 1D state'],
    problemStatement: `Given an integer array \`nums\`, return \`true\` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or \`false\` otherwise.`,
    approaches: [
      {
        name: 'Approach 1: 2D 0/1 Knapsack DP Table (Improved)',
        badge: 'Improved / 2D DP',
        timeComplexity: 'O(N * target)',
        spaceComplexity: 'O(N * target)',
        summary: 'dp[i][s] is true if sum s can be formed using a subset of the first i numbers.',
        intuition: 'If sum(nums) is odd, partition is impossible. Target is sum / 2. At each number, either include it or exclude it.',
        codeJS: `function canPartition2D(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  const n = nums.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(false));

  for (let i = 0; i <= n; i++) dp[i][0] = true;

  for (let i = 1; i <= n; i++) {
    for (let s = 1; s <= target; s++) {
      if (s < nums[i - 1]) {
        dp[i][s] = dp[i - 1][s];
      } else {
        dp[i][s] = dp[i - 1][s] || dp[i - 1][s - nums[i - 1]];
      }
    }
  }

  return dp[n][target];
}`,
        codeTS: `function canPartition2D(nums: number[]): boolean {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  const n = nums.length;
  const dp: boolean[][] = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(false));

  for (let i = 0; i <= n; i++) dp[i][0] = true;

  for (let i = 1; i <= n; i++) {
    for (let s = 1; s <= target; s++) {
      if (s < nums[i - 1]) {
        dp[i][s] = dp[i - 1][s];
      } else {
        dp[i][s] = dp[i - 1][s] || dp[i - 1][s - nums[i - 1]];
      }
    }
  }

  return dp[n][target];
}`,
        lineByLine: [
          'Line 2-3: Sum must be even; odd sum immediately returns false.',
          'Line 4-6: Target is total / 2. Allocate (n+1) x (target+1) boolean grid.',
          'Line 7: Base case: sum 0 is always achievable with an empty subset.',
          'Line 9-16: 0/1 knapsack transition: exclude element (dp[i-1][s]) or include element (dp[i-1][s - num]).'
        ],
        dryRun: [
          { step: 1, state: 'nums=[1, 5, 11, 5]', action: 'total = 22 -> target = 11', result: 'even sum' },
          { step: 2, state: 'include 1, 5, 5', action: '1 + 5 + 5 = 11', result: 'target 11 reached' },
          { step: 3, state: 'Result', action: 'dp[4][11]', result: 'Returns true' }
        ],
        complexityDerivation: 'N numbers * target sum -> O(N * target) time and O(N * target) space.'
      },
      {
        name: 'Approach 2: 1D Boolean Array with Reverse Traversal (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N * target)',
        spaceComplexity: 'O(target)',
        summary: 'Compress 2D table into a 1D boolean array, updating from target down to num.',
        intuition: 'Iterating backward prevents using the same number multiple times in the same 0/1 knapsack step.',
        codeJS: `function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;

  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let s = target; s >= num; s--) {
      if (dp[s - num]) {
        dp[s] = true;
      }
    }
    if (dp[target]) return true; // Early exit
  }

  return dp[target];
}`,
        codeTS: `function canPartition(nums: number[]): boolean {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;

  const dp: boolean[] = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let s = target; s >= num; s--) {
      if (dp[s - num]) {
        dp[s] = true;
      }
    }
    if (dp[target]) return true;
  }

  return dp[target];
}`,
        lineByLine: [
          'Line 2-3: Fast parity check: if sum is odd, return false.',
          'Line 6-7: dp[0] = true represents achievable zero sum.',
          'Line 9-14: CRITICAL: Loop backwards from target down to num so values from the current iteration do not overwrite previous states.',
          'Line 15: Early exit if target is formed.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [1, 5, 11, 5], target = 11', action: 'num=1: dp[1]=true', result: 'dp = {0, 1}' },
          { step: 2, state: 'num=5', action: 's=6..5: dp[6]=true, dp[5]=true', result: 'dp = {0, 1, 5, 6}' },
          { step: 3, state: 'num=11', action: 's=11: dp[11-11]=dp[0]=true', result: 'dp[11]=true -> Early return true!' }
        ],
        complexityDerivation: 'N elements * target states -> O(N * target) time with strictly O(target) space.'
      }
    ],
    comparisonTable: [
      { approach: '2D DP Grid', time: 'O(N * target)', space: 'O(N * target)', pros: 'Full decision tree visibility', cons: 'Excessive matrix memory allocations' },
      { approach: '1D Reverse DP Array', time: 'O(N * target)', space: 'O(target)', pros: 'Optimal space, cache friendly, early exit support', cons: 'Must remember to iterate backwards' }
    ],
    interviewPitch: 'Partition Equal Subset Sum reduces directly to the classic 0/1 Knapsack problem. If the total array sum is odd, two equal integer partitions cannot exist. Otherwise, our target is totalSum / 2. We use a 1D boolean array dp where dp[s] indicates whether sum s is achievable. Crucially, we iterate the inner loop backwards from target down to num to ensure each number is used at most once. This runs in O(N * target) time and O(target) space.',
    followUps: [{ question: 'Why MUST the inner loop traverse backwards?', answer: 'Forward traversal would allow an element to be added to a sum that was formed using that same element in the same iteration, turning 0/1 knapsack into unbounded knapsack!' }],
    recallQuiz: {
      question: 'What happens if you iterate s forward (from num to target) instead of backward?',
      options: ['The same element can be reused multiple times, turning it into unbounded knapsack', 'A syntax error occurs', 'The array gets reversed', 'Zero division occurs'],
      correctIndex: 0,
      explanation: 'Backward traversal ensures dp[s - num] represents a state from the previous item, preventing duplicate item reuse.'
    }
  },

  113: {
    id: 113,
    title: 'Unique Paths',
    difficulty: 'Medium',
    pattern: 'DP - 2D',
    day: 67,
    leetcodeUrl: 'https://leetcode.com/problems/unique-paths/',
    summary: 'Find the number of possible unique paths for a robot to reach bottom-right from top-left in an m x n grid.',
    prerequisites: ['2D Grid DP', 'Combinatorics formula (m+n-2 choose m-1)'],
    problemStatement: `There is an \`m x n\` grid. Robot starts at top-left corner \`(0, 0)\` and wants to reach bottom-right corner \`(m - 1, n - 1)\`. Robot can only move down or right. Return number of possible unique paths.`,
    approaches: [
      {
        name: 'Approach 1: 2D Grid DP Matrix (Improved)',
        badge: 'Improved / 2D DP',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N)',
        summary: 'dp[r][c] = dp[r-1][c] + dp[r][c-1] since robot moves only down or right.',
        intuition: 'Every cell can only be reached from the cell directly above it or the cell directly to its left.',
        codeJS: `function uniquePaths2D(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(1));

  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
    }
  }

  return dp[m - 1][n - 1];
}`,
        codeTS: `function uniquePaths2D(m: number, n: number): number {
  const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(1));

  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
    }
  }

  return dp[m - 1][n - 1];
}`,
        lineByLine: [
          'Line 2: Initialize M x N grid with 1 (first row and first column only have 1 valid path: moving strictly right or down).',
          'Line 4-7: For all other cells (r, c), sum paths from above (dp[r-1][c]) and left (dp[r][c-1]).',
          'Line 9: Return paths to bottom-right cell.'
        ],
        dryRun: [
          { step: 1, state: 'm=3, n=7', action: 'Row 0: all 1s; Col 0: all 1s', result: 'base set' },
          { step: 2, state: 'r=1, c=1', action: 'dp[1][1] = 1 + 1 = 2', result: 'paths = 2' },
          { step: 3, state: 'End', action: 'dp[2][6]', result: 'Returns 28' }
        ],
        complexityDerivation: 'Fills M x N cells -> O(M * N) time and O(M * N) space.'
      },
      {
        name: 'Approach 2: 1D Rolling Row State Array (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(N)',
        summary: 'Maintain single row of length n, accumulating paths in O(N) space.',
        intuition: 'Each cell only needs the current row left value and previous row above value.',
        codeJS: `function uniquePaths(m, n) {
  const row = new Array(n).fill(1);

  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      row[c] += row[c - 1]; // row[c] is above, row[c-1] is left
    }
  }

  return row[n - 1];
}`,
        codeTS: `function uniquePaths(m: number, n: number): number {
  const row: number[] = new Array(n).fill(1);

  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      row[c] += row[c - 1];
    }
  }

  return row[n - 1];
}`,
        lineByLine: [
          'Line 2: Single row array of length n initialized to 1.',
          'Line 4-7: Loop m - 1 times. row[c] += row[c-1] adds the left cell to the previous row cell in-place.',
          'Line 9: Return row[n - 1].'
        ],
        dryRun: [
          { step: 1, state: 'm=3, n=3, row=[1, 1, 1]', action: 'r=1: c=1 -> 1+1=2, c=2 -> 1+2=3', result: 'row = [1, 2, 3]' },
          { step: 2, state: 'r=2', action: 'c=1 -> 2+1=3, c=2 -> 3+3=6', result: 'row = [1, 3, 6]' },
          { step: 3, state: 'End', action: 'return row[2]', result: 'Returns 6' }
        ],
        complexityDerivation: '(M - 1) * (N - 1) additions -> O(M * N) time with O(N) space.'
      }
    ],
    comparisonTable: [
      { approach: '2D Matrix DP', time: 'O(M * N)', space: 'O(M * N)', pros: 'Maps visually to grid', cons: 'Allocates full matrix' },
      { approach: '1D Rolling Row DP', time: 'O(M * N)', space: 'O(N)', pros: 'Compresses space to single row', cons: 'Overwrites row values' }
    ],
    interviewPitch: 'In Unique Paths, the robot can only move right or down. Therefore, the number of paths to cell (r, c) is the sum of paths from cell (r-1, c) and cell (r, c-1). We initialize the first row and column to 1. To optimize space, we compress the 2D grid into a single 1D array of size N where row[c] += row[c - 1]. This reduces auxiliary space from O(M * N) to O(N) while maintaining O(M * N) runtime.',
    followUps: [{ question: 'Can this be solved in O(min(M, N)) time?', answer: 'Yes! Using combinatorics: total steps = (m-1) + (n-1). We need to choose (m-1) down moves out of total steps: C(m+n-2, m-1) calculated in O(min(M, N)) time and O(1) space.' }],
    recallQuiz: {
      question: 'What mathematical formula calculates Unique Paths in O(1) auxiliary space?',
      options: ['Combinations: (m + n - 2)! / ((m - 1)! * (n - 1)!)', 'Permutations: (m * n)!', 'Fibonacci(m + n)', 'Euler Totient'],
      correctIndex: 0,
      explanation: 'The robot must make exactly (m - 1) down moves and (n - 1) right moves in any order, which is the binomial coefficient C(m + n - 2, m - 1).'
    }
  },

  114: {
    id: 114,
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    pattern: 'DP - 2D',
    day: 67,
    leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/',
    summary: 'Find the length of the longest subsequence present in both string text1 and text2.',
    prerequisites: ['2D Matrix DP', 'Character matching vs branch elimination'],
    problemStatement: `Given two strings \`text1\` and \`text2\`, return the length of their longest common subsequence. If there is no common subsequence, return 0.`,
    approaches: [
      {
        name: 'Approach 1: 2D Grid DP Table (Improved)',
        badge: 'Improved / 2D DP',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N)',
        summary: 'dp[i][j] stores LCS of text1[0...i-1] and text2[0...j-1].',
        intuition: 'If text1[i-1] === text2[j-1], chars match: 1 + dp[i-1][j-1]. Otherwise, max(dp[i-1][j], dp[i][j-1]).',
        codeJS: `function longestCommonSubsequence2D(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}`,
        codeTS: `function longestCommonSubsequence2D(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}`,
        lineByLine: [
          'Line 4: Allocate (m+1) x (n+1) grid filled with 0.',
          'Line 6-13: If chars match, extend diagonal match by 1; otherwise take max from dropping one char from text1 or text2.',
          'Line 15: Return dp[m][n].'
        ],
        dryRun: [
          { step: 1, state: 'text1="abcde", text2="ace"', action: 'i=1(a), j=1(a): match!', result: 'dp[1][1] = 1' },
          { step: 2, state: 'i=3(c), j=2(c)', action: 'match! 1 + dp[2][1] = 2', result: 'dp[3][2] = 2' },
          { step: 3, state: 'i=5(e), j=3(e)', action: 'match! 1 + dp[4][2] = 3', result: 'Returns 3 ("ace")' }
        ],
        complexityDerivation: 'Fills (M + 1) * (N + 1) cells -> O(M * N) time and O(M * N) memory.'
      },
      {
        name: 'Approach 2: Space-Optimized Dual Rows (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(min(M, N))',
        summary: 'Only two rows (prev and curr) are needed at any point during computation.',
        intuition: 'Row i only references cells from row i and row i-1.',
        codeJS: `function longestCommonSubsequence(text1, text2) {
  if (text1.length < text2.length) {
    [text1, text2] = [text2, text1]; // Ensure text2 is shorter for O(min(M, N)) space
  }
  const n = text2.length;
  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);

  for (let i = 1; i <= text1.length; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        curr[j] = 1 + prev[j - 1];
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    prev = [...curr];
  }

  return curr[n];
}`,
        codeTS: `function longestCommonSubsequence(text1: string, text2: string): number {
  if (text1.length < text2.length) {
    [text1, text2] = [text2, text1];
  }
  const n = text2.length;
  let prev: number[] = new Array(n + 1).fill(0);
  let curr: number[] = new Array(n + 1).fill(0);

  for (let i = 1; i <= text1.length; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        curr[j] = 1 + prev[j - 1];
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    prev = [...curr];
  }

  return curr[n];
}`,
        lineByLine: [
          'Line 2-4: Swap strings if needed to ensure inner loop allocates min(M, N) memory.',
          'Line 6-7: Allocate two rows of length n + 1.',
          'Line 9-17: Populate curr row from prev and curr[j-1], then swap prev = [...curr].',
          'Line 19: Return curr[n].'
        ],
        dryRun: [
          { step: 1, state: 'text1="abc", text2="ac"', action: 'i=1(\'a\'): curr=[0, 1, 1]', result: 'prev updated' },
          { step: 2, state: 'i=2(\'b\')', action: 'curr=[0, 1, 1]', result: 'no match' },
          { step: 3, state: 'i=3(\'c\')', action: 'curr[2] = 1 + prev[1] = 2', result: 'Returns 2' }
        ],
        complexityDerivation: 'M * N iterations -> O(M * N) time with O(min(M, N)) auxiliary space.'
      }
    ],
    comparisonTable: [
      { approach: '2D Matrix Table', time: 'O(M * N)', space: 'O(M * N)', pros: 'Can backtrack to reconstruct the actual string', cons: 'High heap allocation on long texts' },
      { approach: 'Dual Row Space-Optimized', time: 'O(M * N)', space: 'O(min(M, N))', pros: 'Optimal minimal memory footprint', cons: 'Only retains length, not actual sequence' }
    ],
    interviewPitch: 'Longest Common Subsequence is a textbook 2D dynamic programming problem. At each pair of indices (i, j), if text1[i-1] matches text2[j-1], we extend the diagonal subproblem: dp[i][j] = 1 + dp[i-1][j-1]. If they differ, we take the maximum of excluding a character from either string: max(dp[i-1][j], dp[i][j-1]). Since each row only depends on the previous row, we compress auxiliary space to O(min(M, N)) using two rolling rows while preserving O(M * N) time.',
    followUps: [{ question: 'How can you reconstruct the actual subsequence string?', answer: 'Use the full 2D table and trace back from (m, n): if characters match, prepend char and move (i-1, j-1); otherwise move towards the larger neighbor.' }],
    recallQuiz: {
      question: 'When text1[i-1] !== text2[j-1], why is the recurrence max(dp[i-1][j], dp[i][j-1])?',
      options: ['Because the optimal common subsequence either does not include text1[i-1] or does not include text2[j-1]', 'Because characters are hashed', 'Because LCS must be contiguous', 'Because subsequences cannot be empty'],
      correctIndex: 0,
      explanation: 'Since the characters differ, they cannot both contribute to the same common match; at least one must be excluded.'
    }
  },

  115: {
    id: 115,
    title: 'Coin Change II',
    difficulty: 'Medium',
    pattern: 'DP - 2D',
    day: 68,
    leetcodeUrl: 'https://leetcode.com/problems/coin-change-ii/',
    summary: 'Return the number of combinations that make up a given amount using infinite coins of given denominations.',
    prerequisites: ['Unbounded Knapsack combinations vs permutations', '1D DP order of loops'],
    problemStatement: `You are given an integer array \`coins\` and an integer \`amount\`. Return the number of combinations that make up that amount. You may assume you have an infinite number of each kind of coin.`,
    approaches: [
      {
        name: 'Approach 1: 2D Unbounded Knapsack Table (Improved)',
        badge: 'Improved / 2D DP',
        timeComplexity: 'O(N * amount)',
        spaceComplexity: 'O(N * amount)',
        summary: 'dp[i][a] is combinations to form amount a using first i coins.',
        intuition: 'dp[i][a] = dp[i-1][a] (exclude coin) + dp[i][a - coin] (include coin).',
        codeJS: `function change2D(amount, coins) {
  const n = coins.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(amount + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = 1;

  for (let i = 1; i <= n; i++) {
    for (let a = 1; a <= amount; a++) {
      dp[i][a] = dp[i - 1][a];
      if (a >= coins[i - 1]) {
        dp[i][a] += dp[i][a - coins[i - 1]];
      }
    }
  }

  return dp[n][amount];
}`,
        codeTS: `function change2D(amount: number, coins: number[]): number {
  const n = coins.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(amount + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = 1;

  for (let i = 1; i <= n; i++) {
    for (let a = 1; a <= amount; a++) {
      dp[i][a] = dp[i - 1][a];
      if (a >= coins[i - 1]) {
        dp[i][a] += dp[i][a - coins[i - 1]];
      }
    }
  }

  return dp[n][amount];
}`,
        lineByLine: [
          'Line 4: Amount 0 has 1 valid combination: picking no coins.',
          'Line 6-13: dp[i-1][a] counts ways without current coin; dp[i][a - coin] adds ways using current coin.',
          'Line 15: Return dp[n][amount].'
        ],
        dryRun: [
          { step: 1, state: 'coins=[1, 2, 5], amount=5', action: 'using [1]: all amounts have 1 way', result: 'dp[1][5] = 1' },
          { step: 2, state: 'using [1, 2]', action: 'adds {2,2,1}, {2,1,1,1}', result: 'dp[2][5] = 3' },
          { step: 3, state: 'using [1, 2, 5]', action: 'adds {5}', result: 'dp[3][5] = 4 ways' }
        ],
        complexityDerivation: 'N coins * amount states -> O(N * amount) time and O(N * amount) space.'
      },
      {
        name: 'Approach 2: 1D Array with Coin Outer Loop (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N * amount)',
        spaceComplexity: 'O(amount)',
        summary: 'Iterate coins on the outside and amount forward on the inside to count unique combinations.',
        intuition: 'Placing the coin loop on the outside guarantees combinations are counted, avoiding duplicate permutations.',
        codeJS: `function change(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1; // 1 combination for amount 0

  for (const c of coins) {
    for (let a = c; a <= amount; a++) {
      dp[a] += dp[a - c];
    }
  }

  return dp[amount];
}`,
        codeTS: `function change(amount: number, coins: number[]): number {
  const dp: number[] = new Array(amount + 1).fill(0);
  dp[0] = 1;

  for (const c of coins) {
    for (let a = c; a <= amount; a++) {
      dp[a] += dp[a - c];
    }
  }

  return dp[amount];
}`,
        lineByLine: [
          'Line 2-3: Initialize dp array with 0; dp[0] = 1.',
          'Line 5: CRITICAL: Iterate through coins FIRST to guarantee combinations rather than permutations.',
          'Line 6-8: Loop amount forward from c up to amount, accumulating ways.',
          'Line 11: Return dp[amount].'
        ],
        dryRun: [
          { step: 1, state: 'coins=[1, 2], amount=3', action: 'c=1: dp=[1, 1, 1, 1]', result: 'only 1s' },
          { step: 2, state: 'c=2', action: 'a=2: dp[2]+=dp[0]->2; a=3: dp[3]+=dp[1]->2', result: 'dp = [1, 1, 2, 2]' },
          { step: 3, state: 'Done', action: 'return dp[3]', result: 'Output 2 ({1,1,1}, {1,2})' }
        ],
        complexityDerivation: 'Outer loop runs N times, inner loop runs amount times -> O(N * amount) time with O(amount) space.'
      }
    ],
    comparisonTable: [
      { approach: '2D Knapsack Table', time: 'O(N * amount)', space: 'O(N * amount)', pros: 'Explicit coin inclusion/exclusion steps', cons: 'Wastes memory' },
      { approach: '1D Combinations DP', time: 'O(N * amount)', space: 'O(amount)', pros: 'Minimal O(amount) space, simple nested loops', cons: 'Loop order must strictly put coins outside' }
    ],
    interviewPitch: 'Coin Change II asks for combinations rather than permutations. To ensure we only count combinations (e.g. [1, 2] and [2, 1] are treated as the same combination), we MUST loop over the coins on the outer loop and the amounts on the inner loop. We initialize dp[0] = 1, and for each coin c and amount a from c to target, we add dp[a - c] to dp[a]. This executes in O(N * amount) time and strictly O(amount) auxiliary space.',
    followUps: [{ question: 'What happens if you swap the loops (amount outside, coins inside)?', answer: 'You would count permutations instead of combinations (Combination Sum IV) where order matters!' }],
    recallQuiz: {
      question: 'Why does placing the coin loop outside prevent duplicate permutations?',
      options: ['Because each coin denomination is considered once and in a fixed order, enforcing non-decreasing sequences', 'Because amounts are prime', 'Because dp[0] is 1', 'Because the array is sorted'],
      correctIndex: 0,
      explanation: 'Processing coins one by one ensures we never pick an earlier coin after a later coin, preventing permutations like [2, 1] when [1, 2] was already counted.'
    }
  },

  116: {
    id: 116,
    title: 'Target Sum',
    difficulty: 'Medium',
    pattern: 'DP - 2D',
    day: 68,
    leetcodeUrl: 'https://leetcode.com/problems/target-sum/',
    summary: 'Assign + and - to each integer in nums to make their sum equal to target. Return total ways.',
    prerequisites: ['Mathematical reduction to Subset Sum', '0/1 Knapsack'],
    problemStatement: `You are given an integer array \`nums\` and an integer \`target\`. Build an expression using '+' and '-' before each integer to evaluate to \`target\`. Return the number of different expressions that evaluate to target.`,
    approaches: [
      {
        name: 'Approach 1: Top-Down Recursion with Memoization (Improved)',
        badge: 'Improved / Memoized',
        timeComplexity: 'O(N * totalSum)',
        spaceComplexity: 'O(N * totalSum)',
        summary: 'Memoized recursion dfs(index, currentSum) branching on +num and -num.',
        intuition: 'At each element, branch into adding or subtracting nums[index]. Memoize on (index, currentSum).',
        codeJS: `function findTargetSumWaysMemo(nums, target) {
  const memo = new Map();

  function dfs(i, cur) {
    if (i === nums.length) {
      return cur === target ? 1 : 0;
    }
    const key = \`\${i},\${cur}\`;
    if (memo.has(key)) return memo.get(key);

    const ways = dfs(i + 1, cur + nums[i]) + dfs(i + 1, cur - nums[i]);
    memo.set(key, ways);
    return ways;
  }

  return dfs(0, 0);
}`,
        codeTS: `function findTargetSumWaysMemo(nums: number[], target: number): number {
  const memo = new Map<string, number>();

  function dfs(i: number, cur: number): number {
    if (i === nums.length) {
      return cur === target ? 1 : 0;
    }
    const key = \`\${i},\${cur}\`;
    if (memo.has(key)) return memo.get(key)!;

    const ways = dfs(i + 1, cur + nums[i]) + dfs(i + 1, cur - nums[i]);
    memo.set(key, ways);
    return ways;
  }

  return dfs(0, 0);
}`,
        lineByLine: [
          'Line 2: Memoization map using string key "i,cur".',
          'Line 5-6: Base case: at end of array, return 1 if cur === target else 0.',
          'Line 10-12: Sum ways from positive choice and negative choice, cache, and return.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [1, 1], target = 0', action: 'i=0: branches +1 and -1', result: 'depth 1' },
          { step: 2, state: 'i=1', action: '+1-1=0 (valid), -1+1=0 (valid)', result: 'total ways = 2' }
        ],
        complexityDerivation: 'N indices * (2 * totalSum) states -> O(N * totalSum) time and space.'
      },
      {
        name: 'Approach 2: Mathematical Reduction to 0/1 Subset Sum (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N * subsetTarget)',
        spaceComplexity: 'O(subsetTarget)',
        summary: 'P - N = target and P + N = sum => 2P = sum + target => P = (sum + target) / 2.',
        intuition: 'Partitioning nums into positive subset P and negative subset N reduces the problem to finding subsets summing to (sum + target) / 2.',
        codeJS: `function findTargetSumWays(nums, target) {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (Math.abs(target) > sum || (sum + target) % 2 !== 0) {
    return 0;
  }

  const subsetTarget = (sum + target) / 2;
  const dp = new Array(subsetTarget + 1).fill(0);
  dp[0] = 1;

  for (const num of nums) {
    for (let s = subsetTarget; s >= num; s--) {
      dp[s] += dp[s - num];
    }
  }

  return dp[subsetTarget];
}`,
        codeTS: `function findTargetSumWays(nums: number[], target: number): number {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (Math.abs(target) > sum || (sum + target) % 2 !== 0) {
    return 0;
  }

  const subsetTarget = (sum + target) / 2;
  const dp: number[] = new Array(subsetTarget + 1).fill(0);
  dp[0] = 1;

  for (const num of nums) {
    for (let s = subsetTarget; s >= num; s--) {
      dp[s] += dp[s - num];
    }
  }

  return dp[subsetTarget];
}`,
        lineByLine: [
          'Line 2-5: If target exceeds sum or (sum + target) is odd, no integer solution exists -> return 0.',
          'Line 7: Derive subset target P = (sum + target) / 2.',
          'Line 8-9: Allocate dp array initialized with 0; dp[0] = 1.',
          'Line 11-15: Standard 0/1 Knapsack backward loop accumulating ways to form each sum.',
          'Line 17: Return dp[subsetTarget].'
        ],
        dryRun: [
          { step: 1, state: 'nums = [1, 1, 1, 1, 1], target = 3', action: 'sum = 5, (5 + 3) / 2 = 4', result: 'subsetTarget = 4' },
          { step: 2, state: 'Run 0/1 knapsack for sum 4', action: '5 choose 4 subsets', result: 'Returns 5' }
        ],
        complexityDerivation: 'O(N * subsetTarget) time with O(subsetTarget) auxiliary array space.'
      }
    ],
    comparisonTable: [
      { approach: 'Top-Down Memoized DFS', time: 'O(N * sum)', space: 'O(N * sum)', pros: 'Direct translation of + and - decisions', cons: 'String concatenation for memo keys is slow' },
      { approach: 'Subset Sum Reduction', time: 'O(N * subsetTarget)', space: 'O(subsetTarget)', pros: 'Pure 1D integer array, extremely fast and memory-efficient', cons: 'Requires mathematical algebraic derivation' }
    ],
    interviewPitch: 'Target Sum can be reduced mathematically to the 0/1 Subset Sum problem. If we divide nums into two disjoint sets, P (positive signs) and N (negative signs), then sum(P) - sum(N) = target. Adding sum(P) + sum(N) = sum(nums) to both sides gives 2 * sum(P) = target + sum(nums), meaning sum(P) = (target + sum(nums)) / 2. If target > sum or (target + sum) is odd, return 0. Otherwise, we run 1D 0/1 Knapsack to find the number of subsets that sum to sum(P) in O(N * subsetTarget) time and O(subsetTarget) space.',
    followUps: [{ question: 'What if nums contains zeroes?', answer: 'The formula handles zeroes naturally: for each 0, dp[s] += dp[s - 0] multiplies the number of valid subsets by 2, correctly accounting for +0 and -0.' }],
    recallQuiz: {
      question: 'Why does 2 * sum(P) = target + sum(nums) imply that (target + sum) must be even?',
      options: ['Because 2 * sum(P) is always even, so if (target + sum) is odd, no integer subset P can exist', 'Because target must be positive', 'Because nums contains only even numbers', 'Because array length is even'],
      correctIndex: 0,
      explanation: 'Since 2 * sum(P) is an even integer, target + sum(nums) must also be even for sum(P) to be an integer.'
    }
  }
};
