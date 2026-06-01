const fs = require('fs');
const path = require('path');

const storefrontClientPath = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClientPath, 'utf8');
const lines = content.split('\n');

console.log("Searching in storefront-client.tsx for order lookup & progress rendering:");
lines.forEach((line, index) => {
  if (line.includes('handleLookup') || line.includes('order_items') || line.includes('don_hang') || line.includes('trang_thai') || line.includes('progress') || line.includes('barista') || line.includes('tiến độ')) {
    if (line.trim().length > 0) {
      console.log(`[Line ${index + 1}]: ${line.trim().substring(0, 120)}`);
    }
  }
});
