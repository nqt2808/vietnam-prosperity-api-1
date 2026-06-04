const fs = require('fs');
const content = fs.readFileSync('d:\\Du-an\\website-vpc\\index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('main-nav') || line.includes('header-inner') || line.includes('site-header')) {
    console.log((idx+1) + ': ' + line.trim());
  }
});
