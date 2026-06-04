const fs = require('fs');
const content = fs.readFileSync('d:\\Du-an\\website-vpc\\index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('class="page') || line.includes('<main') || line.includes("class='page") || line.includes('id="menu"') || line.includes('id="merch"') || line.includes('id="blog"')) {
    console.log((idx+1) + ': ' + line.trim());
  }
});
