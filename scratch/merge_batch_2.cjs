const fs = require('fs');
const path = require('path');

const { parts: p8_p11 } = require('./build_batch_2_p8_p11.cjs');
const { parts: p12_p15 } = require('./build_batch_2_p12_p15.cjs');

const allBatch2Parts = [...p8_p11, ...p12_p15];

let totalSections = 0;
allBatch2Parts.forEach(p => {
  totalSections += p.sections.length;
  console.log(`Part ${p.id}: ${p.title} (${p.sections.length} sections)`);
});

fs.writeFileSync(
  path.join(__dirname, 'react_notes_batch_2.json'),
  JSON.stringify(allBatch2Parts, null, 2),
  'utf-8'
);

console.log(`\nSuccessfully compiled Batch 2 into scratch/react_notes_batch_2.json with ${allBatch2Parts.length} parts and ${totalSections} total sections!`);
