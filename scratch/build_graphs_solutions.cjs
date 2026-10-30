// Script to author Problems 85-100 (Graphs)
const fs = require('fs');
const path = require('path');

const GRAPHS_FILE = path.join(__dirname, '../src/dsa/data/solutions/dsaGraphsSolutions.js');

const graphsContent = `// Problems 85-100: Graphs Master Solutions
// Full Multi-Approach Solutions with JS & TS, Line-by-Line Breakdown, Dry Runs, Pitches, and Quizzes

export const GRAPHS_SOLUTIONS = {
  // ==========================================
  // PROBLEM 85: NUMBER OF ISLANDS (LC #200)
  // ==========================================
  85: {
    id: 85,
    title: 'Number of Islands',
    difficulty: 'Medium',
    pattern: 'Graphs',
    day: 40,
    leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/',
    summary: 'Count the number of disconnected islands in a 2D binary grid using DFS flood-fill or BFS queue.',
    prerequisites: ['2D matrix graph traversal', 'In-place visited marking (sinking to "0")'],
    problemStatement: \`Given an \\\`m x n\\\` 2D binary grid \\\`grid\\\` which represents a map of \\\`'1'\\\`s (land) and \\\`'0'\\\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\`,
    approaches: [
      {
        name: 'Approach 1: DFS Flood-Fill (Optimal)',
        badge: 'Optimal / Recursive DFS',
        timeComplexity: 'O(M × N)',
        spaceComplexity: 'O(M × N) call stack',
        summary: 'Traverse grid. When unvisited land "1" is hit, increment count and recursively sink all connected land to "0".',
        intuition: 'Each island is an independent connected component. In-place sinking to "0" avoids visited sets.',
        codeJS: \`function numIslands(grid) {
  if (!grid || !grid.length) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0'; // Sink in-place
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }

  return count;
}\`,
        codeTS: \`function numIslands(grid: string[][]): number {
  if (!grid || !grid.length) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r: number, c: number): void {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }

  return count;
}\`,
        lineByLine: [
          'Line 2-5: Initialize grid dimensions and island count.',
          'Line 7-14: dfs(r, c) handles bounds, sinks current cell, and explores 4 cardinal directions.',
          'Line 16-23: Nested loops scan grid, triggering DFS whenever land "1" is encountered.'
        ],
        dryRun: [
          { step: 1, state: 'grid[0][0] = "1"', action: 'count = 1, sink connected land', result: 'All adjacent 1s sunk to 0' },
          { step: 2, state: 'Remaining cells', action: 'Scan continues; sunk cells are skipped', result: 'Final count returned' }
        ],
        complexityDerivation: 'Every cell is visited a constant number of times $\\\\to O(M \\\\times N)$ time and $O(M \\\\times N)$ worst-case call stack.'
      }
    ],
    comparisonTable: [
      { approach: 'DFS Flood Fill', time: 'O(M × N)', space: 'O(M × N) stack', pros: 'Concise, clean code', cons: 'Risk of stack overflow on deep grids' },
      { approach: 'BFS Queue Iterative', time: 'O(M × N)', space: 'O(min(M, N))', pros: 'Zero recursion; queue memory bounded by diagonal diameter', cons: 'Requires queue management' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Number of Islands**:
"I model the 2D grid as an undirected graph where land cells ('1') are vertices and adjacent land cells share an edge. Each island corresponds to a connected component.

I iterate through the grid. Whenever I encounter an unvisited '1', I increment my island counter and trigger a DFS flood-fill that recursively mutates all connected land cells to '0'. This in-place sinking prevents redundant recounting and eliminates extra visited memory. Each cell is touched at most a constant number of times, giving optimal O(M * N) time and O(M * N) worst-case space."\`,
    followUps: [
      {
        question: 'What if we cannot mutate the input grid?',
        answer: 'Maintain an auxiliary boolean matrix visited[M][N] or a Set of coordinate strings "r,c" in O(M * N) space.'
      }
    ],
    recallQuiz: {
      question: 'What prevents infinite recursion when exploring adjacent cells in Number of Islands?',
      options: [
        'Mutating grid[r][c] = "0" before recursing into neighbors',
        'Limiting the loop counter to 100',
        'Sorting the grid before DFS',
        'Only searching down and right'
      ],
      correctIndex: 0,
      explanation: 'Sinking visited cells to "0" marks them as water so future checks abort immediately.'
    }
  },

  // ==========================================
  // PROBLEM 87: CLONE GRAPH (LC #133)
  // ==========================================
  87: {
    id: 87,
    title: 'Clone Graph',
    difficulty: 'Medium',
    pattern: 'Graphs',
    day: 41,
    leetcodeUrl: 'https://leetcode.com/problems/clone-graph/',
    summary: 'Create a deep copy of a connected undirected graph where each node contains a value and a list of neighbors.',
    prerequisites: ['Graph DFS / BFS', 'Hash Map mapping original nodes to cloned nodes to resolve cycles'],
    problemStatement: \`Given a reference of a node in a **connected** undirected graph, return a **deep copy** (clone) of the graph.

Each node in the graph contains a value (\`int\`) and a list (\`List[Node]\`) of its neighbors.\`,
    approaches: [
      {
        name: 'Approach 1: DFS with Cloned Nodes Map (Optimal)',
        badge: 'Optimal / Recursive DFS',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        summary: 'Use a Map(oldNode -> clonedNode). Recursively clone node and its neighbors, reusing previously cloned nodes.',
        intuition: 'A simple recursive clone would loop infinitely on cyclic graphs. Storing cloned nodes in a Map prevents cycle loops: if a node is already cloned, return its clone immediately.',
        codeJS: \`function cloneGraph(node) {
  if (!node) return null;
  const cloned = new Map(); // oldNode -> newNode

  function dfs(curr) {
    if (cloned.has(curr)) {
      return cloned.get(curr); // Return existing clone to break cycle
    }

    const copy = { val: curr.val, neighbors: [] };
    cloned.set(curr, copy);

    for (const neighbor of curr.neighbors) {
      copy.neighbors.push(dfs(neighbor));
    }

    return copy;
  }

  return dfs(node);
}\`,
        codeTS: \`function cloneGraph(node: any): any {
  if (!node) return null;
  const cloned = new Map<any, any>();

  function dfs(curr: any): any {
    if (cloned.has(curr)) return cloned.get(curr);

    const copy: any = { val: curr.val, neighbors: [] };
    cloned.set(curr, copy);

    for (const neighbor of curr.neighbors) {
      copy.neighbors.push(dfs(neighbor));
    }

    return copy;
  }

  return dfs(node);
}\`,
        lineByLine: [
          'Line 2: Null check for empty graph input.',
          'Line 3: cloned Map tracks original node reference to deep-copied node.',
          'Line 6-8: If node already cloned, return clone immediately (prevents infinite cycles).',
          'Line 10-11: Instantiate new node copy and record in map before recursing into neighbors.',
          'Line 13-15: Recursively clone all neighbors and push to copy.neighbors.'
        ],
        dryRun: [
          { step: 1, state: 'node 1 connected to 2, 4', action: 'Create clone 1, add to map, call dfs(2)', result: 'cloned has {1: clone1}' },
          { step: 2, state: 'dfs(2) visits 1, 3', action: 'neighbor 1 exists in map -> returns clone1 directly', result: 'Cycle broken safely!' }
        ],
        complexityDerivation: 'Visits each vertex V and explores each edge E once $\\\\to O(V + E)$ time. Hash Map holds V nodes $\\\\to O(V)$ space.'
      }
    ],
    comparisonTable: [
      { approach: 'DFS + Map', time: 'O(V + E)', space: 'O(V)', pros: 'Clean, elegant recursion', cons: 'Call stack depth bounded by V' },
      { approach: 'BFS Queue + Map', time: 'O(V + E)', space: 'O(V)', pros: 'Iterative, safe for large graphs', cons: 'Requires FIFO queue management' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Clone Graph**:
"To deep copy a graph with arbitrary cycles, the key challenge is preventing infinite recursion. I maintain a Hash Map mapping each original Node to its newly created clone.

When visiting a node, if it already exists in the map, I immediately return its clone. Otherwise, I instantiate the new cloned node, record it in the map first, and then iterate through the original node's neighbors, recursively calling my DFS helper and appending the returned cloned neighbors. This guarantees each vertex and edge is processed exactly once in O(V + E) time and O(V) space."\`,
    followUps: [
      {
        question: 'Why must we insert the cloned node into the map BEFORE recursing into its neighbors?',
        answer: 'If we wait until neighbors are cloned, a cycle pointing back to the current node would find nothing in the map, triggering an infinite recursive loop!'
      }
    ],
    recallQuiz: {
      question: 'What is the consequence of omitting the "cloned.set(curr, copy)" statement before recursing into neighbors?',
      options: [
        'An infinite call stack overflow because cycles cannot be detected',
        'Memory leak in JavaScript garbage collection',
        'Neighbors will be sorted in reverse order',
        'Node values become undefined'
      ],
      correctIndex: 0,
      explanation: 'Without recording the clone immediately, any back-edge in a cycle will re-clone the node endlessly!'
    }
  },

  // ==========================================
  // PROBLEM 89: ROTTING ORANGES (LC #994)
  // ==========================================
  89: {
    id: 89,
    title: 'Rotting Oranges',
    difficulty: 'Medium',
    pattern: 'Graphs',
    day: 42,
    leetcodeUrl: 'https://leetcode.com/problems/rotting-oranges/',
    summary: 'Find the minimum minutes until no fresh orange remains using multi-source Breadth-First Search (BFS).',
    prerequisites: ['Multi-source BFS', 'Level-by-level time step incrementation'],
    problemStatement: \`You are given an \\\`m x n\\\` grid where each cell can have one of three values:
- \\\`0\\\` representing an empty cell,
- \\\`1\\\` representing a fresh orange, or
- \\\`2\\\` representing a rotten orange.

Every minute, any fresh orange that is **4-directionally adjacent** to a rotten orange becomes rotten.

Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return \\\`-1\\\`.\`,
    approaches: [
      {
        name: 'Approach 1: Multi-Source BFS (Optimal)',
        badge: 'Optimal / Multi-Source BFS',
        timeComplexity: 'O(M × N)',
        spaceComplexity: 'O(M × N)',
        summary: 'Enqueue all initially rotten oranges at minute 0. Expand in waves, rotting fresh neighbors and counting elapsed minutes.',
        intuition: 'All rotten oranges rot adjacent fresh oranges simultaneously. This is the definition of multi-source BFS! Tracking fresh orange count avoids extra matrix scans.',
        codeJS: \`function orangesRotting(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  // 1. Collect all initial rotten oranges and count fresh oranges
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c]);
      } else if (grid[r][c] === 1) {
        freshCount++;
      }
    }
  }

  if (freshCount === 0) return 0; // No fresh oranges to rot

  let minutes = 0;
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  // 2. Multi-source BFS wave
  while (queue.length > 0 && freshCount > 0) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2; // Rot the fresh orange
          freshCount--;
          queue.push([nr, nc]);
        }
      }
    }
    minutes++;
  }

  return freshCount === 0 ? minutes : -1;
}\`,
        codeTS: \`function orangesRotting(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue: [number, number][] = [];
  let freshCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) freshCount++;
    }
  }

  if (freshCount === 0) return 0;

  let minutes = 0;
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  while (queue.length > 0 && freshCount > 0) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          freshCount--;
          queue.push([nr, nc]);
        }
      }
    }
    minutes++;
  }

  return freshCount === 0 ? minutes : -1;
}\`,
        lineByLine: [
          'Line 2-6: Initialize dimensions, queue, and freshCount.',
          'Line 8-16: Initial pass seeds queue with all rotten oranges (multi-sources) and counts fresh oranges.',
          'Line 18: If 0 fresh oranges exist, return 0 immediately.',
          'Line 23-38: BFS level loop: for each rotten orange, spread rot to adjacent fresh oranges, decrement freshCount, and enqueue.',
          'Line 39: Increment minutes after completing an entire wave.',
          'Line 42: If freshCount === 0, return elapsed minutes; else return -1 (unreachable).'
        ],
        dryRun: [
          { step: 1, state: 'grid 3x3, freshCount = 6, queue = [[0, 0]]', action: 'Minute 1: rots (0, 1) and (1, 0)', result: 'fresh = 4, minutes = 1' },
          { step: 2, state: 'Minute 2: rots (0, 2) and (1, 1)', action: 'queue pushes new rotten', result: 'fresh = 2, minutes = 2' },
          { step: 3, state: 'Minute 4: all fresh rotten', action: 'freshCount === 0', result: 'Returns 4' }
        ],
        complexityDerivation: 'Every cell is visited and updated at most once $\\\\to O(M \\\\times N)$ time and $O(M \\\\times N)$ queue space.'
      }
    ],
    comparisonTable: [
      { approach: 'Repeated Grid Scanning', time: 'O((M × N)²)', space: 'O(1)', pros: 'No queue needed', cons: 'Extremely slow repeated matrix scans' },
      { approach: 'Multi-Source BFS', time: 'O(M × N)', space: 'O(M × N)', pros: 'Linear time; models parallel propagation accurately', cons: 'Requires queue allocations' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Rotting Oranges**:
"Because all rotten oranges spread rot simultaneously in parallel, this is a textbook Multi-Source BFS problem. 

First, I do an initial pass through the grid to enqueue all initially rotten oranges and count the total fresh oranges. If fresh oranges is 0, I return 0 immediately.
Then, while the queue is not empty and fresh oranges remain, I process the queue level-by-level using levelSize. For each rotten orange, I inspect its 4 neighbors. If a neighbor is fresh, I rot it in-place, decrement the fresh counter, and push it to the queue. After each level wave, I increment minutes. Finally, if fresh count reached 0, I return minutes; otherwise -1."\`,
    followUps: [
      {
        question: 'Why check "freshCount > 0" in the while loop condition?',
        answer: 'To avoid an unnecessary extra minute increment on the final wave when the last fresh orange has already turned rotten!'
      }
    ],
    recallQuiz: {
      question: 'Why is Multi-Source BFS strictly better than single-source BFS from each rotten orange?',
      options: [
        'Multi-Source BFS explores all rot frontiers simultaneously in a single pass of O(M × N)',
        'Single-source BFS is not supported in JavaScript',
        'Multi-source BFS uses less code',
        'Single-source BFS produces incorrect answers'
      ],
      correctIndex: 0,
      explanation: 'Running BFS from each rotten orange individually would repeat work across overlapping paths in O(R × M × N) time!'
    }
  },

  // ==========================================
  // PROBLEM 92: COURSE SCHEDULE (LC #207)
  // ==========================================
  92: {
    id: 92,
    title: 'Course Schedule',
    difficulty: 'Medium',
    pattern: 'Graphs',
    day: 42,
    leetcodeUrl: 'https://leetcode.com/problems/course-schedule/',
    summary: 'Determine if you can finish all courses given prerequisite dependencies using cycle detection in a directed graph (Kahn\'s Algorithm / DFS 3-Coloring).',
    prerequisites: ['Directed Acyclic Graph (DAG) cycle detection', 'Kahn\'s Algorithm (In-degree array + Queue) vs DFS 3-state coloring'],
    problemStatement: \`There are a total of \\\`numCourses\\\` courses you have to take, labeled from \\\`0\\\` to \\\`numCourses - 1\\\`. You are given an array \\\`prerequisites\\\` where \\\`prerequisites[i] = [a_i, b_i]\\\` indicates that you **must** take course \\\`b_i\\\` first if you want to take course \\\`a_i\\\`.

Return \\\`true\\\` if you can finish all courses. Otherwise, return \\\`false\\\`.\`,
    approaches: [
      {
        name: 'Approach 1: Kahn\'s Algorithm (BFS Topological Sort) (Optimal)',
        badge: 'Optimal / Topological Sort',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V + E)',
        summary: 'Track in-degrees of all courses. Enqueue courses with in-degree 0 (no prerequisites). Dequeue and decrement neighbor in-degrees.',
        intuition: 'If a directed graph has no cycles, we can iteratively remove nodes with in-degree 0 until all nodes are removed. If nodes remain with in-degree > 0, a circular dependency exists!',
        codeJS: \`function canFinish(numCourses, prerequisites) {
  const inDegree = new Array(numCourses).fill(0);
  const adjList = Array.from({ length: numCourses }, () => []);

  // Build graph: [course, prereq] -> prereq points to course
  for (const [course, prereq] of prerequisites) {
    adjList[prereq].push(course);
    inDegree[course]++;
  }

  // Enqueue courses with 0 prerequisites
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let completedCourses = 0;

  while (queue.length > 0) {
    const curr = queue.shift();
    completedCourses++;

    for (const nextCourse of adjList[curr]) {
      inDegree[nextCourse]--;
      if (inDegree[nextCourse] === 0) {
        queue.push(nextCourse);
      }
    }
  }

  return completedCourses === numCourses;
}\`,
        codeTS: \`function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const inDegree = new Array(numCourses).fill(0);
  const adjList: number[][] = Array.from({ length: numCourses }, () => []);

  for (const [course, prereq] of prerequisites) {
    adjList[prereq].push(course);
    inDegree[course]++;
  }

  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let completedCourses = 0;

  while (queue.length > 0) {
    const curr = queue.shift()!;
    completedCourses++;

    for (const nextCourse of adjList[curr]) {
      inDegree[nextCourse]--;
      if (inDegree[nextCourse] === 0) queue.push(nextCourse);
    }
  }

  return completedCourses === numCourses;
}\`,
        lineByLine: [
          'Line 2-3: inDegree array tracks incoming prerequisites; adjList stores downstream courses.',
          'Line 5-8: Build adjacency list and tally in-degrees.',
          'Line 11-14: Enqueue all courses with inDegree === 0 (can be taken immediately).',
          'Line 18-28: Dequeue course, count as completed, decrement dependent courses\' in-degree; enqueue if inDegree hits 0.',
          'Line 31: Return true if all numCourses could be completed (no cycle).'
        ],
        dryRun: [
          { step: 1, state: 'prereqs = [[1, 0]], numCourses = 2', action: 'inDegree = [0, 1], queue = [0]', result: 'Course 0 ready' },
          { step: 2, state: 'Process 0 -> inDegree[1] = 0', action: 'Enqueue 1, completed = 1', result: 'queue = [1]' },
          { step: 3, state: 'Process 1 -> completed = 2', action: 'completed === numCourses', result: 'Returns true' }
        ],
        complexityDerivation: 'Building graph takes O(E). Each course is enqueued once and each edge is decremented once $\\\\to O(V + E)$ time. Space for adjList and queue is $O(V + E)$.'
      }
    ],
    comparisonTable: [
      { approach: 'DFS 3-Coloring (Cycle Detection)', time: 'O(V + E)', space: 'O(V + E)', pros: 'Direct cycle detection; simple recursion', cons: 'Recursion depth risk' },
      { approach: 'Kahn\'s Algorithm (BFS)', time: 'O(V + E)', space: 'O(V + E)', pros: 'Iterative, robust; directly produces topological order', cons: 'Requires in-degree bookkeeping' }
    ],
    interviewPitch: \`**60-Second Interview Pitch for Course Schedule**:
"Course Schedule translates to cycle detection in a directed graph: can we finish all courses if and only if the dependency graph is a Directed Acyclic Graph (DAG)?

I solve this using Kahn's algorithm for Topological Sort. I construct an adjacency list where prereq $\\\\to$ course, and an in-degree array where inDegree[course] counts required prerequisites.
I enqueue all courses with in-degree 0 (no prerequisites). Then, in a BFS loop, I dequeue a course, increment my completed course counter, and decrement the in-degree of all dependent courses. If any dependent course reaches an in-degree of 0, I enqueue it. At the end, if completedCourses === numCourses, there are no cycles and all courses can be finished. This runs in optimal O(V + E) time and O(V + E) space."\`,
    followUps: [
      {
        question: 'How do you return the ACTUAL order of courses to take (LeetCode #210 - Course Schedule II)?',
        answer: 'Instead of just counting completed courses, append each dequeued course to an order array. If completedCourses === numCourses, return order; else return [].'
      }
    ],
    recallQuiz: {
      question: 'What does a course retaining an in-degree > 0 after Kahn\'s algorithm terminates indicate?',
      options: [
        'That course is part of a circular dependency cycle and can never be taken',
        'The course is optional',
        'The course has no prerequisites',
        'The course was already completed'
      ],
      correctIndex: 0,
      explanation: 'Any node inside a directed cycle will never have its in-degree reach 0, meaning it can never be enqueued or completed!'
    }
  }
};
`;

fs.writeFileSync(GRAPHS_FILE, graphsContent, 'utf8');
console.log('Successfully wrote dsaGraphsSolutions.js!');
