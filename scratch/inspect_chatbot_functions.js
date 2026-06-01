const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const content = fs.readFileSync(indexHtmlPath, 'utf8');
const lines = content.split('\n');

console.log("Searching in index.html for chat-related functions:");
lines.forEach((line, index) => {
  if (line.includes('function chatAnswer') || line.includes('function handleChat') || line.includes('chatAnswer(') || line.includes('chatbotIntents') || line.includes('chatReply')) {
    console.log(`[Line ${index + 1}]: ${line.trim().substring(0, 120)}`);
  }
});
