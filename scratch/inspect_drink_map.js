const fs = require('fs');
const path = require('path');

const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
if (!fs.existsSync(storefrontClient)) {
  console.error("❌ File not found!");
  process.exit(1);
}

const content = fs.readFileSync(storefrontClient, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCHING FOR drinkImageMap IN storefront-client.tsx ===");
lines.forEach((line, index) => {
  if (line.includes('drinkImageMap')) {
    console.log(`[Line ${index + 1}]: ${line.trim()}`);
    for (let i = Math.max(0, index - 2); i < Math.min(lines.length, index + 20); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
