const fs = require('fs');

const file1 = 'd:\\Du-an\\website-vpc\\index.html';
const file2 = 'c:\\Users\\dell 7620\\Desktop\\index.html';

const html1 = fs.readFileSync(file1, 'utf8').replace(/\r\n/g, '\n').trim();
const html2 = fs.readFileSync(file2, 'utf8').replace(/\r\n/g, '\n').trim();

// Split by tags or lines to find actual structural differences
const lines1 = html1.split('\n').map(l => l.trim()).filter(l => l.length > 0);
const lines2 = html2.split('\n').map(l => l.trim()).filter(l => l.length > 0);

console.log(`Filtered - Workspace: ${lines1.length} lines, Desktop: ${lines2.length} lines`);

// We want to find which lines are in Desktop but not in Workspace, and vice-versa.
// A simple line-by-line comparison can get out of sync, so we will use a basic diffing logic
// or just find unique lines that don't exist in the other file.

// Let's do a sliding window or search for each line of file2 in file1
let diffCount = 0;
lines2.forEach((line, idx) => {
  // If line is very common like "</div>", skip
  if (line === '</div>' || line === '</div></div>' || line === '<div class="card">' || line === '</div>' || line === '</div>' || line === '') {
    return;
  }
  
  if (!html1.includes(line)) {
    diffCount++;
    console.log(`\n--- Line in Desktop NOT found in Workspace (Desktop Line ~${idx + 1}) ---`);
    console.log(`Desktop: "${line}"`);
    
    if (diffCount >= 15) {
      console.log("Only showing first 15 unique Desktop lines.");
      return;
    }
  }
});

let diffCount2 = 0;
lines1.forEach((line, idx) => {
  if (line === '</div>' || line === '</div></div>' || line === '<div class="card">' || line === '') {
    return;
  }
  
  if (!html2.includes(line)) {
    diffCount2++;
    console.log(`\n--- Line in Workspace NOT found in Desktop (Workspace Line ~${idx + 1}) ---`);
    console.log(`Workspace: "${line}"`);
    
    if (diffCount2 >= 15) {
      console.log("Only showing first 15 unique Workspace lines.");
      return;
    }
  }
});
