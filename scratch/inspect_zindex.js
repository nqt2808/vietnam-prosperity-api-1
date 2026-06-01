const fs = require('fs');
const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log("=== High z-index selectors ===");
lines.forEach((line, idx) => {
  if (line.includes('z-index')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // Print 3 lines before
    for (let i = Math.max(0, idx - 3); i < idx; i++) {
      console.log(`  [Before] Line ${i+1}: ${lines[i].trim()}`);
    }
  }
});
