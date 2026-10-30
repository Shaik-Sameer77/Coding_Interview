// Day 2-4 Solutions: Hashing & Frequency Counting (Valid Anagram, Two Sum, Group Anagrams, Top K Frequent, Longest Consecutive Sequence, Subarray Sum Equals K)
// Complete Multidisciplinary Solutions with JavaScript, TypeScript, Dry Runs, Line-by-Line explanations, and Spoken Pitches

export const HASHING_SOLUTIONS = {
  // ==========================================
  // PROBLEM 4: VALID ANAGRAM (LeetCode #242)
  // ==========================================
  4: {
    id: 4,
    title: 'Valid Anagram',
    difficulty: 'Easy',
    pattern: 'Hashing',
    day: 2,
    leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
    summary: 'Given two strings s and t, return true if t is an anagram of s (contains same characters with exact same frequencies), and false otherwise.',
    prerequisites: ['Hash Map or Frequency Array', 'ASCII / Unicode character indexing', 'Time vs Space complexity'],
    problemStatement: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an **anagram** of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Examples:
- **Example 1**: \`s = "anagram", t = "nagaram"\` $\\to$ \`true\`
- **Example 2**: \`s = "rat", t = "car"\` $\\to$ \`false\`

### Constraints:
- \`1 <= s.length, t.length <= 5 * 10^4\`
- \`s\` and \`t\` consist of lowercase English letters.`,
    approaches: [
      {
        name: 'Approach 1: Sort and Compare Strings',
        badge: 'Baseline / Sorting',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        summary: 'Sort both strings alphabetically and check if the resulting strings are identical.',
        intuition: 'If two strings contain the exact same characters in identical frequencies, sorting both strings alphabetically will produce identical character sequences.',
        codeJS: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  return s.split('').sort().join('') === t.split('').sort().join('');
}`,
        codeTS: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  return s.split('').sort().join('') === t.split('').sort().join('');
}`,
        lineByLine: [
          'Line 2: "if (s.length !== t.length) return false;" — Anagrams must have identical length.',
          'Line 3: "s.split(\'\').sort().join(\'\')" — Converts string to array of characters, sorts in O(N log N), and joins back to string for comparison.'
        ],
        dryRun: [
          { step: 1, state: 's = "anagram", t = "nagaram"', action: 'Check lengths (7 === 7)', result: 'Pass' },
          { step: 2, state: 'Sort s', action: '"anagram".split("").sort().join("")', result: '"aaagmnr"' },
          { step: 3, state: 'Sort t', action: '"nagaram".split("").sort().join("")', result: '"aaagmnr"' },
          { step: 4, state: 'Compare strings', action: '"aaagmnr" === "aaagmnr"', result: 'Returns true' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N \\log N)$ dominated by Timsort on arrays of length $N$.
**Space Complexity**: $O(N)$ auxiliary memory to create character arrays and joined string copies.`
      },
      {
        name: 'Approach 2: Character Frequency Array (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) [Fixed 26 Buckets]',
        summary: 'Use a fixed 26-element array to increment counts for s and decrement for t in a single pass.',
        intuition: 'Since strings consist strictly of lowercase English letters (\'a\'-\'z\'), a fixed 26-integer array serves as an ultra-fast hash table. Increment frequency for characters in s and decrement for t. If all counts return to 0, the strings are anagrams.',
        codeJS: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  
  // 26 buckets for 'a' through 'z'
  const count = new Array(26).fill(0);
  const codeA = 'a'.charCodeAt(0);
  
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - codeA]++;
    count[t.charCodeAt(i) - codeA]--;
  }
  
  // Verify all counts returned to zero
  for (let i = 0; i < 26; i++) {
    if (count[i] !== 0) return false;
  }
  
  return true;
}`,
        codeTS: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  
  const count: number[] = new Array(26).fill(0);
  const codeA = 'a'.charCodeAt(0);
  
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - codeA]++;
    count[t.charCodeAt(i) - codeA]--;
  }
  
  for (let i = 0; i < 26; i++) {
    if (count[i] !== 0) return false;
  }
  
  return true;
}`,
        lineByLine: [
          'Line 2: Length check: anagrams must have identical length.',
          'Line 5: "const count = new Array(26).fill(0);" — Allocates fixed 26 integer slots.',
          'Line 9: "count[s.charCodeAt(i) - codeA]++" — Increments count for char in s.',
          'Line 10: "count[t.charCodeAt(i) - codeA]--" — Decrements count for char in t.',
          'Line 14: Verifies all buckets are exactly 0 in O(26) = O(1) time.'
        ],
        dryRun: [
          { step: 1, state: 's = "rat", t = "car"', action: 'Length check (3 === 3)', result: 'Pass' },
          { step: 2, state: 'i=0', action: 's[0]=\'r\' (+1), t[0]=\'c\' (-1)', result: 'count[r]=1, count[c]=-1' },
          { step: 3, state: 'i=1', action: 's[1]=\'a\' (+1), t[1]=\'a\' (-1)', result: 'count[a]=0' },
          { step: 4, state: 'i=2', action: 's[2]=\'t\' (+1), t[2]=\'r\' (-1)', result: 'count[t]=1, count[r]=0' },
          { step: 5, state: 'Final check', action: 'count[c] is -1 !== 0', result: 'Returns false' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ where $N$ is string length. One pass over $N$ characters, followed by a constant 26-step verification loop.
**Space Complexity**: $O(1)$ auxiliary memory because the 26-element array is constant and independent of $N$.`
      }
    ],
    comparisonTable: [
      { approach: 'Sort & Compare', time: 'O(N log N)', space: 'O(N)', pros: 'One line of code', cons: 'High latency; allocates 2 full arrays' },
      { approach: 'Frequency Array (Optimal)', time: 'O(N)', space: 'O(1)', pros: 'Optimal linear speed; zero allocation scaling', cons: 'Requires fixed character set (ASCII)' }
    ],
    interviewPitch: `"To determine if two strings are anagrams, the baseline approach is sorting both strings in O(N log N) time and checking equality. However, the optimal production approach uses a 26-bucket frequency counter. In a single linear pass of O(N) time, we increment character frequencies for s and decrement for t. Since all character counts must return to zero, this runs in O(N) time with O(1) auxiliary memory."`,
    followUps: [
      {
        question: 'What if the inputs contain Unicode characters (e.g. emojis or accents)?',
        answer: 'Instead of a fixed 26-element array, use an ES6 Map<string, number> to track dynamic Unicode code point frequencies, maintaining O(N) time with O(U) space where U is distinct Unicode characters.'
      }
    ],
    recallQuiz: {
      question: 'Why is the frequency array approach O(1) space complexity?',
      options: [
        'Because the array length is fixed at 26 regardless of how long the input string N is',
        'Because JavaScript garbage collects the array automatically',
        'Because it mutates the input strings in place',
        'Because it uses tail-call recursion'
      ],
      correctIndex: 0,
      explanation: 'The 26-slot array size is constant ($O(26) = O(1)$) and does not grow with the input length $N$.'
    }
  },

  // ==========================================
  // PROBLEM 5: TWO SUM (LeetCode #1)
  // ==========================================
  5: {
    id: 5,
    title: 'Two Sum',
    difficulty: 'Easy',
    pattern: 'Hashing',
    day: 2,
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    summary: 'Given an array of integers and an integer target, return indices of the two numbers such that they add up to target.',
    prerequisites: ['Hash Map key-value lookups', 'Mathematical complement calculation', 'Array indexing'],
    problemStatement: `Given an array of integers \`nums\` and an integer \`target\`, return **indices of the two numbers** such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice. You can return the answer in any order.

### Examples:
- **Example 1**: \`nums = [2, 7, 11, 15], target = 9\` $\\to$ \`[0, 1]\` (nums[0] + nums[1] == 9)
- **Example 2**: \`nums = [3, 2, 4], target = 6\` $\\to$ \`[1, 2]\`
- **Example 3**: \`nums = [3, 3], target = 6\` $\\to$ \`[0, 1]\`

### Constraints:
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- **Only one valid answer exists.**`,
    approaches: [
      {
        name: 'Approach 1: Brute Force Nested Loops',
        badge: 'Baseline / Brute Force',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        summary: 'Check every possible pair of elements with two nested loops until their sum equals target.',
        intuition: 'Loop through every index i, and for each i, loop through all subsequent indices j > i to test if nums[i] + nums[j] === target.',
        codeJS: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`,
        codeTS: `function twoSum(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`,
        lineByLine: [
          'Line 2: Outer loop selects first number index i.',
          'Line 3: Inner loop starts at i + 1 to test second number index j without reusing elements.',
          'Line 4: If sum matches target, return indices pair immediately.'
        ],
        dryRun: [
          { step: 1, state: 'nums=[2, 7, 11, 15], target=9', action: 'i=0, j=1: 2 + 7 === 9', result: 'Match found! Returns [0, 1]' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N^2)$ because we check $\\frac{N(N-1)}{2}$ pairs in the worst case.
**Space Complexity**: $O(1)$ auxiliary memory.`
      },
      {
        name: 'Approach 2: One-Pass Hash Map (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Store visited elements in a Hash Map (value -> index) and query the complement in O(1) time.',
        intuition: `For every number x, we know the exact number we need to reach the target: complement = target - x. By storing visited numbers in a Hash Map, we can check whether the complement was already seen in average O(1) time during a single pass!`,
        codeJS: `function twoSum(nums, target) {
  const map = new Map(); // value -> index
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    // Check if the required complement has already been seen
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    // Store current element and its index
    map.set(nums[i], i);
  }
  
  return [];
}`,
        codeTS: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,
        lineByLine: [
          'Line 2: "const map = new Map();" — Allocates hash map to record value-to-index pairs.',
          'Line 5: "const complement = target - nums[i];" — Derives required partner value.',
          'Line 8: "if (map.has(complement))" — O(1) hash lookup to check if partner was previously visited.',
          'Line 9: "return [map.get(complement), i];" — Returns index of complement and current index.',
          'Line 13: "map.set(nums[i], i);" — Caches current number for future elements.'
        ],
        dryRun: [
          { step: 1, state: 'i=0, num=2', action: 'comp = 9 - 2 = 7. map.has(7)? No.', result: 'map.set(2, 0)' },
          { step: 2, state: 'i=1, num=7', action: 'comp = 9 - 7 = 2. map.has(2)? YES!', result: 'Returns [map.get(2), 1] = [0, 1]' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ because the array is traversed once, and each Hash Map \`has\` and \`get\` operation runs in average $O(1)$ time.
**Space Complexity**: $O(N)$ auxiliary memory to store at most $N$ key-value pairs in the Map.`
      }
    ],
    comparisonTable: [
      { approach: 'Brute Force', time: 'O(N²)', space: 'O(1)', pros: 'Simple, zero extra memory', cons: 'Quadratic latency; TLE on large arrays' },
      { approach: 'One-Pass Hash Map (Optimal)', time: 'O(N)', space: 'O(N)', pros: 'Single pass; O(1) lookups; optimal latency', cons: 'Requires O(N) auxiliary memory' }
    ],
    interviewPitch: `"To solve Two Sum, the brute-force baseline compares every pair with nested loops in O(N²) time. We can optimize this by trading O(N) space for O(N) time using a Hash Map. As we iterate through nums, we calculate the required complement: target - nums[i]. We query the Hash Map to see if that complement was already observed. If yes, we return its index and our current index immediately. If not, we record nums[i] and its index in the map. This achieves optimal O(N) time in a single pass."`,
    followUps: [
      {
        question: 'What if the array is already sorted?',
        answer: 'If the array is sorted, we can use the Two Pointers technique (one at index 0, one at index N-1) to achieve O(N) time with O(1) auxiliary space, eliminating the Hash Map completely (Two Sum II).'
      }
    ],
    recallQuiz: {
      question: 'Why do we store elements in the Hash Map as we iterate, rather than pre-populating all elements first?',
      options: [
        'A single pass handles duplicate values automatically and avoids using the same index twice',
        'JavaScript Maps cannot hold more than 100 elements at once',
        'Pre-populating the map causes an infinite loop',
        'Single pass reduces time complexity to O(log N)'
      ],
      correctIndex: 0,
      explanation: 'One pass naturally prevents an element from pairing with itself (e.g. nums=[3, 3], target=6) and handles duplicate values cleanly.'
    }
  },

  // ==========================================
  // PROBLEM 6: GROUP ANAGRAMS (LeetCode #49)
  // ==========================================
  6: {
    id: 6,
    title: 'Group Anagrams',
    difficulty: 'Medium',
    pattern: 'Hashing',
    day: 2,
    leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/',
    summary: 'Given an array of strings, group the anagrams together in any order.',
    prerequisites: ['Hash Map with array values', 'String canonicalization (sorting vs frequency tuple)', 'Array grouping'],
    problemStatement: `Given an array of strings \`strs\`, group **the anagrams** together. You can return the answer in **any order**.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Examples:
- **Example 1**: \`strs = ["eat","tea","tan","ate","nat","bat"]\`
  $\\to$ \`[["bat"],["nat","tan"],["ate","eat","tea"]]\`
- **Example 2**: \`strs = [""]\` $\\to$ \`[[""]]\`
- **Example 3**: \`strs = ["a"]\` $\\to$ \`[["a"]]\`

### Constraints:
- \`1 <= strs.length <= 10^4\`
- \`0 <= strs[i].length <= 100\`
- \`strs[i]\` consists of lowercase English letters.`,
    approaches: [
      {
        name: 'Approach 1: Sorted String as Hash Map Key',
        badge: 'Popular / Interview Standard',
        timeComplexity: 'O(N * K log K)',
        spaceComplexity: 'O(N * K)',
        summary: 'Sort each word alphabetically to create a canonical key, and group words in a Hash Map.',
        intuition: 'Two strings are anagrams if and only if their sorted strings are identical. If we sort "eat", "tea", and "ate", all three produce the canonical key "aet". We map this key to an array of matching original words.',
        codeJS: `function groupAnagrams(strs) {
  const map = new Map();
  
  for (const s of strs) {
    // Generate canonical sorted key
    const key = s.split('').sort().join('');
    
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(s);
  }
  
  return Array.from(map.values());
}`,
        codeTS: `function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(s);
  }
  
  return Array.from(map.values());
}`,
        lineByLine: [
          'Line 2: Allocates Hash Map mapping canonical string -> array of words.',
          'Line 5: "s.split(\'\').sort().join(\'\')" — Normalizes word to sorted key in O(K log K).',
          'Line 7: If key not in map, initialize empty list.',
          'Line 10: Appends original word to its anagram bucket.',
          'Line 13: Returns grouped arrays as string[][].'
        ],
        dryRun: [
          { step: 1, state: 's = "eat"', action: 'key = "aet"', result: 'map = {"aet": ["eat"]}' },
          { step: 2, state: 's = "tea"', action: 'key = "aet"', result: 'map = {"aet": ["eat", "tea"]}' },
          { step: 3, state: 's = "tan"', action: 'key = "ant"', result: 'map = {"aet": ["eat", "tea"], "ant": ["tan"]}' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N \\cdot K \\log K)$ where $N$ is number of strings and $K$ is maximum length of a string. Sorting each string takes $O(K \\log K)$.
**Space Complexity**: $O(N \\cdot K)$ to store all characters inside the Hash Map.`
      },
      {
        name: 'Approach 2: Character Count Hash Key (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N * K)',
        spaceComplexity: 'O(N * K)',
        summary: 'Generate a 26-element character count string delimiter (e.g. #1#0#0...) as the map key without sorting.',
        intuition: 'Instead of sorting in $O(K \\log K)$, count the frequency of each of the 26 letters in $O(K)$ time. Construct a delimited string representing counts (e.g. "1#0#0#...#1") to serve as the map key in strictly linear time!',
        codeJS: `function groupAnagrams(strs) {
  const map = new Map();
  const codeA = 'a'.charCodeAt(0);
  
  for (const s of strs) {
    const count = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
      count[s.charCodeAt(i) - codeA]++;
    }
    // Delimited key: avoids ambiguity
    const key = count.join('#');
    
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(s);
  }
  
  return Array.from(map.values());
}`,
        codeTS: `function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  const codeA = 'a'.charCodeAt(0);
  
  for (const s of strs) {
    const count = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
      count[s.charCodeAt(i) - codeA]++;
    }
    const key = count.join('#');
    
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(s);
  }
  
  return Array.from(map.values());
}`,
        lineByLine: [
          'Line 6: Allocates 26-count array per word.',
          'Line 8: Increments character frequency in O(K) time.',
          'Line 11: "count.join(\'#\')" — Joins into unique fingerprint string.',
          'Line 16: Groups words matching the fingerprint.'
        ],
        dryRun: [
          { step: 1, state: 's = "eat"', action: 'Count: a:1, e:1, t:1', result: 'key = "1#0#0#0#1...#1"' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N \\cdot K)$ because counting characters takes $O(K)$ per string, eliminating the $\\log K$ sorting factor.
**Space Complexity**: $O(N \\cdot K)$ to store words in the Hash Map.`
      }
    ],
    comparisonTable: [
      { approach: 'Sorted Key', time: 'O(N * K log K)', space: 'O(N * K)', pros: 'Intuitive; clean implementation', cons: 'Sorting adds logarithmic overhead' },
      { approach: 'Count Fingerprint', time: 'O(N * K)', space: 'O(N * K)', pros: 'Strictly linear time; optimal asymptotic', cons: 'String fingerprint creation overhead' }
    ],
    interviewPitch: `"To group anagrams, we need a canonical signature that is identical for any anagram permutation. In the standard approach, we sort each string in O(K log K) time to create a key like 'aet'. Words sharing the same key are pushed into an array bucket in an ES6 Map. In production, if strings are very long, we can optimize this to O(N * K) by building a 26-bucket character frequency fingerprint string as the map key, completely eliminating the sorting overhead."`,
    followUps: [
      {
        question: 'Why is the delimiter \'#\' necessary when joining counts?',
        answer: 'Without a delimiter, a count array like [1, 11] and [11, 1] would both serialize to "111", creating false collisions between unrelated words.'
      }
    ],
    recallQuiz: {
      question: 'What is the time complexity of the character frequency fingerprint approach?',
      options: [
        'O(N * K) where N is number of strings and K is maximum string length',
        'O(N²)',
        'O(N log N)',
        'O(K²)'
      ],
      correctIndex: 0,
      explanation: 'Iterating through each string of length K takes O(K), multiplied across N strings, giving O(N * K).'
    }
  },

  // ==========================================
  // PROBLEM 7: TOP K FREQUENT ELEMENTS (LeetCode #347)
  // ==========================================
  7: {
    id: 7,
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    pattern: 'Hashing',
    day: 3,
    leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/',
    summary: 'Given an integer array nums and an integer k, return the k most frequent elements in any order.',
    prerequisites: ['Frequency map', 'Bucket sort algorithm', 'Min-Heap data structure'],
    problemStatement: `Given an integer array \`nums\` and an integer \`k\`, return **the \`k\` most frequent elements**. You may return the answer in **any order**.

### Examples:
- **Example 1**: \`nums = [1,1,1,2,2,3], k = 2\` $\\to$ \`[1, 2]\`
- **Example 2**: \`nums = [1], k = 1\` $\\to$ \`[1]\`

### Constraints:
- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\`
- \`k\` is in the range \`[1, the number of unique elements in the array]\`.
- **It is guaranteed that the answer is unique.**`,
    approaches: [
      {
        name: 'Approach 1: Frequency Map + Sort',
        badge: 'Baseline / Sorting',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        summary: 'Count frequencies in a map, convert entries to an array, and sort by frequency descending.',
        intuition: 'Count the frequency of each element in a hash map. Sort unique elements by their frequency in descending order, then slice the first k elements.',
        codeJS: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) {
    freq.set(n, (freq.get(n) || 0) + 1);
  }
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(entry => entry[0]);
}`,
        codeTS: `function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) {
    freq.set(n, (freq.get(n) || 0) + 1);
  }
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(entry => entry[0]);
}`,
        lineByLine: [
          'Line 2: Allocates frequency map.',
          'Line 6: Sorts unique entries by frequency descending in O(U log U).',
          'Line 7: Slices top k entries.'
        ],
        dryRun: [
          { step: 1, state: 'nums=[1,1,1,2,2,3]', action: 'Count frequencies', result: '{1: 3, 2: 2, 3: 1}' },
          { step: 2, state: 'Sort entries', action: 'Sort by count desc', result: '[[1, 3], [2, 2], [3, 1]]' },
          { step: 3, state: 'Slice k=2', action: 'Extract first 2 keys', result: '[1, 2]' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N + U \\log U)$ where $U$ is number of unique elements ($U \\le N$).
**Space Complexity**: $O(N)$ to store frequencies.`
      },
      {
        name: 'Approach 2: Bucket Sort (Optimal O(N))',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Use frequency as index in a bucket array (bucket[freq] = [nums]) to extract top k in linear time.',
        intuition: 'Notice an element cannot appear more than N times. We can create an array of buckets from index 0 to N where bucket[f] holds all numbers that appeared exactly f times. Traversing backwards from bucket N to 0 yields the most frequent elements in strictly linear time without sorting!',
        codeJS: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) {
    freq.set(n, (freq.get(n) || 0) + 1);
  }
  
  // buckets[f] contains list of numbers with frequency f
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq.entries()) {
    buckets[count].push(num);
  }
  
  const res = [];
  // Traverse backwards from highest possible frequency
  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {
    if (buckets[i].length > 0) {
      for (const num of buckets[i]) {
        res.push(num);
        if (res.length === k) break;
      }
    }
  }
  
  return res;
}`,
        codeTS: `function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) {
    freq.set(n, (freq.get(n) || 0) + 1);
  }
  
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq.entries()) {
    buckets[count].push(num);
  }
  
  const res: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {
    if (buckets[i].length > 0) {
      for (const num of buckets[i]) {
        res.push(num);
        if (res.length === k) break;
      }
    }
  }
  
  return res;
}`,
        lineByLine: [
          'Line 2: Counts frequency of every number in O(N).',
          'Line 8: Allocates bucket array of length N + 1.',
          'Line 9: Places each number into bucket corresponding to its frequency.',
          'Line 15: Scans backwards from highest frequency bucket, accumulating top k elements.'
        ],
        dryRun: [
          { step: 1, state: 'freq = {1: 3, 2: 2, 3: 1}', action: 'Fill buckets', result: 'buckets[3]=[1], buckets[2]=[2], buckets[1]=[3]' },
          { step: 2, state: 'Backwards scan i=3', action: 'Push bucket[3]', result: 'res = [1]' },
          { step: 3, state: 'Backwards scan i=2', action: 'Push bucket[2]', result: 'res = [1, 2] (k reached!)' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ strictly linear because counting is $O(N)$, bucket placement is $O(N)$, and backward extraction visits each unique number once until $k$ is met.
**Space Complexity**: $O(N)$ to allocate frequency map and bucket arrays.`
      }
    ],
    comparisonTable: [
      { approach: 'Sort by Frequency', time: 'O(N log N)', space: 'O(N)', pros: 'Quick to write', cons: 'Suboptimal on large arrays' },
      { approach: 'Min-Heap (Size K)', time: 'O(N log K)', space: 'O(N)', pros: 'Streaming friendly', cons: 'Heap implementation needed in JS' },
      { approach: 'Bucket Sort (Optimal)', time: 'O(N)', space: 'O(N)', pros: 'Optimal linear time; no heap needed', cons: 'Allocates N+1 bucket lists' }
    ],
    interviewPitch: `"The naive approach counts frequencies and sorts unique entries in O(N log N). A better approach uses a Min-Heap of size K in O(N log K). However, because frequency cannot exceed N, we can achieve optimal O(N) linear time using Bucket Sort. We count frequencies in a map, and create an array where index f represents frequency f. We place numbers into their frequency bucket and scan backwards from bucket N down to 0, gathering the top K elements in guaranteed O(N) time."`,
    followUps: [
      {
        question: 'What if data arrives as an infinite stream where N is unknown?',
        answer: 'In streaming contexts, Bucket Sort cannot be sized in advance; a Min-Heap of size K is preferred, maintaining the current top K elements in O(log K) per incoming item.'
      }
    ],
    recallQuiz: {
      question: 'Why is the bucket array in Bucket Sort sized to nums.length + 1?',
      options: [
        'Because the maximum possible frequency of any element is nums.length (when all elements are identical)',
        'To prevent index out of bounds when k is negative',
        'To account for 0-indexed Unicode character values',
        'It is an arbitrary size heuristic'
      ],
      correctIndex: 0,
      explanation: 'If all elements in nums are identical, the frequency is $N$. Index $N$ must exist, so the array requires length $N + 1$.'
    }
  },

  // ==========================================
  // PROBLEM 8: LONGEST CONSECUTIVE SEQUENCE (LeetCode #128)
  // ==========================================
  8: {
    id: 8,
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    pattern: 'Hashing',
    day: 3,
    leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/',
    summary: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(N) time.',
    prerequisites: ['Hash Set O(1) membership check', 'Sequence head identification', 'Avoiding repeated work'],
    problemStatement: `Given an unsorted array of integers \`nums\`, return **the length of the longest consecutive elements sequence**.

You must write an algorithm that runs in **\`O(n)\`** time.

### Examples:
- **Example 1**: \`nums = [100, 4, 200, 1, 3, 2]\` $\\to$ \`4\` (Longest sequence: \`[1, 2, 3, 4]\`)
- **Example 2**: \`nums = [0,3,7,2,5,8,4,6,0,1]\` $\\to$ \`9\`

### Constraints:
- \`0 <= nums.length <= 10^5\`
- \`-10^9 <= nums[i] <= 10^9\``,
    approaches: [
      {
        name: 'Approach 1: Sort and Linear Scan',
        badge: 'Baseline / Sorting',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(1) or O(N)',
        summary: 'Sort the array first, skip duplicates, and count consecutive runs.',
        intuition: 'Sorting orders all numbers. Scan through adjacent elements; if nums[i] === nums[i - 1] + 1, streak increments. If identical, continue. Otherwise reset streak.',
        codeJS: `function longestConsecutive(nums) {
  if (nums.length === 0) return 0;
  
  nums.sort((a, b) => a - b);
  let longest = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) continue; // Skip duplicate
    
    if (nums[i] === nums[i - 1] + 1) {
      currentStreak++;
    } else {
      longest = Math.max(longest, currentStreak);
      currentStreak = 1;
    }
  }
  
  return Math.max(longest, currentStreak);
}`,
        codeTS: `function longestConsecutive(nums: number[]): boolean | number {
  if (nums.length === 0) return 0;
  
  nums.sort((a, b) => a - b);
  let longest = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) continue;
    
    if (nums[i] === nums[i - 1] + 1) {
      currentStreak++;
    } else {
      longest = Math.max(longest, currentStreak);
      currentStreak = 1;
    }
  }
  
  return Math.max(longest, currentStreak);
}`,
        lineByLine: [
          'Line 4: Sorts array numerically in O(N log N).',
          'Line 9: Skips duplicates without breaking streak.',
          'Line 11: Increments streak on consecutive neighbor.'
        ],
        dryRun: [
          { step: 1, state: 'nums=[100,4,200,1,3,2]', action: 'Sort', result: '[1, 2, 3, 4, 100, 200]' },
          { step: 2, state: 'Scan 1, 2, 3, 4', action: 'Consecutive run', result: 'streak = 4' },
          { step: 3, state: 'Scan 100', action: 'Gap detected', result: 'longest = 4, streak resets to 1' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N \\log N)$ dominated by sorting. Note: LeetCode specifically requires $O(N)$ time, so this approach violates interview constraints!
**Space Complexity**: $O(1)$ auxiliary memory if sorted in-place.`
      },
      {
        name: 'Approach 2: Hash Set Sequence Head (Optimal O(N))',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Put numbers in a Set. Only start counting a sequence if num - 1 is NOT in the set.',
        intuition: `To achieve strict O(N) time without sorting, put all numbers into a Hash Set. 
We only start counting consecutive numbers from the START of a sequence. How do we know if 'x' is the start of a sequence? If 'x - 1' is NOT in the set!
If 'x - 1' is present, we skip x because a longer or equal sequence will be explored starting from the true head. Each number is visited at most twice!`,
        codeJS: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let longest = 0;
  
  for (const num of set) {
    // Only start counting if 'num' is the beginning of a sequence
    if (!set.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;
      
      // Expand sequence forward
      while (set.has(currentNum + 1)) {
        currentNum++;
        currentStreak++;
      }
      
      longest = Math.max(longest, currentStreak);
    }
  }
  
  return longest;
}`,
        codeTS: `function longestConsecutive(nums: number[]): number {
  const set = new Set<number>(nums);
  let longest = 0;
  
  for (const num of set) {
    if (!set.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;
      
      while (set.has(currentNum + 1)) {
        currentNum++;
        currentStreak++;
      }
      
      longest = Math.max(longest, currentStreak);
    }
  }
  
  return longest;
}`,
        lineByLine: [
          'Line 2: "const set = new Set(nums);" — Builds hash set in O(N) time with unique elements.',
          'Line 6: "if (!set.has(num - 1))" — CRITICAL: Only explores if num is a sequence head.',
          'Line 11: "while (set.has(currentNum + 1))" — Steps forward through contiguous sequence in O(1) set queries.',
          'Line 16: Updates maximum streak found.'
        ],
        dryRun: [
          { step: 1, state: 'set = {100, 4, 200, 1, 3, 2}', action: 'num=100. set.has(99)? False (Head!)', result: '100+1=101 not in set. Streak = 1' },
          { step: 2, state: 'num=4', action: 'set.has(3)? True (Not a head!)', result: 'Skip immediately! (Avoids O(N²) repeated scan)' },
          { step: 3, state: 'num=1', action: 'set.has(0)? False (Head!)', result: 'Explores 1->2->3->4. Streak = 4. longest = 4' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ strictly linear! While there is an inner while loop, the \`!set.has(num - 1)\` condition ensures each element is only visited inside the while loop if it is part of a streak starting from a head. Each number is checked at most twice ($2N$ operations).
**Space Complexity**: $O(N)$ auxiliary memory to store elements in the Hash Set.`
      }
    ],
    comparisonTable: [
      { approach: 'Sorting Scan', time: 'O(N log N)', space: 'O(1)', pros: 'Simple', cons: 'Violates LeetCode O(N) constraint' },
      { approach: 'Hash Set Sequence Head (Optimal)', time: 'O(N)', space: 'O(N)', pros: 'Guaranteed O(N) time; elegant sequence pruning', cons: 'Requires O(N) auxiliary space' }
    ],
    interviewPitch: `"Sorting the array takes O(N log N) which violates the problem's O(N) requirement. We can achieve guaranteed O(N) linear time using a Hash Set. The key optimization is identifying the sequence head: a number x is only the start of a sequence if (x - 1) is NOT in the set. If (x - 1) is present, we skip x because it will be processed when traversing from its head. This simple check guarantees that every element is traversed at most twice, achieving true O(N) runtime."`,
    followUps: [
      {
        question: 'Why does the nested while loop NOT cause O(N²) worst-case runtime?',
        answer: 'Because the inner while loop only executes for sequence heads. Non-head numbers are skipped in O(1). The total number of while loop iterations across all heads cannot exceed N, so total work is strictly O(N).'
      }
    ],
    recallQuiz: {
      question: 'What is the condition that guarantees O(N) runtime in Longest Consecutive Sequence?',
      options: [
        'Checking !set.has(num - 1) before starting the while loop',
        'Sorting the set before iteration',
        'Using a recursive DFS helper',
        'Checking set.size > 0'
      ],
      correctIndex: 0,
      explanation: 'Checking that $(num - 1)$ does not exist guarantees we only explore numbers that are the absolute beginning of a consecutive sequence.'
    }
  }
};
