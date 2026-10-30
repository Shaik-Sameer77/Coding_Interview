const fs = require('fs');
const path = require('path');

const p1 = require('./gen_part1.cjs');
const p2 = require('./gen_part2.cjs');
const p3 = require('./gen_part3.cjs');
const p4 = require('./gen_part4.cjs');
const p5 = require('./gen_part5.cjs');
const p6 = require('./gen_part6.cjs');
const p7 = require('./gen_part7.cjs');

const allBatch1Parts = [p1, p2, p3, p4, p5, p6, p7];

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

console.log(`\nSuccessfully compiled Batch 1 with ${allBatch1Parts.length} parts and ${totalSections} total sections!`);
