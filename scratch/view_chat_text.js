const fs = require('fs');
const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log("=== CHAT TEXT CONTEXT ===");
for (let i = 2840; i <= 2865; i++) {
  console.log(`${i}: ${lines[i-1] ? lines[i-1].trim() : 'EOF'}`);
}
