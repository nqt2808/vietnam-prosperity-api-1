const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const content = fs.readFileSync(indexHtmlPath, 'utf8');
const lines = content.split('\n');

console.log('Searching for About page CSS classes in index.html:');
lines.forEach((line, idx) => {
  if (line.includes('.about-row') || line.includes('.about-text') || line.includes('.about-img') || line.includes('.about-img-col')) {
    console.log(`[Line ${idx + 1}]: ${line.trim()}`);
    // In ra 8 dòng tiếp theo của định nghĩa CSS
    for (let i = idx; i < Math.min(lines.length, idx + 8); i++) {
      console.log(`  ${i + 1}: ${lines[i]}`);
    }
  }
});
