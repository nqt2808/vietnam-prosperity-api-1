const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\dell 7620\\.gemini\\antigravity-ide\\brain\\0debd67b-926f-4fd9-b289-cd48ac83417b\\vpc-admin.html', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('function ') && idx > 50) {
    console.log((idx+1) + ': ' + line.trim());
  }
});
