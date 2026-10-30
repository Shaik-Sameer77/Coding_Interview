const { NODE_NOTES_PARTS } = require('../src/node/data/nodeNotesData.js');

console.log('Total parts:', NODE_NOTES_PARTS.length);
NODE_NOTES_PARTS.forEach(p => {
  console.log(`Part ${p.id}: ${p.title} (${p.sections.length} sections)`);
  p.sections.forEach(s => console.log(`   - [${s.id}] ${s.title}`));
});
