const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const content = fs.readFileSync(indexHtmlPath, 'utf8');
const lines = content.split('\n');

console.log("Searching for 'chatBox' or 'chat-box' in index.html:");
lines.forEach((line, index) => {
  if (line.toLowerCase().includes('chatbox') || line.toLowerCase().includes('chat-box')) {
    console.log(`[Line ${index + 1}]: ${line.trim()}`);
  }
});
