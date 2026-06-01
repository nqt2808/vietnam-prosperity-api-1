const fs = require('fs');
const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const functions = [
  'updateCartCount',
  'renderCart',
  'renderBlog',
  'renderFeatured',
  'renderMenu',
  'renderMerch',
  'API_URL',
  'supabase'
];

functions.forEach(fn => {
  const count = (content.match(new RegExp(fn, 'g')) || []).length;
  console.log(`${fn}: found ${count} times`);
  
  // Find lines containing the function
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes(fn)) {
      console.log(`  Line ${idx + 1}: ${line.trim()}`);
    }
  });
});
