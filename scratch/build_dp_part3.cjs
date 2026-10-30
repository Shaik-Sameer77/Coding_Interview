// DP Solutions Part 3: Problems 117 to 123
module.exports = {
  117: {
    id: 117,
    title: 'Best Time to Buy and Sell Stock with Cooldown',
    difficulty: 'Medium',
    pattern: 'DP - 2D',
    day: 69,
    leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/',
    summary: 'Find maximum profit with unlimited transactions, but after you sell your stock you cannot buy on the next day.',
    prerequisites: ['State machine DP', 'Holding vs Sold vs Cooldown states'],
    problemStatement: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day. You may complete as many transactions as you like with the following restriction: after you sell your stock, you cannot buy stock on the next day (i.e., cooldown one day). Return maximum profit.`,
    approaches: [
      {
        name: 'Approach 1: Recursive State Machine with Memoization (Improved)',
        badge: 'Improved / Memoized',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'dfs(day, canBuy) exploring buy, sell, and cooldown choices with memoization.',
        intuition: 'At each day, we either buy/hold stock or sell/cooldown, leading to two distinct states per day.',
        codeJS: `function maxProfitMemo(prices) {
  const memo = new Map();

  function dfs(i, buying) {
    if (i >= prices.length) return 0;
    const key = \`\${i},\${buying}\`;
    if (memo.has(key)) return memo.get(key);

    const cooldown = dfs(i + 1, buying);
    if (buying) {
      const buy = dfs(i + 1, false) - prices[i];
      memo.set(key, Math.max(buy, cooldown));
    } else {
      const sell = dfs(i + 2, true) + prices[i]; // i+2 enforces 1 day cooldown
      memo.set(key, Math.max(sell, cooldown));
    }
    return memo.get(key);
  }

  return dfs(0, true);
}`,
        codeTS: `function maxProfitMemo(prices: number[]): number {
  const memo = new Map<string, number>();

  function dfs(i: number, buying: boolean): number {
    if (i >= prices.length) return 0;
    const key = \`\${i},\${buying}\`;
    if (memo.has(key)) return memo.get(key)!;

    const cooldown = dfs(i + 1, buying);
    if (buying) {
      const buy = dfs(i + 1, false) - prices[i];
      memo.set(key, Math.max(buy, cooldown));
    } else {
      const sell = dfs(i + 2, true) + prices[i];
      memo.set(key, Math.max(sell, cooldown));
    }
    return memo.get(key)!;
  }

  return dfs(0, true);
}`,
        lineByLine: [
          'Line 4: Base case: reached or exceeded array length -> 0 profit.',
          'Line 8: Option to cooldown (skip current day) is always available.',
          'Line 9-11: If buying: either buy at prices[i] and switch to !buying, or cooldown.',
          'Line 12-14: If selling: sell at +prices[i] and advance to i+2 to enforce mandatory 1-day cooldown.'
        ],
        dryRun: [
          { step: 1, state: 'prices = [1, 2, 3, 0, 2]', action: 'buy day 0 (cost 1), sell day 1 (+2)', result: 'cooldown day 2' },
          { step: 2, state: 'buy day 3 (cost 0), sell day 4 (+2)', action: 'profit = (2 - 1) + (2 - 0) = 3', result: 'Returns 3' }
        ],
        complexityDerivation: '2N states evaluated once -> O(N) time and O(N) stack/map memory.'
      },
      {
        name: 'Approach 2: 3-State O(1) Space Machine (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Track held, sold, and reset states iteratively in O(1) space.',
        intuition: 'held = max(held, reset - price); sold = held + price; reset = max(reset, prev_sold).',
        codeJS: `function maxProfit(prices) {
  let sold = 0;
  let held = -Infinity;
  let reset = 0;

  for (const p of prices) {
    const prevSold = sold;
    sold = held + p;
    held = Math.max(held, reset - p);
    reset = Math.max(reset, prevSold);
  }

  return Math.max(sold, reset);
}`,
        codeTS: `function maxProfit(prices: number[]): number {
  let sold = 0;
  let held = -Infinity;
  let reset = 0;

  for (const p of prices) {
    const prevSold = sold;
    sold = held + p;
    held = Math.max(held, reset - p);
    reset = Math.max(reset, prevSold);
  }

  return Math.max(sold, reset);
}`,
        lineByLine: [
          'Line 2-4: held initialized to -Infinity (cannot hold stock before buying); sold and reset to 0.',
          'Line 6-11: At day p, record prevSold. sold becomes held + p; held is max(held, reset - p); reset is max(reset, prevSold).',
          'Line 13: Final answer is max(sold, reset) (holding stock at the end is strictly suboptimal).'
        ],
        dryRun: [
          { step: 1, state: 'p=1', action: 'held=max(-inf, -1)=-1, sold=-inf, reset=0', result: 'held=-1' },
          { step: 2, state: 'p=2', action: 'sold=-1+2=1, held=max(-1, -2)=-1, reset=0', result: 'sold=1' },
          { step: 3, state: 'p=3', action: 'sold=-1+3=2, reset=max(0, 1)=1', result: 'profit accumulates' }
        ],
        complexityDerivation: 'Linear single pass visiting each price once -> O(N) time and O(1) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Top-Down State DFS', time: 'O(N)', space: 'O(N)', pros: 'Direct mental model of choices', cons: 'High recursion stack overhead' },
      { approach: '3-State Machine', time: 'O(N)', space: 'O(1)', pros: 'Constant memory, cache friendly, lightning fast', cons: 'Requires setting up finite state transitions' }
    ],
    interviewPitch: 'Stock with Cooldown is modeled as a 3-state Finite State Machine: "Held" (holding a share), "Sold" (sold today, must cooldown tomorrow), and "Reset" (ready to buy). On each day: Held transitions from either holding or buying from Reset (reset - price); Sold transitions from selling our held share (held + price); Reset transitions from resting or from yesterday\'s Sold state. By tracking only these three scalar registers, we solve the problem in O(N) time and O(1) auxiliary space.',
    followUps: [{ question: 'What if cooldown was k days instead of 1?', answer: 'Use a circular buffer or queue of size k to delay transferring profit from Sold into Reset.' }],
    recallQuiz: {
      question: 'Why is held initialized to -Infinity instead of 0?',
      options: ['Because you cannot hold a stock before purchasing one; 0 would represent free stock', 'Because prices can be negative', 'To prevent floating point inaccuracies', 'Because of bitwise shift limits'],
      correctIndex: 0,
      explanation: 'Setting held to 0 would falsely indicate that we obtained a stock at price 0 before making any buy transaction.'
    }
  },

  118: {
    id: 118,
    title: 'Edit Distance',
    difficulty: 'Medium',
    pattern: 'DP - 2D',
    day: 69,
    leetcodeUrl: 'https://leetcode.com/problems/edit-distance/',
    summary: 'Find minimum number of operations (insert, delete, replace) required to convert word1 to word2.',
    prerequisites: ['Levenshtein distance', '2D Matrix DP'],
    problemStatement: `Given two strings \`word1\` and \`word2\`, return the minimum number of operations required to convert \`word1\` to \`word2\`. Allowed operations are: insert a character, delete a character, replace a character.`,
    approaches: [
      {
        name: 'Approach 1: Top-Down Recursion with Memoization (Improved)',
        badge: 'Improved / Memoized',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N)',
        summary: 'Recursive helper minDistance(i, j) with 2D memoization.',
        intuition: 'If chars match, advance both. If mismatch, return 1 + min(insert, delete, replace).',
        codeJS: `function minDistanceMemo(word1, word2) {
  const memo = new Map();

  function dfs(i, j) {
    if (i === word1.length) return word2.length - j; // insert remaining
    if (j === word2.length) return word1.length - i; // delete remaining
    const key = \`\${i},\${j}\`;
    if (memo.has(key)) return memo.get(key);

    if (word1[i] === word2[j]) {
      const res = dfs(i + 1, j + 1);
      memo.set(key, res);
      return res;
    }

    const insertOp = dfs(i, j + 1);
    const deleteOp = dfs(i + 1, j);
    const replaceOp = dfs(i + 1, j + 1);

    const res = 1 + Math.min(insertOp, deleteOp, replaceOp);
    memo.set(key, res);
    return res;
  }

  return dfs(0, 0);
}`,
        codeTS: `function minDistanceMemo(word1: string, word2: string): number {
  const memo = new Map<string, number>();

  function dfs(i: number, j: number): number {
    if (i === word1.length) return word2.length - j;
    if (j === word2.length) return word1.length - i;
    const key = \`\${i},\${j}\`;
    if (memo.has(key)) return memo.get(key)!;

    if (word1[i] === word2[j]) {
      const res = dfs(i + 1, j + 1);
      memo.set(key, res);
      return res;
    }

    const insertOp = dfs(i, j + 1);
    const deleteOp = dfs(i + 1, j);
    const replaceOp = dfs(i + 1, j + 1);

    const res = 1 + Math.min(insertOp, deleteOp, replaceOp);
    memo.set(key, res);
    return res;
  }

  return dfs(0, 0);
}`,
        lineByLine: [
          'Line 4-5: Base cases: if word1 ends, insert remaining of word2; if word2 ends, delete remaining of word1.',
          'Line 9-13: If characters match, no operation cost: advance both (i+1, j+1).',
          'Line 15-19: If characters differ, take 1 + min of insert (i, j+1), delete (i+1, j), and replace (i+1, j+1).'
        ],
        dryRun: [
          { step: 1, state: 'word1="horse", word2="ros"', action: 'h !== r: tries replace h->r', result: 'branches to "orse" vs "os"' },
          { step: 2, state: 'r === r: match', result: 'advances' },
          { step: 3, state: 'Result', action: '3 operations total', result: 'Returns 3' }
        ],
        complexityDerivation: 'M * N subproblems -> O(M * N) time and O(M * N) stack/map space.'
      },
      {
        name: 'Approach 2: Bottom-Up Levenshtein Matrix (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N)',
        summary: 'dp[i][j] stores edit distance between word1[0...i-1] and word2[0...j-1].',
        intuition: 'Standard 2D DP matrix where dp[i][j] is computed from left, top, and top-left diagonal.',
        codeJS: `function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // replacement
        );
      }
    }
  }

  return dp[m][n];
}`,
        codeTS: `function minDistance(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1]
        );
      }
    }
  }

  return dp[m][n];
}`,
        lineByLine: [
          'Line 4: Allocate (m+1) x (n+1) matrix.',
          'Line 6-7: Base cases: converting empty string to word of length j requires j insertions; converting word of length i to empty requires i deletions.',
          'Line 9-18: If characters match, take diagonal dp[i-1][j-1]; otherwise take 1 + min of delete, insert, replace.',
          'Line 21: Return dp[m][n].'
        ],
        dryRun: [
          { step: 1, state: 'word1="intention", word2="execution"', action: 'Fills matrix bottom-up', result: 'dp[9][9] = 5' },
          { step: 2, state: 'Done', action: 'return dp[m][n]', result: 'Returns 5' }
        ],
        complexityDerivation: 'Fills (M + 1) * (N + 1) cells -> O(M * N) time and O(M * N) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Top-Down Memoized', time: 'O(M * N)', space: 'O(M * N)', pros: 'Intuitive transition logic', cons: 'Recursion overhead' },
      { approach: 'Bottom-Up 2D Table', time: 'O(M * N)', space: 'O(M * N)', pros: 'Standard Levenshtein algorithm, can reconstruct alignment path', cons: 'Allocates full matrix' }
    ],
    interviewPitch: 'Edit Distance implements the classic Levenshtein distance dynamic programming table. We construct a 2D matrix where dp[i][j] represents the minimum operations to convert word1[0...i-1] into word2[0...j-1]. If the characters word1[i-1] and word2[j-1] match, no operation is needed, so dp[i][j] = dp[i-1][j-1]. If they mismatch, we take 1 plus the minimum of deletion (dp[i-1][j]), insertion (dp[i][j-1]), or replacement (dp[i-1][j-1]). This runs in O(M * N) time and O(M * N) space.',
    followUps: [{ question: 'Can space be optimized to O(min(M, N))?', answer: 'Yes, because each row only accesses the current row and the previous row, we can use two rows of size min(M, N).' }],
    recallQuiz: {
      question: 'Which operation corresponds to the cell dp[i][j-1] in the Edit Distance table?',
      options: ['Insertion (inserting the character word2[j-1])', 'Deletion', 'Replacement', 'Transposition'],
      correctIndex: 0,
      explanation: 'Moving from j-1 to j while remaining at i corresponds to inserting a character into word1 to match word2.'
    }
  },

  119: {
    id: 119,
    title: 'Interleaving String',
    difficulty: 'Medium',
    pattern: 'DP - 2D',
    day: 71,
    leetcodeUrl: 'https://leetcode.com/problems/interleaving-string/',
    summary: 'Determine if s3 is formed by an interleaving of s1 and s2.',
    prerequisites: ['2D Grid DP', 'Length conservation check'],
    problemStatement: `Given strings \`s1\`, \`s2\`, and \`s3\`, find whether \`s3\` is formed by an interleaving of \`s1\` and \`s2\`.`,
    approaches: [
      {
        name: 'Approach 1: Top-Down Recursion with Memoization (Improved)',
        badge: 'Improved / Memoized',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N)',
        summary: 'dfs(i, j) exploring matching s1[i] === s3[i+j] or s2[j] === s3[i+j].',
        intuition: 'At each position, if s1 matches s3[i+j], advance i; if s2 matches s3[i+j], advance j. Memoize on (i, j).',
        codeJS: `function isInterleaveMemo(s1, s2, s3) {
  if (s1.length + s2.length !== s3.length) return false;
  const memo = new Map();

  function dfs(i, j) {
    if (i === s1.length && j === s2.length) return true;
    const key = \`\${i},\${j}\`;
    if (memo.has(key)) return memo.get(key);

    let res = false;
    if (i < s1.length && s1[i] === s3[i + j] && dfs(i + 1, j)) {
      res = true;
    }
    if (!res && j < s2.length && s2[j] === s3[i + j] && dfs(i, j + 1)) {
      res = true;
    }

    memo.set(key, res);
    return res;
  }

  return dfs(0, 0);
}`,
        codeTS: `function isInterleaveMemo(s1: string, s2: string, s3: string): boolean {
  if (s1.length + s2.length !== s3.length) return false;
  const memo = new Map<string, boolean>();

  function dfs(i: number, j: number): boolean {
    if (i === s1.length && j === s2.length) return true;
    const key = \`\${i},\${j}\`;
    if (memo.has(key)) return memo.get(key)!;

    let res = false;
    if (i < s1.length && s1[i] === s3[i + j] && dfs(i + 1, j)) {
      res = true;
    }
    if (!res && j < s2.length && s2[j] === s3[i + j] && dfs(i, j + 1)) {
      res = true;
    }

    memo.set(key, res);
    return res;
  }

  return dfs(0, 0);
}`,
        lineByLine: [
          'Line 2: Fast check: sum of lengths of s1 and s2 MUST equal s3 length.',
          'Line 6: Base case: reached end of both strings -> successfully interleaved.',
          'Line 10-15: Try matching s1[i] with s3[i+j]; if unsuccessful, try matching s2[j] with s3[i+j].'
        ],
        dryRun: [
          { step: 1, state: 's1="aabcc", s2="dbbca", s3="aadbbcbcac"', action: 'len check 5+5 === 10', result: 'valid length' },
          { step: 2, state: 'dfs(0,0)', action: 'matches s1[0]=\'a\'', result: 'branches dfs(1,0)' },
          { step: 3, state: 'Result', action: 'finds valid path to end', result: 'Returns true' }
        ],
        complexityDerivation: 'M * N states visited once -> O(M * N) time and O(M * N) memory.'
      },
      {
        name: 'Approach 2: 2D Grid DP Array (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N)',
        summary: 'dp[i][j] is true if s1[0...i-1] and s2[0...j-1] interleave to form s3[0...i+j-1].',
        intuition: 'Cell (i, j) is reachable if top cell (i-1, j) is true and s1[i-1] === s3[i+j-1], OR left cell (i, j-1) is true and s2[j-1] === s3[i+j-1].',
        codeJS: `function isInterleave(s1, s2, s3) {
  if (s1.length + s2.length !== s3.length) return false;
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;

  for (let i = 1; i <= m; i++) {
    dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];
  }
  for (let j = 1; j <= n; j++) {
    dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char = s3[i + j - 1];
      dp[i][j] = (dp[i - 1][j] && s1[i - 1] === char) ||
                 (dp[i][j - 1] && s2[j - 1] === char);
    }
  }

  return dp[m][n];
}`,
        codeTS: `function isInterleave(s1: string, s2: string, s3: string): boolean {
  if (s1.length + s2.length !== s3.length) return false;
  const m = s1.length;
  const n = s2.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;

  for (let i = 1; i <= m; i++) {
    dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];
  }
  for (let j = 1; j <= n; j++) {
    dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char = s3[i + j - 1];
      dp[i][j] = (dp[i - 1][j] && s1[i - 1] === char) ||
                 (dp[i][j - 1] && s2[j - 1] === char);
    }
  }

  return dp[m][n];
}`,
        lineByLine: [
          'Line 2: Fast check for total character count.',
          'Line 5-6: dp[0][0] = true: empty strings interleave to form empty string.',
          'Line 8-13: Initialize first row and column.',
          'Line 15-22: For each cell, check transition from top (consuming s1) or left (consuming s2).',
          'Line 24: Return dp[m][n].'
        ],
        dryRun: [
          { step: 1, state: 's1="a", s2="b", s3="ab"', action: 'dp[0][0]=T, dp[1][0]=T ("a"), dp[0][1]=F', result: 'base setup' },
          { step: 2, state: 'i=1, j=1', action: 'dp[1][0] is T and s2[0]==s3[1](\'b\')', result: 'dp[1][1] = true' }
        ],
        complexityDerivation: 'Fills (M + 1) * (N + 1) grid -> O(M * N) time and O(M * N) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Top-Down Memoized', time: 'O(M * N)', space: 'O(M * N)', pros: 'Stops early when target found', cons: 'Map string keys overhead' },
      { approach: '2D DP Matrix', time: 'O(M * N)', space: 'O(M * N)', pros: 'Iterative, cache friendly', cons: 'Fills full table' }
    ],
    interviewPitch: 'First, check if s1.length + s2.length equals s3.length; if not, return false immediately. We model interleaving as path-finding in a 2D grid: dp[i][j] is true if s1[0...i-1] and s2[0...j-1] can interleave to form s3[0...i+j-1]. Moving down consumes a character from s1 (valid if dp[i-1][j] is true and s1[i-1] === s3[i+j-1]), while moving right consumes a character from s2 (valid if dp[i][j-1] is true and s2[j-1] === s3[i+j-1]). This runs in O(M * N) time and O(M * N) space.',
    followUps: [{ question: 'Can space be optimized to O(N)?', answer: 'Yes, each row only accesses values from the current row and the row directly above, allowing compression to a single 1D boolean array of size N+1.' }],
    recallQuiz: {
      question: 'What is the mandatory prerequisite check before running DP on Interleaving String?',
      options: ['s1.length + s2.length === s3.length', 's1 and s2 must be sorted', 's3 must not contain duplicates', 'Strings must be lowercase'],
      correctIndex: 0,
      explanation: 'Interleaving preserves every single character from both input strings; hence their combined length must strictly match s3.'
    }
  },

  120: {
    id: 120,
    title: 'Longest Increasing Path in a Matrix',
    difficulty: 'Hard',
    pattern: 'DP - 2D',
    day: 71,
    leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/',
    summary: 'Find the length of the longest increasing path in an m x n integers matrix.',
    prerequisites: ['DFS with Memoization Matrix', 'DAG topological order in grid'],
    problemStatement: `Given an \`m x n\` integers matrix, return the length of the longest increasing path in \`matrix\`. From each cell, you can either move in four directions: left, right, up, or down. You may not move diagonally or move outside the boundary.`,
    approaches: [
      {
        name: 'Approach 1: Plain DFS without Memoization (Baseline)',
        badge: 'Baseline / Brute-Force',
        timeComplexity: 'O(4^(M*N))',
        spaceComplexity: 'O(M * N)',
        summary: 'Exhaustive DFS exploring all increasing paths from every cell.',
        intuition: 'From each cell, recursively explore all 4 neighbors that have strictly greater values.',
        codeJS: `function longestIncreasingPathBrute(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  function dfs(r, c) {
    let maxLen = 1;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] > matrix[r][c]) {
        maxLen = Math.max(maxLen, 1 + dfs(nr, nc));
      }
    }
    return maxLen;
  }

  let res = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      res = Math.max(res, dfs(r, c));
    }
  }
  return res;
}`,
        codeTS: `function longestIncreasingPathBrute(matrix: number[][]): number {
  const m = matrix.length;
  const n = matrix[0].length;
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  function dfs(r: number, c: number): number {
    let maxLen = 1;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] > matrix[r][c]) {
        maxLen = Math.max(maxLen, 1 + dfs(nr, nc));
      }
    }
    return maxLen;
  }

  let res = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      res = Math.max(res, dfs(r, c));
    }
  }
  return res;
}`,
        lineByLine: [
          'Line 6-14: DFS searches 4 directions for strictly greater neighbor values.',
          'Line 16-20: Call DFS from every cell in matrix.',
          'Line 21: Returns maximum path length, but times out exponentially without caching.'
        ],
        dryRun: [
          { step: 1, state: 'grid 3x3', action: 'Calls branch 4 ways at each step', result: 'Exponential tree' }
        ],
        complexityDerivation: 'Branching factor of 4 per cell -> O(4^(M*N)) exponential time. Exceeds time limit.'
      },
      {
        name: 'Approach 2: DFS with 2D Memoization Matrix (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N)',
        summary: 'Cache longest path starting from (r, c) in memo[r][c].',
        intuition: 'Strictly increasing condition guarantees no cycles exist (it is a Directed Acyclic Graph). Once memo[r][c] is computed, it never changes!',
        codeJS: `function longestIncreasingPath(matrix) {
  if (!matrix || matrix.length === 0) return 0;
  const m = matrix.length;
  const n = matrix[0].length;
  const memo = Array.from({ length: m }, () => new Array(n).fill(0));
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  function dfs(r, c) {
    if (memo[r][c] !== 0) return memo[r][c];

    let maxLen = 1;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] > matrix[r][c]) {
        maxLen = Math.max(maxLen, 1 + dfs(nr, nc));
      }
    }

    memo[r][c] = maxLen;
    return maxLen;
  }

  let longest = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      longest = Math.max(longest, dfs(r, c));
    }
  }

  return longest;
}`,
        codeTS: `function longestIncreasingPath(matrix: number[][]): number {
  if (!matrix || matrix.length === 0) return 0;
  const m = matrix.length;
  const n = matrix[0].length;
  const memo: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  function dfs(r: number, c: number): number {
    if (memo[r][c] !== 0) return memo[r][c];

    let maxLen = 1;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] > matrix[r][c]) {
        maxLen = Math.max(maxLen, 1 + dfs(nr, nc));
      }
    }

    memo[r][c] = maxLen;
    return maxLen;
  }

  let longest = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      longest = Math.max(longest, dfs(r, c));
    }
  }

  return longest;
}`,
        lineByLine: [
          'Line 5: memo matrix initialized with 0.',
          'Line 9: Cache hit: if already calculated, return memo[r][c] in O(1).',
          'Line 11-18: Explore all 4 adjacent cells strictly greater than current value.',
          'Line 20: Store maxLen in memo[r][c] and return.',
          'Line 24-28: Find global maximum across all cells.'
        ],
        dryRun: [
          { step: 1, state: 'matrix = [[9,9,4],[6,6,8],[2,1,1]]', action: 'dfs(2, 1) on 1: 1 -> 2 -> 6 -> 9', result: 'path len = 4' },
          { step: 2, state: 'memo records cell results', action: 'subsequent visits return in O(1)', result: 'Returns 4' }
        ],
        complexityDerivation: 'Each cell (r, c) is visited once and its 4 edges inspected -> O(M * N) time and O(M * N) memoization storage.'
      }
    ],
    comparisonTable: [
      { approach: 'Brute Force DFS', time: 'O(4^(M*N))', space: 'O(M * N)', pros: 'No extra memo table', cons: 'Exponential explosion; TLE' },
      { approach: 'DFS + Memo Matrix', time: 'O(M * N)', space: 'O(M * N)', pros: 'Linear time in total number of cells, optimal', cons: 'Recursion stack of depth M*N' }
    ],
    interviewPitch: 'Because the path must be strictly increasing, cycles are impossible: moving from value v to a strictly greater neighbor prevents returning to any previously visited cell. This guarantees the grid is a Directed Acyclic Graph (DAG). We apply DFS with a 2D memoization matrix memo[r][c] storing the longest increasing path starting from (r, c). Each cell is computed once in O(1) amortized time across its 4 neighbors, achieving optimal O(M * N) time and O(M * N) space.',
    followUps: [{ question: 'Do we need a visited set during DFS?', answer: 'No! Because we only move to strictly greater values (matrix[nr][nc] > matrix[r][c]), we can never loop back to an already visited node in the current path.' }],
    recallQuiz: {
      question: 'Why is a visited array not required to prevent infinite loops in Longest Increasing Path?',
      options: ['Because paths must be strictly increasing, meaning a cycle can never exist', 'Because the matrix has finite dimensions', 'Because DFS only moves right and down', 'Because numbers are positive'],
      correctIndex: 0,
      explanation: 'A cycle would require a sequence of numbers where a < b < c < ... < a, which is mathematically impossible.'
    }
  },

  121: {
    id: 121,
    title: 'Distinct Subsequences',
    difficulty: 'Hard',
    pattern: 'DP - 2D',
    day: 72,
    leetcodeUrl: 'https://leetcode.com/problems/distinct-subsequences/',
    summary: 'Given two strings s and t, return the number of distinct subsequences of s which equals t.',
    prerequisites: ['2D Subsequence Matching DP', '64-bit integer overflow protection'],
    problemStatement: `Given two strings \`s\` and \`t\`, return the number of distinct subsequences of \`s\` which equals \`t\`. The test cases are generated so that the answer fits in a 32-bit signed integer.`,
    approaches: [
      {
        name: 'Approach 1: Top-Down Recursion with Memoization (Improved)',
        badge: 'Improved / Memoized',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N)',
        summary: 'dfs(i, j) exploring matching s[i] with t[j] and skipping s[i].',
        intuition: 'At each step, we can always skip s[i] (dfs(i+1, j)). If s[i] === t[j], we can also consume both (dfs(i+1, j+1)).',
        codeJS: `function numDistinctMemo(s, t) {
  const memo = new Map();

  function dfs(i, j) {
    if (j === t.length) return 1; // matched all of t
    if (i === s.length) return 0; // ran out of s
    const key = \`\${i},\${j}\`;
    if (memo.has(key)) return memo.get(key);

    let res = dfs(i + 1, j); // Option 1: skip s[i]
    if (s[i] === t[j]) {
      res += dfs(i + 1, j + 1); // Option 2: match s[i] with t[j]
    }

    memo.set(key, res);
    return res;
  }

  return dfs(0, 0);
}`,
        codeTS: `function numDistinctMemo(s: string, t: string): number {
  const memo = new Map<string, number>();

  function dfs(i: number, j: number): number {
    if (j === t.length) return 1;
    if (i === s.length) return 0;
    const key = \`\${i},\${j}\`;
    if (memo.has(key)) return memo.get(key)!;

    let res = dfs(i + 1, j);
    if (s[i] === t[j]) {
      res += dfs(i + 1, j + 1);
    }

    memo.set(key, res);
    return res;
  }

  return dfs(0, 0);
}`,
        lineByLine: [
          'Line 4: Base case: if j reaches t.length, all characters of t are matched -> 1 valid subsequence.',
          'Line 5: If i reaches s.length without completing t -> 0.',
          'Line 9: Always explore skipping s[i] by incrementing i.',
          'Line 10-12: If characters match, add ways from matching both (i+1, j+1).'
        ],
        dryRun: [
          { step: 1, state: 's="rabbbit", t="rabbit"', action: 'Three b\'s in s, two needed for t', result: '3 choose 2 combinations' },
          { step: 2, state: 'Result', action: 'Total ways = 3', result: 'Returns 3' }
        ],
        complexityDerivation: 'M * N states -> O(M * N) time and O(M * N) stack/memo space.'
      },
      {
        name: 'Approach 2: 2D Dynamic Programming Table (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N)',
        summary: 'dp[i][j] stores distinct subsequences of s[0...i-1] matching t[0...j-1].',
        intuition: 'dp[i][j] = dp[i-1][j] + (s[i-1] === t[j-1] ? dp[i-1][j-1] : 0).',
        codeJS: `function numDistinct(s, t) {
  const m = s.length;
  const n = t.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = 1; // empty t is matched by 1 subsequence of any prefix of s
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = dp[i - 1][j];
      if (s[i - 1] === t[j - 1]) {
        dp[i][j] += dp[i - 1][j - 1];
      }
    }
  }

  return dp[m][n];
}`,
        codeTS: `function numDistinct(s: string, t: string): number {
  const m = s.length;
  const n = t.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = 1;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = dp[i - 1][j];
      if (s[i - 1] === t[j - 1]) {
        dp[i][j] += dp[i - 1][j - 1];
      }
    }
  }

  return dp[m][n];
}`,
        lineByLine: [
          'Line 6-8: Base case: an empty target t can always be formed 1 way (by deleting all remaining characters of s).',
          'Line 10-17: dp[i-1][j] accounts for skipping s[i-1]. If s[i-1] === t[j-1], add dp[i-1][j-1] for matching.',
          'Line 19: Return dp[m][n].'
        ],
        dryRun: [
          { step: 1, state: 's="babgbag", t="bag"', action: 'Fills matrix cell by cell', result: 'matches different \'b\', \'a\', \'g\' occurrences' },
          { step: 2, state: 'Final cell', action: 'dp[7][3]', result: 'Returns 5' }
        ],
        complexityDerivation: 'Fills (M + 1) * (N + 1) matrix -> O(M * N) time and O(M * N) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Top-Down Memoized', time: 'O(M * N)', space: 'O(M * N)', pros: 'Direct transition representation', cons: 'String concatenation in memo map' },
      { approach: 'Bottom-Up 2D Table', time: 'O(M * N)', space: 'O(M * N)', pros: 'Fast 2D array indexing, no recursion depth limit', cons: 'Matrix allocation' }
    ],
    interviewPitch: 'In Distinct Subsequences, we count how many ways we can form t from s. In our 2D DP matrix, dp[i][j] represents the number of ways s[0...i-1] can form t[0...j-1]. The base case is dp[i][0] = 1 because an empty string t is formed in exactly 1 way from any prefix of s (by deleting all characters). For each cell, we can always choose to skip s[i-1], contributing dp[i-1][j]. If s[i-1] === t[j-1], we also add dp[i-1][j-1]. This runs in O(M * N) time and O(M * N) space.',
    followUps: [{ question: 'Can space be compressed to O(N)?', answer: 'Yes, by iterating backwards over j from n down to 1, a single 1D array of size N+1 suffices.' }],
    recallQuiz: {
      question: 'Why is dp[i][0] initialized to 1 for all i?',
      options: ['Because an empty string t can always be formed in exactly 1 way by deleting all characters from s', 'Because 0! is 1', 'Because s has at least one character', 'To prevent null pointers'],
      correctIndex: 0,
      explanation: 'An empty target is matched by exactly 1 subsequence of any string: the empty subsequence.'
    }
  },

  122: {
    id: 122,
    title: 'Burst Balloons',
    difficulty: 'Hard',
    pattern: 'DP - 2D',
    day: 72,
    leetcodeUrl: 'https://leetcode.com/problems/burst-balloons/',
    summary: 'Burst balloons to maximize coins: bursting balloon i gives nums[i-1] * nums[i] * nums[i+1].',
    prerequisites: ['Interval DP', 'Thinking in reverse (which balloon bursts LAST)'],
    problemStatement: `You are given \`n\` balloons, indexed from \`0\` to \`n - 1\`. Each balloon is painted with a number on it represented by an array \`nums\`. You are asked to burst all the balloons. If you burst balloon \`i\` you will get \`nums[i - 1] * nums[i] * nums[i + 1]\` coins. Return the maximum coins you can collect.`,
    approaches: [
      {
        name: 'Approach 1: Top-Down Interval DP with Memoization (Improved)',
        badge: 'Improved / Memoized',
        timeComplexity: 'O(N³)',
        spaceComplexity: 'O(N²)',
        summary: 'dfs(l, r) computes max coins for balloons between l and r, choosing which balloon k bursts LAST.',
        intuition: 'Thinking which balloon bursts first couples neighboring subproblems. Thinking which balloon bursts LAST isolates subproblems because boundary balloons l and r remain intact!',
        codeJS: `function maxCoinsMemo(nums) {
  const vals = [1, ...nums, 1];
  const memo = new Map();

  function dfs(l, r) {
    if (l > r) return 0;
    const key = \`\${l},\${r}\`;
    if (memo.has(key)) return memo.get(key);

    let maxCoins = 0;
    for (let k = l; k <= r; k++) {
      // k is the LAST balloon burst in range [l, r]
      const coins = vals[l - 1] * vals[k] * vals[r + 1] + dfs(l, k - 1) + dfs(k + 1, r);
      maxCoins = Math.max(maxCoins, coins);
    }

    memo.set(key, maxCoins);
    return maxCoins;
  }

  return dfs(1, nums.length);
}`,
        codeTS: `function maxCoinsMemo(nums: number[]): number {
  const vals = [1, ...nums, 1];
  const memo = new Map<string, number>();

  function dfs(l: number, r: number): number {
    if (l > r) return 0;
    const key = \`\${l},\${r}\`;
    if (memo.has(key)) return memo.get(key)!;

    let maxCoins = 0;
    for (let k = l; k <= r; k++) {
      const coins = vals[l - 1] * vals[k] * vals[r + 1] + dfs(l, k - 1) + dfs(k + 1, r);
      maxCoins = Math.max(maxCoins, coins);
    }

    memo.set(key, maxCoins);
    return maxCoins;
  }

  return dfs(1, nums.length);
}`,
        lineByLine: [
          'Line 2: Pad array with 1 at both boundaries to handle edges cleanly.',
          'Line 5: Base case: empty interval returns 0 coins.',
          'Line 10-15: Pivot k represents the LAST balloon to burst in interval [l, r]. Its coins are vals[l-1] * vals[k] * vals[r+1] plus independent subproblems dfs(l, k-1) and dfs(k+1, r).'
        ],
        dryRun: [
          { step: 1, state: 'nums = [3, 1, 5, 8]', action: 'vals = [1, 3, 1, 5, 8, 1]', result: 'padded with 1' },
          { step: 2, state: 'Test all last-burst candidates k', action: 'burst 1, then 5, then 3, then 8', result: 'Max coins = 167' }
        ],
        complexityDerivation: 'N^2 intervals, each testing up to N pivots -> O(N^3) time and O(N^2) space.'
      },
      {
        name: 'Approach 2: Bottom-Up Interval DP Table (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N³)',
        spaceComplexity: 'O(N²)',
        summary: 'Iterate interval length len from 1 to n, filling dp[l][r] table.',
        intuition: 'Build solutions for shorter intervals first so that sub-ranges [l, k-1] and [k+1, r] are already solved.',
        codeJS: `function maxCoins(nums) {
  const n = nums.length;
  const vals = [1, ...nums, 1];
  const dp = Array.from({ length: n + 2 }, () => new Array(n + 2).fill(0));

  for (let len = 1; len <= n; len++) {
    for (let l = 1; l <= n - len + 1; l++) {
      const r = l + len - 1;
      for (let k = l; k <= r; k++) {
        const coins = vals[l - 1] * vals[k] * vals[r + 1] + dp[l][k - 1] + dp[k + 1][r];
        dp[l][r] = Math.max(dp[l][r], coins);
      }
    }
  }

  return dp[1][n];
}`,
        codeTS: `function maxCoins(nums: number[]): number {
  const n = nums.length;
  const vals: number[] = [1, ...nums, 1];
  const dp: number[][] = Array.from({ length: n + 2 }, () => new Array(n + 2).fill(0));

  for (let len = 1; len <= n; len++) {
    for (let l = 1; l <= n - len + 1; l++) {
      const r = l + len - 1;
      for (let k = l; k <= r; k++) {
        const coins = vals[l - 1] * vals[k] * vals[r + 1] + dp[l][k - 1] + dp[k + 1][r];
        dp[l][r] = Math.max(dp[l][r], coins);
      }
    }
  }

  return dp[1][n];
}`,
        lineByLine: [
          'Line 3: Pad array with 1 at both sides.',
          'Line 4: Allocate (n+2) x (n+2) matrix.',
          'Line 6-15: Outer loop iterates over interval length len. For each interval [l, r], test every balloon k as the last balloon to burst.',
          'Line 17: Return dp[1][n].'
        ],
        dryRun: [
          { step: 1, state: 'len=1: single balloons', action: 'dp[i][i] = vals[i-1]*vals[i]*vals[i+1]', result: 'base intervals set' },
          { step: 2, state: 'len=2..4: merge intervals', action: 'adds independent subproblems', result: 'dp[1][4] = 167' }
        ],
        complexityDerivation: 'Three nested loops of size N -> O(N^3) time and O(N^2) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Top-Down Memoized', time: 'O(N³)', space: 'O(N²)', pros: 'Natural divide-and-conquer logic', cons: 'Recursion overhead' },
      { approach: 'Bottom-Up Interval DP', time: 'O(N³)', space: 'O(N²)', pros: 'Iterative, cache friendly, standard Interval DP pattern', cons: 'Requires 3 nested loops' }
    ],
    interviewPitch: 'Burst Balloons is the quintessential Interval DP problem. If we ask "which balloon bursts first?", the adjacent balloons change dynamically, coupling the subproblems and destroying independence. The key insight is to reverse the perspective: "Which balloon k bursts LAST in interval [l, r]?". Because balloon k is the last to burst, its neighbors are guaranteed to be the boundary balloons l - 1 and r + 1! This cleanly decouples the subproblems into [l, k - 1] and [k + 1, r]. We build bottom-up by increasing interval length, running in O(N^3) time and O(N^2) space.',
    followUps: [{ question: 'Why does padding with 1 at the boundaries simplify the logic?', answer: 'The problem statement specifies that out-of-bound neighbors are treated as having value 1; padding avoids branch checks on array bounds.' }],
    recallQuiz: {
      question: 'Why do we ask which balloon bursts LAST instead of which bursts FIRST?',
      options: ['Because the last balloon is adjacent strictly to the intact boundaries l-1 and r+1, making subproblems independent', 'Because the last balloon gives the most coins', 'Because balloons cannot burst in order', 'Because of floating point limits'],
      correctIndex: 0,
      explanation: 'If k bursts last, every other balloon in [l, r] is already gone, meaning k is adjacent only to vals[l-1] and vals[r+1], isolating the subproblems.'
    }
  },

  123: {
    id: 123,
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    pattern: 'DP - 2D',
    day: 73,
    leetcodeUrl: 'https://leetcode.com/problems/regular-expression-matching/',
    summary: 'Implement regular expression matching with support for \'.\' and \'*\'.',
    prerequisites: ['2D State Machine DP', 'Star wildcard matching zero or more occurrences'],
    problemStatement: `Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`'.'\` and \`'*'\` where:
- \`'.'\` Matches any single character.
- \`'*'\` Matches zero or more of the preceding element.
The matching should cover the **entire** input string (not partial).`,
    approaches: [
      {
        name: 'Approach 1: Top-Down Recursion with Memoization (Improved)',
        badge: 'Improved / Memoized',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N)',
        summary: 'dfs(i, j) matching s[i] with p[j], branching when p[j+1] === "*".',
        intuition: 'If p[j+1] === "*", we can either skip the star entirely (dfs(i, j+2)) or consume one matching character (dfs(i+1, j)).',
        codeJS: `function isMatchMemo(s, p) {
  const memo = new Map();

  function dfs(i, j) {
    if (j === p.length) return i === s.length;
    const key = \`\${i},\${j}\`;
    if (memo.has(key)) return memo.get(key);

    const match = i < s.length && (s[i] === p[j] || p[j] === '.');

    let res = false;
    if (j + 1 < p.length && p[j + 1] === '*') {
      // Option 1: use * as zero occurrences (dfs(i, j+2))
      // Option 2: use * to match 1 char and stay on * (dfs(i+1, j))
      res = dfs(i, j + 2) || (match && dfs(i + 1, j));
    } else if (match) {
      res = dfs(i + 1, j + 1);
    }

    memo.set(key, res);
    return res;
  }

  return dfs(0, 0);
}`,
        codeTS: `function isMatchMemo(s: string, p: string): boolean {
  const memo = new Map<string, boolean>();

  function dfs(i: number, j: number): boolean {
    if (j === p.length) return i === s.length;
    const key = \`\${i},\${j}\`;
    if (memo.has(key)) return memo.get(key)!;

    const match = i < s.length && (s[i] === p[j] || p[j] === '.');

    let res = false;
    if (j + 1 < p.length && p[j + 1] === '*') {
      res = dfs(i, j + 2) || (match && dfs(i + 1, j));
    } else if (match) {
      res = dfs(i + 1, j + 1);
    }

    memo.set(key, res);
    return res;
  }

  return dfs(0, 0);
}`,
        lineByLine: [
          'Line 4: Base case: if pattern is exhausted, string must also be exhausted.',
          'Line 8: match is true if current characters equal or pattern is dot \'.\'.',
          'Line 11-15: If next character is \'*\', either skip the preceding token entirely (j+2) or consume matching character and stay at star (i+1, j).',
          'Line 16: If single character match without star, advance both (i+1, j+1).'
        ],
        dryRun: [
          { step: 1, state: 's = "aab", p = "c*a*b"', action: 'c* skipped (j=2)', result: '"a*b" matches "aab"' },
          { step: 2, state: 'a* consumes \'a\', then \'a\'', action: 'b matches b', result: 'Returns true' }
        ],
        complexityDerivation: 'M * N states visited once -> O(M * N) time and O(M * N) memory.'
      },
      {
        name: 'Approach 2: 2D Dynamic Programming Table (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N)',
        summary: 'dp[i][j] is true if s[0...i-1] matches p[0...j-1].',
        intuition: 'Bottom-up table transitions: if p[j-1] is \'*\', dp[i][j] = dp[i][j-2] || (match && dp[i-1][j]).',
        codeJS: `function isMatch(s, p) {
  const m = s.length;
  const n = p.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;

  // Patterns like a*, a*b*, a*b*c* match empty string
  for (let j = 2; j <= n; j += 2) {
    if (p[j - 1] === '*') {
      dp[0][j] = dp[0][j - 2];
    }
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        // Zero occurrences of preceding element: dp[i][j-2]
        dp[i][j] = dp[i][j - 2];
        // One or more occurrences if preceding element matches s[i-1]
        const match = s[i - 1] === p[j - 2] || p[j - 2] === '.';
        if (match) {
          dp[i][j] = dp[i][j] || dp[i - 1][j];
        }
      } else {
        const match = s[i - 1] === p[j - 1] || p[j - 1] === '.';
        if (match) {
          dp[i][j] = dp[i - 1][j - 1];
        }
      }
    }
  }

  return dp[m][n];
}`,
        codeTS: `function isMatch(s: string, p: string): boolean {
  const m = s.length;
  const n = p.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;

  for (let j = 2; j <= n; j += 2) {
    if (p[j - 1] === '*') {
      dp[0][j] = dp[0][j - 2];
    }
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        dp[i][j] = dp[i][j - 2];
        const match = s[i - 1] === p[j - 2] || p[j - 2] === '.';
        if (match) {
          dp[i][j] = dp[i][j] || dp[i - 1][j];
        }
      } else {
        const match = s[i - 1] === p[j - 1] || p[j - 1] === '.';
        if (match) {
          dp[i][j] = dp[i - 1][j - 1];
        }
      }
    }
  }

  return dp[m][n];
}`,
        lineByLine: [
          'Line 5: dp[0][0] = true: empty string matches empty pattern.',
          'Line 7-11: Handle patterns like "a*" matching empty string by checking dp[0][j-2].',
          'Line 13-28: If p[j-1] is \'*\', take zero occurrences (dp[i][j-2]) or, if preceding char matches, one/more occurrences (dp[i-1][j]). If not \'*\', standard diagonal match.',
          'Line 31: Return dp[m][n].'
        ],
        dryRun: [
          { step: 1, state: 's = "ab", p = ".*"', action: '.* matches any string', result: 'dp[2][2] = true' },
          { step: 2, state: 'Result', action: 'dp[m][n] === true', result: 'Returns true' }
        ],
        complexityDerivation: 'Fills (M + 1) * (N + 1) grid -> O(M * N) time and O(M * N) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Top-Down Memoized', time: 'O(M * N)', space: 'O(M * N)', pros: 'Direct expression of regex choices', cons: 'Recursion overhead' },
      { approach: 'Bottom-Up DP Table', time: 'O(M * N)', space: 'O(M * N)', pros: 'Iterative, cache friendly, handles edge cases via base row', cons: 'Complex base row setup' }
    ],
    interviewPitch: 'Regular Expression Matching is governed by how we handle the \'*\' wildcard, which matches zero or more of the preceding character. In our 2D DP matrix where dp[i][j] represents whether s[0...i-1] matches p[0...j-1]: If p[j-1] is not \'*\', we simply match characters and inherit from dp[i-1][j-1]. If p[j-1] is \'*\', we have two choices: treat \'*\' as zero occurrences (dp[i][j-2]), or, if the preceding character matches s[i-1], treat it as one more occurrence and inherit from dp[i-1][j]. This runs in O(M * N) time and O(M * N) space.',
    followUps: [{ question: 'How is this different from Wildcard Matching (\'?\' and \'*\')?', answer: 'In Wildcard Matching, \'*\' stands alone and matches any sequence of characters directly; in Regex Matching, \'*\' modifies the preceding character specifically.' }],
    recallQuiz: {
      question: 'When p[j-1] is "*", what does dp[i][j-2] represent?',
      options: ['Treating the preceding character and star as matching zero times', 'Deleting two characters from string s', 'A syntax error', 'Matching two characters'],
      correctIndex: 0,
      explanation: 'Skipping back two columns in the pattern completely ignores the preceding character and the asterisk, representing 0 occurrences.'
    }
  }
};
