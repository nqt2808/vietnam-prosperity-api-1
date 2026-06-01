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
const supabase = createClient(supabaseUrl, supabaseKey);

const drinkCategorySlugs = [
  'ca-phe-phin', 'ca-phe-may', 'ca-phe-pha-che', 'nuoc-ep', 
  'nuoc-thanh-nhiet', 'banh', 'mon-extra', 'matcha-cacao', 
  'sinh-to-da-xay', 'tra-tra-sua', 'ca-phe-bot-sang-tao'
];

async function run() {
  console.log("🧹 Bắt đầu dọn dẹp dữ liệu bị chèn nhầm...");

  // 1. Tải danh mục tiếng Anh
  const { data: engCats, error: engCatsErr } = await supabase.from('categories').select('*');
  if (engCatsErr) {
    console.error("❌ Lỗi lấy categories:", engCatsErr.message);
    return;
  }

  // 2. Tải sản phẩm tiếng Anh
  const { data: products, error: prodErr } = await supabase.from('products').select('*');
  if (prodErr) {
    console.error("❌ Lỗi lấy products:", prodErr.message);
    return;
  }

  // Phân loại danh mục merchandise
  const merchCatIds = new Set(
    engCats
      .filter(cat => !drinkCategorySlugs.includes(cat.slug))
      .map(cat => cat.id)
  );

  // Lọc ra các sản phẩm thực tế là merchandise nhưng không có danh mục hoặc thuộc danh mục merchandise
  const merchProductSlugs = products
    .filter(p => !p.category_id || merchCatIds.has(p.category_id))
    .map(p => p.slug);

  console.log(`Tìm thấy ${merchProductSlugs.length} sản phẩm thuộc nhóm Merchandise.`);

  // 3. Xóa các sản phẩm merchandise bị chèn nhầm vào bảng san_pham_do_uong
  if (merchProductSlugs.length > 0) {
    console.log("Xóa các sản phẩm merchandise khỏi bảng san_pham_do_uong nếu có...");
    const { data: deleted, error: deleteErr } = await supabase
      .from('san_pham_do_uong')
      .delete()
      .in('slug', merchProductSlugs)
      .select();

    if (deleteErr) {
      console.error("❌ Lỗi khi xóa sản phẩm nhầm:", deleteErr.message);
    } else {
      console.log(`✅ Đã xóa ${deleted ? deleted.length : 0} sản phẩm bị chèn nhầm khỏi san_pham_do_uong!`);
    }
  }

  console.log("\n🔄 Bắt đầu chạy lại đồng bộ chuẩn xác...");
  // Chạy file sync_database.js
  require('./sync_database.js');
}

run();
