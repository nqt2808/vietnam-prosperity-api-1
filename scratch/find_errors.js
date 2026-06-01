const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

// Tim dong chua id group.id (template literal bi render literal trong HTML)
console.log('=== Duplicate ID: ${group.id} ===');
lines.forEach(function(line, i) {
  if (line.indexOf('${group.id}') !== -1) {
    console.log('Line ' + (i+1) + ': ' + line.trim().slice(0, 150));
  }
});

// Tim dong chua src rong
console.log('\n=== Empty src attributes ===');
const emptySrcRe = /src=["']['"]|src=''/;
lines.forEach(function(line, i) {
  if (emptySrcRe.test(line)) {
    console.log('Line ' + (i+1) + ': ' + line.trim().slice(0, 150));
  }
});
