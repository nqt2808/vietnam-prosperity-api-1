const fs = require('fs');
const path = require('path');

const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClient, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCHING FOR PRODUCT TYPE IN STOREFRONT-CLIENT ===");
lines.forEach((line, index) => {
  if (line.includes('interface Product') || line.includes('type Product') || line.includes('StorefrontClientProps')) {
    console.log(`[Line ${index + 1}]: ${line.trim()}`);
    for (let i = Math.max(0, index - 5); i < Math.min(lines.length, index + 25); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
