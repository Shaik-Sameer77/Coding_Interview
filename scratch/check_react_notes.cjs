const { REACT_NOTES_PARTS } = require('../src/react/data/reactNotesData.js');

console.log('Total parts:', REACT_NOTES_PARTS.length);
let totalSecs = 0;
let totalContentLength = 0;
REACT_NOTES_PARTS.forEach(p => {
  totalSecs += p.sections.length;
  console.log(`\n=== Part ${p.id}: ${p.title} (${p.sections.length} sections) ===`);
  p.sections.forEach(s => {
    const len = s.content ? s.content.length : 0;
    totalContentLength += len;
    console.log(`   [${s.id}] ${s.title} (chars: ${len})`);
  });
});
console.log(`\nTotal parts: ${REACT_NOTES_PARTS.length}, Total sections: ${totalSecs}, Total chars: ${totalContentLength}`);
