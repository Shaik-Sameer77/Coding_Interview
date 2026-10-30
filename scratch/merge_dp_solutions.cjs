const fs = require('fs');
const path = require('path');

const p1 = require('./build_dp_part1.cjs');
const p2 = require('./build_dp_part2.cjs');
const p3 = require('./build_dp_part3.cjs');

const all = { ...p1, ...p2, ...p3 };
const targetPath = path.join(__dirname, '../src/dsa/data/solutions/dsaDpSolutions.js');

const fileHeader = `// Problems 101 to 123: Dynamic Programming (1D & 2D) Master Solutions
// Multi-Approach Solutions with JS & TS, Line-by-Line Breakdown, Dry Runs, Pitches, and Recall Quizzes
// Strictly adheres to AGENTS.md Section 4 Multi-Approach standard

export const DP_SOLUTIONS = ${JSON.stringify(all, null, 2)};
`;

fs.writeFileSync(targetPath, fileHeader, 'utf-8');
console.log('Successfully wrote', Object.keys(all).length, 'DP solutions to:', targetPath);
