const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const backupPath = targetPath + '.bak-before-script-fix';

if (!fs.existsSync(targetPath)) {
  console.error(`Không tìm thấy file tại ${targetPath}`);
  process.exit(1);
}

// Tạo file backup
fs.copyFileSync(targetPath, backupPath);
console.log(`Đã lưu file backup tại ${backupPath}`);

const content = fs.readFileSync(targetPath, 'utf8');

// Bảng map cp1252 đặc biệt
const cp1252Map = {
  0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026,
  0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160,
  0x8B: 0x2039, 0x8C: 0x0152, 0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019,
  0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153,
  0x9E: 0x017E, 0x9F: 0x0178
};

const unicodeToCp1252 = {};
for (const [byteVal, uniVal] of Object.entries(cp1252Map)) {
  unicodeToCp1252[uniVal] = parseInt(byteVal, 10);
}

function restoreUtf8FromMojibake(text) {
  const bytes = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code <= 0xFF) {
      bytes.push(code);
    } else if (unicodeToCp1252[code] !== undefined) {
      bytes.push(unicodeToCp1252[code]);
    } else {
      // Đối với các ký tự unicode khác, encode thành byte UTF-8 của chính nó
      const charBuf = Buffer.from(text[i], 'utf8');
      for (const b of charBuf) {
        bytes.push(b);
      }
    }
  }
  return Buffer.from(bytes).toString('utf8');
}

console.log("Đang tiến hành khôi phục UTF-8 từ Mojibake...");
const restored = restoreUtf8FromMojibake(content);

fs.writeFileSync(targetPath, restored, 'utf8');
console.log("Đã khôi phục và ghi lại file thành công!");
