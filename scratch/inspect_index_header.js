const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const content = fs.readFileSync(indexHtmlPath, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCHING FOR HEADER NAV BUTTONS IN index.html ===");

lines.forEach((line, index) => {
  if (line.includes('class="nav-btn"') || line.includes('class=\'nav-btn\'') || line.includes('nav-btn') && line.includes('showPage')) {
    console.log(`[Line ${index + 1}]: ${line.trim()}`);
  }
});
