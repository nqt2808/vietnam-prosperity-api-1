const fs = require('fs');

const filePath = 'd:\\Du-an\\website-vpc\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

// Find all <script> tags
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;

while ((match = scriptRegex.exec(content)) !== null) {
  count++;
  const jsContent = match[1];
  const jsLines = jsContent.split('\n');
  
  // The error was at line 2458 in the JS content
  const targetLineIdx = 2457; // 0-indexed for 2458
  console.log("=== ERROR LINE JS ===");
  console.log(`JS Line 2458: ${jsLines[targetLineIdx]}`);
  
  // Find where this JS content starts in the original file
  const scriptStartIdx = content.indexOf(jsContent);
  const beforeScript = content.substring(0, scriptStartIdx);
  const beforeScriptLines = beforeScript.split('\n').length;
  
  const originalLineNumber = beforeScriptLines + targetLineIdx;
  console.log("\n=== ORIGINAL FILE CONTEXT ===");
  const fileLines = content.split('\n');
  for (let i = Math.max(1, originalLineNumber - 5); i <= Math.min(fileLines.length, originalLineNumber + 5); i++) {
    console.log(`${i}: ${fileLines[i-1]}`);
  }
}
