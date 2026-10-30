// DSA Animation Step Generators for Interactive Visual Algorithm Studio
// Inspired by dsaanimator.com: step-by-step state frames, visual pointers, hash maps/sets, synchronized code lines

export {
  generateValidSudokuSteps,
  generateHistogramSteps,
  generateLinkedListVisualSteps,
  generateTreeSteps,
  generateNumberIslandsSteps
} from './dsaAdvancedVisualGenerators.js';

import {
  generateValidSudokuSteps,
  generateHistogramSteps,
  generateLinkedListVisualSteps,
  generateTreeSteps,
  generateNumberIslandsSteps
} from './dsaAdvancedVisualGenerators.js';


// -------------------------------------------------------------
// 1. CONTAINS DUPLICATE (LeetCode #217)
// -------------------------------------------------------------
export function generateContainsDuplicateSteps(inputNums = [1, 2, 3, 1], approach = 'optimal') {
  const nums = Array.isArray(inputNums) && inputNums.length > 0 ? inputNums : [1, 2, 3, 1];

  if (approach === 'bruteforce') {
    const codeSnippet = [
      'function containsDuplicate(nums) {',
      '  for (let i = 0; i < nums.length; i++) {',
      '    for (let j = i + 1; j < nums.length; j++) {',
      '      if (nums[i] === nums[j]) {',
      '        return true; // Match found!',
      '      }',
      '    }',
      '  }',
      '  return false; // All elements unique',
      '}'
    ].join('\n');

    const steps = [];
    steps.push({
      stepIndex: 0,
      codeLine: 2,
      explanation: `Initialize brute-force scan. We will compare every element nums[i] with every following element nums[j].`,
      array: [...nums],
      arrayLabel: 'nums',
      pointers: [{ name: 'i', index: 0, color: '#38bdf8', position: 'top' }],
      elementStates: {},
      variables: [{ name: 'i', value: 0 }, { name: 'j', value: '-' }, { name: 'status', value: 'Starting' }],
      isComplete: false
    });

    let found = false;
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        const isMatch = nums[i] === nums[j];
        steps.push({
          stepIndex: steps.length,
          codeLine: 4,
          explanation: `Comparing nums[${i}] = ${nums[i]} with nums[${j}] = ${nums[j]}. ${isMatch ? 'Match found! 🎉 Both elements are equal.' : 'Not equal. Continue checking next pair.'}`,
          array: [...nums],
          arrayLabel: 'nums',
          pointers: [
            { name: 'i', index: i, color: '#38bdf8', position: 'top' },
            { name: 'j', index: j, color: '#f59e0b', position: 'bottom' }
          ],
          elementStates: {
            [i]: isMatch ? 'matched' : 'active',
            [j]: isMatch ? 'matched' : 'comparing'
          },
          variables: [
            { name: 'nums[i]', value: nums[i] },
            { name: 'nums[j]', value: nums[j] },
            { name: 'equal?', value: String(isMatch) }
          ],
          isComplete: isMatch,
          isSuccess: isMatch
        });

        if (isMatch) {
          found = true;
          steps.push({
            stepIndex: steps.length,
            codeLine: 5,
            explanation: `Duplicate detected! nums[${i}] === nums[${j}] === ${nums[i]}. Algorithm returns TRUE early.`,
            array: [...nums],
            arrayLabel: 'nums',
            pointers: [
              { name: 'i', index: i, color: '#10b981', position: 'top' },
              { name: 'j', index: j, color: '#10b981', position: 'bottom' }
            ],
            elementStates: { [i]: 'matched', [j]: 'matched' },
            variables: [{ name: 'result', value: 'true' }],
            isComplete: true,
            isSuccess: true
          });
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      steps.push({
        stepIndex: steps.length,
        codeLine: 9,
        explanation: `Finished checking all n*(n-1)/2 pairs. No duplicate values exist. Returns FALSE.`,
        array: [...nums],
        arrayLabel: 'nums',
        pointers: [],
        elementStates: {},
        variables: [{ name: 'result', value: 'false' }],
        isComplete: true,
        isSuccess: true
      });
    }

    return { title: 'Contains Duplicate (Brute Force O(N²))', codeSnippet, steps };
  }

  // Optimal Hash Set Approach
  const codeSnippet = [
    'function containsDuplicate(nums) {',
    '  const seen = new Set();',
    '  for (let i = 0; i < nums.length; i++) {',
    '    const num = nums[i];',
    '    if (seen.has(num)) {',
    '      return true; // Duplicate found in O(1)!',
    '    }',
    '    seen.add(num);',
    '  }',
    '  return false;',
    '}'
  ].join('\n');

  const steps = [];
  const seenSet = [];

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: `Allocate an empty Hash Set (seen = new Set()). This stores visited numbers and gives average O(1) membership checks.`,
    array: [...nums],
    arrayLabel: 'nums',
    pointers: [],
    elementStates: {},
    hashSet: { title: 'seen (Set)', items: [], lastAction: { type: 'init' } },
    variables: [{ name: 'seen.size', value: 0 }],
    isComplete: false
  });

  let duplicateFound = false;
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Step 1: inspect element
    steps.push({
      stepIndex: steps.length,
      codeLine: 4,
      explanation: `Inspecting index ${i}: num = ${num}. Querying hash set: does seen.has(${num})?`,
      array: [...nums],
      arrayLabel: 'nums',
      pointers: [{ name: 'i', index: i, color: '#38bdf8', position: 'top' }],
      elementStates: { [i]: 'active' },
      hashSet: { title: 'seen (Set)', items: [...seenSet], lastAction: { type: 'lookup', value: num } },
      variables: [
        { name: 'i', value: i },
        { name: 'num', value: num },
        { name: 'seen.has(num)', value: String(seenSet.includes(num)) }
      ],
      isComplete: false
    });

    if (seenSet.includes(num)) {
      duplicateFound = true;
      // Step 2: match
      steps.push({
        stepIndex: steps.length,
        codeLine: 5,
        explanation: `🎯 HIT! Number ${num} is ALREADY in the seen set! We found a duplicate in O(1) time without nested loops.`,
        array: [...nums],
        arrayLabel: 'nums',
        pointers: [{ name: 'i', index: i, color: '#10b981', position: 'top' }],
        elementStates: { [i]: 'matched' },
        hashSet: { title: 'seen (Set)', items: [...seenSet], lastAction: { type: 'hit', value: num } },
        variables: [{ name: 'duplicate', value: num }, { name: 'result', value: 'true' }],
        isComplete: true,
        isSuccess: true
      });
      break;
    } else {
      // Step 3: add to set
      seenSet.push(num);
      steps.push({
        stepIndex: steps.length,
        codeLine: 8,
        explanation: `Number ${num} is NOT in seen set. Adding ${num} to seen (seen.add(${num})). Current set: {${seenSet.join(', ')}}.`,
        array: [...nums],
        arrayLabel: 'nums',
        pointers: [{ name: 'i', index: i, color: '#38bdf8', position: 'top' }],
        elementStates: { [i]: 'stored' },
        hashSet: { title: 'seen (Set)', items: [...seenSet], lastAction: { type: 'add', value: num } },
        variables: [
          { name: 'seen.size', value: seenSet.length },
          { name: 'added', value: num }
        ],
        isComplete: false
      });
    }
  }

  if (!duplicateFound) {
    steps.push({
      stepIndex: steps.length,
      codeLine: 10,
      explanation: `Finished traversing all ${nums.length} elements without encountering any duplicate. Return FALSE.`,
      array: [...nums],
      arrayLabel: 'nums',
      pointers: [],
      elementStates: {},
      hashSet: { title: 'seen (Set)', items: [...seenSet], lastAction: { type: 'complete' } },
      variables: [{ name: 'result', value: 'false' }],
      isComplete: true,
      isSuccess: true
    });
  }

  return { title: 'Contains Duplicate (Hash Set O(N))', codeSnippet, steps };
}

