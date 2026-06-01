const fs = require('fs');
const path = require('path');

// Manually parse .env.local if it exists
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const index = trimmed.indexOf('=');
        if (index !== -1) {
          const key = trimmed.substring(0, index).trim();
          const val = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
          process.env[key] = val;
        }
      }
    });
  }
} catch (e) {
  console.log("Warning: Could not read .env.local file:", e.message);
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("🌱 Starting seed script...");

  // 1. Clear existing products & categories (optional, but good for clean seed)
  console.log("🧹 Cleaning old data...");
  await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('wishlist_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Insert Categories
  console.log("📂 Inserting categories...");
  const categoriesData = [
    {
      name: "Smart Lighting",
      slug: "smart-lighting",
      description: "Hệ thống chiếu sáng thông minh điều khiển bằng giọng nói và đồng bộ nhạc.",
      image_url: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&q=80",
      sort_order: 1,
      is_active: true
    },
    {
      name: "Premium Audio",
      slug: "premium-audio",
      description: "Trải nghiệm âm thanh đỉnh cao với tai nghe chống ồn và loa hi-fi.",
      image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
      sort_order: 2,
      is_active: true
    },
    {
      name: "Ergonomic Workspace",
      slug: "ergonomic-workspace",
      description: "Nâng cao năng suất làm việc với bàn phím cơ và đèn treo màn hình cao cấp.",
      image_url: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=600&q=80",
      sort_order: 3,
      is_active: true
    },
    {
      name: "Smart Living",
      slug: "smart-living",
      description: "Robot hút bụi, máy lọc không khí và các thiết bị tự động hóa cho ngôi nhà.",
      image_url: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80",
      sort_order: 4,
      is_active: true
    }
  ];

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .insert(categoriesData)
    .select();

  if (catError) {
    console.error("❌ Error inserting categories:", catError);
    return;
  }
  console.log(`✅ Inserted ${categories.length} categories.`);

  const getCatId = (slug) => categories.find(c => c.slug === slug).id;

  // 3. Insert Products
  console.log("📦 Inserting products...");
  const productsData = [
    // Smart Lighting
    {
      name: "VPC Aura Smart Ambient Lightstrip",
      slug: "vpc-aura-smart-lightstrip",
      short_description: "Dây LED RGBIC 16 triệu màu, đồng bộ âm thanh cực nhạy, điều khiển qua App.",
      description: "Nâng tầm không gian sống của bạn với VPC Aura Smart Lightstrip. Được trang bị công nghệ chip RGBIC độc lập cho phép hiển thị nhiều màu cùng lúc trên một dải đèn. Đồng bộ hóa trực tiếp với âm thanh xung quanh, hoàn hảo cho góc gaming hoặc phòng khách sang trọng. Tích hợp Google Home, Alexa và Apple HomeKit.",
      price: 650000,
      compare_at_price: 850000,
      stock_quantity: 120,
      category_id: getCatId('smart-lighting'),
      status: 'active',
      is_featured: true,
      tags: ["led", "rgbic", "smart-home", "lighting"],
      avg_rating: 4.8,
      review_count: 32,
      metadata: { seo_title: "Dây LED Thông Minh VPC Aura - 16 Triệu Màu RGBIC", spec: "Độ dài: 5m, Wifi 2.4Ghz, App: VPC Smart" }
    },
    {
      name: "VPC Glow Neon Desktop Tube",
      slug: "vpc-glow-neon-desktop",
      short_description: "Đèn Neon uốn dẻo trang trí bàn làm việc, điều khiển qua App, đa dạng hiệu ứng.",
      description: "Đèn uốn dẻo VPC Glow Neon mang lại nguồn cảm hứng bất tận cho góc setup. Thiết kế Silicon dẻo cao cấp chống chói mắt, phân bổ ánh sáng siêu mịn. Hơn 100 chế độ hiệu ứng màu sắc động độc đáo.",
      price: 890000,
      compare_at_price: 1100000,
      stock_quantity: 45,
      category_id: getCatId('smart-lighting'),
      status: 'active',
      is_featured: false,
      tags: ["neon", "desktop", "lighting"],
      avg_rating: 4.6,
      review_count: 14,
      metadata: { seo_title: "Đèn Neon Uốn Dẻo VPC Glow Để Bàn", spec: "Chất liệu: Silicone, Độ dài: 1.5m, Nguồn: USB 5V" }
    },
    // Premium Audio
    {
      name: "VPC SoundSpace Max ANC Headphones",
      slug: "vpc-soundspace-max-headphones",
      short_description: "Tai nghe chụp tai chống ồn chủ động Hybrid ANC, màng loa 40mm, pin 50 giờ liên tục.",
      description: "VPC SoundSpace Max đem lại không gian âm nhạc thuần khiết cho bạn. Khả năng chống ồn chủ động đỉnh cao khử đến 98% tiếng ồn tần số thấp. Màng loa Dynamic 40mm bằng sợi carbon mang lại âm trầm sâu thẳm, âm trung mượt mà và âm cao trong trẻo như pha lê. Đệm tai memory foam bọc da protein siêu mềm thoải mái đeo cả ngày.",
      price: 2450000,
      compare_at_price: 3200000,
      stock_quantity: 60,
      category_id: getCatId('premium-audio'),
      status: 'active',
      is_featured: true,
      tags: ["headphones", "anc", "audio", "bluetooth"],
      avg_rating: 4.9,
      review_count: 54,
      metadata: { seo_title: "Tai Nghe Chống Ồn VPC SoundSpace Max Cao Cấp", spec: "Bluetooth 5.3, Codec: LDAC/AAC/SBC, Hybrid ANC -42dB" }
    },
    {
      name: "VPC Pebble Duo Studio Speakers",
      slug: "vpc-pebble-duo-speakers",
      short_description: "Cặp loa kiểm âm để bàn Hi-Fi công suất 60W, thiết kế gỗ óc chó sang trọng.",
      description: "Trải nghiệm âm thanh studio ngay tại nhà với VPC Pebble Duo. Thùng loa bằng gỗ óc chó tự nhiên giảm thiểu cộng hưởng âm tiêu cực, đồng thời tăng tính thẩm mỹ cao cấp. Công suất mạnh mẽ 60W RMS kết hợp bộ xử lý âm thanh số DSP thông minh.",
      price: 3100000,
      compare_at_price: 3900000,
      stock_quantity: 20,
      category_id: getCatId('premium-audio'),
      status: 'active',
      is_featured: true,
      tags: ["speakers", "hi-fi", "audio", "desktop"],
      avg_rating: 4.7,
      review_count: 18,
      metadata: { seo_title: "Loa Để Bàn Hi-Fi VPC Pebble Duo Gỗ Óc Chó", spec: "Công suất: 60W RMS, Ngõ vào: Bluetooth, RCA, Optical" }
    },
    // Ergonomic Workspace
    {
      name: "VPC Keystone Pro Mechanical Keyboard",
      slug: "vpc-keystone-pro-keyboard",
      short_description: "Bàn phím cơ Custom Layout 75%, Hotswap 5-pin, lót sẵn foam tiêu âm, gasket mount cực êm.",
      description: "Chiếc bàn phím cơ hoàn hảo cho cả gõ văn bản và chơi game. VPC Keystone Pro được thiết kế theo cấu trúc Gasket Mount thời thượng kết hợp cùng mạch hotswap 5-pin giúp bạn dễ dàng cá nhân hóa switch. Trải nghiệm gõ phím trầm ấm, mượt mà nhờ foam tiêu âm Poron cao cấp lắp sẵn.",
      price: 1850000,
      compare_at_price: 2400000,
      stock_quantity: 85,
      category_id: getCatId('ergonomic-workspace'),
      status: 'active',
      is_featured: true,
      tags: ["keyboard", "mechanical", "custom", "workspace"],
      avg_rating: 4.9,
      review_count: 42,
      metadata: { seo_title: "Bàn Phím Cơ Custom VPC Keystone Pro 75%", spec: "Layout: 82 phím, Kết nối: 3 mode (Type-C, 2.4G, BT5.1), Keycap: PBT Double-shot" }
    },
    {
      name: "VPC Iris Smart Monitor Lightbar",
      slug: "vpc-iris-lightbar",
      short_description: "Đèn treo màn hình chống mỏi mắt, cảm biến ánh sáng tự động, điều khiển núm xoay không dây.",
      description: "Đèn treo màn hình VPC Iris sở hữu thiết kế chiếu sáng bất đối xứng thông minh, chỉ chiếu xuống bàn làm việc và không chiếu vào màn hình, loại bỏ hoàn toàn hiện tượng phản chiếu gây nhức mỏi mắt. Núm xoay điều khiển không dây kim loại cực kỳ sang trọng để điều chỉnh độ sáng và nhiệt độ màu mượt mà.",
      price: 1150000,
      compare_at_price: 1500000,
      stock_quantity: 150,
      category_id: getCatId('ergonomic-workspace'),
      status: 'active',
      is_featured: false,
      tags: ["lightbar", "monitor", "workspace", "eye-care"],
      avg_rating: 4.7,
      review_count: 29,
      metadata: { seo_title: "Đèn Treo Màn Hình VPC Iris Cảm Biến Thông Minh", spec: "CRI: Ra95, Nhiệt độ màu: 2700K - 6500K, Núm xoay Wireless" }
    },
    // Smart Living
    {
      name: "VPC AeroClean H13 Air Purifier",
      slug: "vpc-aeroclean-purifier",
      short_description: "Máy lọc không khí thông minh màng lọc HEPA H13, lọc sạch 99.97% bụi mịn PM2.5.",
      description: "Giữ bầu không khí trong lành cho gia đình bạn với VPC AeroClean. Màng lọc 3 lớp bao gồm màng HEPA H13 đạt chuẩn y tế giúp khử sạch bụi mịn PM2.5, phấn hoa, mùi hôi và vi khuẩn có hại. Hoạt động cực êm với chế độ ngủ chỉ 22dB. Điều khiển thông minh từ xa qua điện thoại di động.",
      price: 2890000,
      compare_at_price: 3600000,
      stock_quantity: 30,
      category_id: getCatId('smart-living'),
      status: 'active',
      is_featured: true,
      tags: ["purifier", "air", "smart-home", "app-control"],
      avg_rating: 4.8,
      review_count: 22,
      metadata: { seo_title: "Máy Lọc Không Khí VPC AeroClean H13 Bụi Mịn PM2.5", spec: "Diện tích khả dụng: 35-50m², Chỉ số CADR: 380m³/h, Màng lọc HEPA H13" }
    },
    {
      name: "VPC Omni-X Robot Vacuum & Mop",
      slug: "vpc-omni-x-robot",
      short_description: "Robot hút bụi lau nhà thông minh, lực hút siêu mạnh 6000Pa, né tránh chướng ngại vật AI.",
      description: "Giải phóng đôi tay của bạn với VPC Omni-X. Kết hợp công nghệ định vị LiDAR LDS thế hệ mới và camera AI 3D tránh chướng ngại vật chính xác đến từng milimet. Lực hút cực đại 6000Pa hút sạch mọi bụi bẩn cứng đầu trên sàn cứng lẫn thảm sâu. Tự động nâng giẻ lau khi lên thảm và quay về đốc sạc giặt giẻ.",
      price: 8900000,
      compare_at_price: 12000000,
      stock_quantity: 15,
      category_id: getCatId('smart-living'),
      status: 'active',
      is_featured: true,
      tags: ["vacuum", "robot", "smart-home", "cleaning"],
      avg_rating: 4.9,
      review_count: 15,
      metadata: { seo_title: "Robot Hút Bụi Lau Nhà Thông Minh VPC Omni-X", spec: "Lực hút: 6000Pa, Pin: 5200mAh, Điều hướng: LiDAR + Camera AI 3D" }
    }
  ];

  const { data: products, error: prodError } = await supabase
    .from('products')
    .insert(productsData)
    .select();

  if (prodError) {
    console.error("❌ Error inserting products:", prodError);
    return;
  }
  console.log(`✅ Inserted ${products.length} products.`);

  // 4. Insert Product Images
  console.log("📸 Inserting product images...");
  const imagesData = [];
  const imageMap = {
    "vpc-aura-smart-lightstrip": [
      { url: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80", is_primary: true },
      { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80", is_primary: false }
    ],
    "vpc-glow-neon-desktop": [
      { url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80", is_primary: true },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80", is_primary: false }
    ],
    "vpc-soundspace-max-headphones": [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", is_primary: true },
      { url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80", is_primary: false }
    ],
    "vpc-pebble-duo-speakers": [
      { url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80", is_primary: true },
      { url: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=800&q=80", is_primary: false }
    ],
    "vpc-keystone-pro-keyboard": [
      { url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80", is_primary: true },
      { url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80", is_primary: false }
    ],
    "vpc-iris-lightbar": [
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80", is_primary: true },
      { url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80", is_primary: false }
    ],
    "vpc-aeroclean-purifier": [
      { url: "https://images.unsplash.com/photo-1585338111222-d48d716142db?auto=format&fit=crop&w=800&q=80", is_primary: true },
      { url: "https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?auto=format&fit=crop&w=800&q=80", is_primary: false }
    ],
    "vpc-omni-x-robot": [
      { url: "https://images.unsplash.com/photo-1518314916301-724f0c8ad699?auto=format&fit=crop&w=800&q=80", is_primary: true },
      { url: "https://images.unsplash.com/photo-1563161402-84127c858374?auto=format&fit=crop&w=800&q=80", is_primary: false }
    ]
  };

  for (const product of products) {
    const images = imageMap[product.slug] || [];
    images.forEach((img, index) => {
      imagesData.push({
        product_id: product.id,
        url: img.url,
        alt_text: `${product.name} Image ${index + 1}`,
        sort_order: index,
        is_primary: img.is_primary
      });
    });
  }

  const { data: insertedImages, error: imgError } = await supabase
    .from('product_images')
    .insert(imagesData)
    .select();

  if (imgError) {
    console.error("❌ Error inserting images:", imgError);
    return;
  }
  console.log(`✅ Inserted ${insertedImages.length} product images.`);

  console.log("🎉 Seeding completed successfully!");
}

seed().catch(err => {
  console.error("💥 Seed crashed:", err);
});
