// Day 1 Solutions: Arrays Foundations (Contains Duplicate, Product of Array Except Self, Valid Sudoku)
// Complete Unabridged Multidisciplinary Solutions with JavaScript, TypeScript, Dry Runs, Line-by-Line explanations, and Spoken Pitches

export const DAY_1_SOLUTIONS = {
  // ==========================================
  // PROBLEM 1: CONTAINS DUPLICATE (LeetCode #217)
  // ==========================================
  1: {
    id: 1,
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    pattern: 'Arrays & Hashing',
    day: 1,
    leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
    summary: 'Determine if any value appears at least twice in an integer array, or if every element is distinct.',
    prerequisites: ['Basic loops and arrays', 'Set data structure in JS/TS', 'Time vs Space trade-off'],
    problemStatement: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.

### Examples:
- **Example 1**: \`nums = [1, 2, 3, 1]\` $\\to$ \`true\` (1 appears at indices 0 and 3).
- **Example 2**: \`nums = [1, 2, 3, 4]\` $\\to$ \`false\` (all elements distinct).
- **Example 3**: \`nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]\` $\\to$ \`true\`.

### Constraints:
- \`1 <= nums.length <= 10^5\`
- \`-10^9 <= nums[i] <= 10^9\`
`,
    approaches: [
      {
        name: 'Approach 1: Brute Force (Nested Loops)',
        badge: 'Baseline / Brute Force',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        summary: 'Compare every element with every subsequent element using two nested loops.',
        intuition: `To check for duplicates without extra memory, compare every pair of indices (i, j) where j > i. If nums[i] === nums[j], we immediately know a duplicate exists.`,
        codeJS: `function containsDuplicate(nums) {
  // Outer loop selects the reference element
  for (let i = 0; i < nums.length; i++) {
    // Inner loop compares with all elements that follow
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) {
        return true; // Found matching duplicate pair
      }
    }
  }
  return false; // Checked all n*(n-1)/2 pairs without matches
}`,
        codeTS: `function containsDuplicate(nums: number[]): boolean {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) {
        return true;
      }
    }
  }
  return false;
}`,
        lineByLine: [
          'Line 2: "for (let i = 0; i < nums.length; i++)" — iterates through each element to serve as the candidate duplicate.',
          'Line 4: "for (let j = i + 1; j < nums.length; j++)" — starts strictly at (i + 1) to avoid comparing an element with itself or re-checking previous pairs.',
          'Line 5: "if (nums[i] === nums[j])" — checks if values are identical. If true, returns immediately.',
          'Line 10: "return false" — if all pairs are exhausted with no match, all elements are unique.'
        ],
        dryRun: [
          { step: 1, state: 'i=0 (nums[0]=1)', action: 'Compare with j=1 (nums[1]=2)', result: '1 !== 2, continue' },
          { step: 2, state: 'i=0 (nums[0]=1)', action: 'Compare with j=2 (nums[2]=3)', result: '1 !== 3, continue' },
          { step: 3, state: 'i=0 (nums[0]=1)', action: 'Compare with j=3 (nums[3]=1)', result: '1 === 1 (MATCH)! Returns true immediately.' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N^2)$ because the outer loop runs $N$ times and the inner loop runs $(N - 1), (N - 2), \\dots, 1$ times. The sum is $\\frac{N(N - 1)}{2} \\approx \\frac{N^2}{2} = O(N^2)$. For $N = 10^5$, $(10^5)^2 = 10^{10}$ operations, which will cause a Time Limit Exceeded (TLE) error in online judges.
**Space Complexity**: $O(1)$ auxiliary memory because only two index registers (\`i\` and \`j\`) are allocated.`
      },
      {
        name: 'Approach 2: Sort and Scan Adjacent',
        badge: 'Improved / Algorithmic',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(1) or O(N)',
        summary: 'Sort the array first so duplicate elements become adjacent neighbors.',
        intuition: `If identical values exist in an array, sorting will force them to occupy adjacent indices (e.g. [4, 1, 3, 1] becomes [1, 1, 3, 4]). After sorting, a single linear pass comparing nums[i] with nums[i - 1] suffices.`,
        codeJS: `function containsDuplicate(nums) {
  // Sort numbers in ascending numerical order
  // Note: [...nums] creates a shallow copy to prevent mutating input
  const sorted = [...nums].sort((a, b) => a - b);
  
  // Single pass checking adjacent neighbors
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1]) {
      return true; // Adjacent duplicates found
    }
  }
  return false;
}`,
        codeTS: `function containsDuplicate(nums: number[]): boolean {
  const sorted: number[] = [...nums].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1]) {
      return true;
    }
  }
  return false;
}`,
        lineByLine: [
          'Line 3: "[...nums].sort((a, b) => a - b)" — spreads into a copy and sorts numerically. JS default .sort() treats numbers as strings ("10" comes before "2"), so the numerical comparator (a, b) => a - b is mandatory!',
          'Line 6: "for (let i = 1; i < sorted.length; i++)" — loops from index 1 to the end.',
          'Line 7: "if (sorted[i] === sorted[i - 1])" — compares each element with its immediate predecessor. If equal, returns true.'
        ],
        dryRun: [
          { step: 1, state: 'Original: [4, 1, 3, 1]', action: 'Sort array', result: 'Sorted: [1, 1, 3, 4]' },
          { step: 2, state: 'i=1: sorted[1]=1, sorted[0]=1', action: 'Check 1 === 1', result: 'Match found! Returns true immediately.' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N \\log N)$ dominated by the sorting algorithm (Timsort in V8). The subsequent linear scan is $O(N)$, giving $O(N \\log N + N) = O(N \\log N)$.
**Space Complexity**: $O(N)$ if copying to avoid mutation, or $O(\\log N)$ to $O(N)$ auxiliary stack space used internally by Timsort.`
      },
      {
        name: 'Approach 3: Hash Set (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Track previously seen numbers in an ES6 Set with average O(1) lookups.',
        intuition: `As we iterate through the array once, we ask: "Have we seen this number before?" A Hash Set allows both checking existence (\`.has()\`) and adding (\`.add()\`) in average $O(1)$ time. This eliminates the inner loop completely.`,
        codeJS: `function containsDuplicate(nums) {
  const seen = new Set();
  
  for (const num of nums) {
    // If the number is already in the set, a duplicate is found
    if (seen.has(num)) {
      return true;
    }
    // Otherwise record this number for future checks
    seen.add(num);
  }
  
  return false; // All numbers were unique
}`,
        codeTS: `function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  
  for (const num of nums) {
    if (seen.has(num)) {
      return true;
    }
    seen.add(num);
  }
  
  return false;
}`,
        lineByLine: [
          'Line 2: "const seen = new Set();" — allocates a hash set in memory to store observed unique values.',
          'Line 4: "for (const num of nums)" — iterates through each integer in one linear pass.',
          'Line 6: "if (seen.has(num)) return true;" — computes hash bucket of num. If present, duplicate found, exit early.',
          'Line 9: "seen.add(num);" — registers num in the set.',
          'Line 12: "return false;" — loop finished with no collisions, array has all unique elements.'
        ],
        dryRun: [
          { step: 1, state: 'num = 4, seen = {}', action: 'seen.has(4) -> false', result: 'seen.add(4) -> seen is {4}' },
          { step: 2, state: 'num = 2, seen = {4}', action: 'seen.has(2) -> false', result: 'seen.add(2) -> seen is {4, 2}' },
          { step: 3, state: 'num = 7, seen = {4, 2}', action: 'seen.has(7) -> false', result: 'seen.add(7) -> seen is {4, 2, 7}' },
          { step: 4, state: 'num = 2, seen = {4, 2, 7}', action: 'seen.has(2) -> TRUE!', result: 'Collision detected! Returns true.' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ on average. We visit each of the $N$ elements once. Each \`Set.has()\` and \`Set.add()\` operation takes $O(1)$ amortized time.
**Space Complexity**: $O(N)$ auxiliary space in the worst case (when all elements are unique, the Set stores all $N$ values).`
      }
    ],
    comparisonTable: [
      { approach: 'Brute Force (Nested Loops)', time: 'O(N²)', space: 'O(1)', pros: 'Zero extra memory allocation', cons: 'Horrendously slow for N > 10,000 (TLE)' },
      { approach: 'Sort and Compare Adjacent', time: 'O(N log N)', space: 'O(1) / O(N)', pros: 'Better than O(N²), predictable', cons: 'Mutates array unless copied; slower than Set' },
      { approach: 'Hash Set (Seen Set)', time: 'O(N)', space: 'O(N)', pros: 'Optimal linear time, single pass, early exit', cons: 'Allocates O(N) heap memory for Hash Set' }
    ],
    interviewPitch: `**How to speak this in an interview (60-second pitch):**
"To solve Contains Duplicate, the brute-force approach is comparing every pair with nested loops in $O(N^2)$ time and $O(1)$ space. We can improve this to $O(N \\log N)$ by sorting first and scanning adjacent items. 

However, the optimal approach in production is using a **Hash Set** to track visited numbers. In a single linear pass of $O(N)$ time, for each element we check if it already exists in the set via \`.has()\`. If so, we return \`true\` immediately. If not, we add it. If the loop completes, we return \`false\`. This trades $O(N)$ auxiliary memory for optimal $O(N)$ runtime."`,
    followUps: [
      {
        question: 'Can you write this in a one-liner in JavaScript?',
        answer: 'Yes: `return new Set(nums).size !== nums.length;`. However, mention to the interviewer that while concise, this one-liner always inspects the entire array and allocates space for all elements, whereas the loop version exits early on the first duplicate.'
      },
      {
        question: 'What if memory is severely constrained (embedded device) and O(N) space is forbidden?',
        answer: 'In that scenario, in-place sorting like HeapSort or in-place QuickSort gives $O(N \\log N)$ time with $O(1)$ auxiliary space, after which an adjacent scan takes $O(N)$ time and $O(1)$ space.'
      }
    ],
    recallQuiz: {
      question: 'Why is the Set approach preferred over the one-liner `new Set(nums).size !== nums.length` in high-throughput production services?',
      options: [
        'The one-liner throws an error on negative numbers',
        'The manual loop allows early-exit as soon as the first duplicate is found, saving time and memory',
        'Sets cannot store more than 1000 items in V8',
        'The one-liner runs in O(N²) time'
      ],
      correctIndex: 1,
      explanation: 'If a duplicate appears at index 0 and 1 in a million-item array, the loop exits in 2 operations and stores only 1 element, while `new Set(nums)` iterates all 1,000,000 items.'
    }
  },

  // ==================================================
  // PROBLEM 2: PRODUCT OF ARRAY EXCEPT SELF (LeetCode #238)
  // ==================================================
  2: {
    id: 2,
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    pattern: 'Arrays & Prefix Products',
    day: 1,
    leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/',
    summary: 'Calculate an array where output[i] is the product of all elements in nums except nums[i], without using division in O(N) time.',
    prerequisites: ['Prefix/Suffix Accumulators', 'Array indexing', 'Handling zero edge cases'],
    problemStatement: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is guaranteed to fit in a **32-bit** integer.

**Crucial Rule**: You must write an algorithm that runs in **$O(N)$ time** and **without using the division operation**!

### Examples:
- **Example 1**: \`nums = [1, 2, 3, 4]\` $\\to$ \`[24, 12, 8, 6]\`
  - index 0: $2 \\times 3 \\times 4 = 24$
  - index 1: $1 \\times 3 \\times 4 = 12$
  - index 2: $1 \\times 2 \\times 4 = 8$
  - index 3: $1 \\times 2 \\times 3 = 6$
- **Example 2**: \`nums = [-1, 1, 0, -3, 3]\` $\\to$ \`[0, 0, 9, 0, 0]\`

### Constraints:
- \`2 <= nums.length <= 10^5\`
- \`-30 <= nums[i] <= 30\`
`,
    approaches: [
      {
        name: 'Approach 1: Brute Force (Nested Product)',
        badge: 'Baseline / Brute Force',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1) extra',
        summary: 'For every index i, iterate through all other indices j !== i and multiply their values.',
        intuition: `For each index i, initialize product = 1. Run a loop from j = 0 to N - 1. Whenever j !== i, multiply product *= nums[j]. Assign result[i] = product.`,
        codeJS: `function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n);
  
  for (let i = 0; i < n; i++) {
    let product = 1;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        product *= nums[j];
      }
    }
    result[i] = product;
  }
  
  return result;
}`,
        codeTS: `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n);
  
  for (let i = 0; i < n; i++) {
    let product = 1;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        product *= nums[j];
      }
    }
    result[i] = product;
  }
  
  return result;
}`,
        lineByLine: [
          'Line 2-3: "const n = nums.length; const result = new Array(n);" — allocates output array of length n.',
          'Line 5: "for (let i = 0; i < n; i++)" — selects the target index to exclude.',
          'Line 6: "let product = 1;" — resets accumulator product for index i.',
          'Line 7-9: "for (let j = 0; j < n; j++) { if (i !== j) product *= nums[j]; }" — multiplies every number except nums[i].',
          'Line 11: "result[i] = product;" — writes final product to output.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [1, 2, 3, 4], i = 0', action: 'Multiply nums[1]*nums[2]*nums[3] = 2*3*4', result: 'result[0] = 24' },
          { step: 2, state: 'nums = [1, 2, 3, 4], i = 1', action: 'Multiply nums[0]*nums[2]*nums[3] = 1*3*4', result: 'result[1] = 12' },
          { step: 3, state: 'nums = [1, 2, 3, 4], i = 2', action: 'Multiply nums[0]*nums[1]*nums[3] = 1*2*4', result: 'result[2] = 8' },
          { step: 4, state: 'nums = [1, 2, 3, 4], i = 3', action: 'Multiply nums[0]*nums[1]*nums[2] = 1*2*3', result: 'result[3] = 6' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N^2)$. For each of the $N$ elements, we perform $N - 1$ multiplications. Total operations $\\approx N^2$. For $N = 10^5$, $10^{10}$ operations times out.
**Space Complexity**: $O(1)$ extra memory beyond the required returned output array.`
      },
      {
        name: 'Approach 2: Prefix and Suffix Arrays',
        badge: 'Improved / Algorithmic',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Decompose the product into (All numbers to the left) * (All numbers to the right).',
        intuition: `Notice: for any index i:
result[i] = (product of all elements before i) * (product of all elements after i).
We can precompute two arrays:
- \`prefix[i]\` = product of all elements to the left of i.
- \`suffix[i]\` = product of all elements to the right of i.
Then \`result[i] = prefix[i] * suffix[i]\` in $O(1)$!`,
        codeJS: `function productExceptSelf(nums) {
  const n = nums.length;
  const prefix = new Array(n);
  const suffix = new Array(n);
  const result = new Array(n);
  
  // Step 1: Compute prefix products
  prefix[0] = 1; // Nothing to the left of index 0
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] * nums[i - 1];
  }
  
  // Step 2: Compute suffix products
  suffix[n - 1] = 1; // Nothing to the right of index n - 1
  for (let i = n - 2; i >= 0; i--) {
    suffix[i] = suffix[i + 1] * nums[i + 1];
  }
  
  // Step 3: Combine prefix and suffix
  for (let i = 0; i < n; i++) {
    result[i] = prefix[i] * suffix[i];
  }
  
  return result;
}`,
        codeTS: `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const prefix: number[] = new Array(n);
  const suffix: number[] = new Array(n);
  const result: number[] = new Array(n);
  
  prefix[0] = 1;
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] * nums[i - 1];
  }
  
  suffix[n - 1] = 1;
  for (let i = n - 2; i >= 0; i--) {
    suffix[i] = suffix[i + 1] * nums[i + 1];
  }
  
  for (let i = 0; i < n; i++) {
    result[i] = prefix[i] * suffix[i];
  }
  
  return result;
}`,
        lineByLine: [
          'Line 7-11: builds prefix array where prefix[i] accumulates product of all elements strictly left of i.',
          'Line 14-17: builds suffix array backwards where suffix[i] accumulates product of all elements strictly right of i.',
          'Line 20-22: combines prefix[i] * suffix[i] to get the exact product excluding nums[i] in O(1).'
        ],
        dryRun: [
          { step: 1, state: 'nums = [1, 2, 3, 4]', action: 'Compute Prefix', result: 'prefix = [1, 1, 2, 6]' },
          { step: 2, state: 'nums = [1, 2, 3, 4]', action: 'Compute Suffix', result: 'suffix = [24, 12, 4, 1]' },
          { step: 3, state: 'Combine i=0 to 3', action: 'prefix[i] * suffix[i]', result: 'result = [1*24, 1*12, 2*4, 6*1] = [24, 12, 8, 6]' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$ with three linear passes ($N + N + N = 3N = O(N)$).
**Space Complexity**: $O(N)$ extra auxiliary space used by \`prefix\` and \`suffix\` arrays.`
      },
      {
        name: 'Approach 3: Single Output Array with Rolling Suffix (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) extra',
        summary: 'Store prefix products directly in the output array, then accumulate suffix product with a single rolling variable.',
        intuition: `We can eliminate the extra $O(N)$ arrays! 
1. First, populate \`result\` with prefix products directly: \`result[i] = product of left elements\`.
2. Second, traverse backwards with a single variable \`suffix = 1\`. Multiply \`result[i] *= suffix\`, and update \`suffix *= nums[i]\`.
Output array does not count as auxiliary space per problem specification.`,
        codeJS: `function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n);
  
  // Pass 1: Build left prefix products directly in result array
  result[0] = 1;
  for (let i = 1; i < n; i++) {
    result[i] = result[i - 1] * nums[i - 1];
  }
  
  // Pass 2: Traverse backwards, multiplying by running right suffix product
  let rightSuffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightSuffix;   // Multiply left product by right product
    rightSuffix *= nums[i];     // Incorporate current element into suffix
  }
  
  return result;
}`,
        codeTS: `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n);
  
  result[0] = 1;
  for (let i = 1; i < n; i++) {
    result[i] = result[i - 1] * nums[i - 1];
  }
  
  let rightSuffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightSuffix;
    rightSuffix *= nums[i];
  }
  
  return result;
}`,
        lineByLine: [
          'Line 5-9: "result[0] = 1; for (let i = 1; i < n; i++) result[i] = result[i - 1] * nums[i - 1]" — result[i] now holds the product of all elements to the left of i.',
          'Line 12: "let rightSuffix = 1;" — scalar variable to maintain rolling product of all elements to the right of i.',
          'Line 13-16: "for (let i = n - 1; i >= 0; i--)" — walks backwards. Multiplies result[i] with rightSuffix, then updates rightSuffix with nums[i].',
          'Line 18: "return result;" — returns the finished array.'
        ],
        dryRun: [
          { step: 1, state: 'nums=[1, 2, 3, 4], Pass 1', action: 'Prefix scan', result: 'result is [1, 1, 2, 6]' },
          { step: 2, state: 'i=3, rightSuffix=1', action: 'result[3] = 6*1 = 6', result: 'rightSuffix becomes 1*4 = 4' },
          { step: 3, state: 'i=2, rightSuffix=4', action: 'result[2] = 2*4 = 8', result: 'rightSuffix becomes 4*3 = 12' },
          { step: 4, state: 'i=1, rightSuffix=12', action: 'result[1] = 1*12 = 12', result: 'rightSuffix becomes 12*2 = 24' },
          { step: 5, state: 'i=0, rightSuffix=24', action: 'result[0] = 1*24 = 24', result: 'rightSuffix becomes 24*1 = 24. Final result: [24, 12, 8, 6]' }
        ],
        complexityDerivation: `**Time Complexity**: $O(N)$. Two linear passes: forward pass of $N$ steps + backward pass of $N$ steps = $2N = O(N)$.
**Space Complexity**: $O(1)$ auxiliary space. The returned array \`result\` is the required output and does not count as extra memory. Only a single scalar integer \`rightSuffix\` is allocated.`
      }
    ],
    comparisonTable: [
      { approach: 'Brute Force Nested', time: 'O(N²)', space: 'O(1) extra', pros: 'Simple logic', cons: 'TLE on large arrays (10¹⁰ ops)' },
      { approach: 'Prefix & Suffix Arrays', time: 'O(N)', space: 'O(N) extra', pros: 'Very clear separation of left/right logic', cons: 'Allocates two additional arrays of size N' },
      { approach: 'Rolling Suffix in Result', time: 'O(N)', space: 'O(1) extra', pros: 'Meets follow-up challenge of O(1) extra memory', cons: 'Requires backwards loop index awareness' }
    ],
    interviewPitch: `**How to speak this in an interview (60-second pitch):**
"If division were allowed, we could compute the total product and divide by nums[i], though that would fail whenever zero exists. Because division is forbidden, any element's answer is simply the product of all numbers to its left multiplied by the product of all numbers to its right.

I solve this in $O(N)$ time and $O(1)$ auxiliary space using a two-pass prefix-suffix technique. In the first forward pass, I fill the output array with the left prefix products. In the second backward pass, I maintain a single rolling scalar variable \`rightSuffix\` initialized to 1. At each index, I multiply the left product already in the output array by \`rightSuffix\`, and then update \`rightSuffix\` by multiplying with the current element. This gives the exact answer without extra memory."`,
    followUps: [
      {
        question: 'What happens if the array contains one or more zeros?',
        answer: 'Our prefix/suffix multiplication handles zeros naturally without any special-case division-by-zero checks. If there is one zero, all positions except the zero will become 0. If there are two or more zeros, all positions will become 0.'
      },
      {
        question: 'Why does division approach fail in interviews even if the interviewer didn’t forbid it?',
        answer: 'Division approaches fail on edge cases with zeros (division by zero throws or produces Infinity/NaN). Moreover, 32-bit integer overflow can occur during total product accumulation before dividing.'
      }
    ],
    recallQuiz: {
      question: 'In the O(1) auxiliary space approach, what does the backward pass do with `rightSuffix`?',
      options: [
        'Divides result[i] by rightSuffix',
        'Multiplies result[i] by rightSuffix, then updates rightSuffix *= nums[i]',
        'Resets rightSuffix to 0 at every iteration',
        'Adds nums[i] to rightSuffix'
      ],
      correctIndex: 1,
      explanation: 'result[i] already holds the product of all elements to the left. Multiplying by rightSuffix completes the product of both sides, and rightSuffix is then updated with nums[i] for subsequent elements.'
    }
  },

  // ==========================================
  // PROBLEM 3: VALID SUDOKU (LeetCode #36)
  // ==========================================
  3: {
    id: 3,
    title: 'Valid Sudoku',
    difficulty: 'Medium',
    pattern: 'Arrays & Matrix Hashing',
    day: 1,
    leetcodeUrl: 'https://leetcode.com/problems/valid-sudoku/',
    summary: 'Validate whether a 9x9 Sudoku board configuration is valid according to row, column, and 3x3 sub-box rules.',
    prerequisites: ['2D Matrix Traversal (rows & cols)', 'Modulo & Integer Division for 3x3 grids', 'Hash Sets / Bitmasks'],
    problemStatement: `Determine if a \`9 x 9\` Sudoku board is valid. Only the filled cells need to be validated according to the following rules:

1. Each **row** must contain the digits \`1-9\` without repetition.
2. Each **column** must contain the digits \`1-9\` without repetition.
3. Each of the nine **3 x 3 sub-boxes** of the grid must contain the digits \`1-9\` without repetition.

**Note**:
- A Sudoku board (partially filled) could be valid but is not necessarily solvable.
- Only the filled cells need to be validated. Empty cells are denoted by \`'.'\`.

### Constraints:
- \`board.length == 9\`
- \`board[i].length == 9\`
- \`board[i][j]\` is a digit \`'1'-'9'\` or \`'.'\`.
`,
    approaches: [
      {
        name: 'Approach 1: Three Separate Passes',
        badge: 'Baseline / Brute Force',
        timeComplexity: 'O(1) / O(81)',
        spaceComplexity: 'O(1) / O(81)',
        summary: 'Check rows in one loop, columns in a second loop, and 3x3 sub-boxes in a third loop.',
        intuition: `Directly verify the three Sudoku rules independently. First, iterate through each row with a Set. Second, iterate through each column with a Set. Third, iterate through each of the 9 sub-boxes with a Set. If any duplicate digit is found, return false.`,
        codeJS: `function isValidSudoku(board) {
  // 1. Validate rows
  for (let r = 0; r < 9; r++) {
    const seen = new Set();
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val !== '.') {
        if (seen.has(val)) return false;
        seen.add(val);
      }
    }
  }

  // 2. Validate columns
  for (let c = 0; c < 9; c++) {
    const seen = new Set();
    for (let r = 0; r < 9; r++) {
      const val = board[r][c];
      if (val !== '.') {
        if (seen.has(val)) return false;
        seen.add(val);
      }
    }
  }

  // 3. Validate 3x3 sub-boxes
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const seen = new Set();
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const val = board[boxRow + r][boxCol + c];
          if (val !== '.') {
            if (seen.has(val)) return false;
            seen.add(val);
          }
        }
      }
    }
  }

  return true;
}`,
        codeTS: `function isValidSudoku(board: string[][]): boolean {
  for (let r = 0; r < 9; r++) {
    const seen = new Set<string>();
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val !== '.') {
        if (seen.has(val)) return false;
        seen.add(val);
      }
    }
  }

  for (let c = 0; c < 9; c++) {
    const seen = new Set<string>();
    for (let r = 0; r < 9; r++) {
      const val = board[r][c];
      if (val !== '.') {
        if (seen.has(val)) return false;
        seen.add(val);
      }
    }
  }

  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const seen = new Set<string>();
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const val = board[boxRow + r][boxCol + c];
          if (val !== '.') {
            if (seen.has(val)) return false;
            seen.add(val);
          }
        }
      }
    }
  }

  return true;
}`,
        lineByLine: [
          'Lines 2-13: checks each of the 9 rows independently with a fresh Set.',
          'Lines 15-26: checks each of the 9 columns independently with a fresh Set.',
          'Lines 28-44: jumps boxRow and boxCol in steps of 3, checking each 3x3 quadrant independently.'
        ],
        dryRun: [
          { step: 1, state: 'Check row 0', action: 'Validate digits against row seen Set', result: 'Valid' },
          { step: 2, state: 'Check col 0', action: 'Validate digits against col seen Set', result: 'Valid' },
          { step: 3, state: 'Check box (0,0)', action: 'Iterate r=0..2, c=0..2', result: 'No duplicates found' }
        ],
        complexityDerivation: `**Time Complexity**: $O(81) = O(1)$ because the board size is strictly fixed at 9x9 cells. Each cell is checked 3 times (row, col, box) = $3 \\times 81 = 243$ operations.
**Space Complexity**: $O(1)$ as the sets store at most 9 characters at any time.`
      },
      {
        name: 'Approach 2: Single Pass with Hash Sets Array (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(1) / O(81)',
        spaceComplexity: 'O(1) / O(81)',
        summary: 'Traverse the 9x9 board once using mathematical 3x3 box mapping: boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3).',
        intuition: `Why iterate the board 3 times when you can inspect each cell exactly once?
Maintain:
- 9 Sets for rows (\`rows[r]\`)
- 9 Sets for cols (\`cols[c]\`)
- 9 Sets for 3x3 boxes (\`boxes[boxIndex]\`)
Where \`boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3)\`.
As you visit \`board[r][c]\`, check all 3 sets at once!`,
        codeJS: `function isValidSudoku(board) {
  // Array of 9 Sets for rows, cols, and 3x3 boxes
  const rows = Array.from({ length: 9 }, () => new Set());
  const cols = Array.from({ length: 9 }, () => new Set());
  const boxes = Array.from({ length: 9 }, () => new Set());

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      
      // Skip empty cells
      if (val === '.') continue;

      // Mathematical mapping of (r, c) to box index (0 to 8)
      const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);

      // Check for collisions across all three constraints
      if (rows[r].has(val) || cols[c].has(val) || boxes[boxIdx].has(val)) {
        return false;
      }

      // Record digit in respective row, column, and box
      rows[r].add(val);
      cols[c].add(val);
      boxes[boxIdx].add(val);
    }
  }

  return true;
}`,
        codeTS: `function isValidSudoku(board: string[][]): boolean {
  const rows = Array.from({ length: 9 }, () => new Set<string>());
  const cols = Array.from({ length: 9 }, () => new Set<string>());
  const boxes = Array.from({ length: 9 }, () => new Set<string>());

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val === '.') continue;

      const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);

      if (rows[r].has(val) || cols[c].has(val) || boxes[boxIdx].has(val)) {
        return false;
      }

      rows[r].add(val);
      cols[c].add(val);
      boxes[boxIdx].add(val);
    }
  }

  return true;
}`,
        lineByLine: [
          'Line 2-4: creates arrays of 9 Sets for rows, columns, and 3x3 sub-boxes.',
          'Line 6-7: single 2D loop visiting each of the 81 cells exactly once.',
          'Line 11: "if (val === \'.\') continue;" — skips empty cells.',
          'Line 14: "const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);" — converts row & column coordinates into box index 0 to 8.',
          'Line 17: "if (rows[r].has(val) || cols[c].has(val) || boxes[boxIdx].has(val)) return false;" — instant collision detection.',
          'Line 21-23: registers digit in row, column, and box Sets simultaneously.'
        ],
        dryRun: [
          { step: 1, state: 'r=0, c=0, val="5"', action: 'boxIdx = 0*3 + 0 = 0', result: 'rows[0]={5}, cols[0]={5}, boxes[0]={5}' },
          { step: 2, state: 'r=0, c=1, val="3"', action: 'boxIdx = 0*3 + 0 = 0', result: 'rows[0]={5,3}, cols[1]={3}, boxes[0]={5,3}' },
          { step: 3, state: 'r=1, c=0, val="6"', action: 'boxIdx = 0*3 + 0 = 0', result: 'rows[1]={6}, cols[0]={5,6}, boxes[0]={5,3,6}' },
          { step: 4, state: 'r=2, c=2, val="5"', action: 'boxIdx = 0*3 + 0 = 0', result: 'boxes[0].has("5") is TRUE! Collision! Returns false.' }
        ],
        complexityDerivation: `**Time Complexity**: $O(1)$ (specifically, exactly 81 iterations). Every cell is processed once with $O(1)$ Set lookups and insertions.
**Space Complexity**: $O(1)$ memory. In the worst case, 81 digits are stored across the sets, which is constant bounded space.`
      },
      {
        name: 'Approach 3: Bitmasking Optimization',
        badge: 'High-Performance / Bit Manipulation',
        timeComplexity: 'O(1) / O(81)',
        spaceComplexity: 'O(1) / 27 integers',
        summary: 'Replace Sets with 9-bit binary integers, using bitwise AND (&) and OR (|) operations.',
        intuition: `Since Sudoku digits are only 1 through 9, we can represent digits seen in each row, col, and box as bits in an integer.
For digit \`d\`, bit mask is \`1 << d\`.
- Check if bit is set: \`(rowMask & (1 << d)) !== 0\`.
- Set the bit: \`rowMask |= (1 << d)\`.
This uses zero heap allocations and runs in pure CPU register arithmetic!`,
        codeJS: `function isValidSudoku(board) {
  const rows = new Int16Array(9);
  const cols = new Int16Array(9);
  const boxes = new Int16Array(9);

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const char = board[r][c];
      if (char === '.') continue;

      const num = char.charCodeAt(0) - 48; // Fast char to digit conversion
      const mask = 1 << num;
      const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);

      // Bitwise AND checks if bit has already been flipped to 1
      if ((rows[r] & mask) || (cols[c] & mask) || (boxes[boxIdx] & mask)) {
        return false;
      }

      // Bitwise OR sets the bit to 1
      rows[r] |= mask;
      cols[c] |= mask;
      boxes[boxIdx] |= mask;
    }
  }

  return true;
}`,
        codeTS: `function isValidSudoku(board: string[][]): boolean {
  const rows = new Int16Array(9);
  const cols = new Int16Array(9);
  const boxes = new Int16Array(9);

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const char = board[r][c];
      if (char === '.') continue;

      const num = char.charCodeAt(0) - 48;
      const mask = 1 << num;
      const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);

      if ((rows[r] & mask) || (cols[c] & mask) || (boxes[boxIdx] & mask)) {
        return false;
      }

      rows[r] |= mask;
      cols[c] |= mask;
      boxes[boxIdx] |= mask;
    }
  }

  return true;
}`,
        lineByLine: [
          'Line 2-4: allocates three Int16Arrays of size 9 (total memory 54 bytes).',
          'Line 10: "const num = char.charCodeAt(0) - 48;" — turns \'1\'-\'9\' into integer 1-9 without string coercion.',
          'Line 11: "const mask = 1 << num;" — creates binary mask (e.g. for digit 3, 1 << 3 = 1000₂ = 8).',
          'Line 15: "(rows[r] & mask)" — if 3 was previously seen, the 3rd bit is already 1, producing non-zero result (duplicate!).',
          'Line 20: "rows[r] |= mask;" — flips the 3rd bit to 1.'
        ],
        dryRun: [
          { step: 1, state: 'r=0, c=0, char="3"', action: 'num=3, mask=1<<3 = 8', result: 'rows[0] |= 8 -> rows[0] is 8 (1000₂)' },
          { step: 2, state: 'r=0, c=4, char="3"', action: 'num=3, mask=8', result: 'rows[0] & 8 is 8 (truthy) -> Duplicate detected! Returns false.' }
        ],
        complexityDerivation: `**Time Complexity**: $O(81) = O(1)$ executed via single-cycle CPU bitwise operations.
**Space Complexity**: $O(1)$ using 27 16-bit integers (54 bytes of stack/buffer memory).`
      }
    ],
    comparisonTable: [
      { approach: 'Three Separate Passes', time: 'O(1) [243 ops]', space: 'O(1) [1 Set]', pros: 'Easiest to write without box math', cons: 'Traverses board 3 times' },
      { approach: 'Single Pass with Hash Sets', time: 'O(1) [81 ops]', space: 'O(1) [27 Sets]', pros: 'Clean, readable, single pass', cons: 'Allocates 27 JS Set objects on heap' },
      { approach: 'Bitmasking Optimization', time: 'O(1) [81 ops]', space: 'O(1) [54 bytes]', pros: 'Ultra high-speed, zero GC pressure', cons: 'Requires bitwise familiarity' }
    ],
    interviewPitch: `**How to speak this in an interview (60-second pitch):**
"To validate a 9x9 Sudoku board, we must verify that digits 1 through 9 appear at most once across all rows, columns, and 3x3 sub-boxes. Rather than making three separate passes, I do this in a single pass of 81 cells.

I maintain arrays of 9 Hash Sets for rows, columns, and boxes. For any cell at coordinates \`(r, c)\`, its sub-box index is computed mathematically as \`Math.floor(r / 3) * 3 + Math.floor(c / 3)\`. If the cell is not empty, I check if the digit already exists in \`rows[r]\`, \`cols[c]\`, or \`boxes[boxIndex]\`. If so, I return \`false\` immediately. Otherwise, I insert it into all three. This runs in $O(1)$ time and $O(1)$ space. As an optimization, we can replace the sets with 9-bit integer bitmasks to achieve zero heap allocations."`,
    followUps: [
      {
        question: 'How do you derive the sub-box formula Math.floor(r / 3) * 3 + Math.floor(c / 3)?',
        answer: 'Since each sub-box is 3x3, there are 3 box rows and 3 box columns. Math.floor(r / 3) yields the box row (0, 1, or 2), which we multiply by 3 to get the base box index offset (0, 3, or 6). Then adding Math.floor(c / 3) gives the exact box index between 0 and 8.'
      },
      {
        question: 'Does this problem check if the Sudoku puzzle is solvable?',
        answer: 'No. The problem explicitly states we only validate current placed digits. Solvability requires Backtracking (LeetCode #37 Sudoku Solver).'
      }
    ],
    recallQuiz: {
      question: 'For a cell at row 7, col 4, what is its 3x3 sub-box index?',
      options: [
        'Box 7',
        'Box 5',
        'Box 4',
        'Box 8'
      ],
      correctIndex: 0,
      explanation: 'Math.floor(7 / 3) * 3 + Math.floor(4 / 3) = 2 * 3 + 1 = 6 + 1 = 7. It belongs to sub-box index 7.'
    }
  }
};
