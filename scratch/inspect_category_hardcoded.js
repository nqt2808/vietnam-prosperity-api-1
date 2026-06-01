const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../src/components/shared/storefront-client.tsx'),
  path.join(__dirname, '../index.html'),
  'C:\\Users\\dell 7620\\Desktop\\index.html'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  console.log(`\nAnalyzing file: ${file}`);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes('ly-tach') || line.toLowerCase().includes('ly / tách') || line.toLowerCase().includes('ly, tách')) {
      console.log(`  [Line ${index + 1}]: ${line.trim().substring(0, 120)}`);
    }
  });
});
