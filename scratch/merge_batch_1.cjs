const fs = require('fs');
const path = require('path');

const { parts: p1_p2 } = require('./build_batch_1_p1_p2.cjs');
const { parts: p3_p4 } = require('./build_batch_1_p3_p4.cjs');
const { parts: p5_p6_p7 } = require('./build_batch_1_p5_p6_p7.cjs');

const allBatch1Parts = [...p1_p2, ...p3_p4, ...p5_p6_p7];

let totalSections = 0;
allBatch1Parts.forEach(p => {
  totalSections += p.sections.length;
  console.log(`Part ${p.id}: ${p.title} (${p.sections.length} sections)`);
});

fs.writeFileSync(
  path.join(__dirname, 'react_notes_batch_1.json'),
  JSON.stringify(allBatch1Parts, null, 2),
  'utf-8'
);

console.log(`\nSuccessfully compiled Batch 1 into scratch/react_notes_batch_1.json with ${allBatch1Parts.length} parts and ${totalSections} total sections!`);
