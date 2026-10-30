const fs = require('fs');
const path = require('path');

// Let's dynamically import the solutions or parse them by regex
const files = [
  'dsaDay1Solutions.js',
  'dsaHashingSolutions.js',
  'dsaTwoPointersSolutions.js',
  'dsaCoreRegistrySolutions.js',
  'dsaAdvancedPatternSolutions.js',
  'dsaBinarySearchSolutions.js',
  'dsaLinkedListSolutions.js',
  'dsaTreesSolutions.js',
  'dsaHeapSolutions.js',
  'dsaBacktrackingTriesSolutions.js',
  'dsaGraphsSolutions.js',
  'dsaDpSolutions.js',
  'dsaGreedyIntervalsSolutions.js',
  'dsaMathBitwiseSolutions.js'
];

const results = [];

for (const file of files) {
  const filePath = path.resolve('src/dsa/data/solutions', file);
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Split by problem ID: e.g. "  1: {" or "  10: {"
  const problemBlocks = content.split(/\n\s*(\d+):\s*\{/g);
  for (let i = 1; i < problemBlocks.length; i += 2) {
    const id = problemBlocks[i];
    const block = problemBlocks[i + 1];
    
    // Check how many approaches
    const appMatches = block.match(/name:\s*['"]Approach\s*\d+/g) || [];
    const count = appMatches.length;
    if (count < 3) {
      results.push({ file, id: Number(id), count });
    }
  }
}

console.log(`Found ${results.length} problems with fewer than 3 approaches:`);
console.log(JSON.stringify(results, null, 2));
