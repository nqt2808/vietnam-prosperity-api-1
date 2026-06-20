const fs = require('fs');
const path = require('path');

function convertToUtf8(filename) {
    const filePath = path.join(__dirname, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`${filename} does not exist.`);
        return;
    }
    const buf = fs.readFileSync(filePath);
    // Check for UTF-16LE BOM (FF FE) or UTF-16BE BOM (FE FF)
    if (buf[0] === 0xff && buf[1] === 0xfe) {
        console.log(`${filename} is UTF-16LE. Converting...`);
        const content = buf.toString('utf16le');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`${filename} converted to UTF-8 successfully.`);
    } else if (buf[0] === 0xfe && buf[1] === 0xff) {
        console.log(`${filename} is UTF-16BE. Converting...`);
        // Swap bytes to read as UTF-16BE or use specific decoding
        // Simple conversion:
        const content = buf.toString('utf16be');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`${filename} converted to UTF-8 successfully.`);
    } else {
        console.log(`${filename} does not have UTF-16 BOM. Inspecting content...`);
        // Let's force rewrite to UTF-8 if there are null bytes typical of UTF-16 without BOM
        const hasNulls = buf.includes(0);
        if (hasNulls) {
            console.log(`${filename} contains null bytes, likely UTF-16 without BOM. Converting from utf16le...`);
            const content = buf.toString('utf16le');
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`${filename} converted to UTF-8.`);
        } else {
            console.log(`${filename} is already likely UTF-8.`);
        }
    }
}

convertToUtf8('admin.html');
convertToUtf8('index.html');
