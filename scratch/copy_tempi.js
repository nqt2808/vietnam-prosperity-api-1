const fs = require('fs');
const path = require('path');

const sourcePath = 'C:/Users/dell 7620/Desktop/index.html';
const destPath = 'd:/Du-an/website-vpc/index.html';

console.log('🔄 Đang copy file tempi gốc từ Desktop vào dự án VS Code...');

try {
  if (!fs.existsSync(sourcePath)) {
    console.error('❌ Không tìm thấy file tempi gốc tại Desktop:', sourcePath);
    process.exit(1);
  }

  // Đọc và ghi đè
  const content = fs.readFileSync(sourcePath, 'utf8');
  fs.writeFileSync(destPath, content, 'utf8');
  
  console.log('✅ Đã copy thành công file index.html gốc vào dự án VS Code!');
  console.log(`- Dung lượng: ${content.length} bytes`);
} catch (error) {
  console.error('❌ Lỗi khi copy file:', error.message);
}
