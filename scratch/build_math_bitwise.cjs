// Math & Geometry and Bit Manipulation Solutions (Problems 136 to 150)
const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/dsa/data/solutions/dsaMathBitwiseSolutions.js');

const problems = {
  136: {
    id: 136,
    title: 'Rotate Image',
    difficulty: 'Medium',
    pattern: 'Math & Geometry',
    day: 81,
    leetcodeUrl: 'https://leetcode.com/problems/rotate-image/',
    summary: 'Rotate an n x n 2D matrix representing an image by 90 degrees clockwise in-place.',
    prerequisites: ['Transpose matrix (swap across diagonal)', 'Reverse rows horizontally'],
    problemStatement: `You are given an \`n x n\` 2D \`matrix\` representing an image, rotate the image by **90 degrees (clockwise)** in-place. You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix.`,
    approaches: [
      {
        name: 'Approach 1: Transpose then Reverse Rows (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        summary: 'Transpose the matrix across main diagonal, then reverse each row horizontally.',
        intuition: 'Rotating 90 degrees clockwise is mathematically equivalent to reflection across main diagonal followed by reflection across vertical midline.',
        codeJS: `function rotate(matrix) {
  const n = matrix.length;

  // Step 1: Transpose matrix (swap matrix[i][j] with matrix[j][i])
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }

  // Step 2: Reverse each row horizontally
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}`,
        codeTS: `function rotate(matrix: number[][]): void {
  const n = matrix.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }

  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}`,
        lineByLine: [
          'Line 5-11: Transpose: iterate upper triangle (j = i + 1 to n) and swap elements across main diagonal.',
          'Line 14-16: Reverse each row horizontally, completing 90-degree clockwise rotation in-place.'
        ],
        dryRun: [
          { step: 1, state: '[[1,2,3],[4,5,6],[7,8,9]]', action: 'Transpose -> [[1,4,7],[2,5,8],[3,6,9]]', result: 'rows become cols' },
          { step: 2, state: 'Reverse rows', action: '[1,4,7] -> [7,4,1]; [2,5,8] -> [8,5,2]; [3,6,9] -> [9,6,3]', result: 'Rotated 90 degrees' }
        ],
        complexityDerivation: 'Transpose visits N^2 / 2 elements; reverse visits N^2 / 2 elements -> O(N^2) time and strictly O(1) space.'
      },
      {
        name: 'Approach 2: Four-Cell Cyclic Swap (Alternative Optimal)',
        badge: 'Alternative / Cyclic Rings',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        summary: 'Rotate elements in concentric square rings four cells at a time.',
        intuition: 'Rotate elements directly in groups of 4: top -> right, right -> bottom, bottom -> left, left -> top.',
        codeJS: `function rotateCyclic(matrix) {
  let l = 0, r = matrix.length - 1;

  while (l < r) {
    for (let i = 0; i < r - l; i++) {
      const top = l, bottom = r;
      const topLeft = matrix[top][l + i];

      // bottom-left into top-left
      matrix[top][l + i] = matrix[bottom - i][l];
      // bottom-right into bottom-left
      matrix[bottom - i][l] = matrix[bottom][r - i];
      // top-right into bottom-right
      matrix[bottom][r - i] = matrix[top + i][r];
      // top-left into top-right
      matrix[top + i][r] = topLeft;
    }
    l++;
    r--;
  }
}`,
        codeTS: `function rotateCyclic(matrix: number[][]): void {
  let l = 0, r = matrix.length - 1;

  while (l < r) {
    for (let i = 0; i < r - l; i++) {
      const top = l, bottom = r;
      const topLeft = matrix[top][l + i];

      matrix[top][l + i] = matrix[bottom - i][l];
      matrix[bottom - i][l] = matrix[bottom][r - i];
      matrix[bottom][r - i] = matrix[top + i][r];
      matrix[top + i][r] = topLeft;
    }
    l++;
    r--;
  }
}`,
        lineByLine: [
          'Line 2: l and r define the active concentric outer ring.',
          'Line 4-16: Perform 4-way rotation for each element i along the ring edge.',
          'Line 17-18: Contract boundaries to inner concentric ring.'
        ],
        dryRun: [
          { step: 1, state: 'Ring 0: outer edge elements', action: 'Rotates 4 corners simultaneously', result: 'Ring 0 rotated' },
          { step: 2, state: 'l=1, r=1 (center 1x1)', action: 'center remains unchanged', result: 'Completed' }
        ],
        complexityDerivation: 'Each of the N^2 cells is touched once -> O(N^2) time with O(1) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Transpose + Reverse Rows', time: 'O(N²)', space: 'O(1)', pros: 'Extremely clean, bug-free, and easy to memorize under pressure', cons: 'Two passes over matrix' },
      { approach: 'Four-Way Cyclic Swap', time: 'O(N²)', space: 'O(1)', pros: 'Single pass in-place swap', cons: 'Error-prone 4-corner index arithmetic' }
    ],
    interviewPitch: 'Rotate Image requires modifying an n x n matrix 90 degrees clockwise in-place with O(1) extra memory. The most elegant mathematical decomposition is: Transpose the matrix, then Reverse each row horizontally. In the first step, we swap matrix[i][j] with matrix[j][i] across the main diagonal. In the second step, we reverse each row. This geometrically achieves a 90-degree clockwise rotation in O(N^2) time and strictly O(1) auxiliary space.',
    followUps: [{ question: 'How would you rotate 90 degrees counter-clockwise?', answer: 'Reverse each row first, then transpose the matrix (or transpose across the anti-diagonal).' }],
    recallQuiz: {
      question: 'Which sequence of two geometric transformations rotates a matrix 90 degrees clockwise?',
      options: ['Transpose across the main diagonal followed by reversing each row', 'Reverse rows followed by reversing columns', 'Inverting all signs followed by transposition', 'Sorting rows followed by sorting columns'],
      correctIndex: 0,
      explanation: 'Reflection over the diagonal (transpose: (i, j) -> (j, i)) followed by reflection over vertical axis ((j, i) -> (j, n - 1 - i)) rotates the plane by 90 degrees.'
    }
  },

  137: {
    id: 137,
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    pattern: 'Math & Geometry',
    day: 81,
    leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/',
    summary: 'Given an m x n matrix, return all elements of the matrix in spiral order.',
    prerequisites: ['Four boundary pointers [top, bottom, left, right]', 'Boundary contraction and parity check'],
    problemStatement: `Given an \`m x n\` \`matrix\`, return all elements of the \`matrix\` in spiral order.`,
    approaches: [
      {
        name: 'Approach 1: Four Boundary Pointers (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(1)',
        summary: 'Maintain top, bottom, left, right bounds; traverse perimeter and contract boundaries inward.',
        intuition: 'Traverse right along top, down along right, left along bottom, and up along left, shrinking bounds after each pass.',
        codeJS: `function spiralOrder(matrix) {
  const res = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    // 1. Traverse Right along top boundary
    for (let c = left; c <= right; c++) {
      res.push(matrix[top][c]);
    }
    top++;

    // 2. Traverse Down along right boundary
    for (let r = top; r <= bottom; r++) {
      res.push(matrix[r][right]);
    }
    right--;

    // 3. Traverse Left along bottom boundary (if rows remain)
    if (top <= bottom) {
      for (let c = right; c >= left; c--) {
        res.push(matrix[bottom][c]);
      }
      bottom--;
    }

    // 4. Traverse Up along left boundary (if cols remain)
    if (left <= right) {
      for (let r = bottom; r >= top; r--) {
        res.push(matrix[r][left]);
      }
      left++;
    }
  }

  return res;
}`,
        codeTS: `function spiralOrder(matrix: number[][]): number[] {
  const res: number[] = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) {
      res.push(matrix[top][c]);
    }
    top++;

    for (let r = top; r <= bottom; r++) {
      res.push(matrix[r][right]);
    }
    right--;

    if (top <= bottom) {
      for (let c = right; c >= left; c--) {
        res.push(matrix[bottom][c]);
      }
      bottom--;
    }

    if (left <= right) {
      for (let r = bottom; r >= top; r--) {
        res.push(matrix[r][left]);
      }
      left++;
    }
  }

  return res;
}`,
        lineByLine: [
          'Line 3-6: Four boundary pointers initialized to grid limits.',
          'Line 8: Loop while valid rect remains (top <= bottom && left <= right).',
          'Line 10-13: Move right along top row, then increment top.',
          'Line 16-19: Move down along right col, then decrement right.',
          'Line 22-27: Critical: Check top <= bottom before moving left to prevent duplicate row traversal.',
          'Line 30-35: Critical: Check left <= right before moving up to prevent duplicate column traversal.'
        ],
        dryRun: [
          { step: 1, state: '3x3 matrix', action: 'top=0: [1,2,3], right=2: [6,9], bot=2: [8,7], left=0: [4]', result: 'outer perimeter' },
          { step: 2, state: 'center cell', action: 'top=1, bot=1, left=1, right=1: [5]', result: 'Returns [1,2,3,6,9,8,7,4,5]' }
        ],
        complexityDerivation: 'Visits every cell in M x N grid exactly once -> O(M * N) time with O(1) auxiliary space.'
      },
      {
        name: 'Approach 2: Direction Vectors with Visited Grid (Baseline)',
        badge: 'Baseline / Simulation',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N)',
        summary: 'Simulate robot walking in directions [right, down, left, up], turning when hitting wall or visited cell.',
        intuition: 'Explicitly trace coordinates with direction index (d + 1) % 4 and visited boolean matrix.',
        codeJS: `function spiralOrderVisited(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  const res = [];
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let r = 0, c = 0, d = 0;

  for (let i = 0; i < m * n; i++) {
    res.push(matrix[r][c]);
    visited[r][c] = true;
    const nr = r + dirs[d][0], nc = c + dirs[d][1];
    if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
      r = nr; c = nc;
    } else {
      d = (d + 1) % 4;
      r += dirs[d][0];
      c += dirs[d][1];
    }
  }
  return res;
}`,
        codeTS: `function spiralOrderVisited(matrix: number[][]): number[] {
  const m = matrix.length, n = matrix[0].length;
  const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
  const res: number[] = [];
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let r = 0, c = 0, d = 0;

  for (let i = 0; i < m * n; i++) {
    res.push(matrix[r][c]);
    visited[r][c] = true;
    const nr = r + dirs[d][0], nc = c + dirs[d][1];
    if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
      r = nr; c = nc;
    } else {
      d = (d + 1) % 4;
      r += dirs[d][0];
      c += dirs[d][1];
    }
  }
  return res;
}`,
        lineByLine: [
          'Line 3: M x N boolean visited matrix.',
          'Line 5: Directions array for right, down, left, up.',
          'Line 8-17: Move forward; turn 90 degrees if hitting edge or already visited cell.'
        ],
        dryRun: [
          { step: 1, state: 'Simulates step-by-step walking', action: 'Rotates direction vector', result: 'Returns spiral order' }
        ],
        complexityDerivation: 'M * N steps -> O(M * N) time and O(M * N) visited matrix memory.'
      }
    ],
    comparisonTable: [
      { approach: 'Four Boundary Pointers', time: 'O(M * N)', space: 'O(1)', pros: 'Zero memory overhead, optimal cache performance', cons: 'Must check if (top <= bottom) before bottom row' },
      { approach: 'Direction Vector Simulation', time: 'O(M * N)', space: 'O(M * N)', pros: 'Generic robot movement paradigm', cons: 'Allocates M x N matrix for visited tracking' }
    ],
    interviewPitch: 'Spiral Matrix is best solved using Four Boundary Pointers: top, bottom, left, and right. In each cycle: we traverse right along the top row (then top++), down along the right column (then right--), left along the bottom row (then bottom--), and up along the left column (then left++). Crucially, before traversing left and up, we must verify that top <= bottom and left <= right to prevent duplicate traversals of single remaining rows or columns. This runs in optimal O(M * N) time and O(1) auxiliary space.',
    followUps: [{ question: 'What is the most common bug candidates write in this problem?', answer: 'Forgetting to check if (top <= bottom) before traversing left, and if (left <= right) before traversing up, which prints duplicate elements in non-square matrices!' }],
    recallQuiz: {
      question: 'Why are the boundary checks `if (top <= bottom)` and `if (left <= right)` required before the bottom and left passes?',
      options: ['Because top++ and right-- might have inverted the boundaries, causing duplicate traversal of single-row or single-column matrices', 'Because matrices must be square', 'Because numbers can be negative', 'To prevent integer overflow'],
      correctIndex: 0,
      explanation: 'In a 1xN or Nx1 matrix, advancing top or right can make top > bottom, causing the bottom loop to scan the already processed row in reverse.'
    }
  },

  138: {
    id: 138,
    title: 'Set Matrix Zeroes',
    difficulty: 'Medium',
    pattern: 'Math & Geometry',
    day: 82,
    leetcodeUrl: 'https://leetcode.com/problems/set-matrix-zeroes/',
    summary: 'Given an m x n integer matrix, if an element is 0, set its entire row and column to 0\'s in-place.',
    prerequisites: ['O(1) space in-place marker reuse', 'First row & column flag storage'],
    problemStatement: `Given an \`m x n\` integer matrix \`matrix\`, if an element is \`0\`, set its entire row and column to \`0\`'s. You must do it **in place**.`,
    approaches: [
      {
        name: 'Approach 1: First Row & Column as Marker Storage (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(1)',
        summary: 'Use first row and column as flags, with a single boolean flag for row 0.',
        intuition: 'Instead of allocating extra row/column arrays, reuse matrix[0][c] and matrix[r][0] to record zeroes.',
        codeJS: `function setZeroes(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  let firstRowHasZero = false;

  // Determine if first row has zeroes
  for (let c = 0; c < n; c++) {
    if (matrix[0][c] === 0) firstRowHasZero = true;
  }

  // Use first row and column as markers
  for (let r = 1; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c] === 0) {
        matrix[0][c] = 0;
        matrix[r][0] = 0;
      }
    }
  }

  // Zero out cells based on markers
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) {
        matrix[r][c] = 0;
      }
    }
  }

  // Zero out first column if matrix[0][0] is 0
  if (matrix[0][0] === 0) {
    for (let r = 0; r < m; r++) matrix[r][0] = 0;
  }

  // Zero out first row if needed
  if (firstRowHasZero) {
    for (let c = 0; c < n; c++) matrix[0][c] = 0;
  }
}`,
        codeTS: `function setZeroes(matrix: number[][]): void {
  const m = matrix.length;
  const n = matrix[0].length;
  let firstRowHasZero = false;

  for (let c = 0; c < n; c++) {
    if (matrix[0][c] === 0) firstRowHasZero = true;
  }

  for (let r = 1; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c] === 0) {
        matrix[0][c] = 0;
        matrix[r][0] = 0;
      }
    }
  }

  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) {
        matrix[r][c] = 0;
      }
    }
  }

  if (matrix[0][0] === 0) {
    for (let r = 0; r < m; r++) matrix[r][0] = 0;
  }

  if (firstRowHasZero) {
    for (let c = 0; c < n; c++) matrix[0][c] = 0;
  }
}`,
        lineByLine: [
          'Line 4: firstRowHasZero stores whether row 0 originally had a zero.',
          'Line 11-19: For cells in rows 1..m-1, if matrix[r][c] === 0, mark matrix[r][0] = 0 and matrix[0][c] = 0.',
          'Line 21-27: Set cells in inner grid (r>=1, c>=1) to 0 if their row or col marker is 0.',
          'Line 30-37: Handle first column and first row markers.'
        ],
        dryRun: [
          { step: 1, state: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', action: 'matrix[1][1]===0 -> matrix[1][0]=0, matrix[0][1]=0', result: 'markers placed' },
          { step: 2, state: 'Inner grid updated', action: 'row 1 and col 1 become 0', result: '[[1,0,1],[0,0,0],[1,0,1]]' }
        ],
        complexityDerivation: 'Two linear passes over M x N grid -> O(M * N) time and strictly O(1) space.'
      },
      {
        name: 'Approach 2: Separate Row & Column Flag Sets (Baseline)',
        badge: 'Baseline / O(M + N) Space',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M + N)',
        summary: 'Track zeroed rows and zeroed columns in two Sets.',
        intuition: 'Store row indices in zeroRows Set and col indices in zeroCols Set.',
        codeJS: `function setZeroesSets(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const zeroRows = new Set(), zeroCols = new Set();

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c] === 0) {
        zeroRows.add(r);
        zeroCols.add(c);
      }
    }
  }

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (zeroRows.has(r) || zeroCols.has(c)) {
        matrix[r][c] = 0;
      }
    }
  }
}`,
        codeTS: `function setZeroesSets(matrix: number[][]): void {
  const m = matrix.length, n = matrix[0].length;
  const zeroRows = new Set<number>(), zeroCols = new Set<number>();

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c] === 0) {
        zeroRows.add(r);
        zeroCols.add(c);
      }
    }
  }

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (zeroRows.has(r) || zeroCols.has(c)) {
        matrix[r][c] = 0;
      }
    }
  }
}`,
        lineByLine: [
          'Line 2-3: Allocate two Sets for rows and columns.',
          'Line 5-11: First pass records rows and cols containing zeroes.',
          'Line 13-19: Second pass sets cell to 0 if its row or col is in sets.'
        ],
        dryRun: [
          { step: 1, state: 'zeroRows={1}, zeroCols={1}', action: 'Sets row 1 and col 1 to zeroes', result: 'Correct output in O(M+N) space' }
        ],
        complexityDerivation: 'O(M * N) time with O(M + N) space for the two sets.'
      }
    ],
    comparisonTable: [
      { approach: 'Marker Storage In-Place', time: 'O(M * N)', space: 'O(1)', pros: 'Meets strict interview O(1) space constraint', cons: 'Complex order of operations for first row/col' },
      { approach: 'Two Sets', time: 'O(M * N)', space: 'O(M + N)', pros: 'Extremely simple to write', cons: 'Fails O(1) space interview requirement' }
    ],
    interviewPitch: 'While an O(M + N) space solution uses two sets to track zeroed rows and columns, the follow-up mandates O(1) space. We achieve this by reusing the first row and first column of the matrix itself as our marker storage. matrix[0][c] flags whether column c should be zeroed, and matrix[r][0] flags whether row r should be zeroed. Because matrix[0][0] overlaps, we store whether the first row originally had a zero in a single boolean variable firstRowHasZero. After marking the inner grid, we fill the zeroes and finally handle the first row and column. This runs in O(M * N) time and strictly O(1) space.',
    followUps: [{ question: 'Why does matrix[0][0] require special handling?', answer: 'matrix[0][0] represents both row 0 and column 0. Using a separate boolean variable for row 0 disambiguates them without memory overhead.' }],
    recallQuiz: {
      question: 'Why can we safely use the first row and first column as marker flags?',
      options: ['Because once an element in row r or col c is zero, the entire row/col will be zeroed anyway, so overwriting its header causes no information loss', 'Because matrix[0][0] is always zero', 'Because numbers are positive', 'Because matrix is square'],
      correctIndex: 0,
      explanation: 'Overwriting the header element only records that the line will become all zeroes, which is the required final state.'
    }
  },

  139: {
    id: 139,
    title: 'Happy Number',
    difficulty: 'Easy',
    pattern: 'Math & Geometry',
    day: 82,
    leetcodeUrl: 'https://leetcode.com/problems/happy-number/',
    summary: 'Determine if a number n is happy: repeatedly replace number with sum of squares of its digits until 1 or cycle.',
    prerequisites: ['Floyd\'s Tortoise and Hare cycle detection', 'Digit extraction by modulo 10'],
    problemStatement: `A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits. Repeat the process until the number equals 1, or it loops endlessly in a cycle which does not include 1. Return \`true\` if \`n\` is a happy number, and \`false\` if not.`,
    approaches: [
      {
        name: 'Approach 1: Floyd\'s Cycle Detection (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        summary: 'Slow pointer advances 1 step, fast pointer advances 2 steps until they meet or reach 1.',
        intuition: 'The process forms an implicit linked list. It either reaches 1 (happy) or enters a cycle. Floyd\'s Tortoise and Hare detects the cycle in O(1) space.',
        codeJS: `function isHappy(n) {
  function getNext(num) {
    let sum = 0;
    while (num > 0) {
      const digit = num % 10;
      sum += digit * digit;
      num = Math.floor(num / 10);
    }
    return sum;
  }

  let slow = n;
  let fast = getNext(n);

  while (fast !== 1 && slow !== fast) {
    slow = getNext(slow);
    fast = getNext(getNext(fast));
  }

  return fast === 1;
}`,
        codeTS: `function isHappy(n: number): number | boolean {
  function getNext(num: number): number {
    let sum = 0;
    while (num > 0) {
      const digit = num % 10;
      sum += digit * digit;
      num = Math.floor(num / 10);
    }
    return sum;
  }

  let slow = n;
  let fast = getNext(n);

  while (fast !== 1 && slow !== fast) {
    slow = getNext(slow);
    fast = getNext(getNext(fast));
  }

  return fast === 1;
}`,
        lineByLine: [
          'Line 2-10: Helper getNext extracts digits using modulo 10 and sums their squares.',
          'Line 12-13: slow starts at n, fast starts at getNext(n).',
          'Line 15-18: Advance slow by 1 step, fast by 2 steps while fast !== 1 and pointers do not meet.',
          'Line 20: If fast reached 1, n is happy; if pointers met in a cycle without 1, it is unhappy.'
        ],
        dryRun: [
          { step: 1, state: 'n=19', action: '1^2 + 9^2 = 82', result: 'next = 82' },
          { step: 2, state: '82', action: '8^2 + 2^2 = 68', result: 'next = 68' },
          { step: 3, state: '68 -> 100 -> 1', action: 'fast reaches 1', result: 'Returns true' }
        ],
        complexityDerivation: 'The number of digits drops logarithmically -> O(log N) operations with strictly O(1) auxiliary space.'
      },
      {
        name: 'Approach 2: Hash Set for Cycle Detection (Baseline)',
        badge: 'Baseline / Hash Set',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(log N)',
        summary: 'Record visited numbers in a Set; return false if a number repeats.',
        intuition: 'Store each generated sum; if sum is already in set, we are in an infinite cycle.',
        codeJS: `function isHappySet(n) {
  const seen = new Set();
  const getNext = (num) => {
    let s = 0;
    while (num > 0) {
      const d = num % 10;
      s += d * d;
      num = Math.floor(num / 10);
    }
    return s;
  };

  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    n = getNext(n);
  }

  return n === 1;
}`,
        codeTS: `function isHappySet(n: number): boolean {
  const seen = new Set<number>();
  const getNext = (num: number): number => {
    let s = 0;
    while (num > 0) {
      const d = num % 10;
      s += d * d;
      num = Math.floor(num / 10);
    }
    return s;
  };

  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    n = getNext(n);
  }

  return n === 1;
}`,
        lineByLine: [
          'Line 2: Set stores visited numbers.',
          'Line 12-15: Continue while n !== 1 and not repeated in set.'
        ],
        dryRun: [
          { step: 1, state: 'n = 2: 4, 16, 37, 58, 89, 145, 42, 20, 4 (repeated!)', action: 'Seen.has(4)', result: 'Returns false' }
        ],
        complexityDerivation: 'O(log N) steps with O(log N) set space.'
      }
    ],
    comparisonTable: [
      { approach: 'Floyd\'s Tortoise and Hare', time: 'O(log N)', space: 'O(1)', pros: 'Zero auxiliary memory allocations, optimal', cons: 'Calculates fast twice per step' },
      { approach: 'Hash Set', time: 'O(log N)', space: 'O(log N)', pros: 'Simple logic', cons: 'Allocates Set memory' }
    ],
    interviewPitch: 'Happy Number is equivalent to detecting a cycle in an implicit singly-linked list where each node points to the sum of the squares of its digits. The sequence either reaches 1 (happy) or loops in an unhappy cycle (like 4 -> 16 -> 37 -> ... -> 4). While a Hash Set detects this in O(log N) space, we optimize to O(1) space using Floyd\'s Tortoise and Hare cycle detection. Slow moves 1 step and fast moves 2 steps. If fast hits 1, the number is happy; if slow and fast collide before 1, an unhappy cycle exists. This runs in O(log N) time and O(1) space.',
    followUps: [{ question: 'What is the unhappy cycle for base 10 numbers?', answer: 'Any unhappy number eventually falls into the 8-node cycle: 4 -> 16 -> 37 -> 58 -> 89 -> 145 -> 42 -> 20 -> 4.' }],
    recallQuiz: {
      question: 'Why can the sum of squares of digits never grow to infinity?',
      options: ['Because for large numbers, the sum of squares of digits is strictly smaller than the number itself (e.g. 999 -> 243)', 'Because numbers cannot exceed 2^31 - 1', 'Because digits are primes', 'Because 1 is the upper bound'],
      correctIndex: 0,
      explanation: 'A 4-digit number has max sum 4 * 81 = 324 < 1000. Numbers strictly shrink and bound within small values, guaranteeing a finite cycle or 1.'
    }
  },

  140: {
    id: 140,
    title: 'Plus One',
    difficulty: 'Easy',
    pattern: 'Math & Geometry',
    day: 83,
    leetcodeUrl: 'https://leetcode.com/problems/plus-one/',
    summary: 'Increment a large integer represented as an integer array of digits by one.',
    prerequisites: ['Right-to-left addition', 'Carry propagation'],
    problemStatement: `You are given a large integer represented as an integer array \`digits\`, where each \`digits[i]\` is the \`i-th\` digit of the integer. Increment the large integer by one and return the resulting array of digits.`,
    approaches: [
      {
        name: 'Approach 1: In-Place Carry Propagation (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Walk right to left: if digit < 9, increment and return; if 9, set to 0. Prepend 1 if carry overflows.',
        intuition: 'Adding 1 to any digit < 9 finishes the operation immediately! Only a 9 rolls over to 0 with carry 1.',
        codeJS: `function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits; // Early return, no more carry!
    }
    digits[i] = 0; // 9 + 1 = 10, write 0 and propagate carry
  }

  // If all digits were 9 (e.g. 999 -> 000), prepend 1 -> 1000
  digits.unshift(1);
  return digits;
}`,
        codeTS: `function plusOne(digits: number[]): number[] {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }

  digits.unshift(1);
  return digits;
}`,
        lineByLine: [
          'Line 2: Walk backwards from least significant digit.',
          'Line 3-6: If digit < 9, increment it and return immediately. Carry is absorbed.',
          'Line 7: If digit was 9, set to 0 and loop continues to propagate carry to the left.',
          'Line 11-12: If loop finishes, all digits were 9 (e.g. [9, 9] -> [0, 0]); prepend 1 to form [1, 0, 0].'
        ],
        dryRun: [
          { step: 1, state: 'digits = [1, 2, 9]', action: 'i=2 (9): becomes 0', result: '[1, 2, 0]' },
          { step: 2, state: 'i=1 (2 < 9)', action: '2 becomes 3, returns immediately', result: 'Returns [1, 3, 0]' }
        ],
        complexityDerivation: 'Best case O(1) when last digit < 9; worst case O(N) when all 9s -> O(N) time and O(1) auxiliary space.'
      },
      {
        name: 'Approach 2: BigInt Conversion (Alternative)',
        badge: 'Alternative / Native BigInt',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Convert digits array to BigInt string, add 1n, and convert back.',
        intuition: 'Leverages ES2020 BigInt arbitrary precision integers.',
        codeJS: `function plusOneBigInt(digits) {
  const str = digits.join('');
  const big = BigInt(str) + 1n;
  return big.toString().split('').map(Number);
}`,
        codeTS: `function plusOneBigInt(digits: number[]): number[] {
  const str = digits.join('');
  const big = BigInt(str) + 1n;
  return big.toString().split('').map(Number);
}`,
        lineByLine: [
          'Line 2: Join array to numeric string.',
          'Line 3: Convert to BigInt and add 1n.',
          'Line 4: Convert back to string and map to digits array.'
        ],
        dryRun: [
          { step: 1, state: 'digits=[9,9]', action: 'BigInt("99") + 1n = 100n', result: '[1, 0, 0]' }
        ],
        complexityDerivation: 'String creation and parsing takes O(N) time and O(N) memory.'
      }
    ],
    comparisonTable: [
      { approach: 'In-Place Carry Loop', time: 'O(N)', space: 'O(1)', pros: 'Optimal constant memory, early return on non-9s', cons: 'Requires unshift when all 9s' },
      { approach: 'BigInt Conversion', time: 'O(N)', space: 'O(N)', pros: 'Concise syntax', cons: 'Heavy string allocations, rejected in interviews' }
    ],
    interviewPitch: 'We traverse the digits array backwards from the least significant digit. If a digit is less than 9, we simply increment it by 1 and return the array immediately, because no carry remains. If the digit is 9, it becomes 0 and the carry propagates leftward. If the loop completes, it means every digit was 9 (e.g., 999 becomes 000); we prepend 1 to the beginning of the array to get 1000. This runs in O(N) worst-case time, O(1) best-case time, and O(1) auxiliary space.',
    followUps: [{ question: 'Why is `digits.unshift(1)` acceptable here?', answer: 'It only occurs once when every single digit in the input is 9; in all other cases, the function exits in O(1) time without any array reallocation.' }],
    recallQuiz: {
      question: 'When can plusOne return immediately in O(1) time?',
      options: ['When the last digit is strictly less than 9', 'When the first digit is 1', 'When array length is even', 'When all digits are zero'],
      correctIndex: 0,
      explanation: 'If the last digit is between 0 and 8, adding 1 produces no carry, completing the operation in a single step.'
    }
  },

  141: {
    id: 141,
    title: 'Pow(x, n)',
    difficulty: 'Medium',
    pattern: 'Math & Geometry',
    day: 83,
    leetcodeUrl: 'https://leetcode.com/problems/powx-n/',
    summary: 'Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).',
    prerequisites: ['Fast Exponentiation by Squaring', 'Handling negative exponents and integer overflow'],
    problemStatement: `Implement \`pow(x, n)\`, which calculates \`x\` raised to the power \`n\` (i.e., \`x^n\`).`,
    approaches: [
      {
        name: 'Approach 1: Binary Exponentiation by Squaring (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        summary: 'If power is odd: res *= x. Square the base (x = x * x) and halve the power (n = n >> 1).',
        intuition: 'x^n = (x^2)^(n/2) for even n, and x * x^(n-1) for odd n. This reduces exponent by half each step.',
        codeJS: `function myPow(x, n) {
  if (n === 0) return 1;
  let N = n;
  if (N < 0) {
    x = 1 / x;
    N = -N;
  }

  let res = 1;
  let cur = x;

  while (N > 0) {
    if (N % 2 === 1) {
      res *= cur; // Multiply by base when bit is 1
    }
    cur *= cur;  // Square base
    N = Math.floor(N / 2); // Halve exponent
  }

  return res;
}`,
        codeTS: `function myPow(x: number, n: number): number {
  if (n === 0) return 1;
  let N = n;
  if (N < 0) {
    x = 1 / x;
    N = -N;
  }

  let res = 1;
  let cur = x;

  while (N > 0) {
    if (N % 2 === 1) {
      res *= cur;
    }
    cur *= cur;
    N = Math.floor(N / 2);
  }

  return res;
}`,
        lineByLine: [
          'Line 2: Any number to power 0 is 1.',
          'Line 4-7: If exponent is negative, invert base x = 1 / x and negate power.',
          'Line 12-18: Exponentiation by squaring: if lowest bit of N is 1, multiply into res; square cur and divide N by 2.',
          'Line 20: Return res.'
        ],
        dryRun: [
          { step: 1, state: 'x = 2, n = 10', action: 'N=10 (even): cur=4, N=5', result: 'res = 1' },
          { step: 2, state: 'N=5 (odd)', action: 'res = 1 * 4 = 4; cur=16, N=2', result: 'res = 4' },
          { step: 3, state: 'N=2 (even)', action: 'cur = 256, N = 1', result: 'res = 4' },
          { step: 4, state: 'N=1 (odd)', action: 'res = 4 * 256 = 1024, N=0', result: 'Returns 1024' }
        ],
        complexityDerivation: 'Power N is halved at each iteration -> O(log N) steps with strictly O(1) space.'
      },
      {
        name: 'Approach 2: Recursive Binary Exponentiation (Alternative)',
        badge: 'Alternative / Recursive',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(log N)',
        summary: 'myPow(x, n) = myPow(x * x, n / 2) recursively.',
        intuition: 'Express fast exponentiation directly via mathematical recurrence.',
        codeJS: `function myPowRecursive(x, n) {
  function helper(base, exp) {
    if (exp === 0) return 1;
    if (exp % 2 === 0) {
      return helper(base * base, exp / 2);
    } else {
      return base * helper(base * base, Math.floor(exp / 2));
    }
  }

  return n >= 0 ? helper(x, n) : 1 / helper(x, -n);
}`,
        codeTS: `function myPowRecursive(x: number, n: number): number {
  function helper(base: number, exp: number): number {
    if (exp === 0) return 1;
    if (exp % 2 === 0) {
      return helper(base * base, exp / 2);
    } else {
      return base * helper(base * base, Math.floor(exp / 2));
    }
  }

  return n >= 0 ? helper(x, n) : 1 / helper(x, -n);
}`,
        lineByLine: [
          'Line 3: Base case: power 0 returns 1.',
          'Line 4-8: Recurse on base * base with exp / 2.',
          'Line 11: Invert if negative exponent.'
        ],
        dryRun: [
          { step: 1, state: 'helper(2, 4)', action: 'helper(4, 2) -> helper(16, 1) -> 16', result: 'Returns 16' }
        ],
        complexityDerivation: 'Log N recursion stack depth -> O(log N) time and O(log N) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Iterative Fast Pow', time: 'O(log N)', space: 'O(1)', pros: 'Optimal constant space, no recursion stack limit', cons: 'Must handle negative power carefully' },
      { approach: 'Recursive Fast Pow', time: 'O(log N)', space: 'O(log N)', pros: 'Direct mathematical symmetry', cons: 'Consumes log N stack frames' }
    ],
    interviewPitch: 'Computing x^n by multiplying x by itself n times takes O(n) time, which times out for large exponents. We optimize to O(log n) using Fast Binary Exponentiation by Squaring. If n is negative, we invert x (x = 1 / x) and negate n. In each iteration: if n is odd, we multiply our result by the current base. We then square the base (x = x * x) and integer-divide n by 2. This reduces the problem size by half at each step, running in O(log n) time and O(1) auxiliary space.',
    followUps: [{ question: 'What if n is -2^31 (Integer.MIN_VALUE in 32-bit systems)?', answer: 'In languages like Java or C++, negating -2^31 overflows 32-bit signed integer; cast n to a 64-bit long before negating.' }],
    recallQuiz: {
      question: 'How many multiplications are performed to calculate 2^10 using binary exponentiation?',
      options: ['4 multiplications (10 -> 5 -> 2 -> 1)', '10 multiplications', '1 multiplication', '100 multiplications'],
      correctIndex: 0,
      explanation: 'Binary exponentiation evaluates powers in floor(log2(10)) + popcount(10) steps = 3 + 2 = 4 to 5 multiplications.'
    }
  },

  142: {
    id: 142,
    title: 'Multiply Strings',
    difficulty: 'Medium',
    pattern: 'Math & Geometry',
    day: 85,
    leetcodeUrl: 'https://leetcode.com/problems/multiply-strings/',
    summary: 'Given two non-negative integers num1 and num2 represented as strings, return their product as a string.',
    prerequisites: ['Column addition array', 'Position invariant: num1[i] * num2[j] lands in [i + j, i + j + 1]'],
    problemStatement: `Given two non-negative integers \`num1\` and \`num2\` represented as strings, return the product of \`num1\` and \`num2\`, also represented as a string. **Note:** You must not use any built-in BigInteger library or convert the inputs to integer directly.`,
    approaches: [
      {
        name: 'Approach 1: Grade-School Column Addition Array (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M + N)',
        summary: 'Product of num1[i] and num2[j] is placed at positions [i + j, i + j + 1] in result array.',
        intuition: 'A number of length M multiplied by a number of length N has at most M + N digits. Digits at indices i and j contribute to indices i+j and i+j+1.',
        codeJS: `function multiply(num1, num2) {
  if (num1 === '0' || num2 === '0') return '0';

  const m = num1.length, n = num2.length;
  const res = new Array(m + n).fill(0);

  // Multiply each digit from right to left
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const mul = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48);
      const p1 = i + j;
      const p2 = i + j + 1;
      const sum = mul + res[p2];

      res[p2] = sum % 10;
      res[p1] += Math.floor(sum / 10);
    }
  }

  // Skip leading zeroes
  let start = 0;
  while (start < res.length && res[start] === 0) {
    start++;
  }

  return res.slice(start).join('');
}`,
        codeTS: `function multiply(num1: string, num2: string): string {
  if (num1 === '0' || num2 === '0') return '0';

  const m = num1.length, n = num2.length;
  const res: number[] = new Array(m + n).fill(0);

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const mul = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48);
      const p1 = i + j;
      const p2 = i + j + 1;
      const sum = mul + res[p2];

      res[p2] = sum % 10;
      res[p1] += Math.floor(sum / 10);
    }
  }

  let start = 0;
  while (start < res.length && res[start] === 0) {
    start++;
  }

  return res.slice(start).join('');
}`,
        lineByLine: [
          'Line 2: Fast return for multiplication by zero.',
          'Line 4-5: Array of length m + n initialized to 0 holds all product digits.',
          'Line 8-18: Multiply digits i and j: sum into res[p2], carry into res[p1].',
          'Line 21-24: Skip leading zeroes.',
          'Line 26: Convert slice of digits back to string.'
        ],
        dryRun: [
          { step: 1, state: 'num1="12", num2="34"', action: 'm=2, n=2: res array length 4', result: 'res = [0, 0, 0, 0]' },
          { step: 2, state: 'Compute partial products', action: '2*4, 1*4, 2*3, 1*3', result: 'res = [0, 4, 0, 8]' },
          { step: 3, state: 'Done', action: 'slice(1).join("")', result: 'Returns "408"' }
        ],
        complexityDerivation: 'Nested loops execute M * N times -> O(M * N) time with O(M + N) space for digit array.'
      },
      {
        name: 'Approach 2: BigInt (Forbidden in interview, verification baseline)',
        badge: 'Baseline / BigInt',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M + N)',
        summary: 'Native BigInt multiplication.',
        intuition: 'Direct arbitrary-precision integer arithmetic.',
        codeJS: `function multiplyBigInt(num1, num2) {
  return (BigInt(num1) * BigInt(num2)).toString();
}`,
        codeTS: `function multiplyBigInt(num1: string, num2: string): string {
  return (BigInt(num1) * BigInt(num2)).toString();
}`,
        lineByLine: [
          'Line 2: Convert to BigInt, multiply, and stringify.'
        ],
        dryRun: [
          { step: 1, state: '"2" * "3"', action: 'BigInt(2) * BigInt(3)', result: '"6"' }
        ],
        complexityDerivation: 'O(M * N) time and O(M + N) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Grade-School Digit Array', time: 'O(M * N)', space: 'O(M + N)', pros: 'Strictly satisfies interview rules without BigInt libraries', cons: 'Requires careful index indexing' },
      { approach: 'Native BigInt', time: 'O(M * N)', space: 'O(M + N)', pros: 'One line', cons: 'Explicitly prohibited by problem constraints' }
    ],
    interviewPitch: 'Because inputs can be up to 200 digits long, converting to standard numbers would result in precision overflow, and BigInt libraries are forbidden. We simulate grade-school multiplication: the product of an M-digit number and an N-digit number has at most M + N digits. We allocate a result array of size M + N initialized to 0. Iterating backwards through both numbers, the product of digit num1[i] and num2[j] is added to position i + j + 1, and the carry is added to position i + j. Finally, we skip any leading zeroes and join the array into a string. This runs in O(M * N) time and O(M + N) space.',
    followUps: [{ question: 'What is the maximum number of digits in the product of an M-digit number and an N-digit number?', answer: 'Exactly M + N digits (for example, 99 * 99 = 9801 has 2 + 2 = 4 digits).' }],
    recallQuiz: {
      question: 'Where do the product and carry of num1[i] * num2[j] accumulate in the result array?',
      options: ['Product lands at index i + j + 1 and carry lands at index i + j', 'At index i * j', 'At index i + j only', 'At index 0'],
      correctIndex: 0,
      explanation: 'Positions i and j have place values 10^(m-1-i) and 10^(n-1-j); their product has place value 10^(m+n-2-(i+j)), corresponding to indices i + j and i + j + 1.'
    }
  },

  143: {
    id: 143,
    title: 'Detect Squares',
    difficulty: 'Medium',
    pattern: 'Math & Geometry',
    day: 85,
    leetcodeUrl: 'https://leetcode.com/problems/detect-squares/',
    summary: 'Design a data structure that maintains points and counts axis-aligned squares with a given query point.',
    prerequisites: ['Diagonal vertex pairing', 'Point coordinate hashing / frequency map'],
    problemStatement: `Design a data structure that receives a stream of points and checks if there are three points that together with a query point form an **axis-aligned square**. Implement \`add(point)\` and \`count(point)\`.`,
    approaches: [
      {
        name: 'Approach 1: Diagonal Point Pairing with Frequency Map (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'add: O(1), count: O(P)',
        spaceComplexity: 'O(P)',
        summary: 'For query point (qx, qy), iterate over all registered points (x, y) that form a valid diagonal, checking remaining two vertices.',
        intuition: 'A square is uniquely identified by its diagonal. If |qx - x| === |qy - y| > 0, the remaining two required vertices are (qx, y) and (x, qy).',
        codeJS: `class DetectSquares {
  constructor() {
    this.ptsCount = new Map();
    this.points = [];
  }

  add(point) {
    const [x, y] = point;
    const key = \`\${x},\${y}\`;
    this.ptsCount.set(key, (this.ptsCount.get(key) || 0) + 1);
    this.points.push(point);
  }

  count(point) {
    const [qx, qy] = point;
    let totalSquares = 0;

    for (const [x, y] of this.points) {
      // Must be a valid diagonal: non-zero delta and equal width and height
      if (Math.abs(qx - x) !== Math.abs(qy - y) || qx === x || qy === y) {
        continue;
      }

      // Check existence of the other two corners: (qx, y) and (x, qy)
      const p1 = this.ptsCount.get(\`\${qx},\${y}\`) || 0;
      const p2 = this.ptsCount.get(\`\${x},\${qy}\`) || 0;

      totalSquares += p1 * p2;
    }

    return totalSquares;
  }
}`,
        codeTS: `class DetectSquares {
  ptsCount: Map<string, number>;
  points: [number, number][];

  constructor() {
    this.ptsCount = new Map();
    this.points = [];
  }

  add(point: [number, number]): void {
    const [x, y] = point;
    const key = \`\${x},\${y}\`;
    this.ptsCount.set(key, (this.ptsCount.get(key) || 0) + 1);
    this.points.push(point);
  }

  count(point: [number, number]): number {
    const [qx, qy] = point;
    let totalSquares = 0;

    for (const [x, y] of this.points) {
      if (Math.abs(qx - x) !== Math.abs(qy - y) || qx === x || qy === y) {
        continue;
      }

      const p1 = this.ptsCount.get(\`\${qx},\${y}\`) || 0;
      const p2 = this.ptsCount.get(\`\${x},\${qy}\`) || 0;

      totalSquares += p1 * p2;
    }

    return totalSquares;
  }
}`,
        lineByLine: [
          'Line 2-4: Maintain ptsCount frequency Map and points array of all added points.',
          'Line 7-12: add() records coordinates in map and pushes to points array in O(1).',
          'Line 15-28: count(): iterate existing points (x, y). If (x, y) forms a valid diagonal with (qx, qy) (equal abs deltas > 0), multiply frequencies of corners (qx, y) and (x, qy).'
        ],
        dryRun: [
          { step: 1, state: 'add [3, 10], [11, 2], [3, 2]', action: 'query [11, 10]', result: 'delta = 8' },
          { step: 2, state: 'diagonal [3, 2]', action: 'corners [11, 2] and [3, 10] exist', result: 'Returns 1 square' }
        ],
        complexityDerivation: 'add is O(1). count checks all P registered points in O(P) time with O(1) hash map queries. Total space O(P).'
      },
      {
        name: 'Approach 2: Group Points by X-Coordinate (Alternative)',
        badge: 'Alternative / Grouped Map',
        timeComplexity: 'add: O(1), count: O(K)',
        spaceComplexity: 'O(P)',
        summary: 'Group points by x-coordinate to only test points on matching vertical lines.',
        intuition: 'Reduces search space if points are sparsely distributed across x-coordinates.',
        codeJS: `class DetectSquaresGrouped {
  constructor() {
    this.count = new Map();
  }
  add([x, y]) {
    const key = \`\${x},\${y}\`;
    this.count.set(key, (this.count.get(key) || 0) + 1);
  }
  count([qx, qy]) {
    let res = 0;
    for (const [key, c] of this.count) {
      const [x, y] = key.split(',').map(Number);
      if (Math.abs(qx - x) === Math.abs(qy - y) && qx !== x) {
        res += c * (this.count.get(\`\${qx},\${y}\`) || 0) * (this.count.get(\`\${x},\${qy}\`) || 0);
      }
    }
    return res;
  }
}`,
        codeTS: `class DetectSquaresGrouped {
  count: Map<string, number> = new Map();
  add([x, y]: [number, number]): void {
    const key = \`\${x},\${y}\`;
    this.count.set(key, (this.count.get(key) || 0) + 1);
  }
  count([qx, qy]: [number, number]): number {
    let res = 0;
    for (const [key, c] of this.count) {
      const [x, y] = key.split(',').map(Number);
      if (Math.abs(qx - x) === Math.abs(qy - y) && qx !== x) {
        res += c * (this.count.get(\`\${qx},\${y}\`) || 0) * (this.count.get(\`\${x},\${qy}\`) || 0);
      }
    }
    return res;
  }
}`,
        lineByLine: [
          'Line 6-8: Iterates over unique keys only, multiplying by diagonal point frequency c.'
        ],
        dryRun: [
          { step: 1, state: 'Unique key iteration', action: 'Multiplies corner frequencies', result: 'Correct square count' }
        ],
        complexityDerivation: 'count runs in O(U) time where U is number of unique points.'
      }
    ],
    comparisonTable: [
      { approach: 'Points Array + Frequency Map', time: 'count: O(P)', space: 'O(P)', pros: 'Zero string splitting in count loop, fast iteration', cons: 'Stores duplicate coordinates in array' },
      { approach: 'Unique Points Grouped', time: 'count: O(U)', space: 'O(U)', pros: 'Fewer iterations when many duplicates exist', cons: 'String parsing overhead' }
    ],
    interviewPitch: 'A square is uniquely determined by its diagonal. In Detect Squares, for a query point (qx, qy), we iterate through all existing points (x, y) to check if they can serve as the diagonally opposite corner. They form a valid diagonal if and only if |qx - x| === |qy - y| and qx !== x. If valid, the remaining two required vertices of the axis-aligned square are strictly fixed at (qx, y) and (x, qy). The number of squares formed by this diagonal is count[(qx, y)] * count[(x, qy)]. We sum this across all valid diagonals. add runs in O(1) time and count runs in O(N) time with O(N) space.',
    followUps: [{ question: 'Why is the side length condition `abs(qx - x) === abs(qy - y)` necessary?', answer: 'Because an axis-aligned square must have equal width and height; unequal dimensions would form a rectangle, not a square.' }],
    recallQuiz: {
      question: 'Given diagonal endpoints (qx, qy) and (x, y), what are the coordinates of the other two corners of an axis-aligned square?',
      options: ['(qx, y) and (x, qy)', '(qx + x, qy + y)', '(qx - x, qy - y)', '(y, x)'],
      correctIndex: 0,
      explanation: 'An axis-aligned rectangle or square with diagonal (qx, qy) to (x, y) has its remaining vertices at (qx, y) and (x, qy).'
    }
  },

  144: {
    id: 144,
    title: 'Single Number',
    difficulty: 'Easy',
    pattern: 'Bit Manipulation',
    day: 86,
    leetcodeUrl: 'https://leetcode.com/problems/single-number/',
    summary: 'Every element in nums appears twice except for one. Find that single one in linear time and O(1) space.',
    prerequisites: ['XOR bitwise properties: x ^ x = 0, x ^ 0 = x', 'Commutativity and associativity of XOR'],
    problemStatement: `Given a **non-empty** array of integers \`nums\`, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.`,
    approaches: [
      {
        name: 'Approach 1: Bitwise XOR Cancellation (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'XOR all elements together; duplicates cancel out (x ^ x = 0), leaving the single number.',
        intuition: 'XOR is commutative and associative. Pairwise duplicates cancel to 0: (a ^ a) ^ (b ^ b) ^ c = 0 ^ 0 ^ c = c.',
        codeJS: `function singleNumber(nums) {
  let res = 0;
  for (const num of nums) {
    res ^= num;
  }
  return res;
}`,
        codeTS: `function singleNumber(nums: number[]): number {
  let res = 0;
  for (const num of nums) {
    res ^= num;
  }
  return res;
}`,
        lineByLine: [
          'Line 2: Initialize result to 0 (identity element for XOR: 0 ^ x = x).',
          'Line 3-5: Accumulate bitwise XOR of all array elements.',
          'Line 6: Return result holding the unique unpaired number.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [4, 1, 2, 1, 2]', action: '4 ^ 1 ^ 2 ^ 1 ^ 2', result: 'order does not matter' },
          { step: 2, state: 'Group pairs', action: '4 ^ (1 ^ 1) ^ (2 ^ 2) = 4 ^ 0 ^ 0', result: 'Returns 4' }
        ],
        complexityDerivation: 'Single pass of length N -> O(N) time with strictly O(1) auxiliary space.'
      },
      {
        name: 'Approach 2: Hash Set (Baseline)',
        badge: 'Baseline / Hash Set',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Add number to Set on first view, remove on second view.',
        intuition: 'The only element remaining in the set at the end is the single number.',
        codeJS: `function singleNumberSet(nums) {
  const set = new Set();
  for (const n of nums) {
    if (set.has(n)) set.delete(n);
    else set.add(n);
  }
  return set.values().next().value;
}`,
        codeTS: `function singleNumberSet(nums: number[]): number {
  const set = new Set<number>();
  for (const n of nums) {
    if (set.has(n)) set.delete(n);
    else set.add(n);
  }
  return set.values().next().value!;
}`,
        lineByLine: [
          'Line 2: Set stores unpaired elements.',
          'Line 3-6: Delete duplicate on second encounter; add if new.',
          'Line 7: Return solitary remaining element.'
        ],
        dryRun: [
          { step: 1, state: 'nums=[2, 2, 1]', action: 'add 2, delete 2, add 1', result: 'Set = {1} -> Returns 1' }
        ],
        complexityDerivation: 'O(N) time but uses O(N) heap space, failing the O(1) space constraint.'
      }
    ],
    comparisonTable: [
      { approach: 'Bitwise XOR', time: 'O(N)', space: 'O(1)', pros: 'Meets strict O(1) space interview requirement', cons: 'Only works when other elements appear exactly twice' },
      { approach: 'Hash Set', time: 'O(N)', space: 'O(N)', pros: 'Generalizes to arbitrary duplicates', cons: 'Fails O(1) space constraint' }
    ],
    interviewPitch: 'Single Number is solved in O(N) time and O(1) space using the properties of the bitwise XOR operation: First, any number XORed with itself is 0 (x ^ x = 0). Second, any number XORed with 0 is itself (x ^ 0 = x). Third, XOR is commutative and associative. Therefore, if we XOR all elements in the array together, every duplicate pair cancels out to 0, leaving strictly the solitary single number. This executes in a single pass of O(N) time and O(1) space.',
    followUps: [{ question: 'What if elements appear 3 times except for one (Single Number II)?', answer: 'Count the sum of bits at each position modulo 3, or use two bitmasks (ones and twos) to track bits appearing once vs twice.' }],
    recallQuiz: {
      question: 'Which mathematical property of XOR guarantees that the order of numbers in nums does not affect the final result?',
      options: ['Commutativity (a ^ b = b ^ a) and Associativity ((a ^ b) ^ c = a ^ (b ^ c))', 'Distributivity over addition', 'Idempotence', 'Transitivity'],
      correctIndex: 0,
      explanation: 'Commutativity and associativity allow reordering the XOR expression so that all identical pairs sit next to each other and cancel out.'
    }
  },

  145: {
    id: 145,
    title: 'Number of 1 Bits',
    difficulty: 'Easy',
    pattern: 'Bit Manipulation',
    day: 86,
    leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/',
    summary: 'Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (Hamming weight).',
    prerequisites: ['Brian Kernighan\'s algorithm: n & (n - 1)', 'Bitwise AND and shift operators'],
    problemStatement: `Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight).`,
    approaches: [
      {
        name: 'Approach 1: Brian Kernighan\'s Algorithm (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(k) where k is set bits',
        spaceComplexity: 'O(1)',
        summary: 'Repeatedly clear the lowest set bit using n = n & (n - 1).',
        intuition: 'Subtracting 1 flips the least significant 1-bit and all trailing 0s. ANDing n with n - 1 clears that lowest 1-bit in a single instruction.',
        codeJS: `function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1); // Clears the lowest set bit
    count++;
  }
  return count;
}`,
        codeTS: `function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1);
    count++;
  }
  return count;
}`,
        lineByLine: [
          'Line 2: Counter for 1-bits.',
          'Line 3-6: Each iteration clears the rightmost set bit using n & (n - 1), looping only as many times as there are 1-bits.',
          'Line 7: Return total count.'
        ],
        dryRun: [
          { step: 1, state: 'n = 11 (1011 in binary)', action: 'n & 10 = 1011 & 1010 = 1010 (10)', result: 'count = 1' },
          { step: 2, state: 'n = 10 (1010)', action: 'n & 9 = 1010 & 1001 = 1000 (8)', result: 'count = 2' },
          { step: 3, state: 'n = 8 (1000)', action: 'n & 7 = 1000 & 0111 = 0000 (0)', result: 'count = 3 -> Returns 3' }
        ],
        complexityDerivation: 'Loops exactly k times (where k is number of 1-bits <= 32) -> O(k) time and O(1) space.'
      },
      {
        name: 'Approach 2: 32-Bit Shift Loop (Baseline)',
        badge: 'Baseline / Bit Shift',
        timeComplexity: 'O(32) = O(1)',
        spaceComplexity: 'O(1)',
        summary: 'Check the least significant bit with n & 1 and right shift 32 times.',
        intuition: 'Standard bitwise loop checking each bit position.',
        codeJS: `function hammingWeightShift(n) {
  let count = 0;
  for (let i = 0; i < 32; i++) {
    if ((n & 1) === 1) count++;
    n = n >>> 1; // Unsigned right shift
  }
  return count;
}`,
        codeTS: `function hammingWeightShift(n: number): number {
  let count = 0;
  for (let i = 0; i < 32; i++) {
    if ((n & 1) === 1) count++;
    n = n >>> 1;
  }
  return count;
}`,
        lineByLine: [
          'Line 3-6: Always loops 32 times regardless of whether bits are set.'
        ],
        dryRun: [
          { step: 1, state: 'n = 1', action: 'Checks all 32 bit positions', result: 'Returns 1' }
        ],
        complexityDerivation: 'Always runs 32 iterations -> O(1) time and O(1) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Brian Kernighan\'s Algorithm', time: 'O(k) where k = set bits', space: 'O(1)', pros: 'Optimal speed, skips all trailing and intermediate 0s', cons: 'Slightly less obvious bit trick' },
      { approach: '32-Bit Shift Loop', time: 'O(32)', space: 'O(1)', pros: 'Straightforward', cons: 'Always takes 32 iterations even if n has only one set bit' }
    ],
    interviewPitch: 'To count set bits, instead of testing all 32 bit positions, we use Brian Kernighan\'s algorithm. The key bitwise identity is `n & (n - 1)`. Subtracting 1 from a number flips its least significant set bit and turns all trailing 0s into 1s; performing a bitwise AND with the original number therefore clears strictly that lowest set bit. We repeat this until n becomes 0. The number of iterations is proportional only to the number of set bits (at most 32), running in O(k) time and O(1) space.',
    followUps: [{ question: 'How is n & (n - 1) used to check if a number is a power of two?', answer: 'A power of two has exactly one set bit; thus `n > 0 && (n & (n - 1)) === 0` tests for a power of two in O(1) time.' }],
    recallQuiz: {
      question: 'What is the exact effect of the expression `n & (n - 1)` on a non-zero integer n?',
      options: ['It clears the least significant 1-bit in n', 'It multiplies n by 2', 'It sets the highest bit', 'It negates n'],
      correctIndex: 0,
      explanation: 'Subtracting 1 changes the rightmost 1-bit to 0 and all trailing 0s to 1s. Bitwise ANDing cancels all differing bits, leaving all higher bits intact.'
    }
  },

  146: {
    id: 146,
    title: 'Counting Bits',
    difficulty: 'Easy',
    pattern: 'Bit Manipulation',
    day: 87,
    leetcodeUrl: 'https://leetcode.com/problems/counting-bits/',
    summary: 'Given an integer n, return an array ans of length n + 1 such that ans[i] is the number of 1\'s in the binary representation of i.',
    prerequisites: ['DP with bit shifts: dp[i] = dp[i >> 1] + (i & 1)', 'Least significant bit recurrence'],
    problemStatement: `Given an integer \`n\`, return an array \`ans\` of length \`n + 1\` such that for each \`i\` (\`0 <= i <= n\`), \`ans[i]\` is the **number of 1's** in the binary representation of \`i\`. Solve in linear time O(n) without using built-in popcount.`,
    approaches: [
      {
        name: 'Approach 1: DP with Least Significant Bit (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'dp[i] = dp[i >> 1] + (i & 1): number of set bits in i equals bits in i / 2 plus last bit.',
        intuition: 'Right shifting i by 1 removes the least significant bit. The number of 1-bits in i is therefore the bits in (i >> 1) plus 1 if i is odd (i & 1).',
        codeJS: `function countBits(n) {
  const ans = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    // i >> 1 drops last bit; i & 1 checks if last bit was 1
    ans[i] = ans[i >> 1] + (i & 1);
  }

  return ans;
}`,
        codeTS: `function countBits(n: number): number[] {
  const ans: number[] = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    ans[i] = ans[i >> 1] + (i & 1);
  }

  return ans;
}`,
        lineByLine: [
          'Line 2: Allocate ans array of size n + 1 initialized with 0 (ans[0] = 0).',
          'Line 4-7: For each number i from 1 to n, look up previously computed ans[i >> 1] and add 1 if i is odd.',
          'Line 9: Return completed array in strict O(N) time.'
        ],
        dryRun: [
          { step: 1, state: 'i=0: 0', action: 'ans[0] = 0', result: 'base' },
          { step: 2, state: 'i=1: ans[0] + 1 = 1', action: 'i=2: ans[1] + 0 = 1', result: 'ans = [0, 1, 1]' },
          { step: 3, state: 'i=3: ans[1] + 1 = 2', action: 'i=4: ans[2] + 0 = 1', result: 'ans = [0, 1, 1, 2, 1]' }
        ],
        complexityDerivation: 'Single loop from 1 to N doing O(1) bitwise operations -> O(N) time and O(1) auxiliary space (excluding output).'
      },
      {
        name: 'Approach 2: DP with Most Significant Bit Offset (Alternative)',
        badge: 'Alternative / MSB Offset',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'dp[i] = 1 + dp[i - offset] where offset doubles at every power of 2.',
        intuition: 'Numbers between 2^k and 2^(k+1)-1 mirror the bits of 0 to 2^k-1 with one additional leading bit.',
        codeJS: `function countBitsMSB(n) {
  const ans = new Array(n + 1).fill(0);
  let offset = 1;

  for (let i = 1; i <= n; i++) {
    if (offset * 2 === i) {
      offset = i; // Next power of 2
    }
    ans[i] = 1 + ans[i - offset];
  }

  return ans;
}`,
        codeTS: `function countBitsMSB(n: number): number[] {
  const ans: number[] = new Array(n + 1).fill(0);
  let offset = 1;

  for (let i = 1; i <= n; i++) {
    if (offset * 2 === i) {
      offset = i;
    }
    ans[i] = 1 + ans[i - offset];
  }

  return ans;
}`,
        lineByLine: [
          'Line 3: offset tracks highest power of 2 <= i.',
          'Line 6-8: When i hits next power of 2, update offset.',
          'Line 9: Current bits = 1 (leading bit) + bits of (i - offset).'
        ],
        dryRun: [
          { step: 1, state: 'offset=1: ans[1] = 1 + ans[0] = 1', action: 'offset=2: ans[2] = 1 + ans[0] = 1', result: 'ans[3] = 1 + ans[1] = 2' }
        ],
        complexityDerivation: 'O(N) time and O(1) auxiliary space.'
      }
    ],
    comparisonTable: [
      { approach: 'DP Least Significant Bit', time: 'O(N)', space: 'O(1)', pros: 'Extremely clean one-liner: ans[i >> 1] + (i & 1)', cons: 'None' },
      { approach: 'DP Most Significant Bit', time: 'O(N)', space: 'O(1)', pros: 'Visually shows power-of-2 mirroring', cons: 'Requires maintaining offset variable' }
    ],
    interviewPitch: 'Instead of counting bits for each number individually in O(n log n), we solve Counting Bits in strictly O(N) time using Dynamic Programming. Any integer i can be viewed as its prefix (i >> 1) plus its least significant bit (i & 1). Because i >> 1 is strictly less than i, its bit count is already precomputed in our dp array! Thus, the recurrence relation is simply: `ans[i] = ans[i >> 1] + (i & 1)`. This populates the entire array in a single linear pass of O(N) time and O(1) auxiliary space.',
    followUps: [{ question: 'What is another bitwise recurrence for this?', answer: '`ans[i] = ans[i & (i - 1)] + 1` by clearing the lowest set bit and adding 1.' }],
    recallQuiz: {
      question: 'Why is `ans[i >> 1]` guaranteed to be already computed when evaluating index i?',
      options: ['Because integer right shift divides by 2, and i / 2 is strictly less than i for all i >= 1', 'Because array is reverse traversed', 'Because 0 is the base case', 'Because of bitwise AND'],
      correctIndex: 0,
      explanation: 'For any i >= 1, floor(i / 2) < i, meaning its solution was already computed in an earlier iteration.'
    }
  },

  147: {
    id: 147,
    title: 'Reverse Bits',
    difficulty: 'Easy',
    pattern: 'Bit Manipulation',
    day: 87,
    leetcodeUrl: 'https://leetcode.com/problems/reverse-bits/',
    summary: 'Reverse bits of a given 32 bits unsigned integer.',
    prerequisites: ['Bitwise shift and OR operations', 'Unsigned 32-bit conversion in JS (`>>> 0`)'],
    problemStatement: `Reverse bits of a given 32 bits unsigned integer.`,
    approaches: [
      {
        name: 'Approach 1: Bitwise Extraction and Shift Accumulation (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(32) = O(1)',
        spaceComplexity: 'O(1)',
        summary: 'In 32 iterations, extract least significant bit of n and shift into result.',
        intuition: 'res = (res << 1) | (n & 1), followed by n = n >>> 1.',
        codeJS: `function reverseBits(n) {
  let res = 0;

  for (let i = 0; i < 32; i++) {
    const bit = n & 1;
    res = (res << 1) | bit;
    n = n >>> 1; // Unsigned right shift
  }

  return res >>> 0; // Force unsigned 32-bit integer in JS
}`,
        codeTS: `function reverseBits(n: number): number {
  let res = 0;

  for (let i = 0; i < 32; i++) {
    const bit = n & 1;
    res = (res << 1) | bit;
    n = n >>> 1;
  }

  return res >>> 0;
}`,
        lineByLine: [
          'Line 2: Accumulator res initialized to 0.',
          'Line 4: Loop exactly 32 times for all 32 bits.',
          'Line 5-6: Extract lowest bit of n and push into res using left shift and bitwise OR.',
          'Line 7: Shift n right by 1 using unsigned shift `>>>`.',
          'Line 10: In JavaScript, bitwise operators return signed 32-bit ints; `>>> 0` converts to unsigned 32-bit integer.'
        ],
        dryRun: [
          { step: 1, state: 'n = 00000010100101000001111010011100', action: 'Extracts bits from right to left', result: 'Pushes into res from left to right' },
          { step: 2, state: 'Result', action: 'Returns 964176192', result: 'Reversed unsigned integer' }
        ],
        complexityDerivation: 'Exactly 32 loop steps -> O(1) time and O(1) space.'
      },
      {
        name: 'Approach 2: Divide and Conquer Mask Swapping (Alternative)',
        badge: 'Alternative / Byte Swap',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        summary: 'Swap 16-bit blocks, then 8-bit blocks, 4-bit, 2-bit, and 1-bit using masks.',
        intuition: 'Reverses bits in parallel using 5 constant-time masking operations without looping.',
        codeJS: `function reverseBitsMask(n) {
  n = ((n >>> 16) | (n << 16)) >>> 0;
  n = (((n & 0xff00ff00) >>> 8) | ((n & 0x00ff00ff) << 8)) >>> 0;
  n = (((n & 0xf0f0f0f0) >>> 4) | ((n & 0x0f0f0f0f) << 4)) >>> 0;
  n = (((n & 0xcccccccc) >>> 2) | ((n & 0x33333333) << 2)) >>> 0;
  n = (((n & 0xaaaaaaaa) >>> 1) | ((n & 0x55555555) << 1)) >>> 0;
  return n >>> 0;
}`,
        codeTS: `function reverseBitsMask(n: number): number {
  n = ((n >>> 16) | (n << 16)) >>> 0;
  n = (((n & 0xff00ff00) >>> 8) | ((n & 0x00ff00ff) << 8)) >>> 0;
  n = (((n & 0xf0f0f0f0) >>> 4) | ((n & 0x0f0f0f0f) << 4)) >>> 0;
  n = (((n & 0xcccccccc) >>> 2) | ((n & 0x33333333) << 2)) >>> 0;
  n = (((n & 0xaaaaaaaa) >>> 1) | ((n & 0x55555555) << 1)) >>> 0;
  return n >>> 0;
}`,
        lineByLine: [
          'Line 2-6: Swap blocks of size 16, 8, 4, 2, and 1 in parallel using bit masks.'
        ],
        dryRun: [
          { step: 1, state: 'Bitmask parallel divide and conquer', action: 'Swaps bit chunks', result: '5 CPU operations' }
        ],
        complexityDerivation: '5 bitwise instructions -> O(1) time and O(1) space.'
      }
    ],
    comparisonTable: [
      { approach: '32-Bit Shift Loop', time: 'O(32)', space: 'O(1)', pros: 'Clear, intuitive, and easy to explain in screening rounds', cons: '32 iterations' },
      { approach: 'Divide & Conquer Mask Swapping', time: 'O(5 ops)', space: 'O(1)', pros: 'Optimal for hardware / SIMD level performance', cons: 'Difficult to memorize hexadecimal masks' }
    ],
    interviewPitch: 'To reverse the bits of a 32-bit unsigned integer, we run a 32-step loop. In each iteration, we extract the least significant bit of n using `n & 1`. We shift our result left by 1 and OR it with the extracted bit (`(res << 1) | bit`), and then shift n right by 1 using the unsigned right-shift operator (`n >>> 1`). In JavaScript, bitwise operators treat operands as signed 32-bit integers, so returning `res >>> 0` ensures the final output is represented as an unsigned 32-bit integer. This runs in O(1) time and O(1) space.',
    followUps: [{ question: 'If this function is called billions of times, how would you optimize it?', answer: 'Cache reversed bytes in an 8-bit lookup table of size 256; reverse the 32-bit number in 4 table lookups: `(table[b0] << 24) | (table[b1] << 16) | (table[b2] << 8) | table[b3]`.' }],
    recallQuiz: {
      question: 'Why is `res >>> 0` required at the end in JavaScript?',
      options: ['Because JavaScript bitwise operators coerce results into signed 32-bit integers; `>>> 0` converts back to unsigned', 'Because 0 clears the cache', 'Because bitwise shift requires a base', 'To prevent string conversion'],
      correctIndex: 0,
      explanation: 'In JS, bitwise operations yield signed 32-bit integers. An unsigned right shift by 0 forces V8 to treat the bits as an unsigned 32-bit integer.'
    }
  },

  148: {
    id: 148,
    title: 'Missing Number',
    difficulty: 'Easy',
    pattern: 'Bit Manipulation',
    day: 88,
    leetcodeUrl: 'https://leetcode.com/problems/missing-number/',
    summary: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing.',
    prerequisites: ['XOR cancellation property', 'Gauss arithmetic sum formula: n * (n + 1) / 2'],
    problemStatement: `Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return the only number in the range that is missing from the array.`,
    approaches: [
      {
        name: 'Approach 1: Bitwise XOR Cancellation (Optimal - No Overflow)',
        badge: 'Optimal / Zero-Overflow',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'XOR all numbers in [0, n] and all numbers in nums; duplicates cancel out.',
        intuition: 'Since index i covers 0 to n-1 and n is added, XORing all indices and values cancels out all matching numbers, leaving strictly the missing number.',
        codeJS: `function missingNumber(nums) {
  let res = nums.length;

  for (let i = 0; i < nums.length; i++) {
    res ^= i ^ nums[i];
  }

  return res;
}`,
        codeTS: `function missingNumber(nums: number[]): number {
  let res = nums.length;

  for (let i = 0; i < nums.length; i++) {
    res ^= i ^ nums[i];
  }

  return res;
}`,
        lineByLine: [
          'Line 2: Initialize res with n (since indices i only run from 0 to n-1).',
          'Line 4-6: XOR each index i and each element nums[i]. All existing numbers cancel out.',
          'Line 8: Return remaining missing value.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [3, 0, 1], n=3', action: 'res = 3 ^ (0 ^ 3) ^ (1 ^ 0) ^ (2 ^ 1)', result: '3, 0, 1 cancel out' },
          { step: 2, state: 'Result', action: 'res = 2', result: 'Returns 2' }
        ],
        complexityDerivation: 'Single loop over N elements -> O(N) time with strictly O(1) space.'
      },
      {
        name: 'Approach 2: Gauss Sum Formula (Alternative Optimal)',
        badge: 'Alternative / Math Formula',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Expected sum is n * (n + 1) / 2. Missing number is expectedSum - actualSum.',
        intuition: 'Sum of arithmetic progression 0 to n minus sum of array elements gives the missing number.',
        codeJS: `function missingNumberSum(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((a, b) => a + b, 0);
  return expectedSum - actualSum;
}`,
        codeTS: `function missingNumberSum(nums: number[]): number {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((a, b) => a + b, 0);
  return expectedSum - actualSum;
}`,
        lineByLine: [
          'Line 3: Compute expected sum using Gauss formula.',
          'Line 4: Sum all elements in nums.',
          'Line 5: Difference is the missing integer.'
        ],
        dryRun: [
          { step: 1, state: 'nums = [9,6,4,2,3,5,7,0,1], n=9', action: 'expected = 9 * 10 / 2 = 45, actual = 37', result: '45 - 37 = 8' }
        ],
        complexityDerivation: 'Single pass reduce -> O(N) time and O(1) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Bitwise XOR', time: 'O(N)', space: 'O(1)', pros: 'Immune to integer arithmetic overflow on massive n', cons: 'Bitwise reasoning' },
      { approach: 'Gauss Sum Formula', time: 'O(N)', space: 'O(1)', pros: 'Trivial one-line math', cons: 'Risk of integer overflow if n * (n + 1) exceeds max int' }
    ],
    interviewPitch: 'Missing Number can be solved in O(N) time and O(1) space using either Gauss\'s arithmetic sum formula or Bitwise XOR. While Gauss\'s formula (n * (n + 1) / 2 - sum(nums)) is concise, it can risk integer overflow for very large n. The XOR approach is immune to overflow: because x ^ x = 0 and x ^ 0 = x, if we initialize our result to n and XOR every index i and element nums[i], all numbers present in both the range [0...n] and the array cancel out, leaving strictly the missing number. This runs in O(N) time and O(1) space.',
    followUps: [{ question: 'What if multiple numbers are missing?', answer: 'Find Missing Positive (LeetCode 41) or use two equations: sum difference and sum of squares difference.' }],
    recallQuiz: {
      question: 'Why is the bitwise XOR solution preferred over the Gauss sum solution in low-level languages like C/C++?',
      options: ['Because it cannot cause arithmetic integer overflow when n * (n + 1) exceeds max integer limits', 'Because XOR runs in O(log N)', 'Because array values can be negative', 'Because division by 2 is illegal'],
      correctIndex: 0,
      explanation: 'Multiplying n * (n + 1) can overflow a 32-bit signed integer when n > 65,535, whereas XOR operates bit-by-bit without ever overflowing.'
    }
  },

  149: {
    id: 149,
    title: 'Sum of Two Integers',
    difficulty: 'Medium',
    pattern: 'Bit Manipulation',
    day: 88,
    leetcodeUrl: 'https://leetcode.com/problems/sum-of-two-integers/',
    summary: 'Given two integers a and b, return the sum of the two integers without using the operators + and -.',
    prerequisites: ['Half adder logic: XOR gives sum without carry, AND shifted left gives carry', 'Carry loop until carry is 0'],
    problemStatement: `Given two integers \`a\` and \`b\`, return the sum of the two integers without using the operators \`+\` and \`-\`.`,
    approaches: [
      {
        name: 'Approach 1: Half-Adder Bitwise Simulation (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(1) (at most 32 iterations)',
        spaceComplexity: 'O(1)',
        summary: 'sum = a ^ b, carry = (a & b) << 1. Repeat until carry is 0.',
        intuition: 'XOR adds bits without carrying (0+0=0, 1+0=1, 0+1=1, 1+1=0). AND finds where both bits are 1, and shifting left by 1 applies the carry to the next higher bit.',
        codeJS: `function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1; // Carry bits
    a = a ^ b;                 // Sum bits without carry
    b = carry;
  }
  return a;
}`,
        codeTS: `function getSum(a: number, b: number): number {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
        lineByLine: [
          'Line 2: Loop continues until carry b becomes 0.',
          'Line 3: (a & b) identifies positions where both bits are 1; << 1 shifts carry to the next position.',
          'Line 4: a ^ b adds bits without carrying.',
          'Line 5: Set b to carry for the next addition cycle.',
          'Line 7: When carry is 0, a holds the final sum.'
        ],
        dryRun: [
          { step: 1, state: 'a = 1 (01), b = 2 (10)', action: 'carry = (01 & 10) << 1 = 0', result: 'a = 01 ^ 10 = 11 (3)' },
          { step: 2, state: 'b = 0', action: 'Loop terminates', result: 'Returns 3' }
        ],
        complexityDerivation: 'At most 32 iterations for 32-bit integers -> O(1) time and O(1) space.'
      },
      {
        name: 'Approach 2: Recursive Half-Adder (Alternative)',
        badge: 'Alternative / Recursive',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        summary: 'getSum(a ^ b, (a & b) << 1) recursively until b === 0.',
        intuition: 'Express half-adder as clean tail-recursive call.',
        codeJS: `function getSumRecursive(a, b) {
  return b === 0 ? a : getSumRecursive(a ^ b, (a & b) << 1);
}`,
        codeTS: `function getSumRecursive(a: number, b: number): number {
  return b === 0 ? a : getSumRecursive(a ^ b, (a & b) << 1);
}`,
        lineByLine: [
          'Line 2: If carry b === 0 return a, otherwise recurse with sum (a ^ b) and carry ((a & b) << 1).'
        ],
        dryRun: [
          { step: 1, state: 'getSum(2, 3)', action: 'sum = 2^3=1, carry = (2&3)<<1 = 4', result: 'getSum(1, 4) -> 5' }
        ],
        complexityDerivation: 'At most 32 recursion frames -> O(1) time and O(1) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Iterative Half-Adder', time: 'O(1)', space: 'O(1)', pros: 'Zero recursion stack allocations, production-ready', cons: 'None' },
      { approach: 'Recursive Half-Adder', time: 'O(1)', space: 'O(1)', pros: 'One line expression', cons: 'Recursion frames' }
    ],
    interviewPitch: 'We can add two integers without using `+` or `-` by replicating a hardware half-adder using bitwise operations. In binary addition: bitwise XOR (`a ^ b`) adds bits without taking carry into account (since 1 ^ 1 = 0 and 1 ^ 0 = 1). Meanwhile, bitwise AND followed by a left shift (`(a & b) << 1`) identifies where both bits are 1 and shifts the carry to the next higher bit position. We repeat this process: setting `a = a ^ b` and `b = (a & b) << 1` until the carry `b` becomes 0. This completes in at most 32 iterations, taking O(1) time and O(1) space.',
    followUps: [{ question: 'How would you implement subtraction without `-`?', answer: 'a - b is equivalent to a + (-b). To negate b using two\'s complement: -b = ~b + 1, so return getSum(a, getSum(~b, 1)).' }],
    recallQuiz: {
      question: 'Which bitwise operation computes the carry in binary addition?',
      options: ['(a & b) << 1', 'a ^ b', 'a | b', 'a >> 1'],
      correctIndex: 0,
      explanation: 'AND determines where both bits are 1 (generating a carry), and left shift moves the carry to the next higher bit position.'
    }
  },

  150: {
    id: 150,
    title: 'Reverse Integer',
    difficulty: 'Medium',
    pattern: 'Bit Manipulation',
    day: 89,
    leetcodeUrl: 'https://leetcode.com/problems/reverse-integer/',
    summary: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing causes overflow outside [-2^31, 2^31 - 1], return 0.',
    prerequisites: ['Modulo 10 digit extraction', '32-bit signed integer boundary check (-2147483648 to 2147483647)'],
    problemStatement: `Given a signed 32-bit integer \`x\`, return \`x\` with its digits reversed. If reversing \`x\` causes the value to go outside the signed 32-bit integer range \`[-2^31, 2^31 - 1]\`, then return \`0\`. **Assume the environment does not allow you to store 64-bit integers.**`,
    approaches: [
      {
        name: 'Approach 1: Modular Digit Extraction with Overflow Check (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(log10 N)',
        spaceComplexity: 'O(1)',
        summary: 'Pop digits from right using x % 10 and check overflow before pushing into res.',
        intuition: 'res = res * 10 + digit. Check if res > 214748364 or (res === 214748364 && digit > 7) before multiplying.',
        codeJS: `function reverse(x) {
  let res = 0;
  const isNeg = x < 0;
  x = Math.abs(x);

  const MAX = 2147483647; // 2^31 - 1

  while (x > 0) {
    const digit = x % 10;
    x = Math.floor(x / 10);

    // 32-bit overflow check before multiplying by 10
    if (res > Math.floor(MAX / 10) || (res === Math.floor(MAX / 10) && digit > 7)) {
      return 0;
    }

    res = res * 10 + digit;
  }

  return isNeg ? -res : res;
}`,
        codeTS: `function reverse(x: number): number {
  let res = 0;
  const isNeg = x < 0;
  x = Math.abs(x);

  const MAX = 2147483647;

  while (x > 0) {
    const digit = x % 10;
    x = Math.floor(x / 10);

    if (res > Math.floor(MAX / 10) || (res === Math.floor(MAX / 10) && digit > 7)) {
      return 0;
    }

    res = res * 10 + digit;
  }

  return isNeg ? -res : res;
}`,
        lineByLine: [
          'Line 2-4: Record sign and take absolute value.',
          'Line 6: 32-bit signed max limit (2^31 - 1 = 2147483647).',
          'Line 8-10: Extract last digit with x % 10 and truncate with Math.floor(x / 10).',
          'Line 13-15: Overflow check: if res exceeds 214748364, next multiplication will overflow 32-bit int -> return 0.',
          'Line 17: Append digit: res = res * 10 + digit.',
          'Line 20: Restore original sign.'
        ],
        dryRun: [
          { step: 1, state: 'x = 123', action: 'pop 3 -> res=3; pop 2 -> res=32; pop 1 -> res=321', result: 'Returns 321' },
          { step: 2, state: 'x = -123', action: 'Processes 123, restores negative', result: 'Returns -321' },
          { step: 3, state: 'x = 1534236469', action: 'Reversing would exceed 2^31 - 1', result: 'Returns 0 (overflow guarded)' }
        ],
        complexityDerivation: 'Loops at most 10 times for 32-bit integers -> O(log10 N) time and O(1) space.'
      },
      {
        name: 'Approach 2: String Reversal with Boundary Check (Alternative)',
        badge: 'Alternative / String',
        timeComplexity: 'O(log10 N)',
        spaceComplexity: 'O(log10 N)',
        summary: 'Convert absolute value to string, reverse, parse back to number, and check 32-bit range.',
        intuition: 'Quick script-style implementation utilizing string splitting.',
        codeJS: `function reverseString(x) {
  const isNeg = x < 0;
  const s = Math.abs(x).toString().split('').reverse().join('');
  const num = parseInt(s, 10);

  if (num > 2147483647) return 0;
  return isNeg ? -num : num;
}`,
        codeTS: `function reverseString(x: number): number {
  const isNeg = x < 0;
  const s = Math.abs(x).toString().split('').reverse().join('');
  const num = parseInt(s, 10);

  if (num > 2147483647) return 0;
  return isNeg ? -num : num;
}`,
        lineByLine: [
          'Line 3: Reverse string representation of number.',
          'Line 6: Return 0 if parsed number exceeds 32-bit signed max.'
        ],
        dryRun: [
          { step: 1, state: 'x = 120', action: '"120" -> "021" -> 21', result: 'Returns 21' }
        ],
        complexityDerivation: 'String allocations take O(D) time and space where D <= 10.'
      }
    ],
    comparisonTable: [
      { approach: 'Modular Digit Extraction', time: 'O(log10 N)', space: 'O(1)', pros: 'Does not allocate strings, adheres to 32-bit environment constraints', cons: 'Requires arithmetic boundary check' },
      { approach: 'String Reversal', time: 'O(log10 N)', space: 'O(D)', pros: 'Concise code', cons: 'Allocates string and array in memory' }
    ],
    interviewPitch: 'To reverse a 32-bit signed integer without string manipulation or 64-bit containers, we pop digits from the right using modulo 10 (`x % 10`) and truncate `x`. Before appending each digit to our result (`res * 10 + digit`), we must prevent 32-bit signed integer overflow outside `[-2^31, 2^31 - 1]`. Because `2^31 - 1 = 2147483647`, if `res > 214748364` or `(res === 214748364 && digit > 7)`, the next multiplication will overflow, so we return 0 immediately. Finally, we restore the original sign. This completes in at most 10 iterations, taking O(1) time and O(1) space.',
    followUps: [{ question: 'Why does the check use 7 for positive and 8 for negative limits?', answer: 'Because 2^31 - 1 ends in 7 (2147483647) and -2^31 ends in 8 (-2147483648).' }],
    recallQuiz: {
      question: 'What is the maximum value of a 32-bit signed integer?',
      options: ['2^31 - 1 = 2,147,483,647', '2^32 = 4,294,967,296', '2^16 = 65,536', '1,000,000,000'],
      correctIndex: 0,
      explanation: 'Signed 32-bit integers reserve 1 bit for sign, giving a positive range of 0 to 2^31 - 1.'
    }
  }
};

const fileHeader = `// Problems 136 to 150: Math & Geometry and Bit Manipulation Master Solutions
// Multi-Approach Solutions with JS & TS, Line-by-Line Breakdown, Dry Runs, Pitches, and Recall Quizzes
// Strictly adheres to AGENTS.md Section 4 Multi-Approach standard

export const MATH_BITWISE_SOLUTIONS = ${JSON.stringify(problems, null, 2)};
`;

fs.writeFileSync(targetPath, fileHeader, 'utf-8');
console.log('Successfully wrote', Object.keys(problems).length, 'Math & Bitwise solutions to:', targetPath);
