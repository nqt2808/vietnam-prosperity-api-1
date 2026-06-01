const fs = require('fs');
const path = require('path');

const projectIndex = path.join(__dirname, '../index.html');
const desktopIndex = 'C:\\Users\\dell 7620\\Desktop\\index.html';
const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');

const files = [projectIndex, desktopIndex, storefrontClient];

console.log("=== FIXING NAMES CASING (TITLE CASE + BOLD) ===");

function fixCasingInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Skipping missing file: ${filePath}`);
    return;
  }

  console.log(`Patching file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Thực hiện các thay thế chính xác từ viết HOA toàn bộ sang viết Hoa chữ cái đầu (Title Case)
  content = content.replace(/<strong>VIETNAM PROSPERITY COFFEE COMPANY LIMITED<\/strong>/g, '<strong>Vietnam Prosperity Coffee Company Limited</strong>');
  content = content.replace(/<strong>VIETNAM PROSPERITY COFFEE<\/strong>/g, '<strong>Vietnam Prosperity Coffee</strong>');
  
  content = content.replace(/<strong>BÀ NGUYỄN THỊ TUYẾT MAI<\/strong>/g, '<strong>Bà Nguyễn Thị Tuyết Mai</strong>');
  content = content.replace(/<strong>NGUYỄN THỊ TUYẾT MAI<\/strong>/g, '<strong>Nguyễn Thị Tuyết Mai</strong>');
  
  content = content.replace(/<strong>ÔNG NGUYỄN MINH ĐỨC<\/strong>/g, '<strong>Ông Nguyễn Minh Đức</strong>');
  content = content.replace(/Ông <strong>NGUYỄN MINH ĐỨC<\/strong>/g, 'Ông <strong>Nguyễn Minh Đức</strong>');
  content = content.replace(/<strong>NGUYỄN MINH ĐỨC<\/strong>/g, '<strong>Nguyễn Minh Đức</strong>');
  
  content = content.replace(/<strong>TRUNG NGUYÊN LEGEND ÂU LẠC<\/strong>/g, '<strong>Trung Nguyên Legend Âu Lạc</strong>');
  content = content.replace(/<strong>TRUNG NGUYÊN LEGEND<\/strong> <strong>ÂU LẠC<\/strong>/g, '<strong>Trung Nguyên Legend Âu Lạc</strong>');
  content = content.replace(/<strong>TRUNG NGUYÊN LEGEND<\/strong>/g, '<strong>Trung Nguyên Legend</strong>');
  content = content.replace(/<strong>ÂU LẠC<\/strong>/g, '<strong>Âu Lạc</strong>');

  // Xử lý các tag trùng lặp (ví dụ <strong><strong>...)
  content = content.replace(/<strong><strong>/g, '<strong>');
  content = content.replace(/<\/strong><\/strong>/g, '</strong>');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`🎉 Casing successfully fixed in: ${filePath}`);
}

files.forEach(file => fixCasingInFile(file));

console.log("=== COMPLETED ALL REPLACEMENTS SUCCESSFULLY ===");
