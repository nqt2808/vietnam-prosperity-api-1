const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = "https://dmhorzhlftjuvijdmxku.supabase.co";
const supabaseKey = "sb_publishable_KUqsOrcyCYRwSHCbSF_psg_zip3ze34"; // Public anon key

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("📥 Đang tải tất cả sản phẩm hoạt động từ Supabase...");
  const { data: rawProducts, error: prodErr } = await supabase
    .from('products')
    .select('*, categories (slug, name)')
    .eq('status', 'active');

  if (prodErr) {
    console.error("❌ Lỗi khi lấy sản phẩm:", prodErr.message);
    process.exit(1);
  }

  console.log(`✅ Đã tải ${rawProducts.length} sản phẩm thành công.`);

  // Phân tách thành đồ uống và vật phẩm
  const drinks = rawProducts
    .filter(p => p.categories && p.categories.slug !== 'merchandise' && p.categories.slug !== 'vat-pham')
    .map(p => ({
      ten_san_pham: p.name,
      slug: p.slug,
      mo_ta: p.short_description || p.description || "",
      gia_den: p.metadata?.gia_den || p.price || 0,
      gia_sua: p.metadata?.gia_sua || 0,
      slug_danh_muc: p.categories.slug,
      ten_danh_muc: p.categories.name,
      sold_out: p.stock_quantity <= 0
    }));

  const merch = rawProducts
    .filter(p => p.categories && (p.categories.slug === 'merchandise' || p.categories.slug === 'vat-pham'))
    .map(p => ({
      ten_san_pham: p.name,
      slug: p.slug,
      mo_ta: p.short_description || p.description || "",
      gia: p.price,
      ten_danh_muc: p.categories.name,
      slug_danh_muc: p.categories.slug,
      stock_quantity: p.stock_quantity
    }));

  console.log(`🍹 Có ${drinks.length} món đồ uống.`);
  console.log(`🎁 Có ${merch.length} vật phẩm.`);

  // Ghi đoạn JS code fallback ra file text để nhúng
  const fallbackCode = `
    function getDrinksFallback() {
      return ${JSON.stringify(drinks, null, 2)};
    }

    function getMerchFallback() {
      return ${JSON.stringify(merch, null, 2)};
    }
  `;

  fs.writeFileSync(path.join(__dirname, 'fallbacks_data.js'), fallbackCode, 'utf8');
  console.log("🎉 Đã xuất thành công file fallbacks_data.js!");
}

run();
