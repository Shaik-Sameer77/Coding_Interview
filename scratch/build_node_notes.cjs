// scratch/build_node_notes.cjs
const fs = require('fs');
const path = require('path');

const parts1to8 = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'node_notes_parts_1_to_8.json'), 'utf-8'));
const parts9to16 = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'node_notes_parts_9_to_16.json'), 'utf-8'));
const parts17to24 = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'node_notes_parts_17_to_24.json'), 'utf-8'));

const allParts = [...parts1to8, ...parts9to16, ...parts17to24];

console.log(`Loaded ${allParts.length} parts for Node.js & Backend Master Notes.`);
let totalSections = 0;
allParts.forEach(p => {
  totalSections += p.sections.length;
  console.log(`Part ${p.id}: ${p.title} (${p.sections.length} sections)`);
});
console.log(`Total sections: ${totalSections}`);

const fileContent = `// Node.js & Backend Engineering Master Notes — Beginner to Senior Production Engineer
// Universal 24-Part Technical Curriculum Governed by AGENTS.md
// Covers Node.js Architecture, V8 & Libuv, Express Core & 3-Tier Architecture,
// Dedicated CORS & Helmet Security, TypeScript Backend, MongoDB & Mongoose Modeling,
// MySQL & Relational ACID, MongoDB vs MySQL Decision Matrix, Vitest & Supertest Testing,
// Webhooks & Payments, AWS Cloud, Docker & CI/CD, 17 System Design Blueprints & 15 Projects.

export const NODE_NOTES_PARTS = ${JSON.stringify(allParts, null, 2)};
`;

const targetPath = path.resolve(__dirname, '../src/node/data/nodeNotesData.js');
fs.writeFileSync(targetPath, fileContent, 'utf-8');
console.log(`Successfully updated ${targetPath} with ${allParts.length} parts and ${totalSections} sections.`);
