const fs = require('fs');
const path = require('path');

// 1. Load Batches
const batch1 = require('./react_notes_batch_1.json');
const batch2 = require('./react_notes_batch_2.json');
const { parts: batch3 } = require('./build_batch_3_p16_p21.cjs');

const metaByPart = {
  1: { badge: 'Foundations', color: '#61dafb' },
  2: { badge: 'JSX & Rendering', color: '#38bdf8' },
  3: { badge: 'Components', color: '#818cf8' },
  4: { badge: 'State & Lifecycle', color: '#a855f7' },
  5: { badge: 'Events & Forms', color: '#c084fc' },
  6: { badge: 'Hooks Suite', color: '#f472b6' },
  7: { badge: 'useEffect Mastery', color: '#fb7185' },
  8: { badge: 'Context API', color: '#34d399' },
  9: { badge: 'useReducer', color: '#2dd4bf' },
  10: { badge: 'Refs & Imperative', color: '#22d3ee' },
  11: { badge: 'Fiber & Reconciliation', color: '#38bdf8' },
  12: { badge: 'Performance & Profiler', color: '#fbbf24' },
  13: { badge: 'Error Boundaries & Suspense', color: '#f87171' },
  14: { badge: 'Enterprise Architecture', color: '#ec4899' },
  15: { badge: 'TypeScript Contracts', color: '#3178c6' },
  16: { badge: 'Testing From Zero', color: '#10b981' },
  17: { badge: 'Redux Toolkit (RTK)', color: '#764abc' },
  18: { badge: 'Zustand State', color: '#e879f9' },
  19: { badge: 'React Router', color: '#f97316' },
  20: { badge: 'Material UI (MUI)', color: '#007fff' },
  21: { badge: 'Server State & Projects', color: '#14b8a6' },
};

const combinedParts = [...batch1, ...batch2, ...batch3];

const seenSectionIds = new Set();
let totalSectionsCount = 0;

const validatedParts = combinedParts.map(part => {
  const meta = metaByPart[part.id] || { badge: 'React', color: '#61dafb' };
  
  const sections = part.sections.map((sec, idx) => {
    totalSectionsCount++;
    let secId = sec.id;
    // Standardize ID if needed
    if (!secId || seenSectionIds.has(secId)) {
      secId = `${part.id}.${idx + 1}`;
    }
    seenSectionIds.add(secId);

    return {
      id: secId,
      title: sec.title,
      content: sec.content || '',
      ...(sec.code ? { code: sec.code } : {}),
      ...(sec.comparisonTable ? { comparisonTable: sec.comparisonTable } : {}),
      ...(sec.keyTakeaways ? { keyTakeaways: sec.keyTakeaways } : {})
    };
  });

  return {
    id: part.id,
    title: part.title,
    badge: meta.badge,
    color: meta.color,
    sections
  };
});

console.log(`\nValidating React Notes Curriculum:`);
console.log(`Total Parts: ${validatedParts.length}`);
console.log(`Total Sections: ${totalSectionsCount}`);
console.log(`Unique Section IDs: ${seenSectionIds.size}`);

if (seenSectionIds.size !== totalSectionsCount) {
  console.error(`ERROR: Duplicate section IDs detected!`);
  process.exit(1);
}

// Generate file content for src/react/data/reactNotesData.js
const fileHeader = [
  '// React.js Master Notes — Beginner to Senior Developer',
  '// Universal 21-Part Technical Notes Curriculum Governed by AGENTS.md',
  '// Complete 16-Point Universal Blueprint for every concept.',
  '// Covers Core Fundamentals, Fiber Engine, TypeScript, RTL & Vitest Testing,',
  '// Redux Toolkit, Zustand, React Router v6/v7, Material UI & 13 Projects.',
  '',
  'export const REACT_NOTES_PARTS = '
].join('\n');

const fullFileContent = fileHeader + JSON.stringify(validatedParts, null, 2) + ';\n';

const targetPath = path.join(__dirname, '..', 'src', 'react', 'data', 'reactNotesData.js');
fs.writeFileSync(targetPath, fullFileContent, 'utf-8');

console.log(`\nSuccessfully wrote ${validatedParts.length} parts and ${totalSectionsCount} sections to:`);
console.log(targetPath);