// -------------------------------------------------------------
// 2. TWO SUM (LeetCode #1)
// -------------------------------------------------------------
export function generateTwoSumSteps(inputNums = [2, 7, 11, 15], targetVal = 9) {
  const nums = Array.isArray(inputNums) && inputNums.length > 0 ? inputNums : [2, 7, 11, 15];
  const target = typeof targetVal === 'number' && !isNaN(targetVal) ? targetVal : 9;

  const codeSnippet = [
    'function twoSum(nums, target) {',
    '  const map = new Map(); // value -> index',
    '  for (let i = 0; i < nums.length; i++) {',
    '    const complement = target - nums[i];',
    '    if (map.has(complement)) {',
    '      return [map.get(complement), i]; // Pair found!',
    '    }',
    '    map.set(nums[i], i);',
    '  }',
    '  return [];',
    '}'
  ].join('\n');

  const steps = [];
  const entries = []; // Array of { key, value }

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: `Allocate an empty Hash Map (map = new Map()). This will map each visited value to its index in the array. Target = ${target}.`,
    array: [...nums],
    arrayLabel: 'nums',
    pointers: [],
    elementStates: {},
    hashMap: { title: 'map (Value ➔ Index)', entries: [], lastLookup: null },
    variables: [{ name: 'target', value: target }, { name: 'map.size', value: 0 }],
    isComplete: false
  });

  let solutionFound = false;

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const complement = target - num;

    // Step: calculate complement
    const foundEntry = entries.find(e => e.key === complement);

    steps.push({
      stepIndex: steps.length,
      codeLine: 4,
      explanation: `At index ${i}, nums[${i}] = ${num}. We need a complement of: target - nums[i] = ${target} - ${num} = ${complement}. Checking if ${complement} is in the map...`,
      array: [...nums],
      arrayLabel: 'nums',
      pointers: [{ name: 'i', index: i, color: '#38bdf8', position: 'top' }],
      elementStates: { [i]: 'active' },
      hashMap: {
        title: 'map (Value ➔ Index)',
        entries: [...entries],
        lastLookup: { key: complement, found: !!foundEntry, mappedValue: foundEntry ? foundEntry.value : null }
      },
      variables: [
        { name: 'i', value: i },
        { name: 'num', value: num },
        { name: 'complement', value: complement },
        { name: 'map.has(complement)', value: String(!!foundEntry) }
      ],
      isComplete: false
    });

    if (foundEntry) {
      solutionFound = true;
      const prevIdx = foundEntry.value;

      steps.push({
        stepIndex: steps.length,
        codeLine: 6,
        explanation: `🎯 SOLUTION FOUND! Complement ${complement} was previously recorded at index ${prevIdx}! nums[${prevIdx}] (${complement}) + nums[${i}] (${num}) = ${target}. Returning indices [${prevIdx}, ${i}].`,
        array: [...nums],
        arrayLabel: 'nums',
        pointers: [
          { name: 'match', index: prevIdx, color: '#10b981', position: 'top' },
          { name: 'current', index: i, color: '#10b981', position: 'top' }
        ],
        elementStates: { [prevIdx]: 'matched', [i]: 'matched' },
        hashMap: {
          title: 'map (Value ➔ Index)',
          entries: [...entries],
          lastLookup: { key: complement, found: true, mappedValue: prevIdx }
        },
        variables: [
          { name: 'index 1', value: prevIdx },
          { name: 'index 2', value: i },
          { name: 'sum', value: `${complement} + ${num} = ${target}` },
          { name: 'result', value: `[${prevIdx}, ${i}]` }
        ],
        isComplete: true,
        isSuccess: true
      });
      break;
    } else {
      entries.push({ key: num, value: i });
      steps.push({
        stepIndex: steps.length,
        codeLine: 8,
        explanation: `${complement} was NOT found in the map. Store current element map.set(${num}, ${i}) for future numbers to look up.`,
        array: [...nums],
        arrayLabel: 'nums',
        pointers: [{ name: 'i', index: i, color: '#38bdf8', position: 'top' }],
        elementStates: { [i]: 'stored' },
        hashMap: {
          title: 'map (Value ➔ Index)',
          entries: [...entries],
          lastLookup: { key: complement, found: false }
        },
        variables: [
          { name: 'map.size', value: entries.length },
          { name: 'stored', value: `${num} ➔ ${i}` }
        ],
        isComplete: false
      });
    }
  }

  if (!solutionFound) {
    steps.push({
      stepIndex: steps.length,
      codeLine: 10,
      explanation: `No two numbers in the array sum up to target ${target}. Returns [].`,
      array: [...nums],
      arrayLabel: 'nums',
      pointers: [],
      elementStates: {},
      hashMap: { title: 'map (Value ➔ Index)', entries: [...entries], lastLookup: null },
      variables: [{ name: 'result', value: '[]' }],
      isComplete: true,
      isSuccess: false
    });
  }

  return { title: 'Two Sum (Hash Map O(N))', codeSnippet, steps };
}

// -------------------------------------------------------------
// 3. PRODUCT OF ARRAY EXCEPT SELF (LeetCode #238)
// -------------------------------------------------------------
export function generateProductExceptSelfSteps(inputNums = [1, 2, 3, 4]) {
  const nums = Array.isArray(inputNums) && inputNums.length > 0 ? inputNums : [1, 2, 3, 4];
  const n = nums.length;

  const codeSnippet = [
    'function productExceptSelf(nums) {',
    '  const res = new Array(nums.length).fill(1);',
    '  let prefix = 1;',
    '  for (let i = 0; i < nums.length; i++) {',
    '    res[i] = prefix;',
    '    prefix *= nums[i];',
    '  }',
    '  let postfix = 1;',
    '  for (let i = nums.length - 1; i >= 0; i--) {',
    '    res[i] *= postfix;',
    '    postfix *= nums[i];',
    '  }',
    '  return res;',
    '}'
  ].join('\n');

  const steps = [];
  const res = new Array(n).fill(1);

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: `Initialize result array filled with 1s: [${res.join(', ')}]. We avoid division by computing running prefix products (left ➔ right) and postfix products (right ➔ left).`,
    array: [...nums],
    arrayLabel: 'nums (Input)',
    auxArrays: [{ label: 'res (Prefix & Combined)', array: [...res], activeIndex: null }],
    pointers: [],
    elementStates: {},
    variables: [{ name: 'prefix', value: 1 }, { name: 'postfix', value: '-' }],
    isComplete: false
  });

  // Pass 1: Forward prefix
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    res[i] = prefix;
    steps.push({
      stepIndex: steps.length,
      codeLine: 5,
      explanation: `Forward Pass index ${i}: Set res[${i}] = prefix (${prefix}). All elements strictly to the left of index ${i} multiply to ${prefix}.`,
      array: [...nums],
      arrayLabel: 'nums (Input)',
      auxArrays: [{ label: 'res (Prefix Accumulator)', array: [...res], activeIndex: i }],
      pointers: [{ name: 'i (Prefix)', index: i, color: '#38bdf8', position: 'top' }],
      elementStates: { [i]: 'active' },
      variables: [
        { name: 'i', value: i },
        { name: 'nums[i]', value: nums[i] },
        { name: 'res[i]', value: res[i] },
        { name: 'running prefix', value: prefix }
      ],
      isComplete: false
    });

    prefix *= nums[i];
    steps.push({
      stepIndex: steps.length,
      codeLine: 6,
      explanation: `Update prefix: prefix *= nums[${i}] (${nums[i]}) ➔ prefix is now ${prefix}. Moving to next index.`,
      array: [...nums],
      arrayLabel: 'nums (Input)',
      auxArrays: [{ label: 'res (Prefix Accumulator)', array: [...res], activeIndex: i }],
      pointers: [{ name: 'i', index: i, color: '#38bdf8', position: 'top' }],
      elementStates: { [i]: 'stored' },
      variables: [{ name: 'prefix', value: prefix }],
      isComplete: false
    });
  }

  // Pass 2: Backward postfix
  let postfix = 1;
  for (let i = n - 1; i >= 0; i--) {
    const oldVal = res[i];
    res[i] *= postfix;

    steps.push({
      stepIndex: steps.length,
      codeLine: 10,
      explanation: `Backward Pass index ${i}: res[${i}] was ${oldVal}. Multiply by running postfix (${postfix}): res[${i}] = ${oldVal} * ${postfix} = ${res[i]}. Now res[${i}] holds the product of ALL elements except nums[${i}]!`,
      array: [...nums],
      arrayLabel: 'nums (Input)',
      auxArrays: [{ label: 'res (Final Answer Building)', array: [...res], activeIndex: i }],
      pointers: [{ name: 'i (Postfix)', index: i, color: '#ec4899', position: 'bottom' }],
      elementStates: { [i]: 'matched' },
      variables: [
        { name: 'i', value: i },
        { name: 'postfix', value: postfix },
        { name: 'res[i] final', value: res[i] }
      ],
      isComplete: false
    });

    postfix *= nums[i];
  }

  steps.push({
    stepIndex: steps.length,
    codeLine: 13,
    explanation: `Done! Final array productExceptSelf: [${res.join(', ')}]. Solved in O(N) time with O(1) auxiliary space (excluding output array).`,
    array: [...nums],
    arrayLabel: 'nums (Input)',
    auxArrays: [{ label: 'Final Output (res)', array: [...res], activeIndex: null }],
    pointers: [],
    elementStates: {},
    variables: [{ name: 'result', value: `[${res.join(', ')}]` }],
    isComplete: true,
    isSuccess: true
  });

  return { title: 'Product of Array Except Self (Prefix & Suffix O(N))', codeSnippet, steps };
}

