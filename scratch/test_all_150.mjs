import { getDsaProblemDetails } from '../src/dsa/data/dsaSolutionsRegistry.js';
import { DSA_PROBLEMS_CATALOG } from '../src/dsa/data/dsaProblemsRegistry.js';

let errors = [];
let checked = 0;

for (const p of DSA_PROBLEMS_CATALOG) {
  const details = getDsaProblemDetails(p.id);
  checked++;
  if (!details) {
    errors.push(`Problem #${p.id} returned null!`);
    continue;
  }
  if (!details.approaches || details.approaches.length !== 3) {
    errors.push(`Problem #${p.id} approaches length = ${details.approaches?.length} (expected 3)`);
  }
  if (!details.rules || details.rules.length === 0) {
    errors.push(`Problem #${p.id} missing rules!`);
  }
  if (!details.intuition) {
    errors.push(`Problem #${p.id} missing intuition!`);
  }
  if (!details.interviewClues || details.interviewClues.length === 0) {
    errors.push(`Problem #${p.id} missing interviewClues!`);
  }
  if (!details.edgeCases || details.edgeCases.length === 0) {
    errors.push(`Problem #${p.id} missing edgeCases!`);
  }
}

console.log(`Audited ${checked} DSA problems in catalog.`);
if (errors.length === 0) {
  console.log('✅ ALL DSA PROBLEMS (1-150) HAVE EXACTLY 3 APPROACHES, RULES, INTUITION, CLUES, AND EDGE CASES!');
} else {
  console.log(`❌ Found ${errors.length} issues:`, errors.slice(0, 10));
}

// Check sample problems
for (const id of [1, 3, 4, 5, 30, 39, 51, 85, 100, 150]) {
  const prob = getDsaProblemDetails(id);
  console.log(`Problem #${id} (${prob.title}):`);
  console.log(`  Approaches:`, prob.approaches.map(a => a.name));
  console.log(`  Rules count:`, prob.rules.length);
  console.log(`  Has intuition?`, !!prob.intuition);
}
