const fs = require('fs');
const filePath = 'd:\\Du-an\\website-vpc\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('paymentQR.src =')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
