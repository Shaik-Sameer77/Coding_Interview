// Problems 85-100: Graphs Master Solutions
// Full Multi-Approach Solutions with JS & TS, Line-by-Line Breakdown, Dry Runs, Pitches, and Quizzes

export const GRAPHS_SOLUTIONS = {
  // ==========================================
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
    problemStatement: `There are \`n\` cities. Some of them are connected, while some are not. If city \`a\` is connected directly with city \`b\`, and city \`b\` is connected directly with city \`c\`, then city \`a\` is connected indirectly with city \`c\`.

A **province** is a group of directly or indirectly connected cities and no other cities outside of the group.

You are given an \`n x n\` matrix \`isConnected\` where \`isConnected[i][j] = 1\` if the \`i-th\` city and the \`j-th\` city are directly connected, and \`isConnected[i][j] = 0\` otherwise.

Return the total number of **provinces**.`,
    approaches: [
      {
        name: 'Approach 1: Depth-First Search (DFS) (Optimal)',
        badge: 'Optimal / Recursive DFS',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(N) visited',
        summary: 'Maintain a visited array of size N. Iterate through each city; if unvisited, increment province count and DFS flood-fill all reachable cities.',
        intuition: 'Each province is an undirected connected component in an adjacency matrix. Traversing row i explores all neighbors of city i.',
        codeJS: `function findCircleNum(isConnected) {
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
}`,
        codeTS: `function findCircleNum(isConnected: number[][]): number {
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
}`,
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
        complexityDerivation: 'The matrix contains N^2 elements. Every city row is scanned once $\\to O(N^2)$ time. Visited array and call stack take $O(N)$ space.'
      },
      {
        name: 'Approach 2: Disjoint Set Union (Union-Find)',
        badge: 'Production-Grade / Union-Find',
        timeComplexity: 'O(N² × α(N))',
        spaceComplexity: 'O(N)',
        summary: 'Initialize N disjoint sets. For each edge isConnected[i][j] === 1, union sets. Count remaining disjoint roots.',
        intuition: 'Union-Find with path compression and rank operates in near O(1) time per edge. Total distinct components equals initial N minus successful unions.',
        codeJS: `class UnionFind {
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
}`,
        codeTS: `class UnionFind {
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
}`,
        lineByLine: [
          'Line 1-17: Disjoint Set Union class with path compression and component counter.',
          'Line 20-28: Traverse upper triangle of symmetric adjacency matrix; call union on edge connections.',
          'Line 30: Return remaining component count.'
        ],
        dryRun: [
          { step: 1, state: 'N=3, count=3', action: 'isConnected[0][1]=1 -> union(0, 1), count=2', result: 'parent=[1, 1, 2]' },
          { step: 2, state: 'isConnected[1][2]=0', action: 'No union', result: 'Final count = 2' }
        ],
        complexityDerivation: 'Scanning upper triangle takes N(N-1)/2 edges, each taking O(α(N)) $\\to O(N^2 \\times \\alpha(N))$ time. Parent array takes $O(N)$ space.'
      }
    ],
    comparisonTable: [
      { approach: 'Depth-First Search', time: 'O(N²)', space: 'O(N) visited', pros: 'Direct recursion, simple visited check', cons: 'Call stack depth N' },
      { approach: 'Union-Find (DSU)', time: 'O(N² × α(N))', space: 'O(N) array', pros: 'Dynamic connectivity; supports online edge additions', cons: 'More boilerplate data structure code' }
    ],
    interviewPitch: `**60-Second Interview Pitch for Number of Provinces**:
"The Number of Provinces problem asks for the number of connected components in an undirected graph represented as an adjacency matrix.

We can solve it in O(N^2) time using DFS or Union-Find.
With DFS, I maintain a visited boolean array of size N. I loop through all cities from 0 to N-1. If a city has not been visited, I increment my province count and trigger a DFS that marks all directly and indirectly connected cities as visited.
Alternatively, with Union-Find, I initialize N components. For every 1 in the upper triangle of the matrix, I union the two cities and decrement the component count. Both approaches achieve optimal O(N^2) time and O(N) space."`,
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
    problemStatement: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.`,
    approaches: [
      {
        name: 'Approach 1: DFS Flood-Fill (Optimal)',
        badge: 'Optimal / Recursive DFS',
        timeComplexity: 'O(M × N)',
        spaceComplexity: 'O(M × N) call stack',
        summary: 'Traverse grid. When unvisited land "1" is hit, increment count and recursively sink all connected land to "0".',
        intuition: 'Each island is an independent connected component. In-place sinking to "0" avoids visited sets.',
        codeJS: `function numIslands(grid) {
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
}`,
        codeTS: `function numIslands(grid: string[][]): number {
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
}`,
        lineByLine: [
          'Line 2-5: Initialize grid dimensions and island count.',
          'Line 7-14: dfs(r, c) handles bounds, sinks current cell, and explores 4 cardinal directions.',
          'Line 16-23: Nested loops scan grid, triggering DFS whenever land "1" is encountered.'
        ],
        dryRun: [
          { step: 1, state: 'grid[0][0] = "1"', action: 'count = 1, sink connected land', result: 'All adjacent 1s sunk to 0' },
          { step: 2, state: 'Remaining cells', action: 'Scan continues; sunk cells are skipped', result: 'Final count returned' }
        ],
        complexityDerivation: 'Every cell is visited a constant number of times $\\to O(M \\times N)$ time and $O(M \\times N)$ worst-case call stack.'
      },
      {
        name: 'Approach 2: BFS Queue Iterative',
        badge: 'Alternative / BFS Queue',
        timeComplexity: 'O(M × N)',
        spaceComplexity: 'O(min(M, N)) queue',
        summary: 'Iterative queue-based BFS: enqueue unvisited land cells, marking them as 0 to avoid recursion stack overflow.',
        intuition: 'Queue memory is bounded by the perimeter / diagonal diameter of the island, which is at most O(min(M, N)).',
        codeJS: `function numIslandsBFS(grid) {
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
}`,
        codeTS: `function numIslandsBFS(grid: string[][]): number {
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
}`,
        lineByLine: [
          'Line 2-6: Dimensions, island counter, and 4-way direction vectors.',
          'Line 8-28: When land encountered, increment count, enqueue, and sink all connected cells via BFS queue.'
        ],
        dryRun: [
          { step: 1, state: 'grid[0][0] === "1"', action: 'Enqueue [0, 0], sink neighbors', result: 'Island 1 fully mapped' }
        ],
        complexityDerivation: 'Every cell enqueued at most once $\\to O(M \\times N)$ time and $O(\\min(M, N))$ queue memory.'
      }
    ],
    comparisonTable: [
      { approach: 'DFS Flood Fill', time: 'O(M × N)', space: 'O(M × N) stack', pros: 'Concise, clean code', cons: 'Risk of stack overflow on deep grids' },
      { approach: 'BFS Queue Iterative', time: 'O(M × N)', space: 'O(min(M, N))', pros: 'Zero recursion; queue memory bounded by diagonal diameter', cons: 'Requires queue management' }
    ],
    interviewPitch: `**60-Second Interview Pitch for Number of Islands**:
"I model the 2D grid as an undirected graph where land cells ('1') are vertices and adjacent land cells share an edge. Each island corresponds to a connected component.

I iterate through the grid. Whenever I encounter an unvisited '1', I increment my island counter and trigger a DFS flood-fill that recursively mutates all connected land cells to '0'. This in-place sinking prevents redundant recounting and eliminates extra visited memory. Each cell is touched at most a constant number of times, giving optimal O(M * N) time and O(M * N) worst-case space."`,
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
    problemStatement: `Given a reference of a node in a **connected** undirected graph, return a **deep copy** (clone) of the graph.

Each node in the graph contains a value (int) and a list (List[Node]) of its neighbors.`,
    approaches: [
      {
        name: 'Approach 1: DFS with Cloned Nodes Map (Optimal)',
        badge: 'Optimal / Recursive DFS',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        summary: 'Use a Map(oldNode -> clonedNode). Recursively clone node and its neighbors, reusing previously cloned nodes.',
        intuition: 'A simple recursive clone would loop infinitely on cyclic graphs. Storing cloned nodes in a Map prevents cycle loops: if a node is already cloned, return its clone immediately.',
        codeJS: `function cloneGraph(node) {
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
}`,
        codeTS: `function cloneGraph(node: any): any {
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
}`,
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
        complexityDerivation: 'Visits each vertex V and explores each edge E once $\\to O(V + E)$ time. Hash Map holds V nodes $\\to O(V)$ space.'
      },
      {
        name: 'Approach 2: BFS Queue with Map',
        badge: 'Alternative / Iterative BFS',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        summary: 'Iterative BFS queue using Map(original -> clone) to duplicate graph without call stack recursion.',
        intuition: 'Enqueue original nodes. When dequeuing, clone all unvisited neighbors, insert into map, and enqueue them.',
        codeJS: `function cloneGraphBFS(node) {
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
}`,
        codeTS: `function cloneGraphBFS(node: any): any {
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
}`,
        lineByLine: [
          'Line 2-5: Initialize map and queue with source node.',
          'Line 7-16: Dequeue node; clone and enqueue unvisited neighbors, linking edges in map.'
        ],
        dryRun: [
          { step: 1, state: 'node 1', action: 'Queue=[1], cloned={1: clone1}', result: 'Source primed' }
        ],
        complexityDerivation: 'Processes each vertex and edge once $\\to O(V + E)$ time and $O(V)$ space.'
      }
    ],
    comparisonTable: [
      { approach: 'DFS + Map', time: 'O(V + E)', space: 'O(V)', pros: 'Clean, elegant recursion', cons: 'Call stack depth bounded by V' },
      { approach: 'BFS Queue + Map', time: 'O(V + E)', space: 'O(V)', pros: 'Iterative, safe for large graphs', cons: 'Requires FIFO queue management' }
    ],
    interviewPitch: `**60-Second Interview Pitch for Clone Graph**:
"To deep copy a graph with arbitrary cycles, the key challenge is preventing infinite recursion. I maintain a Hash Map mapping each original Node to its newly created clone.

When visiting a node, if it already exists in the map, I immediately return its clone. Otherwise, I instantiate the new cloned node, record it in the map first, and then iterate through the original node\'s neighbors, recursively calling my DFS helper and appending the returned cloned neighbors. This guarantees each vertex and edge is processed exactly once in O(V + E) time and O(V) space."`,
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
    problemStatement: `You are given an \`m x n\` grid where each cell can have one of three values:
- \`0\` representing an empty cell,
- \`1\` representing a fresh orange, or
- \`2\` representing a rotten orange.

Every minute, any fresh orange that is **4-directionally adjacent** to a rotten orange becomes rotten.

Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return \`-1\`.`,
    approaches: [
      {
        name: 'Approach 1: Repeated Grid Simulation (Baseline)',
        badge: 'Baseline / Simulation',
        timeComplexity: 'O((M × N)²)',
        spaceComplexity: 'O(1)',
        summary: 'Repeatedly scan the matrix minute by minute, rotting adjacent fresh oranges until no more oranges rot.',
        intuition: 'Straightforward simulation without a queue. Inefficient because it rescans all M*N cells on every minute.',
        codeJS: `function orangesRottingSim(grid) {
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
}`,
        codeTS: `function orangesRottingSim(grid: number[][]): number {
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
}`,
        lineByLine: [
          'Line 2-6: Loop while changes occur.',
          'Line 7-19: Scan whole grid; mark newly rotten cells with temporary state 3.',
          'Line 20-27: Convert 3 to 2 and increment minute.'
        ],
        dryRun: [
          { step: 1, state: 'grid scan 1', action: 'Marks adjacent 1s as 3', result: 'minutes = 1' }
        ],
        complexityDerivation: 'Worst-case M*N minutes, each scanning M*N cells $\\to O((M \\times N)^2)$ time.'
      },
      {
        name: 'Approach 2: Multi-Source BFS (Optimal)',
        badge: 'Optimal / Multi-Source BFS',
        timeComplexity: 'O(M × N)',
        spaceComplexity: 'O(M × N)',
        summary: 'Enqueue all initially rotten oranges at minute 0. Expand in waves, rotting fresh neighbors and counting elapsed minutes.',
        intuition: 'All rotten oranges rot adjacent fresh oranges simultaneously. This is the definition of multi-source BFS! Tracking fresh orange count avoids extra matrix scans.',
        codeJS: `function orangesRotting(grid) {
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
}`,
        codeTS: `function orangesRotting(grid: number[][]): number {
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
}`,
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
        complexityDerivation: 'Every cell is visited and updated at most once $\\to O(M \\times N)$ time and $O(M \\times N)$ queue space.'
      }
    ],
    comparisonTable: [
      { approach: 'Repeated Grid Scanning', time: 'O((M × N)²)', space: 'O(1)', pros: 'No queue needed', cons: 'Extremely slow repeated matrix scans' },
      { approach: 'Multi-Source BFS', time: 'O(M × N)', space: 'O(M × N)', pros: 'Linear time; models parallel propagation accurately', cons: 'Requires queue allocations' }
    ],
    interviewPitch: `**60-Second Interview Pitch for Rotting Oranges**:
"Because all rotten oranges spread rot simultaneously in parallel, this is a textbook Multi-Source BFS problem. 

First, I do an initial pass through the grid to enqueue all initially rotten oranges and count the total fresh oranges. If fresh oranges is 0, I return 0 immediately.
Then, while the queue is not empty and fresh oranges remain, I process the queue level-by-level using levelSize. For each rotten orange, I inspect its 4 neighbors. If a neighbor is fresh, I rot it in-place, decrement the fresh counter, and push it to the queue. After each level wave, I increment minutes. Finally, if fresh count reached 0, I return minutes; otherwise -1."`,
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
    problemStatement: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [a_i, b_i]\` indicates that you **must** take course \`b_i\` first if you want to take course \`a_i\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.`,
    approaches: [
      {
        name: 'Approach 1: Kahn\'s Algorithm (BFS Topological Sort) (Optimal)',
        badge: 'Optimal / Topological Sort',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V + E)',
        summary: 'Track in-degrees of all courses. Enqueue courses with in-degree 0 (no prerequisites). Dequeue and decrement neighbor in-degrees.',
        intuition: 'If a directed graph has no cycles, we can iteratively remove nodes with in-degree 0 until all nodes are removed. If nodes remain with in-degree > 0, a circular dependency exists!',
        codeJS: `function canFinish(numCourses, prerequisites) {
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
}`,
        codeTS: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
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
}`,
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
        complexityDerivation: 'Building graph takes O(E). Each course is enqueued once and each edge is decremented once $\\to O(V + E)$ time. Space for adjList and queue is $O(V + E)$.'
      },
      {
        name: 'Approach 2: DFS 3-Coloring Cycle Detection',
        badge: 'Alternative / DFS 3-Coloring',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V + E)',
        summary: 'Detect cycles using 3 states: 0 = unvisited, 1 = currently visiting (in active recursion stack), 2 = completely processed.',
        intuition: 'If DFS encounters a node with state 1 (currently visiting), a back-edge exists, proving a circular dependency cycle!',
        codeJS: `function canFinishDFS(numCourses, prerequisites) {
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
}`,
        codeTS: `function canFinishDFS(numCourses: number, prerequisites: number[][]): boolean {
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
}`,
        lineByLine: [
          'Line 2-3: Build adjacency list.',
          'Line 5: State array: 0=unvisited, 1=visiting, 2=visited.',
          'Line 7-18: hasCycle DFS: returns true if back-edge hits state 1.'
        ],
        dryRun: [
          { step: 1, state: 'node 0 -> state=1', action: 'Calls neighbor 1 -> state=1', result: 'Traversing' },
          { step: 2, state: 'neighbor points back to 0', action: 'state[0] === 1 -> Cycle detected!', result: 'Returns false' }
        ],
        complexityDerivation: 'Visits each course and edge once $\\to O(V + E)$ time and $O(V + E)$ space.'
      }
    ],
    comparisonTable: [
      { approach: 'DFS 3-Coloring (Cycle Detection)', time: 'O(V + E)', space: 'O(V + E)', pros: 'Direct cycle detection; simple recursion', cons: 'Recursion depth risk' },
      { approach: 'Kahn\'s Algorithm (BFS)', time: 'O(V + E)', space: 'O(V + E)', pros: 'Iterative, robust; directly produces topological order', cons: 'Requires in-degree bookkeeping' }
    ],
    interviewPitch: `**60-Second Interview Pitch for Course Schedule**:
"Course Schedule translates to cycle detection in a directed graph: can we finish all courses if and only if the dependency graph is a Directed Acyclic Graph (DAG)?

I solve this using Kahn\'s algorithm for Topological Sort. I construct an adjacency list where prereq $\\to$ course, and an in-degree array where inDegree[course] counts required prerequisites.
I enqueue all courses with in-degree 0 (no prerequisites). Then, in a BFS loop, I dequeue a course, increment my completed course counter, and decrement the in-degree of all dependent courses. If any dependent course reaches an in-degree of 0, I enqueue it. At the end, if completedCourses === numCourses, there are no cycles and all courses can be finished. This runs in optimal O(V + E) time and O(V + E) space."`,
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
