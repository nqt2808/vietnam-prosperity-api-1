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

async function inspectTable(tableName) {
  console.log(`\n🔍 Inspecting table: "${tableName}"`);
  
  // Thử select 1 dòng để xem cấu trúc và keys
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1);

  if (error) {
    console.log(`❌ Error inspecting ${tableName}:`, error.message);
    return false;
  }

  console.log(`✅ Table "${tableName}" exists!`);
  if (data && data.length > 0) {
    console.log("   Columns (Keys):", Object.keys(data[0]));
    console.log("   Sample row:", data[0]);
  } else {
    console.log("   Table exists but is EMPTY (0 rows).");
    
    // Thử truy vấn RPC hoặc lấy metadata nếu trống, hoặc cố gắng lấy structure
    // Một mẹo nhỏ là chèn thử dữ liệu lỗi hoặc xem thông tin qua system tables nếu cần, 
    // nhưng thường ta có thể chèn một dòng rỗng để lấy lỗi schema, hoặc tạm thời ghi nhận là trống.
  }
  return true;
}

async function run() {
  console.log("=== INSPECTING VPC TARGET DATABASE SCHEMA ===");
  
  const tables = [
    'danh_muc_san_pham',
    'san_pham_do_uong',
    'san_pham_merchandise',
    'san_pham_merchandises',
    'san_pham_vat_pham',
    'don_hang',
    'don_hang_chi_tiet',
    'thong_tin_khach_hang'
  ];

  for (const t of tables) {
    await inspectTable(t);
  }
}

run();
