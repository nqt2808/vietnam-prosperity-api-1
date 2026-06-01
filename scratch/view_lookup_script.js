const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const content = fs.readFileSync(indexHtmlPath, 'utf8');
const lines = content.split(/\r?\n/);

console.log("=== Lookup Script in index.html (lines 5040 to 5165) ===");
for (let i = 5039; i < Math.min(lines.length, 5170); i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
