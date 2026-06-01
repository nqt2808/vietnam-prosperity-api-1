const fs = require('fs');

const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
try {
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  console.log("=== FILE STATUS ===");
  console.log("File path:", filePath);
  console.log("File size (bytes):", stats.size);
  console.log("Line count:", lines.length);
  console.log("Last 5 lines of the file:");
  for (let i = Math.max(0, lines.length - 5); i < lines.length; i++) {
    console.log(`  Line ${i+1}: ${lines[i].trim()}`);
  }
} catch (err) {
  console.error("Error reading file:", err.message);
}
