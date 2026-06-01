const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const content = fs.readFileSync(indexHtmlPath, 'utf8');
const lines = content.split('\n');

let startLine = -1;
let endLine = -1;

lines.forEach((line, index) => {
  if (line.includes('<section id="about"') || line.includes('<section id=\'about\'')) {
    startLine = index;
  }
  if (startLine !== -1 && endLine === -1 && index > startLine && line.includes('</section>')) {
    endLine = index;
  }
});

console.log(`Found About section in index.html from lines ${startLine + 1} to ${endLine + 1}:`);
for (let i = startLine - 2; i <= endLine + 2; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
