const fs = require('fs');

const file1 = 'd:\\Du-an\\website-vpc\\index.html';
const file2 = 'c:\\Users\\dell 7620\\Desktop\\index.html';

const lines1 = fs.readFileSync(file1, 'utf8').replace(/\r\n/g, '\n').split('\n').map(l => l.trim());
const lines2 = fs.readFileSync(file2, 'utf8').replace(/\r\n/g, '\n').split('\n').map(l => l.trim());

// Simple diffing
let report = "=== DIFF REPORT (Workspace vs Desktop) ===\n";

report += `Workspace total lines: ${lines1.length}\n`;
report += `Desktop total lines: ${lines2.length}\n\n`;

// Find missing blocks
report += "=== UNIQUE LINES IN WORKSPACE (Missing in Desktop) ===\n";
let missingIn2 = 0;
lines1.forEach((line, idx) => {
  if (line.length < 5) return; // Skip tiny lines
  if (!lines2.includes(line)) {
    missingIn2++;
    report += `Line ${idx + 1}: ${line}\n`;
  }
});
report += `Total: ${missingIn2} unique lines in Workspace.\n\n`;

report += "=== UNIQUE LINES IN DESKTOP (Missing in Workspace) ===\n";
let missingIn1 = 0;
lines2.forEach((line, idx) => {
  if (line.length < 5) return;
  if (!lines1.includes(line)) {
    missingIn1++;
    report += `Line ${idx + 1}: ${line}\n`;
  }
});
report += `Total: ${missingIn1} unique lines in Desktop.\n`;

fs.writeFileSync('d:\\Du-an\\website-vpc\\scratch\\diff_report.txt', report, 'utf8');
console.log("Diff report written to scratch/diff_report.txt successfully!");
