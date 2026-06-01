const fs = require('fs');

const file1 = 'd:\\Du-an\\website-vpc\\index.html';
const file2 = 'c:\\Users\\dell 7620\\Desktop\\index.html';

const lines1 = fs.readFileSync(file1, 'utf8').replace(/\r\n/g, '\n').split('\n');
const lines2 = fs.readFileSync(file2, 'utf8').replace(/\r\n/g, '\n').split('\n');

console.log("=== WORKSPACE (around line 5320) ===");
for (let i = 5310; i <= 5345; i++) {
  console.log(`${i}: ${lines1[i-1] ? lines1[i-1].trim() : 'EOF'}`);
}

console.log("\n=== DESKTOP (around line 5320) ===");
for (let i = 5310; i <= 5345; i++) {
  console.log(`${i}: ${lines2[i-1] ? lines2[i-1].trim() : 'EOF'}`);
}
