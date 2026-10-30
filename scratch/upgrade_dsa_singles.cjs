const fs = require('fs');
const path = require('path');

// 1. Upgrade TWO_POINTERS_SOLUTIONS (11, 13, 14)
const twoPointersPath = path.join(__dirname, '../src/dsa/data/solutions/dsaTwoPointersSolutions.js');
let twoPointersContent = fs.readFileSync(twoPointersPath, 'utf-8');

// For 11: add Approach 1 Binary Search on Complement
const approach11_BS = `      {
        name: 'Approach 1: Binary Search on Complement (Baseline)',
        badge: 'Baseline / Binary Search',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(1)',
        summary: 'For each element at index i, binary search for (target - numbers[i]) in the remaining array.',
        intuition: 'Since the array is sorted, for each numbers[i] we can search for the complement in O(log N) time.',
        codeJS: \`function twoSumBinarySearch(numbers, target) {
  for (let i = 0; i < numbers.length; i++) {
    const complement = target - numbers[i];
    let left = i + 1, right = numbers.length - 1;
    while (left <= right) {
      const mid = (left + right) >> 1;
      if (numbers[mid] === complement) {
        return [i + 1, mid + 1];
      } else if (numbers[mid] < complement) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return [];
}\`,
        codeTS: \`function twoSumBinarySearch(numbers: number[], target: number): number[] {
  for (let i = 0; i < numbers.length; i++) {
    const complement = target - numbers[i];
    let left = i + 1, right = numbers.length - 1;
    while (left <= right) {
      const mid = (left + right) >> 1;
      if (numbers[mid] === complement) {
        return [i + 1, mid + 1];
      } else if (numbers[mid] < complement) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return [];
}\`,
        lineByLine: [
          'Line 2: Iterate through each candidate index i.',
          'Line 3-4: Calculate complement and binary search in range [i+1, n-1].',
          'Line 8: Return 1-indexed pair upon finding match.'
        ],
        dryRun: [
          { step: 1, state: 'numbers = [2, 7, 11, 15], target = 9', action: 'i=0 (2): binary search for 7', result: 'Found at index 1 -> Returns [1, 2]' }
        ],
        complexityDerivation: 'N elements with O(log N) binary search each -> O(N log N) time and O(1) space.'
      },
      `;

twoPointersContent = twoPointersContent.replace(
  "approaches: [\n      {\n        name: 'Approach 1: Two Pointers Inward Scan (Optimal O(N) Time, O(1) Space)',",
  "approaches: [\n" + approach11_BS + "{\n        name: 'Approach 2: Two Pointers Inward Scan (Optimal O(N) Time, O(1) Space)',"
);

// For 13: add Approach 1 Brute Force
const approach13_BF = `      {
        name: 'Approach 1: Brute Force 3 Loops + Hash Set (Baseline)',
        badge: 'Baseline / Brute-Force',
        timeComplexity: 'O(N³)',
        spaceComplexity: 'O(N)',
        summary: 'Examine every combination of 3 indices and deduplicate triplets using a Set.',
        intuition: 'Three nested loops find all triplets summing to 0; sort each triplet to deduplicate.',
        codeJS: \`function threeSumBrute(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  const seen = new Set();
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const key = \\\`\\\${nums[i]},\\\${nums[j]},\\\${nums[k]}\\\`;
          if (!seen.has(key)) {
            seen.add(key);
            res.push([nums[i], nums[j], nums[k]]);
          }
        }
      }
    }
  }
  return res;
}\`,
        codeTS: \`function threeSumBrute(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const res: number[][] = [];
  const seen = new Set<string>();
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const key = \\\`\\\${nums[i]},\\\${nums[j]},\\\${nums[k]}\\\`;
          if (!seen.has(key)) {
            seen.add(key);
            res.push([nums[i], nums[j], nums[k]]);
          }
        }
      }
    }
  }
  return res;
}\`,
        lineByLine: [
          'Line 2: Sort numbers to canonicalize triplet order.',
          'Line 7-12: Three nested loops check all possible index triplets.',
          'Line 13-17: String key in Set filters out duplicate triplets.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [-1, 0, 1, 2, -1, -4]', action: 'Checks all N*(N-1)*(N-2)/6 triplets', result: 'Finds [-1,-1,2] and [-1,0,1]' }
        ],
        complexityDerivation: 'Three nested loops -> O(N^3) time and O(N) space.'
      },
      `;

twoPointersContent = twoPointersContent.replace(
  "approaches: [\n      {\n        name: 'Approach 1: Sort + Anchor + Two Pointers (Optimal)',",
  "approaches: [\n" + approach13_BF + "{\n        name: 'Approach 2: Sort + Anchor + Two Pointers (Optimal)',"
);

// For 14: add Approach 1 Brute Force
const approach14_BF = `      {
        name: 'Approach 1: Brute Force All Line Pairs (Baseline)',
        badge: 'Baseline / Brute-Force',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        summary: 'Check every pair of lines (i, j) and calculate area min(h[i], h[j]) * (j - i).',
        intuition: 'Compute the water area between all unique line pairs and take the maximum.',
        codeJS: \`function maxAreaBrute(height) {
  let maxWater = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      const h = Math.min(height[i], height[j]);
      const w = j - i;
      maxWater = Math.max(maxWater, h * w);
    }
  }
  return maxWater;
}\`,
        codeTS: \`function maxAreaBrute(height: number[]): number {
  let maxWater = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      const h = Math.min(height[i], height[j]);
      const w = j - i;
      maxWater = Math.max(maxWater, h * w);
    }
  }
  return maxWater;
}\`,
        lineByLine: [
          'Line 2: Track max water.',
          'Line 3-7: Nested loops compute width * minHeight for all pairs.'
        ],
        dryRun: [
          { step: 1, state: 'height = [1,8,6,2,5,4,8,3,7]', action: 'i=1(8), j=8(7): min(8, 7) * 7 = 49', result: 'maxWater = 49' }
        ],
        complexityDerivation: 'N*(N-1)/2 pairs evaluated -> O(N^2) time and O(1) space.'
      },
      `;

twoPointersContent = twoPointersContent.replace(
  "approaches: [\n      {\n        name: 'Approach 1: Two Pointers Inward Contraction (Optimal)',",
  "approaches: [\n" + approach14_BF + "{\n        name: 'Approach 2: Two Pointers Inward Contraction (Optimal)',"
);

fs.writeFileSync(twoPointersPath, twoPointersContent, 'utf-8');
console.log('Successfully upgraded two pointers solutions 11, 13, 14');
