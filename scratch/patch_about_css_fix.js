const fs = require('fs');
const path = require('path');

const projectIndexHtml = path.join(__dirname, '../index.html');
const desktopIndexHtml = 'C:\\Users\\dell 7620\\Desktop\\index.html';
const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');

function fixHtmlAboutCss(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }
  console.log(`\n========================================\nFixing About Section CSS robustly: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');

  // Định nghĩa CSS mới hoàn hảo cho trang Giới thiệu dích dắc blocks so le
  const newAboutCssBlock = `
    .about-row {
      display: flex;
      flex-direction: column;
      gap: 32px;
      margin-bottom: 0px !important;
      align-items: center;
      background: #fffcf8;
      border: 1px solid rgba(58, 33, 20, 0.08);
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(58, 33, 20, 0.04);
      width: 100%;
      box-sizing: border-box;
    }
    .about-row .about-img-col {
      width: 100%;
    }
    .about-row .about-text {
      width: 100%;
    }
    .about-row .about-img {
      width: 100%;
      border-radius: 16px;
      object-fit: cover;
      aspect-ratio: 16/10;
      box-shadow: 0 8px 24px rgba(31, 18, 11, 0.12);
      display: block;
    }
    .about-text p {
      margin-bottom: 20px;
      line-height: 1.8;
      text-align: justify;
    }
    .about-text p:last-child {
      margin-bottom: 0;
    }
    
    @media (min-width: 769px) {
      .about-row {
        flex-direction: row !important;
        gap: 54px !important;
        padding: 44px !important;
      }
      .about-row .about-img-col, 
      .about-row .about-text {
        flex: 1 !important;
        width: 50% !important;
      }
    }
  `;

  // Thay thế toàn bộ khối CSS cũ từ .about-row { cho đến hết @media (min-width: 981px) ... }
  // Chúng ta sẽ dùng regex co giãn rộng rãi để match và thay thế chính xác
  const originalCssBlockRegex = /\.about-row\s*\{\s*display:\s*flex;.*?\}\s*\}\s*\}\s*/s;
  
  if (originalCssBlockRegex.test(content)) {
    content = content.replace(originalCssBlockRegex, newAboutCssBlock + '\n');
    console.log('✅ Successfully replaced CSS block using regex');
  } else {
    // Nếu regex không match, chúng ta có thể chèn trực tiếp ghi đè trước thẻ </style>
    console.log('⚠️ Could not match standard regex, injecting override CSS block instead');
    content = content.replace('</style>', newAboutCssBlock + '\n</style>');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fully fixed CSS for: ${filePath}`);
}

// Chạy sửa đổi CSS
fixHtmlAboutCss(projectIndexHtml);
fixHtmlAboutCss(desktopIndexHtml);

console.log('\n🌟🌟🌟 CSS FIXES APPLIED SUCCESSFULLY! 🌟🌟🌟\n');
