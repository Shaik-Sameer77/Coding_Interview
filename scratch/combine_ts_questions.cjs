// scratch/combine_ts_questions.cjs
// Combines and validates all 150 TypeScript interview and coding questions.

const fs = require('fs');
const path = require('path');

const batch1 = require('./ts_q_batch_1.cjs');
const batch2 = require('./ts_q_batch_2.cjs');
const batch3 = require('./ts_q_batch_3.cjs');
const batch4 = require('./ts_q_batch_4.cjs');
const batch5 = require('./ts_q_batch_5.cjs');

const allQuestions = [...batch1, ...batch2, ...batch3, ...batch4, ...batch5];

console.log(`Total questions loaded: ${allQuestions.length}`);

// Validate IDs 1 to 150
for (let i = 1; i <= 150; i++) {
  const found = allQuestions.find(q => q.id === i);
  if (!found) {
    console.error(`Missing question ID: ${i}`);
    process.exit(1);
  }
}

// Check for duplicates
const ids = new Set();
for (const q of allQuestions) {
  if (ids.has(q.id)) {
    console.error(`Duplicate question ID found: ${q.id}`);
    process.exit(1);
  }
  ids.add(q.id);
}

console.log("All 150 IDs verified unique and sequential.");

const TS_INTERVIEW_PARTS = [
  { id: 'all', title: 'All Questions', count: 150, color: '#38bdf8' },
  { id: 1, title: 'Part 1: Fundamentals & Annotations', count: 20, color: '#60a5fa' },
  { id: 2, title: 'Part 2: Core Types & Special Types', count: 20, color: '#38bdf8' },
  { id: 3, title: 'Part 3: Interfaces & Object Modeling', count: 10, color: '#818cf8' },
  { id: 4, title: 'Part 4: Generics & Reusable Design', count: 10, color: '#a78bfa' },
  { id: 5, title: 'Part 5: Advanced & Utility Types', count: 15, color: '#c084fc' },
  { id: 6, title: 'Part 6: Type Operators & Metaprogramming', count: 10, color: '#e879f9' },
  { id: 7, title: 'Part 7: Classes, OOP & Encapsulation', count: 10, color: '#f472b6' },
  { id: 8, title: 'Part 8: Modules, Async & Errors', count: 10, color: '#fb7185' },
  { id: 9, title: 'Part 9: React 19, Node.js & NestJS', count: 15, color: '#34d399' },
  { id: 10, title: 'Part 10: Compiler & Runtime Safety', count: 15, color: '#f59e0b' },
  { id: 11, title: 'Part 11: Coding & Debugging Exercises', count: 15, color: '#10b981' }
];

const TS_STUDY_SESSIONS = [
  {
    session: 1,
    range: "Q1–Q20",
    title: "Session 1: Foundations & Type Checker",
    description: "Core primitives, type annotations vs inference, let vs const literal widening, and basic array/tuple contracts.",
    topics: ["Superset Model", "Compiler vs Runtime", "Primitives", "Type Annotations", "Inference", "Arrays & Tuples"]
  },
  {
    session: 2,
    range: "Q21–Q40",
    title: "Session 2: Core Type System & Narrowing",
    description: "Mastering top and bottom types (any, unknown, never, void), strict mode flags, and control-flow type guards.",
    topics: ["any vs unknown", "never Exhaustiveness", "strictNullChecks", "Discriminated Unions", "Type Predicates", "satisfies"]
  },
  {
    session: 3,
    range: "Q41–Q60",
    title: "Session 3: Interfaces, Structural Typing & Generics",
    description: "Deep dive into interface extension, declaration merging, structural assignability, and generic constraints.",
    topics: ["Interfaces vs Types", "Declaration Merging", "Structural Duck Typing", "Generics", "Generic Constraints", "API Envelopes"]
  },
  {
    session: 4,
    range: "Q61–Q95",
    title: "Session 4: Utility Types, Metaprogramming & OOP",
    description: "Built-in utility types, conditional types, infer pattern matching, mapped template literals, and classes.",
    topics: ["Utility Types", "keyof & typeof", "Conditional Types & infer", "Mapped Types", "Enums vs as const", "OOP & Classes"]
  },
  {
    session: 5,
    range: "Q96–Q120",
    title: "Session 5: Full-Stack Integration (React & NestJS)",
    description: "React 19 props/hooks typing, Zustand store typing, NestJS DTO classes, and database entities.",
    topics: ["import type", "React Component Props", "useRef & useState", "NestJS DTOs", "Express Typing", "Environment Variables"]
  },
  {
    session: 6,
    range: "Q121–Q150",
    title: "Session 6: Compiler Internals, Debugging & Algorithms",
    description: "Compiler internals, variance, branded types, compiler diagnostics debugging, and multi-approach algorithms.",
    topics: ["Variance", "Branded Types", "Diagnostics", "Multi-Approach DSA", "String Reversal", "Deduplication"]
  }
];

const fileContent = `// TypeScript Master Interview Guide — 150 Questions, Answers & Multi-Approach Algorithms
// Foundation Finance Company · Full Stack Developer / SDE Screening Preparation
// Fully upgraded to meet AGENTS.md standards: Spoken Pitch, Compiler vs Runtime, Follow-ups, and Multiple Approaches.

export const TS_INTERVIEW_PARTS = ${JSON.stringify(TS_INTERVIEW_PARTS, null, 2)};

export const TS_STUDY_SESSIONS = ${JSON.stringify(TS_STUDY_SESSIONS, null, 2)};

export const TS_150_QUESTIONS = ${JSON.stringify(allQuestions, null, 2)};
`;

const targetPath = path.resolve(__dirname, '../src/typescript/data/typescriptInterviewData.js');
fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log(`Successfully written 150 questions to ${targetPath}`);
