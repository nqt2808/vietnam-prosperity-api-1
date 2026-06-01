const fs = require('fs');
const path = require('path');

const htmlPath = 'C:/Users/dell 7620/Desktop/index.html';
const cssPath = 'd:/Du-an/website-vpc/src/app/globals.css';

console.log('🔄 Đang đồng bộ CSS từ HTML gốc sang Next.js globals.css...');

try {
  // 1. Đọc file HTML gốc
  if (!fs.existsSync(htmlPath)) {
    console.error('❌ Không tìm thấy file HTML gốc tại:', htmlPath);
    process.exit(1);
  }
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // 2. Trích xuất CSS trong thẻ <style>
  const startTag = '<style>';
  const endTag = '</style>';
  const startIndex = htmlContent.indexOf(startTag);
  const endIndex = htmlContent.indexOf(endTag);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    console.error('❌ Không tìm thấy thẻ <style> và </style> hợp lệ trong file HTML!');
    process.exit(1);
  }

  const extractedCSS = htmlContent.substring(startIndex + startTag.length, endIndex).trim();
  console.log(`✅ Đã trích xuất thành công ${extractedCSS.split('\n').length} dòng CSS từ file HTML gốc!`);

  // 3. Chuẩn bị nội dung globals.css mới
  // Giữ lại cấu hình Tailwind v4 và @theme ban đầu ở đầu file, sau đó nối thêm CSS gốc
  const tailwindHeader = `@import "tailwindcss";

@theme {
  --color-brand-primary: #c89b3c; /* Gold */
  --color-brand-primary-hover: #f4d17b; /* Gold Light */
  --color-brand-accent: #5a321f; /* Coffee Soft */
  --color-brand-success: #10b981; /* Emerald 500 */
  --color-brand-dark: #1f120b; /* Coffee Dark */
  --color-brand-dark-card: #2b1810; /* Coffee Card Dark */
  --color-brand-light-card: #fff8ed; /* Coffee Card Light */
  
  --color-brand-coffee-dark: #1f120b;
  --color-brand-coffee: #3a2114;
  --color-brand-coffee-soft: #5a321f;
  --color-brand-cream: #f7efe3;
  --color-brand-cream-light: #fff8ed;
  --color-brand-gold: #c89b3c;
  --color-brand-gold-light: #f4d17b;
  --color-brand-text: #2b1810;
  --color-brand-muted: #78675d;

  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
}

`;

  const finalCSSContent = tailwindHeader + '\n/* ════════════════════════════════════════════════\n   EXTRACTED TEMPLATE ORIGINAL CSS\n   ════════════════════════════════════════════════ */\n\n' + extractedCSS;

  // 4. Ghi đè globals.css
  fs.writeFileSync(cssPath, finalCSSContent, 'utf8');
  console.log('✅ Đã cập nhật thành công globals.css!');

} catch (error) {
  console.error('❌ Lỗi trong quá trình đồng bộ CSS:', error.message);
}
