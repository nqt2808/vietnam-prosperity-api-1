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

// New descriptions provided by the user
const drip1Desc = "Đậm vị, mạnh mẽ, hương thơm nồng, hậu vị sâu. Phù hợp cho người thích cà phê đậm và cần tỉnh táo.";
const drip2Desc = "Cân bằng giữa vị đậm của Robusta và hương thanh của Arabica. Dễ uống, phù hợp dùng hằng ngày.";
const drip4Desc = "Dòng cao cấp, vị đậm nhưng mượt, hương thơm sâu và sang trọng. Phù hợp để thưởng thức chậm rãi.";
const drip5Desc = "Thanh nhẹ, tinh tế, có hương trái cây/hoa nhẹ và hậu ngọt. Phù hợp người thích cà phê hiện đại, nhẹ nhàng.";

async function updateSupabaseProduct() {
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase keys in .env.local!");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log("📡 Connecting to Supabase database...");

  // Update Cà phê Drip 1 description
  const { data, error } = await supabase
    .from('products')
    .update({
      short_description: drip1Desc,
      description: drip1Desc
    })
    .eq('slug', 'ca-phe-drip-1-culi-robusta');

  if (error) {
    console.error("❌ Error updating ca-phe-drip-1-culi-robusta in database:", error.message);
  } else {
    console.log("✅ Successfully updated Cà phê Drip 1 in database!");
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

    // Tìm và thay thế các dòng mô tả cụ thể cũ
    const drip1Pattern = /"ca-phe-drip-1-culi-robusta":\s*"[^"]*",/gi;
    const drip2Pattern = /"ca-phe-drip-2-robusta-arabica":\s*"[^"]*",/gi;
    const drip4Pattern = /"ca-phe-drip-4-premium-culi":\s*"[^"]*",/gi;
    const drip5Pattern = /"ca-phe-drip-5-culi-arabica":\s*"[^"]*",/gi;

    if (drip1Pattern.test(content)) {
      content = content.replace(drip1Pattern, `"ca-phe-drip-1-culi-robusta": "${drip1Desc}",`);
      console.log("- Patched Cà phê Drip 1 description.");
    }
    if (drip2Pattern.test(content)) {
      content = content.replace(drip2Pattern, `"ca-phe-drip-2-robusta-arabica": "${drip2Desc}",`);
      console.log("- Patched Cà phê Drip 2 description.");
    }
    if (drip4Pattern.test(content)) {
      content = content.replace(drip4Pattern, `"ca-phe-drip-4-premium-culi": "${drip4Desc}",`);
      console.log("- Patched Cà phê Drip 4 description.");
    }
    if (drip5Pattern.test(content)) {
      content = content.replace(drip5Pattern, `"ca-phe-drip-5-culi-arabica": "${drip5Desc}",`);
      console.log("- Patched Cà phê Drip 5 description.");
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`🎉 Done patching: ${filePath}`);
  });
}

async function main() {
  await updateSupabaseProduct();
  updateIndexHtmlFiles();
  console.log("\n=== COMPLETED SPECIFIC DRIP DESCRIPTIONS UPDATES ===");
}

main();
