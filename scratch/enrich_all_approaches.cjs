// Script to enrich all authored solutions with multiple distinct approaches
const fs = require('fs');
const path = require('path');

// 1. Enrich Binary Search solutions (33, 34, 35, 36, 37)
const BS_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaBinarySearchSolutions.js');
let bs = fs.readFileSync(BS_FILE, 'utf8');

// For 33: Add Row-by-Row Search baseline
if (!bs.includes('name: \'Approach 1: Row-by-Row Binary Search (Baseline)\'')) {
  const p33Old = `    approaches: [
      {
        name: 'Approach 1: Virtual 1D Flattening (Optimal)'`;
  const p33New = `    approaches: [
      {
        name: 'Approach 1: Row-by-Row Binary Search (Baseline)',
        badge: 'Baseline / Row Binary Search',
        timeComplexity: 'O(M log N)',
        spaceComplexity: 'O(1)',
        summary: 'First binary search the rows to find which row could contain target, then binary search within that row.',
        intuition: 'Identify the row where matrix[r][0] <= target <= matrix[r][cols - 1]. Then binary search that single row.',
        codeJS: \`function searchMatrixRowByRow(matrix, target) {
  for (const row of matrix) {
    if (target >= row[0] && target <= row[row.length - 1]) {
      let low = 0, high = row.length - 1;
      while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        if (row[mid] === target) return true;
        if (row[mid] < target) low = mid + 1;
        else high = mid - 1;
      }
    }
  }
  return false;
}\`,
        codeTS: \`function searchMatrixRowByRow(matrix: number[][], target: number): boolean {
  for (const row of matrix) {
    if (target >= row[0] && target <= row[row.length - 1]) {
      let low = 0, high = row.length - 1;
      while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        if (row[mid] === target) return true;
        if (row[mid] < target) low = mid + 1;
        else high = mid - 1;
      }
    }
  }
  return false;
}\`,
        lineByLine: [
          'Line 2: Iterate through rows.',
          'Line 3: Check if target falls within first and last element of current row.',
          'Line 4-11: Standard binary search within identified row.'
        ],
        dryRun: [
          { step: 1, state: 'target=3, row=[1,3,5,7]', action: 'Target in row range -> binary search', result: 'Returns true' }
        ],
        complexityDerivation: 'Finding row takes O(M); searching row takes O(log N) $\\\\to O(M + \\\\log N)$ or $O(M \\\\log N)$.'
      },
      {
        name: 'Approach 2: Virtual 1D Flattening (Optimal)'`;
  bs = bs.replace(p33Old, p33New);
}

// For 34: Add Linear Speed Scan
if (!bs.includes('name: \'Approach 1: Linear Speed Scan (Baseline)\'')) {
  const p34Old = `    approaches: [
      {
        name: 'Approach 1: Binary Search on Speed (Optimal)'`;
  const p34New = `    approaches: [
      {
        name: 'Approach 1: Linear Speed Scan (Baseline)',
        badge: 'Baseline / Brute Force',
        timeComplexity: 'O(N × max(piles))',
        spaceComplexity: 'O(1)',
        summary: 'Iterate speeds starting from 1 upwards until finding the first speed that allows finishing within h hours.',
        intuition: 'Try speed = 1, 2, 3... Calculate hours for each speed. The first valid speed is the answer. Fails on large pile values.',
        codeJS: \`function minEatingSpeedLinear(piles, h) {
  const maxP = Math.max(...piles);
  for (let speed = 1; speed <= maxP; speed++) {
    let hours = 0;
    for (const p of piles) {
      hours += Math.ceil(p / speed);
    }
    if (hours <= h) return speed;
  }
  return maxP;
}\`,
        codeTS: \`function minEatingSpeedLinear(piles: number[], h: number): number {
  const maxP = Math.max(...piles);
  for (let speed = 1; speed <= maxP; speed++) {
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / speed);
    if (hours <= h) return speed;
  }
  return maxP;
}\`,
        lineByLine: [
          'Line 2: Determine maximum possible eating speed.',
          'Line 3-8: Test each integer speed starting at 1; return first feasible speed.'
        ],
        dryRun: [
          { step: 1, state: 'speed=1', action: 'hours = 3+6+7+11 = 27 > 8', result: 'speed++' },
          { step: 2, state: 'speed=4', action: 'hours = 1+2+2+3 = 8 <= 8', result: 'Returns 4' }
        ],
        complexityDerivation: 'Tests up to max(piles) speeds, each costing O(N) time $\\\\to O(N \\\\times \\\\max(piles))$.'
      },
      {
        name: 'Approach 2: Binary Search on Speed (Optimal)'`;
  bs = bs.replace(p34Old, p34New);
}

