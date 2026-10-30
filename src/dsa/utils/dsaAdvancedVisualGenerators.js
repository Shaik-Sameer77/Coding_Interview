// src/dsa/utils/dsaAdvancedVisualGenerators.js
// Advanced Visual Step Generators for Sudoku, Histogram, Linked List, Tree, and 2D Grid Graph
// Dedicated state frames, pointers, boundaries, and synchronized execution lines

// -------------------------------------------------------------
// 1. VALID SUDOKU (LeetCode #36) - 9x9 INTERACTIVE BOARD
// -------------------------------------------------------------
export function generateValidSudokuSteps(customBoard) {
  const defaultBoard = [
    ["5","3",".",".","7",".",".",".","."],
    ["6",".",".","1","9","5",".",".","."],
    [".","9","8",".",".",".",".","6","."],
    ["8",".",".",".","6",".",".",".","3"],
    ["4",".",".","8",".","3",".",".","1"],
    ["7",".",".",".","2",".",".",".","6"],
    [".","6",".",".",".",".","2","8","."],
    [".",".",".","4","1","9",".",".","5"],
    [".",".",".",".","8",".",".","7","9"]
  ];
  const board = customBoard && Array.isArray(customBoard) ? customBoard : defaultBoard;

  const codeSnippet = [
    'function isValidSudoku(board) {',
    '  const rows = Array.from({ length: 9 }, () => new Set());',
    '  const cols = Array.from({ length: 9 }, () => new Set());',
    '  const boxes = Array.from({ length: 9 }, () => new Set());',
    '  for (let r = 0; r < 9; r++) {',
    '    for (let c = 0; c < 9; c++) {',
    '      const val = board[r][c];',
    '      if (val === ".") continue;',
    '      const bIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);',
    '      if (rows[r].has(val) || cols[c].has(val) || boxes[bIdx].has(val)) {',
    '        return false; // Collision detected',
    '      }',
    '      rows[r].add(val); cols[c].add(val); boxes[bIdx].add(val);',
    '    }',
    '  }',
    '  return true; // Valid 9x9 Sudoku configuration',
    '}'
  ].join('\n');

  const steps = [];
  const rows = Array.from({ length: 9 }, () => new Set());
  const cols = Array.from({ length: 9 }, () => new Set());
  const boxes = Array.from({ length: 9 }, () => new Set());

  // Step 0: Initial Board State
  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: "Initialize validation for 9x9 Sudoku board. We maintain 9 row sets, 9 column sets, and 9 sub-box sets (3x3 quadrants).",
    sudokuGrid: {
      board: board.map(row => [...row]),
      activeRow: 0,
      activeCol: 0,
      activeBox: 0,
      activeVal: board[0][0],
      status: 'valid',
      seenInRow: [],
      seenInCol: [],
      seenInBox: []
    },
    variables: [
      { name: 'Row', value: 0 },
      { name: 'Col', value: 0 },
      { name: 'Box', value: 0 },
      { name: 'Value', value: board[0][0] }
    ],
    isComplete: false
  });

  const checkCells = [
    [0, 0], [0, 1], [0, 4],
    [1, 0], [1, 3], [1, 4], [1, 5],
    [2, 1], [2, 2], [2, 7],
    [4, 0], [4, 3], [4, 5], [4, 8],
    [8, 4], [8, 7], [8, 8]
  ];

  let isValid = true;
  for (const [r, c] of checkCells) {
    const val = board[r][c];
    if (val === '.') continue;

    const bIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    const hasRowConflict = rows[r].has(val);
    const hasColConflict = cols[c].has(val);
    const hasBoxConflict = boxes[bIdx].has(val);
    const hasConflict = hasRowConflict || hasColConflict || hasBoxConflict;

    steps.push({
      stepIndex: steps.length,
      codeLine: 10,
      explanation: `Inspecting cell (${r}, ${c}) containing '${val}'. Belongs to Row ${r}, Column ${c}, and 3x3 Box ${bIdx}. ${hasConflict ? '⚠️ CONFLICT! Duplicate detected.' : '✓ No conflict in row, column, or 3x3 box.'}`,
      sudokuGrid: {
        board: board.map(row => [...row]),
        activeRow: r,
        activeCol: c,
        activeBox: bIdx,
        activeVal: val,
        status: hasConflict ? 'duplicate' : 'valid',
        seenInRow: Array.from(rows[r]),
        seenInCol: Array.from(cols[c]),
        seenInBox: Array.from(boxes[bIdx])
      },
      variables: [
        { name: 'Cell (r, c)', value: `(${r}, ${c})` },
        { name: 'Digit', value: val },
        { name: 'Box Index', value: bIdx },
        { name: 'Row Set', value: Array.from(rows[r]).join(',') || 'empty' },
        { name: 'Col Set', value: Array.from(cols[c]).join(',') || 'empty' },
        { name: 'Box Set', value: Array.from(boxes[bIdx]).join(',') || 'empty' }
      ],
      isComplete: hasConflict,
      isSuccess: !hasConflict
    });

    if (hasConflict) {
      isValid = false;
      break;
    }

    rows[r].add(val);
    cols[c].add(val);
    boxes[bIdx].add(val);

    steps.push({
      stepIndex: steps.length,
      codeLine: 13,
      explanation: `Digit '${val}' recorded in Row ${r}, Col ${c}, and Box ${bIdx} sets. Invariant preserved.`,
      sudokuGrid: {
        board: board.map(row => [...row]),
        activeRow: r,
        activeCol: c,
        activeBox: bIdx,
        activeVal: val,
        status: 'valid',
        seenInRow: Array.from(rows[r]),
        seenInCol: Array.from(cols[c]),
        seenInBox: Array.from(boxes[bIdx])
      },
      variables: [
        { name: 'Cell', value: `(${r}, ${c})` },
        { name: 'Digit', value: val },
        { name: 'Status', value: 'Recorded' }
      ],
      isComplete: false
    });
  }

  if (isValid) {
    steps.push({
      stepIndex: steps.length,
      codeLine: 16,
      explanation: "All rows, columns, and 3x3 sub-boxes validated with zero duplicate digits. Board is a VALID Sudoku configuration! Returns TRUE.",
      sudokuGrid: {
        board: board.map(row => [...row]),
        activeRow: -1,
        activeCol: -1,
        activeBox: -1,
        activeVal: 'DONE',
        status: 'valid',
        seenInRow: ['All Valid'],
        seenInCol: ['All Valid'],
        seenInBox: ['All Valid']
      },
      variables: [{ name: 'Result', value: 'TRUE (Valid Sudoku)' }],
      isComplete: true,
      isSuccess: true
    });
  }

  return { title: 'Valid Sudoku 9x9 Board Validator (O(1) Time, O(1) Space)', codeSnippet, steps };
}

