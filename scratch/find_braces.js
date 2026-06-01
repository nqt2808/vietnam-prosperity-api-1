const fs = require('fs');
const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log("=== Checking for duplicate curly braces ===");
lines.forEach((line, idx) => {
  if (line.includes('{{') || line.includes('{ {') || line.includes('}}') || line.includes('} }')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