// -------------------------------------------------------------
// 4. TWO POINTERS VISUALIZER (Palindromes / Container / Two Sum II)
// -------------------------------------------------------------
export function generateTwoPointersSteps(inputStrOrArr = 'racecar') {
  const isArray = Array.isArray(inputStrOrArr);
  const items = isArray ? inputStrOrArr : String(inputStrOrArr).split('');

  const codeSnippet = [
    'function isPalindromeTwoPointers(arr) {',
    '  let left = 0;',
    '  let right = arr.length - 1;',
    '  while (left < right) {',
    '    if (arr[left] !== arr[right]) {',
    '      return false; // Mismatch!',
    '    }',
    '    left++;',
    '    right--;',
    '  }',
    '  return true; // Symmetric palindrome',
    '}'
  ].join('\n');

  const steps = [];
  let left = 0;
  let right = items.length - 1;

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: `Initialize Two Pointers at opposite boundaries: left = 0 (first element '${items[left]}') and right = ${right} (last element '${items[right]}').`,
    array: [...items],
    arrayLabel: isArray ? 'Array' : 'String Characters',
    pointers: [
      { name: 'left', index: left, color: '#38bdf8', position: 'top' },
      { name: 'right', index: right, color: '#f59e0b', position: 'top' }
    ],
    elementStates: { [left]: 'active', [right]: 'active' },
    variables: [{ name: 'left', value: left }, { name: 'right', value: right }],
    isComplete: false
  });

  let isPal = true;
  while (left < right) {
    const match = items[left] === items[right];

    steps.push({
      stepIndex: steps.length,
      codeLine: 5,
      explanation: `Comparing arr[${left}] ('${items[left]}') with arr[${right}] ('${items[right]}'). ${match ? 'They match! Symmetry holds.' : 'Mismatch detected! Not a palindrome.'}`,
      array: [...items],
      arrayLabel: isArray ? 'Array' : 'String Characters',
      pointers: [
        { name: 'left', index: left, color: match ? '#10b981' : '#ef4444', position: 'top' },
        { name: 'right', index: right, color: match ? '#10b981' : '#ef4444', position: 'top' }
      ],
      elementStates: { [left]: match ? 'matched' : 'active', [right]: match ? 'matched' : 'active' },
      variables: [
        { name: 'arr[left]', value: items[left] },
        { name: 'arr[right]', value: items[right] },
        { name: 'equal?', value: String(match) }
      ],
      isComplete: !match,
      isSuccess: match
    });

    if (!match) {
      isPal = false;
      steps.push({
        stepIndex: steps.length,
        codeLine: 6,
        explanation: `Mismatch at indices ${left} and ${right}! Algorithm exits early and returns FALSE.`,
        array: [...items],
        arrayLabel: isArray ? 'Array' : 'String Characters',
        pointers: [
          { name: 'left', index: left, color: '#ef4444', position: 'top' },
          { name: 'right', index: right, color: '#ef4444', position: 'top' }
        ],
        elementStates: { [left]: 'comparing', [right]: 'comparing' },
        variables: [{ name: 'result', value: 'false' }],
        isComplete: true,
        isSuccess: false
      });
      break;
    }

    left++;
    right--;

    if (left < right) {
      steps.push({
        stepIndex: steps.length,
        codeLine: 8,
        explanation: `Move pointers inward: left incremented to ${left}, right decremented to ${right}.`,
        array: [...items],
        arrayLabel: isArray ? 'Array' : 'String Characters',
        pointers: [
          { name: 'left', index: left, color: '#38bdf8', position: 'top' },
          { name: 'right', index: right, color: '#f59e0b', position: 'top' }
        ],
        elementStates: { [left]: 'active', [right]: 'active' },
        variables: [{ name: 'left', value: left }, { name: 'right', value: right }],
        isComplete: false
      });
    }
  }

  if (isPal) {
    steps.push({
      stepIndex: steps.length,
      codeLine: 11,
      explanation: `Pointers met or crossed in the middle (left >= right). Every symmetric pair matched perfectly! Returns TRUE.`,
      array: [...items],
      arrayLabel: isArray ? 'Array' : 'String Characters',
      pointers: left === right ? [{ name: 'center', index: left, color: '#10b981', position: 'top' }] : [],
      elementStates: items.reduce((acc, _, idx) => ({ ...acc, [idx]: 'matched' }), {}),
      variables: [{ name: 'result', value: 'true (Palindrome)' }],
      isComplete: true,
      isSuccess: true
    });
  }

  return { title: 'Two Pointers Convergence (O(N) Time, O(1) Space)', codeSnippet, steps };
}

