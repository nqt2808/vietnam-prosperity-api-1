const fs = require('fs');
const path = require('path');

const storefrontClientPath = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClientPath, 'utf8');
const lines = content.split('\n');

console.log("Searching in storefront-client.tsx for chatbot UI buttons rendering:");
lines.forEach((line, index) => {
  if (line.includes('Tôi muốn uống cà phê') || line.includes('Tôi muốn món thanh mát') || line.includes('Tôi không uống cà phê') || line.includes('Gợi ý món đặc trưng')) {
    console.log(`[Line ${index + 1}]: ${line.trim().substring(0, 120)}`);
    // Print around this line
    for (let i = Math.max(0, index - 10); i < Math.min(lines.length, index + 15); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
