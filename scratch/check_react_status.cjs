const fs = require('fs');
const path = require('path');

// 1. Check reactNotesData.js
const notesContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'react', 'data', 'reactNotesData.js'), 'utf-8');
const parts = notesContent.match(/"id":\s*(\d+),/g) || [];
const sections = notesContent.match(/"id":\s*"([^"]+)",/g) || [];
console.log('reactNotesData.js:');
console.log('  Total Parts:', parts.length);
console.log('  Total Sections:', sections.length);

// 2. Check reactInterviewData.js
const interviewContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'react', 'data', 'reactInterviewData.js'), 'utf-8');
const interviewQuestions = interviewContent.match(/"id":\s*(\d+),/g) || [];
// minus the topics (16 topics + 1 "all" has no number id in "id": (\d+), but 16 topic numbers)
console.log('reactInterviewData.js:');
console.log('  Total Questions + Topic IDs with numeric id:', interviewQuestions.length);

// 3. Check questionsData.js
const codingContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'react', 'data', 'questionsData.js'), 'utf-8');
const codingProblems = codingContent.match(/id:\s*(\d+),/g) || [];
console.log('questionsData.js:');
console.log('  Total Coding Problems:', codingProblems.length);
