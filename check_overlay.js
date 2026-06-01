const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Check lookup-box CSS
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  const style = styleMatch[1];
  // Find lookup-box CSS
  const lbCss = style.match(/\.lookup-box[\s\S]*?\}/);
  console.log('lookup-box CSS:', lbCss ? lbCss[0].substring(0, 500) : 'not found');
  
  // All fixed elements
  const lines = style.split('\n');
  let inFixed = false;
  let currentBlock = '';
  let currentName = '';
  lines.forEach(line => {
    if (line.includes('{') && !inFixed) {
      currentName = line;
      currentBlock = line;
      inFixed = true;
    } else if (inFixed) {
      currentBlock += line;
      if (line.includes('}')) {
        if (currentBlock.includes('position') && (currentBlock.includes('fixed') || currentBlock.includes('absolute'))) {
          const zi = currentBlock.match(/z-index\s*:\s*(\d+)/);
          if (zi && parseInt(zi[1]) > 900) {
            console.log('HIGH Z-INDEX FIXED:', currentName.trim(), '| z-index:', zi[1]);
          }
        }
        inFixed = false;
        currentBlock = '';
      }
    }
  });
}

// Check for any element in HTML with full-page cover styles
const matches = [...html.matchAll(/style="([^"]*(?:100vh|100vw|width:\s*100%)[^"]*position[^"]*)"/gi)];
matches.forEach(m => {
  console.log('FULL WIDTH ELEMENT:', m[0].substring(0, 200));
});

// Check if lookup-box div exists and its display value
const lookupBoxMatch = html.match(/<div[^>]*class="lookup-box"[^>]*>/);
console.log('lookup-box div:', lookupBoxMatch ? lookupBoxMatch[0] : 'not found');

// Check the lookup-box css specifically
const allCss = styleMatch ? styleMatch[1] : '';
const startIdx = allCss.indexOf('.lookup-box');
if (startIdx > -1) {
  console.log('lookup-box at idx', startIdx, ':', allCss.substring(startIdx, startIdx + 300));
}
