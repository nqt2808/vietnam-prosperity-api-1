const fs = require('fs');
const path = require('path');

const projectIndex = 'd:/Du-an/website-vpc/index.html';
const desktopIndex = 'c:/Users/dell 7620/Desktop/index.html';

const oldStyle = `    .quick-chat {
      display: grid;
      gap: 6px;
      padding: 0 14px 10px;
    }

    .quick-chat button {
      border: 1px solid #decdb9;
      background: #fffaf4;
      border-radius: 999px;
      padding: 9px 12px;
      cursor: pointer;
      font-weight: 800;
      color: var(--coffee-dark);
      font-size: 12.5px;
      text-align: left;
      transition: 0.2s;
    }`;

const newStyle = `    .quick-chat {
      display: flex;
      overflow-x: auto;
      gap: 8px;
      padding: 0 14px 12px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
    }

    .quick-chat::-webkit-scrollbar {
      display: none;
    }

    .quick-chat button {
      border: 1px solid #decdb9;
      background: #fffaf4;
      border-radius: 999px;
      padding: 9px 16px;
      cursor: pointer;
      font-weight: 800;
      color: var(--coffee-dark);
      font-size: 12.5px;
      text-align: center;
      transition: 0.2s;
      flex-shrink: 0;
    }`;

function patchChatbotStyle(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }
  
  console.log(`⚙️ Patching chatbot quick-chat style for: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace old quick-chat CSS with new quick-chat CSS
  if (content.includes(oldStyle)) {
    content = content.replace(oldStyle, newStyle);
    console.log(`   ✅ Replaced styling successfully`);
  } else {
    // If exact spaces differ, do regex replace
    const styleRegex = /\.quick-chat\s*\{\s*display:\s*grid;[\s\S]*?text-align:\s*left;[\s\S]*?\}/;
    if (styleRegex.test(content)) {
      content = content.replace(styleRegex, newStyle);
      console.log(`   ✅ Replaced styling via regex successfully`);
    } else {
      console.log(`   ❌ Could not find quick-chat styles to replace`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

patchChatbotStyle(projectIndex);
patchChatbotStyle(desktopIndex);
