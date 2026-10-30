// scratch/combine_js_questions.cjs
const fs = require('fs');
const path = require('path');

const batch1 = require('./js_q_batch_1.cjs');
const batch2 = require('./js_q_batch_2.cjs');
const batch3 = require('./js_q_batch_3.cjs');
const batch4 = require('./js_q_batch_4.cjs');
const batch5 = require('./js_q_batch_5.cjs');

const allQuestions = [...batch1, ...batch2, ...batch3, ...batch4, ...batch5];

console.log(`Total questions loaded: ${allQuestions.length}`);

// Validate IDs
for (let i = 1; i <= 200; i++) {
  const found = allQuestions.find(q => q.id === i);
  if (!found) {
    console.error(`Missing question ID: ${i}`);
    process.exit(1);
  }
}

const topics = [
  { id: 1, range: "Q1–15", title: "Fundamentals, Types & Coercion", count: 15 },
  { id: 2, range: "Q16–30", title: "Scope, Hoisting & Execution Context", count: 15 },
  { id: 3, range: "Q31–45", title: "Functions, Closures & this", count: 15 },
  { id: 4, range: "Q46–60", title: "Objects, Prototypes & Classes", count: 15 },
  { id: 5, range: "Q61–75", title: "Arrays, Maps, Sets & Collections", count: 15 },
  { id: 6, range: "Q76–90", title: "Async JavaScript & Event Loop", count: 15 },
  { id: 7, range: "Q91–105", title: "ES6+, Modules, Errors & Memory", count: 15 },
  { id: 8, range: "Q106–120", title: "Output Prediction & Debugging", count: 15 },
  { id: 9, range: "Q121–135", title: "Practical JavaScript Coding Questions", count: 15 },
  { id: 10, range: "Q136–150", title: "Advanced Concepts, Polyfills & Senior Scenarios", count: 15 },
  { id: 11, range: "Q151–175", title: "Essential Coding Challenges (Multiple Approaches)", count: 25 },
  { id: 12, range: "Q176–200", title: "Advanced DSA & Functional Patterns in JS", count: 25 }
];

const fileContent = `// JavaScript Master Interview Guide — 200 Questions, Solutions & Algorithms
// Foundation Finance Company | Full Stack Developer / SDE Screening Preparation
// Fully upgraded to meet AGENTS.md standards: Direct Pitch, Engine Mechanics, Real-World Use, and Multiple Approaches.

export const JS_INTERVIEW_TOPICS = ${JSON.stringify(topics, null, 2)};

export const JS_150_QUESTIONS = ${JSON.stringify(allQuestions, null, 2)};
`;

const targetPath = path.resolve(__dirname, '../src/javascript/data/javascriptInterviewData.js');
fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log(`Successfully written 200 questions to ${targetPath}`);
