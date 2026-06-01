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

// Drink images mapping from index.html
const drinkImageMap = {
  // CÀ PHÊ PHIN
  "coffee-legend": "https://down-zl-vn.img.susercontent.com/vn-11134517-81ztc-mlqbdkof589445",
  "nang-luong-tu-duy": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/ca-phe-nang-luong-den-da-300x300.png",
  "nang-luong-kham-pha": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/ca-phe-nang-luong-den-da-300x300.png",
  "nang-luong-y-tuong": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/ca-phe-nang-luong-den-da-300x300.png",
  "nang-luong-sang-tao": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/ca-phe-nang-luong-den-da-300x300.png",
  "nang-luong-thanh-cong": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/ca-phe-nang-luong-den-da-300x300.png",
  "nang-luong-dot-pha": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/ca-phe-nang-luong-den-da-300x300.png",

  // CÀ PHÊ MÁY
  "success-sua-da": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/Legend-ca-phe-sua-da-300x300.png",
  "success-da-vien": "https://down-zl-vn.img.susercontent.com/vn-11134517-7r98o-lxwdl9rgb07vaa",
  "espresso": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/Ca-Phe-Hadid-300x300.png",
  "americano": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/02/Americano-Nong-copy-300x300.png",
  "double-espresso": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/Ca-Phe-Hadid-300x300.png",
  "latte": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/Picasso-latte-300x300.png",
  "cappuccino": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/Picasso-latte-300x300.png",
  "latte-yen-mach": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/02/Cappuccino-Picasso-Latte-Yen-Mach-Nong-TGCP-copy-300x300.png",
  "cappuccino-yen-mach": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/02/Cappuccino-Picasso-Latte-Yen-Mach-Nong-TGCP-copy-300x300.png",

  // CÀ PHÊ PHA CHẾ
  "ca-phe-dua": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/ca-phe-dua-300x300.png",
  "ca-phe-hanh-nhan": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/02/Ca-Phe-Hanh-Nhan-TGCP-copy-300x300.png",
  "ca-phe-muoi-legend": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/02/Ca-Phe-Muoi-Legend-TGCP-copy-300x300.png",
  "bac-xiu": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/bac-xiu-da-300x300.png",
  "ca-phe-trung": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/ca-phe-trung-300x300.png",
  "ca-phe-mother-land": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/Ca-Phe-Mother-Land-300x300.png",
  "cold-brew-phuong-dong": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/coldbrew-Phuong-Dong-300x300.png",
  "ca-phe-cold-brew": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/cold-brew-trung-dong-300x300.png",

  // TRÀ + TRÀ SỮA
  "tra-hoa-cuc-chamomile": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/tra-hoa-cuc-300x300.png",
  "tra-vai-hoa-hong": "https://down-bs-vn.img.susercontent.com/vn-11134517-81ztc-mk3diyqt95aed6",
  "tra-dao-cam-sa": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/30.-Tra-Dao-Cam-Sa-400x400.png",
  "tra-la-nep-sen-vang": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/tra-la-nep-sen-vang-300x300.png",
  "tra-sua-legend": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/02/Tra-Sua-Legend-TGCP-copy-300x300.png",
  "tra-cam-que-da": "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/12/Untitled-3-12-1-300x300.png",

  // SINH TỐ / ĐÁ XAY
  "sinh-to-xoai": "https://down-bs-vn.img.susercontent.com/vn-11134517-81ztc-ml7etvg00sgf69",
  "sinh-to-bo": "https://down-bs-vn.img.susercontent.com/vn-11134517-81ztc-ml74jasvmqrk83",
  "sinh-to-chanh-day": "https://down-bs-vn.img.susercontent.com/vn-11134517-7r98o-lr30i8qnch5044",
  "sinh-to-dau": "https://unie.com.vn/cach-lam-sinh-to-dau-tay-bo-duong-tai-nha-cho-be-tai-nha/?srsltid=AfmBOopyEXsl2zAfRhkEC2Lq9Ae2CJwFnRjIEwO_1Eo_3D-tZRFzoB8b",
  "kim-quat-da-xay": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCPDzobJcuIlDXotxwdJZc4ZnVbcgnTGyGCA&s",
  "tra-xanh-da-xay": "https://lh6.googleusercontent.com/proxy/MFHze5GxFfm_KiMl4-DSsTSZvwIx2VnzJeQIA6rsenf3K9NpijVHrBeriKroiwJzYo3A1rmhzc5UCV1YLG6w59T8Qek8Qn03wHiygCqvWXSl0IRKXGqB3msC9dUavUfY55upOEBzqD_Tt_VAUaewcAzWc5yDjdO4lnlTyjhFiBi-eNyOOBs0GUTzAqMwaJ5psu45U3tGlGb3gzfZqEbv",

  // NƯỚC ÉP
  "nuoc-ep-chanh-day": "https://down-zl-vn.img.susercontent.com/vn-11134517-81ztc-mlr9v57hum146c",
  "cam-vat": "https://down-bs-vn.img.susercontent.com/vn-11134517-7ra0g-m869m79180n8a5",
  "nuoc-thom-ep": "https://down-cvs-vn.img.susercontent.com/vn-11134517-7r98o-lxweikvdikm33e",
  "dua-hau": "https://down-bs-vn.img.susercontent.com/vn-11134517-7r98o-lr30idyrp6l54f",
  "dua-tuoi": "https://mms.img.susercontent.com/vn-11134517-7r98o-m046nnqppwunb8@resize_ss400x400!@crop_w400_h400_cT",

  // NƯỚC THANH NHIỆT
  "nuoc-chanh-day-thom-sa": "https://down-cvs-vn.img.susercontent.com/vn-11134517-7r98o-lxwedfl4no4ba7",
  "hibiscus-chanh-day-hat-chia": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/33.-Hibiscus-Chanh-Day-_-No-400x400.png",
  "chanh-sa-gung-hat-chia": "https://down-zl-vn.img.susercontent.com/vn-11134517-7ras8-m1e6sb3653kofc",
  "nuoc-chanh-muoi-mat-ong": "https://down-zl-vn.img.susercontent.com/vn-11134517-81ztc-mlr9v57cxmgwb3",
  "nuoc-suoi": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcREaVHGK6CXvt_uq3zUeBoNQvxosedxbaXljMGtZxZX6posaZy5B3fTR14iu4fadwxiNKJj_4IcBucMa-mvBNFwi3t5eI0z7RpdbCQmO5Tggx5PJ4BatMyBJ9qlyDe_P5E-Mf-PZys&usqp=CAc",

  // MATCHA + CACAO
  "matcha-yen-mach": "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/12/Untitled-9-12-300x300.png",
  "tra-xanh-thach-ca-phe": "https://down-tx-vn.img.susercontent.com/vn-11134517-81ztc-mk3djn7l8lj7d4",
  "tra--thach-ca-phe": "https://down-tx-vn.img.susercontent.com/vn-11134517-81ztc-mk3djn7l8lj7d4",
  "cacao-sua": "https://down-zl-vn.img.susercontent.com/vn-11134517-81ztc-mlr9v57hytqgeb",
  "sua-tuoi": "https://down-cvs-vn.img.susercontent.com/vn-11134517-7ra0g-maax0l1i3w1e85",

  // BÁNH
  "panna-cotta": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/52.-Panna-Cotta-Dau-Tay-_-No.png",
  "banh-mousse-chanh-day": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/55.-Mousse-Chanh-Day-_-No.png",
  "banh-mousse-red-velvet": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/58.-Red-Velvet-_-No.png",
  "banh-mousse-dau": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/02/Banh-kem-dau-300x300.jpg",
  "banh-mousse-socola": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/56.-Mousse-Chococate-_-No.png",
  "banh-croissant-khong-nhan": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/61.-Croissant-_-No.png",
  "banh-croissant-hanh-nhan": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/61.-Croissant-_-No.png",
  "banh-tiramisu": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/02/Tiramisu-300x300.jpg",

  // EXTRA
  "sua-tuoi-them": "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/386999900_715169523974576_5274279206438518417_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&oh=00_Af4WEefOxxcq4DJ4BdOlAYlrg0kJCO-bUf8wqaiQltdI1w&oe=6A137C4B",
  "sua-dac-them": "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/386999900_715169523974576_5274279206438518417_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&oh=00_Af4WEefOxxcq4DJ4BdOlAYlrg0kJCO-bUf8wqaiQltdI1w&oe=6A137C4B",
  "tran-chau-trang": "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/386999900_715169523974576_5274279206438518417_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&oh=00_Af4WEefOxxcq4DJ4BdOlAYlrg0kJCO-bUf8wqaiQltdI1w&oe=6A137C4B",
  "mat-ong": "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/386999900_715169523974576_5274279206438518417_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&oh=00_Af4WEefOxxcq4DJ4BdOlAYlrg0kJCO-bUf8wqaiQltdI1w&oe=6A137C4B",
  "thach-ca-phe": "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/386999900_715169523974576_5274279206438518417_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&oh=00_Af4WEefOxxcq4DJ4BdOlAYlrg0kJCO-bUf8wqaiQltdI1w&oe=6A137C4B",
  "milkfoam": "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/386999900_715169523974576_5274279206438518417_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&oh=00_Af4WEefOxxcq4DJ4BdOlAYlrg0kJCO-bUf8wqaiQltdI1w&oe=6A137C4B",
  "ca-phe-them": "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/386999900_715169523974576_5274279206438518417_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&oh=00_Af4WEefOxxcq4DJ4BdOlAYlrg0kJCO-bUf8wqaiQltdI1w&oe=6A137C4B",
  "dao-them": "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/386999900_715169523974576_5274279206438518417_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&oh=00_Af4WEefOxxcq4DJ4BdOlAYlrg0kJCO-bUf8wqaiQltdI1w&oe=6A137C4B"
};

