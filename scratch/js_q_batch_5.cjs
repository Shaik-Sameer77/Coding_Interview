// scratch/js_q_batch_5.cjs - Questions 161 to 200
module.exports = [
  {
    id: 161,
    topicId: 11,
    difficulty: "Intermediate",
    category: "Array Algorithms",
    question: "Coding Challenge: Rotate an Array by K Positions (2 Methods)",
    answer: "Rotate array to right by K steps (e.g. `[1,2,3,4,5], k=2` -> `[4,5,1,2,3]`).\n• **Method 1: Three Reversals In-Place (Optimal O(N) Time, O(1) Space)**\n• **Method 2: Slice and Spread (O(N) Space)**.",
    approaches: [
      {
        title: "Approach 1: Three Reversals In-Place (Optimal O(1) Space)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "1. Reverse whole array. 2. Reverse first k elements. 3. Reverse remaining n - k elements.",
        code: `function rotateArray(nums, k) {
  k = k % nums.length;
  const rev = (s, e) => {
    while (s < e) {
      [nums[s], nums[e]] = [nums[e], nums[s]];
      s++; e--;
    }
  };
  rev(0, nums.length - 1);
  rev(0, k - 1);
  rev(k, nums.length - 1);
  return nums;
}
console.log(rotateArray([1, 2, 3, 4, 5, 6, 7], 3)); // [5, 6, 7, 1, 2, 3, 4]`
      },
      {
        title: "Approach 2: Slice and Concat",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        explanation: "Slices last k elements and prepends to remainder.",
        code: `const rotateSlice = (nums, k) => [...nums.slice(-(k % nums.length)), ...nums.slice(0, -(k % nums.length))];`
      }
    ]
  },
  {
    id: 162,
    topicId: 11,
    difficulty: "Junior",
    category: "Array Algorithms",
    question: "Coding Challenge: Move All Zeroes to End of Array (2 Methods)",
    answer: "Move 0's to end while maintaining relative order of non-zeroes.\n• **Method 1: In-Place Two-Pointer Write Index (Optimal O(N) Time, O(1) Space)**\n• **Method 2: Non-mutating filter and pad**.",
    approaches: [
      {
        title: "Approach 1: In-Place Write Pointer (Optimal O(1) Space)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Writes non-zero elements forward into `writeIdx`, then fills tail with zeroes.",
        code: `function moveZeroes(nums) {
  let write = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) nums[write++] = nums[i];
  }
  while (write < nums.length) nums[write++] = 0;
  return nums;
}
console.log(moveZeroes([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]`
      }
    ]
  },
  {
    id: 163,
    topicId: 11,
    difficulty: "Junior",
    category: "Array Algorithms",
    question: "Coding Challenge: Check if an Array is Sorted (2 Methods)",
    answer: "Verify whether elements are in non-decreasing order.\n• **Method 1: Linear Loop with early exit (Optimal O(N) Time, O(1) Space)**\n• **Method 2: Array.prototype.every()**.",
    code: `function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}
console.log(isSorted([1, 2, 3, 5, 9])); // true`
  },
  {
    id: 164,
    topicId: 11,
    difficulty: "Junior",
    category: "Math & Bitwise",
    question: "Coding Challenge: Find the Missing Number in Range 1 to N (3 Methods)",
    answer: "Find missing integer in array of size N - 1 from 1 to N.\n• **Method 1: Gauss Sum Formula: (N * (N + 1)) / 2 - sum(arr) (Optimal O(N) Time, O(1) Space)**\n• **Method 2: XOR Bitwise Cancellation**\n• **Method 3: Set Presence Check**.",
    approaches: [
      {
        title: "Approach 1: Gauss Sum Formula (Optimal)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Difference between expected sum of 1..N and actual sum equals missing number.",
        code: `function findMissingNumber(nums, n) {
  const expected = (n * (n + 1)) / 2;
  const actual = nums.reduce((a, b) => a + b, 0);
  return expected - actual;
}
console.log(findMissingNumber([1, 2, 4, 5, 6], 6)); // 3`
      },
      {
        title: "Approach 2: XOR Bitwise (Prevents Overflow)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "XOR 1..N and then XOR each element. Duplicates cancel out ($x \\oplus x = 0$).",
        code: `function findMissingXOR(nums, n) {
  let xor = 0;
  for (let i = 1; i <= n; i++) xor ^= i;
  for (const num of nums) xor ^= num;
  return xor;
}`
      }
    ]
  },
  {
    id: 165,
    topicId: 11,
    difficulty: "Intermediate",
    category: "Array Algorithms",
    question: "Coding Challenge: Find All Numbers Disappeared in an Array (2 Methods)",
    answer: "Find numbers in range [1, N] missing from array of size N.\n• **Method 1: In-Place Sign Negation (O(N) Time, O(1) Auxiliary Space)**\n• **Method 2: Set lookup**.",
    approaches: [
      {
        title: "Approach 1: In-Place Sign Negation (Optimal O(1) Space)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Uses values as array indices and negates `nums[val - 1]`. Positive values at end indicate missing numbers.",
        code: `function findDisappearedNumbers(nums) {
  for (let i = 0; i < nums.length; i++) {
    const idx = Math.abs(nums[i]) - 1;
    if (nums[idx] > 0) nums[idx] = -nums[idx];
  }
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) result.push(i + 1);
  }
  return result;
}
console.log(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])); // [5, 6]`
      }
    ]
  },
  {
    id: 166,
    topicId: 11,
    difficulty: "Junior",
    category: "String Algorithms",
    question: "Coding Challenge: Find the Longest Word in a Sentence (2 Methods)",
    answer: "Extract longest word ignoring punctuation.\n• **Method 1: regex strip + split + reduce (Optimal O(N))**\n• **Method 2: regex match + sort**.",
    code: `function findLongestWord(sentence) {
  const words = sentence.replace(/[^a-zA-Z0-9\\s]/g, "").split(/\\s+/);
  return words.reduce((max, w) => w.length > max.length ? w : max, "");
}
console.log(findLongestWord("The quick brown fox jumped over the lazy dog")); // "jumped"`
  },
  {
    id: 167,
    topicId: 11,
    difficulty: "Junior",
    category: "String Algorithms",
    question: "Coding Challenge: Capitalize First Letter of Every Word (Title Case) (2 Methods)",
    answer: "Convert string to Title Case.\n• **Method 1: split + map + slice (Functional)**\n• **Method 2: regex \\b\\w replace**.",
    code: `function titleCase(str) {
  return str.toLowerCase().replace(/\\b[a-z]/g, c => c.toUpperCase());
}
console.log(titleCase("senior frontend engineer at google")); // "Senior Frontend Engineer At Google"`
  },
  {
    id: 168,
    topicId: 11,
    difficulty: "Junior",
    category: "String Algorithms",
    question: "Coding Challenge: Count Vowels in a String (2 Methods)",
    answer: "Count vowels (a, e, i, o, u) case-insensitively.\n• **Method 1: Set lookup in loop (O(N) Time, O(1) Space)**\n• **Method 2: regex match: `(str.match(/[aeiou]/gi) || []).length`**.",
    code: `function countVowels(str) {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  let count = 0;
  for (const char of str.toLowerCase()) {
    if (vowels.has(char)) count++;
  }
  return count;
}
console.log(countVowels("JavaScript")); // 3`
  },
  {
    id: 169,
    topicId: 11,
    difficulty: "Intermediate",
    category: "String Algorithms",
    question: "Coding Challenge: String Compression (Run-Length Encoding) (2 Methods)",
    answer: "Compress consecutive repeating characters (e.g. \"aabcccccaaa\" -> \"a2b1c5a3\"). Return original if compressed is not shorter.\n• **Time**: **O(N)** | **Space**: **O(N)**.",
    code: `function compressString(s) {
  let compressed = "";
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    count++;
    if (i + 1 >= s.length || s[i] !== s[i + 1]) {
      compressed += s[i] + count;
      count = 0;
    }
  }
  return compressed.length < s.length ? compressed : s;
}
console.log(compressString("aabcccccaaa")); // "a2b1c5a3"`
  },
  {
    id: 170,
    topicId: 11,
    difficulty: "Intermediate",
    category: "Stack Algorithms",
    question: "Coding Challenge: Valid Parentheses / Balanced Brackets (Stack) (2 Methods)",
    answer: "Validate strings containing '(', ')', '{', '}', '[', ']'.\n• **Method 1: Map-based Stack (Optimal O(N) Time, O(N) Space)**\n• Push opening brackets; pop and verify match on closing brackets.",
    approaches: [
      {
        title: "Approach 1: Map Stack (Optimal O(N))",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        explanation: "Uses a stack to store expected closing brackets. When an opening bracket is seen, push its counterpart. When a closing bracket is seen, pop and check equality.",
        code: `function isValidParentheses(s) {
  const stack = [];
  const map = { "(": ")", "{": "}", "[": "]" };

  for (const char of s) {
    if (map[char]) {
      stack.push(map[char]);
    } else if (stack.pop() !== char) {
      return false;
    }
  }

  return stack.length === 0;
}
console.log(isValidParentheses("()[]{}")); // true
console.log(isValidParentheses("(]"));     // false`
      }
    ]
  },
  {
    id: 171,
    topicId: 11,
    difficulty: "Junior",
    category: "String Algorithms",
    question: "Coding Challenge: Reverse Words in a Sentence (2 Methods)",
    answer: "Reverse the order of words in a sentence, trimming redundant whitespace.\n• `s.trim().split(/\\s+/).reverse().join(' ')`.\n• **Time**: **O(N)** | **Space**: **O(N)**.",
    code: `function reverseWords(s) {
  return s.trim().split(/\\s+/).reverse().join(" ");
}
console.log(reverseWords("  hello   world  ")); // "world hello"`
  },
  {
    id: 172,
    topicId: 11,
    difficulty: "Junior",
    category: "String Algorithms",
    question: "Coding Challenge: Truncate a String with Ellipsis (2 Methods)",
    answer: "Truncate string to maxLength including '...' if exceeded.\n• **Time**: **O(1)**.",
    code: `function truncateString(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
console.log(truncateString("Senior JavaScript Engineer", 10)); // "Senior ..." `
  },
  {
    id: 173,
    topicId: 11,
    difficulty: "Intermediate",
    category: "Two Pointers",
    question: "Coding Challenge: Merge Two Sorted Arrays (2 Methods)",
    answer: "Merge two sorted arrays into one sorted array in $O(M + N)$ time.\n• **Method 1: Two Pointers (Optimal O(M + N) Time, O(M + N) Space)**\n• **Method 2: Concat + Sort (O((M + N) log(M + N)))**.",
    approaches: [
      {
        title: "Approach 1: Two Pointers (Optimal O(M + N))",
        timeComplexity: "O(M + N)",
        spaceComplexity: "O(M + N)",
        explanation: "Pointers compare current elements of both arrays, pushing the smaller element.",
        code: `function mergeSortedArrays(a, b) {
  const result = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) result.push(a[i++]);
    else result.push(b[j++]);
  }
  return result.concat(a.slice(i)).concat(b.slice(j));
}
console.log(mergeSortedArrays([1, 3, 5], [2, 4, 6])); // [1, 2, 3, 4, 5, 6]`
      }
    ]
  },
  {
    id: 174,
    topicId: 11,
    difficulty: "Intermediate",
    category: "Two Pointers",
    question: "Coding Challenge: Container With Most Water (2 Methods)",
    answer: "Find two lines that form a container containing the most water.\n• **Method 1: Two Pointers inward (Optimal O(N) Time, O(1) Space)**\n• Move the pointer pointing to the shorter vertical line inward.\n• **Method 2: Brute Force O(N²)**.",
    approaches: [
      {
        title: "Approach 1: Two Pointers (Optimal O(N))",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Pointers at both ends calculate current area `Math.min(h[l], h[r]) * (r - l)`. Shrink the pointer with the smaller height.",
        code: `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let max = 0;
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    if (area > max) max = area;
    if (height[left] < height[right]) left++;
    else right--;
  }
  return max;
}
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49`
      }
    ]
  },
  {
    id: 175,
    topicId: 11,
    difficulty: "Intermediate",
    category: "Dynamic Programming",
    question: "Coding Challenge: Maximum Subarray Sum (Kadane's Algorithm) (2 Methods)",
    answer: "Find contiguous subarray with largest sum in $O(N)$ time.\n• **Kadane's Algorithm**: `currentSum = Math.max(num, currentSum + num); maxSum = Math.max(maxSum, currentSum)`.\n• **Time**: **O(N)** | **Space**: **O(1)**.",
    approaches: [
      {
        title: "Approach 1: Kadane's Algorithm (Optimal O(N))",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Iterates through array, deciding at each element whether to add to existing subarray or start a new subarray.",
        code: `function maxSubArray(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6 ([4,-1,2,1])`
      }
    ]
  },

  // TOPIC 12: Advanced DSA & Functional Patterns in JS (Q176–200)
  {
    id: 176,
    topicId: 12,
    difficulty: "Intermediate",
    category: "Sliding Window",
    question: "Coding Challenge: Longest Substring Without Repeating Characters (2 Methods)",
    answer: "Find length of longest substring without duplicates.\n• **Method 1: Sliding Window with Map of Last Indices (Optimal O(N) Time, O(K) Space)**\n• **Method 2: Set window (O(2N) Time)**.",
    approaches: [
      {
        title: "Approach 1: Sliding Window with Map (Optimal O(N))",
        timeComplexity: "O(N)",
        spaceComplexity: "O(min(M, N))",
        explanation: "Expands right pointer. If character was seen within current window, jump left pointer to `lastSeenIndex + 1`.",
        code: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let max = 0, left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    max = Math.max(max, right - left + 1);
  }

  return max;
}
console.log(lengthOfLongestSubstring("abcabcbb")); // 3 ("abc")`
      }
    ]
  },
  {
    id: 177,
    topicId: 12,
    difficulty: "Intermediate",
    category: "Two Pointers",
    question: "Coding Challenge: 3Sum Problem (2 Methods)",
    answer: "Find all unique triplets in array that sum to zero.\n• Sort array ($O(N \\log N)$), loop index $i$, and run Two-Pointers on remaining elements while skipping duplicates.\n• **Time**: **O(N²)** | **Space**: **O(1)** auxiliary.",
    code: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // Skip duplicate i
    let left = i + 1, right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }

  return result;
}
console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1, -1, 2], [-1, 0, 1]]`
  },
  {
    id: 178,
    topicId: 12,
    difficulty: "Senior",
    category: "Two Pointers",
    question: "Coding Challenge: Trapping Rain Water (2 Methods)",
    answer: "Calculate total trapped rainwater.\n• **Method 1: Two Pointers with leftMax & rightMax (Optimal O(N) Time, O(1) Space)**\n• **Method 2: Prefix and Suffix Max arrays (O(N) Time, O(N) Space)**.",
    approaches: [
      {
        title: "Approach 1: Two Pointers (Optimal O(1) Space)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Tracks leftMax and rightMax, advancing the pointer with the smaller maximum.",
        code: `function trapRainWater(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let total = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else total += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else total += rightMax - height[right];
      right--;
    }
  }

  return total;
}
console.log(trapRainWater([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 6`
      }
    ]
  },
  {
    id: 179,
    topicId: 12,
    difficulty: "Intermediate",
    category: "Object Recursion",
    question: "Coding Challenge: Flatten Deeply Nested Object with Dot Paths (2 Methods)",
    answer: "Convert nested object to flat dictionary with key paths (e.g. `{ a: { b: 1 } }` -> `{ 'a.b': 1 }`).\n• **Time**: **O(N)** | **Space**: **O(D)**.",
    code: `function flattenObject(obj, prefix = "", res = {}) {
  for (const key of Object.keys(obj)) {
    const propName = prefix ? \`\${prefix}.\${key}\` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObject(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}
console.log(flattenObject({ user: { address: { city: "Hyderabad" } } }));
// { "user.address.city": "Hyderabad" }`
  },
  {
    id: 180,
    topicId: 12,
    difficulty: "Intermediate",
    category: "Sliding Window",
    question: "Coding Challenge: Find All Anagrams in a String (Sliding Window) (2 Methods)",
    answer: "Find all start indices of anagrams of string p in s.\n• **Sliding window of length p.length comparing character frequency map.**\n• **Time**: **O(N)** | **Space**: **O(1)**.",
    code: `function findAnagrams(s, p) {
  const result = [];
  if (s.length < p.length) return result;

  const pCounts = new Array(26).fill(0);
  const sCounts = new Array(26).fill(0);
  const aCode = "a".charCodeAt(0);

  for (let i = 0; i < p.length; i++) {
    pCounts[p.charCodeAt(i) - aCode]++;
    sCounts[s.charCodeAt(i) - aCode]++;
  }

  const matches = (a, b) => a.every((v, i) => v === b[i]);
  if (matches(sCounts, pCounts)) result.push(0);

  for (let i = p.length; i < s.length; i++) {
    sCounts[s.charCodeAt(i) - aCode]++;
    sCounts[s.charCodeAt(i - p.length) - aCode]--;
    if (matches(sCounts, pCounts)) result.push(i - p.length + 1);
  }

  return result;
}
console.log(findAnagrams("cbaebabacd", "abc")); // [0, 6]`
  },
  {
    id: 181,
    topicId: 12,
    difficulty: "Junior",
    category: "Tree Algorithms",
    question: "Coding Challenge: Invert a Binary Tree (2 Methods)",
    answer: "Swap left and right children for every node in a binary tree.\n• **Method 1: Recursive DFS (Optimal O(N) Time, O(H) Space)**\n• **Method 2: Iterative BFS with Queue**.",
    code: `function invertTree(root) {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`
  },
  {
    id: 182,
    topicId: 12,
    difficulty: "Junior",
    category: "Two Pointers",
    question: "Coding Challenge: Valid Palindrome II (At most one character removal) (2 Methods)",
    answer: "Check if string can be a palindrome by deleting at most one character.\n• Two pointers from ends. On first mismatch, test if either `s.slice(l+1, r+1)` or `s.slice(l, r)` is palindrome.\n• **Time**: **O(N)** | **Space**: **O(1)**.",
    code: `function validPalindromeII(s) {
  const isPal = (str, l, r) => {
    while (l < r) {
      if (str[l] !== str[r]) return false;
      l++; r--;
    }
    return true;
  };

  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) {
      return isPal(s, l + 1, r) || isPal(s, l, r - 1);
    }
    l++; r--;
  }
  return true;
}
console.log(validPalindromeII("abca")); // true (remove 'c')`
  },
  {
    id: 183,
    topicId: 12,
    difficulty: "Intermediate",
    category: "Array Algorithms",
    question: "Coding Challenge: Product of Array Except Self without Division (2 Methods)",
    answer: "Calculate product of all elements except `nums[i]` without using division operator.\n• **Prefix products pass Left-to-Right, Suffix products pass Right-to-Left.**\n• **Time**: **O(N)** | **Space**: **O(1)** extra memory.",
    approaches: [
      {
        title: "Approach 1: Prefix & Suffix in Single Result (Optimal O(1) Extra Space)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1) auxiliary",
        explanation: "First pass computes prefix products. Second pass multiplies with running suffix product.",
        code: `function productExceptSelf(nums) {
  const n = nums.length;
  const res = new Array(n).fill(1);

  let prefix = 1;
  for (let i = 0; i < n; i++) {
    res[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= suffix;
    suffix *= nums[i];
  }

  return res;
}
console.log(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]`
      }
    ]
  },
  {
    id: 184,
    topicId: 12,
    difficulty: "Intermediate",
    category: "Set Algorithms",
    question: "Coding Challenge: Longest Consecutive Sequence in Unsorted Array (2 Methods)",
    answer: "Find length of longest consecutive elements sequence in unsorted array in $O(N)$ time.\n• **Method: Set lookups ($O(N)$)**: Store numbers in a Set. Only initiate a sequence check if `!set.has(num - 1)` (the start of a sequence).",
    code: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let longest = 0;

  for (const num of set) {
    if (!set.has(num - 1)) { // Only start counting from beginning of streak
      let current = num;
      let streak = 1;
      while (set.has(current + 1)) {
        current++;
        streak++;
      }
      longest = Math.max(longest, streak);
    }
  }

  return longest;
}
console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4 ([1,2,3,4])`
  },
  {
    id: 185,
    topicId: 12,
    difficulty: "Intermediate",
    category: "Matrix Algorithms",
    question: "Coding Challenge: Spiral Matrix Traversal (2 Methods)",
    answer: "Traverse M x N matrix in spiral order.\n• Maintain 4 boundary pointers (`top`, `bottom`, `left`, `right`) and contract inward.",
    code: `function spiralOrder(matrix) {
  if (!matrix.length) return [];
  const result = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col++) result.push(matrix[top][col]);
    top++;
    for (let row = top; row <= bottom; row++) result.push(matrix[row][right]);
    right--;
    if (top <= bottom) {
      for (let col = right; col >= left; col--) result.push(matrix[bottom][col]);
      bottom--;
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row--) result.push(matrix[row][left]);
      left++;
    }
  }
  return result;
}
console.log(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]])); // [1,2,3,6,9,8,7,4,5]`
  },
  {
    id: 186,
    topicId: 12,
    difficulty: "Intermediate",
    category: "Monotonic Stack",
    question: "Coding Challenge: Daily Temperatures / Next Greater Element (Monotonic Stack)",
    answer: "Find how many days to wait for a warmer temperature.\n• **Monotonic Decreasing Stack stores indices ($O(N)$ Time, $O(N)$ Space).**",
    code: `function dailyTemperatures(temps) {
  const res = new Array(temps.length).fill(0);
  const stack = []; // stores indices

  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      const prevIdx = stack.pop();
      res[prevIdx] = i - prevIdx;
    }
    stack.push(i);
  }

  return res;
}
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])); // [1,1,4,2,1,1,0,0]`
  },
  {
    id: 187,
    topicId: 12,
    difficulty: "Intermediate",
    category: "Prefix Sum",
    question: "Coding Challenge: Subarray Sum Equals K (Prefix Sum Hash Map)",
    answer: "Count contiguous subarrays whose sum equals K.\n• Maintain running prefix sum and map of cumulative frequencies. Check `map.has(sum - k)`.\n• **Time**: **O(N)** | **Space**: **O(N)**.",
    code: `function subarraySum(nums, k) {
  let count = 0, sum = 0;
  const map = new Map([[0, 1]]);

  for (const num of nums) {
    sum += num;
    if (map.has(sum - k)) count += map.get(sum - k);
    map.set(sum, (map.get(sum) || 0) + 1);
  }

  return count;
}
console.log(subarraySum([1, 1, 1], 2)); // 2`
  },
  {
    id: 188,
    topicId: 12,
    difficulty: "Senior",
    category: "Sliding Window",
    question: "Coding Challenge: Minimum Window Substring (Sliding Window with Target Map)",
    answer: "Find shortest substring of s containing all characters of t.\n• **Expand right pointer to satisfy window requirements; contract left pointer to minimize window.**\n• **Time**: **O(N)** | **Space**: **O(K)**.",
    code: `function minWindow(s, t) {
  if (!s || !t) return "";
  const target = new Map();
  for (const c of t) target.set(c, (target.get(c) || 0) + 1);

  let left = 0, right = 0, required = target.size;
  let minLen = Infinity, start = 0;
  const windowCounts = new Map();
  let formed = 0;

  while (right < s.length) {
    const c = s[right];
    windowCounts.set(c, (windowCounts.get(c) || 0) + 1);
    if (target.has(c) && windowCounts.get(c) === target.get(c)) formed++;

    while (left <= right && formed === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        start = left;
      }
      const charLeft = s[left];
      windowCounts.set(charLeft, windowCounts.get(charLeft) - 1);
      if (target.has(charLeft) && windowCounts.get(charLeft) < target.get(charLeft)) formed--;
      left++;
    }
    right++;
  }

  return minLen === Infinity ? "" : s.slice(start, start + minLen);
}
console.log(minWindow("ADOBECODEBANC", "ABC")); // "BANC"`
  },
  {
    id: 189,
    topicId: 12,
    difficulty: "Senior",
    category: "Functional Patterns",
    question: "Coding Challenge: Currying Function Implementation (2 Types)",
    answer: "Currying transforms a multi-argument function into a chain of unary functions.\n• **Type 1: Fixed Arity (`curry(fn)`)** checks accumulated args vs `fn.length`.\n• **Type 2: Infinite Currying (`add(1)(2)(3)...()`)** terminates on empty invocation.",
    code: `// Type 1: Fixed Arity
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...next) => curried.apply(this, args.concat(next));
  };
}
const sum3 = (a, b, c) => a + b + c;
console.log(curry(sum3)(1)(2)(3)); // 6

// Type 2: Infinite Currying
function infiniteAdd(a) {
  return function(b) {
    if (b === undefined) return a;
    return infiniteAdd(a + b);
  };
}
console.log(infiniteAdd(1)(2)(3)(4)()); // 10`
  },
  {
    id: 190,
    topicId: 12,
    difficulty: "Intermediate",
    category: "Functional Patterns",
    question: "Coding Challenge: Function Composition (compose and pipe) (2 Methods)",
    answer: "• `pipe(f, g, h)(x)`: Left-to-Right: $h(g(f(x)))$.\n• `compose(f, g, h)(x)`: Right-to-Left: $f(g(h(x)))$.",
    code: `const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

const add5 = x => x + 5;
const double = x => x * 2;
console.log(pipe(add5, double)(10));    // 30 ((10+5)*2)
console.log(compose(add5, double)(10)); // 25 ((10*2)+5)`
  },
  {
    id: 191,
    topicId: 12,
    difficulty: "Intermediate",
    category: "Performance",
    question: "Coding Challenge: Function Memoization Implementation (2 Methods)",
    answer: "Cache return values of pure functions keyed on input arguments.",
    code: `function memoize(fn, resolver) {
  const cache = new Map();
  return function(...args) {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
const slowFib = n => n <= 1 ? n : slowFib(n - 1) + slowFib(n - 2);
const fastFib = memoize(slowFib);
console.log(fastFib(35)); // 9227465 (Instant!)`
  },
  {
    id: 192,
    topicId: 12,
    difficulty: "Intermediate",
    category: "Async JS",
    question: "Coding Challenge: Promisify a Node.js Callback Function (2 Methods)",
    answer: "Convert error-first callback signature `(err, data) => {}` to a Promise.",
    code: `function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };
}`
  },
  {
    id: 193,
    topicId: 12,
    difficulty: "Senior",
    category: "Polyfill",
    question: "Coding Challenge: Custom Promise.all() Polyfill (2 Approaches)",
    answer: "Wait for all promises to fulfill or reject on first rejection. Store at exact indices.",
    code: `function customPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) return reject(new TypeError("Array required"));
    const results = [];
    let done = 0;
    if (promises.length === 0) return resolve(results);

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(val => {
          results[i] = val;
          if (++done === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}`
  },
  {
    id: 194,
    topicId: 12,
    difficulty: "Senior",
    category: "Polyfill",
    question: "Coding Challenge: Custom Promise.allSettled() Polyfill (2 Approaches)",
    answer: "Never rejects. Returns array of `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`.",
    code: `function customAllSettled(promises) {
  const wrapped = promises.map(p =>
    Promise.resolve(p)
      .then(value => ({ status: "fulfilled", value }))
      .catch(reason => ({ status: "rejected", reason }))
  );
  return Promise.all(wrapped);
}`
  },
  {
    id: 195,
    topicId: 12,
    difficulty: "Senior",
    category: "Polyfill",
    question: "Coding Challenge: Custom Promise.race() & Promise.any() Polyfills",
    answer: "• race: settles on 1st promise settled.\n• any: fulfills on 1st promise fulfilled, rejects with AggregateError only if all reject.",
    code: `function customRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => Promise.resolve(p).then(resolve, reject));
  });
}

function customAny(promises) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let rejectedCount = 0;
    if (!promises.length) return reject(new AggregateError([], "All rejected"));

    promises.forEach((p, idx) => {
      Promise.resolve(p).then(resolve).catch(err => {
        errors[idx] = err;
        if (++rejectedCount === promises.length) {
          reject(new AggregateError(errors, "All promises were rejected"));
        }
      });
    });
  });
}`
  },
  {
    id: 196,
    topicId: 12,
    difficulty: "Senior",
    category: "Concurrency",
    question: "Coding Challenge: Async Concurrency Limiter (p-limit) (2 Methods)",
    answer: "Execute N async tasks with maximum K active simultaneous workers.",
    code: `function createLimiter(concurrency) {
  let active = 0;
  const queue = [];

  const next = () => {
    if (active >= concurrency || !queue.length) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    fn().then(resolve).catch(reject).finally(() => {
      active--;
      next();
    });
  };

  return function limit(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
  };
}`
  },
  {
    id: 197,
    topicId: 12,
    difficulty: "Intermediate",
    category: "System Patterns",
    question: "Coding Challenge: Custom Event Emitter Class (on, off, emit, once)",
    answer: "Implement publish-subscribe event emitter with unsubscribe closures.",
    code: `class EventEmitter {
  constructor() { this.events = new Map(); }
  on(event, cb) {
    if (!this.events.has(event)) this.events.set(event, new Set());
    this.events.get(event).add(cb);
    return () => this.off(event, cb);
  }
  off(event, cb) {
    this.events.get(event)?.delete(cb);
  }
  emit(event, ...args) {
    this.events.get(event)?.forEach(cb => cb(...args));
  }
  once(event, cb) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      cb(...args);
    };
    return this.on(event, wrapper);
  }
}`
  },
  {
    id: 198,
    topicId: 12,
    difficulty: "Senior",
    category: "Data Structures",
    question: "Coding Challenge: LRU Cache (Least Recently Used) in O(1) Time (2 Methods)",
    answer: "Get and put in O(1) time.\n• **Method 1: ES6 Map (Exploits insertion order eviction - Cleanest & Fastest in JS)**\n• Delete and set moves key to most recent.\n• First key in `map.keys().next().value` is oldest.\n• **Method 2: Doubly Linked List + HashMap**.",
    approaches: [
      {
        title: "Approach 1: ES6 Map (Optimal O(1))",
        timeComplexity: "O(1) get & put",
        spaceComplexity: "O(Capacity)",
        explanation: "JavaScript Map maintains insertion order. On get, delete and re-insert to refresh recency. On put when full, delete `map.keys().next().value` (oldest).",
        code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }
    this.cache.set(key, value);
  }
}
const lru = new LRUCache(2);
lru.put(1, "A"); lru.put(2, "B");
console.log(lru.get(1)); // "A"
lru.put(3, "C"); // Evicts 2!
console.log(lru.get(2)); // -1`
      }
    ]
  },
  {
    id: 199,
    topicId: 12,
    difficulty: "Junior",
    category: "Binary Search",
    question: "Coding Challenge: Binary Search on Sorted Array (2 Methods)",
    answer: "Find target in sorted array in $O(\\log N)$ time.\n• `mid = Math.floor(left + (right - left) / 2)` prevents integer overflow.",
    code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
console.log(binarySearch([1, 3, 5, 7, 9, 11], 7)); // 3`
  },
  {
    id: 200,
    topicId: 12,
    difficulty: "Intermediate",
    category: "Binary Search",
    question: "Coding Challenge: Search in Rotated Sorted Array (2 Methods)",
    answer: "Search target in rotated sorted array in $O(\\log N)$ time.\n• One half (left to mid OR mid to right) is ALWAYS sorted. Check if target lies in sorted half.",
    code: `function searchRotated(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;

    // Left half sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else { // Right half sorted
      if (target > nums[mid] && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4`
  }
];
