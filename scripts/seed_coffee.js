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
  console.log("🌱 Starting coffee seed script...");

  // 1. Clear existing products & categories
  console.log("🧹 Cleaning old data...");
  await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('wishlist_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Insert Coffee Categories
  console.log("📂 Inserting coffee categories...");
  const categoriesData = [
    { name: "Cà phê phin", slug: "ca-phe-phin", description: "Những dòng cà phê phin đặc trưng của Trung Nguyên Legend, mang hương vị đậm đà, truyền thống và giàu năng lượng.", sort_order: 1, is_active: true },
    { name: "Cà phê máy", slug: "ca-phe-may", description: "Các món cà phê được chiết xuất bằng máy, mang hương vị hiện đại, đậm đà và phù hợp với nhiều phong cách thưởng thức.", sort_order: 2, is_active: true },
    { name: "Cà phê pha chế", slug: "ca-phe-pha-che", description: "Các món cà phê sáng tạo, dễ uống và phù hợp cho khách muốn trải nghiệm hương vị mới.", sort_order: 3, is_active: true },
    { name: "Trà & Trà sữa", slug: "tra-tra-sua", description: "Những món trà thơm nhẹ, thanh mát và dễ uống.", sort_order: 4, is_active: true },
    { name: "Matcha & Cacao", slug: "matcha-cacao", description: "Các món matcha, cacao và sữa tươi có hương vị nhẹ nhàng, béo thơm.", sort_order: 5, is_active: true },
    { name: "Nước thanh nhiệt", slug: "nuoc-thanh-nhiet", description: "Những món giải nhiệt, thanh lọc và tươi mát.", sort_order: 6, is_active: true },
    { name: "Bánh ngọt", slug: "banh", description: "Các món ngọt dùng kèm đồ uống.", sort_order: 7, is_active: true },
    { name: "Món Extra", slug: "mon-extra", description: "Các lựa chọn thêm giúp khách hàng tùy chỉnh đồ uống theo khẩu vị.", sort_order: 8, is_active: true },
    { name: "Merchandise", slug: "merchandise", description: "Dụng cụ pha chế, ly tách lưu niệm và cà phê hạt/hộp đặc sản.", sort_order: 9, is_active: true }
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

  // 3. Insert Coffee Products
  console.log("☕ Inserting coffee products...");
  const productsData = [
    // 1. Cà phê phin
    {
      name: "Coffee Legend",
      slug: "coffee-legend",
      short_description: "Dòng cà phê phin đặc trưng, đậm đà và giàu năng lượng.",
      description: "Dòng cà phê phin cao cấp được chọn lọc từ những hạt Robusta ngon nhất thế giới. Kết tinh năng lượng sáng tạo tư duy sáng suốt.",
      price: 165000,
      stock_quantity: 100,
      category_id: getCatId('ca-phe-phin'),
      status: 'active',
      is_featured: true,
      tags: ["coffee", "featured", "phin"],
      metadata: { gia_den: 165000, gia_sua: 185000 }
    },
    {
      name: "Năng lượng Tư duy",
      slug: "nang-luong-tu-duy",
      short_description: "Hương vị truyền thống thơm nồng quyến rũ.",
      description: "Khơi dậy sự tỉnh táo tinh thần sáng suốt của bạn cho cả ngày làm việc và học tập tràn đầy năng lượng sáng tạo.",
      price: 39000,
      stock_quantity: 200,
      category_id: getCatId('ca-phe-phin'),
      status: 'active',
      is_featured: false,
      tags: ["coffee", "phin"],
      metadata: { gia_den: 39000, gia_sua: 45000 }
    },
    // 2. Cà phê máy
    {
      name: "Success Sữa Đá",
      slug: "success-sua-da",
      short_description: "Sự kết hợp tinh túy giữa Espresso và sữa đặc béo ngậy.",
      description: "Espresso chiết xuất từ hạt Success thượng hạng kết hợp với sữa đặc béo ngọt và đá lạnh mát lạnh.",
      price: 55000,
      stock_quantity: 150,
      category_id: getCatId('ca-phe-may'),
      status: 'active',
      is_featured: false,
      tags: ["coffee", "espresso"],
      metadata: { gia_den: 50000, gia_sua: 55000 }
    },
    {
      name: "Cappuccino Yến Mạch",
      slug: "cappuccino-yen-mach",
      short_description: "Hương vị cà phê béo bùi từ sữa yến mạch cao cấp.",
      description: "Chiết xuất espresso hảo hạng kết hợp sữa yến mạch (Oat milk) tạo nên hương béo dịu nhẹ tốt cho sức khỏe.",
      price: 68000,
      stock_quantity: 100,
      category_id: getCatId('ca-phe-may'),
      status: 'active',
      is_featured: false,
      tags: ["coffee", "cappuccino", "healthy"],
      metadata: { gia_den: 0, gia_sua: 68000 }
    },
    // 3. Cà phê pha chế
    {
      name: "Cà phê dừa",
      slug: "ca-phe-dua",
      short_description: "Sự kết hợp hoàn hảo giữ cà phê đậm đà và cốt dừa béo ngậy.",
      description: "Cà phê cốt dừa thơm bùi ngậy nhẹ mát lành, dễ uống và cực kỳ được ưa chuộng vào mùa hè.",
      price: 79000,
      stock_quantity: 100,
      category_id: getCatId('ca-phe-pha-che'),
      status: 'active',
      is_featured: true,
      tags: ["coffee", "coconut", "featured"],
      metadata: { gia_den: 0, gia_sua: 79000 }
    },
    {
      name: "Cà phê muối Legend",
      slug: "ca-phe-muoi-legend",
      short_description: "Vị mặn dịu nhẹ hòa quyện cùng vị đắng đậm đà.",
      description: "Hương vị cà phê muối đặc trưng của Trung Nguyên, cân bằng tinh tế giữa đắng, mặn, béo ngọt.",
      price: 58000,
      stock_quantity: 150,
      category_id: getCatId('ca-phe-pha-che'),
      status: 'active',
      is_featured: false,
      tags: ["coffee", "salt-coffee"],
      metadata: { gia_den: 0, gia_sua: 58000 }
    },
    {
      name: "Cà phê trứng",
      slug: "ca-phe-trung",
      short_description: "Lớp kem trứng bông mịn béo ngậy phủ lên cà phê ấm nồng.",
      description: "Vị béo ngậy nồng ấm đặc sản của Hà Nội nay được tái hiện trọn vẹn tại Trung Nguyên Legend Âu Lạc.",
      price: 68000,
      stock_quantity: 80,
      category_id: getCatId('ca-phe-pha-che'),
      status: 'active',
      is_featured: false,
      tags: ["coffee", "egg-coffee"],
      metadata: { gia_den: 0, gia_sua: 68000 }
    },
    // 4. Trà & Trà sữa
    {
      name: "Trà lá nếp sen vàng",
      slug: "tra-la-nep-sen-vang",
      short_description: "Hương thơm lá dứa quyện sen vàng bùi ngọt.",
      description: "Trà thanh nhẹ thơm ngát mùi lá dứa thơm nếp kết hợp thạch sen vàng bùi ngọt béo ngậy.",
      price: 58000,
      stock_quantity: 120,
      category_id: getCatId('tra-tra-sua'),
      status: 'active',
      is_featured: false,
      tags: ["tea", "lotus"],
      metadata: { gia_den: 0, gia_sua: 58000 }
    },
    {
      name: "Trà đào cam sả",
      slug: "tra-dao-cam-sa",
      short_description: "Thanh mát giải nhiệt, sảng khoái tức thì.",
      description: "Vị ngọt dịu thơm mát của đào, chua nhẹ của cam tươi cùng hương sả nồng ấm giải nhiệt sảng khoái.",
      price: 55000,
      stock_quantity: 150,
      category_id: getCatId('tra-tra-sua'),
      status: 'active',
      is_featured: false,
      tags: ["tea", "peach"],
      metadata: { gia_den: 0, gia_sua: 55000 }
    },
    // 5. Matcha & Cacao
    {
      name: "Matcha Yến Mạch",
      slug: "matcha-yen-mach",
      short_description: "Matcha thơm nhẹ kết hợp sữa yến mạch thanh béo bổ dưỡng.",
      description: "Món matcha đá xay sữa yến mạch giàu chất xơ thơm lành dịu ngọt tốt cho sức khỏe và vóc dáng.",
      price: 68000,
      stock_quantity: 120,
      category_id: getCatId('matcha-cacao'),
      status: 'active',
      is_featured: true,
      tags: ["matcha", "healthy", "featured"],
      metadata: { gia_den: 0, gia_sua: 68000 }
    },
    // 6. Nước thanh nhiệt
    {
      name: "Hibiscus chanh dây hạt chia",
      slug: "hibiscus-chanh-day-hat-chia",
      short_description: "Vị chua thanh ngọt mát từ hoa bụp giấm và hạt chia.",
      description: "Sự hòa quyện tuyệt vời từ nước cốt Hibiscus đỏ thắm, chanh leo chua thanh và hạt chia bổ dưỡng.",
      price: 58000,
      stock_quantity: 130,
      category_id: getCatId('nuoc-thanh-nhiet'),
      status: 'active',
      is_featured: true,
      tags: ["refreshing", "hibiscus", "featured"],
      metadata: { gia_den: 0, gia_sua: 58000 }
    },
    // 7. Bánh ngọt
    {
      name: "Panna Cotta dâu tây",
      slug: "panna-cotta",
      short_description: "Bánh tráng miệng Ý ngọt mát mịn màng.",
      description: "Lớp panna cotta mịn béo kết hợp sốt dâu tây chua chua ngọt ngọt kích thích vị giác.",
      price: 35000,
      stock_quantity: 50,
      category_id: getCatId('banh'),
      status: 'active',
      is_featured: false,
      tags: ["cake", "dessert"],
      metadata: { gia_den: 0, gia_sua: 35000 }
    },
    // 8. Món Extra
    {
      name: "Thạch cà phê thêm",
      slug: "thach-ca-phe",
      short_description: "Thạch cà phê giòn dai ngon ngọt đậm vị.",
      description: "Thêm thạch cà phê nhà làm giòn dai sật sật thú vị cho ly nước của bạn.",
      price: 10000,
      stock_quantity: 500,
      category_id: getCatId('mon-extra'),
      status: 'active',
      is_featured: false,
      tags: ["extra", "topping"],
      metadata: { gia_den: 10000 }
    },
    // 9. Merchandise
    {
      name: "Cà phê Drip 1 - Culi Robusta",
      slug: "ca-phe-drip-1-culi-robusta",
      short_description: "Hộp 10 túi cà phê nhỏ giọt tiện lợi đậm hương vị Robusta.",
      description: "Cà phê phin giấy lọc nhỏ giọt tiện lợi dùng mọi nơi, mang hương vị Robusta đậm đà đặc sản Việt Nam.",
      price: 120000,
      stock_quantity: 80,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "drip-coffee"],
      metadata: { gia: 120000 }
    },
    {
      name: "Cà phê Sáng Tạo 8 - 500gr",
      slug: "ca-phe-sang-tao-8-500gr",
      short_description: "Hộp quà tặng cà phê Sáng tạo 8 tuyệt hảo thượng hạng.",
      description: "Dòng sản phẩm được mệnh danh là siêu phẩm cà phê sáng tạo của Trung Nguyên, mang hương thơm quyến rũ bậc nhất.",
      price: 520000,
      stock_quantity: 40,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "coffee-ground"],
      metadata: { gia: 520000 }
    },
    {
      name: "Phin nhôm hoa văn Trung Nguyên",
      slug: "phin-nhom-hoa-van-trung-nguyen",
      short_description: "Phin nhôm cao cấp in hoa văn Trống Đồng sắc sảo.",
      description: "Dụng cụ pha cà phê phin nhôm truyền thống được gia công tỉ mỉ với họa tiết Trống đồng đặc sắc lịch lãm.",
      price: 85000,
      stock_quantity: 150,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "accessories"],
      metadata: { gia: 85000 }
    },
    {
      name: "Sữa đặc có đường Brothers",
      slug: "sua-dac-co-duong-brothers",
      short_description: "Sữa đặc có đường Brothers thơm béo dẻo ngọt, chuyên dùng pha chế cà phê chuẩn vị.",
      description: "Sữa đặc có đường Brothers thơm béo dẻo ngọt, sự kết hợp hoàn hảo để tạo nên ly cà phê sữa đá truyền thống thơm ngon đậm đà.",
      price: 29000,
      stock_quantity: 100,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "milk"],
      metadata: { gia: 29000 }
    },
    {
      name: "Khăn rằn",
      slug: "khan-ran",
      short_description: "Khăn rằn truyền thống Trung Nguyên Legend, biểu tượng của tinh thần dấn thân.",
      description: "Khăn rằn truyền thống Trung Nguyên Legend mang thông điệp ý chí kiên cường, dấn thân và khát vọng phụng sự của thế hệ trẻ.",
      price: 65000,
      stock_quantity: 200,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "accessories"],
      metadata: { gia: 65000 }
    },
    {
      name: "Túi Vải Trung Nguyên Legend – Bộ Sưu Tập 3 Nền Văn Minh",
      slug: "tui-vai-trung-nguyen-legend-3-nen-van-minh",
      short_description: "Túi vải Canvas cao cấp thiết kế theo Bộ sưu tập 3 Nền Văn Minh Cà Phê tinh hoa.",
      description: "Túi vải Canvas cao cấp bền đẹp, in hình ảnh độc đáo đại diện cho 3 nền văn minh cà phê thế giới: Ottoman, Roman và Thiền.",
      price: 75000,
      stock_quantity: 100,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "accessories"],
      metadata: { gia: 75000 }
    },
    {
      name: "Sổ tay Legend",
      slug: "so-tay-legend",
      short_description: "Sổ tay ghi chép Legend cao cấp in logo và các câu nói truyền cảm hứng sáng tạo.",
      description: "Sổ tay ghi chép Legend cao cấp với chất giấy mịn chống lóa, bìa in logo Trung Nguyên Legend sắc nét cùng những câu trích dẫn tri thức truyền cảm hứng.",
      price: 125000,
      stock_quantity: 150,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "accessories"],
      metadata: { gia: 125000 }
    },
    {
      name: "Ly Sứ Legend VIP Đen Trung Nguyên Legend – 350 ml",
      slug: "ly-su-legend-vip-den",
      short_description: "Ly sứ cao cấp in logo và văn hóa tri thức Trung Nguyên Legend màu đen bóng.",
      description: "Ly sứ gốm cao cấp màu đen bóng in logo thương hiệu Trung Nguyên Legend sắc sảo, dùng để thưởng thức những ly cà phê năng lượng nóng nồng nàn.",
      price: 145000,
      stock_quantity: 80,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "cups"],
      metadata: { gia: 145000 }
    },
    {
      name: "Bộ Tách Sứ Đen Trung Nguyên Legend – 300ml",
      slug: "bo-tach-su-den-trung-nguyen-legend-300ml",
      short_description: "Bộ tách và đĩa sứ cao cấp màu đen Trung Nguyên Legend.",
      description: "Bộ tách và đĩa sứ gốm cao cấp màu đen Trung Nguyên Legend dung tích 300ml, thích hợp thưởng thức các món cà phê máy espresso, cappuccino hay latte ấm nồng.",
      price: 195000,
      stock_quantity: 60,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "cups"],
      metadata: { gia: 195000 }
    },
    {
      name: "Ly Giữ Nhiệt Trung Nguyên Legend VF214 – 350ml",
      slug: "ly-giu-nhiet-trung-nguyen-legend-vf214-350ml",
      short_description: "Ly giữ nhiệt inox cao cấp 350ml, màu đen nhám, nắp đậy khít chống tràn.",
      description: "Ly giữ nhiệt inox 304 cao cấp 350ml màu đen nhám in logo lịch lãm, nắp đậy khít chống tràn, giữ nhiệt lạnh và nóng cực kỳ tốt và tiện lợi đem đi lại.",
      price: 210000,
      stock_quantity: 80,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "thermos"],
      metadata: { gia: 210000 }
    },
    {
      name: "Bình Giữ Nhiệt Bao Da Trung Nguyên Legend – 350ml",
      slug: "binh-giu-nhiet-bao-da-trung-nguyen-legend-350ml",
      short_description: "Bình giữ nhiệt bọc bao da cao cấp 350ml, thiết kế sang trọng, lịch lãm.",
      description: "Bình giữ nhiệt chất liệu inox cao cấp bọc bao da in nổi họa tiết thương hiệu tinh xảo, thể hiện đẳng cấp lịch lãm của người dùng.",
      price: 290000,
      stock_quantity: 50,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "thermos"],
      metadata: { gia: 290000 }
    },
    {
      name: "Bình giữ nhiệt Trung Nguyên Legend – Màu Trắng",
      slug: "binh-giu-nhiet-trung-nguyen-legend-mau-trang",
      short_description: "Bình giữ nhiệt kim loại màu trắng sang trọng, logo in sắc sảo, giữ nhiệt cực tốt.",
      description: "Bình giữ nhiệt kim loại cao cấp màu trắng ngọc trai bóng, logo in sắc sảo thanh lịch, giữ nhiệt độ uống nóng lạnh vượt trội suốt cả ngày.",
      price: 350000,
      stock_quantity: 70,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "thermos"],
      metadata: { gia: 350000 }
    },
    {
      name: "Bình giữ nhiệt Trung Nguyên Legend (Màu Đen)",
      slug: "binh-giu-nhiet-trung-nguyen-legend-mau-den",
      short_description: "Bình giữ nhiệt kim loại màu đen lịch lãm, logo in sắc sảo, giữ nhiệt cực tốt.",
      description: "Bình giữ nhiệt kim loại cao cấp màu đen nhám huyền bí, logo in sắc sảo mạnh mẽ, giữ nhiệt độ uống nóng lạnh cực tốt.",
      price: 350000,
      stock_quantity: 80,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "thermos"],
      metadata: { gia: 350000 }
    },
    {
      name: "Bình giữ nhiệt Trung Nguyên Legend – Màu Xám",
      slug: "binh-giu-nhiet-trung-nguyen-legend-mau-xam",
      short_description: "Bình giữ nhiệt kim loại màu xám tinh tế, logo in sắc sảo, giữ nhiệt cực tốt.",
      description: "Bình giữ nhiệt kim loại cao cấp màu xám hiện đại thanh tao, logo in tinh tế, giữ nhiệt độ uống nóng lạnh vượt trội.",
      price: 350000,
      stock_quantity: 50,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "thermos"],
      metadata: { gia: 350000 }
    },
    {
      name: "Bình Giữ Nhiệt Trung Nguyên Legend Màu Trắng – 350ml (Yêu Thương)",
      slug: "binh-giu-nhiet-trung-nguyen-legend-mau-trang-350ml-yeu-thuong",
      short_description: "Bình giữ nhiệt kim loại màu trắng 350ml, in thông điệp Yêu Thương ấm áp.",
      description: "Bình giữ nhiệt kim loại màu trắng sữa, in thông điệp 'Yêu Thương' đầy triết lý và năng lượng tích cực từ Trung Nguyên Legend.",
      price: 350000,
      stock_quantity: 60,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "thermos"],
      metadata: { gia: 350000 }
    },
    {
      name: "Bình Giữ Nhiệt Trung Nguyên Legend Màu Xám – 350ml (Thiện Lành)",
      slug: "binh-giu-nhiet-trung-nguyen-legend-mau-xam-350ml-thien-lanh",
      short_description: "Bình giữ nhiệt kim loại màu xám 350ml, in thông điệp Thiện Lành thanh cao.",
      description: "Bình giữ nhiệt kim loại màu xám xi măng thời thượng, in thông điệp 'Thiện Lành' mộc mạc thanh cao đầy năng lượng tỉnh thức.",
      price: 350000,
      stock_quantity: 60,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "thermos"],
      metadata: { gia: 350000 }
    },
    {
      name: "Bình Giữ Nhiệt Trung Nguyên Legend Màu Đen – 350ml (Hạnh Phúc)",
      slug: "binh-giu-nhiet-trung-nguyen-legend-mau-den-350ml-hanh-phuc",
      short_description: "Bình giữ nhiệt kim loại màu đen 350ml, in thông điệp Hạnh Phúc đầy ý nghĩa.",
      description: "Bình giữ nhiệt kim loại màu đen tuyền huyền bí, in thông điệp 'Hạnh Phúc' sâu sắc và năng lượng tươi vui từ Trung Nguyên Legend.",
      price: 350000,
      stock_quantity: 60,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "thermos"],
      metadata: { gia: 350000 }
    },
    {
      name: "Bình giữ nhiệt – Thiền",
      slug: "binh-giu-nhiet-thien",
      short_description: "Bình giữ nhiệt phiên bản văn minh cà phê Thiền tĩnh lặng, mộc mạc.",
      description: "Bình giữ nhiệt gốm kim loại tinh xảo in họa tiết và triết lý văn minh cà phê Thiền - hướng về sự tĩnh lặng bên trong.",
      price: 350000,
      stock_quantity: 40,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "thermos"],
      metadata: { gia: 350000 }
    },
    {
      name: "Bình giữ nhiệt – Roman",
      slug: "binh-giu-nhiet-roman",
      short_description: "Bình giữ nhiệt phiên bản văn minh cà phê Roman tinh xảo.",
      description: "Bình giữ nhiệt kim loại tinh tế in họa tiết và triết lý văn minh cà phê Roman - hướng về sự tráng lệ, khoa học nghệ thuật.",
      price: 350000,
      stock_quantity: 40,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "thermos"],
      metadata: { gia: 350000 }
    },
    {
      name: "Bình giữ nhiệt – Ottoman",
      slug: "binh-giu-nhiet-ottoman",
      short_description: "Bình giữ nhiệt phiên bản văn minh cà phê Ottoman độc đáo.",
      description: "Bình giữ nhiệt kim loại tinh xảo in họa tiết và triết lý văn minh cà phê Ottoman - hướng về khía cạnh tâm linh, huyền bí phương Đông.",
      price: 350000,
      stock_quantity: 40,
      category_id: getCatId('merchandise'),
      status: 'active',
      is_featured: false,
      tags: ["merch", "thermos"],
      metadata: { gia: 350000 }
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

  // 4. Insert Product Images matching the image maps
  console.log("📸 Inserting coffee product images...");
  const imagesData = [];
  const imageMap = {
    "coffee-legend": "https://down-zl-vn.img.susercontent.com/vn-11134517-81ztc-mlqbdkof589445",
    "nang-luong-tu-duy": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/ca-phe-nang-luong-den-da-300x300.png",
    "success-sua-da": "https://down-zl-vn.img.susercontent.com/vn-11134517-7r98o-lxwdkt4em8k951A",
    "cappuccino-yen-mach": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/02/Cappuccino-Picasso-Latte-Yen-Mach-Nong-TGCP-copy-300x300.png",
    "ca-phe-dua": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/ca-phe-dua-300x300.png",
    "ca-phe-muoi-legend": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/02/Ca-Phe-Muoi-Legend-TGCP-copy-300x300.png",
    "ca-phe-trung": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/ca-phe-trung-300x300.png",
    "tra-la-nep-sen-vang": "https://trungnguyenlegendcafe.net/wp-content/uploads/2023/10/tra-la-nep-sen-vang-300x300.png",
    "tra-dao-cam-sa": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/30.-Tra-Dao-Cam-Sa-400x400.png",
    "matcha-yen-mach": "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/12/Untitled-9-12-300x300.png",
    "hibiscus-chanh-day-hat-chia": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/33.-Hibiscus-Chanh-Day-_-No-400x400.png",
    "panna-cotta": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/12/52.-Panna-Cotta-Dau-Tay-_-No.png",
    "thach-ca-phe": "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/386999900_715169523974576_5274279206438518417_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&oh=00_Af4WEefOxxcq4DJ4BdOlAYlrg0kJCO-bUf8wqaiQltdI1w&oe=6A137C4B",
    "ca-phe-drip-1-culi-robusta": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/08/Culi-Robusta.png",
    "ca-phe-sang-tao-8-500gr": "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/ST-8-500gr-LE.png",
    "phin-nhom-hoa-van-trung-nguyen": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/11/logo-trung-nguyen-legend.png",
    "sua-dac-co-duong-brothers": "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/Sua-dac-EC-2.png",
    "khan-ran": "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/khan-LE.png",
    "tui-vai-trung-nguyen-legend-3-nen-van-minh": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/10/TNL_TUI-CANVAS-ROMAN-600x600.png",
    "so-tay-legend": "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/So-tay-LE.png",
    "ly-su-legend-vip-den": "https://cafe.net.vn/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/6/0/6003796.jpg",
    "bo-tach-su-den-trung-nguyen-legend-300ml": "https://down-cvs-vn.img.susercontent.com/vn-11134517-7ras8-md45myo8th0cdd",
    "ly-giu-nhiet-trung-nguyen-legend-vf214-350ml": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/09/Ly-Giu-Nhiet-VF214-%E2%80%93-350ml-mau-den-2.png",
    "binh-giu-nhiet-bao-da-trung-nguyen-legend-350ml": "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/BGN-bao-da-LE.png",
    "binh-giu-nhiet-trung-nguyen-legend-mau-trang": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/11/Binh-giu-nhiet_WhiteCan-600x600.jpg",
    "binh-giu-nhiet-trung-nguyen-legend-mau-den": "https://trungnguyenlegendcafe.net/wp-content/uploads/2020/08/100758914_2825508094213680_4039200829587062784_n.jpg",
    "binh-giu-nhiet-trung-nguyen-legend-mau-xam": "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/11/Gray-600x600.jpg",
    "binh-giu-nhiet-trung-nguyen-legend-mau-trang-350ml-yeu-thuong": "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/TNL_BGN-yeu-thuong.png",
    "binh-giu-nhiet-trung-nguyen-legend-mau-xam-350ml-thien-lanh": "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/TNL_BGN-thien-lanh.png",
    "binh-giu-nhiet-trung-nguyen-legend-mau-den-350ml-hanh-phuc": "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/TNL_BGN-hanh-phuc.png",
    "binh-giu-nhiet-thien": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-thien.png",
    "binh-giu-nhiet-roman": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-roman.png",
    "binh-giu-nhiet-ottoman": "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-Ottoman-1.png"
  };

  for (const product of products) {
    const url = imageMap[product.slug] || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80";
    imagesData.push({
      product_id: product.id,
      url: url,
      alt_text: product.name,
      sort_order: 0,
      is_primary: true
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
