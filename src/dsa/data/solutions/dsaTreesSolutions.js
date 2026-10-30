// Problems 51-65: Trees & Binary Search Trees Master Solutions
// Full Multi-Approach Solutions with JS & TS, Line-by-Line Breakdown, Dry Runs, Pitches, and Quizzes

export const TREES_SOLUTIONS = {
  // ==========================================
  // PROBLEM 51: INVERT BINARY TREE (LC #226)
  // ==========================================
  51: {
    id: 51,
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    pattern: 'Trees',
    day: 30,
    leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/',
    summary: 'Invert a binary tree in-place by swapping left and right subtrees recursively or iteratively using a queue.',
    prerequisites: ['Binary tree node structure', 'Pre-order / Post-order recursion vs BFS queue'],
    problemStatement: `Given the \`root\` of a binary tree, invert the tree, and return its root.`,
    approaches: [
      {
        name: 'Approach 1: Recursive Post-Order Inversion (Optimal)',
        badge: 'Optimal / Recursive DFS',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(H) stack',
        summary: 'Recursively invert left and right children, then swap them at each node.',
        intuition: 'At any node, swap root.left and root.right. Then recursively call invertTree on both children until null leaves are reached.',
        codeJS: `function invertTree(root) {
  if (!root) return null; // Base case

  // Swap children
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);

  return root;
}`,
        codeTS: `function invertTree(root: any): any {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
        lineByLine: [
          'Line 2: Base case: null node returns null.',
          'Line 5-7: Temporarily store root.left, invert right child into left, and invert saved left child into right.',
          'Line 9: Return inverted root.'
        ],
        dryRun: [
          { step: 1, state: 'root = 4, left = 2, right = 7', action: 'Invert 2 and 7 subtrees, swap at 4', result: '4.left = 7, 4.right = 2' },
          { step: 2, state: 'subtree at 2 (1, 3)', action: 'Swap 1 and 3', result: '2.left = 3, 2.right = 1' }
        ],
        complexityDerivation: 'Visits every node once $\\to O(N)$ time. Recursive call stack is bounded by tree height $O(H)$ ($O(\\log N)$ balanced, $O(N)$ skewed).'
      },
      {
        name: 'Approach 2: Iterative BFS Queue (Production-Grade)',
        badge: 'Production-Grade / Iterative BFS',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(W) queue',
        summary: 'Level-by-level traversal using an explicit queue, swapping children iteratively.',
        intuition: 'Avoids recursion limits on deep unbalanced trees by processing nodes in a FIFO queue.',
        codeJS: `function invertTreeBFS(root) {
  if (!root) return null;
  const queue = [root];

  while (queue.length > 0) {
    const curr = queue.shift();

    // Swap left and right
    const temp = curr.left;
    curr.left = curr.right;
    curr.right = temp;

    if (curr.left) queue.push(curr.left);
    if (curr.right) queue.push(curr.right);
  }

  return root;
}`,
        codeTS: `function invertTreeBFS(root: any): any {
  if (!root) return null;
  const queue: any[] = [root];

  while (queue.length > 0) {
    const curr = queue.shift();
    const temp = curr.left;
    curr.left = curr.right;
    curr.right = temp;

    if (curr.left) queue.push(curr.left);
    if (curr.right) queue.push(curr.right);
  }

  return root;
}`,
        lineByLine: [
          'Line 2-3: Handle null root and initialize queue with root.',
          'Line 5-6: Dequeue front node.',
          'Line 9-11: Swap curr.left and curr.right in-place.',
          'Line 13-14: Enqueue non-null children for subsequent levels.'
        ],
        dryRun: [
          { step: 1, state: 'queue = [4]', action: 'Dequeue 4, swap children (2, 7) -> (7, 2). Enqueue 7, 2', result: 'queue = [7, 2]' },
          { step: 2, state: 'queue = [7, 2]', action: 'Process 7, swap (6, 9) -> (9, 6). Process 2, swap (1, 3) -> (3, 1)', result: 'Tree fully inverted' }
        ],
        complexityDerivation: 'Processes each node once $\\to O(N)$ time. Queue holds at most the maximum width W of the tree $\\to O(W) = O(N)$ space.'
      }
    ],
    comparisonTable: [
      { approach: 'Recursive DFS', time: 'O(N)', space: 'O(H) stack', pros: 'Extremely concise (4 lines of code)', cons: 'Risk of call-stack overflow on deep skewed trees' },
      { approach: 'Iterative BFS Queue', time: 'O(N)', space: 'O(W) queue', pros: 'Zero recursion; production-safe heap memory', cons: 'Slightly more verbose' }
    ],
    interviewPitch: `**60-Second Interview Pitch for Invert Binary Tree**:
"Inverting a binary tree requires swapping the left and right children of every single node in the tree. We can accomplish this via recursive DFS or iterative BFS.

In recursive DFS, the base case is a null root. For any valid node, we recursively invert both children and swap them. This visits each node once in O(N) time and O(H) call stack space. In production environments where recursion depth could exceed call stack limits, I would implement an iterative BFS queue that swaps children level-by-level in O(N) time and O(W) space."`,
    followUps: [
      {
        question: 'What is the relationship between Invert Binary Tree and Symmetric Tree (LeetCode #101)?',
        answer: 'A tree is symmetric if it is a mirror image of itself: root.left and root.right must be mutually inverted mirrors.'
      }
    ],
    recallQuiz: {
      question: 'What is the auxiliary space complexity of recursive invertTree on a completely skewed tree?',
      options: ['O(N)', 'O(log N)', 'O(1)', 'O(N²)'],
      correctIndex: 0,
      explanation: 'On a skewed tree (like a linked list), the tree height H equals N, consuming N call stack frames!'
    }
  },

  // ==========================================
  // PROBLEM 57: LOWEST COMMON ANCESTOR OF A BST (LC #235)
  // ==========================================
  57: {
    id: 57,
    title: 'Lowest Common Ancestor of a BST',
    difficulty: 'Medium',
    pattern: 'Trees',
    day: 28,
    leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
    summary: 'Find the lowest common ancestor (LCA) node of two given nodes in a Binary Search Tree (BST) in O(H) time and O(1) space.',
    prerequisites: ['BST Property: left < root < right', 'Split point identification'],
    problemStatement: `Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.

The lowest common ancestor is defined between two nodes \`p\` and \`q\` as the lowest node in \`T\` that has both \`p\` and \`q\` as descendants (where we allow a node to be a descendant of itself).`,
    approaches: [
      {
        name: 'Approach 1: Recursive BST Traversal (Alternative)',
        badge: 'Recursive / BST Split',
        timeComplexity: 'O(H)',
        spaceComplexity: 'O(H) stack',
        summary: 'Recursively recurse left if both p and q are smaller, or right if both are larger.',
        intuition: 'Direct recursive translation of the BST split rule.',
        codeJS: `function lowestCommonAncestorRec(root, p, q) {
  if (!root) return null;
  if (p.val < root.val && q.val < root.val) return lowestCommonAncestorRec(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lowestCommonAncestorRec(root.right, p, q);
  return root;
}`,
        codeTS: `function lowestCommonAncestorRec(root: any, p: any, q: any): any {
  if (!root) return null;
  if (p.val < root.val && q.val < root.val) return lowestCommonAncestorRec(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lowestCommonAncestorRec(root.right, p, q);
  return root;
}`,
        lineByLine: [
          'Line 2-4: If both nodes are smaller or larger, recurse down left or right subtree; otherwise return root.'
        ],
        dryRun: [
          { step: 1, state: 'root=6, p=2, q=8', action: '2 < 6 and 8 > 6 -> split point', result: 'Returns root 6' }
        ],
        complexityDerivation: 'O(H) time and O(H) call stack.'
      },
      {
        name: 'Approach 2: Iterative BST Traversal (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(H)',
        spaceComplexity: 'O(1)',
        summary: 'Walk down from root. If both p and q are smaller, go left. If both are larger, go right. The first split node is the LCA.',
        intuition: 'Because of the BST invariant, if both p and q have values strictly less than root.val, their LCA must reside in the left subtree. If both are strictly greater, it must reside in the right subtree. The first node where p and q diverge (or one matches root) is the LCA!',
        codeJS: `function lowestCommonAncestor(root, p, q) {
  let curr = root;

  while (curr !== null) {
    if (p.val < curr.val && q.val < curr.val) {
      curr = curr.left;  // Both in left subtree
    } else if (p.val > curr.val && q.val > curr.val) {
      curr = curr.right; // Both in right subtree
    } else {
      // Split point found (one left, one right, or curr is p or q)
      return curr;
    }
  }

  return null;
}`,
        codeTS: `function lowestCommonAncestor(root: any, p: any, q: any): any {
  let curr = root;

  while (curr !== null) {
    if (p.val < curr.val && q.val < curr.val) {
      curr = curr.left;
    } else if (p.val > curr.val && q.val > curr.val) {
      curr = curr.right;
    } else {
      return curr;
    }
  }

  return null;
}`,
        lineByLine: [
          'Line 2: Start pointer curr at root.',
          'Line 4: Loop down the BST branches.',
          'Line 5-6: If p and q are both smaller than curr, LCA is strictly in left subtree.',
          'Line 7-8: If p and q are both greater than curr, LCA is strictly in right subtree.',
          'Line 9-12: If values diverge across curr, curr is the unique Lowest Common Ancestor.'
        ],
        dryRun: [
          { step: 1, state: 'root=6, p=2, q=8', action: '2 < 6 and 8 > 6 -> Divergence!', result: 'LCA is 6' },
          { step: 2, state: 'root=6, p=2, q=4', action: 'Both < 6 -> curr = curr.left (2)', result: 'curr = 2' },
          { step: 3, state: 'curr=2, p=2, q=4', action: 'p.val === curr.val -> Split point!', result: 'LCA is 2' }
        ],
        complexityDerivation: 'Traverses down one branch from root to LCA in O(H) time where H is height of the tree ($O(\\log N)$ average). Employs single pointer $\\to O(1)$ space.'
      }
    ],
    comparisonTable: [
      { approach: 'General Binary Tree LCA', time: 'O(N)', space: 'O(H)', pros: 'Works on arbitrary non-BST trees', cons: 'Inspects all subtrees; does not exploit BST sorting' },
      { approach: 'Iterative BST Split', time: 'O(H)', space: 'O(1)', pros: 'Optimal O(H) time and strict O(1) memory', cons: 'Relies strictly on BST ordering property' }
    ],
    interviewPitch: `**60-Second Interview Pitch for LCA of a BST**:
"In a Binary Search Tree, all values in the left subtree are strictly smaller than root, and all values in the right subtree are strictly greater. We exploit this property to find the LCA in O(H) time without inspecting the whole tree.

Starting at root, if both p and q are smaller than current node, their LCA must be in the left subtree. If both are greater, it must be in the right subtree. The very first node where p and q diverge—meaning one is smaller and one is larger, or one equals current node—is guaranteed to be the Lowest Common Ancestor. Using a simple while loop achieves O(H) time and strict O(1) auxiliary space."`,
    followUps: [
      {
        question: 'How does this differ from LCA in a general Binary Tree (LeetCode #236)?',
        answer: 'In a general binary tree without BST ordering, we must explore both left and right subtrees via recursive DFS in O(N) time and O(H) stack space.'
      }
    ],
    recallQuiz: {
      question: 'What condition indicates that current node "curr" is the Lowest Common Ancestor of p and q in a BST?',
      options: [
        'When p and q lie on opposite sides of curr, or curr equals p or q',
        'When curr.left is null',
        'When curr is a leaf node',
        'When p.val + q.val === curr.val'
      ],
      correctIndex: 0,
      explanation: 'Once the paths to p and q diverge across curr, curr is the lowest node capable of being an ancestor to both.'
    }
  },

  // ==========================================
  // PROBLEM 58: BINARY TREE LEVEL ORDER TRAVERSAL (LC #102)
  // ==========================================
  58: {
    id: 58,
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    pattern: 'Trees',
    day: 30,
    leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    summary: "Return the level order traversal of its nodes' values (i.e., from left to right, level by level) using a FIFO queue.",
    prerequisites: ['Breadth-First Search (BFS)', 'Level size snapshot technique (queue.length)'],
    problemStatement: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).`,
    approaches: [
      {
        name: 'Approach 1: BFS with Level Size Snapshot (Optimal)',
        badge: 'Optimal / BFS Queue',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(W) queue',
        summary: 'Snapshot queue.length at the start of each level loop to process all nodes of that depth before moving to the next level.',
        intuition: 'At any point, all nodes currently in the queue belong to the same level. By recording levelSize = queue.length, we can iterate exactly levelSize times to extract the current level\'s values while pushing the next level\'s children.',
        codeJS: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length; // Snapshot current level count
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}`,
        codeTS: `function levelOrder(root: any): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: any[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}`,
        lineByLine: [
          'Line 2: Base case: return empty array for null root.',
          'Line 4: Queue initialized with root node.',
          'Line 7: levelSize = queue.length freezes the number of nodes on current tier.',
          'Line 10-15: Process exactly levelSize nodes, collecting values and enqueuing children.',
          'Line 18: Add completed level array to final result.'
        ],
        dryRun: [
          { step: 1, state: 'queue = [3]', action: 'levelSize = 1 -> currentLevel = [3], enqueue 9, 20', result: 'result = [[3]], queue = [9, 20]' },
          { step: 2, state: 'queue = [9, 20]', action: 'levelSize = 2 -> currentLevel = [9, 20], enqueue 15, 7', result: 'result = [[3], [9, 20]], queue = [15, 7]' },
          { step: 3, state: 'queue = [15, 7]', action: 'levelSize = 2 -> currentLevel = [15, 7], no children', result: 'result = [[3], [9, 20], [15, 7]]' }
        ],
        complexityDerivation: 'Every node is enqueued and dequeued once $\\to O(N)$ time. Space is bounded by max width W of the tree ($O(N)$ for complete binary tree).'
      },
      {
        name: 'Approach 2: Recursive DFS with Depth Tracking',
        badge: 'Recursive / Pre-Order DFS',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(H) stack',
        summary: 'Traverse using DFS, passing level depth. Append node.val to result[depth].',
        intuition: 'If result.length === depth, create new array result.push([]). Then push node.val to result[depth].',
        codeJS: `function levelOrderDFS(root) {
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
}`,
        codeTS: `function levelOrderDFS(root: any): number[][] {
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
}`,
        lineByLine: [
          'Line 2-5: If result array has not reached depth, allocate result[depth] = [].',
          'Line 6-8: Push node.val to result[depth], recurse left and right with depth + 1.'
        ],
        dryRun: [
          { step: 1, state: 'node 3 (depth 0)', action: 'result[0] = [3]', result: 'Depth 0 populated' }
        ],
        complexityDerivation: 'Visits N nodes in O(N) time with O(H) stack space.'
      }
    ],
    comparisonTable: [
      { approach: 'Recursive DFS with Depth Parameter', time: 'O(N)', space: 'O(H) stack', pros: 'Simple recursion result[depth].push(val)', cons: 'Does not visit in actual chronological level order' },
      { approach: 'BFS Queue Snapshot', time: 'O(N)', space: 'O(W) queue', pros: 'True level-order execution; memory directly maps to breadth', cons: 'Requires FIFO queue' }
    ],
    interviewPitch: `**60-Second Interview Pitch for Level Order Traversal**:
"Level order traversal is the quintessential BFS problem on trees. To group nodes by level, the crucial technique is the 'Level Size Snapshot'.

At the start of each while loop iteration, queue.length represents the exact number of nodes on the current level. I save levelSize = queue.length and run a for loop levelSize times. In each step, I dequeue a node, add its value to the current level list, and push its non-null children onto the back of the queue. Once the inner loop finishes, I append the current level list to my result. This achieves O(N) time and O(W) space."`,
    followUps: [
      {
        question: 'How do you adapt this to Binary Tree Right Side View (LeetCode #199)?',
        answer: 'During the levelSize loop, simply record the value of the last element (i === levelSize - 1) for each level!'
      }
    ],
    recallQuiz: {
      question: 'Why is capturing "levelSize = queue.length" before the inner loop essential?',
      options: [
        'Because pushing children into the queue changes queue.length dynamically during the loop',
        'To allocate memory for the return array',
        'To sort the nodes from left to right',
        'Because JavaScript queues have a max capacity'
      ],
      correctIndex: 0,
      explanation: 'Without freezing levelSize, the for loop would continue processing newly added child nodes from the next level!'
    }
  },

  // ==========================================
  // PROBLEM 61: VALIDATE BINARY SEARCH TREE (LC #98)
  // ==========================================
  61: {
    id: 61,
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    pattern: 'Trees',
    day: 27,
    leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/',
    summary: 'Determine if a binary tree is a valid Binary Search Tree (BST) where all left descendants are strictly less and all right descendants strictly greater.',
    prerequisites: ['BST definition across ALL descendants, not just immediate children', 'Range validation (min < val < max) vs In-Order traversal monotonicity'],
    problemStatement: `Given the \`root\` of a binary tree, determine if it is a valid binary search tree (BST).

A **valid BST** is defined as follows:
- The left subtree of a node contains only nodes with keys **less than** the node\'s key.
- The right subtree of a node contains only nodes with keys **greater than** the node\'s key.
- Both the left and right subtrees must also be binary search trees.`,
    approaches: [
      {
        name: 'Approach 1: Range Bounds Propagation (Optimal)',
        badge: 'Optimal / Recursive Range DFS',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(H) stack',
        summary: 'Pass valid (min, max) range boundaries down recursively. Every node must satisfy min < node.val < max.',
        intuition: 'Checking only immediate children (root.left < root < root.right) is a beginner trap! A node in the right subtree could be smaller than a grandparent. We must propagate the allowable range (min, max) to all descendants.',
        codeJS: `function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true; // Empty subtree is valid

    // Must be strictly within allowable range
    if ((min !== null && node.val <= min) || (max !== null && node.val >= max)) {
      return false;
    }

    // Left child must be < node.val; Right child must be > node.val
    return validate(node.left, min, node.val) && 
           validate(node.right, node.val, max);
  }

  return validate(root, null, null);
}`,
        codeTS: `function isValidBST(root: any): boolean {
  function validate(node: any, min: number | null, max: number | null): boolean {
    if (!node) return true;
    if ((min !== null && node.val <= min) || (max !== null && node.val >= max)) {
      return false;
    }
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, null, null);
}`,
        lineByLine: [
          'Line 2: Recursive helper accepts node and allowed bounds (min, max).',
          'Line 3: Base case: null node is valid.',
          'Line 6-8: Verify node.val is strictly between min and max.',
          'Line 11-12: Left recursive call sets max = node.val; right call sets min = node.val.'
        ],
        dryRun: [
          { step: 1, state: 'root=5, min=null, max=null', action: 'Validate left(1, null, 5) and right(4, 5, null)', result: 'Checking subtrees' },
          { step: 2, state: 'node=4 with min=5, max=null', action: '4 <= 5 (Violates min constraint!)', result: 'Returns false immediately' }
        ],
        complexityDerivation: 'Visits each node once in O(N) time. The call stack depth is bounded by tree height $O(H)$ ($O(\\log N)$ to $O(N)$).'
      },
      {
        name: 'Approach 2: In-Order Traversal Monotonicity',
        badge: 'Alternative / In-Order Traversal',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(H) stack',
        summary: 'In-order traversal of a valid BST must visit values in strictly increasing monotonic order.',
        intuition: 'Keep track of prevVal seen during In-Order traversal (left $\\to$ root $\\to$ right). If curr.val <= prevVal, the BST is invalid.',
        codeJS: `function isValidBSTInOrder(root) {
  let prev = -Infinity;

  function inorder(node) {
    if (!node) return true;
    if (!inorder(node.left)) return false;
    if (node.val <= prev) return false;
    prev = node.val;
    return inorder(node.right);
  }

  return inorder(root);
}`,
        codeTS: `function isValidBSTInOrder(root: any): boolean {
  let prev = -Infinity;
  function inorder(node: any): boolean {
    if (!node) return true;
    if (!inorder(node.left)) return false;
    if (node.val <= prev) return false;
    prev = node.val;
    return inorder(node.right);
  }
  return inorder(root);
}`,
        lineByLine: [
          'Line 2: Track previously visited value in in-order sequence.',
          'Line 4-5: Recursively validate left subtree first.',
          'Line 6-7: Check strict monotonic increase (node.val > prev); update prev.',
          'Line 8: Validate right subtree.'
        ],
        dryRun: [
          { step: 1, state: 'Tree: 2 -> (1, 3)', action: 'inorder(1): prev = 1', result: 'valid' },
          { step: 2, state: 'inorder(2): 2 > 1', action: 'prev = 2', result: 'valid' },
          { step: 3, state: 'inorder(3): 3 > 2', action: 'prev = 3', result: 'Returns true' }
        ],
        complexityDerivation: 'Linear O(N) traversal with O(H) stack frames.'
      }
    ],
    comparisonTable: [
      { approach: 'Range Bounds Propagation', time: 'O(N)', space: 'O(H)', pros: 'Self-contained; short-circuits early', cons: 'Requires null-boundary tracking' },
      { approach: 'In-Order Traversal', time: 'O(N)', space: 'O(H)', pros: 'Directly mirrors sorted array conversion', cons: 'Requires stateful prev pointer' }
    ],
    interviewPitch: `**60-Second Interview Pitch for Validate Binary Search Tree**:
"The classic trap in Validate BST is only checking if left.val < root.val < right.val. That check misses cases where a value violates a constraint higher up the ancestor chain.

Instead, I propagate valid range boundaries (min, max) down recursively. The root starts with bounds (-Infinity, Infinity). When descending left, the upper bound becomes root.val (min, root.val). When descending right, the lower bound becomes root.val (root.val, max). Every node must strictly satisfy min < val < max. Alternatively, an In-Order traversal must produce strictly monotonically increasing values. Both approaches run in optimal O(N) time and O(H) stack space."`,
    followUps: [
      {
        question: 'What if node values can equal Number.MIN_SAFE_INTEGER or -Infinity?',
        answer: 'Use null to represent unbounded borders instead of numeric infinities, checking (min !== null && node.val <= min).'
      }
    ],
    recallQuiz: {
      question: 'Why is checking "root.left.val < root.val && root.right.val > root.val" insufficient to validate a BST?',
      options: [
        'It fails to verify that values in the right subtree are greater than all ancestors above them',
        'Because binary trees can have 3 children',
        'Because JavaScript numbers are 64-bit floats',
        'Because trees must be balanced to be validated'
      ],
      correctIndex: 0,
      explanation: "For example, in [5, 4, 6, null, null, 3, 7], 3 is in 6's left subtree (3 < 6), but 3 is less than the root 5, violating the BST property!"
    }
  }
};
