// Day 5-8 Solutions: Two Pointers (Valid Palindrome, Two Sum II, 3Sum, Container With Most Water, Trapping Rain Water)
// Complete Multidisciplinary Solutions with JavaScript, TypeScript, Dry Runs, Line-by-Line explanations, and Spoken Pitches

export const TWO_POINTERS_SOLUTIONS = {
  // ==========================================
  // PROBLEM 10: VALID PALINDROME (LeetCode #125)
  // ==========================================
  10: {
    id: 10,
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    pattern: 'Two Pointers',
    day: 5,
    leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
    summary: 'Determine if a string is a palindrome, considering only alphanumeric characters and ignoring cases.',
    prerequisites: ['Two Pointers convergence', 'Alphanumeric character validation', 'In-place scanning without extra memory'],
    problemStatement: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a **palindrome**, or \`false\` otherwise.

### Examples:
- **Example 1**: \`s = "A man, a plan, a canal: Panama"\` $\\to$ \`true\` ("amanaplanacanalpanama")
- **Example 2**: \`s = "race a car"\` $\\to$ \`false\` ("raceacar" is not a palindrome)
- **Example 3**: \`s = " "\` $\\to$ \`true\` (empty string reads same forward and backward)

### Constraints:
- \`1 <= s.length <= 2 * 10^5\`
- \`s\` consists only of printable ASCII characters.`,
    approaches: [
      {
        name: 'Approach 1: Regex Replace, Reverse & Compare',
        badge: 'Baseline / Built-in',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Filter string with regex /[^a-z0-9]/g, reverse it, and compare.',
        intuition: 'Sanitize the string to lowercase alphanumeric characters, reverse it into a new string, and check equality.',
        codeJS: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const reversed = clean.split('').reverse().join('');
  return clean === reversed;
}`,
        codeTS: `function isPalindrome(s: string): boolean {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const reversed = clean.split('').reverse().join('');
  return clean === reversed;
}`,
        lineByLine: [
          'Line 2: Strips non-alphanumeric characters and converts to lowercase.',
          'Line 3: Allocates reversed string copy.',
          'Line 4: Compares clean string with reversed string.'
        ],
        dryRun: [
          { step: 1, state: 's = "race a car"', action: 'clean = "raceacar"', result: 'reversed = "racaecar"' },
          { step: 2, state: 'clean === reversed', action: '"raceacar" === "racaecar"', result: 'Returns false' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ for regex sanitization, array splitting, reversing, and joining.
**Space Complexity**: $O(N)$ auxiliary memory allocated for regex cleaned string and reversed copy.`
      },
      {
        name: 'Approach 2: Two Pointers In-Place (Optimal O(1) Space)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Scan from left and right inward, skipping non-alphanumeric characters without allocating extra strings.',
        intuition: `Place pointer L at index 0 and pointer R at index N-1. While L < R, advance L forward past non-alphanumeric characters, and retreat R backward past non-alphanumeric characters. When both point to valid characters, compare them. If they ever disagree, return false immediately. This uses zero extra memory!`,
        codeJS: `function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  
  const isAlphaNumeric = (char) => {
    const code = char.charCodeAt(0);
    return (code >= 48 && code <= 57) || // 0-9
           (code >= 65 && code <= 90) || // A-Z
           (code >= 97 && code <= 122);  // a-z
  };
  
  while (left < right) {
    // Skip non-alphanumeric from left
    while (left < right && !isAlphaNumeric(s[left])) {
      left++;
    }
    // Skip non-alphanumeric from right
    while (left < right && !isAlphaNumeric(s[right])) {
      right--;
    }
    
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    
    left++;
    right--;
  }
  
  return true;
}`,
        codeTS: `function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  
  const isAlphaNumeric = (char: string): boolean => {
    const code = char.charCodeAt(0);
    return (code >= 48 && code <= 57) ||
           (code >= 65 && code <= 90) ||
           (code >= 97 && code <= 122);
  };
  
  while (left < right) {
    while (left < right && !isAlphaNumeric(s[left])) {
      left++;
    }
    while (left < right && !isAlphaNumeric(s[right])) {
      right--;
    }
    
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    
    left++;
    right--;
  }
  
  return true;
}`,
        lineByLine: [
          'Line 2-3: Initializes left=0, right=s.length-1.',
          'Line 5-10: Helper testing ASCII ranges for [0-9, A-Z, a-z] without regex overhead.',
          'Line 13-19: Skips spaces and punctuation from left and right boundaries.',
          'Line 21: Case-insensitive character comparison. Mismatch returns false early.',
          'Line 25-26: Advances pointers inward.'
        ],
        dryRun: [
          { step: 1, state: 's = "A man, a plan, a canal: Panama"', action: 'L=0 (\'A\'), R=30 (\'a\')', result: '\'a\' === \'a\', advance' },
          { step: 2, state: 'L=1 (\' \'), R=29 (\'m\')', action: 'L skips space to L=2 (\'m\')', result: '\'m\' === \'m\', advance' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ single pass over the string with at most $N$ pointer steps.
**Space Complexity**: $O(1)$ auxiliary space because no new strings or arrays are created.`
      }
    ],
    comparisonTable: [
      { approach: 'Regex & Reverse', time: 'O(N)', space: 'O(N)', pros: 'Quick to implement', cons: 'Allocates multiple large string buffers' },
      { approach: 'Two Pointers (Optimal)', time: 'O(N)', space: 'O(1)', pros: 'Zero memory allocations; early exit on mismatch', cons: 'Requires ASCII boundary helper' }
    ],
    interviewPitch: `"To check if a string is a valid palindrome, the simple baseline sanitizes the string with regex and reverses it in O(N) space. However, the optimal production approach uses Two Pointers converging inward from both ends. We advance the left pointer past punctuation and retreat the right pointer past punctuation, comparing characters in place. This guarantees strictly O(N) time with O(1) auxiliary memory and exits early on the first mismatch."`,
    followUps: [
      {
        question: 'Why avoid regex in high-throughput production paths?',
        answer: 'Regex compilation and string copying allocate substantial garbage collection pressure on the V8 heap; ASCII integer comparisons execute in single CPU instructions.'
      }
    ],
    recallQuiz: {
      question: 'What is the primary advantage of the Two Pointers approach over the Regex Reverse approach?',
      options: [
        'It achieves O(1) auxiliary space by comparing characters in-place without allocating copies',
        'It reduces time complexity to O(log N)',
        'It works only for uppercase letters',
        'It automatically handles Unicode emoji surrogate pairs'
      ],
      correctIndex: 0,
      explanation: 'The Two Pointers approach avoids allocating new strings or arrays on the heap, maintaining $O(1)$ auxiliary memory.'
    }
  },

  // ==========================================
  // PROBLEM 11: TWO SUM II (LeetCode #167)
  // ==========================================
  11: {
    id: 11,
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Medium',
    pattern: 'Two Pointers',
    day: 5,
    leetcodeUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    summary: 'Given a 1-indexed array of integers already sorted in non-decreasing order, find two numbers that sum to target using O(1) extra space.',
    prerequisites: ['Monotonic sorted property', 'Two Pointers convergence', '1-indexed return convention'],
    problemStatement: `Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers, \`index1\` and \`index2\`, **added by one** as an integer array \`[index1, index2]\` of length 2.

The tests are generated such that there is **exactly one solution**. You **may not** use the same element twice.
Your solution must use only **\`O(1)\`** extra space.

### Examples:
- **Example 1**: \`numbers = [2,7,11,15], target = 9\` $\\to$ \`[1, 2]\`
- **Example 2**: \`numbers = [2,3,4], target = 6\` $\\to$ \`[1, 3]\`
- **Example 3**: \`numbers = [-1,0], target = -1\` $\\to$ \`[1, 2]\`

### Constraints:
- \`2 <= numbers.length <= 3 * 10^4\`
- \`-1000 <= numbers[i] <= 1000\`
- \`numbers\` is sorted in **non-decreasing order**.`,
    approaches: [
      {
        name: 'Approach 1: Binary Search on Complement (Baseline)',
        badge: 'Baseline / Binary Search',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(1)',
        summary: 'For each element at index i, binary search for (target - numbers[i]) in the remaining array.',
        intuition: 'Since the array is sorted, for each numbers[i] we can search for the complement in O(log N) time.',
        codeJS: `function twoSumBinarySearch(numbers, target) {
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
}`,
        codeTS: `function twoSumBinarySearch(numbers: number[], target: number): number[] {
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
}`,
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
      {
        name: 'Approach 2: Two Pointers Inward Scan (Optimal O(N) Time, O(1) Space)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Start left at 0 and right at N-1. If sum > target, decrement right; if sum < target, increment left.',
        intuition: `Because the array is already sorted, we can exploit the monotonic property!
- If numbers[left] + numbers[right] > target: The sum is too large. Since numbers[left] is the smallest available candidate, no pair using numbers[right] can possibly sum to target. We MUST decrease the sum by moving right--!
- If numbers[left] + numbers[right] < target: The sum is too small. We MUST increase the sum by moving left++!
This guarantees finding the unique pair in at most N steps with zero extra memory.`,
        codeJS: `function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  
  while (left < right) {
    const currentSum = numbers[left] + numbers[right];
    
    if (currentSum === target) {
      // 1-indexed result
      return [left + 1, right + 1];
    } else if (currentSum > target) {
      right--; // Sum too large, shrink from right
    } else {
      left++; // Sum too small, advance from left
    }
  }
  
  return [];
}`,
        codeTS: `function twoSum(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;
  
  while (left < right) {
    const currentSum = numbers[left] + numbers[right];
    
    if (currentSum === target) {
      return [left + 1, right + 1];
    } else if (currentSum > target) {
      right--;
    } else {
      left++;
    }
  }
  
  return [];
}`,
        lineByLine: [
          'Line 2-3: Pointers placed at minimum element (left=0) and maximum element (right=numbers.length-1).',
          'Line 6: Computes current sum.',
          'Line 8: Target match returns 1-indexed array [left + 1, right + 1].',
          'Line 11: If sum > target, decrements right pointer.',
          'Line 13: If sum < target, increments left pointer.'
        ],
        dryRun: [
          { step: 1, state: 'nums=[2,7,11,15], target=9', action: 'L=0(2), R=3(15): sum=17 > 9', result: 'Sum too big -> R--' },
          { step: 2, state: 'L=0(2), R=2(11)', action: 'sum=13 > 9', result: 'Sum too big -> R--' },
          { step: 3, state: 'L=0(2), R=1(7)', action: 'sum=9 === target', result: 'Match! Return [1, 2]' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ because with every step, the distance between left and right shrinks by 1. At most $N$ iterations occur.
**Space Complexity**: $O(1)$ auxiliary memory using only two index registers.`
      }
    ],
    comparisonTable: [
      { approach: 'Hash Map (from Two Sum I)', time: 'O(N)', space: 'O(N)', pros: 'Works on unsorted arrays', cons: 'Wastes O(N) extra memory on sorted inputs' },
      { approach: 'Two Pointers (Optimal)', time: 'O(N)', space: 'O(1)', pros: 'Meets O(1) space constraint; optimal cache locality', cons: 'Requires sorted array' }
    ],
    interviewPitch: `"While classic Two Sum uses a Hash Map in O(N) space, Two Sum II provides an already-sorted array and mandates O(1) extra space. We exploit the sorted monotonicity using Two Pointers at opposite ends. If the sum is greater than target, we decrement the right pointer to decrease the sum; if the sum is less than target, we increment the left pointer. Because every step narrows the search space by 1, this finds the solution in O(N) time with strictly O(1) auxiliary memory."`,
    followUps: [
      {
        question: 'Could we use Binary Search instead?',
        answer: 'Yes, for each element at index i, we could binary search for (target - numbers[i]) in the remaining array. However, that costs O(N log N) time, which is strictly worse than Two Pointers at O(N).'
      }
    ],
    recallQuiz: {
      question: 'Why does moving the right pointer leftward guarantee we do not miss any valid solution when currentSum > target?',
      options: [
        'Because numbers[left] is the smallest available number; any other pair using numbers[right] would produce an even larger sum',
        'Because the array contains only positive numbers',
        'Because JavaScript guarantees array immutability',
        'Because binary search was executed beforehand'
      ],
      correctIndex: 0,
      explanation: 'Since numbers[left] is the minimum possible partner, numbers[right] paired with any other number would exceed currentSum, proving numbers[right] cannot be part of the solution.'
    }
  },

  // ==========================================
  // PROBLEM 13: 3SUM (LeetCode #15)
  // ==========================================
  13: {
    id: 13,
    title: '3Sum',
    difficulty: 'Medium',
    pattern: 'Two Pointers',
    day: 6,
    leetcodeUrl: 'https://leetcode.com/problems/3sum/',
    summary: 'Find all unique triplets in an integer array that sum to zero, ensuring no duplicate triplets are included.',
    prerequisites: ['Sorting + Two Pointers', 'Handling duplicates by skipping identical neighbors', 'Reducing 3Sum to Two Sum II'],
    problemStatement: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set **must not contain duplicate triplets**.

### Examples:
- **Example 1**: \`nums = [-1,0,1,2,-1,-4]\` $\\to$ \`[[-1,-1,2],[-1,0,1]]\`
- **Example 2**: \`nums = [0,1,1]\` $\\to$ \`[]\`
- **Example 3**: \`nums = [0,0,0]\` $\\to$ \`[[0,0,0]]\`

### Constraints:
- \`3 <= nums.length <= 3000\`
- \`-10^5 <= nums[i] <= 10^5\``,
    approaches: [
      {
        name: 'Approach 1: Brute Force 3 Loops + Hash Set (Baseline)',
        badge: 'Baseline / Brute-Force',
        timeComplexity: 'O(N³)',
        spaceComplexity: 'O(N)',
        summary: 'Examine every combination of 3 indices and deduplicate triplets using a Set.',
        intuition: 'Three nested loops find all triplets summing to 0; sort each triplet to deduplicate.',
        codeJS: `function threeSumBrute(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  const seen = new Set();
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const key = \`\${nums[i]},\${nums[j]},\${nums[k]}\`;
          if (!seen.has(key)) {
            seen.add(key);
            res.push([nums[i], nums[j], nums[k]]);
          }
        }
      }
    }
  }
  return res;
}`,
        codeTS: `function threeSumBrute(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const res: number[][] = [];
  const seen = new Set<string>();
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const key = \`\${nums[i]},\${nums[j]},\${nums[k]}\`;
          if (!seen.has(key)) {
            seen.add(key);
            res.push([nums[i], nums[j], nums[k]]);
          }
        }
      }
    }
  }
  return res;
}`,
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
      {
        name: 'Approach 2: Sort + Anchor + Two Pointers (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1) or O(N)',
        summary: 'Sort array. Anchor nums[i], then run Two Pointers (L, R) on remaining elements, skipping duplicate values.',
        intuition: `If we sort the array first ($O(N \\log N)$), 3Sum reduces to running Two Sum II for every element!
For each index i, we fix target = -nums[i] and find all pairs (L, R) where L > i and R > L such that nums[L] + nums[R] === -nums[i].
Crucially, to avoid duplicate triplets without allocating an expensive Hash Set, we simply skip identical values for i, L, and R!`,
        codeJS: `function threeSum(nums) {
  const res = [];
  nums.sort((a, b) => a - b);
  
  for (let i = 0; i < nums.length - 2; i++) {
    // If the smallest number is > 0, three positive numbers cannot sum to 0
    if (nums[i] > 0) break;
    
    // Skip duplicate anchor values
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    
    let left = i + 1;
    let right = nums.length - 1;
    
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      
      if (sum === 0) {
        res.push([nums[i], nums[left], nums[right]]);
        
        // Skip duplicate left and right values
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  
  return res;
}`,
        codeTS: `function threeSum(nums: number[]): number[][] {
  const res: number[][] = [];
  nums.sort((a, b) => a - b);
  
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    
    let left = i + 1;
    let right = nums.length - 1;
    
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      
      if (sum === 0) {
        res.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  
  return res;
}`,
        lineByLine: [
          'Line 3: Sorts numbers in ascending order in O(N log N).',
          'Line 6: "if (nums[i] > 0) break;" — Early pruning: if smallest element > 0, sum cannot be 0.',
          'Line 9: "if (i > 0 && nums[i] === nums[i - 1]) continue;" — Avoids duplicate triplets starting with same number.',
          'Line 19: Triplet found! Pushes to result.',
          'Line 22-23: Skips duplicate left and right values to ensure uniqueness.'
        ],
        dryRun: [
          { step: 1, state: 'nums=[-4, -1, -1, 0, 1, 2]', action: 'i=0 (nums[0]=-4)', result: 'L=1(-1), R=5(2): sum=-3 < 0 -> L++' },
          { step: 2, state: 'i=1 (nums[1]=-1)', action: 'L=2(-1), R=5(2): -1 + -1 + 2 = 0!', result: 'Add [-1, -1, 2]' },
          { step: 3, state: 'i=1 (cont.)', action: 'L=3(0), R=4(1): -1 + 0 + 1 = 0!', result: 'Add [-1, 0, 1]' },
          { step: 4, state: 'i=2 (nums[2]=-1)', action: 'nums[2] === nums[1]', result: 'Skip duplicate anchor!' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N^2)$ because sorting takes $O(N \\log N)$, and the outer loop runs $N$ times with an inner two-pointer scan taking $O(N)$. $O(N \\log N + N^2) = O(N^2)$.
**Space Complexity**: $O(1)$ auxiliary space (excluding the output array and $O(\\log N)$ sorting stack).`
      }
    ],
    comparisonTable: [
      { approach: 'Brute Force 3 Loops + Set', time: 'O(N³)', space: 'O(N)', pros: 'Naive baseline', cons: 'Cube time; TLE on N=3000' },
      { approach: 'Sort + Two Pointers (Optimal)', time: 'O(N²)', space: 'O(1)', pros: 'Eliminates duplicate hash sets; optimal time', cons: 'Mutates array or requires shallow copy' }
    ],
    interviewPitch: `"The brute-force solution checks all triplets in O(N³) time and uses a Hash Set to filter duplicates. We optimize this to O(N²) by sorting the array first. We iterate through each element i as an anchor, and use Two Pointers (left and right) to solve Two Sum II for the remaining subarray in O(N) time. To guarantee zero duplicate triplets without allocating memory, we skip adjacent identical values for the anchor, the left pointer, and the right pointer. This achieves O(N²) time with O(1) auxiliary space."`,
    followUps: [
      {
        question: 'How do you generalize 3Sum to K-Sum?',
        answer: 'Use recursion: reduce K-Sum to (K-1)-Sum recursively until K === 2, at which point run Two Sum II with Two Pointers. Overall complexity will be O(N^(K - 1)).'
      }
    ],
    recallQuiz: {
      question: 'How does the optimal 3Sum solution avoid duplicate triplets?',
      options: [
        'By skipping adjacent identical values after sorting: if (nums[i] === nums[i - 1]) continue',
        'By storing all answers in a WeakSet',
        'By running binary search on every iteration',
        'By only selecting positive numbers'
      ],
      correctIndex: 0,
      explanation: 'Sorting groups identical values together. Checking if an element equals its predecessor allows skipping duplicates in $O(1)$ time without extra memory.'
    }
  },

  // ==========================================
  // PROBLEM 14: CONTAINER WITH MOST WATER (LeetCode #11)
  // ==========================================
  14: {
    id: 14,
    title: 'Container With Most Water',
    difficulty: 'Medium',
    pattern: 'Two Pointers',
    day: 8,
    leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
    summary: 'Find two lines that together with the x-axis form a container that stores the maximum amount of water.',
    prerequisites: ['Two Pointers boundary elimination', 'Area formula: min(h[L], h[R]) * (R - L)'],
    problemStatement: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return **the maximum amount of water a container can store**.
**Notice that you may not slant the container.**

### Examples:
- **Example 1**: \`height = [1,8,6,2,5,4,8,3,7]\` $\\to$ \`49\` (Lines at index 1 and 8: min(8, 7) * (8 - 1) = 7 * 7 = 49)
- **Example 2**: \`height = [1,1]\` $\\to$ \`1\`

### Constraints:
- \`n == height.length\`
- \`2 <= n <= 10^5\`
- \`0 <= height[i] <= 10^4\``,
    approaches: [
      {
        name: 'Approach 1: Brute Force All Line Pairs (Baseline)',
        badge: 'Baseline / Brute-Force',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        summary: 'Check every pair of lines (i, j) and calculate area min(h[i], h[j]) * (j - i).',
        intuition: 'Compute the water area between all unique line pairs and take the maximum.',
        codeJS: `function maxAreaBrute(height) {
  let maxWater = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      const h = Math.min(height[i], height[j]);
      const w = j - i;
      maxWater = Math.max(maxWater, h * w);
    }
  }
  return maxWater;
}`,
        codeTS: `function maxAreaBrute(height: number[]): number {
  let maxWater = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      const h = Math.min(height[i], height[j]);
      const w = j - i;
      maxWater = Math.max(maxWater, h * w);
    }
  }
  return maxWater;
}`,
        lineByLine: [
          'Line 2: Track max water.',
          'Line 3-7: Nested loops compute width * minHeight for all pairs.'
        ],
        dryRun: [
          { step: 1, state: 'height = [1,8,6,2,5,4,8,3,7]', action: 'i=1(8), j=8(7): min(8, 7) * 7 = 49', result: 'maxWater = 49' }
        ],
        complexityDerivation: 'N*(N-1)/2 pairs evaluated -> O(N^2) time and O(1) space.'
      },
      {
        name: 'Approach 2: Two Pointers Greedy Elimination (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Start at widest boundaries. Always move the pointer with the shorter height inward.',
        intuition: `Area = width * min(height[left], height[right]).
At the start, width is maximum (N - 1). As we move pointers inward, width will STRICTLY decrease.
To have any hope of finding a larger area despite the shrinking width, we MUST find a taller height!
The limiting factor of the container is always the SHORTER line. Moving the taller line inward cannot possibly increase the area (width shrinks, and height is still bottlenecked by the shorter line). Therefore, we greedily eliminate the shorter line at every step!`,
        codeJS: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;
  
  while (left < right) {
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    const currentWater = width * currentHeight;
    
    maxWater = Math.max(maxWater, currentWater);
    
    // Greedily move the pointer pointing to the shorter vertical line
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  
  return maxWater;
}`,
        codeTS: `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;
  
  while (left < right) {
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    const currentWater = width * currentHeight;
    
    maxWater = Math.max(maxWater, currentWater);
    
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  
  return maxWater;
}`,
        lineByLine: [
          'Line 2-3: Starts at widest possible container (left=0, right=height.length-1).',
          'Line 7: Width is difference between indices.',
          'Line 8: Bottleneck height is minimum of the two boundary heights.',
          'Line 14-17: Greedily moves the shorter bar inward, as keeping the shorter bar can never yield a larger area.'
        ],
        dryRun: [
          { step: 1, state: 'height=[1,8,6,2,5,4,8,3,7]', action: 'L=0(1), R=8(7): area=min(1,7)*8 = 8', result: 'h[L] < h[R] -> L++' },
          { step: 2, state: 'L=1(8), R=8(7)', action: 'area=min(8,7)*7 = 49', result: 'h[R] < h[L] -> R--' },
          { step: 3, state: 'L=1(8), R=7(3)', action: 'area=min(8,3)*6 = 18', result: 'R--' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ because the distance between left and right decreases by 1 in every iteration, inspecting at most $N$ lines.
**Space Complexity**: $O(1)$ auxiliary space using only index pointers.`
      }
    ],
    comparisonTable: [
      { approach: 'Brute Force All Pairs', time: 'O(N²)', space: 'O(1)', pros: 'Checks every pair', cons: 'Time Limit Exceeded for N=100,000' },
      { approach: 'Two Pointers Elimination (Optimal)', time: 'O(N)', space: 'O(1)', pros: 'Single linear pass; proven optimal', cons: 'None' }
    ],
    interviewPitch: `"The container capacity is width * min(height[L], height[R]). We start with the widest possible container using two pointers at opposite ends (0 and N-1). Because moving either pointer inward strictly decreases the width, our only chance of achieving a larger area is finding a taller height. Since the container capacity is fundamentally constrained by the shorter line, moving the taller line can never improve the result. Therefore, at each step, we greedily advance the pointer pointing to the shorter line. This explores all candidate maximums in O(N) time with O(1) space."`,
    followUps: [
      {
        question: 'What if both lines have equal height (height[left] === height[right])?',
        answer: 'You can move either pointer (or both) inward. Since both bars are bottlenecks of equal height, neither can form a larger container with any inner bar that has a smaller width.'
      }
    ],
    recallQuiz: {
      question: 'Why do we always move the shorter vertical line pointer inward in Container With Most Water?',
      options: [
        'Because keeping the shorter line while shrinking the width can never produce a larger area',
        'Because arrays can only be accessed from the smaller index',
        'Because water spills out of the taller line',
        'Because of floating point rounding'
      ],
      correctIndex: 0,
      explanation: 'Since area is bottlenecked by $\\min(h[L], h[R])$, keeping the shorter line while decreasing the width is mathematically guaranteed to produce a smaller or equal area.'
    }
  }
};
