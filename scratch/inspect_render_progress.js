const fs = require('fs');
const path = require('path');

const storefrontClientPath = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClientPath, 'utf8');
const lines = content.split('\n');

let start = -1;
let end = -1;
lines.forEach((line, index) => {
  if (line.includes('const renderLookupProgress')) {
    start = index;
  }
  if (start !== -1 && end === -1 && index > start && line.trim() === '}') {
    end = index;
  }
});

if (start !== -1) {
  console.log(`Found renderLookupProgress at lines ${start + 1} to ${end + 1}:`);
  for (let i = start; i <= (end !== -1 ? end : start + 60); i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
} else {
  console.log("renderLookupProgress not found.");
}
