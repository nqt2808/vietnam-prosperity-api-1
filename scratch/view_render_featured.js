const fs = require('fs');
const content = fs.readFileSync('d:\\Du-an\\website-vpc\\index.html', 'utf8');
const lines = content.split('\n');
for (let i = 4340 - 1; i < 4398; i++) {
  if (lines[i] !== undefined) {
    console.log((i+1) + ': ' + lines[i]);
  }
}
