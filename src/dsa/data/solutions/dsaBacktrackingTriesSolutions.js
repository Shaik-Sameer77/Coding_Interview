// Problems 73-84: Backtracking & Tries Master Solutions
// Full Multi-Approach Solutions with JS & TS, Line-by-Line Breakdown, Dry Runs, Pitches, and Quizzes

export const BACKTRACKING_TRIES_SOLUTIONS = {
  // ==========================================
  // PROBLEM 73: SUBSETS (LC #78)
  // ==========================================
  73: {
    id: 73,
    title: 'Subsets',
    difficulty: 'Medium',
    pattern: 'Backtracking',
    day: 34,
    leetcodeUrl: 'https://leetcode.com/problems/subsets/',
    summary: 'Generate the Power Set (all 2^N possible subsets) of unique integers using recursive backtracking or bit manipulation.',
    prerequisites: ['Decision tree: Include vs Exclude each element', 'State push/pop mutation vs reference copying'],
    problemStatement: `Given an integer array \`nums\` of **unique** elements, return all possible subsets (the power set).

The solution set **must not** contain duplicate subsets. Return the solution in **any order**.`,
    approaches: [
      {
        name: 'Approach 1: Recursive Backtracking (Optimal)',
        badge: 'Optimal / Decision Tree',
        timeComplexity: 'O(N × 2ⁿ)',
        spaceComplexity: 'O(N) stack',
        summary: 'At each index, choose to either include or exclude nums[i], exploring all 2^N combinations.',
        intuition: 'Each element has a binary choice: is it in the subset, or not? We snapshot path at every step: result.push([...path]).',
        codeJS: `function subsets(nums) {
  const result = [];
  const path = [];

  function backtrack(start) {
    // Snapshot current subset
    result.push([...path]);

    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);       // 1. Choose
      backtrack(i + 1);         // 2. Explore
      path.pop();               // 3. Unchoose (Backtrack)
    }
  }

  backtrack(0);
  return result;
}`,
        codeTS: `function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(start: number): void {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}`,
        lineByLine: [
          'Line 2-3: Initialize result array and reusable path array.',
          'Line 5-7: Push shallow copy [...path] to result on every recursive visit.',
          'Line 9-13: Iterate from start index: choose nums[i], recurse to i+1, pop to undo choice.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [1, 2]', action: 'backtrack(0) -> push []', result: 'result = [[]]' },
          { step: 2, state: 'i=0: path = [1]', action: 'backtrack(1) -> push [1]', result: 'result = [[], [1]]' },
          { step: 3, state: 'i=1: path = [1, 2]', action: 'backtrack(2) -> push [1, 2]', result: 'result = [[], [1], [1, 2]]' },
          { step: 4, state: 'pop 2, pop 1, i=1: path = [2]', action: 'push [2]', result: 'result = [[], [1], [1, 2], [2]]' }
        ],
        complexityDerivation: 'Total subsets = $2^N$. Copying each subset of average length $N/2$ costs $O(N)$. Total time: $O(N \\times 2^N)$. Call stack is $O(N)$.'
      },
      {
        name: 'Approach 2: Bitmask Simulation',
        badge: 'Alternative / Bit Manipulation',
        timeComplexity: 'O(N × 2ⁿ)',
        spaceComplexity: 'O(1)',
        summary: 'Iterate integers from 0 to 2^N - 1. If bit i is set (1), include nums[i].',
        intuition: 'Each subset corresponds to a unique binary number of length N.',
        codeJS: `function subsetsBitmask(nums) {
  const n = nums.length;
  const total = 1 << n; // 2^n
  const result = [];

  for (let mask = 0; mask < total; mask++) {
    const sub = [];
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) {
        sub.push(nums[i]);
      }
    }
    result.push(sub);
  }

  return result;
}`,
        codeTS: `function subsetsBitmask(nums: number[]): number[][] {
  const n = nums.length;
  const total = 1 << n;
  const result: number[][] = [];

  for (let mask = 0; mask < total; mask++) {
    const sub: number[] = [];
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) sub.push(nums[i]);
    }
    result.push(sub);
  }

  return result;
}`,
        lineByLine: [
          'Line 2-3: Total subsets is 1 << n = 2^N.',
          'Line 6-13: Loop mask from 0 to 2^N - 1; test each bit i using mask & (1 << i).'
        ],
        dryRun: [
          { step: 1, state: 'mask=0 (00b)', action: 'No bits set', result: '[]' },
          { step: 2, state: 'mask=1 (01b)', action: 'Bit 0 set', result: '[nums[0]]' },
          { step: 3, state: 'mask=2 (10b)', action: 'Bit 1 set', result: '[nums[1]]' },
          { step: 4, state: 'mask=3 (11b)', action: 'Both bits set', result: '[nums[0], nums[1]]' }
        ],
        complexityDerivation: 'Loops $2^N$ times with $N$ bit checks $\\to O(N \\times 2^N)$ time and $O(1)$ auxiliary space.'
      }
    ],
    comparisonTable: [
      { approach: 'Recursive Backtracking', time: 'O(N × 2ⁿ)', space: 'O(N) stack', pros: 'Generalizes naturally to combinations with pruning (Subsets II, Combination Sum)', cons: 'Call stack overhead' },
      { approach: 'Bitmask Generation', time: 'O(N × 2ⁿ)', space: 'O(1)', pros: 'Iterative; hardware-level bitwise checks', cons: 'Limited to N <= 31 in standard JS bitwise operators' }
    ],
    interviewPitch: `**60-Second Interview Pitch for Subsets**:
"Generating the power set of N unique elements inherently requires producing 2^N subsets. We can solve this via recursive backtracking or bitmask iteration.

In backtracking, we visualize the decision tree where each node either includes or excludes nums[i]. We maintain a shared path array. At each recursive invocation, we push a copy [...path] to our result. Then, for each element from start to N-1, we push it to path, recurse to i + 1, and pop it to backtrack. This visits all 2^N states with optimal O(N * 2^N) time and O(N) stack memory."`,
    followUps: [
      {
        question: 'Why do we write result.push([...path]) instead of result.push(path)?',
        answer: 'Because path is an array reference. If we push path directly, every entry in result would point to the same object, which becomes empty when backtracking pops all elements!'
      }
    ],
    recallQuiz: {
      question: 'What happens if you push "path" directly to "result" instead of "[...path]" in backtracking?',
      options: [
        'All stored subsets will become identical and empty at the end',
        'JavaScript throws a ReferenceError',
        'The subsets are sorted in descending order',
        'Duplicate elements are filtered automatically'
      ],
      correctIndex: 0,
      explanation: 'Arrays in JS are reference types. When path is mutated by pop(), all references in result reflect that mutation!'
    }
  },

  // ==========================================
  // PROBLEM 82: IMPLEMENT TRIE (LC #208)
  // ==========================================
  82: {
    id: 82,
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    pattern: 'Tries',
    day: 38,
    leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
    summary: 'Implement a Trie data structure with insert, search, and startsWith methods in O(L) time per operation.',
    prerequisites: ['TrieNode children map/object', 'isEndOfWord boolean flag', 'Prefix sharing among words'],
    problemStatement: `A **trie** (pronounced as "try") or **prefix tree** is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.

Implement the \`Trie\` class:
- \`Trie()\` Initializes the trie object.
- \`void insert(String word)\` Inserts the string \`word\` into the trie.
- \`boolean search(String word)\` Returns \`true\` if the string \`word\` is in the trie (i.e., was inserted before), and \`false\` otherwise.
- \`boolean startsWith(String prefix)\` Returns \`true\` if there is a previously inserted string \`word\` that has the prefix \`prefix\`, and \`false\` otherwise.`,
    approaches: [
      {
        name: 'Approach 1: Set with Linear Prefix Scan (Baseline)',
        badge: 'Baseline / Hash Set',
        timeComplexity: 'insert: O(1), search: O(1), startsWith: O(N × L)',
        spaceComplexity: 'O(N × L)',
        summary: 'Store words in an ES6 Set. search is O(1) average; startsWith iterates over all words.',
        intuition: 'Simple built-in Set storage. Trivial to write, but startsWith degrades linearly with vocabulary size N.',
        codeJS: `class TrieSet {
  constructor() {
    this.words = new Set();
  }
  insert(word) {
    this.words.add(word);
  }
  search(word) {
    return this.words.has(word);
  }
  startsWith(prefix) {
    for (const w of this.words) {
      if (w.startsWith(prefix)) return true;
    }
    return false;
  }
}`,
        codeTS: `class TrieSet {
  private words = new Set<string>();
  insert(word: string): void { this.words.add(word); }
  search(word: string): boolean { return this.words.has(word); }
  startsWith(prefix: string): boolean {
    for (const w of this.words) {
      if (w.startsWith(prefix)) return true;
    }
    return false;
  }
}`,
        lineByLine: [
          'Line 2: Set stores words.',
          'Line 4-8: insert and search use Set methods.',
          'Line 10-15: startsWith scans all words in O(N * L).'
        ],
        dryRun: [
          { step: 1, state: 'words = {"apple"}', action: 'startsWith("app") checks "apple"', result: 'Returns true' }
        ],
        complexityDerivation: 'startsWith scans all N words comparing prefixes of length L $\\to O(N \\times L)$.'
      },
      {
        name: 'Approach 2: Object-Based TrieNode (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'insert: O(L), search: O(L), startsWith: O(L)',
        spaceComplexity: 'O(Total Characters × Alphabet)',
        summary: 'Each TrieNode contains an object of child characters and an isEndOfWord flag.',
        intuition: 'Every character of a word represents an edge. To search or check a prefix, walk down the tree character by character in O(L) time where L is word length.',
        codeJS: `class TrieNode {
  constructor() {
    this.children = {}; // char -> TrieNode
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) {
        curr.children[char] = new TrieNode();
      }
      curr = curr.children[char];
    }
    curr.isEndOfWord = true;
  }

  search(word) {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return curr.isEndOfWord; // Must be marked as complete word
  }

  startsWith(prefix) {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return true; // Reached end of prefix successfully
  }
}`,
        codeTS: `class TrieNode {
  children: Record<string, TrieNode> = {};
  isEndOfWord: boolean = false;
}

class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) curr.children[char] = new TrieNode();
      curr = curr.children[char];
    }
    curr.isEndOfWord = true;
  }

  search(word: string): boolean {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return curr.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return true;
  }
}`,
        lineByLine: [
          'Line 1-6: TrieNode encapsulates children map and isEndOfWord marker.',
          'Line 12-21: insert(): walk/create nodes for each character; mark last node as isEndOfWord.',
          'Line 23-30: search(): walk characters; if node exists, verify curr.isEndOfWord is true.',
          'Line 32-39: startsWith(): walk prefix characters; return true if prefix path exists.'
        ],
        dryRun: [
          { step: 1, state: 'insert("apple")', action: 'root -> a -> p -> p -> l -> e (isEnd=true)', result: 'Inserted' },
          { step: 2, state: 'search("apple")', action: 'Walks to e, isEndOfWord === true', result: 'Returns true' },
          { step: 3, state: 'search("app")', action: 'Walks to p, isEndOfWord === false', result: 'Returns false' },
          { step: 4, state: 'startsWith("app")', action: 'Path exists', result: 'Returns true' }
        ],
        complexityDerivation: 'All operations depend strictly on string length L $\\to O(L)$ time. Space complexity is $O(N \\times L)$ where N is number of words and L is average length.'
      }
    ],
    comparisonTable: [
      { approach: 'Hash Set of Strings', time: 'search: O(L), prefix: O(N × L)', space: 'O(N × L)', pros: 'Simple Set lookup', cons: 'Prefix search requires scanning all N words' },
      { approach: 'Trie (Prefix Tree)', time: 'search: O(L), prefix: O(L)', space: 'O(N × L)', pros: 'Prefix search runs in O(L) independent of dictionary size', cons: 'Node allocation memory overhead' }
    ],
    interviewPitch: `**60-Second Interview Pitch for Implement Trie**:
"A Trie is a tree where each node represents a character, allowing words with shared prefixes to share branches. 

Each TrieNode holds a map of child nodes and a boolean isEndOfWord.
For insert(word), I start at the root and walk down character by character, creating nodes if they don't exist, and marking the final node with isEndOfWord = true.
For search(word), I traverse the path and ensure the final node has isEndOfWord === true.
For startsWith(prefix), I traverse the prefix path and return true if every character exists, regardless of the end-of-word flag. All operations run in O(L) time where L is key length, independent of total words."`,
    followUps: [
      {
        question: 'How do you optimize memory if strings contain arbitrary Unicode characters?',
        answer: 'Use an ES6 Map() or dynamically allocated object for children rather than fixed 26-element arrays.'
      }
    ],
    recallQuiz: {
      question: 'What is the key difference between search(word) and startsWith(prefix) in a Trie?',
      options: [
        'search requires isEndOfWord === true, whereas startsWith only requires the prefix path to exist',
        'startsWith is O(N) while search is O(1)',
        'search checks reverse characters',
        'startsWith converts characters to uppercase'
      ],
      correctIndex: 0,
      explanation: 'startsWith simply confirms the branch exists; search confirms that a complete word was inserted terminating at that node.'
    }
  }
};
