const fs = require('fs');

const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const pages = ['home', 'menu', 'merch', 'blog', 'cart', 'about', 'contact', 'lookup', 'article-detail', 'bank-payment'];

console.log("=== Checking Page element IDs in HTML ===");
pages.forEach(page => {
  // Check for id="page" or id='page'
  const doubleQuoteReg = new RegExp(`id="${page}"`, 'i');
  const singleQuoteReg = new RegExp(`id='${page}'`, 'i');
  const hasDouble = doubleQuoteReg.test(content);
  const hasSingle = singleQuoteReg.test(content);
  
  if (hasDouble || hasSingle) {
    console.log(`Page '${page}': EXISTS`);
  } else {
    console.log(`Page '${page}': NOT FOUND !!!`);
  }
});
