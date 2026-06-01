const fs = require('fs');

const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf-8');

const keywords = [
  'mousse',
  'croissant',
  'tiramisu',
  'Double Espresso',
  'Cà phê muối Legend'
];

console.log('Searching in:', filePath);
keywords.forEach(kw => {
  let pos = 0;
  let count = 0;
  while ((pos = content.indexOf(kw, pos)) !== -1) {
    count++;
    const linesBefore = content.substring(0, pos).split('\n');
    const lineNum = linesBefore.length;
    const lineContent = linesBefore[lineNum - 1] + content.substring(pos, content.indexOf('\n', pos)).substring(kw.length);
    console.log(`Found "${kw}" at line ${lineNum}: ${lineContent.trim().substring(0, 100)}`);
    pos += kw.length;
  }
  if (count === 0) {
    console.log(`Keyword "${kw}" NOT found.`);
  }
});
