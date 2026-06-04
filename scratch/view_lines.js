const fs = require('fs');
const content = fs.readFileSync('d:\\Du-an\\website-vpc\\index.html', 'utf8');
const lines = content.split('\n');
function printRange(start, end) {
  console.log(`--- Lines ${start} to ${end} ---`);
  for (let i = start - 1; i < end; i++) {
    if (lines[i] !== undefined) {
      console.log((i+1) + ': ' + lines[i]);
    }
  }
}
printRange(130, 160);
printRange(210, 235);
printRange(1685, 1725);
printRange(1825, 1870);
