const fs = require('fs');
const path = require('path');

const animPath = path.join(__dirname, '../src/dsa/utils/dsaAnimationGenerators.js');
let content = fs.readFileSync(animPath, 'utf-8');

const newGenerators = `// -------------------------------------------------------------
// 12. DYNAMIC PROGRAMMING - 1D TABLE (Coin Change / Climbing Stairs)
// -------------------------------------------------------------
export function generateDp1DSteps(amount = 7, coins = [1, 3, 4]) {
  const codeSnippet = [
    'function coinChange(coins, amount) {',
    '  const dp = new Array(amount + 1).fill(Infinity);',
    '  dp[0] = 0; // Base case: 0 coins for amount 0',
    '  for (let i = 1; i <= amount; i++) {',
    '    for (const c of coins) {',
    '      if (i - c >= 0) {',
    '        dp[i] = Math.min(dp[i], 1 + dp[i - c]);',
    '      }',
    '    }',
    '  }',
    '  return dp[amount] === Infinity ? -1 : dp[amount];',
    '}'
  ].join('\\n');

  const dp = new Array(amount + 1).fill('∞');
  dp[0] = 0;
  const steps = [];

  steps.push({
    stepIndex: 0,
    codeLine: 3,
    explanation: \`Initialize DP table of size \${amount + 1}. Base case: dp[0] = 0 (0 coins needed for amount 0). All other states initialized to infinity.\`,
    array: [...dp],
    arrayLabel: 'dp[amount]',
    pointers: [{ name: 'BASE', index: 0, color: '#10b981', position: 'top' }],
    elementStates: { 0: 'matched' },
    variables: [{ name: 'coins', value: coins.join(', ') }, { name: 'target', value: amount }],
    isComplete: false
  });

  for (let i = 1; i <= amount; i++) {
    let minCoins = Infinity;
    for (const c of coins) {
      if (i - c >= 0 && dp[i - c] !== '∞') {
        const candidate = 1 + Number(dp[i - c]);
        minCoins = Math.min(minCoins, candidate);
      }
    }
    dp[i] = minCoins === Infinity ? '∞' : minCoins;

    steps.push({
      stepIndex: steps.length,
      codeLine: 7,
      explanation: \`Computing dp[\${i}]: Testing coins [\${coins.join(', ')}]. Optimal choice yields \${dp[i]} coin(s).\`,
      array: [...dp],
      arrayLabel: 'dp[amount]',
      pointers: [{ name: \`i=\${i}\`, index: i, color: '#38bdf8', position: 'top' }],
      elementStates: { [i]: 'active' },
      variables: [{ name: 'current amount', value: i }, { name: 'min coins', value: dp[i] }],
      isComplete: i === amount,
      isSuccess: i === amount
    });
  }

  return { title: 'Dynamic Programming (1D Bottom-Up Table Transition)', codeSnippet, steps };
}

// -------------------------------------------------------------
// 13. GREEDY - KADANE\'S MAXIMUM SUBARRAY
// -------------------------------------------------------------
export function generateKadaneSteps(inputNums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]) {
  const nums = Array.isArray(inputNums) && inputNums.length > 0 ? inputNums : [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  const codeSnippet = [
    'function maxSubArray(nums) {',
    '  let maxSum = nums[0];',
    '  let curSum = 0;',
    '  for (let i = 0; i < nums.length; i++) {',
    '    if (curSum < 0) curSum = 0; // Discard negative prefix',
    '    curSum += nums[i];',
    '    maxSum = Math.max(maxSum, curSum);',
    '  }',
    '  return maxSum;',
    '}'
  ].join('\\n');

  let maxSum = nums[0];
  let curSum = 0;
  const steps = [];

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: \`Initialize Kadane's algorithm. maxSum = nums[0] = \${nums[0]}, curSum = 0.\`,
    array: [...nums],
    arrayLabel: 'nums',
    pointers: [{ name: 'START', index: 0, color: '#38bdf8', position: 'top' }],
    elementStates: { 0: 'active' },
    variables: [{ name: 'curSum', value: 0 }, { name: 'maxSum', value: maxSum }],
    isComplete: false
  });

  for (let i = 0; i < nums.length; i++) {
    const dropped = curSum < 0;
    if (curSum < 0) curSum = 0;
    curSum += nums[i];
    const isNewMax = curSum > maxSum;
    maxSum = Math.max(maxSum, curSum);

    steps.push({
      stepIndex: steps.length,
      codeLine: isNewMax ? 7 : (dropped ? 5 : 6),
      explanation: \`Index \${i} (value \${nums[i]}): \${dropped ? 'Discarded negative prefix. ' : ''}curSum = \${curSum}. \${isNewMax ? \`🎉 New global maximum: \${maxSum}!\` : \`maxSum remains \${maxSum}.\`}\`,
      array: [...nums],
      arrayLabel: 'nums',
      pointers: [{ name: 'i', index: i, color: isNewMax ? '#10b981' : '#f59e0b', position: 'top' }],
      elementStates: { [i]: isNewMax ? 'matched' : (curSum >= 0 ? 'active' : 'comparing') },
      variables: [{ name: 'curSum', value: curSum }, { name: 'maxSum', value: maxSum }],
      isComplete: i === nums.length - 1,
      isSuccess: i === nums.length - 1
    });
  }

  return { title: 'Greedy - Kadane\\'s Algorithm (O(N) Maximum Subarray)', codeSnippet, steps };
}

// -------------------------------------------------------------
// 14. INTERVALS - MERGE INTERVALS
// -------------------------------------------------------------
export function generateMergeIntervalsSteps(inputIntervals = [[1, 3], [2, 6], [8, 10], [15, 18]]) {
  const intervals = Array.isArray(inputIntervals) && inputIntervals.length > 0 ? inputIntervals : [[1, 3], [2, 6], [8, 10], [15, 18]];
  const codeSnippet = [
    'function merge(intervals) {',
    '  intervals.sort((a, b) => a[0] - b[0]);',
    '  const res = [intervals[0]];',
    '  for (let i = 1; i < intervals.length; i++) {',
    '    const last = res[res.length - 1];',
    '    if (intervals[i][0] <= last[1]) {',
    '      last[1] = Math.max(last[1], intervals[i][1]); // Overlap: extend end',
    '    } else {',
    '      res.push(intervals[i]); // Disjoint: push new',
    '    }',
    '  }',
    '  return res;',
    '}'
  ].join('\\n');

  const formatted = intervals.map(p => \`[\${p[0]},\${p[1]}]\`);
  const steps = [];

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: 'Sort intervals by start time. Initialize merged output with the first interval.',
    array: [...formatted],
    arrayLabel: 'intervals',
    pointers: [{ name: 'FIRST', index: 0, color: '#10b981', position: 'top' }],
    elementStates: { 0: 'matched' },
    variables: [{ name: 'merged so far', value: formatted[0] }],
    isComplete: false
  });

  const merged = [[...intervals[0]]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const cur = intervals[i];
    const overlaps = cur[0] <= last[1];

    if (overlaps) {
      last[1] = Math.max(last[1], cur[1]);
    } else {
      merged.push([...cur]);
    }

    steps.push({
      stepIndex: steps.length,
      codeLine: overlaps ? 7 : 9,
      explanation: \`Inspecting interval [\${cur[0]}, \${cur[1]}]. \${overlaps ? \`Overlaps with [\${last[0]}, \${last[1]}]! Merge and extend end to \${last[1]}.\` : \`Disjoint from previous. Add as new interval.\`}\`,
      array: [...formatted],
      arrayLabel: 'intervals',
      pointers: [{ name: 'cur', index: i, color: overlaps ? '#10b981' : '#38bdf8', position: 'top' }],
      elementStates: { [i]: overlaps ? 'matched' : 'active' },
      variables: [{ name: 'merged list', value: merged.map(m => \`[\${m[0]},\${m[1]}]\`).join(' ') }],
      isComplete: i === intervals.length - 1,
      isSuccess: i === intervals.length - 1
    });
  }

  return { title: 'Intervals - Merge Overlapping Intervals (O(N log N))', codeSnippet, steps };
}

// -------------------------------------------------------------
// 15. BIT MANIPULATION - SINGLE NUMBER (XOR CANCELLATION)
// -------------------------------------------------------------
export function generateSingleNumberSteps(inputNums = [4, 1, 2, 1, 2]) {
  const nums = Array.isArray(inputNums) && inputNums.length > 0 ? inputNums : [4, 1, 2, 1, 2];
  const codeSnippet = [
    'function singleNumber(nums) {',
    '  let res = 0;',
    '  for (const num of nums) {',
    '    res ^= num; // Bitwise XOR cancellation: x ^ x = 0',
    '  }',
    '  return res;',
    '}'
  ].join('\\n');

  let res = 0;
  const steps = [];

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: 'Initialize XOR accumulator res = 0. We will exploit x ^ x = 0 and x ^ 0 = x.',
    array: [...nums],
    arrayLabel: 'nums',
    pointers: [{ name: 'START', index: 0, color: '#38bdf8', position: 'top' }],
    elementStates: {},
    variables: [{ name: 'res (binary)', value: '0b0000' }, { name: 'res (decimal)', value: 0 }],
    isComplete: false
  });

  for (let i = 0; i < nums.length; i++) {
    const prev = res;
    res ^= nums[i];

    steps.push({
      stepIndex: steps.length,
      codeLine: 4,
      explanation: \`Step \${i + 1}: \${prev} ^ \${nums[i]} = \${res} (binary: 0b\${(res >>> 0).toString(2).padStart(4, '0')}).\`,
      array: [...nums],
      arrayLabel: 'nums',
      pointers: [{ name: 'i', index: i, color: '#10b981', position: 'top' }],
      elementStates: { [i]: 'active' },
      variables: [{ name: 'current num', value: nums[i] }, { name: 'res (decimal)', value: res }],
      isComplete: i === nums.length - 1,
      isSuccess: i === nums.length - 1
    });
  }

  return { title: 'Bit Manipulation - XOR Cancellation (O(N) Time, O(1) Space)', codeSnippet, steps };
}
`;

