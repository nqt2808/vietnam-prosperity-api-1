const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const keywords = ['Ly / Tách / Bình giữ nhiệt', 'Ly / Tách', 'Ly, Tách', 'ly-tach-binh-giu-nhiet'];

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        searchDir(filePath);
      }
    } else {
      const ext = path.extname(file);
      if (['.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.css'].includes(ext)) {
        const content = fs.readFileSync(filePath, 'utf8');
        keywords.forEach(kw => {
          if (content.toLowerCase().includes(kw.toLowerCase())) {
            console.log(`Found "${kw}" in ${path.relative(rootDir, filePath)}:`);
            const lines = content.split('\n');
            lines.forEach((line, idx) => {
              if (line.toLowerCase().includes(kw.toLowerCase())) {
                console.log(`  [Line ${idx + 1}]: ${line.trim().substring(0, 100)}`);
              }
            });
          }
        });
      }
    }
  });
}

searchDir(rootDir);
