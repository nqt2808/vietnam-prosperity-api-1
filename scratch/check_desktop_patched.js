const fs = require('fs');
const path = require('path');

const desktopIndexHtml = 'C:\\Users\\dell 7620\\Desktop\\index.html';

if (!fs.existsSync(desktopIndexHtml)) {
  console.log(`⚠️ Desktop index.html not found: ${desktopIndexHtml}`);
  process.exit(1);
}

const content = fs.readFileSync(desktopIndexHtml, 'utf8');

console.log('--- Checking About Images on Desktop ---');
const imgRegex = /src="https:\/\/res\.cloudinary\.com\/dojibbcof\/image\/upload\/v1779773457\/660455604_1376016174556571_698903480620260313_n_gfnhyd\.jpg"/;
console.log('Image 1 matches:', imgRegex.test(content));

console.log('\n--- Checking Quick Chat Buttons on Desktop ---');
const quickChatBlock = content.match(/<div class="quick-chat">.*?<\/div>/s);
if (quickChatBlock) {
  console.log(quickChatBlock[0]);
} else {
  console.log('⚠️ Quick chat block not found or not matched!');
}

console.log('\n--- Checking Ly / Tách / Bình giữ nhiệt replacement on Desktop ---');
const countLyTach = (content.match(/Ly \/ Tách \/ Bình giữ nhiệt/g) || []).length;
const countLyTachNew = (content.match(/Ly, Tách, Bình giữ nhiệt/g) || []).length;
console.log(`Occurrences of "Ly / Tách / Bình giữ nhiệt": ${countLyTach}`);
console.log(`Occurrences of "Ly, Tách, Bình giữ nhiệt": ${countLyTachNew}`);
