const fs = require('fs');
const path = require('path');

const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');

if (!fs.existsSync(storefrontClient)) {
  console.error("❌ File not found!");
  process.exit(1);
}

console.log("=== FIXING TYPESCRIPT KEYWORDS FOR CHATBOT INTENTS ===");

let content = fs.readFileSync(storefrontClient, 'utf8');

// 1. Thay thế promotions
content = content.replace(
  /"name": "promotions",\s*"reply":/g,
  `"name": "promotions",\n    "keywords": ["khuyến mãi", "ưu đãi", "happy hour", "happy lunch", "giảm giá", "sale", "tặng", "mua 1 tặng 1", "khuyen mai", "uu dai", "happyhours", "happylunch"],\n    "reply":`
);

// 2. Thay thế civilizations
content = content.replace(
  /"name": "civilizations",\s*"reply":/g,
  `"name": "civilizations",\n    "keywords": ["văn minh", "van minh", "ottoman", "roman", "thiền", "thien", "3 nền văn minh", "nền văn minh", "lịch sử"],\n    "reply":`
);

// 3. Thay thế membership
content = content.replace(
  /"name": "membership",\s*"reply":/g,
  `"name": "membership",\n    "keywords": ["thành viên", "thanh vien", "tích điểm", "tich diem", "silver", "gold", "platinum", "vip", "thẻ", "the", "nâng hạng", "hạng"],\n    "reply":`
);

fs.writeFileSync(storefrontClient, content, 'utf8');
console.log("🎉 TypeScript keywords successfully added to chatbotIntents in storefront-client.tsx!");
