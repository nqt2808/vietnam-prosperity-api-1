const fs = require('fs');
const path = require('path');

const projectPath = path.join(__dirname, '../index.html');
const content = fs.readFileSync(projectPath, 'utf-8');
const lines = content.split('\n');

console.log("--- Scanning for capitalized VPC names in index.html ---");
lines.forEach((line, index) => {
  if (line.includes('VIETNAM PROSPERITY COFFEE')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
