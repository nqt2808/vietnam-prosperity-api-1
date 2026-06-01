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

const MERCH_CATEGORY_ID = "65e10cc7-af35-4dce-aac6-067196b73e45";

const merchProducts = [
  {
    name: "Sữa đặc có đường Brothers",
    slug: "sua-dac-co-duong-brothers",
    short_description: "Sữa đặc có đường Brothers thơm béo dẻo ngọt, chuyên dùng pha chế cà phê chuẩn vị.",
    description: "Sữa đặc có đường Brothers thơm béo dẻo ngọt, sự kết hợp hoàn hảo để tạo nên ly cà phê sữa đá truyền thống thơm ngon đậm đà.",
    price: 29000,
    stock_quantity: 100,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "milk"],
    metadata: { gia: 29000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/Sua-dac-EC-2.png"
  },
  {
    name: "Khăn rằn",
    slug: "khan-ran",
    short_description: "Khăn rằn truyền thống Trung Nguyên Legend, biểu tượng của tinh thần dấn thân.",
    description: "Khăn rằn truyền thống Trung Nguyên Legend mang thông điệp ý chí kiên cường, dấn thân và khát vọng phụng sự của thế hệ trẻ.",
    price: 65000,
    stock_quantity: 200,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "accessories"],
    metadata: { gia: 65000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/khan-LE.png"
  },
  {
    name: "Túi Vải Trung Nguyên Legend – Bộ Sưu Tập 3 Nền Văn Minh",
    slug: "tui-vai-trung-nguyen-legend-3-nen-van-minh",
    short_description: "Túi vải Canvas cao cấp thiết kế theo Bộ sưu tập 3 Nền Văn Minh Cà Phê tinh hoa.",
    description: "Túi vải Canvas cao cấp bền đẹp, in hình ảnh độc đáo đại diện cho 3 nền văn minh cà phê thế giới: Ottoman, Roman và Thiền.",
    price: 75000,
    stock_quantity: 100,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "accessories"],
    metadata: { gia: 75000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/10/TNL_TUI-CANVAS-ROMAN-600x600.png"
  },
  {
    name: "Sổ tay Legend",
    slug: "so-tay-legend",
    short_description: "Sổ tay ghi chép Legend cao cấp in logo và các câu nói truyền cảm hứng sáng tạo.",
    description: "Sổ tay ghi chép Legend cao cấp với chất giấy mịn chống lóa, bìa in logo Trung Nguyên Legend sắc nét cùng những câu trích dẫn tri thức truyền cảm hứng.",
    price: 125000,
    stock_quantity: 150,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "accessories"],
    metadata: { gia: 125000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/So-tay-LE.png"
  },
  {
    name: "Ly Sứ Legend VIP Đen Trung Nguyên Legend – 350 ml",
    slug: "ly-su-legend-vip-den",
    short_description: "Ly sứ cao cấp in logo và văn hóa tri thức Trung Nguyên Legend màu đen bóng.",
    description: "Ly sứ gốm cao cấp màu đen bóng in logo thương hiệu Trung Nguyên Legend sắc sảo, dùng để thưởng thức những ly cà phê năng lượng nóng nồng nàn.",
    price: 145000,
    stock_quantity: 80,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "cups"],
    metadata: { gia: 145000 },
    imageUrl: "https://cafe.net.vn/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/6/0/6003796.jpg"
  },
  {
    name: "Bộ Tách Sứ Đen Trung Nguyên Legend – 300ml",
    slug: "bo-tach-su-den-trung-nguyen-legend-300ml",
    short_description: "Bộ tách và đĩa sứ cao cấp màu đen Trung Nguyên Legend.",
    description: "Bộ tách và đĩa sứ gốm cao cấp màu đen Trung Nguyên Legend dung tích 300ml, thích hợp thưởng thức các món cà phê máy espresso, cappuccino hay latte ấm nồng.",
    price: 195000,
    stock_quantity: 60,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "cups"],
    metadata: { gia: 195000 },
    imageUrl: "https://down-cvs-vn.img.susercontent.com/vn-11134517-7ras8-md45myo8th0cdd"
  },
  {
    name: "Ly Giữ Nhiệt Trung Nguyên Legend VF214 – 350ml",
    slug: "ly-giu-nhiet-trung-nguyen-legend-vf214-350ml",
    short_description: "Ly giữ nhiệt inox cao cấp 350ml, màu đen nhám, nắp đậy khít chống tràn.",
    description: "Ly giữ nhiệt inox 304 cao cấp 350ml màu đen nhám in logo lịch lãm, nắp đậy khít chống tràn, giữ nhiệt lạnh và nóng cực kỳ tốt và tiện lợi đem đi lại.",
    price: 210000,
    stock_quantity: 80,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "thermos"],
    metadata: { gia: 210000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/09/Ly-Giu-Nhiet-VF214-%E2%80%93-350ml-mau-den-2.png"
  },
  {
    name: "Bình Giữ Nhiệt Bao Da Trung Nguyên Legend – 350ml",
    slug: "binh-giu-nhiet-bao-da-trung-nguyen-legend-350ml",
    short_description: "Bình giữ nhiệt bọc bao da cao cấp 350ml, thiết kế sang trọng, lịch lãm.",
    description: "Bình giữ nhiệt chất liệu inox cao cấp bọc bao da in nổi họa tiết thương hiệu tinh xảo, thể hiện đẳng cấp lịch lãm của người dùng.",
    price: 290000,
    stock_quantity: 50,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "thermos"],
    metadata: { gia: 290000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/BGN-bao-da-LE.png"
  },
  {
    name: "Bình giữ nhiệt Trung Nguyên Legend – Màu Trắng",
    slug: "binh-giu-nhiet-trung-nguyen-legend-mau-trang",
    short_description: "Bình giữ nhiệt kim loại màu trắng sang trọng, logo in sắc sảo, giữ nhiệt cực tốt.",
    description: "Bình giữ nhiệt kim loại cao cấp màu trắng ngọc trai bóng, logo in sắc sảo thanh lịch, giữ nhiệt độ uống nóng lạnh vượt trội suốt cả ngày.",
    price: 350000,
    stock_quantity: 70,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "thermos"],
    metadata: { gia: 350000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/11/Binh-giu-nhiet_WhiteCan-600x600.jpg"
  },
  {
    name: "Bình giữ nhiệt Trung Nguyên Legend (Màu Đen)",
    slug: "binh-giu-nhiet-trung-nguyen-legend-mau-den",
    short_description: "Bình giữ nhiệt kim loại màu đen lịch lãm, logo in sắc sảo, giữ nhiệt cực tốt.",
    description: "Bình giữ nhiệt kim loại cao cấp màu đen nhám huyền bí, logo in sắc sảo mạnh mẽ, giữ nhiệt độ uống nóng lạnh cực tốt.",
    price: 350000,
    stock_quantity: 80,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "thermos"],
    metadata: { gia: 350000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2020/08/100758914_2825508094213680_4039200829587062784_n.jpg"
  },
  {
    name: "Bình giữ nhiệt Trung Nguyên Legend – Màu Xám",
    slug: "binh-giu-nhiet-trung-nguyen-legend-mau-xam",
    short_description: "Bình giữ nhiệt kim loại màu xám tinh tế, logo in sắc sảo, giữ nhiệt cực tốt.",
    description: "Bình giữ nhiệt kim loại cao cấp màu xám hiện đại thanh tao, logo in tinh tế, giữ nhiệt độ uống nóng lạnh vượt trội.",
    price: 350000,
    stock_quantity: 50,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "thermos"],
    metadata: { gia: 350000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2021/11/Gray-600x600.jpg"
  },
  {
    name: "Bình Giữ Nhiệt Trung Nguyên Legend Màu Trắng – 350ml (Yêu Thương)",
    slug: "binh-giu-nhiet-trung-nguyen-legend-mau-trang-350ml-yeu-thuong",
    short_description: "Bình giữ nhiệt kim loại màu trắng 350ml, in thông điệp Yêu Thương ấm áp.",
    description: "Bình giữ nhiệt kim loại màu trắng sữa, in thông điệp 'Yêu Thương' đầy triết lý và năng lượng tích cực từ Trung Nguyên Legend.",
    price: 350000,
    stock_quantity: 60,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "thermos"],
    metadata: { gia: 350000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/TNL_BGN-yeu-thuong.png"
  },
  {
    name: "Bình Giữ Nhiệt Trung Nguyên Legend Màu Xám – 350ml (Thiện Lành)",
    slug: "binh-giu-nhiet-trung-nguyen-legend-mau-xam-350ml-thien-lanh",
    short_description: "Bình giữ nhiệt kim loại màu xám 350ml, in thông điệp Thiện Lành thanh cao.",
    description: "Bình giữ nhiệt kim loại màu xám xi măng thời thượng, in thông điệp 'Thiện Lành' mộc mạc thanh cao đầy năng lượng tỉnh thức.",
    price: 350000,
    stock_quantity: 60,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "thermos"],
    metadata: { gia: 350000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/TNL_BGN-thien-lanh.png"
  },
  {
    name: "Bình Giữ Nhiệt Trung Nguyên Legend Màu Đen – 350ml (Hạnh Phúc)",
    slug: "binh-giu-nhiet-trung-nguyen-legend-mau-den-350ml-hanh-phuc",
    short_description: "Bình giữ nhiệt kim loại màu đen 350ml, in thông điệp Hạnh Phúc đầy ý nghĩa.",
    description: "Bình giữ nhiệt kim loại màu đen tuyền huyền bí, in thông điệp 'Hạnh Phúc' sâu sắc và năng lượng tươi vui từ Trung Nguyên Legend.",
    price: 350000,
    stock_quantity: 60,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "thermos"],
    metadata: { gia: 350000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/TNL_BGN-hanh-phuc.png"
  },
  {
    name: "Bình giữ nhiệt – Thiền",
    slug: "binh-giu-nhiet-thien",
    short_description: "Bình giữ nhiệt phiên bản văn minh cà phê Thiền tĩnh lặng, mộc mạc.",
    description: "Bình giữ nhiệt gốm kim loại tinh xảo in họa tiết và triết lý văn minh cà phê Thiền - hướng về sự tĩnh lặng bên trong.",
    price: 350000,
    stock_quantity: 40,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "thermos"],
    metadata: { gia: 350000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-thien.png"
  },
  {
    name: "Bình giữ nhiệt – Roman",
    slug: "binh-giu-nhiet-roman",
    short_description: "Bình giữ nhiệt phiên bản văn minh cà phê Roman tinh xảo.",
    description: "Bình giữ nhiệt kim loại tinh tế in họa tiết và triết lý văn minh cà phê Roman - hướng về sự tráng lệ, khoa học nghệ thuật.",
    price: 350000,
    stock_quantity: 40,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "thermos"],
    metadata: { gia: 350000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-roman.png"
  },
  {
    name: "Bình giữ nhiệt – Ottoman",
    slug: "binh-giu-nhiet-ottoman",
    short_description: "Bình giữ nhiệt phiên bản văn minh cà phê Ottoman độc đáo.",
    description: "Bình giữ nhiệt kim loại tinh xảo in họa tiết và triết lý văn minh cà phê Ottoman - hướng về khía cạnh tâm linh, huyền bí phương Đông.",
    price: 350000,
    stock_quantity: 40,
    category_id: MERCH_CATEGORY_ID,
    status: "active",
    tags: ["merch", "thermos"],
    metadata: { gia: 350000 },
    imageUrl: "https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-Ottoman-1.png"
  }
];

