const fs = require('fs');
const path = require('path');

const filePath = 'd:/Du-an/website-vpc/src/components/shared/storefront-client.tsx';
const content = fs.readFileSync(filePath, 'utf8');

const query = process.argv[2] || 'Matcha';
console.log(`Searching for "${query}" inside storefront-client.tsx...`);

const lines = content.split('\n');
let count = 0;
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes(query.toLowerCase())) {
    count++;
    if (count <= 20) {
      console.log(`L${idx + 1}: ${line.trim()}`);
    }
  }
});
console.log(`Found ${count} matches.`);
