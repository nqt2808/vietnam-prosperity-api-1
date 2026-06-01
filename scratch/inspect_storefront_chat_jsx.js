const fs = require('fs');
const path = require('path');

const storefrontClientPath = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClientPath, 'utf8');
const lines = content.split('\n');

console.log("Searching for handleChatQuestion calls in storefront-client.tsx:");
lines.forEach((line, index) => {
  if (line.includes('handleChatQuestion')) {
    console.log(`[Line ${index + 1}]: ${line.trim().substring(0, 120)}`);
    // Print around this line
    for (let i = Math.max(0, index - 5); i < Math.min(lines.length, index + 25); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
