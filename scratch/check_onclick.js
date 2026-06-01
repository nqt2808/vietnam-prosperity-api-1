const fs = require('fs');

const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const onclickRegex = /onclick=(["'])([\s\S]*?)\1/gi;
let match;
let count = 0;

console.log("=== Checking onclick attributes in HTML ===");
while ((match = onclickRegex.exec(content)) !== null) {
  count++;
  const quote = match[1];
  const code = match[2];
  
  // Try to parse the onclick code as JS to check for syntax errors
  try {
    const vm = require('vm');
    // Wrap in function to make it valid JS block
    new vm.Script(`function test() { ${code} }`, { filename: `onclick-${count}.js` });
  } catch (err) {
    console.error(`\n>>> SYNTAX ERROR in onclick attribute #${count}:`);
    console.error(`Code: onclick=${quote}${code}${quote}`);
    console.error(err.stack);
  }
}

console.log(`\nChecked ${count} onclick attributes.`);
