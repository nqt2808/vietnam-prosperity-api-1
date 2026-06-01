const fs = require('fs');
const path = require('path');

const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClient, 'utf8');
const lines = content.split('\n');

console.log("=== SCANNING FOR NAVIGATION LINKS IN storefront-client.tsx ===");

lines.forEach((line, index) => {
  // Tìm các thẻ <a> hoặc button có chứa href hoặc click thay đổi tab
  if (line.includes('href="#') || line.includes('href=\'#') || line.includes('setActiveTab(')) {
    if (line.includes('menu') || line.includes('merch') || line.includes('blog') || line.includes('about') || line.includes('contact') || line.includes('home')) {
      console.log(`[Line ${index + 1}]: ${line.trim()}`);
    }
  }
});
