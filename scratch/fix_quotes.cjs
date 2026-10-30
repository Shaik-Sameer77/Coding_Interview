const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../src/dsa/data/solutions/dsaLinkedListSolutions.js'),
  path.join(__dirname, '../src/dsa/data/solutions/dsaTreesSolutions.js'),
  path.join(__dirname, '../src/dsa/data/solutions/dsaHeapSolutions.js'),
  path.join(__dirname, '../src/dsa/data/solutions/dsaBacktrackingTriesSolutions.js'),
  path.join(__dirname, '../src/dsa/data/solutions/dsaGraphsSolutions.js')
];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let content = fs.readFileSync(f, 'utf8');

  // Replace common unescaped apostrophes inside single quotes
  content = content.replace(/'Iterate through the list, rewiring each node's next pointer to point to the previous node.'/g,
    `"Iterate through the list, rewiring each node's next pointer to point to the previous node."`);
  content = content.replace(/'Line 5-6: Rewire: head\.next's next points back to head, clear head\.next to prevent cycles\.'/g,
    `"Line 5-6: Rewire: head.next's next points back to head, clear head.next to prevent cycles."`);
  content = content.replace(/Floyd's/g, `Floyd\\'s`);
  content = content.replace(/node's/g, `node\\'s`);
  content = content.replace(/head's/g, `head\\'s`);
  content = content.replace(/key's/g, `key\\'s`);
  content = content.replace(/Koko's/g, `Koko\\'s`);
  content = content.replace(/it's/g, `it\\'s`);
  content = content.replace(/tree's/g, `tree\\'s`);
  content = content.replace(/level's/g, `level\\'s`);
  content = content.replace(/courses'/g, `courses\\'`);
  content = content.replace(/course's/g, `course\\'s`);
  content = content.replace(/Kahn's/g, `Kahn\\'s`);

  fs.writeFileSync(f, content, 'utf8');
}

console.log('Fixed quotes in solution files!');
