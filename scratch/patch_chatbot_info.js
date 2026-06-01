const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

console.log("--- Scanning storefront-client.tsx for civilizations and membership ---");
lines.forEach((line, index) => {
  if (line.includes('civilizations') || line.includes('membership')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
