const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../src/components/shared/storefront-client.tsx'),
  path.join(__dirname, '../index.html'),
  'C:\\Users\\dell 7620\\Desktop\\index.html'
];

const keywords = ['quick-chat', 'quick_chat', 'chat-suggest', 'chat', 'bot', 'don_hang', 'order', 'hóa đơn', 'hoa_don', 'tiến độ', 'tien_do', 'qr', 'vietqr'];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    return;
  }
  console.log(`\n========================================\nAnalyzing: ${file}`);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  keywords.forEach(kw => {
    let foundCount = 0;
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(kw.toLowerCase())) {
        foundCount++;
        if (foundCount <= 10) { // Chỉ in tối đa 10 dòng đầu tiên của mỗi từ khóa
          console.log(`[Line ${index + 1}] (${kw}): ${line.trim().substring(0, 100)}`);
        }
      }
    });
    if (foundCount > 10) {
      console.log(`... and ${foundCount - 10} more matches for "${kw}"`);
    }
  });
});
