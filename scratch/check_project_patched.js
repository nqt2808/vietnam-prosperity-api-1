const fs = require('fs');
const path = require('path');

const projectIndexHtml = path.join(__dirname, '../index.html');
const content = fs.readFileSync(projectIndexHtml, 'utf8');

console.log('--- Checking Quick Chat Buttons in Project ---');
const quickChatBlock = content.match(/<div class="quick-chat">.*?<\/div>/s);
if (quickChatBlock) {
  console.log(quickChatBlock[0]);
} else {
  console.log('⚠️ Quick chat block not found or not matched!');
}
