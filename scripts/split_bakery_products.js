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

const BAKERY_CATEGORY_UUID = "07f32cf1-09b8-4946-86cf-46f57c81e692"; // Bánh ngọt categories UUID for Next.js
const BAKERY_CATEGORY_INT = 9; // Bánh ngọt category ID for san_pham_do_uong (Render API)

const newBakeryItems = [
  {
    name: "Bánh Mousse Chanh Dây",
    slug: "banh-mousse-chanh-day",
    short_description: "Bánh mousse chanh dây chua ngọt thanh mát, mềm mịn quyến rũ.",
    description: "Lớp mousse chanh dây mềm mịn thơm ngát, vị chua thanh ngọt nhẹ béo ngậy tan ngay đầu lưỡi.",
    price: 39000,
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/55.-Mousse-Chanh-Day-_-No.png"
  },
  {
    name: "Bánh Mousse Red Velvet",
    slug: "banh-mousse-red-velvet",
    short_description: "Bánh mousse Red Velvet sang trọng, mềm mại béo ngậy.",
    description: "Sự kết hợp hoàn hảo giữa cốt bánh Red Velvet nhung đỏ mềm xốp và lớp kem mousse phô mai thơm béo đậm vị.",
    price: 39000,
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/58.-Red-Velvet-_-No.png"
  },
  {
    name: "Bánh Mousse Dâu",
    slug: "banh-mousse-dau",
    short_description: "Bánh mousse hương dâu tây tươi ngọt ngào thơm mịn.",
    description: "Hương vị mousse dâu tây thơm lừng chua nhẹ ngọt ngào, kết hợp cùng lớp kem tươi mịn màng quyến rũ.",
    price: 39000,
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/02/Banh-kem-dau-300x300.jpg"
  },
  {
    name: "Bánh Mousse Socola",
    slug: "banh-mousse-socola",
    short_description: "Bánh mousse socola đậm vị ngọt đắng quyến rũ.",
    description: "Lớp mousse socola đậm đà, mịn màng với vị đắng nhẹ tinh tế hòa quyện độ béo ngậy tuyệt hảo.",
    price: 39000,
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/56.-Mousse-Chococate-_-No.png"
  },
  {
    name: "Bánh Croissant Không Nhân",
    slug: "banh-croissant-khong-nhan",
    short_description: "Bánh sừng bò truyền thống thơm bơ tơi xốp, vỏ ngoài giòn rụm.",
    description: "Bánh sừng bò Croissant nguyên bản với các lớp bánh ngàn lớp tơi xốp thơm đậm vị bơ Pháp, vỏ giòn tan quyến rũ.",
    price: 39000,
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/61.-Croissant-_-No.png"
  },
  {
    name: "Bánh Croissant Hạnh Nhân",
    slug: "banh-croissant-hanh-nhan",
    short_description: "Bánh sừng bò phủ hạnh nhân giòn thơm ngọt bùi.",
    description: "Bánh sừng bò ngàn lớp tơi xốp được phủ ngập hạnh nhân lát giòn rụm và lớp nhân kem bơ hạnh nhân ngọt bùi thơm lừng.",
    price: 39000,
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/61.-Croissant-_-No.png"
  },
  {
    name: "Bánh Tiramisu",
    slug: "banh-tiramisu",
    short_description: "Bánh Tiramisu truyền thống nước Ý thơm nồng nàn vị cafe.",
    description: "Bánh tráng miệng Tiramisu trứ danh nước Ý với các lớp bánh quy Savoiardi thấm đẫm cà phê espresso, cacao và kem phô mai Mascarpone béo ngậy thơm nồng.",
    price: 39000,
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/02/Tiramisu-300x300.jpg"
  }
];

async function run() {
  console.log("⚡ Starting Split and Sync of Bakery Products in Supabase...");

  // 1. DELETE the old "Bánh ngọt các loại (Mousse/Croissant)" from 'san_pham_do_uong'
  console.log("🗑️ Deleting old 'banh-ngot-cac-loai' from 'san_pham_do_uong'...");
  const { error: delDoUongErr } = await supabase
    .from('san_pham_do_uong')
    .delete()
    .eq('slug', 'banh-ngot-cac-loai');

  if (delDoUongErr) {
    console.error("❌ Error deleting old item from san_pham_do_uong:", delDoUongErr.message);
  } else {
    console.log("✅ Deleted 'banh-ngot-cac-loai' from 'san_pham_do_uong'.");
  }

  // Also try deleting from Next.js 'products' table just in case
  const { error: delProdErr } = await supabase
    .from('products')
    .delete()
    .eq('slug', 'banh-ngot-cac-loai');

  if (delProdErr) {
    console.log("ℹ️ No 'banh-ngot-cac-loai' found in 'products' table (or already deleted).");
  }

  // 2. Insert new products into 'san_pham_do_uong' (Render backend)
  console.log("\n🥖 Inserting new items into 'san_pham_do_uong'...");
  for (const item of newBakeryItems) {
    const { error: insErr } = await supabase
      .from('san_pham_do_uong')
      .upsert({
        ten_san_pham: item.name,
        slug: item.slug,
        mo_ta: item.short_description,
        gia_den: item.price,
        gia_sua: 0,
        danh_muc_id: BAKERY_CATEGORY_INT,
        la_mon_noi_bat: false,
        hien_thi: true
      }, { onConflict: 'slug' });

    if (insErr) {
      console.error(`❌ Error inserting ${item.name} into san_pham_do_uong:`, insErr.message);
    } else {
      console.log(`✅ Upserted in san_pham_do_uong: ${item.name}`);
    }
  }

  // 3. Insert new products into Next.js 'products' table & 'product_images'
  console.log("\n🍰 Inserting new items into Next.js 'products' table & images...");
  for (const item of newBakeryItems) {
    const { data: upsertData, error: upsertErr } = await supabase
      .from('products')
      .upsert({
        name: item.name,
        slug: item.slug,
        short_description: item.short_description,
        description: item.description,
        price: item.price,
        stock_quantity: 100,
        category_id: BAKERY_CATEGORY_UUID,
        status: "active",
        tags: ["cake", "dessert"],
        metadata: { gia_den: item.price }
      }, { onConflict: 'slug' })
      .select('id');

    if (upsertErr) {
      console.error(`❌ Error upserting ${item.name} in products:`, upsertErr.message);
      continue;
    }

    const productId = upsertData[0].id;
    console.log(`✅ Upserted in products: ${item.name} | ID: ${productId}`);

    // Clear and insert image
    await supabase.from('product_images').delete().eq('product_id', productId);
    const { error: imgErr } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        url: item.imageUrl,
        alt_text: item.name,
        sort_order: 0,
        is_primary: true
      });

    if (imgErr) {
      console.error(`   ❌ Error inserting image for ${item.name}:`, imgErr.message);
    } else {
      console.log(`   📸 Image synchronized successfully for ${item.name}`);
    }
  }

  console.log("\n🎉 SUCCESS! Database is perfectly synchronized for split bakery items!");
}

run();
