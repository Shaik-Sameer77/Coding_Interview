const fs = require('fs');

function checkFile(filePath) {
  console.log('Checking ' + filePath);
  const code = fs.readFileSync(filePath, 'utf8');
  try {
    // Wrap in module simulation
    new Function('exports', 'require', 'module', '__filename', '__dirname', code.replace(/^export\s+/gm, ''));
    console.log('PASS: ' + filePath);
  } catch (err) {
    console.error('FAIL ' + filePath + ': ' + err.message);
    // Find line by testing cumulative lines
    const lines = code.split('\n');
    for (let i = 1; i <= lines.length; i++) {
      const slice = lines.slice(0, i).join('\n').replace(/^export\s+/gm, '');
      try {
        new Function('exports', slice + '\n}');
      } catch (e) {
        if (e.message.includes("Unexpected identifier 's'") || e.message.includes("Unexpected identifier 'values'") || e.message.includes("Unexpected identifier 'int'")) {
          console.log('Error around line ' + i + ': ' + lines[i-1]);
          break;
        }
      }
    }
  }
}

checkFile('./src/dsa/data/solutions/dsaBinarySearchSolutions.js');
checkFile('./src/dsa/data/solutions/dsaTreesSolutions.js');
checkFile('./src/dsa/data/solutions/dsaGraphsSolutions.js');