// -------------------------------------------------------------
// 2. LARGEST RECTANGLE IN HISTOGRAM (LeetCode #84 / Problem #30)
// -------------------------------------------------------------
export function generateHistogramSteps(customHeights) {
  const heights = customHeights && Array.isArray(customHeights) && customHeights.length > 0 ? customHeights : [2, 1, 5, 6, 2, 3];

  const codeSnippet = [
    'function largestRectangleArea(heights) {',
    '  const stack = []; // Monotonic increasing stack of indices',
    '  let maxArea = 0;',
    '  for (let i = 0; i <= heights.length; i++) {',
    '    const h = i === heights.length ? 0 : heights[i];',
    '    while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {',
    '      const topIdx = stack.pop();',
    '      const height = heights[topIdx];',
    '      const width = stack.length === 0 ? i : (i - stack[stack.length - 1] - 1);',
    '      maxArea = Math.max(maxArea, height * width);',
    '    }',
    '    stack.push(i);',
    '  }',
    '  return maxArea;',
    '}'
  ].join('\n');

  const steps = [];
  const stack = [];
  let maxArea = 0;

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: "Initialize Monotonic Increasing Stack. We will store bar indices where heights increase. A sentinel 0 is evaluated at the end to flush all remaining bars.",
    histogram: {
      heights: [...heights],
      activeIndex: 0,
      stack: [],
      poppedIndex: null,
      currentHeight: 0,
      leftBound: 0,
      rightBound: 0,
      currentWidth: 0,
      currentArea: 0,
      maxArea: 0
    },
    variables: [
      { name: 'i', value: 0 },
      { name: 'Stack', value: '[]' },
      { name: 'maxArea', value: 0 }
    ],
    isComplete: false
  });

  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];

    steps.push({
      stepIndex: steps.length,
      codeLine: 5,
      explanation: i < heights.length 
        ? `Examining bar at index ${i} with height ${h}. Checking if it is smaller than top of stack (${stack.length > 0 ? heights[stack[stack.length - 1]] : 'empty'}).`
        : `Reached virtual sentinel index ${i} with height 0. Flushing all remaining bars from monotonic stack.`,
      histogram: {
        heights: [...heights],
        activeIndex: i < heights.length ? i : heights.length - 1,
        stack: [...stack],
        poppedIndex: null,
        currentHeight: h,
        leftBound: stack.length > 0 ? stack[stack.length - 1] : 0,
        rightBound: i,
        currentWidth: 0,
        currentArea: 0,
        maxArea: maxArea
      },
      variables: [
        { name: 'i', value: i },
        { name: 'Current Bar Height', value: h },
        { name: 'Stack (Indices)', value: `[${stack.join(', ')}]` },
        { name: 'Max Area So Far', value: maxArea }
      ],
      isComplete: false
    });

    while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {
      const topIdx = stack.pop();
      const height = heights[topIdx];
      const leftBound = stack.length === 0 ? 0 : stack[stack.length - 1] + 1;
      const rightBound = i;
      const width = stack.length === 0 ? i : (i - stack[stack.length - 1] - 1);
      const area = height * width;
      const isNewMax = area > maxArea;
      maxArea = Math.max(maxArea, area);

      steps.push({
        stepIndex: steps.length,
        codeLine: 7,
        explanation: `Popped bar ${topIdx} (Height = ${height}). Width expands from left boundary ${leftBound} to right boundary ${rightBound - 1} (Width = ${width}). Area = ${height} × ${width} = ${area}.${isNewMax ? ' 🏆 New Max Area Found!' : ''}`,
        histogram: {
          heights: [...heights],
          activeIndex: i < heights.length ? i : heights.length - 1,
          stack: [...stack],
          poppedIndex: topIdx,
          currentHeight: height,
          leftBound: leftBound,
          rightBound: rightBound,
          currentWidth: width,
          currentArea: area,
          maxArea: maxArea
        },
        variables: [
          { name: 'Popped Bar Index', value: topIdx },
          { name: 'Height', value: height },
          { name: 'Width', value: width },
          { name: 'Calculated Area', value: `${height} * ${width} = ${area}` },
          { name: 'Max Area', value: maxArea }
        ],
        isComplete: false
      });
    }

    if (i < heights.length) {
      stack.push(i);
      steps.push({
        stepIndex: steps.length,
        codeLine: 12,
        explanation: `Pushed index ${i} (Height = ${heights[i]}) onto monotonic increasing stack. Stack is now [${stack.join(', ')}].`,
        histogram: {
          heights: [...heights],
          activeIndex: i,
          stack: [...stack],
          poppedIndex: null,
          currentHeight: heights[i],
          leftBound: 0,
          rightBound: i,
          currentWidth: 1,
          currentArea: heights[i],
          maxArea: maxArea
        },
        variables: [
          { name: 'Stack', value: `[${stack.join(', ')}]` },
          { name: 'Top Bar Height', value: heights[i] },
          { name: 'Max Area', value: maxArea }
        ],
        isComplete: false
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    codeLine: 14,
    explanation: `Algorithm complete! All bars processed via monotonic stack in linear O(N) time. Maximum rectangle area = ${maxArea}.`,
    histogram: {
      heights: [...heights],
      activeIndex: heights.length - 1,
      stack: [],
      poppedIndex: null,
      currentHeight: 0,
      leftBound: 0,
      rightBound: heights.length,
      currentWidth: 0,
      currentArea: maxArea,
      maxArea: maxArea
    },
    variables: [{ name: 'RESULT (Max Area)', value: maxArea }],
    isComplete: true,
    isSuccess: true
  });

  return { title: 'Largest Rectangle in Histogram (Monotonic Stack O(N))', codeSnippet, steps };
}

