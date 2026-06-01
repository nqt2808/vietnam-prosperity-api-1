const fs = require('fs');
const path = require('path');

const projectIndex = path.join(__dirname, '../index.html');
const desktopIndex = 'C:\\Users\\dell 7620\\Desktop\\index.html';

const files = [projectIndex, desktopIndex];

console.log("=== PATCHING FOUNDERS TITLES IN GIOI THIEU ===");

function patchTitles(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }

  console.log(`Patching file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');

  // Tìm chuỗi chứa "Ông <strong>Nguyễn Minh Đức</strong> và Bà <strong>Nguyễn Thị Tuyết Mai</strong>"
  // Có thể có các khoảng trắng hoặc thẻ khác nhẹ, ta dùng regex linh hoạt
  const targetRegex = /Ông\s*<strong>Nguyễn Minh Đức<\/strong>\s*và\s*Bà\s*<strong>Nguyễn Thị Tuyết Mai<\/strong>/g;

  if (targetRegex.test(content)) {
    content = content.replace(
      targetRegex,
      'Ông <strong>Nguyễn Minh Đức</strong> (Tổng giám đốc công ty) và Bà <strong>Nguyễn Thị Tuyết Mai</strong> (Chủ đầu tư)'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Patched successfully in: ${filePath}`);
  } else {
    // Thử chuỗi viết hoa hoặc dạng khác đề phòng
    const backupRegex = /Ông\s*<strong>NGUYỄN MINH ĐỨC<\/strong>\s*và\s*Bà\s*<strong>NGUYỄN THỊ TUYẾT MAI<\/strong>/gi;
    if (backupRegex.test(content)) {
      content = content.replace(
        backupRegex,
        'Ông <strong>Nguyễn Minh Đức</strong> (Tổng giám đốc công ty) và Bà <strong>Nguyễn Thị Tuyết Mai</strong> (Chủ đầu tư)'
      );
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Patched successfully using backup in: ${filePath}`);
    } else {
      console.log(`❌ Could not target founders names in: ${filePath}`);
    }
  }
}

files.forEach(file => patchTitles(file));
console.log("=== PATCH COMPLETED ===");