// For 35: Add Linear Scan Baseline
if (!bs.includes('name: \'Approach 1: Linear Scan (Baseline)\'')) {
  const p35Old = `    approaches: [
      {
        name: 'Approach 1: Binary Search Inflection Point (Optimal)'`;
  const p35New = `    approaches: [
      {
        name: 'Approach 1: Linear Scan (Baseline)',
        badge: 'Baseline / Linear Scan',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Traverse array from left to right, comparing each element with the current minimum.',
        intuition: 'Simple linear pass finding minimum element. Does not exploit sorted or rotated structure.',
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
        name: 'Approach 2: Binary Search Inflection Point (Optimal)'`;
  bs = bs.replace(p35Old, p35New);
}

// For 36: Add Linear Search Baseline
if (!bs.includes('name: \'Approach 1: Linear Search (Baseline)\'')) {
  const p36Old = `    approaches: [
      {
        name: 'Approach 1: Modified Binary Search (Optimal)'`;
  const p36New = `    approaches: [
      {
        name: 'Approach 1: Linear Search (Baseline)',
        badge: 'Baseline / Linear Scan',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Iterate sequentially across the rotated array to locate the target value.',
        intuition: 'Basic linear search that ignores rotational structure and costs O(N) time.',
        codeJS: \`function searchRotatedLinear(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}\`,
        codeTS: \`function searchRotatedLinear(nums: number[], target: number): number {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}\`,
        lineByLine: [
          'Line 2: Loop through all indices.',
          'Line 3: If match, return index; otherwise return -1 at end.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [4,5,6,7,0,1,2], target = 0', action: 'Scan until index 4', result: 'Returns 4' }
        ],
        complexityDerivation: 'Single pass takes O(N) time and O(1) space.'
      },
      {
        name: 'Approach 2: Modified Binary Search (Optimal)'`;
  bs = bs.replace(p36Old, p36New);
}

// For 37: Add Linear Array Scan Baseline
if (!bs.includes('name: \'Approach 1: Linear Scan (Baseline)\'')) {
  const p37Old = `    approaches: [
      {
        name: 'Approach 1: HashMap + Binary Search (Optimal)'`;
  const p37New = `    approaches: [
      {
        name: 'Approach 1: Linear Scan (Baseline)',
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
        name: 'Approach 2: HashMap + Binary Search (Optimal)'`;
  bs = bs.replace(p37Old, p37New);
}

fs.writeFileSync(BS_FILE, bs, 'utf8');
console.log('Enriched dsaBinarySearchSolutions.js!');

// 2. Enrich Linked List solutions (40, 41, 48)
const LL_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaLinkedListSolutions.js');
let ll = fs.readFileSync(LL_FILE, 'utf8');