// -------------------------------------------------------------
// 5. SLIDING WINDOW VISUALIZER (Fixed / Dynamic Window)
// -------------------------------------------------------------
export function generateSlidingWindowSteps(inputNums = [2, 1, 5, 1, 3, 2], kVal = 3) {
  const nums = Array.isArray(inputNums) && inputNums.length > 0 ? inputNums : [2, 1, 5, 1, 3, 2];
  const k = Math.min(Math.max(1, kVal), nums.length);

  const codeSnippet = [
    'function maxSubArraySum(nums, k) {',
    '  let windowSum = 0;',
    '  let maxSum = 0;',
    '  // Compute initial window of size k',
    '  for (let i = 0; i < k; i++) windowSum += nums[i];',
    '  maxSum = windowSum;',
    '  // Slide window rightwards one element at a time',
    '  for (let i = k; i < nums.length; i++) {',
    '    windowSum += nums[i] - nums[i - k]; // Add right, drop left',
    '    maxSum = Math.max(maxSum, windowSum);',
    '  }',
    '  return maxSum;',
    '}'
  ].join('\n');

  const steps = [];
  let windowSum = 0;

  // Initial window
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  let maxSum = windowSum;

  steps.push({
    stepIndex: 0,
    codeLine: 5,
    explanation: `Compute initial window of size k = ${k}: indices [0..${k - 1}] sum = ${nums.slice(0, k).join(' + ')} = ${windowSum}. Initial maxSum = ${maxSum}.`,
    array: [...nums],
    arrayLabel: 'nums',
    pointers: [
      { name: 'L', index: 0, color: '#38bdf8', position: 'top' },
      { name: 'R', index: k - 1, color: '#38bdf8', position: 'top' }
    ],
    elementStates: nums.reduce((acc, _, idx) => {
      if (idx < k) acc[idx] = 'in-window';
      return acc;
    }, {}),
    window: { left: 0, right: k - 1, sum: windowSum },
    variables: [
      { name: 'k', value: k },
      { name: 'windowSum', value: windowSum },
      { name: 'maxSum', value: maxSum }
    ],
    isComplete: false
  });

  for (let i = k; i < nums.length; i++) {
    const leaving = nums[i - k];
    const entering = nums[i];
    const leftIdx = i - k + 1;
    const rightIdx = i;

    windowSum += entering - leaving;
    const isNewMax = windowSum > maxSum;
    if (isNewMax) maxSum = windowSum;

    steps.push({
      stepIndex: steps.length,
      codeLine: 9,
      explanation: `Slide Window Right: Dropped left element nums[${i - k}] (${leaving}), Added right element nums[${i}] (${entering}). New windowSum = ${windowSum}. ${isNewMax ? `🎉 New Max Sum discovered: ${maxSum}!` : `maxSum remains ${maxSum}.`}`,
      array: [...nums],
      arrayLabel: 'nums',
      pointers: [
        { name: 'L', index: leftIdx, color: '#a855f7', position: 'top' },
        { name: 'R', index: rightIdx, color: '#a855f7', position: 'top' }
      ],
      elementStates: nums.reduce((acc, _, idx) => {
        if (idx >= leftIdx && idx <= rightIdx) acc[idx] = 'in-window';
        if (idx === rightIdx) acc[idx] = 'matched';
        return acc;
      }, {}),
      window: { left: leftIdx, right: rightIdx, sum: windowSum },
      variables: [
        { name: 'dropped (left)', value: leaving },
        { name: 'added (right)', value: entering },
        { name: 'windowSum', value: windowSum },
        { name: 'maxSum', value: maxSum }
      ],
      isComplete: false
    });
  }

  steps.push({
    stepIndex: steps.length,
    codeLine: 12,
    explanation: `Window traversed entire array! Max Subarray Sum of size k = ${k} is ${maxSum}. Running time is strictly O(N) because each element is added and dropped once.`,
    array: [...nums],
    arrayLabel: 'nums',
    pointers: [],
    elementStates: {},
    variables: [{ name: 'result maxSum', value: maxSum }],
    isComplete: true,
    isSuccess: true
  });

  return { title: 'Sliding Window (Max Sum Subarray of size K - O(N))', codeSnippet, steps };
}

// -------------------------------------------------------------
// 6. BINARY SEARCH VISUALIZER (Halving Monotonic Space)
// -------------------------------------------------------------
export function generateBinarySearchSteps(inputNums = [1, 3, 5, 7, 9, 11, 13, 15], targetVal = 9) {
  const raw = Array.isArray(inputNums) && inputNums.length > 0 ? inputNums : [1, 3, 5, 7, 9, 11, 13, 15];
  // Ensure array is sorted
  const nums = [...raw].sort((a, b) => a - b);
  const target = typeof targetVal === 'number' && !isNaN(targetVal) ? targetVal : 9;

  const codeSnippet = [
    'function binarySearch(nums, target) {',
    '  let low = 0;',
    '  let high = nums.length - 1;',
    '  while (low <= high) {',
    '    const mid = Math.floor(low + (high - low) / 2);',
    '    if (nums[mid] === target) {',
    '      return mid; // Target found in O(log N)!',
    '    } else if (nums[mid] < target) {',
    '      low = mid + 1; // Eliminate left half',
    '    } else {',
    '      high = mid - 1; // Eliminate right half',
    '    }',
    '  }',
    '  return -1; // Not found',
    '}'
  ].join('\n');

  const steps = [];
  let low = 0;
  let high = nums.length - 1;
  const eliminated = new Set();

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: `Initialize Binary Search on sorted array. Target = ${target}. Set boundaries low = 0, high = ${high}. Search space size = ${nums.length}.`,
    array: [...nums],
    arrayLabel: 'nums (Sorted)',
    pointers: [
      { name: 'low', index: low, color: '#38bdf8', position: 'top' },
      { name: 'high', index: high, color: '#f59e0b', position: 'top' }
    ],
    elementStates: {},
    variables: [
      { name: 'target', value: target },
      { name: 'low', value: low },
      { name: 'high', value: high }
    ],
    isComplete: false
  });

  let found = false;

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    const midVal = nums[mid];

    // Inspect mid
    steps.push({
      stepIndex: steps.length,
      codeLine: 5,
      explanation: `Calculate mid = Math.floor(${low} + (${high} - ${low}) / 2) = ${mid}. nums[mid] = ${midVal}. Comparing nums[mid] with target ${target}...`,
      array: [...nums],
      arrayLabel: 'nums (Sorted)',
      pointers: [
        { name: 'low', index: low, color: '#38bdf8', position: 'top' },
        { name: 'mid', index: mid, color: '#a855f7', position: 'bottom' },
        { name: 'high', index: high, color: '#f59e0b', position: 'top' }
      ],
      elementStates: nums.reduce((acc, _, idx) => {
        if (eliminated.has(idx)) acc[idx] = 'eliminated';
        else if (idx === mid) acc[idx] = 'active';
        return acc;
      }, {}),
      variables: [
        { name: 'low', value: low },
        { name: 'mid', value: mid },
        { name: 'nums[mid]', value: midVal },
        { name: 'high', value: high }
      ],
      isComplete: false
    });

    if (midVal === target) {
      found = true;
      steps.push({
        stepIndex: steps.length,
        codeLine: 7,
        explanation: `🎯 BINGO! nums[${mid}] === ${target}! Found target at index ${mid} in logarithmic time!`,
        array: [...nums],
        arrayLabel: 'nums (Sorted)',
        pointers: [{ name: 'TARGET FOUND', index: mid, color: '#10b981', position: 'top' }],
        elementStates: nums.reduce((acc, _, idx) => {
          if (idx === mid) acc[idx] = 'matched';
          else if (eliminated.has(idx)) acc[idx] = 'eliminated';
          return acc;
        }, {}),
        variables: [
          { name: 'found at index', value: mid },
          { name: 'result', value: mid }
        ],
        isComplete: true,
        isSuccess: true
      });
      break;
    } else if (midVal < target) {
      // Eliminate left half
      for (let k = low; k <= mid; k++) eliminated.add(k);
      steps.push({
        stepIndex: steps.length,
        codeLine: 9,
        explanation: `nums[mid] = ${midVal} is LESS than target ${target}. Since array is sorted, all elements from index ${low} to ${mid} are also < ${target}. Discarding left half! Set low = mid + 1 = ${mid + 1}.`,
        array: [...nums],
        arrayLabel: 'nums (Sorted)',
        pointers: [
          { name: 'low', index: mid + 1, color: '#38bdf8', position: 'top' },
          { name: 'high', index: high, color: '#f59e0b', position: 'top' }
        ],
        elementStates: nums.reduce((acc, _, idx) => {
          if (eliminated.has(idx)) acc[idx] = 'eliminated';
          return acc;
        }, {}),
        variables: [{ name: 'new low', value: mid + 1 }, { name: 'eliminated count', value: eliminated.size }],
        isComplete: false
      });
      low = mid + 1;
    } else {
      // Eliminate right half
      for (let k = mid; k <= high; k++) eliminated.add(k);
      steps.push({
        stepIndex: steps.length,
        codeLine: 11,
        explanation: `nums[mid] = ${midVal} is GREATER than target ${target}. All elements from index ${mid} to ${high} are also > ${target}. Discarding right half! Set high = mid - 1 = ${mid - 1}.`,
        array: [...nums],
        arrayLabel: 'nums (Sorted)',
        pointers: [
          { name: 'low', index: low, color: '#38bdf8', position: 'top' },
          { name: 'high', index: mid - 1, color: '#f59e0b', position: 'top' }
        ],
        elementStates: nums.reduce((acc, _, idx) => {
          if (eliminated.has(idx)) acc[idx] = 'eliminated';
          return acc;
        }, {}),
        variables: [{ name: 'new high', value: mid - 1 }, { name: 'eliminated count', value: eliminated.size }],
        isComplete: false
      });
      high = mid - 1;
    }
  }

  if (!found) {
    steps.push({
      stepIndex: steps.length,
      codeLine: 14,
      explanation: `Search space exhausted (low > high). Target ${target} does not exist in the array. Returns -1.`,
      array: [...nums],
      arrayLabel: 'nums (Sorted)',
      pointers: [],
      elementStates: nums.reduce((acc, _, idx) => ({ ...acc, [idx]: 'eliminated' }), {}),
      variables: [{ name: 'result', value: -1 }],
      isComplete: true,
      isSuccess: false
    });
  }

  return { title: 'Binary Search (Logarithmic O(log N))', codeSnippet, steps };
}

