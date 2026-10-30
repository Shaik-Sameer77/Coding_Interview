const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const scratchDir = __dirname;
const files = fs.readdirSync(scratchDir).filter(f => f.endsWith('.cjs'));

console.log(`Testing ${files.length} .cjs files with node --check...\n`);

const failedFiles = [];
let cleanCount = 0;

for (const file of files) {
  const filePath = path.join(scratchDir, file);
  try {
    execSync(`node --check "${filePath}"`, { stdio: 'pipe' });
    cleanCount++;
  } catch (err) {
    const errorMsg = err.stderr ? err.stderr.toString() : err.message;
    failedFiles.push({ file, error: errorMsg });
    console.log(`❌ SYNTAX ERROR in ${file}:`);
    console.log(errorMsg.split('\n').slice(0, 4).join('\n'));
    console.log('---');
  }
}

console.log(`\nSummary: ${cleanCount} passed, ${failedFiles.length} failed.`);
fs.writeFileSync(path.join(__dirname, 'cjs_check_results.json'), JSON.stringify(failedFiles, null, 2), 'utf-8');
