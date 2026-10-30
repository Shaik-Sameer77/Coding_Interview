const fs = require('fs');
const path = require('path');

// 1. Upgrade ADVANCED_PATTERN_SOLUTIONS (15, 27)
const advPath = path.join(__dirname, '../src/dsa/data/solutions/dsaAdvancedPatternSolutions.js');
let advContent = fs.readFileSync(advPath, 'utf-8');

// In 15: add Approach 1 DP with LeftMax and RightMax arrays, and Approach 2 Two Pointers
const approach15_DP = `      {
        name: 'Approach 1: Dynamic Programming Prefix/Suffix Max (Improved)',
        badge: 'Improved / DP Arrays',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Precompute leftMax and rightMax arrays; trapped water at i is min(leftMax[i], rightMax[i]) - height[i].',
        intuition: 'The water over bar i is bounded by the maximum height to its left and right. Precomputing these arrays eliminates re-scanning.',
        codeJS: \`function trapDP(height) {
  const n = height.length;
  if (n === 0) return 0;
  const leftMax = new Array(n);
  const rightMax = new Array(n);

  leftMax[0] = height[0];
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], height[i]);
  }

  rightMax[n - 1] = height[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], height[i]);
  }

  let water = 0;
  for (let i = 0; i < n; i++) {
    water += Math.min(leftMax[i], rightMax[i]) - height[i];
  }
  return water;
}\`,
        codeTS: \`function trapDP(height: number[]): number {
  const n = height.length;
  if (n === 0) return 0;
  const leftMax: number[] = new Array(n);
  const rightMax: number[] = new Array(n);

  leftMax[0] = height[0];
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], height[i]);
  }

  rightMax[n - 1] = height[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], height[i]);
  }

  let water = 0;
  for (let i = 0; i < n; i++) {
    water += Math.min(leftMax[i], rightMax[i]) - height[i];
  }
  return water;
}\`,
        lineByLine: [
          'Line 4-5: Allocate leftMax and rightMax arrays.',
          'Line 7-10: Precompute running max from left to right.',
          'Line 12-15: Precompute running max from right to left.',
          'Line 17-20: Sum water above each bar.'
        ],
        dryRun: [
          { step: 1, state: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', action: 'leftMax & rightMax precomputed', result: 'water = 6' }
        ],
        complexityDerivation: 'Three sequential linear passes -> O(N) time with O(N) auxiliary space.'
      },
      `;

advContent = advContent.replace(
  "approaches: [\n      {\n        name: 'Approach 1: Two Pointers Inward Convergence (Optimal)',",
  "approaches: [\n" + approach15_DP + "{\n        name: 'Approach 2: Two Pointers Inward Convergence (Optimal)',"
);

// In 27: add Approach 1 Brute Force
const approach27_BF = `      {
        name: 'Approach 1: Brute Force Nested Scan (Baseline)',
        badge: 'Baseline / Brute-Force',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        summary: 'For each day, scan forward until a warmer temperature is found.',
        intuition: 'Simple nested loops looking for the first index j > i where temperatures[j] > temperatures[i].',
        codeJS: \`function dailyTemperaturesBrute(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (temperatures[j] > temperatures[i]) {
        answer[i] = j - i;
        break;
      }
    }
  }
  return answer;
}\`,
        codeTS: \`function dailyTemperaturesBrute(temperatures: number[]): number[] {
  const n = temperatures.length;
  const answer: number[] = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (temperatures[j] > temperatures[i]) {
        answer[i] = j - i;
        break;
      }
    }
  }
  return answer;
}\`,
        lineByLine: [
          'Line 3: Initialize answer array filled with 0s.',
          'Line 4-11: Outer loop picks day i, inner loop searches for first warmer day j.'
        ],
        dryRun: [
          { step: 1, state: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]', action: 'i=0: j=1 (74 > 73) -> ans[0] = 1', result: 'ans = [1, ...]' }
        ],
        complexityDerivation: 'Worst case decreasing temperatures scans N*(N-1)/2 pairs -> O(N^2) time and O(1) space.'
      },
      `;

advContent = advContent.replace(
  "approaches: [\n      {\n        name: 'Approach 1: Monotonic Decreasing Stack (Optimal)',",
  "approaches: [\n" + approach27_BF + "{\n        name: 'Approach 2: Monotonic Decreasing Stack (Optimal)',"
);

fs.writeFileSync(advPath, advContent, 'utf-8');
console.log('Successfully upgraded Advanced Pattern solutions 15, 27');

// 2. Upgrade CORE_REGISTRY_SOLUTIONS (16, 17, 23, 31)
const corePath = path.join(__dirname, '../src/dsa/data/solutions/dsaCoreRegistrySolutions.js');
let coreContent = fs.readFileSync(corePath, 'utf-8');

// For 16: add Approach 1 Brute Force
const approach16_BF = `      {
        name: 'Approach 1: Brute Force All Buy/Sell Pairs (Baseline)',
        badge: 'Baseline / Brute-Force',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        summary: 'Check profit for every pair of buy day i and sell day j > i.',
        intuition: 'Compute prices[j] - prices[i] for all valid day combinations.',
        codeJS: \`function maxProfitBrute(prices) {
  let maxP = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      maxP = Math.max(maxP, prices[j] - prices[i]);
    }
  }
  return maxP;
}\`,
        codeTS: \`function maxProfitBrute(prices: number[]): number {
  let maxP = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      maxP = Math.max(maxP, prices[j] - prices[i]);
    }
  }
  return maxP;
}\`,
        lineByLine: [
          'Line 2: Track max profit.',
          'Line 3-6: Nested loops compare every buy day i with subsequent sell day j.'
        ],
        dryRun: [
          { step: 1, state: 'prices = [7, 1, 5, 3, 6, 4]', action: 'i=1 (1), j=4 (6): profit = 5', result: 'maxP = 5' }
        ],
        complexityDerivation: 'N*(N-1)/2 iterations -> O(N^2) time and O(1) space.'
      },
      `;

