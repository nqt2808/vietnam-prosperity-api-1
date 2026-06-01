const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("⚡ Starting Supabase G7 coffee category merge...");

  // 1. Update san_pham_merchandise: Move all products under danh_muc_id = 22 (Cà phê hòa tan G7) to danh_muc_id = 13 (Cà phê hòa tan)
  console.log("📦 Moving products from category 22 to 13...");
  const { data: updatedProducts, error: errMove } = await supabase
    .from('san_pham_merchandise')
    .update({ danh_muc_id: 13 })
    .eq('danh_muc_id', 22)
    .select('id, ten_san_pham');

  if (errMove) {
    console.error("❌ Error moving products: ", errMove.message);
  } else {
    console.log(`✅ Successfully moved ${updatedProducts.length} products to Cà phê hòa tan.`);
    updatedProducts.forEach(p => console.log(`   - ${p.ten_san_pham}`));
  }

  // 2. Ensure Cà phê hòa tan sấy lạnh is in category 13
  console.log("☕ Ensuring Cà phê hòa tan sấy lạnh is in category 13...");
  const { data: updatedSlay, error: errSlay } = await supabase
    .from('san_pham_merchandise')
    .update({ danh_muc_id: 13 })
    .eq('slug', 'cf-hoa-tan-say-lanh')
    .select('id, ten_san_pham');

  if (errSlay) {
    console.error("❌ Error updating Cà phê hòa tan sấy lạnh: ", errSlay.message);
  } else {
    console.log(`✅ Cà phê hòa tan sấy lạnh is now in Cà phê hòa tan:`, updatedSlay);
  }

  // 3. Delete category 22 from danh_muc_san_pham
  console.log("🗑️ Deleting category 22 from danh_muc_san_pham...");
  const { error: errDelCat } = await supabase
    .from('danh_muc_san_pham')
    .delete()
    .eq('id', 22);

  if (errDelCat) {
    console.error("❌ Error deleting category 22: ", errDelCat.message);
  } else {
    console.log("✅ Category 22 deleted successfully!");
  }

  console.log("🎉 SUPABASE G7 CATEGORY MERGE COMPLETED SUCCESSFULLY!");
}

run();