async function run() {
  console.log("🌱 Starting full drinks sync to 'products' table...");

  // 1. Fetch categories from Next.js 'categories' table
  const { data: nextCats, error: nextCatsErr } = await supabase
    .from('categories')
    .select('*');

  if (nextCatsErr) {
    console.error("❌ Error fetching Next.js categories:", nextCatsErr.message);
    return;
  }

  // 2. Fetch custom categories from 'danh_muc_san_pham'
  const { data: customCats, error: customCatsErr } = await supabase
    .from('danh_muc_san_pham')
    .select('*');

  if (customCatsErr) {
    console.error("❌ Error fetching custom categories:", customCatsErr.message);
    return;
  }

  // 3. Ensure all custom categories exist in 'categories'
  const catSlugToUuid = {};
  nextCats.forEach(c => {
    catSlugToUuid[c.slug] = c.id;
  });

  for (const c of customCats) {
    if (!catSlugToUuid[c.slug]) {
      console.log(`📂 Creating missing category: ${c.ten_danh_muc} (${c.slug})...`);
      const { data: newCat, error: insCatErr } = await supabase
        .from('categories')
        .insert({
          name: c.ten_danh_muc,
          slug: c.slug,
          description: c.mo_ta,
          sort_order: c.thu_tu_hien_thi,
          is_active: c.hien_thi
        })
        .select('id')
        .single();

      if (insCatErr) {
        console.error(`   ❌ Failed to create category ${c.slug}:`, insCatErr.message);
      } else {
        catSlugToUuid[c.slug] = newCat.id;
        console.log(`   ✅ Category created! UUID: ${newCat.id}`);
      }
    }
  }

  // 4. Fetch all active drinks from 'san_pham_do_uong' using service role client
  const { data: drinks, error: drinksErr } = await supabase
    .from('san_pham_do_uong')
    .select('*')
    .eq('hien_thi', true);

  if (drinksErr) {
    console.error("❌ Error fetching drinks from san_pham_do_uong:", drinksErr.message);
    return;
  }

  console.log(`📦 Found ${drinks.length} active drinks. Processing sync into 'products'...`);

  // 5. Sync each drink
  for (const drink of drinks) {
    // Find category slug from customCats
    const customCat = customCats.find(c => c.id === drink.danh_muc_id);
    if (!customCat) {
      console.warn(`⚠️ Warning: Category ID ${drink.danh_muc_id} not found for drink ${drink.ten_san_pham}`);
      continue;
    }

    const nextCatUuid = catSlugToUuid[customCat.slug];
    if (!nextCatUuid) {
      console.warn(`⚠️ Warning: Next.js category UUID not found for slug ${customCat.slug}`);
      continue;
    }

    const defaultPrice = drink.gia_den || drink.gia_sua || 0;
    const imageUrl = drinkImageMap[drink.slug] || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80";

    const { data: upsertData, error: upsertErr } = await supabase
      .from('products')
      .upsert({
        name: drink.ten_san_pham.trim(),
        slug: drink.slug.trim(),
        short_description: drink.mo_ta || '',
        description: drink.mo_ta || '',
        price: defaultPrice,
        stock_quantity: 999, // infinite for drinks
        category_id: nextCatUuid,
        status: 'active',
        is_featured: drink.la_mon_noi_bat || false,
        tags: ["coffee", customCat.slug],
        metadata: {
          gia_den: drink.gia_den,
          gia_sua: drink.gia_sua
        }
      }, { onConflict: 'slug' })
      .select('id');

    if (upsertErr) {
      console.error(`❌ Error syncing drink ${drink.ten_san_pham}:`, upsertErr.message);
      continue;
    }

    const productId = upsertData[0].id;
    console.log(`✅ Synced drink: ${drink.ten_san_pham} | ID: ${productId}`);

    // Sync image
    await supabase.from('product_images').delete().eq('product_id', productId);
    const { error: imgErr } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        url: imageUrl,
        alt_text: drink.ten_san_pham,
        sort_order: 0,
        is_primary: true
      });

    if (imgErr) {
      console.error(`   ❌ Image error for ${drink.ten_san_pham}:`, imgErr.message);
    } else {
      console.log(`   📸 Image synced successfully`);
    }
  }

  console.log("🎉 ALL DRINKS SUCCESSFULLY COPIED AND SYNCHRONIZED TO 'products' TABLE!");
}

run();
