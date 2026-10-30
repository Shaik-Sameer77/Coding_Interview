const fs = require('fs');
const path = require('path');

// 1. Heap: 72
const HEAP_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaHeapSolutions.js');
let heap = fs.readFileSync(HEAP_FILE, 'utf8');

if (!heap.includes('name: \'Approach 1: Insertion Sort Array (Baseline)\'')) {
  const p72Old = `    approaches: [
      {
        name: 'Approach 1: Two Heaps (Max-Heap & Min-Heap) (Optimal)'`;
  const p72New = `    approaches: [
      {
        name: 'Approach 1: Insertion Sort Array (Baseline)',
        badge: 'Baseline / Insertion Sort',
        timeComplexity: 'add: O(N), find: O(1)',
        spaceComplexity: 'O(N)',
        summary: 'Maintain a single sorted array by binary searching insertion position and splicing.',
        intuition: 'Insertion takes O(N) due to array shifting, but finding the median is O(1) index access.',
        codeJS: \`class MedianFinderLinear {
  constructor() {
    this.nums = [];
  }
  addNum(num) {
    let low = 0, high = this.nums.length;
    while (low < high) {
      const mid = low + Math.floor((high - low) / 2);
      if (this.nums[mid] < num) low = mid + 1;
      else high = mid;
    }
    this.nums.splice(low, 0, num);
  }
  findMedian() {
    const n = this.nums.length;
    const mid = Math.floor(n / 2);
    return n % 2 === 1 ? this.nums[mid] : (this.nums[mid - 1] + this.nums[mid]) / 2;
  }
}\`,
        codeTS: \`class MedianFinderLinear {
  private nums: number[] = [];
  addNum(num: number): void {
    let low = 0, high = this.nums.length;
    while (low < high) {
      const mid = low + Math.floor((high - low) / 2);
      if (this.nums[mid] < num) low = mid + 1;
      else high = mid;
    }
    this.nums.splice(low, 0, num);
  }
  findMedian(): number {
    const n = this.nums.length;
    const mid = Math.floor(n / 2);
    return n % 2 === 1 ? this.nums[mid] : (this.nums[mid - 1] + this.nums[mid]) / 2;
  }
}\`,
        lineByLine: [
          'Line 2: Single array store.',
          'Line 5-11: Binary search insertion index; splice in O(N).',
          'Line 13-17: Instant O(1) median calculation by index.'
        ],
        dryRun: [
          { step: 1, state: 'addNum(2), addNum(1)', action: 'nums = [1, 2]', result: 'median = 1.5' }
        ],
        complexityDerivation: 'addNum takes O(N) due to array splice shift; findMedian takes O(1).'
      },
      {
        name: 'Approach 2: Two Heaps (Max-Heap & Min-Heap) (Optimal)'`;
  heap = heap.replace(p72Old, p72New);
  fs.writeFileSync(HEAP_FILE, heap, 'utf8');
  console.log('Enriched dsaHeapSolutions.js!');
}

// 2. Tries: 82
const BT_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaBacktrackingTriesSolutions.js');
let bt = fs.readFileSync(BT_FILE, 'utf8');

if (!bt.includes('name: \'Approach 1: Set with Linear Prefix Scan (Baseline)\'')) {
  const p82Old = `    approaches: [
      {
        name: 'Approach 1: Object-Based TrieNode (Optimal)'`;
  const p82New = `    approaches: [
      {
        name: 'Approach 1: Set with Linear Prefix Scan (Baseline)',
        badge: 'Baseline / Hash Set',
        timeComplexity: 'insert: O(1), search: O(1), startsWith: O(N × L)',
        spaceComplexity: 'O(N × L)',
        summary: 'Store words in an ES6 Set. search is O(1) average; startsWith iterates over all words.',
        intuition: 'Simple built-in Set storage. Trivial to write, but startsWith degrades linearly with vocabulary size N.',
        codeJS: \`class TrieSet {
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
}\`,
        codeTS: \`class TrieSet {
  private words = new Set<string>();
  insert(word: string): void { this.words.add(word); }
  search(word: string): boolean { return this.words.has(word); }
  startsWith(prefix: string): boolean {
    for (const w of this.words) {
      if (w.startsWith(prefix)) return true;
    }
    return false;
  }
}\`,
        lineByLine: [
          'Line 2: Set stores words.',
          'Line 4-8: insert and search use Set methods.',
          'Line 10-15: startsWith scans all words in O(N * L).'
        ],
        dryRun: [
          { step: 1, state: 'words = {"apple"}', action: 'startsWith("app") checks "apple"', result: 'Returns true' }
        ],
        complexityDerivation: 'startsWith scans all N words comparing prefixes of length L $\\\\to O(N \\\\times L)$.'
      },
      {
        name: 'Approach 2: Object-Based TrieNode (Optimal)'`;
  bt = bt.replace(p82Old, p82New);
  fs.writeFileSync(BT_FILE, bt, 'utf8');
  console.log('Enriched dsaBacktrackingTriesSolutions.js!');
}
