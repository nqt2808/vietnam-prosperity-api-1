const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = 'c:\\Users\\dell 7620\\Desktop\\vpc-admin.html';

try {
  const content = fs.readFileSync(htmlPath, 'utf8');
  console.log("File loaded, size:", content.length);

  // Trích xuất nội dung script
  const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
  let match;
  let scriptCount = 0;

  while ((match = scriptRegex.exec(content)) !== null) {
    scriptCount++;
    const scriptContent = match[1];
    console.log(`\nChecking script block #${scriptCount} (length: ${scriptContent.length})...`);
    
    try {
      // Sử dụng vm.Script để kiểm tra lỗi cú pháp mà không cần thực thi code
      new vm.Script(scriptContent);
      console.log(`✅ Script block #${scriptCount} has valid syntax!`);
    } catch (err) {
      console.error(`❌ SyntaxError in script block #${scriptCount}:`);
      console.error(err.stack || err.message);
    }
  }

  if (scriptCount === 0) {
    console.log("No <script> blocks found in the HTML!");
  }
} catch (err) {
  console.error("Error reading file:", err.message);
}