// For 40: Add Recursive Splicing
if (!ll.includes('name: \'Approach 2: Recursive Merging\'')) {
  const p40Append = `      },
      {
        name: 'Approach 2: Recursive Merging',
        badge: 'Recursive / Elegant',
        timeComplexity: 'O(M + N)',
        spaceComplexity: 'O(M + N) stack',
        summary: 'Recursively splice whichever node is smaller and attach the merged remainder.',
        intuition: 'If list1.val < list2.val, list1.next = mergeTwoLists(list1.next, list2); return list1. Symmetrically for list2.',
        codeJS: \`function mergeTwoListsRecursive(list1, list2) {
  if (!list1) return list2;
  if (!list2) return list1;

  if (list1.val <= list2.val) {
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoListsRecursive(list1, list2.next);
    return list2;
  }
}\`,
        codeTS: \`function mergeTwoListsRecursive(list1: any, list2: any): any {
  if (!list1) return list2;
  if (!list2) return list1;
  if (list1.val <= list2.val) {
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoListsRecursive(list1, list2.next);
    return list2;
  }
}\`,
        lineByLine: [
          'Line 2-3: Base cases: if either list is null, return the other.',
          'Line 5-11: Splice smaller head, recursively merge rest, return smaller head.'
        ],
        dryRun: [
          { step: 1, state: 'merge(1->2, 1->3)', action: '1 <= 1 -> 1.next = merge(2, 1->3)', result: 'Stack recurses' }
        ],
        complexityDerivation: 'M + N recursive calls cost O(M + N) time and O(M + N) stack memory.'
      }`;
  ll = ll.replace("        complexityDerivation: 'Traverses each node of both lists at most once $\\\\to O(M + N)$ time. Only rewires existing pointers $\\\\to O(1)$ space.'\n      }", "        complexityDerivation: 'Traverses each node of both lists at most once $\\\\to O(M + N)$ time. Only rewires existing pointers $\\\\to O(1)$ space.'\n" + p40Append);
}

// For 41: Add Hash Set Tracking
if (!ll.includes('name: \'Approach 1: Hash Set Visited Node Tracking (Baseline)\'')) {
  const p41Old = `    approaches: [
      {
        name: 'Approach 1: Floyd\\'s Tortoise and Hare (Optimal)'`;
  const p41New = `    approaches: [
      {
        name: 'Approach 1: Hash Set Visited Node Tracking (Baseline)',
        badge: 'Baseline / Hash Set',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Store visited node references in a Set. If a node is already in the set, a cycle exists.',
        intuition: 'Each node in memory has a unique object identity. A repeat visit means a cycle.',
        codeJS: \`function hasCycleSet(head) {
  const visited = new Set();
  let curr = head;
  while (curr !== null) {
    if (visited.has(curr)) return true;
    visited.add(curr);
    curr = curr.next;
  }
  return false;
}\`,
        codeTS: \`function hasCycleSet(head: any): boolean {
  const visited = new Set<any>();
  let curr = head;
  while (curr !== null) {
    if (visited.has(curr)) return true;
    visited.add(curr);
    curr = curr.next;
  }
  return false;
}\`,
        lineByLine: [
          'Line 2: Instantiate Set to track visited node references.',
          'Line 3-7: Traverse list; if node already seen, cycle detected; else add to set.'
        ],
        dryRun: [
          { step: 1, state: 'node 3 -> 2 -> 0 -> -4 -> 2', action: 'Set records 3, 2, 0, -4. Hits 2 again.', result: 'visited.has(2) is true' }
        ],
        complexityDerivation: 'Single pass visits N nodes in O(N) time with O(N) heap memory for node references.'
      },
      {
        name: 'Approach 2: Floyd\\'s Tortoise and Hare (Optimal)'`;
  ll = ll.replace(p41Old, p41New);
}

// For 48: Add Map with Re-insertion Baseline
if (!ll.includes('name: \'Approach 2: JS Map Insertion-Order Trick\'')) {
  const p48Append = `      },
      {
        name: 'Approach 2: JS Map Insertion-Order Trick',
        badge: 'JavaScript Native / Map Keys',
        timeComplexity: 'get: O(1), put: O(1)',
        spaceComplexity: 'O(Capacity)',
        summary: 'Leverage JavaScript\\'s native Map guarantee that keys are iterated in insertion order.',
        intuition: 'On get() or update, delete the key and re-set it to move it to the back. On eviction, map.keys().next().value returns the oldest key.',
        codeJS: \`class LRUCacheMap {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val); // Re-insert at end
    return val;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
}\`,
        codeTS: \`class LRUCacheMap {
  private capacity: number;
  private map = new Map<number, number>();
  constructor(capacity: number) { this.capacity = capacity; }
  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  put(key: number, value: number): void {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey!);
    }
    this.map.set(key, value);
  }
}\`,
        lineByLine: [
          'Line 2-5: ES6 Map retains insertion order.',
          'Line 7-12: get() deletes and re-inserts key to refresh order.',
          'Line 14-20: put() evicts oldest key using this.map.keys().next().value.'
        ],
        dryRun: [
          { step: 1, state: 'put(1, 1), put(2, 2)', action: 'keys: [1, 2]', result: 'Capacity full' },
          { step: 2, state: 'get(1)', action: 'keys: [2, 1]', result: '1 moved to back' }
        ],
        complexityDerivation: 'Map operations take O(1) time and O(Capacity) space.'
      }`;
  ll = ll.replace("        complexityDerivation: 'Hash map operations are O(1) average. Doubly linked list node splicing and unlinking involves 4 pointer reassignments $\\\\to O(1)$ strict time. Total space is bounded by O(Capacity).'\n      }", "        complexityDerivation: 'Hash map operations are O(1) average. Doubly linked list node splicing and unlinking involves 4 pointer reassignments $\\\\to O(1)$ strict time. Total space is bounded by O(Capacity).'\n" + p48Append);
}

