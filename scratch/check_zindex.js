const fs = require('fs');
const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const zIndexRegex = /z-index:\s*(\d+)/gi;
let match;
console.log("=== Checking z-index properties ===");
while ((match = zIndexRegex.exec(content)) !== null) {
  console.log(`z-index value: ${match[1]}`);
}
