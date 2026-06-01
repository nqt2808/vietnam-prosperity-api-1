const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log("Total lines:", lines.length);

console.log("=== Searching for 'showPage' ===");
let found = false;
lines.forEach((line, index) => {
  if (line.includes('showPage')) {
    console.log(`${index + 1}: ${line.trim()}`);
    found = true;
  }
});

if (!found) {
  console.log("No occurrences of 'showPage' found at all!");
}
