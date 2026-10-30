const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../src/dsa/utils/dsaAnimationGenerators.js');
let currentContent = fs.readFileSync(targetFile, 'utf8');

// Additional generators code
const extraGenerators = `
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
  ].join('\\n');

  const steps = [];
  const mapEntries = {};

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: \`Verify lengths: s.length (\${s.length}) vs t.length (\${t.length}). Lengths match, initializing frequency map.\`,
    array: s.split(''),
    arrayLabel: \`s: "\${s}"\`,
    auxArrays: [{ label: \`t: "\${t}"\`, array: t.split(''), activeIndex: null }],
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
      explanation: \`Index \${i}: Increment frequency for s[\${i}]='\${sChar}' (+1), Decrement for t[\${i}]='\${tChar}' (-1).\`,
      array: s.split(''),
      arrayLabel: \`s: "\${s}"\`,
      auxArrays: [{ label: \`t: "\${t}"\`, array: t.split(''), activeIndex: i }],
      pointers: [
        { name: \`s[\${i}]\`, index: i, color: '#38bdf8', position: 'top' }
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
      ? \`🎉 All character counts returned to exact zero! Strings "\${s}" and "\${t}" are valid anagrams.\`
      : \`Counts did not return to zero. Strings are NOT anagrams.\`,
    array: s.split(''),
    arrayLabel: \`s: "\${s}"\`,
    auxArrays: [{ label: \`t: "\${t}"\`, array: t.split(''), activeIndex: null }],
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
  ].join('\\n');

  const steps = [];
  const freq = {};
  for (const n of nums) freq[n] = (freq[n] || 0) + 1;

  steps.push({
    stepIndex: 0,
    codeLine: 3,
    explanation: \`Count frequency of every element: \${Object.entries(freq).map(([num, count]) => \`\${num} (x\${count})\`).join(', ')}.\`,
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
          explanation: \`Scanning backwards: Frequency \${i} bucket contains [\${buckets[i].join(', ')}]. Adding \${num} to top \${k} result.\`,
          array: [...nums],
          arrayLabel: 'nums',
          pointers: [],
          elementStates: nums.reduce((acc, val, idx) => {
            if (val === num) acc[idx] = 'matched';
            return acc;
          }, {}),
          variables: [{ name: 'frequency', value: i }, { name: 'topK result', value: \`[\${res.join(', ')}]\` }],
          isComplete: res.length === k,
          isSuccess: true
        });
        if (res.length === k) break;
      }
    }
  }

  return { title: \`Top \${k} Frequent Elements (Bucket Sort O(N))\`, codeSnippet, steps };
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
  ].join('\\n');

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
        explanation: \`Closing bracket '\${char}': Pop stack top ('\${top}'). \${match ? \`Matches expected '\${map[char]}'! Valid pair resolved.\` : \`Mismatch! Expected '\${map[char]}', got '\${top}'. Return false.\`}\`,
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
        explanation: \`Opening bracket '\${char}': Push onto stack. Current stack: [\${stack.join(', ')}].\`,
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
        : \`Unclosed brackets remain in stack: [\${stack.join(', ')}]. Return FALSE.\`,
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
  ].join('\\n');

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
      explanation: \`Node \${nodes[i]}: Save nextNode (\${i < nodes.length - 1 ? nodes[i + 1] : 'null'}). Reverse link: \${nodes[i]}.next = \${i > 0 ? nodes[i - 1] : 'null'}.\`,
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
    explanation: \`Traversal complete! All pointers reversed in-place. New head is \${nodes[nodes.length - 1]}. Result: [\${[...nodes].reverse().join(' ➔ ')} ➔ null].\`,
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
`;

// Replace getAnimationForProblem at the end of currentContent
const updatedRouter = `
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
      return generateValidParenthesesSteps(customInputs.s || "()[]{}");
    case 31:
    case 35:
    case 36:
      return generateBinarySearchSteps(customInputs.array || [1, 3, 5, 7, 9, 11, 13, 15], customInputs.target ?? 9);
    case 39:
    case 40:
    case 41:
      return generateReverseListSteps(customInputs.array || [1, 2, 3, 4, 5]);
    default:
      // Pattern-based fallback
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
        return generateValidParenthesesSteps(customInputs.s || "()[]{}");
      }
      if (customInputs.pattern === 'linked-list' || customInputs.pattern === 'Linked List') {
        return generateReverseListSteps(customInputs.array || [1, 2, 3, 4, 5]);
      }
      if (customInputs.pattern === 'hashing' || customInputs.pattern === 'Hashing') {
        return generateTwoSumSteps(customInputs.array || [2, 7, 11, 15], customInputs.target ?? 9);
      }
      return generateTwoSumSteps(customInputs.array || [2, 7, 11, 15], customInputs.target ?? 9);
  }
}
`;

// Cut old getAnimationForProblem from currentContent
const cutIdx = currentContent.indexOf('// 7. GET ANIMATION FOR ANY PROBLEM ID');
if (cutIdx !== -1) {
  currentContent = currentContent.slice(0, cutIdx);
}

const finalFileContent = currentContent + extraGenerators + updatedRouter;
fs.writeFileSync(targetFile, finalFileContent, 'utf8');
console.log('Successfully expanded dsaAnimationGenerators.js with new visualizers!');
