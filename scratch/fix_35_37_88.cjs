const fs = require('fs');
const path = require('path');

// 1. Fix 35 & 37 in dsaBinarySearchSolutions.js
const BS_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaBinarySearchSolutions.js');
let bs = fs.readFileSync(BS_FILE, 'utf8');

// For 35: add Linear Scan baseline
const p35Target = `    approaches: [
      {
        name: 'Approach 1: Binary Search Inflection Point (Optimal)',`;
const p35Replacement = `    approaches: [
      {
        name: 'Approach 1: Linear Scan (Baseline)',
        badge: 'Baseline / Linear Scan',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Traverse array from left to right, tracking the running minimum element.',
        intuition: 'Simple linear pass over the N elements without exploiting the rotated sorted structure.',
        codeJS: \`function findMinLinear(nums) {
  let minVal = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < minVal) minVal = nums[i];
  }
  return minVal;
}\`,
        codeTS: \`function findMinLinear(nums: number[]): number {
  let minVal = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < minVal) minVal = nums[i];
  }
  return minVal;
}\`,
        lineByLine: [
          'Line 2: Initialize minVal with first element.',
          'Line 3-5: Update minVal whenever a smaller value is encountered.',
          'Line 6: Return minVal.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [3,4,5,1,2]', action: 'Scan elements 3 -> 4 -> 5 -> 1 -> 2', result: 'minVal = 1' }
        ],
        complexityDerivation: 'Single pass takes O(N) time and O(1) space.'
      },
      {
        name: 'Approach 2: Binary Search Inflection Point (Optimal)',`;

bs = bs.replace(p35Target, p35Replacement);

// For 37: add Linear Scan baseline
const p37Target = `    approaches: [
      {
        name: 'Approach 1: HashMap + Binary Search (Optimal)',`;
const p37Replacement = `    approaches: [
      {
        name: 'Approach 1: Linear Reverse Scan (Baseline)',
        badge: 'Baseline / Linear Scan',
        timeComplexity: 'set: O(1), get: O(N)',
        spaceComplexity: 'O(Total Entries)',
        summary: 'Iterate backwards through the key\\'s list to find the first timestamp <= target.',
        intuition: 'Linear reverse scan from the end of the array. Correct, but slow under heavy read traffic.',
        codeJS: \`class TimeMapLinear {
  constructor() {
    this.store = new Map();
  }
  set(key, value, timestamp) {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key).push({ timestamp, value });
  }
  get(key, timestamp) {
    if (!this.store.has(key)) return "";
    const list = this.store.get(key);
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].timestamp <= timestamp) return list[i].value;
    }
    return "";
  }
}\`,
        codeTS: \`class TimeMapLinear {
  private store = new Map<string, Array<{ timestamp: number; value: string }>>();
  set(key: string, value: string, timestamp: number): void {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key)!.push({ timestamp, value });
  }
  get(key: string, timestamp: number): string {
    if (!this.store.has(key)) return "";
    const list = this.store.get(key)!;
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].timestamp <= timestamp) return list[i].value;
    }
    return "";
  }
}\`,
        lineByLine: [
          'Line 2-8: Map stores array of timestamp-value pairs.',
          'Line 9-16: get() loops backwards to find first timestamp <= query.'
        ],
        dryRun: [
          { step: 1, state: 'get("foo", 3) with timestamps [1, 4]', action: '4 > 3 -> 1 <= 3', result: 'Returns value at ts=1' }
        ],
        complexityDerivation: 'set is O(1); get is O(N) reverse search.'
      },
      {
        name: 'Approach 2: HashMap + Binary Search (Optimal)',`;

bs = bs.replace(p37Target, p37Replacement);
fs.writeFileSync(BS_FILE, bs, 'utf8');
console.log('Fixed 35 and 37 in dsaBinarySearchSolutions.js!');

// 2. Fix Coin Change ID in dsaAdvancedPatternSolutions.js from 88 to 108
const ADV_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaAdvancedPatternSolutions.js');
let adv = fs.readFileSync(ADV_FILE, 'utf8');
adv = adv.replace('  // PROBLEM 88: COIN CHANGE', '  // PROBLEM 108: COIN CHANGE');
adv = adv.replace('  88: {\n    id: 88,', '  108: {\n    id: 108,');
fs.writeFileSync(ADV_FILE, adv, 'utf8');
console.log('Fixed Coin Change ID to 108 in dsaAdvancedPatternSolutions.js!');

