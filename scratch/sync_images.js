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

async function syncImages() {
  console.log("⚡ Bắt đầu đồng bộ hóa ảnh sản phẩm từ san_pham_merchandise sang product_images...");

  // 1. Lấy tất cả vật phẩm có hình ảnh
  const { data: viMerch, error: viMerchErr } = await supabase
    .from('san_pham_merchandise')
    .select('slug, hinh_anh')
    .not('hinh_anh', 'is', null);

  if (viMerchErr) {
    console.error("❌ Lỗi lấy vật phẩm:", viMerchErr.message);
    return;
  }

  console.log(`Tìm thấy ${viMerch.length} vật phẩm có ảnh trong bảng san_pham_merchandise.`);

  // 2. Lấy tất cả sản phẩm trong bảng products
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, slug');

  if (prodErr) {
    console.error("❌ Lỗi lấy sản phẩm:", prodErr.message);
    return;
  }

  const prodMap = new Map(products.map(p => [p.slug, p.id]));

  let count = 0;

  for (const item of viMerch) {
    const prodId = prodMap.get(item.slug);
    if (!prodId) {
      console.log(`⚠️ Không tìm thấy sản phẩm tương ứng cho slug: ${item.slug}`);
      continue;
    }

    // Kiểm tra xem sản phẩm này đã có ảnh trong bảng product_images chưa
    const { data: existingImages, error: imgErr } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', prodId);

    if (imgErr) {
      console.error(`❌ Lỗi kiểm tra ảnh của sản phẩm ${item.slug}:`, imgErr.message);
      continue;
    }

    if (existingImages.length === 0) {
      // Chưa có ảnh -> Thêm ảnh
      console.log(`➕ Thêm ảnh cho sản phẩm ${item.slug}: ${item.hinh_anh}`);
      const { error: insertErr } = await supabase
        .from('product_images')
        .insert({
          product_id: prodId,
          url: item.hinh_anh,
          is_primary: true,
          alt_text: item.slug
        });

      if (insertErr) {
        console.error(`❌ Lỗi thêm ảnh cho ${item.slug}:`, insertErr.message);
      } else {
        count++;
      }
    }
  }

  console.log(`\n🎉 HOÀN TẤT ĐỒNG BỘ ẢNH! Đã bổ sung thành công ${count} ảnh sản phẩm.`);
}

syncImages();