fs.writeFileSync(LL_FILE, ll, 'utf8');
console.log('Enriched dsaLinkedListSolutions.js!');

// 3. Enrich Trees solutions (57, 58)
const TREES_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaTreesSolutions.js');
let trees = fs.readFileSync(TREES_FILE, 'utf8');

if (!trees.includes('name: \'Approach 1: Recursive BST Traversal (Alternative)\'')) {
  const p57Old = `    approaches: [
      {
        name: 'Approach 1: Iterative BST Traversal (Optimal)'`;
  const p57New = `    approaches: [
      {
        name: 'Approach 1: Recursive BST Traversal (Alternative)',
        badge: 'Recursive / BST Split',
        timeComplexity: 'O(H)',
        spaceComplexity: 'O(H) stack',
        summary: 'Recursively recurse left if both p and q are smaller, or right if both are larger.',
        intuition: 'Direct recursive translation of the BST split rule.',
        codeJS: \`function lowestCommonAncestorRec(root, p, q) {
  if (!root) return null;
  if (p.val < root.val && q.val < root.val) return lowestCommonAncestorRec(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lowestCommonAncestorRec(root.right, p, q);
  return root;
}\`,
        codeTS: \`function lowestCommonAncestorRec(root: any, p: any, q: any): any {
  if (!root) return null;
  if (p.val < root.val && q.val < root.val) return lowestCommonAncestorRec(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lowestCommonAncestorRec(root.right, p, q);
  return root;
}\`,
        lineByLine: [
          'Line 2-4: If both nodes are smaller or larger, recurse down left or right subtree; otherwise return root.'
        ],
        dryRun: [
          { step: 1, state: 'root=6, p=2, q=8', action: '2 < 6 and 8 > 6 -> split point', result: 'Returns root 6' }
        ],
        complexityDerivation: 'O(H) time and O(H) call stack.'
      },
      {
        name: 'Approach 2: Iterative BST Traversal (Optimal)'`;
  trees = trees.replace(p57Old, p57New);
}

if (!trees.includes('name: \'Approach 2: Recursive DFS with Depth Tracking\'')) {
  const p58Append = `      },
      {
        name: 'Approach 2: Recursive DFS with Depth Tracking',
        badge: 'Recursive / Pre-Order DFS',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(H) stack',
        summary: 'Traverse using DFS, passing level depth. Append node.val to result[depth].',
        intuition: 'If result.length === depth, create new array result.push([]). Then push node.val to result[depth].',
        codeJS: \`function levelOrderDFS(root) {
  const result = [];
  function dfs(node, depth) {
    if (!node) return;
    if (result.length === depth) result.push([]);
    result[depth].push(node.val);
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }
  dfs(root, 0);
  return result;
}\`,
        codeTS: \`function levelOrderDFS(root: any): number[][] {
  const result: number[][] = [];
  function dfs(node: any, depth: number): void {
    if (!node) return;
    if (result.length === depth) result.push([]);
    result[depth].push(node.val);
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }
  dfs(root, 0);
  return result;
}\`,
        lineByLine: [
          'Line 2-5: If result array has not reached depth, allocate result[depth] = [].',
          'Line 6-8: Push node.val to result[depth], recurse left and right with depth + 1.'
        ],
        dryRun: [
          { step: 1, state: 'node 3 (depth 0)', action: 'result[0] = [3]', result: 'Depth 0 populated' }
        ],
        complexityDerivation: 'Visits N nodes in O(N) time with O(H) stack space.'
      }`;
  trees = trees.replace("        complexityDerivation: 'Every node is enqueued and dequeued once $\\\\to O(N)$ time. Space is bounded by max width W of the tree ($O(N)$ for complete binary tree).'\n      }", "        complexityDerivation: 'Every node is enqueued and dequeued once $\\\\to O(N)$ time. Space is bounded by max width W of the tree ($O(N)$ for complete binary tree).'\n" + p58Append);
}

