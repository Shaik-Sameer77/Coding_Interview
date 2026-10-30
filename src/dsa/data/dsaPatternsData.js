// 18 DSA Master Patterns & Foundations Data
// Theoretical Mental Models, Big-O Derivations, V8 Memory Mechanics, and Canonical Archetypes

export const DSA_PATTERNS_THEORY = [
  // 1. ARRAYS
  {
    id: 'arrays',
    name: 'Arrays & Memory Foundations',
    color: '#ef4444',
    tagline: 'Direct random memory indexing, CPU cache locality, and contiguous allocation',
    prerequisites: [
      'V8 memory elements kinds (PACKED_SMI_ELEMENTS vs PACKED_ELEMENTS vs HOLEY)',
      'Difference between static contiguous arrays in memory and dynamic JS Array objects',
      'Understanding cache line pre-fetching and O(1) address arithmetic'
    ],
    mentalModel: `Think of an **Array** as a continuous numbered street of houses with no gaps. If house #0 is at address 1000 and each house is 8 bytes, house #42 is immediately at $1000 + (42 \\times 8) = 1336$. 

You never have to walk through houses 0 to 41 to reach house 42—the CPU computes the memory address instantly in $O(1)$ time and loads the entire neighborhood into its L1/L2 cache lines simultaneously!`,
    engineMechanics: `### How V8 Handles Arrays Internally:
1. **Contiguous Elements Backing Store**:
   - Arrays initialized with consecutive integers start in **PACKED_SMI_ELEMENTS** (Small Integers, 31-bit unboxed integers). This is as fast as C-level memory access.
   - If you push a float or string, V8 transitions the array permanently into **PACKED_ELEMENTS**, wrapping values in HeapNumbers or pointer descriptors.
2. **The Peril of Holes (HOLEY_ELEMENTS)**:
   - If you write \`arr[1000] = 5\` on an array of length 5, V8 degrades the array to **HOLEY_ELEMENTS**. Prototypes must now be inspected for every read, destroying hardware cache performance!`,
    commonPatterns: [
      '**Prefix & Suffix Accumulator**: Precompute cumulative sums/products to answer range queries in $O(1)$.',
      '**In-Place Array Reversal / Partitioning**: Swap elements around a pivot without allocating extra arrays.',
      '**Index as Hash Key (Cyclic Sort / Sign Negation)**: Use the array values themselves as indices ($0 \\dots N-1$) to find duplicates in $O(1)$ space.'
    ],
    pitfalls: [
      'Using \`arr.shift()\` or \`arr.unshift()\` in a loop: every element must be re-indexed, turning a simple loop into $O(N^2)$!',
      'Using \`arr.sort()\` without a comparator: \`[10, 2].sort()\` yields \`[10, 2]\` because JavaScript coerces numbers to lexicographical strings!'
    ]
  },

  // 2. HASHING
  {
    id: 'hashing',
    name: 'Hashing & Hash Tables',
    color: '#f97316',
    tagline: 'Trading O(N) auxiliary space for average O(1) key-value insertion, deletion, and lookups',
    prerequisites: ['Hash functions and bucket indexing', 'Collision resolution (chaining vs open addressing)', 'ES6 Map vs Object differences'],
    mentalModel: `Think of a **Hash Map** as an automated post office sorting system. You present an arbitrary key (like a word or user ID). 

A mathematical hashing function converts the key into a deterministic bucket number ($0 \\dots B-1$). The postal box at that number either holds the value or is empty. Instead of searching linearly through millions of records, you jump straight to the correct bucket in average $O(1)$ time!`,
    engineMechanics: `### V8 Hash Table Implementation:
- ES6 \`Map\` and \`Set\` in V8 use deterministic hash tables with closed hashing and Robin Hood collision resolution.
- Unlike plain JavaScript objects (\`{}\`), \`Map\` guarantees deterministic insertion-order iteration, allows arbitrary objects and numbers as distinct keys, and prevents prototype pollution.
- Re-hashing occurs when the load factor exceeds 0.75, doubling the table capacity.`,
    commonPatterns: [
      '**Frequency Map**: Count occurrences of each character or number (e.g. Valid Anagram, Top K Frequent).',
      '**Complement Lookup**: While iterating element $x$, check if $(target - x)$ exists in the map (e.g. Two Sum).',
      '**Seen Set**: Store visited elements to detect duplicates or graph cycles in $O(1)$ time.',
      '**Subarray Sum with Prefix Map**: Store \`prefixSum -> count\` to find contiguous subarrays summing to $K$ in $O(N)$ time.'
    ],
    pitfalls: [
      'Using plain objects as maps when keys are numeric: V8 automatically sorts integer keys ascending, altering your expected iteration order!',
      'Assuming $O(1)$ worst-case: Hash collisions can theoretically degrade lookup time to $O(N)$ if the hash function is poor.'
    ]
  },

  // 3. TWO POINTERS
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    color: '#f59e0b',
    tagline: 'Eliminating quadratic search spaces by navigating sorted or structured boundaries inward or together',
    prerequisites: ['Sorted sequences or palindromic strings', 'Array indexing & loop boundary conditions'],
    mentalModel: `Imagine two friends walking towards each other from opposite ends of a bridge. Depending on what they observe (is their combined weight too high or too low?), one of them takes a step inward.

Because every single step eliminates at least one candidate without missing any valid pairs, the entire search completes in $O(N)$ time instead of checking all $\\frac{N(N-1)}{2}$ combinations!`,
    engineMechanics: `Two pointers operates purely with index registers. It allocates $O(1)$ auxiliary space and has the highest CPU cache locality possible since memory is accessed sequentially from endpoints.`,
    commonPatterns: [
      '**Opposite Direction**: Start at $0$ and $N-1$, converge inward (Valid Palindrome, Container With Most Water, Two Sum II).',
      '**Fast & Slow Pointers**: Fast pointer scans ahead, slow pointer marks valid boundary (Remove Duplicates, Sort Colors).',
      '**Fixed Anchor + Two Pointers**: Sort array, anchor index $i$, then run two-pointer convergence on remaining elements (3Sum).'
    ],
    pitfalls: [
      'Off-by-one errors with \`while (left < right)\` vs \`while (left <= right)\`.',
      'Failing to skip duplicate elements when advancing pointers in problems requiring unique triplets/pairs (e.g. 3Sum).'
    ]
  },

  // 4. SLIDING WINDOW
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    color: '#eab308',
    tagline: 'Maintaining a dynamic contiguous subsegment over arrays or strings with O(1) state updates',
    prerequisites: ['Contiguous subarrays or substrings', 'Two pointers technique'],
    mentalModel: `Imagine looking at a panoramic landscape through a sliding camera viewfinder. Instead of re-measuring the entire scene from scratch whenever the camera moves, you simply **add the new element entering on the right** and **subtract the old element exiting on the left** ($O(1)$ incremental state update).`,
    engineMechanics: `Sliding window guarantees strict $O(N)$ runtime because each element enters the window exactly once and leaves the window at most once ($2N$ operations total), regardless of nested loops.`,
    commonPatterns: [
      '**Fixed Window**: Window length $K$ is constant. Slide right, pop left (Max Sum Subarray of size K).',
      '**Dynamic Window (Expand & Shrink)**: Expand \`right\` until condition is satisfied or violated, then contract \`left\` to restore validity (Longest Substring Without Repeating Characters, Minimum Window Substring).'
    ],
    pitfalls: [
      'Shrinking with \`if\` instead of \`while\`: when a condition can be violated by multiple characters, shrinking must occur in a while loop.',
      'Re-iterating the window content to check validity instead of maintaining frequency counts or distinct character counters incrementally.'
    ]
  },

  // 5. STACK
  {
    id: 'stack',
    name: 'Stack & Monotonic Stack',
    color: '#84cc16',
    tagline: 'LIFO evaluation and Next Greater / Smaller Element resolution in linear time',
    prerequisites: ['LIFO (Last-In, First-Out) semantics', 'Call stack intuition'],
    mentalModel: `Think of a spring-loaded plate dispenser in a cafeteria. You can only inspect or remove the top plate.

In a **Monotonic Stack**, we enforce a strict invariant: elements in the stack must always be strictly increasing or strictly decreasing. If an incoming element violates the order, we pop and resolve pending elements until the invariant holds!`,
    engineMechanics: `V8 optimizes \`array.push()\` and \`array.pop()\` to amortized $O(1)$ operations on its contiguous backing store. Monotonic stacks achieve $O(N)$ because every element is pushed once and popped at most once.`,
    commonPatterns: [
      '**Balanced Matching**: Push openers \`({\[\`, pop on closers \`)}\]\` (Valid Parentheses).',
      '**Monotonic Decreasing Stack**: Finds the Next Greater Element (Daily Temperatures, Online Stock Span).',
      '**Monotonic Increasing Stack**: Finds the Largest Area / Previous Smaller Element (Largest Rectangle in Histogram).'
    ],
    pitfalls: [
      'Popping an empty stack without bounds checking.',
      'Storing values when indices are needed: always store indices in the stack so you can compute distances and widths!'
    ]
  },

  // 6. BINARY SEARCH
  {
    id: 'binary-search',
    name: 'Binary Search',
    color: '#10b981',
    tagline: 'Logarithmic elimination of monotonic search spaces',
    prerequisites: ['Sorted sequences or monotonic decision functions $f(x)$'],
    mentalModel: `Imagine guessing a number between 1 and 100. If your friend says "Higher", you instantly eliminate 50 numbers in a single question!

Binary search is not just for searching sorted arrays; it applies to **any monotonic predicate function**: if $f(k) = \\text{true}$, then for all $x > k$, $f(x) = \\text{true}$.`,
    engineMechanics: `Reduces a search space of size $N$ to 1 in $\\log_2 N$ steps ($10^6 \\to 20$ iterations, $10^9 \\to 30$ iterations). Highly CPU cache efficient.`,
    commonPatterns: [
      '**Classic Index Search**: Find target in sorted array (Binary Search, Search in Rotated Array).',
      '**Binary Search on Answer**: Find min/max feasible value in range $[low, high]$ (Koko Eating Bananas, Capacity To Ship Packages).'
    ],
    pitfalls: [
      'Integer overflow with \`(low + high) / 2\`: in JS/TS numbers are 64-bit IEEE-754 floats, so use \`Math.floor(low + (high - low) / 2)\`.',
      'Infinite loops when \`low = mid\` with rounding: ensure clear condition updates \`low = mid + 1\` or \`high = mid - 1\`.'
    ]
  },

  // 7. LINKED LIST
  {
    id: 'linked-list',
    name: 'Linked List & Pointer Manipulation',
    color: '#06b6d4',
    tagline: 'Sequential node allocation, pointer rewiring, and cycle detection without re-indexing',
    prerequisites: ['Reference pointers in memory', 'Garbage collection reference semantics'],
    mentalModel: `Think of a **Linked List** as a treasure hunt: each clue (Node) contains a piece of treasure (Value) and a written map pointing to the location of the next clue (Next Pointer).

Unlike an array where elements are packed shoulder-to-shoulder, linked list nodes can live anywhere in the heap. Inserting or deleting an item requires merely rewiring one pointer ($O(1)$) rather than shifting thousands of neighbors!`,
    engineMechanics: `### Heap Pointer Allocation:
- Each node is an object allocated on the V8 heap holding a pointer descriptor to the next node.
- Lacks CPU cache spatial locality because nodes are not contiguous in memory.
- Pointer reversal requires careful temporary pointer retention (\`next = curr.next\`) before mutating (\`curr.next = prev\`) to prevent garbage collector disconnection.`,
    commonPatterns: [
      '**Dummy Head Pointer**: Eliminates edge cases when mutating or deleting the head node.',
      '**Floyd’s Cycle Detection (Tortoise & Hare)**: Slow pointer moves 1 step, fast pointer moves 2 steps. If a cycle exists, they must collide!',
      '**In-Place Reversal**: Iteratively reverse pointers using \`prev\`, \`curr\`, and \`next\`.',
      '**Fast and Slow for Midpoint**: Find the middle of a list in one pass to split for merge sort.'
    ],
    pitfalls: [
      'Losing references: Never reassign \`curr.next\` before saving the original reference in \`const nextNode = curr.next\`!',
      'Memory leaks: Leaving unsevered cycle references in node graphs.'
    ]
  },

  // 8. TREES
  {
    id: 'trees',
    name: 'Trees & Binary Search Trees',
    color: '#3b82f6',
    tagline: 'Hierarchical branching structures, recursive divide-and-conquer, and level-order traversals',
    prerequisites: ['Recursion and call stack frames', 'Binary Search Tree invariant (Left < Node < Right)'],
    mentalModel: `Think of a **Tree** as a corporate organizational chart: the CEO (Root) delegates tasks to Vice Presidents (Child Nodes), who in turn delegate to Directors (Leaves).

Every node is the root of its own smaller subtree. This means any tree problem can be solved by solving the identical problem on the left child and right child, then combining the results!`,
    engineMechanics: `### Call Stack & Tree Traversal:
- DFS uses the execution call stack ($O(H)$ memory where $H$ is tree height, $O(\\log N)$ balanced, $O(N)$ skewed).
- BFS uses an explicit FIFO Queue array ($O(W)$ memory where $W$ is the maximum width / diameter of the tree).
- Inorder traversal of a BST always yields values in strictly sorted ascending order.`,
    commonPatterns: [
      '**DFS Traversals**: Preorder (Root, L, R), Inorder (L, Root, R), Postorder (L, R, Root).',
      '**BFS Level Order**: Queue-based traversal processing nodes generation by generation.',
      '**Lowest Common Ancestor (LCA)**: Bottom-up propagation of matched target nodes.',
      '**BST Invariant Validation**: Verify each node satisfies $min < val < max$ recursively.'
    ],
    pitfalls: [
      'Only checking immediate child nodes in BST validation: a node in the right subtree of the root must be greater than the root, even if it is on the left of its own parent!',
      'Call stack overflow on severely skewed trees: use iterative traversal for production reliability.'
    ]
  },

  // 9. HEAP / PRIORITY QUEUE
  {
    id: 'heap',
    name: 'Heap / Priority Queue',
    color: '#6366f1',
    tagline: 'Instant O(1) access to minimum or maximum priority elements with O(log N) updates',
    prerequisites: ['Complete binary tree representation in an array', 'Parent-child index math (parent = floor((i-1)/2))'],
    mentalModel: `Think of a **Priority Queue** as an Emergency Room triage desk: patients are not treated in the order they arrived (FIFO); rather, the critically injured patient with the highest medical priority is always seen first.

A binary heap maintains this priority invariant with zero overhead by structuring tree nodes directly inside a compact array!`,
    engineMechanics: `### Array-Backed Binary Heap:
- Node at index $i$ has children at $2i + 1$ and $2i + 2$, and parent at $\\lfloor(i - 1) / 2\\rfloor$.
- \`peek()\`: $O(1)$ inspect root element at index 0.
- \`push()\`: $O(\\log N)$ append at end and bubble up (sift-up).
- \`pop()\`: $O(\\log N)$ swap root with last item, pop, and sift-down.`,
    commonPatterns: [
      '**Top K Elements**: Maintain a Min-Heap of size $K$. Any element larger than the heap top evicts the minimum ($O(N \\log K)$ time).',
      '**Two Heaps for Running Median**: Max-Heap for lower half of numbers, Min-Heap for upper half.',
      '**Task Scheduling / Merging**: Merge $K$ sorted streams by storing current heads in a Min-Heap.'
    ],
    pitfalls: [
      'Re-sorting the entire array instead of using a heap: sorting $N$ times is $O(N^2 \\log N)$; a heap maintains priority in $O(N \\log K)$!',
      'JavaScript lacks a built-in Heap: in interview environments, implement a clean 25-line binary heap or explain the contract clearly.'
    ]
  },

  // 10. BACKTRACKING
  {
    id: 'backtracking',
    name: 'Backtracking & Pruning',
    color: '#8b5cf6',
    tagline: 'Systematic exploration of combinatorial decision trees with state rollback',
    prerequisites: ['Recursion and call stack', 'State immutability vs push/pop mutation'],
    mentalModel: `Imagine exploring a dark labyrinth with a ball of yarn. At every intersection, you choose a path (Make a Choice), mark where you went, and walk forward.

If you hit a dead end or solve the riddle, you rewind the yarn and step backwards to the intersection (Backtrack / Undo Choice), and try the next corridor!`,
    engineMechanics: `### Decision Tree Exploration:
- Every level of the recursion tree represents one decision (e.g. choose element $i$, or skip element $i$).
- State is mutated before the recursive descent (\`path.push(choice)\`), and restored after returning (\`path.pop()\`), avoiding expensive array cloning on every branch.
- **Branch Pruning**: Early termination (\`if (sum > target) return\`) cuts off exponential subtrees.`,
    commonPatterns: [
      '**Subsets / Combinations**: Include vs exclude current element (Power Set).',
      '**Permutations**: Order matters; iterate all unused candidates tracking visited indices.',
      "**Grid DFS / Word Search**: Mark current cell as visited ('#'), explore 4 directions, restore cell value on backtrack.",
      '**Constraint Satisfaction**: N-Queens, Sudoku Solver.'
    ],
    pitfalls: [
      'Forgetting to create a snapshot when saving results: \`results.push(path)\` pushes a reference! When path is popped, all saved answers become empty. Always push \`results.push([...path])\`!',
      'Failing to sort before pruning duplicates: duplicate combinations require sorting to skip adjacent identical choices.'
    ]
  },

  // 11. TRIES
  {
    id: 'tries',
    name: 'Tries (Prefix Trees)',
    color: '#a855f7',
    tagline: 'Retrieval trees optimized for string prefix lookups and autocomplete systems',
    prerequisites: ['Tree nodes with character edge maps', 'String prefixes and termination markers'],
    mentalModel: `Think of a **Trie** as an indexed dictionary where all words sharing the same prefix share the same branch. 

Words like "cat", "car", and "card" all share the single root path "c" $\\to$ "a". To search for any word of length $L$, you simply walk $L$ steps down the character tree in $O(L)$ time, regardless of whether the dictionary contains 100 or 10,000,000 words!`,
    engineMechanics: `### Node Structure:
- Each node contains a map or fixed array of 26 child references (\`children[char]\`) and a boolean flag (\`isEndOfWord\`).
- Space Complexity: $O(\\Sigma \\cdot N \\cdot L)$ where $\\Sigma$ is alphabet size.
- Query Complexity: $O(L)$ strictly proportional to key length, completely independent of dataset size $N$.`,
    commonPatterns: [
      '**Autocomplete / Prefix Search**: Traverse prefix path; if reached, all descendants are matching completions.',
      "**Wildcard Matching (Regex '.')**: Use recursive DFS on matching nodes when a wildcard is encountered.",
      '**Word Search II**: Combine 2D grid backtracking with Trie traversal to prune invalid word prefixes instantly.'
    ],
    pitfalls: [
      'Forgetting the \`isEndOfWord\` marker: checking prefix existence vs full word existence are distinct operations.',
      'Allocating oversized node tables when character sets are sparse: use an ES6 \`Map()\` for children instead of fixed-length arrays if alphabet is arbitrary Unicode.'
    ]
  },

  // 12. GRAPHS
  {
    id: 'graphs',
    name: 'Graphs: BFS, DFS & Topological Sort',
    color: '#d946ef',
    tagline: 'Modeling pairwise relationships, network routing, cycle detection, and dependency ordering',
    prerequisites: ['Adjacency lists vs Adjacency matrices', 'Visited tracking to prevent infinite cycles'],
    mentalModel: `Think of a **Graph** as a social network: people are Vertices (Nodes) and friendships are Edges. Unlike trees, graphs can have loops, disconnected clusters, and multiple paths between any two people.

- **BFS (Breadth-First)** radiates outward like ripples on water, guaranteeing the **shortest unweighted path**.
- **DFS (Depth-First)** plunges down one path to its absolute conclusion before retracing its steps.`,
    engineMechanics: `### Adjacency List & Traversal Queue:
- Stored as \`Map<NodeId, NodeId[]>\` or array of lists.
- Runtime: $O(V + E)$ where $V$ is vertices and $E$ is edges.
- Auxiliary Space: $O(V)$ tracking visited sets and traversal queues.
- In Directed Acyclic Graphs (DAG), Topological Sort orders tasks such that every dependency appears before its dependent.`,
    commonPatterns: [
      '**BFS Shortest Path**: Level-by-level queue expansion for unweighted shortest path (Word Ladder, Rotting Oranges).',
      '**Connected Components & Island Counting**: Flood-fill DFS across matrix cells marking visited.',
      '**Kahn’s Algorithm (Topological Sort)**: Track in-degrees; iteratively enqueue nodes with in-degree 0 (Course Schedule).',
      '**Union-Find (Disjoint Set)**: Near $O(1)$ dynamic connectivity and cycle detection in undirected graphs.'
    ],
    pitfalls: [
      'Infinite loops on cyclic graphs: never forget to add current node to the \`visited\` set before exploring neighbors!',
      'Using shift() on JS arrays for BFS queues: \`queue.shift()\` is $O(N)$; use a two-pointer queue or index pointer for large graph BFS.'
    ]
  },

  // 13. DYNAMIC PROGRAMMING - 1D
  {
    id: 'dp-1d',
    name: '1-D Dynamic Programming',
    color: '#ec4899',
    tagline: 'Breaking complex problems into overlapping subproblems with optimal substructure',
    prerequisites: ['Recursion with memoization', 'State transition recurrence relations'],
    mentalModel: `Imagine an interviewer writes "1 + 1 + 1 + 1 + 1" on a piece of paper and asks "What does that equal?". You answer "5". 

Then they write another "+ 1" at the end and ask "What does it equal now?". You immediately answer "6". You didn't re-count the first five 1s—**you remembered the answer to the subproblem and added 1!** That is Dynamic Programming!`,
    engineMechanics: `### Memoization vs Tabulation:
- **Top-Down (Memoization)**: Recursion with cache map, allocating call stack frames $O(N)$.
- **Bottom-Up (Tabulation)**: Iterative array loop filling from base cases $dp[0], dp[1] \\dots dp[N]$.
- **Space Optimization**: When $dp[i]$ only depends on $dp[i-1]$ and $dp[i-2]$, retain only two state variables, reducing memory from $O(N)$ to $O(1)$!`,
    commonPatterns: [
      '**Fibonacci / Decision Stepping**: $dp[i] = dp[i-1] + dp[i-2]$ (Climbing Stairs, House Robber).',
      '**Min / Max Path**: $dp[i] = \\min(dp[i - c] + 1)$ (Coin Change).',
      '**Kadane’s Algorithm**: Maximum subarray sum keeping running local maximum.',
      '**Longest Increasing Subsequence**: $O(N^2)$ dynamic programming or $O(N \\log N)$ patient sorting with binary search.'
    ],
    pitfalls: [
      'Incorrect base cases (e.g. \`dp[0] = 0\` vs \`dp[0] = 1\`).',
      'Overcomplicating state representations: start with a simple plain-English question: "What does $dp[i]$ represent?".'
    ]
  },

  // 14. DYNAMIC PROGRAMMING - 2D
  {
    id: 'dp-2d',
    name: '2-D Dynamic Programming',
    color: '#f43f5e',
    tagline: 'Grid pathfinding, string alignments, and multi-constraint decision optimization',
    prerequisites: ['1-D DP foundations', '2D matrix indexing and recurrence dependencies'],
    mentalModel: `Think of **2D Dynamic Programming** as filling in a spreadsheet where each cell's value depends on its immediate neighbors (top cell, left cell, or top-left diagonal cell).

When comparing two strings (like "kitten" and "sitting"), the cell $dp[i][j]$ stores the optimal edit distance between the first $i$ characters of string 1 and first $j$ characters of string 2!`,
    engineMechanics: `### 2D Table Allocation & Rolling Arrays:
- Standard table requires $O(M \\times N)$ auxiliary heap memory.
- If row $i$ only reads from row $i - 1$, compress the table to two 1D rows (\`prevRow\` and \`currRow\`), dropping space from $O(M \\times N)$ to $O(N)$!`,
    commonPatterns: [
      '**Grid Traversal**: Unique paths or minimum path sum in a matrix ($dp[r][c] = grid[r][c] + \\min(dp[r-1][c], dp[r][c-1])$).',
      '**0/1 Knapsack**: Pick or leave item with weight constraint.',
      '**String Alignment**: Longest Common Subsequence, Edit Distance (Levenshtein).',
      '**Stock Trading with Cooldown / Fees**: State machine transitions between holding, sold, and reset states.'
    ],
    pitfalls: [
      'Row vs Column indexing confusion ($dp[row][col]$ vs $dp[x][y]$).',
      'Allocating 2D arrays with \`new Array(M).fill([])\`: every row references the exact same array in memory! Always use \`Array.from({length: M}, () => new Array(N).fill(0))\`.'
    ]
  },

  // 15. GREEDY
  {
    id: 'greedy',
    name: 'Greedy Algorithms',
    color: '#14b8a6',
    tagline: 'Making the locally optimal choice at each step to reach a global optimum',
    prerequisites: ['Greedy choice property proof', 'Sorting heuristics'],
    mentalModel: `Think of making change using standard coins (25¢, 10¢, 5¢, 1¢). To give 36¢ change with the fewest coins, you greedily take the largest coin that fits (25¢), then the next largest (10¢), then 1¢.

Greedy works when a local optimal choice never closes the door on the global optimal solution!`,
    engineMechanics: `Greedy algorithms run in $O(N)$ or $O(N \\log N)$ time (dominated by sorting). They allocate $O(1)$ extra space and run significantly faster than Dynamic Programming when greedy choice property holds.`,
    commonPatterns: [
      '**Jump Game**: Track the furthest reachable index as you traverse forward.',
      '**Gas Station**: If total gas $\\ge$ total cost, a solution exists; reset start index whenever running tank dips below 0.',
      '**Task Assignment / Activity Selection**: Sort by end time, pick earliest finishing tasks.'
    ],
    pitfalls: [
      'Assuming Greedy works when subproblems interact: for arbitrary coin denominations (e.g. coins [1, 3, 4] for amount 6), Greedy picks 4+1+1 (3 coins) while DP finds 3+3 (2 coins)!'
    ]
  },

  // 16. INTERVALS
  {
    id: 'intervals',
    name: 'Intervals & Sweep-Line',
    color: '#f59e0b',
    tagline: 'Sorting and consolidating overlapping time ranges or continuous spatial segments',
    prerequisites: ['Sorting by start time vs end time', 'Range overlap condition (startA <= endB && startB <= endA)'],
    mentalModel: `Think of booking meeting rooms in an office calendar. If meeting A is 1:00 PM – 3:00 PM and meeting B is 2:00 PM – 4:00 PM, they overlap between 2:00 PM and 3:00 PM.

By sorting all meetings chronologically by start time, overlapping meetings become immediate neighbors, allowing you to merge them in a single linear pass!`,
    engineMechanics: `Sorting intervals by start time costs $O(N \\log N)$. The subsequent sweep is $O(N)$ time and $O(1)$ auxiliary space (excluding output array).`,
    commonPatterns: [
      '**Merge Overlapping Intervals**: If \`curr.start <= prev.end\`, merge by setting \`prev.end = max(prev.end, curr.end)\`.',
      '**Insert Interval**: Insert into already sorted intervals, merging only where overlap occurs.',
      '**Meeting Rooms (Sweep-Line)**: Separate start and end times into sorted arrays to count maximum concurrent active meetings.'
    ],
    pitfalls: [
      'Sorting by end time when start time ordering is required for merging.',
      'Failing to use \`Math.max(prev.end, curr.end)\`: an interval can be completely swallowed inside a longer previous interval!'
    ]
  },

  // 17. MATH & GEOMETRY
  {
    id: 'math-geometry',
    name: 'Math & Matrix Geometry',
    color: '#64748b',
    tagline: 'Coordinate algebra, matrix transformations, and numerical algorithms',
    prerequisites: ['2D matrix row-major indexing', 'Modular arithmetic', 'Matrix transposition and reflection'],
    mentalModel: `Rotating a matrix 90 degrees clockwise without allocating extra memory sounds hard until you realize the geometric identity:
**Rotate 90° Clockwise = Transpose Matrix (swap $M[i][j]$ with $M[j][i]$) + Reverse Each Row!**

Mathematical symmetries transform complex loops into clean linear algebra operations.`,
    engineMechanics: `Operates directly on numeric values and 2D arrays with $O(1)$ auxiliary space and cache-friendly in-place element swapping.`,
    commonPatterns: [
      '**Matrix In-Place Rotation**: Transpose + Horizontal Reflection.',
      '**Spiral Matrix Traversal**: Maintain 4 boundaries (top, bottom, left, right) and shrink inward after completing each edge pass.',
      '**Fast Exponentiation (Pow(x, n))**: Halve the power each step ($x^n = (x^2)^{n/2}$) in $O(\\log N)$ time.',
      '**Greatest Common Divisor (Euclidean Algorithm)**: $\\text{gcd}(a, b) = \\text{gcd}(b, a \\pmod b)$.'
    ],
    pitfalls: [
      'Spiral matrix duplicate traversals when remaining height or width is 1.',
      'Integer overflow with power calculations: remember that $n$ can be negative (e.g. $x^{-2} = \\frac{1}{x^2}$).'
    ]
  },

  // 18. BIT MANIPULATION
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation & Bitmasks',
    color: '#8b5cf6',
    tagline: 'Hardware-level bitwise operations, XOR cancellations, and compact state representations',
    prerequisites: ['Binary representations', 'Bitwise operators (&, |, ^, ~, <<, >>)'],
    mentalModel: `Think of a 32-bit integer as an ultra-compact control panel with 32 distinct on/off light switches. 

Instead of allocating a bulky array of 32 booleans, a single integer stores all 32 states!
- The **XOR operator (\`^\`)** has a magical cancellation property: $x \\oplus x = 0$ and $x \\oplus 0 = x$. If every number appears twice except one, XORing all numbers cancels every pair, leaving the single unique number!`,
    engineMechanics: `### Bitwise Hardware Execution:
- JavaScript bitwise operators convert 64-bit floating-point numbers into 32-bit signed integers in two's complement format, execute in 1 CPU cycle, and return numbers.
- \`n & (n - 1)\`: Instantly clears the lowest set bit in $O(1)$ time (Brian Kernighan’s algorithm).`,
    commonPatterns: [
      '**Single Number (XOR)**: Accumulate XOR across all elements.',
      '**Counting Bits (Hamming Weight)**: Clear lowest set bit using \`n &= (n - 1)\` in loop.',
      '**Bitmask Subset Representation**: Represent subsets of size $N$ using integers from $0$ to $2^N - 1$.',
      '**Power of Two Check**: \`n > 0 && (n & (n - 1)) === 0\`.'
    ],
    pitfalls: [
      'JavaScript operator precedence: \`+\` and \`-\` have higher precedence than bitwise \`&\` and \`^\`! Always wrap bitwise expressions in parentheses: \`(a & 1) === 0\`.',
      'JavaScript bitwise operators treat operands as 32-bit signed integers; shift operators past 31 wrap around.'
    ]
  }
];

