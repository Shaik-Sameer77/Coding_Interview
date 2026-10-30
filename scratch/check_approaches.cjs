const fs = require('fs');
const path = require('path');

const solutionsDir = path.resolve('src/dsa/data/solutions');
const files = fs.readdirSync(solutionsDir).filter(f => f.endsWith('.js'));
console.log('Found solution files:', files.length);

let problemsWithFewerThan3 = [];
let totalAuthored = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(solutionsDir, file), 'utf8');
  const regex = /(\d+):\s*\{\s*id:\s*\d+[\s\S]*?approaches:\s*\[([\s\S]*?)\]\s*,\s*(?:prerequisites|solutionCode|steps|rules|timeComplexity)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    totalAuthored++;
    const approachesBlock = match[2];
    const appCount = (approachesBlock.match(/name:\s*['"]Approach/g) || []).length;
    if (appCount < 3) {
      problemsWithFewerThan3.push({ id, file, count: appCount });
    }
  }
}

console.log('Total authored found:', totalAuthored);
console.log('Problems with < 3 approaches in authored files:', problemsWithFewerThan3.length);
if (problemsWithFewerThan3.length > 0) {
  console.log('Sample:', problemsWithFewerThan3.slice(0, 15));
}
