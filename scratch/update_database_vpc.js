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
  console.error("❌ Missing Supabase credentials in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("⚡ Starting Supabase updates...");

  // 1. UPDATE danh_muc_san_pham names and slugs
  console.log("📂 Updating danh_muc_san_pham...");

  // - Matcha + Cacao (slug: matcha-cacao) -> Matcha và Cacao
  const { error: errMatcha } = await supabase
    .from('danh_muc_san_pham')
    .update({ ten_danh_muc: "Matcha và Cacao" })
    .eq('slug', 'matcha-cacao');
  if (errMatcha) console.error("❌ Error updating Matcha: ", errMatcha.message);

  // - Sinh tố + Đá xay (slug: sinh-to-da-xay) -> Sinh tố và Đá xay
  const { error: errSinhTo } = await supabase
    .from('danh_muc_san_pham')
    .update({ ten_danh_muc: "Sinh tố và Đá xay" })
    .eq('slug', 'sinh-to-da-xay');
  if (errSinhTo) console.error("❌ Error updating Sinh to: ", errSinhTo.message);

  // - Trà + Trà sữa (slug: tra-tra-sua) -> Trà và Trà sữa
  const { error: errTra } = await supabase
    .from('danh_muc_san_pham')
    .update({ ten_danh_muc: "Trà và Trà sữa" })
    .eq('slug', 'tra-tra-sua');
  if (errTra) console.error("❌ Error updating Tra: ", errTra.message);

  // - Cà phê bột / Sáng tạo (ID: 21) -> Cà phê phin
  const { error: errPhin } = await supabase
    .from('danh_muc_san_pham')
    .update({ ten_danh_muc: "Cà phê phin" })
    .eq('id', 21);
  if (errPhin) console.error("❌ Error updating Ca phe phin: ", errPhin.message);

  // - Gộp nhóm Phụ kiện thương hiệu (ID: 18) và Bộ quà tặng (ID: 17) thành " Vật phẩm"
  // Rename ID 17 to " Vật phẩm", slug "vat-pham"
  const { error: errRenVatPham } = await supabase
    .from('danh_muc_san_pham')
    .update({ ten_danh_muc: " Vật phẩm", slug: "vat-pham" })
    .eq('id', 17);
  if (errRenVatPham) console.error("❌ Error renaming to Vật phẩm: ", errRenVatPham.message);

  // Update products with danh_muc_id = 18 to 17
  const { error: errMoveMerch } = await supabase
    .from('san_pham_merchandise')
    .update({ danh_muc_id: 17 })
    .eq('danh_muc_id', 18);
  if (errMoveMerch) console.error("❌ Error moving merchandise: ", errMoveMerch.message);

  // Delete danh_muc_id = 18
  const { error: errDelCat } = await supabase
    .from('danh_muc_san_pham')
    .delete()
    .eq('id', 18);
  if (errDelCat) console.error("❌ Error deleting Phụ kiện thương hiệu category: ", errDelCat.message);


  // 2. UPDATE san_pham_do_uong
  console.log("🍰 Updating san_pham_do_uong names and descriptions...");

  const bakeryNames = {
    "banh-mousse-chanh-day": "Bánh Mousse Chanh dây",
    "banh-mousse-red-velvet": "Bánh Mousse Red velvet",
    "banh-mousse-dau": "Bánh Mousse Dâu",
    "banh-mousse-socola": "Bánh Mousse Chocolate",
    "banh-croissant-khong-nhan": "Bánh Croissant không nhân",
    "banh-croissant-hanh-nhan": "Bánh Croissant Hạnh nhân",
    "banh-tiramisu": "Bánh Tiramisu"
  };

  for (const [slug, newName] of Object.entries(bakeryNames)) {
    const { error } = await supabase
      .from('san_pham_do_uong')
      .update({ ten_san_pham: newName })
      .eq('slug', slug);
    if (error) console.error(`❌ Error updating bakery name for ${slug}:`, error.message);
  }

  const drinkDescriptions = {
    "cacao-sua": "Cacao nguyên chất đắng thơm nồng nàn quyện hòa sữa béo ngậy ngọt ngào, tạo nên ly cacao đậm đà nồng ấm quyến rũ lòng người.",
    "nuoc-chanh-muoi-mat-ong": "Chanh muối ủ ấm áp hòa cùng mật ong rừng ngọt thanh tự nhiên, giúp làm dịu cổ họng, bù muối khoáng và thanh lọc nhẹ nhàng. Khách hàng có thể lựa chọn uống nóng hoặc uống lạnh ạ.",
    "dua-hau": "Dưa hấu đỏ mọng ép lạnh ngọt lịm mát lành, là thức uống tuyệt vời cho mùa Hè. Luôn là lựa chọn hàng đầu của mùa Hè nóng bức.",
    "nuoc-thom-ep": "Những trái Thơm chín vàng được ép nguyên chất mang vị ngọt thanh sắc nét, hương thơm nhiệt đới nồng nàn cuốn hút khó lòng chối từ.",
    "cam-vat": "Những trái cam sành tươi mọng nước được vắt nguyên chất ngọt lành, dồi dào đề kháng tự nhiên mang lại sự tươi trẻ, khỏe mạnh cho cơ thể.",
    "tra-sua-legend": "Trà sữa thượng hạng chuẩn công thức Legend, thơm nồng đậm đà vị trà đen và béo ngậy dòng sữa đặc đặc trưng, ngọt ngào khó cưỡng. Sử dụng cùng với topping trân châu trắng giòn giòn và thạch mền mềm.",
    "tra-la-nep-sen-vang": "Vị chát thanh thoát, nhẹ nhàng của trà kết hợp với hương lá nếp thơm mát dịu, hạt sen bùi béo bổ dưỡng và củ năng giòn mát vui miệng.",
    "tra-vai-hoa-hong": "Hồng trà thanh nhã quyện cùng mứt vải hoa hồng mang đến hương hoa hồng kiều diễm nồng nàn và những trái vải mọng nước ngọt lịm, mang lại cảm giác lãng mạn nhẹ nhàng.",
    "ca-phe-muoi-legend": "Hương vị độc bản kết hợp giữa lớp kem muối đánh mịn màng có vị mặn nhẹ dịu và cà phê Chế phin 1 đắng mượt, kích hoạt vị giác bùng nổ hậu vị béo ngọt umami."
  };

  for (const [slug, newDesc] of Object.entries(drinkDescriptions)) {
    const { error } = await supabase
      .from('san_pham_do_uong')
      .update({ mo_ta: newDesc })
      .eq('slug', slug);
    if (error) console.error(`❌ Error updating description for drink ${slug}:`, error.message);
  }


  // 3. UPDATE san_pham_merchandise
  console.log("🎁 Updating san_pham_merchandise...");

  // - CF chất tiên phong -> Cà phê chất tiên phong, danh_muc_id = 21
  const { error: errPioneer } = await supabase
    .from('san_pham_merchandise')
    .update({ ten_san_pham: "Cà phê chất tiên phong", danh_muc_id: 21 })
    .eq('slug', 'cf-chat-tien-phong');
  if (errPioneer) console.error("❌ Error updating pioneer coffee: ", errPioneer.message);

  // - CF hòa tan sấy lạnh -> Cà phê hòa tan sấy lạnh, danh_muc_id = 13
  const { error: errFreeze } = await supabase
    .from('san_pham_merchandise')
    .update({ ten_san_pham: "Cà phê hòa tan sấy lạnh", danh_muc_id: 13 })
    .eq('slug', 'cf-hoa-tan-say-lanh');
  if (errFreeze) console.error("❌ Error updating freeze dried coffee: ", errFreeze.message);

  // - Sữa đặc Brothers -> danh_muc_id = 25 (Dụng cụ pha chế)
  const { error: errSuaBrothers } = await supabase
    .from('san_pham_merchandise')
    .update({ danh_muc_id: 25 })
    .eq('slug', 'sua-dac-co-duong-brothers');
  if (errSuaBrothers) console.error("❌ Error updating Brothers milk category: ", errSuaBrothers.message);

  // - Bộ Hemingway -> danh_muc_id = 17 (Bộ quà tặng - nay là " Vật phẩm")
  const { error: errHemi } = await supabase
    .from('san_pham_merchandise')
    .update({ danh_muc_id: 17 })
    .eq('slug', 'bo-the-spirit-of-philosophy-hemingway');
  if (errHemi) console.error("❌ Error updating Hemingway category: ", errHemi.message);

  // - Delete Ly The Spirit Of Philosophy if exists
  const { error: errDelLy } = await supabase
    .from('san_pham_merchandise')
    .delete()
    .eq('slug', 'ly-the-spirit-of-philosophy');
  if (errDelLy) console.error("❌ Error deleting Ly The Spirit Of Philosophy: ", errDelLy.message);

  console.log("🎉 DATABASE UPDATES COMPLETED SUCCESSFULLY!");
}

run();
