// Canonical Core Solutions for Sliding Window, Stack, Binary Search, Linked List, Trees, and Dynamic Programming
// Full unabridged solutions with JavaScript, TypeScript, Dry Runs, Line-by-Line explanations, Pitches, and Quizzes

export const CORE_REGISTRY_SOLUTIONS = {
  // ==========================================
  // PROBLEM 16: BEST TIME TO BUY AND SELL STOCK (LeetCode #121)
  // ==========================================
  16: {
    id: 16,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    pattern: 'Sliding Window',
    day: 9,
    leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    summary: 'Find the maximum profit you can achieve from a single buy and sell transaction in a stock price array.',
    prerequisites: ['Single pass tracking minimum', 'Greedy / Sliding Window one-way traversal'],
    problemStatement: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return **the maximum profit** you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.

### Examples:
- **Example 1**: \`prices = [7,1,5,3,6,4]\` $\\to$ \`5\` (Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5)
- **Example 2**: \`prices = [7,6,4,3,1]\` $\\to$ \`0\` (Prices continually decrease, no profitable transaction)

### Constraints:
- \`1 <= prices.length <= 10^5\`
- \`0 <= prices[i] <= 10^4\``,
    approaches: [
      {
        name: 'Approach 1: Brute Force All Buy/Sell Pairs (Baseline)',
        badge: 'Baseline / Brute-Force',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        summary: 'Check profit for every pair of buy day i and sell day j > i.',
        intuition: 'Compute prices[j] - prices[i] for all valid day combinations.',
        codeJS: `function maxProfitBrute(prices) {
  let maxP = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      maxP = Math.max(maxP, prices[j] - prices[i]);
    }
  }
  return maxP;
}`,
        codeTS: `function maxProfitBrute(prices: number[]): number {
  let maxP = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      maxP = Math.max(maxP, prices[j] - prices[i]);
    }
  }
  return maxP;
}`,
        lineByLine: [
          'Line 2: Track max profit.',
          'Line 3-6: Nested loops compare every buy day i with subsequent sell day j.'
        ],
        dryRun: [
          { step: 1, state: 'prices = [7, 1, 5, 3, 6, 4]', action: 'i=1 (1), j=4 (6): profit = 5', result: 'maxP = 5' }
        ],
        complexityDerivation: 'N*(N-1)/2 iterations -> O(N^2) time and O(1) space.'
      },
      {
        name: 'Approach 2: One Pass Min Price Tracker (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Track minimum purchase price seen so far and calculate profit on every subsequent day.',
        intuition: 'As we step through days, we ask: "What was the lowest price we could have bought this stock for up until today?". Maximum profit is current price minus historical minimum.',
        codeJS: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i]; // Found cheaper buy day
    } else {
      maxProfit = Math.max(maxProfit, prices[i] - minPrice);
    }
  }
  
  return maxProfit;
}`,
        codeTS: `function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let maxProfit = 0;
  
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i];
    } else {
      maxProfit = Math.max(maxProfit, prices[i] - minPrice);
    }
  }
  
  return maxProfit;
}`,
        lineByLine: [
          'Line 2-3: Tracks lowest historical buy price and highest profit.',
          'Line 6: If current day is cheaper, update minPrice.',
          'Line 8: Otherwise evaluate selling today at prices[i] - minPrice.'
        ],
        dryRun: [
          { step: 1, state: 'p=7', action: 'minPrice=7, profit=0', result: 'No sale' },
          { step: 2, state: 'p=1', action: 'minPrice=1, profit=0', result: 'New lowest buy day' },
          { step: 3, state: 'p=5', action: 'profit = 5 - 1 = 4', result: 'maxProfit=4' },
          { step: 4, state: 'p=6', action: 'profit = 6 - 1 = 5', result: 'maxProfit=5' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ single pass visiting each price once.
**Space Complexity**: $O(1)$ auxiliary space using two variables.`
      }
    ],
    comparisonTable: [
      { approach: 'Brute Force Nested Loops', time: 'O(N²)', space: 'O(1)', pros: 'Simple', cons: 'TLE on 100,000 prices' },
      { approach: 'One Pass (Optimal)', time: 'O(N)', space: 'O(1)', pros: 'Linear time; optimal cache locality', cons: 'None' }
    ],
    interviewPitch: `"We can find the maximum stock profit in a single pass of O(N) time with O(1) space. We maintain the minimum price observed up to the current day. On each day, if the price is lower than our minimum, we update the minimum. Otherwise, we calculate the profit of selling today (price - minPrice) and update our maximum profit. This guarantees finding the global maximum profit in O(N) time."`,
    followUps: [{ question: 'What if you could buy and sell multiple times?', answer: 'Best Time to Buy and Sell Stock II: Accumulate all positive differences (if prices[i] > prices[i-1], add prices[i] - prices[i-1]) in O(N) time.' }],
    recallQuiz: {
      question: 'Why do we update minPrice instead of selling when prices[i] < minPrice?',
      options: ['Because buying at a lower price yields higher potential future profits', 'Because selling on the same day is illegal', 'Because arrays are read-only', 'Because profit would be negative'],
      correctIndex: 0,
      explanation: 'A lower purchase price strictly improves all future selling opportunities.'
    }
  },

  // ==========================================
  // PROBLEM 17: LONGEST SUBSTRING WITHOUT REPEATING CHARACTERS (LeetCode #3)
  // ==========================================
  17: {
    id: 17,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    pattern: 'Sliding Window',
    day: 9,
    leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    summary: 'Find the length of the longest substring without repeating characters using a dynamic sliding window.',
    prerequisites: ['Dynamic sliding window', 'Hash Map / Set for character index tracking'],
    problemStatement: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.

### Examples:
- **Example 1**: \`s = "abcabcbb"\` $\\to$ \`3\` (Substring: "abc")
- **Example 2**: \`s = "bbbbb"\` $\\to$ \`1\` (Substring: "b")
- **Example 3**: \`s = "pwwkew"\` $\\to$ \`3\` (Substring: "wke")

### Constraints:
- \`0 <= s.length <= 5 * 10^4\`
- \`s\` consists of English letters, digits, symbols and spaces.`,
    approaches: [
      {
        name: 'Approach 1: Brute Force All Substrings (Baseline)',
        badge: 'Baseline / Brute-Force',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(N)',
        summary: 'Check every substring starting at i; expand until duplicate character is seen.',
        intuition: 'For each index i, insert characters into a Set; stop when a character repeats.',
        codeJS: `function lengthOfLongestSubstringBrute(s) {
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
}`,
        codeTS: `function lengthOfLongestSubstringBrute(s: string): number {
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
}`,
        lineByLine: [
          'Line 3: Outer loop selects start of substring.',
          'Line 5-8: Inner loop extends substring, stopping when duplicate is found.'
        ],
        dryRun: [
          { step: 1, state: 's = "abcabcbb"', action: 'i=0: adds a, b, c, stops at a', result: 'maxLen = 3' }
        ],
        complexityDerivation: 'O(N^2) time and O(N) space.'
      },
      {
        name: 'Approach 2: Sliding Window with Hash Set (Optimal)',
        badge: 'Popular / Interview Standard',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(min(N, M))',
        summary: 'Expand right pointer; when duplicate encountered, contract left pointer until unique.',
        intuition: 'Maintain a Set of characters in current window [L, R]. If s[R] is already in the set, contract L rightwards and remove s[L] from the set until s[R] is unique. Window length is R - L + 1.',
        codeJS: `function lengthOfLongestSubstring(s) {
  const charSet = new Set();
  let left = 0;
  let maxLen = 0;
  
  for (let right = 0; right < s.length; right++) {
    // If character already in window, contract left until duplicate removed
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    
    charSet.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  
  return maxLen;
}`,
        codeTS: `function lengthOfLongestSubstring(s: string): number {
  const charSet = new Set<string>();
  let left = 0;
  let maxLen = 0;
  
  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  
  return maxLen;
}`,
        lineByLine: [
          'Line 2: Allocates Hash Set to track characters in active window.',
          'Line 7: Contracts left boundary when duplicate is encountered.',
          'Line 12: Adds new character and records maximum window size.'
        ],
        dryRun: [
          { step: 1, state: 's = "abcabcbb"', action: 'R=0..2: add a, b, c', result: 'window="abc", maxLen=3' },
          { step: 2, state: 'R=3 (\'a\')', action: 'Set has \'a\' -> delete s[L=0](\'a\'), L=1', result: 'window="bca", maxLen=3' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ because each character is added to the set once and deleted from the set at most once ($2N$ operations).
**Space Complexity**: $O(\\min(N, M))$ where $M$ is the size of the character set.`
      }
    ],
    comparisonTable: [
      { approach: 'Brute Force All Substrings', time: 'O(N³)', space: 'O(N)', pros: 'Naive', cons: 'TLE' },
      { approach: 'Sliding Window (Optimal)', time: 'O(N)', space: 'O(min(N, M))', pros: 'Linear time; dynamic window', cons: 'Set operations' }
    ],
    interviewPitch: `"We use a dynamic Sliding Window backed by an ES6 Set. As we advance the right pointer, if the incoming character already exists in our set, we increment the left pointer and delete characters from the set until the duplicate is evicted. Because each character is added and removed at most once, this runs in strictly O(N) time with O(min(N, M)) auxiliary space."`,
    followUps: [{ question: 'Can we optimize left pointer jumps?', answer: 'Yes, store char -> lastSeenIndex in a Map; jump left = Math.max(left, map.get(char) + 1) directly in O(1).' }],
    recallQuiz: {
      question: 'What is the maximum number of times any character is processed in the sliding window approach?',
      options: ['Twice (once when entering on right, once when leaving on left)', 'N times', 'Log N times', 'Once only'],
      correctIndex: 0,
      explanation: 'Every element enters the window at most once via the right pointer and exits at most once via the left pointer ($2N = O(N)$).'
    }
  },

  // ==========================================
  // PROBLEM 23: VALID PARENTHESES (LeetCode #20)
  // ==========================================
  23: {
    id: 23,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    pattern: 'Stack',
    day: 13,
    leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
    summary: 'Determine if an input string of brackets is valid using a LIFO stack.',
    prerequisites: ['Stack LIFO push and pop', 'Matching bracket map'],
    problemStatement: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Examples:
- **Example 1**: \`s = "()"\` $\\to$ \`true\`
- **Example 2**: \`s = "()[]{}"\` $\\to$ \`true\`
- **Example 3**: \`s = "(]"\` $\\to$ \`false\`

### Constraints:
- \`1 <= s.length <= 10^4\`
- \`s\` consists of parentheses only \`'()[]{}'\`.`,
    approaches: [
      {
        name: 'Approach 1: String Replacement Loop (Baseline)',
        badge: 'Baseline / String Replacement',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(N)',
        summary: 'Repeatedly remove adjacent matching pairs "()", "[]", "{}" until no more exist.',
        intuition: 'Valid parentheses reduce to empty string by repeatedly eliminating matched adjacent pairs.',
        codeJS: `function isValidReplace(s) {
  let prevLen = -1;
  while (s.length !== prevLen) {
    prevLen = s.length;
    s = s.replace('()', '').replace('[]', '').replace('{}', '');
  }
  return s.length === 0;
}`,
        codeTS: `function isValidReplace(s: string): boolean {
  let prevLen = -1;
  while (s.length !== prevLen) {
    prevLen = s.length;
    s = s.replace('()', '').replace('[]', '').replace('{}', '');
  }
  return s.length === 0;
}`,
        lineByLine: [
          'Line 3-6: In a loop, replace "()", "[]", "{}" with empty strings.',
          'Line 7: Return true if all brackets collapsed to empty string.'
        ],
        dryRun: [
          { step: 1, state: 's = "()[{}]"', action: 's.replace removes "()" and "{}"', result: 's = "[]" -> s = ""' }
        ],
        complexityDerivation: 'N/2 replacements, each allocating string of length N -> O(N^2) time and O(N) space.'
      },
      {
        name: 'Approach 2: LIFO Stack with Bracket Map (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Push opening brackets onto stack. For closing brackets, pop and verify matching type.',
        intuition: 'The most recently opened bracket must be the first one closed (LIFO). Push open brackets onto a stack. When a closing bracket is encountered, pop the stack top and verify it matches.',
        codeJS: `function isValid(s) {
  if (s.length % 2 !== 0) return false; // Odd length cannot be valid
  
  const stack = [];
  const map = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (const char of s) {
    if (map[char]) {
      // Closing bracket: pop top and verify match
      const top = stack.pop();
      if (top !== map[char]) {
        return false;
      }
    } else {
      // Opening bracket: push to stack
      stack.push(char);
    }
  }
  
  return stack.length === 0;
}`,
        codeTS: `function isValid(s: string): boolean {
  if (s.length % 2 !== 0) return false;
  
  const stack: string[] = [];
  const map: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (const char of s) {
    if (map[char]) {
      const top = stack.pop();
      if (top !== map[char]) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }
  
  return stack.length === 0;
}`,
        lineByLine: [
          'Line 2: Odd length shortcut: brackets must be paired.',
          'Line 5-9: Maps each closing bracket to its expected opening partner.',
          'Line 13-16: For closing bracket, pops top of stack and asserts equality.',
          'Line 22: Returns true only if all open brackets were closed (stack is empty).'
        ],
        dryRun: [
          { step: 1, state: 's = "()[]{}"', action: 'char=\'(\': push', result: 'stack = [\'(\']' },
          { step: 2, state: 'char=\')\'', action: 'pop \'(\', matches map[\')\']', result: 'stack = []' },
          { step: 3, state: 'Finished', action: 'stack.length === 0', result: 'Returns true' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ single pass over the string.
**Space Complexity**: $O(N)$ auxiliary stack space in worst case (e.g. "((((((").`
      }
    ],
    comparisonTable: [
      { approach: 'String replace ("()", "[]", "{}") in loop', time: 'O(N²)', space: 'O(N)', pros: 'Short code', cons: 'Quadratic string copies' },
      { approach: 'LIFO Stack (Optimal)', time: 'O(N)', space: 'O(N)', pros: 'Linear time; early exit', cons: 'None' }
    ],
    interviewPitch: `"We solve Valid Parentheses using a Last-In, First-Out (LIFO) Stack. We iterate through the string: if we see an opening bracket, we push it onto the stack. If we see a closing bracket, we pop the top element from the stack and verify that it matches our expected opener using a hash table. If the stack is empty when closing or the symbols mismatch, we return false. Finally, we return true if the stack is completely empty, running in O(N) time and O(N) space."`,
    followUps: [{ question: 'What if string has non-bracket characters?', answer: 'Simply ignore non-bracket characters and only push/pop when bracket symbols are encountered.' }],
    recallQuiz: {
      question: 'What does a non-empty stack at the end of the algorithm signify?',
      options: ['There are unclosed opening brackets', 'The string was invalid length', 'Memory corruption', 'A syntax error occurred'],
      correctIndex: 0,
      explanation: 'A remaining element in the stack means an opening bracket was never closed (e.g. "(()").'
    }
  },

  // ==========================================
  // PROBLEM 31: BINARY SEARCH (LeetCode #704)
  // ==========================================
  31: {
    id: 31,
    title: 'Binary Search',
    difficulty: 'Easy',
    pattern: 'Binary Search',
    day: 18,
    leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
    summary: 'Search for a target in a sorted integer array in O(log N) runtime.',
    prerequisites: ['Monotonic search space', 'Middle calculation without integer overflow'],
    problemStatement: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with **\`O(log n)\`** runtime complexity.

### Examples:
- **Example 1**: \`nums = [-1,0,3,5,9,12], target = 9\` $\\to$ \`4\`
- **Example 2**: \`nums = [-1,0,3,5,9,12], target = 2\` $\\to$ \`-1\`

### Constraints:
- \`1 <= nums.length <= 10^4\`
- \`-10^4 < nums[i], target < 10^4\`
- All the integers in \`nums\` are **unique**.
- \`nums\` is sorted in ascending order.`,
    approaches: [
      {
        name: 'Approach 1: Linear Scan (Baseline)',
        badge: 'Baseline / Linear Scan',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Iterate through array from left to right until target is found.',
        intuition: 'Inspect each element sequentially without taking advantage of the sorted order.',
        codeJS: `function searchLinear(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}`,
        codeTS: `function searchLinear(nums: number[], target: number): number {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}`,
        lineByLine: [
          'Line 2-4: Iterate over nums and return index when element matches target.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [-1,0,3,5,9,12], target = 9', action: 'Scans indices 0, 1, 2, 3, 4', result: 'Returns 4' }
        ],
        complexityDerivation: 'Single loop over N elements -> O(N) time and O(1) space.'
      },
      {
        name: 'Approach 2: Classic Iterative Binary Search (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        summary: 'Maintain low and high pointers, halving the search range every step.',
        intuition: 'Compute mid. If nums[mid] === target, return mid. If nums[mid] < target, eliminate the left half (low = mid + 1). If nums[mid] > target, eliminate the right half (high = mid - 1).',
        codeJS: `function search(nums, target) {
  let low = 0;
  let high = nums.length - 1;
  
  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    
    if (nums[mid] === target) {
      return mid; // Target found
    } else if (nums[mid] < target) {
      low = mid + 1; // Discard left half
    } else {
      high = mid - 1; // Discard right half
    }
  }
  
  return -1; // Target not present
}`,
        codeTS: `function search(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;
  
  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  
  return -1;
}`,
        lineByLine: [
          'Line 2-3: Boundaries span entire array [0..N-1].',
          'Line 5: Loop runs while search space has at least 1 element.',
          'Line 6: Safe midpoint calculation.',
          'Line 8: Target match returns index immediately.',
          'Line 10-12: Eliminates half of the remaining elements.'
        ],
        dryRun: [
          { step: 1, state: 'nums=[-1,0,3,5,9,12], target=9', action: 'low=0, high=5, mid=2 (nums[2]=3 < 9)', result: 'low = mid + 1 = 3' },
          { step: 2, state: 'low=3, high=5', action: 'mid=4 (nums[4]=9 === 9)', result: 'Target found! Returns 4' }
        ],
        complexityDerivation: `**Time Complexity**: $O(\\log N)$ because the search space of size $N$ is halved in every iteration ($N \\to N/2 \\to N/4 \\to \\dots \\to 1$).
**Space Complexity**: $O(1)$ auxiliary memory using only three index registers.`
      }
    ],
    comparisonTable: [
      { approach: 'Linear Search', time: 'O(N)', space: 'O(1)', pros: 'Works unsorted', cons: 'Violates O(log N) requirement' },
      { approach: 'Binary Search (Optimal)', time: 'O(log N)', space: 'O(1)', pros: 'Ultra fast (~20 ops for 1M items)', cons: 'Requires sorted data' }
    ],
    interviewPitch: `"Binary Search eliminates half the remaining elements with every comparison. We maintain low and high pointers, calculate mid using Math.floor(low + (high - low) / 2), and compare nums[mid] with target. If nums[mid] is smaller, we advance low to mid + 1; if larger, we retreat high to mid - 1. This guarantees finding the target or confirming its absence in O(log N) time with O(1) auxiliary space."`,
    followUps: [{ question: 'Why use low + (high - low) / 2 instead of (low + high) / 2?', answer: 'In languages with 32-bit signed integers (C++, Java), (low + high) can overflow 2^31 - 1 into negative numbers; low + (high - low) / 2 is mathematically equivalent and never overflows.' }],
    recallQuiz: {
      question: 'How many iterations does Binary Search take for an array of 1,000,000 elements in the worst case?',
      options: ['~20 iterations (log2(1,000,000) ≈ 19.93)', '1,000,000 iterations', '500,000 iterations', '1,000 iterations'],
      correctIndex: 0,
      explanation: 'Binary search operates in $\\log_2 N$ steps; $2^{20} = 1,048,576$, so at most 20 iterations occur.'
    }
  },

  // ==========================================
  // PROBLEM 39: REVERSE LINKED LIST (LeetCode #206)
  // ==========================================
  39: {
    id: 39,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    pattern: 'Linked List',
    day: 23,
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    summary: 'Reverse a singly linked list in-place in O(N) time and O(1) space.',
    prerequisites: ['Pointer redirection', 'Retaining next reference before mutation'],
    problemStatement: `Given the \`head\` of a singly linked list, reverse the list, and return **the reversed list**.

### Examples:
- **Example 1**: \`head = [1,2,3,4,5]\` $\\to$ \`[5,4,3,2,1]\`
- **Example 2**: \`head = [1,2]\` $\\to$ \`[2,1]\`
- **Example 3**: \`head = []\` $\\to$ \`[]\`

### Constraints:
- The number of nodes in the list is the range \`[0, 5000]\`.
- \`-5000 <= Node.val <= 5000\``,
    approaches: [
      {
        name: 'Approach 1: Three-Pointer Iterative Reversal (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Iterate through the list using prev, curr, and next pointers, rewiring curr.next = prev in-place.',
        intuition: 'To reverse the direction of a pointer, we must save the next node before overwriting: const nextNode = curr.next. Then point curr.next = prev. Advance prev = curr, and curr = nextNode.',
        codeJS: `function reverseList(head) {
  let prev = null;
  let curr = head;
  
  while (curr !== null) {
    const nextNode = curr.next; // 1. Save next reference
    curr.next = prev;           // 2. Reverse pointer direction
    prev = curr;               // 3. Move prev forward
    curr = nextNode;           // 4. Move curr forward
  }
  
  return prev; // prev is the new head of the reversed list
}`,
        codeTS: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = (val===undefined ? 0 : val);
    this.next = (next===undefined ? null : next);
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  
  while (curr !== null) {
    const nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }
  
  return prev;
}`,
        lineByLine: [
          'Line 2: prev starts as null (tail of reversed list points to null).',
          'Line 6: Saves nextNode so we don\'t lose the rest of the list.',
          'Line 7: Reverses pointer: curr.next points backward to prev.',
          'Line 8-9: Steps prev and curr forward.',
          'Line 12: When curr is null, prev points to the old tail, which is the new head!'
        ],
        dryRun: [
          { step: 1, state: 'List: 1 -> 2 -> null', action: 'curr=1, prev=null: 1.next = null', result: 'prev=1, curr=2' },
          { step: 2, state: 'curr=2, prev=1', action: '2.next = 1', result: 'prev=2, curr=null' },
          { step: 3, state: 'curr === null', action: 'Returns prev = 2', result: 'Reversed: 2 -> 1 -> null' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ single pass visiting each node exactly once.
**Space Complexity**: $O(1)$ auxiliary space rewiring pointers in place.`
      }
    ],
    comparisonTable: [
      { approach: 'Recursive Reversal', time: 'O(N)', space: 'O(N) Call Stack', pros: 'Elegant recursion', cons: 'Risk of call-stack overflow on 5000 nodes' },
      { approach: 'Iterative (Optimal)', time: 'O(N)', space: 'O(1)', pros: 'Zero stack overhead; memory safe', cons: 'Requires pointer state hygiene' }
    ],
    interviewPitch: `"To reverse a singly linked list in-place, we use three pointers: prev initialized to null, curr initialized to head, and nextNode. Inside a while loop, we first save curr.next into nextNode to preserve our reference to the rest of the list. We then reverse the link by setting curr.next = prev. Finally, we advance prev to curr and curr to nextNode. When curr becomes null, prev points to the new head of the reversed list, running in O(N) time with O(1) space."`,
    followUps: [{ question: 'What is the risk of recursive linked list reversal in Node.js?', answer: 'Node.js has a default call stack limit of ~10,000 frames. For long lists, recursion throws RangeError: Maximum call stack size exceeded; iterative reversal is always safer in production.' }],
    recallQuiz: {
      question: 'Why must we store curr.next in a temporary variable before mutating it?',
      options: ['Because setting curr.next = prev severs the reference to the remainder of the list', 'Because of garbage collection errors', 'Because ListNode is frozen', 'To satisfy TypeScript types'],
      correctIndex: 0,
      explanation: 'Once \`curr.next = prev\` executes, the original reference to the rest of the list is lost unless cached in a temporary pointer beforehand.'
    }
  },

  // ==========================================
  // PROBLEM 101: CLIMBING STAIRS (LeetCode #70)
  // ==========================================
  101: {
    id: 101,
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    pattern: 'DP - 1D',
    day: 60,
    leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
    summary: 'Find how many distinct ways you can climb n stairs taking 1 or 2 steps at a time.',
    prerequisites: ['Fibonacci recurrence relation', 'State compression from O(N) to O(1)'],
    problemStatement: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?

### Examples:
- **Example 1**: \`n = 2\` $\\to$ \`2\` (1 step + 1 step, or 2 steps)
- **Example 2**: \`n = 3\` $\\to$ \`3\` (1+1+1, 1+2, 2+1)

### Constraints:
- \`1 <= n <= 45\``,
    approaches: [
      {
        name: 'Approach 1: Bottom-Up Space-Optimized DP (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'State dp[i] = dp[i - 1] + dp[i - 2]. Retain only last two values to achieve O(1) space.',
        intuition: 'To reach step n, you must take a single step from (n - 1) OR a double step from (n - 2). Therefore, ways(n) = ways(n - 1) + ways(n - 2). This is the Fibonacci sequence!',
        codeJS: `function climbStairs(n) {
  if (n <= 2) return n;
  
  let oneStepBefore = 2; // ways for n = 2
  let twoStepsBefore = 1; // ways for n = 1
  let current = 0;
  
  for (let i = 3; i <= n; i++) {
    current = oneStepBefore + twoStepsBefore;
    twoStepsBefore = oneStepBefore;
    oneStepBefore = current;
  }
  
  return current;
}`,
        codeTS: `function climbStairs(n: number): number {
  if (n <= 2) return n;
  
  let oneStepBefore = 2;
  let twoStepsBefore = 1;
  let current = 0;
  
  for (let i = 3; i <= n; i++) {
    current = oneStepBefore + twoStepsBefore;
    twoStepsBefore = oneStepBefore;
    oneStepBefore = current;
  }
  
  return current;
}`,
        lineByLine: [
          'Line 2: Base cases: n=1 has 1 way, n=2 has 2 ways.',
          'Line 4-5: Maintains previous two states in memory.',
          'Line 9: Computes current = (i-1) + (i-2).',
          'Line 10-11: Shifts window forward.'
        ],
        dryRun: [
          { step: 1, state: 'n=4', action: 'i=3: current = 2 + 1 = 3', result: 'twoBefore=2, oneBefore=3' },
          { step: 2, state: 'i=4', action: 'current = 3 + 2 = 5', result: 'Returns 5' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ single loop running from 3 to $N$.
**Space Complexity**: $O(1)$ auxiliary space using two number variables instead of allocating an array of size $N$.`
      }
    ],
    comparisonTable: [
      { approach: 'Naive Recursion', time: 'O(2ⁿ)', space: 'O(N)', pros: 'Mathematical definition', cons: 'Exponential blowup; freezes browser for N > 40' },
      { approach: 'Bottom-Up DP (Optimal)', time: 'O(N)', space: 'O(1)', pros: 'Linear time, zero heap memory', cons: 'None' }
    ],
    interviewPitch: `"Climbing Stairs maps to the Fibonacci recurrence: to reach step n, you can only arrive from step (n - 1) with a 1-step jump or step (n - 2) with a 2-step jump. Thus, ways(n) = ways(n - 1) + ways(n - 2). Rather than using naive recursion which is O(2ⁿ), or allocating an O(N) DP table, we use state compression. We maintain two variables for the previous two steps and iterate iteratively to n. This achieves O(N) runtime with O(1) space."`,
    followUps: [{ question: 'What if you could take 1, 2, or 3 steps at a time?', answer: 'Tribonacci sequence: dp[i] = dp[i-1] + dp[i-2] + dp[i-3], maintained with three rolling variables in O(N) time and O(1) space.' }],
    recallQuiz: {
      question: 'Why does ways(n) equal ways(n - 1) + ways(n - 2)?',
      options: ['Because any valid path to step n must end with either a 1-step jump from n-1 or a 2-step jump from n-2', 'Because stairs are symmetric', 'Because n is an integer', 'Because of dynamic allocation'],
      correctIndex: 0,
      explanation: 'Every distinct way to reach step $n$ has its final step uniquely as either $+1$ from $(n-1)$ or $+2$ from $(n-2)$ with zero overlap.'
    }
  }
};
