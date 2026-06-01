const fs = require('fs');

const file1 = 'd:\\Du-an\\website-vpc\\index.html';
const file2 = 'c:\\Users\\dell 7620\\Desktop\\index.html';

// Read and normalize line endings
const content1 = fs.readFileSync(file1, 'utf8').replace(/\r\n/g, '\n').trim();
const content2 = fs.readFileSync(file2, 'utf8').replace(/\r\n/g, '\n').trim();

// Extract JS from both
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;

function getJs(content) {
  let js = '';
  scriptRegex.lastIndex = 0;
  let match;
  while ((match = scriptRegex.exec(content)) !== null) {
    js += match[1] + '\n';
  }
  return js.replace(/\r\n/g, '\n').trim();
}

const js1 = getJs(fs.readFileSync(file1, 'utf8'));
const js2 = getJs(fs.readFileSync(file2, 'utf8'));

const lines1 = js1.split('\n');
const lines2 = js2.split('\n');

console.log(`Normalized JS - Workspace: ${lines1.length} lines, Desktop: ${lines2.length} lines`);

let diffCount = 0;
const maxLen = Math.max(lines1.length, lines2.length);

for (let i = 0; i < maxLen; i++) {
  const l1 = (lines1[i] || '').trim();
  const l2 = (lines2[i] || '').trim();
  
  if (l1 !== l2) {
    diffCount++;
    console.log(`\n--- JS Difference #${diffCount} at JS Line ${i + 1} ---`);
    console.log(`[Workspace]: "${l1}"`);
    console.log(`[Desktop  ]: "${l2}"`);
    
    if (diffCount >= 20) {
      console.log("\nOnly showing the first 20 differences.");
      break;
    }
  }
}

if (diffCount === 0) {
  console.log("No differences in JavaScript code found!");
}