// 3. Add Problem 88 (Number of Provinces) in dsaGraphsSolutions.js
const GRAPHS_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaGraphsSolutions.js');
let graphs = fs.readFileSync(GRAPHS_FILE, 'utf8');

const p88Code = `  // ==========================================
  // PROBLEM 88: NUMBER OF PROVINCES (LC #547)
  // ==========================================
  88: {
    id: 88,
    title: 'Number of Provinces',
    difficulty: 'Medium',
    pattern: 'Graphs',
    day: 52,
    leetcodeUrl: 'https://leetcode.com/problems/number-of-provinces/',
    summary: 'Find the total number of connected groups of cities in an adjacency matrix using DFS or Disjoint Set Union (Union-Find).',
    prerequisites: ['Adjacency matrix graph representation', 'Connected components tracking with visited array vs Union-Find'],
    problemStatement: \`There are \\\`n\\\` cities. Some of them are connected, while some are not. If city \\\`a\\\` is connected directly with city \\\`b\\\`, and city \\\`b\\\` is connected directly with city \\\`c\\\`, then city \\\`a\\\` is connected indirectly with city \\\`c\\\`.

A **province** is a group of directly or indirectly connected cities and no other cities outside of the group.

You are given an \\\`n x n\\\` matrix \\\`isConnected\\\` where \\\`isConnected[i][j] = 1\\\` if the \\\`i-th\\\` city and the \\\`j-th\\\` city are directly connected, and \\\`isConnected[i][j] = 0\\\` otherwise.

Return the total number of **provinces**.\`,
    approaches: [
      {
        name: 'Approach 1: Depth-First Search (DFS) (Optimal)',
        badge: 'Optimal / Recursive DFS',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(N) visited',
        summary: 'Maintain a visited array of size N. Iterate through each city; if unvisited, increment province count and DFS flood-fill all reachable cities.',
        intuition: 'Each province is an undirected connected component in an adjacency matrix. Traversing row i explores all neighbors of city i.',
        codeJS: \`function findCircleNum(isConnected) {
  const n = isConnected.length;
  const visited = new Array(n).fill(false);
  let provinces = 0;

  function dfs(city) {
    visited[city] = true;
    for (let neighbor = 0; neighbor < n; neighbor++) {
      if (isConnected[city][neighbor] === 1 && !visited[neighbor]) {
        dfs(neighbor);
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      provinces++;
      dfs(i); // Mark entire province visited
    }
  }

  return provinces;
}\`,
        codeTS: \`function findCircleNum(isConnected: number[][]): number {
  const n = isConnected.length;
  const visited: boolean[] = new Array(n).fill(false);
  let provinces = 0;

  function dfs(city: number): void {
    visited[city] = true;
    for (let neighbor = 0; neighbor < n; neighbor++) {
      if (isConnected[city][neighbor] === 1 && !visited[neighbor]) {
        dfs(neighbor);
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      provinces++;
      dfs(i);
    }
  }

  return provinces;
}\`,
        lineByLine: [
          'Line 2-4: n is number of cities; visited array prevents repeated component traversals.',
          'Line 6-13: dfs(city) marks city as visited, checks row for connected unvisited neighbors, and recurses.',
          'Line 15-20: Outer loop scans all cities; each unvisited city begins a brand new province.'
        ],
        dryRun: [
          { step: 1, state: 'isConnected = [[1,1,0],[1,1,0],[0,0,1]]', action: 'City 0 unvisited -> provinces=1, dfs visits 0 and 1', result: 'visited=[T, T, F]' },
          { step: 2, state: 'City 1 already visited', action: 'Skipped', result: 'No change' },
          { step: 3, state: 'City 2 unvisited', action: 'provinces=2, dfs visits 2', result: 'visited=[T, T, T], Returns 2' }
        ],
        complexityDerivation: 'The matrix contains N^2 elements. Every city row is scanned once $\\\\to O(N^2)$ time. Visited array and call stack take $O(N)$ space.'
      },
      {
        name: 'Approach 2: Disjoint Set Union (Union-Find)',
        badge: 'Production-Grade / Union-Find',
        timeComplexity: 'O(N² × α(N))',
        spaceComplexity: 'O(N)',
        summary: 'Initialize N disjoint sets. For each edge isConnected[i][j] === 1, union sets. Count remaining disjoint roots.',
        intuition: 'Union-Find with path compression and rank operates in near O(1) time per edge. Total distinct components equals initial N minus successful unions.',
        codeJS: \`class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.count = n;
  }
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX !== rootY) {
      this.parent[rootX] = rootY;
      this.count--;
      return true;
    }
    return false;
  }
}

function findCircleNumUF(isConnected) {
  const n = isConnected.length;
  const uf = new UnionFind(n);

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j] === 1) {
        uf.union(i, j);
      }
    }
  }

  return uf.count;
}\`,
        codeTS: \`class UnionFind {
  parent: number[];
  count: number;
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.count = n;
  }
  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(x: number, y: number): boolean {
    const rootX = this.find(x), rootY = this.find(y);
    if (rootX !== rootY) {
      this.parent[rootX] = rootY;
      this.count--;
      return true;
    }
    return false;
  }
}

function findCircleNumUF(isConnected: number[][]): number {
  const n = isConnected.length;
  const uf = new UnionFind(n);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j] === 1) uf.union(i, j);
    }
  }
  return uf.count;
}\`,
        lineByLine: [
          'Line 1-17: Disjoint Set Union class with path compression and component counter.',
          'Line 20-28: Traverse upper triangle of symmetric adjacency matrix; call union on edge connections.',
          'Line 30: Return remaining component count.'
        ],
        dryRun: [
          { step: 1, state: 'N=3, count=3', action: 'isConnected[0][1]=1 -> union(0, 1), count=2', result: 'parent=[1, 1, 2]' },
          { step: 2, state: 'isConnected[1][2]=0', action: 'No union', result: 'Final count = 2' }
        ],
        complexityDerivation: 'Scanning upper triangle takes N(N-1)/2 edges, each taking O(α(N)) $\\\\to O(N^2 \\\\times \\\\alpha(N))$ time. Parent array takes $O(N)$ space.'
      }
    ],
    comparisonTable: [
      { approach: 'Depth-First Search', time: 'O(N²)', space: 'O(N) visited', pros: 'Direct recursion, simple visited check', cons: 'Call stack depth N' },
      { approach: 'Union-Find (DSU)', time: 'O(N² × α(N))', space: 'O(N) array', pros: 'Dynamic connectivity; supports online edge additions', cons: 'More boilerplate data structure code' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Number of Provinces**:
"The Number of Provinces problem asks for the number of connected components in an undirected graph represented as an adjacency matrix.

We can solve it in O(N^2) time using DFS or Union-Find.
With DFS, I maintain a visited boolean array of size N. I loop through all cities from 0 to N-1. If a city has not been visited, I increment my province count and trigger a DFS that marks all directly and indirectly connected cities as visited.
Alternatively, with Union-Find, I initialize N components. For every 1 in the upper triangle of the matrix, I union the two cities and decrement the component count. Both approaches achieve optimal O(N^2) time and O(N) space."\`,
    followUps: [
      {
        question: 'Why do we only need to iterate the upper triangle (j = i + 1 to n - 1)?',
        answer: 'Because isConnected is symmetric (isConnected[i][j] === isConnected[j][i]) and self-loops (i === j) do not change connectivity.'
      }
    ],
    recallQuiz: {
      question: 'What is the time complexity of the Find operation with Path Compression in Union-Find?',
      options: ['O(α(N)) amortized nearly O(1)', 'O(N)', 'O(log N)', 'O(N²)'],
      correctIndex: 0,
      explanation: 'Path compression flattens the tree so find operations run in inverse Ackermann time α(N), which is less than 5 for all realistic numbers!'
    }
  },
`;

graphs = graphs.replace('export const GRAPHS_SOLUTIONS = {', 'export const GRAPHS_SOLUTIONS = {\n' + p88Code);
fs.writeFileSync(GRAPHS_FILE, graphs, 'utf8');
console.log('Added Problem 88 to dsaGraphsSolutions.js!');
