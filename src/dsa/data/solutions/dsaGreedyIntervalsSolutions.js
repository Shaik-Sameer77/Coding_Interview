// Problems 124 to 135: Greedy & Intervals Master Solutions
// Multi-Approach Solutions with JS & TS, Line-by-Line Breakdown, Dry Runs, Pitches, and Recall Quizzes
// Strictly adheres to AGENTS.md Section 4 Multi-Approach standard

export const GREEDY_INTERVALS_SOLUTIONS = {
  "124": {
    "id": 124,
    "title": "Maximum Subarray",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "day": 74,
    "leetcodeUrl": "https://leetcode.com/problems/maximum-subarray/",
    "summary": "Find the contiguous subarray with the largest sum and return its sum.",
    "prerequisites": [
      "Kadane's algorithm",
      "Divide and conquer"
    ],
    "problemStatement": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    "approaches": [
      {
        "name": "Approach 1: Divide and Conquer (Improved)",
        "badge": "Improved / Divide & Conquer",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(log N)",
        "summary": "Recursively split array into halves and compute max crossing subarray sum.",
        "intuition": "The maximum subarray either lies entirely in the left half, entirely in the right half, or crosses the midpoint.",
        "codeJS": "function maxSubArrayDC(nums) {\n  function findMax(l, r) {\n    if (l === r) return nums[l];\n    const mid = (l + r) >> 1;\n    const leftMax = findMax(l, mid);\n    const rightMax = findMax(mid + 1, r);\n\n    // Cross sum\n    let leftCross = -Infinity, cur = 0;\n    for (let i = mid; i >= l; i--) {\n      cur += nums[i];\n      leftCross = Math.max(leftCross, cur);\n    }\n    let rightCross = -Infinity; cur = 0;\n    for (let i = mid + 1; i <= r; i++) {\n      cur += nums[i];\n      rightCross = Math.max(rightCross, cur);\n    }\n\n    return Math.max(leftMax, rightMax, leftCross + rightCross);\n  }\n\n  return findMax(0, nums.length - 1);\n}",
        "codeTS": "function maxSubArrayDC(nums: number[]): number {\n  function findMax(l: number, r: number): number {\n    if (l === r) return nums[l];\n    const mid = (l + r) >> 1;\n    const leftMax = findMax(l, mid);\n    const rightMax = findMax(mid + 1, r);\n\n    let leftCross = -Infinity, cur = 0;\n    for (let i = mid; i >= l; i--) {\n      cur += nums[i];\n      leftCross = Math.max(leftCross, cur);\n    }\n    let rightCross = -Infinity; cur = 0;\n    for (let i = mid + 1; i <= r; i++) {\n      cur += nums[i];\n      rightCross = Math.max(rightCross, cur);\n    }\n\n    return Math.max(leftMax, rightMax, leftCross + rightCross);\n  }\n\n  return findMax(0, nums.length - 1);\n}",
        "lineByLine": [
          "Line 3: Base case: single element returns itself.",
          "Line 5-6: Recursively compute max in left and right halves.",
          "Line 9-18: Linear scan outward from mid computes maximum crossing subarray sum.",
          "Line 20: Return maximum of {leftMax, rightMax, crossSum}."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums=[-2,1,-3,4,-1,2,1,-5,4]",
            "action": "Splits in halves recursively",
            "result": "Calculates cross sums"
          },
          {
            "step": 2,
            "state": "Mid crossing [4, -1, 2, 1]",
            "action": "cross sum = 6",
            "result": "Returns 6"
          }
        ],
        "complexityDerivation": "T(N) = 2T(N/2) + O(N) by Master Theorem -> O(N log N) time and O(log N) stack space."
      },
      {
        "name": "Approach 2: Kadane's Algorithm (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Track running sum curSum; if curSum < 0, reset to 0.",
        "intuition": "A negative prefix can never contribute positively to any future subarray, so we greedily discard it.",
        "codeJS": "function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let curSum = 0;\n\n  for (const n of nums) {\n    if (curSum < 0) {\n      curSum = 0; // Discard negative prefix\n    }\n    curSum += n;\n    maxSum = Math.max(maxSum, curSum);\n  }\n\n  return maxSum;\n}",
        "codeTS": "function maxSubArray(nums: number[]): number {\n  let maxSum = nums[0];\n  let curSum = 0;\n\n  for (const n of nums) {\n    if (curSum < 0) {\n      curSum = 0;\n    }\n    curSum += n;\n    maxSum = Math.max(maxSum, curSum);\n  }\n\n  return maxSum;\n}",
        "lineByLine": [
          "Line 2-3: Initialize maxSum to nums[0] and curSum to 0.",
          "Line 5: Iterate over all elements in the array.",
          "Line 6-8: If curSum dropped below 0, reset to 0 (greedy abandonment of negative prefix).",
          "Line 9-10: Add current element and update global maxSum."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [-2, 1, -3, 4, -1, 2, 1]",
            "action": "n=-2: cur=-2, max=-2",
            "result": "cur reset to 0"
          },
          {
            "step": 2,
            "state": "n=1: cur=1, max=1; n=-3: cur=-2",
            "result": "cur reset to 0"
          },
          {
            "step": 3,
            "state": "n=4, -1, 2, 1",
            "action": "cur = 4 -> 3 -> 5 -> 6",
            "result": "maxSum = 6"
          }
        ],
        "complexityDerivation": "Single loop of length N -> O(N) time with O(1) auxiliary space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Divide and Conquer",
        "time": "O(N log N)",
        "space": "O(log N)",
        "pros": "Extends well to segment trees and parallel computing",
        "cons": "Slower than linear single pass"
      },
      {
        "approach": "Kadane's Algorithm",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Optimal single pass, cache friendly",
        "cons": "Requires careful handling of all-negative arrays"
      }
    ],
    "interviewPitch": "Maximum Subarray is solved in O(N) time and O(1) space using Kadane's algorithm. We iterate through the array maintaining a running sum. Because a negative prefix strictly decreases the sum of any subsequent subarray, whenever our running sum drops below zero, we greedily reset it to zero. We update our global maximum at each step. This runs in strictly O(N) time and O(1) space.",
    "followUps": [
      {
        "question": "What if all numbers in the array are negative?",
        "answer": "Initializing maxSum to nums[0] (or -Infinity) and resetting curSum before adding n guarantees that the single least-negative number is correctly returned."
      }
    ],
    "recallQuiz": {
      "question": "Why does resetting curSum to 0 when curSum < 0 maintain optimality?",
      "options": [
        "Because any future subarray starting after a negative sum would achieve a higher sum without that negative prefix",
        "Because zeroes do not affect multiplication",
        "Because negative numbers are invalid",
        "Because of parity"
      ],
      "correctIndex": 0,
      "explanation": "If a prefix sums to less than zero, removing it strictly increases the sum of the remaining suffix."
    }
  },
  "125": {
    "id": 125,
    "title": "Jump Game",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "day": 74,
    "leetcodeUrl": "https://leetcode.com/problems/jump-game/",
    "summary": "Determine if you are able to reach the last index starting from index 0.",
    "prerequisites": [
      "Greedy frontier expansion",
      "Goalpost shifting"
    ],
    "problemStatement": "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.",
    "approaches": [
      {
        "name": "Approach 1: Reverse Goalpost Greedy (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Start goal at n-1 and shift backward if index i can reach the goal.",
        "intuition": "If index i can jump to or past goal (i + nums[i] >= goal), then index i becomes our new target goal!",
        "codeJS": "function canJump(nums) {\n  let goal = nums.length - 1;\n\n  for (let i = nums.length - 2; i >= 0; i--) {\n    if (i + nums[i] >= goal) {\n      goal = i; // shift goalpost backward\n    }\n  }\n\n  return goal === 0;\n}",
        "codeTS": "function canJump(nums: number[]): boolean {\n  let goal = nums.length - 1;\n\n  for (let i = nums.length - 2; i >= 0; i--) {\n    if (i + nums[i] >= goal) {\n      goal = i;\n    }\n  }\n\n  return goal === 0;\n}",
        "lineByLine": [
          "Line 2: Goal is initially the last index nums.length - 1.",
          "Line 4: Walk backwards from second-to-last element to index 0.",
          "Line 5-7: If current index i plus its jump length can reach or exceed goal, shift goal to i.",
          "Line 10: If goal reaches 0, the last index is reachable from start."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [2, 3, 1, 1, 4]",
            "action": "goal = 4",
            "result": "i=3: 3+1 >= 4 -> goal = 3"
          },
          {
            "step": 2,
            "state": "i=2: 2+1 >= 3 -> goal=2",
            "action": "i=1: 1+3 >= 2 -> goal=1",
            "result": "i=0: 0+2 >= 1 -> goal=0"
          },
          {
            "step": 3,
            "state": "End",
            "action": "goal === 0",
            "result": "Returns true"
          }
        ],
        "complexityDerivation": "Single backwards pass over N elements -> O(N) time with O(1) space."
      },
      {
        "name": "Approach 2: Forward Max Reachable Frontier (Alternative Optimal)",
        "badge": "Alternative / Forward Scan",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Maintain maxReach index while walking forward from 0.",
        "intuition": "If current index i exceeds maxReach, we are stranded and cannot proceed.",
        "codeJS": "function canJumpForward(nums) {\n  let maxReach = 0;\n\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false; // Stranded!\n    maxReach = Math.max(maxReach, i + nums[i]);\n    if (maxReach >= nums.length - 1) return true;\n  }\n\n  return true;\n}",
        "codeTS": "function canJumpForward(nums: number[]): boolean {\n  let maxReach = 0;\n\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false;\n    maxReach = Math.max(maxReach, i + nums[i]);\n    if (maxReach >= nums.length - 1) return true;\n  }\n\n  return true;\n}",
        "lineByLine": [
          "Line 2: Track furthest index reachable so far.",
          "Line 4-5: If current index i is beyond maxReach, we reached a gap that cannot be crossed -> return false.",
          "Line 6: Update maxReach to max(maxReach, i + nums[i]).",
          "Line 7: Early exit if maxReach reaches or passes end of array."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [3, 2, 1, 0, 4]",
            "action": "i=0: reach=3; i=1: reach=3; i=2: reach=3; i=3: reach=3",
            "result": "i=4 > reach(3)"
          },
          {
            "step": 2,
            "state": "Stranded",
            "action": "4 > 3",
            "result": "Returns false"
          }
        ],
        "complexityDerivation": "Single forward pass visiting each index once -> O(N) time and O(1) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Reverse Goalpost Greedy",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Extremely clean invariant: goal === 0",
        "cons": "Scans backward"
      },
      {
        "approach": "Forward Frontier Greedy",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Early exits immediately when maxReach >= end",
        "cons": "Requires index boundary checks"
      }
    ],
    "interviewPitch": "Jump Game can be solved greedily in O(N) time and O(1) space. Using the reverse goalpost technique, we set our target goal to the last index (n - 1). Moving backwards from right to left, if an index i can reach the current goal (i + nums[i] >= goal), we shift our goalpost backward to i, because reaching i guarantees reaching the original goal. At the end, if the goal reached index 0, the last index is reachable. This runs in O(N) time and O(1) space.",
    "followUps": [
      {
        "question": "What if we also need the minimum jumps to reach the end?",
        "answer": "Jump Game II: Maintain current jump boundary and track the furthest reach, incrementing jumps whenever we reach the boundary."
      }
    ],
    "recallQuiz": {
      "question": "Why does shifting the goalpost to i when i + nums[i] >= goal guarantee correctness?",
      "options": [
        "Because reaching index i is sufficient to reach the previous goal, simplifying the problem to reaching i",
        "Because nums[i] is positive",
        "Because arrays are zero-indexed",
        "Because goals cannot decrease"
      ],
      "correctIndex": 0,
      "explanation": "If any earlier index can reach i, it can jump to i and from i jump to the goal, making i a valid surrogate goal."
    }
  },
  "126": {
    "id": 126,
    "title": "Jump Game II",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "day": 75,
    "leetcodeUrl": "https://leetcode.com/problems/jump-game-ii/",
    "summary": "Return the minimum number of jumps to reach the last index (it is guaranteed you can reach it).",
    "prerequisites": [
      "BFS level concept in arrays",
      "Greedy interval jumping"
    ],
    "problemStatement": "You are given a 0-indexed array of integers `nums` of length `n`. Return the minimum number of jumps to reach `nums[n - 1]`. You can assume that you can always reach `nums[n - 1]`.",
    "approaches": [
      {
        "name": "Approach 1: Dynamic Programming Array (Improved)",
        "badge": "Improved / DP",
        "timeComplexity": "O(N²)",
        "spaceComplexity": "O(N)",
        "summary": "dp[i] stores min jumps to reach index i from index 0.",
        "intuition": "From each index i, update all reachable indices j in [i+1, i+nums[i]] with min(dp[j], dp[i] + 1).",
        "codeJS": "function jumpDP(nums) {\n  const n = nums.length;\n  const dp = new Array(n).fill(Infinity);\n  dp[0] = 0;\n\n  for (let i = 0; i < n; i++) {\n    const maxReach = Math.min(n - 1, i + nums[i]);\n    for (let j = i + 1; j <= maxReach; j++) {\n      dp[j] = Math.min(dp[j], dp[i] + 1);\n    }\n  }\n\n  return dp[n - 1];\n}",
        "codeTS": "function jumpDP(nums: number[]): number {\n  const n = nums.length;\n  const dp: number[] = new Array(n).fill(Infinity);\n  dp[0] = 0;\n\n  for (let i = 0; i < n; i++) {\n    const maxReach = Math.min(n - 1, i + nums[i]);\n    for (let j = i + 1; j <= maxReach; j++) {\n      dp[j] = Math.min(dp[j], dp[i] + 1);\n    }\n  }\n\n  return dp[n - 1];\n}",
        "lineByLine": [
          "Line 3-4: Allocate dp array initialized to Infinity with dp[0] = 0.",
          "Line 6-11: For each index i, relax all reachable neighbor indices j with dp[i] + 1.",
          "Line 13: Return dp[n - 1]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [2, 3, 1, 1, 4]",
            "action": "i=0: dp[1]=1, dp[2]=1",
            "result": "depth 1"
          },
          {
            "step": 2,
            "state": "i=1 (reach 4)",
            "action": "dp[3]=2, dp[4]=2",
            "result": "depth 2"
          },
          {
            "step": 3,
            "state": "Done",
            "action": "dp[4] = 2",
            "result": "Returns 2"
          }
        ],
        "complexityDerivation": "Worst case nested loops explore all pairs -> O(N^2) time and O(N) space."
      },
      {
        "name": "Approach 2: Greedy Implicit BFS (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Treat jumps as BFS levels; advance jump count when reaching current level boundary.",
        "intuition": "Each jump defines a window [curEnd, maxReach]. We greedily expand maxReach across the window, and increment jumps when reaching curEnd.",
        "codeJS": "function jump(nums) {\n  let jumps = 0;\n  let curEnd = 0;\n  let maxReach = 0;\n\n  for (let i = 0; i < nums.length - 1; i++) {\n    maxReach = Math.max(maxReach, i + nums[i]);\n\n    if (i === curEnd) {\n      jumps++;\n      curEnd = maxReach;\n      if (curEnd >= nums.length - 1) break;\n    }\n  }\n\n  return jumps;\n}",
        "codeTS": "function jump(nums: number[]): number {\n  let jumps = 0;\n  let curEnd = 0;\n  let maxReach = 0;\n\n  for (let i = 0; i < nums.length - 1; i++) {\n    maxReach = Math.max(maxReach, i + nums[i]);\n\n    if (i === curEnd) {\n      jumps++;\n      curEnd = maxReach;\n      if (curEnd >= nums.length - 1) break;\n    }\n  }\n\n  return jumps;\n}",
        "lineByLine": [
          "Line 2-4: Track jumps count, current jump boundary curEnd, and furthest reachable frontier maxReach.",
          "Line 6: Loop up to nums.length - 2 (we do not need to jump from the last index!).",
          "Line 7: Continually update furthest reach possible.",
          "Line 9-13: When index reaches current jump boundary, increment jump and advance boundary to maxReach."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "nums = [2, 3, 1, 1, 4]",
            "action": "i=0: maxReach=2, i===curEnd(0) -> jumps=1, curEnd=2",
            "result": "jump 1"
          },
          {
            "step": 2,
            "state": "i=1: maxReach=4; i=2: maxReach=4, i===curEnd(2) -> jumps=2, curEnd=4",
            "result": "jump 2"
          },
          {
            "step": 3,
            "state": "curEnd >= 4",
            "action": "break and return",
            "result": "Returns 2"
          }
        ],
        "complexityDerivation": "Single loop over N-1 items -> O(N) time with O(1) auxiliary space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "O(N²) DP Array",
        "time": "O(N²)",
        "space": "O(N)",
        "pros": "Direct shortest path relaxation",
        "cons": "Quadratic time on large arrays"
      },
      {
        "approach": "Greedy Implicit BFS",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Linear time, zero memory allocation, optimal",
        "cons": "Loop stops at length - 2"
      }
    ],
    "interviewPitch": "Jump Game II is modeled as an implicit Breadth-First Search (BFS) over array intervals. Each jump level represents the range of indices reachable in that number of jumps. We maintain two pointers: curEnd (the boundary of our current jump level) and maxReach (the furthest index reachable from any position in the current level). As we iterate through the array, we update maxReach. When our loop index reaches curEnd, we must take another jump: we increment jumps and set curEnd to maxReach. This runs in strictly O(N) time and O(1) space.",
    "followUps": [
      {
        "question": "Why does the loop terminate at nums.length - 2 instead of nums.length - 1?",
        "answer": "Because once we reach the last index, we have arrived at our goal; jumping from the last element would erroneously add an unnecessary extra jump!"
      }
    ],
    "recallQuiz": {
      "question": "What triggers an increment in the jumps counter in the optimal greedy approach?",
      "options": [
        "Reaching the end boundary of the current jump level (i === curEnd)",
        "Encountering a zero in the array",
        "Reaching nums.length - 1",
        "When nums[i] is greater than previous element"
      ],
      "correctIndex": 0,
      "explanation": "Reaching curEnd means we have exhausted the previous jump's reach and must commit to the next jump."
    }
  },
  "127": {
    "id": 127,
    "title": "Gas Station",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "day": 75,
    "leetcodeUrl": "https://leetcode.com/problems/gas-station/",
    "summary": "Find the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.",
    "prerequisites": [
      "Net gas surplus tracking",
      "Greedy start candidate reset"
    ],
    "problemStatement": "There are `n` gas stations along a circular route, where the amount of gas at the `i-th` station is `gas[i]`. You have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the `i-th` station to its next `(i + 1)-th` station. Return the starting gas station's index if you can complete the circuit, or -1.",
    "approaches": [
      {
        "name": "Approach 1: Simulation from Every Station (Baseline)",
        "badge": "Baseline / Simulation",
        "timeComplexity": "O(N²)",
        "spaceComplexity": "O(1)",
        "summary": "Simulate the journey starting from each station i until tank runs out.",
        "intuition": "Try every station as starting point; if car travels N steps without negative tank, return that start.",
        "codeJS": "function canCompleteCircuitBrute(gas, cost) {\n  const n = gas.length;\n  for (let start = 0; start < n; start++) {\n    let tank = 0;\n    let possible = true;\n    for (let step = 0; step < n; step++) {\n      const i = (start + step) % n;\n      tank += gas[i] - cost[i];\n      if (tank < 0) {\n        possible = false;\n        break;\n      }\n    }\n    if (possible) return start;\n  }\n  return -1;\n}",
        "codeTS": "function canCompleteCircuitBrute(gas: number[], cost: number[]): number {\n  const n = gas.length;\n  for (let start = 0; start < n; start++) {\n    let tank = 0;\n    let possible = true;\n    for (let step = 0; step < n; step++) {\n      const i = (start + step) % n;\n      tank += gas[i] - cost[i];\n      if (tank < 0) {\n        possible = false;\n        break;\n      }\n    }\n    if (possible) return start;\n  }\n  return -1;\n}",
        "lineByLine": [
          "Line 3-4: Try each station as candidate start.",
          "Line 7-13: Simulate circuit step-by-step; if tank drops below 0, break early.",
          "Line 15: If journey completes all N stations without tank < 0, return start."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "gas=[1,2,3,4,5], cost=[3,4,5,1,2]",
            "action": "start=0: tank 1-3 = -2 < 0",
            "result": "fail"
          },
          {
            "step": 2,
            "state": "start=3",
            "action": "travels all stations",
            "result": "Returns 3"
          }
        ],
        "complexityDerivation": "Tests N starting points for N steps -> O(N^2) time and O(1) space."
      },
      {
        "name": "Approach 2: One-Pass Greedy Candidate Reset (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "If total gas < total cost, return -1. Otherwise, if current tank < 0, candidate start must be i + 1.",
        "intuition": "If car runs out of gas between start and station i, NO station between start and i could possibly reach past i! So next candidate is i + 1.",
        "codeJS": "function canCompleteCircuit(gas, cost) {\n  let totalGas = 0;\n  let totalCost = 0;\n  let curTank = 0;\n  let start = 0;\n\n  for (let i = 0; i < gas.length; i++) {\n    totalGas += gas[i];\n    totalCost += cost[i];\n    curTank += gas[i] - cost[i];\n\n    if (curTank < 0) {\n      // Cannot reach i+1 from current start; reset candidate\n      start = i + 1;\n      curTank = 0;\n    }\n  }\n\n  return totalGas < totalCost ? -1 : start;\n}",
        "codeTS": "function canCompleteCircuit(gas: number[], cost: number[]): number {\n  let totalGas = 0;\n  let totalCost = 0;\n  let curTank = 0;\n  let start = 0;\n\n  for (let i = 0; i < gas.length; i++) {\n    totalGas += gas[i];\n    totalCost += cost[i];\n    curTank += gas[i] - cost[i];\n\n    if (curTank < 0) {\n      start = i + 1;\n      curTank = 0;\n    }\n  }\n\n  return totalGas < totalCost ? -1 : start;\n}",
        "lineByLine": [
          "Line 2-5: Accumulate totalGas, totalCost, running curTank, and candidate start index.",
          "Line 7-10: Update totals and curTank with net difference (gas[i] - cost[i]).",
          "Line 12-16: If curTank drops below 0, no station from start to i can be the start: reset start = i + 1 and curTank = 0.",
          "Line 19: If totalGas < totalCost, circuit is impossible (-1); otherwise start is mathematically guaranteed."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "gas=[1,2,3,4,5], cost=[3,4,5,1,2]",
            "action": "i=0..2: net negatives, start reset to 3",
            "result": "start = 3"
          },
          {
            "step": 2,
            "state": "i=3: net +3; i=4: net +3",
            "action": "totalGas(15) >= totalCost(15)",
            "result": "Returns 3"
          }
        ],
        "complexityDerivation": "Single loop over N elements -> O(N) time with strictly O(1) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Brute Force Simulation",
        "time": "O(N²)",
        "space": "O(1)",
        "pros": "Direct simulation",
        "cons": "Redundant quadratic checks; TLE"
      },
      {
        "approach": "One-Pass Greedy Reset",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Optimal single pass, mathematical guarantee",
        "cons": "Requires two key insights"
      }
    ],
    "interviewPitch": "Gas Station is solved in O(N) time and O(1) space using two greedy observations: First, if sum(gas) < sum(cost), it is mathematically impossible to complete the circuit regardless of starting point, so we return -1. Second, if we start at station A and run out of gas at station B, no station between A and B can be a valid starting station either (because any station starting after A would arrive with less or equal gas). Therefore, whenever our running tank drops below zero, we greedily reset our candidate start to i + 1 and reset our tank to 0. This runs in strictly O(N) time and O(1) space.",
    "followUps": [
      {
        "question": "Why is start guaranteed to complete the circuit if totalGas >= totalCost?",
        "answer": "Because the total circuit net balance is >= 0, and the chosen start experienced no negative dips for the remainder of the array, the accumulated positive surplus is guaranteed to carry it through the earlier stations."
      }
    ],
    "recallQuiz": {
      "question": "If you run out of gas at station B having started at station A, why can no station C between A and B be the valid start?",
      "options": [
        "Because starting at C means starting with 0 gas, whereas reaching C from A had >= 0 gas, meaning C would run out of gas even sooner",
        "Because gas stations are sorted",
        "Because costs are non-decreasing",
        "Because of modular arithmetic"
      ],
      "correctIndex": 0,
      "explanation": "Starting at A provided a non-negative buffer when reaching C. Starting at C with zero buffer will inevitably fail at or before B."
    }
  },
  "128": {
    "id": 128,
    "title": "Hand of Straights",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "day": 76,
    "leetcodeUrl": "https://leetcode.com/problems/hand-of-straights/",
    "summary": "Determine if Alice's hand can be rearranged into groups of size groupSize consisting of groupSize consecutive cards.",
    "prerequisites": [
      "Frequency Map",
      "Min-Heap or Sorted Keys Greedy matching"
    ],
    "problemStatement": "Alice has some number of cards and she wants to rearrange the cards into groups so that each group is of size `groupSize`, and consists of `groupSize` consecutive cards. Return `true` if and only if she can.",
    "approaches": [
      {
        "name": "Approach 1: Frequency Map with Sorted Keys (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "summary": "Sort cards or unique keys, and for each available card, greedily form group of consecutive cards.",
        "intuition": "The smallest remaining card MUST be the start of a consecutive group. If card+1, ..., card+groupSize-1 are not available, it is impossible.",
        "codeJS": "function isNStraightHand(hand, groupSize) {\n  if (hand.length % groupSize !== 0) return false;\n\n  const count = new Map();\n  for (const card of hand) {\n    count.set(card, (count.get(card) || 0) + 1);\n  }\n\n  hand.sort((a, b) => a - b);\n\n  for (const card of hand) {\n    if (count.get(card) > 0) {\n      // Must form group starting at this card\n      for (let i = 0; i < groupSize; i++) {\n        const nextCard = card + i;\n        const currentCount = count.get(nextCard) || 0;\n        if (currentCount === 0) {\n          return false; // Missing consecutive card\n        }\n        count.set(nextCard, currentCount - 1);\n      }\n    }\n  }\n\n  return true;\n}",
        "codeTS": "function isNStraightHand(hand: number[], groupSize: number): boolean {\n  if (hand.length % groupSize !== 0) return false;\n\n  const count = new Map<number, number>();\n  for (const card of hand) {\n    count.set(card, (count.get(card) || 0) + 1);\n  }\n\n  hand.sort((a, b) => a - b);\n\n  for (const card of hand) {\n    if ((count.get(card) || 0) > 0) {\n      for (let i = 0; i < groupSize; i++) {\n        const nextCard = card + i;\n        const currentCount = count.get(nextCard) || 0;\n        if (currentCount === 0) {\n          return false;\n        }\n        count.set(nextCard, currentCount - 1);\n      }\n    }\n  }\n\n  return true;\n}",
        "lineByLine": [
          "Line 2: Fast return: total cards must be divisible by groupSize.",
          "Line 4-7: Build frequency Map of all card values.",
          "Line 9: Sort array to process smallest cards first.",
          "Line 11-21: For each available card, greedily consume groupSize consecutive cards from the count Map. If any card is missing, return false."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "hand=[1,2,3,6,2,3,4,7,8], groupSize=3",
            "action": "Sorted: [1,2,2,3,3,4,6,7,8]",
            "result": "divisible by 3"
          },
          {
            "step": 2,
            "state": "Start 1: takes 1, 2, 3",
            "action": "Start 2: takes 2, 3, 4",
            "result": "remaining [6, 7, 8]"
          },
          {
            "step": 3,
            "state": "Start 6: takes 6, 7, 8",
            "action": "all counts 0",
            "result": "Returns true"
          }
        ],
        "complexityDerivation": "Sorting takes O(N log N). Map lookups take O(N) -> O(N log N) time and O(N) space."
      },
      {
        "name": "Approach 2: Min-Heap with Frequency Map (Alternative)",
        "badge": "Alternative / Heap",
        "timeComplexity": "O(N log K)",
        "spaceComplexity": "O(N)",
        "summary": "Store unique card keys in a Min-Heap and repeatedly pop the minimum card to form groups.",
        "intuition": "Avoids sorting full array if many duplicates exist (K distinct cards).",
        "codeJS": "function isNStraightHandHeap(hand, groupSize) {\n  if (hand.length % groupSize !== 0) return false;\n  const count = new Map();\n  for (const c of hand) count.set(c, (count.get(c) || 0) + 1);\n\n  const keys = Array.from(count.keys()).sort((a, b) => a - b);\n\n  for (const k of keys) {\n    const c = count.get(k);\n    if (c > 0) {\n      for (let i = 0; i < groupSize; i++) {\n        const next = k + i;\n        if ((count.get(next) || 0) < c) return false;\n        count.set(next, count.get(next) - c);\n      }\n    }\n  }\n\n  return true;\n}",
        "codeTS": "function isNStraightHandHeap(hand: number[], groupSize: number): boolean {\n  if (hand.length % groupSize !== 0) return false;\n  const count = new Map<number, number>();\n  for (const c of hand) count.set(c, (count.get(c) || 0) + 1);\n\n  const keys = Array.from(count.keys()).sort((a, b) => a - b);\n\n  for (const k of keys) {\n    const c = count.get(k)!;\n    if (c > 0) {\n      for (let i = 0; i < groupSize; i++) {\n        const next = k + i;\n        if ((count.get(next) || 0) < c) return false;\n        count.set(next, count.get(next)! - c);\n      }\n    }\n  }\n\n  return true;\n}",
        "lineByLine": [
          "Line 2: Check divisibility.",
          "Line 3-4: Build card frequency map.",
          "Line 6: Extract unique keys and sort them.",
          "Line 8-15: Batch decrement: if card k has count c, then k+1...k+groupSize-1 must each have at least count c."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "unique keys sorted",
            "action": "batch subtracts count of starting card",
            "result": "O(K log K) operations"
          }
        ],
        "complexityDerivation": "K unique keys sorted in O(K log K) -> O(N + K log K) time and O(N) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Sort Full Hand",
        "time": "O(N log N)",
        "space": "O(N)",
        "pros": "Simple to implement",
        "cons": "Sorts duplicate cards"
      },
      {
        "approach": "Unique Keys Batch Decrement",
        "time": "O(N + K log K)",
        "space": "O(N)",
        "pros": "Significantly faster when many duplicate cards exist",
        "cons": "Requires unique key sorting"
      }
    ],
    "interviewPitch": "First, hand.length must be divisible by groupSize. We count card frequencies in a Map. The smallest card currently available must inevitably form the beginning of a consecutive group. We sort the unique keys and iterate: for each card with count c > 0, the next groupSize - 1 consecutive cards must also have at least count c. We subtract c from each of their counts. If any consecutive card is missing or insufficient, we return false. This runs in O(N log N) time and O(N) space.",
    "followUps": [
      {
        "question": "What if cards can be grouped into any valid run of length >= 3?",
        "answer": "Split into runs greedily: either extend an existing run or create a new run of length 3 (LeetCode 659)."
      }
    ],
    "recallQuiz": {
      "question": "Why MUST the minimum available card be the start of a group?",
      "options": [
        "Because it cannot be placed in the middle or end of any group without a smaller predecessor existing",
        "Because cards are sorted in ascending order",
        "Because group size is odd",
        "Because cards cannot repeat"
      ],
      "correctIndex": 0,
      "explanation": "Since no smaller card exists in the deck, the minimum card has no predecessor to precede it, forcing it to be the start."
    }
  },
  "129": {
    "id": 129,
    "title": "Merge Triplets to Form Target Triplet",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "day": 76,
    "leetcodeUrl": "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/",
    "summary": "Determine if you can obtain target triplet using element-wise max operations.",
    "prerequisites": [
      "Greedy elimination of invalid candidates",
      "Bitmask / Set tracking of matched positions"
    ],
    "problemStatement": "You are given a 2D integer array `triplets` and an integer array `target = [x, y, z]`. Return `true` if it is possible to obtain the `target` triplet as an element of triplets, or `false` otherwise. Operation is `[max(a, d), max(b, e), max(c, f)]`.",
    "approaches": [
      {
        "name": "Approach 1: Greedy Element-Wise Filtering (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Filter out triplets containing any element exceeding target; track matched indices.",
        "intuition": "Any triplet with an element > target can NEVER be used because max operation can never decrease values!",
        "codeJS": "function mergeTriplets(triplets, target) {\n  const matched = new Set();\n\n  for (const [a, b, c] of triplets) {\n    // If any element exceeds target, this triplet is poison and cannot be used\n    if (a > target[0] || b > target[1] || c > target[2]) {\n      continue;\n    }\n\n    if (a === target[0]) matched.add(0);\n    if (b === target[1]) matched.add(1);\n    if (c === target[2]) matched.add(2);\n\n    if (matched.size === 3) return true; // Found all 3 components\n  }\n\n  return matched.size === 3;\n}",
        "codeTS": "function mergeTriplets(triplets: number[][], target: number[]): boolean {\n  const matched = new Set<number>();\n\n  for (const [a, b, c] of triplets) {\n    if (a > target[0] || b > target[1] || c > target[2]) {\n      continue;\n    }\n\n    if (a === target[0]) matched.add(0);\n    if (b === target[1]) matched.add(1);\n    if (c === target[2]) matched.add(2);\n\n    if (matched.size === 3) return true;\n  }\n\n  return matched.size === 3;\n}",
        "lineByLine": [
          "Line 2: Set tracks which target indices (0, 1, or 2) have been matched.",
          "Line 5-7: If any component of triplet exceeds target, discard it immediately.",
          "Line 9-11: For valid triplets, record any exact matches to target[0], target[1], or target[2].",
          "Line 13: Early return true if all three positions are matched."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "triplets=[[2,5,3],[1,8,4],[1,7,5]], target=[2,7,5]",
            "action": "[1,8,4] has 8 > 7",
            "result": "discarded"
          },
          {
            "step": 2,
            "state": "[2,5,3]",
            "action": "valid, matches target[0]=2",
            "result": "matched={0}"
          },
          {
            "step": 3,
            "state": "[1,7,5]",
            "action": "valid, matches target[1]=7 and target[2]=5",
            "result": "matched={0, 1, 2} -> Returns true"
          }
        ],
        "complexityDerivation": "Single pass visiting each triplet once -> O(N) time with O(1) auxiliary space."
      },
      {
        "name": "Approach 2: Bitmask Flag Tracking (Alternative Optimal)",
        "badge": "Alternative / Bitmask",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Track 3 boolean flags without set allocations.",
        "intuition": "Zero heap memory allocations using three boolean registers.",
        "codeJS": "function mergeTripletsFlags(triplets, target) {\n  let hasA = false, hasB = false, hasC = false;\n\n  for (let i = 0; i < triplets.length; i++) {\n    const [a, b, c] = triplets[i];\n    if (a <= target[0] && b <= target[1] && c <= target[2]) {\n      if (a === target[0]) hasA = true;\n      if (b === target[1]) hasB = true;\n      if (c === target[2]) hasC = true;\n      if (hasA && hasB && hasC) return true;\n    }\n  }\n\n  return hasA && hasB && hasC;\n}",
        "codeTS": "function mergeTripletsFlags(triplets: number[][], target: number[]): boolean {\n  let hasA = false, hasB = false, hasC = false;\n\n  for (let i = 0; i < triplets.length; i++) {\n    const [a, b, c] = triplets[i];\n    if (a <= target[0] && b <= target[1] && c <= target[2]) {\n      if (a === target[0]) hasA = true;\n      if (b === target[1]) hasB = true;\n      if (c === target[2]) hasC = true;\n      if (hasA && hasB && hasC) return true;\n    }\n  }\n\n  return hasA && hasB && hasC;\n}",
        "lineByLine": [
          "Line 2: Boolean flags for target coordinates.",
          "Line 6: Candidate validity check: all elements <= target.",
          "Line 7-9: Flag updates for exact match.",
          "Line 10: Early exit when all three flags are true."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "Scans triplets in single loop",
            "action": "Sets hasA, hasB, hasC to true",
            "result": "Returns true"
          }
        ],
        "complexityDerivation": "Single loop of length N -> O(N) time with strictly O(1) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Set Tracking",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Set size check is clean",
        "cons": "Minor Set object overhead"
      },
      {
        "approach": "Boolean Flags",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Zero heap memory allocations",
        "cons": "Slightly more verbose if statements"
      }
    ],
    "interviewPitch": "The key insight for Merge Triplets is that the max operation is monotonic: taking max(a, b) can only increase or maintain values, never decrease them. Therefore, any triplet that contains a value strictly greater than the corresponding target element is \"poisonous\" and can never be part of our merged set. We discard all such poisonous triplets. For the remaining valid triplets, we simply verify whether we can find at least one triplet matching target[0], one matching target[1], and one matching target[2]. If so, taking the element-wise max of all valid triplets will yield target. This runs in O(N) time and O(1) space.",
    "followUps": [
      {
        "question": "What if we needed to find the minimum number of merge operations?",
        "answer": "Model as Set Cover problem: finding minimum number of valid triplets that cover all 3 target coordinates."
      }
    ],
    "recallQuiz": {
      "question": "Why can a triplet [a, b, c] where a > target[0] never be used in the solution?",
      "options": [
        "Because the max operation can never decrease a value, so target[0] would permanently exceed the target",
        "Because triplets must be sorted",
        "Because target must contain distinct values",
        "Because the array length is odd"
      ],
      "correctIndex": 0,
      "explanation": "max(a, x) >= a. If a > target[0], the merged first component will always be >= a > target[0]."
    }
  },
  "130": {
    "id": 130,
    "title": "Partition Labels",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "day": 78,
    "leetcodeUrl": "https://leetcode.com/problems/partition-labels/",
    "summary": "Partition string so that each letter appears in at most one part. Return list of part sizes.",
    "prerequisites": [
      "Last occurrence index map",
      "Greedy interval boundary extension"
    ],
    "problemStatement": "You are given a string `s`. We want to partition the string into as many parts as possible so that each letter appears in at most one part. Return a list of integers representing the size of these parts.",
    "approaches": [
      {
        "name": "Approach 1: Last Occurrence Greedy Boundary (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Record last seen index of each letter; extend partition boundary to max last seen index.",
        "intuition": "If character c is included in a partition, the partition MUST extend at least to the last occurrence of c.",
        "codeJS": "function partitionLabels(s) {\n  const last = new Map();\n  for (let i = 0; i < s.length; i++) {\n    last.set(s[i], i);\n  }\n\n  const res = [];\n  let start = 0;\n  let end = 0;\n\n  for (let i = 0; i < s.length; i++) {\n    end = Math.max(end, last.get(s[i]));\n    if (i === end) {\n      // Reached boundary where all characters in partition have ended\n      res.push(end - start + 1);\n      start = i + 1;\n    }\n  }\n\n  return res;\n}",
        "codeTS": "function partitionLabels(s: string): number[] {\n  const last = new Map<string, number>();\n  for (let i = 0; i < s.length; i++) {\n    last.set(s[i], i);\n  }\n\n  const res: number[] = [];\n  let start = 0;\n  let end = 0;\n\n  for (let i = 0; i < s.length; i++) {\n    end = Math.max(end, last.get(s[i])!);\n    if (i === end) {\n      res.push(end - start + 1);\n      start = i + 1;\n    }\n  }\n\n  return res;\n}",
        "lineByLine": [
          "Line 2-5: First pass records last occurrence index for all characters.",
          "Line 8-9: start and end track boundaries of current partition.",
          "Line 11-12: Expand end to the furthest last appearance of any character seen in the current partition.",
          "Line 13-17: When index i reaches end, the partition is complete! Record length (end - start + 1) and reset start = i + 1."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s = \"ababcbacadefegdehijhklij\"",
            "action": "last['a']=8, last['b']=5",
            "result": "end stretches to 8"
          },
          {
            "step": 2,
            "state": "i=8: i === end(8)",
            "action": "push 8 - 0 + 1 = 9",
            "result": "first partition \"ababcbaca\" (size 9)"
          },
          {
            "step": 3,
            "state": "Next partitions",
            "action": "sizes 7 and 8",
            "result": "Returns [9, 7, 8]"
          }
        ],
        "complexityDerivation": "Two linear passes over string of length N -> 2N = O(N) time. Map has at most 26 lowercase English letters -> O(1) space."
      },
      {
        "name": "Approach 2: Array Lookup Map (Memory Optimized)",
        "badge": "Optimized / Cache-Friendly",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Use fixed 26-element integer array instead of Map for zero-allocation performance.",
        "intuition": "charCodeAt(0) - 97 maps characters directly to indices 0..25 in CPU L1 cache.",
        "codeJS": "function partitionLabelsArray(s) {\n  const last = new Int32Array(26);\n  for (let i = 0; i < s.length; i++) {\n    last[s.charCodeAt(i) - 97] = i;\n  }\n\n  const res = [];\n  let start = 0, end = 0;\n  for (let i = 0; i < s.length; i++) {\n    const lastPos = last[s.charCodeAt(i) - 97];\n    if (lastPos > end) end = lastPos;\n    if (i === end) {\n      res.push(end - start + 1);\n      start = i + 1;\n    }\n  }\n  return res;\n}",
        "codeTS": "function partitionLabelsArray(s: string): number[] {\n  const last = new Int32Array(26);\n  for (let i = 0; i < s.length; i++) {\n    last[s.charCodeAt(i) - 97] = i;\n  }\n\n  const res: number[] = [];\n  let start = 0, end = 0;\n  for (let i = 0; i < s.length; i++) {\n    const lastPos = last[s.charCodeAt(i) - 97];\n    if (lastPos > end) end = lastPos;\n    if (i === end) {\n      res.push(end - start + 1);\n      start = i + 1;\n    }\n  }\n  return res;\n}",
        "lineByLine": [
          "Line 2: 26-element typed array for characters a-z.",
          "Line 3-5: Record last positions.",
          "Line 8-15: Greedy boundary expansion in pure linear execution."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "Int32Array stores indices",
            "action": "Direct array indexing",
            "result": "Returns [9, 7, 8]"
          }
        ],
        "complexityDerivation": "O(N) time and O(1) auxiliary space (exactly 26 integers)."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Hash Map Lookup",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Readable syntax",
        "cons": "Hash map overhead"
      },
      {
        "approach": "Int32Array Lookup",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Maximum speed, zero V8 object allocations",
        "cons": "Character code arithmetic"
      }
    ],
    "interviewPitch": "Partition Labels is solved using a Greedy Two-Pass approach. In the first pass, we record the last occurrence index of every character in an array of size 26. In the second pass, we maintain start and end pointers for our current partition. As we traverse each character, we extend end to Math.max(end, last[char]). When our loop index i reaches end, it guarantees that no character seen so far appears anywhere later in the string. We record the partition size (end - start + 1) and reset start to i + 1. This runs in O(N) time and O(1) space.",
    "followUps": [
      {
        "question": "How is this related to interval merging?",
        "answer": "Each unique character can be seen as an interval [firstOccurrence, lastOccurrence]. The problem is equivalent to finding connected components of overlapping intervals."
      }
    ],
    "recallQuiz": {
      "question": "Why does i === end guarantee that the current partition can be closed?",
      "options": [
        "Because all characters that appeared in [start...i] have their last occurrence <= end",
        "Because string length is reached",
        "Because characters are alphabetically sorted",
        "Because end is the midpoint"
      ],
      "correctIndex": 0,
      "explanation": "Since end is the maximum of all last occurrences of characters seen so far, reaching i === end means none of these characters appear anywhere beyond end."
    }
  },
  "131": {
    "id": 131,
    "title": "Valid Parenthesis String",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "day": 78,
    "leetcodeUrl": "https://leetcode.com/problems/valid-parenthesis-string/",
    "summary": "Given a string containing '(', ')', and '*', determine if the string is valid where '*' can be '(', ')', or empty.",
    "prerequisites": [
      "Range of open parentheses [minOpen, maxOpen]",
      "Greedy bound maintenance"
    ],
    "problemStatement": "Given a string `s` containing only three types of characters: `'('`, `')'` and `'*'`, return `true` if `s` is valid.\n`'*'` could be treated as a single right parenthesis `')'` or a single left parenthesis `'('` or an empty string `\"\"`.",
    "approaches": [
      {
        "name": "Approach 1: Two Stacks for Indices (Improved)",
        "badge": "Improved / Two Stacks",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "summary": "Maintain stack for open bracket indices and stack for star indices.",
        "intuition": "Store indices of '(' and '*'. For ')', pop from open stack first; if empty, pop from star stack. At end, match remaining open brackets with stars that appear after them.",
        "codeJS": "function checkValidStringStacks(s) {\n  const openStack = [];\n  const starStack = [];\n\n  for (let i = 0; i < s.length; i++) {\n    if (s[i] === '(') openStack.push(i);\n    else if (s[i] === '*') starStack.push(i);\n    else {\n      if (openStack.length > 0) openStack.pop();\n      else if (starStack.length > 0) starStack.pop();\n      else return false;\n    }\n  }\n\n  while (openStack.length > 0 && starStack.length > 0) {\n    if (openStack.pop() > starStack.pop()) {\n      return false; // '*' appeared before '(', cannot close it\n    }\n  }\n\n  return openStack.length === 0;\n}",
        "codeTS": "function checkValidStringStacks(s: string): boolean {\n  const openStack: number[] = [];\n  const starStack: number[] = [];\n\n  for (let i = 0; i < s.length; i++) {\n    if (s[i] === '(') openStack.push(i);\n    else if (s[i] === '*') starStack.push(i);\n    else {\n      if (openStack.length > 0) openStack.pop();\n      else if (starStack.length > 0) starStack.pop();\n      else return false;\n    }\n  }\n\n  while (openStack.length > 0 && starStack.length > 0) {\n    if (openStack.pop() > starStack.pop()) {\n      return false;\n    }\n  }\n\n  return openStack.length === 0;\n}",
        "lineByLine": [
          "Line 2-3: Stacks track indices of open brackets and asterisks.",
          "Line 5-13: Process closing bracket ')': prefer matching real '('; fall back to matching '*' as '('. If neither exists, return false.",
          "Line 15-19: Match remaining '(' with '*' acting as ')'. If open bracket index > star index, it appears too late to be closed -> return false.",
          "Line 21: Valid only if all open brackets were closed."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s = \"(*))\"",
            "action": "open=[0], star=[1]",
            "result": "processed"
          },
          {
            "step": 2,
            "state": "i=2 (')'): pop open(0)",
            "action": "i=3 (')'): pop star(1)",
            "result": "stacks empty"
          },
          {
            "step": 3,
            "state": "End",
            "action": "openStack.length === 0",
            "result": "Returns true"
          }
        ],
        "complexityDerivation": "Linear scan with stack operations -> O(N) time and O(N) stack space."
      },
      {
        "name": "Approach 2: Greedy Range of Open Parentheses (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "summary": "Track minimum and maximum possible number of open brackets [cmin, cmax].",
        "intuition": "'*' can add or subtract an open bracket, creating a continuous range of possibilities [cmin, cmax].",
        "codeJS": "function checkValidString(s) {\n  let cmin = 0; // min possible open '('\n  let cmax = 0; // max possible open '('\n\n  for (const char of s) {\n    if (char === '(') {\n      cmin++;\n      cmax++;\n    } else if (char === ')') {\n      cmin--;\n      cmax--;\n    } else { // '*' can be '(', ')', or ''\n      cmin--; // treat as ')'\n      cmax++; // treat as '('\n    }\n\n    if (cmax < 0) return false; // Too many ')' even if all '*' were '('\n    if (cmin < 0) cmin = 0;    // cmin cannot drop below 0\n  }\n\n  return cmin === 0;\n}",
        "codeTS": "function checkValidString(s: string): boolean {\n  let cmin = 0;\n  let cmax = 0;\n\n  for (const char of s) {\n    if (char === '(') {\n      cmin++;\n      cmax++;\n    } else if (char === ')') {\n      cmin--;\n      cmax--;\n    } else {\n      cmin--;\n      cmax++;\n    }\n\n    if (cmax < 0) return false;\n    if (cmin < 0) cmin = 0;\n  }\n\n  return cmin === 0;\n}",
        "lineByLine": [
          "Line 2-3: cmin and cmax bound the possible number of open brackets.",
          "Line 5-14: For '(', both increase. For ')', both decrease. For '*', cmin treats it as ')' while cmax treats it as '('.",
          "Line 16: If cmax < 0, even converting every asterisk into an open bracket cannot balance the string -> return false.",
          "Line 17: cmin cannot be negative (an asterisk can simply act as empty string instead of an excessive closing bracket).",
          "Line 20: Valid if cmin === 0 (0 open brackets is achievable)."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "s = \"(*)\"",
            "action": "'(': [1, 1]; '*': [0, 2]; ')': [0, 1]",
            "result": "valid bounds"
          },
          {
            "step": 2,
            "state": "End",
            "action": "cmin === 0",
            "result": "Returns true"
          }
        ],
        "complexityDerivation": "Single loop over N characters -> O(N) time with strictly O(1) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Two Stacks",
        "time": "O(N)",
        "space": "O(N)",
        "pros": "Intuitive index matching",
        "cons": "Allocates two stack arrays"
      },
      {
        "approach": "Greedy Range [cmin, cmax]",
        "time": "O(N)",
        "space": "O(1)",
        "pros": "Optimal constant memory, lightning fast",
        "cons": "Requires reasoning about continuous bounds"
      }
    ],
    "interviewPitch": "Valid Parenthesis String can be solved in O(N) time and O(1) space by tracking the range of possible open parentheses [cmin, cmax]. For '(', both increase by 1. For ')', both decrease by 1. For '*', because it can be ')', '', or '(', cmin decreases by 1 and cmax increases by 1. If at any point cmax < 0, there are too many closing brackets to ever recover, so we return false. Whenever cmin drops below 0, we reset it to 0 because an asterisk can simply be chosen as empty. Finally, return true if cmin === 0.",
    "followUps": [
      {
        "question": "Why does treating the range as continuous [cmin, cmax] work without gaps?",
        "answer": "Because an asterisk can change the open count by increments of 1 (as ')' it is -1, as empty it is 0, as '(' it is +1), all intermediate parity states are achievable without gaps."
      }
    ],
    "recallQuiz": {
      "question": "What does cmax < 0 signify during the iteration?",
      "options": [
        "Even if every asterisk seen so far had been chosen as '(', there are more ')' than '(', making validity impossible",
        "All open brackets are closed",
        "The string is empty",
        "A star was misplaced"
      ],
      "correctIndex": 0,
      "explanation": "cmax represents the most optimistic possible count of open brackets. If even that is negative, the string is irrevocably invalid."
    }
  },
  "132": {
    "id": 132,
    "title": "Insert Interval",
    "difficulty": "Medium",
    "pattern": "Intervals",
    "day": 79,
    "leetcodeUrl": "https://leetcode.com/problems/insert-interval/",
    "summary": "Insert newInterval into sorted non-overlapping intervals and merge if necessary.",
    "prerequisites": [
      "Interval overlap condition: start <= otherEnd && otherStart <= end",
      "Three-phase linear scan"
    ],
    "problemStatement": "You are given an array of non-overlapping intervals `intervals` sorted in ascending order by start time, and a `newInterval = [start, end]`. Insert `newInterval` into `intervals` such that intervals is still sorted and non-overlapping.",
    "approaches": [
      {
        "name": "Approach 1: Three-Phase Linear Scan (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "summary": "Add all intervals before newInterval, merge all overlapping intervals, then add all remaining intervals.",
        "intuition": "Since intervals are already sorted, we split the processing into three distinct linear segments.",
        "codeJS": "function insert(intervals, newInterval) {\n  const res = [];\n  let i = 0;\n  const n = intervals.length;\n\n  // Phase 1: Add all intervals ending before newInterval starts\n  while (i < n && intervals[i][1] < newInterval[0]) {\n    res.push(intervals[i]);\n    i++;\n  }\n\n  // Phase 2: Merge all overlapping intervals with newInterval\n  while (i < n && intervals[i][0] <= newInterval[1]) {\n    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n    i++;\n  }\n  res.push(newInterval);\n\n  // Phase 3: Add all remaining intervals\n  while (i < n) {\n    res.push(intervals[i]);\n    i++;\n  }\n\n  return res;\n}",
        "codeTS": "function insert(intervals: number[][], newInterval: number[]): number[][] {\n  const res: number[][] = [];\n  let i = 0;\n  const n = intervals.length;\n\n  while (i < n && intervals[i][1] < newInterval[0]) {\n    res.push(intervals[i]);\n    i++;\n  }\n\n  while (i < n && intervals[i][0] <= newInterval[1]) {\n    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n    i++;\n  }\n  res.push(newInterval);\n\n  while (i < n) {\n    res.push(intervals[i]);\n    i++;\n  }\n\n  return res;\n}",
        "lineByLine": [
          "Line 6-9: Phase 1: Push all intervals completely to the left of newInterval (intervals[i][1] < newInterval[0]).",
          "Line 12-16: Phase 2: Merge all overlapping intervals by expanding newInterval boundaries: min(starts) and max(ends).",
          "Line 17: Push the merged newInterval.",
          "Line 20-23: Phase 3: Push all remaining intervals completely to the right."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "intervals=[[1,3],[6,9]], newInterval=[2,5]",
            "action": "Phase 1: [1,3] ends at 3 >= 2 -> not left",
            "result": "i=0"
          },
          {
            "step": 2,
            "state": "Phase 2: [1,3] overlaps [2,5]",
            "action": "newInterval becomes [min(1,2), max(3,5)] = [1,5]",
            "result": "merged [1,5]"
          },
          {
            "step": 3,
            "state": "Phase 3: push [6,9]",
            "action": "res = [[1,5], [6,9]]",
            "result": "Returns [[1,5], [6,9]]"
          }
        ],
        "complexityDerivation": "Each interval is inspected exactly once in a single linear pass -> O(N) time and O(N) space for result."
      },
      {
        "name": "Approach 2: Append and Merge Intervals (Baseline)",
        "badge": "Baseline / Append & Sort",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "summary": "Append newInterval to intervals array, sort by start time, and run standard Merge Intervals.",
        "intuition": "Leverages standard Merge Intervals solution without writing custom 3-phase partition logic.",
        "codeJS": "function insertAppendSort(intervals, newInterval) {\n  intervals.push(newInterval);\n  intervals.sort((a, b) => a[0] - b[0]);\n\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    const cur = intervals[i];\n    if (cur[0] <= last[1]) {\n      last[1] = Math.max(last[1], cur[1]);\n    } else {\n      res.push(cur);\n    }\n  }\n  return res;\n}",
        "codeTS": "function insertAppendSort(intervals: number[][], newInterval: number[]): number[][] {\n  intervals.push(newInterval);\n  intervals.sort((a, b) => a[0] - b[0]);\n\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    const cur = intervals[i];\n    if (cur[0] <= last[1]) {\n      last[1] = Math.max(last[1], cur[1]);\n    } else {\n      res.push(cur);\n    }\n  }\n  return res;\n}",
        "lineByLine": [
          "Line 2-3: Append new interval and sort.",
          "Line 5-13: Standard interval merge comparing cur[0] with last[1]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "Appends [2,5] to [[1,3],[6,9]]",
            "action": "Sorts to [[1,3],[2,5],[6,9]]",
            "result": "Merges to [[1,5],[6,9]]"
          }
        ],
        "complexityDerivation": "Sorting takes O(N log N) -> O(N log N) time and O(N) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Three-Phase Linear Scan",
        "time": "O(N)",
        "space": "O(N)",
        "pros": "Exploits pre-sorted property, optimal linear time",
        "cons": "Requires three sequential loops"
      },
      {
        "approach": "Append & Sort",
        "time": "O(N log N)",
        "space": "O(N)",
        "pros": "Reuses standard Merge Intervals code",
        "cons": "Wastes sorting time on already sorted inputs"
      }
    ],
    "interviewPitch": "Because the intervals are already sorted and non-overlapping, we do not need to sort in O(N log N). Instead, we perform an optimal O(N) three-phase linear scan: First, we push all intervals that end before newInterval begins. Second, while intervals overlap with newInterval (intervals[i][0] <= newInterval[1]), we merge them by expanding newInterval to [min(starts), max(ends)]. We push the merged newInterval. Third, we push all remaining intervals. This achieves optimal O(N) time with O(1) auxiliary space beyond the output.",
    "followUps": [
      {
        "question": "Can we use binary search to locate the insertion points?",
        "answer": "Yes, binary search can find the start and end of overlapping intervals in O(log N) time, but shifting elements in an array still requires O(N) time in JavaScript."
      }
    ],
    "recallQuiz": {
      "question": "What is the condition for an interval [start, end] to overlap with newInterval [nStart, nEnd]?",
      "options": [
        "start <= nEnd && nStart <= end",
        "start === nStart",
        "end < nStart",
        "start > nEnd"
      ],
      "correctIndex": 0,
      "explanation": "Two intervals [a, b] and [c, d] overlap if and only if a <= d and c <= b."
    }
  },
  "133": {
    "id": 133,
    "title": "Merge Intervals",
    "difficulty": "Medium",
    "pattern": "Intervals",
    "day": 79,
    "leetcodeUrl": "https://leetcode.com/problems/merge-intervals/",
    "summary": "Merge all overlapping intervals and return an array of the non-overlapping intervals.",
    "prerequisites": [
      "Sorting by start time",
      "Greedy interval merging"
    ],
    "problemStatement": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "approaches": [
      {
        "name": "Approach 1: Sort by Start Time and Linear Merge (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "summary": "Sort intervals by start time; merge consecutive intervals if cur.start <= prev.end.",
        "intuition": "Sorting by start time ensures that any intervals capable of overlapping must appear consecutively.",
        "codeJS": "function merge(intervals) {\n  if (intervals.length <= 1) return intervals;\n\n  // Sort ascending by start time\n  intervals.sort((a, b) => a[0] - b[0]);\n\n  const merged = [intervals[0]];\n\n  for (let i = 1; i < intervals.length; i++) {\n    const last = merged[merged.length - 1];\n    const cur = intervals[i];\n\n    if (cur[0] <= last[1]) {\n      // Overlap detected: extend end of current merged interval\n      last[1] = Math.max(last[1], cur[1]);\n    } else {\n      // Disjoint interval: start a new interval in output\n      merged.push(cur);\n    }\n  }\n\n  return merged;\n}",
        "codeTS": "function merge(intervals: number[][]): number[][] {\n  if (intervals.length <= 1) return intervals;\n\n  intervals.sort((a, b) => a[0] - b[0]);\n\n  const merged: number[][] = [intervals[0]];\n\n  for (let i = 1; i < intervals.length; i++) {\n    const last = merged[merged.length - 1];\n    const cur = intervals[i];\n\n    if (cur[0] <= last[1]) {\n      last[1] = Math.max(last[1], cur[1]);\n    } else {\n      merged.push(cur);\n    }\n  }\n\n  return merged;\n}",
        "lineByLine": [
          "Line 2: Fast return for 0 or 1 interval.",
          "Line 5: Sort by start time a[0] - b[0] in O(N log N).",
          "Line 7: Initialize merged array with first sorted interval.",
          "Line 9-18: If cur[0] <= last[1], they overlap: update last[1] = Math.max(last[1], cur[1]). Otherwise push disjoint interval."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
            "action": "Sorted: already sorted",
            "result": "merged = [[1,3]]"
          },
          {
            "step": 2,
            "state": "i=1: [2,6]",
            "action": "2 <= 3: overlap! last[1] = max(3, 6) = 6",
            "result": "merged = [[1,6]]"
          },
          {
            "step": 3,
            "state": "i=2: [8,10]",
            "action": "8 > 6: disjoint -> push [8,10]",
            "result": "merged = [[1,6],[8,10]]"
          },
          {
            "step": 4,
            "state": "i=3: [15,18]",
            "action": "15 > 10: disjoint -> push [15,18]",
            "result": "Returns [[1,6],[8,10],[15,18]]"
          }
        ],
        "complexityDerivation": "Sorting takes O(N log N). Merging takes O(N) linear time -> O(N log N) total time and O(N) space."
      },
      {
        "name": "Approach 2: Connected Components Graph (Baseline)",
        "badge": "Baseline / Graph Modeling",
        "timeComplexity": "O(N²)",
        "spaceComplexity": "O(N²)",
        "summary": "Build graph where edges connect overlapping intervals; find connected components.",
        "intuition": "Each connected component of intervals merges into a single bounding interval [min(starts), max(ends)].",
        "codeJS": "function mergeGraph(intervals) {\n  const n = intervals.length;\n  const adj = Array.from({ length: n }, () => []);\n\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) {\n      if (intervals[i][0] <= intervals[j][1] && intervals[j][0] <= intervals[i][1]) {\n        adj[i].push(j);\n        adj[j].push(i);\n      }\n    }\n  }\n\n  const visited = new Set();\n  const res = [];\n\n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) {\n      let minStart = intervals[i][0], maxEnd = intervals[i][1];\n      const queue = [i];\n      visited.add(i);\n\n      while (queue.length > 0) {\n        const u = queue.shift();\n        minStart = Math.min(minStart, intervals[u][0]);\n        maxEnd = Math.max(maxEnd, intervals[u][1]);\n        for (const v of adj[u]) {\n          if (!visited.has(v)) {\n            visited.add(v);\n            queue.push(v);\n          }\n        }\n      }\n      res.push([minStart, maxEnd]);\n    }\n  }\n\n  return res.sort((a, b) => a[0] - b[0]);\n}",
        "codeTS": "function mergeGraph(intervals: number[][]): number[][] {\n  const n = intervals.length;\n  const adj: number[][] = Array.from({ length: n }, () => []);\n\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) {\n      if (intervals[i][0] <= intervals[j][1] && intervals[j][0] <= intervals[i][1]) {\n        adj[i].push(j);\n        adj[j].push(i);\n      }\n    }\n  }\n\n  const visited = new Set<number>();\n  const res: number[][] = [];\n\n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) {\n      let minStart = intervals[i][0], maxEnd = intervals[i][1];\n      const queue = [i];\n      visited.add(i);\n\n      while (queue.length > 0) {\n        const u = queue.shift()!;\n        minStart = Math.min(minStart, intervals[u][0]);\n        maxEnd = Math.max(maxEnd, intervals[u][1]);\n        for (const v of adj[u]) {\n          if (!visited.has(v)) {\n            visited.add(v);\n            queue.push(v);\n          }\n        }\n      }\n      res.push([minStart, maxEnd]);\n    }\n  }\n\n  return res.sort((a, b) => a[0] - b[0]);\n}",
        "lineByLine": [
          "Line 5-11: Build adjacency list of all overlapping interval pairs.",
          "Line 16-33: BFS traverses each connected component, computing bounding minStart and maxEnd."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "Graph edges between overlapping pairs",
            "action": "BFS merges components",
            "result": "O(N^2) time"
          }
        ],
        "complexityDerivation": "Pairwise comparison takes O(N^2) time and graph takes O(N^2) memory."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Sort by Start Time",
        "time": "O(N log N)",
        "space": "O(N)",
        "pros": "Standard industry optimal approach, simple and elegant",
        "cons": "Requires sorting"
      },
      {
        "approach": "Connected Components Graph",
        "time": "O(N²)",
        "space": "O(N²)",
        "pros": "Demonstrates graph equivalency",
        "cons": "Quadratic time and memory"
      }
    ],
    "interviewPitch": "To solve Merge Intervals optimally, we first sort the intervals in ascending order by their start times in O(N log N) time. This guarantees that all intervals that can potentially overlap appear consecutively. We initialize our merged output with the first interval. Then, for each subsequent interval, we check if its start time is less than or equal to the end time of the last interval in our output. If it is, they overlap, and we update the end time to Math.max(last.end, cur.end). Otherwise, they are disjoint, and we append the interval to our output. This runs in O(N log N) time and O(N) space.",
    "followUps": [
      {
        "question": "What if the intervals are an incoming stream of data?",
        "answer": "Maintain a balanced BST (like an Interval Tree) to search, insert, and merge overlapping nodes in O(log N) amortized time per incoming interval."
      }
    ],
    "recallQuiz": {
      "question": "Why do we sort intervals specifically by start time rather than end time?",
      "options": [
        "Because sorting by start time ensures that any overlapping intervals must be adjacent in the array",
        "Because start times are always positive",
        "Because sorting by end time is illegal",
        "Because arrays require ascending keys"
      ],
      "correctIndex": 0,
      "explanation": "With sorted start times, if interval B overlaps with interval A, it must either overlap with A or follow A immediately."
    }
  },
  "134": {
    "id": 134,
    "title": "Non-overlapping Intervals",
    "difficulty": "Medium",
    "pattern": "Intervals",
    "day": 80,
    "leetcodeUrl": "https://leetcode.com/problems/non-overlapping-intervals/",
    "summary": "Find the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
    "prerequisites": [
      "Greedy Interval Scheduling",
      "Sorting by end time"
    ],
    "problemStatement": "Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
    "approaches": [
      {
        "name": "Approach 1: Greedy Sort by End Time (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(1)",
        "summary": "Sort intervals by end time; keep the interval that finishes earliest to leave max room.",
        "intuition": "Classic Interval Scheduling: to maximize non-overlapping intervals, always choose the interval that finishes earliest.",
        "codeJS": "function eraseOverlapIntervals(intervals) {\n  if (intervals.length <= 1) return 0;\n\n  // Sort ascending by end time\n  intervals.sort((a, b) => a[1] - b[1]);\n\n  let count = 0;\n  let prevEnd = intervals[0][1];\n\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] < prevEnd) {\n      // Overlap detected: remove current interval (since it ends later or equal)\n      count++;\n    } else {\n      // No overlap: update prevEnd to current interval's end\n      prevEnd = intervals[i][1];\n    }\n  }\n\n  return count;\n}",
        "codeTS": "function eraseOverlapIntervals(intervals: number[][]): number {\n  if (intervals.length <= 1) return 0;\n\n  intervals.sort((a, b) => a[1] - b[1]);\n\n  let count = 0;\n  let prevEnd = intervals[0][1];\n\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] < prevEnd) {\n      count++;\n    } else {\n      prevEnd = intervals[i][1];\n    }\n  }\n\n  return count;\n}",
        "lineByLine": [
          "Line 5: Sort by end time a[1] - b[1] in O(N log N).",
          "Line 7-8: Initialize removal count to 0 and prevEnd to end of first interval.",
          "Line 10-17: If current interval starts before prevEnd, it overlaps: increment removal count. Otherwise, advance prevEnd."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "intervals = [[1,2],[2,3],[3,4],[1,3]]",
            "action": "Sorted by end: [[1,2],[2,3],[1,3],[3,4]]",
            "result": "prevEnd = 2"
          },
          {
            "step": 2,
            "state": "i=1: [2,3]",
            "action": "2 >= 2: keep, prevEnd = 3",
            "result": "count = 0"
          },
          {
            "step": 3,
            "state": "i=2: [1,3]",
            "action": "1 < 3: overlap! remove",
            "result": "count = 1"
          },
          {
            "step": 4,
            "state": "i=3: [3,4]",
            "action": "3 >= 3: keep, prevEnd = 4",
            "result": "Returns 1"
          }
        ],
        "complexityDerivation": "Sorting takes O(N log N). Linear scan takes O(N) -> O(N log N) time and O(1) space."
      },
      {
        "name": "Approach 2: Sort by Start Time with Greedy Min End (Alternative)",
        "badge": "Alternative / Start Sort",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(1)",
        "summary": "Sort by start time; when overlap occurs, remove the interval with larger end time.",
        "intuition": "If two intervals overlap, greedily keep the one that ends earlier (prevEnd = min(prevEnd, cur[1])).",
        "codeJS": "function eraseOverlapIntervalsStart(intervals) {\n  if (intervals.length <= 1) return 0;\n  intervals.sort((a, b) => a[0] - b[0]);\n\n  let count = 0;\n  let prevEnd = intervals[0][1];\n\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] < prevEnd) {\n      count++;\n      prevEnd = Math.min(prevEnd, intervals[i][1]); // Keep the one ending earlier\n    } else {\n      prevEnd = intervals[i][1];\n    }\n  }\n\n  return count;\n}",
        "codeTS": "function eraseOverlapIntervalsStart(intervals: number[][]): number {\n  if (intervals.length <= 1) return 0;\n  intervals.sort((a, b) => a[0] - b[0]);\n\n  let count = 0;\n  let prevEnd = intervals[0][1];\n\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] < prevEnd) {\n      count++;\n      prevEnd = Math.min(prevEnd, intervals[i][1]);\n    } else {\n      prevEnd = intervals[i][1];\n    }\n  }\n\n  return count;\n}",
        "lineByLine": [
          "Line 3: Sort by start time.",
          "Line 8-10: On overlap, increment removal count and set prevEnd to min of both ends."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "Sorted by start time",
            "action": "Greedily retains shorter ending interval",
            "result": "Same optimal count"
          }
        ],
        "complexityDerivation": "O(N log N) time and O(1) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Sort by End Time",
        "time": "O(N log N)",
        "space": "O(1)",
        "pros": "Direct formulation of Interval Scheduling",
        "cons": "Sorts by index 1"
      },
      {
        "approach": "Sort by Start Time",
        "time": "O(N log N)",
        "space": "O(1)",
        "pros": "Matches Merge Intervals convention",
        "cons": "Requires Math.min update on conflict"
      }
    ],
    "interviewPitch": "Non-overlapping Intervals is equivalent to the classic Interval Scheduling problem, where we want to maximize the number of compatible intervals. The greedy choice property states that we should always pick the interval that finishes earliest (smallest end time), because it leaves the maximum possible remaining time for subsequent intervals. We sort intervals by end time. If the current interval's start time is less than prevEnd, an overlap exists, so we remove it (count++). Otherwise, we update prevEnd. This achieves optimal O(N log N) time and O(1) space.",
    "followUps": [
      {
        "question": "How is this related to finding the maximum number of non-overlapping intervals?",
        "answer": "Answer = total intervals - max non-overlapping intervals. Minimizing removals is mathematically dual to maximizing kept intervals."
      }
    ],
    "recallQuiz": {
      "question": "Why does choosing the interval that finishes earliest maximize the number of non-overlapping intervals?",
      "options": [
        "Because an earlier finish time leaves the maximum possible space for future intervals to fit without conflict",
        "Because end times are larger than start times",
        "Because intervals cannot be empty",
        "Because arrays are zero-indexed"
      ],
      "correctIndex": 0,
      "explanation": "Finishing earlier strictly frees up more remaining timeline for subsequent intervals, minimizing future conflicts."
    }
  },
  "135": {
    "id": 135,
    "title": "Minimum Interval to Include Each Query",
    "difficulty": "Hard",
    "pattern": "Intervals",
    "day": 80,
    "leetcodeUrl": "https://leetcode.com/problems/minimum-interval-to-include-each-query/",
    "summary": "For each query, find the size of the smallest interval that contains that query, or -1.",
    "prerequisites": [
      "Sort Queries with Original Indices",
      "Min-Heap tracking [intervalSize, intervalEnd]"
    ],
    "problemStatement": "You are given a 2D integer array `intervals` and an integer array `queries`. For each query `queries[j]`, find the size of the smallest interval `i` such that `intervals[i][0] <= queries[j] <= intervals[i][1]`. Return array of answers.",
    "approaches": [
      {
        "name": "Approach 1: Sorted Queries + Min-Heap (Optimal)",
        "badge": "Optimal / Production-Grade",
        "timeComplexity": "O(N log N + Q log Q)",
        "spaceComplexity": "O(N + Q)",
        "summary": "Sort intervals and queries. Push valid intervals to min-heap ordered by size; evict expired intervals.",
        "intuition": "Processing queries in sorted order allows us to add intervals once and evict intervals whose end time < current query.",
        "codeJS": "function minInterval(intervals, queries) {\n  // Sort intervals by start time\n  intervals.sort((a, b) => a[0] - b[0]);\n\n  // Pair queries with their original indices and sort\n  const sortedQueries = queries.map((q, idx) => [q, idx]).sort((a, b) => a[0] - b[0]);\n\n  const res = new Array(queries.length);\n  // Min-Heap simulated with priority array or binary heap: [size, end]\n  // In JS, we can use a compact binary min-heap implementation:\n  class MinHeap {\n    constructor() { this.data = []; }\n    push(val) {\n      this.data.push(val);\n      this._up(this.data.length - 1);\n    }\n    pop() {\n      if (this.data.length === 0) return null;\n      const top = this.data[0];\n      const bot = this.data.pop();\n      if (this.data.length > 0) {\n        this.data[0] = bot;\n        this._down(0);\n      }\n      return top;\n    }\n    peek() { return this.data[0] || null; }\n    size() { return this.data.length; }\n    _up(i) {\n      while (i > 0) {\n        const p = (i - 1) >> 1;\n        if (this.data[p][0] <= this.data[i][0]) break;\n        [this.data[p], this.data[i]] = [this.data[i], this.data[p]];\n        i = p;\n      }\n    }\n    _down(i) {\n      const len = this.data.length;\n      while ((i << 1) + 1 < len) {\n        let left = (i << 1) + 1, right = left + 1, smallest = i;\n        if (this.data[left][0] < this.data[smallest][0]) smallest = left;\n        if (right < len && this.data[right][0] < this.data[smallest][0]) smallest = right;\n        if (smallest === i) break;\n        [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];\n        i = smallest;\n      }\n    }\n  }\n\n  const heap = new MinHeap();\n  let i = 0;\n\n  for (const [q, idx] of sortedQueries) {\n    // Add all intervals starting <= q\n    while (i < intervals.length && intervals[i][0] <= q) {\n      const [l, r] = intervals[i];\n      heap.push([r - l + 1, r]);\n      i++;\n    }\n\n    // Evict intervals ending < q (cannot contain q or future queries)\n    while (heap.size() > 0 && heap.peek()[1] < q) {\n      heap.pop();\n    }\n\n    res[idx] = heap.size() > 0 ? heap.peek()[0] : -1;\n  }\n\n  return res;\n}",
        "codeTS": "function minInterval(intervals: number[][], queries: number[]): number[] {\n  intervals.sort((a, b) => a[0] - b[0]);\n  const sortedQueries = queries.map((q, idx) => [q, idx] as [number, number]).sort((a, b) => a[0] - b[0]);\n  const res = new Array(queries.length);\n\n  class MinHeap {\n    data: [number, number][] = [];\n    push(val: [number, number]) {\n      this.data.push(val);\n      this._up(this.data.length - 1);\n    }\n    pop() {\n      if (this.data.length === 0) return null;\n      const top = this.data[0];\n      const bot = this.data.pop()!;\n      if (this.data.length > 0) {\n        this.data[0] = bot;\n        this._down(0);\n      }\n      return top;\n    }\n    peek() { return this.data[0] || null; }\n    size() { return this.data.length; }\n    _up(i: number) {\n      while (i > 0) {\n        const p = (i - 1) >> 1;\n        if (this.data[p][0] <= this.data[i][0]) break;\n        [this.data[p], this.data[i]] = [this.data[i], this.data[p]];\n        i = p;\n      }\n    }\n    _down(i: number) {\n      const len = this.data.length;\n      while ((i << 1) + 1 < len) {\n        let left = (i << 1) + 1, right = left + 1, smallest = i;\n        if (this.data[left][0] < this.data[smallest][0]) smallest = left;\n        if (right < len && this.data[right][0] < this.data[smallest][0]) smallest = right;\n        if (smallest === i) break;\n        [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];\n        i = smallest;\n      }\n    }\n  }\n\n  const heap = new MinHeap();\n  let i = 0;\n\n  for (const [q, idx] of sortedQueries) {\n    while (i < intervals.length && intervals[i][0] <= q) {\n      const [l, r] = intervals[i];\n      heap.push([r - l + 1, r]);\n      i++;\n    }\n    while (heap.size() > 0 && heap.peek()![1] < q) {\n      heap.pop();\n    }\n    res[idx] = heap.size() > 0 ? heap.peek()![0] : -1;\n  }\n\n  return res;\n}",
        "lineByLine": [
          "Line 2-5: Sort intervals by start time; pair queries with their original index and sort by query value.",
          "Line 10-44: Standard binary MinHeap ordered by interval size (r - l + 1).",
          "Line 49-53: Add all intervals starting <= q into the heap.",
          "Line 56-58: Lazy eviction: pop all intervals whose end time is strictly less than q.",
          "Line 60: The top of the heap is the smallest valid interval containing q; record in res[idx]."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "intervals=[[1,4],[2,4],[3,6],[4,4]], queries=[2,3,4,5]",
            "action": "Sort intervals & queries",
            "result": "ordered setup"
          },
          {
            "step": 2,
            "state": "q=2: adds [1,4](size 4), [2,4](size 3)",
            "action": "heap top is size 3 ([2,4])",
            "result": "res[0] = 3"
          },
          {
            "step": 3,
            "state": "q=5: evicts expired [1,4],[2,4],[4,4]",
            "action": "heap top is [3,6](size 4)",
            "result": "res[3] = 4"
          }
        ],
        "complexityDerivation": "Sorting takes O(N log N + Q log Q). Each interval enters and leaves heap once -> O((N + Q) log N) time and O(N + Q) space."
      },
      {
        "name": "Approach 2: Brute Force Linear Scan (Baseline)",
        "badge": "Baseline / Brute-Force",
        "timeComplexity": "O(Q * N)",
        "spaceComplexity": "O(1)",
        "summary": "For each query, inspect every interval to find the minimum size containing it.",
        "intuition": "Simple nested loops without sorting or heap data structures.",
        "codeJS": "function minIntervalBrute(intervals, queries) {\n  const res = [];\n  for (const q of queries) {\n    let minSize = Infinity;\n    for (const [l, r] of intervals) {\n      if (l <= q && q <= r) {\n        minSize = Math.min(minSize, r - l + 1);\n      }\n    }\n    res.push(minSize === Infinity ? -1 : minSize);\n  }\n  return res;\n}",
        "codeTS": "function minIntervalBrute(intervals: number[][], queries: number[]): number[] {\n  const res: number[] = [];\n  for (const q of queries) {\n    let minSize = Infinity;\n    for (const [l, r] of intervals) {\n      if (l <= q && q <= r) {\n        minSize = Math.min(minSize, r - l + 1);\n      }\n    }\n    res.push(minSize === Infinity ? -1 : minSize);\n  }\n  return res;\n}",
        "lineByLine": [
          "Line 3-10: For each query, scan all N intervals and update minSize."
        ],
        "dryRun": [
          {
            "step": 1,
            "state": "Exhaustively scans all intervals for each query",
            "action": "Computes min size",
            "result": "Times out on Q=100,000"
          }
        ],
        "complexityDerivation": "Q queries * N intervals -> O(Q * N) time and O(1) space."
      }
    ],
    "comparisonTable": [
      {
        "approach": "Brute Force Scan",
        "time": "O(Q * N)",
        "space": "O(1)",
        "pros": "No auxiliary data structures",
        "cons": "TLE on 100,000 queries"
      },
      {
        "approach": "Sorted Queries + Min-Heap",
        "time": "O((N + Q) log N)",
        "space": "O(N + Q)",
        "pros": "Optimal logarithmic event-driven sweeping",
        "cons": "Requires heap implementation and query index mapping"
      }
    ],
    "interviewPitch": "Because queries are independent, processing them in sorted order allows an event-driven sweep-line technique. We sort intervals by start time and sort queries while preserving their original indices. We maintain a Min-Heap ordered by interval size (end - start + 1). For each query q: we push all intervals that start <= q into the heap. Then, we lazily pop all intervals whose end time is < q (because they cannot cover q or any future larger query). The top of the heap is guaranteed to be the smallest valid interval containing q. This runs in O((N + Q) log N) time and O(N + Q) space.",
    "followUps": [
      {
        "question": "Why can we safely discard intervals from the heap when end < q?",
        "answer": "Because queries are sorted in ascending order, any interval ending before q will also end before all future queries and can never be useful again."
      }
    ],
    "recallQuiz": {
      "question": "What elements are stored in the Min-Heap?",
      "options": [
        "Pairs of [intervalSize, intervalEnd] ordered by intervalSize",
        "Interval start times",
        "Query indices",
        "Prime factors"
      ],
      "correctIndex": 0,
      "explanation": "The heap must be ordered by interval size to immediately give the smallest interval, while storing the end time to detect when it expires."
    }
  }
};
