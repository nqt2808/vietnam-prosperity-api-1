const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../src/components/shared/storefront-client.tsx'),
  path.join(__dirname, '../index.html'),
  'C:\\Users\\dell 7620\\Desktop\\index.html'
];

const keywords = ['Ly / Tách / Bình giữ nhiệt', 'Ly / Tách', 'Bình giữ nhiệt'];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    return;
  }
  console.log(`\n========================================\nAnalyzing: ${file}`);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  keywords.forEach(kw => {
    let foundCount = 0;
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(kw.toLowerCase())) {
        foundCount++;
        console.log(`[Line ${index + 1}] (${kw}): ${line.trim().substring(0, 120)}`);
      }
    });
  });
});
