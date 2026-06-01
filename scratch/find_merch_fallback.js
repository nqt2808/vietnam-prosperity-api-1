const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../index.html'),
  'C:\\Users\\dell 7620\\Desktop\\index.html'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  console.log(`\n========================================\nSearching fallback in: ${file}`);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    if (line.includes('Ly / Tách') || line.includes('Ly tách') || line.includes('Ly/Tách') || line.includes('ly-tach')) {
      console.log(`  [Line ${idx + 1}]: ${line.trim().substring(0, 120)}`);
    }
  });
});
