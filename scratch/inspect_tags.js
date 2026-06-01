const fs = require('fs');
const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');

console.log("=== Checking Script tags and positions ===");
lines.forEach((line, idx) => {
  if (line.includes('<script') || line.includes('</script>')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
