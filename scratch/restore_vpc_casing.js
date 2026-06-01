const fs = require('fs');
const path = require('path');

const projectIndex = path.join(__dirname, '../index.html');
const desktopIndex = 'C:\\Users\\dell 7620\\Desktop\\index.html';
const indexes = [projectIndex, desktopIndex];

console.log("=== RESTORING VPC HEADER & FOOTER CASING ===");

function restoreIndexCasing(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Skipping missing file: ${filePath}`);
    return;
  }

  console.log(`Patching HTML: ${filePath}...`);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Khôi phục thẻ <title>
  content = content.replace(
    /<title><strong>VIETNAM PROSPERITY COFFEE<\/strong> - <strong>TRUNG NGUYÊN LEGEND<\/strong> <strong>ÂU LẠC<\/strong><\/title>/gi,
    '<title>Vietnam Prosperity Coffee - Trung Nguyên Legend Âu Lạc</title>'
  );

  // 2. Khôi phục brand-text ở Header
  const oldHeaderBrandText = `<strong><strong>VIETNAM PROSPERITY COFFEE</strong></strong>\n          <span><strong>TRUNG NGUYÊN LEGEND</strong> <strong>ÂU LẠC</strong></span>`;
  const newHeaderBrandText = `<strong>Vietnam Prosperity Coffee</strong>\n          <span>Trung Nguyên Legend Âu Lạc</span>`;
  
  if (content.includes(oldHeaderBrandText)) {
    content = content.replace(oldHeaderBrandText, newHeaderBrandText);
  } else {
    // Loose replace for spacing
    content = content.replace(
      /<strong><strong>VIETNAM PROSPERITY COFFEE<\/strong><\/strong>\s*\n\s*<span><strong>TRUNG NGUYÊN LEGEND<\/strong> <strong>ÂU LẠC<\/strong><\/span>/gi,
      '<strong>Vietnam Prosperity Coffee</strong>\n          <span>Trung Nguyên Legend Âu Lạc</span>'
    );
  }

  // 3. Khôi phục Hero eyebrow
  content = content.replace(
    /<span class="eyebrow"><strong>TRUNG NGUYÊN LEGEND<\/strong> <strong>ÂU LẠC<\/strong><\/span>/gi,
    '<span class="eyebrow">Trung Nguyên Legend Âu Lạc</span>'
  );

  // 4. Khôi phục Hero h1
  content = content.replace(
    /<h1><strong>VIETNAM PROSPERITY COFFEE<\/strong><\/h1>/gi,
    '<h1>Vietnam Prosperity Coffee</h1>'
  );

  // 5. Khôi phục Hero h2
  content = content.replace(
    /<h2><strong>TRUNG NGUYÊN LEGEND<\/strong> <strong>ÂU LẠC<\/strong><\/h2>/gi,
    '<h2>Trung Nguyên Legend Âu Lạc</h2>'
  );

  // 6. Khôi phục subtitle của Món nổi bật (tránh bôi đen bừa bãi)
  content = content.replace(
    /Những thức uống đặc trưng được yêu thích tại <strong>TRUNG NGUYÊN LEGEND<\/strong> <strong>ÂU LẠC<\/strong>\./gi,
    'Những thức uống đặc trưng được yêu thích tại Trung Nguyên Legend Âu Lạc.'
  );

  // 7. Khôi phục tiêu đề Footer
  content = content.replace(
    /<h3 class="footer-title" style="font-size: 28px; margin-bottom: 8px;"><strong>VIETNAM PROSPERITY COFFEE<\/strong><\/h3>/gi,
    '<h3 class="footer-title" style="font-size: 28px; margin-bottom: 8px;">Vietnam Prosperity Coffee</h3>'
  );

  // 8. Khôi phục dòng Copyright ở Footer
  content = content.replace(
    /© 2026 <strong>VIETNAM PROSPERITY COFFEE<\/strong> - <strong>TRUNG NGUYÊN LEGEND<\/strong> <strong>ÂU LẠC<\/strong>/gi,
    '© 2026 Vietnam Prosperity Coffee - Trung Nguyên Legend Âu Lạc'
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`🎉 Restored brand styles successfully in: ${filePath}`);
}

indexes.forEach(file => restoreIndexCasing(file));
console.log("=== COMPLETED CASING RESTORATION ===");
