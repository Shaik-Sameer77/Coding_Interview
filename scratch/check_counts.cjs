const fs = require('fs');

const interview = fs.readFileSync('./src/node/data/nodeInterviewData.js', 'utf8');
const qMatches = interview.match(/question:\s*['"]/g);
console.log('Interview questions in nodeInterviewData.js:', qMatches ? qMatches.length : 0);

const coding = fs.readFileSync('./src/node/data/nodeQuestionsData.js', 'utf8');
const cMatches = coding.match(/id:\s*['"][^'"]+['"]/g);
console.log('Coding problems in nodeQuestionsData.js:', cMatches ? cMatches.length : 0);

const sys = fs.readFileSync('./src/node/data/nodeSystemDesignData.js', 'utf8');
const sMatches = sys.match(/id:\s*['"][^'"]+['"]/g);
console.log('System designs in nodeSystemDesignData.js:', sMatches ? sMatches.length : 0);
