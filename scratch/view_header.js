const fs = require('fs');
const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log("=== HTML HEADER STRUCTURE ===");
for (let i = 2240; i <= 2280; i++) {
  console.log(`${i}: ${lines[i-1] ? lines[i-1].trim() : 'EOF'}`);
}
