const fs = require('fs');
const content = fs.readFileSync('d:\\Du-an\\website-vpc\\index.html', 'utf8');
const lines = content.split('\n');
for (let i = 4580 - 1; i < 4680; i++) {
  if (lines[i] !== undefined) {
    console.log((i+1) + ': ' + lines[i]);
  }
}
