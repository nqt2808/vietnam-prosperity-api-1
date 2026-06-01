const fs = require('fs');
const path = require('path');

const storefrontClientPath = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClientPath, 'utf8');
const lines = content.split('\n');

console.log("Searching in storefront-client.tsx for chatbot rendering keywords:");
lines.forEach((line, index) => {
  if (line.includes('suggestion') || line.includes('gợi ý') || line.includes('appendChatMessage') || line.includes('handleChat') || line.includes('cà phê') || line.includes('thanh mát')) {
    if (line.includes('Trợ lý') || line.includes('tư vấn') || line.includes('chat-') || line.includes('chatBox') || line.includes('chatInput') || line.includes('chatMessages')) {
      console.log(`[Line ${index + 1}]: ${line.trim().substring(0, 120)}`);
      // Print around this line
      for (let i = Math.max(0, index - 8); i < Math.min(lines.length, index + 25); i++) {
        console.log(`${i + 1}: ${lines[i]}`);
      }
    }
  }
});
