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
  console.error("Missing Supabase URL or Service Role Key!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("⚡ Inserting 'item test' into 'san_pham_do_uong'...");

  // Tạo đối tượng món nước test
  const testDrink = {
    danh_muc_id: 1, // Thuộc danh mục Cà phê phin
    ten_san_pham: 'item test',
    slug: 'item-test',
    mo_ta: 'Đây là sản phẩm nước uống thử nghiệm đặc biệt của VPC với giá siêu ưu đãi phục vụ cho việc kiểm thử hệ thống.',
    gia_den: 1000,
    gia_sua: 0,
    la_mon_noi_bat: true,
    thu_tu_hien_thi: 99,
    hien_thi: true
  };

  // Thử chèn vào bảng san_pham_do_uong
  const { data, error } = await supabase
    .from('san_pham_do_uong')
    .insert(testDrink)
    .select();

  if (error) {
    console.error("❌ Error inserting test drink:", error.message);
  } else {
    console.log("🎉 Successfully inserted test drink!");
    console.log("Inserted row:", data[0]);
  }
}

run();
