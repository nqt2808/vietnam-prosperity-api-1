const fs = require('fs');
const path = require('path');

const storefrontClientPath = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClientPath, 'utf8');
const lines = content.split('\n');

console.log("Printing lines 668 to 750 of storefront-client.tsx:");
for (let i = 667; i < 750 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
