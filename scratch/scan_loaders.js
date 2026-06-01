const fs = require('fs');
const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const keywords = ['loader', 'loading', 'spinner', 'overlay', 'backdrop', 'preloader'];
console.log("=== Checking Loader/Overlay terms in index.html ===");

const lines = content.split('\n');
lines.forEach((line, idx) => {
  keywords.forEach(kw => {
    if (line.toLowerCase().includes(kw)) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
});