fs.writeFileSync(TREES_FILE, trees, 'utf8');
console.log('Enriched dsaTreesSolutions.js!');

// 4. Enrich Graphs solutions (85, 87, 88, 89, 92)
const GRAPHS_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaGraphsSolutions.js');
let graphs = fs.readFileSync(GRAPHS_FILE, 'utf8');

// For 85: Add BFS Queue Approach
if (!graphs.includes('name: \'Approach 2: BFS Queue Iterative\'')) {
  const p85Append = `      },
      {
        name: 'Approach 2: BFS Queue Iterative',
        badge: 'Alternative / BFS Queue',
        timeComplexity: 'O(M × N)',
        spaceComplexity: 'O(min(M, N)) queue',
        summary: 'Iterative queue-based BFS: enqueue unvisited land cells, marking them as 0 to avoid recursion stack overflow.',
        intuition: 'Queue memory is bounded by the perimeter / diagonal diameter of the island, which is at most O(min(M, N)).',
        codeJS: \`function numIslandsBFS(grid) {
  if (!grid || !grid.length) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  const dirs = [[1,0], [-1,0], [0,1], [0,-1]];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        grid[r][c] = '0';
        const queue = [[r, c]];
        while (queue.length > 0) {
          const [currR, currC] = queue.shift();
          for (const [dr, dc] of dirs) {
            const nr = currR + dr, nc = currC + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '1') {
              grid[nr][nc] = '0';
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
  }
  return count;
}\`,
        codeTS: \`function numIslandsBFS(grid: string[][]): number {
  if (!grid || !grid.length) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        grid[r][c] = '0';
        const queue = [[r, c]];
        while (queue.length > 0) {
          const [currR, currC] = queue.shift()!;
          for (const [dr, dc] of dirs) {
            const nr = currR + dr, nc = currC + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '1') {
              grid[nr][nc] = '0';
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
  }
  return count;
}\`,
        lineByLine: [
          'Line 2-6: Dimensions, island counter, and 4-way direction vectors.',
          'Line 8-28: When land encountered, increment count, enqueue, and sink all connected cells via BFS queue.'
        ],
        dryRun: [
          { step: 1, state: 'grid[0][0] === "1"', action: 'Enqueue [0, 0], sink neighbors', result: 'Island 1 fully mapped' }
        ],
        complexityDerivation: 'Every cell enqueued at most once $\\\\to O(M \\\\times N)$ time and $O(\\\\min(M, N))$ queue memory.'
      }`;
  graphs = graphs.replace("        complexityDerivation: 'Every cell is visited a constant number of times $\\\\to O(M \\\\times N)$ time and $O(M \\\\times N)$ worst-case call stack.'\n      }", "        complexityDerivation: 'Every cell is visited a constant number of times $\\\\to O(M \\\\times N)$ time and $O(M \\\\times N)$ worst-case call stack.'\n" + p85Append);
}

