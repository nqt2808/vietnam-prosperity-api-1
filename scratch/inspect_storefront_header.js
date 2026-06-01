const fs = require('fs');
const path = require('path');

const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClient, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCHING FOR HEADER ELEMENT IN storefront-client.tsx ===");

lines.forEach((line, index) => {
  if (line.includes('<header') || line.includes('className="sticky top-0"') || line.includes('className="sticky top-0') || line.includes('nav className') || line.includes('activeTab ===') && line.includes('nav')) {
    console.log(`[Line ${index + 1}]: ${line.trim().substring(0, 140)}`);
  }
});