// -------------------------------------------------------------

// -------------------------------------------------------------
// 7. VALID ANAGRAM VISUALIZER (LeetCode #242)
// -------------------------------------------------------------
export function generateValidAnagramSteps(sStr = "anagram", tStr = "nagaram") {
  const s = String(sStr || "anagram");
  const t = String(tStr || "nagaram");

  const codeSnippet = [
    'function isAnagram(s, t) {',
    '  if (s.length !== t.length) return false;',
    '  const count = {};',
    '  for (let i = 0; i < s.length; i++) {',
    '    count[s[i]] = (count[s[i]] || 0) + 1;',
    '    count[t[i]] = (count[t[i]] || 0) - 1;',
    '  }',
    '  for (const key in count) {',
    '    if (count[key] !== 0) return false;',
    '  }',
    '  return true;',
    '}'
  ].join('\n');

  const steps = [];
  const mapEntries = {};

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: `Verify lengths: s.length (${s.length}) vs t.length (${t.length}). Lengths match, initializing frequency map.`,
    array: s.split(''),
    arrayLabel: `s: "${s}"`,
    auxArrays: [{ label: `t: "${t}"`, array: t.split(''), activeIndex: null }],
    pointers: [],
    elementStates: {},
    variables: [{ name: 's.length', value: s.length }, { name: 't.length', value: t.length }],
    isComplete: false
  });

  for (let i = 0; i < s.length; i++) {
    const sChar = s[i];
    const tChar = t[i];

    mapEntries[sChar] = (mapEntries[sChar] || 0) + 1;
    mapEntries[tChar] = (mapEntries[tChar] || 0) - 1;

    steps.push({
      stepIndex: steps.length,
      codeLine: 5,
      explanation: `Index ${i}: Increment frequency for s[${i}]='${sChar}' (+1), Decrement for t[${i}]='${tChar}' (-1).`,
      array: s.split(''),
      arrayLabel: `s: "${s}"`,
      auxArrays: [{ label: `t: "${t}"`, array: t.split(''), activeIndex: i }],
      pointers: [
        { name: `s[${i}]`, index: i, color: '#38bdf8', position: 'top' }
      ],
      elementStates: { [i]: 'active' },
      hashMap: {
        title: 'Character Frequency Balances',
        entries: Object.entries(mapEntries).map(([k, v]) => ({ key: k, value: v }))
      },
      variables: [
        { name: 'char s', value: sChar },
        { name: 'char t', value: tChar }
      ],
      isComplete: false
    });
  }

  const isAnagram = Object.values(mapEntries).every(v => v === 0);

  steps.push({
    stepIndex: steps.length,
    codeLine: 11,
    explanation: isAnagram
      ? `🎉 All character counts returned to exact zero! Strings "${s}" and "${t}" are valid anagrams.`
      : `Counts did not return to zero. Strings are NOT anagrams.`,
    array: s.split(''),
    arrayLabel: `s: "${s}"`,
    auxArrays: [{ label: `t: "${t}"`, array: t.split(''), activeIndex: null }],
    pointers: [],
    elementStates: s.split('').reduce((acc, _, idx) => ({ ...acc, [idx]: isAnagram ? 'matched' : 'eliminated' }), {}),
    variables: [{ name: 'isAnagram', value: String(isAnagram) }],
    isComplete: true,
    isSuccess: isAnagram
  });

  return { title: 'Valid Anagram (Frequency Balances O(N))', codeSnippet, steps };
}

// -------------------------------------------------------------
// 8. TOP K FREQUENT ELEMENTS (LeetCode #347)
// -------------------------------------------------------------
export function generateTopKFrequentSteps(inputNums = [1, 1, 1, 2, 2, 3], kVal = 2) {
  const nums = Array.isArray(inputNums) && inputNums.length > 0 ? inputNums : [1, 1, 1, 2, 2, 3];
  const k = Math.min(Math.max(1, kVal), nums.length);

  const codeSnippet = [
    'function topKFrequent(nums, k) {',
    '  const freq = new Map();',
    '  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);',
    '  const buckets = Array.from({ length: nums.length + 1 }, () => []);',
    '  for (const [num, count] of freq) buckets[count].push(num);',
    '  const res = [];',
    '  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {',
    '    if (buckets[i].length) res.push(...buckets[i]);',
    '  }',
    '  return res.slice(0, k);',
    '}'
  ].join('\n');

  const steps = [];
  const freq = {};
  for (const n of nums) freq[n] = (freq[n] || 0) + 1;

  steps.push({
    stepIndex: 0,
    codeLine: 3,
    explanation: `Count frequency of every element: ${Object.entries(freq).map(([num, count]) => `${num} (x${count})`).join(', ')}.`,
    array: [...nums],
    arrayLabel: 'nums',
    pointers: [],
    elementStates: {},
    hashMap: {
      title: 'Element -> Frequency Map',
      entries: Object.entries(freq).map(([num, count]) => ({ key: num, value: count }))
    },
    variables: [{ name: 'k', value: k }],
    isComplete: false
  });

  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of Object.entries(freq)) {
    buckets[count].push(Number(num));
  }

  const res = [];
  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {
    if (buckets[i].length > 0) {
      for (const num of buckets[i]) {
        res.push(num);
        steps.push({
          stepIndex: steps.length,
          codeLine: 8,
          explanation: `Scanning backwards: Frequency ${i} bucket contains [${buckets[i].join(', ')}]. Adding ${num} to top ${k} result.`,
          array: [...nums],
          arrayLabel: 'nums',
          pointers: [],
          elementStates: nums.reduce((acc, val, idx) => {
            if (val === num) acc[idx] = 'matched';
            return acc;
          }, {}),
          variables: [{ name: 'frequency', value: i }, { name: 'topK result', value: `[${res.join(', ')}]` }],
          isComplete: res.length === k,
          isSuccess: true
        });
        if (res.length === k) break;
      }
    }
  }

  return { title: `Top ${k} Frequent Elements (Bucket Sort O(N))`, codeSnippet, steps };
}

