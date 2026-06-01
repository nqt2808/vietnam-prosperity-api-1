const fs = require('fs');
const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log("=== Checking for 'EOF' in HTML ===");
lines.forEach((line, idx) => {
  if (line.trim() === 'EOF') {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
