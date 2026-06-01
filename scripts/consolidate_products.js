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
  console.error("❌ Error: Missing Supabase credentials in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to determine the target merchandise category ID
function getMerchandiseCategoryId(product, categories) {
  const nameLower = product.name.toLowerCase();
  const slug = product.slug.toLowerCase();

  // 1. Ly, Tách, Bình giữ nhiệt
  if (
    nameLower.includes('ly') || 
    nameLower.includes('tách') || 
    nameLower.includes('bình') || 
    nameLower.includes('cốc') ||
    slug.includes('ly') ||
    slug.includes('binh') ||
    slug.includes('tach')
  ) {
    const cat = categories.find(c => c.slug === 'ly-tach-binh-giu-nhiet');
    if (cat) return cat.id;
  }

  // 2. Dụng cụ pha chế
  if (
    nameLower.includes('phin nhôm') || 
    nameLower.includes('phin inox') || 
    nameLower.includes('dụng cụ') ||
    nameLower.includes('muỗng')
  ) {
    const cat = categories.find(c => c.slug === 'dung-cu-pha-che');
    if (cat) return cat.id;
  }

  // 3. Cà phê Drip
  if (nameLower.includes('drip') || slug.includes('drip')) {
    const cat = categories.find(c => c.slug === 'ca-phe-drip');
    if (cat) return cat.id;
  }

  // 4. Cà phê bột phin
  if (nameLower.includes('sáng tạo') || nameLower.includes('bột') || nameLower.includes('di sản')) {
    const cat = categories.find(c => c.slug === 'ca-phe-bot-phin');
    if (cat) return cat.id;
  }

  // 5. Cà phê hạt
  if (nameLower.includes('hạt') || nameLower.includes('beans')) {
    const cat = categories.find(c => c.slug === 'ca-phe-hat');
    if (cat) return cat.id;
  }

  // 6. Cà phê hòa tan
  if (nameLower.includes('hòa tan') || nameLower.includes('g7') || nameLower.includes('legendy')) {
    const cat = categories.find(c => c.slug === 'ca-phe-hoa-tan');
    if (cat) return cat.id;
  }

  // 7. Cà phê phin giấy
  if (nameLower.includes('phin giấy') || nameLower.includes('drip bag')) {
    const cat = categories.find(c => c.slug === 'ca-phe-phin-giay');
    if (cat) return cat.id;
  }

  // 8. Default: Vật phẩm thương hiệu or Vật phẩm
  const brandCat = categories.find(c => c.slug === 'vat-pham-thuong-hieu');
  if (brandCat) return brandCat.id;

  const itemCat = categories.find(c => c.slug === 'vat-pham' || c.slug === '  vat-pham');
  if (itemCat) return itemCat.id;

  // Fallback to first available category
  return categories[0].id;
}

async function run() {
  console.log("🚀 STARTING DATABASE CONSOLIDATION WITH RESTORED CATEGORY MAPPING...");

  // 1. Fetch new categories (danh_muc_san_pham)
  const { data: newCats, error: newCatsErr } = await supabase
    .from('danh_muc_san_pham')
    .select('*');

  if (newCatsErr) {
    console.error("❌ Error fetching target categories:", newCatsErr.message);
    return;
  }
  console.log(`📂 Found ${newCats.length} target categories in 'danh_muc_san_pham'.`);

  // 2. Fetch legacy categories
  const { data: legacyCats, error: legacyCatsErr } = await supabase
    .from('categories')
    .select('*');

  if (legacyCatsErr) {
    console.error("❌ Error fetching legacy categories:", legacyCatsErr.message);
    return;
  }
  console.log(`📂 Found ${legacyCats.length} legacy categories.`);

  // 3. Fetch legacy products with their images
  const { data: legacyProds, error: legacyProdsErr } = await supabase
    .from('products')
    .select('*, product_images(*)');

  if (legacyProdsErr) {
    console.error("❌ Error fetching legacy products:", legacyProdsErr.message);
    return;
  }
  console.log(`📦 Found ${legacyProds.length} legacy products to consolidate.`);

  // Correct Mapping for drinks & cakes & extras: Legacy slug -> New slug
  const categoryMapping = {
    'ca-phe-phin': 'ca-phe-phin',
    'ca-phe-may': 'ca-phe-may',
    'ca-phe-pha-che': 'ca-phe-pha-che',
    'tra-tra-sua': 'tra-tra-sua',
    'sinh-to-da-xay': 'sinh-to-da-xay',
    'nuoc-thanh-nhiet': 'nuoc-thanh-nhiet',
    'nuoc-ep': 'nuoc-ep',
    'banh': 'banh', // Legacy category slug for cakes is 'banh'
    'mon-extra': 'mon-extra',
    'matcha-cacao': 'matcha-cacao'
  };

  let drinksCount = 0;
  let merchCount = 0;

  for (const prod of legacyProds) {
    // Find legacy category slug
    const legacyCat = legacyCats.find(c => c.id === prod.category_id);
    const legacySlug = legacyCat ? legacyCat.slug : '';
    
    const isMerch = legacySlug === 'merchandise';

    if (isMerch) {
      // Consolidate into san_pham_merchandise
      const targetCatId = getMerchandiseCategoryId(prod, newCats);
      const targetCat = newCats.find(c => c.id === targetCatId);

      const primaryImg = prod.product_images && prod.product_images.length > 0
        ? (prod.product_images.find(img => img.is_primary)?.url || prod.product_images[0].url)
        : null;

      const { error: merchErr } = await supabase
        .from('san_pham_merchandise')
        .upsert({
          ten_san_pham: prod.name,
          slug: prod.slug,
          mo_ta: prod.description || prod.short_description || '',
          gia: prod.price,
          danh_muc_id: targetCatId,
          hinh_anh: primaryImg,
          hien_thi: prod.status === 'active',
          con_ban: prod.stock_quantity > 0
        }, { onConflict: 'slug' });

      if (merchErr) {
        console.error(`   ❌ Failed to consolidate Merchandise '${prod.name}':`, merchErr.message);
      } else {
        console.log(`   🎁 [MERCH -> ${targetCat ? targetCat.ten_danh_muc : 'Unknown'}] Synced: ${prod.name}`);
        merchCount++;
      }
    } else {
      // Consolidate into san_pham_do_uong
      const newSlug = categoryMapping[legacySlug] || 'ca-phe-phin'; // Default fallback
      const targetCat = newCats.find(c => c.slug === newSlug);

      if (!targetCat) {
        console.warn(`   ⚠️ Warning: No target category found for slug '${newSlug}' (Product: ${prod.name})`);
        continue;
      }

      let giaDen = null;
      let giaSua = null;

      if (prod.metadata) {
        if (prod.metadata.gia_den !== undefined) {
          giaDen = prod.metadata.gia_den;
        }
        if (prod.metadata.gia_sua !== undefined) {
          giaSua = prod.metadata.gia_sua;
        }
      }

      // If both are null, fallback to price
      if (giaDen === null && giaSua === null) {
        giaDen = prod.price;
        if (prod.slug.includes('sua') || prod.slug.includes('bac-xiu')) {
          giaSua = prod.price;
          giaDen = prod.price - 5000;
        }
      }

      const { error: drinkErr } = await supabase
        .from('san_pham_do_uong')
        .upsert({
          ten_san_pham: prod.name,
          slug: prod.slug,
          mo_ta: prod.description || prod.short_description || '',
          gia_den: giaDen,
          gia_sua: giaSua,
          danh_muc_id: targetCat.id,
          hien_thi: prod.status === 'active',
          la_mon_noi_bat: prod.is_featured || false
        }, { onConflict: 'slug' });

      if (drinkErr) {
        console.error(`   ❌ Failed to consolidate Drink '${prod.name}':`, drinkErr.message);
      } else {
        console.log(`   🍹 [DRINK -> ${targetCat.ten_danh_muc}] Synced: ${prod.name}`);
        drinksCount++;
      }
    }
  }

  console.log("\n==========================================");
  console.log(`🎉 CONSOLIDATION COMPLETE!`);
  console.log(`🍹 Total Drinks/Cakes/Extras Synced: ${drinksCount}`);
  console.log(`🎁 Total Merchandise Synced: ${merchCount}`);
  console.log("==========================================");
}

run();
