const fs = require('fs');
const path = require('path');

const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClient, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCHING FOR TABS NAVIGATION LOGIC IN storefront-client.tsx ===");
lines.forEach((line, index) => {
  if (line.includes('activeTab') || line.includes('setActiveTab') || line.includes('href="#') || line.includes('href=\'#') || line.includes('onClick={() =>')) {
    // Chỉ in ra các dòng liên quan đến activeTab hoặc href điều hướng tab
    if (line.includes('activeTab') || line.includes('Tab(') || line.includes('className') && (line.includes('#menu') || line.includes('#merch') || line.includes('#blog') || line.includes('#about'))) {
      console.log(`[Line ${index + 1}]: ${line.trim().substring(0, 140)}`);
    }
  }
});
