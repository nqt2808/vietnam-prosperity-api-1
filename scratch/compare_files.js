const fs = require('fs');
const crypto = require('crypto');

const file1 = 'd:\\Du-an\\website-vpc\\index.html';
const file2 = 'c:\\Users\\dell 7620\\Desktop\\index.html';

const content1 = fs.readFileSync(file1, 'utf8');
const content2 = fs.readFileSync(file2, 'utf8');

const hash1 = crypto.createHash('md5').update(content1).digest('hex');
const hash2 = crypto.createHash('md5').update(content2).digest('hex');

console.log(`Workspace index.html MD5: ${hash1}`);
console.log(`Desktop index.html MD5: ${hash2}`);

if (content1 === content2) {
  console.log("Both files are EXACTLY identical!");
} else {
  console.log("Files differ. Let's find out how...");
  
  const lines1 = content1.split('\n');
  const lines2 = content2.split('\n');
  
  console.log(`Workspace lines: ${lines1.length}, Desktop lines: ${lines2.length}`);
  
  // Find first difference
  let firstDiffLine = -1;
  const maxLen = Math.max(lines1.length, lines2.length);
  for (let i = 0; i < maxLen; i++) {
    if (lines1[i] !== lines2[i]) {
      firstDiffLine = i + 1;
      console.log(`First difference at line ${firstDiffLine}:`);
      console.log(`  Workspace: ${lines1[i] ? lines1[i].trim() : 'EOF'}`);
      console.log(`  Desktop  : ${lines2[i] ? lines2[i].trim() : 'EOF'}`);
      break;
    }
  }
}
