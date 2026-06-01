const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Đọc cấu hình kết nối từ .env.local
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
  console.error("❌ Thiếu cấu hình Supabase trong .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Các slug danh mục thuộc nhóm Đồ Uống
const drinkCategorySlugs = [
  'ca-phe-phin', 'ca-phe-may', 'ca-phe-pha-che', 'nuoc-ep', 
  'nuoc-thanh-nhiet', 'banh', 'mon-extra', 'matcha-cacao', 
  'sinh-to-da-xay', 'tra-tra-sua', 'ca-phe-bot-sang-tao'
];

async function sync() {
  console.log("⚡ Bắt đầu đồng bộ hóa dữ liệu Supabase giữa các bảng tiếng Anh và tiếng Việt...");

  // 1. Đồng bộ Danh mục (categories <-> danh_muc_san_pham)
  console.log("\n--- 📂 ĐỒNG BỘ DANH MỤC ---");
  const { data: engCats, error: engCatsErr } = await supabase.from('categories').select('*');
  const { data: viCats, error: viCatsErr } = await supabase.from('danh_muc_san_pham').select('*');

  if (engCatsErr || viCatsErr) {
    console.error("❌ Lỗi lấy danh mục:", engCatsErr?.message || viCatsErr?.message);
    return;
  }

  console.log(`Tìm thấy: ${engCats.length} danh mục tiếng Anh, ${viCats.length} danh mục tiếng Việt`);

  // Map danh mục theo slug
  const engCatsMap = new Map(engCats.map(c => [c.slug, c]));
  const viCatsMap = new Map(viCats.map(c => [c.slug, c]));

  // Đồng bộ từ categories sang danh_muc_san_pham
  for (const [slug, engCat] of engCatsMap.entries()) {
    if (!viCatsMap.has(slug)) {
      console.log(`➕ Thêm danh mục mới sang tiếng Việt: ${engCat.name} (${slug})`);
      const loai = drinkCategorySlugs.includes(slug) ? 'do_uong' : 'merchandise';
      const { data, error } = await supabase.from('danh_muc_san_pham').insert({
        ten_danh_muc: engCat.name,
        slug: engCat.slug,
        loai: loai,
        thu_tu_hien_thi: engCat.sort_order || 0,
        hien_thi: engCat.is_active !== false
      }).select();
      if (error) console.error("❌ Lỗi thêm danh mục tiếng Việt:", error.message);
      else if (data && data[0]) viCatsMap.set(slug, data[0]);
    }
  }

  // Đồng bộ từ danh_muc_san_pham sang categories
  for (const [slug, viCat] of viCatsMap.entries()) {
    if (!engCatsMap.has(slug)) {
      console.log(`➕ Thêm danh mục mới sang tiếng Anh: ${viCat.ten_danh_muc} (${slug})`);
      const { data, error } = await supabase.from('categories').insert({
        name: viCat.ten_danh_muc,
        slug: viCat.slug,
        sort_order: viCat.thu_tu_hien_thi || 0,
        is_active: viCat.hien_thi !== false
      }).select();
      if (error) console.error("❌ Lỗi thêm danh mục tiếng Anh:", error.message);
      else if (data && data[0]) engCatsMap.set(slug, data[0]);
    }
  }

  // 2. Đồng bộ Sản phẩm (products <-> san_pham_do_uong / san_pham_merchandise)
  console.log("\n--- 🍰 ĐỒNG BỘ SẢN PHẨM ---");
  const { data: products, error: prodErr } = await supabase.from('products').select('*');
  const { data: drinks, error: drinksErr } = await supabase.from('san_pham_do_uong').select('*');
  const { data: merch, error: merchErr } = await supabase.from('san_pham_merchandise').select('*');

  if (prodErr || drinksErr || merchErr) {
    console.error("❌ Lỗi lấy sản phẩm:", prodErr?.message || drinksErr?.message || merchErr?.message);
    return;
  }

  console.log(`Tìm thấy: ${products.length} sản phẩm (bảng products), ${drinks.length} đồ uống, ${merch.length} vật phẩm`);

  const productsMap = new Map(products.map(p => [p.slug, p]));
  const drinksMap = new Map(drinks.map(d => [d.slug, d]));
  const merchMap = new Map(merch.map(m => [m.slug, m]));

  // 2a. Đồng bộ từ products sang các bảng tiếng Việt
  for (const [slug, prod] of productsMap.entries()) {
    // Tìm danh mục tiếng Việt tương ứng
    let viCatId = null;
    if (prod.category_id) {
      const engCat = engCats.find(c => c.id === prod.category_id);
      if (engCat) {
        const viCat = viCatsMap.get(engCat.slug);
        if (viCat) viCatId = viCat.id;
      }
    }

    const isDrink = viCatId ? drinkCategorySlugs.includes(viCats.find(c => c.id === viCatId)?.slug) : true;

    if (isDrink) {
      if (!drinksMap.has(slug)) {
        console.log(`🍹 Thêm đồ uống mới sang tiếng Việt: ${prod.name} (${slug})`);
        const { error } = await supabase.from('san_pham_do_uong').insert({
          danh_muc_id: viCatId,
          ten_san_pham: prod.name,
          slug: prod.slug,
          mo_ta: prod.description || prod.short_description || "",
          gia_den: parseFloat(prod.price) || 0,
          gia_sua: 0,
          la_mon_noi_bat: prod.is_featured || false,
          hien_thi: prod.status === 'active'
        });
        if (error) console.error(`❌ Lỗi thêm đồ uống ${slug}:`, error.message);
      }
    } else {
      if (!merchMap.has(slug)) {
        console.log(`🎁 Thêm vật phẩm mới sang tiếng Việt: ${prod.name} (${slug})`);
        const { error } = await supabase.from('san_pham_merchandise').insert({
          danh_muc_id: viCatId,
          ten_san_pham: prod.name,
          slug: prod.slug,
          mo_ta: prod.description || prod.short_description || "",
          gia: parseFloat(prod.price) || 0,
          con_ban: true,
          hien_thi: prod.status === 'active'
        });
        if (error) console.error(`❌ Lỗi thêm vật phẩm ${slug}:`, error.message);
      }
    }
  }

  // 2b. Đồng bộ từ san_pham_do_uong sang products
  for (const [slug, drink] of drinksMap.entries()) {
    if (!productsMap.has(slug)) {
      console.log(`➕ Thêm đồ uống sang bảng products tiếng Anh: ${drink.ten_san_pham} (${slug})`);
      
      // Tìm danh mục tiếng Anh tương ứng
      let engCatId = null;
      if (drink.danh_muc_id) {
        const viCat = viCats.find(c => c.id === drink.danh_muc_id);
        if (viCat) {
          const engCat = engCatsMap.get(viCat.slug);
          if (engCat) engCatId = engCat.id;
        }
      }

      const { error } = await supabase.from('products').insert({
        name: drink.ten_san_pham,
        slug: drink.slug,
        description: drink.mo_ta,
        short_description: drink.mo_ta ? drink.mo_ta.substring(0, 100) : "",
        price: drink.gia_den || drink.gia_sua || 0,
        category_id: engCatId,
        status: drink.hien_thi ? 'active' : 'draft',
        is_featured: drink.la_mon_noi_bat || false
      });
      if (error) console.error(`❌ Lỗi đồng bộ đồ uống sang products ${slug}:`, error.message);
    }
  }

  // 2c. Đồng bộ từ san_pham_merchandise sang products
  for (const [slug, item] of merchMap.entries()) {
    if (!productsMap.has(slug)) {
      console.log(`➕ Thêm vật phẩm sang bảng products tiếng Anh: ${item.ten_san_pham} (${slug})`);

      // Tìm danh mục tiếng Anh tương ứng
      let engCatId = null;
      if (item.danh_muc_id) {
        const viCat = viCats.find(c => c.id === item.danh_muc_id);
        if (viCat) {
          const engCat = engCatsMap.get(viCat.slug);
          if (engCat) engCatId = engCat.id;
        }
      }

      const { error } = await supabase.from('products').insert({
        name: item.ten_san_pham,
        slug: item.slug,
        description: item.mo_ta,
        short_description: item.mo_ta ? item.mo_ta.substring(0, 100) : "",
        price: item.gia || 0,
        category_id: engCatId,
        status: item.hien_thi ? 'active' : 'draft',
        is_featured: false
      });
      if (error) console.error(`❌ Lỗi đồng bộ vật phẩm sang products ${slug}:`, error.message);
    }
  }

  console.log("\n🎉 HOÀN TẤT ĐỒNG BỘ HÓA DỮ LIỆU!");
}

sync();
