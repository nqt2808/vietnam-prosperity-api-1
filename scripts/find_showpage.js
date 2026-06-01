const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const lines = html.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('showPage')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
