const fs = require('fs');
const vm = require('vm');

const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

// Extract JS content
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let jsContent = '';
while ((match = scriptRegex.exec(content)) !== null) {
  jsContent += match[1] + '\n';
}

const sandbox = {
  document: {
    getElementById: () => null,
    querySelectorAll: () => []
  },
  window: {
    location: { hash: '' }
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  setTimeout: () => {},
  clearTimeout: () => {},
  console: console
};

try {
  vm.runInNewContext(jsContent + '\nconsole.log("blogItems count:", blogItems.length);', sandbox);
  const blogItems = sandbox.blogItems;
  
  blogItems.forEach((item, idx) => {
    console.log(`Checking item ${idx + 1}: ${item.title}`);
    if (!item.thumbnail) {
      console.error(`  >>> ERROR: Item at index ${idx} is missing thumbnail!`);
    } else {
      console.log(`  Thumbnail: ${item.thumbnail}`);
    }
    if (!item.images) {
      console.error(`  >>> ERROR: Item at index ${idx} is missing images!`);
    }
    if (!item.videos) {
      console.error(`  >>> ERROR: Item at index ${idx} is missing videos!`);
    }
  });
} catch (err) {
  console.error("Error evaluating script:", err.stack);
}