// -------------------------------------------------------------
// 8. LONGEST CONSECUTIVE SEQUENCE (LeetCode #128)
// -------------------------------------------------------------
export function generateLongestConsecutiveSteps(inputNums = [100, 4, 200, 1, 3, 2]) {
  const nums = Array.isArray(inputNums) && inputNums.length > 0 ? inputNums : [100, 4, 200, 1, 3, 2];
  const numSet = new Set(nums);

  const codeSnippet = [
    'function longestConsecutive(nums) {',
    '  const numSet = new Set(nums);',
    '  let longest = 0;',
    '  for (const num of numSet) {',
    '    if (!numSet.has(num - 1)) { // Only start of streaks',
    '      let currentNum = num;',
    '      let currentStreak = 1;',
    '      while (numSet.has(currentNum + 1)) {',
    '        currentNum += 1;',
    '        currentStreak += 1;',
    '      }',
    '      longest = Math.max(longest, currentStreak);',
    '    }',
    '  }',
    '  return longest;',
    '}'
  ].join('\n');

  const steps = [];

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: `Insert all ${nums.length} numbers into a Hash Set for O(1) lookups. We only start counting streaks from numbers where (num - 1) does NOT exist in the set.`,
    array: [...nums],
    arrayLabel: 'nums',
    pointers: [],
    elementStates: {},
    hashSet: {
      title: 'numSet (O(1) lookups)',
      values: Array.from(numSet)
    },
    variables: [{ name: 'longest', value: 0 }],
    isComplete: false
  });

  let longest = 0;
  for (const num of numSet) {
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;

      steps.push({
        stepIndex: steps.length,
        codeLine: 5,
        explanation: `Number ${num} has no left neighbor (${num - 1} is NOT in set). This is the START of a new consecutive streak!`,
        array: [...nums],
        arrayLabel: 'nums',
        pointers: [{ name: 'streak start', index: nums.indexOf(num), color: '#38bdf8', position: 'top' }],
        elementStates: { [nums.indexOf(num)]: 'active' },
        hashSet: { title: 'numSet', values: Array.from(numSet) },
        variables: [{ name: 'streak start', value: num }, { name: 'currentStreak', value: 1 }],
        isComplete: false
      });

      while (numSet.has(currentNum + 1)) {
        currentNum += 1;
        currentStreak += 1;
        steps.push({
          stepIndex: steps.length,
          codeLine: 9,
          explanation: `Found next consecutive number: ${currentNum}. Current streak extends to length ${currentStreak}.`,
          array: [...nums],
          arrayLabel: 'nums',
          pointers: [{ name: 'expanding', index: nums.indexOf(currentNum), color: '#10b981', position: 'top' }],
          elementStates: { [nums.indexOf(currentNum)]: 'matched' },
          hashSet: { title: 'numSet', values: Array.from(numSet) },
          variables: [{ name: 'currentNum', value: currentNum }, { name: 'currentStreak', value: currentStreak }],
          isComplete: false
        });
      }

      longest = Math.max(longest, currentStreak);
    }
  }

  steps.push({
    stepIndex: steps.length,
    codeLine: 15,
    explanation: `Completed set scan! Longest consecutive sequence length is ${longest}.`,
    array: [...nums],
    arrayLabel: 'nums',
    pointers: [],
    elementStates: nums.reduce((acc, _, i) => ({ ...acc, [i]: 'matched' }), {}),
    hashSet: { title: 'numSet', values: Array.from(numSet) },
    variables: [{ name: 'FINAL LONGEST', value: longest }],
    isComplete: true,
    isSuccess: true
  });

  return { title: 'Longest Consecutive Sequence (HashSet O(N))', codeSnippet, steps };
}

// -------------------------------------------------------------
// 9. VALID PARENTHESES (LeetCode #20)
// -------------------------------------------------------------
export function generateValidParenthesesSteps(sStr = "()[]{}") {
  const s = String(sStr || "()[]{}");

  const codeSnippet = [
    'function isValid(s) {',
    '  const stack = [];',
    '  const map = { ")": "(", "}": "{", "]": "[" };',
    '  for (const char of s) {',
    '    if (map[char]) {',
    '      if (stack.pop() !== map[char]) return false;',
    '    } else {',
    '      stack.push(char);',
    '    }',
    '  }',
    '  return stack.length === 0;',
    '}'
  ].join('\n');

  const steps = [];
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: 'Initialize empty LIFO Stack. Open brackets will be pushed; closing brackets will pop and assert matching pair.',
    array: s.split(''),
    arrayLabel: 's (Brackets String)',
    pointers: [],
    elementStates: {},
    variables: [{ name: 'stack.length', value: 0 }],
    isComplete: false
  });

  let valid = true;
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (map[char]) {
      const top = stack.pop();
      const match = top === map[char];
      steps.push({
        stepIndex: steps.length,
        codeLine: 6,
        explanation: `Closing bracket '${char}': Pop stack top ('${top}'). ${match ? `Matches expected '${map[char]}'! Valid pair resolved.` : `Mismatch! Expected '${map[char]}', got '${top}'. Return false.`}`,
        array: s.split(''),
        arrayLabel: 's (Brackets String)',
        pointers: [{ name: 'char', index: i, color: match ? '#10b981' : '#ef4444', position: 'top' }],
        elementStates: { [i]: match ? 'matched' : 'eliminated' },
        auxArrays: [{ label: 'LIFO Stack', array: [...stack], activeIndex: null }],
        variables: [{ name: 'popped', value: top || 'empty' }, { name: 'matches?', value: String(match) }],
        isComplete: !match,
        isSuccess: match
      });
      if (!match) {
        valid = false;
        break;
      }
    } else {
      stack.push(char);
      steps.push({
        stepIndex: steps.length,
        codeLine: 8,
        explanation: `Opening bracket '${char}': Push onto stack. Current stack: [${stack.join(', ')}].`,
        array: s.split(''),
        arrayLabel: 's (Brackets String)',
        pointers: [{ name: 'char', index: i, color: '#38bdf8', position: 'top' }],
        elementStates: { [i]: 'active' },
        auxArrays: [{ label: 'LIFO Stack', array: [...stack], activeIndex: stack.length - 1 }],
        variables: [{ name: 'stack.size', value: stack.length }],
        isComplete: false
      });
    }
  }

  if (valid) {
    const allClosed = stack.length === 0;
    steps.push({
      stepIndex: steps.length,
      codeLine: 11,
      explanation: allClosed
        ? 'All brackets closed in perfect LIFO order! Stack is empty. Return TRUE.'
        : `Unclosed brackets remain in stack: [${stack.join(', ')}]. Return FALSE.`,
      array: s.split(''),
      arrayLabel: 's (Brackets String)',
      pointers: [],
      elementStates: s.split('').reduce((acc, _, idx) => ({ ...acc, [idx]: allClosed ? 'matched' : 'eliminated' }), {}),
      variables: [{ name: 'result', value: String(allClosed) }],
      isComplete: true,
      isSuccess: allClosed
    });
  }

  return { title: 'Valid Parentheses (LIFO Stack O(N))', codeSnippet, steps };
}

// -------------------------------------------------------------
// 10. REVERSE LINKED LIST (LeetCode #206)
// -------------------------------------------------------------
export function generateReverseListSteps(nodesArr = [1, 2, 3, 4, 5]) {
  const nodes = Array.isArray(nodesArr) && nodesArr.length > 0 ? nodesArr : [1, 2, 3, 4, 5];

  const codeSnippet = [
    'function reverseList(head) {',
    '  let prev = null;',
    '  let curr = head;',
    '  while (curr !== null) {',
    '    const nextNode = curr.next; // 1. Save next',
    '    curr.next = prev;           // 2. Reverse link',
    '    prev = curr;               // 3. Advance prev',
    '    curr = nextNode;           // 4. Advance curr',
    '  }',
    '  return prev; // New head',
    '}'
  ].join('\n');

  const steps = [];
  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: 'Initialize prev = null and curr = head. We will iteratively reverse pointers in-place.',
    array: [...nodes],
    arrayLabel: 'Linked List Nodes',
    pointers: [
      { name: 'curr', index: 0, color: '#38bdf8', position: 'top' },
      { name: 'prev (null)', index: 0, color: '#64748b', position: 'bottom' }
    ],
    elementStates: { 0: 'active' },
    variables: [{ name: 'prev', value: 'null' }, { name: 'curr', value: nodes[0] }],
    isComplete: false
  });

  for (let i = 0; i < nodes.length; i++) {
    steps.push({
      stepIndex: steps.length,
      codeLine: 6,
      explanation: `Node ${nodes[i]}: Save nextNode (${i < nodes.length - 1 ? nodes[i + 1] : 'null'}). Reverse link: ${nodes[i]}.next = ${i > 0 ? nodes[i - 1] : 'null'}.`,
      array: [...nodes],
      arrayLabel: 'Linked List Nodes',
      pointers: [
        { name: 'curr', index: i, color: '#10b981', position: 'top' },
        { name: 'prev', index: Math.max(0, i - 1), color: '#a855f7', position: 'bottom' }
      ],
      elementStates: { [i]: 'matched' },
      variables: [
        { name: 'curr.val', value: nodes[i] },
        { name: 'new.next', value: i > 0 ? nodes[i - 1] : 'null' }
      ],
      isComplete: false
    });
  }

  steps.push({
    stepIndex: steps.length,
    codeLine: 10,
    explanation: `Traversal complete! All pointers reversed in-place. New head is ${nodes[nodes.length - 1]}. Result: [${[...nodes].reverse().join(' ➔ ')} ➔ null].`,
    array: [...nodes].reverse(),
    arrayLabel: 'Reversed Linked List',
    pointers: [{ name: 'NEW HEAD', index: 0, color: '#10b981', position: 'top' }],
    elementStates: nodes.reduce((acc, _, idx) => ({ ...acc, [idx]: 'matched' }), {}),
    variables: [{ name: 'new head', value: nodes[nodes.length - 1] }],
    isComplete: true,
    isSuccess: true
  });

  return { title: 'Reverse Linked List (In-Place Pointer Rewiring O(N))', codeSnippet, steps };
}

