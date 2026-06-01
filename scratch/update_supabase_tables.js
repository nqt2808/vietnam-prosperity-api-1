const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read env
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

async function run() {
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing keys in .env.local!");
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log("⚡ Starting Supabase updates (san_pham_do_uong & san_pham_merchandise only)...");

  // 1. UPDATE san_pham_do_uong names
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
    console.log(`🍰 Updating name for ${slug} -> "${newName}"...`);
    const { error } = await supabase
      .from('san_pham_do_uong')
      .update({ ten_san_pham: newName })
      .eq('slug', slug);
    if (error) console.error(`❌ Error updating ${slug}:`, error.message);
  }

  // 2. UPDATE san_pham_do_uong descriptions
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
    console.log(`🍹 Updating description for drink ${slug}...`);
    const { error } = await supabase
      .from('san_pham_do_uong')
      .update({ mo_ta: newDesc })
      .eq('slug', slug);
    if (error) console.error(`❌ Error updating description for ${slug}:`, error.message);
  }

  // 3. UPDATE san_pham_merchandise names, descriptions and categories
  
  // - Sữa đặc Brothers: danh_muc_id = 25 (Dụng cụ pha chế)
  console.log("🥛 Updating Sữa đặc Brothers category...");
  const { error: errBrothers } = await supabase
    .from('san_pham_merchandise')
    .update({ danh_muc_id: 25 })
    .eq('slug', 'sua-dac-co-duong-brothers');
  if (errBrothers) console.error("❌ Error updating Sữa đặc Brothers:", errBrothers.message);

  // - CF chất tiên phong: name -> Cà phê chất tiên phong, danh_muc_id = 21 (Cà phê bột / Sáng tạo)
  console.log("☕ Updating Cà phê chất tiên phong...");
  const { error: errPioneer } = await supabase
    .from('san_pham_merchandise')
    .update({ ten_san_pham: "Cà phê chất tiên phong", danh_muc_id: 21 })
    .eq('slug', 'cf-chat-tien-phong');
  if (errPioneer) console.error("❌ Error updating CF chất tiên phong:", errPioneer.message);

  // - CF hòa tan sấy lạnh: name -> Cà phê hòa tan sấy lạnh, danh_muc_id = 22 (Cà phê hòa tan G7)
  console.log("☕ Updating Cà phê hòa tan sấy lạnh...");
  const { error: errFreeze } = await supabase
    .from('san_pham_merchandise')
    .update({ ten_san_pham: "Cà phê hòa tan sấy lạnh", danh_muc_id: 22 })
    .eq('slug', 'cf-hoa-tan-say-lanh');
  if (errFreeze) console.error("❌ Error updating CF hòa tan sấy lạnh:", errFreeze.message);

  // - Bộ The Spirit Of Philosophy Hemingway: danh_muc_id = 17 (Bộ quà tặng)
  console.log("🎁 Updating Bộ The Spirit Of Philosophy Hemingway category...");
  const { error: errHemi } = await supabase
    .from('san_pham_merchandise')
    .update({ danh_muc_id: 17 })
    .eq('slug', 'bo-the-spirit-of-philosophy-hemingway');
  if (errHemi) console.error("❌ Error updating Bộ Hemingway:", errHemi.message);

  // - Delete ly-the-spirit-of-philosophy
  console.log("🗑️ Deleting Ly The Spirit Of Philosophy...");
  const { error: errDelLy } = await supabase
    .from('san_pham_merchandise')
    .delete()
    .eq('slug', 'ly-the-spirit-of-philosophy');
  if (errDelLy) console.error("❌ Error deleting Ly The Spirit:", errDelLy.message);

  console.log("🎉 SUPABASE UPDATES SUCCESSFUL!");
}

run();
