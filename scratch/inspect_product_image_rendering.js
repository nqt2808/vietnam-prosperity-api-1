const fs = require('fs');
const path = require('path');

const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const content = fs.readFileSync(storefrontClient, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCHING FOR PRODUCT IMAGE RENDERING IN storefront-client.tsx ===");
lines.forEach((line, index) => {
  if (line.includes('product.image') || line.includes('product.product_images') || line.includes('image_url') || line.includes('imageUrl')) {
    console.log(`[Line ${index + 1}]: ${line.trim().substring(0, 120)}`);
  }
});
