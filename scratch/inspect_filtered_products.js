const fs = require('fs');
const path = require('path');

const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClient, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCHING FOR filteredProducts IN storefront-client.tsx ===");

lines.forEach((line, index) => {
  if (line.includes('filteredProducts') || line.includes('const filteredProducts')) {
    console.log(`[Line ${index + 1}]: ${line.trim()}`);
  }
});
