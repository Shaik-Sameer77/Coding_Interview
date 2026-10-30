const fs = require('fs');
const path = require('path');

// 1. Fix 14 in dsaTwoPointersSolutions.js
const twoPointersPath = path.join(__dirname, '../src/dsa/data/solutions/dsaTwoPointersSolutions.js');
let twoPointersContent = fs.readFileSync(twoPointersPath, 'utf-8');

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
  "approaches: [\n      {\n        name: 'Approach 1: Two Pointers Greedy Elimination (Optimal)',",
  "approaches: [\n" + approach14_BF + "{\n        name: 'Approach 2: Two Pointers Greedy Elimination (Optimal)',"
);
fs.writeFileSync(twoPointersPath, twoPointersContent, 'utf-8');
console.log('Fixed Problem 14 in Two Pointers');

// 2. Fix 31 in dsaCoreRegistrySolutions.js
const corePath = path.join(__dirname, '../src/dsa/data/solutions/dsaCoreRegistrySolutions.js');
let coreContent = fs.readFileSync(corePath, 'utf-8');

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
  "approaches: [\n      {\n        name: 'Approach 1: Classic Iterative Binary Search (Optimal)',",
  "approaches: [\n" + approach31_Linear + "{\n        name: 'Approach 2: Classic Iterative Binary Search (Optimal)',"
);
fs.writeFileSync(corePath, coreContent, 'utf-8');
console.log('Fixed Problem 31 in Core Registry');
