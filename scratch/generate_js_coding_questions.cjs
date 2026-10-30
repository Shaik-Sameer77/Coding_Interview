// Script to generate questions 151 to 200 with multiple approaches for each coding challenge
const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('d:/React_Machine_Coding/senior-machine-coding-suite/src/javascript/data/javascriptInterviewData.js');

const newQuestions = [
  // TOPIC 11: Essential Coding Challenges (Multiple Approaches) (Q151–175)
  {
    id: 151,
    topicId: 11,
    question: "Coding Challenge: Find the Largest and Smallest Number in an Array (3 Methods)",
    answer: `Finding the minimum and maximum values in an array is one of the most common screening questions.

**Method 1: Math.max / Math.min with Spread Operator (Cleanest & Fastest for small arrays)**
• \`Math.max(...arr)\` and \`Math.min(...arr)\`.
• Note: Fails with \`RangeError: Maximum call stack size exceeded\` if array has > 65,536 elements.

**Method 2: Array.prototype.reduce() (Functional & Safe for large arrays)**
• Iterates array elements in $O(N)$ time without call stack limits.

**Method 3: Classic Single-Pass Loop (Optimal $O(N)$ time, $O(1)$ space)**
• Tracks \`min\` and \`max\` simultaneously, initializing with \`arr[0]\`.
• Most robust in production and handles edge cases gracefully.`,
    code: `// Method 1: Built-in Math (Cleanest)
function findMinMaxMath(arr) {
  if (!arr.length) throw new Error("Array is empty");
  return { min: Math.min(...arr), max: Math.max(...arr) };
}

// Method 2: Array.prototype.reduce (Functional)
function findMinMaxReduce(arr) {
  if (!arr.length) throw new Error("Array is empty");
  return arr.reduce((acc, curr) => ({
    min: curr < acc.min ? curr : acc.min,
    max: curr > acc.max ? curr : acc.max
  }), { min: arr[0], max: arr[0] });
}

// Method 3: Classic Single-Pass Loop (Optimal O(N) & Safe for huge arrays)
function findMinMaxLoop(arr) {
  if (!arr.length) throw new Error("Array is empty");
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    else if (arr[i] > max) max = arr[i];
  }
  return { min, max };
}

console.log(findMinMaxLoop([12, 5, 89, -4, 45])); // { min: -4, max: 89 }`
  },
  {
    id: 152,
    topicId: 11,
    question: "Coding Challenge: Find the Second Largest Number in an Array (2 Methods)",
    answer: `Given an array of numbers, return the second largest distinct number.

**Method 1: Optimal Single-Pass Two-Variable Tracking (O(N) Time, O(1) Space)**
• Track \`first = -Infinity\` and \`second = -Infinity\`.
• For each number:
  - If \`num > first\`: update \`second = first\` and \`first = num\`.
  - Else if \`num > second && num !== first\`: update \`second = num\`.
• Interview favorite because it requires **no sorting** and uses constant memory.

**Method 2: Set Deduplication + Sort (O(N log N) Time)**
• Pass array through \`new Set(arr)\` to eliminate duplicate max values.
• Sort descending and take index 1.`,
    code: `// Method 1: Optimal Single Pass O(N) Time, O(1) Space
function getSecondLargest(arr) {
  if (arr.length < 2) return null;
  let first = -Infinity;
  let second = -Infinity;

  for (const num of arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num !== first) {
      second = num;
    }
  }

  return second === -Infinity ? null : second;
}

// Method 2: Set Deduplication + Sort
function getSecondLargestSort(arr) {
  const unique = [...new Set(arr)].sort((a, b) => b - a);
  return unique.length >= 2 ? unique[1] : null;
}

console.log(getSecondLargest([10, 5, 10, 8, 2])); // 8
console.log(getSecondLargest([5, 5, 5]));          // null (no distinct 2nd largest)`
  },
  {
    id: 153,
    topicId: 11,
    question: "Coding Challenge: Group Array of Objects by Property or Callback (3 Methods)",
    answer: `Group items by role, category, or computed criterion (e.g. group students by grade).

**Method 1: Modern Object.groupBy() (ES2024 Native Standard)**
• Built into modern JavaScript: \`Object.groupBy(items, item => item.category)\`.

**Method 2: Array.prototype.reduce() (Standard Polyfill Pattern)**
• Uses nullish assignment (\`acc[key] ??= []\`) to push elements into bucket arrays.

**Method 3: Map-Based Grouping (Supports Object/Non-String Keys)**
• Useful when keys are complex objects, dates, or non-string references.`,
    code: `const inventory = [
  { name: "Asparagus", type: "vegetables", qty: 5 },
  { name: "Banana", type: "fruit", qty: 0 },
  { name: "Carrot", type: "vegetables", qty: 23 },
  { name: "Apple", type: "fruit", qty: 10 }
];

// Method 1: Modern ES2024 Object.groupBy()
// const groupedNative = Object.groupBy(inventory, item => item.type);

// Method 2: reduce() with Nullish Assignment (ES2021+)
function groupByReduce(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
    (acc[key] ??= []).push(item);
    return acc;
  }, {});
}

// Method 3: Map-based (for any key type)
function groupByMap(arr, keyFn) {
  const map = new Map();
  for (const item of arr) {
    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

console.log(groupByReduce(inventory, 'type'));
// { vegetables: [...], fruit: [...] }`
  },
  {
    id: 154,
    topicId: 11,
    question: "Coding Challenge: Character Frequency Counter in a String (3 Methods)",
    answer: `Count the frequency of each character in a string.

**Method 1: Plain Object with for...of & Nullish Coalescing (Most Common)**
• \`counts[char] = (counts[char] ?? 0) + 1\`. Fast and easy to explain.

**Method 2: Map Instance (Type-Safe & No Prototype Conflicts)**
• Eliminates prototype key pollution (e.g. string containing \`'constructor'\` or \`'toString'\`).

**Method 3: Array.prototype.reduce() (Functional 1-Liner)**
• Spread string into array and reduce to frequency dictionary.`,
    code: `// Method 1: Object with Nullish Coalescing
function charFrequencyObject(str) {
  const counts = {};
  for (const char of str) {
    counts[char] = (counts[char] ?? 0) + 1;
  }
  return counts;
}

// Method 2: Map Instance (Safe against prototype keys)
function charFrequencyMap(str) {
  const map = new Map();
  for (const char of str) {
    map.set(char, (map.get(char) ?? 0) + 1);
  }
  return map;
}

// Method 3: Functional reduce()
const charFrequencyReduce = str => 
  [...str].reduce((acc, c) => ((acc[c] = (acc[c] ?? 0) + 1), acc), {});

console.log(charFrequencyObject("javascript"));
// { j: 1, a: 2, v: 1, s: 1, c: 1, r: 1, i: 1, p: 1, t: 1 }`
  },
  {
    id: 155,
    topicId: 11,
    question: "Coding Challenge: Count Element Frequencies in an Array (2 Methods)",
    answer: `Count occurrences of items (strings, numbers, or enum values) in an array.

**Method 1: Map-based Frequency Counter (Handles any value type)**
• \`map.set(item, (map.get(item) ?? 0) + 1)\`.

**Method 2: reduce() Accumulator (Returns JSON serializable object)**
• Perfect for API payloads and frontend state.`,
    code: `// Method 1: Map (Handles numbers, booleans, and objects)
function countArrayItemsMap(arr) {
  const map = new Map();
  for (const item of arr) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }
  return map;
}

// Method 2: reduce()
function countArrayItemsObj(arr) {
  return arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

console.log(countArrayItemsObj(["apple", "banana", "apple", "orange", "banana", "apple"]));
// { apple: 3, banana: 2, orange: 1 }`
  },
  {
    id: 156,
    topicId: 11,
    question: "Coding Challenge: Remove Duplicates from an Array (3 Methods)",
    answer: `Deduplicate elements in an array.

**Method 1: new Set() Spread (O(N) Time, Modern & Most Popular)**
• \`[...new Set(arr)]\`. Instant and handles all primitives.

**Method 2: filter() with indexOf() (O(N²) Time — Useful for explanation)**
• \`arr.filter((item, index) => arr.indexOf(item) === index)\`. Keeps only the first occurrence.

**Method 3: In-Place Two-Pointer on Sorted Array (O(1) Auxiliary Space)**
• Classic LeetCode 26: If the array is already sorted, write unique elements in-place.`,
    code: `// Method 1: Set Spread (Fastest O(N))
function removeDuplicatesSet(arr) {
  return [...new Set(arr)];
}

// Method 2: filter + indexOf
function removeDuplicatesFilter(arr) {
  return arr.filter((val, idx) => arr.indexOf(val) === idx);
}

// Method 3: In-place Two-Pointer on Sorted Array (O(1) Memory)
function removeDuplicatesInPlaceSorted(nums) {
  if (nums.length === 0) return 0;
  let writeIdx = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[writeIdx] = nums[i];
      writeIdx++;
    }
  }
  nums.length = writeIdx; // Truncate array
  return nums;
}

console.log(removeDuplicatesSet([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]
const sortedArr = [1, 1, 2, 2, 3];
removeDuplicatesInPlaceSorted(sortedArr);
console.log(sortedArr); // [1, 2, 3]`
  },
  {
    id: 157,
    topicId: 11,
    question: "Coding Challenge: Find All Duplicate Elements in an Array (2 Methods)",
    answer: `Return an array containing only elements that appear more than once.

**Method 1: Set Tracking (O(N) Time, O(N) Space)**
• Use a \`seen\` Set and a \`duplicates\` Set. If \`seen.has(item)\`, add to \`duplicates\`.

**Method 2: Frequency Map Filtering**
• Count frequencies in a Map and filter keys where \`count > 1\`.`,
    code: `// Method 1: Two Sets (O(N) single pass)
function findDuplicatesSets(arr) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return [...duplicates];
}

// Method 2: Frequency Map
function findDuplicatesMap(arr) {
  const freq = new Map();
  for (const item of arr) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }
  return [...freq.entries()].filter(([_, count]) => count > 1).map(([val]) => val);
}

console.log(findDuplicatesSets([4, 3, 2, 7, 8, 2, 3, 1])); // [2, 3]`
  },
  {
    id: 158,
    topicId: 11,
    question: "Coding Challenge: Intersection of Two Arrays (2 Methods)",
    answer: `Find elements that exist in both array A and array B without duplicates.

**Method 1: Set.prototype.has() Filter (O(M + N) Time)**
• Convert array B into a Set for $O(1)$ lookups, then filter unique elements of A.

**Method 2: Two-Pointers on Sorted Arrays (O(M log M + N log N) Time, O(1) Space)**
• Sort both arrays and increment pointers matching common values.`,
    code: `// Method 1: Set Lookup (Standard O(M + N))
function arrayIntersection(a, b) {
  const setB = new Set(b);
  return [...new Set(a.filter(item => setB.has(item)))];
}

// Method 2: Two-Pointer on Sorted Arrays
function arrayIntersectionSorted(a, b) {
  a.sort((x, y) => x - y);
  b.sort((x, y) => x - y);
  let p1 = 0, p2 = 0;
  const result = new Set();

  while (p1 < a.length && p2 < b.length) {
    if (a[p1] === b[p2]) {
      result.add(a[p1]);
      p1++;
      p2++;
    } else if (a[p1] < b[p2]) {
      p1++;
    } else {
      p2++;
    }
  }

  return [...result];
}

console.log(arrayIntersection([1, 2, 2, 1], [2, 2])); // [2]`
  },
  {
    id: 159,
    topicId: 11,
    question: "Coding Challenge: Difference & Symmetric Difference of Two Arrays (2 Methods)",
    answer: `• **Difference (A - B)**: Elements in A that are NOT in B.
• **Symmetric Difference**: Elements in either A or B, but not both.

**Method 1: Set filtering with set.has()**
• $O(N)$ time lookup.

**Method 2: Symmetric Difference calculation**
• Combine difference(A, B) with difference(B, A).`,
    code: `function arrayDifference(a, b) {
  const setB = new Set(b);
  return a.filter(x => !setB.has(x));
}

function symmetricDifference(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  return [
    ...a.filter(x => !setB.has(x)),
    ...b.filter(x => !setA.has(x))
  ];
}

console.log(arrayDifference([1, 2, 3, 4], [2, 4]));       // [1, 3]
console.log(symmetricDifference([1, 2, 3], [2, 3, 4, 5])); // [1, 4, 5]`
  },
  {
    id: 160,
    topicId: 11,
    question: "Coding Challenge: Union of Two Arrays (2 Methods)",
    answer: `Combine all unique elements from both array A and array B.

**Method 1: Spread into Set (1-Liner)**
• \`[...new Set([...a, ...b])]\`.

**Method 2: reduce / forEach accumulator**
• Useful when doing custom transformations during combination.`,
    code: `// Method 1: Modern Set Spread
const arrayUnion = (a, b) => [...new Set([...a, ...b])];

// Method 2: Manual Set accumulator
function arrayUnionCustom(a, b) {
  const unionSet = new Set(a);
  for (const item of b) unionSet.add(item);
  return Array.from(unionSet);
}

console.log(arrayUnion([1, 2, 3], [3, 4, 5])); // [1, 2, 3, 4, 5]`
  },
  {
    id: 161,
    topicId: 11,
    question: "Coding Challenge: Rotate an Array by K Positions (2 Methods)",
    answer: `Rotate array to the right by K steps (e.g., \`[1, 2, 3, 4, 5], k = 2\` -> \`[4, 5, 1, 2, 3]\`).

**Method 1: Three Reversals In-Place (Optimal O(N) Time, O(1) Auxiliary Space)**
1. Normalize \`k = k % arr.length\`.
2. Reverse entire array.
3. Reverse first \`k\` elements.
4. Reverse remaining \`n - k\` elements.

**Method 2: Slice and Spread (O(N) Time, O(N) Space)**
• Take \`arr.slice(-k)\` and concatenate with \`arr.slice(0, -k)\`.`,
    code: `// Method 1: Three Reversals (O(1) extra memory)
function rotateArrayInPlace(nums, k) {
  const n = nums.length;
  k = k % n;
  if (k === 0) return nums;

  const reverse = (start, end) => {
    while (start < end) {
      [nums[start], nums[end]] = [nums[end], nums[start]];
      start++;
      end--;
    }
  };

  reverse(0, n - 1); // Reverse entire array
  reverse(0, k - 1); // Reverse first k elements
  reverse(k, n - 1); // Reverse remaining elements
  return nums;
}

// Method 2: Slice & Concat (Quick 1-Liner)
function rotateArraySlice(nums, k) {
  k = k % nums.length;
  return [...nums.slice(-k), ...nums.slice(0, -k)];
}

console.log(rotateArrayInPlace([1, 2, 3, 4, 5, 6, 7], 3)); // [5, 6, 7, 1, 2, 3, 4]`
  },
  {
    id: 162,
    topicId: 11,
    question: "Coding Challenge: Move All Zeroes to End of Array (2 Methods)",
    answer: `Move all 0's to the end while maintaining the relative order of non-zero elements.

**Method 1: In-Place Two-Pointer Write Index (Optimal O(N) Time, O(1) Space)**
• Iterate with pointer \`i\`.
• If \`nums[i] !== 0\`, write into \`nums[writeIdx++]\`.
• Fill remaining indices from \`writeIdx\` to \`n\` with zeroes.

**Method 2: Filter and Pad (Quick readable solution)**
• Non-mutating solution using \`filter\` and \`concat\`.`,
    code: `// Method 1: In-place Two-Pointer (LeetCode 283)
function moveZeroesInPlace(nums) {
  let writeIdx = 0;

  // Shift non-zeroes forward
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[writeIdx] = nums[i];
      writeIdx++;
    }
  }

  // Fill remaining tail with 0
  while (writeIdx < nums.length) {
    nums[writeIdx] = 0;
    writeIdx++;
  }

  return nums;
}

// Method 2: Non-mutating Filter & Concat
function moveZeroesFilter(nums) {
  const nonZeroes = nums.filter(x => x !== 0);
  const zeroCount = nums.length - nonZeroes.length;
  return nonZeroes.concat(new Array(zeroCount).fill(0));
}

const arr = [0, 1, 0, 3, 12];
moveZeroesInPlace(arr);
console.log(arr); // [1, 3, 12, 0, 0]`
  },
  {
    id: 163,
    topicId: 11,
    question: "Coding Challenge: Check if an Array is Sorted (2 Methods)",
    answer: `Verify whether array elements are in ascending (or descending) order.

**Method 1: Linear Loop with Early Exit (Optimal O(N) Time, O(1) Space)**
• Compares \`arr[i] > arr[i + 1]\` and returns \`false\` immediately.

**Method 2: Array.prototype.every() (Functional)**
• Returns boolean in one declarative chain.`,
    code: `// Method 1: Loop with Early Exit
function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false; // Early exit
  }
  return true;
}

// Method 2: every()
const isSortedEvery = arr => 
  arr.every((val, i) => i === 0 || arr[i - 1] <= val);

console.log(isSorted([1, 2, 3, 5, 9])); // true
console.log(isSorted([1, 5, 2, 9]));    // false`
  },
  {
    id: 164,
    topicId: 11,
    question: "Coding Challenge: Find the Missing Number in Range 1 to N (3 Methods)",
    answer: `Given array of length N - 1 containing numbers from 1 to N with exactly one missing.

**Method 1: Gauss Sum Formula (Optimal O(N) Time, O(1) Space)**
• Expected sum: $\\frac{N \\times (N + 1)}{2}$.
• Missing number = Expected Sum - Actual Sum.

**Method 2: XOR Bitwise Operation (Prevents Arithmetic Overflow)**
• XOR all numbers from 1 to N, then XOR with every array element. Duplicate numbers cancel out ($x \\oplus x = 0$), leaving the missing number!

**Method 3: Set Lookup (O(N) Space)**
• Check each integer from 1 to N in a Set.`,
    code: `// Method 1: Gauss Sum Formula (Fastest)
function findMissingNumberSum(nums, n) {
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((acc, curr) => acc + curr, 0);
  return expectedSum - actualSum;
}

// Method 2: XOR Bitwise (Prevents Integer Overflow)
function findMissingNumberXOR(nums, n) {
  let xor = 0;
  for (let i = 1; i <= n; i++) xor ^= i;
  for (const num of nums) xor ^= num;
  return xor;
}

console.log(findMissingNumberSum([1, 2, 4, 5, 6], 6)); // 3
console.log(findMissingNumberXOR([1, 2, 4, 5, 6], 6)); // 3`
  },
  {
    id: 165,
    topicId: 11,
    question: "Coding Challenge: Find All Numbers Disappeared in an Array (2 Methods)",
    answer: `Given array of size N where numbers are in range [1, N], find all missing numbers.

**Method 1: In-Place Sign Negation (O(N) Time, O(1) Auxiliary Space)**
• For each number \`val = Math.abs(nums[i])\`, treat \`val - 1\` as index.
• Mark \`nums[val - 1]\` as negative if positive.
• Any indices remaining positive correspond to missing numbers (\`index + 1\`).

**Method 2: Set Presence Check (O(N) Space)**
• Store elements in Set and iterate 1 to N.`,
    code: `// Method 1: In-place Sign Negation
function findDisappearedNumbers(nums) {
  for (let i = 0; i < nums.length; i++) {
    const targetIdx = Math.abs(nums[i]) - 1;
    if (nums[targetIdx] > 0) {
      nums[targetIdx] = -nums[targetIdx];
    }
  }

  const result = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) {
      result.push(i + 1);
    }
  }

  return result;
}

console.log(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])); // [5, 6]`
  },
  {
    id: 166,
    topicId: 11,
    question: "Coding Challenge: Find the Longest Word in a Sentence (2 Methods)",
    answer: `Extract the longest word from a string ignoring punctuation.

**Method 1: split and reduce (Clean & Functional)**
• Sanitize string with regex to strip non-word characters, split by spaces, and reduce comparing \`word.length\`.

**Method 2: Regex Match + Sort**
• \`str.match(/\\w+/g).sort((a, b) => b.length - a.length)[0]\`.`,
    code: `// Method 1: split & reduce
function findLongestWord(sentence) {
  const words = sentence.replace(/[^a-zA-Z0-9\\s]/g, "").split(/\\s+/);
  return words.reduce((longest, current) => 
    current.length > longest.length ? current : longest, ""
  );
}

// Method 2: regex match
function findLongestWordRegex(sentence) {
  const matches = sentence.match(/\\w+/g) || [];
  return matches.reduce((max, w) => w.length > max.length ? w : max, "");
}

console.log(findLongestWord("The quick brown fox jumped over the lazy dog")); // "jumped"`
  },
  {
    id: 167,
    topicId: 11,
    question: "Coding Challenge: Capitalize First Letter of Every Word (Title Case) (2 Methods)",
    answer: `Format sentence into Title Case (e.g. "senior frontend developer" -> "Senior Frontend Developer").

**Method 1: split, map, and join (Standard functional approach)**
• \`word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()\`.

**Method 2: Regex word boundary replacement (1-Liner)**
• \`str.toLowerCase().replace(/\\b\\w/g, char => char.toUpperCase())\`.`,
    code: `// Method 1: split, map, join
function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word ? word[0].toUpperCase() + word.slice(1) : "")
    .join(" ");
}

// Method 2: Regex \\b\\w
function titleCaseRegex(str) {
  return str.toLowerCase().replace(/\\b[a-z]/g, c => c.toUpperCase());
}

console.log(titleCase("senior frontend engineer at google"));
// "Senior Frontend Engineer At Google"`
  },
  {
    id: 168,
    topicId: 11,
    question: "Coding Challenge: Truncate a String with Ellipsis (Word-Boundary Safe) (2 Methods)",
    answer: `Truncate string to length N with '...'.

**Method 1: Simple Slice (Can cut words mid-character)**
• \`str.length > max ? str.slice(0, max) + '...' : str\`.

**Method 2: Word-Boundary Safe Truncation (Senior Interview Nuance)**
• Avoids cutting words in half (e.g., "Hello World" -> "Hello..." instead of "Hello Wo...").`,
    code: `// Method 1: Simple Slice
function truncateSimple(str, max) {
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + "...";
}

// Method 2: Word-Boundary Safe (Doesn't split words)
function truncateWordSafe(str, max) {
  if (str.length <= max) return str;
  const sub = str.slice(0, max);
  const lastSpace = sub.lastIndexOf(" ");
  return (lastSpace > 0 ? sub.slice(0, lastSpace) : sub).trimEnd() + "...";
}

console.log(truncateSimple("JavaScript is amazing", 13));   // "JavaScript is..."
console.log(truncateWordSafe("JavaScript is amazing", 13)); // "JavaScript..."`
  },
  {
    id: 169,
    topicId: 11,
    question: "Coding Challenge: Count Vowels and Consonants in a String (2 Methods)",
    answer: `Count the count of vowels (a, e, i, o, u) and consonants in a given text.

**Method 1: Regex Match (Fastest to write in screening)**
• Use \`str.match(/[aeiou]/gi)\`.

**Method 2: Set Lookup with for...of (Handles non-ASCII & clean O(N))**
• Iterates characters, checking membership in a Vowel Set.`,
    code: `// Method 1: Regex
function countVowelsRegex(str) {
  const vowels = (str.match(/[aeiou]/gi) || []).length;
  const letters = (str.match(/[a-z]/gi) || []).length;
  return { vowels, consonants: letters - vowels };
}

// Method 2: Set Lookup
function countVowelsSet(str) {
  const vowelSet = new Set(["a", "e", "i", "o", "u"]);
  let vowels = 0;
  let consonants = 0;

  for (const char of str.toLowerCase()) {
    if (char >= "a" && char <= "z") {
      if (vowelSet.has(char)) vowels++;
      else consonants++;
    }
  }

  return { vowels, consonants };
}

console.log(countVowelsSet("Full Stack Developer")); // { vowels: 6, consonants: 12 }`
  },
  {
    id: 170,
    topicId: 11,
    question: "Coding Challenge: Substring Search Without Built-in includes() (2 Methods)",
    answer: `Check if pattern exists inside text without using \`str.includes()\` or \`indexOf()\`.

**Method 1: Two-Pointer Sliding Window Match (O(N * M) Time, O(1) Space)**
• Slide a window of length M across text of length N.

**Method 2: Regex test()**
• \`new RegExp(pattern).test(str)\`.`,
    code: `// Method 1: Sliding Window Character Comparison
function customIncludes(text, pattern) {
  if (pattern === "") return true;
  if (pattern.length > text.length) return false;

  for (let i = 0; i <= text.length - pattern.length; i++) {
    let match = true;
    for (let j = 0; j < pattern.length; j++) {
      if (text[i + j] !== pattern[j]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }

  return false;
}

console.log(customIncludes("react ecosystem", "eco")); // true
console.log(customIncludes("react ecosystem", "vue")); // false`
  },
  {
    id: 171,
    topicId: 11,
    question: "Coding Challenge: String Compression (Run-Length Encoding) (2 Methods)",
    answer: `Compress repetitive characters into char + count (e.g., "aabcccccaaa" -> "a2b1c5a3"). If compressed is not shorter, return original.

**Method 1: Single-Pass Two-Pointer / Count Tracker (Optimal O(N))**
• Track current character and consecutive count.

**Method 2: Regex Replacement**
• Match repeated sequences with \`/(\\w)\\1*/g\`.`,
    code: `// Method 1: Single-pass Count Tracker
function compressString(str) {
  if (!str) return str;
  let compressed = "";
  let count = 1;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i + 1]) {
      count++;
    } else {
      compressed += str[i] + count;
      count = 1;
    }
  }

  return compressed.length < str.length ? compressed : str;
}

console.log(compressString("aabcccccaaa")); // "a2b1c5a3"
console.log(compressString("abcdef"));      // "abcdef" (compressed is longer)`
  },
  {
    id: 172,
    topicId: 11,
    question: "Coding Challenge: Check if Two Strings are Isomorphic (2 Methods)",
    answer: `Two strings are isomorphic if characters in S can be replaced to get T (e.g., "egg" and "add" -> true; "foo" and "bar" -> false).

**Method 1: Two Hash Maps / Bidirectional Mapping (O(N) Time, O(1) Space)**
• Map \`mapST\` and \`mapTS\` ensure one-to-one character correspondence.

**Method 2: First-Occurrence Index Pattern**
• Compare \`s.indexOf(s[i]) === t.indexOf(t[i])\` across all indices.`,
    code: `// Method 1: Two Maps (Bidirectional Character Mapping)
function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;
  const mapST = new Map();
  const mapTS = new Map();

  for (let i = 0; i < s.length; i++) {
    const c1 = s[i];
    const c2 = t[i];

    if ((mapST.has(c1) && mapST.get(c1) !== c2) ||
        (mapTS.has(c2) && mapTS.get(c2) !== c1)) {
      return false;
    }

    mapST.set(c1, c2);
    mapTS.set(c2, c1);
  }

  return true;
}

console.log(isIsomorphic("egg", "add")); // true
console.log(isIsomorphic("foo", "bar")); // false
console.log(isIsomorphic("paper", "title")); // true`
  },
  {
    id: 173,
    topicId: 11,
    question: "Coding Challenge: First Non-Repeating Character Index (2 Methods)",
    answer: `Return index of the first unique character in string (or -1 if none).

**Method 1: Frequency Map Two-Pass (Optimal O(N) Time)**
• Pass 1: Build frequency map in $O(N)$.
• Pass 2: Find first character with count 1.

**Method 2: indexOf === lastIndexOf (Simple 1-Pass over unique chars)**
• Easy to write in interview if frequency map takes too long.`,
    code: `// Method 1: Frequency Map
function firstUniqCharMap(s) {
  const counts = new Map();
  for (const c of s) counts.set(c, (counts.get(c) || 0) + 1);

  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) return i;
  }
  return -1;
}

// Method 2: indexOf vs lastIndexOf
function firstUniqCharIndex(s) {
  for (let i = 0; i < s.length; i++) {
    if (s.indexOf(s[i]) === s.lastIndexOf(s[i])) return i;
  }
  return -1;
}

console.log(firstUniqCharMap("leetcode"));     // 0 ('l')
console.log(firstUniqCharMap("loveleetcode")); // 2 ('v')`
  },
  {
    id: 174,
    topicId: 11,
    question: "Coding Challenge: Longest Common Prefix Among Strings (2 Methods)",
    answer: `Find longest prefix shared by array of strings (e.g., ["flower","flow","flight"] -> "fl").

**Method 1: Horizontal Scanning (O(S) Time where S is sum of characters)**
• Start with \`prefix = strs[0]\`.
• Loop through remaining words; shorten \`prefix\` while \`word.indexOf(prefix) !== 0\`.

**Method 2: Sorting First & Last Words (O(N log N) Time)**
• After sorting lexicographically, the greatest difference is between the first and last element. Compare only \`strs[0]\` and \`strs[strs.length - 1]\`.`,
    code: `// Method 1: Horizontal Scanning (Most Intuitive)
function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  let prefix = strs[0];

  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }

  return prefix;
}

// Method 2: Sort First & Last
function longestCommonPrefixSort(strs) {
  if (!strs.length) return "";
  strs.sort();
  const first = strs[0];
  const last = strs[strs.length - 1];
  let i = 0;

  while (i < first.length && first[i] === last[i]) {
    i++;
  }

  return first.slice(0, i);
}

console.log(longestCommonPrefix(["flower", "flow", "flight"])); // "fl"
console.log(longestCommonPrefix(["dog", "racecar", "car"]));    // ""`
  },
  {
    id: 175,
    topicId: 11,
    question: "Coding Challenge: Valid Parentheses / Balanced Brackets (2 Methods)",
    answer: `Determine if input string of brackets '()[]{}' is valid.

**Method 1: Stack with Map Lookup (Optimal O(N) Time, O(N) Space)**
• Push opening brackets onto stack.
• On closing bracket, pop from stack and verify matching pair.
• Return \`stack.length === 0\` at the end.

**Method 2: Replacement Loop (Clean for small strings)**
• Replace \`()\` or \`[]\` or \`{}\` with empty string until string stops shrinking.`,
    code: `// Method 1: Stack with Map Lookup (Optimal)
function isValidParentheses(s) {
  const stack = [];
  const map = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else if (map[char]) {
      if (stack.pop() !== map[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

// Method 2: Replacement Loop
function isValidReplacement(s) {
  let prevLength = -1;
  while (s.length !== prevLength) {
    prevLength = s.length;
    s = s.replace("()", "").replace("[]", "").replace("{}", "");
  }
  return s.length === 0;
}

console.log(isValidParentheses("()[]{}")); // true
console.log(isValidParentheses("(]"));     // false
console.log(isValidParentheses("([{}])")); // true`
  },

  // TOPIC 12: Advanced DSA & Functional Patterns in JS (Q176–200)
  {
    id: 176,
    topicId: 12,
    question: "Coding Challenge: Merge Two Sorted Arrays (2 Methods)",
    answer: `Merge two sorted arrays A and B into a new sorted array.

**Method 1: Two Pointers (Optimal O(M + N) Time, O(M + N) Space)**
• Compare \`a[p1]\` and \`b[p2]\`, push smaller value to result, advance pointer.

**Method 2: Concat & Sort (Quick 1-Liner O((M+N) log(M+N)))**
• \`[...a, ...b].sort((x, y) => x - y)\`. Mention this as brute-force before giving two-pointer.`,
    code: `// Method 1: Two Pointers (Optimal O(M + N))
function mergeSortedArrays(a, b) {
  const result = [];
  let p1 = 0, p2 = 0;

  while (p1 < a.length && p2 < b.length) {
    if (a[p1] <= b[p2]) {
      result.push(a[p1++]);
    } else {
      result.push(b[p2++]);
    }
  }

  while (p1 < a.length) result.push(a[p1++]);
  while (p2 < b.length) result.push(b[p2++]);

  return result;
}

console.log(mergeSortedArrays([1, 3, 5], [2, 4, 6, 8])); // [1, 2, 3, 4, 5, 6, 8]`
  },
  {
    id: 177,
    topicId: 12,
    question: "Coding Challenge: Merge Sorted Array In-Place into First Array (LeetCode 88) (2 Methods)",
    answer: `Given nums1 of size m + n with trailing zeroes, merge nums2 of size n into nums1 in-place.

**Method 1: Three Pointers Starting From End (Optimal O(M + N) Time, O(1) Space)**
• Start filling from the back (\`m + n - 1\`) to avoid overwriting elements in nums1.

**Method 2: Splice & Sort**
• Replace trailing zeros with nums2 and sort.`,
    code: `// Method 1: Three Pointers from End (O(1) extra space)
function mergeInPlace(nums1, m, nums2, n) {
  let p1 = m - 1;
  let p2 = n - 1;
  let write = m + n - 1;

  while (p2 >= 0) {
    if (p1 >= 0 && nums1[p1] > nums2[p2]) {
      nums1[write] = nums1[p1];
      p1--;
    } else {
      nums1[write] = nums2[p2];
      p2--;
    }
    write--;
  }

  return nums1;
}

const nums1 = [1, 2, 3, 0, 0, 0];
mergeInPlace(nums1, 3, [2, 5, 6], 3);
console.log(nums1); // [1, 2, 2, 3, 5, 6]`
  },
  {
    id: 178,
    topicId: 12,
    question: "Coding Challenge: Maximum Subarray Sum (Kadane's Algorithm) (2 Methods)",
    answer: `Find contiguous subarray with the largest sum (e.g. [-2,1,-3,4,-1,2,1,-5,4] -> 6 for [4,-1,2,1]).

**Method 1: Kadane's Algorithm (Optimal O(N) Time, O(1) Space)**
• At each index, decide whether to extend current subarray or start fresh:
  \`currentMax = Math.max(num, currentMax + num)\`.
  \`globalMax = Math.max(globalMax, currentMax)\`.

**Method 2: Brute Force (O(N²) Time)**
• Check all subarrays starting at i and ending at j.`,
    code: `// Method 1: Kadane's Algorithm (O(N) Time, O(1) Space)
function maxSubArray(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6 (subarray [4, -1, 2, 1])`
  },
  {
    id: 179,
    topicId: 12,
    question: "Coding Challenge: Maximum Product Subarray (2 Methods)",
    answer: `Find contiguous subarray with maximum product (e.g. [2,3,-2,4] -> 6).

**Method 1: Kadane's Tracking Both Max & Min (Optimal O(N) Time, O(1) Space)**
• Because multiplying two negative numbers creates a positive number, we must track both \`maxProd\` and \`minProd\`.
• When encountering a negative number, swap \`maxProd\` and \`minProd\`.

**Method 2: Prefix and Suffix Pass**
• Scan left-to-right and right-to-left reset product at 0.`,
    code: `// Method 1: Tracking Max & Min Product
function maxProductSubArray(nums) {
  let maxProd = nums[0];
  let minProd = nums[0];
  let result = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];

    if (num < 0) {
      [maxProd, minProd] = [minProd, maxProd]; // Swap on negative
    }

    maxProd = Math.max(num, maxProd * num);
    minProd = Math.min(num, minProd * num);

    result = Math.max(result, maxProd);
  }

  return result;
}

console.log(maxProductSubArray([2, 3, -2, 4])); // 6
console.log(maxProductSubArray([-2, 0, -1]));   // 0`
  },
  {
    id: 180,
    topicId: 12,
    question: "Coding Challenge: Best Time to Buy and Sell Stock (Single Transaction) (2 Methods)",
    answer: `Find maximum profit given stock prices on sequential days. You may only buy once and sell once.

**Method 1: Single Pass Tracking Min Price (Optimal O(N) Time, O(1) Space)**
• Maintain \`minPrice = Infinity\` and \`maxProfit = 0\`.
• For each day:
  \`minPrice = Math.min(minPrice, price)\`.
  \`maxProfit = Math.max(maxProfit, price - minPrice)\`.

**Method 2: Two-Pointer Sliding Window**
• Left pointer at buy day, Right pointer at sell day.`,
    code: `// Method 1: Single Pass O(N) Time, O(1) Space
function maxProfitStock(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else {
      maxProfit = Math.max(maxProfit, price - minPrice);
    }
  }

  return maxProfit;
}

console.log(maxProfitStock([7, 1, 5, 3, 6, 4])); // 5 (Buy at 1, Sell at 6)
console.log(maxProfitStock([7, 6, 4, 3, 1]));    // 0 (Prices only decline)`
  },
  {
    id: 181,
    topicId: 12,
    question: "Coding Challenge: Best Time to Buy and Sell Stock II (Multiple Transactions) (2 Methods)",
    answer: `Find maximum profit with unlimited transactions (buy and sell as many times as you like).

**Method 1: Greedy Peak-Valley Addition (Optimal O(N) Time, O(1) Space)**
• Whenever \`prices[i] > prices[i - 1]\`, immediately capture the difference:
  \`profit += prices[i] - prices[i - 1]\`.

**Method 2: Dynamic Programming State Machine**
• Track \`hold\` and \`sold\` states.`,
    code: `// Method 1: Greedy Peak-Valley (Simplest & Optimal)
function maxProfitUnlimited(prices) {
  let totalProfit = 0;

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      totalProfit += prices[i] - prices[i - 1];
    }
  }

  return totalProfit;
}

console.log(maxProfitUnlimited([7, 1, 5, 3, 6, 4])); // 7 (buy 1 sell 5 = 4, buy 3 sell 6 = 3)`
  },
  {
    id: 182,
    topicId: 12,
    question: "Coding Challenge: Climbing Stairs / Fibonacci DP (3 Methods)",
    answer: `It takes N steps to reach top. Each time you can climb 1 or 2 steps. How many distinct ways?

**Method 1: Iterative DP with Two Variables (Optimal O(N) Time, O(1) Space)**
• Notice $ways(N) = ways(N - 1) + ways(N - 2)$ (Fibonacci relation).
• Track \`prev1 = 1\` and \`prev2 = 2\`.

**Method 2: Top-Down Recursion with Memoization**
• Cache results in object/Map to eliminate exponential duplicate subproblems ($O(N)$ time).

**Method 3: DP Array**
• Build table \`dp[i] = dp[i-1] + dp[i-2]\`.`,
    code: `// Method 1: Iterative O(N) Time, O(1) Space
function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1; // 1 step
  let prev1 = 2; // 2 steps

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// Method 2: Memoized Recursion
function climbStairsMemo(n, memo = {}) {
  if (n <= 2) return n;
  if (memo[n]) return memo[n];
  memo[n] = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
  return memo[n];
}

console.log(climbStairs(5)); // 8 ways`
  },
  {
    id: 183,
    topicId: 12,
    question: "Coding Challenge: Coin Change (Minimum Coins Needed) (2 Methods)",
    answer: `Given coin denominations and amount, return minimum number of coins needed (or -1 if impossible).

**Method 1: Bottom-Up 1D DP Array (Optimal O(Amount * Coins) Time)**
• \`dp[i]\` = min coins needed to make amount \`i\`.
• Base: \`dp[0] = 0\`, all others \`Infinity\`.
• Transition: \`dp[i] = Math.min(dp[i], dp[i - coin] + 1)\`.

**Method 2: Breadth-First Search (BFS)**
• Each level in BFS represents adding 1 coin. Shortest path to 0 gives minimum coins.`,
    code: `// Method 1: Bottom-up Dynamic Programming
function coinChangeDP(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log(coinChangeDP([1, 2, 5], 11)); // 3 (5 + 5 + 1)
console.log(coinChangeDP([2], 3));        // -1`
  },
  {
    id: 184,
    topicId: 12,
    question: "Coding Challenge: Find Majority Element (> N/2 times) (3 Methods)",
    answer: `Find element that appears more than $\\lfloor N/2 \\rfloor$ times in an array.

**Method 1: Boyer-Moore Voting Algorithm (Optimal O(N) Time, O(1) Space)**
• Maintain \`candidate\` and \`count = 0\`.
• If count is 0, pick current element as candidate.
• If current matches candidate, \`count++\`, else \`count--\`.

**Method 2: Hash Map Frequency Counter (O(N) Time, O(N) Space)**
• Count frequencies and return element when \`count > n / 2\`.

**Method 3: Sort & Pick Middle Element (O(N log N) Time)**
• Because majority element takes > 50% of array, it MUST occupy index \`Math.floor(n / 2)\`.`,
    code: `// Method 1: Boyer-Moore Voting Algorithm (O(1) memory)
function majorityElement(nums) {
  let candidate = null;
  let count = 0;

  for (const num of nums) {
    if (count === 0) {
      candidate = num;
    }
    count += (num === candidate) ? 1 : -1;
  }

  return candidate;
}

// Method 2: Map Frequency Counter
function majorityElementMap(nums) {
  const threshold = nums.length / 2;
  const freq = new Map();
  for (const num of nums) {
    const nextCount = (freq.get(num) || 0) + 1;
    if (nextCount > threshold) return num;
    freq.set(num, nextCount);
  }
}

console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2`
  },
  {
    id: 185,
    topicId: 12,
    question: "Coding Challenge: Flatten Deep Nested Object to Dot Notation (2 Methods)",
    answer: `Convert nested object \`{ a: { b: { c: 1 } }, d: 2 }\` into \`{ "a.b.c": 1, d: 2 }\`.

**Method 1: Recursive Helper with Prefix (Most Common)**
• Accumulates prefix key (\`prefix ? \`\${prefix}.\${key}\` : key\`).

**Method 2: Iterative Stack Queue**
• Traverses object keys using explicit stack to avoid recursion depth limits.`,
    code: `// Method 1: Recursive with Prefix
function flattenObject(obj, prefix = "", result = {}) {
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const newKey = prefix ? \`\${prefix}.\${key}\` : key;

    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      flattenObject(val, newKey, result);
    } else {
      result[newKey] = val;
    }
  }
  return result;
}

const nested = {
  user: {
    name: "Sameer",
    address: {
      city: "Hyderabad",
      geo: { lat: 17.385 }
    }
  },
  active: true
};

console.log(flattenObject(nested));
// { "user.name": "Sameer", "user.address.city": "Hyderabad", "user.address.geo.lat": 17.385, active: true }`
  },
  {
    id: 186,
    topicId: 12,
    question: "Coding Challenge: Unflatten Dot-Notation Object to Deep Nested Object (2 Methods)",
    answer: `Convert flat dot-notation keys \`{ "a.b.c": 1, d: 2 }\` back into deep nested object.

**Method 1: reduce() Object Traversal**
• Split key by '.' and traverse/create intermediate objects.

**Method 2: Classic For Loop Traversal**
• Keeps pointer to current sub-object.`,
    code: `// Method 1: reduce Traversal
function unflattenObject(flatObj) {
  const result = {};

  for (const [keyPath, value] of Object.entries(flatObj)) {
    const keys = keyPath.split(".");
    let current = result;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === keys.length - 1) {
        current[key] = value;
      } else {
        current[key] ??= {};
        current = current[key];
      }
    }
  }

  return result;
}

console.log(unflattenObject({ "user.profile.name": "Ali", "user.active": true }));
// { user: { profile: { name: "Ali" }, active: true } }`
  },
  {
    id: 187,
    topicId: 12,
    question: "Coding Challenge: Deep Equality Comparison (isEqual) (2 Methods)",
    answer: `Compare two objects/arrays by value rather than by reference.

**Method 1: Recursive Deep Equality (Handles Objects, Arrays, and Primitives)**
• Fast check \`a === b\`.
• Check types, nulls, and key counts.
• Recursively compare every property.

**Method 2: JSON.stringify (Quick Hack with Limitations)**
• Warning: Keys must be in identical order and drops functions/undefined.`,
    code: `// Method 1: Recursive Deep Equality (Production Grade)
function deepEqual(a, b) {
  // Primitives and exact references
  if (a === b) return true;

  // Handle null and non-objects
  if (a === null || typeof a !== "object" || b === null || typeof b !== "object") {
    return false;
  }

  // Handle Dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual([1, [2, 3]], [1, [2, 3]]));                     // true`
  },
  {
    id: 188,
    topicId: 12,
    question: "Coding Challenge: Implement pick() and omit() Utility Functions (2 Methods)",
    answer: `• \`pick(obj, keys)\`: Returns copy of object with only specified keys.
• \`omit(obj, keys)\`: Returns copy of object with specified keys removed.

**Method 1: reduce with Set (Optimal O(Keys))**
• Convert target keys to Set for $O(1)$ lookups.

**Method 2: Object.fromEntries + Object.entries**
• Functional 1-liners.`,
    code: `function pick(obj, keys) {
  const keySet = new Set(keys);
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
}

function omit(obj, keys) {
  const keySet = new Set(keys);
  return Object.keys(obj).reduce((acc, key) => {
    if (!keySet.has(key)) acc[key] = obj[key];
    return acc;
  }, {});
}

const user = { id: 101, name: "Zara", role: "admin", passwordHash: "xyz987" };
console.log(pick(user, ["id", "name"]));     // { id: 101, name: "Zara" }
console.log(omit(user, ["passwordHash"]));    // { id: 101, name: "Zara", role: "admin" }`
  },
  {
    id: 189,
    topicId: 12,
    question: "Coding Challenge: Currying Function Implementation (2 Types)",
    answer: `Currying transforms a function with multiple arguments into a chain of functions that each take one or more arguments until all are satisfied.

**Type 1: Fixed Arity Currying (curry(fn))**
• Compares accumulated arguments with \`fn.length\`.

**Type 2: Infinite Currying (e.g. add(1)(2)(3)...())**
• Keeps returning functions until called with no arguments.`,
    code: `// Type 1: Standard Arity Currying
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);
console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6

// Type 2: Infinite Currying (empty invocation terminates)
function infiniteSum(a) {
  return function (b) {
    if (b === undefined) return a;
    return infiniteSum(a + b);
  };
}
console.log(infiniteSum(1)(2)(3)(4)()); // 10`
  },
  {
    id: 190,
    topicId: 12,
    question: "Coding Challenge: Function Composition (compose and pipe) (2 Methods)",
    answer: `• \`pipe(f, g, h)(x)\`: Executes functions Left-to-Right: $h(g(f(x)))$.
• \`compose(f, g, h)(x)\`: Executes functions Right-to-Left: $f(g(h(x)))$.

**Method 1: reduce for pipe and reduceRight for compose**
• Standard functional programming pattern.

**Method 2: For Loop**
• Iterative step-by-step value accumulation.`,
    code: `// Method 1: Functional Reducers
const pipe = (...fns) => initialVal => 
  fns.reduce((val, fn) => fn(val), initialVal);

const compose = (...fns) => initialVal => 
  fns.reduceRight((val, fn) => fn(val), initialVal);

const add5 = x => x + 5;
const double = x => x * 2;
const subtract1 = x => x - 1;

// pipe: (10 + 5) * 2 - 1 = 29
console.log(pipe(add5, double, subtract1)(10)); // 29

// compose: ((10 - 1) * 2) + 5 = 23
console.log(compose(add5, double, subtract1)(10)); // 23`
  },
  {
    id: 191,
    topicId: 12,
    question: "Coding Challenge: Function Memoization Implementation (2 Methods)",
    answer: `Cache return values of expensive pure functions so subsequent calls with identical arguments return instantly.

**Method 1: Map with Custom Key Resolver (Production Standard)**
• Takes optional \`resolver\` callback to compute cache keys.

**Method 2: JSON.stringify Key Serialization (Quick screening solution)**
• \`const key = JSON.stringify(args)\`.`,
    code: `function memoize(fn, resolver) {
  const cache = new Map();

  return function (...args) {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveFib = n => (n <= 1 ? n : expensiveFib(n - 1) + expensiveFib(n - 2));
const fastFib = memoize(expensiveFib);

console.time("First Run");
fastFib(35);
console.timeEnd("First Run");

console.time("Cached Run");
fastFib(35); // Instant!
console.timeEnd("Cached Run");`
  },
  {
    id: 192,
    topicId: 12,
    question: "Coding Challenge: Promisify a Node.js Callback Function (2 Methods)",
    answer: `Convert standard Node callback signature \`fn(arg1, arg2, (err, data) => {})\` into a Promise.

**Method 1: Custom Promise Wrapper (Essential Interview Question)**
• Return function that returns \`new Promise((resolve, reject) => ...)\`.

**Method 2: util.promisify (Node built-in)**
• Built-in standard module in Node.js.`,
    code: `// Method 1: Custom Promisify Implementation
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.apply(this, [
        ...args,
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      ]);
    });
  };
}

// Example callback function:
function mockAsyncFileRead(filename, callback) {
  setTimeout(() => {
    if (filename === "valid.txt") callback(null, "File content data");
    else callback(new Error("File not found"));
  }, 50);
}

const readFilePromise = promisify(mockAsyncFileRead);
readFilePromise("valid.txt").then(console.log); // "File content data"`
  },
  {
    id: 193,
    topicId: 12,
    question: "Coding Challenge: Custom Promise.all() Polyfill (2 Approaches)",
    answer: `Wait for all promises to fulfill, or reject immediately if any promise rejects.

**Implementation Nuances**:
1. Return empty array if input array is empty.
2. Must wrap non-promise items with \`Promise.resolve()\`.
3. Track completed count to resolve when \`completed === promises.length\`.
4. Store results at the **exact input index** (not completion order!).`,
    code: `function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }

    const results = [];
    let completedCount = 0;
    const total = promises.length;

    if (total === 0) return resolve(results);

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then(val => {
          results[index] = val; // Store at exact index
          completedCount++;
          if (completedCount === total) {
            resolve(results);
          }
        })
        .catch(err => {
          reject(err); // Rejects immediately on first error
        });
    });
  });
}

myPromiseAll([
  Promise.resolve(10),
  new Promise(res => setTimeout(() => res(20), 50)),
  30
]).then(console.log); // [10, 20, 30]`
  },
  {
    id: 194,
    topicId: 12,
    question: "Coding Challenge: Custom Promise.allSettled() Polyfill (2 Approaches)",
    answer: `Wait until all promises complete regardless of fulfillment or rejection. Never rejects.

**Implementation Pattern**:
Map every promise to catch errors and return structured descriptor:
• If fulfilled: \`{ status: 'fulfilled', value }\`.
• If rejected: \`{ status: 'rejected', reason }\`.`,
    code: `// Method 1: Using myPromiseAll under the hood
function myPromiseAllSettled(promises) {
  const wrapped = promises.map(p =>
    Promise.resolve(p)
      .then(value => ({ status: "fulfilled", value }))
      .catch(reason => ({ status: "rejected", reason }))
  );
  return Promise.all(wrapped);
}

myPromiseAllSettled([
  Promise.resolve("Success!"),
  Promise.reject("Network Failed"),
  42
]).then(console.log);
// [
//   { status: 'fulfilled', value: 'Success!' },
//   { status: 'rejected', reason: 'Network Failed' },
//   { status: 'fulfilled', value: 42 }
// ]`
  },
  {
    id: 195,
    topicId: 12,
    question: "Coding Challenge: Custom Promise.race() & Promise.any() Polyfills",
    answer: `• \`Promise.race()\`: Resolves or rejects as soon as the FIRST promise settles.
• \`Promise.any()\`: Resolves with the FIRST fulfilled promise. Rejects with \`AggregateError\` only if ALL promises reject.`,
    code: `// Promise.race Polyfill
function myPromiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => Promise.resolve(p).then(resolve, reject));
  });
}

// Promise.any Polyfill
function myPromiseAny(promises) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let rejectedCount = 0;
    const total = promises.length;

    if (total === 0) return reject(new AggregateError([], "All promises were rejected"));

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then(resolve) // First success wins
        .catch(err => {
          errors[index] = err;
          rejectedCount++;
          if (rejectedCount === total) {
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
    question: "Coding Challenge: Async Concurrency Limiter (p-limit) (2 Methods)",
    answer: `Execute N asynchronous tasks with a maximum concurrency limit of K (e.g. at most 3 simultaneous API calls).

**Method 1: Queue with Active Counter (Production Standard)**
• Maintain \`activeCount\` and \`queue = []\`.
• When task finishes, dequeue next task.`,
    code: `function createConcurrencyLimiter(concurrencyLimit) {
  let activeCount = 0;
  const queue = [];

  const runNext = () => {
    if (activeCount >= concurrencyLimit || queue.length === 0) return;

    activeCount++;
    const { fn, resolve, reject } = queue.shift();

    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        activeCount--;
        runNext();
      });
  };

  return function limit(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      runNext();
    });
  };
}

const limit = createConcurrencyLimiter(2); // Max 2 tasks at once
const wait = (ms, val) => () => new Promise(r => setTimeout(() => (console.log(val), r(val)), ms));

limit(wait(300, "Task 1"));
limit(wait(200, "Task 2"));
limit(wait(100, "Task 3")); // Waits until 2 finishes!`
  },
  {
    id: 197,
    topicId: 12,
    question: "Coding Challenge: Custom Event Emitter Class (on, off, emit, once)",
    answer: `Implement publish-subscribe event emitter with \`on(event, cb)\`, \`off(event, cb)\`, \`emit(event, ...data)\`, and \`once(event, cb)\`.`,
    code: `class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) this.events.set(event, new Set());
    this.events.get(event).add(listener);
    return () => this.off(event, listener); // Cleanup closure
  }

  off(event, listener) {
    if (!this.events.has(event)) return;
    this.events.get(event).delete(listener);
    if (this.events.get(event).size === 0) this.events.delete(event);
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return false;
    for (const listener of [...this.events.get(event)]) {
      listener(...args);
    }
    return true;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    return this.on(event, wrapper);
  }
}

const emitter = new EventEmitter();
const unsubscribe = emitter.on("order", id => console.log("New order:", id));
emitter.emit("order", 101);
unsubscribe();
emitter.emit("order", 102); // Nothing logged!`
  },
  {
    id: 198,
    topicId: 12,
    question: "Coding Challenge: LRU Cache (Least Recently Used) (2 Methods)",
    answer: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with \`get\` and \`put\` in $O(1)$ time.

**Method 1: ES6 Map (Built-in Insertion Order Eviction - Cleanest)**
• In JS, \`Map\` iterates in insertion order!
• When key is accessed: \`map.delete(key)\` and \`map.set(key, value)\` moves it to the most recent position.
• When capacity exceeded: \`map.keys().next().value\` returns the oldest key to evict.

**Method 2: Doubly Linked List + Hash Map (Classic DSA)**
• Shows deep CS fundamentals.`,
    code: `// Method 1: Using JavaScript Map's Insertion Order (O(1) get & put)
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    // Refresh position to most recent
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first key in iteration order)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}

const lru = new LRUCache(2);
lru.put(1, "A");
lru.put(2, "B");
console.log(lru.get(1)); // "A" (key 1 is now most recent)
lru.put(3, "C");         // Evicts key 2!
console.log(lru.get(2)); // -1 (evicted)
console.log(lru.get(3)); // "C"`
  },
  {
    id: 199,
    topicId: 12,
    question: "Coding Challenge: Binary Search on Sorted Array (2 Methods)",
    answer: `Search for target in sorted array in $O(\\log N)$ time.

**Method 1: Iterative Two-Pointer (Optimal O(log N) Time, O(1) Space)**
• \`mid = Math.floor(left + (right - left) / 2)\` (prevents integer overflow).
• If \`arr[mid] === target\`: return \`mid\`.
• If \`target < arr[mid]\`: \`right = mid - 1\`.
• Else: \`left = mid + 1\`.

**Method 2: Recursive Binary Search**
• Recursively divide search interval.`,
    code: `// Method 1: Iterative Two-Pointer (O(log N) Time, O(1) Space)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (target < arr[mid]) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return -1; // Not found
}

console.log(binarySearch([1, 3, 5, 7, 9, 11, 13], 7));  // 3
console.log(binarySearch([1, 3, 5, 7, 9, 11, 13], 10)); // -1`
  },
  {
    id: 200,
    topicId: 12,
    question: "Coding Challenge: Search in Rotated Sorted Array (2 Methods)",
    answer: `Given sorted array rotated at some pivot (e.g. [4,5,6,7,0,1,2]), search target in $O(\\log N)$ time.

**Method 1: Modified Binary Search (One-Pass O(log N))**
• At least one half of the array (\`left\` to \`mid\` OR \`mid\` to \`right\`) is ALWAYS strictly sorted.
• Check if target lies within the sorted half; if so, narrow to that half, otherwise search the other half.`,
    code: `function searchRotated(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (nums[mid] === target) return mid;

    // Check if left half is sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1; // Target is in left half
      } else {
        left = mid + 1;  // Target is in right half
      }
    } 
    // Otherwise right half must be sorted
    else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;  // Target is in right half
      } else {
        right = mid - 1; // Target is in left half
      }
    }
  }

  return -1;
}

console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 3)); // -1`
  }
];

