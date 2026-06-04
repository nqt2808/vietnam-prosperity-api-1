const fs = require('fs');
const content = fs.readFileSync('d:\\Du-an\\website-vpc\\index.html', 'utf8');
const lines = content.split('\n');
let inShowPage = false;
let brackets = 0;
lines.forEach((line, idx) => {
  if (line.includes('function showPage')) {
    inShowPage = true;
  }
  if (inShowPage) {
    console.log((idx+1) + ': ' + line);
    // count open and close braces to know when the function ends
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    brackets += openBraces - closeBraces;
    if (brackets === 0 && idx > 3000) { // arbitrary buffer
      inShowPage = false;
    }
  }
});
