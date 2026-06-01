const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const content = fs.readFileSync(indexHtmlPath, 'utf8');
const lines = content.split('\n');

console.log("=== SCANNING FOR ELEMENTS WITH class='page' IN index.html ===");

lines.forEach((line, index) => {
  if (line.includes('class="page"') || line.includes("class='page'") || line.includes('class="page active"') || line.includes('class=\'page active\'')) {
    console.log(`[Line ${index + 1}]: ${line.trim()}`);
  }
});