// Read current file
let content = fs.readFileSync(targetFile, 'utf8');

// Update JS_INTERVIEW_TOPICS
const updatedTopics = `export const JS_INTERVIEW_TOPICS = [
  { id: 1, range: "Q1–15", title: "Fundamentals, Types & Coercion", count: 15 },
  { id: 2, range: "Q16–30", title: "Scope, Hoisting & Execution Context", count: 15 },
  { id: 3, range: "Q31–45", title: "Functions, Closures & this", count: 15 },
  { id: 4, range: "Q46–60", title: "Objects, Prototypes & Classes", count: 15 },
  { id: 5, range: "Q61–75", title: "Arrays, Maps, Sets & Collections", count: 15 },
  { id: 6, range: "Q76–90", title: "Async JavaScript & Event Loop", count: 15 },
  { id: 7, range: "Q91–105", title: "ES6+, Modules, Errors & Memory", count: 15 },
  { id: 8, range: "Q106–120", title: "Output Prediction & Debugging", count: 15 },
  { id: 9, range: "Q121–135", title: "Practical JavaScript Coding Questions", count: 15 },
  { id: 10, range: "Q136–150", title: "Advanced Concepts, Polyfills & Senior Scenarios", count: 15 },
  { id: 11, range: "Q151–175", title: "Essential Coding Challenges (Multiple Approaches)", count: 25 },
  { id: 12, range: "Q176–200", title: "Advanced DSA & Functional Patterns in JS", count: 25 }
];`;

content = content.replace(/export const JS_INTERVIEW_TOPICS = \[[\s\S]*?\];/, updatedTopics);

// Append new questions to JS_150_QUESTIONS array
// Find the last item closing bracket and insert new questions
const questionsString = newQuestions.map(q => JSON.stringify(q, null, 2)).join(',\n');

// Replace closing `\n];` at the end
const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex !== -1) {
  content = content.slice(0, lastBracketIndex) + ',\n' + questionsString + '\n];\n';
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully added 50 coding questions (Q151-200) to javascriptInterviewData.js!');