// For 87: Add BFS Queue Approach
if (!graphs.includes('name: \'Approach 2: BFS Queue with Map\'')) {
  const p87Append = `      },
      {
        name: 'Approach 2: BFS Queue with Map',
        badge: 'Alternative / Iterative BFS',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        summary: 'Iterative BFS queue using Map(original -> clone) to duplicate graph without call stack recursion.',
        intuition: 'Enqueue original nodes. When dequeuing, clone all unvisited neighbors, insert into map, and enqueue them.',
        codeJS: \`function cloneGraphBFS(node) {
  if (!node) return null;
  const cloned = new Map();
  cloned.set(node, { val: node.val, neighbors: [] });
  const queue = [node];

  while (queue.length > 0) {
    const curr = queue.shift();
    for (const neighbor of curr.neighbors) {
      if (!cloned.has(neighbor)) {
        cloned.set(neighbor, { val: neighbor.val, neighbors: [] });
        queue.push(neighbor);
      }
      cloned.get(curr).neighbors.push(cloned.get(neighbor));
    }
  }

  return cloned.get(node);
}\`,
        codeTS: \`function cloneGraphBFS(node: any): any {
  if (!node) return null;
  const cloned = new Map<any, any>();
  cloned.set(node, { val: node.val, neighbors: [] });
  const queue = [node];

  while (queue.length > 0) {
    const curr = queue.shift();
    for (const neighbor of curr.neighbors) {
      if (!cloned.has(neighbor)) {
        cloned.set(neighbor, { val: neighbor.val, neighbors: [] });
        queue.push(neighbor);
      }
      cloned.get(curr).neighbors.push(cloned.get(neighbor));
    }
  }

  return cloned.get(node);
}\`,
        lineByLine: [
          'Line 2-5: Initialize map and queue with source node.',
          'Line 7-16: Dequeue node; clone and enqueue unvisited neighbors, linking edges in map.'
        ],
        dryRun: [
          { step: 1, state: 'node 1', action: 'Queue=[1], cloned={1: clone1}', result: 'Source primed' }
        ],
        complexityDerivation: 'Processes each vertex and edge once $\\\\to O(V + E)$ time and $O(V)$ space.'
      }`;
  graphs = graphs.replace("        complexityDerivation: 'Visits each vertex V and explores each edge E once $\\\\to O(V + E)$ time. Hash Map holds V nodes $\\\\to O(V)$ space.'\n      }", "        complexityDerivation: 'Visits each vertex V and explores each edge E once $\\\\to O(V + E)$ time. Hash Map holds V nodes $\\\\to O(V)$ space.'\n" + p87Append);
}

// For 89: Add Repeated Grid Simulation Baseline
if (!graphs.includes('name: \'Approach 1: Repeated Grid Simulation (Baseline)\'')) {
  const p89Old = `    approaches: [
      {
        name: 'Approach 1: Multi-Source BFS (Optimal)'`;
  const p89New = `    approaches: [
      {
        name: 'Approach 1: Repeated Grid Simulation (Baseline)',
        badge: 'Baseline / Simulation',
        timeComplexity: 'O((M × N)²)',
        spaceComplexity: 'O(1)',
        summary: 'Repeatedly scan the matrix minute by minute, rotting adjacent fresh oranges until no more oranges rot.',
        intuition: 'Straightforward simulation without a queue. Inefficient because it rescans all M*N cells on every minute.',
        codeJS: \`function orangesRottingSim(grid) {
  const rows = grid.length, cols = grid[0].length;
  let minutes = 0;
  let changed = true;
  while (changed) {
    changed = false;
    // Mark oranges that will rot this minute
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 2) {
          if (r > 0 && grid[r-1][c] === 1) { grid[r-1][c] = 3; changed = true; }
          if (r < rows-1 && grid[r+1][c] === 1) { grid[r+1][c] = 3; changed = true; }
          if (c > 0 && grid[r][c-1] === 1) { grid[r][c-1] = 3; changed = true; }
          if (c < cols-1 && grid[r][c+1] === 1) { grid[r][c+1] = 3; changed = true; }
        }
      }
    }
    if (changed) {
      minutes++;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] === 3) grid[r][c] = 2;
        }
      }
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) return -1;
    }
  }
  return minutes;
}\`,
        codeTS: \`function orangesRottingSim(grid: number[][]): number {
  const rows = grid.length, cols = grid[0].length;
  let minutes = 0;
  let changed = true;
  while (changed) {
    changed = false;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 2) {
          if (r > 0 && grid[r-1][c] === 1) { grid[r-1][c] = 3; changed = true; }
          if (r < rows-1 && grid[r+1][c] === 1) { grid[r+1][c] = 3; changed = true; }
          if (c > 0 && grid[r][c-1] === 1) { grid[r][c-1] = 3; changed = true; }
          if (c < cols-1 && grid[r][c+1] === 1) { grid[r][c+1] = 3; changed = true; }
        }
      }
    }
    if (changed) {
      minutes++;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] === 3) grid[r][c] = 2;
        }
      }
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) if (grid[r][c] === 1) return -1;
  }
  return minutes;
}\`,
        lineByLine: [
          'Line 2-6: Loop while changes occur.',
          'Line 7-19: Scan whole grid; mark newly rotten cells with temporary state 3.',
          'Line 20-27: Convert 3 to 2 and increment minute.'
        ],
        dryRun: [
          { step: 1, state: 'grid scan 1', action: 'Marks adjacent 1s as 3', result: 'minutes = 1' }
        ],
        complexityDerivation: 'Worst-case M*N minutes, each scanning M*N cells $\\\\to O((M \\\\times N)^2)$ time.'
      },
      {
        name: 'Approach 2: Multi-Source BFS (Optimal)'`;
  graphs = graphs.replace(p89Old, p89New);
}

