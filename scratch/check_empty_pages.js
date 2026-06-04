const fs = require('fs');
const content = fs.readFileSync('d:\\Du-an\\website-vpc\\index.html', 'utf8');
const lines = content.split('\n');

function printSection(tagId) {
  console.log(`=== Section id="${tagId}" ===`);
  let found = false;
  let printedCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`id="${tagId}"`) && lines[i].includes('<main')) {
      found = true;
    }
    if (found) {
      console.log((i+1) + ': ' + lines[i]);
      printedCount++;
      if (printedCount > 12) {
        break;
      }
    }
  }
}

printSection('menu');
printSection('merch');
printSection('blog');
