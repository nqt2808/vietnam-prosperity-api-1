const fs = require('fs');
const content = fs.readFileSync('d:\\Du-an\\website-vpc\\index.html', 'utf8');
const lines = content.split('\n');

function printFunction(name) {
  console.log(`=== Function ${name} ===`);
  let found = false;
  let braces = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`async function ${name}`) || lines[i].includes(`function ${name}`)) {
      found = true;
    }
    if (found) {
      console.log((i+1) + ': ' + lines[i]);
      const open = (lines[i].match(/{/g) || []).length;
      const close = (lines[i].match(/}/g) || []).length;
      braces += open - close;
      if (braces === 0 && i > 3000) {
        break;
      }
    }
  }
}

printFunction('renderMenu');
printFunction('renderMerch');
printFunction('renderBlog');
