const fs = require('fs');
const path = require('path');

const projectIndex = path.join(__dirname, '../index.html');
const desktopIndex = 'C:\\Users\\dell 7620\\Desktop\\index.html';
const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');

const files = [projectIndex, desktopIndex, storefrontClient];

console.log("=== FIXING CHATBOT PROMOTIONS SYNTAX ERROR ===");

const cleanPromotionsReply = `"reply": "<strong>🔥 ƯU ĐÃI ĐẶC BIỆT TẠI Trung Nguyên Legend Âu Lạc</strong><br><strong>Khu TĐC Đông Nam Thủy An – Phường An Cựu, TP. Huế</strong><br><br>✨ Thưởng thức cà phê và không gian đậm chất <strong>Trung Nguyên Legend</strong> cùng những ưu đãi hấp dẫn mỗi ngày:<br><br><strong>☀️ HAPPY LUNCH - GIẢM 15% THỨC UỐNG</strong><br>• <strong>Khung giờ áp dụng:</strong> 12:00 – 14:00<br>• <strong>Thời gian:</strong> 19/05 – 30/06<br>• Tận hưởng những phút giây thư giãn giữa ngày với các thức uống đặc biệt.<br><br><strong>🌙 HAPPY HOURS - MUA 1 TẶNG 1</strong><br>• <strong>Khung giờ áp dụng:</strong> 14:00 – 22:00<br>• <strong>Thời gian:</strong> 19/05 – 30/06<br>• <strong>Nội dung:</strong> Mua 1 ly nước tặng ngay 1 ly cùng loại hoặc tùy chọn trong danh mục ưu đãi (Trà Vải Hoa Hồng, Trà Đào Cam Sả, Trà Lá Nếp Sen Vàng, Cà phê Năng Lượng...).<br><br>✨ Cùng bạn bè, đồng nghiệp và người thân tận hưởng hành trình trải nghiệm cà phê – trà hiện đại đầy cảm hứng! 🍹"`;

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }

  console.log(`Fixing syntax in: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');

  // Tìm kiếm khối promotions bị lỗi
  // Nó bắt đầu từ "name": "promotions" và kéo dài qua "reply": `... cho đến khi gặp "name": "civilizations" hoặc kết thúc block
  // Do có dấu backtick lỗi ở giữa, ta dùng regex tìm kiếm khối từ "name": "promotions" đến hết reply lỗi.
  
  const badBlockRegex = /"name":\s*"promotions",\s*"reply":\s*`<strong>🔥 ƯU ĐÃI ĐẶC BIỆT TẠI[\s\S]*?đến hết 30\/06<\/strong>\.<br>\\n• Đây là chương trình tri ân đặc biệt giúp quý khách giải nhiệt, tránh nóng và tiếp thêm năng lượng học tập, làm việc trong những ngày hè oi bức tại Huế! 🍹"/g;

  if (badBlockRegex.test(content)) {
    content = content.replace(badBlockRegex, `"name": "promotions",\n    ${cleanPromotionsReply}`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed successfully using regex method in: ${filePath}`);
  } else {
    // Thử phương án thay thế chuỗi trực tiếp thô
    // Tìm dòng chứa "name": "promotions"
    const lines = content.split('\n');
    let startIndex = -1;
    let endIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('"name": "promotions"') || lines[i].includes("'name': 'promotions'")) {
        startIndex = i;
      }
      if (startIndex !== -1 && (lines[i].includes('"name": "civilizations"') || lines[i].includes("'name': 'civilizations'"))) {
        endIndex = i;
        break;
      }
    }

    if (startIndex !== -1 && endIndex !== -1) {
      console.log(`   Found promotions block from line ${startIndex + 1} to ${endIndex + 1}`);
      const beforeBlock = lines.slice(0, startIndex + 1).join('\n');
      const afterBlock = lines.slice(endIndex - 1).join('\n');
      
      const newBlock = `    ${cleanPromotionsReply}\n  },\n  {`;
      content = beforeBlock + '\n' + newBlock + '\n' + afterBlock;
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed successfully using line division method in: ${filePath}`);
    } else {
      console.log(`❌ Could not target promotions block in: ${filePath}`);
    }
  }
}

files.forEach(file => fixFile(file));
console.log("=== SYNTAX ERROR FIX COMPLETED ===");