export const BIG_O_FOUNDATIONS = {
  title: 'Big-O Notation from First Principles',
  summary: 'How professional software engineers and technical interviewers quantify algorithmic efficiency.',
  coreComplexities: [
    { notation: 'O(1)', name: 'Constant Time', example: 'Array index access arr[i], Hash Map get/set', opsFor1000: '1 operation' },
    { notation: 'O(log N)', name: 'Logarithmic Time', example: 'Binary Search, balanced BST lookup', opsFor1000: '~10 operations' },
    { notation: 'O(N)', name: 'Linear Time', example: 'Single loop over array, linear search', opsFor1000: '1,000 operations' },
    { notation: 'O(N log N)', name: 'Linearithmic Time', example: 'Merge Sort, Quick Sort, Timsort (Array.prototype.sort)', opsFor1000: '~10,000 operations' },
    { notation: 'O(N²)', name: 'Quadratic Time', example: 'Nested loops, comparing every pair', opsFor1000: '1,000,000 operations' },
    { notation: 'O(2ⁿ)', name: 'Exponential Time', example: 'Unoptimized recursive Fibonacci, all subsets', opsFor1000: 'Unfathomable (larger than atoms in universe)' }
  ],
  goldenRules: [
    'Rule 1: Always drop constant factors (3N + 100 is O(N)).',
    'Rule 2: Drop non-dominant terms (N² + 50N + 1000 is O(N²)).',
    'Rule 3: Sequential independent blocks add: O(A + B).',
    'Rule 4: Nested loops multiply: O(A * B).',
    'Rule 5: Distinguish Auxiliary Space (extra memory you allocate) from Input Space.'
  ]
};
