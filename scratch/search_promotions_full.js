const fs = require('fs');
const path = require('path');

const projectPath = 'd:\\Du-an\\website-vpc\\index.html';
const content = fs.readFileSync(projectPath, 'utf8');
const lines = content.split('\n');

for (let i = 5380; i < 5420; i++) {
  if (lines[i]) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
