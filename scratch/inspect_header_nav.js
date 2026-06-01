const fs = require('fs');
const path = require('path');

const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClient, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCHING FOR HEADER NAVIGATION IN storefront-client.tsx ===");
lines.forEach((line, index) => {
  // Tìm kiếm phần render các link Menu nước, Vật phẩm, Bài viết
  if (line.includes('Menu nước') || line.includes('Vật phẩm') || line.includes('Bài viết') || line.includes('Giới thiệu') || line.includes('Liên hệ')) {
    console.log(`[Line ${index + 1}]: ${line.trim().substring(0, 140)}`);
    // Print 5 lines before and after
    for (let i = Math.max(0, index - 5); i < Math.min(lines.length, index + 8); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