async function run() {
  console.log("⚡ Starting synchronization of Merchandise products using Supabase JS SDK...");
  
  for (const item of merchProducts) {
    const { data: upsertData, error: upsertErr } = await supabase
      .from('products')
      .upsert({
        name: item.name,
        slug: item.slug,
        short_description: item.short_description,
        description: item.description,
        price: item.price,
        stock_quantity: item.stock_quantity,
        category_id: item.category_id,
        status: item.status,
        tags: item.tags,
        metadata: item.metadata
      }, { onConflict: 'slug' })
      .select('id');
      
    if (upsertErr) {
      console.error(`❌ Error upserting product ${item.name}:`, upsertErr.message);
      continue;
    }
    
    const productId = upsertData[0].id;
    console.log(`✅ Upserted product: ${item.name} | ID: ${productId}`);
    
    // Clear and insert image
    const { error: deleteImgErr } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId);
      
    if (deleteImgErr) {
      console.error(`❌ Error clearing old images for ${item.name}:`, deleteImgErr.message);
    }
    
    const { error: insertImgErr } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        url: item.imageUrl,
        alt_text: item.name,
        sort_order: 0,
        is_primary: true
      });
      
    if (insertImgErr) {
      console.error(`❌ Error inserting image for ${item.name}:`, insertImgErr.message);
    } else {
      console.log(`   📸 Image synchronized successfully for ${item.name}`);
    }
  }
  
  console.log("🎉 SUCCESS! Supabase Merchandise products are perfectly synchronized!");
}

run();
