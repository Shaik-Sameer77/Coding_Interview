// DP Solutions Part 1: Problems 101 to 108
module.exports = {
  101: {
    id: 101,
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    pattern: 'DP - 1D',
    day: 60,
    leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
    summary: 'Find how many distinct ways you can climb n stairs taking 1 or 2 steps at a time.',
    prerequisites: ['Fibonacci recurrence', 'State compression from O(N) to O(1)'],
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
  let prev2 = 1;
  let prev1 = 2;
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
      { approach: 'Top-Down Memoized', time: 'O(N)', space: 'O(N)', pros: 'Intuitive recurrence', cons: 'Recursion call stack frames' },
      { approach: 'Bottom-Up Space-Optimized', time: 'O(N)', space: 'O(1)', pros: 'Optimal constant memory', cons: 'State variables only' }
    ],
    interviewPitch: 'Climbing stairs maps directly to the Fibonacci recurrence since arriving at step n requires stepping from either n-1 or n-2. While memoized recursion achieves O(N) time in O(N) stack space, we optimize to O(1) space by tracking only the preceding two step totals. This executes in O(N) time and O(1) memory.',
    followUps: [{ question: 'What if you could take up to k steps?', answer: 'Maintain a running sliding window sum of the previous k step totals in O(N) time and O(k) space.' }],
    recallQuiz: {
      question: 'Why does Climbing Stairs reduce to Fibonacci numbers?',
      options: ['Because to reach step n you must step from either n-1 or n-2', 'Because stairs are binary', 'Because step heights are equal', 'Because n is an integer'],
      correctIndex: 0,
      explanation: 'Since the only moves allowed are 1 or 2 steps, paths to step n strictly partition into paths ending with a 1-step jump and paths ending with a 2-step jump.'
    }
  },

  102: {
    id: 102,
    title: 'Min Cost Climbing Stairs',
    difficulty: 'Easy',
    pattern: 'DP - 1D',
    day: 60,
    leetcodeUrl: 'https://leetcode.com/problems/min-cost-climbing-stairs/',
    summary: 'Find the minimum cost to reach the top floor where you can start at step 0 or step 1.',
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
      { approach: 'DP Array', time: 'O(N)', space: 'O(N)', pros: 'Direct indexing', cons: 'Allocates N array items' },
      { approach: 'Space-Optimized DP', time: 'O(N)', space: 'O(1)', pros: 'Zero heap memory allocations', cons: 'Overwrites variables' }
    ],
    interviewPitch: 'At each stair i, the cost to step on it is cost[i] plus the minimum cost to reach step i-1 or i-2. Since the top floor can be reached from either step n-1 or n-2, the answer is min(dp[n-1], dp[n-2]). We optimize from O(N) space to O(1) space by tracking only the preceding two values.',
    followUps: [{ question: 'Can we modify cost in place?', answer: 'Yes, setting cost[i] += min(cost[i-1], cost[i-2]) achieves O(1) space, but mutating caller inputs is considered poor practice in production.' }],
    recallQuiz: {
      question: 'Why does the final answer take min(prev1, prev2)?',
      options: ['Because the top floor can be reached by a jump from either of the top two steps', 'Because costs might be negative', 'Because step 0 is free', 'Because array length is even'],
      correctIndex: 0,
      explanation: 'You reach the top floor from step n-1 with 1 step, or from step n-2 with 2 steps without stepping on step n-1.'
    }
  },

  103: {
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
  let rob1 = 0;
  let rob2 = 0;
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
    followUps: [{ question: 'How does this change if houses are in a circle?', answer: 'House Robber II: Run the algorithm twice, once on nums[0...n-2] and once on nums[1...n-1], taking the maximum of the two.' }],
    recallQuiz: {
      question: 'What is the recurrence relation for House Robber?',
      options: ['dp[i] = max(dp[i-1], dp[i-2] + nums[i])', 'dp[i] = dp[i-1] + nums[i]', 'dp[i] = max(nums[i], nums[i-1])', 'dp[i] = dp[i-1] * nums[i]'],
      correctIndex: 0,
      explanation: 'Robbing house i precludes robbing house i-1, meaning we can only add nums[i] to the optimal sum from house i-2.'
    }
  },

  104: {
    id: 104,
    title: 'House Robber II',
    difficulty: 'Medium',
    pattern: 'DP - 1D',
    day: 61,
    leetcodeUrl: 'https://leetcode.com/problems/house-robber-ii/',
    summary: 'Houses are arranged in a circle; first house is neighbor to last. Find maximum loot.',
    prerequisites: ['House Robber I', 'Circular array decomposition'],
    problemStatement: `Houses are arranged in a circle. You cannot rob adjacent houses. Return maximum amount of money you can rob.`,
    approaches: [
      {
        name: 'Approach 1: Slice and Run Linear Robber Twice (Improved)',
        badge: 'Improved / Array Slice',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Rob either nums[0...n-2] or nums[1...n-1] by slicing the array.',
        intuition: 'Since house 0 and house n-1 cannot both be robbed, the optimal answer is max(rob(nums[0..n-2]), rob(nums[1..n-1])).',
        codeJS: `function rob2Slice(nums) {
  if (nums.length === 1) return nums[0];
  const linearRob = (arr) => {
    let r1 = 0, r2 = 0;
    for (const n of arr) {
      const c = Math.max(r2, r1 + n);
      r1 = r2;
      r2 = c;
    }
    return r2;
  };
  return Math.max(linearRob(nums.slice(0, -1)), linearRob(nums.slice(1)));
}`,
        codeTS: `function rob2Slice(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  const linearRob = (arr: number[]): number => {
    let r1 = 0, r2 = 0;
    for (const n of arr) {
      const c = Math.max(r2, r1 + n);
      r1 = r2;
      r2 = c;
    }
    return r2;
  };
  return Math.max(linearRob(nums.slice(0, -1)), linearRob(nums.slice(1)));
}`,
        lineByLine: [
          'Line 2: Single house base case returns its value.',
          'Line 3-10: Linear robber helper using O(1) registers.',
          'Line 11: Call helper on slice without last house, and slice without first house, returning max.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [2, 3, 2]', action: 'slice 1: [2, 3] -> rob=3', result: 'case 1' },
          { step: 2, state: 'slice 2: [3, 2] -> rob=3', action: 'max(3, 3)', result: 'returns 3' }
        ],
        complexityDerivation: 'Linear helper runs twice on N-1 elements -> O(N) time. Slices allocate O(N) memory.'
      },
      {
        name: 'Approach 2: In-Place Index Range Robber (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Run linear robber across index bounds [start, end] without allocating slice arrays.',
        intuition: 'Avoid creating slice arrays in V8 memory by passing boundary indices start and end.',
        codeJS: `function rob(nums) {
  const n = nums.length;
  if (n === 1) return nums[0];
  const robRange = (start, end) => {
    let rob1 = 0;
    let rob2 = 0;
    for (let i = start; i <= end; i++) {
      const current = Math.max(rob2, rob1 + nums[i]);
      rob1 = rob2;
      rob2 = current;
    }
    return rob2;
  };
  return Math.max(robRange(0, n - 2), robRange(1, n - 1));
}`,
        codeTS: `function rob(nums: number[]): number {
  const n = nums.length;
  if (n === 1) return nums[0];
  const robRange = (start: number, end: number): number => {
    let rob1 = 0;
    let rob2 = 0;
    for (let i = start; i <= end; i++) {
      const current = Math.max(rob2, rob1 + nums[i]);
      rob1 = rob2;
      rob2 = current;
    }
    return rob2;
  };
  return Math.max(robRange(0, n - 2), robRange(1, n - 1));
}`,
        lineByLine: [
          'Line 2-3: Handle n === 1 edge case.',
          'Line 4-13: robRange iterates strictly from index start to end.',
          'Line 14: Evaluate ranges [0, n-2] and [1, n-1] in O(1) space and return max.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [1, 2, 3, 1]', action: 'Range [0, 2]: [1, 2, 3] -> rob = 4', result: 'skip last' },
          { step: 2, state: 'Range [1, 3]: [2, 3, 1] -> rob = 3', action: 'skip first', result: 'rob = 3' },
          { step: 3, state: 'Max(4, 3)', action: 'returns 4', result: 'Optimal total 4' }
        ],
        complexityDerivation: 'Two linear scans of length N -> 2N = O(N) time with strictly O(1) auxiliary space.'
      }
    ],
    comparisonTable: [
      { approach: 'Slice & Rob', time: 'O(N)', space: 'O(N)', pros: 'Quick to write', cons: 'Allocates two slice arrays in memory' },
      { approach: 'Index-Bounded In-Place', time: 'O(N)', space: 'O(1)', pros: 'Optimal zero-allocation runtime', cons: 'Requires index boundary parameters' }
    ],
    interviewPitch: 'In House Robber II, the circular layout means house 0 and house n-1 are adjacent and cannot both be robbed. This mutually exclusive constraint naturally splits the problem into two linear House Robber subproblems: robbing houses [0...n-2] and robbing houses [1...n-1]. We run our linear O(1) space solver over both index ranges and return the maximum, achieving O(N) time and O(1) auxiliary space.',
    followUps: [{ question: 'What if array has length 1?', answer: 'Return nums[0] immediately since no circular conflict exists for a single house.' }],
    recallQuiz: {
      question: 'Why does running House Robber I on [0, n-2] and [1, n-1] cover all valid circular options?',
      options: ['Because any valid circular selection can either omit the last house, omit the first house, or omit both', 'Because houses have positive values', 'Because circle has even vertices', 'Because of modular arithmetic'],
      correctIndex: 0,
      explanation: 'Since house 0 and house n-1 cannot both be included, every valid subset must either exclude house 0, exclude house n-1, or exclude both. Taking the max of both ranges is therefore exhaustive.'
    }
  },

  105: {
    id: 105,
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    pattern: 'DP - 1D',
    day: 62,
    leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/',
    summary: 'Find the longest palindromic substring in a given string s.',
    prerequisites: ['Palindrome center expansion', '2D DP table vs Two Pointers'],
    problemStatement: `Given a string \`s\`, return the longest palindromic substring in \`s\`.`,
    approaches: [
      {
        name: 'Approach 1: 2D Dynamic Programming Table (Improved)',
        badge: 'Improved / 2D DP',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(N²)',
        summary: 'dp[i][j] is true if s[i...j] is palindrome, derived from dp[i+1][j-1] and s[i] === s[j].',
        intuition: 'A substring s[i...j] is a palindrome if outer characters match and inner substring s[i+1...j-1] is already a palindrome.',
        codeJS: `function longestPalindromeDP(s) {
  const n = s.length;
  if (n <= 1) return s;
  const dp = Array.from({ length: n }, () => new Array(n).fill(false));
  let start = 0, maxLen = 1;

  for (let i = 0; i < n; i++) dp[i][i] = true;

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) {
        if (len === 2 || dp[i + 1][j - 1]) {
          dp[i][j] = true;
          if (len > maxLen) {
            start = i;
            maxLen = len;
          }
        }
      }
    }
  }
  return s.substring(start, start + maxLen);
}`,
        codeTS: `function longestPalindromeDP(s: string): string {
  const n = s.length;
  if (n <= 1) return s;
  const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  let start = 0, maxLen = 1;

  for (let i = 0; i < n; i++) dp[i][i] = true;

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) {
        if (len === 2 || dp[i + 1][j - 1]) {
          dp[i][j] = true;
          if (len > maxLen) {
            start = i;
            maxLen = len;
          }
        }
      }
    }
  }
  return s.substring(start, start + maxLen);
}`,
        lineByLine: [
          'Line 4: Allocate N x N boolean matrix initialized to false.',
          'Line 7: Base case: all 1-character substrings are palindromes.',
          'Line 9-19: Iterate substring length from 2 to N, updating dp table and tracking maxLen.'
        ],
        dryRun: [
          { step: 1, state: 's = "babad"', action: 'len=1: all true', result: 'maxLen=1' },
          { step: 2, state: 'len=3: i=0(b), j=2(b)', action: 's[0]===s[2] && dp[1][1]=true', result: 'dp[0][2]=true, maxLen=3 ("bab")' },
          { step: 3, state: 'len=3: i=1(a), j=3(a)', action: 's[1]===s[3] && dp[2][2]=true', result: 'dp[1][3]=true, "aba"' }
        ],
        complexityDerivation: 'Fills upper triangle of N x N matrix -> O(N^2) time and O(N^2) auxiliary memory.'
      },
      {
        name: 'Approach 2: Expand Around Centers (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        summary: 'Expand outward from 2N-1 centers (odd and even length palindromes) in O(1) auxiliary space.',
        intuition: 'Every palindrome mirrors around its center. There are N single-character centers (odd) and N-1 between-character centers (even).',
        codeJS: `function longestPalindrome(s) {
  if (s.length <= 1) return s;
  let start = 0;
  let maxLen = 1;

  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      const len = r - l + 1;
      if (len > maxLen) {
        start = l;
        maxLen = len;
      }
      l--;
      r++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    expand(i, i);     // Odd length
    expand(i, i + 1); // Even length
  }

  return s.substring(start, start + maxLen);
}`,
        codeTS: `function longestPalindrome(s: string): string {
  if (s.length <= 1) return s;
  let start = 0;
  let maxLen = 1;

  function expand(l: number, r: number): void {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      const len = r - l + 1;
      if (len > maxLen) {
        start = l;
        maxLen = len;
      }
      l--;
      r++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }

  return s.substring(start, start + maxLen);
}`,
        lineByLine: [
          'Line 2: Fast return for strings of length <= 1.',
          'Line 6-15: expand helper widens pointers l and r outward while characters match.',
          'Line 18-20: Test all 2N-1 centers: expand(i, i) for odd and expand(i, i+1) for even.',
          'Line 23: Return substring defined by start and maxLen.'
        ],
        dryRun: [
          { step: 1, state: 's = "babad", i=0', action: 'expand(0,0): "b"', result: 'maxLen=1' },
          { step: 2, state: 'i=1', action: 'expand(1,1): "bab"', result: 'start=0, maxLen=3' },
          { step: 3, state: 'i=2', action: 'expand(2,2): "aba"', result: 'len=3' },
          { step: 4, state: 'Done', action: 's.substring(0, 3)', result: '"bab"' }
        ],
        complexityDerivation: '2N centers, each expanding at most N/2 times -> O(N^2) time. Stores only integer registers -> O(1) space.'
      }
    ],
    comparisonTable: [
      { approach: '2D DP Table', time: 'O(N²)', space: 'O(N²)', pros: 'Exhaustive table for all substring queries', cons: 'O(N^2) heap allocations' },
      { approach: 'Expand Around Centers', time: 'O(N²)', space: 'O(1)', pros: 'Optimal O(1) space, excellent cache locality', cons: 'Quadratic worst-case time' }
    ],
    interviewPitch: 'While the 2D DP table approach checks palindromic substrings in O(N^2) time and O(N^2) space, we can eliminate all auxiliary memory by expanding around centers. Every palindrome mirrors around either an odd center (a single character) or an even center (between two characters). By testing all 2N - 1 centers and expanding outward while characters match, we find the longest palindrome in O(N^2) time and O(1) space.',
    followUps: [{ question: 'Can this be solved in O(N) linear time?', answer: 'Yes, Manachers Algorithm solves Longest Palindromic Substring in strictly O(N) time and O(N) space using mirror symmetry.' }],
    recallQuiz: {
      question: 'How many possible palindrome centers exist in a string of length N?',
      options: ['2N - 1 (N single-char odd centers and N-1 between-char even centers)', 'N centers', 'N^2 centers', 'N/2 centers'],
      correctIndex: 0,
      explanation: 'There are N characters (odd length centers) and N-1 pairs of adjacent characters (even length centers), totaling 2N - 1 centers.'
    }
  },

  106: {
    id: 106,
    title: 'Palindromic Substrings',
    difficulty: 'Medium',
    pattern: 'DP - 1D',
    day: 62,
    leetcodeUrl: 'https://leetcode.com/problems/palindromic-substrings/',
    summary: 'Given a string s, return the number of palindromic substrings in it.',
    prerequisites: ['Palindrome center expansion', 'Counting substrings'],
    problemStatement: `Given a string \`s\`, return the number of palindromic substrings in it. A substring is a contiguous sequence of characters within the string.`,
    approaches: [
      {
        name: 'Approach 1: 2D Dynamic Programming Table (Improved)',
        badge: 'Improved / 2D DP',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(N²)',
        summary: 'Build dp[i][j] boolean table; count whenever dp[i][j] is true.',
        intuition: 's[i...j] is a palindrome if s[i] === s[j] and inner s[i+1...j-1] is a palindrome.',
        codeJS: `function countSubstringsDP(s) {
  const n = s.length;
  let count = 0;
  const dp = Array.from({ length: n }, () => new Array(n).fill(false));

  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      if (s[i] === s[j] && (j - i <= 2 || dp[i + 1][j - 1])) {
        dp[i][j] = true;
        count++;
      }
    }
  }
  return count;
}`,
        codeTS: `function countSubstringsDP(s: string): number {
  const n = s.length;
  let count = 0;
  const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));

  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      if (s[i] === s[j] && (j - i <= 2 || dp[i + 1][j - 1])) {
        dp[i][j] = true;
        count++;
      }
    }
  }
  return count;
}`,
        lineByLine: [
          'Line 4: Allocate N x N matrix.',
          'Line 6-12: Bottom-up iteration ensures dp[i+1][j-1] is computed before dp[i][j].',
          'Line 9: If valid palindrome, mark true and increment count.',
          'Line 14: Return total count.'
        ],
        dryRun: [
          { step: 1, state: 's = "abc"', action: 'diag i=j (a, b, c)', result: 'count = 3' },
          { step: 2, state: 'len 2: "ab", "bc"', action: 'mismatch', result: 'count = 3' },
          { step: 3, state: 'len 3: "abc"', action: 'mismatch', result: 'Final count 3' }
        ],
        complexityDerivation: 'Evaluates N(N+1)/2 substrings -> O(N^2) time and O(N^2) auxiliary matrix.'
      },
      {
        name: 'Approach 2: Expand Around Centers Counting (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        summary: 'Count expanding palindromes from each of the 2N-1 centers using O(1) space.',
        intuition: 'Each valid outward step from a center represents one unique palindromic substring.',
        codeJS: `function countSubstrings(s) {
  let count = 0;

  function countPalindromes(l, r) {
    let subCount = 0;
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      subCount++;
      l--;
      r++;
    }
    return subCount;
  }

  for (let i = 0; i < s.length; i++) {
    count += countPalindromes(i, i);     // Odd length centers
    count += countPalindromes(i, i + 1); // Even length centers
  }

  return count;
}`,
        codeTS: `function countSubstrings(s: string): number {
  let count = 0;

  function countPalindromes(l: number, r: number): number {
    let subCount = 0;
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      subCount++;
      l--;
      r++;
    }
    return subCount;
  }

  for (let i = 0; i < s.length; i++) {
    count += countPalindromes(i, i);
    count += countPalindromes(i, i + 1);
  }

  return count;
}`,
        lineByLine: [
          'Line 2: Accumulator count initialized to 0.',
          'Line 4-12: countPalindromes increments count as long as window expands symmetrically.',
          'Line 14-17: Test all odd centers (i, i) and even centers (i, i+1).',
          'Line 19: Return final count.'
        ],
        dryRun: [
          { step: 1, state: 's = "aaa"', action: 'i=0: odd "a"(1), even "aa"(1)', result: 'subtotal 2' },
          { step: 2, state: 'i=1', action: 'odd "a"(1), "aaa"(1), even "aa"(1)', result: 'subtotal 3' },
          { step: 3, state: 'i=2', action: 'odd "a"(1)', result: 'subtotal 1' },
          { step: 4, state: 'Total', action: '2 + 3 + 1', result: 'Returns 6' }
        ],
        complexityDerivation: '2N - 1 centers expanded at most N steps -> O(N^2) time with strictly O(1) auxiliary space.'
      }
    ],
    comparisonTable: [
      { approach: '2D DP Matrix', time: 'O(N²)', space: 'O(N²)', pros: 'Precomputes all ranges for fast queries', cons: 'Allocates N^2 booleans' },
      { approach: 'Expand Centers', time: 'O(N²)', space: 'O(1)', pros: 'Zero memory allocations, faster runtime in practice', cons: 'Cannot answer arbitrary range queries in O(1)' }
    ],
    interviewPitch: 'To count palindromic substrings, we observe that every palindrome expands outwards from a center. There are 2N - 1 possible centers: N single-character centers for odd-length palindromes, and N - 1 pairs of adjacent characters for even-length palindromes. Expanding outward while characters match gives us all palindromic substrings in O(N^2) time and O(1) auxiliary space.',
    followUps: [{ question: 'What is the maximum number of palindromic substrings in a string of length N?', answer: 'N*(N+1)/2 when all characters are identical (e.g., "aaaa...").' }],
    recallQuiz: {
      question: 'Why does expanding outward from centers yield the total count of palindromes?',
      options: ['Because every palindromic substring has exactly one unique center', 'Because substrings must have odd length', 'Because strings are immutable in JavaScript', 'Because it sorts the characters first'],
      correctIndex: 0,
      explanation: 'Every palindrome has a unique center: odd lengths have a center character, and even lengths have a center gap between two characters.'
    }
  },

  107: {
    id: 107,
    title: 'Decode Ways',
    difficulty: 'Medium',
    pattern: 'DP - 1D',
    day: 64,
    leetcodeUrl: 'https://leetcode.com/problems/decode-ways/',
    summary: 'A message containing digits from A-Z (1-26). Find total number of ways to decode it.',
    prerequisites: ['1D DP with lookback 1 and 2', 'String character slicing'],
    problemStatement: `A message containing letters from A-Z can be encoded into numbers using the mapping 'A' -> "1", ..., 'Z' -> "26". Given a string s containing only digits, return the number of ways to decode it.`,
    approaches: [
      {
        name: 'Approach 1: Top-Down Recursion with Memoization (Improved)',
        badge: 'Improved / Memoized',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Recursively decode from index i using a memoization table.',
        intuition: 'At index i, if s[i] !== 0, decode single digit (recurse to i+1). If two digits s[i...i+1] <= 26, decode pair (recurse to i+2).',
        codeJS: `function numDecodingsMemo(s) {
  const memo = new Map();

  function dfs(index) {
    if (index === s.length) return 1;
    if (s[index] === '0') return 0;
    if (memo.has(index)) return memo.get(index);

    let res = dfs(index + 1);
    if (index + 1 < s.length) {
      const twoDigit = parseInt(s.substring(index, index + 2), 10);
      if (twoDigit >= 10 && twoDigit <= 26) {
        res += dfs(index + 2);
      }
    }
    memo.set(index, res);
    return res;
  }

  return dfs(0);
}`,
        codeTS: `function numDecodingsMemo(s: string): number {
  const memo = new Map<number, number>();

  function dfs(index: number): number {
    if (index === s.length) return 1;
    if (s[index] === '0') return 0;
    if (memo.has(index)) return memo.get(index)!;

    let res = dfs(index + 1);
    if (index + 1 < s.length) {
      const twoDigit = parseInt(s.substring(index, index + 2), 10);
      if (twoDigit >= 10 && twoDigit <= 26) {
        res += dfs(index + 2);
      }
    }
    memo.set(index, res);
    return res;
  }

  return dfs(0);
}`,
        lineByLine: [
          'Line 4-5: Base cases: index at end of string counts as 1 valid decoding; leading zero is invalid (0).',
          'Line 6: Return cached value if already computed.',
          'Line 8: Branch 1: Single digit decode.',
          'Line 9-13: Branch 2: Two digit decode if value between 10 and 26.',
          'Line 14-15: Cache and return.'
        ],
        dryRun: [
          { step: 1, state: 's = "226"', action: 'dfs(0): s[0]=\'2\'', result: 'branches to dfs(1) and dfs(2)' },
          { step: 2, state: 'dfs(2): s[2]=\'6\'', action: 'dfs(3) = 1', result: 'memo[2] = 1' },
          { step: 3, state: 'dfs(1): s[1]=\'2\'', action: 'dfs(2) + dfs(3) = 1 + 1 = 2', result: 'memo[1] = 2' },
          { step: 4, state: 'dfs(0)', action: 'dfs(1) + dfs(2) = 2 + 1 = 3', result: 'Returns 3' }
        ],
        complexityDerivation: 'N distinct index states visited once -> O(N) time and O(N) recursion stack memory.'
      },
      {
        name: 'Approach 2: Bottom-Up Space-Optimized DP (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Compute ways using two rolling registers similar to Fibonacci.',
        intuition: 'Ways to decode up to i depends only on valid decodings ending at i-1 and valid two-character decodings ending at i-2.',
        codeJS: `function numDecodings(s) {
  if (!s || s[0] === '0') return 0;
  const n = s.length;
  let prev2 = 1; // dp[i-2]
  let prev1 = 1; // dp[i-1]

  for (let i = 1; i < n; i++) {
    let current = 0;
    const one = parseInt(s[i], 10);
    const two = parseInt(s.substring(i - 1, i + 1), 10);

    if (one >= 1 && one <= 9) {
      current += prev1;
    }
    if (two >= 10 && two <= 26) {
      current += prev2;
    }

    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}`,
        codeTS: `function numDecodings(s: string): number {
  if (!s || s[0] === '0') return 0;
  const n = s.length;
  let prev2 = 1;
  let prev1 = 1;

  for (let i = 1; i < n; i++) {
    let current = 0;
    const one = parseInt(s[i], 10);
    const two = parseInt(s.substring(i - 1, i + 1), 10);

    if (one >= 1 && one <= 9) {
      current += prev1;
    }
    if (two >= 10 && two <= 26) {
      current += prev2;
    }

    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}`,
        lineByLine: [
          'Line 2: If string is empty or starts with "0", it cannot be decoded.',
          'Line 4-5: Initialize prev2=1 and prev1=1.',
          'Line 7-18: At each digit, add prev1 if single digit is 1-9; add prev2 if two digits are 10-26.',
          'Line 20: Return prev1 holding total ways.'
        ],
        dryRun: [
          { step: 1, state: 's = "12", prev2=1, prev1=1', action: 'i=1: one=2 (valid), two=12 (valid)', result: 'current = 1 + 1 = 2' },
          { step: 2, state: 'Update', action: 'prev2=1, prev1=2', result: 'Returns 2' }
        ],
        complexityDerivation: 'Iterates through string of length N -> O(N) time with O(1) auxiliary variables.'
      }
    ],
    comparisonTable: [
      { approach: 'Top-Down Memoized', time: 'O(N)', space: 'O(N)', pros: 'Direct transition logic', cons: 'Recursion call stack frames' },
      { approach: 'Bottom-Up Space-Optimized', time: 'O(N)', space: 'O(1)', pros: 'Constant space, fast iterative loops', cons: 'Must handle edge cases carefully' }
    ],
    interviewPitch: 'Decode Ways resembles a constrained Fibonacci sequence: to decode up to index i, we can take a single digit (valid if 1-9, adding dp[i-1] ways) or take two digits (valid if 10-26, adding dp[i-2] ways). If a zero cannot be paired with a preceding 1 or 2, decoding becomes impossible and yields 0. Because we only need the last two states, we compress space to O(1), achieving O(N) time and O(1) auxiliary memory.',
    followUps: [{ question: 'What if asterisk wildcard characters exist?', answer: 'Decode Ways II: Multiply possibilities based on wildcard matches (* as 1-9 can map to 9 single digits, and combinations like 1* map to 9 numbers, 2* to 6 numbers).' }],
    recallQuiz: {
      question: 'When does a substring ending at index i contribute dp[i-2] to the current count?',
      options: ['When the two-digit number formed by s[i-1...i] is between 10 and 26 inclusive', 'Whenever s[i] is even', 'When s[i-1] is not zero', 'When s is length > 2'],
      correctIndex: 0,
      explanation: 'Only numbers from 10 to 26 represent valid two-character alphabet mappings (J through Z).'
    }
  },

  108: {
    id: 108,
    title: 'Coin Change',
    difficulty: 'Medium',
    pattern: 'DP - 1D',
    day: 64,
    leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
    summary: 'Find the fewest number of coins that you need to make up a given amount, or -1 if impossible.',
    prerequisites: ['Unbounded Knapsack DP', 'Min element recurrence'],
    problemStatement: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money. Return the fewest number of coins needed to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.`,
    approaches: [
      {
        name: 'Approach 1: Top-Down Recursion with Memoization (Improved)',
        badge: 'Improved / Memoized',
        timeComplexity: 'O(amount * coins.length)',
        spaceComplexity: 'O(amount)',
        summary: 'Recursive function minCoins(rem) with a memoization table.',
        intuition: 'At remaining amount rem, test every coin c <= rem and choose min(1 + minCoins(rem - c)).',
        codeJS: `function coinChangeMemo(coins, amount) {
  const memo = new Map();

  function dfs(rem) {
    if (rem === 0) return 0;
    if (rem < 0) return -1;
    if (memo.has(rem)) return memo.get(rem);

    let minCoins = Infinity;
    for (const c of coins) {
      const sub = dfs(rem - c);
      if (sub >= 0) {
        minCoins = Math.min(minCoins, 1 + sub);
      }
    }

    const res = minCoins === Infinity ? -1 : minCoins;
    memo.set(rem, res);
    return res;
  }

  return dfs(amount);
}`,
        codeTS: `function coinChangeMemo(coins: number[], amount: number): number {
  const memo = new Map<number, number>();

  function dfs(rem: number): number {
    if (rem === 0) return 0;
    if (rem < 0) return -1;
    if (memo.has(rem)) return memo.get(rem)!;

    let minCoins = Infinity;
    for (const c of coins) {
      const sub = dfs(rem - c);
      if (sub >= 0) {
        minCoins = Math.min(minCoins, 1 + sub);
      }
    }

    const res = minCoins === Infinity ? -1 : minCoins;
    memo.set(rem, res);
    return res;
  }

  return dfs(amount);
}`,
        lineByLine: [
          'Line 4-6: Base cases: rem === 0 needs 0 coins; rem < 0 is invalid (-1); cache hit returns memo value.',
          'Line 8-14: Iterate over each denomination and find minimum recursive result.',
          'Line 16-18: Cache and return.'
        ],
        dryRun: [
          { step: 1, state: 'coins=[1, 2, 5], amount=11', action: 'rem=11, tries 5', result: 'branches to dfs(6)' },
          { step: 2, state: 'rem=6', action: 'tries 5 -> dfs(1)', result: 'dfs(1)=1' },
          { step: 3, state: 'Resolve', action: '1 + 1 + 1', result: 'Optimal coins = 3 (5 + 5 + 1)' }
        ],
        complexityDerivation: 'amount states, each trying C coins -> O(amount * C) time and O(amount) stack memory.'
      },
      {
        name: 'Approach 2: Bottom-Up Dynamic Programming Array (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(amount * coins.length)',
        spaceComplexity: 'O(amount)',
        summary: 'Build dp array of size amount + 1 where dp[i] = min(dp[i], 1 + dp[i - c]).',
        intuition: 'Compute the minimum coins needed for every sub-amount from 1 up to amount.',
        codeJS: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0; // 0 coins to make amount 0

  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i - c >= 0) {
        dp[i] = Math.min(dp[i], 1 + dp[i - c]);
      }
    }
  }

  return dp[amount] > amount ? -1 : dp[amount];
}`,
        codeTS: `function coinChange(coins: number[], amount: number): number {
  const dp: number[] = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i - c >= 0) {
        dp[i] = Math.min(dp[i], 1 + dp[i - c]);
      }
    }
  }

  return dp[amount] > amount ? -1 : dp[amount];
}`,
        lineByLine: [
          'Line 2: Initialize dp array with amount + 1 (representing infinity).',
          'Line 3: Base case: amount 0 requires 0 coins.',
          'Line 5-11: Outer loop tests each target amount i; inner loop tests every coin denomination c.',
          'Line 13: If dp[amount] was never reached, return -1; otherwise return dp[amount].'
        ],
        dryRun: [
          { step: 1, state: 'coins=[1,2,5], amount=3', action: 'dp[0]=0, dp[1]=1, dp[2]=1', result: 'base set' },
          { step: 2, state: 'i=3', action: 'c=1: 1+dp[2]=2; c=2: 1+dp[1]=2', result: 'dp[3] = 2' },
          { step: 3, state: 'Done', action: 'return dp[3]', result: 'Returns 2' }
        ],
        complexityDerivation: 'Outer loop runs amount times, inner loop runs C times -> O(amount * C) time and O(amount) array memory.'
      }
    ],
    comparisonTable: [
      { approach: 'Top-Down Memoized', time: 'O(A * C)', space: 'O(A)', pros: 'Only visits reachable states', cons: 'Recursion overhead' },
      { approach: 'Bottom-Up DP Table', time: 'O(A * C)', space: 'O(A)', pros: 'Iterative, cache friendly, no stack limit', cons: 'Calculates all values 1..A' }
    ],
    interviewPitch: 'Coin Change is an unbounded knapsack problem. Greedy fails here (for instance, with coins [1, 3, 4] and amount 6, greedy takes 4+1+1=3 coins, while optimal is 3+3=2 coins). We use Bottom-Up Dynamic Programming where dp[i] represents the minimum coins needed for amount i. We initialize dp with amount + 1 and dp[0] = 0. For each amount from 1 to total, and for each coin c, dp[i] = min(dp[i], 1 + dp[i - c]). This runs in O(amount * C) time and O(amount) space.',
    followUps: [{ question: 'What if you need to return the actual coins used?', answer: 'Maintain a parent array parent[i] recording which coin was used to achieve the optimal dp[i], then backtrack from amount to 0.' }],
    recallQuiz: {
      question: 'Why does a greedy approach (taking the largest coin first) fail for Coin Change?',
      options: ['Because choosing the largest coin can leave an amount that requires more small coins than an alternative combination', 'Because coins can be negative', 'Because amounts are floating point numbers', 'Because array is not sorted'],
      correctIndex: 0,
      explanation: 'With denominations [1, 3, 4] and target 6, greedy picks 4 + 1 + 1 (3 coins), whereas the optimal choice is 3 + 3 (2 coins).'
    }
  }
};
