const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/screening/data/foundationFinanceData.js');
let content = fs.readFileSync(filePath, 'utf8');

const corruptedStart = '"Can you join earlier?",';
const idx = content.indexOf(corruptedStart);

if (idx !== -1) {
  const answerStart = content.indexOf('"answer":', idx);
  const answerEnd = content.indexOf('"keyTakeaway":', answerStart);
  if (answerStart !== -1 && answerEnd !== -1) {
    const cleanFollowUp = '"answer": "My contractual notice period is 30 days. Once an official offer is extended, I can formally discuss with my current manager whether an earlier release is feasible based on the state of my knowledge transfer and handover. However, I want to be transparent and commit to the full 30 days so my team is not left without a proper handover."\n      }\n    ],\n    ';
    content = content.slice(0, answerStart) + cleanFollowUp + content.slice(answerEnd);
    content = content.replace('"question": "Are you comfortable with a hybrid role in Hyderabad, and what is your",', '"question": "Are you comfortable with a hybrid role in Hyderabad, and what is your notice period?",');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully cleaned question 13 in foundationFinanceData.js!');
  } else {
    console.log('Could not find answer bounds');
  }
} else {
  console.log('Could not find corruptedStart');
}
