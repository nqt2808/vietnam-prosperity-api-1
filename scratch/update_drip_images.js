const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Read environment variables for Supabase
const envPath = path.resolve(__dirname, '../.env.local');
let env = {};
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const index = trimmed.indexOf('=');
      if (index !== -1) {
        const key = trimmed.substring(0, index).trim();
        const val = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
        env[key] = val;
      }
    }
  });
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

// Cloudinary image links provided by the user
const drip1Img = "https://res.cloudinary.com/dojibbcof/image/upload/v1779951070/5000624_1_kj7gqw.jpg";
const drip2Img = "https://res.cloudinary.com/dojibbcof/image/upload/v1779951071/5000625_1_y4jgqa.jpg";
const drip4Img = "https://res.cloudinary.com/dojibbcof/image/upload/v1779951070/5000626_1_plmndl.jpg";
const drip5Img = "https://res.cloudinary.com/dojibbcof/image/upload/v1779951070/5000627_1_vmfoit.jpg";

async function updateSupabaseImage() {
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase keys in .env.local!");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log("📡 Connecting to Supabase database...");

  // Get product ID for Cà phê Drip 1
  const { data: prodData, error: prodErr } = await supabase
    .from('products')
    .select('id')
    .eq('slug', 'ca-phe-drip-1-culi-robusta')
    .single();

  if (prodErr || !prodData) {
    console.error("❌ Error fetching product ID for Drip 1:", prodErr ? prodErr.message : "Not found");
    return;
  }

  const productId = prodData.id;
  console.log(`✅ Found product ID for Cà phê Drip 1: ${productId}`);

  // Check if image already exists in product_images
  const { data: imgData, error: imgErr } = await supabase
    .from('product_images')
    .select('id')
    .eq('product_id', productId);

  if (imgErr) {
    console.error("❌ Error checking product_images:", imgErr.message);
    return;
  }

  if (imgData && imgData.length > 0) {
    // Update existing image
    const { error: updateErr } = await supabase
      .from('product_images')
      .update({ url: drip1Img })
      .eq('product_id', productId);

    if (updateErr) {
      console.error("❌ Error updating product_images:", updateErr.message);
    } else {
      console.log("✅ Successfully updated Cà phê Drip 1 image URL in Supabase product_images table!");
    }
  } else {
    // Insert new image
    const { error: insertErr } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        url: drip1Img,
        is_primary: true
      });

    if (insertErr) {
      console.error("❌ Error inserting into product_images:", insertErr.message);
    } else {
      console.log("✅ Successfully inserted new Cà phê Drip 1 image URL into Supabase product_images table!");
    }
  }
}

// Update static HTML files
const projectIndex = path.join(__dirname, '../index.html');
const desktopIndex = 'C:\\Users\\dell 7620\\Desktop\\index.html';
const indexes = [projectIndex, desktopIndex];

function updateIndexHtmlFiles() {
  indexes.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Skipping missing file: ${filePath}`);
      return;
    }

    console.log(`Patching HTML: ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Tìm và thay thế các dòng link ảnh cũ của dòng Drip
    const drip1ImgPattern = /"ca-phe-drip-1-culi-robusta":\s*"[^"]*",/gi;
    const drip2ImgPattern = /"ca-phe-drip-2-robusta-arabica":\s*"[^"]*",/gi;
    const drip4ImgPattern = /"ca-phe-drip-4-premium-culi":\s*"[^"]*",/gi;
    const drip5ImgPattern = /"ca-phe-drip-5-culi-arabica":\s*"[^"]*",/gi;

    if (drip1ImgPattern.test(content)) {
      content = content.replace(drip1ImgPattern, `"ca-phe-drip-1-culi-robusta": "${drip1Img}",`);
      console.log("- Updated Cà phê Drip 1 image link.");
    }
    if (drip2ImgPattern.test(content)) {
      content = content.replace(drip2ImgPattern, `"ca-phe-drip-2-robusta-arabica": "${drip2Img}",`);
      console.log("- Updated Cà phê Drip 2 image link.");
    }
    if (drip4ImgPattern.test(content)) {
      content = content.replace(drip4ImgPattern, `"ca-phe-drip-4-premium-culi": "${drip4Img}",`);
      console.log("- Updated Cà phê Drip 4 image link.");
    }
    if (drip5ImgPattern.test(content)) {
      content = content.replace(drip5ImgPattern, `"ca-phe-drip-5-culi-arabica": "${drip5Img}",`);
      console.log("- Updated Cà phê Drip 5 image link.");
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`🎉 Done patching: ${filePath}`);
  });
}

async function main() {
  await updateSupabaseImage();
  updateIndexHtmlFiles();
  console.log("\n=== COMPLETED SPECIFIC DRIP IMAGES UPDATES ===");
}

main();
