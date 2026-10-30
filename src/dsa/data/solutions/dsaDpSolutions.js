// Problems 101 to 123: Dynamic Programming (1D & 2D) Master Solutions
// Multi-Approach Solutions with JS & TS, Line-by-Line Breakdown, Dry Runs, Pitches, and Recall Quizzes
// Strictly adheres to AGENTS.md Section 4 Multi-Approach standard

export const DP_SOLUTIONS = {
  "101": {
    "id": 101,
    "title": "Climbing Stairs",
    "difficulty": "Easy",
    "pattern": "DP - 1D",
    "day": 60,
    "leetcodeUrl": "https://leetcode.com/problems/climbing-stairs/",
    "summary": "Find how many distinct ways you can climb n stairs taking 1 or 2 steps at a time.",
    "prerequisites": [
      "Fibonacci recurrence",
      "State compression from O(N) to O(1)"
    ],
    "problemStatement": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "approaches": [
      {
        "name": "Approach 1: Top-Down Recursion with Memoization (Improved)",
        "badge": "Improved / Memoized",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "summary": "Recursively compute ways(n) = ways(n-1) + ways(n-2) with a memoization table.",
        "intuition": "At step n, the last move was either 1 step from (n-1) or 2 steps from (n-2). Memoizing prevents exponential branch explosion.",
        "codeJS": "function climbStairsMemo(n, memo = new Map()) {\n  if (n <= 2) return n;\n  if (memo.has(n)) return memo.get(n);\n  const ways = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);\n  memo.set(n, ways);\n  return ways;\n}",
        "codeTS": "function climbStairsMemo(n: number, memo: Map<number, number> = new Map()): number {\n  if (n <= 2) return n;\n  if (memo.has(n)) return memo.get(n)!;\n  const ways = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);\n  memo.set(n, ways);\n  return ways;\n}",
        "lineByLine": [
          "Line 2: Base cases: n=1 has 1 way, n=2 has 2 ways.",
          "Line 3: Cache lookup avoids recalculation.",
          "Line 4-6: Sum solutions to the two subproblems, store in memo, and return."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "n=4",
            "action": "climbStairs(3) + climbStairs(2)",
            "result": "computes climbStairs(3)"
          },
          {
            "step": 2,
            "state": "n=3",
            "action": "climbStairs(2) + climbStairs(1) = 2 + 1",
            "result": "memo[3] = 3"
          },
          {
            "step": 3,
            "state": "n=4 (resolve)",
            "action": "memo[3] + 2 = 3 + 2",
            "result": "returns 5"
          }
        ],
        "complexityDerivation": "Recurrence tree has N nodes with memoization -> O(N) time and O(N) stack/map space."
      },
      {
        "name": "Approach 2: Bottom-Up Space-Optimized DP (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Iteratively advance two state registers representing the previous two step counts.",
        "intuition": "We only ever need the values from the preceding two steps (dp[i-1] and dp[i-2]) to compute the current step.",
        "codeJS": "function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1;\n  let prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const current = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = current;\n  }\n  return prev1;\n}",
        "codeTS": "function climbStairs(n: number): number {\n  if (n <= 2) return n;\n  let prev2 = 1;\n  let prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const current = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = current;\n  }\n  return prev1;\n}",
        "lineByLine": [
          "Line 2: Fast return for n <= 2.",
          "Line 3-4: Initialize registers for base cases n=1 and n=2.",
          "Line 5-9: Loop from 3 up to n, computing sum and shifting registers.",
          "Line 10: Return prev1 holding ways(n)."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "n=4, prev2=1, prev1=2",
            "action": "i=3: current = 2 + 1 = 3",
            "result": "prev2=2, prev1=3"
          },
          {
            "step": 2,
            "state": "i=4",
            "action": "current = 3 + 2 = 5",
            "result": "prev2=3, prev1=5"
          },
          {
            "step": 3,
            "state": "Done",
            "action": "return prev1",
            "result": "Output 5"
          }
        ],
        "complexityDerivation": "Loops N-2 times -> O(N) time. Uses 2 scalar integer registers -> O(1) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Top-Down Memoized",
        "time": "O(N)",
        "space": "O(N)",
        "pros": "Intuitive recurrence",
        "cons": "Recursion call stack frames"
      },
      {
        "approach": "Bottom-Up Space-Optimized",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Optimal constant memory",
        "cons": "State variables only"
      }
    ],
    "interviewPitch": "Climbing stairs maps directly to the Fibonacci recurrence since arriving at step n requires stepping from either n-1 or n-2. While memoized recursion achieves O(N) time in O(N) stack space, we optimize to O(1) space by tracking only the preceding two step totals. This executes in O(N) time and O(1) memory.",
    "followUps": [
      {
        "question": "What if you could take up to k steps?",
        "answer": "Maintain a running sliding window sum of the previous k step totals in O(N) time and O(k) space."
      }
    ],
    "recallQuiz": {
      "question": "Why does Climbing Stairs reduce to Fibonacci numbers?",
      "options": [
        "Because to reach step n you must step from either n-1 or n-2",
        "Because stairs are binary",
        "Because step heights are equal",
        "Because n is an integer"
      ],
      "correctIndex": 0,
      "explanation": "Since the only moves allowed are 1 or 2 steps, paths to step n strictly partition into paths ending with a 1-step jump and paths ending with a 2-step jump."
    }
  },
  "102": {
    "id": 102,
    "title": "Min Cost Climbing Stairs",
    "difficulty": "Easy",
    "pattern": "DP - 1D",
    "day": 60,
    "leetcodeUrl": "https://leetcode.com/problems/min-cost-climbing-stairs/",
    "summary": "Find the minimum cost to reach the top floor where you can start at step 0 or step 1.",
    "prerequisites": [
      "1D DP transition",
      "State compression"
    ],
    "problemStatement": "Given an integer array `cost` where `cost[i]` is cost of `i-th` step. Return minimum cost to reach top of floor.",
    "approaches": [
      {
        "name": "Approach 1: Bottom-Up DP Array (Improved)",
        "badge": "Improved / DP Table",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "summary": "Build dp array where dp[i] = cost[i] + min(dp[i-1], dp[i-2]).",
        "intuition": "To land on step i, take the min cost to reach step i-1 or i-2, then pay cost[i].",
        "codeJS": "function minCostClimbingStairsArray(cost) {\n  const n = cost.length;\n  const dp = new Array(n);\n  dp[0] = cost[0];\n  dp[1] = cost[1];\n  for (let i = 2; i < n; i++) {\n    dp[i] = cost[i] + Math.min(dp[i - 1], dp[i - 2]);\n  }\n  return Math.min(dp[n - 1], dp[n - 2]);\n}",
        "codeTS": "function minCostClimbingStairsArray(cost: number[]): number {\n  const n = cost.length;\n  const dp: number[] = new Array(n);\n  dp[0] = cost[0];\n  dp[1] = cost[1];\n  for (let i = 2; i < n; i++) {\n    dp[i] = cost[i] + Math.min(dp[i - 1], dp[i - 2]);\n  }\n  return Math.min(dp[n - 1], dp[n - 2]);\n}",
        "lineByLine": [
          "Line 2-5: Allocate dp array and initialize base cases for step 0 and 1.",
          "Line 6-8: Loop through stairs, computing minimum cost to stand on step i.",
          "Line 9: Final step to top can jump from either the last or second to last stair."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "cost = [10, 15, 20]",
            "action": "dp[0]=10, dp[1]=15",
            "result": "base cases set"
          },
          {
            "step": 2,
            "state": "i=2",
            "action": "dp[2] = 20 + min(10, 15) = 30",
            "result": "dp = [10, 15, 30]"
          },
          {
            "step": 3,
            "state": "Top",
            "action": "min(dp[1], dp[2]) = min(15, 30)",
            "result": "Return 15"
          }
        ],
        "complexityDerivation": "Single loop of length N -> O(N) time and O(N) auxiliary space."
      },
      {
        "name": "Approach 2: Space-Optimized State Machine (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Track only the two previous step costs, updating in O(1) space.",
        "intuition": "Each calculation only requires the previous two costs; no full array needed.",
        "codeJS": "function minCostClimbingStairs(cost) {\n  let prev2 = cost[0];\n  let prev1 = cost[1];\n  for (let i = 2; i < cost.length; i++) {\n    const current = cost[i] + Math.min(prev1, prev2);\n    prev2 = prev1;\n    prev1 = current;\n  }\n  return Math.min(prev1, prev2);\n}",
        "codeTS": "function minCostClimbingStairs(cost: number[]): number {\n  let prev2 = cost[0];\n  let prev1 = cost[1];\n  for (let i = 2; i < cost.length; i++) {\n    const current = cost[i] + Math.min(prev1, prev2);\n    prev2 = prev1;\n    prev1 = current;\n  }\n  return Math.min(prev1, prev2);\n}",
        "lineByLine": [
          "Line 2-3: Initialize two scalars with costs of first two steps.",
          "Line 4-8: Compute next step cost and advance registers.",
          "Line 9: Return the minimum between reaching the last or second-to-last step."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]",
            "action": "prev2=1, prev1=100",
            "result": "step 0 & 1"
          },
          {
            "step": 2,
            "state": "i=2..9",
            "action": "Continually choose min of previous 2",
            "result": "bypasses 100 costs"
          },
          {
            "step": 3,
            "state": "End",
            "action": "min(prev1, prev2)",
            "result": "Optimal total cost 6"
          }
        ],
        "complexityDerivation": "O(N) iterations using O(1) auxiliary variables."
      }
    ],
    "comparisonTable": [
      {
        "approach": "DP Array",
        "time": "O(N)",
        "space": "O(N)",
        "pros": "Direct indexing",
        "cons": "Allocates N array items"
      },
      {
        "approach": "Space-Optimized DP",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Zero heap memory allocations",
        "cons": "Overwrites variables"
      }
    ],
    "interviewPitch": "At each stair i, the cost to step on it is cost[i] plus the minimum cost to reach step i-1 or i-2. Since the top floor can be reached from either step n-1 or n-2, the answer is min(dp[n-1], dp[n-2]). We optimize from O(N) space to O(1) space by tracking only the preceding two values.",
    "followUps": [
      {
        "question": "Can we modify cost in place?",
        "answer": "Yes, setting cost[i] += min(cost[i-1], cost[i-2]) achieves O(1) space, but mutating caller inputs is considered poor practice in production."
      }
    ],
    "recallQuiz": {
      "question": "Why does the final answer take min(prev1, prev2)?",
      "options": [
        "Because the top floor can be reached by a jump from either of the top two steps",
        "Because costs might be negative",
        "Because step 0 is free",
        "Because array length is even"
      ],
      "correctIndex": 0,
      "explanation": "You reach the top floor from step n-1 with 1 step, or from step n-2 with 2 steps without stepping on step n-1."
    }
  },
  "103": {
    "id": 103,
    "title": "House Robber",
    "difficulty": "Medium",
    "pattern": "DP - 1D",
    "day": 61,
    "leetcodeUrl": "https://leetcode.com/problems/house-robber/",
    "summary": "Find maximum amount of money you can rob tonight without alerting police (cannot rob adjacent houses).",
    "prerequisites": [
      "Decision DP",
      "State compression"
    ],
    "problemStatement": "You are a professional robber planning to rob houses along a street. Adjacent houses have security systems connected. Return maximum money you can rob without robbing adjacent houses.",
    "approaches": [
      {
        "name": "Approach 1: Bottom-Up DP Array (Improved)",
        "badge": "Improved / DP Table",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "summary": "dp[i] = max(dp[i-1], dp[i-2] + nums[i]) where dp[i] is max loot up to house i.",
        "intuition": "At house i, you either skip it (keep dp[i-1]) or rob it (add nums[i] to dp[i-2]).",
        "codeJS": "function robArray(nums) {\n  if (nums.length === 0) return 0;\n  if (nums.length === 1) return nums[0];\n  const dp = new Array(nums.length);\n  dp[0] = nums[0];\n  dp[1] = Math.max(nums[0], nums[1]);\n  for (let i = 2; i < nums.length; i++) {\n    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);\n  }\n  return dp[nums.length - 1];\n}",
        "codeTS": "function robArray(nums: number[]): number {\n  if (nums.length === 0) return 0;\n  if (nums.length === 1) return nums[0];\n  const dp: number[] = new Array(nums.length);\n  dp[0] = nums[0];\n  dp[1] = Math.max(nums[0], nums[1]);\n  for (let i = 2; i < nums.length; i++) {\n    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);\n  }\n  return dp[nums.length - 1];\n}",
        "lineByLine": [
          "Line 2-3: Handle edge cases of 0 or 1 house.",
          "Line 4-6: Base cases: house 0 gives nums[0], house 1 gives max(nums[0], nums[1]).",
          "Line 7-9: At each house i, choose maximum of skipping (dp[i-1]) or robbing (dp[i-2] + nums[i]).",
          "Line 10: Return optimal total at end."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [2, 7, 9, 3, 1]",
            "action": "dp[0]=2, dp[1]=max(2, 7)=7",
            "result": "base set"
          },
          {
            "step": 2,
            "state": "i=2 (val 9)",
            "action": "max(7, 2 + 9) = 11",
            "result": "dp[2] = 11"
          },
          {
            "step": 3,
            "state": "i=3 (val 3)",
            "action": "max(11, 7 + 3) = 11",
            "result": "dp[3] = 11"
          },
          {
            "step": 4,
            "state": "i=4 (val 1)",
            "action": "max(11, 11 + 1) = 12",
            "result": "dp[4] = 12"
          }
        ],
        "complexityDerivation": "Loops N times -> O(N) time and O(N) array storage."
      },
      {
        "name": "Approach 2: Space-Optimized Dual Registers (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Track rob1 (loot up to i-2) and rob2 (loot up to i-1) in O(1) memory.",
        "intuition": "Only the two preceding optimal values are needed to decide the current house.",
        "codeJS": "function rob(nums) {\n  let rob1 = 0;\n  let rob2 = 0;\n  for (const n of nums) {\n    const current = Math.max(rob2, rob1 + n);\n    rob1 = rob2;\n    rob2 = current;\n  }\n  return rob2;\n}",
        "codeTS": "function rob(nums: number[]): number {\n  let rob1 = 0;\n  let rob2 = 0;\n  for (const n of nums) {\n    const current = Math.max(rob2, rob1 + n);\n    rob1 = rob2;\n    rob2 = current;\n  }\n  return rob2;\n}",
        "lineByLine": [
          "Line 2-3: Initialize two loot registers representing dp[i-2] and dp[i-1].",
          "Line 4: Iterate over each house value.",
          "Line 5-7: Calculate current optimal loot and shift registers.",
          "Line 9: Return rob2 containing global optimal answer."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [1, 2, 3, 1]",
            "action": "n=1 -> current = max(0, 0+1) = 1",
            "result": "rob1=0, rob2=1"
          },
          {
            "step": 2,
            "state": "n=2",
            "action": "current = max(1, 0+2) = 2",
            "result": "rob1=1, rob2=2"
          },
          {
            "step": 3,
            "state": "n=3",
            "action": "current = max(2, 1+3) = 4",
            "result": "rob1=2, rob2=4"
          },
          {
            "step": 4,
            "state": "n=1",
            "action": "current = max(4, 2+1) = 4",
            "result": "rob1=4, rob2=4 -> returns 4"
          }
        ],
        "complexityDerivation": "Single linear pass -> O(N) time with O(1) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "DP Array",
        "time": "O(N)",
        "space": "O(N)",
        "pros": "Clear step-by-step history",
        "cons": "Wasted array allocation"
      },
      {
        "approach": "Space-Optimized DP",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Optimal O(1) memory footprint",
        "cons": "Values overwritten during loop"
      }
    ],
    "interviewPitch": "House Robber reduces to a classic decision DP: at each house i, we either do not rob it (earning dp[i-1]) or we rob it (earning nums[i] + dp[i-2]). Because the recurrence only depends on the previous two values, we optimize the space from O(N) down to O(1) by maintaining two scalar variables. This achieves optimal O(N) time and O(1) space.",
    "followUps": [
      {
        "question": "How does this change if houses are in a circle?",
        "answer": "House Robber II: Run the algorithm twice, once on nums[0...n-2] and once on nums[1...n-1], taking the maximum of the two."
      }
    ],
    "recallQuiz": {
      "question": "What is the recurrence relation for House Robber?",
      "options": [
        "dp[i] = max(dp[i-1], dp[i-2] + nums[i])",
        "dp[i] = dp[i-1] + nums[i]",
        "dp[i] = max(nums[i], nums[i-1])",
        "dp[i] = dp[i-1] * nums[i]"
      ],
      "correctIndex": 0,
      "explanation": "Robbing house i precludes robbing house i-1, meaning we can only add nums[i] to the optimal sum from house i-2."
    }
  },
  "104": {
    "id": 104,
    "title": "House Robber II",
    "difficulty": "Medium",
    "pattern": "DP - 1D",
    "day": 61,
    "leetcodeUrl": "https://leetcode.com/problems/house-robber-ii/",
    "summary": "Houses are arranged in a circle; first house is neighbor to last. Find maximum loot.",
    "prerequisites": [
      "House Robber I",
      "Circular array decomposition"
    ],
    "problemStatement": "Houses are arranged in a circle. You cannot rob adjacent houses. Return maximum amount of money you can rob.",
    "approaches": [
      {
        "name": "Approach 1: Slice and Run Linear Robber Twice (Improved)",
        "badge": "Improved / Array Slice",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "summary": "Rob either nums[0...n-2] or nums[1...n-1] by slicing the array.",
        "intuition": "Since house 0 and house n-1 cannot both be robbed, the optimal answer is max(rob(nums[0..n-2]), rob(nums[1..n-1])).",
        "codeJS": "function rob2Slice(nums) {\n  if (nums.length === 1) return nums[0];\n  const linearRob = (arr) => {\n    let r1 = 0, r2 = 0;\n    for (const n of arr) {\n      const c = Math.max(r2, r1 + n);\n      r1 = r2;\n      r2 = c;\n    }\n    return r2;\n  };\n  return Math.max(linearRob(nums.slice(0, -1)), linearRob(nums.slice(1)));\n}",
        "codeTS": "function rob2Slice(nums: number[]): number {\n  if (nums.length === 1) return nums[0];\n  const linearRob = (arr: number[]): number => {\n    let r1 = 0, r2 = 0;\n    for (const n of arr) {\n      const c = Math.max(r2, r1 + n);\n      r1 = r2;\n      r2 = c;\n    }\n    return r2;\n  };\n  return Math.max(linearRob(nums.slice(0, -1)), linearRob(nums.slice(1)));\n}",
        "lineByLine": [
          "Line 2: Single house base case returns its value.",
          "Line 3-10: Linear robber helper using O(1) registers.",
          "Line 11: Call helper on slice without last house, and slice without first house, returning max."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [2, 3, 2]",
            "action": "slice 1: [2, 3] -> rob=3",
            "result": "case 1"
          },
          {
            "step": 2,
            "state": "slice 2: [3, 2] -> rob=3",
            "action": "max(3, 3)",
            "result": "returns 3"
          }
        ],
        "complexityDerivation": "Linear helper runs twice on N-1 elements -> O(N) time. Slices allocate O(N) memory."
      },
      {
        "name": "Approach 2: In-Place Index Range Robber (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Run linear robber across index bounds [start, end] without allocating slice arrays.",
        "intuition": "Avoid creating slice arrays in V8 memory by passing boundary indices start and end.",
        "codeJS": "function rob(nums) {\n  const n = nums.length;\n  if (n === 1) return nums[0];\n  const robRange = (start, end) => {\n    let rob1 = 0;\n    let rob2 = 0;\n    for (let i = start; i <= end; i++) {\n      const current = Math.max(rob2, rob1 + nums[i]);\n      rob1 = rob2;\n      rob2 = current;\n    }\n    return rob2;\n  };\n  return Math.max(robRange(0, n - 2), robRange(1, n - 1));\n}",
        "codeTS": "function rob(nums: number[]): number {\n  const n = nums.length;\n  if (n === 1) return nums[0];\n  const robRange = (start: number, end: number): number => {\n    let rob1 = 0;\n    let rob2 = 0;\n    for (let i = start; i <= end; i++) {\n      const current = Math.max(rob2, rob1 + nums[i]);\n      rob1 = rob2;\n      rob2 = current;\n    }\n    return rob2;\n  };\n  return Math.max(robRange(0, n - 2), robRange(1, n - 1));\n}",
        "lineByLine": [
          "Line 2-3: Handle n === 1 edge case.",
          "Line 4-13: robRange iterates strictly from index start to end.",
          "Line 14: Evaluate ranges [0, n-2] and [1, n-1] in O(1) space and return max."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [1, 2, 3, 1]",
            "action": "Range [0, 2]: [1, 2, 3] -> rob = 4",
            "result": "skip last"
          },
          {
            "step": 2,
            "state": "Range [1, 3]: [2, 3, 1] -> rob = 3",
            "action": "skip first",
            "result": "rob = 3"
          },
          {
            "step": 3,
            "state": "Max(4, 3)",
            "action": "returns 4",
            "result": "Optimal total 4"
          }
        ],
        "complexityDerivation": "Two linear scans of length N -> 2N = O(N) time with strictly O(1) auxiliary space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Slice & Rob",
        "time": "O(N)",
        "space": "O(N)",
        "pros": "Quick to write",
        "cons": "Allocates two slice arrays in memory"
      },
      {
        "approach": "Index-Bounded In-Place",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Optimal zero-allocation runtime",
        "cons": "Requires index boundary parameters"
      }
    ],
    "interviewPitch": "In House Robber II, the circular layout means house 0 and house n-1 are adjacent and cannot both be robbed. This mutually exclusive constraint naturally splits the problem into two linear House Robber subproblems: robbing houses [0...n-2] and robbing houses [1...n-1]. We run our linear O(1) space solver over both index ranges and return the maximum, achieving O(N) time and O(1) auxiliary space.",
    "followUps": [
      {
        "question": "What if array has length 1?",
        "answer": "Return nums[0] immediately since no circular conflict exists for a single house."
      }
    ],
    "recallQuiz": {
      "question": "Why does running House Robber I on [0, n-2] and [1, n-1] cover all valid circular options?",
      "options": [
        "Because any valid circular selection can either omit the last house, omit the first house, or omit both",
        "Because houses have positive values",
        "Because circle has even vertices",
        "Because of modular arithmetic"
      ],
      "correctIndex": 0,
      "explanation": "Since house 0 and house n-1 cannot both be included, every valid subset must either exclude house 0, exclude house n-1, or exclude both. Taking the max of both ranges is therefore exhaustive."
    }
  },
  "105": {
    "id": 105,
    "title": "Longest Palindromic Substring",
    "difficulty": "Medium",
    "pattern": "DP - 1D",
    "day": 62,
    "leetcodeUrl": "https://leetcode.com/problems/longest-palindromic-substring/",
    "summary": "Find the longest palindromic substring in a given string s.",
    "prerequisites": [
      "Palindrome center expansion",
      "2D DP table vs Two Pointers"
    ],
    "problemStatement": "Given a string `s`, return the longest palindromic substring in `s`.",
    "approaches": [
      {
        "name": "Approach 1: 2D Dynamic Programming Table (Improved)",
        "badge": "Improved / 2D DP",
        "timeComplexity": "O(N²)",
        "spaceComplexity": "O(N²)",
        "summary": "dp[i][j] is true if s[i...j] is palindrome, derived from dp[i+1][j-1] and s[i] === s[j].",
        "intuition": "A substring s[i...j] is a palindrome if outer characters match and inner substring s[i+1...j-1] is already a palindrome.",
        "codeJS": "function longestPalindromeDP(s) {\n  const n = s.length;\n  if (n <= 1) return s;\n  const dp = Array.from({ length: n }, () => new Array(n).fill(false));\n  let start = 0, maxLen = 1;\n\n  for (let i = 0; i < n; i++) dp[i][i] = true;\n\n  for (let len = 2; len <= n; len++) {\n    for (let i = 0; i <= n - len; i++) {\n      const j = i + len - 1;\n      if (s[i] === s[j]) {\n        if (len === 2 || dp[i + 1][j - 1]) {\n          dp[i][j] = true;\n          if (len > maxLen) {\n            start = i;\n            maxLen = len;\n          }\n        }\n      }\n    }\n  }\n  return s.substring(start, start + maxLen);\n}",
        "codeTS": "function longestPalindromeDP(s: string): string {\n  const n = s.length;\n  if (n <= 1) return s;\n  const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));\n  let start = 0, maxLen = 1;\n\n  for (let i = 0; i < n; i++) dp[i][i] = true;\n\n  for (let len = 2; len <= n; len++) {\n    for (let i = 0; i <= n - len; i++) {\n      const j = i + len - 1;\n      if (s[i] === s[j]) {\n        if (len === 2 || dp[i + 1][j - 1]) {\n          dp[i][j] = true;\n          if (len > maxLen) {\n            start = i;\n            maxLen = len;\n          }\n        }\n      }\n    }\n  }\n  return s.substring(start, start + maxLen);\n}",
        "lineByLine": [
          "Line 4: Allocate N x N boolean matrix initialized to false.",
          "Line 7: Base case: all 1-character substrings are palindromes.",
          "Line 9-19: Iterate substring length from 2 to N, updating dp table and tracking maxLen."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s = \"babad\"",
            "action": "len=1: all true",
            "result": "maxLen=1"
          },
          {
            "step": 2,
            "state": "len=3: i=0(b), j=2(b)",
            "action": "s[0]===s[2] && dp[1][1]=true",
            "result": "dp[0][2]=true, maxLen=3 (\"bab\")"
          },
          {
            "step": 3,
            "state": "len=3: i=1(a), j=3(a)",
            "action": "s[1]===s[3] && dp[2][2]=true",
            "result": "dp[1][3]=true, \"aba\""
          }
        ],
        "complexityDerivation": "Fills upper triangle of N x N matrix -> O(N^2) time and O(N^2) auxiliary memory."
      },
      {
        "name": "Approach 2: Expand Around Centers (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N²)",
        "spaceComplexity": "O(1)",
        "summary": "Expand outward from 2N-1 centers (odd and even length palindromes) in O(1) auxiliary space.",
        "intuition": "Every palindrome mirrors around its center. There are N single-character centers (odd) and N-1 between-character centers (even).",
        "codeJS": "function longestPalindrome(s) {\n  if (s.length <= 1) return s;\n  let start = 0;\n  let maxLen = 1;\n\n  function expand(l, r) {\n    while (l >= 0 && r < s.length && s[l] === s[r]) {\n      const len = r - l + 1;\n      if (len > maxLen) {\n        start = l;\n        maxLen = len;\n      }\n      l--;\n      r++;\n    }\n  }\n\n  for (let i = 0; i < s.length; i++) {\n    expand(i, i);     // Odd length\n    expand(i, i + 1); // Even length\n  }\n\n  return s.substring(start, start + maxLen);\n}",
        "codeTS": "function longestPalindrome(s: string): string {\n  if (s.length <= 1) return s;\n  let start = 0;\n  let maxLen = 1;\n\n  function expand(l: number, r: number): void {\n    while (l >= 0 && r < s.length && s[l] === s[r]) {\n      const len = r - l + 1;\n      if (len > maxLen) {\n        start = l;\n        maxLen = len;\n      }\n      l--;\n      r++;\n    }\n  }\n\n  for (let i = 0; i < s.length; i++) {\n    expand(i, i);\n    expand(i, i + 1);\n  }\n\n  return s.substring(start, start + maxLen);\n}",
        "lineByLine": [
          "Line 2: Fast return for strings of length <= 1.",
          "Line 6-15: expand helper widens pointers l and r outward while characters match.",
          "Line 18-20: Test all 2N-1 centers: expand(i, i) for odd and expand(i, i+1) for even.",
          "Line 23: Return substring defined by start and maxLen."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s = \"babad\", i=0",
            "action": "expand(0,0): \"b\"",
            "result": "maxLen=1"
          },
          {
            "step": 2,
            "state": "i=1",
            "action": "expand(1,1): \"bab\"",
            "result": "start=0, maxLen=3"
          },
          {
            "step": 3,
            "state": "i=2",
            "action": "expand(2,2): \"aba\"",
            "result": "len=3"
          },
          {
            "step": 4,
            "state": "Done",
            "action": "s.substring(0, 3)",
            "result": "\"bab\""
          }
        ],
        "complexityDerivation": "2N centers, each expanding at most N/2 times -> O(N^2) time. Stores only integer registers -> O(1) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "2D DP Table",
        "time": "O(N²)",
        "space": "O(N²)",
        "pros": "Exhaustive table for all substring queries",
        "cons": "O(N^2) heap allocations"
      },
      {
        "approach": "Expand Around Centers",
        "time": "O(N²)",
        "space": "O(1)",
        "pros": "Optimal O(1) space, excellent cache locality",
        "cons": "Quadratic worst-case time"
      }
    ],
    "interviewPitch": "While the 2D DP table approach checks palindromic substrings in O(N^2) time and O(N^2) space, we can eliminate all auxiliary memory by expanding around centers. Every palindrome mirrors around either an odd center (a single character) or an even center (between two characters). By testing all 2N - 1 centers and expanding outward while characters match, we find the longest palindrome in O(N^2) time and O(1) space.",
    "followUps": [
      {
        "question": "Can this be solved in O(N) linear time?",
        "answer": "Yes, Manachers Algorithm solves Longest Palindromic Substring in strictly O(N) time and O(N) space using mirror symmetry."
      }
    ],
    "recallQuiz": {
      "question": "How many possible palindrome centers exist in a string of length N?",
      "options": [
        "2N - 1 (N single-char odd centers and N-1 between-char even centers)",
        "N centers",
        "N^2 centers",
        "N/2 centers"
      ],
      "correctIndex": 0,
      "explanation": "There are N characters (odd length centers) and N-1 pairs of adjacent characters (even length centers), totaling 2N - 1 centers."
    }
  },
  "106": {
    "id": 106,
    "title": "Palindromic Substrings",
    "difficulty": "Medium",
    "pattern": "DP - 1D",
    "day": 62,
    "leetcodeUrl": "https://leetcode.com/problems/palindromic-substrings/",
    "summary": "Given a string s, return the number of palindromic substrings in it.",
    "prerequisites": [
      "Palindrome center expansion",
      "Counting substrings"
    ],
    "problemStatement": "Given a string `s`, return the number of palindromic substrings in it. A substring is a contiguous sequence of characters within the string.",
    "approaches": [
      {
        "name": "Approach 1: 2D Dynamic Programming Table (Improved)",
        "badge": "Improved / 2D DP",
        "timeComplexity": "O(N²)",
        "spaceComplexity": "O(N²)",
        "summary": "Build dp[i][j] boolean table; count whenever dp[i][j] is true.",
        "intuition": "s[i...j] is a palindrome if s[i] === s[j] and inner s[i+1...j-1] is a palindrome.",
        "codeJS": "function countSubstringsDP(s) {\n  const n = s.length;\n  let count = 0;\n  const dp = Array.from({ length: n }, () => new Array(n).fill(false));\n\n  for (let i = n - 1; i >= 0; i--) {\n    for (let j = i; j < n; j++) {\n      if (s[i] === s[j] && (j - i <= 2 || dp[i + 1][j - 1])) {\n        dp[i][j] = true;\n        count++;\n      }\n    }\n  }\n  return count;\n}",
        "codeTS": "function countSubstringsDP(s: string): number {\n  const n = s.length;\n  let count = 0;\n  const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));\n\n  for (let i = n - 1; i >= 0; i--) {\n    for (let j = i; j < n; j++) {\n      if (s[i] === s[j] && (j - i <= 2 || dp[i + 1][j - 1])) {\n        dp[i][j] = true;\n        count++;\n      }\n    }\n  }\n  return count;\n}",
        "lineByLine": [
          "Line 4: Allocate N x N matrix.",
          "Line 6-12: Bottom-up iteration ensures dp[i+1][j-1] is computed before dp[i][j].",
          "Line 9: If valid palindrome, mark true and increment count.",
          "Line 14: Return total count."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s = \"abc\"",
            "action": "diag i=j (a, b, c)",
            "result": "count = 3"
          },
          {
            "step": 2,
            "state": "len 2: \"ab\", \"bc\"",
            "action": "mismatch",
            "result": "count = 3"
          },
          {
            "step": 3,
            "state": "len 3: \"abc\"",
            "action": "mismatch",
            "result": "Final count 3"
          }
        ],
        "complexityDerivation": "Evaluates N(N+1)/2 substrings -> O(N^2) time and O(N^2) auxiliary matrix."
      },
      {
        "name": "Approach 2: Expand Around Centers Counting (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N²)",
        "spaceComplexity": "O(1)",
        "summary": "Count expanding palindromes from each of the 2N-1 centers using O(1) space.",
        "intuition": "Each valid outward step from a center represents one unique palindromic substring.",
        "codeJS": "function countSubstrings(s) {\n  let count = 0;\n\n  function countPalindromes(l, r) {\n    let subCount = 0;\n    while (l >= 0 && r < s.length && s[l] === s[r]) {\n      subCount++;\n      l--;\n      r++;\n    }\n    return subCount;\n  }\n\n  for (let i = 0; i < s.length; i++) {\n    count += countPalindromes(i, i);     // Odd length centers\n    count += countPalindromes(i, i + 1); // Even length centers\n  }\n\n  return count;\n}",
        "codeTS": "function countSubstrings(s: string): number {\n  let count = 0;\n\n  function countPalindromes(l: number, r: number): number {\n    let subCount = 0;\n    while (l >= 0 && r < s.length && s[l] === s[r]) {\n      subCount++;\n      l--;\n      r++;\n    }\n    return subCount;\n  }\n\n  for (let i = 0; i < s.length; i++) {\n    count += countPalindromes(i, i);\n    count += countPalindromes(i, i + 1);\n  }\n\n  return count;\n}",
        "lineByLine": [
          "Line 2: Accumulator count initialized to 0.",
          "Line 4-12: countPalindromes increments count as long as window expands symmetrically.",
          "Line 14-17: Test all odd centers (i, i) and even centers (i, i+1).",
          "Line 19: Return final count."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s = \"aaa\"",
            "action": "i=0: odd \"a\"(1), even \"aa\"(1)",
            "result": "subtotal 2"
          },
          {
            "step": 2,
            "state": "i=1",
            "action": "odd \"a\"(1), \"aaa\"(1), even \"aa\"(1)",
            "result": "subtotal 3"
          },
          {
            "step": 3,
            "state": "i=2",
            "action": "odd \"a\"(1)",
            "result": "subtotal 1"
          },
          {
            "step": 4,
            "state": "Total",
            "action": "2 + 3 + 1",
            "result": "Returns 6"
          }
        ],
        "complexityDerivation": "2N - 1 centers expanded at most N steps -> O(N^2) time with strictly O(1) auxiliary space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "2D DP Matrix",
        "time": "O(N²)",
        "space": "O(N²)",
        "pros": "Precomputes all ranges for fast queries",
        "cons": "Allocates N^2 booleans"
      },
      {
        "approach": "Expand Centers",
        "time": "O(N²)",
        "space": "O(1)",
        "pros": "Zero memory allocations, faster runtime in practice",
        "cons": "Cannot answer arbitrary range queries in O(1)"
      }
    ],
    "interviewPitch": "To count palindromic substrings, we observe that every palindrome expands outwards from a center. There are 2N - 1 possible centers: N single-character centers for odd-length palindromes, and N - 1 pairs of adjacent characters for even-length palindromes. Expanding outward while characters match gives us all palindromic substrings in O(N^2) time and O(1) auxiliary space.",
    "followUps": [
      {
        "question": "What is the maximum number of palindromic substrings in a string of length N?",
        "answer": "N*(N+1)/2 when all characters are identical (e.g., \"aaaa...\")."
      }
    ],
    "recallQuiz": {
      "question": "Why does expanding outward from centers yield the total count of palindromes?",
      "options": [
        "Because every palindromic substring has exactly one unique center",
        "Because substrings must have odd length",
        "Because strings are immutable in JavaScript",
        "Because it sorts the characters first"
      ],
      "correctIndex": 0,
      "explanation": "Every palindrome has a unique center: odd lengths have a center character, and even lengths have a center gap between two characters."
    }
  },
  "107": {
    "id": 107,
    "title": "Decode Ways",
    "difficulty": "Medium",
    "pattern": "DP - 1D",
    "day": 64,
    "leetcodeUrl": "https://leetcode.com/problems/decode-ways/",
    "summary": "A message containing digits from A-Z (1-26). Find total number of ways to decode it.",
    "prerequisites": [
      "1D DP with lookback 1 and 2",
      "String character slicing"
    ],
    "problemStatement": "A message containing letters from A-Z can be encoded into numbers using the mapping 'A' -> \"1\", ..., 'Z' -> \"26\". Given a string s containing only digits, return the number of ways to decode it.",
    "approaches": [
      {
        "name": "Approach 1: Top-Down Recursion with Memoization (Improved)",
        "badge": "Improved / Memoized",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "summary": "Recursively decode from index i using a memoization table.",
        "intuition": "At index i, if s[i] !== 0, decode single digit (recurse to i+1). If two digits s[i...i+1] <= 26, decode pair (recurse to i+2).",
        "codeJS": "function numDecodingsMemo(s) {\n  const memo = new Map();\n\n  function dfs(index) {\n    if (index === s.length) return 1;\n    if (s[index] === '0') return 0;\n    if (memo.has(index)) return memo.get(index);\n\n    let res = dfs(index + 1);\n    if (index + 1 < s.length) {\n      const twoDigit = parseInt(s.substring(index, index + 2), 10);\n      if (twoDigit >= 10 && twoDigit <= 26) {\n        res += dfs(index + 2);\n      }\n    }\n    memo.set(index, res);\n    return res;\n  }\n\n  return dfs(0);\n}",
        "codeTS": "function numDecodingsMemo(s: string): number {\n  const memo = new Map<number, number>();\n\n  function dfs(index: number): number {\n    if (index === s.length) return 1;\n    if (s[index] === '0') return 0;\n    if (memo.has(index)) return memo.get(index)!;\n\n    let res = dfs(index + 1);\n    if (index + 1 < s.length) {\n      const twoDigit = parseInt(s.substring(index, index + 2), 10);\n      if (twoDigit >= 10 && twoDigit <= 26) {\n        res += dfs(index + 2);\n      }\n    }\n    memo.set(index, res);\n    return res;\n  }\n\n  return dfs(0);\n}",
        "lineByLine": [
          "Line 4-5: Base cases: index at end of string counts as 1 valid decoding; leading zero is invalid (0).",
          "Line 6: Return cached value if already computed.",
          "Line 8: Branch 1: Single digit decode.",
          "Line 9-13: Branch 2: Two digit decode if value between 10 and 26.",
          "Line 14-15: Cache and return."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s = \"226\"",
            "action": "dfs(0): s[0]='2'",
            "result": "branches to dfs(1) and dfs(2)"
          },
          {
            "step": 2,
            "state": "dfs(2): s[2]='6'",
            "action": "dfs(3) = 1",
            "result": "memo[2] = 1"
          },
          {
            "step": 3,
            "state": "dfs(1): s[1]='2'",
            "action": "dfs(2) + dfs(3) = 1 + 1 = 2",
            "result": "memo[1] = 2"
          },
          {
            "step": 4,
            "state": "dfs(0)",
            "action": "dfs(1) + dfs(2) = 2 + 1 = 3",
            "result": "Returns 3"
          }
        ],
        "complexityDerivation": "N distinct index states visited once -> O(N) time and O(N) recursion stack memory."
      },
      {
        "name": "Approach 2: Bottom-Up Space-Optimized DP (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Compute ways using two rolling registers similar to Fibonacci.",
        "intuition": "Ways to decode up to i depends only on valid decodings ending at i-1 and valid two-character decodings ending at i-2.",
        "codeJS": "function numDecodings(s) {\n  if (!s || s[0] === '0') return 0;\n  const n = s.length;\n  let prev2 = 1; // dp[i-2]\n  let prev1 = 1; // dp[i-1]\n\n  for (let i = 1; i < n; i++) {\n    let current = 0;\n    const one = parseInt(s[i], 10);\n    const two = parseInt(s.substring(i - 1, i + 1), 10);\n\n    if (one >= 1 && one <= 9) {\n      current += prev1;\n    }\n    if (two >= 10 && two <= 26) {\n      current += prev2;\n    }\n\n    prev2 = prev1;\n    prev1 = current;\n  }\n\n  return prev1;\n}",
        "codeTS": "function numDecodings(s: string): number {\n  if (!s || s[0] === '0') return 0;\n  const n = s.length;\n  let prev2 = 1;\n  let prev1 = 1;\n\n  for (let i = 1; i < n; i++) {\n    let current = 0;\n    const one = parseInt(s[i], 10);\n    const two = parseInt(s.substring(i - 1, i + 1), 10);\n\n    if (one >= 1 && one <= 9) {\n      current += prev1;\n    }\n    if (two >= 10 && two <= 26) {\n      current += prev2;\n    }\n\n    prev2 = prev1;\n    prev1 = current;\n  }\n\n  return prev1;\n}",
        "lineByLine": [
          "Line 2: If string is empty or starts with \"0\", it cannot be decoded.",
          "Line 4-5: Initialize prev2=1 and prev1=1.",
          "Line 7-18: At each digit, add prev1 if single digit is 1-9; add prev2 if two digits are 10-26.",
          "Line 20: Return prev1 holding total ways."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s = \"12\", prev2=1, prev1=1",
            "action": "i=1: one=2 (valid), two=12 (valid)",
            "result": "current = 1 + 1 = 2"
          },
          {
            "step": 2,
            "state": "Update",
            "action": "prev2=1, prev1=2",
            "result": "Returns 2"
          }
        ],
        "complexityDerivation": "Iterates through string of length N -> O(N) time with O(1) auxiliary variables."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Top-Down Memoized",
        "time": "O(N)",
        "space": "O(N)",
        "pros": "Direct transition logic",
        "cons": "Recursion call stack frames"
      },
      {
        "approach": "Bottom-Up Space-Optimized",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Constant space, fast iterative loops",
        "cons": "Must handle edge cases carefully"
      }
    ],
    "interviewPitch": "Decode Ways resembles a constrained Fibonacci sequence: to decode up to index i, we can take a single digit (valid if 1-9, adding dp[i-1] ways) or take two digits (valid if 10-26, adding dp[i-2] ways). If a zero cannot be paired with a preceding 1 or 2, decoding becomes impossible and yields 0. Because we only need the last two states, we compress space to O(1), achieving O(N) time and O(1) auxiliary memory.",
    "followUps": [
      {
        "question": "What if asterisk wildcard characters exist?",
        "answer": "Decode Ways II: Multiply possibilities based on wildcard matches (* as 1-9 can map to 9 single digits, and combinations like 1* map to 9 numbers, 2* to 6 numbers)."
      }
    ],
    "recallQuiz": {
      "question": "When does a substring ending at index i contribute dp[i-2] to the current count?",
      "options": [
        "When the two-digit number formed by s[i-1...i] is between 10 and 26 inclusive",
        "Whenever s[i] is even",
        "When s[i-1] is not zero",
        "When s is length > 2"
      ],
      "correctIndex": 0,
      "explanation": "Only numbers from 10 to 26 represent valid two-character alphabet mappings (J through Z)."
    }
  },
  "108": {
    "id": 108,
    "title": "Coin Change",
    "difficulty": "Medium",
    "pattern": "DP - 1D",
    "day": 64,
    "leetcodeUrl": "https://leetcode.com/problems/coin-change/",
    "summary": "Find the fewest number of coins that you need to make up a given amount, or -1 if impossible.",
    "prerequisites": [
      "Unbounded Knapsack DP",
      "Min element recurrence"
    ],
    "problemStatement": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins needed to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    "approaches": [
      {
        "name": "Approach 1: Top-Down Recursion with Memoization (Improved)",
        "badge": "Improved / Memoized",
        "timeComplexity": "O(amount * coins.length)",
        "spaceComplexity": "O(amount)",
        "summary": "Recursive function minCoins(rem) with a memoization table.",
        "intuition": "At remaining amount rem, test every coin c <= rem and choose min(1 + minCoins(rem - c)).",
        "codeJS": "function coinChangeMemo(coins, amount) {\n  const memo = new Map();\n\n  function dfs(rem) {\n    if (rem === 0) return 0;\n    if (rem < 0) return -1;\n    if (memo.has(rem)) return memo.get(rem);\n\n    let minCoins = Infinity;\n    for (const c of coins) {\n      const sub = dfs(rem - c);\n      if (sub >= 0) {\n        minCoins = Math.min(minCoins, 1 + sub);\n      }\n    }\n\n    const res = minCoins === Infinity ? -1 : minCoins;\n    memo.set(rem, res);\n    return res;\n  }\n\n  return dfs(amount);\n}",
        "codeTS": "function coinChangeMemo(coins: number[], amount: number): number {\n  const memo = new Map<number, number>();\n\n  function dfs(rem: number): number {\n    if (rem === 0) return 0;\n    if (rem < 0) return -1;\n    if (memo.has(rem)) return memo.get(rem)!;\n\n    let minCoins = Infinity;\n    for (const c of coins) {\n      const sub = dfs(rem - c);\n      if (sub >= 0) {\n        minCoins = Math.min(minCoins, 1 + sub);\n      }\n    }\n\n    const res = minCoins === Infinity ? -1 : minCoins;\n    memo.set(rem, res);\n    return res;\n  }\n\n  return dfs(amount);\n}",
        "lineByLine": [
          "Line 4-6: Base cases: rem === 0 needs 0 coins; rem < 0 is invalid (-1); cache hit returns memo value.",
          "Line 8-14: Iterate over each denomination and find minimum recursive result.",
          "Line 16-18: Cache and return."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "coins=[1, 2, 5], amount=11",
            "action": "rem=11, tries 5",
            "result": "branches to dfs(6)"
          },
          {
            "step": 2,
            "state": "rem=6",
            "action": "tries 5 -> dfs(1)",
            "result": "dfs(1)=1"
          },
          {
            "step": 3,
            "state": "Resolve",
            "action": "1 + 1 + 1",
            "result": "Optimal coins = 3 (5 + 5 + 1)"
          }
        ],
        "complexityDerivation": "amount states, each trying C coins -> O(amount * C) time and O(amount) stack memory."
      },
      {
        "name": "Approach 2: Bottom-Up Dynamic Programming Array (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(amount * coins.length)",
        "spaceComplexity": "O(amount)",
        "summary": "Build dp array of size amount + 1 where dp[i] = min(dp[i], 1 + dp[i - c]).",
        "intuition": "Compute the minimum coins needed for every sub-amount from 1 up to amount.",
        "codeJS": "function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(amount + 1);\n  dp[0] = 0; // 0 coins to make amount 0\n\n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i - c >= 0) {\n        dp[i] = Math.min(dp[i], 1 + dp[i - c]);\n      }\n    }\n  }\n\n  return dp[amount] > amount ? -1 : dp[amount];\n}",
        "codeTS": "function coinChange(coins: number[], amount: number): number {\n  const dp: number[] = new Array(amount + 1).fill(amount + 1);\n  dp[0] = 0;\n\n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i - c >= 0) {\n        dp[i] = Math.min(dp[i], 1 + dp[i - c]);\n      }\n    }\n  }\n\n  return dp[amount] > amount ? -1 : dp[amount];\n}",
        "lineByLine": [
          "Line 2: Initialize dp array with amount + 1 (representing infinity).",
          "Line 3: Base case: amount 0 requires 0 coins.",
          "Line 5-11: Outer loop tests each target amount i; inner loop tests every coin denomination c.",
          "Line 13: If dp[amount] was never reached, return -1; otherwise return dp[amount]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "coins=[1,2,5], amount=3",
            "action": "dp[0]=0, dp[1]=1, dp[2]=1",
            "result": "base set"
          },
          {
            "step": 2,
            "state": "i=3",
            "action": "c=1: 1+dp[2]=2; c=2: 1+dp[1]=2",
            "result": "dp[3] = 2"
          },
          {
            "step": 3,
            "state": "Done",
            "action": "return dp[3]",
            "result": "Returns 2"
          }
        ],
        "complexityDerivation": "Outer loop runs amount times, inner loop runs C times -> O(amount * C) time and O(amount) array memory."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Top-Down Memoized",
        "time": "O(A * C)",
        "space": "O(A)",
        "pros": "Only visits reachable states",
        "cons": "Recursion overhead"
      },
      {
        "approach": "Bottom-Up DP Table",
        "time": "O(A * C)",
        "space": "O(A)",
        "pros": "Iterative, cache friendly, no stack limit",
        "cons": "Calculates all values 1..A"
      }
    ],
    "interviewPitch": "Coin Change is an unbounded knapsack problem. Greedy fails here (for instance, with coins [1, 3, 4] and amount 6, greedy takes 4+1+1=3 coins, while optimal is 3+3=2 coins). We use Bottom-Up Dynamic Programming where dp[i] represents the minimum coins needed for amount i. We initialize dp with amount + 1 and dp[0] = 0. For each amount from 1 to total, and for each coin c, dp[i] = min(dp[i], 1 + dp[i - c]). This runs in O(amount * C) time and O(amount) space.",
    "followUps": [
      {
        "question": "What if you need to return the actual coins used?",
        "answer": "Maintain a parent array parent[i] recording which coin was used to achieve the optimal dp[i], then backtrack from amount to 0."
      }
    ],
    "recallQuiz": {
      "question": "Why does a greedy approach (taking the largest coin first) fail for Coin Change?",
      "options": [
        "Because choosing the largest coin can leave an amount that requires more small coins than an alternative combination",
        "Because coins can be negative",
        "Because amounts are floating point numbers",
        "Because array is not sorted"
      ],
      "correctIndex": 0,
      "explanation": "With denominations [1, 3, 4] and target 6, greedy picks 4 + 1 + 1 (3 coins), whereas the optimal choice is 3 + 3 (2 coins)."
    }
  },
  "109": {
    "id": 109,
    "title": "Maximum Product Subarray",
    "difficulty": "Medium",
    "pattern": "DP - 1D",
    "day": 65,
    "leetcodeUrl": "https://leetcode.com/problems/maximum-product-subarray/",
    "summary": "Find a contiguous non-empty subarray within an array that has the largest product.",
    "prerequisites": [
      "Dual state tracking",
      "Handling negative product flips"
    ],
    "problemStatement": "Given an integer array `nums`, find a contiguous non-empty subarray that has the largest product, and return the product.",
    "approaches": [
      {
        "name": "Approach 1: Brute Force All Subarrays (Baseline)",
        "badge": "Baseline / Brute-Force",
        "timeComplexity": "O(N²)",
        "spaceComplexity": "O(1)",
        "summary": "Examine product of every contiguous subarray using nested loops.",
        "intuition": "Start at each index i and calculate running product as j advances to the end.",
        "codeJS": "function maxProductBrute(nums) {\n  let maxProd = -Infinity;\n  for (let i = 0; i < nums.length; i++) {\n    let current = 1;\n    for (let j = i; j < nums.length; j++) {\n      current *= nums[j];\n      maxProd = Math.max(maxProd, current);\n    }\n  }\n  return maxProd;\n}",
        "codeTS": "function maxProductBrute(nums: number[]): number {\n  let maxProd = -Infinity;\n  for (let i = 0; i < nums.length; i++) {\n    let current = 1;\n    for (let j = i; j < nums.length; j++) {\n      current *= nums[j];\n      maxProd = Math.max(maxProd, current);\n    }\n  }\n  return maxProd;\n}",
        "lineByLine": [
          "Line 2: Track global maximum product initialized to -Infinity.",
          "Line 3-8: Outer loop fixes start index; inner loop multiplies subsequent elements.",
          "Line 10: Return highest observed product."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [2, 3, -2, 4]",
            "action": "i=0: 2, 6, -12, -48",
            "result": "max = 6"
          },
          {
            "step": 2,
            "state": "i=1",
            "action": "3, -6, -24",
            "result": "max = 6"
          },
          {
            "step": 3,
            "state": "i=3",
            "action": "4",
            "result": "max = 6"
          }
        ],
        "complexityDerivation": "Nested iterations over N elements -> O(N^2) time and O(1) space."
      },
      {
        "name": "Approach 2: Dual Min & Max State Tracking (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Maintain both current maximum and current minimum product at each step.",
        "intuition": "A negative number multiplied by the minimum negative product becomes a large positive product! Thus, we must track both min and max.",
        "codeJS": "function maxProduct(nums) {\n  let res = nums[0];\n  let curMin = 1;\n  let curMax = 1;\n\n  for (const n of nums) {\n    if (n === 0) {\n      curMin = 1;\n      curMax = 1;\n      res = Math.max(res, 0);\n      continue;\n    }\n    const tempMax = curMax * n;\n    curMax = Math.max(n * curMax, n * curMin, n);\n    curMin = Math.min(tempMax, n * curMin, n);\n    res = Math.max(res, curMax);\n  }\n\n  return res;\n}",
        "codeTS": "function maxProduct(nums: number[]): number {\n  let res = nums[0];\n  let curMin = 1;\n  let curMax = 1;\n\n  for (const n of nums) {\n    if (n === 0) {\n      curMin = 1;\n      curMax = 1;\n      res = Math.max(res, 0);\n      continue;\n    }\n    const tempMax = curMax * n;\n    curMax = Math.max(n * curMax, n * curMin, n);\n    curMin = Math.min(tempMax, n * curMin, n);\n    res = Math.max(res, curMax);\n  }\n\n  return res;\n}",
        "lineByLine": [
          "Line 2-4: Initialize result to nums[0] and running min/max to 1.",
          "Line 7-11: Zero resets running products to 1 while recording 0 as candidate.",
          "Line 12: Cache tempMax because curMax is modified in the next line.",
          "Line 13-14: Compute new curMax and curMin taking max/min of {n*curMax, n*curMin, n}.",
          "Line 15: Update global maximum res."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums=[-2, 3, -4]",
            "action": "n=-2: curMax=-2, curMin=-2",
            "result": "res = -2"
          },
          {
            "step": 2,
            "state": "n=3",
            "action": "curMax=max(3, -6)=3, curMin=min(3, -6)=-6",
            "result": "res = 3"
          },
          {
            "step": 3,
            "state": "n=-4",
            "action": "curMax=max(-4, -12, 24)=24, curMin=min(-4, -12, 24)=-12",
            "result": "res = 24"
          }
        ],
        "complexityDerivation": "Single pass visiting each element once -> O(N) time with O(1) auxiliary variables."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Brute Force Nested",
        "time": "O(N²)",
        "space": "O(1)",
        "pros": "Trivial logic",
        "cons": "TLE on large arrays"
      },
      {
        "approach": "Dual Min/Max Tracking",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Linear single pass, handles negative flips elegantly",
        "cons": "Must handle 0 resets and variable caching"
      }
    ],
    "interviewPitch": "In Maximum Product Subarray, negative numbers can flip a minimum product into a maximum product when multiplied by another negative value. Therefore, at each step we track both the maximum product and the minimum product achievable up to that index. For each element, the new maximum and minimum are derived from {n, n * curMax, n * curMin}. This runs in O(N) time with strictly O(1) auxiliary space.",
    "followUps": [
      {
        "question": "What happens when elements are zeroes?",
        "answer": "Zero resets the current running contiguous products to 1, effectively partitioning the array into separate subarrays."
      }
    ],
    "recallQuiz": {
      "question": "Why do we need to track both curMin and curMax?",
      "options": [
        "Because multiplying a negative number by curMin (a negative value) can yield the new maximum product",
        "Because JavaScript numbers can overflow",
        "Because zeroes divide the array",
        "Because the array is sorted"
      ],
      "correctIndex": 0,
      "explanation": "Two negative numbers multiplied together produce a positive number; hence the smallest negative product can turn into the greatest positive product."
    }
  },
  "110": {
    "id": 110,
    "title": "Word Break",
    "difficulty": "Medium",
    "pattern": "DP - 1D",
    "day": 65,
    "leetcodeUrl": "https://leetcode.com/problems/word-break/",
    "summary": "Determine if string s can be segmented into space-separated dictionary words.",
    "prerequisites": [
      "1D DP boolean segmentation",
      "Hash Set lookup"
    ],
    "problemStatement": "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.",
    "approaches": [
      {
        "name": "Approach 1: Top-Down Recursion with Memoization (Improved)",
        "badge": "Improved / Memoized",
        "timeComplexity": "O(N² * M)",
        "spaceComplexity": "O(N)",
        "summary": "Recursive function canBreak(start) with a memoization table.",
        "intuition": "Check if any prefix s[start...end] is in wordDict and recursively solve canBreak(end).",
        "codeJS": "function wordBreakMemo(s, wordDict) {\n  const dict = new Set(wordDict);\n  const memo = new Map();\n\n  function dfs(start) {\n    if (start === s.length) return true;\n    if (memo.has(start)) return memo.get(start);\n\n    for (let end = start + 1; end <= s.length; end++) {\n      const word = s.substring(start, end);\n      if (dict.has(word) && dfs(end)) {\n        memo.set(start, true);\n        return true;\n      }\n    }\n\n    memo.set(start, false);\n    return false;\n  }\n\n  return dfs(0);\n}",
        "codeTS": "function wordBreakMemo(s: string, wordDict: string[]): boolean {\n  const dict = new Set(wordDict);\n  const memo = new Map<number, boolean>();\n\n  function dfs(start: number): boolean {\n    if (start === s.length) return true;\n    if (memo.has(start)) return memo.get(start)!;\n\n    for (let end = start + 1; end <= s.length; end++) {\n      const word = s.substring(start, end);\n      if (dict.has(word) && dfs(end)) {\n        memo.set(start, true);\n        return true;\n      }\n    }\n\n    memo.set(start, false);\n    return false;\n  }\n\n  return dfs(0);\n}",
        "lineByLine": [
          "Line 2: Store wordDict in Set for O(1) average lookup.",
          "Line 5-6: Base case: reached end of string -> valid segmentation.",
          "Line 8-14: Test every substring prefix. If in dict and rest of string can break, cache true.",
          "Line 16-17: If no branch succeeds, cache false and return."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s = \"leetcode\", dict=[\"leet\", \"code\"]",
            "action": "dfs(0): finds \"leet\"",
            "result": "branches to dfs(4)"
          },
          {
            "step": 2,
            "state": "dfs(4)",
            "action": "finds \"code\" -> dfs(8)",
            "result": "dfs(8) === true"
          },
          {
            "step": 3,
            "state": "Resolve",
            "action": "memo[0] = true",
            "result": "Returns true"
          }
        ],
        "complexityDerivation": "N starting states, each scanning up to N substrings -> O(N^2 * M) time where M is substring hashing length."
      },
      {
        "name": "Approach 2: Bottom-Up DP Boolean Array (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N² * M)",
        "spaceComplexity": "O(N)",
        "summary": "dp[i] is true if s[0...i-1] can be segmented into dictionary words.",
        "intuition": "If dp[j] is true and s[j...i] is in wordDict, then dp[i] is true.",
        "codeJS": "function wordBreak(s, wordDict) {\n  const dict = new Set(wordDict);\n  const dp = new Array(s.length + 1).fill(false);\n  dp[0] = true; // empty string is always valid\n\n  for (let i = 1; i <= s.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (dp[j] && dict.has(s.substring(j, i))) {\n        dp[i] = true;\n        break; // found valid split, no need to check further j\n      }\n    }\n  }\n\n  return dp[s.length];\n}",
        "codeTS": "function wordBreak(s: string, wordDict: string[]): boolean {\n  const dict = new Set(wordDict);\n  const dp: boolean[] = new Array(s.length + 1).fill(false);\n  dp[0] = true;\n\n  for (let i = 1; i <= s.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (dp[j] && dict.has(s.substring(j, i))) {\n        dp[i] = true;\n        break;\n      }\n    }\n  }\n\n  return dp[s.length];\n}",
        "lineByLine": [
          "Line 2: Fast Set lookup for dictionary words.",
          "Line 3-4: dp[0] = true represents empty prefix base case.",
          "Line 6-12: Outer loop sets prefix length i; inner loop checks split point j.",
          "Line 14: Return dp[s.length]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s = \"applepenapple\", dict=[\"apple\", \"pen\"]",
            "action": "dp[0]=true, i=5: s[0..5]=\"apple\" in dict",
            "result": "dp[5]=true"
          },
          {
            "step": 2,
            "state": "i=8",
            "action": "dp[5]=true && s[5..8]=\"pen\" in dict",
            "result": "dp[8]=true"
          },
          {
            "step": 3,
            "state": "i=13",
            "action": "dp[8]=true && s[8..13]=\"apple\" in dict",
            "result": "dp[13]=true -> returns true"
          }
        ],
        "complexityDerivation": "Outer loop runs N times, inner loop runs up to N times with substring hashing -> O(N^2 * M) time and O(N) array storage."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Top-Down Memoized",
        "time": "O(N² * M)",
        "space": "O(N)",
        "pros": "Prunes early when path succeeds",
        "cons": "Recursion stack overhead"
      },
      {
        "approach": "Bottom-Up DP Array",
        "time": "O(N² * M)",
        "space": "O(N)",
        "pros": "Iterative, cache friendly, simple state array",
        "cons": "Checks substrings up to length N"
      }
    ],
    "interviewPitch": "Word Break is solved using 1D Dynamic Programming. We define dp[i] as true if the prefix s[0...i-1] can be segmented into words from wordDict. The base case is dp[0] = true for an empty string. For each index i from 1 to s.length, we check all split points j < i. If dp[j] is true and the substring s[j...i] exists in our dictionary Set, we mark dp[i] = true and break early. The answer is dp[s.length], running in O(N^2 * M) time and O(N) space.",
    "followUps": [
      {
        "question": "What if word length in dictionary is at most L?",
        "answer": "We only need to check j down to max(0, i - L), reducing inner loop iterations from N to L, yielding O(N * L) runtime."
      }
    ],
    "recallQuiz": {
      "question": "What is the role of dp[0] = true in Word Break?",
      "options": [
        "It serves as the base case allowing the first dictionary word matching s[0...i] to transition to true",
        "It signifies that the dictionary is empty",
        "It guarantees 1-based indexing",
        "It holds the maximum word length"
      ],
      "correctIndex": 0,
      "explanation": "Without dp[0] = true, the first valid word starting at index 0 would never find a preceding valid split."
    }
  },
  "111": {
    "id": 111,
    "title": "Longest Increasing Subsequence",
    "difficulty": "Medium",
    "pattern": "DP - 1D",
    "day": 66,
    "leetcodeUrl": "https://leetcode.com/problems/longest-increasing-subsequence/",
    "summary": "Find the length of the longest strictly increasing subsequence in an array.",
    "prerequisites": [
      "1D DP recurrence",
      "Binary search patience sorting"
    ],
    "problemStatement": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
    "approaches": [
      {
        "name": "Approach 1: Dynamic Programming Array (Improved)",
        "badge": "Improved / DP Table",
        "timeComplexity": "O(N²)",
        "spaceComplexity": "O(N)",
        "summary": "dp[i] = 1 + max(dp[j]) for all j < i where nums[j] < nums[i].",
        "intuition": "At each index i, look back at all smaller previous elements j and extend the longest subsequence ending at j.",
        "codeJS": "function lengthOfLISDP(nums) {\n  if (nums.length === 0) return 0;\n  const dp = new Array(nums.length).fill(1);\n  let maxLen = 1;\n\n  for (let i = 1; i < nums.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[j] < nums[i]) {\n        dp[i] = Math.max(dp[i], 1 + dp[j]);\n      }\n    }\n    maxLen = Math.max(maxLen, dp[i]);\n  }\n\n  return maxLen;\n}",
        "codeTS": "function lengthOfLISDP(nums: number[]): number {\n  if (nums.length === 0) return 0;\n  const dp: number[] = new Array(nums.length).fill(1);\n  let maxLen = 1;\n\n  for (let i = 1; i < nums.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[j] < nums[i]) {\n        dp[i] = Math.max(dp[i], 1 + dp[j]);\n      }\n    }\n    maxLen = Math.max(maxLen, dp[i]);\n  }\n\n  return maxLen;\n}",
        "lineByLine": [
          "Line 2-3: Initialize dp array with 1 (each individual number is an LIS of length 1).",
          "Line 6-12: For each element i, inspect all prior elements j < i and update dp[i].",
          "Line 14: Return global maximum length."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [10, 9, 2, 5, 3, 7, 101, 18]",
            "action": "i=3 (val 5): j=2 (val 2 < 5)",
            "result": "dp[3] = 1 + dp[2] = 2"
          },
          {
            "step": 2,
            "state": "i=5 (val 7)",
            "action": "nums[3]=5 < 7",
            "result": "dp[5] = 1 + 2 = 3"
          },
          {
            "step": 3,
            "state": "i=6 (val 101)",
            "action": "nums[5]=7 < 101",
            "result": "dp[6] = 1 + 3 = 4"
          }
        ],
        "complexityDerivation": "Nested loops execute N*(N-1)/2 comparisons -> O(N^2) time and O(N) space."
      },
      {
        "name": "Approach 2: Patience Sorting with Binary Search (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "summary": "Maintain tails array where tails[i] stores smallest tail of all increasing subsequences of length i+1.",
        "intuition": "By keeping the smallest possible tail for each subsequence length, we maximize chances of extending it. Binary search finds placement in O(log N).",
        "codeJS": "function lengthOfLIS(nums) {\n  const tails = [];\n\n  for (const x of nums) {\n    let l = 0, r = tails.length;\n    while (l < r) {\n      const mid = (l + r) >> 1;\n      if (tails[mid] < x) {\n        l = mid + 1;\n      } else {\n        r = mid;\n      }\n    }\n    tails[l] = x;\n  }\n\n  return tails.length;\n}",
        "codeTS": "function lengthOfLIS(nums: number[]): number {\n  const tails: number[] = [];\n\n  for (const x of nums) {\n    let l = 0, r = tails.length;\n    while (l < r) {\n      const mid = (l + r) >> 1;\n      if (tails[mid] < x) {\n        l = mid + 1;\n      } else {\n        r = mid;\n      }\n    }\n    tails[l] = x;\n  }\n\n  return tails.length;\n}",
        "lineByLine": [
          "Line 2: tails array stores minimum ending values for each subsequence length.",
          "Line 4-13: Binary search (bisect_left) finds first element in tails >= x.",
          "Line 14: If x is larger than all elements, it appends; otherwise it replaces the existing tail to form a tighter bound.",
          "Line 17: Length of tails equals length of LIS."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "x=10",
            "action": "tails = [10]",
            "result": "len 1"
          },
          {
            "step": 2,
            "state": "x=9",
            "action": "replaces 10: tails = [9]",
            "result": "tighter tail"
          },
          {
            "step": 3,
            "state": "x=2",
            "action": "replaces 9: tails = [2]",
            "result": "tighter tail"
          },
          {
            "step": 4,
            "state": "x=5",
            "action": "appends: tails = [2, 5]",
            "result": "len 2"
          },
          {
            "step": 5,
            "state": "x=7",
            "action": "appends: tails = [2, 5, 7]",
            "result": "len 3"
          }
        ],
        "complexityDerivation": "N elements, each located via binary search in O(log N) -> O(N log N) time and O(N) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "O(N²) DP Table",
        "time": "O(N²)",
        "space": "O(N)",
        "pros": "Intuitive recurrence",
        "cons": "Quadratic time fails on N=100,000"
      },
      {
        "approach": "Patience Sort Binary Search",
        "time": "O(N log N)",
        "space": "O(N)",
        "pros": "Optimal logarithmic speed per element",
        "cons": "Tails array does not hold the actual sequence items in order"
      }
    ],
    "interviewPitch": "While standard DP solves LIS in O(N^2) by comparing each element with all previous elements, we optimize to O(N log N) using Patience Sorting. We maintain an array tails where tails[i] stores the smallest ending element of any increasing subsequence of length i+1. For each number, we binary search for its position in tails: if it is larger than all tails, we append it; otherwise, we replace the first element >= x with x to keep our tails as small as possible. The length of tails is our LIS.",
    "followUps": [
      {
        "question": "Does the tails array represent the actual LIS sequence?",
        "answer": "No, tails preserves lengths and optimal boundaries, not the original subsequence ordering. To reconstruct the sequence, store predecessor pointers."
      }
    ],
    "recallQuiz": {
      "question": "Why do we replace tails[i] with x when x <= tails[i]?",
      "options": [
        "Because a smaller tail element makes it easier for future elements to extend the subsequence",
        "Because tails must remain unsorted",
        "Because it decreases memory consumption",
        "Because JavaScript forbids duplicates"
      ],
      "correctIndex": 0,
      "explanation": "A smaller tail value has a strictly greater chance of being extended by subsequent numbers than a larger tail value."
    }
  },
  "112": {
    "id": 112,
    "title": "Partition Equal Subset Sum",
    "difficulty": "Medium",
    "pattern": "DP - 1D",
    "day": 66,
    "leetcodeUrl": "https://leetcode.com/problems/partition-equal-subset-sum/",
    "summary": "Determine if an array can be partitioned into two subsets with equal sum.",
    "prerequisites": [
      "0/1 Knapsack DP",
      "Reverse array iteration for 1D state"
    ],
    "problemStatement": "Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or `false` otherwise.",
    "approaches": [
      {
        "name": "Approach 1: 2D 0/1 Knapsack DP Table (Improved)",
        "badge": "Improved / 2D DP",
        "timeComplexity": "O(N * target)",
        "spaceComplexity": "O(N * target)",
        "summary": "dp[i][s] is true if sum s can be formed using a subset of the first i numbers.",
        "intuition": "If sum(nums) is odd, partition is impossible. Target is sum / 2. At each number, either include it or exclude it.",
        "codeJS": "function canPartition2D(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  if (total % 2 !== 0) return false;\n  const target = total / 2;\n  const n = nums.length;\n  const dp = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(false));\n\n  for (let i = 0; i <= n; i++) dp[i][0] = true;\n\n  for (let i = 1; i <= n; i++) {\n    for (let s = 1; s <= target; s++) {\n      if (s < nums[i - 1]) {\n        dp[i][s] = dp[i - 1][s];\n      } else {\n        dp[i][s] = dp[i - 1][s] || dp[i - 1][s - nums[i - 1]];\n      }\n    }\n  }\n\n  return dp[n][target];\n}",
        "codeTS": "function canPartition2D(nums: number[]): boolean {\n  const total = nums.reduce((a, b) => a + b, 0);\n  if (total % 2 !== 0) return false;\n  const target = total / 2;\n  const n = nums.length;\n  const dp: boolean[][] = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(false));\n\n  for (let i = 0; i <= n; i++) dp[i][0] = true;\n\n  for (let i = 1; i <= n; i++) {\n    for (let s = 1; s <= target; s++) {\n      if (s < nums[i - 1]) {\n        dp[i][s] = dp[i - 1][s];\n      } else {\n        dp[i][s] = dp[i - 1][s] || dp[i - 1][s - nums[i - 1]];\n      }\n    }\n  }\n\n  return dp[n][target];\n}",
        "lineByLine": [
          "Line 2-3: Sum must be even; odd sum immediately returns false.",
          "Line 4-6: Target is total / 2. Allocate (n+1) x (target+1) boolean grid.",
          "Line 7: Base case: sum 0 is always achievable with an empty subset.",
          "Line 9-16: 0/1 knapsack transition: exclude element (dp[i-1][s]) or include element (dp[i-1][s - num])."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums=[1, 5, 11, 5]",
            "action": "total = 22 -> target = 11",
            "result": "even sum"
          },
          {
            "step": 2,
            "state": "include 1, 5, 5",
            "action": "1 + 5 + 5 = 11",
            "result": "target 11 reached"
          },
          {
            "step": 3,
            "state": "Result",
            "action": "dp[4][11]",
            "result": "Returns true"
          }
        ],
        "complexityDerivation": "N numbers * target sum -> O(N * target) time and O(N * target) space."
      },
      {
        "name": "Approach 2: 1D Boolean Array with Reverse Traversal (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N * target)",
        "spaceComplexity": "O(target)",
        "summary": "Compress 2D table into a 1D boolean array, updating from target down to num.",
        "intuition": "Iterating backward prevents using the same number multiple times in the same 0/1 knapsack step.",
        "codeJS": "function canPartition(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  if (total % 2 !== 0) return false;\n  const target = total / 2;\n\n  const dp = new Array(target + 1).fill(false);\n  dp[0] = true;\n\n  for (const num of nums) {\n    for (let s = target; s >= num; s--) {\n      if (dp[s - num]) {\n        dp[s] = true;\n      }\n    }\n    if (dp[target]) return true; // Early exit\n  }\n\n  return dp[target];\n}",
        "codeTS": "function canPartition(nums: number[]): boolean {\n  const total = nums.reduce((a, b) => a + b, 0);\n  if (total % 2 !== 0) return false;\n  const target = total / 2;\n\n  const dp: boolean[] = new Array(target + 1).fill(false);\n  dp[0] = true;\n\n  for (const num of nums) {\n    for (let s = target; s >= num; s--) {\n      if (dp[s - num]) {\n        dp[s] = true;\n      }\n    }\n    if (dp[target]) return true;\n  }\n\n  return dp[target];\n}",
        "lineByLine": [
          "Line 2-3: Fast parity check: if sum is odd, return false.",
          "Line 6-7: dp[0] = true represents achievable zero sum.",
          "Line 9-14: CRITICAL: Loop backwards from target down to num so values from the current iteration do not overwrite previous states.",
          "Line 15: Early exit if target is formed."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [1, 5, 11, 5], target = 11",
            "action": "num=1: dp[1]=true",
            "result": "dp = {0, 1}"
          },
          {
            "step": 2,
            "state": "num=5",
            "action": "s=6..5: dp[6]=true, dp[5]=true",
            "result": "dp = {0, 1, 5, 6}"
          },
          {
            "step": 3,
            "state": "num=11",
            "action": "s=11: dp[11-11]=dp[0]=true",
            "result": "dp[11]=true -> Early return true!"
          }
        ],
        "complexityDerivation": "N elements * target states -> O(N * target) time with strictly O(target) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "2D DP Grid",
        "time": "O(N * target)",
        "space": "O(N * target)",
        "pros": "Full decision tree visibility",
        "cons": "Excessive matrix memory allocations"
      },
      {
        "approach": "1D Reverse DP Array",
        "time": "O(N * target)",
        "space": "O(target)",
        "pros": "Optimal space, cache friendly, early exit support",
        "cons": "Must remember to iterate backwards"
      }
    ],
    "interviewPitch": "Partition Equal Subset Sum reduces directly to the classic 0/1 Knapsack problem. If the total array sum is odd, two equal integer partitions cannot exist. Otherwise, our target is totalSum / 2. We use a 1D boolean array dp where dp[s] indicates whether sum s is achievable. Crucially, we iterate the inner loop backwards from target down to num to ensure each number is used at most once. This runs in O(N * target) time and O(target) space.",
    "followUps": [
      {
        "question": "Why MUST the inner loop traverse backwards?",
        "answer": "Forward traversal would allow an element to be added to a sum that was formed using that same element in the same iteration, turning 0/1 knapsack into unbounded knapsack!"
      }
    ],
    "recallQuiz": {
      "question": "What happens if you iterate s forward (from num to target) instead of backward?",
      "options": [
        "The same element can be reused multiple times, turning it into unbounded knapsack",
        "A syntax error occurs",
        "The array gets reversed",
        "Zero division occurs"
      ],
      "correctIndex": 0,
      "explanation": "Backward traversal ensures dp[s - num] represents a state from the previous item, preventing duplicate item reuse."
    }
  },
  "113": {
    "id": 113,
    "title": "Unique Paths",
    "difficulty": "Medium",
    "pattern": "DP - 2D",
    "day": 67,
    "leetcodeUrl": "https://leetcode.com/problems/unique-paths/",
    "summary": "Find the number of possible unique paths for a robot to reach bottom-right from top-left in an m x n grid.",
    "prerequisites": [
      "2D Grid DP",
      "Combinatorics formula (m+n-2 choose m-1)"
    ],
    "problemStatement": "There is an `m x n` grid. Robot starts at top-left corner `(0, 0)` and wants to reach bottom-right corner `(m - 1, n - 1)`. Robot can only move down or right. Return number of possible unique paths.",
    "approaches": [
      {
        "name": "Approach 1: 2D Grid DP Matrix (Improved)",
        "badge": "Improved / 2D DP",
        "timeComplexity": "O(M * N)",
        "spaceComplexity": "O(M * N)",
        "summary": "dp[r][c] = dp[r-1][c] + dp[r][c-1] since robot moves only down or right.",
        "intuition": "Every cell can only be reached from the cell directly above it or the cell directly to its left.",
        "codeJS": "function uniquePaths2D(m, n) {\n  const dp = Array.from({ length: m }, () => new Array(n).fill(1));\n\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      dp[r][c] = dp[r - 1][c] + dp[r][c - 1];\n    }\n  }\n\n  return dp[m - 1][n - 1];\n}",
        "codeTS": "function uniquePaths2D(m: number, n: number): number {\n  const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(1));\n\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      dp[r][c] = dp[r - 1][c] + dp[r][c - 1];\n    }\n  }\n\n  return dp[m - 1][n - 1];\n}",
        "lineByLine": [
          "Line 2: Initialize M x N grid with 1 (first row and first column only have 1 valid path: moving strictly right or down).",
          "Line 4-7: For all other cells (r, c), sum paths from above (dp[r-1][c]) and left (dp[r][c-1]).",
          "Line 9: Return paths to bottom-right cell."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "m=3, n=7",
            "action": "Row 0: all 1s; Col 0: all 1s",
            "result": "base set"
          },
          {
            "step": 2,
            "state": "r=1, c=1",
            "action": "dp[1][1] = 1 + 1 = 2",
            "result": "paths = 2"
          },
          {
            "step": 3,
            "state": "End",
            "action": "dp[2][6]",
            "result": "Returns 28"
          }
        ],
        "complexityDerivation": "Fills M x N cells -> O(M * N) time and O(M * N) space."
      },
      {
        "name": "Approach 2: 1D Rolling Row State Array (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(M * N)",
        "spaceComplexity": "O(N)",
        "summary": "Maintain single row of length n, accumulating paths in O(N) space.",
        "intuition": "Each cell only needs the current row left value and previous row above value.",
        "codeJS": "function uniquePaths(m, n) {\n  const row = new Array(n).fill(1);\n\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      row[c] += row[c - 1]; // row[c] is above, row[c-1] is left\n    }\n  }\n\n  return row[n - 1];\n}",
        "codeTS": "function uniquePaths(m: number, n: number): number {\n  const row: number[] = new Array(n).fill(1);\n\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      row[c] += row[c - 1];\n    }\n  }\n\n  return row[n - 1];\n}",
        "lineByLine": [
          "Line 2: Single row array of length n initialized to 1.",
          "Line 4-7: Loop m - 1 times. row[c] += row[c-1] adds the left cell to the previous row cell in-place.",
          "Line 9: Return row[n - 1]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "m=3, n=3, row=[1, 1, 1]",
            "action": "r=1: c=1 -> 1+1=2, c=2 -> 1+2=3",
            "result": "row = [1, 2, 3]"
          },
          {
            "step": 2,
            "state": "r=2",
            "action": "c=1 -> 2+1=3, c=2 -> 3+3=6",
            "result": "row = [1, 3, 6]"
          },
          {
            "step": 3,
            "state": "End",
            "action": "return row[2]",
            "result": "Returns 6"
          }
        ],
        "complexityDerivation": "(M - 1) * (N - 1) additions -> O(M * N) time with O(N) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "2D Matrix DP",
        "time": "O(M * N)",
        "space": "O(M * N)",
        "pros": "Maps visually to grid",
        "cons": "Allocates full matrix"
      },
      {
        "approach": "1D Rolling Row DP",
        "time": "O(M * N)",
        "space": "O(N)",
        "pros": "Compresses space to single row",
        "cons": "Overwrites row values"
      }
    ],
    "interviewPitch": "In Unique Paths, the robot can only move right or down. Therefore, the number of paths to cell (r, c) is the sum of paths from cell (r-1, c) and cell (r, c-1). We initialize the first row and column to 1. To optimize space, we compress the 2D grid into a single 1D array of size N where row[c] += row[c - 1]. This reduces auxiliary space from O(M * N) to O(N) while maintaining O(M * N) runtime.",
    "followUps": [
      {
        "question": "Can this be solved in O(min(M, N)) time?",
        "answer": "Yes! Using combinatorics: total steps = (m-1) + (n-1). We need to choose (m-1) down moves out of total steps: C(m+n-2, m-1) calculated in O(min(M, N)) time and O(1) space."
      }
    ],
    "recallQuiz": {
      "question": "What mathematical formula calculates Unique Paths in O(1) auxiliary space?",
      "options": [
        "Combinations: (m + n - 2)! / ((m - 1)! * (n - 1)!)",
        "Permutations: (m * n)!",
        "Fibonacci(m + n)",
        "Euler Totient"
      ],
      "correctIndex": 0,
      "explanation": "The robot must make exactly (m - 1) down moves and (n - 1) right moves in any order, which is the binomial coefficient C(m + n - 2, m - 1)."
    }
  },
  "114": {
    "id": 114,
    "title": "Longest Common Subsequence",
    "difficulty": "Medium",
    "pattern": "DP - 2D",
    "day": 67,
    "leetcodeUrl": "https://leetcode.com/problems/longest-common-subsequence/",
    "summary": "Find the length of the longest subsequence present in both string text1 and text2.",
    "prerequisites": [
      "2D Matrix DP",
      "Character matching vs branch elimination"
    ],
    "problemStatement": "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
    "approaches": [
      {
        "name": "Approach 1: 2D Grid DP Table (Improved)",
        "badge": "Improved / 2D DP",
        "timeComplexity": "O(M * N)",
        "spaceComplexity": "O(M * N)",
        "summary": "dp[i][j] stores LCS of text1[0...i-1] and text2[0...j-1].",
        "intuition": "If text1[i-1] === text2[j-1], chars match: 1 + dp[i-1][j-1]. Otherwise, max(dp[i-1][j], dp[i][j-1]).",
        "codeJS": "function longestCommonSubsequence2D(text1, text2) {\n  const m = text1.length;\n  const n = text2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) {\n        dp[i][j] = 1 + dp[i - 1][j - 1];\n      } else {\n        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n      }\n    }\n  }\n\n  return dp[m][n];\n}",
        "codeTS": "function longestCommonSubsequence2D(text1: string, text2: string): number {\n  const m = text1.length;\n  const n = text2.length;\n  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) {\n        dp[i][j] = 1 + dp[i - 1][j - 1];\n      } else {\n        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n      }\n    }\n  }\n\n  return dp[m][n];\n}",
        "lineByLine": [
          "Line 4: Allocate (m+1) x (n+1) grid filled with 0.",
          "Line 6-13: If chars match, extend diagonal match by 1; otherwise take max from dropping one char from text1 or text2.",
          "Line 15: Return dp[m][n]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "text1=\"abcde\", text2=\"ace\"",
            "action": "i=1(a), j=1(a): match!",
            "result": "dp[1][1] = 1"
          },
          {
            "step": 2,
            "state": "i=3(c), j=2(c)",
            "action": "match! 1 + dp[2][1] = 2",
            "result": "dp[3][2] = 2"
          },
          {
            "step": 3,
            "state": "i=5(e), j=3(e)",
            "action": "match! 1 + dp[4][2] = 3",
            "result": "Returns 3 (\"ace\")"
          }
        ],
        "complexityDerivation": "Fills (M + 1) * (N + 1) cells -> O(M * N) time and O(M * N) memory."
      },
      {
        "name": "Approach 2: Space-Optimized Dual Rows (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(M * N)",
        "spaceComplexity": "O(min(M, N))",
        "summary": "Only two rows (prev and curr) are needed at any point during computation.",
        "intuition": "Row i only references cells from row i and row i-1.",
        "codeJS": "function longestCommonSubsequence(text1, text2) {\n  if (text1.length < text2.length) {\n    [text1, text2] = [text2, text1]; // Ensure text2 is shorter for O(min(M, N)) space\n  }\n  const n = text2.length;\n  let prev = new Array(n + 1).fill(0);\n  let curr = new Array(n + 1).fill(0);\n\n  for (let i = 1; i <= text1.length; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) {\n        curr[j] = 1 + prev[j - 1];\n      } else {\n        curr[j] = Math.max(prev[j], curr[j - 1]);\n      }\n    }\n    prev = [...curr];\n  }\n\n  return curr[n];\n}",
        "codeTS": "function longestCommonSubsequence(text1: string, text2: string): number {\n  if (text1.length < text2.length) {\n    [text1, text2] = [text2, text1];\n  }\n  const n = text2.length;\n  let prev: number[] = new Array(n + 1).fill(0);\n  let curr: number[] = new Array(n + 1).fill(0);\n\n  for (let i = 1; i <= text1.length; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) {\n        curr[j] = 1 + prev[j - 1];\n      } else {\n        curr[j] = Math.max(prev[j], curr[j - 1]);\n      }\n    }\n    prev = [...curr];\n  }\n\n  return curr[n];\n}",
        "lineByLine": [
          "Line 2-4: Swap strings if needed to ensure inner loop allocates min(M, N) memory.",
          "Line 6-7: Allocate two rows of length n + 1.",
          "Line 9-17: Populate curr row from prev and curr[j-1], then swap prev = [...curr].",
          "Line 19: Return curr[n]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "text1=\"abc\", text2=\"ac\"",
            "action": "i=1('a'): curr=[0, 1, 1]",
            "result": "prev updated"
          },
          {
            "step": 2,
            "state": "i=2('b')",
            "action": "curr=[0, 1, 1]",
            "result": "no match"
          },
          {
            "step": 3,
            "state": "i=3('c')",
            "action": "curr[2] = 1 + prev[1] = 2",
            "result": "Returns 2"
          }
        ],
        "complexityDerivation": "M * N iterations -> O(M * N) time with O(min(M, N)) auxiliary space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "2D Matrix Table",
        "time": "O(M * N)",
        "space": "O(M * N)",
        "pros": "Can backtrack to reconstruct the actual string",
        "cons": "High heap allocation on long texts"
      },
      {
        "approach": "Dual Row Space-Optimized",
        "time": "O(M * N)",
        "space": "O(min(M, N))",
        "pros": "Optimal minimal memory footprint",
        "cons": "Only retains length, not actual sequence"
      }
    ],
    "interviewPitch": "Longest Common Subsequence is a textbook 2D dynamic programming problem. At each pair of indices (i, j), if text1[i-1] matches text2[j-1], we extend the diagonal subproblem: dp[i][j] = 1 + dp[i-1][j-1]. If they differ, we take the maximum of excluding a character from either string: max(dp[i-1][j], dp[i][j-1]). Since each row only depends on the previous row, we compress auxiliary space to O(min(M, N)) using two rolling rows while preserving O(M * N) time.",
    "followUps": [
      {
        "question": "How can you reconstruct the actual subsequence string?",
        "answer": "Use the full 2D table and trace back from (m, n): if characters match, prepend char and move (i-1, j-1); otherwise move towards the larger neighbor."
      }
    ],
    "recallQuiz": {
      "question": "When text1[i-1] !== text2[j-1], why is the recurrence max(dp[i-1][j], dp[i][j-1])?",
      "options": [
        "Because the optimal common subsequence either does not include text1[i-1] or does not include text2[j-1]",
        "Because characters are hashed",
        "Because LCS must be contiguous",
        "Because subsequences cannot be empty"
      ],
      "correctIndex": 0,
      "explanation": "Since the characters differ, they cannot both contribute to the same common match; at least one must be excluded."
    }
  },
  "115": {
    "id": 115,
    "title": "Coin Change II",
    "difficulty": "Medium",
    "pattern": "DP - 2D",
    "day": 68,
    "leetcodeUrl": "https://leetcode.com/problems/coin-change-ii/",
    "summary": "Return the number of combinations that make up a given amount using infinite coins of given denominations.",
    "prerequisites": [
      "Unbounded Knapsack combinations vs permutations",
      "1D DP order of loops"
    ],
    "problemStatement": "You are given an integer array `coins` and an integer `amount`. Return the number of combinations that make up that amount. You may assume you have an infinite number of each kind of coin.",
    "approaches": [
      {
        "name": "Approach 1: 2D Unbounded Knapsack Table (Improved)",
        "badge": "Improved / 2D DP",
        "timeComplexity": "O(N * amount)",
        "spaceComplexity": "O(N * amount)",
        "summary": "dp[i][a] is combinations to form amount a using first i coins.",
        "intuition": "dp[i][a] = dp[i-1][a] (exclude coin) + dp[i][a - coin] (include coin).",
        "codeJS": "function change2D(amount, coins) {\n  const n = coins.length;\n  const dp = Array.from({ length: n + 1 }, () => new Array(amount + 1).fill(0));\n  for (let i = 0; i <= n; i++) dp[i][0] = 1;\n\n  for (let i = 1; i <= n; i++) {\n    for (let a = 1; a <= amount; a++) {\n      dp[i][a] = dp[i - 1][a];\n      if (a >= coins[i - 1]) {\n        dp[i][a] += dp[i][a - coins[i - 1]];\n      }\n    }\n  }\n\n  return dp[n][amount];\n}",
        "codeTS": "function change2D(amount: number, coins: number[]): number {\n  const n = coins.length;\n  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(amount + 1).fill(0));\n  for (let i = 0; i <= n; i++) dp[i][0] = 1;\n\n  for (let i = 1; i <= n; i++) {\n    for (let a = 1; a <= amount; a++) {\n      dp[i][a] = dp[i - 1][a];\n      if (a >= coins[i - 1]) {\n        dp[i][a] += dp[i][a - coins[i - 1]];\n      }\n    }\n  }\n\n  return dp[n][amount];\n}",
        "lineByLine": [
          "Line 4: Amount 0 has 1 valid combination: picking no coins.",
          "Line 6-13: dp[i-1][a] counts ways without current coin; dp[i][a - coin] adds ways using current coin.",
          "Line 15: Return dp[n][amount]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "coins=[1, 2, 5], amount=5",
            "action": "using [1]: all amounts have 1 way",
            "result": "dp[1][5] = 1"
          },
          {
            "step": 2,
            "state": "using [1, 2]",
            "action": "adds {2,2,1}, {2,1,1,1}",
            "result": "dp[2][5] = 3"
          },
          {
            "step": 3,
            "state": "using [1, 2, 5]",
            "action": "adds {5}",
            "result": "dp[3][5] = 4 ways"
          }
        ],
        "complexityDerivation": "N coins * amount states -> O(N * amount) time and O(N * amount) space."
      },
      {
        "name": "Approach 2: 1D Array with Coin Outer Loop (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N * amount)",
        "spaceComplexity": "O(amount)",
        "summary": "Iterate coins on the outside and amount forward on the inside to count unique combinations.",
        "intuition": "Placing the coin loop on the outside guarantees combinations are counted, avoiding duplicate permutations.",
        "codeJS": "function change(amount, coins) {\n  const dp = new Array(amount + 1).fill(0);\n  dp[0] = 1; // 1 combination for amount 0\n\n  for (const c of coins) {\n    for (let a = c; a <= amount; a++) {\n      dp[a] += dp[a - c];\n    }\n  }\n\n  return dp[amount];\n}",
        "codeTS": "function change(amount: number, coins: number[]): number {\n  const dp: number[] = new Array(amount + 1).fill(0);\n  dp[0] = 1;\n\n  for (const c of coins) {\n    for (let a = c; a <= amount; a++) {\n      dp[a] += dp[a - c];\n    }\n  }\n\n  return dp[amount];\n}",
        "lineByLine": [
          "Line 2-3: Initialize dp array with 0; dp[0] = 1.",
          "Line 5: CRITICAL: Iterate through coins FIRST to guarantee combinations rather than permutations.",
          "Line 6-8: Loop amount forward from c up to amount, accumulating ways.",
          "Line 11: Return dp[amount]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "coins=[1, 2], amount=3",
            "action": "c=1: dp=[1, 1, 1, 1]",
            "result": "only 1s"
          },
          {
            "step": 2,
            "state": "c=2",
            "action": "a=2: dp[2]+=dp[0]->2; a=3: dp[3]+=dp[1]->2",
            "result": "dp = [1, 1, 2, 2]"
          },
          {
            "step": 3,
            "state": "Done",
            "action": "return dp[3]",
            "result": "Output 2 ({1,1,1}, {1,2})"
          }
        ],
        "complexityDerivation": "Outer loop runs N times, inner loop runs amount times -> O(N * amount) time with O(amount) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "2D Knapsack Table",
        "time": "O(N * amount)",
        "space": "O(N * amount)",
        "pros": "Explicit coin inclusion/exclusion steps",
        "cons": "Wastes memory"
      },
      {
        "approach": "1D Combinations DP",
        "time": "O(N * amount)",
        "space": "O(amount)",
        "pros": "Minimal O(amount) space, simple nested loops",
        "cons": "Loop order must strictly put coins outside"
      }
    ],
    "interviewPitch": "Coin Change II asks for combinations rather than permutations. To ensure we only count combinations (e.g. [1, 2] and [2, 1] are treated as the same combination), we MUST loop over the coins on the outer loop and the amounts on the inner loop. We initialize dp[0] = 1, and for each coin c and amount a from c to target, we add dp[a - c] to dp[a]. This executes in O(N * amount) time and strictly O(amount) auxiliary space.",
    "followUps": [
      {
        "question": "What happens if you swap the loops (amount outside, coins inside)?",
        "answer": "You would count permutations instead of combinations (Combination Sum IV) where order matters!"
      }
    ],
    "recallQuiz": {
      "question": "Why does placing the coin loop outside prevent duplicate permutations?",
      "options": [
        "Because each coin denomination is considered once and in a fixed order, enforcing non-decreasing sequences",
        "Because amounts are prime",
        "Because dp[0] is 1",
        "Because the array is sorted"
      ],
      "correctIndex": 0,
      "explanation": "Processing coins one by one ensures we never pick an earlier coin after a later coin, preventing permutations like [2, 1] when [1, 2] was already counted."
    }
  },
  "116": {
    "id": 116,
    "title": "Target Sum",
    "difficulty": "Medium",
    "pattern": "DP - 2D",
    "day": 68,
    "leetcodeUrl": "https://leetcode.com/problems/target-sum/",
    "summary": "Assign + and - to each integer in nums to make their sum equal to target. Return total ways.",
    "prerequisites": [
      "Mathematical reduction to Subset Sum",
      "0/1 Knapsack"
    ],
    "problemStatement": "You are given an integer array `nums` and an integer `target`. Build an expression using '+' and '-' before each integer to evaluate to `target`. Return the number of different expressions that evaluate to target.",
    "approaches": [
      {
        "name": "Approach 1: Top-Down Recursion with Memoization (Improved)",
        "badge": "Improved / Memoized",
        "timeComplexity": "O(N * totalSum)",
        "spaceComplexity": "O(N * totalSum)",
        "summary": "Memoized recursion dfs(index, currentSum) branching on +num and -num.",
        "intuition": "At each element, branch into adding or subtracting nums[index]. Memoize on (index, currentSum).",
        "codeJS": "function findTargetSumWaysMemo(nums, target) {\n  const memo = new Map();\n\n  function dfs(i, cur) {\n    if (i === nums.length) {\n      return cur === target ? 1 : 0;\n    }\n    const key = `${i},${cur}`;\n    if (memo.has(key)) return memo.get(key);\n\n    const ways = dfs(i + 1, cur + nums[i]) + dfs(i + 1, cur - nums[i]);\n    memo.set(key, ways);\n    return ways;\n  }\n\n  return dfs(0, 0);\n}",
        "codeTS": "function findTargetSumWaysMemo(nums: number[], target: number): number {\n  const memo = new Map<string, number>();\n\n  function dfs(i: number, cur: number): number {\n    if (i === nums.length) {\n      return cur === target ? 1 : 0;\n    }\n    const key = `${i},${cur}`;\n    if (memo.has(key)) return memo.get(key)!;\n\n    const ways = dfs(i + 1, cur + nums[i]) + dfs(i + 1, cur - nums[i]);\n    memo.set(key, ways);\n    return ways;\n  }\n\n  return dfs(0, 0);\n}",
        "lineByLine": [
          "Line 2: Memoization map using string key \"i,cur\".",
          "Line 5-6: Base case: at end of array, return 1 if cur === target else 0.",
          "Line 10-12: Sum ways from positive choice and negative choice, cache, and return."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [1, 1], target = 0",
            "action": "i=0: branches +1 and -1",
            "result": "depth 1"
          },
          {
            "step": 2,
            "state": "i=1",
            "action": "+1-1=0 (valid), -1+1=0 (valid)",
            "result": "total ways = 2"
          }
        ],
        "complexityDerivation": "N indices * (2 * totalSum) states -> O(N * totalSum) time and space."
      },
      {
        "name": "Approach 2: Mathematical Reduction to 0/1 Subset Sum (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N * subsetTarget)",
        "spaceComplexity": "O(subsetTarget)",
        "summary": "P - N = target and P + N = sum => 2P = sum + target => P = (sum + target) / 2.",
        "intuition": "Partitioning nums into positive subset P and negative subset N reduces the problem to finding subsets summing to (sum + target) / 2.",
        "codeJS": "function findTargetSumWays(nums, target) {\n  const sum = nums.reduce((a, b) => a + b, 0);\n  if (Math.abs(target) > sum || (sum + target) % 2 !== 0) {\n    return 0;\n  }\n\n  const subsetTarget = (sum + target) / 2;\n  const dp = new Array(subsetTarget + 1).fill(0);\n  dp[0] = 1;\n\n  for (const num of nums) {\n    for (let s = subsetTarget; s >= num; s--) {\n      dp[s] += dp[s - num];\n    }\n  }\n\n  return dp[subsetTarget];\n}",
        "codeTS": "function findTargetSumWays(nums: number[], target: number): number {\n  const sum = nums.reduce((a, b) => a + b, 0);\n  if (Math.abs(target) > sum || (sum + target) % 2 !== 0) {\n    return 0;\n  }\n\n  const subsetTarget = (sum + target) / 2;\n  const dp: number[] = new Array(subsetTarget + 1).fill(0);\n  dp[0] = 1;\n\n  for (const num of nums) {\n    for (let s = subsetTarget; s >= num; s--) {\n      dp[s] += dp[s - num];\n    }\n  }\n\n  return dp[subsetTarget];\n}",
        "lineByLine": [
          "Line 2-5: If target exceeds sum or (sum + target) is odd, no integer solution exists -> return 0.",
          "Line 7: Derive subset target P = (sum + target) / 2.",
          "Line 8-9: Allocate dp array initialized with 0; dp[0] = 1.",
          "Line 11-15: Standard 0/1 Knapsack backward loop accumulating ways to form each sum.",
          "Line 17: Return dp[subsetTarget]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [1, 1, 1, 1, 1], target = 3",
            "action": "sum = 5, (5 + 3) / 2 = 4",
            "result": "subsetTarget = 4"
          },
          {
            "step": 2,
            "state": "Run 0/1 knapsack for sum 4",
            "action": "5 choose 4 subsets",
            "result": "Returns 5"
          }
        ],
        "complexityDerivation": "O(N * subsetTarget) time with O(subsetTarget) auxiliary array space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Top-Down Memoized DFS",
        "time": "O(N * sum)",
        "space": "O(N * sum)",
        "pros": "Direct translation of + and - decisions",
        "cons": "String concatenation for memo keys is slow"
      },
      {
        "approach": "Subset Sum Reduction",
        "time": "O(N * subsetTarget)",
        "space": "O(subsetTarget)",
        "pros": "Pure 1D integer array, extremely fast and memory-efficient",
        "cons": "Requires mathematical algebraic derivation"
      }
    ],
    "interviewPitch": "Target Sum can be reduced mathematically to the 0/1 Subset Sum problem. If we divide nums into two disjoint sets, P (positive signs) and N (negative signs), then sum(P) - sum(N) = target. Adding sum(P) + sum(N) = sum(nums) to both sides gives 2 * sum(P) = target + sum(nums), meaning sum(P) = (target + sum(nums)) / 2. If target > sum or (target + sum) is odd, return 0. Otherwise, we run 1D 0/1 Knapsack to find the number of subsets that sum to sum(P) in O(N * subsetTarget) time and O(subsetTarget) space.",
    "followUps": [
      {
        "question": "What if nums contains zeroes?",
        "answer": "The formula handles zeroes naturally: for each 0, dp[s] += dp[s - 0] multiplies the number of valid subsets by 2, correctly accounting for +0 and -0."
      }
    ],
    "recallQuiz": {
      "question": "Why does 2 * sum(P) = target + sum(nums) imply that (target + sum) must be even?",
      "options": [
        "Because 2 * sum(P) is always even, so if (target + sum) is odd, no integer subset P can exist",
        "Because target must be positive",
        "Because nums contains only even numbers",
        "Because array length is even"
      ],
      "correctIndex": 0,
      "explanation": "Since 2 * sum(P) is an even integer, target + sum(nums) must also be even for sum(P) to be an integer."
    }
  },
  "117": {
    "id": 117,
    "title": "Best Time to Buy and Sell Stock with Cooldown",
    "difficulty": "Medium",
    "pattern": "DP - 2D",
    "day": 69,
    "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
    "summary": "Find maximum profit with unlimited transactions, but after you sell your stock you cannot buy on the next day.",
    "prerequisites": [
      "State machine DP",
      "Holding vs Sold vs Cooldown states"
    ],
    "problemStatement": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. You may complete as many transactions as you like with the following restriction: after you sell your stock, you cannot buy stock on the next day (i.e., cooldown one day). Return maximum profit.",
    "approaches": [
      {
        "name": "Approach 1: Recursive State Machine with Memoization (Improved)",
        "badge": "Improved / Memoized",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "summary": "dfs(day, canBuy) exploring buy, sell, and cooldown choices with memoization.",
        "intuition": "At each day, we either buy/hold stock or sell/cooldown, leading to two distinct states per day.",
        "codeJS": "function maxProfitMemo(prices) {\n  const memo = new Map();\n\n  function dfs(i, buying) {\n    if (i >= prices.length) return 0;\n    const key = `${i},${buying}`;\n    if (memo.has(key)) return memo.get(key);\n\n    const cooldown = dfs(i + 1, buying);\n    if (buying) {\n      const buy = dfs(i + 1, false) - prices[i];\n      memo.set(key, Math.max(buy, cooldown));\n    } else {\n      const sell = dfs(i + 2, true) + prices[i]; // i+2 enforces 1 day cooldown\n      memo.set(key, Math.max(sell, cooldown));\n    }\n    return memo.get(key);\n  }\n\n  return dfs(0, true);\n}",
        "codeTS": "function maxProfitMemo(prices: number[]): number {\n  const memo = new Map<string, number>();\n\n  function dfs(i: number, buying: boolean): number {\n    if (i >= prices.length) return 0;\n    const key = `${i},${buying}`;\n    if (memo.has(key)) return memo.get(key)!;\n\n    const cooldown = dfs(i + 1, buying);\n    if (buying) {\n      const buy = dfs(i + 1, false) - prices[i];\n      memo.set(key, Math.max(buy, cooldown));\n    } else {\n      const sell = dfs(i + 2, true) + prices[i];\n      memo.set(key, Math.max(sell, cooldown));\n    }\n    return memo.get(key)!;\n  }\n\n  return dfs(0, true);\n}",
        "lineByLine": [
          "Line 4: Base case: reached or exceeded array length -> 0 profit.",
          "Line 8: Option to cooldown (skip current day) is always available.",
          "Line 9-11: If buying: either buy at prices[i] and switch to !buying, or cooldown.",
          "Line 12-14: If selling: sell at +prices[i] and advance to i+2 to enforce mandatory 1-day cooldown."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "prices = [1, 2, 3, 0, 2]",
            "action": "buy day 0 (cost 1), sell day 1 (+2)",
            "result": "cooldown day 2"
          },
          {
            "step": 2,
            "state": "buy day 3 (cost 0), sell day 4 (+2)",
            "action": "profit = (2 - 1) + (2 - 0) = 3",
            "result": "Returns 3"
          }
        ],
        "complexityDerivation": "2N states evaluated once -> O(N) time and O(N) stack/map memory."
      },
      {
        "name": "Approach 2: 3-State O(1) Space Machine (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Track held, sold, and reset states iteratively in O(1) space.",
        "intuition": "held = max(held, reset - price); sold = held + price; reset = max(reset, prev_sold).",
        "codeJS": "function maxProfit(prices) {\n  let sold = 0;\n  let held = -Infinity;\n  let reset = 0;\n\n  for (const p of prices) {\n    const prevSold = sold;\n    sold = held + p;\n    held = Math.max(held, reset - p);\n    reset = Math.max(reset, prevSold);\n  }\n\n  return Math.max(sold, reset);\n}",
        "codeTS": "function maxProfit(prices: number[]): number {\n  let sold = 0;\n  let held = -Infinity;\n  let reset = 0;\n\n  for (const p of prices) {\n    const prevSold = sold;\n    sold = held + p;\n    held = Math.max(held, reset - p);\n    reset = Math.max(reset, prevSold);\n  }\n\n  return Math.max(sold, reset);\n}",
        "lineByLine": [
          "Line 2-4: held initialized to -Infinity (cannot hold stock before buying); sold and reset to 0.",
          "Line 6-11: At day p, record prevSold. sold becomes held + p; held is max(held, reset - p); reset is max(reset, prevSold).",
          "Line 13: Final answer is max(sold, reset) (holding stock at the end is strictly suboptimal)."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "p=1",
            "action": "held=max(-inf, -1)=-1, sold=-inf, reset=0",
            "result": "held=-1"
          },
          {
            "step": 2,
            "state": "p=2",
            "action": "sold=-1+2=1, held=max(-1, -2)=-1, reset=0",
            "result": "sold=1"
          },
          {
            "step": 3,
            "state": "p=3",
            "action": "sold=-1+3=2, reset=max(0, 1)=1",
            "result": "profit accumulates"
          }
        ],
        "complexityDerivation": "Linear single pass visiting each price once -> O(N) time and O(1) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Top-Down State DFS",
        "time": "O(N)",
        "space": "O(N)",
        "pros": "Direct mental model of choices",
        "cons": "High recursion stack overhead"
      },
      {
        "approach": "3-State Machine",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Constant memory, cache friendly, lightning fast",
        "cons": "Requires setting up finite state transitions"
      }
    ],
    "interviewPitch": "Stock with Cooldown is modeled as a 3-state Finite State Machine: \"Held\" (holding a share), \"Sold\" (sold today, must cooldown tomorrow), and \"Reset\" (ready to buy). On each day: Held transitions from either holding or buying from Reset (reset - price); Sold transitions from selling our held share (held + price); Reset transitions from resting or from yesterday's Sold state. By tracking only these three scalar registers, we solve the problem in O(N) time and O(1) auxiliary space.",
    "followUps": [
      {
        "question": "What if cooldown was k days instead of 1?",
        "answer": "Use a circular buffer or queue of size k to delay transferring profit from Sold into Reset."
      }
    ],
    "recallQuiz": {
      "question": "Why is held initialized to -Infinity instead of 0?",
      "options": [
        "Because you cannot hold a stock before purchasing one; 0 would represent free stock",
        "Because prices can be negative",
        "To prevent floating point inaccuracies",
        "Because of bitwise shift limits"
      ],
      "correctIndex": 0,
      "explanation": "Setting held to 0 would falsely indicate that we obtained a stock at price 0 before making any buy transaction."
    }
  },
  "118": {
    "id": 118,
    "title": "Edit Distance",
    "difficulty": "Medium",
    "pattern": "DP - 2D",
    "day": 69,
    "leetcodeUrl": "https://leetcode.com/problems/edit-distance/",
    "summary": "Find minimum number of operations (insert, delete, replace) required to convert word1 to word2.",
    "prerequisites": [
      "Levenshtein distance",
      "2D Matrix DP"
    ],
    "problemStatement": "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`. Allowed operations are: insert a character, delete a character, replace a character.",
    "approaches": [
      {
        "name": "Approach 1: Top-Down Recursion with Memoization (Improved)",
        "badge": "Improved / Memoized",
        "timeComplexity": "O(M * N)",
        "spaceComplexity": "O(M * N)",
        "summary": "Recursive helper minDistance(i, j) with 2D memoization.",
        "intuition": "If chars match, advance both. If mismatch, return 1 + min(insert, delete, replace).",
        "codeJS": "function minDistanceMemo(word1, word2) {\n  const memo = new Map();\n\n  function dfs(i, j) {\n    if (i === word1.length) return word2.length - j; // insert remaining\n    if (j === word2.length) return word1.length - i; // delete remaining\n    const key = `${i},${j}`;\n    if (memo.has(key)) return memo.get(key);\n\n    if (word1[i] === word2[j]) {\n      const res = dfs(i + 1, j + 1);\n      memo.set(key, res);\n      return res;\n    }\n\n    const insertOp = dfs(i, j + 1);\n    const deleteOp = dfs(i + 1, j);\n    const replaceOp = dfs(i + 1, j + 1);\n\n    const res = 1 + Math.min(insertOp, deleteOp, replaceOp);\n    memo.set(key, res);\n    return res;\n  }\n\n  return dfs(0, 0);\n}",
        "codeTS": "function minDistanceMemo(word1: string, word2: string): number {\n  const memo = new Map<string, number>();\n\n  function dfs(i: number, j: number): number {\n    if (i === word1.length) return word2.length - j;\n    if (j === word2.length) return word1.length - i;\n    const key = `${i},${j}`;\n    if (memo.has(key)) return memo.get(key)!;\n\n    if (word1[i] === word2[j]) {\n      const res = dfs(i + 1, j + 1);\n      memo.set(key, res);\n      return res;\n    }\n\n    const insertOp = dfs(i, j + 1);\n    const deleteOp = dfs(i + 1, j);\n    const replaceOp = dfs(i + 1, j + 1);\n\n    const res = 1 + Math.min(insertOp, deleteOp, replaceOp);\n    memo.set(key, res);\n    return res;\n  }\n\n  return dfs(0, 0);\n}",
        "lineByLine": [
          "Line 4-5: Base cases: if word1 ends, insert remaining of word2; if word2 ends, delete remaining of word1.",
          "Line 9-13: If characters match, no operation cost: advance both (i+1, j+1).",
          "Line 15-19: If characters differ, take 1 + min of insert (i, j+1), delete (i+1, j), and replace (i+1, j+1)."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "word1=\"horse\", word2=\"ros\"",
            "action": "h !== r: tries replace h->r",
            "result": "branches to \"orse\" vs \"os\""
          },
          {
            "step": 2,
            "state": "r === r: match",
            "result": "advances"
          },
          {
            "step": 3,
            "state": "Result",
            "action": "3 operations total",
            "result": "Returns 3"
          }
        ],
        "complexityDerivation": "M * N subproblems -> O(M * N) time and O(M * N) stack/map space."
      },
      {
        "name": "Approach 2: Bottom-Up Levenshtein Matrix (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(M * N)",
        "spaceComplexity": "O(M * N)",
        "summary": "dp[i][j] stores edit distance between word1[0...i-1] and word2[0...j-1].",
        "intuition": "Standard 2D DP matrix where dp[i][j] is computed from left, top, and top-left diagonal.",
        "codeJS": "function minDistance(word1, word2) {\n  const m = word1.length;\n  const n = word2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i - 1] === word2[j - 1]) {\n        dp[i][j] = dp[i - 1][j - 1];\n      } else {\n        dp[i][j] = 1 + Math.min(\n          dp[i - 1][j],     // deletion\n          dp[i][j - 1],     // insertion\n          dp[i - 1][j - 1]  // replacement\n        );\n      }\n    }\n  }\n\n  return dp[m][n];\n}",
        "codeTS": "function minDistance(word1: string, word2: string): number {\n  const m = word1.length;\n  const n = word2.length;\n  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i - 1] === word2[j - 1]) {\n        dp[i][j] = dp[i - 1][j - 1];\n      } else {\n        dp[i][j] = 1 + Math.min(\n          dp[i - 1][j],\n          dp[i][j - 1],\n          dp[i - 1][j - 1]\n        );\n      }\n    }\n  }\n\n  return dp[m][n];\n}",
        "lineByLine": [
          "Line 4: Allocate (m+1) x (n+1) matrix.",
          "Line 6-7: Base cases: converting empty string to word of length j requires j insertions; converting word of length i to empty requires i deletions.",
          "Line 9-18: If characters match, take diagonal dp[i-1][j-1]; otherwise take 1 + min of delete, insert, replace.",
          "Line 21: Return dp[m][n]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "word1=\"intention\", word2=\"execution\"",
            "action": "Fills matrix bottom-up",
            "result": "dp[9][9] = 5"
          },
          {
            "step": 2,
            "state": "Done",
            "action": "return dp[m][n]",
            "result": "Returns 5"
          }
        ],
        "complexityDerivation": "Fills (M + 1) * (N + 1) cells -> O(M * N) time and O(M * N) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Top-Down Memoized",
        "time": "O(M * N)",
        "space": "O(M * N)",
        "pros": "Intuitive transition logic",
        "cons": "Recursion overhead"
      },
      {
        "approach": "Bottom-Up 2D Table",
        "time": "O(M * N)",
        "space": "O(M * N)",
        "pros": "Standard Levenshtein algorithm, can reconstruct alignment path",
        "cons": "Allocates full matrix"
      }
    ],
    "interviewPitch": "Edit Distance implements the classic Levenshtein distance dynamic programming table. We construct a 2D matrix where dp[i][j] represents the minimum operations to convert word1[0...i-1] into word2[0...j-1]. If the characters word1[i-1] and word2[j-1] match, no operation is needed, so dp[i][j] = dp[i-1][j-1]. If they mismatch, we take 1 plus the minimum of deletion (dp[i-1][j]), insertion (dp[i][j-1]), or replacement (dp[i-1][j-1]). This runs in O(M * N) time and O(M * N) space.",
    "followUps": [
      {
        "question": "Can space be optimized to O(min(M, N))?",
        "answer": "Yes, because each row only accesses the current row and the previous row, we can use two rows of size min(M, N)."
      }
    ],
    "recallQuiz": {
      "question": "Which operation corresponds to the cell dp[i][j-1] in the Edit Distance table?",
      "options": [
        "Insertion (inserting the character word2[j-1])",
        "Deletion",
        "Replacement",
        "Transposition"
      ],
      "correctIndex": 0,
      "explanation": "Moving from j-1 to j while remaining at i corresponds to inserting a character into word1 to match word2."
    }
  },
  "119": {
    "id": 119,
    "title": "Interleaving String",
    "difficulty": "Medium",
    "pattern": "DP - 2D",
    "day": 71,
    "leetcodeUrl": "https://leetcode.com/problems/interleaving-string/",
    "summary": "Determine if s3 is formed by an interleaving of s1 and s2.",
    "prerequisites": [
      "2D Grid DP",
      "Length conservation check"
    ],
    "problemStatement": "Given strings `s1`, `s2`, and `s3`, find whether `s3` is formed by an interleaving of `s1` and `s2`.",
    "approaches": [
      {
        "name": "Approach 1: Top-Down Recursion with Memoization (Improved)",
        "badge": "Improved / Memoized",
        "timeComplexity": "O(M * N)",
        "spaceComplexity": "O(M * N)",
        "summary": "dfs(i, j) exploring matching s1[i] === s3[i+j] or s2[j] === s3[i+j].",
        "intuition": "At each position, if s1 matches s3[i+j], advance i; if s2 matches s3[i+j], advance j. Memoize on (i, j).",
        "codeJS": "function isInterleaveMemo(s1, s2, s3) {\n  if (s1.length + s2.length !== s3.length) return false;\n  const memo = new Map();\n\n  function dfs(i, j) {\n    if (i === s1.length && j === s2.length) return true;\n    const key = `${i},${j}`;\n    if (memo.has(key)) return memo.get(key);\n\n    let res = false;\n    if (i < s1.length && s1[i] === s3[i + j] && dfs(i + 1, j)) {\n      res = true;\n    }\n    if (!res && j < s2.length && s2[j] === s3[i + j] && dfs(i, j + 1)) {\n      res = true;\n    }\n\n    memo.set(key, res);\n    return res;\n  }\n\n  return dfs(0, 0);\n}",
        "codeTS": "function isInterleaveMemo(s1: string, s2: string, s3: string): boolean {\n  if (s1.length + s2.length !== s3.length) return false;\n  const memo = new Map<string, boolean>();\n\n  function dfs(i: number, j: number): boolean {\n    if (i === s1.length && j === s2.length) return true;\n    const key = `${i},${j}`;\n    if (memo.has(key)) return memo.get(key)!;\n\n    let res = false;\n    if (i < s1.length && s1[i] === s3[i + j] && dfs(i + 1, j)) {\n      res = true;\n    }\n    if (!res && j < s2.length && s2[j] === s3[i + j] && dfs(i, j + 1)) {\n      res = true;\n    }\n\n    memo.set(key, res);\n    return res;\n  }\n\n  return dfs(0, 0);\n}",
        "lineByLine": [
          "Line 2: Fast check: sum of lengths of s1 and s2 MUST equal s3 length.",
          "Line 6: Base case: reached end of both strings -> successfully interleaved.",
          "Line 10-15: Try matching s1[i] with s3[i+j]; if unsuccessful, try matching s2[j] with s3[i+j]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s1=\"aabcc\", s2=\"dbbca\", s3=\"aadbbcbcac\"",
            "action": "len check 5+5 === 10",
            "result": "valid length"
          },
          {
            "step": 2,
            "state": "dfs(0,0)",
            "action": "matches s1[0]='a'",
            "result": "branches dfs(1,0)"
          },
          {
            "step": 3,
            "state": "Result",
            "action": "finds valid path to end",
            "result": "Returns true"
          }
        ],
        "complexityDerivation": "M * N states visited once -> O(M * N) time and O(M * N) memory."
      },
      {
        "name": "Approach 2: 2D Grid DP Array (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(M * N)",
        "spaceComplexity": "O(M * N)",
        "summary": "dp[i][j] is true if s1[0...i-1] and s2[0...j-1] interleave to form s3[0...i+j-1].",
        "intuition": "Cell (i, j) is reachable if top cell (i-1, j) is true and s1[i-1] === s3[i+j-1], OR left cell (i, j-1) is true and s2[j-1] === s3[i+j-1].",
        "codeJS": "function isInterleave(s1, s2, s3) {\n  if (s1.length + s2.length !== s3.length) return false;\n  const m = s1.length;\n  const n = s2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));\n  dp[0][0] = true;\n\n  for (let i = 1; i <= m; i++) {\n    dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];\n  }\n  for (let j = 1; j <= n; j++) {\n    dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];\n  }\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      const char = s3[i + j - 1];\n      dp[i][j] = (dp[i - 1][j] && s1[i - 1] === char) ||\n                 (dp[i][j - 1] && s2[j - 1] === char);\n    }\n  }\n\n  return dp[m][n];\n}",
        "codeTS": "function isInterleave(s1: string, s2: string, s3: string): boolean {\n  if (s1.length + s2.length !== s3.length) return false;\n  const m = s1.length;\n  const n = s2.length;\n  const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));\n  dp[0][0] = true;\n\n  for (let i = 1; i <= m; i++) {\n    dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];\n  }\n  for (let j = 1; j <= n; j++) {\n    dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];\n  }\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      const char = s3[i + j - 1];\n      dp[i][j] = (dp[i - 1][j] && s1[i - 1] === char) ||\n                 (dp[i][j - 1] && s2[j - 1] === char);\n    }\n  }\n\n  return dp[m][n];\n}",
        "lineByLine": [
          "Line 2: Fast check for total character count.",
          "Line 5-6: dp[0][0] = true: empty strings interleave to form empty string.",
          "Line 8-13: Initialize first row and column.",
          "Line 15-22: For each cell, check transition from top (consuming s1) or left (consuming s2).",
          "Line 24: Return dp[m][n]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s1=\"a\", s2=\"b\", s3=\"ab\"",
            "action": "dp[0][0]=T, dp[1][0]=T (\"a\"), dp[0][1]=F",
            "result": "base setup"
          },
          {
            "step": 2,
            "state": "i=1, j=1",
            "action": "dp[1][0] is T and s2[0]==s3[1]('b')",
            "result": "dp[1][1] = true"
          }
        ],
        "complexityDerivation": "Fills (M + 1) * (N + 1) grid -> O(M * N) time and O(M * N) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Top-Down Memoized",
        "time": "O(M * N)",
        "space": "O(M * N)",
        "pros": "Stops early when target found",
        "cons": "Map string keys overhead"
      },
      {
        "approach": "2D DP Matrix",
        "time": "O(M * N)",
        "space": "O(M * N)",
        "pros": "Iterative, cache friendly",
        "cons": "Fills full table"
      }
    ],
    "interviewPitch": "First, check if s1.length + s2.length equals s3.length; if not, return false immediately. We model interleaving as path-finding in a 2D grid: dp[i][j] is true if s1[0...i-1] and s2[0...j-1] can interleave to form s3[0...i+j-1]. Moving down consumes a character from s1 (valid if dp[i-1][j] is true and s1[i-1] === s3[i+j-1]), while moving right consumes a character from s2 (valid if dp[i][j-1] is true and s2[j-1] === s3[i+j-1]). This runs in O(M * N) time and O(M * N) space.",
    "followUps": [
      {
        "question": "Can space be optimized to O(N)?",
        "answer": "Yes, each row only accesses values from the current row and the row directly above, allowing compression to a single 1D boolean array of size N+1."
      }
    ],
    "recallQuiz": {
      "question": "What is the mandatory prerequisite check before running DP on Interleaving String?",
      "options": [
        "s1.length + s2.length === s3.length",
        "s1 and s2 must be sorted",
        "s3 must not contain duplicates",
        "Strings must be lowercase"
      ],
      "correctIndex": 0,
      "explanation": "Interleaving preserves every single character from both input strings; hence their combined length must strictly match s3."
    }
  },
  "120": {
    "id": 120,
    "title": "Longest Increasing Path in a Matrix",
    "difficulty": "Hard",
    "pattern": "DP - 2D",
    "day": 71,
    "leetcodeUrl": "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
    "summary": "Find the length of the longest increasing path in an m x n integers matrix.",
    "prerequisites": [
      "DFS with Memoization Matrix",
      "DAG topological order in grid"
    ],
    "problemStatement": "Given an `m x n` integers matrix, return the length of the longest increasing path in `matrix`. From each cell, you can either move in four directions: left, right, up, or down. You may not move diagonally or move outside the boundary.",
    "approaches": [
      {
        "name": "Approach 1: Plain DFS without Memoization (Baseline)",
        "badge": "Baseline / Brute-Force",
        "timeComplexity": "O(4^(M*N))",
        "spaceComplexity": "O(M * N)",
        "summary": "Exhaustive DFS exploring all increasing paths from every cell.",
        "intuition": "From each cell, recursively explore all 4 neighbors that have strictly greater values.",
        "codeJS": "function longestIncreasingPathBrute(matrix) {\n  const m = matrix.length;\n  const n = matrix[0].length;\n  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n\n  function dfs(r, c) {\n    let maxLen = 1;\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] > matrix[r][c]) {\n        maxLen = Math.max(maxLen, 1 + dfs(nr, nc));\n      }\n    }\n    return maxLen;\n  }\n\n  let res = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      res = Math.max(res, dfs(r, c));\n    }\n  }\n  return res;\n}",
        "codeTS": "function longestIncreasingPathBrute(matrix: number[][]): number {\n  const m = matrix.length;\n  const n = matrix[0].length;\n  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n\n  function dfs(r: number, c: number): number {\n    let maxLen = 1;\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] > matrix[r][c]) {\n        maxLen = Math.max(maxLen, 1 + dfs(nr, nc));\n      }\n    }\n    return maxLen;\n  }\n\n  let res = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      res = Math.max(res, dfs(r, c));\n    }\n  }\n  return res;\n}",
        "lineByLine": [
          "Line 6-14: DFS searches 4 directions for strictly greater neighbor values.",
          "Line 16-20: Call DFS from every cell in matrix.",
          "Line 21: Returns maximum path length, but times out exponentially without caching."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "grid 3x3",
            "action": "Calls branch 4 ways at each step",
            "result": "Exponential tree"
          }
        ],
        "complexityDerivation": "Branching factor of 4 per cell -> O(4^(M*N)) exponential time. Exceeds time limit."
      },
      {
        "name": "Approach 2: DFS with 2D Memoization Matrix (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(M * N)",
        "spaceComplexity": "O(M * N)",
        "summary": "Cache longest path starting from (r, c) in memo[r][c].",
        "intuition": "Strictly increasing condition guarantees no cycles exist (it is a Directed Acyclic Graph). Once memo[r][c] is computed, it never changes!",
        "codeJS": "function longestIncreasingPath(matrix) {\n  if (!matrix || matrix.length === 0) return 0;\n  const m = matrix.length;\n  const n = matrix[0].length;\n  const memo = Array.from({ length: m }, () => new Array(n).fill(0));\n  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n\n  function dfs(r, c) {\n    if (memo[r][c] !== 0) return memo[r][c];\n\n    let maxLen = 1;\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr;\n      const nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] > matrix[r][c]) {\n        maxLen = Math.max(maxLen, 1 + dfs(nr, nc));\n      }\n    }\n\n    memo[r][c] = maxLen;\n    return maxLen;\n  }\n\n  let longest = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      longest = Math.max(longest, dfs(r, c));\n    }\n  }\n\n  return longest;\n}",
        "codeTS": "function longestIncreasingPath(matrix: number[][]): number {\n  if (!matrix || matrix.length === 0) return 0;\n  const m = matrix.length;\n  const n = matrix[0].length;\n  const memo: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));\n  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n\n  function dfs(r: number, c: number): number {\n    if (memo[r][c] !== 0) return memo[r][c];\n\n    let maxLen = 1;\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr;\n      const nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] > matrix[r][c]) {\n        maxLen = Math.max(maxLen, 1 + dfs(nr, nc));\n      }\n    }\n\n    memo[r][c] = maxLen;\n    return maxLen;\n  }\n\n  let longest = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      longest = Math.max(longest, dfs(r, c));\n    }\n  }\n\n  return longest;\n}",
        "lineByLine": [
          "Line 5: memo matrix initialized with 0.",
          "Line 9: Cache hit: if already calculated, return memo[r][c] in O(1).",
          "Line 11-18: Explore all 4 adjacent cells strictly greater than current value.",
          "Line 20: Store maxLen in memo[r][c] and return.",
          "Line 24-28: Find global maximum across all cells."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "matrix = [[9,9,4],[6,6,8],[2,1,1]]",
            "action": "dfs(2, 1) on 1: 1 -> 2 -> 6 -> 9",
            "result": "path len = 4"
          },
          {
            "step": 2,
            "state": "memo records cell results",
            "action": "subsequent visits return in O(1)",
            "result": "Returns 4"
          }
        ],
        "complexityDerivation": "Each cell (r, c) is visited once and its 4 edges inspected -> O(M * N) time and O(M * N) memoization storage."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Brute Force DFS",
        "time": "O(4^(M*N))",
        "space": "O(M * N)",
        "pros": "No extra memo table",
        "cons": "Exponential explosion; TLE"
      },
      {
        "approach": "DFS + Memo Matrix",
        "time": "O(M * N)",
        "space": "O(M * N)",
        "pros": "Linear time in total number of cells, optimal",
        "cons": "Recursion stack of depth M*N"
      }
    ],
    "interviewPitch": "Because the path must be strictly increasing, cycles are impossible: moving from value v to a strictly greater neighbor prevents returning to any previously visited cell. This guarantees the grid is a Directed Acyclic Graph (DAG). We apply DFS with a 2D memoization matrix memo[r][c] storing the longest increasing path starting from (r, c). Each cell is computed once in O(1) amortized time across its 4 neighbors, achieving optimal O(M * N) time and O(M * N) space.",
    "followUps": [
      {
        "question": "Do we need a visited set during DFS?",
        "answer": "No! Because we only move to strictly greater values (matrix[nr][nc] > matrix[r][c]), we can never loop back to an already visited node in the current path."
      }
    ],
    "recallQuiz": {
      "question": "Why is a visited array not required to prevent infinite loops in Longest Increasing Path?",
      "options": [
        "Because paths must be strictly increasing, meaning a cycle can never exist",
        "Because the matrix has finite dimensions",
        "Because DFS only moves right and down",
        "Because numbers are positive"
      ],
      "correctIndex": 0,
      "explanation": "A cycle would require a sequence of numbers where a < b < c < ... < a, which is mathematically impossible."
    }
  },
  "121": {
    "id": 121,
    "title": "Distinct Subsequences",
    "difficulty": "Hard",
    "pattern": "DP - 2D",
    "day": 72,
    "leetcodeUrl": "https://leetcode.com/problems/distinct-subsequences/",
    "summary": "Given two strings s and t, return the number of distinct subsequences of s which equals t.",
    "prerequisites": [
      "2D Subsequence Matching DP",
      "64-bit integer overflow protection"
    ],
    "problemStatement": "Given two strings `s` and `t`, return the number of distinct subsequences of `s` which equals `t`. The test cases are generated so that the answer fits in a 32-bit signed integer.",
    "approaches": [
      {
        "name": "Approach 1: Top-Down Recursion with Memoization (Improved)",
        "badge": "Improved / Memoized",
        "timeComplexity": "O(M * N)",
        "spaceComplexity": "O(M * N)",
        "summary": "dfs(i, j) exploring matching s[i] with t[j] and skipping s[i].",
        "intuition": "At each step, we can always skip s[i] (dfs(i+1, j)). If s[i] === t[j], we can also consume both (dfs(i+1, j+1)).",
        "codeJS": "function numDistinctMemo(s, t) {\n  const memo = new Map();\n\n  function dfs(i, j) {\n    if (j === t.length) return 1; // matched all of t\n    if (i === s.length) return 0; // ran out of s\n    const key = `${i},${j}`;\n    if (memo.has(key)) return memo.get(key);\n\n    let res = dfs(i + 1, j); // Option 1: skip s[i]\n    if (s[i] === t[j]) {\n      res += dfs(i + 1, j + 1); // Option 2: match s[i] with t[j]\n    }\n\n    memo.set(key, res);\n    return res;\n  }\n\n  return dfs(0, 0);\n}",
        "codeTS": "function numDistinctMemo(s: string, t: string): number {\n  const memo = new Map<string, number>();\n\n  function dfs(i: number, j: number): number {\n    if (j === t.length) return 1;\n    if (i === s.length) return 0;\n    const key = `${i},${j}`;\n    if (memo.has(key)) return memo.get(key)!;\n\n    let res = dfs(i + 1, j);\n    if (s[i] === t[j]) {\n      res += dfs(i + 1, j + 1);\n    }\n\n    memo.set(key, res);\n    return res;\n  }\n\n  return dfs(0, 0);\n}",
        "lineByLine": [
          "Line 4: Base case: if j reaches t.length, all characters of t are matched -> 1 valid subsequence.",
          "Line 5: If i reaches s.length without completing t -> 0.",
          "Line 9: Always explore skipping s[i] by incrementing i.",
          "Line 10-12: If characters match, add ways from matching both (i+1, j+1)."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s=\"rabbbit\", t=\"rabbit\"",
            "action": "Three b's in s, two needed for t",
            "result": "3 choose 2 combinations"
          },
          {
            "step": 2,
            "state": "Result",
            "action": "Total ways = 3",
            "result": "Returns 3"
          }
        ],
        "complexityDerivation": "M * N states -> O(M * N) time and O(M * N) stack/memo space."
      },
      {
        "name": "Approach 2: 2D Dynamic Programming Table (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(M * N)",
        "spaceComplexity": "O(M * N)",
        "summary": "dp[i][j] stores distinct subsequences of s[0...i-1] matching t[0...j-1].",
        "intuition": "dp[i][j] = dp[i-1][j] + (s[i-1] === t[j-1] ? dp[i-1][j-1] : 0).",
        "codeJS": "function numDistinct(s, t) {\n  const m = s.length;\n  const n = t.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n\n  for (let i = 0; i <= m; i++) {\n    dp[i][0] = 1; // empty t is matched by 1 subsequence of any prefix of s\n  }\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      dp[i][j] = dp[i - 1][j];\n      if (s[i - 1] === t[j - 1]) {\n        dp[i][j] += dp[i - 1][j - 1];\n      }\n    }\n  }\n\n  return dp[m][n];\n}",
        "codeTS": "function numDistinct(s: string, t: string): number {\n  const m = s.length;\n  const n = t.length;\n  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n\n  for (let i = 0; i <= m; i++) {\n    dp[i][0] = 1;\n  }\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      dp[i][j] = dp[i - 1][j];\n      if (s[i - 1] === t[j - 1]) {\n        dp[i][j] += dp[i - 1][j - 1];\n      }\n    }\n  }\n\n  return dp[m][n];\n}",
        "lineByLine": [
          "Line 6-8: Base case: an empty target t can always be formed 1 way (by deleting all remaining characters of s).",
          "Line 10-17: dp[i-1][j] accounts for skipping s[i-1]. If s[i-1] === t[j-1], add dp[i-1][j-1] for matching.",
          "Line 19: Return dp[m][n]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s=\"babgbag\", t=\"bag\"",
            "action": "Fills matrix cell by cell",
            "result": "matches different 'b', 'a', 'g' occurrences"
          },
          {
            "step": 2,
            "state": "Final cell",
            "action": "dp[7][3]",
            "result": "Returns 5"
          }
        ],
        "complexityDerivation": "Fills (M + 1) * (N + 1) matrix -> O(M * N) time and O(M * N) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Top-Down Memoized",
        "time": "O(M * N)",
        "space": "O(M * N)",
        "pros": "Direct transition representation",
        "cons": "String concatenation in memo map"
      },
      {
        "approach": "Bottom-Up 2D Table",
        "time": "O(M * N)",
        "space": "O(M * N)",
        "pros": "Fast 2D array indexing, no recursion depth limit",
        "cons": "Matrix allocation"
      }
    ],
    "interviewPitch": "In Distinct Subsequences, we count how many ways we can form t from s. In our 2D DP matrix, dp[i][j] represents the number of ways s[0...i-1] can form t[0...j-1]. The base case is dp[i][0] = 1 because an empty string t is formed in exactly 1 way from any prefix of s (by deleting all characters). For each cell, we can always choose to skip s[i-1], contributing dp[i-1][j]. If s[i-1] === t[j-1], we also add dp[i-1][j-1]. This runs in O(M * N) time and O(M * N) space.",
    "followUps": [
      {
        "question": "Can space be compressed to O(N)?",
        "answer": "Yes, by iterating backwards over j from n down to 1, a single 1D array of size N+1 suffices."
      }
    ],
    "recallQuiz": {
      "question": "Why is dp[i][0] initialized to 1 for all i?",
      "options": [
        "Because an empty string t can always be formed in exactly 1 way by deleting all characters from s",
        "Because 0! is 1",
        "Because s has at least one character",
        "To prevent null pointers"
      ],
      "correctIndex": 0,
      "explanation": "An empty target is matched by exactly 1 subsequence of any string: the empty subsequence."
    }
  },
  "122": {
    "id": 122,
    "title": "Burst Balloons",
    "difficulty": "Hard",
    "pattern": "DP - 2D",
    "day": 72,
    "leetcodeUrl": "https://leetcode.com/problems/burst-balloons/",
    "summary": "Burst balloons to maximize coins: bursting balloon i gives nums[i-1] * nums[i] * nums[i+1].",
    "prerequisites": [
      "Interval DP",
      "Thinking in reverse (which balloon bursts LAST)"
    ],
    "problemStatement": "You are given `n` balloons, indexed from `0` to `n - 1`. Each balloon is painted with a number on it represented by an array `nums`. You are asked to burst all the balloons. If you burst balloon `i` you will get `nums[i - 1] * nums[i] * nums[i + 1]` coins. Return the maximum coins you can collect.",
    "approaches": [
      {
        "name": "Approach 1: Top-Down Interval DP with Memoization (Improved)",
        "badge": "Improved / Memoized",
        "timeComplexity": "O(N³)",
        "spaceComplexity": "O(N²)",
        "summary": "dfs(l, r) computes max coins for balloons between l and r, choosing which balloon k bursts LAST.",
        "intuition": "Thinking which balloon bursts first couples neighboring subproblems. Thinking which balloon bursts LAST isolates subproblems because boundary balloons l and r remain intact!",
        "codeJS": "function maxCoinsMemo(nums) {\n  const vals = [1, ...nums, 1];\n  const memo = new Map();\n\n  function dfs(l, r) {\n    if (l > r) return 0;\n    const key = `${l},${r}`;\n    if (memo.has(key)) return memo.get(key);\n\n    let maxCoins = 0;\n    for (let k = l; k <= r; k++) {\n      // k is the LAST balloon burst in range [l, r]\n      const coins = vals[l - 1] * vals[k] * vals[r + 1] + dfs(l, k - 1) + dfs(k + 1, r);\n      maxCoins = Math.max(maxCoins, coins);\n    }\n\n    memo.set(key, maxCoins);\n    return maxCoins;\n  }\n\n  return dfs(1, nums.length);\n}",
        "codeTS": "function maxCoinsMemo(nums: number[]): number {\n  const vals = [1, ...nums, 1];\n  const memo = new Map<string, number>();\n\n  function dfs(l: number, r: number): number {\n    if (l > r) return 0;\n    const key = `${l},${r}`;\n    if (memo.has(key)) return memo.get(key)!;\n\n    let maxCoins = 0;\n    for (let k = l; k <= r; k++) {\n      const coins = vals[l - 1] * vals[k] * vals[r + 1] + dfs(l, k - 1) + dfs(k + 1, r);\n      maxCoins = Math.max(maxCoins, coins);\n    }\n\n    memo.set(key, maxCoins);\n    return maxCoins;\n  }\n\n  return dfs(1, nums.length);\n}",
        "lineByLine": [
          "Line 2: Pad array with 1 at both boundaries to handle edges cleanly.",
          "Line 5: Base case: empty interval returns 0 coins.",
          "Line 10-15: Pivot k represents the LAST balloon to burst in interval [l, r]. Its coins are vals[l-1] * vals[k] * vals[r+1] plus independent subproblems dfs(l, k-1) and dfs(k+1, r)."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [3, 1, 5, 8]",
            "action": "vals = [1, 3, 1, 5, 8, 1]",
            "result": "padded with 1"
          },
          {
            "step": 2,
            "state": "Test all last-burst candidates k",
            "action": "burst 1, then 5, then 3, then 8",
            "result": "Max coins = 167"
          }
        ],
        "complexityDerivation": "N^2 intervals, each testing up to N pivots -> O(N^3) time and O(N^2) space."
      },
      {
        "name": "Approach 2: Bottom-Up Interval DP Table (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N³)",
        "spaceComplexity": "O(N²)",
        "summary": "Iterate interval length len from 1 to n, filling dp[l][r] table.",
        "intuition": "Build solutions for shorter intervals first so that sub-ranges [l, k-1] and [k+1, r] are already solved.",
        "codeJS": "function maxCoins(nums) {\n  const n = nums.length;\n  const vals = [1, ...nums, 1];\n  const dp = Array.from({ length: n + 2 }, () => new Array(n + 2).fill(0));\n\n  for (let len = 1; len <= n; len++) {\n    for (let l = 1; l <= n - len + 1; l++) {\n      const r = l + len - 1;\n      for (let k = l; k <= r; k++) {\n        const coins = vals[l - 1] * vals[k] * vals[r + 1] + dp[l][k - 1] + dp[k + 1][r];\n        dp[l][r] = Math.max(dp[l][r], coins);\n      }\n    }\n  }\n\n  return dp[1][n];\n}",
        "codeTS": "function maxCoins(nums: number[]): number {\n  const n = nums.length;\n  const vals: number[] = [1, ...nums, 1];\n  const dp: number[][] = Array.from({ length: n + 2 }, () => new Array(n + 2).fill(0));\n\n  for (let len = 1; len <= n; len++) {\n    for (let l = 1; l <= n - len + 1; l++) {\n      const r = l + len - 1;\n      for (let k = l; k <= r; k++) {\n        const coins = vals[l - 1] * vals[k] * vals[r + 1] + dp[l][k - 1] + dp[k + 1][r];\n        dp[l][r] = Math.max(dp[l][r], coins);\n      }\n    }\n  }\n\n  return dp[1][n];\n}",
        "lineByLine": [
          "Line 3: Pad array with 1 at both sides.",
          "Line 4: Allocate (n+2) x (n+2) matrix.",
          "Line 6-15: Outer loop iterates over interval length len. For each interval [l, r], test every balloon k as the last balloon to burst.",
          "Line 17: Return dp[1][n]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "len=1: single balloons",
            "action": "dp[i][i] = vals[i-1]*vals[i]*vals[i+1]",
            "result": "base intervals set"
          },
          {
            "step": 2,
            "state": "len=2..4: merge intervals",
            "action": "adds independent subproblems",
            "result": "dp[1][4] = 167"
          }
        ],
        "complexityDerivation": "Three nested loops of size N -> O(N^3) time and O(N^2) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Top-Down Memoized",
        "time": "O(N³)",
        "space": "O(N²)",
        "pros": "Natural divide-and-conquer logic",
        "cons": "Recursion overhead"
      },
      {
        "approach": "Bottom-Up Interval DP",
        "time": "O(N³)",
        "space": "O(N²)",
        "pros": "Iterative, cache friendly, standard Interval DP pattern",
        "cons": "Requires 3 nested loops"
      }
    ],
    "interviewPitch": "Burst Balloons is the quintessential Interval DP problem. If we ask \"which balloon bursts first?\", the adjacent balloons change dynamically, coupling the subproblems and destroying independence. The key insight is to reverse the perspective: \"Which balloon k bursts LAST in interval [l, r]?\". Because balloon k is the last to burst, its neighbors are guaranteed to be the boundary balloons l - 1 and r + 1! This cleanly decouples the subproblems into [l, k - 1] and [k + 1, r]. We build bottom-up by increasing interval length, running in O(N^3) time and O(N^2) space.",
    "followUps": [
      {
        "question": "Why does padding with 1 at the boundaries simplify the logic?",
        "answer": "The problem statement specifies that out-of-bound neighbors are treated as having value 1; padding avoids branch checks on array bounds."
      }
    ],
    "recallQuiz": {
      "question": "Why do we ask which balloon bursts LAST instead of which bursts FIRST?",
      "options": [
        "Because the last balloon is adjacent strictly to the intact boundaries l-1 and r+1, making subproblems independent",
        "Because the last balloon gives the most coins",
        "Because balloons cannot burst in order",
        "Because of floating point limits"
      ],
      "correctIndex": 0,
      "explanation": "If k bursts last, every other balloon in [l, r] is already gone, meaning k is adjacent only to vals[l-1] and vals[r+1], isolating the subproblems."
    }
  },
  "123": {
    "id": 123,
    "title": "Regular Expression Matching",
    "difficulty": "Hard",
    "pattern": "DP - 2D",
    "day": 73,
    "leetcodeUrl": "https://leetcode.com/problems/regular-expression-matching/",
    "summary": "Implement regular expression matching with support for '.' and '*'.",
    "prerequisites": [
      "2D State Machine DP",
      "Star wildcard matching zero or more occurrences"
    ],
    "problemStatement": "Given an input string `s` and a pattern `p`, implement regular expression matching with support for `'.'` and `'*'` where:\n- `'.'` Matches any single character.\n- `'*'` Matches zero or more of the preceding element.\nThe matching should cover the **entire** input string (not partial).",
    "approaches": [
      {
        "name": "Approach 1: Top-Down Recursion with Memoization (Improved)",
        "badge": "Improved / Memoized",
        "timeComplexity": "O(M * N)",
        "spaceComplexity": "O(M * N)",
        "summary": "dfs(i, j) matching s[i] with p[j], branching when p[j+1] === \"*\".",
        "intuition": "If p[j+1] === \"*\", we can either skip the star entirely (dfs(i, j+2)) or consume one matching character (dfs(i+1, j)).",
        "codeJS": "function isMatchMemo(s, p) {\n  const memo = new Map();\n\n  function dfs(i, j) {\n    if (j === p.length) return i === s.length;\n    const key = `${i},${j}`;\n    if (memo.has(key)) return memo.get(key);\n\n    const match = i < s.length && (s[i] === p[j] || p[j] === '.');\n\n    let res = false;\n    if (j + 1 < p.length && p[j + 1] === '*') {\n      // Option 1: use * as zero occurrences (dfs(i, j+2))\n      // Option 2: use * to match 1 char and stay on * (dfs(i+1, j))\n      res = dfs(i, j + 2) || (match && dfs(i + 1, j));\n    } else if (match) {\n      res = dfs(i + 1, j + 1);\n    }\n\n    memo.set(key, res);\n    return res;\n  }\n\n  return dfs(0, 0);\n}",
        "codeTS": "function isMatchMemo(s: string, p: string): boolean {\n  const memo = new Map<string, boolean>();\n\n  function dfs(i: number, j: number): boolean {\n    if (j === p.length) return i === s.length;\n    const key = `${i},${j}`;\n    if (memo.has(key)) return memo.get(key)!;\n\n    const match = i < s.length && (s[i] === p[j] || p[j] === '.');\n\n    let res = false;\n    if (j + 1 < p.length && p[j + 1] === '*') {\n      res = dfs(i, j + 2) || (match && dfs(i + 1, j));\n    } else if (match) {\n      res = dfs(i + 1, j + 1);\n    }\n\n    memo.set(key, res);\n    return res;\n  }\n\n  return dfs(0, 0);\n}",
        "lineByLine": [
          "Line 4: Base case: if pattern is exhausted, string must also be exhausted.",
          "Line 8: match is true if current characters equal or pattern is dot '.'.",
          "Line 11-15: If next character is '*', either skip the preceding token entirely (j+2) or consume matching character and stay at star (i+1, j).",
          "Line 16: If single character match without star, advance both (i+1, j+1)."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s = \"aab\", p = \"c*a*b\"",
            "action": "c* skipped (j=2)",
            "result": "\"a*b\" matches \"aab\""
          },
          {
            "step": 2,
            "state": "a* consumes 'a', then 'a'",
            "action": "b matches b",
            "result": "Returns true"
          }
        ],
        "complexityDerivation": "M * N states visited once -> O(M * N) time and O(M * N) memory."
      },
      {
        "name": "Approach 2: 2D Dynamic Programming Table (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(M * N)",
        "spaceComplexity": "O(M * N)",
        "summary": "dp[i][j] is true if s[0...i-1] matches p[0...j-1].",
        "intuition": "Bottom-up table transitions: if p[j-1] is '*', dp[i][j] = dp[i][j-2] || (match && dp[i-1][j]).",
        "codeJS": "function isMatch(s, p) {\n  const m = s.length;\n  const n = p.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));\n  dp[0][0] = true;\n\n  // Patterns like a*, a*b*, a*b*c* match empty string\n  for (let j = 2; j <= n; j += 2) {\n    if (p[j - 1] === '*') {\n      dp[0][j] = dp[0][j - 2];\n    }\n  }\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (p[j - 1] === '*') {\n        // Zero occurrences of preceding element: dp[i][j-2]\n        dp[i][j] = dp[i][j - 2];\n        // One or more occurrences if preceding element matches s[i-1]\n        const match = s[i - 1] === p[j - 2] || p[j - 2] === '.';\n        if (match) {\n          dp[i][j] = dp[i][j] || dp[i - 1][j];\n        }\n      } else {\n        const match = s[i - 1] === p[j - 1] || p[j - 1] === '.';\n        if (match) {\n          dp[i][j] = dp[i - 1][j - 1];\n        }\n      }\n    }\n  }\n\n  return dp[m][n];\n}",
        "codeTS": "function isMatch(s: string, p: string): boolean {\n  const m = s.length;\n  const n = p.length;\n  const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));\n  dp[0][0] = true;\n\n  for (let j = 2; j <= n; j += 2) {\n    if (p[j - 1] === '*') {\n      dp[0][j] = dp[0][j - 2];\n    }\n  }\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (p[j - 1] === '*') {\n        dp[i][j] = dp[i][j - 2];\n        const match = s[i - 1] === p[j - 2] || p[j - 2] === '.';\n        if (match) {\n          dp[i][j] = dp[i][j] || dp[i - 1][j];\n        }\n      } else {\n        const match = s[i - 1] === p[j - 1] || p[j - 1] === '.';\n        if (match) {\n          dp[i][j] = dp[i - 1][j - 1];\n        }\n      }\n    }\n  }\n\n  return dp[m][n];\n}",
        "lineByLine": [
          "Line 5: dp[0][0] = true: empty string matches empty pattern.",
          "Line 7-11: Handle patterns like \"a*\" matching empty string by checking dp[0][j-2].",
          "Line 13-28: If p[j-1] is '*', take zero occurrences (dp[i][j-2]) or, if preceding char matches, one/more occurrences (dp[i-1][j]). If not '*', standard diagonal match.",
          "Line 31: Return dp[m][n]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s = \"ab\", p = \".*\"",
            "action": ".* matches any string",
            "result": "dp[2][2] = true"
          },
          {
            "step": 2,
            "state": "Result",
            "action": "dp[m][n] === true",
            "result": "Returns true"
          }
        ],
        "complexityDerivation": "Fills (M + 1) * (N + 1) grid -> O(M * N) time and O(M * N) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Top-Down Memoized",
        "time": "O(M * N)",
        "space": "O(M * N)",
        "pros": "Direct expression of regex choices",
        "cons": "Recursion overhead"
      },
      {
        "approach": "Bottom-Up DP Table",
        "time": "O(M * N)",
        "space": "O(M * N)",
        "pros": "Iterative, cache friendly, handles edge cases via base row",
        "cons": "Complex base row setup"
      }
    ],
    "interviewPitch": "Regular Expression Matching is governed by how we handle the '*' wildcard, which matches zero or more of the preceding character. In our 2D DP matrix where dp[i][j] represents whether s[0...i-1] matches p[0...j-1]: If p[j-1] is not '*', we simply match characters and inherit from dp[i-1][j-1]. If p[j-1] is '*', we have two choices: treat '*' as zero occurrences (dp[i][j-2]), or, if the preceding character matches s[i-1], treat it as one more occurrence and inherit from dp[i-1][j]. This runs in O(M * N) time and O(M * N) space.",
    "followUps": [
      {
        "question": "How is this different from Wildcard Matching ('?' and '*')?",
        "answer": "In Wildcard Matching, '*' stands alone and matches any sequence of characters directly; in Regex Matching, '*' modifies the preceding character specifically."
      }
    ],
    "recallQuiz": {
      "question": "When p[j-1] is \"*\", what does dp[i][j-2] represent?",
      "options": [
        "Treating the preceding character and star as matching zero times",
        "Deleting two characters from string s",
        "A syntax error",
        "Matching two characters"
      ],
      "correctIndex": 0,
      "explanation": "Skipping back two columns in the pattern completely ignores the preceding character and the asterisk, representing 0 occurrences."
    }
  }
};
