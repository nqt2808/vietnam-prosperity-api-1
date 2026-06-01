const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '../index.html');
const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');

if (!fs.existsSync(indexFile) || !fs.existsSync(storefrontClient)) {
  console.error("❌ Required files not found!");
  process.exit(1);
}

console.log("=== SYNCING ENRICHED CHATBOT (DIRECT STRING SUB) ===");

// 1. Đọc index.html và trích xuất chatbotIntents
const indexContent = fs.readFileSync(indexFile, 'utf-8');
const intentsMatch = indexContent.match(/const chatbotIntents = (\[[\s\S]*?\]);\s*\n/i);

if (!intentsMatch) {
  console.error("❌ Could not find chatbotIntents array in index.html!");
  process.exit(1);
}

console.log("✅ Successfully extracted raw chatbotIntents array string from index.html.");

// 2. Chuyển đổi sang định dạng TypeScript / TSX
// Chúng ta chỉ cần thay thế từ khóa để chuyển nó thành const chatbotIntents: ChatbotIntent[] =
const rawIntentsArrayString = intentsMatch[1];
const tsxIntentsCode = `const chatbotIntents: ChatbotIntent[] = ${rawIntentsArrayString}\n`;

// 3. Đọc storefront-client.tsx và thay thế mảng chatbotIntents cũ
let clientContent = fs.readFileSync(storefrontClient, 'utf-8');

const clientIntentsRegex = /const chatbotIntents:\s*ChatbotIntent\[\]\s*=\s*\[[\s\S]*?\]\s*\n/i;

if (clientIntentsRegex.test(clientContent)) {
  clientContent = clientContent.replace(clientIntentsRegex, tsxIntentsCode);
  fs.writeFileSync(storefrontClient, clientContent, 'utf-8');
  console.log("🎉 Next.js storefront-client.tsx chatbot intents synced & upgraded successfully via direct string sync!");
} else {
  // Thử trường hợp không có kiểu ChatbotIntent[]
  const altRegex = /const chatbotIntents\s*=\s*\[[\s\S]*?\]\s*\n/i;
  if (altRegex.test(clientContent)) {
    clientContent = clientContent.replace(altRegex, tsxIntentsCode);
    fs.writeFileSync(storefrontClient, clientContent, 'utf-8');
    console.log("🎉 Next.js storefront-client.tsx chatbot intents synced successfully (alternative)!");
  } else {
    console.error("❌ Could not find chatbotIntents definition in storefront-client.tsx!");
  }
}

console.log("=== CHATBOT SYNC COMPLETED ===");
