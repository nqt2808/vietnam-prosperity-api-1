const fs = require('fs');
const filePath = 'd:\\Du-an\\website-vpc\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log("=== WORKSPACE VINFAST REPLY ===");
let print = false;
let count = 0;
lines.forEach((line, idx) => {
  if (line.includes('vinfast_event')) {
    print = true;
  }
  if (print) {
    console.log(`${idx + 1}: ${line.trim()}`);
    count++;
    if (count > 15) {
      print = false;
    }
  }
});