// Insert before getAnimationForProblem
content = content.replace(
  '// -------------------------------------------------------------\n// MASTER ANIMATION ROUTER FOR ALL PROBLEMS AND PATTERNS\n// -------------------------------------------------------------',
  newGenerators + '\n// -------------------------------------------------------------\n// MASTER ANIMATION ROUTER FOR ALL PROBLEMS AND PATTERNS\n// -------------------------------------------------------------'
);

// Update getAnimationForProblem router
const routerReplacement = `    case 39:
    case 40:
    case 41:
      return generateReverseListSteps(customInputs.array || [1, 2, 3, 4, 5]);
    case 101:
    case 102:
    case 108:
      return generateDp1DSteps(customInputs.amount || 7, customInputs.coins || [1, 3, 4]);
    case 124:
      return generateKadaneSteps(customInputs.array || [-2, 1, -3, 4, -1, 2, 1, -5, 4]);
    case 132:
    case 133:
      return generateMergeIntervalsSteps(customInputs.intervals || [[1, 3], [2, 6], [8, 10], [15, 18]]);
    case 144:
    case 148:
      return generateSingleNumberSteps(customInputs.array || [4, 1, 2, 1, 2]);
    default:
      // Pattern-based fallback
      if (customInputs.pattern === 'DP - 1D' || customInputs.pattern === 'DP - 2D' || customInputs.pattern === 'dynamic-programming') {
        return generateDp1DSteps(customInputs.amount || 7, customInputs.coins || [1, 3, 4]);
      }
      if (customInputs.pattern === 'Greedy' || customInputs.pattern === 'greedy') {
        return generateKadaneSteps(customInputs.array || [-2, 1, -3, 4, -1, 2, 1, -5, 4]);
      }
      if (customInputs.pattern === 'Intervals' || customInputs.pattern === 'intervals') {
        return generateMergeIntervalsSteps(customInputs.intervals || [[1, 3], [2, 6], [8, 10], [15, 18]]);
      }
      if (customInputs.pattern === 'Bit Manipulation' || customInputs.pattern === 'bit-manipulation') {
        return generateSingleNumberSteps(customInputs.array || [4, 1, 2, 1, 2]);
      }`;

content = content.replace(
  `    case 39:
    case 40:
    case 41:
      return generateReverseListSteps(customInputs.array || [1, 2, 3, 4, 5]);
    default:`,
  routerReplacement + '\n    default:'
);

fs.writeFileSync(animPath, content, 'utf-8');
console.log('Successfully injected DP, Kadane, Intervals, and Bitwise animation generators into dsaAnimationGenerators.js');
