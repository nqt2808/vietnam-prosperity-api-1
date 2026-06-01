const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const content = fs.readFileSync(indexHtmlPath, 'utf8');
const lines = content.split(/\r?\n/);

console.log("=== Chatbot Script in index.html (lines 5350 to 5480) ===");
for (let i = 5349; i < Math.min(lines.length, 5490); i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