// -------------------------------------------------------------
// 12. DYNAMIC PROGRAMMING - 1D TABLE (Coin Change / Climbing Stairs)
// -------------------------------------------------------------
export function generateDp1DSteps(amount = 7, coins = [1, 3, 4]) {
  const codeSnippet = [
    'function coinChange(coins, amount) {',
    '  const dp = new Array(amount + 1).fill(Infinity);',
    '  dp[0] = 0; // Base case: 0 coins for amount 0',
    '  for (let i = 1; i <= amount; i++) {',
    '    for (const c of coins) {',
    '      if (i - c >= 0) {',
    '        dp[i] = Math.min(dp[i], 1 + dp[i - c]);',
    '      }',
    '    }',
    '  }',
    '  return dp[amount] === Infinity ? -1 : dp[amount];',
    '}'
  ].join('\n');

  const dp = new Array(amount + 1).fill('∞');
  dp[0] = 0;
  const steps = [];

  steps.push({
    stepIndex: 0,
    codeLine: 3,
    explanation: `Initialize DP table of size ${amount + 1}. Base case: dp[0] = 0 (0 coins needed for amount 0). All other states initialized to infinity.`,
    array: [...dp],
    arrayLabel: 'dp[amount]',
    pointers: [{ name: 'BASE', index: 0, color: '#10b981', position: 'top' }],
    elementStates: { 0: 'matched' },
    variables: [{ name: 'coins', value: coins.join(', ') }, { name: 'target', value: amount }],
    isComplete: false
  });

  for (let i = 1; i <= amount; i++) {
    let minCoins = Infinity;
    for (const c of coins) {
      if (i - c >= 0 && dp[i - c] !== '∞') {
        const candidate = 1 + Number(dp[i - c]);
        minCoins = Math.min(minCoins, candidate);
      }
    }
    dp[i] = minCoins === Infinity ? '∞' : minCoins;

    steps.push({
      stepIndex: steps.length,
      codeLine: 7,
      explanation: `Computing dp[${i}]: Testing coins [${coins.join(', ')}]. Optimal choice yields ${dp[i]} coin(s).`,
      array: [...dp],
      arrayLabel: 'dp[amount]',
      pointers: [{ name: `i=${i}`, index: i, color: '#38bdf8', position: 'top' }],
      elementStates: { [i]: 'active' },
      variables: [{ name: 'current amount', value: i }, { name: 'min coins', value: dp[i] }],
      isComplete: i === amount,
      isSuccess: i === amount
    });
  }

  return { title: 'Dynamic Programming (1D Bottom-Up Table Transition)', codeSnippet, steps };
}

// -------------------------------------------------------------
// 13. GREEDY - KADANE'S MAXIMUM SUBARRAY
// -------------------------------------------------------------
export function generateKadaneSteps(inputNums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]) {
  const nums = Array.isArray(inputNums) && inputNums.length > 0 ? inputNums : [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  const codeSnippet = [
    'function maxSubArray(nums) {',
    '  let maxSum = nums[0];',
    '  let curSum = 0;',
    '  for (let i = 0; i < nums.length; i++) {',
    '    if (curSum < 0) curSum = 0; // Discard negative prefix',
    '    curSum += nums[i];',
    '    maxSum = Math.max(maxSum, curSum);',
    '  }',
    '  return maxSum;',
    '}'
  ].join('\n');

  let maxSum = nums[0];
  let curSum = 0;
  const steps = [];

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: `Initialize Kadane's algorithm. maxSum = nums[0] = ${nums[0]}, curSum = 0.`,
    array: [...nums],
    arrayLabel: 'nums',
    pointers: [{ name: 'START', index: 0, color: '#38bdf8', position: 'top' }],
    elementStates: { 0: 'active' },
    variables: [{ name: 'curSum', value: 0 }, { name: 'maxSum', value: maxSum }],
    isComplete: false
  });

  for (let i = 0; i < nums.length; i++) {
    const dropped = curSum < 0;
    if (curSum < 0) curSum = 0;
    curSum += nums[i];
    const isNewMax = curSum > maxSum;
    maxSum = Math.max(maxSum, curSum);

    steps.push({
      stepIndex: steps.length,
      codeLine: isNewMax ? 7 : (dropped ? 5 : 6),
      explanation: `Index ${i} (value ${nums[i]}): ${dropped ? 'Discarded negative prefix. ' : ''}curSum = ${curSum}. ${isNewMax ? `🎉 New global maximum: ${maxSum}!` : `maxSum remains ${maxSum}.`}`,
      array: [...nums],
      arrayLabel: 'nums',
      pointers: [{ name: 'i', index: i, color: isNewMax ? '#10b981' : '#f59e0b', position: 'top' }],
      elementStates: { [i]: isNewMax ? 'matched' : (curSum >= 0 ? 'active' : 'comparing') },
      variables: [{ name: 'curSum', value: curSum }, { name: 'maxSum', value: maxSum }],
      isComplete: i === nums.length - 1,
      isSuccess: i === nums.length - 1
    });
  }

  return { title: 'Greedy - Kadane\'s Algorithm (O(N) Maximum Subarray)', codeSnippet, steps };
}

// -------------------------------------------------------------
// 14. INTERVALS - MERGE INTERVALS
// -------------------------------------------------------------
export function generateMergeIntervalsSteps(inputIntervals = [[1, 3], [2, 6], [8, 10], [15, 18]]) {
  const intervals = Array.isArray(inputIntervals) && inputIntervals.length > 0 ? inputIntervals : [[1, 3], [2, 6], [8, 10], [15, 18]];
  const codeSnippet = [
    'function merge(intervals) {',
    '  intervals.sort((a, b) => a[0] - b[0]);',
    '  const res = [intervals[0]];',
    '  for (let i = 1; i < intervals.length; i++) {',
    '    const last = res[res.length - 1];',
    '    if (intervals[i][0] <= last[1]) {',
    '      last[1] = Math.max(last[1], intervals[i][1]); // Overlap: extend end',
    '    } else {',
    '      res.push(intervals[i]); // Disjoint: push new',
    '    }',
    '  }',
    '  return res;',
    '}'
  ].join('\n');

  const formatted = intervals.map(p => `[${p[0]},${p[1]}]`);
  const steps = [];

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: 'Sort intervals by start time. Initialize merged output with the first interval.',
    array: [...formatted],
    arrayLabel: 'intervals',
    pointers: [{ name: 'FIRST', index: 0, color: '#10b981', position: 'top' }],
    elementStates: { 0: 'matched' },
    variables: [{ name: 'merged so far', value: formatted[0] }],
    isComplete: false
  });

  const merged = [[...intervals[0]]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const cur = intervals[i];
    const overlaps = cur[0] <= last[1];

    if (overlaps) {
      last[1] = Math.max(last[1], cur[1]);
    } else {
      merged.push([...cur]);
    }

    steps.push({
      stepIndex: steps.length,
      codeLine: overlaps ? 7 : 9,
      explanation: `Inspecting interval [${cur[0]}, ${cur[1]}]. ${overlaps ? `Overlaps with [${last[0]}, ${last[1]}]! Merge and extend end to ${last[1]}.` : `Disjoint from previous. Add as new interval.`}`,
      array: [...formatted],
      arrayLabel: 'intervals',
      pointers: [{ name: 'cur', index: i, color: overlaps ? '#10b981' : '#38bdf8', position: 'top' }],
      elementStates: { [i]: overlaps ? 'matched' : 'active' },
      variables: [{ name: 'merged list', value: merged.map(m => `[${m[0]},${m[1]}]`).join(' ') }],
      isComplete: i === intervals.length - 1,
      isSuccess: i === intervals.length - 1
    });
  }

  return { title: 'Intervals - Merge Overlapping Intervals (O(N log N))', codeSnippet, steps };
}