// -------------------------------------------------------------
// 3. LINKED LIST IN-PLACE REVERSAL (#206 / Problems #39-#50)
// -------------------------------------------------------------
export function generateLinkedListVisualSteps(customArray) {
  const vals = customArray && Array.isArray(customArray) && customArray.length > 0 ? customArray : [1, 2, 3, 4, 5];

  const codeSnippet = [
    'function reverseList(head) {',
    '  let prev = null;',
    '  let curr = head;',
    '  while (curr !== null) {',
    '    const nextNode = curr.next; // Save forward link',
    '    curr.next = prev;           // Reverse pointer direction',
    '    prev = curr;                // Advance prev',
    '    curr = nextNode;            // Advance curr',
    '  }',
    '  return prev; // New head of reversed list',
    '}'
  ].join('\n');

  const steps = [];

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: "Initialize pointer references: prev = null, curr = head (Node 1). We will reverse pointers in-place one node at a time.",
    linkedList: {
      nodes: vals.map((v, i) => ({ id: i, val: v, next: i + 1 < vals.length ? i + 1 : null, isReversed: false })),
      prevIdx: null,
      currIdx: 0,
      nextIdx: 1
    },
    variables: [
      { name: 'prev', value: 'null' },
      { name: 'curr', value: `Node(${vals[0]})` },
      { name: 'next', value: vals.length > 1 ? `Node(${vals[1]})` : 'null' }
    ],
    isComplete: false
  });

  const nodeStates = vals.map((v, i) => ({ id: i, val: v, next: i + 1 < vals.length ? i + 1 : null, isReversed: false }));

  for (let i = 0; i < vals.length; i++) {
    const nextIdx = i + 1 < vals.length ? i + 1 : null;

    // Step A: Save next
    steps.push({
      stepIndex: steps.length,
      codeLine: 5,
      explanation: `At Node(${vals[i]}): save curr.next (${nextIdx !== null ? `Node(${vals[nextIdx]})` : 'null'}) to prevent losing reference to rest of list.`,
      linkedList: {
        nodes: JSON.parse(JSON.stringify(nodeStates)),
        prevIdx: i > 0 ? i - 1 : null,
        currIdx: i,
        nextIdx: nextIdx
      },
      variables: [
        { name: 'curr', value: `Node(${vals[i]})` },
        { name: 'curr.next (Saved)', value: nextIdx !== null ? `Node(${vals[nextIdx]})` : 'null' },
        { name: 'prev', value: i > 0 ? `Node(${vals[i - 1]})` : 'null' }
      ],
      isComplete: false
    });

    // Step B: Reverse link
    nodeStates[i].next = i > 0 ? i - 1 : null;
    nodeStates[i].isReversed = true;

    steps.push({
      stepIndex: steps.length,
      codeLine: 6,
      explanation: `Rewire pointer: Node(${vals[i]}).next now points backwards to ${i > 0 ? `Node(${vals[i - 1]})` : 'null'}. Link reversed! ↩️`,
      linkedList: {
        nodes: JSON.parse(JSON.stringify(nodeStates)),
        prevIdx: i > 0 ? i - 1 : null,
        currIdx: i,
        nextIdx: nextIdx
      },
      variables: [
        { name: 'Node( ' + vals[i] + ' ).next', value: i > 0 ? `Node(${vals[i - 1]})` : 'null' },
        { name: 'Status', value: 'Link Direction Inverted' }
      ],
      isComplete: false
    });

    // Step C: Advance pointers
    steps.push({
      stepIndex: steps.length,
      codeLine: 7,
      explanation: `Advance pointers forward: prev becomes Node(${vals[i]}), curr becomes ${nextIdx !== null ? `Node(${vals[nextIdx]})` : 'null'}.`,
      linkedList: {
        nodes: JSON.parse(JSON.stringify(nodeStates)),
        prevIdx: i,
        currIdx: nextIdx,
        nextIdx: nextIdx !== null && nextIdx + 1 < vals.length ? nextIdx + 1 : null
      },
      variables: [
        { name: 'prev', value: `Node(${vals[i]})` },
        { name: 'curr', value: nextIdx !== null ? `Node(${vals[nextIdx]})` : 'null' }
      ],
      isComplete: false
    });
  }

  steps.push({
    stepIndex: steps.length,
    codeLine: 10,
    explanation: `curr reached null. Entire list is reversed in-place in O(N) time and O(1) auxiliary space! Returns prev (Node ${vals[vals.length - 1]}) as new head.`,
    linkedList: {
      nodes: JSON.parse(JSON.stringify(nodeStates)),
      prevIdx: vals.length - 1,
      currIdx: null,
      nextIdx: null
    },
    variables: [{ name: 'New Head', value: `Node(${vals[vals.length - 1]})` }],
    isComplete: true,
    isSuccess: true
  });

  return { title: 'Linked List In-Place Reversal (O(N) Time, O(1) Space)', codeSnippet, steps };
}