// For 92: Add DFS 3-Coloring Cycle Detection
if (!graphs.includes('name: \'Approach 2: DFS 3-Coloring Cycle Detection\'')) {
  const p92Append = `      },
      {
        name: 'Approach 2: DFS 3-Coloring Cycle Detection',
        badge: 'Alternative / DFS 3-Coloring',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V + E)',
        summary: 'Detect cycles using 3 states: 0 = unvisited, 1 = currently visiting (in active recursion stack), 2 = completely processed.',
        intuition: 'If DFS encounters a node with state 1 (currently visiting), a back-edge exists, proving a circular dependency cycle!',
        codeJS: \`function canFinishDFS(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [c, p] of prerequisites) adj[p].push(c);

  const state = new Array(numCourses).fill(0); // 0=unvisited, 1=visiting, 2=visited

  function hasCycle(node) {
    if (state[node] === 1) return true;  // Cycle found!
    if (state[node] === 2) return false; // Already verified acyclic

    state[node] = 1; // Mark as currently visiting
    for (const nextNode of adj[node]) {
      if (hasCycle(nextNode)) return true;
    }
    state[node] = 2; // Mark as fully visited
    return false;
  }

  for (let i = 0; i < numCourses; i++) {
    if (hasCycle(i)) return false;
  }

  return true;
}\`,
        codeTS: \`function canFinishDFS(numCourses: number, prerequisites: number[][]): boolean {
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [c, p] of prerequisites) adj[p].push(c);
  const state: number[] = new Array(numCourses).fill(0);

  function hasCycle(node: number): boolean {
    if (state[node] === 1) return true;
    if (state[node] === 2) return false;
    state[node] = 1;
    for (const nextNode of adj[node]) {
      if (hasCycle(nextNode)) return true;
    }
    state[node] = 2;
    return false;
  }

  for (let i = 0; i < numCourses; i++) {
    if (hasCycle(i)) return false;
  }
  return true;
}\`,
        lineByLine: [
          'Line 2-3: Build adjacency list.',
          'Line 5: State array: 0=unvisited, 1=visiting, 2=visited.',
          'Line 7-18: hasCycle DFS: returns true if back-edge hits state 1.'
        ],
        dryRun: [
          { step: 1, state: 'node 0 -> state=1', action: 'Calls neighbor 1 -> state=1', result: 'Traversing' },
          { step: 2, state: 'neighbor points back to 0', action: 'state[0] === 1 -> Cycle detected!', result: 'Returns false' }
        ],
        complexityDerivation: 'Visits each course and edge once $\\\\to O(V + E)$ time and $O(V + E)$ space.'
      }`;
  graphs = graphs.replace("        complexityDerivation: 'Building graph takes O(E). Each course is enqueued once and each edge is decremented once $\\\\to O(V + E)$ time. Space for adjList and queue is $O(V + E)$.'\n      }", "        complexityDerivation: 'Building graph takes O(E). Each course is enqueued once and each edge is decremented once $\\\\to O(V + E)$ time. Space for adjList and queue is $O(V + E)$.'\n" + p92Append);
}

fs.writeFileSync(GRAPHS_FILE, graphs, 'utf8');
console.log('Enriched dsaGraphsSolutions.js!');
