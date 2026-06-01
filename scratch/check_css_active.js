const fs = require('fs');
const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log("=== Checking CSS for .page and active classes ===");
lines.forEach((line, idx) => {
  if (line.includes('.page') || line.includes('active')) {
    if (idx < 2877) { // Only in CSS part
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
