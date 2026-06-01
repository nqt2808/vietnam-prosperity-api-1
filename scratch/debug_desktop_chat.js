const fs = require('fs');
const path = require('path');

const desktopIndexHtml = 'C:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(desktopIndexHtml, 'utf8');
const lines = content.split('\n');

console.log('Searching for "<div class="quick-chat">" in Desktop index.html:');
let count = 0;
lines.forEach((line, index) => {
  if (line.includes('<div class="quick-chat">') || line.includes('class="quick-chat"')) {
    count++;
    console.log(`Match ${count} at Line ${index + 1}: ${line.trim()}`);
    // In ra 12 dòng tiếp theo
    console.log('--- Printing next 12 lines ---');
    for (let i = index; i < Math.min(lines.length, index + 12); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
