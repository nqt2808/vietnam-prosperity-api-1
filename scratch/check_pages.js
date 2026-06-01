const fs = require('fs');
const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log("=== Page Elements Definition ===");
lines.forEach((line, idx) => {
  if (line.includes('class="page"') || line.includes("class='page'") || line.includes("class=\"page active\"")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
