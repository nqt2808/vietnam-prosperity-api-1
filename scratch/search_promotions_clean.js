const fs = require('fs');
const path = require('path');

const projectPath = path.join(__dirname, '../index.html');
const content = fs.readFileSync(projectPath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('"promotions"') || line.includes("'promotions'")) {
    console.log(`Found 'promotions' at line ${index + 1}:`);
    for (let i = Math.max(0, index - 2); i < Math.min(lines.length, index + 35); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
