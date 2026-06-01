const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const content = fs.readFileSync(indexHtmlPath, 'utf8');
const lines = content.split(/\r?\n/);

console.log("=== Chatbox in index.html (lines 2875 to 2930) ===");
for (let i = 2874; i < Math.min(lines.length, 2940); i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
