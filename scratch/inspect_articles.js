const fs = require('fs');
const path = require('path');

const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClient, 'utf8');
const lines = content.split('\n');

console.log("=== SCANNING FOR ARTICLES/POSTS LOGIC IN NEXT.JS ===");

lines.forEach((line, index) => {
  if (line.includes('activeTab === \'#blog\'') || line.includes('activeTab === \'#news\'') || line.includes('bài viết') || line.includes('sự kiện') || line.includes('VinFast') || line.includes('Nhật Cường')) {
    console.log(`[Line ${index + 1}]: ${line.trim().substring(0, 120)}`);
  }
});
