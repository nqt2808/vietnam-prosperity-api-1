const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const content = fs.readFileSync(indexHtmlPath, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCHING FOR TABS LOGIC IN index.html ===");

lines.forEach((line, index) => {
  if (line.includes('function showPage') || line.includes('showPage(') || line.includes('function switchTab') || line.includes('switchTab(')) {
    console.log(`[Line ${index + 1}]: ${line.trim()}`);
    for (let i = Math.max(0, index - 5); i < Math.min(lines.length, index + 35); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
