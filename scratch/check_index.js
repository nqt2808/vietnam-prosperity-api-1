const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const errors = [];
const warnings = [];

// 1. Tag counts
const opens = (html.match(/<script/g) || []).length;
const closes = (html.match(/<\/script>/g) || []).length;
if (opens !== closes) errors.push('script tag mismatch: open=' + opens + ' close=' + closes);

const divOpen = (html.match(/<div[\s>]/g) || []).length;
const divClose = (html.match(/<\/div>/g) || []).length;
if (divOpen !== divClose) errors.push('div mismatch: open=' + divOpen + ' close=' + divClose);

const formOpen = (html.match(/<form[\s>]/g) || []).length;
const formClose = (html.match(/<\/form>/g) || []).length;
if (formOpen !== formClose) errors.push('form mismatch: open=' + formOpen + ' close=' + formClose);

// 2. Backtick balance per script block
const scripts = [];
const scriptRe = /<script[^>]*>([\s\S]*?)<\/script>/g;
let sm;
while ((sm = scriptRe.exec(html)) !== null) {
  scripts.push({ idx: scripts.length + 1, code: sm[1] });
}
scripts.forEach(s => {
  const bt = (s.code.match(/`/g) || []).length;
  if (bt % 2 !== 0) errors.push('Unclosed template literal in script #' + s.idx + ' (odd backtick count: ' + bt + ')');
});

// 3. Duplicate IDs
const idPat = /id=["']([^"']+)["']/g;
const idCount = {};
let mm;
while ((mm = idPat.exec(html)) !== null) {
  idCount[mm[1]] = (idCount[mm[1]] || 0) + 1;
}
const dups = Object.entries(idCount).filter(function(e) { return e[1] > 1; });
if (dups.length > 0) errors.push('Duplicate IDs: ' + dups.map(function(e){ return e[0]+'('+e[1]+'x)'; }).join(', '));

// 4. Check chatbotIntents exists
const cMatch = html.match(/const chatbotIntents\s*=\s*\[/);
if (!cMatch) warnings.push('chatbotIntents not found in index.html');

// 5. Check scripts for double commas
scripts.forEach(s => {
  if (/,,/.test(s.code)) errors.push('Double comma (,,) found in script #' + s.idx);
});

// 6. CSS brace balance
const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/g;
const styles = [];
let stm;
while ((stm = styleRe.exec(html)) !== null) {
  styles.push({ idx: styles.length + 1, css: stm[1] });
}
styles.forEach(s => {
  const open = (s.css.match(/\{/g) || []).length;
  const close = (s.css.match(/\}/g) || []).length;
  if (open !== close) errors.push('CSS brace mismatch in style #' + s.idx + ': {=' + open + ' }=' + close);
});

// 7. Check for common JS issues in scripts - unmatched braces per script
scripts.forEach(s => {
  const braceOpen = (s.code.match(/\{/g) || []).length;
  const braceClose = (s.code.match(/\}/g) || []).length;
  if (Math.abs(braceOpen - braceClose) > 5) {
    warnings.push('Script #' + s.idx + ' possible unmatched braces: {=' + braceOpen + ' }=' + braceClose);
  }
});

// 8. Check for common navigation issues - onclick handlers
const navBtns = html.match(/onclick="showPage\([^)]+\)"/g) || [];

// 9. Check for broken image src
const brokenSrc = html.match(/src=["'][''"]/g) || [];
if (brokenSrc.length > 0) warnings.push('Empty src attributes: ' + brokenSrc.length + ' found');

// 10. Check meta tags
if (!html.includes('<meta charset')) errors.push('Missing charset meta tag');
if (!html.includes('<meta name="viewport"')) warnings.push('Missing viewport meta tag');

console.log('=== ERRORS (' + errors.length + ') ===');
if (errors.length === 0) console.log('  (none)');
errors.forEach(function(e) { console.log('  FAIL: ' + e); });

console.log('\n=== WARNINGS (' + warnings.length + ') ===');
if (warnings.length === 0) console.log('  (none)');
warnings.forEach(function(w) { console.log('  WARN: ' + w); });

console.log('\n=== STATS ===');
console.log('  Total lines:', html.split('\n').length);
console.log('  Size:', (html.length/1024).toFixed(1) + 'KB');
console.log('  <script> blocks:', opens);
console.log('  <div> open=' + divOpen + ' close=' + divClose);
console.log('  <form> open=' + formOpen + ' close=' + formClose);
console.log('  <style> blocks:', styles.length);
console.log('  Nav onclick buttons (showPage):', navBtns.length);
console.log('  Duplicate IDs total:', dups.length);
