const fs = require('fs');
const filePath = 'd:\\Du-an\\website-vpc\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log("=== WORKSPACE CART DECLARATION ===");
for (let i = 3600; i <= 3650; i++) {
  console.log(`${i}: ${lines[i-1] ? lines[i-1].trim() : 'EOF'}`);
}