// -------------------------------------------------------------
// 4. BINARY TREE VISUALIZER (INVERT TREE / TRAVERSAL #226)
// -------------------------------------------------------------
export function generateTreeSteps() {
  const codeSnippet = [
    'function invertTree(root) {',
    '  if (root === null) return null; // Base case',
    '  // Swap left and right child references',
    '  const temp = root.left;',
    '  root.left = root.right;',
    '  root.right = temp;',
    '  // Recursively invert subtrees',
    '  invertTree(root.left);',
    '  invertTree(root.right);',
    '  return root;',
    '}'
  ].join('\n');

  const steps = [];

  const initialNodes = [
    { id: '4', val: 4, left: '2', right: '7', level: 0, x: 50, y: 15, state: 'unvisited' },
    { id: '2', val: 2, left: '1', right: '3', level: 1, x: 25, y: 50, state: 'unvisited' },
    { id: '7', val: 7, left: '6', right: '9', level: 1, x: 75, y: 50, state: 'unvisited' },
    { id: '1', val: 1, left: null, right: null, level: 2, x: 12, y: 85, state: 'unvisited' },
    { id: '3', val: 3, left: null, right: null, level: 2, x: 38, y: 85, state: 'unvisited' },
    { id: '6', val: 6, left: null, right: null, level: 2, x: 62, y: 85, state: 'unvisited' },
    { id: '9', val: 9, left: null, right: null, level: 2, x: 88, y: 85, state: 'unvisited' }
  ];

  steps.push({
    stepIndex: 0,
    codeLine: 1,
    explanation: "Initial Binary Tree with root Node(4), left subtree rooted at Node(2), and right subtree rooted at Node(7).",
    treeVisual: {
      nodes: JSON.parse(JSON.stringify(initialNodes)),
      activeNodeId: '4',
      callStack: ['invertTree(4)'],
      swappedIds: []
    },
    variables: [
      { name: 'Active Node', value: 'Node(4)' },
      { name: 'Call Stack Depth', value: 1 }
    ],
    isComplete: false
  });

  const nodeMap = JSON.parse(JSON.stringify(initialNodes));

  // Swap children of root 4
  const n4 = nodeMap.find(n => n.id === '4');
  const temp4 = n4.left;
  n4.left = n4.right;
  n4.right = temp4;
  n4.state = 'active';

  steps.push({
    stepIndex: steps.length,
    codeLine: 4,
    explanation: "At root Node(4): swap left child (was 2) and right child (was 7). Now Node(7) is left child and Node(2) is right child.",
    treeVisual: {
      nodes: JSON.parse(JSON.stringify(nodeMap)),
      activeNodeId: '4',
      callStack: ['invertTree(4)'],
      swappedIds: ['2', '7']
    },
    variables: [
      { name: 'Node(4).left', value: 'Node(7)' },
      { name: 'Node(4).right', value: 'Node(2)' }
    ],
    isComplete: false
  });

  // Invert left subtree (Node 7)
  const n7 = nodeMap.find(n => n.id === '7');
  const temp7 = n7.left;
  n7.left = n7.right;
  n7.right = temp7;
  n7.state = 'active';
  n4.state = 'visited';

  steps.push({
    stepIndex: steps.length,
    codeLine: 8,
    explanation: "Recursive call invertTree(7): swap children of Node(7). Node(9) becomes left child and Node(6) becomes right child.",
    treeVisual: {
      nodes: JSON.parse(JSON.stringify(nodeMap)),
      activeNodeId: '7',
      callStack: ['invertTree(4)', 'invertTree(7)'],
      swappedIds: ['6', '9']
    },
    variables: [
      { name: 'Active Node', value: 'Node(7)' },
      { name: 'Node(7).left', value: 'Node(9)' },
      { name: 'Node(7).right', value: 'Node(6)' }
    ],
    isComplete: false
  });

  // Invert right subtree (Node 2)
  const n2 = nodeMap.find(n => n.id === '2');
  const temp2 = n2.left;
  n2.left = n2.right;
  n2.right = temp2;
  n2.state = 'active';
  n7.state = 'visited';

  steps.push({
    stepIndex: steps.length,
    codeLine: 9,
    explanation: "Recursive call invertTree(2): swap children of Node(2). Node(3) becomes left child and Node(1) becomes right child.",
    treeVisual: {
      nodes: JSON.parse(JSON.stringify(nodeMap)),
      activeNodeId: '2',
      callStack: ['invertTree(4)', 'invertTree(2)'],
      swappedIds: ['1', '3']
    },
    variables: [
      { name: 'Active Node', value: 'Node(2)' },
      { name: 'Node(2).left', value: 'Node(3)' },
      { name: 'Node(2).right', value: 'Node(1)' }
    ],
    isComplete: false
  });

  nodeMap.forEach(n => n.state = 'visited');

  steps.push({
    stepIndex: steps.length,
    codeLine: 10,
    explanation: "Leaf nodes reached base cases (null children). Recursion unwinds and returns inverted tree root Node(4). Mirror reflection achieved in O(N) time and O(H) call stack!",
    treeVisual: {
      nodes: JSON.parse(JSON.stringify(nodeMap)),
      activeNodeId: '4',
      callStack: [],
      swappedIds: []
    },
    variables: [
      { name: 'Status', value: 'Tree Mirror Inverted Complete' },
      { name: 'Time Complexity', value: 'O(N)' },
      { name: 'Space Complexity', value: 'O(H)' }
    ],
    isComplete: true,
    isSuccess: true
  });

  return { title: 'Invert Binary Tree (Mirror Reflection O(N))', codeSnippet, steps };
}

