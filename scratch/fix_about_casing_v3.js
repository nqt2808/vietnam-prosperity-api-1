const fs = require('fs');
const path = require('path');

const projectIndex = path.join(__dirname, '../index.html');
const desktopIndex = 'C:\\Users\\dell 7620\\Desktop\\index.html';
const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');

const files = [projectIndex, desktopIndex, storefrontClient];

console.log("=== FIXING NAMES CASING (V3 - ACCURATE & SAFE) ===");

function fixCasingInHtml(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Skipping missing file: ${filePath}`);
    return;
  }

  console.log(`Patching HTML file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Bước 1: Dọn dẹp các thẻ <strong> lồng nhau lặp đi lặp lại
  let beforeClean = content;
  while (true) {
    content = content.replace(/<strong><strong>/g, '<strong>');
    content = content.replace(/<\/strong><\/strong>/g, '</strong>');
    if (content === beforeClean) break;
    beforeClean = content;
  }

  // Bước 2: Thực hiện thay thế chính xác các danh từ riêng viết HOA toàn bộ trong thẻ <strong>
  // 1. Vietnam Prosperity Coffee Company Limited
  content = content.replace(/<strong>VIETNAM PROSPERITY COFFEE COMPANY LIMITED<\/strong>/gi, '<strong>Vietnam Prosperity Coffee Company Limited</strong>');
  
  // 2. Vietnam Prosperity Coffee
  content = content.replace(/<strong>VIETNAM PROSPERITY COFFEE<\/strong>/gi, '<strong>Vietnam Prosperity Coffee</strong>');

  // 3. Nguyễn Thị Tuyết Mai / Bà Nguyễn Thị Tuyết Mai
  // Sửa trường hợp "Bà <strong>NGUYỄN THỊ TUYẾT MAI</strong>" hoặc "Bà <strong>NGUYỄN THỊ TUYẾT MAI</strong>"
  content = content.replace(/Bà\s+<strong>NGUYỄN THỊ TUYẾT MAI<\/strong>/gi, 'Bà <strong>Nguyễn Thị Tuyết Mai</strong>');
  content = content.replace(/<strong>BÀ NGUYỄN THỊ TUYẾT MAI<\/strong>/gi, '<strong>Bà Nguyễn Thị Tuyết Mai</strong>');
  content = content.replace(/<strong>NGUYỄN THỊ TUYẾT MAI<\/strong>/gi, '<strong>Nguyễn Thị Tuyết Mai</strong>');

  // 4. Nguyễn Minh Đức / Ông Nguyễn Minh Đức
  content = content.replace(/Ông\s+<strong>NGUYỄN MINH ĐỨC<\/strong>/gi, 'Ông <strong>Nguyễn Minh Đức</strong>');
  content = content.replace(/<strong>ÔNG NGUYỄN MINH ĐỨC<\/strong>/gi, '<strong>Ông Nguyễn Minh Đức</strong>');
  content = content.replace(/<strong>NGUYỄN MINH ĐỨC<\/strong>/gi, '<strong>Nguyễn Minh Đức</strong>');

  // 5. Trung Nguyên Legend Âu Lạc / Trung Nguyên Legend / Âu Lạc
  content = content.replace(/<strong>TRUNG NGUYÊN LEGEND ÂU LẠC<\/strong>/gi, '<strong>Trung Nguyên Legend Âu Lạc</strong>');
  content = content.replace(/<strong>TRUNG NGUYÊN LEGEND<\/strong>\s+<strong>ÂU LẠC<\/strong>/gi, '<strong>Trung Nguyên Legend Âu Lạc</strong>');
  content = content.replace(/<strong>TRUNG NGUYÊN LEGEND<\/strong>/gi, '<strong>Trung Nguyên Legend</strong>');
  content = content.replace(/<strong>ÂU LẠC<\/strong>/gi, '<strong>Âu Lạc</strong>');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`🎉 HTML Casing successfully fixed in: ${filePath}`);
}

function fixCasingInNextJs(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Skipping missing file: ${filePath}`);
    return;
  }

  console.log(`Patching Next.js component: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Tìm và bôi đen các danh từ riêng ở phần Về chúng tôi (About)
  // Chỉ sửa ở phạm vi khối activeTab === '#about' để an toàn, hoặc replace trực tiếp vì các câu này rất đặc trưng.

  // Câu 1: Vietnam Prosperity Coffee (VPC) tự hào là thương hiệu kết nối và mang đến không gian cà phê năng lượng đặc trưng của Trung Nguyên Legend giữa lòng Cố đô Huế.
  content = content.replace(
    /Vietnam Prosperity Coffee \(VPC\) tự hào là thương hiệu kết nối và mang đến không gian cà phê năng lượng đặc trưng của Trung Nguyên Legend giữa lòng Cố đô Huế\./g,
    '<strong>Vietnam Prosperity Coffee</strong> (VPC) tự hào là thương hiệu kết nối và mang đến không gian cà phê năng lượng đặc trưng của <strong>Trung Nguyên Legend</strong> giữa lòng Cố đô Huế.'
  );

  // Câu 2: Không gian tại cửa hàng Âu Lạc được thiết kế hiện đại, bài trí tinh tế cùng tủ sách tri thức truyền cảm hứng dấn thân, lập nghiệp mạnh mẽ.
  content = content.replace(
    /Không gian tại cửa hàng Âu Lạc được thiết kế hiện đại, bài trí tinh tế cùng tủ sách tri thức truyền cảm hứng dấn thân, lập nghiệp mạnh mẽ\./g,
    'Không gian tại cửa hàng <strong>Âu Lạc</strong> được thiết kế hiện đại, bài trí tinh tế cùng tủ sách tri thức truyền cảm hứng dấn thân, lập nghiệp mạnh mẽ.'
  );

  // Sửa cả phần badge của About nếu có
  content = content.replace(
    /<Award className="w-4.5.h-4.5"\s*\/>\s*Vietnam Prosperity Coffee/g,
    '<Award className="w-4.5 h-4.5" /> <strong>Vietnam Prosperity Coffee</strong>'
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`🎉 Next.js Casing successfully fixed in: ${filePath}`);
}

// Chạy sửa
fixCasingInHtml(projectIndex);
fixCasingInHtml(desktopIndex);
fixCasingInNextJs(storefrontClient);

console.log("=== COMPLETED ALL REPLACEMENTS SUCCESSFULLY ===");
