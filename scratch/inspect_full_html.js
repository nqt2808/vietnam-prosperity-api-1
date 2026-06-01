const fs = require('fs');
const path = require('path');

const projectIndexHtml = path.join(__dirname, '../index.html');
const desktopIndexHtml = 'C:\\Users\\dell 7620\\Desktop\\index.html';

function inspect(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }
  console.log(`\n========================================\nInspecting: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const cleanLine = line.trim().toLowerCase();
    if (cleanLine.includes('chatbox') || cleanLine.includes('chat-box') || cleanLine.includes('about') || cleanLine.includes('giới thiệu')) {
      if (cleanLine.includes('<div') || cleanLine.includes('<section') || cleanLine.includes('<main') || cleanLine.includes('<button')) {
        console.log(`[Line ${index + 1}]: ${line.trim()}`);
      }
    }
  });
}

inspect(projectIndexHtml);
inspect(desktopIndexHtml);
