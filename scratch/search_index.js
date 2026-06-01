const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

for (let i = 5000; i < 5090; i++) {
  if (lines[i]) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
