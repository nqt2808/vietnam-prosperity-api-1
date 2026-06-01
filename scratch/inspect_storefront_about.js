const fs = require('fs');
const path = require('path');

const storefrontClientPath = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClientPath, 'utf8');
const lines = content.split('\n');

let startLine = -1;
let endLine = -1;
lines.forEach((line, index) => {
  if (line.includes("id='about'") || line.includes('id="about"') || line.includes('activeTab === \'#about\'')) {
    startLine = index;
  }
});

if (startLine !== -1) {
  console.log(`Found About section in storefront-client.tsx starting at line ${startLine + 1}:`);
  for (let i = Math.max(0, startLine - 10); i < Math.min(lines.length, startLine + 120); i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
} else {
  console.log("About section not found in storefront-client.tsx");
}
