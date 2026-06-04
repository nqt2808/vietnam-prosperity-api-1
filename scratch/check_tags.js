const fs = require('fs');
const content = fs.readFileSync('d:\\Du-an\\website-vpc\\index.html', 'utf8');

// A simple HTML tag balancer check
const lines = content.split('\n');
const stack = [];
const tagsToTrack = ['div', 'section', 'main', 'header', 'nav', 'footer', 'button', 'a'];

lines.forEach((line, idx) => {
  // Find tags
  const regex = /<\/?([a-zA-Z0-9-]+)(?:\s+[^>]*)*>/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    const tagName = match[1].toLowerCase();
    if (!tagsToTrack.includes(tagName)) continue;
    
    const isClosing = match[0].startsWith('</');
    
    if (isClosing) {
      if (stack.length === 0) {
        console.warn(`Line ${idx+1}: Unexpected closing tag </${tagName}> but stack is empty`);
      } else {
        const last = stack.pop();
        if (last.name !== tagName) {
          console.warn(`Line ${idx+1}: Mismatched closing tag </${tagName}>, expected </${last.name}> (opened at Line ${last.line})`);
        }
      }
    } else {
      // Self closing check
      if (!match[0].endsWith('/>')) {
        stack.push({ name: tagName, line: idx + 1 });
      }
    }
  }
});

if (stack.length > 0) {
  console.warn("Unclosed tags remaining in stack:");
  stack.forEach(t => console.warn(`- <${t.name}> opened at Line ${t.line}`));
} else {
  console.log("✅ HTML tags are perfectly balanced!");
}
