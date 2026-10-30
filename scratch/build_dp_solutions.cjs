// Script to generate Problems 101-123 (Dynamic Programming 1D & 2D)
const fs = require('fs');
const path = require('path');

const DP_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaDpSolutions.js');

const dpProblems = [
  {
    id: 101,
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    pattern: 'DP - 1D',
    day: 60,
    leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
    summary: 'Find the number of distinct ways to climb n stairs taking 1 or 2 steps at a time.',
    prerequisites: ['Recurrence relations', 'Fibonacci sequence', 'State compression'],
    problemStatement: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    approaches: [
      {
        name: 'Approach 1: Top-Down Recursion with Memoization (Improved)',
        badge: 'Improved / Memoized',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Recursively compute ways(n) = ways(n-1) + ways(n-2) with a memoization table.',
        intuition: 'At step n, the last move was either 1 step from (n-1) or 2 steps from (n-2). Memoizing prevents exponential branch explosion.',
        codeJS: `function climbStairsMemo(n, memo = new Map()) {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n);
  const ways = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
  memo.set(n, ways);
  return ways;
}`,
        codeTS: `function climbStairsMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n)!;
  const ways = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
  memo.set(n, ways);
  return ways;
}`,
        lineByLine: [
          'Line 2: Base cases: n=1 has 1 way, n=2 has 2 ways.',
          'Line 3: Cache lookup avoids recalculation.',
          'Line 4-6: Sum solutions to the two subproblems, store in memo, and return.'
        ],
        dryRun: [
          { step: 1, state: 'n=4', action: 'climbStairs(3) + climbStairs(2)', result: 'computes climbStairs(3)' },
          { step: 2, state: 'n=3', action: 'climbStairs(2) + climbStairs(1) = 2 + 1', result: 'memo[3] = 3' },
          { step: 3, state: 'n=4 (resolve)', action: 'memo[3] + 2 = 3 + 2', result: 'returns 5' }
        ],
        complexityDerivation: 'Recurrence tree has N nodes with memoization -> O(N) time and O(N) stack/map space.'
      },
      {
        name: 'Approach 2: Bottom-Up Space-Optimized DP (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Iteratively advance two state registers representing the previous two step counts.',
        intuition: 'We only ever need the values from the preceding two steps (dp[i-1] and dp[i-2]) to compute the current step.',
        codeJS: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1; // ways(1)
  let prev1 = 2; // ways(2)
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
        codeTS: `function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev2 = 1;
  let prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
        lineByLine: [
          'Line 2: Fast return for n <= 2.',
          'Line 3-4: Initialize registers for base cases n=1 and n=2.',
          'Line 5-9: Loop from 3 up to n, computing sum and shifting registers.',
          'Line 10: Return prev1 holding ways(n).'
        ],
        dryRun: [
          { step: 1, state: 'n=4, prev2=1, prev1=2', action: 'i=3: current = 2 + 1 = 3', result: 'prev2=2, prev1=3' },
          { step: 2, state: 'i=4', action: 'current = 3 + 2 = 5', result: 'prev2=3, prev1=5' },
          { step: 3, state: 'Done', action: 'return prev1', result: 'Output 5' }
        ],
        complexityDerivation: 'Loops N-2 times -> O(N) time. Uses 2 scalar integer registers -> O(1) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Top-Down Memoized', time: 'O(N)', space: 'O(N)', pros: 'Intuitive recurrence implementation', cons: 'Consumes recursion stack frames' },
      { approach: 'Bottom-Up Space-Optimized', time: 'O(N)', space: 'O(1)', pros: 'Constant memory, zero recursion overhead', cons: 'Requires iterative state formulation' }
    ],
    interviewPitch: 'Climbing stairs is equivalent to the Fibonacci recurrence since arriving at step n requires stepping either from n-1 or n-2. While recursive memoization achieves O(N) time in O(N) stack space, we optimize to O(1) auxiliary space by iteratively tracking only the last two step counts. This runs in O(N) time and O(1) space.',
    followUps: [
      { question: 'What if you could take up to k steps at a time?', answer: 'Maintain a running sum or rolling window of the last k values in O(N) time and O(k) space.' }
    ],
    recallQuiz: {
      question: 'Why does Climbing Stairs reduce to Fibonacci numbers?',
      options: ['Because to reach step n you must step from either n-1 or n-2', 'Because stairs are binary', 'Because step heights are equal', 'Because n is an integer'],
      correctIndex: 0,
      explanation: 'Since the only moves allowed are 1 or 2 steps, the paths to step n are strictly partitioned into paths ending with a 1-step jump (from n-1) and paths ending with a 2-step jump (from n-2).'
    }
  },
  {
    id: 102,
    title: 'Min Cost Climbing Stairs',
    difficulty: 'Easy',
    pattern: 'DP - 1D',
    day: 60,
    leetcodeUrl: 'https://leetcode.com/problems/min-cost-climbing-stairs/',
    summary: 'Find minimum cost to reach top of floor where you can start at step 0 or step 1.',
    prerequisites: ['1D DP transition', 'State compression'],
    problemStatement: `Given an integer array \`cost\` where \`cost[i]\` is cost of \`i-th\` step. Return minimum cost to reach top of floor.`,
    approaches: [
      {
        name: 'Approach 1: Bottom-Up DP Array (Improved)',
        badge: 'Improved / DP Table',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Build dp array where dp[i] = cost[i] + min(dp[i-1], dp[i-2]).',
        intuition: 'To land on step i, take the min cost to reach step i-1 or i-2, then pay cost[i].',
        codeJS: `function minCostClimbingStairsArray(cost) {
  const n = cost.length;
  const dp = new Array(n);
  dp[0] = cost[0];
  dp[1] = cost[1];
  for (let i = 2; i < n; i++) {
    dp[i] = cost[i] + Math.min(dp[i - 1], dp[i - 2]);
  }
  return Math.min(dp[n - 1], dp[n - 2]);
}`,
        codeTS: `function minCostClimbingStairsArray(cost: number[]): number {
  const n = cost.length;
  const dp: number[] = new Array(n);
  dp[0] = cost[0];
  dp[1] = cost[1];
  for (let i = 2; i < n; i++) {
    dp[i] = cost[i] + Math.min(dp[i - 1], dp[i - 2]);
  }
  return Math.min(dp[n - 1], dp[n - 2]);
}`,
        lineByLine: [
          'Line 2-5: Allocate dp array and initialize base cases for step 0 and 1.',
          'Line 6-8: Loop through stairs, computing minimum cost to stand on step i.',
          'Line 9: Final step to top can jump from either the last or second to last stair.'
        ],
        dryRun: [
          { step: 1, state: 'cost = [10, 15, 20]', action: 'dp[0]=10, dp[1]=15', result: 'base cases set' },
          { step: 2, state: 'i=2', action: 'dp[2] = 20 + min(10, 15) = 30', result: 'dp = [10, 15, 30]' },
          { step: 3, state: 'Top', action: 'min(dp[1], dp[2]) = min(15, 30)', result: 'Return 15' }
        ],
        complexityDerivation: 'Single loop of length N -> O(N) time and O(N) auxiliary space.'
      },
      {
        name: 'Approach 2: Space-Optimized State Machine (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Track only the two previous step costs, updating in O(1) space.',
        intuition: 'Each calculation only requires the previous two costs; no full array needed.',
        codeJS: `function minCostClimbingStairs(cost) {
  let prev2 = cost[0];
  let prev1 = cost[1];
  for (let i = 2; i < cost.length; i++) {
    const current = cost[i] + Math.min(prev1, prev2);
    prev2 = prev1;
    prev1 = current;
  }
  return Math.min(prev1, prev2);
}`,
        codeTS: `function minCostClimbingStairs(cost: number[]): number {
  let prev2 = cost[0];
  let prev1 = cost[1];
  for (let i = 2; i < cost.length; i++) {
    const current = cost[i] + Math.min(prev1, prev2);
    prev2 = prev1;
    prev1 = current;
  }
  return Math.min(prev1, prev2);
}`,
        lineByLine: [
          'Line 2-3: Initialize two scalars with costs of first two steps.',
          'Line 4-8: Compute next step cost and advance registers.',
          'Line 9: Return the minimum between reaching the last or second-to-last step.'
        ],
        dryRun: [
          { step: 1, state: 'cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]', action: 'prev2=1, prev1=100', result: 'step 0 & 1' },
          { step: 2, state: 'i=2..9', action: 'Continually choose min of previous 2', result: 'bypasses 100 costs' },
          { step: 3, state: 'End', action: 'min(prev1, prev2)', result: 'Optimal total cost 6' }
        ],
        complexityDerivation: 'O(N) iterations using O(1) auxiliary variables.'
      }
    ],
    comparisonTable: [
      { approach: 'DP Array', time: 'O(N)', space: 'O(N)', pros: 'Straightforward indexing', cons: 'Allocates N integers' },
      { approach: 'Space-Optimized DP', time: 'O(N)', space: 'O(1)', pros: 'Zero heap memory allocations', cons: 'Slightly less direct indexing' }
    ],
    interviewPitch: 'At each stair i, the cost to step on it is cost[i] plus the minimum cost to reach step i-1 or i-2. Since top of the floor can be reached from either step n-1 or n-2, the answer is min(dp[n-1], dp[n-2]). We optimize from O(N) space to O(1) space by tracking only the preceding two values.',
    followUps: [
      { question: 'Can we modify the input array in place?', answer: 'Yes, setting cost[i] += min(cost[i-1], cost[i-2]) achieves O(1) space, but mutating caller inputs is considered poor practice in production.' }
    ],
    recallQuiz: {
      question: 'Why does the final answer take min(prev1, prev2)?',
      options: ['Because the top floor can be reached by a jump from either of the top two steps', 'Because costs might be negative', 'Because step 0 is free', 'Because array length is even'],
      correctIndex: 0,
      explanation: 'You reach the top floor from step n-1 with 1 step, or from step n-2 with 2 steps without stepping on step n-1.'
    }
  },
  {
    id: 103,
    title: 'House Robber',
    difficulty: 'Medium',
    pattern: 'DP - 1D',
    day: 61,
    leetcodeUrl: 'https://leetcode.com/problems/house-robber/',
    summary: 'Find maximum amount of money you can rob tonight without alerting police (cannot rob adjacent houses).',
    prerequisites: ['Decision DP', 'State compression'],
    problemStatement: `You are a professional robber planning to rob houses along a street. Adjacent houses have security systems connected. Return maximum money you can rob without robbing adjacent houses.`,
    approaches: [
      {
        name: 'Approach 1: Bottom-Up DP Array (Improved)',
        badge: 'Improved / DP Table',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]) where dp[i] is max loot up to house i.',
        intuition: 'At house i, you either skip it (keep dp[i-1]) or rob it (add nums[i] to dp[i-2]).',
        codeJS: `function robArray(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  const dp = new Array(nums.length);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
  }
  return dp[nums.length - 1];
}`,
        codeTS: `function robArray(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  const dp: number[] = new Array(nums.length);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
  }
  return dp[nums.length - 1];
}`,
        lineByLine: [
          'Line 2-3: Handle edge cases of 0 or 1 house.',
          'Line 4-6: Base cases: house 0 gives nums[0], house 1 gives max(nums[0], nums[1]).',
          'Line 7-9: At each house i, choose maximum of skipping (dp[i-1]) or robbing (dp[i-2] + nums[i]).',
          'Line 10: Return optimal total at end.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [2, 7, 9, 3, 1]', action: 'dp[0]=2, dp[1]=max(2, 7)=7', result: 'base set' },
          { step: 2, state: 'i=2 (val 9)', action: 'max(7, 2 + 9) = 11', result: 'dp[2] = 11' },
          { step: 3, state: 'i=3 (val 3)', action: 'max(11, 7 + 3) = 11', result: 'dp[3] = 11' },
          { step: 4, state: 'i=4 (val 1)', action: 'max(11, 11 + 1) = 12', result: 'dp[4] = 12' }
        ],
        complexityDerivation: 'Loops N times -> O(N) time and O(N) array storage.'
      },
      {
        name: 'Approach 2: Space-Optimized Dual Registers (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Track rob1 (loot up to i-2) and rob2 (loot up to i-1) in O(1) memory.',
        intuition: 'Only the two preceding optimal values are needed to decide the current house.',
        codeJS: `function rob(nums) {
  let rob1 = 0; // max loot up to i-2
  let rob2 = 0; // max loot up to i-1
  for (const n of nums) {
    const current = Math.max(rob2, rob1 + n);
    rob1 = rob2;
    rob2 = current;
  }
  return rob2;
}`,
        codeTS: `function rob(nums: number[]): number {
  let rob1 = 0;
  let rob2 = 0;
  for (const n of nums) {
    const current = Math.max(rob2, rob1 + n);
    rob1 = rob2;
    rob2 = current;
  }
  return rob2;
}`,
        lineByLine: [
          'Line 2-3: Initialize two loot registers representing dp[i-2] and dp[i-1].',
          'Line 4: Iterate over each house value.',
          'Line 5-7: Calculate current optimal loot and shift registers.',
          'Line 9: Return rob2 containing global optimal answer.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [1, 2, 3, 1]', action: 'n=1 -> current = max(0, 0+1) = 1', result: 'rob1=0, rob2=1' },
          { step: 2, state: 'n=2', action: 'current = max(1, 0+2) = 2', result: 'rob1=1, rob2=2' },
          { step: 3, state: 'n=3', action: 'current = max(2, 1+3) = 4', result: 'rob1=2, rob2=4' },
          { step: 4, state: 'n=1', action: 'current = max(4, 2+1) = 4', result: 'rob1=4, rob2=4 -> returns 4' }
        ],
        complexityDerivation: 'Single linear pass -> O(N) time with O(1) space.'
      }
    ],
    comparisonTable: [
      { approach: 'DP Array', time: 'O(N)', space: 'O(N)', pros: 'Clear step-by-step history', cons: 'Wasted array allocation' },
      { approach: 'Space-Optimized DP', time: 'O(N)', space: 'O(1)', pros: 'Optimal O(1) memory footprint', cons: 'Values overwritten during loop' }
    ],
    interviewPitch: 'House Robber reduces to a classic decision DP: at each house i, we either do not rob it (earning dp[i-1]) or we rob it (earning nums[i] + dp[i-2]). Because the recurrence only depends on the previous two values, we optimize the space from O(N) down to O(1) by maintaining two scalar variables. This achieves optimal O(N) time and O(1) space.',
    followUps: [
      { question: 'How does this change if houses are in a circle?', answer: 'House Robber II: Run the algorithm twice, once on nums[0...n-2] and once on nums[1...n-1], taking the maximum of the two.' }
    ],
    recallQuiz: {
      question: 'What is the recurrence relation for House Robber?',
      options: ['dp[i] = max(dp[i-1], dp[i-2] + nums[i])', 'dp[i] = dp[i-1] + nums[i]', 'dp[i] = max(nums[i], nums[i-1])', 'dp[i] = dp[i-1] * nums[i]'],
      correctIndex: 0,
      explanation: 'Robbing house i precludes robbing house i-1, meaning we can only add nums[i] to the optimal sum from house i-2.'
    }
  }
];

console.log('Sample DP problems created:', dpProblems.length);