// -------------------------------------------------------------
// 15. BIT MANIPULATION - SINGLE NUMBER (XOR CANCELLATION)
// -------------------------------------------------------------
export function generateSingleNumberSteps(inputNums = [4, 1, 2, 1, 2]) {
  const nums = Array.isArray(inputNums) && inputNums.length > 0 ? inputNums : [4, 1, 2, 1, 2];
  const codeSnippet = [
    'function singleNumber(nums) {',
    '  let res = 0;',
    '  for (const num of nums) {',
    '    res ^= num; // Bitwise XOR cancellation: x ^ x = 0',
    '  }',
    '  return res;',
    '}'
  ].join('\n');

  let res = 0;
  const steps = [];

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: 'Initialize XOR accumulator res = 0. We will exploit x ^ x = 0 and x ^ 0 = x.',
    array: [...nums],
    arrayLabel: 'nums',
    pointers: [{ name: 'START', index: 0, color: '#38bdf8', position: 'top' }],
    elementStates: {},
    variables: [{ name: 'res (binary)', value: '0b0000' }, { name: 'res (decimal)', value: 0 }],
    isComplete: false
  });

  for (let i = 0; i < nums.length; i++) {
    const prev = res;
    res ^= nums[i];

    steps.push({
      stepIndex: steps.length,
      codeLine: 4,
      explanation: `Step ${i + 1}: ${prev} ^ ${nums[i]} = ${res} (binary: 0b${(res >>> 0).toString(2).padStart(4, '0')}).`,
      array: [...nums],
      arrayLabel: 'nums',
      pointers: [{ name: 'i', index: i, color: '#10b981', position: 'top' }],
      elementStates: { [i]: 'active' },
      variables: [{ name: 'current num', value: nums[i] }, { name: 'res (decimal)', value: res }],
      isComplete: i === nums.length - 1,
      isSuccess: i === nums.length - 1
    });
  }

  return { title: 'Bit Manipulation - XOR Cancellation (O(N) Time, O(1) Space)', codeSnippet, steps };
}

// -------------------------------------------------------------
// MASTER ANIMATION ROUTER FOR ALL PROBLEMS AND PATTERNS
// -------------------------------------------------------------
export function getAnimationForProblem(problemId, customInputs = {}) {
  const pId = Number(problemId);

  switch (pId) {
    case 1:
      return generateContainsDuplicateSteps(customInputs.array || [1, 2, 3, 1], customInputs.approach || 'optimal');
    case 2:
      return generateProductExceptSelfSteps(customInputs.array || [1, 2, 3, 4]);
    case 3:
      return generateValidSudokuSteps(customInputs.board);
    case 4:
      return generateValidAnagramSteps(customInputs.s || "anagram", customInputs.t || "nagaram");
    case 5:
      return generateTwoSumSteps(customInputs.array || [2, 7, 11, 15], customInputs.target ?? 9);
    case 7:
      return generateTopKFrequentSteps(customInputs.array || [1, 1, 1, 2, 2, 3], customInputs.k || 2);
    case 8:
      return generateLongestConsecutiveSteps(customInputs.array || [100, 4, 200, 1, 3, 2]);
    case 10:
    case 11:
    case 14:
      return generateTwoPointersSteps(customInputs.array || 'racecar');
    case 16:
    case 17:
      return generateSlidingWindowSteps(customInputs.array || [2, 1, 5, 1, 3, 2], customInputs.k || 3);
    case 23:
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
    case 29:
      return generateValidParenthesesSteps(customInputs.s || "()[]{}");
    case 30:
      return generateHistogramSteps(customInputs.heights || [2, 1, 5, 6, 2, 3]);
    case 31:
    case 35:
    case 36:
      return generateBinarySearchSteps(customInputs.array || [1, 3, 5, 7, 9, 11, 13, 15], customInputs.target ?? 9);
    case 39:
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 48:
    case 49:
    case 50:
      return generateLinkedListVisualSteps(customInputs.array || [1, 2, 3, 4, 5]);
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
    case 58:
    case 59:
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 65:
      return generateTreeSteps();
    case 85:
    case 86:
    case 87:
    case 88:
    case 89:
    case 90:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 97:
    case 98:
    case 99:
    case 100:
      return generateNumberIslandsSteps(customInputs.grid);
    case 101:
    case 102:
    case 108:
      return generateDp1DSteps(customInputs.amount || 7, customInputs.coins || [1, 3, 4]);
    case 124:
      return generateKadaneSteps(customInputs.array || [-2, 1, -3, 4, -1, 2, 1, -5, 4]);
    case 132:
    case 133:
      return generateMergeIntervalsSteps(customInputs.intervals || [[1, 3], [2, 6], [8, 10], [15, 18]]);
    case 144:
    case 148:
      return generateSingleNumberSteps(customInputs.array || [4, 1, 2, 1, 2]);
    default:
      // Pattern-based fallback
      if (customInputs.pattern === 'DP - 1D' || customInputs.pattern === 'DP - 2D' || customInputs.pattern === 'dynamic-programming') {
        return generateDp1DSteps(customInputs.amount || 7, customInputs.coins || [1, 3, 4]);
      }
      if (customInputs.pattern === 'Greedy' || customInputs.pattern === 'greedy') {
        return generateKadaneSteps(customInputs.array || [-2, 1, -3, 4, -1, 2, 1, -5, 4]);
      }
      if (customInputs.pattern === 'Intervals' || customInputs.pattern === 'intervals') {
        return generateMergeIntervalsSteps(customInputs.intervals || [[1, 3], [2, 6], [8, 10], [15, 18]]);
      }
      if (customInputs.pattern === 'Bit Manipulation' || customInputs.pattern === 'bit-manipulation') {
        return generateSingleNumberSteps(customInputs.array || [4, 1, 2, 1, 2]);
      }
      if (customInputs.pattern === 'Trees' || customInputs.pattern === 'Binary Tree' || customInputs.pattern === 'trees') {
        return generateTreeSteps();
      }
      if (customInputs.pattern === 'Graphs' || customInputs.pattern === 'graphs') {
        return generateNumberIslandsSteps(customInputs.grid);
      }
      if (customInputs.pattern === 'linked-list' || customInputs.pattern === 'Linked List') {
        return generateLinkedListVisualSteps(customInputs.array || [1, 2, 3, 4, 5]);
      }
      if (customInputs.pattern === 'two-pointers' || customInputs.pattern === 'Two Pointers') {
        return generateTwoPointersSteps(customInputs.array || 'racecar');
      }
      if (customInputs.pattern === 'sliding-window' || customInputs.pattern === 'Sliding Window') {
        return generateSlidingWindowSteps(customInputs.array || [2, 1, 5, 1, 3, 2], customInputs.k || 3);
      }
      if (customInputs.pattern === 'binary-search' || customInputs.pattern === 'Binary Search') {
        return generateBinarySearchSteps(customInputs.array || [1, 3, 5, 7, 9, 11, 13, 15], customInputs.target ?? 9);
      }
      if (customInputs.pattern === 'stack' || customInputs.pattern === 'Stack') {
        return generateHistogramSteps(customInputs.heights || [2, 1, 5, 6, 2, 3]);
      }
      if (customInputs.pattern === 'hashing' || customInputs.pattern === 'Hashing') {
        return generateTwoSumSteps(customInputs.array || [2, 7, 11, 15], customInputs.target ?? 9);
      }
      return generateTwoSumSteps(customInputs.array || [2, 7, 11, 15], customInputs.target ?? 9);
  }
}
