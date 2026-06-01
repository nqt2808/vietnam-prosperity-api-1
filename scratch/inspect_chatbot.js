const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const storefrontClientPath = path.join(__dirname, '../src/components/shared/storefront-client.tsx');

function searchInFile(filePath, keyword) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  console.log(`\n--- Searching for "${keyword}" in ${path.basename(filePath)} ---`);
  lines.forEach((line, index) => {
    if (line.includes(keyword)) {
      console.log(`[Line ${index + 1}]: ${line.trim().substring(0, 120)}`);
    }
  });
}

searchInFile(indexHtmlPath, 'quick-chat');
searchInFile(indexHtmlPath, 'câu hỏi gợi ý');
searchInFile(indexHtmlPath, 'giới thiệu');
searchInFile(storefrontClientPath, 'quickChat');
searchInFile(storefrontClientPath, 'chatbot');
