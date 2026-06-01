const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const storefrontClientPath = path.join(__dirname, '../src/components/shared/storefront-client.tsx');

function findAboutInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  console.log(`\n--- Looking for About section in ${path.basename(filePath)} ---`);
  
  let inAbout = false;
  let linesPrinted = 0;
  
  lines.forEach((line, index) => {
    // Tìm kiếm các từ khóa của About section
    if (line.includes('id="about"') || line.includes('id=\'about\'') || line.includes('id="gioi-thieu"') || line.includes('className="about-section"') || line.includes('Tuyết Mai') || line.includes('Minh Đức')) {
      console.log(`[Line ${index + 1}]: ${line.trim().substring(0, 120)}`);
      if (!inAbout) {
        inAbout = true;
        // In ra 40 dòng tiếp theo để xem cấu trúc
        console.log(`--- Printing surrounding lines for Line ${index + 1} ---`);
        for (let i = Math.max(0, index - 5); i < Math.min(lines.length, index + 60); i++) {
          console.log(`${i + 1}: ${lines[i]}`);
        }
      }
    }
  });
}

findAboutInFile(indexHtmlPath);
findAboutInFile(storefrontClientPath);