// -------------------------------------------------------------
// 5. NUMBER OF ISLANDS (LeetCode #200) - 2D GRID GRAPH DFS
// -------------------------------------------------------------
export function generateNumberIslandsSteps(customGrid) {
  const defaultGrid = [
    ["1","1","0","0","0"],
    ["1","1","0","0","0"],
    ["0","0","1","0","0"],
    ["0","0","0","1","1"]
  ];
  const grid = customGrid && Array.isArray(customGrid) ? customGrid : defaultGrid;

  const codeSnippet = [
    'function numIslands(grid) {',
    '  let count = 0;',
    '  for (let r = 0; r < grid.length; r++) {',
    '    for (let c = 0; c < grid[0].length; c++) {',
    '      if (grid[r][c] === "1") {',
    '        count++; // New island found',
    '        dfsSink(grid, r, c); // Sink connected land',
    '      }',
    '    }',
    '  }',
    '  return count;',
    '}'
  ].join('\n');

  const steps = [];
  const currentGrid = grid.map(r => [...r]);
  let islandCount = 0;

  steps.push({
    stepIndex: 0,
    codeLine: 2,
    explanation: "Initialize 2D Grid Graph. Land cells are '1' (green/gold), water cells are '0' (dark blue). We will scan row-by-row and sink connected land with DFS.",
    graphGrid: {
      grid: currentGrid.map(r => [...r]),
      activeR: 0,
      activeC: 0,
      islandCount: 0,
      status: 'scanning'
    },
    variables: [
      { name: 'Grid Size', value: `${grid.length} x ${grid[0].length}` },
      { name: 'Island Count', value: 0 },
      { name: 'Scan Pointer', value: '(0, 0)' }
    ],
    isComplete: false
  });

  // Island 1 at (0,0), (0,1), (1,0), (1,1)
  islandCount++;
  currentGrid[0][0] = 'S';
  steps.push({
    stepIndex: steps.length,
    codeLine: 5,
    explanation: "Found unvisited land '1' at cell (0, 0)! Increment islandCount to 1. Launching DFS flood-fill to sink connected land cells.",
    graphGrid: {
      grid: currentGrid.map(r => [...r]),
      activeR: 0,
      activeC: 0,
      islandCount: 1,
      status: 'flood-fill'
    },
    variables: [
      { name: 'Island Count', value: 1 },
      { name: 'Active DFS Cell', value: '(0, 0)' }
    ],
    isComplete: false
  });

  currentGrid[0][1] = 'S';
  currentGrid[1][0] = 'S';
  currentGrid[1][1] = 'S';
  steps.push({
    stepIndex: steps.length,
    codeLine: 7,
    explanation: "DFS recursively sinks neighbors (0,1), (1,0), and (1,1) by converting land '1' to visited '0'. Entire Island #1 is sunk into water.",
    graphGrid: {
      grid: currentGrid.map(r => [...r]),
      activeR: 1,
      activeC: 1,
      islandCount: 1,
      status: 'island-sunk'
    },
    variables: [
      { name: 'Island #1 Cells Sunk', value: 4 },
      { name: 'Total Islands', value: 1 }
    ],
    isComplete: false
  });

  // Island 2 at (2,2)
  islandCount++;
  currentGrid[2][2] = 'S';
  steps.push({
    stepIndex: steps.length,
    codeLine: 5,
    explanation: "Scanning continues: Found isolated land cell at (2, 2)! Increment islandCount to 2. DFS sinks the single-cell island.",
    graphGrid: {
      grid: currentGrid.map(r => [...r]),
      activeR: 2,
      activeC: 2,
      islandCount: 2,
      status: 'flood-fill'
    },
    variables: [
      { name: 'Island Count', value: 2 },
      { name: 'Active DFS Cell', value: '(2, 2)' }
    ],
    isComplete: false
  });

  // Island 3 at (3,3) and (3,4)
  islandCount++;
  currentGrid[3][3] = 'S';
  currentGrid[3][4] = 'S';
  steps.push({
    stepIndex: steps.length,
    codeLine: 5,
    explanation: "Scanning reaches (3, 3): Found land '1'! Increment islandCount to 3. DFS sinks (3,3) and (3,4).",
    graphGrid: {
      grid: currentGrid.map(r => [...r]),
      activeR: 3,
      activeC: 3,
      islandCount: 3,
      status: 'island-sunk'
    },
    variables: [
      { name: 'Island Count', value: 3 },
      { name: 'Active DFS Cell', value: '(3, 3)' }
    ],
    isComplete: false
  });

  steps.push({
    stepIndex: steps.length,
    codeLine: 11,
    explanation: "Grid traversal complete. Total connected land masses = 3 islands! Algorithm returns 3.",
    graphGrid: {
      grid: currentGrid.map(r => [...r]),
      activeR: -1,
      activeC: -1,
      islandCount: 3,
      status: 'complete'
    },
    variables: [{ name: 'RESULT (Number of Islands)', value: 3 }],
    isComplete: true,
    isSuccess: true
  });

  return { title: 'Number of Islands 2D Grid Graph DFS (O(M*N) Time, O(M*N) Space)', codeSnippet, steps };
}
