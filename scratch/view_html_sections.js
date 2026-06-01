const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const content = fs.readFileSync(indexHtmlPath, 'utf8');
const lines = content.split(/\r?\n/);

console.log("=== About Page in index.html (lines 2610 to 2690) ===");
for (let i = 2609; i < Math.min(lines.length, 2695); i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