coreContent = coreContent.replace(
  "approaches: [\n      {\n        name: 'Approach 1: One Pass Min Price Tracker (Optimal)',",
  "approaches: [\n" + approach16_BF + "{\n        name: 'Approach 2: One Pass Min Price Tracker (Optimal)',"
);

// For 17: add Approach 1 Brute Force
const approach17_BF = `      {
        name: 'Approach 1: Brute Force All Substrings (Baseline)',
        badge: 'Baseline / Brute-Force',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(N)',
        summary: 'Check every substring starting at i; expand until duplicate character is seen.',
        intuition: 'For each index i, insert characters into a Set; stop when a character repeats.',
        codeJS: \`function lengthOfLongestSubstringBrute(s) {
  let maxLen = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set();
    for (let j = i; j < s.length; j++) {
      if (seen.has(s[j])) break;
      seen.add(s[j]);
      maxLen = Math.max(maxLen, j - i + 1);
    }
  }
  return maxLen;
}\`,
        codeTS: \`function lengthOfLongestSubstringBrute(s: string): number {
  let maxLen = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set<string>();
    for (let j = i; j < s.length; j++) {
      if (seen.has(s[j])) break;
      seen.add(s[j]);
      maxLen = Math.max(maxLen, j - i + 1);
    }
  }
  return maxLen;
}\`,
        lineByLine: [
          'Line 3: Outer loop selects start of substring.',
          'Line 5-8: Inner loop extends substring, stopping when duplicate is found.'
        ],
        dryRun: [
          { step: 1, state: 's = "abcabcbb"', action: 'i=0: adds a, b, c, stops at a', result: 'maxLen = 3' }
        ],
        complexityDerivation: 'O(N^2) time and O(N) space.'
      },
      `;

coreContent = coreContent.replace(
  "approaches: [\n      {\n        name: 'Approach 1: Sliding Window with Hash Set',",
  "approaches: [\n" + approach17_BF + "{\n        name: 'Approach 2: Sliding Window with Hash Set (Optimal)',"
);

// For 23: add Approach 1 String Replacement
const approach23_Replace = `      {
        name: 'Approach 1: String Replacement Loop (Baseline)',
        badge: 'Baseline / String Replacement',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(N)',
        summary: 'Repeatedly remove adjacent matching pairs "()", "[]", "{}" until no more exist.',
        intuition: 'Valid parentheses reduce to empty string by repeatedly eliminating matched adjacent pairs.',
        codeJS: \`function isValidReplace(s) {
  let prevLen = -1;
  while (s.length !== prevLen) {
    prevLen = s.length;
    s = s.replace('()', '').replace('[]', '').replace('{}', '');
  }
  return s.length === 0;
}\`,
        codeTS: \`function isValidReplace(s: string): boolean {
  let prevLen = -1;
  while (s.length !== prevLen) {
    prevLen = s.length;
    s = s.replace('()', '').replace('[]', '').replace('{}', '');
  }
  return s.length === 0;
}\`,
        lineByLine: [
          'Line 3-6: In a loop, replace "()", "[]", "{}" with empty strings.',
          'Line 7: Return true if all brackets collapsed to empty string.'
        ],
        dryRun: [
          { step: 1, state: 's = "()[{}]"', action: 's.replace removes "()" and "{}"', result: 's = "[]" -> s = ""' }
        ],
        complexityDerivation: 'N/2 replacements, each allocating string of length N -> O(N^2) time and O(N) space.'
      },
      `;

coreContent = coreContent.replace(
  "approaches: [\n      {\n        name: 'Approach 1: LIFO Stack with Bracket Map (Optimal)',",
  "approaches: [\n" + approach23_Replace + "{\n        name: 'Approach 2: LIFO Stack with Bracket Map (Optimal)',"
);

// For 31: add Approach 1 Linear Scan
const approach31_Linear = `      {
        name: 'Approach 1: Linear Scan (Baseline)',
        badge: 'Baseline / Linear Scan',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Iterate through array from left to right until target is found.',
        intuition: 'Inspect each element sequentially without taking advantage of the sorted order.',
        codeJS: \`function searchLinear(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}\`,
        codeTS: \`function searchLinear(nums: number[], target: number): number {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}\`,
        lineByLine: [
          'Line 2-4: Iterate over nums and return index when element matches target.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [-1,0,3,5,9,12], target = 9', action: 'Scans indices 0, 1, 2, 3, 4', result: 'Returns 4' }
        ],
        complexityDerivation: 'Single loop over N elements -> O(N) time and O(1) space.'
      },
      `;

coreContent = coreContent.replace(
  "approaches: [\n      {\n        name: 'Approach 1: Iterative Binary Search (Optimal)',",
  "approaches: [\n" + approach31_Linear + "{\n        name: 'Approach 2: Iterative Binary Search (Optimal)',"
);

fs.writeFileSync(corePath, coreContent, 'utf-8');
console.log('Successfully upgraded Core Registry solutions 16, 17, 23, 31');
